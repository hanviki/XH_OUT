import React from 'react';
import { connect } from 'dva';

import First from './com/first/Index';
import Second from './com/second/Index';

import './style.less';
import {queryStringToJson} from "../../../utils/utils";

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'approveList/clear' });
  }

  render() {
    const { root = {}, location = {} } = this.props;
    const { userInfo:{ role }={} } = root;
    console.log('aaaaaaaaaaaaaaaaaaaaaa')
    return (
      <div className="p-approve-list">
        <div className="m-tit">待审核列表</div>
        {
          role == 10 || role == 30 || role == 31 || role == 32 || role == 21 || role == 22 || role == 23 || role == 24 || role == 25 || role == 26 || role == 27 ?
            <First location={location} /> : null
        }
        {
          role == 50 ?
            <Second location={location} /> : null
        }
      </div>
    );
  }
}

function mapState(state) {
  const { approveList = {}, root = {} } = state;
  return {
    modelData: approveList,
    root,
  };
}

export default connect(mapState)(Widget);
