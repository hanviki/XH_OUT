import * as Api from './api';

export default {
  namespace: 'applyTarget',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
  },
};
