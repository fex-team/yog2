---
---

## 使用 FIS3

YOG2 命令行工具同时支持 fis 与 fis3 编译核心，通过简单的设置就可以进行内核切换。

### 内核切换

```bash
yog2 release prod --fis3 # --fis3 建议跟在所有参数的最后
```

添加 --fis3 将激活 fis3 编译核心，当然这也意味着要求配置文件 fis-conf.js 使用 fis3 的语法进行配置

除了添加 --fis3 参数外，还可以通过环境变量配置来默认使用 fis3 编译核心

```bash
export YOG_MODE=fis3
```

> windows 用户可以直接在环境变量中设置。

在使用 fis3 编译核心后，所有的编译参数也将调整为 [fis3](http://fex.baidu.com/fis3/) 的命令行参数，因此使用前建议先阅读 fis3 的用户文档。

fis2 与 fis3 最大的区别就在于无需使用 `-d` 参数自定义输出，而是直接使用 `yog2 release debug --fis3` 来指定使用 debug 配置进行编译。

### fis2 升级

如果原有项目是使用 fis2 编译内核开发的，那么迁移到 fis3 编译内核的成本也非常小，所有的业务代码均无需修改，只需要重新按照 fis3 的配置语法调整打包与部署配置即可。 
