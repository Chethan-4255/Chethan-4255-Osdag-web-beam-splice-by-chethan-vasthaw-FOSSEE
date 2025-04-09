from rest_framework.views import APIView # Use APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny # Import AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication # Or potentially remove authentication
import time
import logging # Optional: for logging received data
import math # Import math for calculations

logger = logging.getLogger(__name__)

class BeamSpliceDesignAPI(APIView):
    """ 
    API endpoint for simulating Beam Splice End Plate design calculations.
    Accepts POST requests with design parameters.
    """
    # Explicitly allow any user, bypassing default auth/perm checks for this view
    authentication_classes = [] # No authentication required for this specific endpoint
    permission_classes = [AllowAny] # Allow any request

    def post(self, request, *args, **kwargs):
        input_data = request.data
        logger.info(f"Received Beam Splice Design Request: {input_data}")

        # --- Basic Input Validation (Example) ---
        required_keys = [
            "Load.Shear", "Member.Supporting_Section.Designation",
            "Member.Supported_Section.Designation", "Material",
            "Bolt.Grade", "Bolt.Diameter", "Connector.Plate.Thickness"
            # Add other truly essential keys for the calculation
        ]
        missing_keys = [key for key in required_keys if key not in input_data]
        if missing_keys:
            logger.error(f"Validation Error - Missing Keys: {missing_keys}")
            return Response({
                'status': 'Validation Error',
                'errors': f"Missing required input fields: {', '.join(missing_keys)}"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # --- Safely Access and Convert Input Values ---
            try:
                shear_force_input = input_data.get("Load.Shear", 0)
                shear_force = float(shear_force_input)
                logger.info(f"Parsed Shear Force: {shear_force}")
            except (ValueError, TypeError) as e:
                logger.error(f"Validation Error - Invalid Load.Shear: {shear_force_input}, Error: {e}")
                return Response({
                    'status': 'Validation Error',
                    'errors': f"Invalid value for Shear Force: '{shear_force_input}'. Must be a number."
                }, status=status.HTTP_400_BAD_REQUEST)

            try:
                plate_thickness_input = input_data.get("Connector.Plate.Thickness", 10)
                plate_thickness = float(plate_thickness_input)
                logger.info(f"Parsed Plate Thickness: {plate_thickness}")
            except (ValueError, TypeError) as e:
                logger.error(f"Validation Error - Invalid Connector.Plate.Thickness: {plate_thickness_input}, Error: {e}")
                return Response({
                    'status': 'Validation Error',
                    'errors': f"Invalid value for Plate Thickness: '{plate_thickness_input}'. Must be a number."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                bolt_diameter_input = input_data.get("Bolt.Diameter", 20)
                bolt_diameter = float(bolt_diameter_input)
                logger.info(f"Parsed Bolt Diameter: {bolt_diameter}")
            except (ValueError, TypeError) as e:
                return Response({'status': 'Validation Error', 'errors': f"Invalid value for Bolt Diameter: '{bolt_diameter_input}'."}, status=status.HTTP_400_BAD_REQUEST)

            # --- Simulate Design Calculation (Make results dependent on input) ---
            time.sleep(0.1) # Shorter sleep

            design_successful = True
            
            # Simulated results - NOW DEPENDENT ON INPUTS
            # Example: Bolt capacity increases with diameter squared (very simplified)
            simulated_bolt_capacity_kn = round((bolt_diameter / 20.0)**2 * 50.0 + 5.0, 1)
            
            # Example: Required bolts increase with shear force (very simplified)
            required_bolts = max(2, math.ceil(shear_force / simulated_bolt_capacity_kn)) if simulated_bolt_capacity_kn > 0 else 99
            
            # Example: Plate shear capacity increases with thickness (very simplified)
            simulated_plate_shear_capacity_kn = round(plate_thickness * 25.0, 1)
            
            # Example: Pitch/edge depend slightly on diameter
            simulated_bolt_pitch_mm = max(60, round(bolt_diameter * 2.5))
            simulated_edge_distance_mm = max(35, round(bolt_diameter * 1.7))

            design_remark = "Pass"

            # Simulate potential failure based on input AND simulated capacities
            if shear_force <= 0:
                design_successful = False
                design_remark = f"Fail: Shear force must be positive."
            elif shear_force > simulated_plate_shear_capacity_kn * 1.05: # Check against *simulated* capacity
                design_successful = False
                design_remark = f"Fail: Input Shear ({shear_force} kN) exceeds simulated Plate Shear Capacity ({simulated_plate_shear_capacity_kn} kN for {plate_thickness}mm plate)"
            elif plate_thickness < 6:
                design_successful = False
                design_remark = f"Fail: Plate thickness ({plate_thickness}mm) is too small for typical designs."
            elif required_bolts > 10: # Example: Too many bolts needed
                 design_successful = False
                 design_remark = f"Fail: Design requires too many bolts ({required_bolts}) for this configuration."

            # --- Structured Response ---
            results_dict = {}
            viz_dict = {}
            if design_successful:
                results_dict = {
                    'bolt_capacity_kn': simulated_bolt_capacity_kn,
                    'required_bolts': required_bolts,
                    'plate_shear_capacity_kn': simulated_plate_shear_capacity_kn,
                    'bolt_pitch_mm': simulated_bolt_pitch_mm,
                    'edge_distance_mm': simulated_edge_distance_mm,
                }
                viz_dict = {
                    'type': 'placeholder',
                    'details': {
                        'beam_depth': 300,
                        'plate_dims': [150, 200, plate_thickness],
                        'bolt_positions': [[0, simulated_edge_distance_mm + i * simulated_bolt_pitch_mm] for i in range(required_bolts)] # Bolt positions based on results
                    }
                }

            response_data = {
                'status': 'Success' if design_successful else 'Fail',
                'message': design_remark,
                'input_echo': input_data,
                'results': results_dict,
                'visualization_data': viz_dict
            }

            logger.info(f"Design Response: {response_data}")
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            # Catch any other unexpected errors during simulation/processing
            logger.error(f"Internal Server Error during design simulation: {e}", exc_info=True)
            return Response({
                'status': 'Error',
                'errors': 'An internal error occurred during the design process.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)