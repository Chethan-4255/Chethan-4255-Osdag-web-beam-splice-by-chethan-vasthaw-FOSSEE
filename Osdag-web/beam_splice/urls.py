from django.urls import path
from .views import BeamSpliceDesignAPI # Import the new view

# We are not using a router anymore for this specific endpoint

urlpatterns = [
    # Define a direct path for the design calculation API
    path('beam-splice-design/', BeamSpliceDesignAPI.as_view(), name='beam_splice_design_api'),
    # You could add other CRUD endpoints here if needed, potentially using a ViewSet
    # path('', include(router.urls)),
]