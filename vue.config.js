const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
module.exports = defineConfig({
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'public',
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    // entry: {
    //   app: './src/main.js'
    // },
    // module: {
    //   rules: [
    //     {
    //       test: /\.vue$/,
    //       loader: 'vue-loader'
    //     },
    //     {
    //       test: /\.js$/,
    //       loader: 'babel-loader',
    //       exclude: /node_modules/
    //     },
    //   ]
    // },
    plugins: [
      new NodePolyfillPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "node_modules/cesium/Build/Cesium/Workers",
            to: "cesium/Workers",
          },
          {
            from: "node_modules/cesium/Build/Cesium/ThirdParty",
            to: "cesium/ThirdParty",
          },
          {
            from: "node_modules/cesium/Build/Cesium/Assets",
            to: "cesium/Assets",
          },
          {
            from: "node_modules/cesium/Build/Cesium/Widgets",
            to: "cesium/Widgets",
          },
        ],
      }),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("./cesium"),
      })
    ],
    resolve: {
      fallback: {
        zlib: require.resolve("browserify-zlib"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        stream: require.resolve("stream-browserify"),
      },
    },
  },
});

