---
---

## 上线部署

当我们的应用开发完毕，就需要考虑上线部署事宜，除了线上 Node.js 运行时的环境准备外，还有一些 yog2 的参数需要调整。

### 环境变量

- YOG_DEBUG

    必须设置为 `false` 或者不设置，这点非常重要，否则会在线上引发非常严重的安全隐患。

- YOG_ENV

    可以设置为自己的线上状态比如 `prod` 或者不设置，不可以设置为 `dev` 一类开发环境，避免加载了错误的测试环境配置。

### 系统配置

- /conf/plugins/log.js

    intLevel 建议设置为4，只输出必要的日志

- /conf/plugins/http.js

    module.exports.static.options.maxAge 如果使用了 MD5 戳，可以将此值设置为 864000000 ，开启一天的强缓存。

### 运维工具

除了环境变量与参数设置外，由于 yog2 没有内置 cluster 模式，如果希望使用 cluster 模式运行应用，可以使用 [PM2](https://github.com/Unitech/PM2) 来管理应用。同时 [PM2](https://github.com/Unitech/PM2) 可以作为守护进程保证 Node.js 应用一旦 Crash，会立刻重启
