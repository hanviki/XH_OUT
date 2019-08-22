'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware, config } = app;

  const prefix = config.pathPrefix || '';

  // 用户
  router.post(`${prefix}/api/user/getSMSCode`, controller.user.getSMSCode);
  router.post(`${prefix}/api/user/login`, controller.user.login);
  router.post(`${prefix}/api/user/logout`, middleware.loginAuth(), controller.user.logout);
  router.post(`${prefix}/api/user/getCurrentUser`, middleware.loginAuth(), controller.user.getCurrentUser);
  router.post(`${prefix}/api/user/getApplicationList`, middleware.loginAuth(), controller.user.getApplicationList);
  router.post(`${prefix}/api/user/getOwnerList`, middleware.loginAuth(), controller.user.getOwnerList);

  // 申请
  router.post(`${prefix}/api/application/create`, middleware.loginAuth(), controller.application.create);
  router.post(`${prefix}/api/application/save`, middleware.loginAuth(), controller.application.save);
  router.post(`${prefix}/api/application/submit`, middleware.loginAuth(), controller.application.submit);
  router.post(`${prefix}/api/application/getDetail`, middleware.loginAuth(), controller.application.getDetail);
  router.post(`${prefix}/api/application/reject`, middleware.loginAuth(), middleware.reviewApplicationAuth(), controller.application.reject);
  router.post(`${prefix}/api/application/pass`, middleware.loginAuth(), middleware.reviewReviewAuth(), controller.application.pass);
  router.post(`${prefix}/api/application/reviewPass`, middleware.loginAuth(), middleware.reviewApplicationAuth(), controller.application.reviewPass);
  router.post(`${prefix}/api/application/rejectReview`, middleware.loginAuth(), middleware.reviewReviewAuth(), controller.application.rejectReview);
  router.post(`${prefix}/api/application/addAttachment`, middleware.loginAuth(), controller.application.addAttachment);
  router.post(`${prefix}/api/application/delAttachment`, middleware.loginAuth(), controller.application.delAttachment);
  router.get(`${prefix}/api/application/generatePDF`, middleware.loginAuth(), controller.application.generatePDF);
  // router.get(`${prefix}/api/application/generatePDF`, controller.application.generatePDF);

  router.post(`${prefix}/api/application/addItem`, middleware.loginAuth(), controller.application.addItem);
  router.post(`${prefix}/api/application/saveItem`, middleware.loginAuth(), controller.application.saveItem);
  router.post(`${prefix}/api/application/delItem`, middleware.loginAuth(), controller.application.delItem);

  router.post(`${prefix}/api/application/addAward`, middleware.loginAuth(), controller.application.addAward);
  router.post(`${prefix}/api/application/saveAward`, middleware.loginAuth(), controller.application.saveAward);
  router.post(`${prefix}/api/application/delAward`, middleware.loginAuth(), controller.application.delAward);

  router.post(`${prefix}/api/application/addRenzhi`, middleware.loginAuth(), controller.application.addRenzhi);
  router.post(`${prefix}/api/application/saveRenzhi`, middleware.loginAuth(), controller.application.saveRenzhi);
  router.post(`${prefix}/api/application/delRenzhi`, middleware.loginAuth(), controller.application.delRenzhi);

  router.post(`${prefix}/api/application/addPaper`, middleware.loginAuth(), controller.application.addPaper);
  router.post(`${prefix}/api/application/savePaper`, middleware.loginAuth(), controller.application.savePaper);
  router.post(`${prefix}/api/application/delPaper`, middleware.loginAuth(), controller.application.delPaper);

  // 文件
  router.post(`${prefix}/api/file/upload`, controller.file.upload);
  router.get(`${prefix}/api/file/download/:fileId`, middleware.loginAuth(), controller.file.download);
  // router.get(`${prefix}/api/file/download/:fileId`, controller.file.download);

  // 页面
  router.get(`${prefix}/pages/application-detail`, controller.page.renderApplicationDetail);
  router.get(`${prefix}/pages/application-browser`, middleware.loginAuth(), controller.page.renderApplicationBrowser);
  // router.get(`${prefix}/pages/application-browser`, controller.page.renderApplicationBrowser);
  router.redirect(`${prefix}/`, `${prefix}/public/index.html`, 302);
};
