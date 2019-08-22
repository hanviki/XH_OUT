import * as Api from './api';

export default {
  namespace: 'applyKexue',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
  },
};
