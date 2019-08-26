import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import cn from 'classnames';
import {message, Button, Radio, Form, Table, Tag, Popover, Tabs, Modal, Input, Select, DatePicker, InputNumber, Popconfirm, Checkbox } from 'antd';
import { queryStringToJson } from '../../../utils/utils';
import HdInfo from '../../../components/hdinfo/Index';
import './style.less';
import moment from "moment";

const { Option } = Select;
const RadioGroup = Radio.Group;
const { TabPane } = Tabs;
const FormItem = Form.Item;
const { TextArea } = Input;

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

const xxpm = {
  '前10名': 10,
  '前20名': 5,
  '前50名': 3,
  '前100名': 2,
}

const xxjjpm = {
  '前5名': 10,
  '前10名': 5,
  '前30名': 3,
  '前50名': 2,
}

const yypm = {
  '前10名': 10,
  '前20名': 8,
  '前50名': 5,
  '前100名': 2,
}

const yyjjpm = {
  '前10名': 5,
  '前20名': 3,
  '前50名': 2,
  '前100名': 1,
}

const zyxgx = {
  '完全相关': 10,
  '直接相关': 8,
  '部分相关': 5,
  '有点相关': 2,
}

const zypm = {
  '前5名': 20,
  '前10名': 10,
  '前30名': 8,
  '前50名': 5,
}



const sources = [
  {name: '“973”课题一级子项目', value:50},
  {name: '“863”课题', value:50},
  {name: '国家自然科学基金重点项目', value:50},
  {name: '国家杰出青年基金', value:50},
  {name: '国家自然科学基金面上', value:20},
  {name: '国家自然科学基金主任', value:8},
  {name: '教育部新世纪优秀人才支持计划', value:20},
  {name: '卫生部行业基金', value: 20},
  {name: '湖北省重大科研项目', value: 20},
  {name: '湖北省杰出青年基金', value: 10},
  {name: '横向合作课题,总经费100万元及以上', value: 10},
  {name: '横向合作课题,总经费50万元至100万元', value: 5} ,
  {name: '其它', value: 0} ,
]

const award_levels = [
  {name: '国家级科技奖励(一等奖第一名)', value: 60},
  {name: '国家级科技奖励(一等奖第二名)', value: 50},
  {name: '国家级科技奖励(一等奖第三名)', value: 40},
  {name: '国家级科技奖励(一等奖第四名)', value: 30},
  {name: '国家级科技奖励(一等奖第五名)', value: 20},
  {name: '国家级科技奖励(二等奖第一名)', value: 50},
  {name: '国家级科技奖励(二等奖第二名)', value: 40},
  {name: '国家级科技奖励(二等奖第三名)', value: 30},
  {name: '国家级科技奖励(二等奖第四名)', value: 20},
  {name: '国家级科技奖励(二等奖第五名)', value: 10},
  {name: '中华医学奖(一等奖第一名)', value: 30},
  {name: '中华医学奖(一等奖第二名)', value: 20},
  {name: '中华医学奖(一等奖第三名)', value: 10},
  {name: '中华医学奖(二等奖第一名)', value: 20},
  {name: '中华医学奖(二等奖第二名)', value: 10},
  {name: '中华医学奖(三等奖第一名)', value: 10},
  {name: '省、部级奖励(一等奖第一名)', value: 30},
  {name: '省、部级奖励(一等奖第二名)', value: 20},
  {name: '省、部级奖励(一等奖第三名)', value: 10},
  {name: '省、部级奖励(二等奖第一名)', value: 20},
  {name: '省、部级奖励(二等奖第二名)', value: 10},
  {name: '省、部级奖励(三等奖第一名)', value: 10},
  {name: '其它', value: 0},
]

const item_fileds = ['name', 'source', 'fee', 'start', 'end', 'rank', 'score' ]
const award_fileds = ['name', 'award', 'orgnazation', 'level', 'year', 'rank', 'score']
const renzhi_fileds = ['name', 'renzhi', 'score']
const paper_fileds = ['name', 'publish', 'include', 'factor', 'sci', 'ssci', 'cssi', 'score']
const zyds_fileds = [ 'xxzhpm',
  'xxjjpm',
  'yyxz',
  'yypm',
  'yyjjpm',
  'zyxgx',
  'zyzhpm',
  'dsjq',
  'dsqr',
  'dswjys',
  'dsys',
  'dszx',
  'zyfg',
  'zyzj',
  'zychj',
  'zy8n',
  'zy5n',
  'xkzd',
  'xklczd',
  'xksjzd',]


