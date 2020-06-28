'use strict';

/*
* Merchant configuration properties are taken from Configuration module
*/

// common parameters
const AuthenticationType = 'http_signature';
const RunEnvironment = 'cybersource.environment.SANDBOX';
const MerchantId = 'thinking_ot';

// http_signature parameters
const MerchantKeyId = '84044e8a-0d93-486e-9d4f-4864aaa6482c';
const MerchantSecretKey = '1cRodQOtC2IpAM9rYd53tLuM+2/a97idgRyh4NOR8T0=';

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