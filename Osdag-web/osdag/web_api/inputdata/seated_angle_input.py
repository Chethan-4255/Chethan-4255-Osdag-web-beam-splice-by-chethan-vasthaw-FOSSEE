from .input_data_base import InputDataBase
from rest_framework import status
from rest_framework.response import Response
from osdag.models import Columns, Beams, Bolt, Bolt_fy_fu, Material, CustomMaterials
import traceback
class SeatedAngleInputData(InputDataBase):
    def process(self, **kwargs):
        connectivity, boltDiameter, angleList, topAngleList = kwargs["connectivity"], kwargs["boltDiameter"], kwargs["angleList"], kwargs["topAngleList"]
        propertyClass, thickness, email  = kwargs["propertyClass"], kwargs["thickness"], kwargs["email"]
        
        if (connectivity is None and boltDiameter is None and propertyClass is None and thickness is None and angleList is None and topAngleList is None):
            # fetch the list of all the connectivity options for Seated-Angle-Connection
            print("\n\n")
            print('inside connectivtityList handling ')
            print("\n\n")
            connectivityList = ['Column Flange-Beam-Web' , 'Column Web-Beam-Web', 'Beam-Beam']
            response = {
                'connectivityList': connectivityList
            }
            return Response(response, status=status.HTTP_200_OK)
        if(connectivity == 'Column-Flange-Beam-Web' or connectivity == 'Column-Web-Beam-Web'):
            # print('connectivity : ', connectivity)
            try:
                # fetch all records from Column table
                # fetch all records from Beam table
                # fetch all records from Material table

                columnList = list(Columns.objects.values_list(
                    'Designation', flat=True))
                beamList = list(Beams.objects.values_list(
                    'Designation', flat=True))
                
                materialList = list(Material.objects.filter().values())
                if email: 
                    custom_material = list(CustomMaterials.objects.filter(email=email).values())
                materialList = materialList + custom_material

                materialList.append({"id": -1, "Grade": 'Custom'})
                response = {
                    'columnList': columnList,
                    'beamList': beamList,
                    'materialList': materialList 
                }

                return Response(response, status=status.HTTP_200_OK)

            except Exception as err:
                print(err)
                return Response({"error": "Bad request"}, status=status.HTTP_400_BAD_REQUEST)

        elif (connectivity == 'Beam-Beam'):
            # print('connectivity : ', connectivity)

            # fetch all records from Beams table
            # fetch all recorsd from the Material Table
            try:
                beamList = list(Beams.objects.values_list(
                    'Designation', flat=True))
                materialList = list(Material.objects.all().values())
                materialList.append({"id": -1, "Grade": 'Custom'})
                response = {
                    'beamList': beamList,
                    'materialList': materialList
                }

                return Response(response, status=200)

            except:
                return Response({"error": "Bad request"}, status=status.HTTP_400_BAD_REQUEST)

        elif (boltDiameter == 'Customized'):
            # print('boltDiameter : ', boltDiameter)

            # fetch the data from Bolt table
            try:
                # print('fetching')
                boltList = list(Bolt.objects.values_list(
                    'Bolt_diameter', flat=True))
                boltList.sort()
                print('boltList : ' , boltList)
                response = {
                    'boltList': boltList
                }

                return Response(response, status=status.HTTP_200_OK)

            except:
                return Response({"error": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)

        elif (propertyClass == 'Customized'):
            print('propertyClass : ', propertyClass)

            # fetch the data from Bolt_fy_fu table
            try:
                #boltFyFuList = list(Bolt_fy_fu.objects.values_list(
                #    'Property_Class', flat=True))
                boltFyFuList = ['3.6', '4.6', '4.8', '5.6', '5.8', '6.8', '8.8', '9.8', '10.9', '12.9']
                # boltFyFuList.sort()

                response = {
                    'propertyClassList': boltFyFuList
                }
                print('propertyFyFuList : ', boltFyFuList)

                return Response(response, status=status.HTTP_200_OK)

            except:
                return Response({"error": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)
            
        elif (angleList == 'Customized'):
            try:
                # angleList = list(Angles.objects.values_list('Designation', flat=True))
                angleList = ['50 x 50 x 3', '50 x 50 x 4', '50 x 50 x 5', '50 x 50 x 6', '55 x 55 x 4', '55 x 55 x 5', '55 x 55 x 6', '55 x 55 x 8', '60 x 60 x 4', '60 x 60 x 5', '60 x 60 x 6', '60 x 60 x 8', '65 x 65 x 4', '65 x 65 x 5', '65 x 65 x 6', '65 x 65 x 8', '70 x 70 x 5', '70 x 70 x 6', '70 x 70 x 8', '70 x 70 x 10', '75 x 75 x 5', '75 x 75 x 6', '75 x 75 x 8', '75 x 75 x 10', '80 x 80 x 6', '80 x 80 x 8', '80 x 80 x 10', '80 x 80 x 12', '90 x 90 x 6', '90 x 90 x 8', '90 x 90 x 10', '90 x 90 x 12', '100 x 100 x 6', '100 x 100 x 8', '100 x 100 x 10', '100 x 100 x 12', '110 x 110 x 8', '110 x 110 x 10', '110 x 110 x 12', '110 x 110 x 16', '130 x 130 x 8', '130 x130 x 10', '130 x130 x 12', '130 x130 x 16', '150 x 150 x 10', '150 x 150 x 12', '150 x 150 x 16', '150 x 150 x 20', '200 x 200 x 12', '200 x 200 x 16', '200 x 200 x 20', '200 x 200 x 25', '50 x 50 x 7', '50 x 50 x 8', '55 x 55 x 10', '60 x 60 x 10', '65 x 65 x 10', '70 x 70 x 7', '100 x 100 x 7', '100 x 100 x 15', '120 x 120 x 8', '120 x 120 x 10', '120 x 120 x 12', '120 x 120 x 15', '130 x 130 x 9', '150 x 150 x 15', '150 x 150 x 18', '180 x 180 x 15', '180 x 180 x 18', '180 x 180 x 20', '200 x 200 x 24']
                response = {
                    'angleList': angleList
                }
                return Response(response, status=status.HTTP_200_OK)
            except:
                traceback.print_exc()
                return Response({'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
            
        elif (topAngleList == 'Customized'):
            try:
                topAngleList = ['50 x 50 x 3', '50 x 50 x 4', '50 x 50 x 5', '50 x 50 x 6', '55 x 55 x 4', '55 x 55 x 5', '55 x 55 x 6', '55 x 55 x 8', '60 x 60 x 4', '60 x 60 x 5', '60 x 60 x 6', '60 x 60 x 8', '65 x 65 x 4', '65 x 65 x 5', '65 x 65 x 6', '65 x 65 x 8', '70 x 70 x 5', '70 x 70 x 6', '70 x 70 x 8', '70 x 70 x 10', '75 x 75 x 5', '75 x 75 x 6', '75 x 75 x 8', '75 x 75 x 10', '80 x 80 x 6', '80 x 80 x 8', '80 x 80 x 10', '80 x 80 x 12', '90 x 90 x 6', '90 x 90 x 8', '90 x 90 x 10', '90 x 90 x 12', '100 x 100 x 6', '100 x 100 x 8', '100 x 100 x 10', '100 x 100 x 12', '110 x 110 x 8', '110 x 110 x 10', '110 x 110 x 12', '110 x 110 x 16', '130 x 130 x 8', '130 x130 x 10', '130 x130 x 12', '130 x130 x 16', '150 x 150 x 10', '150 x 150 x 12', '150 x 150 x 16', '150 x 150 x 20', '200 x 200 x 12', '200 x 200 x 16', '200 x 200 x 20', '200 x 200 x 25', '50 x 50 x 7', '50 x 50 x 8', '55 x 55 x 10', '60 x 60 x 10', '65 x 65 x 10', '70 x 70 x 7', '100 x 100 x 7', '100 x 100 x 15', '120 x 120 x 8', '120 x 120 x 10', '120 x 120 x 12', '120 x 120 x 15', '130 x 130 x 9', '150 x 150 x 15', '150 x 150 x 18', '180 x 180 x 15', '180 x 180 x 18', '180 x 180 x 20', '200 x 200 x 24']
                response = {
                    'topAngleList': topAngleList
                }
                return Response(response, status=status.HTTP_200_OK)
            except:
                traceback.print_exc()
                return Response({'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

        elif (thickness == 'Customized'):
            # print('thickness : ', thickness)

            try:
                # standard as per SAIL's product brochure
                PLATE_THICKNESS_SAIL = ['8', '10', '12', '14', '16', '18', '20', '22', '25', '28', '32', '36', '40', '45', '50', '56', '63', '75', '80', '90', '100',
                                        '110', '120']

                response = {
                    'thicknessList': PLATE_THICKNESS_SAIL
                }

                return Response(response, status=status.HTTP_200_OK)

            except:
                return Response({'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
        return super().process(kwargs)