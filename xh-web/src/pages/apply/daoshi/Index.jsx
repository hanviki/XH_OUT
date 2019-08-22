import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {message, Button, Form, Input, Radio} from 'antd';
import { queryStringToJson } from '../../../utils/utils';
import HdInfo from '../../../components/hdinfo/Index';
import './style.less';

const RadioGroup = Radio.Group;
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

const next = {
  1:   { index: 4, text: '第四步：申请人评分方案', pathname: '/apply/condition' },
  2:   { index: 3, text: '第三步：科学研究项目介绍', pathname: '/apply/kexue' },
}

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
    dispatch({
      type: 'apply/updateDetail',
      payload: {
        id: parseInt(id),
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
        pathname: next[this.props.apply.detail.level].pathname,
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
        <HdInfo step={detail.level == 1?3:2} location={this.props.location}  level={detail.level} />
        <div className="m-form">
          <Form>
            <FormItem
                {...formItemLayout}
                label="留学国家"
            >
              {getFieldDecorator('lxgj', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: detail.lxgj,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="留学学校"
            >
              {getFieldDecorator('lxxx', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: detail.lxxx,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="学校世界排名"
            >
              {getFieldDecorator('xxpm', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: detail.xxpm,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="留学专业"
            >
              {getFieldDecorator('lxzy', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: detail.lxzy,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="专业世界排名"
            >
              {getFieldDecorator('zypm', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: detail.zypm,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="导师姓名"
            >
              {getFieldDecorator('dsxm', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: detail.dsxm,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="学术影响及学术任职"
            >
              {getFieldDecorator('xsrz', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: detail.xsrz,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="行政职务"
            >
              {getFieldDecorator('dsxzzw', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: detail.dsxzzw,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="是否有该导师正式邀请信"
            >
              {getFieldDecorator('dsyq', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: detail.dsyq,
              })(
                  <RadioGroup>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="导师简介"
            >
              {getFieldDecorator('dsjj', {
                rules: [
                  { required: true, message: '内容不能为空' },
                  { min: 20, message: '内容不能小于20字' },
                  { max: 500, message: '内容不能大于500字' },
                ],
                initialValue: detail.dsjj,
              })(
                <TextArea rows={25} placeholder="内容不能小于20字" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="导师提供留学条件介绍"
            >
              {getFieldDecorator('tjjs', {
                rules: [
                  { required: true, message: '内容不能为空' },
                  { min: 20, message: '内容不能小于20字' },
                  { max: 500, message: '内容不能大于500字' },
                ],
                initialValue: detail.tjjs,
              })(
                  <TextArea rows={25} placeholder="学习内容介绍（限500字）" />
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
