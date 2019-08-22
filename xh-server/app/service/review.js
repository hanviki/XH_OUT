'use strict';

const Service = require('egg-fortress').Service;

class ReviewService extends Service {
  constructor(ctx) {
    super(ctx);
    this.tableName = 'tbl_review';
    this.columns = [ 'id', 'applicationId', 'reviewerId', 'reviewerName', 'reviewState', 'reviewAdvice', 'isRejected', 'rejectReason', 'rejectedBy', 'updatedAt', 'reviewTime', 'createdAt', 'stage', 'sfxj', 'sftj', 'ywcyj', 'ywcyj1', 'ywcyj2', 'ywcyj3', 'ywcyj4', 'ywcyj5', 'sfcj', 'pzkssj', 'pzjssj' ];
  }

  async exitsById(id) {
    const { app } = this.ctx;

    const result = await app.knex(this.tableName)
      .select('id')
      .first()
      .where({ id });

    return !!result;
  }

  async findByApplicationIds(ids) {
    const { app } = this.ctx;

    const result = await app.knex(this.tableName)
      .select(this.columns)
      .whereIn('applicationId', ids)
      .orderBy(['applicationId', 'stage']);

    return result;
  }

  async find(query) {
    const { app } = this.ctx;

    const result = await app.knex(this.tableName)
      .select(this.columns)
      .where(query)
      .orderBy('stage', 'asc');

    return result;
  }

  async findOne(query) {
    const { app } = this.ctx;

    const result = await app.knex(this.tableName)
      .select(this.columns)
      .first()
      .where(query);

    return result;
  }

  async add(records) {
    const { app } = this.ctx;

    const [ id ] = await app.knex
      .insert(records, 'id')
      .into(this.tableName);

    return { id };
  }

  async update(query, record) {
    const { app } = this.ctx;

    const id = await app.knex(this.tableName)
      .where(query)
      .update(record, 'id');

    return id;
  }
}

module.exports = ReviewService;
