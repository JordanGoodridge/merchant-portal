'use strict';
var cybersourceRestApi = require('cybersource-rest-client');
var path = require('path');
var filePath = path.resolve('Data/Configuration.js');
var configuration = require(filePath);
const { verify } = require('jsonwebtoken');
const client = require('../database/client');

// function config(MerchantId, MerchantKeyId, MerchantSecretKey){

// 	const AuthenticationType = 'http_signature';
// 	const RunEnvironment = 'cybersource.environment.SANDBOX';

// 	// jwt parameters
// 	const KeysDirectory = 'Resource';
// 	const KeyFileName = 'testrest';
// 	const KeyAlias = 'testrest';
// 	const KeyPass = 'testrest';

// 	// logging parameters
// 	const EnableLog = true;
// 	const LogFileName = 'cybs';
// 	const LogDirectory = '../log';
// 	const LogfileMaxSize = '5242880'; //10 MB In Bytes
// 	var configObj = {
// 		'authenticationType': AuthenticationType,
// 		'runEnvironment': RunEnvironment,

// 		'merchantID': MerchantId,
// 		'merchantKeyId': MerchantKeyId,
// 		'merchantsecretKey': MerchantSecretKey,

// 		'keyAlias': KeyAlias,
// 		'keyPass': KeyPass,
// 		'keyFileName': KeyFileName,
// 		'keysDirectory': KeysDirectory,

// 		'enableLog': EnableLog,
// 		'logFilename': LogFileName,
// 		'logDirectory': LogDirectory,
// 		'logFileMaxSize': LogfileMaxSize
// 	};
// 	return configObj;
// }

const postCheckout = async (request, response) => {
	console.log('post checkout called');
	const {
		number,
		expirationMonth,
		expirationYear,
		securityCode,
		totalAmount,
		currency,
		firstName,
		lastName,
		address1,
		address2,
		locality,
		administrativeArea,
		postalCode,
		country,
		phoneNumber,
		merchantId,
		cart
	} = request.body;

	console.log(number);
	console.log(expirationMonth);
	console.log(expirationYear);
	console.log(securityCode);
	console.log(totalAmount);
	console.log(currency);
	console.log(firstName);
	console.log(lastName);
	console.log(address1);
	console.log(address2);
	console.log(locality);
	console.log(administrativeArea);
	console.log(postalCode);
	console.log(country);
	console.log(phoneNumber);
	console.log(merchantId);
	console.log(cart);

	console.log('finished logging');

	response.json({ success: true });

	//   try {
	//       console.log("In post checkout")
	//       console.log("Request: " + request);
	//       const { number, expirationMonth, expirationYear, securityCode, totalAmount,currency, firstName, lastName, address1, address2, locality, administrativeArea, postalCode, country, email, phoneNumber  } = request.body;
	//       console.log(number);
	//       console.log(expirationMonth)
	//       console.log(expirationYear)
	//       console.log(totalAmount)
	//       console.log(currency)
	//       console.log(firstName)
	//       console.log(lastName)
	// 	console.log(address1)

	// 	const query_feedback = await client.query("SELECT * FROM merchant WHERE merchant.merch_id = '" + request.body.merch_id + "' ;");
	// 	var key_id = query_feedback.rows[0].key_id;
	// 	var visa_merchant_id = query_feedback.rows[0].visa_merchant_id;
	// 	var shared_key = query_feedback.rows[0].shared_key;
	// 	var configObject = config(visa_merchant_id, key_id, shared_key);

	//       var enable_capture = true;

	// 	// var configObject = new configuration();
	// 	var apiClient = new cybersourceRestApi.ApiClient();
	// 	var requestObj = new cybersourceRestApi.CreatePaymentRequest();

	// 	var clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
	// 	clientReferenceInformation.code = 'TC50171_34';
	// 	requestObj.clientReferenceInformation = clientReferenceInformation;

	// 	var processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
	// 	processingInformation.capture = false;
	// 	if (enable_capture === true) {
	// 		processingInformation.capture = true;
	// 	}

	// 	processingInformation.commerceIndicator = 'internet';
	// 	requestObj.processingInformation = processingInformation;

	// 	var paymentInformation = new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
	// 	var paymentInformationCard = new cybersourceRestApi.Ptsv2paymentsPaymentInformationCard();
	// 	paymentInformationCard.number = number;
	// 	paymentInformationCard.expirationMonth = expirationMonth;
	// 	paymentInformationCard.expirationYear = expirationYear;
	// 	paymentInformationCard.securityCode = securityCode;
	// 	paymentInformation.card = paymentInformationCard;

	// 	requestObj.paymentInformation = paymentInformation;

	// 	var orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
	// 	var orderInformationAmountDetails = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
	// 	orderInformationAmountDetails.totalAmount = totalAmount;
	// 	orderInformationAmountDetails.currency = currency;
	// 	orderInformation.amountDetails = orderInformationAmountDetails;

	// 	var orderInformationBillTo = new cybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
	// 	orderInformationBillTo.firstName = firstName;
	// 	orderInformationBillTo.lastName = lastName;
	// 	orderInformationBillTo.address1 = address1;
	// 	orderInformationBillTo.address2 = address2;
	// 	orderInformationBillTo.locality = locality;
	// 	orderInformationBillTo.administrativeArea = administrativeArea;
	// 	orderInformationBillTo.postalCode = postalCode;
	// 	orderInformationBillTo.country = country;
	// 	orderInformationBillTo.email = email;
	// 	orderInformationBillTo.phoneNumber = phoneNumber;
	// 	orderInformation.billTo = orderInformationBillTo;

	// 	requestObj.orderInformation = orderInformation;

	// 	var instance = new cybersourceRestApi.PaymentsApi(configObject, apiClient);
	// 	var cap_instance = new cybersourceRestApi.CaptureApi(configObject, apiClient);

	// 	instance.createPayment(requestObj, function (error, data, response) {
	// 		if (error) {
	// 			console.log('\nError : ' + JSON.stringify(error));
	// 		}
	// 		else if (data) {
	// 			var id = data['id'];
	// 			console.log('\n*************** Capture Payment *********************');
	// 			console.log('Payment ID passing to capturePayment : ' + id);

	// 			cap_instance.capturePayment(requestObj, id, function (error, data, response) {
	// 				if (error) {
	// 					console.log('\nError : ' + JSON.stringify(error));
	// 				}
	// 				else if (data) {
	// 					console.log("Capture Payment sucess: \n");
	// 					console.log('\nData : ' + JSON.stringify(data));
	// 				}

	// 				console.log('\nResponse : ' + JSON.stringify(response));
	//                   console.log('\nResponse Code of Capture a Payment : ' + JSON.stringify(response['status']));

	//                       resp.json({ success: true });

	// 				callback(error, data, response);
	// 			});
	// 		}

	// 		console.log('\nResponse : ' + JSON.stringify(response));
	// 		console.log('\nResponse Code of Process a Payment : ' + JSON.stringify(response['status']));
	//           resp.json({ success: true });

	//           callback(error, data, response);
	//           resp.json({ success: true });

	// 	});
	// }
	// catch (error) {
	//       console.log('\nException on calling the API : ' + error);
	//       resp.json({sucess:false})
	// }
};

