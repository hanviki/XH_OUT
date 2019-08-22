import '@babel/polyfill';
import dva from 'dva';
// import createLoading from 'dva-loading';
import { message } from 'antd';
// import './index.html';

import './resources/styles/override-antd.less';
import './resources/styles/iconfont/iconfont.css';
import './resources/styles/iconfont/iconfont.js';
import './resources/styles/common.less';

const ERROR_MSG_DURATION = 3; // 3 秒

// 1. Initialize
const app = dva({
  onError(e) {
    message.error(e.message, ERROR_MSG_DURATION);
  },
});

// 2. Plugins
// app.use(createLoading());

// 3. Model
app.model(require('./components/root/model').default);

// 登陆
app.model(require('./pages/login/model').default);

// 申报
app.model(require('./pages/apply/model').default);
app.model(require('./pages/apply/level/model').default);
app.model(require('./pages/apply/basic/model').default);
app.model(require('./pages/apply/intro/model').default);
app.model(require('./pages/apply/condition/model').default);
app.model(require('./pages/apply/target/model').default);
app.model(require('./pages/apply/promise/model').default);
app.model(require('./pages/apply/appendix/model').default);

// 申报记录
app.model(require('./pages/history/list/model').default);
app.model(require('./pages/history/detail/model').default);

// 审核
app.model(require('./pages/approve/list/model').default);
app.model(require('./pages/approve/detail/model').default);

// 4. Router
app.router(require('./config/router/router').default);

// 5. Start
app.start('#root');
