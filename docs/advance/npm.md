---
---

## App 级别的 npm 使用

### App 后端调用

#### 解释

每一个 YOG2 App 均可以拥有自己独立的 npm 依赖，并且不同的 YOG2 App 之间可以加载不同版本的 npm 依赖。以 YOG2 Project 最终部署目录为例，当 App 中的后端代码通过 `require` 加载 npm 模块时，依赖查找顺序如下所示：

```
app
 -- home
    -- action
    -- model
    -- node_modules  // app后端代码中优先使用app/{APP_NAME}/node_modules下的npm模块
    -- router.js
    -- package.json
 -- views
conf
node_modules // app/{APP_NAME}/node_modules下无法找到所需的npm模块时，会加载project下的npm模块
app.js
package.json
```

#### 如何使用

使用方法与一般的 Node.js 无异，直接在 app 的源码目录下执行 `npm i {MODULE_NAME} --save` 后，执行 `yog2 release debug --fis3` 进行发布即可

> 推荐多个 App 之间可以共用的模块尽量在 Project 下安装，可以有效的加快 App 的部署效率

### App 前端调用

#### 解释

在 YOG2 下，每一个 YOG2 App 的 client 目录中，均可以独立的安装 npm 包，其主要功能是用于接入社区中以 npm 为前端组件管理的模块，例如 React，Vue.js 等新兴模块。

#### 如何使用

支持在前端代码中使用 client npm 包中组件的前提是使用 [fis3](/yog2/docs/basic/fis3.html) 核心的 YOG2 cli，同时还需要在 fis-conf.js 中显式的开启 npm 支持。

```javascript
// 启用npm管理前端组件
fis.enableNPM({
    autoPack: true // 自动为 npm 下的前端资源按需打包合并
});
```

开启 npm 能力后，就可以在 client 目录下安装需要使用的 npm 组件

```bash
cd client
npm i react --save
```

安装了需要使用的组件后，就可以在前端代码中使用组件

```javascript
var React = require('react');
```

```bash
yog2 release debug --fis3 // 必须使用 fis3 模式
```

当然同时可能还会存在希望在后端代码中引用前端业务代码或者前端组件代码需求，用于实现类似 React 后端渲染一类的功能，这类功能在 YOG2 中也得到了很好的支持，可以参考 [前后端同构](/yog2/docs/advance/isomorphic.html)

#### DEMO

https://github.com/hefangshi/yog2-react-redux-demo



