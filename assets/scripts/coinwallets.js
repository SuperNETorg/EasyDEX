// DOM Ready =============================================================
$(document).ready(function() {
	// By default set USD as Fiat Currency if there's none selected already.
	if ( localStorage.getItem('EasyDEX_FiatCurrency') == null ) {
		var FiatCurrency = 'USD';
		localStorage.setItem('EasyDEX_FiatCurrency', FiatCurrency);
	}
});

// Functions =============================================================

var fiat_symbol;
function getCurrency() {
	if (localStorage.getItem('EasyDEX_FiatCurrency') == 'USD' ||
			localStorage.getItem('EasyDEX_FiatCurrency') == 'NZD' ||
			localStorage.getItem('EasyDEX_FiatCurrency') == 'AUD' ) {
		fiat_symbol = '$';
	}
	if ( localStorage.getItem('EasyDEX_FiatCurrency') == 'INR' ) {
		fiat_symbol = '₹';
	}
	if ( localStorage.getItem('EasyDEX_FiatCurrency') == 'CNY' || localStorage.getItem('EasyDEX_FiatCurrency') == 'JPY' ) {
		fiat_symbol = '¥';
	}
	if ( localStorage.getItem('EasyDEX_FiatCurrency') == 'GBP' ) {
		fiat_symbol = '£';
	}
	if ( localStorage.getItem('EasyDEX_FiatCurrency') == 'EUR' ) {
		fiat_symbol = '€';
	}	
}

function sendCurrency(val) {
	console.log(val);
	$('#mdl_currency_coin').text(val.currency);
	$('#mdl_currency_balance').text($('span[data-currency="' + val.currency + '"][id="currency-balance"]').text());
	//console.log($('span[data-currency="' + val.currency + '"][id="currency-balance"]').text());
	$('#mdl_currency_sendto').attr('placeholder', 'Enter ' + val.currency + ' address');
	$('#mdl_currency_amount_label').text(val.currency);
	$('#mdl_currency_total_coinname').text(val.currency);

	var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			getinfoValues = {
				'userpass': tmpIguanaRPCAuth,
				'coin': val.currency,
				'agent': 'bitcoinrpc',
				'method': 'getinfo'
			};
	$.ajax({
			type: 'POST',
			data: JSON.stringify(getinfoValues),
			url: 'http://127.0.0.1:7778',
			success: function(data, textStatus, jqXHR) {
				var CoinInfoData = JSON.parse(data),
						label_color = '',
						label_icon = '',
						wallettblContent = '';

				$('#mdl_currency_fee').val(CoinInfoData.txfee);
			},
			error: function(xhr, textStatus, error) {
				console.log('failed getting Coin History.');
				console.log(xhr.statusText);
				console.log(textStatus);
				console.log(error);
			}
	});

}

function ReceiveCurrency(rec_val) {
	console.log(rec_val);
	if ( sessionStorage.getItem('IguanaActiveAccount') === null ) {
		console.log('=> No wallet logged in. No need to get Rates.');
	} else {
		var tmp_activhndl = JSON.parse(sessionStorage.getItem('IguanaActiveAccount')),
				coinAddr = JSON.parse(tmp_activhndl)[rec_val.currency];
		$('#mdl_receive_coin_name').text(rec_val.currency)
		$('#mdl_receive_coin_addr').text('');
		$('#mdl_receive_coin_addr').val(coinAddr);
		$('#mdl_receive_coin_addr_qr_code').text('');
		$('#mdl_receive_coin_addr_qr_code').qrcode({
			width: 120,
			height: 120,
			text: coinAddr
		});
	}

	var clipboard = new Clipboard('.btn');
		clipboard.on('success', function(e) {
			console.log(e);
		});
		clipboard.on('error', function(e) {
			console.log(e);
		});
}

