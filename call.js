
function getSteps(token, resp) {

  var auth = 'Bearer ' + token;
  var options = {
      host: 'api.fitbit.com',
      //port: '80',
      // path: '/1/user/-/activities/steps/date/today/7d.json',

      path: '/1/user/-/profile.json',
      method: 'GET',
      headers: {
          'Authorization': auth
      }
  };

  // Set up the request
  var https = require('https');
  var get_req = https.request(options, function(res) {
      res.setEncoding('utf8');
      var data = [];
      var kar = "";
      res.on('data', function (chunk) {
        data.push(chunk);
        kar = kar + chunk;
      });
      res.on('end', function (chunk) {
        var str = JSON.parse(data.join(''));
        console.log(str);
        console.log("--------------------------------------------------");
        console.log(kar);

        resp.writeHead(200, {"Content-Type" : "text/html"});
        resp.write("<html><head><title>Fitbit Report</title></head><body><font face=Tahoma>");
        resp.write("Full Name: ");
        resp.write(str['user']['fullName']);
        resp.write("<br><br><a href=http://localhost:9000/home>Home</a>");
        //resp.write(str);
        // var obj;
        // for (var i=0; i< str['activities-steps'].length; i++)
        // {
        //   obj = str['activities-steps'][i];
        //   var c = 1;
        //   for (var key in obj) {
        //     resp.write(obj[key]);
        //     if (c%2==0)
        //       resp.write("<br>");
        //     else
        //       resp.write(" : ");
        //     c++;
        //   }
        // }
        resp.write("</font></body></html>");
        resp.end();
      }
    );
  });
  get_req.end();
}

function getToken(codestring, resp) {

  var querystring = require('querystring');
  // Build the post string from an object
  var post_data = querystring.stringify({
      'redirect_uri' : 'http://localhost:9000/callback',
      'client_id': '2288GF',
      'grant_type': 'authorization_code',
        'code' : codestring
  });

  // An object of options to indicate where to post to
  var post_options = {
      host: 'api.fitbit.com',
      //port: '80',
      path: '/oauth2/token',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic MjI4OEdGOjkxNmM3ZDVmZTFhN2E5ZjBlMTE1NzVmY2RjMDVlZDg0'
      }
  };

  // Set up the request
  var https = require('https');
  var post_req = https.request(post_options, function(res) {
    res.setEncoding('utf8');
    var str = "";
    var data = [];
    res.on('data', function (chunk) {
      data.push(chunk);
    });
    res.on('end', function (chunk) {
      var str = JSON.parse(data.join(''));
      getSteps(str.access_token, resp);
    });
  });

  post_req.write(post_data);
  post_req.end();
}

var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/callback', function(req, resp){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var code = req.query.code;
  getToken(code, resp);
});

app.get('/home',function(req, resp){
  resp.writeHead(200, {"Content-Type" : "text/html"});
  resp.write("<html><head><title>Home</title></head><body>Home page!</br>");
  resp.write("<a href=https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=2288GF&scope=heartrate%20sleep%20profile%20weight%20activity&redirect_uri=http://localhost:9000/callback>Get Daily Steps</a>");
  resp.write("<br>");
  resp.write("</body></html>");
  resp.end();
});

app.listen(9000);
console.log("Server running on 9000 port");
