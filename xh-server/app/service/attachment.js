'use strict';

const Service = require('egg-fortress').Service;

class AttachmentService extends Service {
  constructor(ctx) {
    super(ctx);
    this.tableName = 'tbl_attachment';
    this.columns = [ 'id', 'applicationId', 'type', 'files', 'extra', 'createdAt' ];
  }

  async exitsById(id) {
    const { app } = this.ctx;

    const result = await app.knex(this.tableName)
      .select('id')
      .first()
      .where({ id, isDeleted: false });

    return !!result;
  }

  async add(records) {
    const { app } = this.ctx;

    const [ lastId ] = await app.knex
      .insert(records)
      .into(this.tableName);

    return lastId;
  }

  async find(query) {
    const { app, helper } = this.ctx;

    const result = await app.knex(this.tableName)
      .select(this.columns)
      .where(helper._.assign({}, query, { isDeleted: false }));

    return result;
  }

  async deleteById(id) {
    const { app } = this.ctx;

    const result = await app.knex(this.tableName)
      .where({ id })
      .update({ isDeleted: true }, 'id');

    return result;
  }

  async addAndRemoveBefore(applicationId, records) {
    const { app } = this.ctx;

    const trx = await app.knex.transaction();

    let lastId;

    try {
      await app.knex(this.tableName)
        .where({ applicationId })
        .del()
        .transacting(trx);

      [ lastId ] = await app.knex
        .insert(records)
        .into(this.tableName)
        .transacting(trx);

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }

    return lastId;
  }
}

module.exports = AttachmentService;
