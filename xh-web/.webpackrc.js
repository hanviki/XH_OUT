const fs = require('fs');
const path = require('path');
const lessToJs = require('less-vars-to-js');

const themePath = path.join(__dirname, './src/config/theme/theme.less');
const theme = lessToJs(fs.readFileSync(themePath, 'utf8'));

module.exports = {
  entry: `./src/index.js`,
  outputPath: './dist',
  disableCSSModules: true,
  theme: theme,
  hash: true,
  browserslist: [
    "> 1%",
    "last 2 versions"
  ],
  ignoreMomentLocale: true,
  html: {
    template: "./src/index.ejs"
  },
  extraBabelPlugins:[
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }]
  ],
  env: {
    development: {
      publicPath: `/`,
      extraBabelPlugins: [
        'dva-hmr',
      ],
    },
    production: {
      publicPath: `./`,
      extraBabelPlugins: [
      ],
    }
  },
  proxy: {
    
  }
};