class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 1,
      showItem: false,
      editItem: false,
      item: {},
      detail: {},
      score: []
    };
  }

  componentDidMount() {
    this.getDetail();
  }

  getDetail = () => {
    const { apply = {}, dispatch, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    dispatch({
      type: 'apply/getDetail',
      payload: { id: parseInt(id) },
    }).then((data) => {
      data.total_item_score = data.items.reduce((acc, curr)=>{ return acc += curr.score}, 0)
      data.total_award_score = data.awards.reduce((acc, curr)=>{ return acc += curr.score}, 0)
      data.total_renzhi_score = data.renzhis.reduce((acc, curr)=>{ return acc += curr.score}, 0)
      data.total_paper_score = data.papers.reduce((acc, curr)=>{ return acc += curr.score}, 0)
      data.total_score = data.total_item_score + data.total_award_score + data.total_renzhi_score + data.total_paper_score
      this.state.score[0] = xxpm[data.xxzhpm];
      this.state.score[1] = xxjjpm[data.xxjjpm];
      this.state.score[2] = data.yyxz?10:0;
      this.state.score[3] = yypm[data.yypm];
      this.state.score[4] = yyjjpm[data.yyjjpm];
      this.state.score[5] = zyxgx[data.zyxgx];
      this.state.score[6] = zypm[data.zyzhpm];
      this.state.score[7] = data.dsjq?6:0;
      this.state.score[8] = data.dsqr?6:0;
      this.state.score[9] = data.dswjys?6:0;
      this.state.score[10] = data.dsys?6:0;
      this.state.score[11] = data.dszx?6:0;
      this.state.score[12] = data.zyfg?5:0;
      this.state.score[13] = data.zyzj?3:0;
      this.state.score[14] = data.zychj?1:0;
      this.state.score[15] = data.zy8n?5:0;
      this.state.score[16] = data.zy5n?3:0;
      this.state.score[17] = data.xkzd?5:0;
      this.state.score[18] = data.xklczd?5:0;
      this.state.score[19] = data.xksjzd?1:0;
      this.setState({detail: data, item: {}, store: []})
    });
  }

  handleSubmit = (nextFlag) => {
    if (this.state.tab == 1){
      this.props.form.validateFields(zyds_fileds, (err, values) => {
        if (err) {
          message.error('信息填写有误，请检查所有信息是否正确！');
          return;
        }

        this.updateDetail(values, nextFlag);

      });

      return;
    }

    if (!nextFlag){
      return;
    }

    if (this.state.tab == 6){
      const { apply = {}, dispatch, location = {} } = this.props;
      dispatch(routerRedux.push({
        pathname: '/apply/appendix',
        search: location.search,
      }));
      return;
    }
    this.setState({tab: this.state.tab + 1})
  }

  updateDetail = (values,nextFlag) => {
    const { apply = {}, dispatch, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    const { detail = {} } = apply;

    var section = (detail.section || '')
    if (!section.match(/condition;/) && this.state.tab == 1){
      section += 'condition;'
    }
    dispatch({
      type: 'apply/updateDetail',
      payload: {
        id: parseInt(id),
        section: section,
        ...values,
        score: this.getScore()
      },
    }).then((data) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }
      if (!nextFlag) {
        return;
      }
      this.setState({tab: this.state.tab + 1})
    });
  }

  addItem = () => {
    console.log('addItem')
    console.log(this.props.form)

    this.props.form.validateFields(item_fileds, (err, values) => {
      if (err){
        message.error('信息填写有误，请检查所有信息是否正确！');
        return;
      }

      if (this.state.detail.items.some(it => it.name == values.name)){
        message.error('项目名称不能重复！');
        return;
      }

      // let values = this.props.form.getFieldsValue()
      console.log(values)
      const { apply = {}, dispatch, location = {} } = this.props;
      const { id = '' } = queryStringToJson(location.search || '');
      dispatch({
        type: 'apply/addItem',
        payload: {
          id: parseInt(id),
          item: {...values, applicationId: id}
        },
      }).then((data) => {
        if (data === 'REQUEST_FAIL_FLAG') {
          return;
        }
        this.setState({showItem: false, item: {}})
        this.props.form.resetFields()
        this.getDetail()
      });
    })

  }

  addAward = () => {
    console.log('addAward')
    console.log(this.props.form)

    this.props.form.validateFields(award_fileds, (err, values) => {
      if (err){
        message.error('信息填写有误，请检查所有信息是否正确！');
        return;
      }

      if (this.state.detail.awards.some(it => it.name == values.name)){
        message.error('获奖项目名称不能重复！');
        return;
      }


      // let values = this.props.form.getFieldsValue()
      console.log(values)
      const { apply = {}, dispatch, location = {} } = this.props;
      const { id = '' } = queryStringToJson(location.search || '');
      dispatch({
        type: 'apply/addAward',
        payload: {
          id: parseInt(id),
          item: {...values, applicationId: id}
        },
      }).then((data) => {
        if (data === 'REQUEST_FAIL_FLAG') {
          return;
        }

        this.setState({showAward: false})
        this.props.form.resetFields()
        this.getDetail()

      });
    })

  }

  addRenzhi = () => {
    console.log('addRenzhi')
    console.log(this.props.form)

    this.props.form.validateFields(renzhi_fileds, (err, values) => {
      if (err){
        message.error('信息填写有误，请检查所有信息是否正确！');
        return;
      }

      if (this.state.detail.renzhis.some(it => it.name == values.name)){
        message.error('学会名称不能重复！');
        return;
      }

      // let values = this.props.form.getFieldsValue()
      console.log(values)
      const { apply = {}, dispatch, location = {} } = this.props;
      const { id = '' } = queryStringToJson(location.search || '');
      dispatch({
        type: 'apply/addRenzhi',
        payload: {
          id: parseInt(id),
          item: {...values, applicationId: id}
        },
      }).then((data) => {
        if (data === 'REQUEST_FAIL_FLAG') {
          return;
        }

        this.setState({showRenzhi: false})
        this.props.form.resetFields()
        this.getDetail()

      });
    })

  }

  addPaper = () => {
    console.log('addPaper')

    this.props.form.validateFields(paper_fileds, (err, values) => {
      if (err){
        message.error('信息填写有误，请检查所有信息是否正确！');
        return;
      }

      if (this.state.detail.papers.some(it => it.name == values.name)){
        message.error('著作或论文名称不能重复！');
        return;
      }

      // let values = this.props.form.getFieldsValue()
      console.log(values)
      const { apply = {}, dispatch, location = {} } = this.props;
      const { id = '' } = queryStringToJson(location.search || '');
      dispatch({
        type: 'apply/addPaper',
        payload: {
          id: parseInt(id),
          item: {...values, applicationId: id}
        },
      }).then((data) => {
        if (data === 'REQUEST_FAIL_FLAG') {
          return;
        }

        this.setState({showPaper: false})
        this.props.form.resetFields()
        this.getDetail()

      });
    })

  }

  handleToggle = (index) => {
    return; // 屏蔽当前功能
    const { showList = {} } = this.state;
    showList[index] = !showList[index];
    this.setState({ showList });
  }

  getItemCols = () => {
    const { modelData = {}, dispatch } = this.props;
    const that = this
    return [
      {
        title: '项目名称',
        width: 200,
        dataIndex: 'name',
        align:'center',
        key: 'name',
      },
      {
        title: '项目性质及来源',
        dataIndex: 'source',
        align:'center',
        key: 'source',
        width: 120,
      },
      {
        title: '项目经费（万元）',
        dataIndex: 'fee',
        align:'center',
        key: 'fee',
        width: 120,
      },
      {
        title: '起始年度',
        dataIndex: 'start',
        align:'center',
        key: 'start',
        width: 120,
        render: (text)=>{ return moment(text, 'YYYY-MM-DD').format('YYYY')}
      },
      {
        title: '终止年度',
        dataIndex: 'end',
        align:'center',
        key: 'end',
        width: 120,
        render: (text)=>{ return moment(text, 'YYYY-MM-DD').format('YYYY')}
      },
      {
        title: '排序',
        dataIndex: 'rank',
        align:'center',
        key: 'rank',
        width: 120,
      },
      {
        title: '评分',
        dataIndex: 'score',
        align:'center',
        key: 'score',
        width: 120,
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
                    onClick={()=>{that.editItem(item)}}
                >编辑</a>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <Popconfirm
                    title="确定要删除该项目吗？"
                    onConfirm={()=>{this.delItem(item)}}
                    okText="是"
                    cancelText="否"
                >
                <a
                    className="opt-item"
                >删除</a>
                </Popconfirm>
              </div>
          )
        },
      },
    ];
  }

  getAwardCols = () => {
    const { modelData = {}, dispatch } = this.props;
    const that = this
    return [
      {
        title: '获奖项目名称',
        width: 200,
        dataIndex: 'name',
        align:'center',
        key: 'name',
      },
      {
        title: '奖励名称',
        dataIndex: 'award',
        align:'center',
        key: 'award',
        width: 120,
      },
      {
        title: '授奖单位及国别',
        dataIndex: 'orgnazation',
        align:'center',
        key: 'orgnazation',
        width: 120,
      },
      {
        title: '奖励等级',
        dataIndex: 'level',
        align:'center',
        key: 'level',
        width: 120,
      },
      {
        title: '奖励年度',
        dataIndex: 'year',
        align:'center',
        key: 'year',
        width: 120,
        render: (text)=>{ return moment(text, 'YYYY-MM-DD').format('YYYY')}
      },
      {
        title: '排序',
        dataIndex: 'rank',
        align:'center',
        key: 'rank',
        width: 120,
      },
      {
        title: '评分',
        dataIndex: 'score',
        align:'center',
        key: 'score',
        width: 120,
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
                    onClick={()=>{that.editAward(item)}}
                >编辑</a>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <Popconfirm
                    title="确定要删除该奖励吗？"
                    onConfirm={()=>{this.delAward(item)}}
                    okText="是"
                    cancelText="否"
                >
                  <a
                      className="opt-item"
                  >删除</a>
                </Popconfirm>
              </div>
          )
        },
      },
    ];
  }

  getRenzhiCols = () => {
    const { modelData = {}, dispatch } = this.props;
    const that = this
    return [
      {
        title: '学会名称',
        width: 200,
        dataIndex: 'name',
        align:'center',
        key: 'name',
      },
      {
        title: '任职',
        dataIndex: 'renzhi',
        align:'center',
        key: 'renzhi',
        width: 120,
      },
      {
        title: '评分',
        dataIndex: 'score',
        align:'center',
        key: 'score',
        width: 120,
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
                    onClick={()=>{that.editRenzhi(item)}}
                >编辑</a>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <Popconfirm
                    title="确定要删除该任职吗？"
                    onConfirm={()=>{this.delRenzhi(item)}}
                    okText="是"
                    cancelText="否"
                >
                  <a
                      className="opt-item"
                  >删除</a>
                </Popconfirm>
              </div>
          )
        },
      },
    ];
  }

  getPaperCols = () => {
    const { modelData = {}, dispatch } = this.props;
    const that = this
    return [
      {
        title: '著作或论文名称、出版单位或发表刊物名称、期号、起止页码、所有著作者姓名\n' +
            '（通讯作者请标注*号）\n',
        width: 400,
        dataIndex: 'name',
        align:'center',
        key: 'name',
      },
      {
        title: '出版或发表时间',
        dataIndex: 'publish',
        align:'center',
        key: 'publish',
        width: 120,
        render: (text)=>{ return moment(text, 'YYYY-MM-DD').format('YYYY-MM-DD')}
      },
      {
        title: '是否被SCI、EI、SSCI、CSSCI收录',
        dataIndex: 'include',
        align:'center',
        key: 'include',
        width: 120,
      },
      {
        title: '期刊影响因子值',
        dataIndex: 'score',
        align:'center',
        key: 'score',
        width: 120,
      },
      {
        title: 'SCI引用次数',
        dataIndex: 'sci',
        align:'center',
        key: 'sci',
        width: 120,
      },
      {
        title: 'SSCI引用次数',
        dataIndex: 'ssci',
        align:'center',
        key: 'ssci',
        width: 120,
      },
      {
        title: 'CSSI引用次数',
        dataIndex: 'cssi',
        align:'center',
        key: 'cssi',
        width: 120,
      },
      {
        title: '评分',
        dataIndex: 'score',
        align:'center',
        key: 'score',
        width: 120,
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
                    onClick={()=>{that.editPaper(item)}}
                >编辑</a>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <Popconfirm
                    title="确定要删除该论文吗？"
                    onConfirm={()=>{this.delPaper(item)}}
                    okText="是"
                    cancelText="否"
                >
                  <a
                      className="opt-item"
                  >删除</a>
                </Popconfirm>
              </div>
          )
        },
      },
    ];
  }

  editItem = (item) => {
    this.setState({item: item, showItem: true, editItem: true})
  }

  editAward = (item) => {
    console.log('editAward')
    console.log(item)
    console.log(this.state.item)
    this.setState({item: item, showAward: true, editAward: true})
  }

  editRenzhi = (item) => {
    console.log('editRenzhi')
    console.log(item)
    console.log(this.state.item)
    this.setState({item: item, showRenzhi: true, editRenzhi: true})
  }

  editPaper = (item) => {
    console.log('editPaper')
    console.log(item)
    console.log(this.state.item)
    this.setState({item: item, showPaper: true, editPaper: true})
  }


  saveItem = () => {
    console.log('saveItem')
    console.log(this.props.form)

    this.props.form.validateFields(item_fileds, (err, values) => {
      if (err){
        message.error('信息填写有误，请检查所有信息是否正确！');
        return;
      }

      if (this.state.detail.items.some(it => it.name == values.name && it.id != this.state.item.id)){
        message.error('项目名称不能重复！');
        return;
      }

      // let values = this.props.form.getFieldsValue()
      console.log(values)
      const { apply = {}, dispatch, location = {} } = this.props;
      const { id = '' } = queryStringToJson(location.search || '');
      dispatch({
        type: 'apply/saveItem',
        payload: {
          id: parseInt(id),
          item: {...values, applicationId: id, id: this.state.item.id}
        },
      }).then((data) => {
        if (data === 'REQUEST_FAIL_FLAG') {
          return;
        }

        this.getDetail()
        this.setState({showItem: false})
        this.props.form.resetFields()
      });
    })
  }

  saveAward = () => {
    console.log('saveAward')
    console.log(this.props.form)

    this.props.form.validateFields(award_fileds, (err, values) => {
      if (err){
        message.error('信息填写有误，请检查所有信息是否正确！');
        return;
      }

      if (this.state.detail.awards.some(it => it.name == values.name && it.id != this.state.item.id)){
        message.error('获奖项目名称不能重复！');
        return;
      }

      // let values = this.props.form.getFieldsValue()
      console.log(values)
      const { apply = {}, dispatch, location = {} } = this.props;
      const { id = '' } = queryStringToJson(location.search || '');
      dispatch({
        type: 'apply/saveAward',
        payload: {
          id: parseInt(id),
          item: {...values, applicationId: id, id: this.state.item.id}
        },
      }).then((data) => {
        if (data === 'REQUEST_FAIL_FLAG') {
          return;
        }

        this.getDetail()
        this.setState({showAward: false})
        this.props.form.resetFields()
      });
    })
  }

  saveRenzhi = () => {
    console.log('saveRenzhi')

    this.props.form.validateFields(renzhi_fileds, (err, values) => {
      if (err){
        message.error('信息填写有误，请检查所有信息是否正确！');
        return;
      }

      if (this.state.detail.renzhis.some(it => it.name == values.name && it.id != this.state.item.id)){
        message.error('学会名称不能重复！');
        return;
      }

      // let values = this.props.form.getFieldsValue()
      console.log(values)
      const { apply = {}, dispatch, location = {} } = this.props;
      const { id = '' } = queryStringToJson(location.search || '');
      dispatch({
        type: 'apply/saveRenzhi',
        payload: {
          id: parseInt(id),
          item: {...values, applicationId: id, id: this.state.item.id}
        },
      }).then((data) => {
        if (data === 'REQUEST_FAIL_FLAG') {
          return;
        }

        this.getDetail()
        this.setState({showRenzhi: false})
        this.props.form.resetFields()
      });
    })
  }

  savePaper = () => {
    console.log('savePaper')

    this.props.form.validateFields(paper_fileds, (err, values) => {
      if (err){
        message.error('信息填写有误，请检查所有信息是否正确！');
        return;
      }

      if (this.state.detail.papers.some(it => it.name == values.name && it.id != this.state.item.id)){
        message.error('著作或论文名称不能重复！');
        return;
      }

      // let values = this.props.form.getFieldsValue()
      console.log(values)
      const { apply = {}, dispatch, location = {} } = this.props;
      const { id = '' } = queryStringToJson(location.search || '');
      dispatch({
        type: 'apply/savePaper',
        payload: {
          id: parseInt(id),
          item: {...values, applicationId: id, id: this.state.item.id}
        },
      }).then((data) => {
        if (data === 'REQUEST_FAIL_FLAG') {
          return;
        }

        this.getDetail()
        this.setState({showPaper: false})
        this.props.form.resetFields()
      });
    })
  }

  delItem = (item) => {
    console.log('delItem')

    const { apply = {}, dispatch, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    dispatch({
      type: 'apply/delItem',
      payload: {
        id: parseInt(id),
        item: item
      },
    }).then((data) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }

      this.getDetail()
      this.setState({showItem: false})
    });
  }

  delAward = (item) => {
    console.log('delItem')

    const { apply = {}, dispatch, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    dispatch({
      type: 'apply/delAward',
      payload: {
        id: parseInt(id),
        item: item
      },
    }).then((data) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }

      this.getDetail()
      this.setState({showAward: false})
    });
  }

  delRenzhi = (item) => {
    console.log('delRenzhi')

    const { apply = {}, dispatch, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    dispatch({
      type: 'apply/delRenzhi',
      payload: {
        id: parseInt(id),
        item: item
      },
    }).then((data) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }

      this.getDetail()
      this.setState({showRenzhi: false})
    });
  }

  delPaper = (item) => {
    console.log('delPaper')

    const { apply = {}, dispatch, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    dispatch({
      type: 'apply/delPaper',
      payload: {
        id: parseInt(id),
        item: item
      },
    }).then((data) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }

      this.getDetail()
      this.setState({showPaper: false})
    });
  }

  handleItemOk = () => {

    if (this.state.editItem){
      this.saveItem()
    }else {
      this.addItem()
    }
  }

  handleAwardOk = () => {
    console.log('handleAwardOk')
    if (this.state.editAward){
      this.saveAward()
    }else {
      this.addAward()
    }
  }

  handleRenzhiOk = () => {
    console.log('handleRenzhiOk')
    if (this.state.editRenzhi){
      this.saveRenzhi()
    }else {
      this.addRenzhi()
    }
  }

  handlePaperOk = () => {
    console.log('handlePaperOk')
    if (this.state.editPaper){
      this.savePaper()
    }else {
      this.addPaper()
    }
  }

  handleItemCancel = () => {
    this.setState({showItem: false})
    this.props.form.resetFields()
  }

  handleAwardCancel = () => {
    this.setState({showAward: false})
    this.props.form.resetFields()
  }

  handleRenzhiCancel = () => {
    this.setState({showRenzhi: false})
    this.props.form.resetFields()
  }

  handlePaperCancel = () => {
    this.setState({showPaper: false})
    this.props.form.resetFields()
  }

  getScore = ()=>{
    console.log(this.state.score)
    return this.state.score.reduce((acc, curr)=>{
      return acc + curr
}, 0)
}

  render() {
    console.log('kkkkkkkkkkkk')
    const { showList = {} } = this.state;
    const { getFieldDecorator, getFieldError } = this.props.form;
    const { apply = {} } = this.props;
    const { detail = {} } = apply;
    const { level = '' } = detail;

    return (
      <Form className="p-apy-condition">
        <HdInfo step={4} location={this.props.location}  level={detail.level} />
        <Tabs activeKey={this.state.tab.toString()} onChange={(key)=>{this.setState({tab: parseInt(key)})}}>
          <TabPane tab="申请相关专业及导师评分" key="1">
            <div className="m-condition">
              <div className="condition-tit" onClick={() => this.handleToggle(1)}>
                申请相关专业及导师评分标准
              </div>
              <div className={cn('condition-box')}>
                <div className="condition">
                  <div className="condition-hd">（一）学校（20分）：</div>
                  <div className="condition-bd">
                    <div className="bd-item">
                      <div className="item-des">1.学校综合排名（10分）</div>
                      <div className="item-aws">
                        {
                          getFieldDecorator('xxzhpm', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.xxzhpm,
                        })(
                            <RadioGroup onChange={(e) => {
                              this.state.score[0] = xxpm[e.target.value];
                              this.setState({score: this.state.score})}}>
                              <Radio value={'前10名'}>前10名（10分）</Radio>
                              <Radio value={'前20名'}>前20名（5分）</Radio>
                              <Radio value={'前50名'}>前50名（3分）</Radio>
                              <Radio value={'前100名'}>前100名（2分）</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('xxzhpm') })}>
                        ({getFieldError('xxzhpm')})
                        </span>
                      </div>
                    </div>
                    <div className="bd-item">
                      <div className="item-des">2.学校NIH基金申请总额排名</div>
                      <div className="item-aws">
                        {
                          getFieldDecorator('xxjjpm', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.xxjjpm,
                        })(
                            <RadioGroup onChange={(e) => {
                              this.state.score[1] = xxjjpm[e.target.value];
                              this.setState({score: this.state.score})}}>
                              <Radio value={'前5名'}>前5名（10分）</Radio>
                              <Radio value={'前10名'}>前10名（5分）</Radio>
                              <Radio value={'前30名'}>前30名（3分）</Radio>
                              <Radio value={'前50名'}>前50名（2分）</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('xxjjpm') })}>
                        ({getFieldError('xxjjpm')})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="condition">
                  <div className="condition-hd">（二）医院（20分）：</div>
                  <div className="condition-bd">
                    <div className="bd-item">
                      <div className="item-des">1.大学或研究所附属医院 (5分)</div>
                      <div className="item-aws">
                        {
                          getFieldDecorator('yyxz', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.yyxz,
                        })(
                            <RadioGroup onChange={(e) => {
                              this.state.score[2] = e.target.value?10:0;
                              this.setState({score: this.state.score})}}>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('yyxz') })}>
                        ({getFieldError('yyxz')})
                        </span>
                      </div>
                    </div>
                    <div className="bd-item">
                      <div className="item-des">2.医院综合排名 (10分)</div>
                      <div className="item-aws">
                        {
                          getFieldDecorator('yypm', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.yypm,
                        })(
                            <RadioGroup onChange={(e) => {
                              this.state.score[3] = yypm[e.target.value];
                              this.setState({score: this.state.score})}}>
                              <Radio value={'前10名'}>前10名（10分）</Radio>
                              <Radio value={'前20名'}>前20名（8分）</Radio>
                              <Radio value={'前50名'}>前50名（5分）</Radio>
                              <Radio value={'前100名'}>前100名（2分）</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('yypm') })}>
                        ({getFieldError('yypm')})
                        </span>
                      </div>
                    </div>
                    <div className="bd-item">
                      <div className="item-des">3.医院年度NIH基金申请总额排名（5分）</div>
                      <div className="item-aws">
                        {getFieldDecorator('yyjjpm', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.yyjjpm,
                        })(
                            <RadioGroup onChange={(e) => {
                              this.state.score[4] = yyjjpm[e.target.value];
                              this.setState({score: this.state.score})}}>
                              <Radio value={'前10名'}>前10名（5分）</Radio>
                              <Radio value={'前20名'}>前20名（3分）</Radio>
                              <Radio value={'前50名'}>前50名（2分）</Radio>
                              <Radio value={'前100名'}>前100名（1分）</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('yyjjpm') })}>
                        ({getFieldError('yyjjpm')})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="condition">
                  <div className="condition-hd">（三）专业（30分）：</div>
                  <div className="condition-bd">
                    <div className="bd-item">
                      <div className="item-des">1.与申请人所从事专业的相关性（10）</div>
                      <div className="item-aws">
                        {getFieldDecorator('zyxgx', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.zyxgx,
                        })(
                            <RadioGroup onChange={(e) => {
                              this.state.score[5] = zyxgx[e.target.value];
                              this.setState({score: this.state.score})}}>
                              <Radio value={'完全相关'}>完全相关（10分）</Radio>
                              <Radio value={'直接相关'}>直接相关（8分）</Radio>
                              <Radio value={'部分相关'}>部分相关（5分）</Radio>
                              <Radio value={'有点相关'}>有点相关（0分）</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('zyxgx') })}>
                        ({getFieldError('zyxgx')})
                        </span>
                      </div>
                    </div>
                    <div className="bd-item">
                      <div className="item-des">2.专业排名（20）</div>
                      <div className="item-aws">
                        {getFieldDecorator('zyzhpm', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.zyzhpm,
                        })(
                            <RadioGroup  onChange={(e) => {
                              this.state.score[6] = zypm[e.target.value];
                              this.setState({score: this.state.score})}}>
                              <Radio value={'前5名'}>前5名（20分）</Radio>
                              <Radio value={'前10名'}>前10名（10分）</Radio>
                              <Radio value={'前30名'}>前30名（8分）</Radio>
                              <Radio value={'前50名'}>前50名（5分）</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('zyzhpm') })}>
                        ({getFieldError('zyzhpm')})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="condition">
                  <div className="condition-hd">（四）导师身份及学术地位（30分）：</div>
                  <div className="condition-bd">
                    <div className="bd-item">
                      <div className="item-des">1.导师为海外杰青（6分）</div>
                      <div className="item-aws">
                        {getFieldDecorator('dsjq', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.dsjq,
                        })(
                            <RadioGroup   onChange={(e) => {
                              this.state.score[7] = e.target.value?6:0;
                              this.setState({score: this.state.score})}}>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('dsjq') })}>
                        ({getFieldError('dsjq')})
                        </span>
                      </div>
                    </div>
                    <div className="bd-item">
                      <div className="item-des">2.千人计划B类（6分）</div>
                      <div className="item-aws">
                        {getFieldDecorator('dsqr', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.dsqr,
                        })(
                            <RadioGroup   onChange={(e) => {
                              this.state.score[8] = e.target.value?6:0;
                              this.setState({score: this.state.score})}}>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('dsqr') })}>
                        ({getFieldError('dsqr')})
                        </span>
                      </div>
                    </div>
                    <div className="bd-item">
                      <div className="item-des">3.中国科学院或工程院外籍院士（6分）</div>
                      <div className="item-aws">
                        {getFieldDecorator('dswjys', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.dswjys,
                        })(
                            <RadioGroup    onChange={(e) => {
                              this.state.score[9] = e.target.value?6:0;
                              this.setState({score: this.state.score})}}>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('dswjys') })}>
                        ({getFieldError('dswjys')})
                        </span>
                      </div>
                    </div>
                    <div className="bd-item">
                      <div className="item-des">4.导师为该国科学院院士（6分）</div>
                      <div className="item-aws">
                        {getFieldDecorator('dsys', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.dsys,
                        })(
                            <RadioGroup    onChange={(e) => {
                              this.state.score[10] = e.target.value?6:0;
                              this.setState({score: this.state.score})}}>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('dsys') })}>
                        ({getFieldError('dsys')})
                        </span>
                      </div>
                    </div>
                    <div className="bd-item">
                      <div className="item-des">5.导师为本专业该国一级学会或世界一级学会主席（6分）</div>
                      <div className="item-aws">
                        {getFieldDecorator('dszx', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.dszx,
                        })(
                            <RadioGroup    onChange={(e) => {
                              this.state.score[11] = e.target.value?6:0;
                              this.setState({score: this.state.score})}}>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('dszx') })}>
                        ({getFieldError('dszx')})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="condition">
                  <div className="condition-hd">（五）申请人资历及年龄：</div>
                  <div className="condition-bd">
                    <div className="bd-item">
                      <div className="item-des">1.副高级以上专业技术职务（5分）</div>
                      <div className="item-aws">
                        {getFieldDecorator('zyfg', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.zyfg,
                        })(
                            <RadioGroup    onChange={(e) => {
                              this.state.score[12] = e.target.value?5:0;
                              this.setState({score: this.state.score})}}>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('zyfg') })}>
                        ({getFieldError('zyfg')})
                        </span>
                      </div>
                    </div>
                    <div className="bd-item">
                      <div className="item-des">2.中级专业技术职务（3分）</div>
                      <div className="item-aws">
                        {getFieldDecorator('zyzj', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.zyzj,
                        })(
                            <RadioGroup    onChange={(e) => {
                              this.state.score[13] = e.target.value?3:0;
                              this.setState({score: this.state.score})}}>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('zyzj') })}>
                        ({getFieldError('zyzj')})
                        </span>
                      </div>
                    </div>
                    <div className="bd-item">
                      <div className="item-des">3.初级专业技术职务（1分）</div>
                      <div className="item-aws">
                        {getFieldDecorator('zychj', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.zychj,
                        })(
                            <RadioGroup    onChange={(e) => {
                              this.state.score[14] = e.target.value?1:0;
                              this.setState({score: this.state.score})}}>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('zychj') })}>
                        ({getFieldError('zychj')})
                        </span>
                      </div>
                    </div>
                    <div className="bd-item">
                      <div className="item-des">4.申请人在我院连续工作满8年及以上（5分）</div>
                      <div className="item-aws">
                        {getFieldDecorator('zy8n', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.zy8n,
                        })(
                            <RadioGroup onChange={(e) => {
                              this.state.score[15] = e.target.value?5:0;
                              this.setState({score: this.state.score})}}>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('zy8n') })}>
                        ({getFieldError('zy8n')})
                        </span>
                      </div>
                    </div>
                    <div className="bd-item">
                      <div className="item-des">5.申请人在我院连续工作满5年以上8年以下（3分）</div>
                      <div className="item-aws">
                        {getFieldDecorator('zy5n', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.zy5n,
                        })(
                            <RadioGroup onChange={(e) => {
                              this.state.score[16] = e.target.value?3:0;
                              this.setState({score: this.state.score})}}>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('zy5n') })}>
                        ({getFieldError('zy5n')})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="condition">
                  <div className="condition-hd">（六）申请人所在学科：</div>
                  <div className="condition-bd">
                    <div className="bd-item">
                      <div className="item-des">1.国家重点学科（5分）</div>
                      <div className="item-aws">
                        {getFieldDecorator('xkzd', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.xkzd,
                        })(
                            <RadioGroup onChange={(e) => {
                              this.state.score[17] = e.target.value?5:0;
                              this.setState({score: this.state.score})}}>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('xkzd') })}>
                        ({getFieldError('xkzd')})
                        </span>
                      </div>
                    </div>
                    <div className="bd-item">
                      <div className="item-des">2.国家临床重点专科（5分）</div>
                      <div className="item-aws">
                        {getFieldDecorator('xklczd', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.xklczd,
                        })(
                            <RadioGroup onChange={(e) => {
                              this.state.score[18] = e.target.value?5:0;
                              this.setState({score: this.state.score})}}>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('xklczd') })}>
                        ({getFieldError('xklczd')})
                        </span>
                      </div>
                    </div>
                    <div className="bd-item">
                      <div className="item-des">3.省级重点专科（1分）</div>
                      <div className="item-aws">
                        {getFieldDecorator('xksjzd', {
                          rules: [{
                            required: true, message: '请填写正确的内容',
                          }],
                          initialValue: detail.xksjzd,
                        })(
                            <RadioGroup onChange={(e) => {
                              this.state.score[19] = e.target.value?1:0;
                              this.setState({score: this.state.score})}}>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                        <span
                            className={cn('unit-error', { 'none': !getFieldError('xksjzd') })}>
                        ({getFieldError('xksjzd')})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div style={{textAlign: 'center', fontSize: '15px', marginTop: '20px'}}>综合得分:  {this.getScore()}分</div>
          </TabPane>
          <TabPane tab="学术评分标准" key="2">
            <div>
              <div style={{fontSize: '16px'}}>（一）课题：</div>
              <div>1.国家级课题</div>
              <div>（1）类：</div>
              <div>“973”课题一级子项目（50分）</div>
              <div>“863”课题（50分）</div>
              <div>国家自然科学基金重点项目（50分）</div>
              <div>国家杰出青年基金（50分）</div>
              <div>（2）类：</div>
              <div>国家自然科学基金面上（20分）</div>
              <div>国家自然科学基金主任（8分）</div>
              <div>教育部新世纪优秀人才支持计划（20分）</div>
              <div>2.省部级课题</div>
              <div>卫生部行业基金（20分） </div>
              <div>湖北省重大科研项目（20分）</div>
              <div>湖北省杰出青年基金（10分）</div>
              <div>横向合作课题：总经费100万元及以上10分, 总经费50万元至100万元 5分</div>
              <div>注：上述课题以第一负责人计算。</div>
              <div style={{fontSize: '16px'}}>（二）论文 </div>
              <div>只计算以第一作者或通讯作者身份在SCI收录杂志上发表的文章（不含摘要）。</div>
              <div>1.计分方法：</div>
              <div>（1）以通讯作者或第一作者（国内）发表的文章，按发表杂志当年的影响因子*3计分。</div>
              <div>（2）在国外发表的第一作者论文，按照当年分值计算。</div>
              <div> 2.SCI论文发表时间以在相关杂志网上公布并有DOI号，同时可通过MEDLINE检索时为准。</div>
              <div style={{fontSize: '16px'}}>（三）成果 </div>
              <div>1. 国家级科技奖励（二等奖第二名40分、第三名3０分、第四名20分、第五名10分）</div>
              <div>2.中华医学奖（一等奖第一名30分、第二名20分、第三名10分；二等奖第一名20分、第二名10分；三等奖第一名１０分）</div>
              <div>3.省、部级奖励（一等奖第一名30分、第二名20分、第三名10分；二等奖第一名20、第二名10分；三等奖第一名10分）</div>
              <div>注：以上获奖同一项目不重复计分。</div>
              <div style={{fontSize: '16px'}}>（四）学会任职</div>
              <div>在全国专业学会担任委员及以上5分，青年委员3分。</div>
            </div>

            <div style={{textAlign: 'center', fontSize: '15px', marginTop: '20px'}}>综合得分:  {this.state.detail.total_score}分</div>
          </TabPane>
          <TabPane tab="主持的科研项目" key="3">
            <div className="m-table">
              <Table bordered columns={this.getItemCols()} dataSource={detail.items}
              footer={()=>{
                return (
                <div style={{display: 'flex', justifyContent: 'space-between', alignContent: 'center'}}>
                  <div style={{textAlign: 'center', fontSize: '15px'}}>主持科研项目评分合计:  {this.state.detail.total_item_score}分</div>
                  <Button type="primary" onClick={() => this.setState({showItem: true, editItem: false, item: {}})} style={{ marginLeft: '50px' }}>新增</Button>
                </div>
                )
              }}/>
            </div>
          </TabPane>
          <TabPane tab="获得的科研奖励" key="4">
            <div className="m-table">
              <Table bordered columns={this.getAwardCols()} dataSource={detail.awards}
                     footer={()=>{
                       return (
                           <div style={{display: 'flex', justifyContent: 'space-between', alignContent: 'center'}}>
                             <div style={{textAlign: 'center', fontSize: '15px'}}>科研奖励评分合计:  {this.state.detail.total_award_score}分</div>
                             <Button type="primary" onClick={() => this.setState({showAward: true, editAward: false,  item: {}})} style={{ marginLeft: '50px' }}>新增</Button>
                           </div>
                       )
                     }}/>
            </div>
          </TabPane>

          <TabPane tab="学会任职" key="5">
            <div className="m-table">
              <Table bordered columns={this.getRenzhiCols()} dataSource={detail.renzhis}
                     footer={()=>{
                       return (
                           <div style={{display: 'flex', justifyContent: 'space-between', alignContent: 'center'}}>
                             <div style={{textAlign: 'center', fontSize: '15px'}}>学会任职评分合计:  {this.state.detail.total_renzhi_score}分</div>
                             <Button type="primary" onClick={() => this.setState({showRenzhi: true, editRenzhi: false,  item: {}})} style={{ marginLeft: '50px' }}>新增</Button>
                           </div>
                       )
                     }}/>
            </div>
          </TabPane>
          <TabPane tab="申请人代表性著作、论文情况" key="6">
            <div className="m-table">
              <Table bordered columns={this.getPaperCols()} dataSource={detail.papers}
                     footer={()=>{
                       return (
                           <div style={{display: 'flex', justifyContent: 'space-between', alignContent: 'center'}}>
                             <div style={{textAlign: 'center', fontSize: '15px'}}>文章评分合计:  {this.state.detail.total_paper_score}分</div>
                             <Button type="primary" onClick={() => this.setState({showPaper: true, editPaper: false,  item: {}})} style={{ marginLeft: '50px' }}>新增</Button>
                           </div>
                       )
                     }}/>
            </div>
          </TabPane>
        </Tabs>
        <Modal
            title={this.state.editItem?'编辑科研项目':'新增科研项目'}
            visible={this.state.showItem}
            onOk={this.handleItemOk}
            onCancel={this.handleItemCancel}
            width={'40%'}
        >
          <Form >
          <FormItem
              {...formItemLayout}
              label="项目名称"
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true, message: '请填写正确的内容',
              }],
              initialValue: this.state.item.name,
            })(
                <Input placeholder="请在此输入" />
            )}
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="项目性质及来源"
          >
            {getFieldDecorator('source', {
              rules: [{
                required: true, message: '请填写正确的内容',
              }],
              initialValue: this.state.item.source,
            })(
                <Select  style={{ width: '100%' }} onChange={(value)=>{
                  let source = sources.find((it)=>{ return it.name == value})
                  this.state.item.score = source.value
                  this.setState({item: this.state.item})
                }}>
                  {
                    sources.map((it)=>{
                      return <Option value={it.name}>{it.name} {it.value}分</Option>
                  })
                }
                </Select>
            )}
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="项目经费(万元)"
          >
            {getFieldDecorator('fee', {
              rules: [{
                required: true, message: '请填写正确的内容',
              }],
              initialValue: this.state.item.fee,
            })(
                <InputNumber placeholder="请在此输入" min={0} max={100000000} style={{width: '100%'}}/>
            )}
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="起始年度"
          >
            {getFieldDecorator('start', {
              rules: [{
                required: true, message: '请填写正确的内容',
              }],
              initialValue: this.state.item.start ?moment(this.state.item.start, 'YYYY-MM-DD'):null,
            })(
                <DatePicker  />
            )}
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="终止年度"
          >
            {getFieldDecorator('end', {
              rules: [{
                required: true, message: '请填写正确的内容',
              }],
              initialValue: this.state.item.end ?moment(this.state.item.end, 'YYYY-MM-DD'):null,
            })(
                <DatePicker  />
            )}
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="排序"
          >
            {getFieldDecorator('rank', {
              rules: [{
                required: true, message: '请填写正确的内容',
              }],
              initialValue: this.state.item.rank,
            })(
                <InputNumber placeholder="请在此输入" min={0} max={10000} style={{width: '100%'}}/>
            )}
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="评分"
          >
            {getFieldDecorator('score', {
              rules: [{
                required: true, message: '请填写正确的内容',
              }],
              initialValue: this.state.item.score,
            })(
                <InputNumber placeholder="请在此输入" style={{width: '100%'}} disabled={true} />
            )}
          </FormItem>
          </Form>
        </Modal>
        <Modal
            title={this.state.editAward?'编辑获得的科研奖励':'新增获得的科研奖励'}
            visible={this.state.showAward}
            onOk={this.handleAwardOk}
            onCancel={this.handleAwardCancel}
            width={'40%'}
        >
          <Form >
            <FormItem
                {...formItemLayout}
                label="获奖项目名称"
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.name,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="奖励名称"
            >
              {getFieldDecorator('award', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.award,
              })(
                  <Input placeholder="请在此输入" style={{width: '100%'}}/>
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="授奖单位及国别"
            >
              {getFieldDecorator('orgnazation', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.orgnazation,
              })(
                  <Input placeholder="请在此输入"  />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="奖励等级"
            >
              {getFieldDecorator('level', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.level,
              })(
                  <Select  style={{ width: '100%' }} onChange={(value)=>{
                    let level = award_levels.find((it)=>{ return it.name == value})
                    this.state.item.score = level.value
                    this.setState({item: this.state.item})
                  }}>
                    {
                      award_levels.map((it)=>{
                        return <Option value={it.name}>{it.name} {it.value}分</Option>
                      })
                    }
                  </Select>
              )}

            </FormItem>
            <FormItem
                {...formItemLayout}
                label="奖励年度"
            >
              {getFieldDecorator('year', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.year ?moment(this.state.item.year, 'YYYY-MM-DD'):null,
              })(
                  <DatePicker  />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="排序"
            >
              {getFieldDecorator('rank', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.rank,
              })(
                  <InputNumber placeholder="请在此输入" min={0} max={10000} style={{width: '100%'}}/>
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="评分"
            >
              {getFieldDecorator('score', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.score,
              })(
                  <InputNumber placeholder="请在此输入" style={{width: '100%'}} disabled={true}/>
              )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
            title={this.state.editRenzhi?'编辑学会任职':'新增学会任职'}
            visible={this.state.showRenzhi}
            onOk={this.handleRenzhiOk}
            onCancel={this.handleRenzhiCancel}
        >
          <Form >
            <FormItem
                {...formItemLayout}
                label="学会名称"
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.name,
              })(
                  <Input placeholder="请在此输入" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="任职"
            >
              {getFieldDecorator('renzhi', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.renzhi,
              })(
                  <Input placeholder="请在此输入" style={{width: '100%'}}/>
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="评分"
            >
              {getFieldDecorator('score', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.score,
              })(
                  <InputNumber placeholder="请在此输入" style={{width: '100%'}} />
              )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
            title={this.state.editPaper?'编辑申请人代表性著作、论文情况':'新增申请人代表性著作、论文情况'}
            visible={this.state.showPaper}
            onOk={this.handlePaperOk}
            onCancel={this.handlePaperCancel}
            width={'40%'}
        >
          <Form >
            <FormItem
                {...formItemLayout}
                label="著作或论文名称"
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.name,
              })(
                  <TextArea placeholder="著作或论文名称、出版单位或发表刊物名称、期号、起止页码、所有著作者姓名（通讯作者请标注*号）" rows={5} />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="出版或发表时间"
            >
              {getFieldDecorator('publish', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.publish ?moment(this.state.item.publish, 'YYYY-MM-DD'):null,
              })(
                  <DatePicker  />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="是否被SCI、EI、SSCI、CSSCI收录"
            >
              {getFieldDecorator('include', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.include,
              })(
                  <RadioGroup>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </RadioGroup>
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="期刊影响因子值"
            >
              {getFieldDecorator('factor', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.factor,
              })(
                  <Input placeholder="请在此输入"  />
              )}
            </FormItem>

            <FormItem
                {...formItemLayout}
                label="SCI引用次数"
            >
              {getFieldDecorator('sci', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.sci,
              })(
                  <InputNumber placeholder="请在此输入" min={0} max={10000} style={{width: '100%'}}/>
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="SSCI引用次数"
            >
              {getFieldDecorator('ssci', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.ssci,
              })(
                  <InputNumber placeholder="请在此输入" min={0} max={10000} style={{width: '100%'}}/>
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="CSSI引用次数"
            >
              {getFieldDecorator('cssi', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.cssi,
              })(
                  <InputNumber placeholder="请在此输入" min={0} max={10000} style={{width: '100%'}}/>
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="评分"
            >
              {getFieldDecorator('score', {
                rules: [{
                  required: true, message: '请填写正确的内容',
                }],
                initialValue: this.state.item.score,
              })(
                  <InputNumber placeholder="请在此输入" style={{width: '100%'}} />
              )}
            </FormItem>
          </Form>
        </Modal>
        <div className="m-submit">
          <Button type="primary" style={{ marginRight: '15px' }} onClick={() => this.handleSubmit(false)}> 仅保存</Button>
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
