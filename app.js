var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

/**
 * express-fileupload를 이용한 파일업로드
 */

let fileUploadPath = "/home/ifile/html/";

app.set('views', __dirname + '/');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(fileUpload({
    limits: { fileSize: 1 * 1024 * 1024 }
}));

//크로스 도메인 대비 설정
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function (req, res) {
    res.render("upload.html");
});

app.post('/', function(req, res) {
    //console.log(req);
    var resultJson = "";
    if (!req.files) {
	resultJson = '{ "code" : -1, "message": "업로드할 파일이 없습니다.", "result" : {}}';
        return res.send(resultJson);
    }

    let uploadFile = req.files.file;
    let fileName = req.files.file.name;
    var detailUploadPath = (req.body.detailUploadPath == "" ? "" : req.body.detailUploadPath+"/");
    var uploadFilename = (req.body.uploadFilename == "" ? "" : req.body.uploadFilename)+getFileExt(fileName);
    var fullUploadPath = fileUploadPath+detailUploadPath;

    if (!fs.existsSync(fullUploadPath)) {
	mkdirp(fullUploadPath, function(err) {});
	console.log("==해당 폴더가 없어서 생성 하였습니다.");
    }

    uploadFile.mv(fullUploadPath+(uploadFilename == "" ? fileName:uploadFilename), function(err) {
        if(err) {
		resultJson = '{ "code" : -1, "message": "'+err+'", "result" : {}}';
        	return res.send(resultJson);
	}
	console.log("==파일업로드가 완료되었습니다.");
	resultJson = '{ "code" : 0, "message": "성공", "result" : {"originFilename": "'+fileName+'","uploadFilename": "'+(uploadFilename == "" ? fileName:uploadFilename)+'" }}';
        return res.send(resultJson);        
    });
});

app.listen(3001, function () {
    console.log('==파일업로드 서버가 기동 되었습니다.(포트 3001)');
});


function getFileExt(_filename) {
	return (_filename.split(".").length > 1 ? "."+_filename.split(".")[1] : "");
}
