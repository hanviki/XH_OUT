'use strict';

// had enabled by egg
exports.static = true;

exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};

exports.knex = {
  enable: true,
  package: 'egg-knex',
};

exports.sessionRedis = {
  enable: true,
  package: 'egg-session-redis',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

