// ESP32-CAM True Multi-Hop and Forwarding Controller
//
// This firmware enables a chain of ESP32-CAMs to relay images.
// It uses WIFI_AP_STA mode for intermediate nodes.
//
// --- THREE OPERATING MODES ---
// 1. Start-Node (Client): The first device in the chain. It only connects
//    to the next hop. It periodically captures and sends its own picture.
//
// 2. Hop-Node (AP+Client): An intermediate node. It creates a WiFi Access Point
//    for the PREVIOUS node to connect to, while also connecting as a client
//    to the NEXT node in the chain. It forwards any data it receives AND
//    periodically captures and sends its own picture.
//
// 3. End-Node (Server): The last device in the chain. It creates an
//    Access Point for the final Hop-Node to connect to. It receives all
//    data and sends it to the final web service destination AND periodically
//    captures and sends its own picture to the destination.
//
// HOW TO USE:
// 1. Flash this code to your ESP32-CAM board.
// 2. After flashing, it creates a WiFi network "ESP32-CAM-Setup". Connect to it.
// 3. Open a browser to http://192.168.4.1/setup
// 4. Select the node's role (Start, Hop, or End) and fill in the required details.
// 5. After saving, the device will restart and run automatically.

#include "esp_camera.h"
#include "WebServer.h"
#include "WiFi.h"
#include "Preferences.h"
#include "HTTPClient.h"

// IMPORTANT: Select the correct camera model
// #ifndef CAMERA_MODEL_AI_THINKER
// #define CAMERA_MODEL_AI_THINKER
// #endif

// #if defined(CAMERA_MODEL_AI_THINKER)
//   #define PWDN_GPIO_NUM     32
//   #define RESET_GPIO_NUM    -1
//   #define XCLK_GPIO_NUM      0
//   #define SIOD_GPIO_NUM     26
//   #define SIOC_GPIO_NUM     27
//   #define Y9_GPIO_NUM       35
//   #define Y8_GPIO_NUM       34
//   #define Y7_GPIO_NUM       39
//   #define Y6_GPIO_NUM       36
//   #define Y5_GPIO_NUM       21
//   #define Y4_GPIO_NUM       19
//   #define Y3_GPIO_NUM       18
//   #define Y2_GPIO_NUM        5
//   #define VSYNC_GPIO_NUM    25
//   #define HREF_GPIO_NUM     23
//   #define PCLK_GPIO_NUM     22
// #else
//   #error "Camera model not selected"
// #endif

#define CAMERA_MODEL_AI_THINKER  // Has PSRAM
#include "camera_pins.h"

WebServer server(80);
Preferences preferences;

// Global variables for periodic tasks
unsigned long lastActionTime = 0;
unsigned long actionInterval = 60000;
String currentMode = "";

// --- Function Prototypes ---
void startCameraServer();
void handleNotFound();
void handleSetupPage();
void handleSaveConfig();
void handleHopReceive();
void startStartNode();
void startHopNode();
void startEndNode();
void startSetupMode();
void sendImageToFinalDestination(camera_fb_t *fb, String domain, String userToken, String deviceToken, String appCategory);
void performPeriodicCapture();
unsigned long calculateIntervalMillis();

