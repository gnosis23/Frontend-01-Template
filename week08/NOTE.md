# 每周总结

## css选择器match

1 首先将 css selector 转为内部的数据结构，最后是如下格式：
```
[
  { 
    tagName?: String;       // 标签名可以为空
    ids: String[];          // id名 
    classes: String[];      // class名
    attributes: Object[];   // 属性名，{ name, operator, operand }
    notTagNames: String[];  // 非标签名
    notIds: String[];       // 非id
    notClasses: String[];   // 非class
    notAttributes: Object[];// 非属性名
    isUniversal: Boolean;   // 是否为通配符
    combinator?: String;    // 与上层选择器的关系
  }
]
```

2 然后从dom元素开始匹配，其他的属性都比较直观，除了combinators

- 当combinator是" "的时候，如果当前结点不匹配，继续往父结点匹配
- 当combinator是 > 的时候，如果当前结点不匹配，继续往父结点匹配，不匹配就返回false
- 当combinator是 ~ 的时候，如果当前结点不匹配，继续往兄弟结点匹配
- 当combinator是 + 的时候，如果当前结点不匹配，继续往兄弟结点匹配，不匹配就返回false

