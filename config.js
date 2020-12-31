const Configstore = require('configstore')
const packageJson = require('./package.json')

const config = new Configstore(packageJson.name)

const setSg = ({
	id, region, alias, key, secret,
}) => {
	config.set('sgs', [...config.get('sgs'), {
		id, region, alias, key, secret,
	}])
}

const getSg = (id) => {
	const sgs = config.get('sgs').filter((sg) => sg.id === id)
	if (sgs.length) {
		return sgs[0]
	}
	return false
}

module.exports = {
	setSg,
	getSg,
}
