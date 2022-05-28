const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  devServer: {
    static: './dist',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            }
          },
        ],
      },
      /*
      {
        test: /\.woff2$/i,
        loader: 'url-loader',
        options: {
          name: 'assets/fonts/[name].[ext]'
        }
      },
      */
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
      filename: 'style.css'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/favicon.ico', to: "favicon.ico" },
        { from: 'src/assets', to: "assets" },
      ],
    }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: 'src/index.html',
      minify: true,
      links: [
        'style.css',
      ],
      scripts: [
        'index.js',
      ],
    }),
  ],
};