### 使用说明
    开发环境
        npm run nodemon
    
    ./public 中有两个测试页面
        http://localhost:3000/test-user-login-logout-session.html
        测试用户登录流程
        
        http://localhost:3000/test_file_up.html
        测试文件文件上传功能

    目录说明
        bin express生成,启动项目
        db  连接与操作数据库的逻辑
        public  静态目录
        routes  router.get('/api',....) 路由分流
        sessions    用户登录的session存储
        upload  文件上传后服务器存储目录
        util    工具函数
        views   模板文件夹 jade

### nodemon
	安装nodemon，执行ndoemon
		http://blog.csdn.net/a419419/article/details/78831869
		node中的express框架，nodemon设置修改代码后服务自动重启

### express 常用的API
	res.sendStatus(500);
	res.redirect('/admin/house');

### mongodb
#### 安装
	安装32位:
	    https://www.cnblogs.com/cnblogs-jcy/p/6734889.html
	    https://www.cnblogs.com/minily/p/9431609.html

	安装32位的：
	    直接通过连接下载（这是版本3.2.4 地址：http://downloads.mongodb.org/win32/mongodb-win32-i386-3.2.4-signed.msi）
	
	安装64位的:
	    https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2012plus-4.2.2.zip

        提高下载速度: http://dl.mongodb.org/dl/win32/x86_64
    
    注:
        在2015/3/17以前，MongoDB只有一个存储引擎，叫做MMAP，MongoDB3.0的推出使得MongoDB有了两个引擎：MMAPv1和WiredTiger。
        >D:\MongoDB\Server\3.2\bin>mongod --dbpath D:\mongodb\data\db --storageEngine=mmapv1
        
#### 使用
    创建几个文件夹具体如下：数据库路径（data目录）、日志路径（logs目录）和日志文件（logs/mongo.log文件）
    
    创建配置文件mongo.conf :
		dbpath=D:\MongoDB\mongodb\data #数据库路径  
        logpath=D:\MongoDB\mongodb\logs\mongo.log #日志输出文件路径  
        
        logappend=true #错误日志采用追加模式  
        journal=true #启用日志文件，默认启用  
        quiet=true #这个选项可以过滤掉一些无用的日志信息，若需要调试使用请设置为false 
        port=27017 #端口号 默认为27017 
        
	1. 直接启动MongoDB服务
       ./mongod --config  'D:\Program Files\mongodb\mongo.conf'

    2. 创建并启动MongoDB服务
       如果每次都如上操作，岂不是相当麻烦，按照如下命令来创建并启动MongoDB服务，就可以通过windows服务来管理MongoDB的启动和关闭了
       mongod –config “D:\Mongo\mongo.conf” –install –serviceName “MongoDB”
       net start MongoDB
       执行完之后，就可以去服务里看是否有成功创建了
       
       
	用管理员身份打开cmd命令行，进入MongoDB安装目录的 bin目录下（我的是D:\MongoDB\Server\3.2\bin） ，输入如下的命令：
	>D:\MongoDB\Server\3.2\bin>mongod --config E:\mongodb\mongodb.config 
	也可以是命令（这样 就直接给加入到 Windows的服务起了个名字 还是挺有用的）：
	>D:\MongoDB\Server\3.2\bin>mongod --config E:\mongodb\mongodb.config  --install --serviceName "MongoDB"
	如图结果存放在日志文件中，查看日志发现已经成功。如果失败有可能没有使用管理员身份，遭到拒绝访问。

#### 注册为服务
	D:\Program Files\mongoDB\bin>mongod --dbpath E:\mongodb\data\db --storageEngine=mmapv1 --journal --logpath "D:\mongodb\data\log\mongodb.log"  --install --serviceName "MongoDB"
	D:\Program Files\mongoDB\bin>net start MongoDB
	
	然后连接到mongodb数据库，执行这个命令：
	mongo

