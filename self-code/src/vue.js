// 定义一个类，用于创造vue实例
class Vue{
    // options:传递过来的参数
    // options = {}es6的写法
    constructor(options = {}){
        options = options ||{}//如果没有传参的话
        // $el:因为vue有加$的习惯
        //先把传递的参数存起来，在将来的一些方法中通过this.$el获取到
        this.$el = options.el;
        this.$data = options.data;
        this.$methods = options.methods;

        //监听data中的数据
        new Observer(this.$data);
        //把data中所有的数据代理到了vm上
        this.proxy(this.$data);
        //把methods中所有的数据代理到了vm上
        this.proxy(this.$methods);
        //如果制定了el参数，对el进行解析
        if(this.$el){
            //Compile负责解析模板的内容
            //需要：模板和数据（把整个vue实例传过去，为防止以后增加更多的方法）
            new Compile(this.$el,this)
        }
    }
    //代理
    proxy(data){
        Object.keys(data).forEach(key=>{
            Object.defineProperty(this,key,{
                enumerable:true,
                configurable:true,
                get(){
                    return data[key]
                },
                set(newValue){
                    if(data[key] == newValue){
                        return
                    }
                    data[key] = newValue;
                }
            })
        })
    }
}