$('#mdl_currency_amount').keyup(function() {
	var sum_val1 = parseFloat($('#mdl_currency_amount').val()),
			sum_val2 = parseFloat($('#mdl_currency_fee').val()),
			total_of_currency_fee = sum_val1 + sum_val2,
			currency_fiat_value = '',
			fiat_symbol = '',
			mdl_send_btn = $('#mdl_currency_send_btn');

	if ( $('#mdl_currency_total_coinname').text() == 'BTCD' ) {
		currency_fiat_value = localStorage.getItem('EasyDEX_BTCD_Fiat_pair_value');
	}
	if ( $('#mdl_currency_total_coinname').text() == 'BTC' ) {
		currency_fiat_value = localStorage.getItem('EasyDEX_BTC_Fiat_pair_value');
	}

	getCurrency();
	var total_of_currency_fiat = total_of_currency_fee * currency_fiat_value;
	//console.log($('#mdl_currency_amount').val());
	//console.log(total_of_currency_fiat);
	$('#mdl_currency_total_value').text(total_of_currency_fee.toFixed(8));
	$('#mdl_currency_total_fiat_value').text(fiat_symbol+total_of_currency_fiat.toFixed(2));

	if ($('#mdl_currency_amount').val() != '' && $('#mdl_currency_sendto') != '' && $('#mdl_currency_fee') != '' ) {
		mdl_send_btn.removeClass('disabled');
		mdl_send_btn.attr('data-dismiss', 'modal');
		mdl_send_btn.attr('data-target', '#SendCoinModelStep2');
		mdl_send_btn.attr('onclick', 'ConfirmsendCurrency($(this).data())')
	} else {
		mdl_send_btn.addClass('disabled');
		mdl_send_btn.removeAttr('data-dismiss');
		mdl_send_btn.removeAttr('data-target');
		mdl_send_btn.removeAttr('onclick');
	}
});

$('#mdl_currency_fee').keyup(function() {
	var sum_val1 = parseFloat($('#mdl_currency_amount').val())
	var sum_val2 = parseFloat($('#mdl_currency_fee').val())
	var total_of_currency_fee = sum_val1 + sum_val2;
	var currency_fiat_value = '';
	var fiat_symbol = '';

	if ( $('#mdl_currency_total_coinname').text() == 'BTCD' ) {
		currency_fiat_value = localStorage.getItem('EasyDEX_BTCD_Fiat_pair_value');
	}
	if ( $('#mdl_currency_total_coinname').text() == 'BTC' ) {
		currency_fiat_value = localStorage.getItem('EasyDEX_BTC_Fiat_pair_value');
	}

	getCurrency();

	var total_of_currency_fiat = total_of_currency_fee * currency_fiat_value;
	$('#mdl_currency_total_value').text(total_of_currency_fee.toFixed(8));
	$('#mdl_currency_total_fiat_value').text(fiat_symbol + total_of_currency_fiat.toFixed(2));
});

function CurrencyMdlBtnClean() {
	$('#mdl_currency_sendto').val('');
	$('#mdl_currency_amount').val('');
	$('#mdl_currency_total_value').text('0.00');
	$('#mdl_currency_total_fiat_value').text('0.00');
}

function ReceiveCoinMdlBtnClean() {
	$('#mdl_receive_coin_addr').text('');
	$('#mdl_receive_coin_addr_qr_code').text('');
}

function ConfirmsendCurrency(confirm_val) {
	var confirm_coinname = $('#mdl_currency_total_coinname').text(),
			confirm_selected_from_addr = $('div[data-currency="' + confirm_coinname + '"][id="currency-addr"]').text(),
			confirm_send_amount_fiat = '',
			confirm_send_amount_fee_fiat = '',
			currency_fiat_value = '',
			fiat_symbol = '';

	if ( $('#mdl_currency_total_coinname').text() == 'BTCD' ) {
		currency_fiat_value = localStorage.getItem('EasyDEX_BTCD_Fiat_pair_value');
	}
	if ( $('#mdl_currency_total_coinname').text() == 'BTC' ) {
		currency_fiat_value = localStorage.getItem('EasyDEX_BTC_Fiat_pair_value');
	}

	getCurrency();

	$('#mdl_confirm_currency_sendto_addr').text($('#mdl_currency_sendto').val());
	$('#mdl_confirm_currency_send_amount').text($('#mdl_currency_amount').val());
	$('#mdl_confirm_currency_coinname').text(confirm_coinname);
	$('#mdl_confirm_currency_send_amount_fiat').text(fiat_symbol + ($('#mdl_confirm_currency_send_amount').text() * currency_fiat_value).toFixed(2));
	$('#mdl_confirm_currency_send_fee').text($('#mdl_currency_fee').val());
	$('#mdl_confirm_currency_coinname_fee').text(confirm_coinname);
	$('#mdl_confirm_currency_send_fee_fiat').text(fiat_symbol + ($('#mdl_confirm_currency_send_fee').text() * currency_fiat_value).toFixed(2));
	$('#mdl_confirm_currency_sendfrom_addr').text(confirm_selected_from_addr);
	$('#mdl_confirm_currency_sendfrom_total_dedcut').text($('#mdl_currency_total_value').text());
	$('#mdl_confirm_currency_coinname_total').text(confirm_coinname);
	$('#mdl_confirm_currency_sendfrom_total_deduct_fiat').text($('#mdl_currency_total_fiat_value').text());
}

