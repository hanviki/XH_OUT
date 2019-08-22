import * as Api from './api';

export default {
  namespace: 'applyAppendix',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *updateAppend({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.updateAppend, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
  },
};
