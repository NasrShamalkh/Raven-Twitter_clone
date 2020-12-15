// production config
const merge = require('webpack-merge');
const { resolve } = require('path');

const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: './index.tsx',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, '../../static/client/build/'),
    publicPath: '/'
  },
  // devtool: 'source-map',
  plugins: []
});
