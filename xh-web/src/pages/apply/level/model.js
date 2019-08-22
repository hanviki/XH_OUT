import * as Api from './api';

export default {
  namespace: 'applyLevel',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    * createApply({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.createApply, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }

      return data;
    },
  },
};
