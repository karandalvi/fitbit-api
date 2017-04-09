
function getSteps(token, resp) {
https://api.fitbit.com/1/user/[user-id]/activities/heart/date/[date]/[period].json
  // An object of options to indicate where to post to
  var auth = 'Bearer ' + token;
  //console.log(auth);
  var options = {
      host: 'api.fitbit.com',
      //port: '80',
      path: '/1/user/-/activities/steps/date/today/7d.json',
      method: 'GET',
      headers: {
          'Authorization': auth
          //'Content-Type': 'application/x-www-form-urlencoded',
      }
  };

  var https = require('https');
  // Set up the request
  var get_req = https.request(options, function(res) {
      res.setEncoding('utf8');
      //var str = "";
      var data = [];
      res.on('data', function (chunk) {
        data.push(chunk);
      });
      res.on('end', function (chunk) {
          var str = JSON.parse(data.join(''));
          //console.log(str['activities-steps'][2]['value']);
          resp.writeHead(200, {"Content-Type" : "text/html"});
          resp.write("<html><head><title>Home</title></head><body><h4>");
          resp.write("Daily Steps<br><br>");
          var obj;
          for (var i=0; i< str['activities-steps'].length; i++)
          {
            obj = str['activities-steps'][i];
            var c = 1;
            for (var key in obj) {
            resp.write(obj[key]);
            if (c%2==0)
                resp.write("<br>");
            else {
              resp.write(" : ");
            }
            c++;
          }
          }
//          resp.write(str['activities-steps'][2]['value']);
          resp.write("</h4></body></html>");
          resp.end();
      }


    );
  });
  get_req.end();
}

function PostCode(codestring, resp) {

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

  var https = require('https');
  // Set up the request
  var post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8');
      var str = "";
      var data = [];
      res.on('data', function (chunk) {
        data.push(chunk);
          //console.log('Response: ' + chunk);
      });
      res.on('end', function (chunk) {
        var str = JSON.parse(data.join(''));
//          console.log('Access Token: ' + str.access_token);
//          console.log('Refresh Token: ' + str.refresh_token);
          getSteps(str.access_token, resp);

      }

    );
  });

  // post the data
  post_req.write(post_data);
  post_req.end();

}

var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
var request_log = {}

app.get('/callback', function(req, resp){

  //console.log(req.url);
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  var code = req.query.code;
  //console.log(code);
  PostCode(code, resp);
});

app.get('/home',function(req, resp){

  resp.writeHead(200, {"Content-Type" : "text/html"});
  resp.write("<html><head><title>Home</title></head><body>Home page!</br>");
  resp.write(req.url);
  resp.write("<br>");
  resp.write("</body></html>");
  resp.end();

});

app.listen(9000);
console.log("Server running on 9000 port");
