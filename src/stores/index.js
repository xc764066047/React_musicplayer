// 更新状态原理
// 1.创建状态仓库store
// 2.各个组件里的mapStateToProps监听原始数据state
// 3.渲染的dom组件上有事件监听器,执行满足监听器的操作触发派发任务mapDispatchToProps，改变各个任务action的type和payload（数据）
// 4.store里监听到任务action，根据类型返回action.payload给状态state
// 5.各个组件里的mapStateToProps监听state，一旦发生改变，就更新对应的数据
// 6.渲染的dom组件的监听器执行对应的方法


// 导入状态仓库和拿来放所有状态的Reducer依赖
import { createStore, combineReducers } from 'redux';

// 创建Reducer函数,用于对react的数据进行更新。,state默认false，表示没进入更改数据的操作时，是没有值的,当传进payload时将state改为true。action是任务
function headerArrowReducer(state=false, action) {
    // 如果事件类型是发生改变，那就返回事件里的数据
    if(action.type === "HEDERARROW_CHANGE") {
        return action.payload;
    }else {
        // 否则就返回原始的数据
        return state;
    }
};


// 关于播放哪一首音乐的reducer，利用每首音乐id不同来传递数据
// 默认id是没有的，所以这里的state为空
function musicNameIdReducer(state='',action){
    if( action.type === "MUSICNAMEID_CHANGE"){
        return action.payload;
    }else{
        return state;
    }
}

// 关于播放音乐的reducer,点击播放后让state变为true，也就是要传入任务action，action.payload变为true赋值给state
function isMusicPlayReducer(state=false, action) {
    // 如果事件类型是发生改变，那就返回事件里的数据
    if(action.type === "ISMUSICPLAY_CHANGE") {
        return action.payload;
    }else {
        // 否则就返回原始的数据
        return state;
    }
};

function musicNameReducer(state="巅峰榜 . 热歌",action){
    if( action.type === "MUSICNAME_CHANGE"){
        return action.payload;
    }else{
        return state;
    }
}

// 将所有改变数据的reducer  拆分，组成一个大的reducers。
var reducers = combineReducers({
    headerArrow : headerArrowReducer,
    musicNameId : musicNameIdReducer,
    isMusicPlay : isMusicPlayReducer,
    musicName : musicNameReducer,
})

// 声明store为组件仓库,里面第二个参数是chrome自带的调试工具的参数
var store = createStore(reducers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// 将store暴露出去
export default store;