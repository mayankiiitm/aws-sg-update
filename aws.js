const AWS = require('aws-sdk')

const ec2s = {}
const getEc2 = ({
	key, secret, region, id,
}) => {
	if (!key || !secret || !region || !id) {
		throw new Error('Credentials missing')
	}
	if (!ec2s[id]) {
		ec2s[id] = new AWS.EC2({
			accessKeyId: key,
			secretAccessKey: secret,
			apiVersion: '2016-11-15',
			region,
		})
	}
	return ec2s[id]
}

module.exports = {
	getEc2,
}
