'use strict';

const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const mkdirp = require('mkdirp');
const { promisify } = require('util');
const Controller = require('egg-fortress').Controller;

class FileController extends Controller {
  async mkdir(dir) {
    return await promisify(mkdirp)(dir);
  }

  async upload() {
    const ctx = this.ctx;
    const { app } = ctx;

    const stream = await ctx.getFileStream();
    // const ext = path.extname(stream.filename).slice(1);

    const fileId = uuidv4();
    const dir = path.resolve(app.baseDir, './files');
    const filename = path.resolve(dir, `./${fileId}.pdf`);

    await this.mkdir(dir);

    const ws = fs.createWriteStream(filename);

    await (() => {
      return new Promise((resolve, reject) => {
        stream.pipe(ws);

        ws.on('close', () => {
          resolve();
        });

        ws.on('error', err => {
          reject(err);
        });
      });
    })();

    ctx.success(fileId);
  }

  async download() {
    const ctx = this.ctx;
    const { app } = ctx;
    const fileId = ctx.params.fileId;
    const filePath = path.resolve(app.baseDir, `./files/${fileId}.pdf`);

    const isExists = await promisify(fs.exists)(filePath);

    if (!isExists) {
      throw new app.errors.InvalidParam('该文件不存在');
    }

    const stream = fs.createReadStream(filePath);

    ctx.type = 'application/pdf';
    ctx.body = stream;
  }
}

module.exports = FileController;