#### MongoDB客户端
    RoboMongo现在已经改名为robo 3t了
    MongoDB Compass
    Mongo Management Studio

#### mongooseJS
    使用教程    https://segmentfault.com/blog/dorayu?tag=mongodb
    文档        http://www.mongoosejs.net/docs/guide.html
    
#### 手动启动执行文件.bat
    cmd /k "cd /d D:\Program Files\mongodb\bin && mongod.exe --config  "D:\Program Files\mongodb\mongo.conf""

### Express 应用生成器
    http://www.expressjs.com.cn/starter/generator.html
    $ npm install express-generator -g

    然后安装所有依赖包：

    $ cd myapp 
    $ npm install
    启动这个应用（MacOS 或 Linux 平台）：

    $ DEBUG=myapp npm start
    Windows 平台使用如下命令：

    > set DEBUG=myapp & npm start

### 文件上传
#### multer中间件
	Multer是Express官方推出的，用于Node.jsmultipart/form-data请求数据处理的中间件。
	它基于busboy构建，可以高效的处理文件上传，但并不处理multipart/form-data之外的用户请求。
	Multer在解析完请求体后，会向Request对象中添加一个body对象和一个file或files对象（上传多个文件时使用files对象 ）。其中，body对象中包含所提交表单中的文本字段（如果有），而file(或files)对象中包含通过表单上传的文件。

	npm install multer --save

#### HTML 通过form表单提交上传文件：
	form表单中enctype="multipart/form-data"的意思，是设置表单的MIME编码。默认情况，这个编码格式是"application/x-www-form-urlencoded"，不能用于文件上传；只有使用了multipart/form-data，才能完整的传递文件数据。
	
	有时，在网络编程过程中需要向服务器上传文件。Multipart/form-data是上传文件的一种方式。

	Multipart/form-data其实就是浏览器用表单上传文件的方式。最常见的情境是：在写邮件时，向邮件后添加附件，附件通常使用表单添加，也就是用multipart/form-data格式上传到服务器。
	
	<form action="test_upload" method="post" enctype="multipart/form-data">
		<input type="text" id="pwdword1" name="pwdword">
		<input type="file" name="photo1" required accept=".jpg,.png" />
		<input type="file" name="photo2" required accept=".jpg,.png"  multiple/>
		<button type="submit" class="btn btn-primary">提交</button>
	</form>

#### HTML 通过ajax实现文件上传：
	1. 通过document.getElementById("FileUpload").files[0]获取fileObj
	2. 存储到new FormData().append(file,fileobj)
	3. ajax post 方式提交请求：data:formdata

#### node
	添加multer中间件：
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));// 普通POST数据

		let multer = require('multer')({ dest: './upload/' });
		app.use(multer.any());// 文件POST数据
	
	获取请求内容，在使用中，如果仅需要处理multipart表单中的文本字段，可以使用multer中的.single() .array()或fields()方法。：
		router.post("/test_upload", function (req, res, next) {
			console.log('req', req.body); // req.body 对象中是表单中提交的文本字段(如果有)
			console.log('req', req.files); // req.file 是 `avatar` 文件
		})

	在使用中，如果仅需要处理multipart表单中的文本字段，可以使用multer中的.single() 、 .array()或fields()方法。
		如，可以像下面这样使用.array()方法：
		var express = require('express')
		var app = express()
		var multer = require('multer')()
		app.post('/profile', multer.array(), function (req, res, next) {
			// req.body 中包含文本字段
		})

#### multer解析完上传文件后，会被保存为一个包含以下字段的对象：
		fieldname - 表单提交的文件名(input控件的name属性)
		originalname - 文件在用户设备中的原始名称
		encoding - 文件的编码类型
		mimetype - 文件的Mime类型
		size - 文件的大小
		destination - 文件的保存目录(DiskStorage)
		filename - 文件在destination中的名称(DiskStorage)
		path - 上传文件的全路径(DiskStorage)
		buffer - 文件对象的Buffer(MemoryStorage)
		
