var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var CORS = require('cors')();

/**
 * express-fileupload를 이용한 파일업로드
 */

let fileUploadPath = "/home/ifile/html/";

app.set('views', __dirname + '/');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(fileUpload({
    limits: { fileSize: 1 * 1024 * 1024 } //파일업로드 용량 제한
}));
app.use(CORS);

app.get('/', function (req, res) {
    res.render("upload.html");
});

app.post('/', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    let uploadFile = req.files.file;
    let fileName = req.files.file.name;
    var detailUploadPath = (req.param('detailUploadPath') == "" ? "" : req.param('detailUploadPath')+"/");

    uploadFile.mv(fileUploadPath+detailUploadPath+fileName, function(err) {
        if (err) {
		return "error";
	}
        //return res.status(500).send(err);
        res.send(fileName);
    });
});

app.listen(3001, function () {
    console.log('==파일업로드 서버가 기동 되었습니다.(포트 3001)');
});
