# toy browser
玩具浏览器，展示浏览器渲染流程

## 运行
```shell
npm install
# 打开服务器
node ./server 
# 打开客户端
node ./client
# 浏览器打开 build/viewport.svg
```

## 文件结构
```
.
├── build           # 输出文件
├── doc             # 相关组件文档
├── test            # 单元测试
├── adaptor         # 渲染器适配
├── client.js       # 浏览器客户端
├── css.js          # 样式计算
├── layout.js       # 布局计算
├── parser.js       # html解析
├── render.js       # 渲染器
├── selector.js     # css选择器解析
├── server.js       # 服务器

```
