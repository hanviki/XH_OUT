import React from 'react';
import { connect } from 'dva';
import { Route, Switch, Redirect, routerRedux } from 'dva/router';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';

import { DOMAIN } from './../../config/constant/constant';

// 申报记录
import HistoryList from '../../pages/history/list/Index';
import HistoryDetail from '../../pages/history/detail/Index';

import './style.less';

// 申报
import ApplyLevel from '../../pages/apply/level/Index';
import ApplyBasic from '../../pages/apply/basic/Index';
import ApplyIntro from '../../pages/apply/intro/Index';
import ApplyDaoshi from '../../pages/apply/daoshi/Index';
import ApplyCanhui from '../../pages/apply/canhui/Index';
import ApplyHuiyi from '../../pages/apply/huiyi/Index';
import ApplyKexue from '../../pages/apply/kexue/Index';
import ApplyCondition from '../../pages/apply/condition/Index';
import ApplyTarget from '../../pages/apply/target/Index';
import ApplyPromise from '../../pages/apply/promise/Index';
import ApplyAppendix from '../../pages/apply/appendix/Index';

// 审核
import ApproveList from '../../pages/approve/list/Index';
import ApproveDetail from '../../pages/approve/detail/Index';

import './style.less';

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

const MENU = [
  {
    title: '申报',
    pathname: '/history/list',
    search: '',
    icon: 'file',
    role: [0],
    subMenu: [
      {
        title: '申报记录',
        pathname: '/history/list',
        search: '',
        role: [0],
      },
      {
        title: '新的申报',
        pathname: '/apply/level',
        search: '',
        role: [0],
      },
    ],
  },
  {
    title: '审核',
    pathname: '/approve',
    search: '',
    icon: 'solution',
    role: [10, 21, 22, 23, 24, 25, 26, 27, 30, 31, 32, 50],
    subMenu: [
      {
        title: '科室负责人审核',
        pathname: '/approve/list',
        search: '',
        show: false,
        role: [10],
      },
      {
        title: '科研处审核',
        pathname: '/approve/list',
        search: '',
        show: false,
        role: [30],
      },
      {
        title: '国际交流办公室审核',
        pathname: '/approve/list',
        search: '',
        show: false,
        role: [31],
      },
      {
        title: '医务处审核',
        pathname: '/approve/list',
        search: '',
        show: false,
        role: [32],
      },
      {
        title: '党委办公室审核',
        pathname: '/approve/list',
        search: '',
        show: false,
        role: [21],
      },
      {
        title: '纪委办公室审核',
        pathname: '/approve/list',
        search: '',
        role: [22],
      },
      {
        title: '宣传部审核',
        pathname: '/approve/list',
        search: '',
        role: [23],
      },
      {
        title: '第一临床学院审核',
        pathname: '/approve/list',
        search: '',
        role: [24],
      },
      {
        title: '研究生管理办公室审核',
        pathname: '/approve/list',
        search: '',
        role: [25],
      },
      {
        title: '学术道德审查',
        pathname: '/approve/list',
        search: '',
        role: [26],
      },
      {
        title: '政治审查',
        pathname: '/approve/list',
        search: '',
        role: [27],
      },
      {
        title: '人才工作领导小组审核',
        pathname: '/approve/list',
        search: '',
        role: [50],
      },
    ],
  },
  {
    title: '指引',
    pathname: '/guide',
    search: '',
    icon: 'file-unknown',
    role: [0, 10, 21, 22, 23, 24, 25, 26, 27, 30, 31, 32, 50],
    subMenu: [
      {
        title: '操作手册',
        urlType: 1,
        pathname: `${DOMAIN}/public/guide/user_guide.html`,
        search: '',
        role: [0],
      },
      {
        title: '操作手册',
        urlType: 1,
        pathname: `${DOMAIN}/public/guide/review_guide.html`,
        search: '',
        role: [10, 21, 22, 23, 24, 25, 26, 27, 30, 31, 32],
      },
      {
        title: '操作手册',
        urlType: 1,
        pathname: `${DOMAIN}/public/guide/reviewagain_guide.html`,
        search: '',
        role: [50],
      },
    ],
  },
];

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: MENU.map(item => item.pathname),
      initStatus: false,
    };
  }

  componentDidMount() {
    this.getUserInfo();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'root/clear' });
  }

  onOpenChange = (openKeys) => {
    this.setState({
      openKeys,
    });
  };

  getUserInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'root/getUserInfo',
    }).then((data = {}) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }
      this.setState({ initStatus: true });
    });
  }

  logout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'root/logout',
    }).then((data = {}) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }
      dispatch(routerRedux.push('/login'));
    });
  }

  render() {
    const { openKeys, initStatus } = this.state;
    const { dispatch, location, root = {} } = this.props;
    const { userInfo = {} } = root;
    const { role = -1, name } = userInfo;
    if (!initStatus) {
      return null;
    }
    return (
      <Layout style={{ height: '100%' }} className="wgt-container">
        <Header className="wgt-container-header">
          <div className="wgt-container-header-lt">
            <div className="wgt-container-header-logo" />
            <div className="wgt-container-header-name">协和医院优秀专业学术人才出国奖励申请认定在线管理系统</div>
          </div>
          <div className="wgt-container-header-rt">
            <div className="wgt-container-header-txt">欢迎您，{name}</div>
            <div className="wgt-container-header-out" onClick={this.logout}>退出系统</div>
          </div>
        </Header>
        <Layout>
          <Sider width={245} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              openKeys={openKeys}
              onOpenChange={this.onOpenChange}
              style={{ height: '100%', borderRight: 0 }}
              onClick={
                (menu) => {
                  if (menu.key === location.pathname) {
                    return;
                  }
                  if (menu.item && menu.item.props && menu.item.props.urltype === 1) {
                    window.open(menu.key);
                    return;
                  }

                  dispatch(routerRedux.push({
                    pathname: menu.key,
                  }));
                }
              }
            >
              {
                MENU.map((item) => {
                  if (item.role.indexOf(role) == -1) {
                    return null;
                  }
                  return (
                    <SubMenu key={item.pathname} title={<span><Icon type={item.icon} />{item.title}</span>}>
                      {
                        (item.subMenu || []).map((itm, idx) => {
                          if (itm.role.indexOf(role) == -1) {
                            return null;
                          }
                          return (
                            <Menu.Item key={itm.pathname} urltype={itm.urlType || 0}>{itm.title}</Menu.Item>
                          );
                        })
                      }
                    </SubMenu>
                  );
                })
              }
            </Menu>
          </Sider>
          <div style={{ padding: '24px 24px', borderSizing: 'border-box', width: '100%' }}>
            <div
              style={{
                background: '#fff',
                padding: '24px',
                margin: '0',
                minHeight: '280px',
              }}
            >
              <Switch>
                {role == 0 ? <Route path="/" exact render={() => <Redirect to="/history/list" />} /> : null}
                {role == 10 || role == 30 || role == 31 || role == 32 || role == 21 || role == 22 || role == 23 || role == 24 || role == 25 || role == 26 || role == 27 || role == 50 ?
                  <Route path="/" exact render={() => <Redirect to="/approve/list" />} /> : null
                }

                {role == 0 ? <Route path="/history/list" exact component={HistoryList} /> : null}
                {role == 0 ? <Route path="/history/detail" exact component={HistoryDetail} /> : null}

                {role == 0 ? <Route path="/apply/level" exact component={ApplyLevel} /> : null}
                {role == 0 ? <Route path="/apply/basic" exact component={ApplyBasic} /> : null}
                {role == 0 ? <Route path="/apply/intro" exact component={ApplyIntro} /> : null}
                {role == 0 ? <Route path="/apply/canhui" exact component={ApplyCanhui} /> : null}
                {role == 0 ? <Route path="/apply/daoshi" exact component={ApplyDaoshi} /> : null}
                {role == 0 ? <Route path="/apply/huiyi" exact component={ApplyHuiyi} /> : null}
                {role == 0 ? <Route path="/apply/kexue" exact component={ApplyKexue} /> : null}
                {role == 0 ? <Route path="/apply/condition" exact component={ApplyCondition} /> : null}
                {role == 0 ? <Route path="/apply/target" exact component={ApplyTarget} /> : null}
                {role == 0 ? <Route path="/apply/promise" exact component={ApplyPromise} /> : null}
                {role == 0 ? <Route path="/apply/appendix" exact component={ApplyAppendix} /> : null}

                {/*审核*/}
                {role == 10 || role == 30 || role == 31 || role == 32 || role == 21 || role == 22 || role == 23 || role == 24 || role == 25 || role == 26 || role == 27 || role == 50 ?
                  <Route path="/approve/list" exact component={ApproveList} /> : null
                }
                {role == 10 || role == 30 || role == 31 || role == 32 || role == 21 || role == 22 || role == 23 || role == 24 || role == 25 || role == 26 || role == 27 || role == 50 ?
                  <Route path="/approve/detail" exact component={ApproveDetail} /> : null
                }

                {role == 0 ? <Route exact render={() => <Redirect to="/history/list" />} /> : null}
                {role == 10 || role == 30 || role == 31 || role == 32 || role == 21 || role == 22 || role == 23 || role == 24 || role == 25 || role == 26 || role == 27 || role == 50 ?
                  <Route exact render={() => <Redirect to="/approve/list" />} /> : null
                }
              </Switch>
            </div>
          </div>
        </Layout>
      </Layout>
    );
  }
}

function mapState(state) {
  const { root } = state;
  return {
    root,
  };
}

export default connect(mapState)(Root);
