import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Form, Input, DatePicker, Table, Tag, Popover } from 'antd';
import moment from 'moment';
import {HTML_PREVIEW_URL} from '../../../config/constant/constant';
import './style.less';

const levelMap = {
  1: '临床新技术新业务学习',
  2: '高水平科学研究',
  3: '高水平学术会议交流',
};
const reviewMap = {
  0: { text: '待审核', color: 'orange' },
  1: { text: '审核不通过', color: '#f50' },
  2: { text: '审核通过', color: '#32AB20' },
};
const stateMap = {
  1: { text: '待提交', color: 'gray' },
  2: { text: '审核中', color: 'orange' },
  3: { text: '待重新提交', color: 'gray' },
  4: { text: '重新审核中', color: 'orange' },
  5: { text: '部门审核完成', color: 'orange' },
  6: { text: '申报成功', color: '#32AB20' },
};
class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getList();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'historyList/clear' });
  }

  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'historyList/getList',
    }).then((data = {}) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }
    });
  }

  getCols = () => {
    const { modelData = {}, dispatch } = this.props;
    return [
      {
        title: '申请类型',
        width: 200,
        dataIndex: 'level',
        align:'center',
        key: 'name',
        render: (value) => {
          return levelMap[value];
        }
      },
      {
        title: '申请时间',
        dataIndex: 'createdAt',
        align:'center',
        key: '1',
        width: 120,
        render: (value) => {
          return moment(value).format('YYYY-MM-DD');
        }
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
        key: '2',
        render: (value, item = {}) => {
          if (item.state === 1) {
            return (<Tag color="gray">待提交</Tag>);
          }
          console.log('aaaaaaaaaaa')
          console.log(item.stage)
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
                  {itm.isRejected ? '(审核被驳回)' : ''}
                </Tag>
              </Popover>
            );
          })

          return (
            <div className="m-tag">
              <div>{statusHtml}</div>
            </div>
          );
        }
      },
      {
        title: '操作',
        key: 'operation',
        align:'center',
        width: 120,
        render: (value, item) => {
          return (
            <div className="m-opt">
              <a
                className="opt-item"
                href={`${HTML_PREVIEW_URL}?id=${item.id}`}
                target="_blank"
              >查看</a>
              {
                (item.state == 1 || item.state == 3) ?
                <a
                  className="opt-item"
                  onClick={() => {
                    dispatch(routerRedux.push({
                      pathname: '/apply/basic',
                      search: `?id=${item.id}`
                    }));
                  }}
                >编辑</a>
                : null
              }
            </div>
          )
        },
      },
    ];
  }

  render() {
    const { modelData = {} } = this.props;
    const { listData = {} } = modelData;
    const { applications = [] } = listData;
    return (
      <div className="p-history-list">
        <div className="m-tit">申报记录</div>
        <div className="m-table">
          <Table bordered columns={this.getCols()} dataSource={applications} />
        </div>
      </div>
    );
  }
}

function mapState(state) {
  const { historyList = {} } = state;
  return {
    modelData: historyList,
  };
}

export default connect(mapState)(Widget);
