import { post } from '../../utils/request';

export const getSmsCode = (param = {}) => post('/api/user/getSMSCode', param);

export const login = (param = {}) => post('/api/user/login', param);
