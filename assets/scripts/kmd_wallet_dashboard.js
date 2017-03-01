jQuery(document).ready(function() {
	// KMDWalletDashboard.init();
	// TODO: refactor
	var RunNativeProgressBar = setInterval(function() {
		if ( sessionStorage.getItem('IguanaActiveAccount') === null ||
				 sessionStorage.getItem('NativeWalletActions') === null ||
				 sessionStorage.getItem('NativeWalletActions') === 'stop' ) {
			//clearInterval(RunNativeProgressBar);
			//console.log('=> No wallet logged in, or Native Wallet not ative. No need to Run Progress Bar code.');
		} else if ( sessionStorage.getItem('NativeWalletActions') !== null || sessionStorage.getItem('NativeWalletActions') === 'start') {
			KMD_ProgressBar();
		}
	}, 5000);

	var RefreshEdexWalletDashboard = setInterval(function() {
		if ( sessionStorage.getItem('IguanaActiveAccount') === null ||
				 sessionStorage.getItem('NativeWalletActions') === null ||
				 sessionStorage.getItem('NativeWalletActions') === 'stop' ) {
			clearInterval(RefreshEdexWalletDashboard);
			//console.log('=> No wallet logged in, or Dashboard not ative. No need to Run History.');
		} else if ( sessionStorage.getItem('NativeWalletActions') === null || sessionStorage.getItem('NativeWalletActions') === 'start') {
			if ( $('[data-data-extcoin]').attr("data-data-extcoin") !== 'COIN' ) {
				if ( sessionStorage.getItem('edexTmpMode') !== null || sessionStorage.getItem('edexTmpMode') === 'Native') {
					if ( sessionStorage.getItem('edexTmpRefresh') === null || sessionStorage.getItem('edexTmpRefresh') === 'start') {
						//console.log('it is not COIN. '+'It is: ' + $('[data-data-extcoin]').attr("data-data-extcoin"));
						var action_btn_code = getHeaderActionMenuButtonCoinCode();
						$( '#btn_' + action_btn_code + '_wallet_dashboard' ).trigger( 'click' );
					}
				}
			}
		}
	}, 30000);
});

function getHeaderActionMenuButtonCoinCode() {
	var extcoin = $('[data-extcoin]').attr('data-extcoin'),
			action_menu_button_code = '';

	if ( extcoin == 'KMD') { action_menu_button_code = 'kmd'; };
	if ( extcoin == 'ZEC') { action_menu_button_code = 'zec'; };

	return action_menu_button_code;
}

function getPassthruAgent() {
	var extcoin = $('[data-extcoin]').attr('data-extcoin');
			passthru_agent = '';

	if ( extcoin == 'KMD') { passthru_agent = 'komodo'; };
	if ( extcoin == 'ZEC') { passthru_agent = 'zcash'; };

	return passthru_agent;
}

function CheckIfConnected() {
	var result = [],
			extcoin = $('[data-extcoin]').attr('data-extcoin'),
			passthru_agent = getPassthruAgent(),
			tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			ajax_data = {
				'userpass': tmpIguanaRPCAuth,
				'agent': passthru_agent,
				'method': 'passthru',
				'function': 'getinfo',
				'hex': ''
			};
	
	console.log(ajax_data);
	$.ajax({
		async: false,
		type: 'POST',
		data: JSON.stringify(ajax_data),
		url: 'http://127.0.0.1:7778',
		success: function(data, textStatus, jqXHR) {
			var AjaxOutputData = JSON.parse(data);
			console.log('== Data OutPut ==');
			console.log(AjaxOutputData);
			console.log(AjaxOutputData.error);

			if ( AjaxOutputData.errors != undefined ) {
				result.push('connected');
			} else if ( AjaxOutputData['error'].message = 'Activating best chain...' ) {
				result.push('activating');
			} else if ( AjaxOutputData.errors == undefined) {
				result.push('not active');
			} else {
				result.push(AjaxOutputData.errors);
			}
		},
		error: function(xhr, textStatus, error) {
			console.log('failed getting Coin History.');
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

function CheckIfWalletEncrypted() {
	var result = [],
			passthru_agent = getPassthruAgent(),
			tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			ajax_data = {
				'userpass': tmpIguanaRPCAuth,
				'agent': passthru_agent,
				'method': 'passthru',
				'function': 'walletlock',
				'hex': ''
			};
	
	console.log(ajax_data);
	$.ajax({
		async: false,
		type: 'POST',
		data: JSON.stringify(ajax_data),
		url: 'http://127.0.0.1:7778',
		success: function(data, textStatus, jqXHR) {
			var AjaxOutputData = JSON.parse(data);
			console.log('== Data OutPut ==');
			console.log(AjaxOutputData.error);
			
			if ( AjaxOutputData.errors != undefined ) {
				result.push('encrypted');
			} else {
				result.push(AjaxOutputData.error);
			}
		},
		error: function(xhr, textStatus, error) {
			console.log('failed getting Coin History.');
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

function KMD_getInfo_rtrn() {
	var result = [],
			extcoin = $('[data-extcoin]').attr('data-extcoin'),
			passthru_agent = getPassthruAgent(),
			tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			ajax_data = {
				'userpass': tmpIguanaRPCAuth,
				'agent': passthru_agent,
				'method': 'passthru',
				'function': 'getinfo',
				'hex': ''
			};

	$.ajax({
		async: false,
		type: 'POST',
		data: JSON.stringify(ajax_data),
		url: 'http://127.0.0.1:7778',
		success: function(data, textStatus, jqXHR) {
			var AjaxOutputData = JSON.parse(data);

			if ( AjaxOutputData.errors != undefined ) {
				result.push(AjaxOutputData);
			} else if ( AjaxOutputData['error'].message = 'Activating best chain...' ) {
				result.push('activating');
			} else if ( AjaxOutputData.errors == undefined) {
				result.push('not active');
			} else {
				result.push(AjaxOutputData.errors);
			}
		},
		error: function(xhr, textStatus, error) {
			console.log('failed getting Coin History.');
			console.log(xhr.statusText);
			if ( xhr.readyState == 0 ) {
				Iguana_ServiceUnavailable();
			}
			console.log(textStatus);
			console.log(error);
		}
	});

	return result[0];
}

function KMD_ProgressBar() {
	var result = [],
			extcoin = $('[data-extcoin]').attr('data-extcoin'),
			getinfotmp = KMD_getInfo_rtrn();

	if ( getinfotmp == 'activating') {
		$('span[data-extcoin="' + extcoin + '"][id="extcoin-sync-percent"]').text('Activating...');
	} else {
		var sync_percent = parseFloat(parseInt(getinfotmp.blocks, 10) * 100) / parseInt(getinfotmp.longestchain, 10);

		$('div[data-extcoin="' + extcoin + '"][id="extcoin-sync"]').width(parseFloat(sync_percent).toFixed(2) + '%');
		$('span[data-extcoin="' + extcoin + '"][id="extcoin-sync-percent"]').text(parseFloat(sync_percent).toFixed(2) + '%');
		$('span[data-extcoin="' + extcoin + '"][id="extcoin-synced-blocks"]').text(getinfotmp.blocks);
		$('span[data-extcoin="' + extcoin + '"][id="extcoin-longestchain"]').text(getinfotmp.longestchain);
		$('span[data-extcoin="' + extcoin + '"][id="extcoin-connections"]').text(getinfotmp.connections);
	}
}