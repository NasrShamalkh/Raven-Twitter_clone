from django.contrib import admin
from .models import RavenUser

# Register your models here.
class RavenUserAdmin(admin.ModelAdmin):
    model = RavenUser

admin.site.register(RavenUser, RavenUserAdmin)
