import time
import easyocr
import os
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import re
# Initialize the OCR Reader
reader = easyocr.Reader(['en'])

def get_numeric_values(text_list):
    numeric_values = ""
    for i, text in enumerate(text_list):
        numeric_string = re.sub(r'[^0-9]', '', text)
        if len(numeric_string) == 5:
            numeric_values = numeric_string
    return numeric_values

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def ocr_view(request):
    if 'image' not in request.FILES:
        return Response({'error': 'No image uploaded'}, status=400)
    
    # Start the timer
    start_time = time.time()

    # Save the uploaded file temporarily
    image_file = request.FILES['image']
    file_name = default_storage.save(image_file.name, ContentFile(image_file.read()))
    file_path = default_storage.path(file_name)

    # Perform OCR on the image
    result = reader.readtext(file_path, detail=0)
    numeric_result = get_numeric_values(result)

    # Delete the temporary file after processing
    os.remove(file_path)

    # Calculate the time taken
    execution_time = time.time() - start_time  

    # Show result in terminal
    print("OCR Result:", result)
    print("Extracted Numeric Value:", numeric_result)
    # Return OCR results as JSON
    return Response({
        'text': numeric_result,
        'execution_time': execution_time
    })
