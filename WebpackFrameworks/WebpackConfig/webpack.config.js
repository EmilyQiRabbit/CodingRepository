// webpack 配置文件
// 诶这个文件的图标要不要那么萌～
let realFileName = './webpack.config.prod';

// 检测是否定义了环境变量,没有定义,使用默认的 development
if (process.env.NODE_ENV === undefined) {
  process.env.NODE_ENV = 'development';
}
if (process.env.NODE_ENV === 'development') {
  realFileName = './webpack.config.dev';
}

console.log(`process.env.NODE_ENV=${process.env.NODE_ENV}.`);

const options = require('./Config');

const config = require(realFileName)(options);
module.exports = config;