// async function simple_authorization_internet(callback, enable_capture, request) {
//     console.log("In Simple_with_internet")
//     // let req = await request;
//     console.log(request)

//     try {
// 		var configObject = new configuration();
// 		var apiClient = new cybersourceRestApi.ApiClient();
// 		var requestObj = new cybersourceRestApi.CreatePaymentRequest();

// 		var clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
// 		clientReferenceInformation.code = 'TC50171_34';
// 		requestObj.clientReferenceInformation = clientReferenceInformation;

// 		var processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
// 		processingInformation.capture = false;
// 		if (enable_capture === true) {
// 			processingInformation.capture = true;
// 		}

// 		processingInformation.commerceIndicator = 'internet';
// 		requestObj.processingInformation = processingInformation;

// 		var paymentInformation = new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
// 		var paymentInformationCard = new cybersourceRestApi.Ptsv2paymentsPaymentInformationCard();
// 		paymentInformationCard.number = '4111111111111111';
// 		paymentInformationCard.expirationMonth = '12';
// 		paymentInformationCard.expirationYear = '2031';
// 		paymentInformationCard.securityCode = '123';
// 		paymentInformation.card = paymentInformationCard;

// 		requestObj.paymentInformation = paymentInformation;

// 		var orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
// 		var orderInformationAmountDetails = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
// 		orderInformationAmountDetails.totalAmount = '102.21';
// 		orderInformationAmountDetails.currency = 'USD';
// 		orderInformation.amountDetails = orderInformationAmountDetails;

// 		var orderInformationBillTo = new cybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
// 		orderInformationBillTo.firstName = 'JOHN';
// 		orderInformationBillTo.lastName = 'Doe';
// 		orderInformationBillTo.address1 = '1 Market St';
// 		orderInformationBillTo.address2 = 'Address 2';
// 		orderInformationBillTo.locality = 'san francisco';
// 		orderInformationBillTo.administrativeArea = 'CA';
// 		orderInformationBillTo.postalCode = '94105';
// 		orderInformationBillTo.country = 'US';
// 		orderInformationBillTo.email = 'test@cybs.com';
// 		orderInformationBillTo.phoneNumber = '4158880000';
// 		orderInformation.billTo = orderInformationBillTo;

// 		requestObj.orderInformation = orderInformation;

// 		var instance = new cybersourceRestApi.PaymentsApi(configObject, apiClient);
// 		var cap_instance = new cybersourceRestApi.CaptureApi(configObject, apiClient);

// 		instance.createPayment(requestObj, function (error, data, response) {
// 			if (error) {
// 				console.log('\nError : ' + JSON.stringify(error));
// 			}
// 			else if (data) {
// 				var id = data['id'];
// 				console.log('\n*************** Capture Payment *********************');
// 				console.log('Payment ID passing to capturePayment : ' + id);

// 				cap_instance.capturePayment(requestObj, id, function (error, data, response) {
// 					if (error) {
// 						console.log('\nError : ' + JSON.stringify(error));
// 					}
// 					else if (data) {
// 						console.log("Capture Payment sucess: \n");
// 						console.log('\nData : ' + JSON.stringify(data));
// 					}

// 					console.log('\nResponse : ' + JSON.stringify(response));
// 					console.log('\nResponse Code of Capture a Payment : ' + JSON.stringify(response['status']));
// 					callback(error, data, response);
// 				});
// 			}

// 			console.log('\nResponse : ' + JSON.stringify(response));
// 			console.log('\nResponse Code of Process a Payment : ' + JSON.stringify(response['status']));
// 			callback(error, data, response);
// 		});
// 	}
// 	catch (error) {
// 		console.log('\nException on calling the API : ' + error);
// 	}
// }
// if (require.main === module) {
// 	simple_authorization_internet(function () {
// 		console.log('\nCreatePayment end.');
//     });

// }

// module.exports.paymentRouter = simple_authorization_internet;
module.exports.postCheckout = postCheckout;
