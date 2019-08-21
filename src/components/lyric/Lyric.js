// 此组件是歌词页面，歌词页要设置路由跳转
// 要加上Fragment
import React,{Component,Fragment} from 'react'
import axios from 'axios';
import './Lyric.css';
import {connect} from 'react-redux';

class LyricUI extends Component {
    // 生命周期第一阶段
    constructor(){
        // super能将this绑定在事件上
        super();
        this.state = {
            lyricList:[],
            active:-1   
        };
    }

    render(){
        // Fragment标签不会在dom树上渲染，它没有任何意思，只是为了符合jsx必须要有一个父元素的语法规定。这里的Fragment标签只是示意，可以不用加，因为有个div父标签。
        return(
            <Fragment>
               <div id="musicLyric">
                    <ul ref="musicLyricUl">
                        {/* {渲染歌词内容} */}
                        {   
                            this.state.lyricList.map((item,index)=>{
                                 return <li key={index} 
                                //  判断state里的active属性，active的值用来决定激活哪一条歌词的active样式
                                 className={this.state.active === index ? 'active': ''}>{item.lyric}</li>  
                            })
                        }
                    </ul>
		        </div>
            </Fragment>
        );
    }

    componentDidMount() {
        var id = this.props.match.params.id;
        // console.log(id);
        axios.get('/music/Music/Music?id='+id+'&type=lrc').then((res)=>{
            // console.log(res.data);
            // 成功拿到数据后，要用自定义函数formatLyricDate更新状态
            this.setState({
                lyricList:this.formatLyricData(res.data)
            },()=>{
                // console.log(this.state.lyricList);
            });
            
        });

        // 数据加载完成后，触发箭头Arrow的管理，派发action任务，该方法是下面定义好的mapDispatchToProps方法
        this.props.headerArrowFn();
        this.props.musicNameIdFn(id);

        if(this.props.isMusicPlay){
            this.lyricPlay()
        }else{
            this.lyricPause()
        }
    }

    componentWillReceiveProps(nexProps){
        //传递进入当前组件  props 发生变化的时候触发此生命周期
        if(nexProps.isMusicPlay){
            this.lyricPlay()
        }else{
            this.lyricPause()
        }
    }

    // 从播放页切换到列表页 时应该暂停歌词播放
    componentWillUnmount(){
        this.lyricPause();
    }

    // 格式化歌词信息
    // 原来的信息是[00:00.000] 作曲 : 秦晨阳 [00:01.000]
    formatLyricData(lyrics){
        // 用正则表达式过滤返回的歌词里面的时间信息，只留下歌词文字
        var result = [];
        var re = /\[([^\]]+)\]([^[]+)/g;
        lyrics.replace(re,($0,$1,$2)=>{
            result.push({time:this.formatTimeToSec($1),lyric:$2});
        })
        // console.log(result)
        return result;
    }

    //格式化时间  
    formatTimeToSec(time){
        // 调用此方法传入的实参是格式化之后的lyrics
        // lyrics对象里面有time和lyric属性
        // 例如index为0的时候   
        // 0: {time: "00:00.310", lyric: "Deja vu↵"}
        // 要获取时间参数，就得将time的值用:分割
        var attr = time.split(':');
        // console.log(attr);  
        return (parseFloat(attr[0])*60 + parseFloat(attr[1])).toFixed(2)
    }

    // 歌词播放方法
    lyricPlay(){
        this.playing()
        this.timer = setInterval(this.playing.bind(this),500)
    }

    // // 歌词暂停方法
    lyricPause(){
        clearInterval(this.timer)
    }

    //监听歌曲播放的时间 
    playing(){
        // console.log(123);
        var lyricList = this.state.lyricList;
        var audio = document.getElementById("audio")
        var musicLyricUl = this.refs.musicLyricUl;
        var musicLyricLi = musicLyricUl.getElementsByTagName('li')[0];      // 用于后面让歌词滚动
         
        for(var i=0;i<lyricList.length;i++){
            if(lyricList[i].time < audio.currentTime && lyricList[i+1].time > audio.currentTime){
                console.log(lyricList[i].lyric);
                this.setState({
                    active:i
                });
                if(i>5){    // 歌词滚动判断条件，激活的歌词达到5行
                    musicLyricUl.style.top = -(i-5)* (musicLyricLi.offsetHeight+15) + 'px'
                }
            }
        }
    }
}

// 用于获取状态的数据的方法
function mapStateToProps(state){
    return {
        isMusicPlay:state.isMusicPlay,
    }
}


// 用于派发任务的方法
function mapDispatchToProps(dispatch) {
    return {
        headerArrowFn() {
            // dispatch是派遣的意思
            dispatch({
                type:"HEDERARROW_CHANGE",
                payload:true
            })
        },
        musicNameIdFn(id){
            dispatch({
                type:'MUSICNAMEID_CHANGE',
                payload:id
            });
        }
    };
};

var Lyric = connect(mapStateToProps,mapDispatchToProps)(LyricUI);

export default Lyric;