import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Form, Input } from 'antd';
import { queryStringToJson } from '../../../../../utils/utils';
import { HTML_PREVIEW_URL, PDF_PREVIEW_URL } from '../../../../../config/constant/constant';

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
  5: { text: '部门审核完成', color: 'orange' },
  6: { text: '申报成功', color: '#32AB20' },
};
const reviewMap = {
  0: { text: '待审核', color: 'orange' },
  1: { text: '审核不通过', color: '#f50' },
  2: { text: '审核通过', color: '#32AB20' },
};
const { TextArea } = Input;
const FormItem = Form.Item;
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

const fileds = {
  1: ['ywcyj1', 'ywcyj2', 'ywcyj3', 'ywcyj4', 'ywcyj5', 'reason'],
  2: ['ywcyj1', 'ywcyj2', 'ywcyj3', 'ywcyj4', 'reason'],
  3: ['ywcyj1', 'ywcyj2', 'ywcyj3', 'reason'],
}

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewData: {},
    };
  }

  componentDidMount() {
    this.getDetail();
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
    const { modelData = {}, root = {} } = this.props;
    const { detail = {} } = modelData;
    e.preventDefault();
    this.props.form.validateFields(fileds[detail.level], (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if (type == 1) {
          this.reviewPass(values);
        } else {
          this.reject(values);
        }
      }
    });
  }

  reviewPass = (values) => {
    const { dispatch, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    dispatch({
      type: 'approveDetail/reviewPass',
      payload: { id: parseInt(id), advice: values.reason, values: values },
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
    const { modelData = {}, form = {} } = this.props;
    const { getFieldDecorator } = form;
    const { detail = {} } = modelData;
    const reviewState = this.getReviewState() || '';
    return (
      <Form className="m-info">
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
          reviewState ?
            <FormItem
              {...formItemLayout}
              label="审核状态"
            >
              <span style={{ color: reviewMap[reviewState.reviewState].color }}>
                {reviewMap[reviewState.reviewState].text}
                {reviewState.isRejected ? '(审核被驳回)' : ''}
              </span>
              {
                reviewState.reviewState !== 0 ?
                  <span>（{reviewState.reviewAdvice || '暂无审核意见'}）</span>
                  : null
              }
            </FormItem>
            : null
        }
        {
          reviewState && reviewState.isRejected ?
            <FormItem
              {...formItemLayout}
              label="驳回说明"
            >
              <span>{reviewState.rejectReason || ''}</span>
            </FormItem>
            : null
        }
        {
         detail.level == 1?
            <FormItem
                {...formItemLayout}
                label="科室意见"
            >
              <div>1.申请人所学临床新技术新业务先进性</div>
              {getFieldDecorator('ywcyj1', {
                rules: [{
                  required: true, message: '请填写审核意见',
                }],
                initialValue: reviewState.ywcyj1,
              })(
                  <TextArea rows={5} placeholder="请在此填写"  disabled={reviewState.reviewState !== 0}/>
              )}
              <div>2.申请人所学临床新技术新业务先进性</div>
              {getFieldDecorator('ywcyj2', {
                rules: [{
                  required: true, message: '请填写审核意见',
                }],
                initialValue: reviewState.ywcyj2,
              })(
                  <TextArea rows={5} placeholder="请在此填写" disabled={reviewState.reviewState !== 0}/>
              )}
              <div>3.科室对于留学人员提供何种配套政策</div>
              {getFieldDecorator('ywcyj3', {
                rules: [{
                  required: true, message: '请填写审核意见',
                }],
                initialValue: reviewState.ywcyj3,
              })(
                  <TextArea rows={5} placeholder="请在此填写" disabled={reviewState.reviewState !== 0}/>
              )}
              <div>4.科室对于推广所学新技术新业务准备的硬件条件和推广计划</div>
              {getFieldDecorator('ywcyj4', {
                rules: [{
                  required: true, message: '请填写审核意见',
                }],
                initialValue: reviewState.ywcyj4,
              })(
                  <TextArea rows={5} placeholder="请在此填写" disabled={reviewState.reviewState !== 0}/>
              )}
              <div>5.科室对于申请人所学新技术新业务的考核方式及指标</div>
              {getFieldDecorator('ywcyj5', {
                rules: [{
                  required: true, message: '请填写审核意见',
                }],
                initialValue: reviewState.ywcyj5,
              })(
                  <TextArea rows={5} placeholder="请在此填写" disabled={reviewState.reviewState !== 0}/>
              )}
            </FormItem>
            : null
      }
        {
           detail.level == 2 ?
              <div>
                <FormItem
                    {...formItemLayout}
                    label="科室意见"
                >
                  <div>1.申请人拟开展高水平科学研究的先进性</div>
                  {getFieldDecorator('ywcyj1', {
                    rules: [{
                      required: true, message: '请填写审核意见',
                    }],
                    initialValue: reviewState.ywcyj1,
                  })(
                      <TextArea rows={5} placeholder="请在此填写" disabled={reviewState.reviewState !== 0}/>
                  )}
                </FormItem>
                <FormItem
                    {...tailFormItemLayout}
                >
                  <div>2.所学内容对学科发展的意义</div>
                  {getFieldDecorator('ywcyj2', {
                    rules: [{
                      required: true, message: '请填写审核意见',
                    }],
                    initialValue: reviewState.ywcyj2,
                  })(
                      <TextArea rows={5} placeholder="请在此填写" disabled={reviewState.reviewState !== 0}/>
                  )}
                </FormItem>
                <FormItem
                    {...tailFormItemLayout}
                >
                  <div>3.科室对于留学人员提供何种配套政策</div>
                  {getFieldDecorator('ywcyj3', {
                    rules: [{
                      required: true, message: '请填写审核意见',
                    }],
                    initialValue: reviewState.ywcyj3,
                  })(
                      <TextArea rows={5} placeholder="请在此填写" disabled={reviewState.reviewState !== 0}/>
                  )}
                </FormItem>
                <FormItem
                    {...tailFormItemLayout}
                >
                  <div>4.科室对于申请人的考核方式及指标</div>
                  {getFieldDecorator('ywcyj4', {
                    rules: [{
                      required: true, message: '请填写审核意见',
                    }],
                    initialValue: reviewState.ywcyj4,
                  })(
                      <TextArea rows={5} placeholder="请在此填写" disabled={reviewState.reviewState !== 0}/>
                  )}
                </FormItem>
              </div>
              : null
        }

        {
           detail.level == 3 ?
              <FormItem
                  {...formItemLayout}
                  label="科室意见"
              >
                <div>1.科室对于申请人出国参加高水平学术会议交流的效益预估</div>
                {getFieldDecorator('ywcyj1', {
                  rules: [{
                    required: true, message: '请填写审核意见',
                  }],
                  initialValue: reviewState.ywcyj1,
                })(
                    <TextArea rows={5} placeholder="请在此填写" disabled={reviewState.reviewState !== 0}/>
                )}
                <div>2.对学科发展的意义</div>
                {getFieldDecorator('ywcyj2', {
                  rules: [{
                    required: true, message: '请填写审核意见',
                  }],
                  initialValue: reviewState.ywcyj2,
                })(
                    <TextArea rows={5} placeholder="请在此填写" disabled={reviewState.reviewState !== 0}/>
                )}
                <div>3.对提高医院国际影响力的意义</div>
                {getFieldDecorator('ywcyj3', {
                  rules: [{
                    required: true, message: '请填写审核意见',
                  }],
                  initialValue: reviewState.ywcyj3,
                })(
                    <TextArea rows={5} placeholder="请在此填写" disabled={reviewState.reviewState !== 0}/>
                )}
              </FormItem>
              : null
        }
        {
          reviewState.reviewState === 0 ?
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
          reviewState.reviewState === 0 ?
            <FormItem
              {...tailFormItemLayout}
            >
              <Button
                type="primary"
                style={{ marginRight: '30px' }}
                onClick={(e) => this.handleSubmit(1, e)}
              >审核通过</Button>
              <Button
                type="danger"
                onClick={(e) => this.handleSubmit(0, e)}
              >审核不通过</Button>
            </FormItem>
            : null
        }
      </Form>
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

export default connect(mapState)(Form.create()(Widget));
