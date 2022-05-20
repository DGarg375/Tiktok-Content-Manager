'use strict'

const express = require("express");

const db = require("./sqlWrap");
const win = require("./pickWinner");

const fetch = require("cross-fetch");
const bodyParser = require('body-parser');

function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}

const app = express();
app.use(bodyParser.urlencoded({ extended: false}));

app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

app.use(express.text());

app.use(function(req, res, next) {
  console.log("body contains",req.body);
  next();
});

app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/MyVideos.html");
});

app.use(bodyParser.json());

app.post("/videoData", (req, res) =>{
  console.log("sending Response");
  let videoDetails = req.body;
  checkAndInsert(videoDetails, res);
});

app.get("/getMostRecent", (req, res) =>{
  getMostRecentVideo()
      .then(function(result2) {
    return res.send(result2);
      })
      .catch(function(err) {
        console.log("Get request error:", err);
      });
});

app.get("/getList", (req, res) => {
  dumpTable()
  .then(async function(response) {
    return res.send(response);
  })
  .catch(function(err) {
    res.send(err);
  });
});

app.post("/deleteData", (req, res) => {
  deleteAssignedRow(req.body)
  return res.send("Video deleted from database");
});

app.get("/getTwoVideos", async function(req,res) {
  let video1_rowID = getRandomInt(8);
  let video2_rowID = getRandomInt(8);
  while(video1_rowID == video2_rowID) {
    video2_rowID = getRandomInt(8);
  }
  const sql = "select * from VideoTable";
  const result = await db.all(sql);
  const finalResult = [];
  finalResult[0] = result[video1_rowID];
  finalResult[1] = result[video2_rowID];
  return res.send(finalResult);
});

app.post("/insertPref", async function(req, res) {
  const data = await req.body;
  console.log(await req.body);
  const sql = "insert into PrefTable (better, worse) values(?,?)";
  await db.run(sql, [data.better, data.worse]);
  const sql2 = "select * from PrefTable";
  const result = await db.all(sql2);
  if(result.length >= 15) {
    return res.send("pick winner");
  }
  else {
    return res.send("continue");
  }
});

app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
  let winner = await win.computeWinner(8,false);

  const sql = "select * from VideoTable where rowIdNum = ?";
  const winningVideoData = await db.get(sql, [winner]);
    return res.send(winningVideoData);
  } catch(err) {
    res.status(500).send(err);
  }
});

app.use(function(req, res){
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

async function checkAndInsert(v, res) {
  dumpTable()
  .then(function(result) {
    let n = result.length;
    if(n >= 8) {
      res.send("database full");
    }
    else {
      setFlag(result, result[n-1])
      .then(function() {
        insertData(v)
        .then(function() {
          dumpTable()
          .then(async function(result) {
            return res.send("Item added to database");
          });
        });
      });
    }
  });
}

async function setFlag(result, n) {
  if(result.length == 0) {
    return;
  }
  const sql3 = "update VideoTable set flag = FALSE where nickname = ?";
  await db.get(sql3, [n.nickname]);
}

async function insertData(v) {
  const sql = "insert into VideoTable(url, nickname, userid, flag) values(?,?,?,TRUE)";
      db.run(sql, [v.urlName, v.nickName, v.usrName]);
}

async function getMostRecentVideo() {
  const sql = "select * from VideoTable where flag = TRUE";
  let result2 = await db.get(sql);
  return result2;
}

async function dumpTable() {
  const sql2 = "select * from VideoTable";
  let result = await db.all(sql2);
  return result;
}

async function deleteAssignedRow(data) {
  dumpTable()
  .then(function(response){
    deleteRow(data);
  });
}

async function deleteRow(nicknameText) {
  const sql = "delete from VideoTable where nickname = ?";
  await db.run(sql, [nicknameText]);
}