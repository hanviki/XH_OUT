import { post } from '../../../utils/request';

export const getList = (param = {}) => post('/api/user/getApplicationList', param);
