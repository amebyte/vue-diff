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
    // *4. 老节点还有，新节点没了
    } else if(i > e2) {
        while(i <= e1) {
            const n1 = c1[i];
            unmount(n1.key);
            i++;
        }
    } else {
        // 中间对比
        let s1 = i // 老节点的开始
        let s2 = i // 新节点的开始
        // 新节点的映射表
        const keyToNewIndexMap = new Map()
        for(let i = s2; i <= e2; i++) {
            const nextChild = c2[i]
            keyToNewIndexMap.set(nextChild.key, i)
        }

        // 遍历老节点里面的key
        for(let i = s1; i <= e1; i++) {
            const prevChild = c1[i]
            let newIndex
            if(prevChild.key !== null || prevChild.key !== undefined) {
                // 如果用户设置了key那么就去映射表里面查询
                newIndex = keyToNewIndexMap.get(prevChild.key)
            } else {
                // 如果用户没有设置key，那么就遍历所有，时间复杂度为O(n)
                for(let j = s2; j < e2; j++) {
                    if(isSameVnodeType(prevChild, c2[j])) {
                        newIndex = j
                        break
                    }
                }
            }
            // 如果在新的节点里面没有找到
            if(newIndex === undefined) {
                // 没有找到就删除
                unmount(prevChild.key)
            } else {
                // 找到就递归调用
                patch(c2[newIndex].key)
            }
        }
    }
}