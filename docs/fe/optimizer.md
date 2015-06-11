---
---

## 性能优化

使用 yog2 我们可以轻松的实现多种性能优化功能。

### 压缩

```bash
yog2 release --dest dev --optimize


# 也可以使用等价缩写
yog2 release -od dev
```

压缩功能将会对 JavaScript, CSS, PNG 三种资源进行压缩。

### MD5戳

在使用 fis 管理了静态资源后，我们可以通过开启 MD5 戳来实现静态资源的强缓存，关于 MD5戳的优点，可以参考 [fis issue#97](https://github.com/fex-team/fis/issues/97)

```bash
yog2 release --dest dev --md5


# 也可以使用等价缩写
yog2 release -md dev
```

### 打包合并

在 yog2 下，如果希望打包合并资源，只需要在各个 app 下的 fis-conf.js 中配置即可。

```javascript
fis.config.set('pack', {
    '/pkg/widget.js': '/client/widget/**.js',
    '/pkg/widget.less': '/client/widget/**.css'
});
```

在配置后，只需要在执行 `yog2 release` 时指定打包参数，就可以将静态资源合并。

```bash
yog2 release --dest dev --pack

yog2 release -pd dev
# 也可以使用等价缩写
```

### 设置 domain

domain配置用于满足在代码部署上线时添加CDN或域名子目录需求。让开发者无需在开发阶段写大量的 {{BASE_URL}} 模板，而是统一在编译阶段自动化解决。

详细内容可以参考 fis 中对 roadmap 的 [文档](http://fis.baidu.com/docs/advance/roadmap.html#域名配置)
