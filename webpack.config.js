const path = require("path");

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    landing: "./client/index.js",
    app: "./client/app.js",
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'scripts/[name].bundle.js',
  },
  mode: process.env.NODE_ENV || "production",
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './client/public/index.html',
      chunks: ['landing']
    }),
    new HtmlWebpackPlugin({
      filename: 'app/index.html',
      template: './client/public/index.html',
      chunks: ['app']
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      }
    ]
  },
  devServer: {
    publicPath: '/',
    proxy: {
      '/login': { target: 'https://localhost:3000', secure: false },
      '/api': { target: 'https://localhost:3000', secure: false },
    },
    hot: true,
  }
};