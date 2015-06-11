---
---

## 目录结构

yog2 将传统的一站式开发分解为了 yog2 project 与 yog2 app，yog2 project 是基础的运行框架，负责中间件初始化和建立基础环境。yog2 app 是应用的业务代码，每一个 app 都是一个独立的子项目，包含了这个子项目中所有的前后端代码。当项目的业务较简单时，也可以只使用一个 app 来管理代码。

一个完整的 yog2 目录结构应该类似

```bash
├─home
│  ├─client
│  │  ├─page
│  │  ├─static
│  │  └─widget
│  └─server
│      ├─action
│      ├─lib
│      └─model
├─user
│  ├─client
│  │  ├─page
│  │  ├─static
│  │  └─widget
│  └─server
│      ├─action
│      ├─lib
│      └─model
└─yog
    ├─app
    ├─bin
    ├─conf
    │  ├─plugins
    │  └─ral
    ├─plugins
    ├─static
    └─views
```


### project目录

```bash
├─yog
    ├─app                 # server代码目录
    ├─conf                # 配置目录
    │  ├─plugins         # 插件配置  
    │  └─ral             # 后端服务配置
    ├─plugins             # 插件目录
    ├─static              # 静态资源目录
    ├─views               # 后端模板目录
    └─app.js              # project 启动入口
```

project 目录中的 `app` `static` `views` 目录均是通过 yog2 release 部署生成的，不需要手动修改。

### app目录

```bash
├─client                 # 前端代码
│  ├─page                # 前端页面
│  ├─static              # 前端非模块化静态资源
│  │  ├─css
│  │  └─js
│  └─widget              # 前端组件
├─fis-conf.js            # FIS编译配置
└─server                 # 后端代码
    ├─action             # Action是指MVC中的路由动作，处理页面请求
    ├─lib                # 可以存放一些通用库
    ├─model              # 可以存放一些数据层代码，如后端API请求等
    └─router.js          # AppRouter路由，用于处理自动路由无法满足的需求
```
