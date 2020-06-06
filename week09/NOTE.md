# 每周总结

## 几个爬css标准的选择器

1 标准属性列表
```
document.querySelectorAll("#container li[data-tag~=css] h2:not(.Retired):not(.GroupNote)") 
```

2 在标准里找属性的选择器
```js
var nodes= document.querySelectorAll(".propdef [data-dfn-type=property]"); Array.from(nodes).map(x => x.textContent).toString()
```


