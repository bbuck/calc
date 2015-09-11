var express = require("express"),
    fs = require("fs"),
    path = require("path"),
    app = express();

// callback = (Boolean)
function testPath(fpath, callback) {
  fpath = path.normalize(fpath);
  return fs.stat(fpath, function(err, stats) {
    // If no error, and it's not a directory then the file exists
    callback(!(err || stats.isDirectory()));
  });
}

// callback = (Boolean, FileReader)
function loadFile(prefix, req, callback, checkBower) {
  if (typeof checkBower === "undefined" || checkBower === null) {
    checkBower = true;
  }
  var fpath = path.join(prefix, req.params[0]);
  return testPath(fpath, function(exists) {
    if (exists) {
      callback(true, fs.createReadStream(fpath));
    } else if (checkBower) {
      loadFile("bower_components", req, callback, false);
    } else {
      callback(false);
    }
  });
}

app.get("/js/*", function(req, res, next) {
  return loadFile("js", req, function(success, reader) {
    if (success) {
      reader.pipe(res);
    } else {
      next();
    }
  });
});

app.get("/css/*", function(req, res, next) {
  return loadFile("css", req, function(success, reader) {
    if (success) {
      reader.pipe(res);
    } else {
      next();
    }
  });
});

app.get("/", function(req, res) {
  res.sendFile("index.html", {root: __dirname});
});

var server = app.listen(3000, function() {
  var host = server.address().address,
      port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});
