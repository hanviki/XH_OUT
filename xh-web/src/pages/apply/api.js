import { post } from '../../utils/request';

export const getDetail = (param = {}) => post('/api/application/getDetail', param);

export const updateDetail = (param = {}) => post('/api/application/save', param);

export const getOwners = (param = {}) => post('/api/user/getOwnerList', param);

export const addItem = (param = {}) => post('/api/application/addItem', param);
export const saveItem = (param = {}) => post('/api/application/saveItem', param);
export const delItem = (param = {}) => post('/api/application/delItem', param);

export const addAward = (param = {}) => post('/api/application/addAward', param);
export const saveAward = (param = {}) => post('/api/application/saveAward', param);
export const delAward = (param = {}) => post('/api/application/delAward', param);

export const addRenzhi = (param = {}) => post('/api/application/addRenzhi', param);
export const saveRenzhi = (param = {}) => post('/api/application/saveRenzhi', param);
export const delRenzhi = (param = {}) => post('/api/application/delRenzhi', param);

export const addPaper = (param = {}) => post('/api/application/addPaper', param);
export const savePaper = (param = {}) => post('/api/application/savePaper', param);
export const delPaper = (param = {}) => post('/api/application/delPaper', param);
