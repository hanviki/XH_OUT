import { post } from '../../../utils/request';

export const getDetail = (param = {}) => post('/api/application/getDetail', param);
