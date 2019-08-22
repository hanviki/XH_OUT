import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Form, Input, Modal, message } from 'antd';
import { queryStringToJson } from '../../../../../utils/utils';
import { HTML_PREVIEW_URL, PDF_PREVIEW_URL } from '../../../../../config/constant/constant';

const levelMap = {
  1: '临床新技术新业务学习',
  2: '高水平科学研究',
  3: '高水平学术会议交流',
};
const confirm = Modal.confirm;
const { TextArea } = Input;
const FormItem = Form.Item;
const stateMap = {
  1: { text: '待提交', color: 'gray' },
  2: { text: '审核中', color: 'orange' },
  3: { text: '待重新提交', color: 'gray' },
  4: { text: '重新审核中', color: 'orange' },
  5: { text: '部门审核完成', color: 'orange' },
  6: { text: '申报成功', color: '#32AB20' },
};
const reviewMap = {
  0: { text: '待审核', color: 'orange' },
  1: { text: '审核不通过', color: '#f50' },
  2: { text: '审核通过', color: '#32AB20' },
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 8 },
  },
};

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

  getDetail = () => {
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

  handleSubmit = (type, e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if (type == 1) {
          this.pass(values);
        } else {
          this.reject(values);
        }
      }
    });
  }

  pass = (values) => {
    const { dispatch, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    dispatch({
      type: 'approveDetail/pass',
      payload: { id: parseInt(id), advice: values.reason },
    }).then((data) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }
      dispatch(routerRedux.push('/approve/list'));
    });
  }

  reject = (values) => {
    const { dispatch, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    dispatch({
      type: 'approveDetail/reject',
      payload: { id: parseInt(id), reason: values.reason },
    }).then((data) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }
      dispatch(routerRedux.push('/approve/list'));
    });
  }

  handleReviewReject = (reviewId, reviewerId) => {
    this.setState({ modelShow: true, modelReason: '', reviewId, reviewerId });
  }

  reviewReject = () => {
    const { modelReason = '', reviewId = '', reviewerId = '' } = this.state;
    if (!modelReason) {
      message.error('请输入驳回审核的原因');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'approveDetail/reviewReject',
      payload: { id: parseInt(reviewId), reviewerId: parseInt(reviewerId), reason: modelReason },
    }).then((data) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }
      dispatch(routerRedux.push('/approve/list'));
    });
  }

  onReasonChange = (e) => {
    this.setState({ modelReason: e.target.value });
  }

  render() {
    const { modelShow, modelReason = '' } = this.state;
    const { modelData = {}, form = {} } = this.props;
    const { getFieldDecorator } = form;
    const { detail = {} } = modelData;
    let reviews = [];
    reviews = (detail.reviews || []).filter((item) => {
      return item.reviewState == 2;
    });
    return (
      <Form className="m-info">
        <Modal
          visible={modelShow}
          title="驳回审核"
          onOk={this.reviewReject}
          onCancel={() => this.setState({ modelShow: false })}
        >
          <div className="m-reject-review">
            <div className="reason">
              <TextArea
                value={modelReason}
                onChange={this.onReasonChange}
                rows={5}
                placeholder="请在此填写驳回原因"
              />
            </div>
          </div>
        </Modal>
        <FormItem
          {...formItemLayout}
          label="候选人姓名"
        >
          {detail.applicantName}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="预览申报"
        >
          <Button type="primary" size="large">
            <a href={`${HTML_PREVIEW_URL}?id=${detail.id}`} target="_blank">预览申报(HTML版本)</a>
          </Button>
          <Button type="primary" size="large" ghost style={{ marginLeft: '15px' }}>
            <a href={`${PDF_PREVIEW_URL}?id=${detail.id}`} target="_blank">预览申报(PDF版本)</a>
          </Button>
        </FormItem>
        {
          detail.state != undefined ?
            <FormItem
              {...formItemLayout}
              label="申报进度"
            >
              <span style={{ color: stateMap[detail.state].color }}>
                {stateMap[detail.state].text}
              </span>
            </FormItem>
            : null
        }
        {
          (detail.reviews || []).map((item, index) => {
            return (
              <FormItem
                {...formItemLayout}
                label={item.reviewerName}
                key={index}
              >
                <div>
                  <span style={{ color: reviewMap[item.reviewState].color }}>{reviewMap[item.reviewState].text}</span>
                  {
                    item.reviewState !== 0 ?
                      <span>（{item.reviewAdvice || '暂无审核意见'}）</span>
                      : null
                  }

                </div>
                {
                  !(detail.state == 1 || detail.state == 3 || detail.state == 6) && (item.reviewState == 1 || item.reviewState == 2) ?
                    <div>
                      <Button
                        type="danger"
                        size="small"
                        onClick={(e) => this.handleReviewReject(item.id, item.reviewerId)}>
                        驳回审核
                      </Button>
                    </div>
                    : null
                }
              </FormItem>
            );
          })
        }
        {
          !(detail.state === 1 || detail.state === 3 || detail.state === 6) ?
            <FormItem
              {...formItemLayout}
              label="审核意见"
            >
              {getFieldDecorator('reason', {
                rules: [{
                  required: true, message: '请填写审核意见',
                }],
              })(
                <TextArea rows={5} placeholder="请在此填写" />
              )}
            </FormItem>
            : null
        }
        {
          detail.state === 6 ?
            <FormItem
              {...formItemLayout}
              label="审核意见"
            >
              {detail.groupAdvice}
            </FormItem>
            : null
        }
        {
          !(detail.state === 1 || detail.state === 3 || detail.state === 6) ?
            <FormItem
              {...tailFormItemLayout}
            >
              {
                // 部门审核完毕，且全部通过
                detail.state == 5 && reviews.length == detail.reviews.length ?
                  <Button
                    type="primary"
                    style={{ marginRight: '30px' }}
                    onClick={(e) => this.handleSubmit(1, e)}
                  >通过申报</Button>
                  : null
              }
              <Button
                type="danger"
                onClick={(e) => this.handleSubmit(0, e)}
              >驳回申报</Button>
            </FormItem>
            : null
        }
      </Form>
    );
  }
}

function mapState(state) {
  const { approveDetail = {} } = state;
  return {
    modelData: approveDetail,
  };
}

export default connect(mapState)(Form.create()(Widget));
