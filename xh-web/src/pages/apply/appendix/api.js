import { post } from '../../../utils/request';

export const updateAppend = (param = {}) => post('/api/application/addAttachment', param);
