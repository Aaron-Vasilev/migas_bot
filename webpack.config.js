const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  mode: 'production',
  externals: [nodeExternals()],
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'yogabot.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
}

