'use strict';

var init = function () {

	if(process.env.NODE_ENV === 'production') {
		var redisURI 		= require('url').parse(process.env.REDIS_URL);
		var redisPassword 	= redisURI.auth.split(':')[1];
		return {
			db: {
				username: process.env.dbUsername,
				password: process.env.dbPassword,
				host: process.env.dbHost,
				port: process.env.dbPort,
				name: process.env.dbName
			},
			sessionSecret: process.env.sessionSecret,
			facebook: {
				clientID: process.env.facebookClientID,
				clientSecret: process.env.facebookClientSecret,
				callbackURL: "https://strykin-chat-backend.herokuapp.com/auth/facebook/callback",
				profileFields: ['id', 'displayName', 'photos']
			},
			redis: {
				host: redisURI.hostname,
				port: redisURI.port,
				password: redisPassword
			}
		}
	}
	else {
		return require('./config.js');
	}
}

module.exports = init();
