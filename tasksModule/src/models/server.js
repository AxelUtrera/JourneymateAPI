const express = require('express');
const cors = require('cors');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.middlewares();
        this.routes();
    }


    middlewares() {
        this.app.use(cors());
        //lectura y parseo del body
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

     

    routes() {
        this.app.use('/api/v1/task', require('../v1/routes/tasksRoutes'));
    }


    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`)
        })
    }
}
module.exports = Server;
