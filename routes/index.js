var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var User = require('../models/user.js');

module.exports = function(app) {

	// 主页
	app.get('/', function(req, res) {
		res.render('index', { title: '主页' });
	});

	// 注册
	app.get('/reg', function(req, res) {
		res.render('reg', {title: '注册'});
	});
	app.post('/reg', function(req, res) {
		console.log('reg post');
		var name = req.body.name;
		var password = req.body['password'];
		var password_re = req.body['password-repeat'];

		// 检查两次输入的密码
		if (password_re !== password) {
			console.log('两次输入的密码不一致: ' + password_re + ', ' + password);
			req.flash('error', '两次输入的密码不一致');
			return res.redirect('/reg');
		};

		var md5 = crypto.createHash('md5');
		var md5_password = md5.update(password).digest('hex');
		var newUser = new User({
			name: name,
			password: md5_password,
			email: req.body.email
		});

		User.get(newUser.name, function(err, user) {
			console.log('mongo ' + newUser.name);
			if (err) {
				console.log('mongo error: ' + err);
				req.flash('error', err);
				return res.redirect('/');
			}

			if (user) {
				console.log('用户已存在 ' + newUser.name);
				req.flash('error', '用户已存在');
				return res.redirect('/');
			}

			newUser.save(function(err, user) {
				console.log('newUser.save: ' + user);
				if (err) {
					req.flash('error', err);
					return res.redirect('/reg');
				}

				req.session.user = user;
				req.flash('success', '注册成功');
				res.redirect('/');
			});
		});
	});

	// 登录
	app.get('/login', function(req, res) {
		res.render('login', {title: '登录'});
	});
	app.post('/login', function(req, res) {
	});

	// 发表
	app.get('/post', function(req, res) {
		res.render('post', {title: '发表'});
	});
	app.post('/post', function(req, res) {
	});

	// 退出登录
	app.get('/logout', function(req, res) {

	});
};
