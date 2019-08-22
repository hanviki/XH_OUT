'use strict';

const assert = require('assert');
const Controller = require('egg-fortress').Controller;
const { APPLICATION_STAGE, APPLICATION_STATE, APPLICATION_LEVEL, REVIEW_STATE, ATTACHMENT_TYPE_MAP, USER_ROLE, APPLICATION_SUBMIT_VALIDATE_ERROR_MAP } = require('../lib/constant');
const path = require('path');
const puppeteer = require('puppeteer');
const pdfmerger = require('pdfmerger');
const fs = require('fs');

class ApplicationController extends Controller {
  async create() {
    const { ctx } = this;
    const { app, service, helper } = ctx;

    const errors = app.validator.validate({
      level: { type: 'enum', values: helper._.values(APPLICATION_LEVEL), required: true, allowEmpty: false },
    }, ctx.request.body);

    if (errors) {
      throw new app.errors.InvalidParam(`${errors[0].field} ${errors[0].message}`);
    }

    const { level } = ctx.request.body;
    const userId = ctx.session.user.id;

    // 检查是否重复申请
    if (await service.application.exitsByQuery(build => {
      build
        .where({ level, applicantId: userId })
        .whereBetween('applyTime', [
          helper.moment().startOf('year').utc()
            .format('YYYY-MM-DD HH:mm:ss'),
          helper.moment().endOf('year').utc()
            .format('YYYY-MM-DD HH:mm:ss'),
        ]);
    })) {
      throw new app.errors.InvalidParam('请勿重复申请');
    }

    const ksfzr = await  service.user.findOne({ jobNum: 'S' + ctx.session.user.ksfzrgh})

    const result = await service.application.addOne({
      level,
      applicantId: ctx.session.user.id,
      applicantJobNum: ctx.session.user.jobNum,
      applicantName: ctx.session.user.name,
      applicantMobile: ctx.session.user.mobile,
      applicantGender: ctx.session.user.gender,
      applicantBirthday: ctx.session.user.birthday,
      applicantProWork: ctx.session.user.proWork,
      applicantHiredate: ctx.session.user.hiredate,
      applyTime: helper.moment().utc().format('YYYY-MM-DD HH:mm:ss'),
      declarationYear: helper.moment().format('YYYY'),
      school: ctx.session.user.school,
      education: ctx.session.user.education,
      deptName: ctx.session.user.deptDesc,
      ksfzr: ksfzr?ksfzr.id:'',
      zyzw: ctx.session.user.proWork,
      xzzw: ctx.session.user.xzzw,
    });

    ctx.success(result);
  }

  async save() {
    const { ctx } = this;
    const { app, service, helper, logger } = ctx;

    // 移除 null 以及 undefined
    ctx.request.body = helper._.omitBy(ctx.request.body, attr => attr === null || attr === undefined);

    const errors = app.validator.validate({
      id: { type: 'int' },
      deptName: { type: 'string', required: false, allowEmpty: true },
      declarationYear: { type: 'string', required: false, allowEmpty: true },
      applyTime: { type: 'dateTime', required: false },
      major: { type: 'string', required: false, allowEmpty: true },
      intro: { type: 'string', required: false, allowEmpty: true },
      // level: { type: 'enum', values: helper._.values(APPLICATION_LEVEL), required: false },
    }, ctx.request.body);

    if (errors) {
      logger.warn('submit validate fail: ', errors);

      if (APPLICATION_SUBMIT_VALIDATE_ERROR_MAP[errors[0].field]) {
        throw new app.errors.InvalidParam(APPLICATION_SUBMIT_VALIDATE_ERROR_MAP[errors[0].field]);
      } else {
        throw new app.errors.InvalidParam('填写的参数有误');
      }
    }

    const { id } = ctx.request.body;

    const application = await service.application.findOne({ id });

    if (!application) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    if (application.applicantId !== ctx.session.user.id) {
      throw new app.errors.Unauthorized('无权限进行此操作');
    }

    if (application.state !== APPLICATION_STATE.UNSUBMIT && application.state !== APPLICATION_STATE.RE_SUBMIT) {
      throw new app.errors.Unauthorized('已经提交，请勿修改');
    }

    await service.application.updateOne({
      id,
    }, helper._.omit(ctx.request.body, 'id'));

    ctx.success(id);
  }

