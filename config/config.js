var env = process.env.NODE_ENV || 'production';
var config = null;
if(null === config){
	if(env === 'production'){
		config = {
			url:'http://www.baidu.com',
			server: "http://123.56.126.231:8080"
		}

	}else if(env === 'testing'){
		config = {
			url:'http://www.jikexueyuan.com',
			server: "http://123.56.126.231:8080"
		}
	}else if(env === 'dev'){
		config = {
			url:'http://www.jikexueyuan.com',
			server: "http://192.168.1.108:8081"
		}
	}else{
		config = {
			url:'http://sz.xiaoyun.com/',
			server: "http://10.251.1.46:8080"
		}
	}
}

module.exports = config;