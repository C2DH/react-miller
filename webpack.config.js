const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './example/index.js',
  output: {
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'example/public'),
    },
    client: {
      logging: 'none',
    },
    historyApiFallback: true,
    compress: true,
    port: 9000,
    proxy: {
      '/api': {
        target: process.env.PROXY || 'http://localhost',
        secure: false,
        changeOrigin: true,
      },
      '/media': {
        target: process.env.PROXY || 'http://localhost',
        secure: false,
        changeOrigin: true,
      },
    },
  },
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      'react-miller': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        PROXY: process.env.PROXY || 'http://localhost',
        LANGS: process.env.LANGS || 'en_GB,fr_FR,de_DE,it_IT',
      }),
    }),
  ],
}
