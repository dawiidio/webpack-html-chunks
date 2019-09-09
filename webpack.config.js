const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { readdirSync } = require('fs');

const moduleFiles = readdirSync('./pages');

const generatePluginsConfigForModules = () => moduleFiles.map(fileName => {
  const [moduleName] = fileName.split('.');

  return new HtmlWebpackPlugin({
    filename: `${moduleName}.html`,
    template: 'module-template.ejs',
    chunks: [moduleName],
    templateParameters: {
      title: moduleName
    }
  })
});

const generateEntriesConfigForModules = () => moduleFiles.reduce((acc, fileName) => {
  const [moduleName] = fileName.split('.');

  return {
    ...acc,
    [moduleName]: path.resolve('pages', fileName)
  };
}, {});

const IS_PROD = process.env.NODE_ENV === 'production';

const config = {
  context: path.resolve(__dirname),
  entry: {
    ...generateEntriesConfigForModules()
  },
  mode: IS_PROD ? 'production': 'development',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].bundle_[chunkhash].js',
  },
  optimization: {
    minimize: true
  },
  module: {
    rules: [
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
      }
    }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['public']),
    ...generatePluginsConfigForModules()
  ]
};

module.exports = config;