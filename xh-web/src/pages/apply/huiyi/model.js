import * as Api from './api';

export default {
  namespace: 'applyHuiyi',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
  },
};
