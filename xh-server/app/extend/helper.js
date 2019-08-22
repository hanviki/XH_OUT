'use strict';

module.exports = {
  // buildSelectColumns([{ table: 'tbl_share', attrs: [ 'id', 'name'] }])
  buildSelectColumns(entities) {
    if (!entities || !entities.length) {
      return '*';
    }

    let columns = [];

    this._.each(entities, entity => {
      columns = columns.concat(this._.map(entity.attrs, attr => `${entity.table}.${attr}`));
    });

    return columns;
  },

  generateRandomCode() {
    return Math.floor(Math.random() * 9000) + 1000;
  },
};
