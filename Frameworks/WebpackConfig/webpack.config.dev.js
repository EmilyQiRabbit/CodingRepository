const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const appPath = path.resolve(__dirname, '');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const loadConfig = (options) => {

  // 定义根目录上下文，因为有的项目是用二级路径区分的
  const context = options.context;
  const entry = options.entry;
  delete entry.vendor;
  const html = options.html;
  const moduleName = options.moduleName;
  const htmlArr = html.map( ( item, i ) => {
    return new HtmlWebpackPlugin({
      filename: item.filename,
      template: item.template,
      chunks: item.chunks,
      isDev: true
    })
  } )
  const plugins = [
    new webpack.HotModuleReplacementPlugin(), // 热部署替换模块
    new webpack.NoEmitOnErrorsPlugin(),
  ].concat( htmlArr )

  // The core Config Object
  const webpackConfig = {
    devtool: 'eval-source-map', // 生成 source map 文件
    target: 'web', // webpack 能够为多种环境构建编译, 默认是 'web'，可省略。
    resolve: {
      // 自动解析确定的扩展。能够使用户在引入模块时不带扩展：import File from '../path/to/file'
      extensions: ['.js', '.less', '.png', '.jpg', '.gif'],
      // 告诉 webpack 解析模块时应该搜索的目录。
      modules: [
        'frontPage',
        'node_modules',
      ],
    },

    // 入口文件 让webpack用哪个文件作为项目的入口
    entry,

    // 出口 让webpack把处理完成的文件放在哪里
    output: {
      // 编译输出目录, 不能省略
      path: path.resolve(appPath, 'public'), // 打包输出目录（必选项）
      filename: '[name].bundle.js', // 文件名称
      //资源上下文路径，可以设置为 cdn 路径，比如 publicPath: 'http://cdn.example.com/assets/[hash]/'
      publicPath: `${context}/`,
    },
    devServer: {
      inline: true,
      compress: true,
      contentBase: path.resolve(appPath, 'public'),
      hot: true,
      port: 9999,
      publicPath: `${context}/`,
      disableHostCheck: true, // To Resolve the problem that: if changed the host config, visited page shows 'Invalid Host Header'
      historyApiFallback: {
        rewrites: [
          //多页面，则可以设置二级目录来区分
          { from: /^.*$/, to: `${context}/${moduleName}.html` }
        ]
      },
      proxy: {
        '/query': {
          target: 'http://yuqi.bkjk-inc.com:8888',
          auth: false,
          changeOrigin: true
        },
        '/upload': {
          target: 'http://yuqi.bkjk-inc.com:8888',
          auth: false,
          changeOrigin: true
        }
      }
    },
    module: {
      rules: [
        // {
        //   enforce: 'pre',
        //   test: /\.js$/,
        //   exclude: /node_modules/,
        //   use: 'eslint-loader'
        // },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        // https://github.com/webpack/url-loader
        {
          test: /\.(png|jpg|gif)$/,
          use: {
            loader: 'url-loader',
            options: {
              name: '[hash].[ext]',
              limit: 100000, // 100kb
            }
          }
        },
        {
          test: /\.(mp4|ogg|eot|woff|ttf|svg)$/,
          use: 'file-loader',
        },
        {
          test: /\.css/,
          use: ['style-loader', {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          }, {
            loader: 'postcss-loader',
            options: {
              pack: 'cleaner',
              sourceMap: true,
            }
          }],
        },
        {
          test: /\.less/,
          use: ['style-loader', {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          }, {
            loader: 'postcss-loader',
            options: {
              pack: 'cleaner',
              sourceMap: true,
            }
          }, {
            loader: 'less-loader',
            options: {
              outputStyle: 'expanded',
            }
          }],
        }
      ]
    },
    plugins
  };
  
  webpackConfig.plugins.push(
    new webpack.DllReferencePlugin({
      context: __dirname,
      // 引入 manifest 文件
      manifest: require('./public/cached/vendor-manifest.json')
    })
  );
  return webpackConfig;
}

module.exports = loadConfig;
