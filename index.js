var fs = require('fs');
var oauth2Client;
var mySQL_business;
var mySQL_persons;
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

var admin = require("firebase-admin");
var serviceAccount = require("./task-d7f04c329dd3.json");

var db = admin.database();
var refSheets = db.ref("sheets");
var refAccessCode = db.ref("access-code");
var refInputData = db.ref("inputdata");

var sender = require("./sender_module.js");
var sqlModule = require("./sql_module.js");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://task-3d21a.firebaseio.com/"
});

// Get a database reference to our posts

refInputData.orderByChild("status").equalTo("new").on("child_added", function(snapshot, prevChildKey) {
  var post = snapshot.val();
  var sqlQuery  = sqlModule.setSqlQuery(post);
  var sqlQueryPersons = sqlModule.setSqlQueryPersons(post);
  var sqlResult;
  console.log("vars completed");
  
  sqlModule.setConnection(mySQL_business, mySQL_persons);
  
  mySQL_persons.connect(function(err) {
    if(err) throw console.log(err);
    console.log("mySQL_persons connected!");
    if(sqlQueryPersons){
      mySQL_persons.query(sqlQueryPersons, function(err, result) {
        if(err) throw err;
        console.log(result);
        var personName = result.fullName;
        if(personName){
          var query = "(SELECT * FROM Links LEFT JOIN Pages ON Links.LinkID = Pages.Links_LinkID " + 
              "WHERE HeadName LIKE '%" + personName + "%')"+
              " UNION " +
              "(SELECT * FROM Links LEFT JOIN Pages ON Links.LinkID = Pages.Links_LinkID " + 
              "WHERE Founders LIKE '%" + personName + "%')";
          mySQL_business.query(query, function (err, result) {
          if (err) throw err;
          console.log(result);
          sqlResult = result;
          updateFirebaseData(snapshot, sqlResult);
          sender.sendSqlResultToFlowXO(snapshot, sqlResult);
          });
        }  
      });
    }
  });
  mySQL_business.connect(function(err) {
    if (err) throw console.log(err);
    console.log("mySQL_business connected!");
    if(sqlQuery){
      mySQL_business.query(sqlQuery, function (err, result) {
        if (err) throw err;
        console.log(result);
        sqlResult = result;
        sender.sendSqlResultToFlowXO(snapshot, sqlResult);
        updateFirebaseData(snapshot, sqlResult);
      });
    }
  });
  
});

// Get the data on a post that has changed
refSheets.orderByChild("status").equalTo("new").on("child_added", function(snapshot, prevChildKey) {
  var changedPost = snapshot.val();
  //console.log("The updated post title is " + changedPost.responsePath);
  console.log(changedPost.sqlResult);
  var respPath = changedPost.responsePath;

  for (var i = 0; i < 27; i++) {
    respPath = respPath.substr(1);
  }

  // if (token == null){
  // Load client secrets from a local file.
  fs.readFile('./client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    sender.sendAuthLink(oauth2Client, JSON.parse(content), respPath);
  });
});

refAccessCode.orderByChild("status").equalTo("new").on("child_added", function(snapshot, prevChildKey) {
  var changedPost = snapshot.val();
  var code = changedPost.accessCode;
  if (oauth2Client != null) {
    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
      }
      else sender.sendToken(refAccessCode, changedPost, token);
    });
  }
});

function updateFirebaseData(snapshot, sqlResult){
  refInputData.child(snapshot.key).update({
    "status": "sqlResult received",
    "result": sqlResult
  });
}