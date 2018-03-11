#### 使用方式
	进入app执行npm install，安装相应的npm包

### nodemon
	安装nodemon，执行ndoemon
		http://blog.csdn.net/a419419/article/details/78831869
		node中的express框架，nodemon设置修改代码后服务自动重启
	
	
### node-sass安装
	去 Release 列表 找到对应的版本
	https://github.com/sass/node-sass/releases/tag/v4.7.2
	https://github.com/sass/node-sass/releases
	Ctrl+F 粘贴，找到那个文件，下载（必要的时候挂代理，浏览器下载通常都比 node 下载更快更稳定），然后文件存到一个稳定的路径，并复制路径
	设置sass路径 set SASS_BINARY_PATH=D:/nodejs/.nodes/win32-x64-57_binding.node

### mongod
	安装32位
	https://www.cnblogs.com/cnblogs-jcy/p/6734889.html

	安装32位的：
	　　Method2: 直接通过连接下载（这是版本3.2.4 地址：http://downloads.mongodb.org/win32/mongodb-win32-i386-3.2.4-signed.msi）

	在2015/3/17以前，MongoDB只有一个存储引擎，叫做MMAP，MongoDB3.0的推出使得MongoDB有了两个引擎：MMAPv1和WiredTiger。
	>D:\MongoDB\Server\3.2\bin>mongod --dbpath D:\mongodb\data\db --storageEngine=mmapv1

##### mongodb.config使用
	mongodb.config 文件内容为：
		dbpath=E:\mongodb\data\db
		logpath=E:\mongodb\data\log\mongodb.log

	用管理员身份打开cmd命令行，进入MongoDB安装目录的 bin目录下（我的是D:\MongoDB\Server\3.2\bin） ，输入如下的命令：
	>D:\MongoDB\Server\3.2\bin>mongod --config E:\mongodb\mongodb.config 
	也可以是命令（这样 就直接给加入到 Windows的服务起了个名字 还是挺有用的）：
	>D:\MongoDB\Server\3.2\bin>mongod --config E:\mongodb\mongodb.config  --install --serviceName "MongoDB"
	如图结果存放在日志文件中，查看日志发现已经成功。如果失败有可能没有使用管理员身份，遭到拒绝访问。

#### 其他
	D:\Program Files\mongoDB\bin>mongod --dbpath E:\mongodb\data\db --storageEngine=mmapv1 --journal --logpath "D:\mongodb\data\log\mongodb.log"  --install --serviceName "MongoDB"

	D:\Program Files\mongoDB\bin>net start MongoDB
	然后连接到mongodb数据库，执行这个命令：
	　 mongo
	　 下面就可以开始使用mongodb 了。

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

 