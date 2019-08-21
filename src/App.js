// 此文件是总组件

import React, { Component } from 'react';
import './App.css';

// 导入react-router的组件
// BrowserRouter创建路由最外层的容器
// Router 创建路由插座和路由配置
// Redirect重定向 用
// Switch 配合重定向用(配合router元素跳转用)
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

// 导入播放器页面顶部Header组件，from后面跟的是路劲
import Header from './components/header/Header';
// 导入列表页List组件
import List from './components/list/List';
// 导入播放页Audio组件
import Audio from './components/audio/Audio';
// 导入歌词页Lyric组件
import Lyric from './components/lyric/Lyric';
// 导入函数组件
// import Functions  from './components/functions/Functions';
// 导入歌曲背景图组件
import Pic from './components/pic/Pic';

class App extends Component {
  render() {
    return (

        // 在有路由的页面要用Router组件包裹起来，里面的内容表示受Router管理
        <Router>
          
            <div id="main">
                {/* 在App组件里引用Header组件 */}
                <Header />

                  {/* 路由组件要配合Switch使用 */}
                <Switch>
                    {/* path是路由路径，component的值是组件 */}
                    <Route path="/list" component={ List } />
                    <Route path="/lyric/:id" component={ Lyric } />
                    <Route path="/pic/:id" component={ Pic } />

                    {/* 所有的url应该跳转到歌曲列表页去 */}
                    <Redirect from="/*" to="/list" />
                </Switch>

                {/* 引入Audio组件 */}
                <Audio />
            </div>
        </Router>
    );
  }
}

export default App;
