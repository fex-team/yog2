---
---
{% raw %}


## 进阶功能

在 yog2 下，通过 widget 的划分，可以以 widget 为粒度，以多种模式加载，依靠这种技术我们可以优化大型网站性能或者轻松的实现一个单页应用。

### BigPipe

Facebook 的 BigPipe 技术，是通过将站点分解为多个 pagelet 小块，每个pagelet 获取数据与渲染均是独立的，当传统的后端模板渲染模式受限于后端响应速度最慢的接口时，BigPipe 模式可以实现 pagelet 的数据一旦返回，就可以无阻塞的在浏览器端进行渲染，以此来实现大型复杂页面的性能加速。

而在 yog2 中，实际上一个 pagelet 就对应着一个 widget。我们可以通过简单的改造就实现 BigPipe 模式的加载。

首先，我们需要调整一下 widget 的引用写法，值得注意的是，我们并不需要调整 widget 的实现，这也意味着同一个 widget ，既可以使用传统模式加载，也可以使用 BigPipe模式加载。

我们通过在 `widget` 标签后添加 `mode='async'` 标记指定的 `widget` 使用 BigPipe 模式加载，并且显式的为 `widget` 添加 `id` 属性方便控制器获取 `widget`。

```html
<!-- /client/page/index.tpl -->
<!doctype html>
{% html framework="home:static/js/mod.js" %}
    {% head %}
        <title>Hello World</title>
    {% endhead %}
    {% body %}
        {% widget "home:widget/search/search.tpl" mode="async" id="locationSearch" %}
    {% endbody %}
{% endhtml %}
```

接着按照我们前文所说，如果使用 BigPipe 模式加载 widget ，widget 需要拥有独立的数据获取方式。那么我们就需要在控制器中通过 `res.bigpipe.bind` 函数为 `locationSearch` 这个组件绑定其独立的数据获取方式。

```javascript
var lbsModel = require("../models/lbs.js");

module.exports.get = function (req, res, next) {
    res.bigpipe.bind('locationSearch', function (cb) {
            lbsModel.search(req.query.name, req.query.region)
        .then(function (result) {
            cb (null, result);
        })
        .catch(cb);
    });
    res.render('home/page/index.tpl');
}
```

在经过 BigPipe改造后，再次请求时，查看源代码我们就会发现原先 `locationSearch ` 组件是以 HTML 的形式返回的，而在 BigPipe 模式下，则是从脚本中通过 `onPageletArrive` 函数返回。如果使用 fiddler 等抓包工具查看的话，还可以发现页面框架是在第一时间返回，而 `locationSearch` 的内容则是在后端请求响应后以 chunk 的形式输出至页面。

关于 BigPipe 的更多原理介绍，可以参考 [Facebook网站的Ajax化、缓存和流水线](http://velocity.oreilly.com.cn/2010/index.php?func=session&name=Facebook%E7%BD%91%E7%AB%99%E7%9A%84Ajax%E5%8C%96%E3%80%81%E7%BC%93%E5%AD%98%E5%92%8C%E6%B5%81%E6%B0%B4%E7%BA%BF)

> 需要注意的是并不是所有场景都适合使用BigPipe，只有当一个页面需要向多个系统请求数据，并且后端系统无法提供一致的返回时间保证时，使用BigPipe才会有较大的性能提升。

### Quickling

除了 BigPipe 模式外，我们还可以将 pagelet 用于 Quickling 模式。所谓 Quickling 模式是将 widget 整体通过 Ajax 请求返回。也就是将传统的 Ajax 请求数据，前端模板渲染数据的模式变化为 Ajax 请求渲染好的页面以及 widget 执行的必要代码和样式。这两种方式并非互相取代的关系，而是应该根据使用场景灵活判断。

要使用 Quickling 技术，需要比使用 BigPipe 多引用一个脚本，[bigpipe.js](https://github.com/fex-team/yog2-app-template/blob/master/client/static/js/bigpipe.js)

这个脚本的功能就是在前端发起一个 widget 的 Quickling 请求。

首先我们需要将页面中 widget 的加载模式由 `async` 调整为 `quickling`

```html
<!-- /client/page/index.tpl -->
<!doctype html>
{% html framework="home:static/js/mod.js" %}
    {% head %}
        <title>Hello World</title>
        {% require "home:static/js/bigpipe.js %}
    {% endhead %}
    {% body %}
        {% widget "home:widget/search/search.tpl" mode="quickling" id="locationSearch" %}
    {% endbody %}
{% endhtml %}
```

这样修改后，页面首次加载时并不会加载 `locationSearch` ，需要前端代码中通过调用 bigpipe.js 加载。

```javascript
BigPipe.load('locationSearch');
```

更多 BigPipe 的接口可以查看 [文档](https://github.com/fex-team/yog2-app-template/tree/master/client/static/js)

{% endraw %}
