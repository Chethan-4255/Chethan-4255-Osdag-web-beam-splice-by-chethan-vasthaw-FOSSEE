from rest_framework import serializers
from .models import BeamSplice

class BeamSpliceSerializer(serializers.ModelSerializer):
    # Add basic validation
    plate_thickness = serializers.FloatField(min_value=1) # Thickness must be positive
    bolt_diameter = serializers.FloatField(min_value=1) # Diameter must be positive
    # Add more validators as needed based on engineering constraints

    class Meta:
        model = BeamSplice
        fields = '__all__' # Or list specific fields