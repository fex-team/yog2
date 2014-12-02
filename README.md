# Yog2

## Yog2简介

TODO

## 快速入门

### 工具安装

如果还没有安装 [node](http://nodejs.org) 请先安装 [node](http://nodejs.org).

```bash
npm install -g yog2
```

### 创建一个Yog2项目

Yog2项目可以使用Yog2工具直接创建

```bash
# project目录
yog2 init yog
```

### 创建一个Yog2 App

Yog2提供了App拆分能力，即可以将一个站点或多个站点拆分为多个App，多个App可以部署至同一个Yog2项目中同时运行。

```bash
# project目录
yog2 init app
# prompt: Enter your app name:  (home)
```

### 安装Node一体化环境

此项仅适用于百度公司内部，用于安装线上Node基础环境，外部用户可以忽略，直接使用自带的Node环境

```bash
# project目录
yog2 init node-runtime
```

### 部署Yog2 App

```bash
# project目录
cd home
# home目录
yog2 release -d ../yog #将home app发布至同级的yog目录中
cd ..
```

### 启动Yog2项目

```bash
# project目录
cd yog
npm i
node ./bin/www
```

#### Node一体化环境启动

```bash
# project目录
cd yog
npm i #执行过可忽略
./bin/yog_control start
```

#### 调试模式启动

```bash
# project目录
cd yog
npm i #执行过可忽略
npm run-script debug
```

访问 [http://127.0.0.1:8080](http://127.0.0.1:8080) 即可查看运行效果

> 注意，如果端口8080被占用会提示启动异常EADDRINUSE，只需要调整bin/www文件中的默认端口即可
> 也可以设置PORT环境变量来调整启动端口

## Yog2特点

### App拆分

#### 前后端一体App

#### 目录规范

##### Client

##### Server

#### 扩模块引用

#### App部署

### 前端能力

#### FIS静态资源管理

#### 前端组件化

#### Everything in FIS

### 后端能力

#### 启动初始化

#### 插件管理

##### 内置插件

##### 用户插件

##### 插件依赖

##### 插件配置项

#### 自动路由

##### 默认配置

##### 路由扩展

###### rootRouter

###### appRouter

### BigPipe

### SPA

### Yog对象

#### yog.dispatcher

#### yog.require

#### yog.log

#### yog.ral
