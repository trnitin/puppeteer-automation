const express = require('express');
const app = express();
const Routes = require('./routes/route')
var cors= require('cors')
app.use(express.json());
var corsOptions = {
    origin: ["http://localhost:5173","*"],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
app.use(cors(corsOptions))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("ngrok-skip-browser-warning",true);
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });
app.use(Routes)

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
      console.log(error,"outer err")
      res.status(status).send(error);
  });
app.listen(8000,()=>{console.log('started on 8000')});