---
---

## 服务管理

YOG2 中，使用 [node-ral](https://github.com/fex-team/node-ral) 进行后端服务管理，我们引入后端服务管理层主要是解决以下几个问题

- 后端服务配置统一管理
- 封装异常处理、超时重试，提升系统稳定性
- 封装日志，便于线上问题追查
- 抽象请求协议、数据格式与数据编码，统一用户接口

在后端服务配置统一管理方面，我们的准则是配置优于硬编码，虽然使用类似 [request](https://github.com/request/request) 一类的库也可以很好的实现 HTTP 请求服务，但是它并没有明确的控制诸如服务请求地址等等参数的设置，进而容易导致在项目中出现后端配置分散、开发配置与线上配置管理混乱的问题。

在封装异常、超时重试方面，我们抽象了服务请求模型，使得各种数据格式与请求协议之间的异常封装和超时重试逻辑可以通用。当引入了一种的服务类型后，这类逻辑不需要重新实现。并且由于异常处理已经覆盖了整个服务请求的各个阶段，不会出现类似 `JSON.parse` 忘记添加异常处理导致的 Node.js 服务 Crash 的问题。

除了通用的异常和超时重试逻辑外，[node-ral](https://github.com/fex-team/node-ral) 还提供了请求日志功能，无需做任何额外的编码工作就可以详尽的查看到请求的各个过程的信息，以及请求耗时的统计信息等等，方便线上问题的追查。

[node-ral](https://github.com/fex-team/node-ral) 的特色之一就是解耦了请求协议和数据格式，实现了接口正交化。解耦的优势在于我们可以任意的组合数据格式与请求协议，比如当请求协议不是 HTTP 协议而是 Socket 协议时，我们依然可以沿用目前的 `JSON`、`Form` 甚至 `Stream` 的数据打包格式，而用户在调整请求协议与数据格式时只需要调整一个参数，在调用服务时只需要提供请求参数和数据，请求协议与数据格式可以对开发人员完全透明。

综上所述，我们可以看到 [node-ral](https://github.com/fex-team/node-ral)  是 Node.js UI 中间层能够稳定健壮运行的核心组件之一。

### 服务配置

在 YOG2 下所有的 `ral` 配置均放在 project 目录下的 `/conf/ral` 中。

```javascript
 // conf/ral/API.js 

module.exports.MAPAPI= {           // 声明服务名为MAPAPI
    // 请求协议与数据格式配置
    protocol: 'http',              // 使用http协议请求
    pack: 'querystring',           // 数据封装为query
    unpack: 'json',                // 约定服务端返回JSON数据
    encoding: 'utf-8',             // 服务器返回utf-8编码
    // 负载均衡与超时重试配置
    balance: 'roundrobin',         // 负载均衡策略
    timeout: 500,                  // 请求最长超时时间500ms
    retry: 1,                      // 请求重试次数
    // HTTP协议特有配置
    method: 'GET',                 // 使用GET请求
    query: {                       // 服务的全局query
        ak: '0C62f9f0ee027b6052dfa35b0f38b61a',
        output: 'json',
        page_size: 10,
        page_num: 0,
        scope: 1
    },
    path: '/place/v2/search',      // API路径
    headers: {                     // 服务的全局headers
        'x-client': 'ral'
    },
    // 后端地址配置
    server: [                      // 可以配置多个后端地址
        {
            host: 'api.map.baidu.com',
            port: 80
        }
    ]
}
```

详细配置语法可以参考  [node-ral](https://github.com/fex-team/node-ral) 文档。

### yog.ralP

`yog.ralP` 是在 YOG2 框架下后端服务管理层暴露的 Promise 接口，在 YOG2 中，我们无需关心任何初始化工作，只要添加了后端服务相应的配置，就可以使用这个接口进行服务的调用。

比如使用上述的百度地图API，我们可以建立一个 LBS 数据模型，专门用于地图数据的查询。

```javascript
// models/lbs.js

module.export.search = function (name, region) {
    return yog.ralP('MAPAPI', {
        data: {
            region: region,
            query: name
        }
    });
}
```

在控制器中使用的时候，我们编写起来也会更加优雅

```javascript
var lbsModel = require("../models/lbs.js");

module.exports.get = function (req, res, next) {
    lbsModel.search(req.query.name, req.query.region)
        .then(res.json.bind(res))
        .catch(next);
}
```
