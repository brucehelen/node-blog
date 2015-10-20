var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var User = require('../models/user.js');

module.exports = function(app) {

	// 主页
	app.get('/', function(req, res) {
		res.render('index', { 
			title: '主页',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	// 注册
	app.get('/reg', checkNotLogin);
	app.get('/reg', function(req, res) {
		res.render('reg', {
			title: '注册',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/reg', checkNotLogin);
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
	app.get('/login', checkNotLogin);
	app.get('/login', function(req, res) {
		res.render('login', {
			title: '登录',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/login', checkNotLogin);
	app.post('/login', function(req, res) {
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('hex');

		User.get(req.body.name, function(err, user) {
			if (!user) {
				req.flash('error', '用户不存在');
				return res.redirect('/login');
			};

			if (user.password !== password) {
				req.flash('error', '密码错误');
				return res.redirect('/login');
			};

			req.session.user = user;

			req.flash('success', '登录成功');
			res.redirect('/');
		});
	});

	// 发表
	app.get('/post', checkLogin);
	app.get('/post', function(req, res) {
		res.render('post', {title: '发表'});
	});
	app.post('post', checkLogin);
	app.post('/post', function(req, res) {
	});

	// 退出登录
	app.get('/logout', checkLogin);
	app.get('/logout', function(req, res) {
		req.session.user = null;
		req.flash('success', '登出成功!');
		res.redirect('/');
	});
};

function checkLogin(req, res, next) {
	if (!req.session.user) {
		req.flash('error', '未登录');
		res.redirect('/login');
	};

	next();
}

function checkNotLogin(req, res, next) {
	if (req.session.user) {
		req.flash('error', '已登录');
		res.redirect('back');
	};

	next();
}

