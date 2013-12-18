var RestClient = require('./restclient');
var UserApp = module.exports || {};

// Global settings
UserApp.global = {
	baseAddress: 'api.userapp.io',
	appId:null,
	token:null,
	debug: false,
	secure: true
};

// Transport
// The layer which handles the communication with UserApp.

UserApp.Transport = {};

var NativeTransport = UserApp.Transport.NativeTransport = function(baseAddress, msTimeout){
	this.offset = 0;
	this.baseAddress = baseAddress || UserApp.global.baseAddress;
	this.msTimeout = msTimeout || 1000*20;
	this.client = new RestClient({
		baseUrl: this.baseAddress,
		contentType: 'application/x-www-form-urlencoded'
	});
};

NativeTransport.prototype.call = function(sender, version, method, arguments, callback){
	var outerScope = this;
	sender = sender || UserApp.global;

	var cleanupRequest = null;
	var timeoutCallback = null;

	var timestamp = Math.floor((new Date().getTime()/1000)-1373133713); // Cache buster (seconds since UserApp epoch!)
	var callbackId = 'ua_' + (++this.offset) + '_' + timestamp;

	var serviceArguments = {};

	if(arguments){
		for(var key in arguments){
			serviceArguments[key] = arguments[key];
		}
	}

	serviceArguments["js_callback"] = callbackId;

	if(UserApp.global.debug){
		serviceArguments["$beautify"] = null;
		serviceArguments["$debug"] = null;
	}

	// If we're in debug mode. Provide a default callback if not provided.
	if(UserApp.global.debug){
		console.log("Calling method " + method + " with arguments " + JSON.stringify(serviceArguments));
		var shadowedCallback = callback;
		callback = function(error, result){
			if(error){
				console.error("UserApp error: " + error.name + ": " + error.message);
			}

			console.log(result);

			if(shadowedCallback){
				shadowedCallback(error, result);
			}
		}

		RestClient.log = function(message){
			console.log(message);
		}
	}

	var protocol = UserApp.global.secure ? 'https' : 'http';
	this.client.setBaseUrl(protocol + "://" + this.baseAddress + "/v" + version + "/");
	this.client.setBasicAuthentication(sender.appId || UserApp.global.appId, sender.token || UserApp.global.token);

	this.client.post(method, arguments, function(error, result){
    	var logs = null;

    	if(error){
    		callback(error);
    		return;
    	}

		if(result.__logs){
			logs = result.__logs;
			delete result["__logs"];
		}

		if (result instanceof Array) {
			if(result.length > 0){
				var lastChild = result[result.length-1];
				if(lastChild && lastChild.__logs){
					logs = result.pop().__logs;
				}
			}
		}

		if(logs && UserApp.global.debug){
			for(var i=0;i<logs.length;++i){
				var log = logs[i];
				var message = typeof log.message == 'object' ? JSON.stringify(log.message) : log.message;
				console.log("UserApp " + log.type + ": " + message);
			}
			logs = null;
		}

    	if(result.error_code){
    		callback({name: result.error_code, message: result.message});
    	}else{
    		callback(null, result);
    	}
	});
};

UserApp.Transport.Current = new NativeTransport();

// Helper function used to initialize the library.
UserApp.initialize = function(settings){
	if(settings.appId){
		this.setAppId(settings.appId);
	}
	if(settings.token){
		this.setToken(settings.token);
	}
	if(settings.baseAddress){
		this.setBaseAddress(settings.baseAddress);
	}
	if(settings.debug){
		this.setDebug(settings.debug);
	}
	if(settings.secure){
		this.setSecure(settings.secure);
	}
	return this;
};

// Set which base address to call. E.g. 'api.userapp.io'.
UserApp.setBaseAddress = function(address){
	this.global.baseAddress = address || 'api.userapp.io';
	return this;
}

// Set which application to authenticate under.
UserApp.setAppId = function(appId){
	this.global.appId = appId;
	return this;
};

// Set which token to work against
UserApp.setToken = function(token){
	this.global.token = token;
	return this;
};

// Activate debugging. Enables user to receive errors/logs/results in console.
UserApp.setDebug = function(debug){
	this.global.debug = debug || false;
};

// Whether or not to use SSL. Default = true
UserApp.setSecure = function(secure){
	this.global.secure = secure == null || secure == undefined ? true : secure;
};

// User

UserApp.User = function(options){
	options = options || {};
	if(options.appId){
		this.appId = options.appId;
	}
	if(options.token){
		this.token = options.token;
	}
};

// Search for users

UserApp.User.search = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.search', arguments, callback);
};

UserApp.User.prototype.search = function(arguments, callback){
	UserApp.User.search.call(this, arguments, callback);
};

