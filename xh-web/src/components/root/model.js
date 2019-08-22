import * as Api from './api';

export default {
  namespace: 'root',
  state: {
    userInfo: {},
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    saveUserInfo(state, { payload = {} }) {
      return {
        ...state,
        userInfo: payload,
      }
    },
    clear() {
      return {};
    },
  },
  effects: {
    * getUserInfo({ payload }, { call, put }) {
      const { code, data = {} } = yield call(Api.getUserInfo, payload);
      if (code !== 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      yield put({
        type: 'saveUserInfo',
        payload: data,
      });

      return data;
    },
    * logout({ payload }, { call, put }) {
      const { code, data = {} } = yield call(Api.logout, payload);
      if (code !== 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      yield put({
        type: 'saveUserInfo',
        payload: data,
      });

      return data;
    },
  },
};
