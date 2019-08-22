import fetch from 'dva/fetch';
import * as Utils from './utils';
import { DOMAIN } from '../config/constant/constant';
import { hashHistory } from 'dva/router';
import { message } from 'antd';

// 初始化loading队列
if (typeof window.HC_LOADING_QUEUE == 'undefined') {
  window.HC_LOADING_QUEUE = [];
}
if (typeof window.HC_STATUS_REDIRECT == 'undefined') {
  window.HC_STATUS_REDIRECT = false;
}

/**
 * post请求封装函数
 * @param url
 * @param param
 * @returns {{}}
 */
export async function post(url = '', param = {}, showLoading = true, showError = true) {
  if (showLoading && window.HC_LOADING_QUEUE.length <= 0) {
    window.HC_LOADING_QUEUE.push('');
    message.loading('加载中', 0);
  }

  const CONSTANT_CONFIG = window.CONSTANT_CONFIG || {};
  const queryStr = Utils.jsonToQueryString(CONSTANT_CONFIG);
  const body = JSON.stringify(param || {});
  let data = {};
  let response;
  try {
    response = await fetch(`${DOMAIN}${url}${url.indexOf('?') >= 0 ? '&' : '?'}${queryStr}`, {
      body,
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });
  } catch (e) {
    console.log(e);
    if (window.HC_STATUS_REDIRECT) {
      await Utils.sleep(3000);
    }

    response = {
      status: 500,
      statusText: '请求失败，请检查您的网络是否正常',
    };
  }

  window.HC_LOADING_QUEUE.pop();
  if (window.HC_LOADING_QUEUE.length <= 0) {
    message.destroy();
  }

  if (response.status >= 200 && response.status < 300) {
    try {
      data = await response.json();
    } catch (e) {
      data = {
        code: 1001,
        msg: '响应数据语法错误',
      };
    }
  } else {
    data = {
      code: 1000,
      msg: `抱歉，请求失败，请检查网络后重试 (CODE:${response.status})`,
    };
  }
  if (data.code == 104) {
    // 添加登录失效的处理代码
    window.location.href = `#/login`;

    // sleep等待
    await Utils.sleep(10000);
  }
  if (showError && data.code !== 0 && data.code !== 104) {
    await message.error(data.msg, 1.5);
  }
  return data;
}
