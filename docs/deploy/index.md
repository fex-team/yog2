---
---

## 上线部署

当我们的应用开发完毕，就需要考虑上线部署事宜，除了线上 Node.js 运行时的环境准备外，还有一些 YOG2 的参数需要调整。

### 环境变量

- YOG_DEBUG

    必须设置为 `false` 或者不设置，这点**非常重要**，否则会在线上开启开发调试功能，从而引发非常严重的安全隐患。

- YOG_ENV

    可以设置为自定义的线上状态比如 `prod` 或者不设置，不可以设置为 `dev` 一类开发环境，避免加载了错误的测试环境配置。

### 系统配置

- /conf/plugins/log.js

    intLevel 建议设置为4，只输出必要的日志

- /conf/plugins/http.js

    module.exports.static.options.maxAge 如果使用了 MD5 戳，可以将此值设置为 864000000 ，开启一天的强缓存。

### Cluster模式

由于 YOG2 没有内置 cluster 模式，如果希望使用 cluster 模式运行应用，可以使用 [PM2](https://github.com/Unitech/PM2) 来管理应用。同时可以可以考虑使用 cluster 模块对 app.js 进行改造。

```javascript
var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var yog = require('yog2-kernel');

if (cluster.isMaster) {
    require('os').cpus().forEach(function () {
        cluster.fork();
    });
    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
}
else {
    var app = yog.bootstrap({
        rootPath: __dirname
    }, function () {
        console.log('plugins load completed');
    });

    app.set('port', process.env.PORT || 8085);
    app.disable('x-powered-by');

    var server = yog.server = app.listen(app.get('port'), function () {
        console.log('Yog server listening on port ' + server.address().port);
    });

    server.on('connection', function (socket) {
        // disable nagle
        socket.setNoDelay(true);
    });

    // 仅在 Node.js 6.x开启这个功能 https://github.com/nodejs/node/issues/7126
    if (parseInt(process.versions.node.split('.')[0], 10) >= 6) {
        server.on('clientError', function (err, socket) {
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        });
    }
}
```

### 进程守护


可以使用 [PM2](https://github.com/Unitech/PM2) 作为守护进程保证 Node.js 应用一旦 Crash ，会立刻重启
