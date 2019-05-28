/**
 * 配置二级目录和入口文件
 * @type {{context: string, entry: {panel: string[]}}}
 */

const moduleName = 'framework'; // 静态资源目录名称

module.exports = {
  title: 'FrameworkShare',
  context: `/${moduleName}`, // 二级目录
  moduleName,
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'immutable',
      'isomorphic-fetch',
      'fetch-ie8'
    ],
    [`${moduleName}`]: ['./frontPage/pages/index.js']
  },
  html: [{
    filename: `${moduleName}.html`,
    template: './frontPage/template/template.hbs',
    chunks: ['vendor', `${moduleName}`]
  }]
};
