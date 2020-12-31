const AWS = require('aws-sdk')

const credentials = new AWS.SharedIniFileCredentials({ profile: 'rumbl-backend' })
AWS.config.credentials = credentials
const ec2 = new AWS.EC2({ apiVersion: '2016-11-15', region: 'us-east-1' })
const params = {
	GroupIds: ['sg-081211b57578ba2d1'],
}
ec2.describeSecurityGroups(params, (err, data) => {
	if (err) console.log(err, err.stack)
	else console.log(JSON.stringify(data, null, 2))
})
const paramsIngress = {
	GroupId: 'sg-081211b57578ba2d1',
	IpPermissions: [
		{
			IpProtocol: 'tcp',
			FromPort: 81,
			ToPort: 81,
			IpRanges: [{ CidrIp: '139.5.254.120/32' }],
		},
	],
}

ec2.authorizeSecurityGroupIngress(paramsIngress, (err, data) => {
	if (err) {
		console.log('Error', err)
	} else {
		console.log('Ingress Successfully Set', data)
	}
})
