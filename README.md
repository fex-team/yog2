# Yog2

## Yog2简介

TODO

## 快速入门

### 工具安装

如果还没有安装 [node](http://nodejs.org) 请先安装 [node](http://nodejs.org).

```bash
npm install -g yog2
```

### 创建一个Yog2项目

Yog2项目可以使用Yog2工具直接创建

```bash
# project目录
yog2 init yog
```

### 创建一个Yog2 App

Yog2提供了App拆分能力，即可以将一个站点或多个站点拆分为多个App，多个App可以部署至同一个Yog2项目中同时运行。

```bash
# project目录
yog2 init app
# prompt: Enter your app name:  (home)
```

### 安装Node一体化环境

此项仅适用于百度公司内部，用于安装线上Node基础环境，外部用户可以忽略，直接使用自带的Node环境

```bash
# project目录
yog2 init node-runtime
```

### 部署Yog2 App

```bash
# project目录
cd home
# home目录
yog2 release -d ../yog #将home app发布至同级的yog目录中
cd ..
```

### 启动Yog2项目

#### 默认启动

```bash
# project目录
cd yog
npm i
node ./bin/www
```

#### Node一体化环境启动

```bash
# project目录
cd yog
npm i #执行过可忽略
./bin/yog_control start
```

#### 调试模式启动

```bash
# project目录
cd yog
npm i #执行过可忽略
npm run-script debug
```

访问 [http://127.0.0.1:8080](http://127.0.0.1:8080) 即可查看运行效果

> 注意，如果端口8080被占用会提示启动异常EADDRINUSE，只需要调整bin/www文件中的默认端口即可
> 也可以设置PORT环境变量来调整启动端口

## Yog2特点

TODO

### App拆分

Yog2继承了FIS的项目拆分能力，但是在原有的前端项目拆分的能力上，更进一步的提供了**前后端一体App**的拆分能力，我们可以将一个功能模块的前后端代码在一个App中统一管理，从代码结构上推动功能模块之间松耦合，并且加快编译速度，减少分支合并工作，最终提高开发效率。

#### 目录规范

Yog2 App的目录规范可以结合 [创建一个Yog2 App](#创建一个Yog2 App) 创建的目录进行了解

```
├─client                 # 前端代码
│  ├─page               # 前端页面
│  ├─static             # 前端非模块化静态资源
│  │  ├─css
│  │  └─js
│  └─widget             # 前端组件
├─fis-conf.js            # FIS编译配置
└─server                 # 后端代码
    ├─action             # Action是指MVC中的路由动作，处理页面请求
    ├─lib                # 可以存放一些通用库
    ├─models             # 可以存放一些数据层代码，如后端API请求等
    └─router.js          # AppRouter路由，用于处理自动路由无法满足的需求
```

其中 `fis-conf.js`, `client/page`, `client/static`， `client/widget`, `server/action` , `server/router.js` 文件或目录是固定的目录规范，其余目录均可以根据自己系统进行调整

#### App部署

### 前端能力

#### FIS静态资源管理

我们扩展了Swig模板引擎的功能，实现了与fis-plus类似的后端静态资源管理能力，你可以通过一些标签来方便的进行细粒度静态资源管理。

##### require

##### widget

##### spage

##### uri

##### 辅助标签

- html
- head
- body
- script
- style


#### 前端组件化

#### Everything in FIS

### 后端能力

#### 启动初始化

#### 插件管理

##### 内置插件

##### 用户插件

##### 插件依赖

##### 插件配置项


#### 自动路由

##### Action

Action用于处理页面请求，一般我们会在Action中处理请求的参数，如querystring, cookie甚至upload files，然后将参数处理为 `server/models` 中的请求格式，调用 `server/models` 中的数据层获取数据后，指定后端模板和数据进行页面渲染。Action均存放在 `server/action` 中。

来点例子

```javascript
// /server/action/index.js
//引用models
var indexModel = require('../models/index.js');
//引用一些基础库
var util = require('../lib/util.js');

module.exports = function(req, res){
    //解析请求参数
    var id = req.query.id;
    indexModel.getProductByID(id, function(err, data){
        //异常处理
        if (err){
            next(err);
        }
        data.time = new Date(); //加工数据
        //渲染页面
        res.render('home/page/index.tpl', data);
    });
};
```

##### 自动路由规则

自动路由用于管理URL与action之间的映射关系，默认的路由规则为

```text
http://www.example.com/home/index => app/home/index.js
http://www.example.com/home/doc/detail => app/home/doc/detail.js
```
如果上述规则没有匹配成功，会尝试匹配同名文件夹下的index.js，即

```text
http://www.example.com/home/index => app/home/index/index.js
http://www.example.com/home/doc/detail => app/home/doc/detail/index.js
```

##### 默认配置

##### 路由扩展

- rootRouter

- appRouter

	appRouter是一个app的入口，可以理解为Express中的app，实际上功能也和Express中的App极为相似，可以用于加载App级别的中间件或者通用逻辑，也可以用于实现自动路由无法满足的URL设计需求。
	appRouter可以在 `server/router.js` 中修改
	
	```javascript
	module.exports = function(app){
	    // you can add app common logic here
	    // app.use(function(req, res, next){
	    // });
	
	    // also you can add custom action
	    // require /spa/some/hefangshi
	    // app.get('/some/:user', router.action('api'));
	    
	    // or write action directly
	    // app.get('/some/:user', function(res, req){});
	
	    // a restful api example
	    app.route('/book')
	        // PUT /cdcd/book/id
	        .put(router.action('book').put)
	        // GET /cdcd/book
	        .get(router.action('book'));
	
	    app.route('/book/id/:id')
	        // GET /cdcd/book/id
	        .get(router.action('book').get)
	        // DELETE /cdcd/book/id
	        .delete(router.action('book').delete);
	};
	```

##### 跨App调用

对于跨App的调用，我们建议慎重使用，最好只限定在其余App对Common App的调用，Common App中可以存放一些通用的组件。

```javascript
// 通过yog.require 可以跨App调用其余模块的后端脚本
var util = yog.require('common/libs/util.js');

// 通过yog.dispatcher 可以跨App获取Router与Action
var commonRouter = yog.disptahcer.router('common');
var error = commonRouter.action('error');
error= yog.dispatcher.action('common/error');
```

### BigPipe

### SPA

### Yog对象

#### yog.dispatcher

#### yog.require

#### yog.log

#### yog.ral
