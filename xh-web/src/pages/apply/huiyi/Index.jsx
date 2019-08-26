import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {message, Button, Form, Input, DatePicker} from 'antd';
import { queryStringToJson } from '../../../utils/utils';
import HdInfo from '../../../components/hdinfo/Index';
import './style.less';
import moment from 'moment';

const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
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

  getDetail = ()=> {
    const { apply = {}, dispatch, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    dispatch({
      type: 'apply/getDetail',
      payload: { id: parseInt(id) },
    }).then(() => {

    });
  }

  handleSubmit = (nextFlag) => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        let { showList = {} } = this.state;
        for (let i in showList) {
          showList[i] = true;
        }
        this.setState({ showList }, ()=> {
          document.documentElement.scrollTop = 0;
        });
        message.error('信息填写有误，请检查所有信息是否正确！');
        return;
      }
      if (!err) {
        console.log('Received values of form: ', values);
        this.updateDetail(values, nextFlag);
      }
    });
  }

  updateDetail = (values, nextFlag) => {
    const { apply = {}, dispatch, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    const { detail = {} } = apply;

    var section = (detail.section || '')
    if (!section.match(/huiyi;/)){
      section += 'huiyi;'
    }
    dispatch({
      type: 'apply/updateDetail',
      payload: {
        id: parseInt(id),
        section: section,
        ...values,
      },
    }).then((data) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }
      if (!nextFlag) {
        return;
      }
      dispatch(routerRedux.push({
        pathname: '/apply/canhui',
        search: location.search,
      }));
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { apply = {} } = this.props;
    const { detail = {} } = apply;
    return (
      <div className="p-apy-basic">
        <HdInfo step={2} location={this.props.location}  level={detail.level} />
        <div className="m-form">
          <Form>
            <FormItem
                {...formItemLayout}
                label="会议名称(中文)"
            >
              {getFieldDecorator('hymczw', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: detail.hymczw,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="会议名称(英文)"
            >
              {getFieldDecorator('hymcyw', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: detail.hymcyw,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="会议日期"
            >
              {getFieldDecorator('hykssj', {
                rules: [{
                  required: true, message: '请填申请会议开始时间',
                }],
                initialValue: detail.hykssj ?moment(detail.hykssj, 'YYYY-MM-DD'):'',
              })(
                  <DatePicker  placeholder={'请选择开始日期'}/>
              )}
              <span>  至  </span>
              {getFieldDecorator('hyjssj', {
                rules: [{
                  required: true, message: '请填申请会议结束时间',
                }],
                initialValue: detail.hyjssj ?moment(detail.hyjssj, 'YYYY-MM-DD'):'',
              })(
                  <DatePicker  placeholder={'请选择结束日期'}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="会议主办方"
            >
              {getFieldDecorator('hyzbf', {
                rules: [
                  { required: true, message: '内容不能为空' },
                ],
                initialValue: detail.hyzbf,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="会议地点"
            >
              {getFieldDecorator('hydd', {
                rules: [
                  { required: true, message: '内容不能为空' },
                ],
                initialValue: detail.hydd,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="会议简介"
            >
              {getFieldDecorator('hyjj', {
                rules: [
                  { required: true, message: '内容不能为空' },
                  { min: 20, message: '内容不能小于20字' },
                  { max: 500, message: '内容不能大于500字' },
                ],
                initialValue: detail.hyjj,
              })(
                  <TextArea rows={25} placeholder="会议的规模、影响以及参会的积极意义" />
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" onClick={() => this.handleSubmit()} style={{ marginRight: '15px' }}>仅保存</Button>
              <Button type="primary" onClick={() => this.handleSubmit(true)}>保存并进入下一步</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  const { apply = {} } = state;
  return {
    apply,
  };
}

export default connect(mapState)(Form.create()(Widget));
