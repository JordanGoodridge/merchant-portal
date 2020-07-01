'use strict';
var cybersourceRestApi = require('cybersource-rest-client');
var path = require('path');
var filePath = path.resolve('Data/Configuration.js');
var configuration = require(filePath);
const { verify } = require('jsonwebtoken');
const client = require('../database/client');

function config(MerchantId, MerchantKeyId, MerchantSecretKey) {
	const AuthenticationType = 'http_signature';
	const RunEnvironment = 'cybersource.environment.SANDBOX';

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
	var configObj = {
		authenticationType: AuthenticationType,
		runEnvironment: RunEnvironment,

		merchantID: MerchantId,
		merchantKeyId: MerchantKeyId,
		merchantsecretKey: MerchantSecretKey,

		keyAlias: KeyAlias,
		keyPass: KeyPass,
		keyFileName: KeyFileName,
		keysDirectory: KeysDirectory,

		enableLog: EnableLog,
		logFilename: LogFileName,
		logDirectory: LogDirectory,
		logFileMaxSize: LogfileMaxSize
	};
	return configObj;
}

const postCheckout = async (request, resp) => {
	try {
		console.log('Request: ' + request);
		const {
			cart,
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
			email,
			phoneNumber,
			merch_id
		} = request.body;
		console.log('Checkout request with:');
		console.log('CC:' + number);
		console.log('Expiration' + expirationMonth + '/' + expirationYear);
		console.log('Amount' + totalAmount + ' ' + currency);
		console.log('Name: ' + firstName + ' ' + lastName);
		console.log(
			'Address:' + address1 + ' ' + locality + ' ' + administrativeArea + ' ' + postalCode + ' ' + country
		);
		console.log('Phone: ' + phoneNumber);
		console.log('Email: ' + email);
		console.log('MerchID: ' + merch_id);
		console.log(cart);

		const query_feedback = await client.query(
			"SELECT * FROM merchant WHERE merchant.merch_id = '" + request.body.merch_id + "' ;"
		);
		var key_id = query_feedback.rows[0].key_id;
		var visa_merchant_id = query_feedback.rows[0].visa_merchant_id;
		var shared_key = query_feedback.rows[0].shared_key;
		var configObject = config(visa_merchant_id, key_id, shared_key);

		var enable_capture = true;

		// var configObject = new configuration();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.CreatePaymentRequest();

		var clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
		clientReferenceInformation.code = 'TC50171_34';
		requestObj.clientReferenceInformation = clientReferenceInformation;

		var processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
		processingInformation.capture = false;
		if (enable_capture === true) {
			processingInformation.capture = true;
		}

		processingInformation.commerceIndicator = 'internet';
		requestObj.processingInformation = processingInformation;

		var paymentInformation = new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
		var paymentInformationCard = new cybersourceRestApi.Ptsv2paymentsPaymentInformationCard();
		paymentInformationCard.number = number;
		paymentInformationCard.expirationMonth = expirationMonth;
		paymentInformationCard.expirationYear = expirationYear;
		paymentInformationCard.securityCode = securityCode;
		paymentInformation.card = paymentInformationCard;

		requestObj.paymentInformation = paymentInformation;

		var orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
		var orderInformationAmountDetails = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
		orderInformationAmountDetails.totalAmount = totalAmount;
		orderInformationAmountDetails.currency = currency;
		orderInformation.amountDetails = orderInformationAmountDetails;

		var orderInformationBillTo = new cybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
		orderInformationBillTo.firstName = firstName;
		orderInformationBillTo.lastName = lastName;
		orderInformationBillTo.address1 = address1;
		orderInformationBillTo.address2 = address2;
		orderInformationBillTo.locality = locality;
		orderInformationBillTo.administrativeArea = administrativeArea;
		orderInformationBillTo.postalCode = postalCode;
		orderInformationBillTo.country = country;
		orderInformationBillTo.email = email;
		orderInformationBillTo.phoneNumber = phoneNumber;
		orderInformation.billTo = orderInformationBillTo;

		requestObj.orderInformation = orderInformation;

		var instance = new cybersourceRestApi.PaymentsApi(configObject, apiClient);
		var cap_instance = new cybersourceRestApi.CaptureApi(configObject, apiClient);

		instance.createPayment(requestObj, function(error, data, response) {
			if (error) {
				console.log('\nError : ' + JSON.stringify(error));
			} else if (data) {
				var id = data['id'];
				console.log('\n*************** Capture Payment *********************');
				console.log('Payment ID passing to capturePayment : ' + id);

				cap_instance.capturePayment(requestObj, id, function(error, data, response) {
					if (error) {
						console.log('\nError : ' + JSON.stringify(error));
					} else if (data) {
						console.log('Capture Payment sucess: \n');
						console.log('\nData : ' + JSON.stringify(data));
					}

					console.log('\nResponse : ' + JSON.stringify(response));
					console.log('\nResponse Code of Capture a Payment : ' + JSON.stringify(response['status']));

					resp.json({ success: true });

					callback(error, data, response);
				});
			}

			console.log('\nResponse : ' + JSON.stringify(response));
			console.log('\nResponse Code of Process a Payment : ' + JSON.stringify(response['status']));
			resp.json({ success: true });

			callback(error, data, response);
			resp.json({ success: true });
		});

		const new_cust_id_results = await client.query(
			"SELECT customer.cust_id FROM customer WHERE customer.email = '" + request.body.email + "';"
		);
		var new_cust_id = new_cust_id_results.rows[0].cust_id;

		const new_order = await client.query(
			'INSERT INTO orders (cust_id, order_date, status, merch_id, price) VALUES(' +
				new_cust_id +
				', CURRENT_TIMESTAMP, TRUE, ' +
				request.body.merch_id +
				',' + 
				totalAmount + 
				') ;'
		);
		const new_order_results = await client.query(
			'SELECT orders.order_id FROM orders WHERE orders.cust_id = ' +
				new_cust_id +
				' ORDER BY orders.order_id DESC LIMIT 1;'
		);
		var new_order_id = new_order_results.rows[0].order_id;

		console.log(new_order_id);
		for (var id = 0; id < request.body.cart.length; id++) {
			console.log('Adding order: ');
			console.log(request.body.cart[id].itemId);
			console.log(request.body.cart[id].quantity);
			client.query(
				'INSERT INTO orderitems (item_id, order_id, quantity) VALUES ( ' +
					request.body.cart[id].itemId +
					',' +
					new_order_id +
					',' +
					request.body.cart[id].quantity +
					');'
			);
		}
	} catch (error) {
		console.log('\nException on calling the API : ' + error);
		resp.json({ sucess: false });
	}
};

// module.exports.paymentRouter = simple_authorization_internet;
module.exports.postCheckout = postCheckout;