// Save a user

UserApp.User.save = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.save', arguments, callback);
};

UserApp.User.prototype.save = function(arguments, callback){
	UserApp.User.save.call(this, arguments, callback);
};

// Get a specific user

UserApp.User.get = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.get', arguments, callback);
};

UserApp.User.prototype.get = function(arguments, callback){
	UserApp.User.get.call(this, arguments, callback);
};

// Count number of users

UserApp.User.count = function(arguments, callback){
	if(typeof arguments == 'function'){
		callback = arguments;
		arguments = null;
	}
	
	UserApp.Transport.Current.call(this, 1, 'user.count', arguments, callback);
};

UserApp.User.prototype.count = function(arguments, callback){
	UserApp.User.count.call(this, arguments, callback);
};

// Remove

UserApp.User.remove = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.remove', arguments, callback);
};

UserApp.User.prototype.remove = function(callback){
	UserApp.User.remove.call(this, callback);
};

// Change password

UserApp.User.resetPassword = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.resetPassword', arguments, callback);
};

UserApp.User.prototype.resetPassword = function(arguments, callback){
	UserApp.User.resetPassword.call(this, arguments, callback);
};

// Change password

UserApp.User.changePassword = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.changePassword', arguments, callback);
};

UserApp.User.prototype.changePassword = function(arguments, callback){
	UserApp.User.changePassword.call(this, arguments, callback);
};

// Plan

UserApp.User.setPlan = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.setPlan', arguments, callback);
};

UserApp.User.prototype.setPlan = function(arguments, callback){
	UserApp.User.setPlan.call(this, arguments, callback);
};

// Get subscription details

UserApp.User.getSubscriptionDetails = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.getSubscriptionDetails', arguments, callback);
};

UserApp.User.prototype.getSubscriptionDetails = function(arguments, callback){
	UserApp.User.getSubscriptionDetails.call(this, arguments, callback);
};

// Lock

UserApp.User.lock = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.lock', arguments, callback);
};

UserApp.User.prototype.lock = function(arguments, callback){
	UserApp.User.setLock.call(this, arguments, callback);
};

// Unlock

UserApp.User.unlock = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.unlock', arguments, callback);
};

UserApp.User.prototype.unlock = function(arguments, callback){
	UserApp.User.unlock.call(this, arguments, callback);
};

// Has Permission

UserApp.User.hasPermission = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.hasPermission', arguments, callback);
};

UserApp.User.prototype.hasPermission = function(arguments, callback){
	UserApp.User.hasPermission.call(this, arguments, callback);
};

// Has Feature

UserApp.User.hasFeature = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.hasFeature', arguments, callback);
};

UserApp.User.prototype.hasFeature = function(arguments, callback){
	UserApp.User.hasFeature.call(this, arguments, callback);
};

// Login

UserApp.User.login = function(arguments, callback){
	var outerScope = this;
	UserApp.Transport.Current.call(this, 1, 'user.login', arguments, function(error, result){
		if(!error){
			var token = result.token;
			if(typeof outerScope === 'object'){
				outerScope.token = token;
			}else{
				UserApp.setToken(token);
			}
		}

		callback && callback(error, result);
	});
};

UserApp.User.prototype.login = function(arguments, callback){
	UserApp.User.login.call(this, arguments, callback);
};

// Logout

UserApp.User.logout = function(callback){
	UserApp.Transport.Current.call(this, 1, 'user.logout', null, function(error, result){
		UserApp.setToken(null);
		callback && callback(error, result);
	});
};

UserApp.User.prototype.logout = function(callback){
	UserApp.User.logout.call(this, callback);
};

// Token

UserApp.Token = function(options){
	options = options || {};
	if(options.appId){
		this.appId = options.appId;
	}
	if(options.token){
		this.token = options.token;
	}
};

// Get token

UserApp.Token.get = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'token.get', arguments, callback);
};

UserApp.Token.prototype.get = function(arguments, callback){
	UserApp.Token.get.call(this, arguments, callback);
};

// Search token

UserApp.Token.search = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'token.search', arguments, callback);
};

UserApp.Token.prototype.search = function(arguments, callback){
	UserApp.Token.search.call(this, arguments, callback);
};

// Save token

UserApp.Token.save = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'token.save', arguments, callback);
};

UserApp.Token.prototype.save = function(arguments, callback){
	UserApp.Token.save.call(this, arguments, callback);
};

// Remove token

UserApp.Token.remove = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'token.remove', arguments, callback);
};

UserApp.Token.prototype.remove = function(arguments, callback){
	UserApp.Token.remove.call(this, arguments, callback);
};

