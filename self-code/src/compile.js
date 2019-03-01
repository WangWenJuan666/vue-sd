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
            console.log(node);
        })

    }
    /*工具方法 */
    toArray(likeArray) {
        return [].slice.call(likeArray)
      }
}