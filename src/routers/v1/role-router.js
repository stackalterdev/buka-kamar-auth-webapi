const apiVersion = '1.0.0';
var Router = require('restify-router').Router;
var router = new Router();
var RoleManager = require('buka-kamar-module').managers.auth.RoleManager;
var db = require('../../db');
var resultFormatter = require("../../result-formatter");
var passport = require('../../passports/jwt-passport');

router.get("/", passport, function(request, response, next) {
    db.get().then(db => {
            var manager = new RoleManager(db, {
                username: 'router'
            });

            var query = request.query;
            query.filter = !query.filter ? {} : JSON.parse(query.filter);

            manager.read(query)
                .then(docs => {
                    var result = resultFormatter.ok(apiVersion, 200, docs.data);
                    delete docs.data;
                    result.info = docs;
                    response.send(200, result);
                })
                .catch(e => {
                    var error = resultFormatter.fail(apiVersion, 500, e);
                    response.send(400, error);
                });
        })
        .catch(e => {
            var error = resultFormatter.fail(apiVersion, 500, e);
            response.send(500, error);
        });
})


router.get('/:id', passport, (request, response, next) => {
    db.get().then(db => {
            var manager = new RoleManager(db, {
                username: 'router'
            });

            var id = request.params.id;

            manager.getSingleById(id)
                .then(doc => {
                    var result = resultFormatter.ok(apiVersion, 200, doc);
                    response.send(200, result);
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

router.post('/', passport, (request, response, next) => {
    db.get().then(db => {
            var manager = new RoleManager(db, {
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

router.put('/:id', passport, (request, response, next) => {
    db.get().then(db => {
            var manager = new RoleManager(db, {
                username: 'router'
            });

            var id = request.params.id;
            var data = request.body;

            manager.update(data)
                .then(docId => {
                    var result = resultFormatter.ok(apiVersion, 204);
                    response.send(204, result);
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

router.del('/:id', passport, (request, response, next) => {
    db.get().then(db => {
            var manager = new RoleManager(db, {
                username: 'router'
            });

            var id = request.params.id;
            var data = request.body;

            manager.delete(data)
                .then(docId => {
                    var result = resultFormatter.ok(apiVersion, 204);
                    response.send(204, result);
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