const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressConfig = require('./Config/Connection'); 
const dbConnect=require('./Config/Connection')
const serverConfig = require('./Config/Server');
const configKeys = require('./Config');

// Create an Express application
const app = express();
app.use(cors()); // This middleware should be used directly on the app object

// Create an HTTP server and pass the Express app to it
const server = http.createServer(app);
dbConnect();
expressConfig(app);
// Assuming serverConfig is a function that configures your server
serverConfig(server).startServer();


