module.exports = {
    connect: function () {
        var mysql = require('mysql');
        var link = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'runthing'
        });

        link.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            } else {
                return link;
            }
        });
    }
};