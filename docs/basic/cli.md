---
---

## 命令行

### init

yog2 init 是脚手架命令，用于初始化一些环境与代码，目前提供的脚手架有

- `yog2 init project`

    初始化一个yog2 project，主要包含了基础的 project 目录结构和基础框架代码

- `yog2 init app`

    初始化一个 yog2 app，主要包含了基础的 app 目录结构与一些样例文件

- `yog2 init node-runtime`

    仅限百度内部使用，包含了公司内部可用的线上 Node.js 运行时和运维工具

### release

yog2 release 是最重要的命令之一，它的主要功能是对 app 代码进行编译和发布，它会将 app 中的业务代码按照 project 的目录规范进行组织，同时对 app 中的前端代码进行优化和组织。

它包含多个参数用于控制 app 的开发、编译、部署等等工作。因为 yog2 实际上是扩展自 fis ，因此这些参数也均来自 [fis](http://fis.baidu.com/docs/api/cli.html)。

#### 发布参数

- 指定编译 app 代码并发布至某个目录

    ```bash
    yog2 release --dest ../yog
    ```

- 指定编译 app 代码并发布至某个 deploy 配置项

    ```bash
    yog2 release --dest debug
    ```

- 监听文件修改，对修改文件进行增量编译并发布

    ```bash
    yog2 release --dest debug --watch
    ```

- 监听文件修改，并自动刷新页面

    > 自动刷新页面需要下载 livereload 插件，并且 yog2 release 命令执行后需手动刷新一次页面
        
    ```bash
    yog2 release --dest debug --watch --live
    ```

#### 编译参数

- 压缩静态资源

    ```bash
     yog2 release --dest debug --optimize
    ``` 

- 为静态资源添加MD5后缀

    ```bash
     yog2 release --dest debug --md5
    ``` 

- 打包静态资源

    ```bash
     yog2 release --dest debug --pack
    ``` 

- 为静态资源添加 domain

    ```bash
     yog2 release --dest debug --domains
    ``` 

上述的所有参数均可以组合使用，比如使用以下命令

```bash
yog2 release --watch --live --optimize --md5 --domains --pack --dest debug
```

就会组合相应的各种操作。

此外，这些参数还提供了缩写和组合的功能，比如上述的命令缩写后可以写成

```bash
yog2 release -w -L -o -m -D -p -d debug
```

还可以更进一步组合一下

```bash
yog2 release -wLomDpd debug
```

最后，如果忘记了命令，还可以使用 `-h` 参数进行查询

```bash
yog2 release -h

  Usage: release [options]

  Options:

    -h, --help             output usage information
    -d, --dest <names>     release output destination
    -m, --md5 [level]      md5 release option
    -D, --domains          add domain name
    -l, --lint             with lint
    -t, --test             with unit testing
    -o, --optimize         with optimizing
    -p, --pack             with package
    -w, --watch            monitor the changes of project
    -L, --live             automatically reload your browser
    -c, --clean            clean compile cache
    -r, --root <path>      set project root
    -f, --file <filename>  set fis-conf file
    -u, --unique           use unique compile caching
    --verbose              enable verbose output
```

> 关于静态资源的优化编译功能，建议使用 fis 的[文档](http://fis.baidu.com/)进行了解，会更加的全面。

#### plugin

yog2 plugin 命令用于安装 yog2 的插件功能，比如

```bash
yog2 plugin install session
```

就可以安装 session 插件，之后只需要在 `/conf/plugins/http.js` 的中间件配置中加上 `session` 就可以使用 session 功能。

除了内置的插件外，还可以直接从github上下载插件

```bash
yog2 plugin https://github.com/hefangshi/yog2-plugin-ral-promise
```

> 安装了这个插件可以将 `yog.ral` 包装为 Promise 形式的接口。

#### install

yog2 install 用于安装 fis 组件生态 [fis-components](https://github.com/fis-components) 中的各种组件

```bash
yog2 install jquery 
```

安装后，在 app 的前端代码中，就可以直接使用

```javascript
var $ = require('jquery');
```
