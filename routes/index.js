var express = require('express');
var config = require('../config/config.js')
var request = require('request')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    request.get(config.server + '/admin/monitor/overallCount', function(error, response, data) {
        if (!error && response.statusCode == 200) {
            data = JSON.parse(data);
            console.log(data)
            res.render('index', { userCount: data.data.userCount , paperCount: data.data.paperCount, projectCount: data.data.projectCount });
        }
    });
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
            console.log(body)
            res.render('projectinfo', body.data);
        }
    })
})
// 项目完成度
router.get('/getProjectCompleted', function(req, res) {
    var projectNo = req.query.projectNo
    request({url : config.server + '/admin/monitor/getAllUserStatusByProjectNo?projectNo='+ projectNo}, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            var keys = []
            for (obj in body.data) {
                keys.push(obj)
            }
            console.log(keys)
            console.log(body.data)
            res.render('project', { data: body.data, mapKeys: keys});
        }
    })
})



// 创建项目
router.get('/createProject', function(req, res) {
    res.render('createProject')
})
// 插入数据库
router.post('/insertProject', function(req, res) {
    var data = JSON.parse(req.body.data);
    console.log(data);
    var options = {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36'
        },
        url: config.server + '/admin/project/create',//http://123.56.227.132:8080/admin/paper/create
        method: 'POST',
        json: true,
        body: data
    };
    request(options, function(error, response, data) {
        if (!error && response.statusCode == 200) {
            res.json('ok');
        }
    });
})

// 获取action列表
router.get('/getActionList', function(req,res) {
    request.get(config.server + '/admin/action/list', function(error, response, info) {
        if (error) res.json({ error: error });
        if (!error && response.statusCode == 200) {
            info = JSON.parse(info);
            console.log(info);
            res.json(info.data);
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
	res.render('createQuestionnaire')
})
//得到试卷
router.get('/getQuestion', function(req, res) {
    var paperId = req.query.paperId
    request.get(config.server + '/admin/paper/readDetail?paperId=' + paperId, function(err, response, data) {
        if (!err && response.statusCode == 200) {
            data = JSON.parse(data);
            res.render('questionnaire', { data: data.data });
        }
    });
})

// 创建试卷

router.post('/insert', function(req, res) {
    var data = JSON.parse(req.body.data);
    var options = {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36'
        },
        url: config.server + '/admin/paper/create',//http://123.56.227.132:8080/admin/paper/create
        method: 'POST',
        json: true,
        body: data
    };
    request(options, function(error, response, data) {
        if (!error && response.statusCode == 200) {
            res.render('admin', {});
        }
    });
})




module.exports = router;
