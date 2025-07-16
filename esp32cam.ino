/*
  Rui Santos
  Complete project details at https://RandomNerdTutorials.com/esp32-cam-post-image-photo-server/
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files.
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
*/

#include <Arduino.h>
#include <WiFi.h>
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"
#include "esp_camera.h"

const char* ssid = "hotspot1234";
const char* password = "hotspot1234";

String tokenUser = "kGJzwrCskCwBLnTmjcslu93QCwhy6q"; // REPLACE WITH YOUR TOKEN USER
String tokenDevice = "3rIR7dZh8QBIUIPQAkrE0kK1nv2nvJ"; // REPLACE WITH YOUR TOKEN DEVICE

String serverName = "192.168.137.1";  // REPLACE WITH YOUR SERVER IP
//String serverName = "example.com";   // OR REPLACE WITH YOUR DOMAIN NAME

String serverPath = "/api/add-data-device/" + tokenUser + "/" + tokenDevice;       
String serverPathLivePhoto = "/api/add-live-pictures/" + tokenUser + "/" + tokenDevice; 

const int serverPort = 8000; //REPLACE WITH PORT SERVER, DEFAULT 80 FOR HTTP, 443 FOR HTTTPS

WiFiClient client;

#define CAMERA_MODEL_AI_THINKER  // Has PSRAM
#include "camera_pins.h"

const int timerInterval = 10000;        // time between each HTTP POST image
unsigned long previousMillis = 0;      // last time image was sent
unsigned long previousMillisLive = 0;  // last time image was sent
int statusRunning = 0;

void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);
  Serial.begin(115200);
  pinMode(4, OUTPUT);
  analogWrite(4, 15);
  WiFi.mode(WIFI_STA);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("ESP32-CAM IP Address: ");
  Serial.println(WiFi.localIP());

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

  // camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    delay(1000);
    ESP.restart();
  }
  analogWrite(4, 10);
  sendPhoto();
}

void loop() {
  unsigned long currentMillis = millis();
  if (statusRunning) {
    if (currentMillis - previousMillis >= timerInterval) {
      sendPhoto();
      previousMillis = currentMillis;
    }
  }

  if (currentMillis - previousMillisLive >= 1000) {
    sendLivePhoto();
    previousMillisLive = currentMillis;
  }

  listener_input();
}

String sendPhoto() {
  // --- PERFORMANCE MEASUREMENT START ---
  unsigned long startTime_us = micros(); // High-resolution timer for function duration
  size_t initial_free_heap = esp_get_free_heap_size(); // Total free heap before function

  String getAll;
  String getBody;

  camera_fb_t* fb = NULL;
  fb = esp_camera_fb_get();

  unsigned long currentMillisCam = millis();
  unsigned long localPreviousMillisCam = currentMillisCam;

  if (!fb) {
    Serial.println("Camera capture failed");

    //alternate delay 1000
    while (currentMillisCam - localPreviousMillisCam <= 1000) {
      listener_input();
      currentMillisCam = millis();
    }
    localPreviousMillisCam = currentMillisCam;

    ESP.restart();
  }

  Serial.println("Connecting to server: " + serverName);

  if (client.connect(serverName.c_str(), serverPort)) {
    Serial.println("Connection successful!");
    String head = "--RandomNerdTutorials\r\nContent-Disposition: form-data; name=\"imageFile\"; filename=\"esp32-cam.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n";
    String tail = "\r\n--RandomNerdTutorials--\r\n";

    uint32_t imageLen = fb->len;
    uint32_t extraLen = head.length() + tail.length();
    uint32_t totalLen = imageLen + extraLen;

    client.println("POST " + serverPath + " HTTP/1.1");
    client.println("Host: " + serverName);
    client.println("Content-Length: " + String(totalLen));
    client.println("Content-Type: multipart/form-data; boundary=RandomNerdTutorials");
    client.println();
    client.print(head);

    uint8_t* fbBuf = fb->buf;
    size_t fbLen = fb->len;
    for (size_t n = 0; n < fbLen; n = n + 1024) {
      if (n + 1024 < fbLen) {
        client.write(fbBuf, 1024);
        fbBuf += 1024;
      } else if (fbLen % 1024 > 0) {
        size_t remainder = fbLen % 1024;
        client.write(fbBuf, remainder);
      }
    }
    client.print(tail);

    esp_camera_fb_return(fb);

    int timoutTimer = 10000;
    long startTimer = millis();
    boolean state = false;

    unsigned long currentMillis = millis();
    unsigned long localPreviousMillis = 0;

    while ((startTimer + timoutTimer) > millis()) {
      Serial.print(".");
      while (currentMillis - localPreviousMillis <= 100) {
        listener_input();
        currentMillis = millis();
      }

      while (client.available()) {
        char c = client.read();
        if (c == '\n') {
          if (getAll.length() == 0) { state = true; }
          getAll = "";
        } else if (c != '\r') {
          getAll += String(c);
        }
        if (state == true) { getBody += String(c); }
        startTimer = millis();
      }
      localPreviousMillis = currentMillis;
      if (getBody.length() > 0) { break; }

      // if (currentMillis - localPreviousMillis >= 100) {
      //   while (client.available()) {
      //     char c = client.read();
      //     if (c == '\n') {
      //       if (getAll.length() == 0) { state = true; }
      //       getAll = "";
      //     } else if (c != '\r') {
      //       getAll += String(c);
      //     }
      //     if (state == true) { getBody += String(c); }
      //     startTimer = millis();
      //   }
      //   localPreviousMillis = currentMillis;
      //   if (getBody.length() > 0) { break; }
      // } else {
      //   if (Serial.available()) {
      //     String texts = Serial.readString();
      //     if (texts == "777") {
      //       statusRunning = 1;
      //       Serial.println("Running to OCR");
      //     }
      //     if (texts == "111") {
      //       statusRunning = 0;
      //       Serial.println("Stopping from OCR");
      //     }
      //   }
      // }
    }
    Serial.println();
    client.stop();
    Serial.println(getBody);
  } else {
    getBody = "Connection to " + serverName + " failed.";
    Serial.println(getBody);
  }

  // --- PERFORMANCE MEASUREMENT RESULTS ---
  unsigned long endTime_us = micros();
  size_t final_free_heap = esp_get_free_heap_size();

  Serial.println("\n--- sendPhoto() Performance Metrics ---");
  Serial.printf("Execution Time: %lu microseconds (%.2f ms)\n", endTime_us - startTime_us, (float)(endTime_us - startTime_us) / 1000.0);
  Serial.printf("Initial Free Heap: %lu bytes\n", initial_free_heap);
  Serial.printf("Final Free Heap: %lu bytes\n", final_free_heap);
  Serial.printf("Heap Change (during function): %ld bytes\n", (long)initial_free_heap - (long)final_free_heap);
  Serial.println("-------------------------------------\n");
  // size_t final_min_free_heap = heap_caps_get_minimum_free_size(MALLOC_CAP_8BIT); // If you tracked this
  return getBody;
}

