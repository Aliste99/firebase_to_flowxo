var admin = require("firebase-admin");
const request = require('request');

var serviceAccount = require("./task-d7f04c329dd3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://task-3d21a.firebaseio.com/"
});


// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("messages");

// Get the data on a post that has changed
ref.on("child_changed", function(snapshot) {
  var changedPost = snapshot.val();
  console.log("The updated post title is " + changedPost.responsePath);
  
    request('https://flowxo.com/hooks/a/brvvb2vb?name=We%20did%20it', { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      console.log(body.url);
      console.log(body.explanation);
    });
  
});