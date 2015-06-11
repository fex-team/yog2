---
---

## MVC

### 控制器

控制器是 Web 服务实际业务逻辑的载体，路由系统会将请求根据路由规则分发到控制器，由控制器去解析请求参数、访问数据服务以及返回结果。在 yog2 中，控制器就是路由系统指向的 `action` 文件。

以一个简单的用户创建与获取的 API 为例简单说明一下用法

```javascript
var userModel = require('../models/userModel.js');

module.exports.get = function (req, res, next) {
    var id = parseInt(req.body.id, 10);
    if (isNaN(id)) {
        throw new Error('invalid id');
    }
    userModel.get(id)
    .then(res.json.bind(this))
    .catch(next);
}

module.exports.post = function (req, res, next) {
    var name = req.body.name;
    var gender = req.body.gender ? 1 : 0;
    if (!name) {
        throw new Error('invalid name');
    }
    userModel.save({
        name: name,
        gender: gender
    })
    .then(res.json.bind(this))
    .catch(next);
}
```

可以看出控制器中的函数实际上就是 express 在路由注册时的回调函数，因此其中的参数 `req` `res` `next` 均可以参考  [express文档](http://expressjs.com/4x/api.html) 使用。

### 数据模型

由于 yog2 的核心目标是更好的提供 UI中间层 支持，因此并未内置任何数据库 ORM 功能。当然，通过中间件和插件扩展，我们也可以很轻松的引入类似 [waterline](https://github.com/balderdashy/waterline) 和 [mongoose](https://github.com/Automattic/mongoose) 这类 ORM 库用于数据库的访问。

虽然没有内置 ORM 功能，但是我们提供了一套后端服务管理工具用于 UI中间层对后端服务层的请求管理。

数据模型又可以分为服务层和数据层，服务层可以专注与业务逻辑封装和数据层的调用，数据层则专注于与后端服务层的交互。当然在业务不复杂的时候，我们也可以直接将服务层与数据层融合。

以控制器中的 userModel 为例，我们可以实现一个简单的数据模型。

```javascript
// /server/models/userModel.js

var yog = require('yog2-kernel');

module.export.get = function (id) {
    return yog.ral('BACKEND', {
        path: '/api/user',
        method: 'GET',
        data: {
            id: id
        }
    });
};

module.export.save = function (user) {
    return yog.ral('BACKEND', {
        path: '/api/user',
        method: 'POST',
        pack: 'form',
        data: user
    });
};
```

其中 `yog.ral` 是 yog2 框架的后端服务管理工具，使用之前需要在 project 中进行一些简单的配置。

```javascript
// /conf/ral/backend.js
module.exports = {
    BACKEND: {
        protocol: 'http',
        pack: 'querystring',
        unpack: 'json',
        method: 'GET',
        balance: 'roundrobin',
        server: [
            {
                host: 'backend.server', 
                port: 80
            }
        ]
    }
}
```

> 要如示例中Promise的形式使用 yog.ral ，需要安装插件 [yog2-plugin-ral-promise](https://github.com/hefangshi/yog2-plugin-ral-promise)

### 模板引擎

yog2 默认使用了 [swig](https://github.com/paularmstrong/swig) 作为模板引擎。同时我们扩展了模版引擎使其能够支持更多的功能，其中最核心的功能就是 FIS 的后端静态资源管理能力，这个功能将会在 [前端工程化](#前端工程化) 一节详细描述，在此我们会介绍一下如何在 yog2 中使用模板引擎。

在 yog2 中，我们一般会将模板根据使用类别的不同，分别将页面类型的后端模板放至于 app 的 `/client/page` 目录中，而将组件类型的后端模板放至于app 的  `/client/widget/WIDGET_NAME` 目录中。

以 `yog2 init app` 生成的默认 DEMO 为例

```
├── client
│   ├── page
│   │   ├── index.tpl
│   │   └── layout.tpl
│   └── widget
│       └── message
│           └── message.tpl
├── fis-conf.js
```

我们可以看到其中拥有三个 `tpl` ，即后端模板文件，其中 `layout.tpl` 是页面的母版页，其中可以实现一些页面间共用的部分，而 `index.tpl` 则是我们首页的后端模板。`message.tpl` 则是供各个页面引用的后端模板组件。

当拥有了模板后，我们还有一个工作就是将数据传递给模板，并将渲染结果返回前端。这类操作如前文所说，应该在控制器也就是 action 中完成。还是以前文中的 userModel 为例，我们将用户信息不以 JSON 的形式，而是以页面的形式展现出来。

```
var userModel = require('../models/userModel.js');

module.exports.get = function (req, res, next) {
    var id = parseInt(req.body.id, 10);
    if (isNaN(id)) {
        throw new Error('invalid id');
    }
    userModel.get(id)
    .then(function (user) {
        res.render('home/page/index.tpl', {
            user: user
        });
    })
    .catch(next);
}
```

通过 `res.render` 函数，我们就可以将数据注入至模板进行渲染并返回了。值得注意的是，在模板路径的书写上，我们需要按照 `APP_NAME/page/PAGE.tpl` 的格式书写。
