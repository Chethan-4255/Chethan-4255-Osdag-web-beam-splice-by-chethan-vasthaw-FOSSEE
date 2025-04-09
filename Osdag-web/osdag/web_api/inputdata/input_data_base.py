from rest_framework.response import Response
from rest_framework import status

class InputDataBase:
    def process(self, **kwargs):
        return Response({"error": "Bad Query Parameter"}, status=status.HTTP_400_BAD_REQUEST)