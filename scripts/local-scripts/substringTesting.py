string = """" {

 "OptInStatus": "opt-in-not-required", 

 "Messages": [], 

 "ZoneId": "use1-az6",

 "GroupName": "us-east-1", 

 "State": "available", 

 "NetworkBorderGroup": "us-east-1", 

 "ZoneName": "us-east-1a", 

 "RegionName": "us-east-1"

}

]

}

"""

string = string.split('ZoneId: "',1)[1]

print(string)