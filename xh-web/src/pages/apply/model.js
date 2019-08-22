import * as Api from './api';

export default {
  namespace: 'apply',
  state: {
    detail: {},
    owners: [],
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    saveDetail(state, { payload = {} }) {
      return {
        ...state,
        detail: payload,
      };
    },
    saveOwners(state, { payload = {} }) {
      return {
        ...state,
        owners: payload,
      };
    },
    clear() {
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
    *updateDetail({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.updateDetail, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
    *getOwners({ payload }, { call, put }) {
      const { code, data = {} } = yield call(Api.getOwners, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }

      yield put({
        type: 'saveOwners',
        payload: data,
      });

      return data;
    },
    *addItem({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.addItem, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
    *saveItem({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.saveItem, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
    *delItem({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.delItem, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
    *addAward({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.addAward, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
    *saveAward({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.saveAward, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
    *delAward({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.delAward, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
    *addRenzhi({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.addRenzhi, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
    *saveRenzhi({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.saveRenzhi, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
    *delRenzhi({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.delRenzhi, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
    *addPaper({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.addPaper, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
    *savePaper({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.savePaper, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
    *delPaper({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.delPaper, payload);
      if (code != 0) {
        return 'REQUEST_FAIL_FLAG';
      }
      return data;
    },
  },
};
