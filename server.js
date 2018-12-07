var express = require('express');   //Express Web Server 
var bodyParser = require('body-parser'); //connects bodyParsing middleware
var formidable = require('formidable');
var path = require('path');     //used for file path
var fs =require('fs-extra');    //File System-needed for renaming file etc
var mv = require('mv');
var exec = require('child_process').exec;
var output = '';

var app = express();
app.use(express.static(path.join(__dirname, 'static')));

/* ========================================================== 
 bodyParser() required to allow Express to see the uploaded files
============================================================ */
//app.use(bodyParser({defer: true}));
app.use(bodyParser.urlencoded({
  extended: true
}));
 app.route('/upload')
 .post(function (req, res, next) {

  var form = new formidable.IncomingForm();
    //Formidable uploads to operating systems tmp dir by default
    //form.uploadDir = "./img";       //set upload directory
    form.keepExtensions = true;     //keep file extension

    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        console.log("form.bytesReceived");
        //TESTING
        console.log("file size: "+JSON.stringify(files.fileUploaded.size));
        console.log("file path: "+JSON.stringify(files.fileUploaded.path));
        console.log("file name: "+JSON.stringify(files.fileUploaded.name));
        console.log("file type: "+JSON.stringify(files.fileUploaded.type));
        console.log("astModifiedDate: "+JSON.stringify(files.fileUploaded.lastModifiedDate));

        //Formidable changes the name of the uploaded file
        //Rename the file to its original name
//        fs.rename(files.fileUploaded.path, '/home/ktenzer/openshift-ml-demo/'+files.fileUploaded.name, function(err) {
        mv(files.fileUploaded.path, '/home/ktenzer/openshift-ml-demo/'+files.fileUploaded.name, function(err) {

        if (err)
            throw err;
          console.log('renamed complete');  
        });
        exec('ls -a',function (err, stdout, stderr){
          //res.write(stdout.toString('utf8') + '\n\n');
          //console.log(stdout.toString('utf8') + '\n\n');
          //output = stdout.toString('utf8');
          output = stdout;
        });
        console.log(output);
        //res.write(output);
        res.write('blabla:');
        res.end();
    });
});
var server = app.listen(8080, function() {
console.log('Listening on port %d', server.address().port);
});
