const winston = require('winston');


const Logger = winston.createLogger({
    transports:[
        new winston.transports.File({
            filename: 'app.log',
            level: 'error'
        })
    ]
});


exports.module = Logger;