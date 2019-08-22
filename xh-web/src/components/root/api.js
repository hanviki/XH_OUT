import { post } from '../../utils/request';

export const getUserInfo = (param = {}) => post('/api/user/getCurrentUser', param);

export const logout = (param = {}) => post('/api/user/logout', param);
