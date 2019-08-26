import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { message, Button, Form, Input, DatePicker, Radio, Select  } from 'antd';
import HdInfo from '../../../components/hdinfo/Index';
import { queryStringToJson } from '../../../utils/utils';
import moment from 'moment';

import './style.less';

const { Option } = Select;
const { TextArea } = Input;
const levelMap = {
  1: '临床新技术新业务学习',
  2: '高水平科学研究',
  3: '高水平学术会议交流',
};
const RadioGroup = Radio.Group;
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

const next = {
  1: { index: 2, text: '第二步：留学项目介绍', pathname: '/apply/intro' },
  2: { index: 2, text: '第二步：留学单位及导师', pathname: '/apply/daoshi' },
  3: { index: 2, text: '第二步：会议情况', pathname: '/apply/huiyi' }
}

class Widget extends React.Component {
  constructor(props) {
    super(props);

    const { apply = {} } = this.props;
    const { detail = {} } = apply;
    this.state = {checked: detail.dddz};
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
        console.log(err)
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
    if (!section.match(/basic;/)){
      section += 'basic;'
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
        pathname: next[this.props.apply.detail.level].pathname,
        search: location.search,
      }));
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { apply = {} } = this.props;
    const { detail = {} } = apply;
    console.log("pppppppppppp")
    console.log(detail)
    return (
      <div className="p-apy-basic">
        <HdInfo step={1} location={this.props.location} level={detail.level} />
        <div className="m-form">
          <Form>
            <FormItem
              {...formItemLayout}
              label="申请人姓名"
            >
              {detail.applicantName}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="申请类型"
            >
              {levelMap[detail.level]}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="申请年度"
            >
              {detail.declarationYear}年
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="联系电话"
            >
              {getFieldDecorator('applicantMobile', {
                rules: [{
                  required: true, message: '请填写申请人电话',
                }],
                initialValue: detail.applicantMobile,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="最后学位"
            >
              {getFieldDecorator('education', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: detail.education,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="最后学历"
            >
              <div style={{display: 'flex', 'flex-direction': 'row', 'justify-content': 'space-between'}}>
                <div>
                  {getFieldDecorator('bysj', {
                    rules: [{
                      required: true, message: '请填写正确的毕业时间',
                    }],
                    initialValue: detail.bysj ?moment(detail.bysj, 'YYYY-MM-DD'):'',
                  })(
                      <DatePicker />
                  )}
                </div>

                <div>毕业于</div>
                <div style={{width: '50%'}}>
                  {getFieldDecorator('school', {
                    rules: [{
                      required: true, message: '请填写正确的学校',
                    }],
                    initialValue: detail.school,
                  })(
                      <Input placeholder="请在此输入学校名称" />
                  )}
                </div>
              </div>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="所在科室"
            >
              {getFieldDecorator('deptName', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: detail.deptName,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="科室负责人"
            >
              {getFieldDecorator('ksfzr', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: detail.ksfzr,
              })(
                  <Select placeholder="请选择" filterOption={true}>
                    {(detail.owners || []).map((item)=>{
                      return <Option key={item.id.toString()} value={item.id.toString()}>{item.jobNum + " " + item.name + " " + item.position}</Option>;
                    })}
                  </Select>
              )}
            </FormItem>
            {
              detail.level != 3 ?
              <FormItem
                  {...formItemLayout}
                  label="现任专业技术职务"
              >
                {getFieldDecorator('zyzw', {
                  rules: [{
                    required: true, message: '请填写正确的内容',
                  }],
                  initialValue: detail.zyzw,
                })(
                    <Input placeholder="请在此输入" />
                )}
              </FormItem>:null
            }
            <FormItem
                {...formItemLayout}
                label="现任行政职务"
            >
              {getFieldDecorator('xzzw', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: detail.xzzw,
              })(
                  <Input placeholder="请在此输入" />
              )}
                    </FormItem>
                    {
                        detail.level == 3 ?
                            <FormItem
                                {...formItemLayout}
                                label="聘任时间"
                            >
                                {getFieldDecorator('applicantHiredate', {
                                     rules: [{
                                       required: true, message: '请填写正确的内容',
                                     }],
                                    initialValue: detail.applicantHiredate ? moment(detail.applicantHiredate, 'YYYY-MM-DD') : '',
                                })(
                                    <DatePicker />
                                )}
                            </FormItem> : null
                    }
            {
              detail.level != 3?
              <FormItem
                  {...formItemLayout}
                  label="从事专业关键词"
              >
                {getFieldDecorator('zygjc', {
                  rules: [{
                    required: true, message: '请填写正确的内容',
                  }],
                  initialValue: detail.zygjc,
                })(
                    <Input placeholder="请在此输入" />
                )}
              </FormItem>:null
            }
            {
              detail.level != 3?
                  <FormItem
                      {...formItemLayout}
                      label="近5年医疗考核情况"
                  >
                    {getFieldDecorator('ylkh', {
                      rules: [{
                        required: true, message: '请填写正确的内容',
                      }],
                      initialValue: detail.ylkh,
                                })(
                                    <Input placeholder="请在此输入" />
                                )}
                  </FormItem>:null
            }
            {
              detail.level != 3?
                  <FormItem
                      {...formItemLayout}
                      label="是否单独带组"
                  >
                    {getFieldDecorator('dddz', {
                      rules: [{
                        required: true, message: '请填写正确的内容',
                      }],
                      initialValue: detail.dddz,
                    })(
                        <RadioGroup onChange={(e)=>{
                          this.setState({checked: e.target.value})
                        }}>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </RadioGroup>
                    )}
                  </FormItem>:null
            }
            {
              detail.level != 3 && this.state.checked  ?
                  <FormItem
                      {...formItemLayout}
                      label="开始带组时间"
                  >
                    {getFieldDecorator('dzsj', {
                      // rules: [{
                      //   required: true, message: '请填写正确的内容',
                      // }],
                      initialValue: detail.dzsj ?moment(detail.dzsj, 'YYYY-MM-DD'):'',
                    })(
                        <DatePicker  />
                    )}
                  </FormItem>:null
            }
            {
              detail.level == 1 || detail.level == 2 ?
                  <FormItem
                      {...formItemLayout}
                      label="申请留学时间"
                  >
                    {getFieldDecorator('lxkssj', {
                      rules: [{
                        required: true, message: '请填申请留学开始时间',
                      }],
                      initialValue: detail.lxkssj ?moment(detail.lxkssj, 'YYYY-MM-DD'):'',
                    })(
                        <DatePicker  placeholder={'请选择开始日期'}/>
                    )}
                    <span>  至  </span>
                    {getFieldDecorator('lxjssj', {
                      rules: [{
                        required: true, message: '请填申请留学结束时间',
                      }],
                      initialValue: detail.lxkssj ?moment(detail.lxkssj, 'YYYY-MM-DD'):'',
                    })(
                        <DatePicker  placeholder={'请选择结束日期'}/>
                    )}
                  </FormItem>: null
            }
            {
              detail.level != 3 ?
                  <FormItem
                      {...formItemLayout}
                      label="个人简历"
                  >
                    {getFieldDecorator('grjj', {
                      rules: [
                        { required: true, message: '内容不能为空' }
                      ],
                      initialValue: detail.grjj,
                    })(
                        <TextArea rows={25} placeholder="" />
                    )}
                  </FormItem>:null
            }
            {
              detail.level != 3 ?
                  <FormItem
                      {...formItemLayout}
                      label="主要成就"
                  >
                    {getFieldDecorator('zycj', {
                      rules: [
                        { required: true, message: '内容不能为空' },
                        { max: 200, message: '内容不能大于200字' },
                      ],
                      initialValue: detail.zycj,
                    })(
                        <TextArea rows={25} placeholder="限200字以内" />
                    )}
                  </FormItem>:null
            }
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
