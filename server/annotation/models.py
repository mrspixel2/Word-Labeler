from django.db import models

class Annotation(models.Model):
    document = models.TextField()
    start = models.IntegerField()
    end = models.IntegerField()
    label = models.CharField(max_length=100)
    text = models.TextField()
