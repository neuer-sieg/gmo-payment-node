// Generated by CoffeeScript 1.9.3
(function() {
  var Const, GMOAPI, https, iconv, querystring;

  https = require("https");

  querystring = require("querystring");

  iconv = require("iconv-lite");

  Const = require("./const");

  GMOAPI = (function() {
    function GMOAPI(options) {
      if (options == null) {
        options = {};
      }
      this.host = options.host;
    }

    GMOAPI.prototype.api = function(path, options_param, cb) {
      var options, params, post_data, req;
      params = this.replaceParams(options_param);
      path = "/payment/" + path;
      post_data = querystring.stringify(params);
      options = {
        host: this.host,
        path: path,
        method: "POST",
        port: 443,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": post_data.length
        }
      };
      req = https.request(options, function(res) {
        res.setEncoding("utf8");
        return res.on("data", function(chunk) {
          return console.log("BODY: " + chunk);
        });
      });
      req.on("error", function(e) {
        console.log("problem with request: " + e.message);
        return cb(e, null);
      });
      req.on("response", function(res) {
        var response;
        response = "";
        res.setEncoding("utf8");
        res.on("data", function(chunk) {
          return response += chunk;
        });
        return res.on("end", function() {
          var err, error;
          err = null;
          try {
            response = iconv.decode(response, 'SHIFT_JIS');
          } catch (error) {
            console.log("ConvertError: " + error + " " + response);
          }
          response = querystring.parse(response);
          response.httpStatusCode = res.statusCode;
          if (response["ErrCode"] || response["ErrInfo"]) {
            err = new Error("An error occured");
            err.response = response;
            err.httpStatusCode = res.statusCode;
            response = null;
          }
          if (!err) {
            if (res.statusCode < 200 || res.statusCode >= 300) {
              err = new Error("Response Status : " + res.statusCode);
              err.response = response;
              err.httpStatusCode = res.statusCode;
              response = null;
            }
          }
          return cb(err, response);
        });
      });
      req.write(post_data);
      return req.end();
    };

    GMOAPI.prototype.assertRequiredOptions = function(required, options) {
      var missing;
      missing = [];
      required.forEach(function(val) {
        if (!(val in options)) {
          return missing.push(val);
        }
      });
      if (missing.length > 0) {
        throw new Error("ArgumentError: Required " + (missing.join(', ')) + " were not provided.");
      }
    };

    GMOAPI.prototype.replaceParams = function(params) {
      var key, new_params;
      new_params = {};
      
      for (key in params) {
        try {
          new_params[Const[key]] = iconv.encode("" + params[key], 'SHIFT_JIS').toString();
        } catch (error) {
          new_params[Const[key]] = "" + params[key];
        }
      }
      
      return new_params;
    };

    return GMOAPI;

  })();

  module.exports.GMOAPI = GMOAPI;

}).call(this);
