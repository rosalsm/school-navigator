from django.contrib import admin

from leaflet.admin import LeafletGeoAdmin

from .models import School


class SchoolAdmin(LeafletGeoAdmin):
    list_display = ('name', 'level', 'has_mission_statement', 'photo', 'hours', 'type', 'year_round')
    ordering = ('name',)
    list_filter = ('year_round', 'level', 'type')

    def has_mission_statement(self, obj):
        if obj.description:
            return True

admin.site.register(School, SchoolAdmin)
