from django.urls import path
from osdag.web_api.session_api import CreateSession
from osdag.web_api.session_api import DeleteSession
from osdag.web_api.input_data_api import InputValues
from osdag.web_api.output_data_api import OutputValues
from osdag.web_api.cad_model_api import CADGeneration
from osdag.web_api.modules_api import GetModules
from osdag.web_api.inputData_view import InputData, DesignView
from osdag.web_api.outputCalc_view import OutputData
from osdag.web_api.design_report_csv_view import CreateDesignReport, GetPDF, CompanyLogoView
from osdag.web_api.design_pref_api import DesignPreference, MaterialDetails
from osdag.web_api.user_view import SignupView, ForgetPasswordView, LogoutView, LoginView, ObtainInputFileView, CheckEmailView, SaveInputFileView, SetRefreshTokenCookieView
from osdag.web_api.jwt_api import JWTHomeView
from osdag.web_api.google_sso_api import GoogleSSOView
from . import views
from osdag.web_api.endplate_outputView import EndPLateOutputData
from osdag.web_api.cleatangle_outputView import CleatAngleOutputData
from osdag.web_api.seatedangle_outputView import SeatedAngleOutputData
from django.urls import path, include
from rest_framework import routers

router = routers.DefaultRouter()

urlpatterns = [
    path('api/', include(router.urls)),
]
# temporary
app_name = 'osdag-web/'


urlpatterns = [
    path('sessions/create/', CreateSession.as_view()),
    path('sessions/create', CreateSession.as_view()),
    path('sessions/delete/', DeleteSession.as_view()),
    path('sessions/delete', DeleteSession.as_view()),
    path('design/input_values/', InputValues.as_view()),
    path('design/input_values', InputValues.as_view()),
    path('design/output_values/', OutputValues.as_view()),
    path('design/output_values', OutputValues.as_view()),
    path('design/cad/', CADGeneration.as_view()),
    path('design/cad', CADGeneration.as_view()),
    path('modules', GetModules.as_view()),
    path('modules/', GetModules.as_view()),

    #########################################################
    # Author : Atharva Pingale ( FOSSEE Summer Fellow '23 ) #
    #########################################################

    # URLs from osdagServer/flowapp
    path('osdag-web/', include('beam_splice.urls')),  # Direct to your app's URLs    path('osdag-web/connections', views.get_connections, name='connections'),
         path('shear-connection/', include('beam_splice.urls')),
     path('osdag-web/connections/', include('beam_splice.urls')),
    path('osdag-web/', include('beam_splice.urls')),
    path('api/beam-splice/', include('beam_splice.urls')),
    path('osdag-web/connections/moment-connection/column-to-column-splice',
         views.get_c2c_splice, name='column-to-column-splice'),
    path('osdag-web/connections/base-plate',
         views.get_base_plate, name='base-plate'),
    path('osdag-web/tension-member',
         views.get_tension_member, name='tension-member'),

    # New APIs
    path('populate', InputData.as_view()),
    path('design', DesignView.as_view()),
    path('generate-report' , CreateDesignReport.as_view()),
    path('getPDF' , GetPDF.as_view()),
    path('design-preferences/', DesignPreference.as_view(), name="design-pref"),
    path('materialDetails/', MaterialDetails.as_view()),
    path('company-logo/' , CompanyLogoView.as_view()),

    # authentications nad authorozation URL mappings
    path('jwt/home' , JWTHomeView.as_view()),     # view for testing purpose
    path('googlesso/' , GoogleSSOView.as_view()),

    # user urls 
    path('user/signup/' , SignupView.as_view()),
    path('user/forgetpassword/' , ForgetPasswordView.as_view()),
    path('user/logout/' ,  LogoutView.as_view()),
    path('user/login/' , LoginView.as_view()),
    path('user/checkemail/' , CheckEmailView.as_view()),
    path('user/saveinput/' , SaveInputFileView.as_view()),
    path('user/obtain-input-file/' , ObtainInputFileView.as_view()),
    path('user/set-refresh/' , SetRefreshTokenCookieView.as_view()),

    # output generation from input
    path('calculate-output/Fin-Plate-Connection',
         OutputData.as_view(), name='Fin-plate-connection'),

    path('calculate-output/End-Plate-Connection',
         EndPLateOutputData.as_view(), name='End-Plate-Connection'),
    
    path('calculate-output/Cleat-Angle-Connection',
         CleatAngleOutputData.as_view(),name="Cleat-Angle-Connection"),
    
    path('calculate-output/Seated-Angle-Connection',
         SeatedAngleOutputData.as_view(),name="Seated-Angle-Connection")

]
