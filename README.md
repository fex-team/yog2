# YOG2

yog2 是一个专注于 Node.js UI 中间层的应用框架。它基于 express 和 fis 开发，在享受 express 的灵活扩展能力和 fis 强大的前端工程化能力的同时，引入了自动路由、app 拆分以及后端服务管理模块来保证UI中间层的快速开发与稳定可靠。

------------------

## 兼容性

- [x] node 0.8.x
- [x] node 0.10.x
- [x] node 0.12.x
- [x] io.js

同时支持 fis 与 fis3 两种编译核心

## 入门指引

### 安装yog2

> 需要先安装 [node](http://nodejs.org).

```bash
npm install -g yog2
```

### 创建project

yog2 project是基础的运行框架，提供一些基础的配置和中间件管理。通过使用 yog2 提供的脚手架，可以快速创建一个基础的 yog2 project

```bash
yog2 init project
# prompt: Enter your project name:  (yog)
```

### 创建app

yog2 app 是应用的业务代码，每一个 app 都是一个独立的子项目，包含了这个子项目中所有的前后端代码。我们可以利用 yog2 release 功能将 app 发布至 yog2 project 中来运行 app。

利用 yog2 的 app 拆分能力，我们可以将一个中大型规模的项目按照功能或业务划分为多个独立的 app ，每个 app 均可以独立开发、编译、部署。当项目的业务较简单时，也可以只使用一个 app 来管理代码。

```bash
yog2 init app
# prompt: Enter your app name:  (home)
```

### 开发调试

#### 安装依赖

首先我们需要为 yog2 project 安装执行必须的依赖

```bash
# 进入 yog project 目录
cd yog 
npm install
```

#### 启动框架

然后我们就可以用开发调试模式启动 yog2 project，让运行框架可用

> 切勿在生产环境使用开发调试模式启动 yog2 project，这样的行为将会引发安全问题。

```bash
yog2 run
```

yog2 project 的默认端口是 8085，你可以通过修改 `PORT` 环境变量或者直接修改 `app.js` 来指定端口。

此时如果我们访问 `http://127.0.0.1:8085` 由于我们并未部署应用，我们只会得到一个 404 页面。因此下一步我们就需要部署 app。

#### 部署app

由于启动 yog2 project 后会一直占用控制台，因此我们需要另外开启一个控制台去部署 app。

```bash
# 进入home目录
cd home
yog2 release --dest debug
```

> yog2 release --dest debug 必须要求运行框架以调试模式启动后使用，否则无法正确的部署代码。

再次访问 `http://127.0.0.1:8085` 我们就会看到网站已经正常提供服务了。

此外，如果我们在执行 yog2 release 命令时添加 `--watch` 参数，yog2 就会监听文件修改，并自动部署至 yog2 project 。通过 yog2 的热更新技术，只要是 app 中的代码，无论是静态资源还是后端模板亦或是后端逻辑，均无需重启 yog2 project 就可以生效。

```bash
yog2 release --dest dev --watch
```

## 文档

请查阅 [官网](http://fex.baidu.com/yog2)
