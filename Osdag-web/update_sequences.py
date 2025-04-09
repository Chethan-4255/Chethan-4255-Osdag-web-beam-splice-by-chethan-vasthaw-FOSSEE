import psycopg2
from psycopg2 import sql

#########################################################
# Author : Atharva Pingale ( FOSSEE Summer Fellow '23 ) #
#########################################################

# Django Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres_Intg_osdag',
        'USER': 'osdagdeveloper',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Use the database connection details from the Django settings
conn = psycopg2.connect(database=DATABASES['default']['NAME'],
                        host=DATABASES['default']['HOST'],
                        user=DATABASES['default']['USER'],
                        password=DATABASES['default']['PASSWORD'],
                        port=DATABASES['default']['PORT'])

cursor = conn.cursor()

# Read the SQL file to update sequences
with open("ResourceFiles/Database/update_sequences.sql", "r+") as file:
    data = file.read()

cursor.execute(data)
print('SUCCESS : Sequences Updated')

# Close the connection
cursor.close()
conn.commit()
conn.close()
