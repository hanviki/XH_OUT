import { post } from '../../../utils/request';

export const getDetail = (param = {}) => post('/api/application/getDetail', param);

// 通过审核（一级审核）
export const reviewPass = (param = {}) => post('/api/application/reviewPass', param);

// 驳回申请 （驳回到本人）
export const reject = (param = {}) => post('/api/application/reject', param);

// 驳回审核（二级审核不通过一级审核）
export const reviewReject = (param = {}) => post('/api/application/rejectReview', param);

// 通过申请 （通过一级审核，申报完成）
export const pass = (param = {}) => post('/api/application/pass', param);