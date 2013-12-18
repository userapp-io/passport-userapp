var url = require('url');
var http = require('http');
var https = require('https');
var logger = require('./logger').Logger;

var encodeUrlArguments = function(source, prefix, skipIndex){
    var result = [];
    
    for(var index in source){
        var value = source[index];
        var key = prefix ? prefix + "[" + index + "]" : index;

        // Skip Angular.js hashkeys
        if(key == '$$hashKey' || index == '$$hashKey'){
        	continue;
        }

        // Skip null values
        if(value === undefined || value === null){
        	// Except if they are 'special' ($ initial)
	        if(key && key.length > 0 && key[0] == '$'){
	        	result.push(key);
	        }
        	continue;
        }

        result.push(typeof value == "object" ?
        	encodeUrlArguments(value, key, value instanceof Array) :
        	key + "=" + encodeURIComponent(value)
    	);
    }

    return result.join("&");
};

module.exports = function(options){
	// Set default object values
	this.headers = {};
	this.options = {};

	this.transport = null;
	this.transportPort = null;
	this.contentType = null;

	options = options || {};

	if(options.baseUrl){
		this.setBaseUrl(options.baseUrl);
	}

	if(options.basicAuthentication){
		this.setBasicAuthentication(
			options.basicAuthentication.username,
			options.basicAuthentication.password);
	}

	if(options.contentType){
		this.contentType = options.contentType;
	}

	this.options = options;
};

module.exports.log = function(message){};

module.exports.prototype.resolveUrl = function(path){
	return url.parse(url.resolve(this.getBaseUrl(), path));
};

// High level set methods

module.exports.prototype.getBaseUrl = function(){
	return this.options.baseUrl;
}

module.exports.prototype.setBaseUrl = function(baseUrl){
	var baseUrl = this.options.baseUrl = url.parse(baseUrl);

	if(baseUrl.protocol == 'https:'){
		this.transport = https;
		this.transportPort = baseUrl.port || 443;
	}else{
		this.transport = http;
		this.transportPort = baseUrl.port || 80;
	}

	return this;
};

module.exports.prototype.setBasicAuthentication = function(username, password){
	this.setHeader("Authorization", "Basic " + new Buffer((username || '') + ":" + (password || ''))
		.toString("base64"));

	return this;
};

module.exports.prototype.setHeader = function(key, value){
	this.headers[key] = value;
	return this;
};

// High level request methods

module.exports.prototype.get = function(path, callback){
	this.rawRequest('get', path, null, null, callback);
	return this;
};

module.exports.prototype.put = function(path, bodyObject, callback){
	this.rawRequest('put', path, bodyObject, null, callback);
	return this;
};

module.exports.prototype.post = function(path, bodyObject, callback){
	this.rawRequest('post', path, bodyObject, null, callback);
	return this;
};

module.exports.prototype.delete = function(path, callback){
	this.rawRequest('delete', path, null, null, callback);
	return this;
};

// For teh 1337's and epic customizer

module.exports.prototype.rawRequest = function(method, path, body, headers, callback){
	var outerScope = this;

	var dataToWrite = null;
	var requestMethod = method.toUpperCase();
	var requestUrl = this.resolveUrl(path);

	// Set the target host
	var headerData = {};
	headerData.Host = requestUrl.host;

	// Build body content if applicable/available
	if(body != null && (requestMethod == 'PUT' || requestMethod == 'POST')){
		var unableToEncode = false;
		var bodyIsString = typeof body == 'string';
		headerData["Content-Type"] = this.contentType;

		if(this.contentType){
			switch(this.contentType){
				case 'application/json':
					dataToWrite = JSON.stringify(body);
					break;
				case 'application/x-www-form-urlencoded':
					dataToWrite = encodeUrlArguments(body);
					break;
			}
		}

		if(dataToWrite === null){
			if(bodyIsString){
				dataToWrite = body;
			}else{
				callback({code:"MISSING_CONTENT_TYPE", message:"Request provided a body but not a content-type. Unable to encode body without one."});
				return;
			}
		}

		if(dataToWrite){
			headerData['Content-Length'] = Buffer.byteLength(dataToWrite, 'utf8');
		}
	}

	// Start by copying global scope headers
	Object.keys(outerScope.headers).forEach(function(key){
		headerData[key] = outerScope.headers[key];
	});

	// Add local scope variables if available
	if(headers){
		Object.keys(headers).forEach(function(key){
			headerData[key] = headers[key];
		});
	}

	// Build request
	var requestData = {
		hostname: requestUrl.hostname, port: this.transportPort,
		path: requestUrl.pathname,
		method: requestMethod,
		headers: headerData,
		rejectUnauthorized: true
	};
	
	// Log request
	module.exports.log("New request:");
	module.exports.log(requestData);
	
	// Create our request
	var request = this.transport.request(requestData, function(response){
		var data = "";
        response.setEncoding('utf8');

        response.on('data', function(chunk) {
        	data += chunk;
        });

		response.on('error', function(error){
			// Discard any errors
		});

		response.on('end', function() {
			var statusCode = response.statusCode;
			var contentType = response.headers['content-type'];

			if(statusCode == 200){
				module.exports.log("Response headers:");
				module.exports.log(response.headers);
				module.exports.log("Response data:");
				module.exports.log(data);

				switch(contentType){
					case 'json':
					case 'text/json':
					case 'application/json':
					case 'application/x-json':
						data = JSON.parse(data);
						break;
				}

				callback(null, data);
			}else{
				callback({
					code: "HTTP_STATUS_ERROR",
					message: "Server returned status " + statusCode + "."
				});
			}
		});
	});
	
	// Handle any connection/transport errors
	request.on('error', function(error){
		callback(error);
	});

	if(dataToWrite){
		module.exports.log("Request body:");
		module.exports.log(dataToWrite);
		request.write(dataToWrite);
		dataToWrite = null;
	}

	request.end();

	return this;
};