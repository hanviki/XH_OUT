import * as Api from './api';

export default {
  namespace: 'applyCanhui',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
  },
};
