var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './client/index.js',

  output: {
    filename: 'bundle.js',
    publicPath: './build',
    path: './build'
  },

 plugins: [
    new CopyWebpackPlugin([
        { from: './client/index.html' },
    ])
 ],

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react' },
      { test: /\.css$/, exclude: /node_modules/, loader: 'style-loader!css-loader!' },
      { test: /\.scss$/, exclude: /node_modules/, loader: 'style-loader!css-loader!sass-loader!' }
    ]
  }
}