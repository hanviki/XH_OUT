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
        if (values[item] || values[item] === 0) {
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
        key: '1',
        width: 120,
        render: (value) => {
          return moment(value).format('YYYY-MM-DD');
        }
      },
      {
        title: '申请类型',
        width: 100,
        dataIndex: 'level',
        align: 'center',
        key: 'name',
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
        key: '22',
        render: (value, item = {}) => {
          if (item.state === 1) {
            return (<Tag color="gray">待提交</Tag>);
          }

          return (
            <div className="m-tag">
              <div><Tag color={stateMap[item.state].color}>{stateMap[item.state].text}</Tag></div>
            </div>
          );
        }
      },
      {
        title: '审核状态',
        dataIndex: 'state',
        key: '2',
        render: (value, item = {}) => {
          if (item.state === 1) {
            return (<Tag color="gray">待用户提交</Tag>);
          }

          return (
            <div className="m-tag">
              <div>
                <Popover
                  content={
                    <div style={{ maxWidth: '350px', whiteSpace: 'pre-wrap' }}>
                      {
                        item.isRejected ?
                          (`驳回说明：${item.rejectReason || ''}`)
                          : (item.reviewAdvice || '')
                      }
                    </div>
                  }
                  title={reviewMap[item.reviewState].text || ''}
                  trigger="hover"
                >
                  <Tag color={reviewMap[item.reviewState].color}>
                    {reviewMap[item.reviewState].text}
                    {item.isRejected ? '(审核被驳回)' : ''}
                  </Tag>
                </Popover>
              </div>
            </div>
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
                item.reviewState === 0 ?
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
    const { getFieldDecorator } = form;
    const { listData = {} } = modelData;
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
                { getFieldDecorator('reviewState', {})(
                  <Select placeholder="请选择审核状态">
                    <Option value="">全部</Option>
                    <Option value={0}>待审核</Option>
                    <Option value={2}>审核通过</Option>
                    <Option value={1}>审核不通过</Option>
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
