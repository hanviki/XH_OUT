import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { Button } from 'antd';

import './style.less';

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createLoading: false,
    };
  }

  componentDidMount() {
  }

  createApply = (level) => {
    this.setState({ createLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'applyLevel/createApply',
      payload: { level }
    }).then((data = {}) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        this.setState({ createLoading: false });
        return;
      }
      dispatch(routerRedux.push({
        pathname: '/apply/basic',
        search: `?id=${data.id}`
      }));
    });
  }

  render() {
    const { createLoading = false } = this.state;
    return (
      <div className="p-apy-level">
        <div className="m-tit">选择申报申请类型</div>
        <div className="m-choose">
          <div className="choose-box">
            <div className="choose-item">
              <Button type="primary"
                      disabled={createLoading}
                      size="large"
                      style={{width: "200px"}}
                      onClick={() => this.createApply(1)}>临床新技术新业务学习</Button>
            </div>
            <div className="choose-item">
              <Button type="primary"
                      disabled={createLoading}
                      size="large"
                      style={{width: "200px"}}
                      onClick={() => this.createApply(2)}>高水平科学研究</Button>
            </div>
            <div className="choose-item">
              <Button type="primary"
                      disabled={createLoading}
                      size="large"
                      style={{width: "200px"}}
                      onClick={() => this.createApply(3)}>高水平学术会议交流</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  const { applyLevel = {} } = state;
  return {
    modelData: applyLevel,
  };
}

export default connect(mapState)(Widget);
