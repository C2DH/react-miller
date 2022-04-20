const path = require('path')

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
        target: 'https://timestrata.be',
        secure: false,
        changeOrigin: true,
      },
      '/media': {
        target: 'https://timestrata.be',
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
}
