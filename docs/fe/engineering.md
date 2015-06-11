---
---
{% raw %}

## 前端工程化

yog2 是基于 [fis](http://fis.baidu.com) 构建的 Node.js UI中间层解决方案，因此整个框架都深度契合 fis 的前端工程化概念。在 yog2 中你可以享受到完整的 [fis](http://fis.baidu.com) 解决方案的前端优势。

### 目录规范

在 yog2 中我们提供了一套固定的目录规范方便开发者快速开发，在了解了 fis 的配置原理后，也可以方便的调整这套目录规范。

```bash
├─client                 # 前端代码
│  ├─page                # 前端页面
│  ├─static              # 前端非模块化静态资源
│  │  ├─css
│  │  └─js
│  └─widget              # 前端组件
├─fis-conf.js            # FIS编译配置
```

app 下的 client 目录就是前端代码的开发目录，所有的前端资源均在这里存放。其中有两个特殊的目录 `page` 和 `widget`。 `page` 中存放的是前端页面的后端模板，`widget` 中存放的是后端组件，后端组件可以调用其他组件，也可以被页面调用，通过将站点划分为一个个组件，我们可以更好的去管理和复用组件代码。

除此之外，`widget` 目录下的 JavaScript 脚本均需要遵守 **CommonJS** 规范，与 Node.js 模块化的编写标准一致，使用 `require` 获取模块，使用 `module` 和 `exports` 暴露接口。

并不推荐在 yog2 中使用 AMD 规范的模块化加载类库。

### 三种语言能力

#### 资源定位

资源定位能力，可以有效的分离开发路径与部署路径之间的关系，工程师不再关心资源部署到线上之后去了哪里，变成了什么名字，这些都可以通过配置来指定。而工程师只需要使用相对路径来定位自己的开发资源即可。这样的好处是 **资源可以发布到任何静态资源服务器的任何路径上而不用担心线上运行时找不到它们**，而且代码 **具有很强的可移植性**，甚至可以从一个产品线移植到另一个产品线而不用担心线上部署不一致的问题。

* [在html中定位资源](./fe-location.html#在html中定位资源)
* [在js中定位资源](./fe-location.html#在js中定位资源)
* [在css中定位资源](./fe-location.html#在css中定位资源)

#### 内容嵌入

内容嵌入可以为工程师提供诸如图片base64嵌入到css、js里，前端模板编译到js文件中，将js、css、html拆分成几个文件最后合并到一起的能力。有了这项能力，可以有效的减少http请求数，提升工程的可维护性。 _fis不建议用户使用内容嵌入能力作为组件化拆分的手段_，因为依赖声明能力会更适合组件化开发。

* [在html中嵌入资源](./fe-inline.html#在html中嵌入资源)
* [在js中嵌入资源](./fe-inline.html#在js中嵌入资源)
* [在css中嵌入资源](./fe-inline.html#在css中嵌入资源)

#### 依赖声明

> 依赖声明能力为工程师提供了声明依赖关系的编译接口。fis在执行编译的过程中，会扫描这些编译标记，从而建立一张 **静态资源关系表**，它在编译阶段最后会被产出为一份 **map.json** 文件，这份文件详细记录了项目内的静态资源id、发布后的线上路径、资源类型以及 **依赖关系** 和 **资源打包**等信息。使用fis作为编译工具的项目，可以将这张表提交给后端或者前端框架去运行时根据组件使用情况来 **按需加载资源或者资源所在的包**，从而提升前端页面运行性能。

* [在html中声明依赖](./fe-require.html#在html中声明依赖)
* [在js中声明依赖](./fe-require.html#在js中声明依赖)
* [在css中声明依赖](./fe-require.html#在css中声明依赖)

### 前端模块化

在 yog2 中，我们可以轻松的使用模块化的能力管理前端业务代码。所有放在 widget 目录下的 JavaScript 脚本都需要符合 CommonJS 规范，即像编写 Node.js 代码一样编写前端代码。

比如我们可以声明一个模块 word

```javascript
// /client/widget/word/word.js
module.export = 'A';
```

我们可以在其他脚本中引用 word 模块

```javascript
// /client/widget/index.js
var word = require('home:widget/word/word.js');
alert(word);

// A
```

也可以在页面中引用 word 模块

```html
// /client/page/index.tpl

{% script %}
var word = require('home:widget/word/word.js);
alert(word);
{% endscript %}
```
{% endraw %}
