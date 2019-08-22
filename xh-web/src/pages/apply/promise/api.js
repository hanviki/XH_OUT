import { post } from '../../../utils/request';

export const submitApply = (param = {}) => post('/api/application/submit', param);
