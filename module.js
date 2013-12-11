var md5 = require('MD5');

var settings = {
	rootURL : "http://api.flickr.com/services/rest/?"
}


var set = (function(){
	
	console.log("Set called");

	function setAPIURLRoot(url){
		settings.rootURL = url;
	}

	function setAPI_key(key){
		settings.api_key = key;
	}

	function setSecret(secret){
		settings.secret = secret;
	}

	function setAuthToken(token){
		settings.auth_token = token;
	}

	function setFrob(frob){
		settings.frob = frob;
	}

	return {
		rootURL : setAPIURLRoot,
		api_key : setAPI_key,
		secret : setSecret,
		auth_token :setAuthToken,
		frob : setFrob
	};

})();

var get = (function(){

	function getAPIURLRoot(){
		return settings.rootURL;
	}

	function getAPI_Key(){
		return settings.api_key;
	}

	function getSecret(){
		return settings.secret;
	}

	function getAuthToken(){
		return settings.auth_token;
	}

	function getFrob(){
		return settings.frob;
	}

	return{
		rootURL : getAPIURLRoot,
		api_key : getAPI_Key,
		secret : getSecret,
		auth_token : getAuthToken,
		frob : getFrob	
	}

})();

function buildAPISig(options){

	var apiSig = "",
		optKeys = [];

	options.secret = options.secret || get.secret();

	if(options.secret === undefined || options.secret === null){
		throw "You've not set a Flickr secret. You can set one with FlickrSign.set.secret()";
	}

	apiSig += options.secret;

	for(opt in options.requestParameters){
		optKeys.push(opt);
	}

	optKeys.sort();

	for(var x = 0; x < optKeys.length; x += 1){
		apiSig += optKeys[x] + "" + options.requestParameters[optKeys[x]];
	}

	apiSig = md5(apiSig);

	if(options.returnObject !== undefined && options.returnObject === true){
		options.signature = apiSig;
		return options;
	}

	return apiSig;

}

function buildRequest(options){

	var reqURL = "";

	options.includeRootURL = options.includeRootURL || false;

	if(options.includeRootURL === true && options.otherRoot !== undefined){
		reqURL += options.otherRoot;
	} else if(options.includeRootURL === true) {
		reqURL += settings.rootURL;
	}

	var params = [];

	for(op in options.requestParameters){
		params.push(op);
	}

	for(var y = 0; y < params.length; y += 1){
		params[y] += "=" + options.requestParameters[params[y]];

	}

	params = params.join("&");

	if(options.needToSign !== false){
		params += "&api_sig=" + buildAPISig(options);
	}

	reqURL += params;

	return reqURL;

}

function generateLoginLink(options){

	//Flickrs API Auth endpoint
	//http://flickr.com/services/auth/?api_key=[api_key]&perms=[perms]&api_sig=[api_sig]

	options.permissions = options.permissions || "read";
	options.otherRoot = options.otherRoot || get.rootURL();
	options.needToSign  = options.needToSign || true;
	options.api_key = options.api_key || get.api_key();

	var logL = buildRequest({
		includeRootURL : true,
		otherRoot : options.otherRoot,
		needToSign : options.needToSign,
		requestParameters : {
			api_key : options.api_key,
			perms : options.permissions,
		}
	});

	return logL;

}

module.exports.set = set;
module.exports.get = get;
module.exports.buildRequest = buildRequest;
module.exports.apiSig = buildAPISig;
module.exports.generateLogin = generateLoginLink;
