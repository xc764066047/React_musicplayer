import React,{Component} from 'react';
import './Audio.css';

// 导入react-redux里的connect组件
import { connect } from 'react-redux';

class AudioUI extends Component {

constructor()  {
    super();
    this.handleTap = this.handleTap.bind(this);
}

    render(){
        // 注意，jsx语法里的class要写成className
        return (
            <div id="musicAudio">
                <div ref="audioPlay" className="audioPlay" onTouchStart={this.handleTap}></div>
                <div ref="audioProgress" className="audioProgress">
                    <div ref="audioBar" className="audioBar"></div>
                    <div ref="audioNow" className="audioNow"></div>
                </div>
                <audio id="audio" ref="audio" src={"/music/Music/Music?id="+this.props.musicNameId+"&type=url"}></audio>
            </div>
        );
    }

    // 组件重新渲染（更新）的生命周期最后阶段，在render之后。会自动运行
    componentDidUpdate(){
		if(this.props.isMusicPlay){ // 如果状态更新为true，就执行播放方法
            this.audioPlay();
            console.log(this.props.isMusicPlay+'播放状态');
		}else{  // 如果状态更新为false，就执行暂停方法
            this.audioPause();
            console.log(this.props.isMusicPlay+'暂停状态');
		}
    }
    
    // 初始渲染的生命周期最后阶段，在render之后，会自动运行
    componentDidMount() {
        this.handleDrag();
    }

    // 点击播放按钮的方法
    handleTap() {
        if(!this.refs.audio.getAttribute('src')){
			return false;
		}

        if(this.refs.audio.paused) {    // 如果播放按钮的状态是paused（暂停，这是audio元素自带的属性，表示暂停）
            this.props.isMusicPlayFn(true); // 触发自动播放的方法，并传值为true
        }else{
            this.props.isMusicPlayFn(false); // 触发暂停的方法，并传值为false
        }
    }

    //监听实时播放 
    playing(){
		var audioProgress = this.refs.audioProgress;
		var audioBar = this.refs.audioBar;
		var audioNow = this.refs.audioNow;
		var audio = this.refs.audio;

		var scale = audio.currentTime / audio.duration;
				// console.log(audio.currentTime)
		audioBar.style.left = scale*audioProgress.offsetWidth + 'px';
		audioNow.style.width = scale * 100 + '%';
	}

    // 自动播放方法
    audioPlay(){
        // 更改图标
        this.refs.audioPlay.style.backgroundImage='url(/images/list_audioPause.png)';
        // 自动播放
        this.refs.audio.play();
        this.playing();
        this.timer = setInterval(this.playing.bind(this),1000);
	}
    // 暂停方法
    audioPause(){
        // 更改图标
        this.refs.audioPlay.style.backgroundImage='url(/images/list_audioPlay.png)'
        // 暂停
        this.refs.audio.pause();
        clearInterval(this.timer);
    }
    

    // 拖拽进度条方法
    handleDrag() {
        // 通过ref属性获取元素节点
        var audioProgress = this.refs.audioProgress;
        var audioBar = this.refs.audioBar;
        var audioNow = this.refs.audioNow;
        var audio = this.refs.audio;
        

        var disX = 0;   // 鼠标X轴方向距离左边框的长度
        // 给进度条上的小按钮添加触摸事件
        audioBar.ontouchstart = function(ev) {
            // console.log(ev);
            var touch = ev.changedTouches[0];
            disX = touch.pageX - this.offsetLeft;

            // 给文档添加滑动事件（前提条件是触摸小按钮才能触发此事件）
            document.ontouchmove = function (ev) {
                var touch = ev.changedTouches[0];   // 重新拿到触摸的数据，这一步一定不能少
                var L = touch.pageX - disX;
                if (L < 0) {
                    L = 0;
                } else if(L > audioProgress.offsetWidth) {
                    L = audioProgress.offsetWidth;
                }
                audioBar.style.left = L + 'px';

                // 进度条比例
                var scale= L / audioProgress.offsetWidth;
                //获取的是0-1的值
                // currentTime是当前播放时间，duration是总时长
				audio.currentTime = scale * audio.duration;
                // console.log('当前播放时间'+audio.currentTime);
                
                // 将已播放的进度条变为蓝色，改变样式即可
				audioNow.style.width = scale * 100 + '%';
            };
            // 为了防止拖拽出现问题，默认返回false
            return false;
        }
    }
}

// 监听数据state是否发生改变
// 用于获取状态的数据的方法
function mapStateToProps(state) {
    return {
        // 当状态发生变化时，要获取到store里的状态state里的isMusicPlay和musicNameId
        isMusicPlay : state.isMusicPlay,
        musicNameId : state.musicNameId,
    }
};
// 用于派发任务的方法
function mapDispatchToProps(dispatch) {
    return {
        isMusicPlayFn(bool){
            // dispatch是派遣的意思，这里用做派发任务
            dispatch({
                // 这里派发任务后就会触发store里面的index.js里的reducer判断
                type:'ISMUSICPLAY_CHANGE',payload:bool
            });
        }
    };
};

var Audio = connect(mapStateToProps,mapDispatchToProps)(AudioUI);

export default Audio;