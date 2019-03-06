/*observer用于给data中所有的数据添加getter和setter
方便我们在获取获取色黄之data中数据的时候，实现我们的逻辑 */
class Observer{
   constructor(data){
       this.data = data,
       this.walk(data);
   } 

   //核心方法
   //遍历data中所有的数据，都添加上getter和setter
   walk(data){
       //如果data不存在，或者data 的类型不是object那么直接返回(不是对象不能修改值)
       if(!data || typeof data != 'object'){
           return
       }
       Object.keys(data).forEach(key =>{
           //给data对象的key设置getter和setter
        //    console.log(key);

           this.defineReactive(data,key,data[key])
           //如果data[key]是一个复杂的类型，递归的walk
           this.walk(data[key]);
       })
   }

   //定义响应式的数据（数据劫持）
    //    data中的每一个数据都应该维护一个dep对象
    //    dep保存了所有的订阅了该数据的订阅者
    // obj：给哪个对象添加值，key：对象的值，修饰符
   defineReactive(obj,key,value){
       let that = this;
        let dep = new Dep();
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            get(){
                //如果dep.target 中有watcher对象，存储到订阅者数组中
                Dep.target&&dep.addSub(Dep.target);
                console.log('你获取了值',value);
                return value 
            },
            set(newvalue){
                if(value === newvalue){
                    return
                }
                console.log('你设置了值',newvalue);
                value = newvalue
                //如果newvalue是一个对象，也应该对她进行劫持
                that.walk(newvalue);
                //需要调用watcher的updata方法
                dep.notify();
            }
        })
   }
}