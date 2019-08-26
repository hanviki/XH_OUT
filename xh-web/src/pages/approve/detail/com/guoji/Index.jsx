import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {Button, DatePicker, Form, Input, Radio} from 'antd';
import { queryStringToJson } from '../../../../../utils/utils';
import { HTML_PREVIEW_URL, PDF_PREVIEW_URL } from '../../../../../config/constant/constant';
import moment from "moment";

const RadioGroup = Radio.Group;

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

class Widget extends React.Component {
  constructor(props) {
    super(props);
    const reviewState = this.getReviewState() || '';
    this.state = {
      reviewData: {},
      checked: reviewState.sfcj?true:false
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
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
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
      payload: { id: parseInt(id), advice: values.reason, values },
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
            <FormItem
              {...formItemLayout}
              label="是否同意申请办理因公护照出国/境"
            >
              {getFieldDecorator('sfcj', {
                rules: [{
                  required: true, message: `请根据实际情况选择`,
                }],
                initialValue: reviewState.sfcj,
              })(
                  <RadioGroup disabled={reviewState.reviewState !== 0} onChange={(e)=>{ this.setState({checked: e.target.value})}}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </RadioGroup>
              )}
            </FormItem>
        }
        {
          this.state.checked ?
              <FormItem
                  {...formItemLayout}
                  label="批准时间"
              >
                {getFieldDecorator('pzkssj', {
                  rules: [{
                    required: true, message: '请填申请留学开始时间',
                  }],
                  initialValue: reviewState.pzkssj ?moment(reviewState.pzkssj, 'YYYY-MM-DD'):'',
                })(
                    <DatePicker  placeholder={'请选择开始日期'}/>
                )}
                <span>  至  </span>
                {getFieldDecorator('pzjssj', {
                  rules: [{
                    required: true, message: '请填申请留学结束时间',
                  }],
                  initialValue: reviewState.pzjssj ?moment(reviewState.pzjssj, 'YYYY-MM-DD'):'',
                })(
                    <DatePicker  placeholder={'请选择结束日期'}/>
                )}
              </FormItem>
              : null
        }
        {
              <FormItem
                  {...formItemLayout}
                  label="是否推荐参加高水平学术会议交流"
              >
                {getFieldDecorator('sftj', {
                  rules: [{
                    required: true, message: `请根据实际情况选择`,
                  }],
                  initialValue: reviewState.sftj,
                })(
                    <RadioGroup disabled={reviewState.reviewState !== 0}>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </RadioGroup>
                )}
              </FormItem>
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
