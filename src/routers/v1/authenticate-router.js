const apiVersion = '1.0.0';

var Router = require('restify-router').Router;
var router = new Router();
var db = require('../../db');
var resultFormatter = require("../../result-formatter");
var passport = require('../../passports/local-passport');
var AccountManager = require('buka-kamar-module').managers.auth.AccountManager;

router.post('/user', passport, (request, response, next) => {
    var account = request.user;
    var permissionMap = account.roles.map((role) => {
        return role.permissions.reduce((map, permission, index) => {
            var key = permission.unit.code;
            if (!map.has(key))
                map.set(key, 0);
            var mod = map.get(key);
            mod = mod | permission.permission;
            map.set(key, mod);

            return map;
        }, new Map());
    }).reduce((map, curr, index) => {
        curr.forEach((value, key) => {
            if (!map.has(key))
                map.set(key, 0);
            var mod = map.get(key);
            mod = mod | value;
            map.set(key, mod);
        });
        return map;
    }, new Map());

    var permission = {};
    permissionMap.forEach((value, key) => {
        permission[key] = value;
    });

    var jwt = require("jsonwebtoken");
    var token = jwt.sign({
        email: account.email,
        profile: account.profile,
        // roles: account.roles,
        permission: permission
    }, process.env.AUTH_SECRET);

    var result = resultFormatter.ok(apiVersion, 200, token);
    response.send(200, result);
});

router.post('/create/new-hotel', (request, response, next) => {
    db.get().then(db => {
            var manager = new AccountManager(db, {
                username: 'router'
            });

            var data = request.body;

            manager.create(data)
                .then(docId => {
                    response.header('Location', `${request.url}/${docId.toString()}`);
                    var result = resultFormatter.ok(apiVersion, 201);
                    response.send(201, result);
                })
                .catch(e => {
                    var error = resultFormatter.fail(apiVersion, 400, e);
                    response.send(400, error);
                });
        })
        .catch(e => {
            var error = resultFormatter.fail(apiVersion, 500, e);
            response.send(500, error);
        });
});
module.exports = router;
