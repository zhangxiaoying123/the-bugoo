'use strict';

var express = require('express');
var path = require('path');
var port = process.env.PORT || 3017;
var app = express();

// 最后执行静态文件服务
var staticPathClient, staticPathPublic, staticPathUpload;


staticPathPublic = path.resolve(__dirname, './public');
app.use('/public', express.static(staticPathPublic));
staticPathClient = path.resolve(__dirname, './client');
app.use('/client', express.static(staticPathClient));
staticPathUpload = path.resolve(__dirname, './upload');
app.use('/upload', express.static(staticPathUpload));


app.listen(port);

console.log('lhapptool started on port ' + port);

app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, './client/views/main/login.html'));
})