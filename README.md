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

此项仅适用于百度公司内部，用于安装线上Node基础环境，外部用户可以忽略，直接使用[默认启动](#默认启动)

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

## Yog2的特点

Yog2将传统的一站式开发分解为了Yog2基础环境与Yog2 App，Yog2基础环境将负责一些中间件初始化和基础环境工作，而Yog2 App则是对应的各个业务子系统，包含了具体的业务代码，当然你也可以直接使用Yog2基础环境继续一站式开发，但是我们强烈推荐使用App能力拆分项目。

一个典型的Yog2目录结构应该类似

```
├─home
│  ├─client
│  │  ├─page
│  │  ├─static
│  │  └─widget
│  └─server
│      ├─action
│      ├─lib
│      └─model
├─user
│  ├─client
│  │  ├─page
│  │  ├─static
│  │  └─widget
│  └─server
│      ├─action
│      ├─lib
│      └─model
└─yog
    ├─app
    ├─bin
    ├─conf
    │  ├─plugins
    │  └─ral
    ├─plugins
    ├─static
    └─views
```

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

通过yog2工具，你可以方便的将App部署至Yog2项目中

```bash
# project目录
cd home
# home目录
yog2 release -d ../yog #将home app发布至同级的yog目录中
cd ..
```

与fis的编译和部署语法完全一致，你甚至可以部署到远程测试机上而不是本机上使用，更多用法可以参考[fis文档](http://fis.baidu.com/docs/api/fis-conf.html#deploy)

### 后端能力

Yog2的后端基础框架基于Express扩展，主要提供了以下能力

1. 插件化启动
2. 中间件管理
3. 执行器与路由

#### 插件化启动

##### 启动初始化

Yog2提供了一个基于插件的启动器，在这个启动器中你可以执行一些服务初始化代码，也可以用来做一些中间件的管理工作。

```javascript
require('yog2-kernel');

var app = yog.bootstrap({
    rootPath: __dirname
}, function(){
    console.log('plugins load completed');
});
```

只需要指定Yog2的rootPath，Yog2启动器会自动加载Yog2自带的插件和用户自定义的插件，并根据插件间的依赖顺序进行初始化。

##### 插件管理

Yog2的插件分为两个部分，一部分是Yog2自带的插件，存放在[yog2-kernel](https://github.com/fex-team/yog2-kernel/tree/master/plugins)中，另一部分是用户自定义或手动安装的插件，存放在项目目录中的plugins文件夹。

###### 内置插件

- dispatcher

  自动路由分发插件，提供全局函数[yog.disptacher](#yog.disptacher)

- http

  中间件管理插件，通过配置，用户可以方便的管理中间件加载顺序和新增中间件

- log

  日志插件，提供全局函数[yog.log](#yog.log)
  
- ral

  后端服务管理插件，提供全局函数[yog.ral](#yog.ral)

- views

  FIS静态资源管理与模板插件

###### 用户插件

用户插件存放在Yog项目的plugins目录中，插件是有其严格的目录规范的

```
├─yog                 # Yog根目录
  └──plugins          # 用户插件目录
      └─userPlugins   # 插件目录
          └─index.js  # 插件入口
```

其中插件入口必须在一个文件夹中，并且名称必须为index.js。

相应的，插件的实现也有进一步要求

```javascript
module.exports.userPlugins = function(app, conf){
    
}

//默认配置
module.exports.userPlugins.defaultConf = {

}
```

app为yog.app对象，即Express的[app](http://expressjs.com/4x/api.html#application)
conf为插件的配置项
module.exports后的属性名就是插件的真实名称

文件夹名称并非插件的真实名称，但是一般我们会将插件名称与文件夹名称设置为一样方便维护。因此实际上你也可以在一个index.js中编写多个插件。

```javascript
module.exports.userPluginsA = function(app, conf){
    
}

module.exports.userPluginsB = function(app, conf){
    
}
```

插件也支持异步初始化

```javascript
module.exports.userPlugins = function(app, conf, cb){
    cb && cb();
}

module.exports.userPlugins.defaultConf = {

}
```

###### 插件依赖

插件与插件质检是可以声明加载依赖的，举例来说，如果希望插件B在插件A加载后再执行，只需要调整插件的写法即可

```javascript
// plugins/A/index.js
module.exports.A = function(app, conf){
};
```

```javascript
// plugins/B/index.js
module.exports.B = ['A', function(app, conf){
}];
```

此处的语法与[async.auto](https://github.com/caolan/async#auto)保持一致

###### 插件配置项

插件的配置均存放在Yog项目的 `conf/plugins` 文件夹中，与插件编写规则一直，配置也需要通过属性名显示声明配置所属的插件

```javascript
// conf/plugins/A.js
module.exports.A = {

}
```

配置文件名称的并非插件的真实名称，但是一般我们会将插件名称与文件名称设置为一样方便维护。因此实际上你也可以在一个文件中编写多个插件的配置，但是我们并不推荐这样做，独立的配置文件更加利于管理和Yog2的整体升级。

编写在 `conf/plugin` 中的插件配置，会在启动器初始化插件时，自动进行配置传递。

#### 中间件管理

中间件管理在Yog2中是通过http插件实现，你可以通过配置http插件来调整中间件的加载顺序

```javascript
module.exports.http = {
    middleware: [
        'favicon',
        'compression',
        'static',
        'responseTime',
        'cookieParser',
        'bodyParser',
        'log',
        'ral',
        'views',
        'methodOverride',
        'dispatcher',
        'notFound',
        'error'
    ]
};
```

其中所有的名称实际上都是对应的相应的插件，比如log插件、ral插件等，而类似favicon等插件，因为功能比较单一，并且仅在中间件环节使用，我们将这些插件直接内置在了[http插件](https://github.com/fex-team/yog2-kernel/tree/master/plugins/http/middleware)中，并没有独立暴露。

> Yog2中，为了提供更方便的中间件配置能力，会将中间件也封装为一种特殊的插件，这类插件的编写与普通插件的编写略有不同。

以一个最简单的中间件插件为例

```javascript
module.exports.responseTime = function(app, conf){
    return function(){
        app.use(require('response-time')(conf));
    };
};
```

中间件插件的特别之处在于它将返回一个函数而不是直接执行中间件的初始化，HTTP插件将会调用返回的函数，而在这个函数中，你可以通过 app.use实现中间件的加载。

#### 执行器与路由

#### 执行器

页面请求会经由路由转发至action处理，一般我们会在action中处理请求的参数，如querystring, cookie甚至upload files，然后将参数处理为数据层模块需要的参数格式，调用数据层模块获取数据后，指定后端模板和数据进行页面渲染。

> action均存放在 `server/action` 中。

示例：

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

我们也可以在Action代码中直接调用其他Action进行页面请求处理，注意这里你甚至可以进行跨App的Action调用，但是这种能力的使用应该十分慎重，建议仅限定的其他App对Common App的调用。

```javascript
// spa/action/some.js
module.exports = function(req, res, next){
    yog.dispatcher.action('spa/api')(req, res, next);
};
```

#### yog.require

`yog.require` 提供了跨App的require能力。

对于跨App的调用，我们建议慎重使用，最好只限定在其他App对Common App的调用，Common App中可以存放一些通用的组件。

```javascript
// 通过yog.require 可以跨App调用其余模块的后端脚本
var util = yog.require('common/libs/util.js');
```

#### yog.log

`yog.log` 提供了日志记录能力

```javascript
yog.log.fatal('some fatal');
yog.log.warning('some warning');
yog.log.notice('some notice');
yog.log.trace('some trace');
yog.log.debug('some debug');
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

### 前端能力

#### FIS静态资源管理

我们扩展了Swig模板引擎的功能，实现了与fis-plus类似的后端静态资源管理能力，你可以通过一些标签来方便的进行细粒度静态资源管理。

##### require
* 功能：通过静态资源管理框架加载静态资源。
* 使用 {% require $id%}
* 用法：在模板中如果需要加载模块内某个静态资源，可以通过require插件加载，便于管理输出静态资源

```html
{%html framework="home:static/lib/mod.js"%}
    {%head%}
       <meta charset="utf-8"/>
       {*通过script插件收集加载组件化JS代码*}
       {%script%}
            require.async("home:static/ui/B/B.js");
       {% endscript %}
    {%endhead%}
    {%body%}
        {%require "home:static/index/index.css" %}
        ...
    {%endbody%}
{%endhtml%}
```
页面输出为：
![](http://fex-team.github.io/fis-framework-site/assets/images/fis-plus/tpl5.jpg)
##### widget

* 功能：调用模板组件，渲染输出模板片段。
*  使用： {%widget $id%}
* 用法：在模板中调用某个模板组件
```html
{%html framework="home:static/lib/mod.js"%}
    {%head%}
       <meta charset="utf-8"/>
       {*通过script插件收集加载组件化JS代码*}
       {%script%}
            require.async("home:static/ui/B/B.js");
       {%endscript%}
    {%endhead%}
    {%body%}
        {%require "home:static/index/index.css"%}
        {%widget "home:widget/A/A.tpl"%}
    {%endbody%}
{%endhtml%}
```
页面输出为：
![](http://fex-team.github.io/fis-framework-site/assets/images/fis-plus/tpl6.jpg)

##### spage
* 功能：使用ajax请求，采取quickling模式渲染页面片段。第一次刷新页面的时候
* 使用：{%spage "$id" for="pages-container"%}
* $id: html片段的路径
* for：页面容器，即ajax请求html片段在页面对应的容器。
* 用法：quickling模式渲染页面片段
```html
{%html framework="home:static/lib/mod.js"%}
    {%head%}
       <meta charset="utf-8"/>
    {%endhead%}
    {%body%}
        <div id="pages-container">
        {% spage "spa:widget/pagelets/home/home.tpl" for="pages-container" %}
     </div>
    {%endbody%}
{%endhtml%}
```
##### uri
* 功能：定位线上资源，允许跨模块(project)。
* 属性值：name(调用文件目录路径)
* 是否必须：是
* 用法：在模板中调用某个模板组件

```html
{%html framework="home:static/lib/mod.js"%}
   {%head%}
       <meta charset="utf-8"/>    
   {%endhead%}
   {%body%}
        {%uri name="home:static/css/bootstrap.css" %}
   {%endbody%}
 {%endhtml%}
```
##### 辅助标签

##### html
* 功能：代替`<html>`标签，设置页面运行的前端框架，以及控制整体页面输出。
* 属性值：framework及html标签原生属性值
* 是否必须：是
* 用法：在模板中替换普通`<html>`标签
```html
{%html framework="home:static/lib/mod.js"%}
    ....
{%endhtml%}
```
页面输出为：
![](http://fex-team.github.io/fis-framework-site/assets/images/fis-plus/tpl1.jpg)
##### head
* 功能：代替`<head>`标签，控制CSS资源加载输出。
* 属性值：head标签原生属性值
* 是否必须：是
* 用法：在模板中替换普通`<head>`标签
```html
{%html framework="home:static/lib/mod.js"%}
    {%head%}
        <meta charset="utf-8"/>
    {%endhead%}
{%endhtml%}
```
页面输出为
![](http://fex-team.github.io/fis-framework-site/assets/images/fis-plus/tpl2.jpg)
#####  body
* 功能：代替`<body>`标签，控制JS资源加载输出。
* 属性值：body标签原生属性值
* 是否必须：是
* 用法：在模板中替换普通`<body>`标签
```html
{%html framework="home:static/lib/mod.js"%}
    {%head%}
        <meta charset="utf-8"/>
    {%endhead%}
    {%body%}
        ....
    {%endbody%}
{%endhtml%}
```
页面输出为
![](http://fex-team.github.io/fis-framework-site/assets/images/fis-plus/tpl3.jpg)
##### script
* 功能：代替`<script>`标签，收集使用JS组件的代码块，控制输出至页面底部。
* 属性值：无
* 是否必须：在模板中使用异步JS组件的JS代码块，必须通过插件包裹
* 用法：在模板中替换普通`<script>`标签
```html
{%html framework="home:static/lib/mod.js"%}
    {%head%}
       <meta charset="utf-8"/>
       {*通过script插件收集加载组件化JS代码*}
       {%script%}
           require.async("home:static/ui/B/B.js");
       {%endscript%}
    {%endhead%}
    {%body%}
        ...
    {%endbody%}
{%endhtml%}
```
页面输出为
![](http://fex-team.github.io/fis-framework-site/assets/images/fis-plus/tpl4.jpg)
