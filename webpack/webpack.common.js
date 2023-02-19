const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const dotenv = require('dotenv')
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

dotenv.config()

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
    extensions: ['.js', '.ts', '.css', 'scss'],
  },
  entry: `${path.resolve(__dirname, '../src')}/index.ts`,
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${path.resolve(__dirname, '../public')}/index.html`,
    }),

    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    // new BundleAnalyzerPlugin(),
  ],
}
