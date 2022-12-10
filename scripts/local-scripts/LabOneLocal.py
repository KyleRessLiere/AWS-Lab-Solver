import json
import boto3
import time
import paramiko

def lambda_handler(event):
     print(event)
     ssh_username = "ec2-user"
     ssh_key_file = "labsuser.pem"
     commandResults = []

    ###############################
    #    BEGIN REQUIRED INPUTS    #
    ###############################
    
    #bastion host address
     pemLocation = event['pemname']
     address = event['address'] 
     region = event['region']
    #user1
     user1AccessKey = event['user1AccessKey']
     user1SecretKey = event["user1SecretKey"]
    #user2
     user2AccessKey = event['user2AccessKey']
     user2SecretKey = event["user2SecretKey"]
    #user3
     user3AccessKey = event['user3AccessKey']
     user3SecretKey = event["user2SecretKey"]
     labHostId = event['labHostId']
    ################################
    #      END REQUIRED INPUTS     #
    ################################
    
     commands = [   
        #
        "hostname", #prints hostname
        "aws s3 ls", 
        "aws iam list-users", #list all the users
        """echo "Hello World" >> sample.txt""",#Create a sample test bucket file 
        "aws s3 cp sample.txt s3://samplebucket--", #upload test file to s3
        "aws iam list-users", #list all of the users
        "aws iam list-users --query 'Users[*].UserName'",#query all of the users
        "aws iam get-user --user-name user-1", #query all the info for user 1,
        "aws iam list-attached-user-policies --user-name user-1",#Check if any policies are attached to user-1 
        "aws iam list-groups-for-user --user-name user-1" , #check if user 1 is part of any groups 
        "aws iam list-groups" #list the diffrent IAM groups
        "aws iam get-group --group-name EC2-Support", #query the EC2 group 
        "aws iam list-attached-group-policies --group-name EC2-Support",#view the attached policies 
        "aws iam get-policy-version --policy-arn arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess --version-id v1", #explore readonly policy
        "aws iam list-group-policies --group-name EC2-Admin" #explore ec2 admins permissions
        "aws iam get-group-policy --group-name EC2-Admin --policy-name EC2-Admin-Policy", #review admin inline policy
       #Buisness scenario
        "aws iam add-user-to-group --user-name user-1 --group-name S3-Support", #add user 1 to s3 support group
        "aws iam get-group --group-name S3-Support", #verify user 1 was added to 
        "aws iam add-user-to-group --user-name user-2 --group-name EC2-Support", #add to ec2 support group 
        "aws iam add-user-to-group --user-name user-3 --group-name EC2-Admin", #add user3 to ec2admin
        "aws configure --profile user-1",
        "cat ~/.aws/config",
        "cat ~/.aws/credentials",
        "aws configure --profile user-2",
        "cat ~/.aws/config",
        "cat ~/.aws/credentials",
        "aws configure --profile user-3",
        "cat ~/.aws/config",
        "cat ~/.aws/credentials",
        "aws s3 ls --profile user-1",
        "aws s3 ls s3://<sample-bucket> --profile user-1",
        "aws ec2 describe-instances --profile user-1",
        "aws ec2 describe-instances --profile user-2",
        "aws ec2 describe-instances --profile user-2 --query 'Reservations[*].Instances[*].[InstanceId,InstanceType,Placement.AvailabilityZone,Tags[*]]'",#query the isntance of the
        "aws ec2 stop-instances --instance-ids " + labHostId +" --profile user-2", #id is from lab details
        "aws s3 ls --profile user-2", #check if user can access amazon s3 
        "aws ec2 stop-instances --instance-ids " + labHostId + " --profile user-3", ##stop instance
    ]
     try:
        s3 = boto3.client('s3')
        k = paramiko.RSAKey.from_private_key_file("labsuser.pem")
        c = paramiko.SSHClient()
        c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        c.connect(hostname= address, username=ssh_username, pkey=k, allow_agent=False, look_for_keys=False,timeout=10)
        count = 0
        for command in commands:
            count +=1
            time.sleep(1.25)
        #gets the bucket id from the command
            if(command == "aws s3 ls"):
                output = runCommand(command,c,k)
                sampleBucketId = (output).split("--",1)[1]
                print(sampleBucketId) 
            #troubleshooting
            elif command == "end":
                break
            #adds sample buck from s3 ls to target the bucket
            elif(command == "aws s3 cp sample.txt s3://samplebucket--"):
                command = "aws s3 cp sample.txt s3://samplebucket--" + sampleBucketId
                output = runCommand(command,c,k)
            elif(command == "aws configure --profile user-1"):
                awsConfigure(command, user1AccessKey, user1SecretKey, region, c, k)
            elif(command == "aws configure --profile user-2"):
                awsConfigure(command, user2AccessKey, user2SecretKey, region, c, k)
            elif(command == "aws configure --profile user-3"):
                awsConfigure(command, user3AccessKey, user3SecretKey, region, c, k)
            #gets the bucket number by parsing after the dash for buck
            elif(command == "aws s3 ls --profile user-3"):
                output = runCommand(command,c,k)
                print(output)
                sampleBucketId = (output).split("--",1)[1]
                print(sampleBucketId) 
            elif (command == "aws s3 ls s3://<sample-bucket> --profile user-1"):
                command = "aws s3 ls s3://" +sampleBucketId + " --profile user-1"
                output = runCommand(command,c,k)
            
            else:
                output = runCommand(command,c,k)
                
            commandResults.append({"commandId":count,"command":command,"output":output})
            #upload the text file to s3 bucket
            

        #close the parimiko ssh session
        print(json.dumps(commandResults,sort_keys=True, indent=4))
        c.close()
     except (paramiko.BadHostKeyException, paramiko.AuthenticationException, paramiko.SSHException) as e:
        print (e)
        print ('caught a timeout')
     return {
        'statusCode': 200,
        'body': json.dumps(commandResults)
    }


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

def awsConfigure(command,key,secretKey,region,c,k):
     print("running command: {}".format(command))
     stdin , stdout, stderr, = c.exec_command(command)
     stdin.write(key + '\n')
     stdin.flush()
     stdin.write(secretKey + '\n')
     stdin.flush()
     stdin.write(region + '\n')
     stdin.flush()
     stdin.write("json" + '\n')
     stdin.flush()
     output = stdout.read().decode('ascii')
     print(output)
     return output
    

lambda_handler({
  "pemname": "labsuser.pem",
  "address": "44.202.189.244",
  "region": "us-east-1",
  "user1AccessKey": "AKIAWNBISRYXABLY4Z6M",
  "user1SecretKey": "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",
  "user2AccessKey": "AKIAWNBISRYXDS7EITNF",
  "user2SecretKey": "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",
  "user3AccessKey": "AKIAWNBISRYXPBK3DAGI",
  "user3SecretKey": "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",
  "labHostId": "44.202.189.244"
})