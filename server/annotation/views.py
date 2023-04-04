from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from annotation.models import Annotation

'''
@csrf_exempt
def save_annotation(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        document = data['document']
        annotations = data['annotation']
        for annotation in annotations:
            start = annotation['start']
            end = annotation['end']
            label = annotation['label']
            text = annotation['text']
            Annotation.objects.create(
                document=document,
                start=start,
                end=end,
                label=label,
                text=text
            )
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'})
'''
@csrf_exempt
def save_annotation(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        document = data['document']
        annotations = data['annotation']
        data = []
        for annotation in annotations:
            start = annotation['start']
            end = annotation['end']
            label = annotation['label']
            text = annotation['text']
            data.append({
                'start': start,
                'end': end,
                'label': label,
                'text': text,
            })

        json_data = {
            'document': document,
            'annotation': data,
        }
        # Return JSON response
        return JsonResponse(json_data)
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'})

'''
@csrf_exempt
def export_annotation(request):
    if request.method == 'GET':
        # Retrieve current document text from the request
        document = request.GET.get('document', '')

        # Retrieve all annotations for the current document
        annotations = Annotation.objects.filter(document=document)

        # Convert annotations to JSON format
        data = []
        for annotation in annotations:
            data.append({
                'start': annotation.start,
                'end': annotation.end,
                'label': annotation.label,
                'text': annotation.text,
            })

        # Create a dictionary to hold the JSON data
        json_data = {
            'document': document,
            'annotation': data,
        }

        # Return JSON response
        return JsonResponse(json_data)
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'})
'''