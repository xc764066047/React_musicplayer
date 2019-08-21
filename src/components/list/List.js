// 此文件是列表页的组件 
// 让react支持jsx语法,react是package.json中的组件,Component是组件集合
import React, {Component} from 'react';

// 导入connect组件
import { connect } from 'react-redux';

// 导入package.json里的axios组件，axios用来接入api
import axios from 'axios';

// 导入列表页的css
import './List.css';

// 导入loading效果
import Loading from '../loading/Loading';

// 导入缓存模块
import {getSessionStorage,setSessionStorage} from '../../tools/index.js';

// 定义List组件
class ListUI extends Component {
	// 生命周期第一阶段，constructor
	constructor() {
		// 有constructor的地方必定要写super()，它能将this绑定在事件上
		super();
		this.state = {
			// 初始化歌曲列表
			musicList : [],
			isLoading: true
		}

		// 设置一个状态值用于区分滑动和点击
		this.isMove = false;

		this.handleMove = this.handleMove.bind(this);
		this.handleEnd = this.handleEnd.bind(this);
	}

    // 渲染内容，生命周期第三阶段。第二阶段是componentWillMount，将进入dom渲染
    render() {
		// 注意，jsx语法里的class要写成className
        return (
            <div id="musicList" ref="musicList">
			<ul>
				{	
					// 先判断是否加载loading动画
					this.state.isLoading ? <Loading /> :
					// 遍历返回的歌曲列表对象
					this.state.musicList.map((item,index) => {
						return (
							// key是ajax返回的数据的id，即item.id,onTouchStart
							<li className={ this.props.musicNameId ===  '' + item.id ? 'active' : '' } key={item.id} onTouchMove={ this.handleMove } onTouchEnd={ ()=>{this.handleEnd(item.id,item.title)} }>
									<div className="listOrder">{index+1}</div>
									<div className="listName">
										<h3>{item.title}</h3>
										<p>{item.author}</p>
									</div>
							</li>
						)
						
					})
				}
				
			</ul>
		</div>
		)
	}
	
	// 写一个渲染结束后的生命周期，即已经进入DOM后执行
	componentDidMount() {
		// 每次回到歌曲列表页要先进行判断是否有缓存
		var musicList = getSessionStorage('musicList');
		if(musicList) {	// 如果缓存存在，就直接更新state，不用重新加载歌曲列表页
			this.setState({
				musicList:JSON.parse(musicList),
				isLoading:false
			}, ()=> {
				// 让选中的歌曲的位置置顶
				this.listScrollTop();
				console.log('执行了')
			})
		}else {
			// 用axios发送ajax请求，完整地址是https://api.hibai.cn/api/index/index，已经用proxy进行了首地址反向代理，所以只需要输入剩下的url即可
			axios.post('/api/index/index', {
				// 发送json数据
				"TransCode": "020111",
				"OpenId": "Test",
				"Body":{"SongListId": "141998290"},
			}).then((res)=> {			// ajax请求成功后执行then
				console.log(res.data);	// 打印返回的内容

				// 判断返回的数据中的状态变量ErrCode是否是OK（这个变量是原网站提供的，并非我们在这里定义的）
				if(res.data.ErrCode === 'OK') {
					// 将歌曲列表信息保存到变量中
					var musicList = res.data.Body.songs;

					// 将state进行更新
					this.setState({
						musicList,
						isLoading:false
					}, ()=>{
						// 如果成功获取到选中歌曲，返回列表页的时候将该歌曲置顶
						this.listScrollTop();
						// 设置缓存
						setSessionStorage('musicList',JSON.stringify(this.state.musicList));
					})
				}
			})
			this.props.headerArrowFn();
		}
	}

	// 让被选中播放的歌曲始终显示在列表页最顶端
	listScrollTop() {
		// this.refs.musicList.scrollTop = 300;
		var musicList = this.refs.musicList;
		// 获取到所有的li元素，用for遍历出带有className为active的那个li元素，然后置顶在页面上方
		var musicListLi = musicList.getElementsByTagName('li');
		for(var i=0;i<musicListLi.length;i++){
			if(musicListLi[i].className){
				musicList.scrollTop = musicListLi[i].offsetTop;
			}
		}
	}
	

	// 触摸屏幕的函数
	handleMove(){
		this.isMove = true;
	}

	handleEnd(id,musicName){
		if(this.isMove){
			this.isMove =false;
		}else{		// 只有值为false的时候，手指移开屏幕才会传入url
			
			// 跳转到歌曲背景图播放页
			this.props.history.push('/pic/'+id);
			// 传递选中歌曲的id
			this.props.musicNameIdFn(id);
			// 播放对应id的歌曲
			this.props.isMusicPlayFn();
			// 传递歌曲的名字,更新到播放器顶部
			this.props.musicNameFn(musicName);
		}
	}
}

// 监听数据state是否发生改变
// 用于获取状态的数据的方法
function mapStateToProps(state) {
    return {
        // 当状态发生变化时，要获取到store里的状态state里的musicNameId
        musicNameId : state.musicNameId,
    }
};
// 用于派发任务的方法
function mapDispatchToProps(dispatch) {
    return {
		headerArrowFn(){
			dispatch({
                type:'HEDERARROW_CHANGE',payload:false
            });
		},
        musicNameIdFn(id){
            // dispatch是派遣的意思，这里用做派发任务
            dispatch({
                // 这里派发任务后就会触发store里面的index.js里的reducer判断
                type:'MUSICNAMEID_CHANGE',payload:id
            });
		},
		isMusicPlayFn(){
            // dispatch是派遣的意思，这里用做派发任务
            dispatch({
                // 这里派发任务后就会触发store里面的index.js里的reducer判断
                type:'ISMUSICPLAY_CHANGE',payload:true
            });
		},
		musicNameFn(musicName) {
			dispatch({
                type:'MUSICNAME_CHANGE',payload:musicName
            });
		}
    };
};

var List = connect(mapStateToProps,mapDispatchToProps)(ListUI);

// 将List组件暴露出去
export default List;