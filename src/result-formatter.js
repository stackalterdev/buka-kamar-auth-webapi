var ValidationError = require('buka-kamar-module').ValidationError;

function formatResult(apiVersion, statusCode, message, data, error) {
    var result = {
        apiVersion: apiVersion,
        statusCode: statusCode,
        message: message
    }

    if (error)
        result.error = error.errors;
    else if (data)
        result.data = data;

    return result;
}

module.exports = {
    ok: function(apiVersion, statusCode, data) {
        return formatResult(apiVersion, statusCode, 'ok', data, null);
    },

    fail: function(apiVersion, statusCode, error) {
        return formatResult(apiVersion, statusCode, error.message, null, error);
    }
}
