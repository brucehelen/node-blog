
var settings = require('../settings');
var db = require('mongodb').Db;
var server = require('mongodb').Server;

module.exports = new Db(settings.db, 
	new server(settings.host, settings.port),
	{safe: true});
