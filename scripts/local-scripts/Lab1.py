import json
import boto3
import time
import paramiko

def lambda_handler(event, context):
    ssh_username = "ec2-user"
    BUCKET_NAME = 'aws-lab-solver'
    LOCAL_FILE_NAME = '/tmp/keyname.pem'
    #get address and pem file from the event
    address = event['address']
    pemFileLocation = event["pem"]
    print("address " + address)
    print("pem "  + pemFileLocation)
    
    #load the pem file from s3 storage and store in a temporary directory
    s3 = boto3.client('s3')
    s3.download_file(BUCKET_NAME, pemFileLocation, LOCAL_FILE_NAME)
    
    #start up the ssh session using the pem file and the address
    k = paramiko.RSAKey.from_private_key_file("/tmp/keyname.pem")
    #k = paramiko.RSAKey.from_private_key_file(ssh_key_file)
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(hostname= address, username=ssh_username, pkey=k, allow_agent=False, look_for_keys=False)
    commands = [
        "hostname",
        "aws configure",
        "aws s3 ls",
        """ echo "Hello World" >> sample.txt """,
        "aws s3 cp sample.txt s3://samplebucket--beb9beb0",
        "aws iam list-users",
        "aws iam list-users --query 'Users[*].UserName'",
        " aws iam get-user --user-name user-1",
        " aws iam list-attached-user-policies --user-name user-1",
        " aws iam list-groups-for-user --user-name user-1" , 
        " aws iam list-groups",
        " aws iam get-group --group-name EC2-Support"
    ]
    
    #loops through commands
    for command in commands:
        if(command != "aws configure"):
            print("running command: {}".format(command))
            stdin , stdout, stderr = c.exec_command(command)
            time.sleep(1)
            print(stdout.read().decode('ascii'))
            print(stderr.read())
        else:
            print("running command: {}".format(command))
            stdin , stdout, stderr = c.exec_command(command)
            time.sleep(2)
            stdin.write("AKIAWNBISRYXPQRLSULK")
            stdin.flush()
            stdin.write("bItdf12ZJYOfm4+BVEpOGtXL2RotThCc63KglVFU")
            stdin.flush()
            stdin.write("us-east-1")
            stdin.flush()
            stdin.write("json")
            stdin.flush()
    #closes the ssh session
    c.close()
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