  async submit() {
    const { ctx } = this;
    const { app, service, helper, logger } = ctx;

    const paramErrors = app.validator.validate({
      id: { type: 'int' },
    }, ctx.request.body);

    if (paramErrors) {
      throw new app.errors.InvalidParam(`${paramErrors[0].field} ${paramErrors[0].message}`);
    }

    const { id } = ctx.request.body;

    const application = await service.application.findOne({ id });

    if (!application) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    if (application.applicantId !== ctx.session.user.id) {
      throw new app.errors.Unauthorized('无权限进行此操作');
    }

    if (application.state !== APPLICATION_STATE.UNSUBMIT && application.state !== APPLICATION_STATE.RE_SUBMIT) {
      throw new app.errors.InvalidParam('该申请已经提交, 正在审核');
    }

    // 扩展rule
    app.validator.addRule('rawDateTime', value => value instanceof Date);
    app.validator.addRule('string??', value => {
      if (!value) {
        return true;
      }

      return Object.prototype.toString.call(value) === '[object String]';
    });

    let schema = {
      deptName: { type: 'string' },
      declarationYear: { type: 'string' },
      applyTime: { type: 'rawDateTime' },
      // major: { type: 'string' },
      // intro: { type: 'string' },
    };
    //
    // if (application.level === APPLICATION_LEVEL.LEVEL1) {
    //   schema = helper._.assign({}, schema, {
    //     isNationalTechnologyPrizeWinner: { type: 'enum', values: [ 0, 1 ] },
    //     ishousandPlanFinalists: { type: 'enum', values: [ 0, 1 ] },
    //     isChangjiangxuezheProfessorLevel1: { type: 'enum', values: [ 0, 1 ] },
    //     isOutstandingYouthFundWinnerLevel1: { type: 'enum', values: [ 0, 1 ] },
    //     isChineseMedicalAssociationLeader: { type: 'enum', values: [ 0, 1 ] },
    //     isNationalTectPlanProjectLeader: { type: 'enum', values: [ 0, 1 ] },
    //     isNationalTectPlanSubjectLeader: { type: 'enum', values: [ 0, 1 ] },
    //     isNationalFundMainProjectLeader: { type: 'enum', values: [ 0, 1 ] },
    //     isInnovationGroupLeader: { type: 'enum', values: [ 0, 1 ] },
    //     willReportingAcademician: { type: 'enum', values: [ 0, 1 ], required: false },
    //     notReportingAcademicianReason: { type: 'string??' },
    //     other3YeasAimsLevel1: { type: 'string??' },
    //     willBecomeAcademicianCandidate: { type: 'enum', values: [ 0, 1 ], required: false },
    //     notBecomeAcademicianCandidateReason: { type: 'string??' },
    //     other5YeasAimsLevel1: { type: 'string??' },
    //   });
    // }
    //
    // if (application.level === APPLICATION_LEVEL.LEVEL2) {
    //   schema = helper._.assign({}, schema, {
    //     isChangjiangxuezheProfessorLevel2: { type: 'enum', values: [ 0, 1 ] },
    //     isOutstandingYouthFundWinnerLevel2: { type: 'enum', values: [ 0, 1 ] },
    //     willPublishIF10PapperAnd200Funding: { type: 'enum', values: [ 0, 1 ], required: false },
    //     notPublishIF10PapperAnd200FundingReason: { type: 'string??' },
    //     other3YeasAimsLevel2: { type: 'string??' },
    //     willPublishIF20PapperAnd500Funding: { type: 'enum', values: [ 0, 1 ], required: false },
    //     notPublishIF20PapperAnd500FundingReason: { type: 'string??' },
    //     other5YeasAimsLevel2: { type: 'string??' },
    //   });
    // }
    //
    // if (application.level === APPLICATION_LEVEL.LEVEL3) {
    //   schema = helper._.assign({}, schema, {
    //     isThousandPlanProjectOwner: { type: 'enum', values: [ 0, 1 ] },
    //     isChangjiangxuezheProjectOwner: { type: 'enum', values: [ 0, 1 ] },
    //     isThousandPlanTalent: { type: 'enum', values: [ 0, 1 ] },
    //     isNationalExcellentYouthFundWinner: { type: 'enum', values: [ 0, 1 ] },
    //     willPublishIF10Papper: { type: 'enum', values: [ 0, 1 ], required: false },
    //     notPublishIF10PapperReason: { type: 'string??' },
    //     other3YeasAimsLevel3: { type: 'string??' },
    //     willBecomeOutstandingYouth: { type: 'enum', values: [ 0, 1 ], required: false },
    //     notBecomeOutstandingYouthReason: { type: 'string??' },
    //     other5YeasAimsLevel3: { type: 'string??' },
    //   });
    // }

    const validateErrors = app.validator.validate(schema, application);

    if (validateErrors) {
      logger.warn('submit validate fail: ', validateErrors);

      if (APPLICATION_SUBMIT_VALIDATE_ERROR_MAP[validateErrors[0].field]) {
        throw new app.errors.InvalidParam(APPLICATION_SUBMIT_VALIDATE_ERROR_MAP[validateErrors[0].field]);
      } else {
        throw new app.errors.InvalidParam('填写的参数有误');
      }
    }

    // 提交
    await service.application.submit(id, application.state);

    ctx.success(id);
  }

