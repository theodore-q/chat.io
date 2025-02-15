'use strict';

var express	 	= require('express');
var router 		= express.Router();
var passport 	= require('passport');
var config 		= require('../config');

var User = require('../models/user');
var Room = require('../models/room');

// Home page
router.get('/', function(req, res, next) {
	// If user is already logged in, then redirect to rooms page
	if(req.isAuthenticated()){
		res.redirect('/rooms');
	}
	else{
		res.render('login', {
			success: req.flash('success')[0],
			errors: req.flash('error'), 
			showRegisterForm: req.flash('showRegisterForm')[0]
		});
	}
});

// Login
router.post('/login', passport.authenticate('local', { 
	successRedirect: '/rooms', 
	failureRedirect: '/',
	failureFlash: true
}));

// Register via username and password
router.post('/register', function(req, res, next) {

	var credentials = {'username': req.body.username, 'password': req.body.password };

	if(credentials.username === '' || credentials.password === ''){
		req.flash('error', 'Missing credentials');
		req.flash('showRegisterForm', true);
		res.redirect('/');
	}else{

		// Check if the username already exists for non-social account
		User.findOne({'username': new RegExp('^' + req.body.username + '$', 'i'), 'socialId': null}, function(err, user){
			if(err) throw err;
			if(user){
				req.flash('error', 'Username already exists.');
				req.flash('showRegisterForm', true);
				res.redirect('/');
			}else{
				User.create(credentials, function(err, newUser){
					if(err) throw err;
					req.flash('success', 'Your account has been created. Please log in.');
					res.redirect('/');
				});
			}
		});
	}
});



// Social Authentication routes
// 1. Login via Facebook
router.get('/authX/Xfacebook',
	passport.authenticate('facebook'));


// router.get('/authX/Xfacebook/Xcallback',
//    function(req, res) {
//      // Successful authentication, redirect home.
//      res.redirect('/auth/facebook/callback');
// 	 }
// );

// router.get('', passport.authenticate('facebook', 
// { successRedirect: '/rooms', failureRedirect: '/login' }));

router.get('/authX/Xfacebook/Xcallback',
  passport.authenticate('facebook', { successRedirect: '/rooms',
                                      failureRedirect: '/login' }));

// router.get('/authX/Xfacebook/Xcallback',
// 	passport.authenticate('facebook', { failureRedirect: '/' }),

// 	// passport.authenticate('facebook', {
// 	// 	successRedirect: '/rooms',
// 	// 	 failureRedirect: '/',
// 	//  //	failureFlash: true
//  	// })
 
	 
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/rooms');
// 	}
	
// 	);





// Social Authentication routes
// 1. Login via Facebook
router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
	passport.authenticate('facebook', { successRedirect: config.urls.strykinFront,
	failureRedirect: config.urls.strykinFront }));

// Rooms
router.get('/rooms', [User.isAuthenticated, function(req, res, next) {
	Room.find(function(err, rooms){
		if(err) throw err;
		res.render('rooms', { rooms });
	});
}]);

// Chat Room 
router.get('/chat/:id', [User.isAuthenticated, function(req, res, next) {
	var roomId = req.params.id;
	Room.findById(roomId, function(err, room){
		if(err) throw err;
		if(!room){
			return next(); 
		}
		res.render('chatroom', { user: req.user, room: room });
	});
}]);

// Chat Room 
router.get('/api/chat/:title', function(req, res, next) {
	console.log('DOESTHIS WERK')
	var roomTitle = req.params.title;
	Room.find({title:roomTitle}, function(err, room){
		console.log(room)
		if(err) throw err;
		if(!room){
			return next(); 
		}
		res.json( room );
	});
});

// Admin
router.get('/admin/:id', [User.isAuthenticated, function(req, res, next) {
	var roomId = req.params.id;
	Room.findById(roomId, function(err, room){
		if(err) throw err;
		if(!room){
			return next(); 
		}
		res.render('admin', { user: req.user, room: room });
	});
}]);

// Logout
router.get('/logout', function(req, res, next) {
	// remove the req.user property and clear the login session
	req.logout();

	// destroy session data
	req.session = null;

	// redirect to homepage
	res.redirect('/');
});

module.exports = router;