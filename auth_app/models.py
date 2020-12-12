from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class RavenUser(AbstractUser):
    #here we can add general settings to a user such as mode (light or dark)
    mode = models.CharField(blank=True, max_length=20, default='light')
    # will add more ( enough for now )
