const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const PurgeCSSPlugin = require('purgecss-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/app.js',
  output: {
    filename: 'assets/js/bundle.min.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: './dist',
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
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
      new TerserPlugin(),
    ],
    minimize: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/style.min.css',
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(path.resolve(__dirname, 'src') + `/**/*`, { nodir: true }),
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/favicon.ico', to: "favicon.ico" },
        { from: 'src/assets/fonts', to: "assets/fonts" },
        { from: 'src/assets/img', to: "assets/img" },
        { from: 'src/assets/files', to: "assets/files" },
        { from: 'src/github', to: "github" },
        { from: 'src/linkedin', to: "linkedin" },
        { from: 'src/badge-aws', to: "badge-aws" },
        { from: 'src/badge-css', to: "badge-css" },
        { from: 'src/badge-frontend', to: "badge-frontend" },
        { from: 'src/badge-html', to: "badge-html" },
        { from: 'src/badge-linux', to: "badge-linux" },
        { from: 'src/badge-mysql', to: "badge-mysql" },
        { from: 'src/badge-php', to: "badge-php" },
        { from: 'src/badge-wordpress', to: "badge-wordpress" },
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