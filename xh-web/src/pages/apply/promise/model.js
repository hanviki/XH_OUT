import * as Api from './api';

export default {
  namespace: 'applyPromise',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *submitApply({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.submitApply, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }

      return data;
    },
  },
};
