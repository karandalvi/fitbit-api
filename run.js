var http = require('http');
var port = 9000;
var url = require('url');
http.createServer(function(req, resp) {

  switch(req.method) {

    case "GET":

      if (req.url === "/home") {
        console.log(req.url);
        resp.writeHead(200, {"Content-Type" : "text/html"});
        resp.write("<html><head><title>Home</title></head><body>Welcome to Home page!</body></html>");
        resp.end();
      }
      else if (req.url.match("/callback*")) {
          console.log(req.url);
          var url_parts = url.parse(req.url, true);
          var query = url_parts.query;
          resp.writeHead(200, {"Content-Type" : "text/html"});
          resp.write("<html><head><title>Home</title></head><body>Callback page!</br>");
          resp.write(req.query.code);
          resp.write("<br>");
          resp.write("</body></html>");
          resp.end();
      }
      break;

    case "POST":
      if (req.url === "/home") {
        console.log(req.url);
        resp.writeHead(200, {"Content-Type" : "text/html"});
        resp.write("<html><head><title>Home</title></head><body>Welcome to Home page!</body></html>");
        resp.end();
      }
      break;

    default:
      console.log(req.url);
      resp.writeHead(200, {"Content-Type" : "text/html"});
      resp.write("<html><head><title>Home</title></head><body>Page not found</body></html>");
      resp.end();
      break;

  }


  // else if (req.url.match("/callback*")) {
  //   console.log(req.url);
  //   resp.writeHead(200, {"Content-Type" : "text/html"});
  //   resp.write("<html><head><title>Home</title></head><body>Callback page!</br>");
  //   resp.write(req.url);
  //   resp.write("</body></html>");
  //   resp.end();
  // }

      // var request = require('request');
      // request.post({
      // headers: {'content-type' : 'application/x-www-form-urlencoded'},
      // url:     'http://localhost/test2.php',
      // body:    "mes=heydude"
      // }, function(error, response, body){
      // console.log(body);
      // });

}).listen(port);
