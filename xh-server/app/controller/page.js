'use strict';

const Controller = require('egg-fortress').Controller;
const { ATTACHMENT_TYPE_MAP, DECIDERS_MAP, DECIDERS_ORDER } = require('../lib/constant');
const browers = {
  1: 'application-browser_1',
  2: 'application-browser_2',
  3: 'application-browser_3',
}

const details = {
  1: 'application-detail_1',
  2: 'application-detail_2',
  3: 'application-detail_3',
}


class PageController extends Controller {
  async renderApplicationDetail() {
    const { ctx, config } = this;
    const { app, service, helper } = ctx;

    const errors = app.validator.validate({
      id: { type: 'string', format: /\d+/ },
      token: { type: 'string' },
    }, ctx.query);

    if (errors) {
      console.error('render application detail page error', errors);
      ctx.status = 404;
      ctx.body = 'not found';
      return;
    }

    const { id, token } = ctx.query;

    if (token !== config.pageVisitToken) {
      ctx.status = 404;
      ctx.body = 'not found';
      return;
    }

    const application = await service.application.findOne({ id });

    if (!application) {
      ctx.status = 404;
      ctx.body = 'not found';
      return;
    }

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

    application.reviews = reviews;
    application.attachments = attachments;
    application.items = items;
    application.awards = awards;
    application.renzhis = renzhis;
    application.papers = papers;

    application.bysj = application.bysj && helper.moment(application.bysj, 'YYYY-MM-DD').format('YYYY年 MM月 DD日') ||''
    application.reviews.forEach(it => {
      it.reviewTime = helper.moment(it.reviewTime).format('YYYY年 MM月 DD日')
    })

    let score = 0
    score = application.items.reduce((acc, cur)=>{
      return acc + cur.score
    }, score)

    score = application.awards.reduce((acc, cur)=>{
      return acc + cur.score
    }, score)

    score = application.renzhis.reduce((acc, cur)=>{
      return acc + cur.score
    }, score)

    score = application.papers.reduce((acc, cur)=>{
      return acc + cur.score
    }, score)

    application.total_score = score

    application.DECIDERS_MAP = DECIDERS_MAP;
    application.DECIDERS_ORDER = DECIDERS_ORDER[application.level];
    application._ = helper._;

    await ctx.render2(`${details[application.level]}.ejs`, application);
  }

  async renderApplicationBrowser() {
    const { ctx } = this;
    const { app, service, helper, logger } = ctx;

    const errors = app.validator.validate({
      id: { type: 'string', format: /\d+/ },
    }, ctx.query);

    if (errors) {
      console.error('render application detail page error', errors);
      ctx.status = 404;
      ctx.body = 'not found';
      return;
    }

    const { id } = ctx.query;

    const application = await service.application.findOne({ id });

    if (!application) {
      ctx.status = 404;
      ctx.body = 'not found';
      return;
    }

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

    application.reviews = reviews;
    application.attachments = attachments;
    application.items = items;
    application.awards = awards;
    application.renzhis = renzhis;
    application.papers = papers;

    application.bysj = helper.moment(application.bysj, 'YYYY-MM-DD').format('YYYY年 MM月 DD日')
    application.reviews.forEach(it => {
      it.reviewTime = helper.moment(it.reviewTime).format('YYYY年 MM月 DD日')
    })

    let score = 0
    score = application.items.reduce((acc, cur)=>{
      return acc + cur.score
    }, score)

    score = application.awards.reduce((acc, cur)=>{
      return acc + cur.score
    }, score)

    score = application.renzhis.reduce((acc, cur)=>{
      return acc + cur.score
    }, score)

    score = application.papers.reduce((acc, cur)=>{
      return acc + cur.score
    }, score)

    application.total_score = score

    application.DECIDERS_MAP = DECIDERS_MAP;
    application.DECIDERS_ORDER = DECIDERS_ORDER[application.level];
    application._ = helper._;

    await ctx.render2(`${browers[application.level]}.ejs`, application);
  }
}

module.exports = PageController;
