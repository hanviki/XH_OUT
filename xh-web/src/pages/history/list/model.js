import * as Api from './api';

export default {
  namespace: 'historyList',
  state: {
    listData: {},
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    saveList(state, { payload = {} }){
      return {
        ...state,
        listData: payload,
      };
    },
    clear(){
      return {};
    }
  },
  effects: {
    * getList({ payload }, { call,put }) {
      const { code, data = {} } = yield call(Api.getList, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }

      yield put({
        type: 'saveList',
        payload: data,
      })
      return data;
    },
  },
};
