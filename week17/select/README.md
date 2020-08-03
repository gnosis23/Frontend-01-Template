# 命令行选择器

## Usage
```js
const select = require('./index');

void async function() {
  console.log('which framework do you want to use?');
  const selected = await select(["vue", "react", "angular"]);
  console.log('You selected ' + selected + '');
  process.exit();
}();
```

## 原理
通过输出特定的字符，可以控制命令行中光标的位置或做一些特殊操作，比如：
- '\033[1A' = 上移光标
- '\033[1B' = 下移光标
- '\033[1C' = 右移光标
- '\033[1D' = 左移光标
- '\033[nK' = 清空n行
- '\033[n;mH' = 移动到n行m列

具体参考[Wiki](https://en.wikipedia.org/wiki/ANSI_escape_c)。

有了这些就可以像画图一样渲染命令行界面，当用户在选择时（按键），触发修改，然后重新渲染界面。
直到按下回车键或强行退出。
```
render => keypress => render ... => <Enter> => 结束
```

