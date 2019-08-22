import * as Api from './api';

export default {
  namespace: 'applyDaoshi',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
  },
};
