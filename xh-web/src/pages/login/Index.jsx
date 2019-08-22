import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import md5 from 'md5';

import { Layout, message } from 'antd';
import cn from 'classnames';

import { DOMAIN } from './../../config/constant/constant';

import './style.less';

const { Header, Content } = Layout;

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobNum: '',
      password: '',
      smsCode: '',
      canSendCode: true,
      remainSecond: 0,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'login/clear' });
    this.state.clockTimer && clearTimeout(this.state.clockTimer);
  }

  setSendClock = (second = 60) => {
    if (second <= 0) {
      this.setState({ canSendCode: true });
      return;
    }
    this.state.clockTimer = window.setTimeout(() => {
      this.setState({ remainSecond: --second });
      this.setSendClock(second);
    }, 1000);
  }

  handleInputChange = (key, e) => {
    this.setState({ [key]: e.target.value });
  }

  getSmsCode = () => {
    const { jobNum = '' } = this.state;
    const { dispatch } = this.props;
    if (!jobNum) {
      message.error('请输入工号');
      return;
    }

    this.setState({ canSendCode: false, remainSecond: 60 });
    dispatch({
      type: 'login/getSmsCode',
      payload: { jobNum },
    }).then((data) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        this.setState({ canSendCode: true, remainSecond: 0 });
        return;
      }
      this.setSendClock(60);
    });
  }

  login = () => {
    const { jobNum = '', password = '', smsCode = '' } = this.state;
    const { dispatch } = this.props;
    if (!jobNum) {
      message.error('请输入工号');
      return;
    } else if (!password) {
      message.error('请输入密码');
      return;
    }
    console.log(dispatch)
    // else if (!smsCode) {
    //   message.error('请输入短信验证码');
    //   return;
    // }

    dispatch({
      type: 'login/login',
      payload: { jobNum, password: md5(password) },
      // payload: { jobNum, password: md5(password), smsCode: parseInt(smsCode) },
    }).then((data) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }
      dispatch(routerRedux.push('/'));
    });
  }

  render() {
    const { jobNum = '', password = '', smsCode = '', remainSecond = 0, canSendCode = false } = this.state;
    return (
      <Layout style={{ height: '100%' }} className="p-login">
        <Header className="wgt-container-header">
          <div className="wgt-container-header-lt">
            <div className="wgt-container-header-logo" />
            <div className="wgt-container-header-name">协和医院优秀专业学术人才出国奖励申请认定在线管理系统</div>
          </div>
        </Header>
        <Layout style={{ 'minHeight': '500px' }}>
          <Content className="g-login">
            <div className="m-login">
              <div className="login-tit">欢迎使用</div>
              <div className="login-box">
                <div className="login-item">
                  <div className="item-label">工号</div>
                  <div className="item-ct">
                    <input
                      type="text"
                      className='item-ct-ipt'
                      placeholder="请在此输入工号"
                      onChange={(e) => this.handleInputChange('jobNum', e)}
                      value={jobNum}
                    />
                  </div>
                </div>
                <div className="login-item">
                  <div className="item-label">密码</div>
                  <div className="item-ct">
                    <input
                      type="password"
                      className='item-ct-ipt'
                      placeholder="请在此输入密码，初始密码为身份证号后六位"
                      onChange={(e) => this.handleInputChange('password', e)}
                      value={password}
                    />
                  </div>
                </div>
                {/* <div className="login-item">
                 <div className="item-label">短信验证码</div>
                 <div className="item-ct">
                 <input
                 type="text"
                 className='item-ct-ipt'
                 placeholder="请在此输入短信验证码"
                 onChange={(e) => this.handleInputChange('smsCode', e)}
                 value={smsCode}
                 />
                 {
                 canSendCode ?
                 <div className="item-ct-ipt-btn" onClick={this.getSmsCode}>获取短信验证码</div>
                 :
                 <div className="item-ct-ipt-btn disabled">{remainSecond}秒后可重新获取</div>
                 }
                 </div>
                 </div> */}
              </div>
              <div className="login-btn" onClick={this.login}>登录</div>
            </div>
          </Content>
        </Layout>

        <div className="m-fixed-tips">
          <div className="tips-hd">操作说明</div>
          <div className="tips-bd">
            <div className="bd-item"><a target="_blank" href={`${DOMAIN}/public/guide/user_guide.html`} className="bd-item">--我是申报用户</a></div>
            <div className="bd-item"><a target="_blank" href={`${DOMAIN}/public/guide/review_guide.html`} className="bd-item">--我是部门审核人员</a></div>
            <div className="bd-item"><a target="_blank" href={`${DOMAIN}/public/guide/reviewagain_guide.html`} className="bd-item">--我是人才工作领导小组审核人员</a></div>
          </div>
        </div>
      </Layout>
    );
  }
}

function mapState(state) {
  const { demoIndex = {} } = state;
  return {
    modelData: demoIndex,
  };
}

export default connect(mapState)(Widget);
