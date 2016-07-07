---
---

## 前后端同构

### 解释

YOG2 提供了一种在服务端加载客户端脚本资源的方法，用于实现类似 React 后端渲染一类的前后端同构能力。同时这样的调用能力也可以调用前端的 NPM 组件。

但是由于其本质是提供在服务端加载前端代码的能力，因此对前端代码也有更高要求，需要前端代码能够对环境做出一定的判断来避免服务端与浏览器端在 API 上的一些不兼容。

> 前后端同构功能要求 YOG2 cli版本与 yog2-kernel 版本均高于 1.0

### 用法

在服务端中，只能使用`资源ID`对前端代码进行加载，YOG2 中的前端资源ID规则非常简单，仅需要为文件路径添加上当前模块名并用冒号与 client 目录下的文件路径拼接在一起就可以得到。以下是一些资源ID的例子

```
/client/a.js => {APP_NAME}:a.js
/client/page/index.js => {APP_NAME}:page/index.js
/client/node_modules/react/react.js => {APP_NAME}:node_modules/react/react.js
```

了解了资源ID的计算方法后，在服务端中，我们就可以很方便的执行前端代码了。我们以 DEMO 中代码为例 (ES6语法)，可以看到加载客户端代码仅需要直接 require/import 相应的资源ID即可

```javascript
import App from 'home:page/index/server.js'
import { getTodos } from '../model/index'

export default async function (req, res) {
  const initState = {
    todos: await getTodos(req.userId)
  };

  const nsr = req.query.nsr === '1';
  res.render('home/page/index/index.tpl', {
    initState: JSON.stringify(initState),
    ssr: nsr ? '' : App(initState)
  });
}
```

### DEMO

https://github.com/hefangshi/yog2-react-redux-demo

