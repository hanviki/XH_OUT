import React from 'react';
import { connect } from 'dva';
import { queryStringToJson } from '../../../utils/utils';

import Keshi from './com/keshi/Index';
import Yiwu from './com/yiwu/Index';
import Keyan from './com/keyan/Index';
import Guoji from './com/guoji/Index';
import First from './com/first/Index';
import Second from './com/second/Index';

import './style.less';

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getDetail();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'approveDetail/clear' });
  }

  getDetail = ()=> {
    const { dispatch, location = {} } = this.props;
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

  getReviewState = () => {
    let reviewState;
    const { modelData = {}, root = {} } = this.props;
    const { detail = {} } = modelData;
    const { userInfo: { id } = {} } = root;
    for (let i in (detail.reviews || [])) {
      let tmp = detail.reviews[i];
      if (tmp.reviewerId === id) {
        reviewState = tmp;
        break;
      }
    }
    return reviewState;
  }

  render() {
    const { modelData = {}, location = {}, root = {} } = this.props;
    const { userInfo:{ role }={} } = root;
    const { detail = {} } = modelData;
    const reviewState = this.getReviewState() || '';

    return (
        <div className="p-approve-detail">
        <div className="m-tit">申报详情</div>
        {
          role == 10 ?
              <Keshi location={location} /> : null
        }
        {
          role == 30 && detail.level == 2?
              <Keyan location={location} /> : null
        }
        {
          role == 31 && detail.level == 3?
              <Guoji location={location} /> : null
        }
        {
          role == 32 && detail.level == 1?
              <Yiwu location={location} /> : null
        }
        {
          role == 21 || role == 22 || role == 23 || role == 24 || role == 25 || role == 26 || role == 27  || (role == 30 && detail.level != 2)?
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
  const { approveDetail = {}, root = {} } = state;
  return {
    modelData: approveDetail,
    root,
  };
}

export default connect(mapState)(Widget);
