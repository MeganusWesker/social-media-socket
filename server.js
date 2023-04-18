const http = require('http')
const express = require('express');
const app  = express();
const server=http.createServer(app);
const {Server} =require('socket.io');
const {config} =require('dotenv');


config({path:"config.env"});


module.exports.io=new Server(server,{
  cors:{
      origin:'*'
  },
  debug: false
});



const {ioHandler} =require('./socketHandler');
ioHandler();

app.get('/', (req, res) => {
  res.send('<h1>Working</h1>');
});



server.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});