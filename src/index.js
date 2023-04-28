require('dotenv').config();
const Server = require('./models/server');
const initDataBase = require('./config/dbConfig');
const servidor = new Server();
servidor.listen();
initDataBase();


