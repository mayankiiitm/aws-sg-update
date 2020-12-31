const { getEc2 } = require('./aws')
const groups = require('./sg-list').sgs[0]

const getIpPermissions = (group) => new Promise((resolve, reject) => {
	const ec2 = getEc2(group)
	ec2.describeSecurityGroups({ GroupIds: [group.id] }, (err, data) => {
		if (err) reject(err)
		else if (data.SecurityGroups.length) {
			console.log(data)
			resolve(data.SecurityGroups[0].IpPermissions)
		} else {
			reject(new Error('wrong security group id'))
		}
	})
})
const cleanIpPermissions = (IpPermissions) => IpPermissions.map((ip) => {
	if (ip.Ipv6Ranges.length === 0) {
		// eslint-disable-next-line no-param-reassign
		delete ip.Ipv6Ranges
	}
	if (ip.PrefixListIds.length === 0) {
		// eslint-disable-next-line no-param-reassign
		delete ip.PrefixListIds
	}
	if (ip.UserIdGroupPairs.length === 0) {
		// eslint-disable-next-line no-param-reassign
		delete ip.UserIdGroupPairs
	}
	return ip
})
const revokeIpPermissions = async ({ groupId, region }) => {
	const ec2 = getEc2(region)
	const params = {
		IpPermissions: cleanIpPermissions(await getIpPermissions({ groupId, region })),
		GroupId: groupId,
	}
	return new Promise((resolve, reject) => {
		ec2.revokeSecurityGroupIngress(params, (err, data) => {
			if (err) reject(err)
			else resolve(data)
		})
	})
}
const run = async () => {
	const a = await getIpPermissions(groups)
	console.log(a)
}

run()
