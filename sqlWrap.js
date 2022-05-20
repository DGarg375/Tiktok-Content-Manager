/* Wraps sqlite commands get,use, and all, so that they use Promises, and can be used with async-await */

'use strict'

const sql = require('sqlite3');
const util = require('util');

const db = new sql.Database("videos.db");

db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);

initTables()
  .catch(function(err) {
    console.log("database table creation error", err);
  });

async function initTables () {
  
  let result1 =  await checkIfThere("VideoTable");
  if (!result1) {
    console.log("Creating video table");
    await createVideoTable();
  }

  let result2 = await checkIfThere("PrefTable");
  if (!result2) {
    console.log("Creating preferences table");
    await createPrefTable();
  } else {
    await deleteEverythingPrefs();
  }
}


async function checkIfThere(table) {
console.log("checking for",table);

let cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name = ? ";
let result = await db.get(cmd,[table]);
if (result == undefined) { return false;} 
else { return true; }
}

async function createVideoTable() {
const cmd = 'CREATE TABLE VideoTable (rowIdNum INTEGER PRIMARY KEY, url TEXT, nickname TEXT, userid TEXT, flag INTEGER)';
  
await db.run(cmd);
console.log("made VideoTable");
}

async function createPrefTable() {
const cmd = 'CREATE TABLE PrefTable (rowIdNum INTEGER PRIMARY KEY, better INTEGER, worse INTEGER)';
  
await db.run(cmd);
console.log("made PrefTable");
}

async function deleteEverythingPrefs () {
  await db.run("delete from PrefTable");
  await db.run("vacuum");
}

module.exports = db;