// Heartbeat
// Keep a session token alive

UserApp.Token.heartbeat = function(callback){
	UserApp.Transport.Current.call(this, 1, 'token.heartbeat', null, callback);
};

UserApp.Token.prototype.heartbeat = function(callback){
	UserApp.Token.heartbeat.call(this, callback);
};

// Permission

UserApp.Permission = function(options){
	options = options || {};
	if(options.appId){
		this.appId = options.appId;
	}
	if(options.token){
		this.token = options.token;
	}
};

// Get a permission

UserApp.Permission.get = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'permission.get', arguments, callback);
};

UserApp.Permission.prototype.get = function(arguments, callback){
	UserApp.Permission.get.call(this, arguments, callback);
};

// Search permission

UserApp.Permission.search = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'permission.search', arguments, callback);
};

UserApp.Permission.prototype.search = function(arguments, callback){
	UserApp.Permission.search.call(this, arguments, callback);
};

// Save a permission

UserApp.Permission.save = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'permission.save', arguments, callback);
};

UserApp.Permission.prototype.save = function(arguments, callback){
	UserApp.Permission.save.call(this, arguments, callback);
};

// Count number of permissions

UserApp.Permission.count = function(callback){
	UserApp.Transport.Current.call(this, 1, 'permission.count', null, callback);
};

UserApp.Permission.prototype.count = function(callback){
	UserApp.Permission.count.call(this, arguments, callback);
};

// Remove a specific permission

UserApp.Permission.remove = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'permission.remove', arguments, callback);
};

UserApp.Permission.prototype.remove = function(callback){
	UserApp.Permission.remove.call(this, callback);
};

// Feature

UserApp.Feature = function(options){
	options = options || {};
	if(options.appId){
		this.appId = options.appId;
	}
	if(options.token){
		this.token = options.token;
	}
};

// Get a feature

UserApp.Feature.get = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'feature.get', arguments, callback);
};

UserApp.Feature.prototype.get = function(arguments, callback){
	UserApp.Feature.get.call(this, arguments, callback);
};

// Search feature

UserApp.Feature.search = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'feature.search', arguments, callback);
};

UserApp.Feature.prototype.search = function(arguments, callback){
	UserApp.Feature.search.call(this, arguments, callback);
};

// Save a feature

UserApp.Feature.save = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'feature.save', arguments, callback);
};

UserApp.Feature.prototype.save = function(arguments, callback){
	UserApp.Feature.save.call(this, arguments, callback);
};

// Count number of features

UserApp.Feature.count = function(callback){
	UserApp.Transport.Current.call(this, 1, 'feature.count', null, callback);
};

UserApp.Feature.prototype.count = function(callback){
	UserApp.Feature.count.call(this, arguments, callback);
};

// Remove a specific feature

UserApp.Feature.remove = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'feature.remove', arguments, callback);
};

UserApp.Feature.prototype.remove = function(callback){
	UserApp.Feature.remove.call(this, callback);
};

// Property

UserApp.Property = function(options){
	options = options || {};
	if(options.appId){
		this.appId = options.appId;
	}
	if(options.token){
		this.token = options.token;
	}
};

// Get a property

UserApp.Property.get = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'property.get', arguments, callback);
};

UserApp.Property.prototype.get = function(arguments, callback){
	UserApp.Property.get.call(this, arguments, callback);
};

// Search property

UserApp.Property.search = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'property.search', arguments, callback);
};

UserApp.Property.prototype.search = function(arguments, callback){
	UserApp.Property.search.call(this, arguments, callback);
};

// Save a property

UserApp.Property.save = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'property.save', arguments, callback);
};

UserApp.Property.prototype.save = function(arguments, callback){
	UserApp.Property.save.call(this, arguments, callback);
};

// Count number of propertys

UserApp.Property.count = function(callback){
	UserApp.Transport.Current.call(this, 1, 'property.count', null, callback);
};

UserApp.Property.prototype.count = function(callback){
	UserApp.Property.count.call(this, arguments, callback);
};

// Remove a specific property

UserApp.Property.remove = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'property.remove', arguments, callback);
};

UserApp.Property.prototype.remove = function(callback){
	UserApp.Property.remove.call(this, callback);
};

// PriceList

UserApp.PriceList = function(options){
	options = options || {};
	if(options.appId){
		this.appId = options.appId;
	}
	if(options.token){
		this.token = options.token;
	}
};

// Get a pricelist

UserApp.PriceList.get = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'priceList.get', arguments, callback);
};

UserApp.PriceList.prototype.get = function(arguments, callback){
	UserApp.PriceList.get.call(this, arguments, callback);
};

