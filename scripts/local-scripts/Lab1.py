import boto3
import paramiko
import json
def main():
    ssh_username = "ec2-user"
    ssh_key_file = "labsuser.pem"
    address = "44.204.97.140"

    commands = [
        "hostname",
        "aws s3 ls",
        "aws iam list-users"
    

    ]

    k = paramiko.RSAKey.from_private_key_file(ssh_key_file)
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(hostname= address, username=ssh_username, pkey=k, allow_agent=False, look_for_keys=False)

    #hostname
    command = "hostname"
    output = runCommand(command,c,k)
    print(output)

    #aws s3 lis
    command = "aws s3 ls"
    output = runCommand(command,c,k)
   
    #get the sample bucket id 
    sampleBucketId = (output).split("--",1)[1]
    print(sampleBucketId)

    #Create a sample test bucket file 
    command = """echo "Hello World" >> sample.txt"""
    output = runCommand(command,c,k)

    #upload the text file to s3 bucket
    command = "aws s3 cp sample.txt s3://samplebucket--" + sampleBucketId
    output = runCommand(command,c,k)

    #list the users in the lab
    command = "aws iam list-users"
    output = runCommand(command,c,k)

    #query only the usernames
    command = "aws iam list-users --query 'Users[*].UserName'"
    output = runCommand(command,c,k)




    #close the parimiko ssh session

    c.close()



#################################################################
#       Input: Command to run , c,k object for ssh              #
#     Output: The content of what is printed from that command  #
#################################################################
def runCommand(command,c,k):
     print("running command: {}".format(command))
     stdin , stdout, stderr = c.exec_command(command)
     output = stdout.read().decode('ascii')
     print(output)
     return output


main()