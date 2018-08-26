module.exports = {
    get: function() {
        return new Promise((resolve, reject) => {
            var factory = require('mongo-factory');
            factory.getConnection(process.env.DB_CONNECTIONSTRING)
                .then(db => {
                    resolve(db);
                })
                .catch(e => {
                    reject(e);
                })
        }) 
    }
}