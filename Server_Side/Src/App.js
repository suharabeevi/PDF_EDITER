const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan')
const expressConfig = require('./Config/Express'); 
const dbConnect=require('./Config/Connection')
const serverConfig = require('./Config/Server');
const configKeys = require('./Config');
var usersRouter = require('./Routes/UserRouter');
// Create an Express application
// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));

// Use express-session middleware
// app.use(session({
//     secret: 'keyboard cat',
//     key: 'user_id',
//     resave: false,
//     saveUninitialized : false,
//     cookie : {
//       maxAge : 60000000
//     }
//   }));
// Create an HTTP server and pass the Express app to it
const server = http.createServer(app);
dbConnect();
expressConfig(app);
// Assuming serverConfig is a function that configures your server
serverConfig(server).startServer();

app.use("/api/user", usersRouter);


// catch 404 and forward to error handler




