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
    #lab-keys
     accessKey = event['accessKey']
     secretKey = event["secretKey"]
   
    ################################
    #      END REQUIRED INPUTS     #
    ################################
    
     commands = [   
       "aws configure",
       "aws ec2 create-vpc --cidr-block 10.0.0.0/16 --region us-east-1", #creat vpc
       """aws ec2 create-tags --resources <VpcId> --tags 'Key=Name,Value="Lab VPC"'""", 
       """aws ec2 describe-vpcs --filters Name=tag:Name,Values="Lab VPC""",
       "aws ec2 create-internet-gateway",
       """aws ec2 create-tags --resources <InternetGatewayId> --tags 'Key=Name,Value="Lab IGW"'""",
       "aws ec2 attach-internet-gateway --internet-gateway-id <InternetGatewayId> --vpc-id <VpcId>",
       #creating a public subnet
       "aws ec2 describe-availability-zones --filters Name=zone-name,Values=us-east-1a",
       



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
            time.sleep(1.5)
            if(command == "aws configure"):
                output = awsConfigure(command, accessKey, secretKey, region, c, k)
            elif(command == "aws ec2 create-vpc --cidr-block 10.0.0.0/16 --region us-east-1"):
                output = runCommand(command,c,k)
                #gets everthing after vpc- to get id
               #vpcId = output.split('vpc',1)[1]
                #cuts everytting off after "
                #vpcId = vpcId.partition('"')[0]
                vpcId ='-0dc237b486e33e614'
                runCommand(command,c,k)
            elif(command == """aws ec2 create-tags --resources <VpcId> --tags 'Key=Name,Value="Lab VPC"'"""):
                command = command.replace('<VpcId>','vpc'+vpcId)
                runCommand(command,c,k)
            elif(command =="aws ec2 create-internet-gateway"):
                
                output = runCommand(command,c,k)
                #save internet gateway id
                if(output):
                    internetGatewayId = output.split('igw',1)[1]
                    internetGatewayId = internetGatewayId.partition('"')[0]
                    internetGatewayId = "igw" + internetGatewayId
                    ##
                    ###############################temporray
                internetGatewayId = "0ca9d9c134c77b583"
                print(internetGatewayId)
            elif(command ==  """aws ec2 create-tags --resources <InternetGatewayId> --tags 'Key=Name,Value="Lab IGW"'"""):
                command = command.replace('<InternetGatewayId>',internetGatewayId)
            elif(command == "aws ec2 attach-internet-gateway --internet-gateway-id <InternetGatewayId> --vpc-id <VpcId>"):
                command = command.replace('<InternetGatewayId>',internetGatewayId)
                command = command.replace('<VpcId>','vpc'+vpcId)
                runCommand(command,c,k)
            elif(command == "aws ec2 describe-availability-zones --filters Name=zone-name,Values=us-east-1a"):
                output = runCommand(command,c,k)
                output = output.split('subnet',1)[1]
                print(output)
            else:
                output = runCommand(command,c,k)
               

            #add command its output to the array of them
            commandResults.append({"commandId":count,"command":command,"output":output})

        #close the parimiko ssh session
       # print(json.dumps(commandResults,sort_keys=True, indent=4))
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
  "address": "44.212.220.17",
  "region": "us-east-1",
  "accessKey": "AKIA6GOXIHZOAHFWL7XL",
  "secretKey": "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",
 
})