  async getDetail() {
    const { ctx } = this;
    const { app, service, helper } = ctx;

    const errors = app.validator.validate({
      id: { type: 'int' },
    }, ctx.request.body);

    if (errors) {
      throw new app.errors.InvalidParam(`${errors[0].field} ${errors[0].message}`);
    }

    const { id } = ctx.request.body;
    const application = await service.application.findOne({ id });

    if (!application) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    // if (application.applicant !== ctx.session.user.id) {
    //   throw new app.errors.Unauthorized('无权限进行此操作');
    // }

    const [ reviews, attachments, items, awards, renzhis, papers ] = await Promise.all([
      service.review.find({ applicationId: id }),
      service.attachment.find({ applicationId: id }),
      service.item.find({ applicationId: id }),
      service.award.find({ applicationId: id }),
      service.renzhi.find({ applicationId: id }),
      service.paper.find({ applicationId: id }),
    ]);

    helper._.forEach(attachments || [], record => {
      record.type = helper._.invert(ATTACHMENT_TYPE_MAP)[record.type];
      record.files = JSON.parse(record.files);
      record.extra = JSON.parse(record.extra);
    });

    const owners = await service.user.findOwners();

    application.owners = owners;
    application.reviews = reviews;
    application.attachments = attachments;
    application.items = items;
    application.awards = awards;
    application.renzhis = renzhis;
    application.papers = papers;

    ctx.success(application);
  }

  async reject() {
    const { ctx } = this;
    const { app, service } = ctx;

    const errors = app.validator.validate({
      id: { type: 'int' },
      reason: { type: 'string' },
    }, ctx.request.body);

    if (errors) {
      throw new app.errors.InvalidParam(`${errors[0].field} ${errors[0].message}`);
    }

    const { id, reason } = ctx.request.body;
    const user = this.ctx.session.user;

    if (!await service.application.exitsById(id)) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    if (USER_ROLE.REVIEWER.indexOf(user.role) > -1) {
      await service.application.rejectByReviewer(id, user.id, user.name, reason);
    }

    if (user.role === USER_ROLE.DECIDER) {
      await service.application.rejectByDecider(id, user.name, reason);
    }

    ctx.success(id);
  }

  async pass() {
    const { ctx } = this;
    const { app, service, helper } = ctx;

    const errors = app.validator.validate({
      id: { type: 'int' },
      advice: { type: 'string', required: false, allowEmpty: true },
    }, ctx.request.body);

    if (errors) {
      throw new app.errors.InvalidParam(`${errors[0].field} ${errors[0].message}`);
    }

    const { id, advice } = ctx.request.body;

    if (!await service.application.exitsById(id)) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    const [ reviewers, reviews ] = await Promise.all([
      service.user.findReviewers(),
      service.review.find({
        applicationId: id,
        reviewState: REVIEW_STATE.PASSED,
        isRejected: false,
      }),
    ]);

    try {
      assert.deepEqual(helper._.map(reviewers || [], 'id'), helper._.map(reviews || [], 'reviewerId'));
    } catch (error) {
      throw new app.errors.Unauthorized('所有审核人员尚未审核通过');
    }

    const userName = ctx.session.user.name;
    const update = { state: APPLICATION_STATE.PASSED, stage: APPLICATION_STAGE.STAGE_5 };

    if (advice) {
      update.groupAdvice = advice;
      update.groupName = userName;
    }

    await service.application.updateOne({ id }, update);

    ctx.success(id);
  }

