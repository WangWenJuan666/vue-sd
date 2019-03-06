/*专门负责解析模板内容 */
class Compile{
    //参数1：模板
    //参数2：整个vue实例
    constructor(el,vm){
        //el:new vue传递的选择器
        //防止传进来的是一个对象
        this.el = typeof el ==='string' ? document.querySelector(el):el
        //vm:new 的实例 
        this.vm = vm

        //编译模板
        //保证模板存在
        if(this.el){
            //1.把el中所有的子节点都放入到内存中 fragment
            let fragment = this.node2Fragment(this.el)
            // console.dir(fragment,'dd');

            //2.在内存中编译fragment
            this.compile(fragment);
            //3.把fragment一次性的添加到页面中
            this.el.appendChild(fragment);
        }
    }

    /*核心方法*/
    node2Fragment(node){
        let fragment = document.createDocumentFragment()
        //把el中所有的子节点挨个添加到文档碎片中
        let childNodes = node.childNodes//内数组
        this.toArray(childNodes).forEach(node =>{
            //把所有的子节点都添加到fragment中
            // console.log(node,'node');
            fragment.appendChild(node)
        })
        return fragment;
    } 
    /**编译文档碎片（内存中）
     * @param { * } fragment
     */

    compile(fragment){
        let childNodes = fragment.childNodes
        this.toArray(childNodes).forEach(node=>{
            //编译子节点
            // console.log(node);
            
            //如果是元素，需要解析指令
            if(this.isElementNode(node)){
                
                this.compileElement(node)
                
            }
            //如果是文本节点，需要解析差值表达式
            if(this.isTextNode(node)){
                this.compileText(node)
            }
            //如果当前节点还有子节点，我们需要递归判断节点
            if(node.childNodes && node.childNodes.length>0){
                //保证所有的节点都能解析到
                this.compile(node);
            }
        })

    }

    //解析html标签
    compileElement(node){
        // console.log('需要解析html标签');

        //获取到当前节点下所有的属性
        let attributes = node.attributes
        this.toArray(attributes).forEach(attr =>{
            //2解析vue的指令，都有以v-开头的指令 
            let attrName = attr.name;
            
            if(this.isDirective(attrName)){
                //拿到指令的类型
                let type = attrName.slice(2);
                let expr = attr.value;
                //如果是v-text指令
                // if(type === 'text'){
                //     // 解析出来text的值
                //     CompileUtil['text'](node,this.vm,expr);
                // }
                //如果是html
                // if(type === 'html'){
                //     // 解析出来text的值
                //     CompileUtil['html'](node,this.vm,expr);
                    
                // }
                // //解析v-model指令
                // if(type === 'model'){
                //     // 解析出来text的值
                //     // node.value = this.vm.$data[expr];
                //     CompileUtil['model'](node,this.vm,expr);
                // }
                //解析v-on事件
                if(this.isEventDirective(type)){
                    CompileUtil['eventHandle'](node,this.vm,type,expr); 
                }else{
                    // console.log(type);
                    CompileUtil[type] && CompileUtil[type](node,this.vm,expr);
                }
            }
        })
        
    }
    //解析文本text(差值表达式  )
    compileText(node){
        // console.log('需要解析文 本节点');
        
        CompileUtil.mustache(node, this.vm)
    }
    /*工具方法 */
    toArray(likeArray) {
        return [].slice.call(likeArray)
    }

    //
    isElementNode (node){
        //nodeType:节点类型，1：元素系欸但，3：文本节点
        return node.nodeType === 1;
    }

    isTextNode (node){
        return node.nodeType === 3;
    }

    //判断是否是一个指令
    isDirective(attrName){
        return attrName.startsWith('v-')
    }

    //判断是否是事件指令
    isEventDirective(attrName){
        return attrName.split(':')[0] === 'on';
    }

    
}


//提供一个对象，专门用来解析指令
let CompileUtil = {
    //差值表达式，（小胡子）
    mustache(node,vm){
        let txt = node.textContent;
        // console.log(txt);
        let reg = /\{\{(.+)\}\}///任意字符并且一个以上
        if(reg.test(txt)){
            let expr = RegExp.$1;
            // console.log(expr);
            // node.textContent = this.vm.$data[expr];
            node.textContent = txt.replace(reg,this.getVMValue(vm,expr));
            //通过watcher对象，监听expr的数据的变化，一旦变化了，我们就执行我们的回调函数
            new Wacher(vm,expr,newValue=>{
                console.log('我会执行么');
                node.textContent = txt.replace(reg,this.getVMValue(vm,expr));
            })
        }
    },
    //处理v-text指令 
    text(node,vm,expr){
        node.textContent = this.getVMValue(vm,expr);
        //通过watcher对象，监听expr的数据的变化，一旦变化了，我们就执行我们的回调函数
        new Wacher(vm,expr,newValue=>{
            console.log('我会执行么');
            node.textContent = newValue;
        })
    },
    html(node,vm,expr){
        // node.innerHTML = vm.$data[expr];
        node.innerHTML =  this.getVMValue(vm,expr);
        //通过watcher对象，监听expr的数据的变化，一旦变化了，我们就执行我们的回调函数
        new Wacher(vm,expr,newValue=>{
            console.log('我会执行么');
            node.innerHTML = newValue;
        })
    },
    model(node,vm,expr){
        let self  = this;
        node.value =  this.getVMValue(vm,expr);
        //实现双向数据绑定，给node注册input时间，当当前原色的value值发生改变，修改对应的数据
        node.addEventListener('input',function(){
            self.setVMValue(vm,expr,this.value)
        })
        //通过watcher对象，监听expr的数据的变化，一旦变化了，我们就执行我们的回调函数
        new Wacher(vm,expr,newValue=>{
            console.log('我会执行么');
            node.value = newValue;
        })
    },
    eventHandle(node,vm,type,expr){
        //给当前元素注册事件即可
        let eventType = type.split(':')[1]
        // console.log(vm.$methods[expr]);
        //如果
        let fn = vm.$methods && vm.$methods[expr];
        if(eventType  && fn){
            node.addEventListener(eventType,fn.bind(vm));//this指向节点
        }   
    },
    //用于获取VM的数据
    getVMValue(vm,expr){
        //获取到data中的数据
        let data = vm.$data
        // console.log(data);
        expr.split('.').forEach(key=>{
            data = data[key]
        })
        return data
    },
    //
    setVMValue(vm,expr,value){
        let data = vm.$data;
        console.log(vm)
        let arr = expr.split('.')
        arr.forEach((key,index) =>{
            //如果index是最后一个
            if(index<arr.length-1){
                data= data[key]
            }else{
                data = value
            }
        })
    }
}