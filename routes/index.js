var express = require('express')
var config = require('../config/config.js')
var request = require('request')
var pbkdf2 = require('pbkdf2')
var router = express.Router()

/* GET home page. */

router.get('/login', function(req, res) {
    res.render('login')
})

router.post('/login', function(req, res) {
    var name = req.body.name
    var password = req.body.password
    var requestDate = {
        password: pbkdf2.pbkdf2Sync(password, 'salt123', 1, 32, 'sha512').toString('hex'),
        account: name
    }
    console.log(requestDate)
    request.post({
            url: config.server + '/admin/login',
            form: requestDate
        },
        function(err, response, body){
            console.log('error', err)
            body = JSON.parse(body)
            console.log(body)
            if (!err && response.statusCode == 200) {
                if(body.ret) {
                    console.log('========>',response.headers.token)
                    res.cookie('islogin', response.headers.token, {maxAge: 60 * 1000})
                    res.redirect('/')
                }
            }
    })
})

router.get('/register', function(req, res) {
    res.render('register')
})

router.post('/register', function(req, res) {
    var name = req.body.name
    var password = req.body.password
    var adminType = req.body.adminType

    var requestDate = {
        password: pbkdf2.pbkdf2Sync('password', 'salt123', 1, 32, 'sha512').toString('hex'),
        account: name,
        adminType: adminType
    }
    console.log(requestDate)

    request.post({
            url: config.server + '/admin/createAdmin',
            form: requestDate
        },
        function(err, response, body){
            console.log('error', err)
            body = JSON.parse(body)
            if (!err && response.statusCode == 200) {
                if(body.ret) {
                    console.log('========>',response.headers.token)
                    res.cookie('islogin', response.headers.token, {maxAge: 60 * 1000})
                    res.redirect('/')
                }
            }
    })
})



router.use(function(req, res, next){
    if(req.cookies.islogin) return next()
    return res.redirect('/login')
})
router.get('/logout', function(req, res) {
    res.cookie('islogin', '', {maxAge: 60 * 1000})
    res.redirect('/')
})

router.get('/', function(req, res, next) {
    request.get({
            url: config.server + '/admin/monitor/overallCount', 
            headers: {
                token: req.cookies.islogin
            }
        }, function(error, response, body) {

        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            console.log(body)
            res.cookie('islogin', response.headers.token, {maxAge: 60 * 1000})
            res.render('index', { userCount: body.data.userCount , paperCount: body.data.paperCount, projectCount: body.data.projectCount });
        }
    });
});

// 加载项目管理
router.get('/project', function(req, res, next) {
	request.get({
            url: config.server + '/admin/project/list',
            headers: {
                token: req.cookies.islogin
            }
        }, function(error, response, data) {
        if (!error && response.statusCode == 200) {
            data = JSON.parse(data);
            res.cookie('islogin', response.headers.token, {maxAge: 60 * 1000})
            res.render('projectAll', { list: data.data });
        }
    });
})
// 查询项目 （通过NO查询）
router.get('/getProjectNo', function (req, res){
	var projectNo = req.query.projectNo;
    request({
            url: config.server + '/admin/project/projectDetail?projectNo=' + projectNo,
            headers: {
                token: req.cookies.islogin  
            }
        }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            console.log(body)
            res.cookie('islogin', response.headers.token, {maxAge: 60 * 1000})
            res.render('projectinfo', body.data);
        }
    })
})
// 项目完成度
router.get('/getProjectCompleted', function(req, res) {
    var projectNo = req.query.projectNo
    request({
            url : config.server + '/admin/monitor/getAllUserStatusByProjectNo?projectNo='+ projectNo,
            headers: {
                 token: req.cookies.islogin 
            }
        }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            var keys = []
            for (obj in body.data) {
                keys.push(obj)
            }
            res.cookie('islogin', response.headers.token, {maxAge: 60 * 1000})
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
            'token': req.cookies.islogin,
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
            res.cookie('islogin', response.headers.token, {maxAge: 60 * 1000})
            res.json('ok');
        }
    });
})

// 获取action列表
router.get('/getActionList', function(req,res) {
    request.get({
        url: config.server + '/admin/action/list',
        headers: {
            token: req.cookies.islogin
        }
    }, function(error, response, info) {
        if (error) res.json({ error: error });
        if (!error && response.statusCode == 200) {
            info = JSON.parse(info);
            console.log(info);
            res.cookie('islogin', response.headers.token, {maxAge: 60 * 1000})
            res.json(info.data);
        }
    })
})

// 试卷列表
router.get('/list', function(req, res, next) {
	request.get({
        url: config.server + '/admin/paper/list?paperName=',
        headers: {
            token: req.cookies.islogin
        }
    }, function(error, response, data) {
        if (!error && response.statusCode == 200) {
            data = JSON.parse(data)
            res.cookie('islogin', response.headers.token, {maxAge: 60 * 1000})
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
    request.get({
        url: config.server + '/admin/paper/readDetail?paperId=' + paperId,
        headers: {
            token: req.cookies.islogin
        }
    }, function(err, response, data) {
        if (!err && response.statusCode == 200) {
            data = JSON.parse(data);
            res.cookie('islogin', response.headers.token, {maxAge: 60 * 1000})
            res.render('questionnaire', { data: data.data });
        }
    });
})

// 创建试卷

router.post('/insert', function(req, res) {
    var data = JSON.parse(req.body.data);
    var options = {
        headers: {
            'token': req.cookies.islogin,
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
            res.cookie('islogin', response.headers.token, {maxAge: 60 * 1000})
            res.render('admin', {});
        }
    });
})




module.exports = router;
