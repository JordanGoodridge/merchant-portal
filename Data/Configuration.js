'use strict';

/*
* Merchant configuration properties are taken from Configuration module
*/

// common parameters
const AuthenticationType = 'http_signature';
const RunEnvironment = 'cybersource.environment.SANDBOX';

const MerchantId = 'thinking_ot_hackaton';
const MerchantKeyId = '67beca04-92b8-41aa-b290-d1e342d6c988';
const MerchantSecretKey = 'hmXIIKU7pSLArJD/NnyU4aFY3FOffMhE+XpKl52mo7Q=';

// jwt parameters
const KeysDirectory = 'Resource';
const KeyFileName = 'testrest';
const KeyAlias = 'testrest';
const KeyPass = 'testrest';

// logging parameters
const EnableLog = true;
const LogFileName = 'cybs';
const LogDirectory = '../log';
const LogfileMaxSize = '5242880'; //10 MB In Bytes

// Constructor for Configuration
function Configuration() {

	var configObj = {
		'authenticationType': AuthenticationType,	
		'runEnvironment': RunEnvironment,

		'merchantID': MerchantId,
		'merchantKeyId': MerchantKeyId,
		'merchantsecretKey': MerchantSecretKey,
        
		'keyAlias': KeyAlias,
		'keyPass': KeyPass,
		'keyFileName': KeyFileName,
		'keysDirectory': KeysDirectory,
        
		'enableLog': EnableLog,
		'logFilename': LogFileName,
		'logDirectory': LogDirectory,
		'logFileMaxSize': LogfileMaxSize
	};
	return configObj;

}

module.exports = Configuration;