  async reviewPass() {
    const { ctx } = this;
    const { app, service } = ctx;

    const errors = app.validator.validate({
      id: { type: 'int' },
      advice: { type: 'string' },
    }, ctx.request.body);

    if (errors) {
      throw new app.errors.InvalidParam(`${errors[0].field} ${errors[0].message}`);
    }

    const { id, advice, values } = ctx.request.body;
    const userId = ctx.session.user.id;

    if (!await service.application.exitsById(id)) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    await service.application.reviewPass(id, userId, advice, values);

    ctx.success(id);
  }

  async rejectReview() {
    const { ctx } = this;
    const { app, service } = ctx;

    const errors = app.validator.validate({
      id: { type: 'int' },
      reason: { type: 'string' },
    }, ctx.request.body);

    if (errors) {
      throw new app.errors.InvalidParam(`${errors[0].field} ${errors[0].message}`);
    }

    const { id, reason } = ctx.request.body;
    const userName = ctx.session.user.name;

    const review = await service.review.findOne({ id });

    if (!review) {
      throw new app.errors.InvalidParam('该审核不存在');
    }

    await service.application.rejectReview(id, review.reviewerId, review.applicationId, userName, reason);

    ctx.success(id);
  }

  async addAttachment() {
    const { ctx } = this;
    const { app, service, helper } = ctx;

    const errors = app.validator.validate({
      id: { type: 'int' },
      attachments: { type: 'array', itemType: 'object', rule: {
        type: { type: 'enum', values: helper._.keys(ATTACHMENT_TYPE_MAP) },
        files: { type: 'array', itemType: 'object' },
        extra: { type: 'array', itemType: 'object', required: false },
      } },
    }, ctx.request.body);

    if (errors) {
      throw new app.errors.InvalidParam(`${errors[0].field} ${errors[0].message}`);
    }

    const { id, attachments } = ctx.request.body;

    if (!await service.application.exitsById(id)) {
      throw new app.errors.InvalidParam('该审核不存在');
    }

    const records = [];

    helper._.forEach(attachments, attachment => {
      records.push({
        applicationId: id,
        type: ATTACHMENT_TYPE_MAP[attachment.type],
        files: JSON.stringify(attachment.files || []),
        extra: JSON.stringify(attachment.extra || []),
      });
    });

    // await service.attachment.add(records);
    await service.attachment.addAndRemoveBefore(id, records);

    ctx.success();
  }

  async delAttachment() {
    const { ctx } = this;
    const { app, service } = ctx;

    const errors = app.validator.validate({
      id: { type: 'int' },
    }, ctx.request.body);

    if (errors) {
      throw new app.errors.InvalidParam(`${errors[0].field} ${errors[0].message}`);
    }

    const { id } = ctx.request.body;

    if (!await service.attachment.exitsById(id)) {
      throw new app.errors.InvalidParam('该附件不存在');
    }

    await service.attachment.deleteById(id);

    ctx.success();
  }

