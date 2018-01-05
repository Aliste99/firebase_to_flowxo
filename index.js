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
    
    //TODO: Check presence of auth tokens
    //TODO: If token present, create spreadsheet and send link,
    //if not generate link, send to user, generate tokens,
    // save tokens, create spreadsheet, send link
    
//    request('https://flowxo.com/hooks/a/j3kbdake?path=' + changedPost.responsePath + changedPost, { json: true }, (err, res, body) => {
//      if (err) { return console.log(err); }
//      console.log(body.url);
//      console.log(body.explanation);
//    });

});

function generateAuthLink(respPath, resultKey){
  return respPath + resultKey;
}

function createSpreadSheet(sheetData, respPath, tokens){
  
}

function sendChatMessage(message, respPath){
  
}