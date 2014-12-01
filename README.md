# yog2

## Usage

### 安装yog2

```bash
npm i -g yog2
```

### 初始化基础运行环境

```bash
yog2 init yog

cd yog

npm install

cd ../
```

### 加载Node运行时

**注意**

仅百度公司内部可用，外部用户可忽略此步骤

```bash
yog2 init node-runtime
```

### 发布业务APP

```bash
yog2 init app

# app_name: home

cd home

# 发布APP

yog2 release -d ../yog
```

### 运行

```bash
cd yog

node bin/www
```

百度公司内部可使用

```bash
cd yog

sh bin/yog_control start
```

访问http://127.0.0.1:8080