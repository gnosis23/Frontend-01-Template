# 盘点JavaScript中对象内部属性和方法

标题中的对象分为2种：普通对象和 Exotic 对象（指拥有特殊属性的，没法直接创建的对象，如Array）。

## 1 普通对象 Ordinary Object

普通对象有 2 个内部槽（internal slot）：
- [[prototype]] 指向原型对象
- [[extensible]] 用来标记对象是否可以添加属性

普通对象有 11 个内部方法（internal method）：

- [[GetPrototypeOf]]
- [[SetPrototypeOf]]
- [[Get]]
- [[Set]]
- [[HasProperty]]
- [[Delete]]
- [[GetOwnProperty]]
- [[DefineOwnProperty]]
- [[OwnPropertyKeys]]
- [[IsExtensible]]
- [[PreventExtensions]]

## 2 函数对象 Function Objects

函数对象除了拥有普通对象的内部槽和内部方法外，还有如下额外的内部槽：

- [[Environment]] 函数定义地方的词法环境
- [[FormalParameters]] 
- [[FunctionKind]] 函数类型
- [[ECMAScriptCode]]
- [[ConstructorKind]]
- [[Realm]]
- [[ScriptOrModule]]
- [[ThisMode]] 如何解析this
- [[Strict]] 严格模式
- [[HomeObject]] 对这个属性值使用 GetPrototypeOf 来获取 super
- [[SourceText]]

内部方法有2个：

- [[Call]] 普通调用使用的内部方法
- [[Construct]] 作为构造函数所使用的内部方法

## 3 Exotic 对象 Exotic Objects

### 3.1 Bound Function Exotic Objects

简介：Function.prototype.bind 会产生一个 bound function 对象。 一个 bound function 没有普通函数的内部槽，但它有 [[Call]] 和 [[Constructor]] 方法。调用它们会间接调用被包裹的函数。

特殊的内部槽如下：
- [[BoundTargetFunction]] 被包裹的函数
- [[BoundThis]] bind时候的this参数
- [[BoundArguments]] bind时候的其他参数

### 3.2 Array Exotic Objects

属性 length 特殊处理
方法 [[DefineOwnProperty]] 特殊处理。

### 3.3 String Exotic Objects

简介：String对象封装了字符串值，暴露出数字下标，length等属性。

内部槽 
- [[StringData]]

### 3.4 Arguments Exotic Objects

简介：大多数函数内都有一个arguments对象。arguments对象是个特殊的数组，索引指向函数调用时的参数。

除了拥有普通对象的内部槽以外，还拥有内部槽 [[ParameterMap]]（待补充）


### 3.5 Integer-Indexed Exotic Objects

简介：用于 TypedArray 系列，待补充

拥有额外的特殊槽

- [[ViewedArrayBuffer]]
- [[ArrayLength]]
- [[ByteOffset]]
- [[TypedArrayName]]

### 3.6 Module Namespace Exotic Objects

- [[Module]]
- [[Exports]]
- [[Prototype]]

### 3.7 Immutable Prototype Exotic Objects

拥有内部槽 [[Prototype]] 不变的。

## 4 Proxy Object

> 简介：代理对象是部分内部方法被es代码实现的 extoic object。它有一个 [[ProxyHandler]] 可用于自定义一个或多个内部方法。还有个内部属性 [[ProxyTarget]] 可用于存储 target 对象。

拥有内部槽：
- [[ProxyHandler]]
- [[ProxyTarget]] 