// Search pricelist

UserApp.PriceList.search = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'priceList.search', arguments, callback);
};

UserApp.PriceList.prototype.search = function(arguments, callback){
	UserApp.PriceList.search.call(this, arguments, callback);
};

// Update a specific pricelist

UserApp.PriceList.save = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'priceList.save', arguments, callback);
};

UserApp.PriceList.prototype.save = function(arguments, callback){
	UserApp.PriceList.save.call(this, arguments, callback);
};

// Count number of pricelists

UserApp.PriceList.count = function(callback){
	UserApp.Transport.Current.call(this, 1, 'priceList.count', null, callback);
};

UserApp.PriceList.prototype.count = function(callback){
	UserApp.PriceList.count.call(this, arguments, callback);
};

// Remove a specific pricelist

UserApp.PriceList.remove = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'priceList.remove', arguments, callback);
};

UserApp.PriceList.prototype.remove = function(callback){
	UserApp.PriceList.remove.call(this, callback);
};

// Plan

UserApp.Plan = function(options){
	options = options || {};
	if(options.appId){
		this.appId = options.appId;
	}
	if(options.token){
		this.token = options.token;
	}
};

// Get a plan

UserApp.Plan.get = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'plan.get', arguments, callback);
};

UserApp.Plan.prototype.get = function(arguments, callback){
	UserApp.Plan.get.call(this, arguments, callback);
};

// Search for plans

UserApp.Plan.search = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'plan.search', arguments, callback);
};

UserApp.Plan.prototype.search = function(arguments, callback){
	UserApp.Plan.search.call(this, arguments, callback);
};

// Save a plan

UserApp.Plan.save = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'plan.save', arguments, callback);
};

UserApp.Plan.prototype.save = function(arguments, callback){
	UserApp.Plan.save.call(this, arguments, callback);
};

// Count number of pricelistplans

UserApp.Plan.count = function(callback){
	UserApp.Transport.Current.call(this, 1, 'plan.count', null, callback);
};

UserApp.Plan.prototype.count = function(callback){
	UserApp.Plan.count.call(this, arguments, callback);
};

// Remove a specific pricelistplan

UserApp.Plan.remove = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'plan.remove', arguments, callback);
};

UserApp.Plan.prototype.remove = function(callback){
	UserApp.Plan.remove.call(this, callback);
};

// User Invoice

UserApp.User.Invoice = function(options){
	options = options || {};
	if(options.appId){
		this.appId = options.appId;
	}
	if(options.token){
		this.token = options.token;
	}
};

// Get invoices

UserApp.User.Invoice.get = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.invoice.get', arguments, callback);
};

UserApp.User.Invoice.prototype.get = function(callback){
	UserApp.Plan.get.call(this, callback);
};

// Search for invoices

UserApp.User.Invoice.search = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.invoice.search', arguments, callback);
};

UserApp.User.Invoice.prototype.search = function(callback){
	UserApp.Plan.search.call(this, callback);
};

// Save a invoice

UserApp.User.Invoice.save = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.invoice.save', arguments, callback);
};

UserApp.User.Invoice.prototype.save = function(callback){
	UserApp.Plan.save.call(this, callback);
};

// Remove invoices

UserApp.User.Invoice.remove = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.invoice.remove', arguments, callback);
};

UserApp.User.Invoice.prototype.remove = function(callback){
	UserApp.Plan.remove.call(this, callback);
};

// User Payment Method

UserApp.User.PaymentMethod = function(options){
	options = options || {};
	if(options.appId){
		this.appId = options.appId;
	}
	if(options.token){
		this.token = options.token;
	}
};

// Get payment methods

UserApp.User.PaymentMethod.get = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.paymentMethod.get', arguments, callback);
};

UserApp.User.PaymentMethod.prototype.get = function(callback){
	UserApp.Plan.get.call(this, callback);
};

// Search for payment methods

UserApp.User.PaymentMethod.search = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.paymentMethod.search', arguments, callback);
};

UserApp.User.PaymentMethod.prototype.search = function(callback){
	UserApp.Plan.search.call(this, callback);
};

// Save a payment method

UserApp.User.PaymentMethod.save = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.paymentMethod.save', arguments, callback);
};

UserApp.User.PaymentMethod.prototype.save = function(callback){
	UserApp.Plan.save.call(this, callback);
};

// Remove payment methods

UserApp.User.PaymentMethod.remove = function(arguments, callback){
	UserApp.Transport.Current.call(this, 1, 'user.paymentMethod.remove', arguments, callback);
};

UserApp.User.PaymentMethod.prototype.remove = function(callback){
	UserApp.Plan.remove.call(this, callback);
};