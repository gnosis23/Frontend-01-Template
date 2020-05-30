# Selector parser
选择器 parser（简化版，暂时只支持单个复杂选择器）

## Usage
```js
// 输入
const input = `div.main span>a#id.cls[href="www.baidu.com"]`

const { parseSelector } = require('../selector');
console.log(parseSelector(input))
```

## 如何工作
### Lexer
先把输入拆成一个个token
```js
[
  { type: 'ident', text: 'div' },
  { type: 'single', text: '.' },
  { type: 'ident', text: 'main' },
  { type: 'space', text: ' ' },
  { type: 'ident', text: 'span' },
  { type: 'greater', text: '>' },
  { type: 'ident', text: 'a' },
  { type: 'hash', text: '#id' },
  { type: 'single', text: '.' },
  { type: 'ident', text: 'cls' },
  { type: 'single', text: '[' },
  { type: 'ident', text: 'href' },
  { type: 'single', text: '=' },
  { type: 'double-quoted-string', text: '"www.baidu.com"' },
  { type: 'single', text: ']' }
]
```

### Parser
按照文档里给的语法结构，解析语法树 (简化了)。碰到不满足以下的，直接抛错。
```
selector
    : simple_selector_sequence [ combinator simple_selector_sequence ]*
    ;

combinator
   /* combinators can be surrounded by whitespace */
   : PLUS S* | GREATER S* | TILDE S* | S+
   ;
 
simple_selector_sequence
   : IDENT
     [ HASH | class | attrib | negation ]*
   | [ HASH | class | attrib | negation ]+
   ;
 
class
  : '.' IDENT
  ;

attrib
  : '[' S* [ namespace_prefix ]? IDENT S*
        [ [ PREFIXMATCH |
            SUFFIXMATCH |
            SUBSTRINGMATCH |
            '=' |
            INCLUDES |
            DASHMATCH ] S* [ IDENT | STRING ] S*
        ]? ']'
  ;

negation
  : NOT S* [ type_selector | universal | HASH | class | attrib | pseudo] S* ')'
  ;
```


### Select对象
在解析语法树的同时，构建好一个个选择器对象给后续调用使用，对象结构如下

```ts
declare type Selector = { 
    tagName?: String;       // 标签名可以为空
    ids: String[];          // id名 
    classes: String[];      // class名
    attributes: Object[];   // 属性名，{ name, operator, operand }
    notTagNames: String[];  // 非标签名
    notIds: String[];       // 非id
    notClasses: String[];   // 非class
    notAttributes: Object[];// 非属性名
    isUniversal: Boolean;   // 是否为通配符
    combinator?: String;    // 与上层选择器的关系，比如 子孙、直接父子、邻居、亲戚...
}
```

## 其他
### 元素匹配
- `A B`: 搜祖先结点
- `A>B`: 搜父结点
- `A+B`: 搜相邻结点
- `A~B`: 一直搜前面的结点

### Specificity计算
有了上面这个结构很容易就能计算出来


## TODO
- 支持多个选择器组
- 支持伪类
- 支持命名空间