function ExecuteSendCurrencyAPI() {
	console.log('==> SendToAddress API Executed <==');

	var confirm_coinname_to_send = $('#mdl_confirm_currency_coinname').text(),
			confirm_send_amount = $('#mdl_confirm_currency_sendfrom_total_dedcut').text(),
			confirm_sendto_address = $('#mdl_confirm_currency_sendto_addr').text();

	// Get parameters values from confirm dialog and send currency
	var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			sendtoaddrvalues = {
				'userpass': tmpIguanaRPCAuth,
				'coin': confirm_coinname_to_send,
				'method': 'sendtoaddress',
				'params': [
					confirm_sendto_address,
					confirm_send_amount,
					'EasyDEX',
					'EasyDEXTransaction'
				]
			};

	console.log(sendtoaddrvalues);
	$.ajax({
		type: 'POST',
		data: JSON.stringify(sendtoaddrvalues),
		url: 'http://127.0.0.1:7778',
		success: function(data, textStatus, jqXHR) {
			var SendToAddrData = JSON.parse(data),
					SendToAddrTxDataTitle;

			console.log('== Data OutPut ==');
			console.log(SendToAddrData);

			if ( SendToAddrData.error != 'couldnt create rawtx' ) {
				SendToAddrTxDataTitle = 'Transaction Failed';
			}
			if ( SendToAddrData.sendrawtransaction == 'success' ) {
				SendToAddrTxDataTitle = 'Transaction Successful';
			}

			var SentToAddrTxData = '<font style="font-size: 13px; font-family: Menlo,Monaco,Consolas,Courier New,monospace">' +
															 '<font style="font-weight: 800">' +
															 	 '<b>Transaction ID:</b>'
															 '</font>' +
																SendToAddrData.result +
															'</font>';
			bootbox.dialog({
				title: SendToAddrTxDataTitle,
				message: SentToAddrTxData
			});

			if ( SendToAddrData.sendrawtransaction == 'success' ) {
				toastr.success('Transaction Sent', 'Transaction Notification')
			}
		},
		error: function(xhr, textStatus, error) {
			console.log('failed getting Coin History.');
			console.log(xhr.statusText);
			console.log(textStatus);
			console.log(error);
			toastr.error('Unable to complete transaction', 'Transaction Notification')
		}
	});

	// Clear Send Dialog values and set them to blank
	$('#mdl_currency_coin').text('');
	$('#mdl_currency_balance').text('');
	$('#mdl_currency_amount_label').text('');
	$('#mdl_currency_total_coinname').text('');

	// Clear Confirm Dialog values and set them to blank
	$('#mdl_confirm_currency_sendto_addr').text('');
	$('#mdl_confirm_currency_send_amount').text('');
	$('#mdl_confirm_currency_coinname').text('');
	$('#mdl_confirm_currency_send_amount_fiat').text('');
	$('#mdl_confirm_currency_send_fee').text('');
	$('#mdl_confirm_currency_coinname_fee').text('');
	$('#mdl_confirm_currency_send_fee_fiat').text('');
	$('#mdl_confirm_currency_sendfrom_addr').text('');
	$('#mdl_confirm_currency_sendfrom_total_dedcut').text('');
	$('#mdl_confirm_currency_coinname_total').text('');
	$('#mdl_confirm_currency_sendfrom_total_deduct_fiat').text('');

	// Clean send dialog button fields
	CurrencyMdlBtnClean();
}

// Used this function to set desired Fiat Currency, selected from top menu bar of EasyDEX UI
function WalletFiatCurrency(fiat_currency_value) {
	var FiatCurrency = fiat_currency_value.fiatcurrency;
	localStorage.setItem('EasyDEX_FiatCurrency', FiatCurrency);
}

function Iguana_rmd160conv(rmd160conv_data) {
	// comment
	var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth');
		var ajax_data = {
			'userpass': tmpIguanaRPCAuth,
			'agent': 'SuperNET',
			'method': 'rmd160conv',
			'rmd160': rmd160conv_data.rmd160,
			'coin': rmd160conv_data.coin
		};

	console.log(ajax_data);
	$.ajax({
		type: 'POST',
		data: JSON.stringify(ajax_data),
		url: 'http://127.0.0.1:7778',
		success: function(data, textStatus, jqXHR) {
			var AjaxOutputData = JSON.parse(data);
			console.log('== Data OutPut ==');
			console.log(AjaxOutputData);
			return AjaxOutputData;
		},
		error: function(xhr, textStatus, error) {
			console.log('failed getting Coin History.');
			console.log(xhr.statusText);
			console.log(textStatus);
			console.log(error);
		}
	});
}