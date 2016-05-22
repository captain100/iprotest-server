var env = process.env.NODE_ENV || 'development';
var config = null;
if(null === config){
	if(env === 'development'){
		config = {
			url:'http://www.baidu.com',
			server: "http://10.251.1.46:8080"
		}

	}else if(env === 'testing'){
		config = {
			url:'http://www.jikexueyuan.com',
			server: "http://123.56.126.231:8080"
		}
	}else{
		config = {
			url:'http://sz.xiaoyun.com/',
			server: "http://10.251.1.46:8080"
		}
	}
}

module.exports = config;