const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    filename: 'assets/js/bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'source-map',
  devServer: {
    static: './dist',
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            }
          },
          'sass-loader'
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
    minimize: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/style.min.css',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/favicon.ico', to: "favicon.ico" },
        { from: 'src/assets/fonts', to: "assets/fonts" },
        { from: 'src/assets/img', to: "assets/img" },
      ],
    }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      minify: true,
      template: 'src/index.html',
    }),
  ],
};