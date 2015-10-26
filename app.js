var express = require('express');
var app = express();
var fs = require("fs");
var Promise = require('bluebird')
var readFile = Promise.promisify(require('fs').readFile);
var writeFile = Promise.promisify(require('fs').writeFile);

var bodyParser = require('body-parser');
var multer  = require('multer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: './tmp/'}).array('file'));

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/views/" + "index.htm" );
})
//with bluebird library
app.post('/file_upload', function (req, res) {
  var msgs = '';
  var counter = 0;
  req.files.forEach(function(element){
      var fileNameToWrite = __dirname + "\\uploads\\" + element.originalname;
      readFile(element.path).then(function(data){
        return writeFile(fileNameToWrite,data);
      })
      .then(function(){
        msgs += element.originalname + " Uploaded Successfully ";
      })
      .catch(function(){
        msgs += element.originalname + " Uploaded Failed Error while uploading: '"+ element.originalname +"' ";
      })
      .then(function(){
        console.log("Final Msgs: " + counter + msgs);
        counter=counter+1;
         if (counter == req.files.length) {
           res.end( JSON.stringify( msgs ));
         }
      });  
  },this);
});

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})

  //without bluebird library (alternate)
  //   function finish() {
  //   console.log("Final Msgs: " + msgs);
  //   res.end( JSON.stringify( msgs ) );
  //   }
  // var counter = 0;
  // req.files.forEach(function(element) {
  //  var fileNameToWrite = __dirname + "\\uploads\\" + element.originalname;
  //  fs.readFile( element.path, function (err, data) {
  //       fs.writeFile(fileNameToWrite, data, function (err) {
  //        if( err ){
  //             msgs += element.originalname + " Uploaded Failed Error: '"+ err +"' ";
  //        }
  //        else{
  //             msgs += element.originalname + " Uploaded Successfully ";
  //         }
          
  //         // We call the finish when we write the last file
  //        counter += 1;
  //        if (counter == req.files.length) {
  //            finish();
  //        }
          
  //      });
  //  });
  // },this);
//});