String sendLivePhoto() {
  String getAll;
  String getBody;

  camera_fb_t* fb = NULL;
  fb = esp_camera_fb_get();

  unsigned long currentMillisCam = millis();
  unsigned long localPreviousMillisCam = currentMillisCam;
  if (!fb) {
    Serial.println("Camera capture failed");

    //alternate delay 1000
    while (currentMillisCam - localPreviousMillisCam <= 1000) {
      listener_input();
      currentMillisCam = millis();
    }
    localPreviousMillisCam = currentMillisCam;

    ESP.restart();
  }

  Serial.println("Connecting to live photo");

  if (client.connect(serverName.c_str(), serverPort)) {
    Serial.println("Connection successful!");
    String head = "--RandomNerdTutorials\r\nContent-Disposition: form-data; name=\"imageFile\"; filename=\"esp32-cam.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n";
    String tail = "\r\n--RandomNerdTutorials--\r\n";

    uint32_t imageLen = fb->len;
    uint32_t extraLen = head.length() + tail.length();
    uint32_t totalLen = imageLen + extraLen;

    client.println("POST " + serverPathLivePhoto + " HTTP/1.1");
    client.println("Host: " + serverName);
    client.println("Content-Length: " + String(totalLen));
    client.println("Content-Type: multipart/form-data; boundary=RandomNerdTutorials");
    client.println();
    client.print(head);

    uint8_t* fbBuf = fb->buf;
    size_t fbLen = fb->len;
    for (size_t n = 0; n < fbLen; n = n + 1024) {
      if (n + 1024 < fbLen) {
        client.write(fbBuf, 1024);
        fbBuf += 1024;
      } else if (fbLen % 1024 > 0) {
        size_t remainder = fbLen % 1024;
        client.write(fbBuf, remainder);
      }
    }
    client.print(tail);

    esp_camera_fb_return(fb);

    int timoutTimer = 10000;
    long startTimer = millis();
    boolean state = false;

    unsigned long currentMillis = millis();
    unsigned long localPreviousMillis = currentMillis;

    while ((startTimer + timoutTimer) > millis()) {
      Serial.print("#");
      while (currentMillis - localPreviousMillis <= 100) {
        listener_input();
        currentMillis = millis();
      }

      while (client.available()) {
        char c = client.read();
        if (c == '\n') {
          if (getAll.length() == 0) { state = true; }
          getAll = "";
        } else if (c != '\r') {
          getAll += String(c);
        }
        if (state == true) { getBody += String(c); }
        startTimer = millis();

        listener_input();
      }
      localPreviousMillis = currentMillis;
      if (getBody.length() > 0) { break; }

      // if (currentMillis - localPreviousMillis >= 100) {
      //   while (client.available()) {
      //     char c = client.read();
      //     if (c == '\n') {
      //       if (getAll.length() == 0) { state = true; }
      //       getAll = "";
      //     } else if (c != '\r') {
      //       getAll += String(c);
      //     }
      //     if (state == true) { getBody += String(c); }
      //     startTimer = millis();
      //   }
      //   localPreviousMillis = currentMillis;
      //   if (getBody.length() > 0) { break; }
      // } else {
      //   if (Serial.available()) {
      //     String texts = Serial.readString();
      //     if (texts == "777") {
      //       statusRunning = 1;
      //       Serial.println("Running to OCR");
      //     }
      //     if (texts == "111") {
      //       statusRunning = 0;
      //       Serial.println("Stopping from OCR");
      //     }
      //   }
      // }
    }
    Serial.println();
    client.stop();
    // Serial.println(getBody);
  } else {
    getBody = "Connection to " + serverName + " failed.";
    Serial.println(getBody);
  }
  return getBody;
}

void listener_input() {
  if (Serial.available()) {
    String texts = Serial.readStringUntil('\n');
    if (texts == "777") {
      statusRunning = 1;
      Serial.println("Running to OCR");
    }
    if (texts == "111") {
      statusRunning = 0;
      Serial.println("Stopping from OCR");
    }
    Serial.println("user input = "+texts);
  }
}