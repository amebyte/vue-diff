exports.vueDiff = (c1, c2, { mountElement, patch, unmount, move }) => {
    function isSameVnodeType(n1, n2) {
        return n1.key === n2.key; //&& n1.type === n2.type;
    }
    let i = 0
    let e1 = c1.length - 1
    let e2 = c2.length - 1
    // *1. 从左边往右查找，如果节点可以复用，则继续往右，不能就停止循环
    while(i <= e1 && i <= e2) { // 通过上面分析我们可以知道循环条件
        // 取出新老元素
        const n1 = c1[i]
        const n2 = c2[i]
        // 对比是否一样
        if(isSameVnodeType(n1, n2)) {
            // 一样就递归调用
            patch(n1.key)
        } else {
            // 如果不一样就退出循环
            break
        }
        i ++ // 指针往后移动
    }

    // *2. 从右边往左边查找，如果节点可以复用，则继续往左，不能就停止循环
    while(i <= e1 && i <= e2) {
        // 取出新老元素
        const n1 = c1[e1]
        const n2 = c2[e2]
        // 对比是否一样
        if(isSameVnodeType(n1, n2)) {
            // 一样就递归调用
            patch(n1.key)
        } else {
            // 如果不一样就退出循环
            break
        }
        // 指针移动
        e1--
        e2--
    }
    
    // *3. 老节点没了，新节点还有
    if(i > e1) {
        if(i <= e2) {
            // 新节点可能存在多个，所以需要循环
            while (i <= e2) {
                const n2 = c2[i];
                mountElement(n2.key);
                i++;
            }
        }
    }
}