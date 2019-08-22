import * as Api from './api';

export default {
  namespace: 'historyDetail',
  state: {
    detail: {},
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    saveDetail(state, { payload = {} }){
      return {
        ...state,
        detail: payload,
      };
    },
    clear(){
      return {};
    }
  },
  effects: {
    *getDetail({ payload }, { call, put }) {
      const { code, data = {} } = yield call(Api.getDetail, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }

      yield put({
        type: 'saveDetail',
        payload: data,
      });

      return data;
    },
  },
};
