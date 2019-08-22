import * as Api from './api';

export default {
  namespace: 'applyIntro',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
  },
};
