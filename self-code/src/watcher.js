/*
watcher模块负责吧compile和observe模块关联起来

*/
class Wacher{
    //vm:当前的vuw实例
    //expr：data中的数据的名字
    //一旦数据发生了改变，需要调用cb
    constructor(vm,expr,cb){
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;

        //this表示的就是新创建的watcher对象
        //村粗到dep.target属性上
        Dep.target = this;
        //需要把expr的旧值给存储起来
        // this.oldVlue = this.vm.$data[expr];//如果出现car.brand的情况，就是在vm中修改的值
        this.oldVlue =this.getVMValue(vm,expr)
        //  清空掉Dep.target
        Dep.target = null
    }
    //对外暴露的一个方法，这个方法用于更新数据
    update(){
        //对比expr是否发生了改变
        //如果发生了改变，则需要调用cb
        let oldValue = this.oldVlue;
        let newValue = this.getVMValue(this.vm,this.expr);
        if(oldValue != newValue){
            this.cb(newValue,oldValue);
        }
    }
    //用于获取VM的数据
    getVMValue(vm,expr){
        //获取到data中的数据
        let data = vm.$data
        // console.log(data);
        expr.split('.').forEach(key=>{
            data = data[key]
        })
        return data
    }
}
/**dep用于管理所有的订阅者和通知这些订阅者 */
class Dep{
    constructor(){
        //用于管理订阅者
        this.subs = [];
    }
    //添加订阅者
    addSub(watcher){
        this.subs.push(watcher);
    }

    //notify通知
    notify(){
        //遍历所有的订阅者，调用watcher和updata方法
        this.subs.forEach(sub =>{
            sub.update()
        })
    }
}