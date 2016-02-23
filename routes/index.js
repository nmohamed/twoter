var Users = require('../models/userModel.js');
var Twots = require('../models/twotModel.js');
var mongoose = require('mongoose');
var path = require('path');

/* LOGIN PAGE */

//show log in page
var loginPage = function(req, res){
	console.log('user:', req.session.username);
	if (typeof req.session.username !== 'undefined'){ // already logged in
		delete req.session.username;
		res.render('loginPage', {message: 'Logged out'});
	} else { //not logged in
		res.render('loginPage');
	}
};

module.exports.loginPage = loginPage;

//log in
var login = function(req, res){
	var newUser = new Users({
		username: req.body.username,
		password: req.body.password
	});
	Users.findOne({username: req.body.username}, function (err, user){
		if (err) console.log("mongo error:", err);
		if (!user) { //user doesn't exist
			console.log("User '" + req.body.username + "' doesn't exist, creating new account.");
			newUser.save(function (err2) {
				if (err) console.log("error occured when adding user", err2);
				else {
					console.log('user added successfully.');
					req.session.username = req.body.username;
					res.send({message: 1}); //LOAD INDEX PAGE INSTEAD
				}
			});
		} else { //user does exist
			console.log("User '" + req.body.username + "' exists. Checking password...");
			console.log(user.password +", "+ newUser.password);
			if (user.password === newUser.password){
				req.session.username = req.body.username;
				res.send({
					message: true,			//true = correct pw
					username: user.username
				}); 
			} else {
				res.send({message: false}); //false = wrong pw
			}
		}
	});
};

module.exports.login = login;


/* INDEX PAGE */

//show all twots and usernames
var indexTwot = function(req, res){
	Twots.find().sort({_id: -1}).exec(function (err, twot){
		Users.find({}, function (err2, user){
			if (typeof req.session.username !== 'undefined'){ //already logged in
				res.render('indexTwot', {
					allTwots: twot,
					users: user,
					currentUser: req.session.username + ' | <a href="/">logout</a>'
				});
			} else {
				res.render('indexTwot', {
					allTwots: twot,
					users: user,
					currentUser: '<a href="/">login</a>'
				});
			}
		});
	});
};

module.exports.indexTwot = indexTwot;

//add new twot
var addTwot = function(req, res){
	if (typeof req.session.username !== 'undefined'){ //already logged in
		var twot = new Twots({
			username: req.session.username,
			twot: req.body.twot
			});
		twot.save(function (err) {
			if (err) console.log("error occured when adding twot", err);
			else console.log('twot added successfully.');
		});
		req.body.id = twot.id;
		res.send({
			username: req.session.username,
			twot: req.body.twot,
			message: true,
			id: req.body.id
		});
	} else {
		res.send({message: false});
	}
};

module.exports.addTwot = addTwot;

//delete twot
var deleteTwot = function(req, res){
	if (req.session.username === req.body.username){
		var id = req.body._id;
		Twots.findOneAndRemove({_id: id}, function (err, data) {
			if (err) console.log('err:', err);
			else res.send({message: true});
		});
	} else {
		console.log("'" + req.session.username + "' cannot delete twots by '" + req.body.username + "'");
		res.send({message: false});
	}
};

module.exports.deleteTwot = deleteTwot;

