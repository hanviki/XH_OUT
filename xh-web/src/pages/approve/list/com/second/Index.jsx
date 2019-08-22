import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Form, Input, Select, Table, Tag, Popover, Col, Row } from 'antd';
import moment from 'moment';

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};
const Option = Select.Option;
const FormItem = Form.Item;
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
class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getList();
  }

  getList = (page = 1) => {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      const formatData = {};
      Object.keys(values).forEach((item) => {
        if (values[item]) {
          formatData[item] = values[item];
        }
      });
      const reqData = {
        page,
        limit: 10,
        ...formatData,
      };
      this.pageIndex = page;
      dispatch({
        type: 'approveList/getList',
        payload: reqData,
      }).then((data = {}) => {
        if (data === 'REQUEST_FAIL_FLAG') {
          return;
        }
      });
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.getList(1);
  }
  getCols = () => {
    const { modelData = {}, dispatch } = this.props;
    return [
      {
        title: '姓名',
        width: 100,
        dataIndex: 'applicantName',
        align: 'center',
        key: 'applicantName',
      },
      {
        title: '申请时间',
        dataIndex: 'createdAt',
        align: 'center',
        key: 'createdAt',
        width: 120,
        render: (value) => {
          return moment(value).format('YYYY-MM-DD');
        }
      },
      {
        title: '申请类型',
        width: 200,
        dataIndex: 'level',
        align: 'center',
        key: 'level',
        render: (value) => {
          return levelMap[value];
        }
      },
      {
        title: '工号',
        width: 100,
        dataIndex: 'applicantJobNum',
        align: 'center',
        key: 'applicantJobNum',
      },
      {
        title: '申报进度',
        width: 120,
        dataIndex: 'state',
        key: 'state1',
        render: (value, item = {}) => {
          if (item.state === 1) {
            return (<Tag color="gray">待提交</Tag>);
          }

          return (
            <div className="m-tag">
              <Popover
                content={
                  <div style={{ maxWidth: '350px', whiteSpace: 'pre-wrap' }}>
                    {
                      item.groupAdvice ?
                        (`人才工作领导小组：${item.groupAdvice || ''}`)
                        : null
                    }
                  </div>
                }
                title={stateMap[item.state].text}
                trigger="hover"
              >
                <Tag color={stateMap[item.state].color}>{stateMap[item.state].text}</Tag>
              </Popover>
            </div>
          );
        }
      },
      {
        title: '审核状态',
        dataIndex: 'state',
        key: 'state2',
        render: (value, item = {}) => {
          let statusHtml = (item.reviews || []).map((itm, idx) => {
            return (
              <Popover
                key={idx}
                content={
                  <div style={{ maxWidth: '350px', whiteSpace: 'pre-wrap' }}>
                    {
                      itm.isRejected ?
                        (`驳回说明：${itm.rejectReason || ''}`)
                        : (itm.reviewAdvice || '')
                    }
                  </div>
                }
                title={reviewMap[itm.reviewState].text || ''}
                trigger="hover"
              >
                <Tag color={reviewMap[itm.reviewState].color}>
                  {`${itm.reviewerName}：${reviewMap[itm.reviewState].text}`}
                  {itm.isRejected ? '(审核已驳回)' : ''}
                </Tag>
              </Popover>
            );
          })

          return (
            <div className="m-tag">{statusHtml}</div>
          );
        }
      },
      {
        title: '操作',
        key: 'operation',
        align: 'center',
        width: 120,
        render: (value, item) => {
          return (
            <div className="m-opt">
              {
                !(item.state == 1 || item.state == 3 || item.state == 6) ?
                  <a
                    className="opt-item"
                    target="_blank"
                    href={`#/approve/detail?id=${item.id}`}
                  >审核</a>
                  :
                  <a
                    className="opt-item"
                    target="_blank"
                    href={`#/approve/detail?id=${item.id}`}
                  >查看</a>
              }
            </div>
          )
        },
      },
    ];
  }

  render() {
    const { modelData = {}, form } = this.props;
    const { listData = {} } = modelData;
    const { getFieldDecorator } = form;
    const { applications = [] } = listData;
    return (
      <div>
        <Form
          className="g-form"
          onSubmit={(e) => {
            e.preventDefault();
            this.handleSubmit();
          }}
        >
          <Row type="flex" justify="start">
            <Col span={6} className="col-item">
              <FormItem
                {...formItemLayout}
                label=""
              >
                { getFieldDecorator('query', {})(<Input placeholder="请输入姓名或工号" />)}
              </FormItem>
            </Col>
            <Col span={6} className="col-item">
              <FormItem
                {...formItemLayout}
                label=""
              >
                { getFieldDecorator('level', {})(
                  <Select placeholder="请选择申请类型">
                    <Option value="">全部</Option>
                    <Option value={1}>临床新技术新业务学习</Option>
                    <Option value={2}>高水平科学研究</Option>
                    <Option value={3}>高水平学术会议交流</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={6} className="col-item">
              <FormItem
                {...formItemLayout}
                label=""
              >
                { getFieldDecorator('state', {})(
                  <Select placeholder="请选择申报状态">
                    <Option value="">全部</Option>
                    <Option value={1}>待提交</Option>
                    <Option value={2}>审核中</Option>
                    <Option value={3}>待重新提交</Option>
                    <Option value={4}>重新审核中</Option>
                    <Option value={5}>部门审核完成</Option>
                    <Option value={6}>申报成功</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={4} style={{ margin: '3px 0 0 20px' }}>
              <Button type="primary" onClick={() => this.getList()}>查询</Button>
              <Button className="ant-col-offset-2" onClick={() => this.handleReset()}>重置</Button>
            </Col>
          </Row>
        </Form>
        <div className="m-table">
          <Table
            bordered
            columns={this.getCols()}
            dataSource={applications}
            pagination={{
              pageSize: 10,
              total: listData.total || 1,
              current: this.pageIndex || 1,
              onChange: (pageNum) => {
                this.getList(pageNum);
              },
            }}
          />
        </div>
      </div>
    );
  }
}

function mapState(state) {
  const { approveList = {} } = state;
  return {
    modelData: approveList,
  };
}

export default connect(mapState)(Form.create()(Widget));
