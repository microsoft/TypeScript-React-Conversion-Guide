module.exports = {
  // change to .tsx if necessary
  entry: './src/app.tsx',
  output: {
    filename: './dist/bundle.js'
  },
  resolve: {
    // changed from extensions: [".js", ".jsx"]
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      // changed from { test: /\.jsx?$/, exclude: /node_modules/, use: { loader: 'babel-loader' } },
      { test: /\.(t|j)sx?$/, exclude: /node_modules/, use: { loader: 'awesome-typescript-loader' } },
      // newline - add source-map support 
      { enforce: "pre", test: /\.js$/, exclude: /node_modules/, loader: "source-map-loader" }
    ]
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  },
  // newline - add source-map support
  devtool: "source-map"
}
