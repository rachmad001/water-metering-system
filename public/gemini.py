from google import genai
from google.genai import types
import sys
import re
import json
import time

file_path = sys.argv[1]

# with open('C:/Users/rachm/OneDrive/Dokumen/KULIAH/proposal/project/water-metering-app/public/Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-05-31_08-11-19.jpg', 'rb') as f:
#     image_bytes = f.read()

client = genai.Client(api_key="AIzaSyBTqN5Th1a0a79NlMzcU9i6gkUPOSsHZZ0")

# Start the timer
start_time = time.time()

my_file = client.files.upload(file=file_path)
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[my_file,"get the water meter value, please only response the number. if fail just empty response"]
)

get_values = re.sub(r'[^0-9]', '', response.text)
if len(get_values) != 5:
    get_values = ""
# Calculate the time taken
execution_time = time.time() - start_time

print(json.dumps({"text":get_values, "execution_time": execution_time}))