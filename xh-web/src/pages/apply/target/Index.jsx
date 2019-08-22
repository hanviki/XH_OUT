import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import cn from "classnames";
import { message, Button, Input, Checkbox, Form } from 'antd';
import { queryStringToJson } from '../../../utils/utils';
import HdInfo from '../../../components/hdinfo/Index';
import './style.less';

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showList: {
        1: true,
        2: true,
      }
    };
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
    }).then((data) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }
      this.setState({
        willReportingAcademicianFlag: !!data.willReportingAcademician,
        willPublishIF10PapperAnd200FundingFlag: !!data.willPublishIF10PapperAnd200Funding,
        willPublishIF10PapperFlag: !!data.willPublishIF10Papper,
        willBecomeAcademicianCandidateFlag: !!data.willBecomeAcademicianCandidate,
        willPublishIF20PapperAnd500FundingFlag: !!data.willPublishIF20PapperAnd500Funding,
        willBecomeOutstandingYouthFlag: !!data.willBecomeOutstandingYouth,
      });
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
        this.updateDetail(values,nextFlag);
      }
    });
  }

  updateDetail = (values,nextFlag) => {
    const { apply = {}, dispatch, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    for (let i in values) {
      values[i] = values[i] === true ? 1 : (values[i] === false ? 0 : values[i]);
    }
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
        pathname: '/apply/appendix',
        search: location.search,
      }));
    });
  }

  handleToggle = (index) => {
    const { showList = {} } = this.state;
    showList[index] = !showList[index];
    this.setState({ showList });
  }

  render() {
    const { state = {} } = this;
    const { showList = {} } = state;
    const { getFieldDecorator, getFieldError } = this.props.form;
    const { apply = {} } = this.props;
    const { detail = {} } = apply;
    return (
      <Form className="p-apy-target">
        <HdInfo step={4} location={this.props.location} />

        {/*3年目标*/}
        <div className="m-target">
          <div className="target-tit" onClick={() => this.handleToggle(1)}>
            入选满3年目标{!showList[1] ? '(点击展开)' : '(点击折叠)'}
          </div>
          <div className={cn('target-box', { 'none': !showList[1] })}>
            <div className="target">
              <div className="target-hd">临床新技术新业务学习</div>
              <div className="target-bd">
                <div className="bd-item">
                  <div className="item-chb">
                    {getFieldDecorator('willReportingAcademician', {
                      rules: [],
                      initialValue: detail.willReportingAcademician === 1,
                      valuePropName: 'checked',
                    })(
                      <Checkbox
                        onChange={(e) => {
                          this.setState({
                            willReportingAcademicianFlag: e.target.checked,
                          }, () => {
                            this.props.form.validateFields(['notReportingAcademicianReason'], { force: true });
                          });
                        }}
                      >1、申报院士</Checkbox>
                    )}
                    <span
                      className={cn('unit-error', { 'none': !getFieldError('notReportingAcademicianReason') })}>
                          (如不勾选请在下方说明理由)
                        </span>
                  </div>
                  <div className="item-extra">
                    {getFieldDecorator('notReportingAcademicianReason', {
                      rules: [{
                        required: detail.level == 1 && !state.willReportingAcademicianFlag,
                        message: '',
                      }],
                      initialValue: detail.notReportingAcademicianReason,
                    })(
                      <Input placeholder="如不勾选请说明理由" />
                    )}
                  </div>
                </div>
                <div className="bd-item">
                  <div className="item-chb">
                    <div style={{ marginLeft: '24px' }}>2、其他</div>
                  </div>
                  <div className="item-extra">
                    {getFieldDecorator('other3YeasAimsLevel1', {
                      rules: [],
                      initialValue: detail.other3YeasAimsLevel1,
                    })(
                      <Input placeholder="请在此输入" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="target">
              <div className="target-hd">高水平科学研究</div>
              <div className="target-bd">
                <div className="bd-item">
                  <div className="item-chb">
                    {getFieldDecorator('willPublishIF10PapperAnd200Funding', {
                      rules: [],
                      initialValue: detail.willPublishIF10PapperAnd200Funding === 1,
                      valuePropName: 'checked',
                    })(
                      <Checkbox
                        onChange={(e) => {
                          this.setState({
                            willPublishIF10PapperAnd200FundingFlag: e.target.checked,
                          }, () => {
                            this.props.form.validateFields(['notPublishIF10PapperAnd200FundingReason'], { force: true });
                          });
                        }}
                      >1、以通讯作者在IF≥10的SCI收录杂志发表论文≥1篇；且主持获得200万以上纵向项目经费</Checkbox>
                    )}
                    <span
                      className={cn('unit-error', { 'none': !getFieldError('notPublishIF10PapperAnd200FundingReason') })}>
                          (如不勾选请在下方说明理由)
                        </span>
                  </div>
                  <div className="item-extra">
                    {getFieldDecorator('notPublishIF10PapperAnd200FundingReason', {
                      rules: [{
                        required: detail.level == 2 && !state.willPublishIF10PapperAnd200FundingFlag,
                        message: '',
                      }],
                      initialValue: detail.notPublishIF10PapperAnd200FundingReason,
                    })(
                      <Input placeholder="如不勾选请说明理由" />
                    )}
                  </div>
                </div>
                <div className="bd-item">
                  <div className="item-chb">
                    <div style={{ marginLeft: '24px' }}>2、其他</div>
                  </div>
                  <div className="item-extra">
                    {getFieldDecorator('other3YeasAimsLevel2', {
                      rules: [],
                      initialValue: detail.other3YeasAimsLevel2,
                    })(
                      <Input placeholder="请在此输入" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="target">
              <div className="target-hd">高水平学术会议交流</div>
              <div className="target-bd">
                <div className="bd-item">
                  <div className="item-chb">
                    {getFieldDecorator('willPublishIF10Papper', {
                      rules: [],
                      initialValue: detail.willPublishIF10Papper === 1,
                      valuePropName: 'checked',
                    })(
                      <Checkbox
                        onChange={(e) => {
                          this.setState({
                            willPublishIF10PapperFlag: e.target.checked,
                          }, () => {
                            this.props.form.validateFields(['notPublishIF10PapperReason'], { force: true });
                          });
                        }}
                      >1、以通讯作者在IF≥10的SCI收录杂志发表论文≥1篇</Checkbox>
                    )}
                    <span
                      className={cn('unit-error', { 'none': !getFieldError('notPublishIF10PapperReason') })}>
                          (如不勾选请在下方说明理由)
                        </span>
                  </div>
                  <div className="item-extra">
                    {getFieldDecorator('notPublishIF10PapperReason', {
                      rules: [{
                        required: detail.level == 3 && !state.willPublishIF10PapperFlag,
                        message: '',
                      }],
                      initialValue: detail.notPublishIF10PapperReason,
                    })(
                      <Input placeholder="如不勾选请说明理由" />
                    )}
                  </div>
                </div>
                <div className="bd-item">
                  <div className="item-chb">
                    <div style={{ marginLeft: '24px' }}>2、其他</div>
                  </div>
                  <div className="item-extra">
                    {getFieldDecorator('other3YeasAimsLevel3', {
                      rules: [],
                      initialValue: detail.other3YeasAimsLevel3,
                    })(
                      <Input placeholder="请在此输入" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*5年目标*/}
        <div className="m-target">
          <div className="target-tit" onClick={() => this.handleToggle(2)}>
            入选满5年目标{!showList[2] ? '(点击展开)' : '(点击折叠)'}
          </div>
          <div className={cn('target-box', { 'none': !showList[2] })}>
            <div className="target">
              <div className="target-hd">临床新技术新业务学习</div>
              <div className="target-bd">
                <div className="bd-item">
                  <div className="item-chb">
                    {getFieldDecorator('willBecomeAcademicianCandidate', {
                      rules: [],
                      initialValue: detail.willBecomeAcademicianCandidate === 1,
                      valuePropName: 'checked',
                    })(
                      <Checkbox
                        onChange={(e) => {
                          this.setState({
                            willBecomeAcademicianCandidateFlag: e.target.checked,
                          }, () => {
                            this.props.form.validateFields(['notBecomeAcademicianCandidateReason'], { force: true });
                          });
                        }}
                      >1、成为院士有效候选人</Checkbox>
                    )}
                    <span
                      className={cn('unit-error', { 'none': !getFieldError('notBecomeAcademicianCandidateReason') })}>
                          (如不勾选请在下方说明理由)
                        </span>
                  </div>
                  <div className="item-extra">
                    {getFieldDecorator('notBecomeAcademicianCandidateReason', {
                      rules: [{
                        required: detail.level == 1 && !state.willBecomeAcademicianCandidateFlag,
                        message: '',
                      }],
                      initialValue: detail.notBecomeAcademicianCandidateReason,
                    })(
                      <Input placeholder="如不勾选请说明理由" />
                    )}
                  </div>
                </div>
                <div className="bd-item">
                  <div className="item-chb">
                    <div style={{ marginLeft: '24px' }}>2、其他</div>
                  </div>
                  <div className="item-extra">
                    {getFieldDecorator('other5YeasAimsLevel1', {
                      rules: [],
                      initialValue: detail.other5YeasAimsLevel1,
                    })(
                      <Input placeholder="请在此输入" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="target">
              <div className="target-hd">高水平科学研究</div>
              <div className="target-bd">
                <div className="bd-item">
                  <div className="item-chb">
                    {getFieldDecorator('willPublishIF20PapperAnd500Funding', {
                      rules: [],
                      initialValue: detail.willPublishIF20PapperAnd500Funding === 1,
                      valuePropName: 'checked',
                    })(
                      <Checkbox
                        onChange={(e) => {
                          this.setState({
                            willPublishIF20PapperAnd500FundingFlag: e.target.checked,
                          }, () => {
                            this.props.form.validateFields(['notPublishIF20PapperAnd500FundingReason'], { force: true });
                          });
                        }}
                      >1、以通讯作者在IF≥20的SCI收录杂志发表论文≥1篇或以通讯作者在IF≥10的SCI收录杂志发表论文≥3篇；且2.获得主持国家科技计划（含国家重大专项、国家重点研发，下同）项目、或国家科技计划课题（单项到账经费500万以上）、或国家基金委重点、重大项目、或国家基金委创新群体项目或教育部创新群体项目</Checkbox>
                    )}
                    <span
                      className={cn('unit-error', { 'none': !getFieldError('notPublishIF20PapperAnd500FundingReason') })}>
                          (如不勾选请在下方说明理由)
                        </span>
                  </div>
                  <div className="item-extra">
                    {getFieldDecorator('notPublishIF20PapperAnd500FundingReason', {
                      rules: [{
                        required: detail.level == 2 && !state.willPublishIF20PapperAnd500FundingFlag,
                        message: '',
                      }],
                      initialValue: detail.notPublishIF20PapperAnd500FundingReason,
                    })(
                      <Input placeholder="如不勾选请说明理由" />
                    )}
                  </div>
                </div>
                <div className="bd-item">
                  <div className="item-chb">
                    <div style={{ marginLeft: '24px' }}>2、其他</div>
                  </div>
                  <div className="item-extra">
                    {getFieldDecorator('other5YeasAimsLevel2', {
                      rules: [],
                      initialValue: detail.other5YeasAimsLevel2,
                    })(
                      <Input placeholder="请在此输入" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="target">
              <div className="target-hd">高水平学术会议交流</div>
              <div className="target-bd">
                <div className="bd-item">
                  <div className="item-chb">
                    {getFieldDecorator('willBecomeOutstandingYouth', {
                      rules: [],
                      initialValue: detail.willBecomeOutstandingYouth === 1,
                      valuePropName: 'checked',
                    })(
                      <Checkbox
                        onChange={(e) => {
                          this.setState({
                            willBecomeOutstandingYouthFlag: e.target.checked,
                          }, () => {
                            this.props.form.validateFields(['notBecomeOutstandingYouthReason'], { force: true });
                          });
                        }}
                      >1、成为“长江学者”或“杰青”</Checkbox>
                    )}
                    <span
                      className={cn('unit-error', { 'none': !getFieldError('notBecomeOutstandingYouthReason') })}>
                          (如不勾选请在下方说明理由)
                        </span>
                  </div>
                  <div className="item-extra">
                    {getFieldDecorator('notBecomeOutstandingYouthReason', {
                      rules: [{
                        required: detail.level == 3 && !state.willBecomeOutstandingYouthFlag,
                        message: '',
                      }],
                      initialValue: detail.notBecomeOutstandingYouthReason,
                    })(
                      <Input placeholder="如不勾选请说明理由" />
                    )}
                  </div>
                </div>
                <div className="bd-item">
                  <div className="item-chb">
                    <div style={{ marginLeft: '24px' }}>2、其他</div>
                  </div>
                  <div className="item-extra">
                    {getFieldDecorator('other5YeasAimsLevel3', {
                      rules: [],
                      initialValue: detail.other5YeasAimsLevel3,
                    })(
                      <Input placeholder="请在此输入" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*提交保存*/}
        <div className="m-submit">
          <Button type="primary" onClick={() => this.handleSubmit()} style={{ marginRight: '15px' }}>仅保存</Button>
          <Button type="primary" onClick={() => this.handleSubmit(true)}>保存并进入下一步</Button>
        </div>
      </Form>
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
