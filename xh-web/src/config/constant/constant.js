const { protocol, host, pathname,port, search, hash } = window.location;

// 常量
export const CONSTANT_CONFIG = {};

// 域名
export const DOMAIN = '';
// export const DOMAIN = '/simple';
// const host1 = "localhost:7705"
export const HTML_PREVIEW_URL = `${protocol}//${host}${DOMAIN}/pages/application-browser`;

export const PDF_PREVIEW_URL = `${protocol}//${host}${DOMAIN}/api/application/generatePDF`;

export const UPLOAD_API_URL = `${protocol}//${host}${DOMAIN}/api/file/upload`;

export const LABEL = {
    1: '医务管理办公室审核意见',
    2: '科研处审核意见',
    3: '国际交流办公室审核意见'
}


