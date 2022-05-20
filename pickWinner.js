'use strict'

/*********** 
This module provides one method, computeWinner(n,testing).
Given preference data in the database PrefTable, it computes pageranks for all the videos, and returns the one with the highest rank.
The argument n is the number of videos in the database.
The argument testing is Boolean.  If true, it does not look for data in PrefTable, but instead makes up random fake preference data to test with.
***************/

module.exports = {
  computeWinner: computeWinner
}

let Pagerank = require('pagerank-js');
const util = require('util');
Pagerank = util.promisify(Pagerank);

const db = require('./sqlWrap');

async function computeWinner(n,testing){

  let keyList = await getKeyList();
  
  let prefs = [];

  if (testing) {
    console.log("making fake preference data for testing");
    prefs = await makeUpFakePreferences(n,2*n,keyList);
  }

  else {
    prefs = await getAllPrefs();
  }

let nodes = makeDirectedGraph(prefs,n,keyList);

let linkProb = 0.85 
let tolerance = 0.0001 

let results = await Pagerank(nodes, linkProb, tolerance);

let i = results.indexOf(Math.max(...results));

console.log("winner",i,"rowIdNum",keyList[i]);

return keyList[i];
}


function makeDirectedGraph(prefs,n,keyList) {

  let graph = {};

  for (let i=0; i<keyList.length; i++) {
    graph[keyList[i]] = [];
  }

  for (let i=0; i<prefs.length; i++) {
    let b = prefs[i].better;
    let w = prefs[i].worse;
    graph[w].push(b);
  }

  let translate = {};
  for (let i=0; i<keyList.length; i++) {
    translate[keyList[i]] = i;
  }

  const adjList = [];
  for (let i=0; i<keyList.length; i++) {
    let key = keyList[i];
    let outgoing = graph[key];

    let newoutgoing = outgoing.map(function (x) {
      return translate[x];
    });
    adjList.push(newoutgoing);
  }
  return adjList;
}

async function makeUpFakePreferences (n,p,keyList) {
  
  
  let prefs = []; 
  for (let i=0; i<p; i++) {
    let a = keyList[getRandomInt(n)];
    let b = keyList[getRandomInt(n)];
    if (a != b) {
      prefs.push({
        id: i,
        better: a,
        worse: b
      });
    }
  }
  return prefs;
}

function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  return n;
}

async function getKeyList () {
  let cmd = "SELECT rowIdNum FROM VideoTable;"
  let keyObjList = await db.all(cmd);
  let keyList = [];
  for (let i=0; i<keyObjList.length; i++)   {
    keyList.push(keyObjList[i].rowIdNum);
  }
  return keyList;
}

async function getAllPrefs() {
  const dumpCmd = "SELECT * from PrefTable";
  
  try {
    let prefs = await db.all(dumpCmd);
    return prefs;
  } catch(err) {
    console.log("pref dump error", err);
  }
}

async function getAllVideos() {
  const dumpCmd = "SELECT * from VideoTable";
  
  try {
    let videos = await db.all(dumpCmd);
    return videos;
  } catch(err) {
    console.log("video dump error", err);
  }
}

async function insertPreference(i,j) {
  
const insertCmd = "INSERT INTO PrefTable (better,worse) values (?, ?)";
  
   try {
    await db.run(insertCmd, [i,j]);
  } catch(error) {
    console.log("pref insert error", error);
  }
}
