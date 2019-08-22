import React from 'react';
import { Route, Switch, Redirect, routerRedux, Link } from 'dva/router';
import { queryStringToJson } from '../../utils/utils';
import './style.less';


class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const stepMaps = {
      1: [
        { index: 1, text: '第一步：基本情况', pathname: '/apply/basic' },
        { index: 2, text: '第二步：留学项目介绍', pathname: '/apply/intro' },
        { index: 3, text: '第三步：留学单位及导师', pathname: '/apply/daoshi' },
        { index: 4, text: '第四步：申请人评分', pathname: '/apply/condition' },
        { index: 5, text: '第五步：填写/上传附件材料', pathname: '/apply/appendix' },
        { index: 6, text: '第六步：填写承诺书并提交申报', pathname: '/apply/promise' },
      ],
      2: [
        { index: 1, text: '第一步：基本情况', pathname: '/apply/basic' },
        { index: 2, text: '第二步：留学单位及导师', pathname: '/apply/daoshi' },
        { index: 3, text: '第三步：科学研究项目介绍', pathname: '/apply/kexue' },
        { index: 4, text: '第四步：申请人评分', pathname: '/apply/condition' },
        { index: 5, text: '第五步：填写/上传附件材料', pathname: '/apply/appendix' },
        { index: 6, text: '第六步：填写承诺书并提交申报', pathname: '/apply/promise' },
      ],
      3: [
        { index: 1, text: '第一步：基本情况', pathname: '/apply/basic' },
        { index: 2, text: '第二步：会议情况', pathname: '/apply/huiyi' },
        { index: 3, text: '第三步：参会情况', pathname: '/apply/canhui' },
        { index: 4, text: '第四步：填写/上传附件材料', pathname: '/apply/appendix' },
        { index: 5, text: '第五步：填写承诺书并提交申报', pathname: '/apply/promise' },
        { index: 6, text: '', pathname:'#' },
      ],
    };

    console.log("aaaaaaaaaa")
    console.log(this.props)
    const stepMap = this.props.level?stepMaps[this.props.level]:[]
    console.log(stepMap)
    const { step = 1, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search);
    return (
      <div className="wgt-hd-info">
        <div className="wgt-hd-stp">
          <div className="wgt-hd-stp-tit">申报流程（点击下方链接可直接跳转到相应页面）</div>
          <div className="wgt-hd-stp-box">
            {
              stepMap.map((item, index) => {
                if ((step - 1) == index) {
                  return (
                    <div className="wgt-hd-stp-item disabled" key={index}>{item.text}</div>
                  );
                } else {
                  return (
                    <Link to={`${item.pathname}?id=${id}`} className="wgt-hd-stp-item" key={index}>
                      {item.text}
                    </Link>
                  );
                }
              })
            }
          </div>
        </div>
      </div>
    );
  }
}


export default Widget;
