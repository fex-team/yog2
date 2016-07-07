---
---

## 插件系统


YOG2 插件系统是整个框架的骨架。在 YOG2 中，从中间件管理到日志系统和FIS静态资源管理，所有功能的引入都是以插件的形式引入的，因此在了解每个功能的具体用法之前，我们需要对插件系统有一个整体的了解。

YOG2 插件系统的设计目标是

- 通过插件系统实现功能与配置的分离
- 功能由插件自身实现
- 配置由插件系统统一管理，完全暴露给用户

这样设计的优点是我们可以对 yog2 project 的运行时核心进行整体升级，但是其中的功能调整能够对用户在一定程度上是透明的。

以中间件的管理为例，YOG2 为了方便使用，默认引入了多个中间件。如果在app.js中引用，虽然用户可以灵活修改，但是会与用户代码混杂，导致后续无法升级。而全部在框架的核心库中实现会导致用户很难知道框架内部的中间件是按照何种顺序加载的。

### 内置插件

- dispatcher

    自动路由分发插件，提供全局函数[yog.dispatcher](#yogdispatcher)

- http

    中间件管理插件，通过配置，用户可以方便的管理中间件加载顺序和新增中间件

- log

    日志插件，提供全局函数[yog.log](#yoglog)
  
- ral

    后端服务管理插件，提供全局函数[yog.ral](#yogral)

- views

    FIS静态资源管理与模板插件

### 用户插件

用户插件存放在 YOG2 项目的plugins目录中，插件是有其严格的目录规范的

```
├─yog              # Yog根目录
  └plugins          # 用户插件目录
      └userPlugins  # 插件目录
          └index.js # 插件入口
```

其中插件入口必须在一个文件夹中，并且名称必须为index.js。

相应的，插件的实现也有进一步要求

```javascript
// 插件逻辑
module.exports.userPlugins = function(app, conf){
    
}

// 设置插件默认配置
module.exports.userPlugins.defaultConf = {

}
```

- app为yog.app对象，即Express的[app](http://expressjs.com/4x/api.html#application)
- conf为插件的配置项
- module.exports后的属性名就是插件的真实名称

实际上你也可以在一个index.js中编写多个插件。

```javascript
module.exports.userPluginsA = function(app, conf){
    
}

module.exports.userPluginsB = function(app, conf){
    
}
```

此外，对于需要异步加载的插件，也支持异步初始化

```javascript
module.exports.userPlugins = function(app, conf, cb){
    cb && cb();
}

module.exports.userPlugins.defaultConf = {

}
```

### 插件依赖

插件与插件之间是可以声明加载依赖的，举例来说，如果希望插件B在插件A加载后再执行，只需要调整插件的写法即可

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

这样，仅当插件 A 初始化完成后，才会开始插件 B 的初始化工作

> 此处的语法与[async.auto](https://github.com/caolan/async#auto)保持一致

### 插件配置

插件的配置均存放在 yog2 project 的 `conf/plugins` 文件夹中，与插件编写规则一致，配置也需要通过属性名显示声明配置所属的插件

```javascript
// conf/plugins/A.js
module.exports.A = {

}
```

编写在 `conf/plugin` 中的插件配置，会在启动器初始化插件时，自动将配置传递给插件。

#### 环境变量支持

YOG2 还支持根据环境变量加载不同的配置，举例来说

```
export YOG_ENV=dev
```

环境变量 `YOG_ENV` 的值将会影响配置的加载，比如当值为dev时，就会优先加载 `http.dev.js` 而非 `http.js`。我们可以通过这个功能更方便的管理开发环境的配置与测试环境的配置。

除此外还有一个特殊的配置后缀 `default`，当 `http.js` 不存在时，会尝试加载 `http.default.js`。可以在自定义插件时使用，这样用户在 `http.js` 中修改配置后，即使重新安装插件，也不会覆盖用户修改后的配置。

