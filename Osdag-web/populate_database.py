import psycopg2
from psycopg2 import sql

# Author : Atharva Pingale ( FOSSEE Summer Fellow '23 )

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

# Extracting details from DATABASES settings
db_config = DATABASES['default']
dbname = db_config['NAME']
user = db_config['USER']
password = db_config['PASSWORD']
host = db_config['HOST']
port = db_config['PORT']

# Manually connecting to the database using psycopg2 (Optional, if needed)
conn = psycopg2.connect(database=dbname, host=host, user=user, password=password, port=port)
cursor = conn.cursor()

file = open("ResourceFiles/Database/postgres_Intg_osdag.sql", "r+")
data = file.read()

cursor.execute(data)
print('SUCCESS: Database Populated')

# Close the connection
cursor.close()
conn.close()
