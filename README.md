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
│  ├─page                # 前端页面
│  ├─static              # 前端非模块化静态资源
│  │  ├─css
│  │  └─js
│  └─widget              # 前端组件
├─fis-conf.js            # FIS编译配置
└─server                 # 后端代码
    ├─action             # Action是指MVC中的路由动作，处理页面请求
    ├─lib                # 可以存放一些通用库
    ├─model             # 可以存放一些数据层代码，如后端API请求等
    └─router.js          # AppRouter路由，用于处理自动路由无法满足的需求
```

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
-  标签
- head
- body
- script
- style


#### 前端组件化

### 后端能力

#### 启动初始化

#### 插件管理

##### 内置插件

##### 用户插件

##### 插件依赖

##### 插件配置项

##### 请求处理

页面请求会经由路由转发至action处理，一般我们会在action中处理请求的参数，如querystring, cookie甚至upload files，然后将参数处理为数据层模块需要的参数格式，调用数据层模块获取数据后，指定后端模板和数据进行页面渲染。

> action均存放在 `server/action` 中。

来点例子

```javascript
// /server/action/index.js
//引用数据层模块
var indexModel = require('../model/index.js');
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

#### 自动路由

##### 默认配置

自动路由用于管理url与action之间的映射关系，默认的路由规则为

```text
http://www.example.com/home/index => app/home/index.js
http://www.example.com/home/doc/detail => app/home/doc/detail.js
```
如果上述规则没有匹配成功，会尝试匹配同名文件夹下的index.js，即

```text
http://www.example.com/home/index => app/home/index/index.js
http://www.example.com/home/doc/detail => app/home/doc/detail/index.js
```

##### 路由扩展

Yog2的自动路由是在Express的路由功能上扩展而来，因此Express路由提供的功能均可以在Yog2中使用。

###### rootRouter
	
rootRouter是用于管理Yog2项目的根路由，根路由可以请求发往App之前就进行干预。

