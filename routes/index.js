var express = require('express');
var config = require('../config/config.js')
var request = require('request')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 加载项目管理
router.get('/project', function(req, res, next) {
	console.log(config.server)
	request.get(config.server + '/admin/project/list', function(error, response, data) {
        if (!error && response.statusCode == 200) {
            data = JSON.parse(data);
            res.render('projectAll', { list: data.data });
        }
    });
})
// 查询项目 （通过NO查询）
router.get('/getProjectNo', function (req, res){
	var projectNo = req.query.projectNo;
    request({ url: config.server + '/admin/project/projectDetail?projectNo=' + projectNo }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            res.render('project', body.data);
        }
    })
})

// 试卷列表
router.get('/list', function(req, res, next) {
	request.get(config.server + '/admin/paper/list?paperName=', function(error, response, data) {
        if (!error && response.statusCode == 200) {
            data = JSON.parse(data)
            res.render('questionnaires', { list: data.data })
        }
    })
})

// 创建试卷
router.get('/new', function(req, res) {
	console.log('1231312')
	res.render('questionnaire')
})


module.exports = router;