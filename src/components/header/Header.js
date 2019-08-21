// 这个页面创建了Header组件

// 这一行让react支持jsx语法，jsx语法遵循严格的js语法，jsx支持里面写html和css
import React,{Component} from 'react';

// 导入react-redux里的连接组件的方法
import {connect} from 'react-redux';

// 导入路由句柄,会将该组件的数据进行更改，但是页面和组件都不重新渲染，单纯只修改数据。这个组件会渲染成a标签，里面的to属性会被渲染成href属性
import {NavLink} from 'react-router-dom';

// 导入css样式表
import './Header.css';

// HeaderUI是个UI组件，只负责UI的呈现，不带有任何业务逻辑，没有状态（即没有this.state这个变量），所有的 数据都由参数（this.props）提供，不使用任何Redux的API。
class HeaderUI extends Component{
    // render是渲染的意思
    render() {
        // 记住不能少了return
        return (
            <div id="musicHeader">
                {/* 发生数据更新后，应该显示返回列表页的“<”按钮，用NavLink组件来实现 */}
			    {this.props.headerArrow && <NavLink to='/list'><span>&lt;</span></NavLink> } {
                     this.props.musicName
                 }
		    </div>
        );
    }
}
// 用于获取状态的数据的方法
function mapStateToProps(state) {
    return {
        // 当状态发生变化时，要获取到store里的状态state里的headerArrow
        headerArrow:state.headerArrow,
        musicName:state.musicName,
    }
};
// 用于派发任务的方法
function mapDispatchToProps(dispatch) {
    return {};
};

// connect用于从UI组件生成容器组件，connect的作用就是将两个括号里的这两种组件连起来
// mapStateToProps用于获取状态的数据，mapDispatchToProps用于派发操作，这两个方法写在上面的
var Header = connect(mapStateToProps,mapDispatchToProps)(HeaderUI);

// 将此组件给暴露出去，在入口文件index.js引用
export default Header;