## CHANGELOG

#### 2015年07月08日

发布 0.1.2

提供 `yog2 run` 与 `yog2 util` 两个命令行工具，用于提升开发部署体验

#### 2015年05月08日

##### 改进

- [yog2-plugin-recv-reload](https://github.com/hefangshi/yog2-plugin-recv-reload) 发布，实现APP代码在开发期无重启更新，极大提高开发效率。(需配合最新 [yog2-kernel](https://github.com/fex-team/yog2-kernel) 内核使用)
- [node-ral](https://github.com/fex-team/node-ral) 文档补充完成，并添加多个使用示例

##### BUG修复

- [bigpipe.js](https://github.com/fex-team/yog2-app-template/blob/master/client/static/js/bigpipe.js) 在同时发起多个Pagelet请求时，回调函数会在第一个Pagelet返回时全部触发。
- [node-ral@0.0.34](https://github.com/fex-team/node-ral) 在同时发起多个请求时，后续设置的pack与unpack会影响前面请求的设置 [54e31b2](https://github.com/fex-team/node-ral/commit/54e31b244eb124e9834f3b49f6492dc0d6888e7f)
- [yog2-kernel@0.2.3](https://github.com/fex-team/yog2-kernel) 在设置rootRouter后，app中的`router.js` 会过早引入，可能导致一些全局变量没有赋值就被引用 [8fcd141](https://github.com/fex-team/yog2-kernel/commit/8fcd141c997a7d0a771cdaf271da8289b5380532)
- [yog2-plugin-recv-reload](https://github.com/hefangshi/yog2-plugin-recv-reload)  没有修改服务端代码时，后端模板无法更新 [857028d](https://github.com/hefangshi/yog2-plugin-recv-reload/commit/857028d902c9a1235440024d93ee827e221a5b7b)

以上问题均建议更新

##### 已知问题

- [node-ral](https://github.com/fex-team/node-ral) 开启日志后，性能有较大的下降
