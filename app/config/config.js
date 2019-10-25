const config = {
	"db": {
		// "username": "<MongoDBUsername>",
		// "password": "<MongoDBPassword>",
		// "host": "127.0.0.1",
		// "port": "27017",
		// "name": "new"
		username: process.env.dbUsername,
		password: process.env.dbPassword,
		host: process.env.dbHost,
		port: process.env.dbPort,
		name: process.env.dbName,
	},
	"sessionSecret": "<RandomString>",
	"facebook": {
		"clientID": process.env.FB_APP_ID || 'vfd',
		"clientSecret": process.env.FB_APP_SECRET || 'fdf',
		"callbackURL": "/auth/facebook/callback",
		"profileFields": ["id", "displayName", "photos"]
	},
	"redis": {
		"host": "127.0.0.1",
		"port": 6379,
		"password": ""
	}
}

module.exports = config;