import React from 'react';
import { HashRouter, Route, Switch } from 'dva/router';
import {LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import Root from '../../components/root/Root';
import Login from '../../pages/login/Index';

function RouterConfig() {
  return (
    <LocaleProvider locale={zhCN}>
      <HashRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" component={Root} />
        </Switch>
      </HashRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
