//const express = require('express');
//const app = express();
//const path = require('path');
//const port = 5321;
//const http = require('http').Server(app);
//const io = require('socket.io')(http);

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:5321",
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 5321;

//var htmlPath = path.join(__dirname, 'public');

app.use(express.static('public'));
app.use(require('cors')())

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/');
});

//python
const { spawn } = require('child_process');
var re = [];

//socket
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  //search request
  socket.on('search', (data)=>{
    console.log(data.query, data.id)
    var sessionID = data.id;
    re = [];
    //['program.py', 'data', 'data']
    const scrapeQ = spawn('python', ['scrapeQ.py', data.query]);

    //std functions
    scrapeQ.stdout.on('data', function (data) {
      console.log(`${data}`);
      //sconsole.log(typeof(data));
      re.push(String(data));
    });

    scrapeQ.stderr.on('data', function (data) {
      console.log(`stderror: ${data}`);
      socket.emit('queryerr', String(data));
    });

    scrapeQ.on('close', function (data) {
      console.log(`scrapeQ process exited with code ${data}`);
      io.to(sessionID).emit('results', re);
      //console.log(sessionID, re)
    });
  });

  //more request
  socket.on('more', (data)=>{
    var sessionID = data.id;
    //['program.py', 'data', 'data']
    const scrapeQ = spawn('python', ['scrapeQMORE.py', data.query, data.scrollamount]);

    var re = [];

    //std functions
    scrapeQ.stdout.on('data', function (data) {
      console.log(`${data}`);
      //sconsole.log(typeof(data));
      re.push(String(data));
    });

    scrapeQ.stderr.on('data', function (data) {
      console.log(`stderror: ${data}`);
      socket.emit('queryerr', String(data));
    });

    scrapeQ.on('close', function (data) {
      console.log(`scrapeQ process exited with code ${data}`);
      //io.to(sessionID).emit('moreresults', re);
      console.log(re)
      //console.log(sessionID, re)
    });
  });
});

var server = http.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
