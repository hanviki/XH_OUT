import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Form, Input } from 'antd';
import { queryStringToJson } from '../../../utils/utils';

import './style.less';
const levelMap = {
  1: '临床新技术新业务学习',
  2: '高水平科学研究',
  3: '高水平学术会议交流',
};
const stateMap = {
  1: { text: '待提交', color: 'gray' },
  2: { text: '审核中', color: 'orange' },
  3: { text: '待重新提交', color: 'gray' },
  4: { text: '重新审核中', color: 'orange' },
  5: { text: '申报成功', color: '#32AB20' },
};
const reviewMap = {
  0: { text: '待审核', color: 'orange' },
  1: { text: '审核不通过', color: '#f50' },
  2: { text: '审核通过', color: '#32AB20' },
};

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.getDetail();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'historyDetail/clear' });
  }

  getDetail = ()=> {
    const { apply = {}, dispatch, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    dispatch({
      type: 'approveDetail/getDetail',
      payload: { id: parseInt(id) },
    }).then((data) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }
    });
  }

  render() {
    const { modelData = {}, form = {} } = this.props;
    const { getFieldDecorator } = form;
    const { detail = {} } = modelData;
    return (
      <div className="p-history-detail">
        <iframe
          width="950"
          height="1000"
          src=""
          frameBorder="0"
        ></iframe>
      </div>
    );
  }
}

function mapState(state) {
  const { historyDetail = {}, root = {} } = state;
  return {
    modelData: historyDetail,
    root,
  };
}

export default connect(mapState)(Form.create()(Widget));
