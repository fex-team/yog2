---
---

## 路由

YOG2 框架在 express 的路由基础上，提供了自动路由与多级路由系统。目的是让 UI 层开发更高效、更规范的同时又能够保证最大的灵活性。

YOG2 的路由分为两类。一类是根路由，其角色与传统的 Express 路由非常类似，是所有请求的一致入口，因此我们在根路由拥有最大的自由度，可以做任何转发。另一类是 app 路由，它只能接收根路由分发到各个 app 的请求，请求在 app 中如何分发则可以完全由 app 路由控制。

### 自动路由

基于 `约定优于配置` 的思想，我们提供了自动路由功能，目的是让开发者无需像 express 中一样手动注册路由，只需要在指定的目录按照指定的规则创建文件就可以创建一个 Web 服务。

#### 路由规则

自动路由用于管理url与action之间的映射关系，默认的路由规则为

```text
http://www.example.com/home/index => app/home/action/index.js

http://www.example.com/home/doc/detail => app/home/action/doc/detail.js
```

如果上述规则没有匹配成功，会尝试匹配同名文件夹下的index.js，即

```text
http://www.example.com/home/index => app/home/action/index/index.js

http://www.example.com/home/doc/detail => app/home/action/doc/detail/index.js
```

从上述规则我们可以看出，自动路由会将网站第一级目录识别为 app 的名称，会根据这个名称寻找同名的 app 进行转发。而在 app 路由的处理过程中，会根据 action 文件夹下的目录结构进行进一步的转发。

通过上述自动路由规则，我们可以不编写任何路由代码，就组织出一个拥有多级目录的站点。

#### method 转发

同一个 `action` 文件一般只会对应一个 URL ，但是 YOG2 提供了按照 `HTTP METHOD` 进行自动转发的能力，举例来说

```
//app/home/action/index.js

// GET /home/index
module.exports.get = function (req, res) {};

// POST /home/index
module.exports.post = function (req, res) {};

// PUT /home/index
module.exports.put = function (req, res) {};

// DELETE /home/index
module.exports.delete = function (req, res) {};
```

> `METHOD` 名称均为小写

通过 `METHOD` 转发功能，我们可以为同一个 URL ，分别定义在不同 `METHOD` 请求下的行为。

此外，如果同时存在 `module.exports` 函数与 `module.exports.$METHOD` 函数，如

```javascript
//app/home/action/index.js

module.exports = function (req, res, next) {
    req.user = req.session.user;
    next();
}

// GET /home/index
module.exports.get = function (req, res) {};

// POST /home/index
module.exports.post = function (req, res) {};
```

此时无论是 `GET` 请求还是 `POST` 请求，都会先经过 `module.exports` 函数处理后再进入各自的 `METHOD` 函数，因此我们可以将 `module.exports` 函数视为 URL 级别的通用处理逻辑。

### 路由扩展

除了自动路由外，总会存在一些 URL 设计是自动路由无法满足的，因此 YOG2 框架也提供了极为灵活的路由扩展能力，你甚至可以通过路由扩展能力完全的屏蔽自动路由的功能。

#### root路由扩展

根路由 rootRouter 是用于管理 YOG2 项目的根路由，通过扩展根路由，我们可以完全的控制请求入口。

> rootRouter可以在 project目录中的 `conf/plugins/dispatcher.js` 中修改

> router更多的使用方法可以参考 [Express文档](http://expressjs.com/4x/api.html#router)

可以为一个app设置一个别名

```javascript
router.use('/custom', yog.dispatcher.router('home'))
// http://www.example.com/custom => app/home/index/index.js
```

可以直接建立一个特殊的URL

```javascript
router.get('/somespecial', yog.dispatcher.action('home/doc/detail'))
// http://www.example.com/somespecial => app/home/doc/detail.js
```

也可以在此处将router当成app使用，加载任意中间件

```javascript
router.use(function(req, res, next){
});
```

#### app路由扩展

appRouter 用于管理进入 app 后的请求分发，在这里你可以加载 app 级别的中间件或者通用逻辑，也可以用于实现自动路由无法满足的URL设计需求。

> appRouter可以在 app 目录中的 `server/router.js` 中修改。

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

## 保留参数

由于 YOG2 内置了 BigPipe, Quickling, PageCache 功能，因此以下字段被留做保留参数，请勿在自己的路由中使用下列 query 参数

- pagelet
- pagelets
- reqID
