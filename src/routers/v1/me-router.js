const apiVersion = '1.0.0';
var Router = require('restify-router').Router;
var router = new Router();
var AccountManager = require('buka-kamar-module').managers.auth.AccountManager;
var db = require('../../db');
var resultFormatter = require("../../result-formatter");

var passport = require('../../passports/jwt-passport');

router.get('/', passport, (request, response, next) => {
    var user = request.user;
    var result = resultFormatter.ok(apiVersion, 200, user);
    response.send(200, result); 
});


module.exports = router;