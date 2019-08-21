import React,{Component} from 'react';
import './Pic.css';
import {connect} from 'react-redux';


class PicUI extends Component{
    // 生命周期初始化第一阶段
    constructor(){
        super();    // 有constructor就必须有super，拿来绑定this
        // 让handleTouch绑定上this属性，这样才能用this调用此方法
        this.handleTouch = this.handleTouch.bind(this)
    }

    // 生命周期初始化/更新第三阶段
    render(){
        return(
            <div id="musicPic">
                <div ref="musicPicDiv" onTouchStart={this.handleTouch}>
                    <img src={'/music/Music/Music?id='+ this.props.match.params.id +'&type=pic'} alt="歌曲背景图"/>
                </div>
            </div>
        );
    }

    // 生命周期初始化的dom渲染完成阶段（第四阶段），会自动执行
    componentDidMount(){
        // 获取到ajax返回的歌曲id的值
        var id = this.props.match.params.id

        // 派发任务改变播放器顶部显示的歌曲名和对应id歌曲的背景图
        this.props.headerArrowFn();
        this.props.musicNameIdFn(id);

        // 播放背景图
        if(this.props.isMusicPlay){
            this.picPlay();
        }else{
            this.picPause();
        }
    }
 
    // 生命周期更新的最后阶段,当改变播放的歌曲时自动执行，会监听isMusicPlay的值
    componentDidUpdate(){
        if(this.props.isMusicPlay){
            this.picPlay()
        }else{
            this.picPause()
        }
    }

    // 播放背景图动画
    picPlay(){
        this.refs.musicPicDiv.style.animationPlayState = 'running'
    }

    // 暂停背景图片的动画
    picPause(){
        this.refs.musicPicDiv.style.animationPlayState = 'paused'
    }

    // 点击背景图跳转到歌词页
    handleTouch(){
        var id=this.props.match.params.id;
        this.props.history.push('/lyric/'+id)
    }
}

// 接收播放音乐的状态数据,isMusicPlay是由List页传递过来的
function mapStateToProps(state){
    return {
		isMusicPlay:state.isMusicPlay
    }
}

// 派发改变状态数据的任务
function mapDispatchToProps(dispatch){
    return {
		headerArrowFn(){
			dispatch({
                type:'HEDERARROW_CHANGE',payload:false
            });
		},

        musicNameIdFn(id){
            dispatch({
                type:'MUSICNAMEID_CHANGE',payload:id
            });
		},
		

    };
}

var Pic = connect(mapStateToProps,mapDispatchToProps)(PicUI)

export default Pic;