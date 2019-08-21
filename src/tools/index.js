// 获取缓存
function getSessionStorage(key){
    return window.sessionStorage.getItem(key);
}

// 设置缓存
function setSessionStorage(key,value){
    return window.sessionStorage.setItem(key,value)
}

// 导出设置、获取缓存模块
export {
    getSessionStorage,
    setSessionStorage,
}