  async generatePDF() {
    const { ctx, config } = this;
    const { app, service, helper, logger } = ctx;

    const errors = app.validator.validate({
      id: { type: 'string', format: /\d+/ },
    }, ctx.query);

    if (errors) {
      throw new app.errors.InvalidParam(`${errors[0].field} ${errors[0].message}`);
    }

    const { id } = ctx.query;
    const application = await service.application.findOne({ id });

    if (!application) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    const mainFilePath = path.resolve(app.baseDir, `./files/${id}.pdf`);

    const option = {};

    if (app.env !== 'local') {
      option.executablePath = 'C:\\tools\\chromium\\chrome-win\\chrome.exe';
      option.args = [ '--no-sandbox', '--headless' ];
    }
    option.executablePath = 'C:\\tools\\chromium\\chrome-win\\chrome.exe';
    const browser = await puppeteer.launch(option);
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:7705${config.pathPrefix || ''}/pages/application-detail?id=${id}&token=${config.pageVisitToken}`, { waitUntil: 'networkidle2' });

    await page.pdf({
      path: mainFilePath,
      format: 'A4',
    });

    await browser.close();

    const attachments = await service.attachment.find({ applicationId: id });
    const attachmentTypeMap = {};
    const _ATTACHMENT_TYPE_MAP = helper._.invert(ATTACHMENT_TYPE_MAP);

    helper._.forEach(attachments || [], record => {
      if (!attachmentTypeMap[_ATTACHMENT_TYPE_MAP[record.type]]) {
        attachmentTypeMap[_ATTACHMENT_TYPE_MAP[record.type]] = helper._.map(JSON.parse(record.files), file => {
          return path.resolve(app.baseDir, `./files/${file.url}.pdf`);
        });
      } else {
        attachmentTypeMap[_ATTACHMENT_TYPE_MAP[record.type]] = attachmentTypeMap[_ATTACHMENT_TYPE_MAP[record.type]].concat(helper._.map(JSON.parse(record.files), file => {
          return path.resolve(app.baseDir, `./files/${file.url}.pdf`);
        }));
      }
    });

    const attachmentPDFs = [ mainFilePath ]
      .concat(
        attachmentTypeMap.idcard || [],
        attachmentTypeMap.acd || [],
        attachmentTypeMap.personnel || [],
        attachmentTypeMap.scientific || [],
        attachmentTypeMap.learn || [],
        attachmentTypeMap.article || [],
        attachmentTypeMap.others || []
      );

    let pdfStream;
    if (attachmentPDFs.length < 2) {
      pdfStream = fs.createReadStream(mainFilePath);
    } else {
      logger.info('merge pdfs: ', attachmentPDFs);
      pdfStream = pdfmerger(attachmentPDFs);
    }

    // const filename = encodeURIComponent(`${application.applicantName}-申请认定表.pdf`);
    // ctx.set('Content-Disposition', `attachment; filename="${filename}";filename*=utf-8''${filename}`);
    ctx.type = 'application/pdf';
    ctx.body = pdfStream;
  }

  async addItem(){
    const { ctx } = this;
    const { app, service } = ctx;

    const { item } = ctx.request.body;

    if (!await service.application.exitsById(item.applicationId)) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    await service.item.add(item);

    ctx.success();
  }

  async saveItem(){
    const { ctx } = this;
    const { app, service } = ctx;

    const { item } = ctx.request.body;

    if (!await service.application.exitsById(item.applicationId)) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    await service.item.update({ id: item.id }, item);

    ctx.success();
  }

  async delItem() {
    const { ctx } = this;
    const { app, service } = ctx;

    const { item } = ctx.request.body;

    if (!await service.application.exitsById(item.applicationId)) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    await service.item.delete({ id: item.id });

    ctx.success();
  }

  async addAward(){
    const { ctx } = this;
    const { app, service } = ctx;

    const { item } = ctx.request.body;

    if (!await service.application.exitsById(item.applicationId)) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    await service.award.add(item);

    ctx.success();
  }

  async saveAward(){
    const { ctx } = this;
    const { app, service } = ctx;

    const { item } = ctx.request.body;

    if (!await service.application.exitsById(item.applicationId)) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    await service.award.update({ id: item.id }, item);

    ctx.success();
  }

  async delAward() {
    const { ctx } = this;
    const { app, service } = ctx;

    const { item } = ctx.request.body;

    if (!await service.application.exitsById(item.applicationId)) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    await service.award.delete({ id: item.id });

    ctx.success();
  }

  async addRenzhi(){
    const { ctx } = this;
    const { app, service } = ctx;

    const { item } = ctx.request.body;

    if (!await service.application.exitsById(item.applicationId)) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    await service.renzhi.add(item);

    ctx.success();
  }

  async saveRenzhi(){
    const { ctx } = this;
    const { app, service } = ctx;

    const { item } = ctx.request.body;

    if (!await service.application.exitsById(item.applicationId)) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    await service.renzhi.update({ id: item.id }, item);

    ctx.success();
  }

  async delRenzhi() {
    const { ctx } = this;
    const { app, service } = ctx;

    const { item } = ctx.request.body;

    if (!await service.application.exitsById(item.applicationId)) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    await service.renzhi.delete({ id: item.id });

    ctx.success();
  }

  async addPaper(){
    const { ctx } = this;
    const { app, service } = ctx;

    const { item } = ctx.request.body;

    if (!await service.application.exitsById(item.applicationId)) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    await service.paper.add(item);

    ctx.success();
  }

  async savePaper(){
    const { ctx } = this;
    const { app, service } = ctx;

    const { item } = ctx.request.body;

    if (!await service.application.exitsById(item.applicationId)) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    await service.paper.update({ id: item.id }, item);

    ctx.success();
  }

  async delPaper() {
    const { ctx } = this;
    const { app, service } = ctx;

    const { item } = ctx.request.body;

    if (!await service.application.exitsById(item.applicationId)) {
      throw new app.errors.InvalidParam('该申请不存在');
    }

    await service.paper.delete({ id: item.id });

    ctx.success();
  }
}

module.exports = ApplicationController;
