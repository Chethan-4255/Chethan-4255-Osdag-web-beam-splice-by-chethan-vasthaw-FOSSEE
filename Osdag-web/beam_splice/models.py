from django.db import models

class BeamSplice(models.Model):
    beam_type = models.CharField(max_length=50)
    plate_thickness = models.FloatField()
    bolt_diameter = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.beam_type} Splice"