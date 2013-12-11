#FlickrSigning
####A Node.js module for signing Flickr requests

###About
When using Flickr's RESTful API, there is a requirement to sign each request before it can be sent. This can be painful as there are certain requirements of the signing process which can quickly cause headaches.

FlickrSigning takes arguments and builds the request for you. You'll need to write your own endpoints and redirects for the OAuth process but FlickrSigning can help with the OAuth process.

###Usage
FlickrSigning isn't on NPM (yet) so for now, if you want to use this module, you can download it and include it in the node_modules folder of your Node.js project

You can then require it like so...

```javascript
	var FlickrSign = require('node_modules/FlickrSigning/module.js'),
```

...assuming your app script is in the same directory as your node_modules folder.

###Methods

####generateLoginLink(options)
##### returns URL to authenticate your web app with the user on Flickr

####Valid Options

```javascript
	FlickrSigning.generateLoginLink({
		permissions : STRING, // The permissions your app will need for the users profile - "read" || "write"
		otherRoot : STRING, // Specify a different root URL than the one this method uses.
		needToSign : BOOLEAN, // Does this request need to be signed
		api_key : STRING // If you've not set an Flickr API key you can specify one here
	});
```

####buildRequest(options)
##### Builds a valid Flickr request out of the paramters passed. 

Flickr requests need to be alphabetical, This method will rearrange the contents of the query so they are in the right order.

####Valid Options

```javascript
	FlickrSigning.buildRequest({
		includeRootURL : STRING || false, // Specify whether you want the full URL or just the query returned.
		otherRoot : STRING, // If includeRootURL, Specify a different root URL than the one this method uses.
		needToSign : BOOLEAN, // Does this request need to be signed. DEFAULT: true.
		api_key : STRING, // If you've not set an Flickr API key you can specify one here.
		secret : STRING, // If you've not set an app secret using set.secret() and don't pass one here, An error will be thrown.
		requestParameters : { // In request parameters you set the values that Flickr is expecting for example...
			nojsoncallback : 1,
			format : "json",
			method : "flickr.auth.getToken",
			api_key : FlickrSign.get.api_key(),
			frob : FlickrSign.get.frob()
		} //... will be equivalent to ?api_key=[API_KEY]&format=json&frob=[FROB]&method=flickr.auth.getToken&nojsoncallback=1
	});
```

If needToSign is not set to false then buildRequest will also call buildAPISig() to sign the request before returning.

####buildAPISig
#####Signs a request with MD5

Flickr Requests generally need to be signd with an MD5 hash of the request before it's valid. The parameters are exactly the same as buildRequest except you can pass returnObject : true || false to determine whether or not you want to return a string that is the request with the signature appended (false) or an object that has the signature included in it (true).

####set
#####Method to set module variables

####set.rootURL(STRING)
#####Set the root URL for every request built

####set.api_key(STRING)
#####Set the default API key for each request

####set.secret(STRING)
#####Set the app secret

####set.auth_token(STRING)
#####Set the OAuth access token for the app


####set.frob(STRING)
#####Set the app FROB (Used to retrieve the OAuth token)

###get

####get.rootURL()
#####Retrieve the current root URL for each request

####get.api_key()
#####Get the currently set Flickr API key

####get.secret()
#####Get the currently set Flickr app secret

####get.auth_token
#####Get the currently set OAuth token

####get.frob
#####Get the FROB

