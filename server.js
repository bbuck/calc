var express = require("express"),
    fs = require("fs"),
    path = require("path"),
    app = express();

app.use("/static", express.static("static"));

app.get("/", function(req, res) {
  res.sendFile("index.html", {root: __dirname});
});

var server = app.listen(3000, function() {
  var host = server.address().address,
      port = server.address().port;

  console.log("Example app listening at http://%s:%s", address, port);
});
