function IguanaAJAX(url, ajax_data) {
	return $.ajax({
		data: JSON.stringify(ajax_data),
		url: url,
		type: 'POST',
		dataType: 'json'
	})
	.fail(function(xhr, textStatus, error) {
		// handle request failures
		console.log(xhr.statusText);
		if ( xhr.readyState == 0 ) {
			Iguana_ServiceUnavailable();
		}
		console.log(textStatus);
		console.log(error);
	});
}

function Iguana_dumpwallet() {
	var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			ajax_data = {
				'userpass': tmpIguanaRPCAuth,
				'agent': 'bitcoinrpc',
				'method': 'dumpwallet',
				'filename': ''
			};

	return_result = function () {
		var tmp = null;
		
		$.ajax({
			'async': false,
			'type': 'POST',
			'global': false,
			'url': 'http://127.0.0.1:7778',
			'data': JSON.stringify(ajax_data),
			'success': function (data) {
				tmp = data;
			}
		});

		return tmp;
	}();

	//console.log(return_result);

	//comment
		/*var ajax_data = {"agent":"bitcoinrpc","method":"dumpwallet","filename": ""};
		console.log(ajax_data);
		$.ajax({
				type: 'POST',
				data: JSON.stringify(ajax_data),
				url: 'http://127.0.0.1:7778',
				//dataType: 'text',
				success: function(data, textStatus, jqXHR) {
						var AjaxOutputData = JSON.parse(data);
						//console.log('== Data OutPut ==');
						console.log(AjaxOutputData);
						//return AjaxOutputData;
				},
				error: function(xhr, textStatus, error) {
						console.log(xhr.statusText);
						console.log(textStatus);
						console.log(error);
				}
		});
		//console.log(datareturn)
		//return datareturn;*/
}

function Iguana_ServiceUnavailable() {
	console.log('Network Error api');
	toastr.error('Unable to connect with iguana service. 127.0.0.1:7778', 'Service Notification');
	toastr.info('Are you sure Iguana is running?', 'Account Notification');
	ClearOnLogout(true, true);
}

function secondsToString(seconds) {
	var a = new Date(seconds * 1000),
			months = [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec'
			],
			year = a.getFullYear(),
			month = months[a.getMonth()],
			date = a.getDate(),
			hour = a.getHours(),
			min = a.getMinutes(),
			sec = a.getSeconds(),
			time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
	return time;
}

function Iguana_HashHex(data) {
	var result = '',
			tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			ajax_data = {
				'userpass': tmpIguanaRPCAuth,
				'agent': 'hash',
				'method': 'hex',
				'message': data
			};
	$.ajax({
		type: 'POST',
		data: JSON.stringify(ajax_data),
		url: 'http://127.0.0.1:7778',
		success: function(data, textStatus, jqXHR) {
			var AjaxOutputData = JSON.parse(data);
			result = AjaxOutputData.hex;
		},
		error: function(xhr, textStatus, error) {
			console.log(xhr.statusText);
			if ( xhr.readyState == 0 ) {
				Iguana_ServiceUnavailable();
			}
			console.log(textStatus);
			console.log(error);
		}
	});

	return result;
}

function Iguana_SetRPCAuth() {
	var tmpPass = '1234'; //md5(PassPhraseGenerator.generatePassPhrase(128));
	sessionStorage.setItem('IguanaRPCAuth', tmpPass);
}

function Iguana_CheckActiveCoins() {
	return new Promise((resolve) => {
		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				ajax_data = {
					'userpass': tmpIguanaRPCAuth,
					'agent': 'InstantDEX',
					'method': 'allcoins'
				},
				AjaxOutputData = IguanaAJAX('http://127.0.0.1:7778', ajax_data)
				.done(function(data) {
					var result = [];

					AjaxOutputData = JSON.parse(AjaxOutputData.responseText);
					$.each(AjaxOutputData, function( index, value ) {
						if ( index === 'tag' ) {
							//console.log('it is tag');
						} else {
							if (AjaxOutputData[index].length !== 0 ) {
								result.push({ 'active': AjaxOutputData[index].length });
							}
						}
				});
				resolve(result);
		})
		.fail(function(xhr, textStatus, error) {
			// handle request failures
			console.log(xhr.statusText);
			if ( xhr.readyState == 0 ) {
			}
			console.log(textStatus);
			console.log(error);
		})
	});
}