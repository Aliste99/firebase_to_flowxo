var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';


var admin = require("firebase-admin");
const request = require('request');

var serviceAccount = require("./task-d7f04c329dd3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://task-3d21a.firebaseio.com/"
});

// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("sheets");

// Get the data on a post that has changed
ref.orderByChild("status").equalTo("new").on("child_added", function(snapshot, prevChildKey) {
  var changedPost = snapshot.val();
  console.log("The updated post title is " + changedPost.responsePath);
  console.log(changedPost.sqlResult);
  
  // Load client secrets from a local file.
  fs.readFile('./client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    sendAuthLink(JSON.parse(content), changedPost.responsePath);
  });
    
    //TODO: Check presence of auth tokens
    //TODO: If token present, create spreadsheet and send link,
    //if not generate link, send to user, generate tokens,
    // save tokens, create spreadsheet, send link
    
//    request('https://flowxo.com/hooks/a/qweqx773?path=' + changedPost.responsePath + changedPost, { json: true }, (err, res, body) => {
//      if (err) { return console.log(err); }
//      console.log(body.url);
//      console.log(body.explanation);
//    });

});

function sendAuthLink(credentials, respPath){
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  
  generateAuthLink(redirectUrl, respPath);
  
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state: respPath
  });
  
  console.log("sendAuthLink confirm");
  sendChatMessage(authUrl, respPath);
  
}

function generateAuthLink(authUrl, respPath){
  console.log("generateAuthLink confirm");
  return authUrl + "&path=" + respPath + "&sourcetype=user";
}

function createSpreadSheet(sheetData, respPath, tokens){
}

function sendChatMessage(message, respPath){
  var link = 'https://flowxo.com/hooks/a/xqejpypd?path='+ respPath + "&sourcetype=automessage";
  request({
        method:'post',
        url: link, 
        form: {"message":message,
               "path":respPath
              }, 
        json: true,
    }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body.url);
    console.log(body.explanation);
  });
  console.log("sendMessage confirm");
}