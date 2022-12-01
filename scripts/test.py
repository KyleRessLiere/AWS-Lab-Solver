import boto3
import paramiko
import time 
def ssh_connect_with_retry(ssh, ip_address, retries):
    if retries > 3:
        return False
    privkey = paramiko.RSAKey.from_private_key_file(
        'labsuser.pem')
    interval = 5
    try:
        retries += 1
        print('SSH into the instance: {}'.format(ip_address))
        ssh.connect(hostname=ip_address,
                    username='ubuntu', pkey=privkey)
        return True
    except Exception as e:
        print(e)
        time.sleep(5)
        print('Retrying SSH connection to {}'.format(ip_address))
        ssh_connect_with_retry(ssh, ip_address, retries)

# get your instance ID from AWS dashboard

# get instance
# ec2 = boto3.resource('ec2', region_name='us-east-1')
# instance = ec2.Instance(id=instance_id)
# instance.wait_until_running()
# current_instance = list(ec2.instances.filter(InstanceIds=[instance_id]))
ip_address = '18.207.99.103'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

ssh_connect_with_retry(ssh, ip_address, 0)

stdin, stdout, stderr = ssh.exec_command(commands)
print('stdout:', stdout.read())
print('stderr:', stderr.read())