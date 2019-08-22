import { post } from '../../../utils/request';

export const createApply = (param = {}) => post('/api/application/create', param);
