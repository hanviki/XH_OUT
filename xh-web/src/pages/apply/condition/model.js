import * as Api from './api';

export default {
  namespace: 'applyCondition',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
  },
};
