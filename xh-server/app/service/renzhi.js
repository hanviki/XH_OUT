'use strict';

const Service = require('egg-fortress').Service;

class RenzhiService extends Service {
  constructor(ctx) {
    super(ctx);
    this.tableName = 'tbl_renzhi';
    this.columns = [ 'id', 'applicationId', 'name', 'renzhi', 'score' ];
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
      .orderBy(['applicationId']);

    return result;
  }

  async find(query) {
    const { app } = this.ctx;

    const result = await app.knex(this.tableName)
      .select(this.columns)
      .where(query)
      .orderBy('id', 'asc');

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

  async delete(query) {
    const { app } = this.ctx;

    const id = await app.knex(this.tableName)
      .where(query)
      .del();

    return id;
  }
}

module.exports = RenzhiService;
