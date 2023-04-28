import os
import mysql.connector

user_name = 'root'
user_password = 'root'

current_directory = os.getcwd()
data_directory = os.path.join(current_directory, 'data')
os.chdir(data_directory)
file_list = os.listdir()
python_files = [file for file in file_list if file.endswith('.py')]

# 執行所有檔案
for python_file in python_files:
    print("execute", python_file, "...")
    os.system(f'python {python_file}')

print("exicute SQL...")

cnx = mysql.connector.connect(user=user_name,
                              password=user_password,
                              host='localhost',
                              allow_local_infile=True)
cursor =cnx.cursor()

def executeScriptsFromFile(filename):
    fd = open(filename, 'r')
    sqlFile = fd.read()
    fd.close()
    sqlCommands = sqlFile.split(';')

    for command in sqlCommands:
        try:
            if command.strip() != '':
                cursor.execute(command)
        except (IOError, msg):
            print ("Command skipped: ", msg)

executeScriptsFromFile('create_tables.sql')
cnx.commit()

os.chdir(current_directory)