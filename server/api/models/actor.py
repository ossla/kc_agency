from django.db import models
from agent import Agent

class Actor(models.Model):
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='actors')
    name = models.CharField(max_length=100)
    eye_color = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} ({self.color})"