// 此文件是入口文件

import React from 'react';  // 这一行让react支持jsx语法，jsx语法遵循严格的js语法，jsx支持里面写html和css
import ReactDOM from 'react-dom'; // 这一行将组件渲染到页面中
import App from './App';  // 导入App.js
import './index.css';   // 导入全局的css样式

// 导入<Provider>组件，在根组件外面包一层，App的 所有的子组件都默认能拿到state（状态数据）了,就是共享的数据
import {Provider} from 'react-redux';

// 导入应用仓库store（用来存储克隆的原组件和修改数据后的新组件，然后再传递给原来的组件完成数据更新）
import store from './stores/index';

ReactDOM.render(
  // 引用总组件和Provider组件，总组件要被Provider包裹住，这样总组件里所有子组件都能拿到共享的state
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
);
