var google = require('googleapis');
var googleAuth = require('google-auth-library');
var sheets = google.sheets('v4');
var requestUrl = 'https://flowxo.com/hooks/a/nwyza36j';
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const request = require('request');
exports.sendToken = function(refAccessCode, snapshot, token) {
  refAccessCode.child(snapshot.key).update({
    "accessCode": snapshot.accessCode,
    "token": token,
    "status": "token-received"
  });
};

function sendAuthLink(oauth2Client, credentials, respPath) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var link = requestUrl + '?path=' + respPath + "&sourcetype=automessage";
  oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  
  console.log("generateAuthLink confirm");
  return redirectUrl + "&path=" + respPath + "&sourcetype=user";
  

  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state: respPath
  });

  console.log("sendAuthLink confirm");
  
  request({
    method: 'post',
    url: link,
    form: {
      "message" : authUrl,
      "path" : respPath
    },
    json: true,
  }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body.url);
    console.log(body.explanation);
  });
  
};


exports.sendSqlResultToFlowXO = function(request, requestUrl, snapshot, sqlResult){
  var post = snapshot.val();
  var respPath = post.responsePath;
  request({
    method: 'post',
    url: requestUrl,
    form: {
      "sqlresult": sqlResult,
      "path": respPath,
    },
    json: true,
  }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body.url);
    console.log(body.explanation);
  });
  console.log("Message sended");
}