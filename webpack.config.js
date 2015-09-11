var path = require("path");

module.exports = {
  entry: "./src/entry.js",
  output: {
    path: path.join(__dirname, "static"),
    filename: "app.js"
  },
  resolve: {
    alias: {
      react: path.join(__dirname, "bower_components", "react", "react.js")
    }
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: "style!css"},
      {test: /\.jsx$/, loader: "babel"}
    ]
  }
};