> appRouter可以在 `conf/yog/dispatcher.js` 中修改
> router更多的使用方法可以参考 [Express文档](http://expressjs.com/4x/api.html#router)

你可以为一个app设置一个别名

```javascript
router.use('/custom', yog.dispatcher.router('home'))
// http://www.example.com/custom => app/home/index/index.js
```

你可以直接建立一个特殊的URL

```javascript
router.get('/somespecial', yog.dispatcher.action('home/doc/detail'))
// http://www.example.com/somespecial => app/home/doc/detail.js
```

你也可以在此处将router当成app使用，加载任意中间件

```javascript
router.use(function(req, res, next){
});
```

###### appRouter

appRouter用于管理进入App后的请求分发，可以理解为Express中的app，实际上功能也和Express中的App极为相似，在这里你可以加载App级别的中间件或者通用逻辑，也可以用于实现自动路由无法满足的URL设计需求。

> appRouter可以在 `server/router.js` 中修改。

> router更多的使用方法可以参考 [Express文档](http://expressjs.com/4x/api.html#router)

```javascript
module.exports = function(router){
    // you can add app common logic here
    router.use(function(req, res, next){
    });

    // also you can add custom action
    // request /spa/some/hefangshi
    router.get('/some/:user', router.action('api'));
    
    // or write action directly
    router.get('/some/:user', function(res, req){});

    // a restful api example
    router.route('/book')
        // PUT /cdcd/book/id
        .put(router.action('book').put)
        // GET /cdcd/book
        .get(router.action('book'));

    router.route('/book/id/:id')
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

### Bigpipe

Bigpipe的应用场景在于解决页面中某个模块的数据获取时间较长，但是又不希望这个模块阻塞其余模块快速渲染的需求。一般这种情况我们可以使用Ajax请求异步数据后通过前端模板渲染的方式解决，但是通过Bigpipe我们可以在不增加额外请求的前提下利用Chunk输出来实现无阻塞的渲染。关于Bigpipe更多的内容可以参考[Facebook网站的Ajax化、缓存和流水线](http://velocity.oreilly.com.cn/2010/index.php?func=session&name=Facebook%E7%BD%91%E7%AB%99%E7%9A%84Ajax%E5%8C%96%E3%80%81%E7%BC%93%E5%AD%98%E5%92%8C%E6%B5%81%E6%B0%B4%E7%BA%BF)

> 需要注意的是并不是所有场景都适合使用Bigpipe，只有当一个页面需要向多个系统请求数据，并且后端系统无法提供一致的返回时间保证时，使用Bigpipe才会有较大的性能提升。

使用Yog2可以方便的引入BigPipe能力，Yog2中BigPipe的最小单位是widget，我们只需要简单的将某个widget设置为bigpipe模式，再为其绑定数据获取模式就可以实现widget的Bigpipe加载能力。

首先，可以直接部署DEMO来体验一下BigPipe的功能

```bash
# project目录
yog2 init spa
cd spa
yog2 release -d ../yog
```

在重启yog2后，访问 http://127.0.0.1:8080/spa 即可体验Yog2中的BigPipe能力

启用Bigpipe只需要三个步骤

1. 确保 `/yog/conf/yog/views.js` 中的 `bigpipe` 设置为true (默认属性)
2. 在引用widget时设置 `mode="async"` 开启Bigpipe模式

	```tpl
	{% widget "spa:widget/bigpipe/bigpipe.tpl" id="bigpipe" mode="async" %}
	```
	
3. 在action设置渲染数据时，绑定widget的数据获取方式

	```javascript
	res.bigpipe.bind('bigpipe', function(cb){
        setTimeout(function(){
            cb(null, {
                bigpipeTime: (new Date()).toString()
            });
        }, 2000);
    });
	```

### Yog对象

Yog2暴露了一个名为 `yog` 的全局变量，方便一些系统功能的挂载和调用。

#### yog.dispatcher

`yog.dispatcher` 是Yog2的自动路由处理器，通过 `yog.dispatcher` 可以方便的获取App路由与执行器

```javascript
var commonRouter = yog.disptahcer.router('common');
var error = commonRouter.action('error');
error= yog.dispatcher.action('common/error');
```

它的应用场景有很多，最常用的有

##### 设置router别名

Yog2默认是以App的`fis-conf.js`中namespace配置为router名称，如果希望自动路由可以使用其他名称访问App，那么就需要在rootRouter中设置路由的别名

```javascript
router.use('/custom', yog.dispatcher.router('home'))
// http://www.example.com/custom => app/home/index/index.js
```

##### 设置appRouter

Yog2的自动路由是根据URL查找同名文件，如果有一些特别的URL希望更强的定制能力，那么可以通过appRouter进行设置

> appRouter可以在 `server/router.js` 中修改。

```javascript
module.exports = function(router){
    // request /spa/some/hefangshi = /spa/api.js
    router.get('/some/:user', yog.dispatcher.action('spa/api'));
};
```

##### Action调用

我们也可以在Action代码中直接调用其他Action进行页面请求处理

```javascript
// spa/action/some.js
module.exports = function(req, res, next){
    yog.dispatcher.action('spa/api')(req, res, next);
};
```

#### yog.require

`yog.require` 提供了跨App的require能力，具体可以参考[跨App调用](#跨App调用)

#### yog.log

`yog.log` 提供了日志记录能力

```javascript
yog.log.fatal('some fatal);
yog.log.warning('some warning);
yog.log.notice('some notice);
yog.log.trace('some trace);
yog.log.debug('some debug);
```

#### yog.ral

`yog.ral` 提供了后端API请求能力

```javascript
var r = yog.ral('SOME_SERVICE', {
    data: {
        id: 1
    }
});

r.on('data', function(data){
    console.log(data);
});

r.on('error', function(err){
    console.log(err);
});
```
