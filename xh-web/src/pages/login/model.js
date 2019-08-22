import * as Api from './api';

export default {
  namespace: 'login',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear() {
      return {};
    },
  },
  effects: {
    * getSmsCode({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.getSmsCode, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
    * login({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.login, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
  },
};
