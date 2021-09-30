const path = require("path");

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    landing: "./client/landing.js",
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
      template: './client/public/landing.html',
      chunks: ['landing']
    }),
    new HtmlWebpackPlugin({
      filename: 'app/index.html',
      template: './client/public/app.html',
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
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              //disable: true, // webpack@2.x and newer
              //webp: {
              //  quality: 30,
              //}
            },
          },
        ],
      },
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