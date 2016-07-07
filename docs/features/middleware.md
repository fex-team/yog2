---
---

## 中间件管理

在 YOG2 中，中间件管理 [http](https://github.com/fex-team/yog2-kernel/tree/master/plugins/http) 本身是一个插件，而各种中间件也是由插件组成，因此我们可将中间件插件理解为一类特殊的插件。

中间件管理插件的功能是根据用户指定的中间件加载顺序调用中间件插件。

### 中间件配置

中间件配置位于 `/conf/plugins/http.js` 中

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

middleware 配置用于管理加载哪些中间件，以及这些中间件的加载顺序。当不希望使用某种中间件时，只需要从数组中剔除即可。如果希望改变中间件的加载顺序，只需要调整 middleware 数组的顺序。

数组中的字符串代表着响应的中间件插件的名称。除了使用名称来加载中间件，我们还可以直接使用中间件的 function 。

### 添加中间件

添加中间件的方式就是在 middleware 配置中添加一项中间件。比如当我们安装了 session 插件后就可以在配置中将 session 插件作为中间件加载。


安装中间件插件

```
yog2 plugin install session
```

启用中间件

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
        'session', // 添加 session 中间件
        'dispatcher',
        'notFound',
        'error'
    ]
};
```

如果不希望将中间件包装为插件，只希望快速的引入中间件功能的话，也可以直接添加中间件暴露的接口。

以 [cookie-session](https://github.com/expressjs/cookie-session) 为例，只需要安装了 npm 模块后，就可以直接添加这个中间件

安装

```
npm i cookie-session --save
```

启用中间件

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
        require('cookie-session')({secret: 'key'}),
        'dispatcher',
        'notFound',
        'error'
    ]
};
```

### 文件上传

在 YOG2 中，并未默认开启文件上传功能，这是由于用于处理文件上传的模块一般都较为庞大，如果不需要使用话，加载文件上传处理组件会影响性能。

如果希望能够处理文件上传请求，需要在控制器代码中手动添加。以 YOG2 自带的 [multiparty](https://github.com/andrewrk/node-multiparty/) 组件库为例，我们可以为用户添加头像上传功能。

```javascript
module.exports.post = function (req, res, next) {
    var form = new yog.multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var name = fields.name;
        var gender = fields.gender ? 1 : 0;
        var avatar = (files && files.length > 0) ? files[0] : null;
        if (!name) {
            throw new Error('invalid name');
        }
        userModel.save({
                name: name,
                gender: gender,
                avatar: avatar
            })
            .then(res.json.bind(this))
            .catch(next);
    });
}
```

### session

YOG2 并未直接提供 session 支持，这是由于完备的 session 支持需要依赖第三方存储。具体可以参见 [express-session](https://github.com/expressjs/session#sessionoptions) 一节的 `Warning`。

不过 YOG2 提供了一键安装  [express-session](https://github.com/expressjs/session) 的功能

```bash
yog2 plugin install session
```

在安装了 session 插件后，就可以在[中间件配置](#添加中间件)中添加 `session` 来开启 session 功能。
