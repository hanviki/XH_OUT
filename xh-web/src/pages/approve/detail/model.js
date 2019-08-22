import * as Api from './api';

export default {
  namespace: 'approveDetail',
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
    *reviewPass({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.reviewPass, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
    *reject({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.reject, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
    *reviewReject({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.reviewReject, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
    *pass({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.pass, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
  },
};
