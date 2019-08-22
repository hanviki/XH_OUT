import * as Api from './api';

export default {
  namespace: 'applyBasic',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
  },
};
