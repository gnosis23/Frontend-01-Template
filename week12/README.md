# 本周作业

- [四则运算:支持括号](./ast.html)
- [Trie树](./trie.js)
- [kmp](./kmp.js)

## 四则运算产生式

```
Start ::=
    Expression EOF
;

Expression ::=
    AdditiveExpression
;

AdditiveExpression ::=
    MultiplicativeExpression
    | AdditiveExpression + MultiplicativeExpression
    | AdditiveExpression - MultiplicativeExpression
;

MultiplicativeExpression ::=
    PrimaryExpression
    | MultiplicativeExpression * PrimaryExpression
    | MultiplicativeExpression / PrimaryExpression
;

PrimaryExpression ::=
    Number
    | ( Expression )
;
```
