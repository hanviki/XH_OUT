import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {Button, Form, Modal} from 'antd';
import { queryStringToJson } from '../../../utils/utils';
import { HTML_PREVIEW_URL } from '../../../config/constant/constant';
import HdInfo from '../../../components/hdinfo/Index';
import './style.less';

const confirm = Modal.confirm;

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  componentDidMount() {
    this.getDetail();
  }

  componentWillUnmount() {
    this.state.modal && this.state.modal.destroy();
  }

  getDetail = ()=> {
    const { apply = {}, dispatch, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    dispatch({
      type: 'apply/getDetail',
      payload: { id: parseInt(id) },
    }).then(() => {

    });
  }

  submitConfirm = () => {
    this.state.modal = confirm({
      title: '确认提交申报吗?',
      content: '提交前，请先预览申报，确认申报内容无误。',
      cancelText: '取消',
      okText: '确认',
      onOk: ()=> {
        this.submitApply();
      },
      onCancel: ()=> {
      },
    });
  }

  submitApply = () => {
    const { dispatch, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    dispatch({
      type: 'applyPromise/submitApply',
      payload: { id: parseInt(id) },
    }).then((data = {}) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }
      dispatch(routerRedux.push({
        pathname: '/history/list',
      }));
    });
  }

  render() {
    const { apply = {} } = this.props;
    const { detail = {} } = apply;
    const { location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    return (
      <div className="p-apy-promise">
        <HdInfo step={detail.level==3?5:6} location={this.props.location} level={detail.level}/>
        <div className="m-promise">
          <div className="promise-tit">承诺书</div>
          <div className="promise-content">本人承诺，以上填写的所有内容和提供的材料真实可信，如有违反，本人自愿退出优秀人才出国奖励计划，退回医院提供的奖励资金，并承担其他一切后果。</div>
        </div>
        <div className="m-submit">
          <Button type="primary" size="large" ghost>
            <a href={`${HTML_PREVIEW_URL}?id=${id}`} target="_blank">预览申报</a>
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ marginLeft: '30px' }}
            onClick={this.submitConfirm}
          >提交申报</Button>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  const { applyPromise = {}, apply ={} } = state;
  return {
    modelData: applyPromise,
    apply
  };
}

export default connect(mapState)(Widget);
