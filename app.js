var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();

/**
 * express-fileupload를 이용한 파일업로드
 */

let fileUploadPath = "c://dev/upload/";

app.set('views', __dirname + '/');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(fileUpload({
    limits: { fileSize: 1 * 1024 * 1024 } //파일업로드 용량 제한
}));


app.get('/', function (req, res) {
    res.render("upload.html");
});

app.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    let uploadFile = req.files.uploadFile;
    let fileName = req.files.uploadFile.name;

    uploadFile.mv(fileUploadPath+fileName, function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});

app.listen(3000, function () {
    console.log('==파일업로드 서버가 기동 되었습니다.(포트 3000)');
});
