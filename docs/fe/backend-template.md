---
---
{% raw %}

## 后端模板

在 fis 提供的三种语言能力中，并没有提供对声明依赖的资源进行加载的功能。因此在 YOG2 中，我们通过扩展 swig 后端模板引擎，来添加对资源的加载能力。

YOG2 会重写 `html`,  `head`,  `body` 标签用于搭建资源加载的总体框架，并且添加了 `require`,  `widget`,  `script` 标签用于处理静态资源和后端组件。

### 基础结构

一个基础的 YOG2 后端模板应该类似

```
<!doctype html>
{% html framework="home:static/js/mod.js" %}
    {% head %}
        <title>Hello World</title>
    {% endhead %}
    {% body %}
    {% endbody %}
{% endhtml %}
```

可以将这种基础结构设置为母版页 `layout.tpl` 这样就不需要重复的编写 `html` `head` `body` 标签。

其中 `html` 标签的 `framework` 属性是一个特殊属性，用于指定模块化加载类库 `mod.js` 所在的路径。

### 引用非模块化资源

如果希望引入非模块化资源，比如一些第三方库类似 `jquery` , `zepto` 等等，可以直接通过 `require` 标签进行引用，也可以直接编写 `<script></script>` HTML标签进行引用。

```
<!doctype html>
{% html framework="home:static/js/mod.js" %}
    {% head %}
        <title>Hello World</title>
        {% require "home:static/lib/jquery.js" %}
        <script src="/client/static/lib/zepto.js" ></script>
    {% endhead %}
    {% body %}
    {% endbody %}
{% endhtml %}
```

两种引用方式都可以生效，但是更加推荐使用 `require` 标签，因此这种依赖声明模式是运行时声明的，你可以通过 {% if %} {% endif %}标签来实现后端动态化的资源加载。此外使用 `require` 加载的资源，可以被 fis 的静态资源管理层统一管理，而 `<script>` 标签加载的资源就类似传统的编写方式，fis 并不会在打包合并等操作时调整它。

### 引用模块化资源

模块化资源是指 `widget` 目录下的所有脚本资源，引用模块化资源分为同步引用和异步引用两种方式，但是两种方式都是按需加载，异步引用的区别是不会在页面加载的时候就将资源加载，而是会在执行到异步加载命令时进行资源加载。

同步引用模块化资源的方式符合 CommonJS 规范

在其他脚本中

```
// 使用资源ID引用，资源ID为去掉 /client 目录层级的路径并添加当前项目的命名空间
var module = require('home:widget/search/search.js');

// 使用相对路径引用，相对路径需要按照源代码实际路径情况编写
module = require('./search.js');

// 使用绝对路径引用，需要以项目根目录计算路径

module = require('/client/widget/search/search.js');
```

异步引用模块化资源时，资源的引用规则还是保持一致，不同的是引用接口发生了变化

```
// 使用资源ID引用，资源ID为去掉 /client 目录层级的路径并添加当前项目的命名空间
require.async(['home:widget/search/search.js'], function (module) {
});

// 使用相对路径引用，相对路径需要按照源代码实际路径情况编写
require.async(['./search.js'], function (module) {
});

// 使用绝对路径引用，需要以项目根目录计算路径

require.async(['/client/widget/search/search.js'], function (module) {
});
```

### 内联脚本

无论是页面中还是组件中，如果希望编写内联脚本，除非不希望被 fis 的静态资源管理层管理，否则需要使用 `script` 标签

```
{% script %}
console.log('inline script');
{% endscript %}
```

通过 `script` 标签包裹的内联脚本会在输出时，保证输出到静态资源加载之后，避免内联脚本在依赖的资源未加载时就提前执行了。

### 编写后端组件

后端组件用于将一个复杂的站点按照功能区域划分为多个组件，来降低站点的复杂度。并且在 YOG2 中，后端组件可以将 JavaScript脚本、CSS层叠样式、TPL 后端模板统一管理，这样在维护时可以轻松的根据功能点寻找到相应的代码，而无需分别在三类代码中去寻找相应的功能点。

```html
<!-- /client/widget/search.tpl -->
<ul id='{{ poiListID }}' class="poi-list">
    {% for poi in pois %}
    <li data-tel="{{ poi.telephone }}">
        <span>{{ poi.name }}</span>
    </li>
    {% endfor %}
</ul>
<!-- 组件的脚本初始化入口 -->
{% script %}
<!-- 获取search.js -->
require("./search.js').init('{{ poiListID }}');
{% endscript %}
<!-- 声明加载search.less -->
{% require "./search.less" %}
```

```javascript
// /client/widget/search.js
module.exports.init = function (target) {
    $(target).find('li').click(function() {
        alert('tel: ' + $(this).attr('data-tel'));
    });
};
```

```css
/**

/client/widget/search.less

**/
.poi-list {
      list-style-type: none;
      
      > li {
          margin: 0 5px;
      }
}
```

编写完成的后端组件一般就是一个独立的功能组件，我们可以直接在页面中引用而无需担心各种依赖问题。

```html
<!-- /client/page/index.tpl -->
<!doctype html>
{% html framework="home:static/js/mod.js" %}
    {% head %}
        <title>Hello World</title>
    {% endhead %}
    {% body %}
        {% widget "home:widget/search/search.tpl" %}
    {% endbody %}
{% endhtml %}
```

后端组件也可以使用独立与页面渲染不同的数据进行渲染，类似 Swig 的 include 语法，我们可以使用 with 参数为 widget 添加渲染参数。

```html
{% set data = {} %}
{% set data['a'] = 1 %}
{% set data['b'] = "hello world" %}
{% set data['c'] = title // 原始渲染数据的中的值 %}

// 将在现有页面渲染数据的基础上添加data中的 a, b, c 值进行渲染
{% widget "home:widget/search/search.tpl" with data %} 

// 仅使用data中的值进行渲染
{% widget "home:widget/search/search.tpl" with data only %} 

// 快速赋值，无需预先 set
{% widget "home:widget/search/search.tpl" with {a=1, b="hello world", c=title} %} 

// 也兼容 only 参数
{% widget "home:widget/search/search.tpl" with {a=1, b="hello world", c=title} only%} 
```

{% endraw %}
