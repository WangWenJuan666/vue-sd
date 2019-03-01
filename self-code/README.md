
学习目的
    能够掌握vue中的双向数据绑定原理以及核心代码模块
    自己实现一个简单的vue框架
    学习ES6语法
    对于vue框架掌握的更加牢固
    使用vue开发时，遇到bug可以快速定位
    了解框架底层原理，面试加分
    代码摘抄自vue的源码，做了一定的简化。

mvvm框架介绍：
    m（model模型层）
    v（view视图层）
    vm（viewmodel视图模型，v与m链接的桥梁）
    当m层数据进行修改时，vm层会检测到变化，并且通过v层进行相应的修改
    修改v层则会通知m层惊醒修改
    mvvm框架实现了视图与模型层的相互解耦

双向数据绑定的方式
    发布订阅者模式（backbone.js）一般通过pub，sub的方式来实现数据和试图的绑定，但是使用起来比较麻烦
    脏值检查（angularJS）通过脏值检查的方式比对数据是否有更新，来决定是否更新视图，类似于通过定时器轮询测试数据是否发生了改变
    数据劫持：vue.js 则是采用数据劫持结合发布者-订阅者模式的方式。通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。
    vuejs不兼容IE8以以下的版本

vue实现思路
    实现一个Compiler模板解析器，能够对模版中的指令和插值表达式进行解析,并且赋予不同的操作
    实现一个Observer数据监听器，能够对数据对象的所有属性进行监听
    实现一个Watcher观察者，将Compile的解析结果，与Observer所观察的对象连接起来，建立关系，在Observer观察到对象数据变化时，接收通知，同时更新DOM
    创建一个公共的入口对象，接收初始化的配置并且协调上面三个模块，也就是vue

