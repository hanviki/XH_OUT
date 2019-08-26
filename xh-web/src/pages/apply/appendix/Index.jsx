import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import cn from "classnames";
import { message, Button, Input, Upload, Icon, Form, DatePicker, Select, AutoComplete } from 'antd';
import { queryStringToJson } from '../../../utils/utils';
import { UPLOAD_API_URL } from '../../../config/constant/constant';
import HdInfo from '../../../components/hdinfo/Index';
import moment from 'moment';
import './style.less';

const maxFileLength = 20 * 1024 * 1024;
const AutoOption = AutoComplete.Option;
const props = {
  name: 'file',
  action: UPLOAD_API_URL,
  // withCredentials: true,
  headers: {},
  beforeUpload: (file)=> {
    if (file.type != 'application/pdf') {
      return false;
    }
    if (file.size >= maxFileLength) {
      return false;
    }
  }
};
const personnel_laiyuan_map = ['中组部', '国家自然基金委', '教育部', '科技部', '卫生部', '其他部（委）', '湖北省'];
const scientific_shenfen_map = ['负责人', '参与人', '子项目负责人'];
const scientific_laiyuan_map = ['中组部', '国家自然基金委', '教育部', '科技部', '卫生部', '其他部（委）', '湖北省', '武汉市'];
const learn_mingcheng_map = ['主任委员', '副主任委员', '常务委员', '会长', '副会长', '秘书长', '理事长', '副理事长'];
const learn_laiyuan_map = ['中华医学会一级专业分会-', '中华口腔医学会一级分会-', '中西医结合学会一级分会-'];
const appendMap = [
  { key: 'jianli', value: '个人简历' },
  { key: 'idcard', value: '身份证' },
  { key: 'acd', value: '学位学历证书' },
  { key: 'lunwen', value: '论文全文和检索报告' },
  { key: 'keti', value: '课题批件（科研部门盖章）' },
  { key: 'zhuanli', value: '专利证书' },
  { key: 'daoshi', value: '导师中文简历' },
  { key: 'xuexiao', value: '学校中文简介' },
  { key: 'yaoqing', value: '邀请函' },
  { key: 'huojiang', value: '获奖材料' },
  { key: 'waiyu', value: '外语水平证明材料' },
  { key: 'xuehui', value: '学会任职材料' },
];

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showList: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true },
      jianli: [],
      idcard: [], // 身份证
      acd: [], // 学位学历
      lunwen: [], // 重要人才项目批件
      keti: [], // 重要科研项目批件
      zhuanli: [], // 重要学会任职证书
      daoshi: [], // 重要学会任职证书
      xuexiao: [], // 其他附件
      yaoqing: [], // 其他附件
      huojiang: [], // 其他附件
      waiyu: [], // 其他附件
      xuehui: [], // 其他附件
      userData: [],
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
    }).then((data = {}) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }

      this.convertAttachments(data);
    })
  }

  convertAttachments = (data = {}) => {
    // 后端数据需要转换成前端数据
    const { attachments = [] } = data;
    const { state = {} } = this;
    attachments.map((item) => {
      state[item.type].push(item);
    });
    if (state.jianli.length === 0) {
      state.jianli.push({ files: [], extra: [] });
    }
    if (state.idcard.length === 0) {
      state.idcard.push({ files: [], extra: [] });
    }
    if (state.acd.length === 0) {
      state.acd.push({ files: [], extra: [{ key: '取得学位时间', value: '', type: 'time' }] });
    }

    this.setState({ ...state });
  }

  handleSubmit = (nextFlag) => {
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      if (err) {
        let { showList = {} } = this.state;
        for (let i in showList) {
          showList[i] = true;
        }
        this.setState({ showList }, () => {
          document.documentElement.scrollTop = 0;
        });
        message.error('信息填写有误，请检查所有信息是否正确！');
        return;
      }
      if (!err) {
        this.convertData(values, nextFlag);
      }
    });
  }

  convertData = (values, nextFlag) => {
    const tmpArr = [];

    for (let key in values) {
      let itemVal = values[key];
      itemVal.map((item) => {
        const { files = [] } = item;
        item.files = files.map((itm) => {
          delete itm.lastModified;
          delete itm.lastModifiedDate;
          delete itm.originFileObj;
          return itm;
        });
        item.type = key;
        tmpArr.push(item);
      });
    }

    if (!tmpArr.some(val => val.type == 'jianli')) {
      message.error('请上传简历！');
      return
    }

    if (!tmpArr.some(val => val.type == 'idcard')) {
      message.error('请上传身份证！');
      return
    }

    if (!tmpArr.some(val => val.type == 'jianli')) {
      message.error('请上传简历！');
      return
    }

    if (!tmpArr.some(val => val.type == 'acd')) {
      message.error('请上传学历！');
      return
    }

    this.updateDetail(tmpArr, nextFlag);
  }

  updateDetail = (values, nextFlag) => {
    const { apply = {}, dispatch, location = {} } = this.props;
    const { id = '' } = queryStringToJson(location.search || '');
    const { detail = {} } = apply;

    var section = (detail.section || '')
    if (!section.match(/appendix;/)){
      section += 'appendix;'
    }
    dispatch({
      type: 'applyAppendix/updateAppend',
      payload: {
        id: parseInt(id),
        section:section,
        attachments: values,
      },
    }).then((data) => {
      if (data === 'REQUEST_FAIL_FLAG') {
        return;
      }
      if (!nextFlag) {
        return;
      }
      dispatch(routerRedux.push({
        pathname: '/apply/promise',
        search: location.search,
      }));
    });
  }

  handleToggle = (index) => {
    const { showList = {} } = this.state;
    showList[index] = !showList[index];
    this.setState({ showList });
  }

  handleFileChange = (key, index, info) => {
    const { state = {} } = this;
    let fileList = info.fileList;
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.data;
      }
      return file;
    });

    fileList = fileList.filter((file) => {
      if (file.type != 'application/pdf') {
        return false;
      }
      if (file.size >= maxFileLength) {
        return false;
      }
      if (file.status === 'error') {
        return false;
      }
      if (file.response) {
        return file.status === 'done';
      }
      return true;
    });

    state[key][index].files = fileList;
    this.setState({ [key]: state[key] });

    return fileList;
  }

  addItem = (key) => {
    let items = this.state[key];
    let tpl = '';
    if (key == 'jianli') {
      tpl = {
        files: [],
        extra: [],
      };
    } else if (key == 'idcard') {
      tpl = {
        files: [],
        extra: [],
      };
    } else if (key == 'acd') {
      tpl = {
        files: [],
        extra: [
          // { key: '取得学位时间', value: '', type: 'time' }
        ],
      };
    } else if (key == 'lunwen') {
      tpl = {
        files: [],
        extra: [],
      };
    } else if (key == 'keti') {
      tpl = {
        files: [],
        extra: [],
      };
    } else if (key == 'zhuanli') {
      tpl = {
        files: [],
        extra: [],
      };
    } else if (key == 'daoshi') {
      tpl = {
        files: [],
        extra: [],
      };
    } else if (key == 'xuexiao') {
      tpl = {
        files: [],
        extra: [],
      };
    }else if (key == 'yaoqing') {
      tpl = {
        files: [],
        extra: [],
      };
    }else if (key == 'huojiang') {
      tpl = {
        files: [],
        extra: [],
      };
    }else if (key == 'waiyu') {
      tpl = {
        files: [],
        extra: [],
      };
    }else if (key == 'xuehui') {
      tpl = {
        files: [],
        extra: [],
      };
    }
    items.push(tpl);
    this.setState({ [key]: items });
  }

  delItem = (key, index) => {
    let items = this.state[key];
    items.splice(index, 1, false);
    this.setState({ [key]: items })
  }


  fetchUser = (userValue) => {
    console.log('fetching user', userValue);

    this.setState({
      userData: [`${userValue}`, `${userValue}*`, `${userValue}#`, `${userValue}co-*`, `${userValue}co-#`,],
    });
  }

  handleUserChange = (userValue) => {
    this.setState({
      userData: [],
    });
  }

  previewFile = (file) => {
    console.log('Your upload file:', file);
    // Your process logic. Here we just mock to the same file
    return '/api/file/download/' + file.url
  }

  render() {
    const { state = {} } = this;
    const { showList = {}, userData = [] } = state;
    const { form = {}, apply } = this.props;
    const { detail = {} } = apply;
    const { getFieldDecorator, getFieldError } = form;
    return (
      <Form className="p-apy-append">
        <HdInfo step={detail.level==3?4:5} location={this.props.location} level={detail.level} />

        {
          appendMap.map((value, key) => {
            return (
              <div className="m-append" key={key}>
                <div className="append-tit" onClick={() => this.handleToggle(key + 1)}>
                  <div className="tit-lt">{key + 1}.{value.value}</div>
                  <div className="tit-rt">{!showList[key + 1] ? '点击展开' : '点击折叠'}</div>
                </div>
                <div className={cn('append-box', { 'none': !showList[key + 1] })}>
                  {
                    state[value.key].map((item = {}, index) => {
                      if (!item) {
                        return null;
                      }
                      const tempError = getFieldError(`${value.key}[${index}]['files']`);
                      return (
                        <div className="append" key={index}>
                          <div className="append-hd">
                            <div className="hd-txt">{key + 1}-{index + 1}.{value.value}{index + 1}</div>
                            {
                              (value.key == 'jianli' || value.key == 'idcard' || value.key == 'acd') && index == 0 ?
                                null
                                : <div className="hd-extra" onClick={() => this.delItem(value.key, index)}>删除</div>
                            }
                          </div>
                          <div className="append-bd">
                            {
                              item.extra.map((itm, idx) => {
                                const tmpErr = getFieldError(`${value.key}[${index}]['extra'][${idx}].value`);
                                return (
                                  <div className={cn('bd-item', { 'item-block': itm.type === 'article_zuozhe' })}
                                       key={idx}>
                                    <div className="item-info">
                                      {idx + 1}、{itm.key} <span
                                      className={cn('unit-error', { 'none': !tmpErr })}>({tmpErr})</span>
                                    </div>
                                    <div className="item-upload">
                                      {getFieldDecorator(`${value.key}[${index}]['extra'][${idx}].key`, {
                                        initialValue: itm.key,
                                      })(
                                        <Input hidden placeholder="请在此输入" />
                                      )}
                                      {getFieldDecorator(`${value.key}[${index}]['extra'][${idx}].type`, {
                                        initialValue: itm.type || '',
                                      })(
                                        <Input hidden placeholder="请在此输入" />
                                      )}
                                      {/*时间*/}
                                      {
                                        itm.type === 'time' ?
                                          <div>
                                            {getFieldDecorator(`${value.key}[${index}]['extra'][${idx}].value`, {
                                              rules: [{
                                                required: true, message: `请选择时间`,
                                              }],
                                              initialValue: itm.value ? moment(itm.value) : null,
                                            })(
                                              <DatePicker style={{ width: '300px' }} format='YYYY-MM-DD' />
                                            )}
                                          </div>
                                          : null
                                      }
                                      {/*重要人才批件-来源*/}
                                      {
                                        itm.type === 'personnel_laiyuan' ?
                                          <div>
                                            {getFieldDecorator(`${value.key}[${index}]['extra'][${idx}].value`, {
                                              rules: [{
                                                required: true, message: `请选择一项或者填写其他来源`,
                                              }],
                                              initialValue: itm.value,
                                            })(
                                              <AutoComplete style={{ width: '300px' }} placeholder="请选择一项或者填写其他来源">
                                                {
                                                  personnel_laiyuan_map.map((value) => {
                                                    return <AutoOption key={value}>{value}</AutoOption>;
                                                  })
                                                }
                                              </AutoComplete>
                                            )}
                                          </div>
                                          : null
                                      }
                                      {/*重要科研项目-身份*/}
                                      {
                                        itm.type === 'scientific_shenfen' ?
                                          <div>
                                            {getFieldDecorator(`${value.key}[${index}]['extra'][${idx}].value`, {
                                              rules: [{
                                                required: true, message: `请选择一项`,
                                              }],
                                              initialValue: itm.value,
                                            })(
                                              <Select style={{ width: '300px' }} placeholder="请选择一项">
                                                {
                                                  scientific_shenfen_map.map((value) => {
                                                    return <Option key={value} value={value}>{value}</Option>;
                                                  })
                                                }
                                              </Select>
                                            )}
                                          </div>
                                          : null
                                      }
                                      {/*重要科研项目-来源*/}
                                      {
                                        itm.type === 'learn_mingcheng' ?
                                          <div>
                                            {getFieldDecorator(`${value.key}[${index}]['extra'][${idx}].value`, {
                                              rules: [{
                                                required: true, message: `请选择一项或者填写其他来源`,
                                              }],
                                              initialValue: itm.value,
                                            })(
                                              <AutoComplete style={{ width: '300px' }} placeholder="请选择一项或者填写其他名称">
                                                {
                                                  learn_mingcheng_map.map((value) => {
                                                    return <AutoOption key={value}>{value}</AutoOption>;
                                                  })
                                                }
                                              </AutoComplete>
                                            )}
                                          </div>
                                          : null
                                      }
                                      {/*学会任职-名称*/}
                                      {
                                        itm.type === 'scientific_laiyuan' ?
                                          <div>
                                            {getFieldDecorator(`${value.key}[${index}]['extra'][${idx}].value`, {
                                              rules: [{
                                                required: true, message: `请选择一项或者填写其他来源`,
                                              }],
                                              initialValue: itm.value,
                                            })(
                                              <AutoComplete style={{ width: '300px' }} placeholder="请选择一项或者填写其他来源">
                                                {
                                                  scientific_laiyuan_map.map((value) => {
                                                    return <AutoOption key={value}>{value}</AutoOption>;
                                                  })
                                                }
                                              </AutoComplete>
                                            )}
                                          </div>
                                          : null
                                      }
                                      {/*学会任职-来源*/}
                                      {
                                        itm.type === 'learn_laiyuan' ?
                                          <div>
                                            {getFieldDecorator(`${value.key}[${index}]['extra'][${idx}].value`, {
                                              rules: [{
                                                required: true, message: `请选择一个学会并补充名称或者填写其他来源`,
                                              }],
                                              initialValue: itm.value,
                                            })(
                                              <AutoComplete style={{ width: '300px' }}
                                                            placeholder="请选择一个学会并补充名称或者填写其他来源">
                                                {
                                                  learn_laiyuan_map.map((value) => {
                                                    return <AutoOption key={value}>{value}</AutoOption>;
                                                  })
                                                }
                                              </AutoComplete>
                                            )}
                                          </div>
                                          : null
                                      }
                                      {/*代表性文章-全部作者*/}
                                      {
                                        itm.type === 'article_zuozhe' ?
                                          <div>
                                            {getFieldDecorator(`${value.key}[${index}]['extra'][${idx}].value`, {
                                              rules: [{
                                                required: true, message: `请输入作者姓名并按照说明选择作者类型`,
                                              }],
                                              initialValue: itm.value ? itm.value : [],
                                            })(
                                              <Select
                                                mode="multiple"
                                                labelInValue
                                                placeholder="请输入作者姓名并按照说明选择作者类型"
                                                filterOption={false}
                                                onSearch={this.fetchUser}
                                                onChange={this.handleUserChange}
                                                style={{ width: '100%' }}
                                              >
                                                {userData.map(item => <Option key={item}>{item}</Option>)}
                                              </Select>
                                            )}
                                          </div>
                                          : null
                                      }
                                      {/*普通-文本框*/}
                                      {
                                        itm.type === '' || itm.type === undefined || itm.type === 'text' ?
                                          <div>
                                            {getFieldDecorator(`${value.key}[${index}]['extra'][${idx}].value`, {
                                              rules: [{
                                                required: itm.require !== false, message: `请在下面输入正确内容`,
                                              }],
                                              initialValue: itm.value,
                                            })(
                                              <Input placeholder="请在此输入" style={{ width: '300px' }} />
                                            )}
                                          </div>
                                          : null
                                      }
                                    </div>
                                  </div>
                                );
                              })
                            }

                            <div className="bd-item item-block">
                              <div className="item-info">附件（仅支持PDF格式，大小不能超过20M）：<span
                                className={cn('unit-error', { 'none': !tempError })}>({tempError})</span></div>
                              <div className="item-upload">
                                {getFieldDecorator(`${value.key}[${index}]['files']`, {
                                  rules: [{
                                    required: true, message: '请上传附件材料（仅支持PDF格式，大小不能超过20M）',
                                  }],
                                  initialValue: item.files,
                                  getValueFromEvent: (e) => this.handleFileChange(value.key, index, e)
                                })(
                                  <Upload
                                    {...props}
                                    fileList={item.files}
                                    previewFile={this.previewFile}
                                  >
                                    <Button>
                                      <Icon type="upload" /> 点击上传附件材料
                                    </Button>
                                  </Upload>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  }

                  <div className="append" onClick={() => this.addItem(value.key)}>
                    <div className="append-hd add">+ 添加{value.value}</div>
                  </div>
                </div>
              </div>
            );
          })
        }

        <div className="m-submit">
          <Button type="primary" onClick={() => this.handleSubmit()} style={{ marginRight: '15px' }}>仅保存</Button>
          <Button type="primary" onClick={() => this.handleSubmit(true)}>保存并进入下一步</Button>
        </div>
      </Form>
    );
  }
}

function mapState(state) {
  const { applyAppendix = {}, apply = {} } = state;
  return {
    modelData: applyAppendix,
    apply,
  };
}

export default connect(mapState)(Form.create()(Widget));