// --- HTML for the Setup Page ---
const char* setup_html = R"rawliteral(
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ESP32-CAM Multi-Hop Setup</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f9; color: #333; margin: 0; padding: 20px; display: flex; justify-content: center; }
        .container { background-color: #fff; padding: 20px 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 600px; width: 100%; }
        h1, h2 { color: #4a4a4a; text-align: center; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; color: #555; }
        input[type="text"], input[type="password"], input[type="number"], select { width: calc(100% - 22px); padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
        .radio-group label { display: inline-block; margin-right: 20px; font-weight: normal; }
        .btn { background-color: #007bff; color: white; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer; width: 100%; font-size: 16px; margin-top: 10px; }
        .btn:hover { background-color: #0056b3; }
        .hidden { display: none; }
        .section { border: 1px solid #eee; padding: 15px; border-radius: 8px; margin-top: 20px; background-color: #fafafa; }
        .section h3 { margin-top: 0; color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 5px;}
        .time-group { display: flex; align-items: center; gap: 10px; }
        .time-group input { flex-grow: 1; }
        .time-group select { flex-grow: 2; }
        .description { font-size: 0.9em; color: #777; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>ESP32-CAM Multi-Hop Setup</h1>
        <form action="/saveconfig" method="POST">
            <div class="form-group">
                <h2>1. Select Node Role</h2>
                <div class="radio-group">
                    <label><input type="radio" name="mode" value="start" onclick="toggleSections()" required> Start-Node (Client)</label>
                    <label><input type="radio" name="mode" value="hop" onclick="toggleSections()" required> Hop-Node (AP+Client)</label>
                    <label><input type="radio" name="mode" value="end" onclick="toggleSections()" required> End-Node (Server)</label>
                </div>
            </div>

            <!-- Start-Node Configuration -->
            <div id="startConfig" class="section hidden">
                <h3>Start-Node Settings</h3>
                <p class="description">This is the first node in the chain. It only connects to the next hop to send its picture.</p>
                <div class="form-group">
                    <label for="sta_ssid">WiFi SSID of Next Hop:</label>
                    <input type="text" id="sta_ssid" name="sta_ssid">
                </div>
                <div class="form-group">
                    <label for="sta_pass">WiFi Password of Next Hop:</label>
                    <input type="password" id="sta_pass" name="sta_pass">
                </div>
                 <div class="form-group">
                    <label for="next_hop_ip">IP Address of Next Hop:</label>
                    <input type="text" id="next_hop_ip" name="next_hop_ip" placeholder="e.g., 192.168.4.1">
                </div>
            </div>

            <!-- Hop-Node Configuration -->
            <div id="hopConfig" class="section hidden">
                <h3>Hop-Node Settings</h3>
                <p class="description">This is an intermediate node. It creates a WiFi network for the previous node AND connects to the next node.</p>
                <div class="form-group">
                    <label for="ap_ssid">AP SSID to Create (for previous hop):</label>
                    <input type="text" id="ap_ssid" name="ap_ssid">
                </div>
                <div class="form-group">
                    <label for="ap_pass">AP Password to Create:</label>
                    <input type="password" id="ap_pass" name="ap_pass">
                </div>
                <hr>
                <div class="form-group">
                    <label for="hop_sta_ssid">WiFi SSID of Next Hop:</label>
                    <input type="text" id="hop_sta_ssid" name="hop_sta_ssid">
                </div>
                <div class="form-group">
                    <label for="hop_sta_pass">WiFi Password of Next Hop:</label>
                    <input type="password" id="hop_sta_pass" name="hop_sta_pass">
                </div>
                <div class="form-group">
                    <label for="hop_next_hop_ip">IP Address of Next Hop:</label>
                    <input type="text" id="hop_next_hop_ip" name="hop_next_hop_ip" placeholder="e.g., 192.168.4.1">
                </div>
            </div>

            <!-- End-Node Configuration -->
            <div id="endConfig" class="section hidden">
                <h3>End-Node Settings</h3>
                 <p class="description">This is the final node. It creates a WiFi network for the last hop and sends all data to the final destination.</p>
                <div class="form-group">
                    <label for="end_ap_ssid">AP SSID to Create (for last hop):</label>
                    <input type="text" id="end_ap_ssid" name="end_ap_ssid">
                </div>
                <div class="form-group">
                    <label for="end_ap_pass">AP Password to Create:</label>
                    <input type="password" id="end_ap_pass" name="end_ap_pass">
                </div>
            </div>

            <!-- Common Configuration -->
            <div class="section">
                <h3>Common Settings (for all nodes)</h3>
                <div class="form-group">
                    <label for="final_domain">Final Destination Domain:</label>
                    <input type="text" id="final_domain" name="final_domain" placeholder="e.g., yourserver.com">
                </div>
                <div class="form-group">
                    <label for="user_token">User Token:</label>
                    <input type="text" id="user_token" name="user_token">
                </div>
                <div class="form-group">
                    <label for="device_token">Device Token:</label>
                    <input type="text" id="device_token" name="device_token">
                </div>
                <div class="form-group">
                    <label>Application Category</label>
                    <div class="radio-group">
                        <label><input type="radio" name="app_category" value="development" required> Development</label>
                        <label><input type="radio" name="app_category" value="production" required> Production</label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="time_interval">Self-Capture Interval (for all active nodes)</label>
                    <div class="time-group">
                        <input type="number" id="time_interval" name="time_interval" value="60" required>
                        <select id="time_unit" name="time_unit">
                            <option value="seconds">Seconds</option>
                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                            <option value="days">Days</option>
                        </select>
                    </div>
                </div>
            </div>

            <button type="submit" class="btn">Save & Restart</button>
        </form>
    </div>
    <script>
        function toggleSections() {
            const mode = document.querySelector('input[name="mode"]:checked').value;
            document.getElementById('startConfig').classList.add('hidden');
            document.getElementById('hopConfig').classList.add('hidden');
            document.getElementById('endConfig').classList.add('hidden');
            if (mode === 'start') {
                document.getElementById('startConfig').classList.remove('hidden');
            } else if (mode === 'hop') {
                document.getElementById('hopConfig').classList.remove('hidden');
            } else if (mode === 'end') {
                document.getElementById('endConfig').classList.remove('hidden');
            }
        }
    </script>
</body>
</html>
)rawliteral";

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  Serial.println("\n\nESP32-CAM Booting...");

  preferences.begin("esp-cam-config", false);
  currentMode = preferences.getString("mode", "setup");

  if (currentMode == "start") {
    Serial.println("Booting as START-NODE.");
    startStartNode();
  } else if (currentMode == "hop") {
    Serial.println("Booting as HOP-NODE.");
    startHopNode();
  } else if (currentMode == "end") {
    Serial.println("Booting as END-NODE.");
    startEndNode();
  } else {
    Serial.println("No mode configured. Starting SETUP mode.");
    startSetupMode();
  }
}

void loop() {
  // Web server only runs for Hop, End, and Setup modes
  if (currentMode == "hop" || currentMode == "end" || currentMode == "setup") {
    server.handleClient();
  }
  
  // Periodic capture for all active nodes (Start, Hop, End)
  if (currentMode == "start" || currentMode == "hop" || currentMode == "end") {
    if (millis() - lastActionTime > actionInterval) {
      lastActionTime = millis();
      performPeriodicCapture();
    }
  }
}

// --- Camera Initialization ---
bool initCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  // init with high specs to pre-allocate larger buffers
  if (psramFound()) {
    config.frame_size = FRAMESIZE_QVGA;
    config.jpeg_quality = 4;  //0-63 lower number means higher quality
    config.fb_count = 2;
    Serial.println("psram found");
  } else {
    config.frame_size = FRAMESIZE_QVGA;
    config.jpeg_quality = 4;  //0-63 lower number means higher quality
    config.fb_count = 1;
    Serial.println("psram not found");
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return false;
  }
  return true;
}

// --- Mode Initialization Functions ---

void startStartNode() {
  String ssid = preferences.getString("sta_ssid", "");
  if (ssid.length() == 0) {
    Serial.println("Start-Node config invalid. Falling back to setup.");
    startSetupMode();
    return;
  }
  
  actionInterval = calculateIntervalMillis();

  if (!initCamera()) {
    Serial.println("Camera failed. Restarting in 10s.");
    delay(10000);
    ESP.restart();
    return;
  }
  
  String pass = preferences.getString("sta_pass", "");
  WiFi.begin(ssid.c_str(), pass.c_str());
  Serial.printf("Connecting to next hop WiFi: %s\n", ssid.c_str());
  
  // WiFi connection will be checked in the periodic function
  Serial.printf("Start-Node ready. Capturing every %lu ms.\n", actionInterval);
  lastActionTime = millis();
}

void startHopNode() {
  String ap_ssid = preferences.getString("ap_ssid", "");
  if (ap_ssid.length() == 0) {
    Serial.println("Hop-Node config invalid. Falling back to setup.");
    startSetupMode();
    return;
  }
  
  actionInterval = calculateIntervalMillis();

  if (!initCamera()) {
    Serial.println("Camera failed. Cannot start Hop-Node.");
    return;
  }

  String ap_pass = preferences.getString("ap_pass", "");
  String sta_ssid = preferences.getString("hop_sta_ssid", "");
  String sta_pass = preferences.getString("hop_sta_pass", "");

  WiFi.mode(WIFI_AP_STA);
  WiFi.softAP(ap_ssid.c_str(), ap_pass.c_str());
  Serial.println("\n--- Hop Node ---");
  Serial.println("AP Interface Started:");
  Serial.print("  SSID: "); Serial.println(ap_ssid);
  Serial.print("  IP:   "); Serial.println(WiFi.softAPIP());

  if (sta_ssid.length() > 0) {
    WiFi.begin(sta_ssid.c_str(), sta_pass.c_str());
    Serial.println("STA Interface Connecting:");
    Serial.print("  SSID: "); Serial.println(sta_ssid);
  }

  startCameraServer(); // To receive hops
  lastActionTime = millis();
}

void startEndNode() {
  String ap_ssid = preferences.getString("end_ap_ssid", "");
  if (ap_ssid.length() == 0) {
    Serial.println("End-Node config invalid. Falling back to setup.");
    startSetupMode();
    return;
  }
  
  actionInterval = calculateIntervalMillis();

  if (!initCamera()) {
    Serial.println("Camera failed. Cannot start End-Node.");
    return;
  }

  String ap_pass = preferences.getString("end_ap_pass", "");

  WiFi.softAP(ap_ssid.c_str(), ap_pass.c_str());
  Serial.println("\n--- End Node ---");
  Serial.println("AP Interface Started:");
  Serial.print("  SSID: "); Serial.println(ap_ssid);
  Serial.print("  IP:   "); Serial.println(WiFi.softAPIP());

  startCameraServer(); // To receive the final hop
  lastActionTime = millis();
}

void startSetupMode() {
  WiFi.softAP("ESP32-CAM-Setup", "");
  Serial.println("\nSetup Mode: Access Point 'ESP32-CAM-Setup' created.");
  Serial.print("AP IP address: ");
  Serial.println(WiFi.softAPIP());
  Serial.println("Connect to this network and go to http://192.168.4.1/setup");

  server.on("/setup", HTTP_GET, handleSetupPage);
  server.on("/saveconfig", HTTP_POST, handleSaveConfig);
  server.onNotFound([]() {
    server.sendHeader("Location", "/setup", true);
    server.send(302, "text/plain", "");
  });
  server.begin();
}

// --- Web Server Handler Functions ---

void startCameraServer() {
  server.on("/hop", HTTP_POST, handleHopReceive);
  server.on("/setup", HTTP_GET, handleSetupPage);
  server.on("/saveconfig", HTTP_POST, handleSaveConfig);
  server.onNotFound(handleNotFound);
  server.begin();
}

void handleSetupPage() {
  server.send(200, "text/html", setup_html);
}

void handleSaveConfig() {
  Serial.println("Received new configuration.");
  String mode = server.arg("mode");
  preferences.putString("mode", mode);

  if (mode == "start") {
    preferences.putString("sta_ssid", server.arg("sta_ssid"));
    preferences.putString("sta_pass", server.arg("sta_pass"));
    preferences.putString("next_hop_ip", server.arg("next_hop_ip"));
  } else if (mode == "hop") {
    preferences.putString("ap_ssid", server.arg("ap_ssid"));
    preferences.putString("ap_pass", server.arg("ap_pass"));
    preferences.putString("hop_sta_ssid", server.arg("hop_sta_ssid"));
    preferences.putString("hop_sta_pass", server.arg("hop_sta_pass"));
    preferences.putString("hop_next_hop_ip", server.arg("hop_next_hop_ip"));
  } else if (mode == "end") {
    preferences.putString("end_ap_ssid", server.arg("end_ap_ssid"));
    preferences.putString("end_ap_pass", server.arg("end_ap_pass"));
  }
  
  preferences.putString("final_domain", server.arg("final_domain"));
  preferences.putString("user_token", server.arg("user_token"));
  preferences.putString("device_token", server.arg("device_token"));
  preferences.putString("app_category", server.arg("app_category"));
  preferences.putString("time_interval", server.arg("time_interval"));
  preferences.putString("time_unit", server.arg("time_unit"));
  
  server.send(200, "text/html", "<html><body><h1>Configuration Saved!</h1><p>The device will now restart with the new settings.</p></body></html>");
  delay(1000);
  ESP.restart();
}

void handleHopReceive() {
  if (!server.hasArg("plain")) {
    server.send(400, "text/plain", "Bad Request: No image data.");
    return;
  }
  
  String userToken = server.header("X-User-Token");
  String deviceToken = server.header("X-Device-Token");
  String finalDomain = server.header("X-Final-Domain");
  String appCategory = server.header("X-App-Category");
  const char* imageData = server.arg("plain").c_str();
  size_t imageLen = server.arg("plain").length();

  if (currentMode == "end") {
    Serial.println("\n--- Image Received by END-NODE ---");
    camera_fb_t fb;
    fb.buf = (uint8_t *)imageData;
    fb.len = imageLen;
    sendImageToFinalDestination(&fb, finalDomain, userToken, deviceToken, appCategory);
    server.send(200, "text/plain", "Image received and forwarded to final destination.");

  } else if (currentMode == "hop") {
    Serial.println("\n--- Image Received by HOP-NODE ---");
    String nextHopIp = preferences.getString("hop_next_hop_ip", "");
    if(nextHopIp.length() == 0) {
      server.send(500, "text/plain", "Hop failed: This node has no next hop configured.");
      return;
    }

    HTTPClient http;
    String url = "http://" + nextHopIp + "/hop";
    http.begin(url);
    http.addHeader("Content-Type", "image/jpeg");
    http.addHeader("X-User-Token", userToken);
    http.addHeader("X-Device-Token", deviceToken);
    http.addHeader("X-Final-Domain", finalDomain);
    http.addHeader("X-App-Category", appCategory);

    int httpResponseCode = http.POST((uint8_t *)imageData, imageLen);
    if (httpResponseCode > 0) {
      server.send(200, "text/plain", "Image received and forwarded to next hop.");
    } else {
      server.send(502, "text/plain", "Bad Gateway: Could not forward to next hop.");
    }
    http.end();
  }
}

void handleNotFound() {
  server.send(404, "text/plain", "Not found. Try /setup");
}

// --- Core Logic Functions ---

void performPeriodicCapture() {
  Serial.println("Performing periodic self-capture...");

  // For modes that connect to another WiFi, check connection.
  if (currentMode == "start" || currentMode == "hop") {
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("WiFi disconnected. Reconnecting...");
      WiFi.reconnect();
      if (WiFi.waitForConnectResult() != WL_CONNECTED) {
        Serial.println("Reconnect failed. Skipping this capture.");
        return;
      }
      Serial.println("WiFi reconnected.");
    }
  }

  String userToken = preferences.getString("user_token", "");
  String deviceToken = preferences.getString("device_token", "");
  String finalDomain = preferences.getString("final_domain", "");
  String appCategory = preferences.getString("app_category", "development");

  camera_fb_t * fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    return;
  }

  if (currentMode == "end") {
    Serial.println("End-Node: Sending own image to final destination.");
    sendImageToFinalDestination(fb, finalDomain, userToken, deviceToken, appCategory);
  } else {
    String nextHopIp = "";
    if (currentMode == "start") {
      nextHopIp = preferences.getString("next_hop_ip", "");
    } else if (currentMode == "hop") {
      nextHopIp = preferences.getString("hop_next_hop_ip", "");
    }

    if (nextHopIp.length() > 0) {
      Serial.printf("%s-Node: Sending own image to next hop at %s\n", currentMode.c_str(), nextHopIp.c_str());
      HTTPClient http;
      String url = "http://" + nextHopIp + "/hop";
      http.begin(url);
      http.addHeader("Content-Type", "image/jpeg");
      http.addHeader("X-User-Token", userToken);
      http.addHeader("X-Device-Token", deviceToken);
      http.addHeader("X-Final-Domain", finalDomain);
      http.addHeader("X-App-Category", appCategory);

      int httpResponseCode = http.POST(fb->buf, fb->len);
      if (httpResponseCode > 0) {
        Serial.printf("Capture sent. Response: %d\n", httpResponseCode);
      } else {
        Serial.printf("Error sending capture: %s\n", http.errorToString(httpResponseCode).c_str());
      }
      http.end();
    } else {
      Serial.println("No next hop IP configured. Cannot send image.");
    }
  }

  esp_camera_fb_return(fb);
}


unsigned long calculateIntervalMillis() {
  String intervalStr = preferences.getString("time_interval", "60");
  String unit = preferences.getString("time_unit", "seconds");
  long interval = intervalStr.toInt();
  if (interval <= 0) interval = 60;

  if (unit == "seconds") return (unsigned long)interval * 1000;
  if (unit == "minutes") return (unsigned long)interval * 1000 * 60;
  if (unit == "hours") return (unsigned long)interval * 1000 * 60 * 60;
  if (unit == "days") return (unsigned long)interval * 1000 * 60 * 60 * 24;
  return 60000;
}

void sendImageToFinalDestination(camera_fb_t *fb, String domain, String userToken, String deviceToken, String appCategory) {
  if (!fb || !fb->buf || fb->len == 0) {
    Serial.println("Invalid frame buffer provided to sender.");
    return;
  }

  HTTPClient http;
  String path = (appCategory == "development") ? "/api/add-live-pictures/" : "/api/add-data-device/";
  String url = "http://" + domain + path + userToken + "/" + deviceToken;
  
  http.begin(url);
  
  String boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
  http.addHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
  
  String body_start = "--" + boundary + "\r\n";
  body_start += "Content-Disposition: form-data; name=\"imageFile\"; filename=\"capture.jpg\"\r\n";
  body_start += "Content-Type: image/jpeg\r\n\r\n";
  String body_end = "\r\n--" + boundary + "--\r\n";
  
  size_t total_len = body_start.length() + fb->len + body_end.length();
  
  WiFiClient *stream = http.getStreamPtr();
  if (!stream) {
    http.end();
    return;
  }
  
  stream->print(body_start);
  stream->write(fb->buf, fb->len);
  stream->print(body_end);
  
  int httpCode = http.POST("");
  if (httpCode > 0) {
    Serial.printf("[HTTP] POST... code: %d\n", httpCode);
    if (httpCode == HTTP_CODE_OK) {
      Serial.println(http.getString());
    }
  } else {
    Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
  http.end();
}
