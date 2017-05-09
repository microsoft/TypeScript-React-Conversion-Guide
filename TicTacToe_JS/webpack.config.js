module.exports = {
  entry: './src/app.jsx',
  output: {
    filename: './dist/bundle.js'
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      { test: /\.jsx?$/, use: { loader: 'babel-loader' } }
    ]
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  },
}
