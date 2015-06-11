---
---

## 日志管理

在 yog2 中，使用 [yog-log](https://github.com/fex-team/yog-log) 来处理日志功能，yog2 的日志功能的特点在于可以准确的提供请求的 `LogID` ，方便以请求为单位对问题进行追查。

> 准确提供请求级 `LogID` 的难点在于如何让各种与请求无关的模块正确的获取当前调用请求的 `LogID` ，如果使用全局变量，由于 Node.js 的异步 I/O 模型，不同请求直接的 `LogID` 会出现被覆盖的情况。 [yog-log](https://github.com/fex-team/yog-log) 则通过 `domain` 技术来保证了不同的请求之间，可以获取到正确的 `LogID`

### 日志配置

日志配置位于 project 的 `/conf/plugins/log.js` 中。它提供的配置有

- app

    配置日志的App名称，默认为 `yog`

- intLevel

    根据值的不同，控制Log输出的日志级别

    * `1`   打印FATAL
    * `2`   打印FATAL和WARNING
    * `4`   打印FATAL、WARNING、NOTICE (线上程序正常运行时的配置)
    * `8`   打印FATAL、WARNING、NOTICE、TRACE (线上程序异常时使用该配置)
    * `16`  打印FATAL、WARNING、NOTICE、TRACE、DEBUG (测试环境配置)

- auto_rotate

    控制是否自动将日志根据小时切分，默认为 `1`

- debug

    开启debug后，日志将在控制台输出而不是文件中输出，默认为 `0`

- format 与 format_wf

    用于配置常规日志与错误日志的日志格式，具体参数请参考 [yog-log](https://github.com/fex-team/yog-log)

- log_path

    Log的存放目录

### yog.log

`yog.log` 是用于记录日志的接口，他按照日志等级提供了多个接口

- yog.log.debug
- yog.log.trace
- yog.log.notice
- yog.log.warning
- yog.log.fatal

使用示例：

```javascript
// 打印NOTICE日志
yog.log.notice('server started');

// 记录详尽的FATAL日志
 yog.log.fatal({
   'stack':e, //错误堆栈
   'errno':120,  //错误码
   'msg' :'error happened!',  //错误消息
   'custom':{'key1' :'value1','key2':'value2'} //自定义消息
 });

// 记录简单的FATAL日志
yog.log.fatal('error happend!');
```
