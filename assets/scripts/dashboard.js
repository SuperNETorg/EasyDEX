var RunTotalFiatValue = '',
		ExecuteShowCoinHistory = '',
		active_edexcoin = '',
		tmp_send_to_addr = '',
		tmp_send_total_amount = '',
		edexcoin_send_form_validator = '';

var Dashboard = function() {
	toastr.options = {
		'closeButton': true,
		'debug': false,
		'positionClass': 'toast-top-right',
		'showDuration': '15000',
		'hideDuration': '1000',
		'timeOut': '15000',
		'extendedTimeOut': '1000',
		'showEasing': 'swing',
		'hideEasing': 'linear',
		'showMethod': 'fadeIn',
		'hideMethod': 'fadeOut'
	}

	var handle_edex_wallet = function() {
		$('#btn_edexcoin_wallet_dashboard').click(function() {
			console.log('edex wallet dashbaord button clicked...');
			console.log($(this).data());
		});
	}

	var handle_edex_dashboard = function() {
		$('.btn_refresh_edexcoin_dashboard').click(function() {
			$( '#btn_edexcoin_dashboard' ).trigger( 'click' );
		});

		$('#btn_edexcoin_dashboard').click(function() {
			$('#btn_edexcoin_dashboard').hide();
			$('#btn_edexcoin_send').show();
			$('#btn_edexcoin_recieve').show();

			var active_edexcoin = $('[data-edexcoin]').attr('data-edexcoin');

			$('#edexcoin_getbalance_interest').hide();
			$('#edexcoin_getbalance_total_interest').hide();
			$('#edexcoin_getbalance_t').removeClass( 'col-lg-4' ).addClass( 'col-lg-12' );
			$('#edex_interest_balance').text('-');
			$('#edex_total_balance_interest').text('-');
			$('#edex_total_balance').text('-');
			$('#edex_total_balance_coincode').text(active_edexcoin);

			if ( sessionStorage.getItem('edexTmpMode') === 'Full') {
				sessionStorage.setItem('edexTmpRefresh', 'start');
			}
			if ( /*sessionStorage.getItem('edexTmpMode') === 'Basilisk' ||*/ sessionStorage.getItem('edexTmpMode') === 'Native' ) {
				sessionStorage.setItem('edexTmpRefresh', 'stop');
			}
			$('#edexcoin_dashoard_section').show();
			$('#edexcoin_dashboardinfo').show();
			$('#edexcoin_send').hide();
			$('#edexcoin_recieve').hide();
			$('#edexcoin_recieve_section').hide();
			$('#edexcoin_settings').hide();

			var selected_coinmode = sessionStorage.getItem('edexTmpMode');
			if ( selected_coinmode == 'Basilisk' ) {
				getDEXGetBalance_cache(active_edexcoin).then(function(result) {
					//console.log(result)
					if ( result.interest !== undefined && active_edexcoin == 'KMD') {
						$('#edexcoin_getbalance_interest').show();
						$('#edexcoin_getbalance_total_interest').show();
						$('#edexcoin_getbalance_t').removeClass( 'col-lg-12' ).addClass( 'col-lg-4' );
						$('#edex_interest_balance').text(result.interest);
						$('#edex_total_balance_interest').text(result.totalbalance);
						$('#edex_total_interest_coincode').text(active_edexcoin);
						$('#edex_total_balance_interest_coincode').text(active_edexcoin);
					}

					if ( result.interest === undefined ) {
						$('#edexcoin_getbalance_interest').hide();
						$('#edexcoin_getbalance_total_interest').hide();
						$('#edexcoin_getbalance_t').removeClass( 'col-lg-4' ).addClass( 'col-lg-12' );
						$('#edex_interest_balance').text('-');
						$('#edex_total_balance_interest').text('-');
					}

					$('#edex_total_balance').text(result.total);
					$('#edex_total_balance_coincode').text(active_edexcoin);
				});
			} else {
				EDEXlistunspent(active_edexcoin).then(function(result) {
					//console.log(result)
					if (result[0] != undefined) {
						//console.log(result[0])
						if ( result[0].interest !== undefined ) {
							$('#edexcoin_getbalance_interest').show();
							$('#edexcoin_getbalance_total_interest').show();
							$('#edexcoin_getbalance_t').removeClass( 'col-lg-12' ).addClass( 'col-lg-4' );
							$('#edex_interest_balance').text(result[0].interest);
							$('#edex_total_balance_interest').text(result[0].totalbalance);
							$('#edex_total_interest_coincode').text(active_edexcoin);
							$('#edex_total_balance_interest_coincode').text(active_edexcoin);
						}

						if ( result[0].interest === undefined ) {
							$('#edexcoin_getbalance_interest').hide();
							$('#edexcoin_getbalance_total_interest').hide();
							$('#edexcoin_getbalance_t').removeClass( 'col-lg-4' ).addClass( 'col-lg-12' );
							$('#edex_interest_balance').text('-');
							$('#edex_total_balance_interest').text('-');
						}

						$('#edex_total_balance').text(result[0].total);
						$('#edex_total_balance_coincode').text(active_edexcoin);
					} else {
						$('#edex_total_balance').text('0');
					}
				});
			}

			EdexfillTxHistory(active_edexcoin);
			$('.edexcoin-send-form')[0].reset();
		});
	}

	var handle_edex_send = function() {
		$('#btn_edexcoin_send').click(function() {
			$('#btn_edexcoin_dashboard').show();
			$('#btn_edexcoin_send').hide();
			$('#btn_edexcoin_recieve').show();
			sessionStorage.setItem('edexTmpRefresh', 'stop');
			$('#edexcoin_dashboardinfo').hide();
			$('#edexcoin_send').show();
			$('#edexcoin_recieve').hide();
			$('#edexcoin_recieve_section').hide();
			$('#edexcoin_settings').hide();

			//Disabled dropdown list address in EasyDEX's main send option, as it's using sendtoaddress at the moment.
			//This option can be enabled later for other section where user can select particular address to send funds from.
			/*var edexcoin_addr_list_with_balance = EDEXlistunspent(active_edexcoin);
			console.log(edexcoin_addr_list_with_balance);
			var tmpoptions = '';
			tmpoptions += '<option> - Select Address - </option>';
			$.each(edexcoin_addr_list_with_balance, function(index) {
				tmpoptions += '<option value="' + edexcoin_addr_list_with_balance[index].addr + '" data-total="' + edexcoin_addr_list_with_balance[index].total.toFixed(8) + '">[ ' + edexcoin_addr_list_with_balance[index].total.toFixed(8) + ' KMD ] &emsp;' + edexcoin_addr_list_with_balance[index].addr + '</option>';
				$('#edexcoin_send_from').html(tmpoptions);
			});

			$('.showedexcoinaddrs').selectpicker({ style: 'btn-info' });
			$('.showedexcoinaddrs').selectpicker('refresh');*/
			//clearEdexSendFieldData();
			$('.edexcoin-send-form')[0].reset();
			var active_edexcoin = $('[data-edexcoin]').attr('data-edexcoin');
			var selected_coinmode = sessionStorage.getItem('edexTmpMode')
			if ( selected_coinmode == 'Full' ) {
				EDEXgetinfo(active_edexcoin).then(function(result) {
					$('#edexcoin_fee').val(result.kbfee);
				});
			}
		});

		$('.showedexcoinaddrs').on('change', function() {
			var selected = $(this).find('option:selected').val();
		});

		$('#edexcoin_amount').keyup(function() {
			var sum_val1 = parseFloat($('#edexcoin_amount').val()),
					sum_val2 = parseFloat($('#edexcoin_fee').val()),
					total_minus_currency_fee = sum_val1 - sum_val2,
					mdl_send_btn = $('#edexcoin_send_coins_btn');

			$('#edexcoin_total_value').text(total_minus_currency_fee.toFixed(8));

			if ($('#edexcoin_send_from').val() != '- Select Transparent or Private KMD Address -' &&
					$('#edexcoin_amount').val() != '' &&
					$('#edexcoin_sendto') != '' &&
					$('#edexcoin_fee') != '' ) {
				mdl_send_btn.removeClass('disabled');
				//mdl_send_btn.attr('data-dismiss','modal');
				//mdl_send_btn.attr('data-target','#SendCoinModelStep2');
			} else {
				mdl_send_btn.addClass('disabled');
				mdl_send_btn.removeAttr('data-dismiss');
				mdl_send_btn.removeAttr('data-target');
			}
		});

		$('#edexcoin_fee').keyup(function() {
			var sum_val1 = parseFloat($('#edexcoin_amount').val()),
					sum_val2 = parseFloat($('#edexcoin_fee').val()),
					total_minus_currency_fee = sum_val1 - sum_val2,
					mdl_send_btn = $('#edexcoin_send_coins_btn');

			//console.log($('#edexcoin_amount').val());
			$('#edexcoin_total_value').text(total_minus_currency_fee.toFixed(8));

			if ($('#edexcoin_send_from').val() != '- Select Transparent or Private KMD Address -' &&
					$('#edexcoin_amount').val() != '' &&
					$('#edexcoin_sendto') != '' &&
					$('#edexcoin_fee') != '' ) {
				mdl_send_btn.removeClass('disabled');
				//mdl_send_btn.attr('data-dismiss','modal');
				//mdl_send_btn.attr('data-target','#SendCoinModelStep2');
			} else {
				mdl_send_btn.addClass('disabled');
				mdl_send_btn.removeAttr('data-dismiss');
				mdl_send_btn.removeAttr('data-target');
			}
		});

		edexcoin_send_form_validator = $('.edexcoin-send-form').validate({
			// errorElement: 'span', //default input error message container
			// errorClass: 'help-block', // default input error message class
			// focusInvalid: false, // do not focus the last invalid input
			rules: {
				edexcoin_send_from: {
					required: true
				},
				edexcoin_sendto: {
					required: true
				},
				edexcoin_amount: {
					required: true
				},
				edexcoin_fee: {
					required: true
				},
				edexcoin_total_value: {
					required: true
				}
			},

			messages: {
				edexcoin_send_from: {
					required: 'From Address is required.'
				},
				edexcoin_sendto: {
					required: 'To Address is required.'
				},
				edexcoin_amount: {
					required: 'Please enter amount to send.'
				},
				edexcoin_fee: {
					required: 'Make sure you have fee entered. Default value is 0.0001.'
				},
				edexcoin_total_value: {
					required: 'Make sure you have both amount and fee entered to calculate final total.'
				}
			},

			submitHandler: function(form) {
				NProgress.done(true);
				NProgress.configure({
						template: '<div class="bar nprogress-bar-header nprogress-bar-info" role="bar"></div>' +
											'<div class="spinner" role="spinner">' +
												'<div class="spinner-icon"></div>' +
											'</div>'
				});
				NProgress.start();

				console.log('Sent control here after clicked in form...');
				EDEXMainAddr($('[data-edexcoin]').attr('data-edexcoin')).then(function(result) {
					$('#mdl_confirm_currency_sendfrom_addr').text(result);
				});
				$('#mdl_confirm_currency_sendto_addr').text($('#edexcoin_sendto').val());
				$('#mdl_confirm_currency_send_amount').text($('#edexcoin_amount').val());
				$('#mdl_confirm_currency_coinname').text($('[data-edexcoin]').attr('data-edexcoin'));
				$('#mdl_confirm_currency_send_fee').text($('#edexcoin_fee').val());
				$('#mdl_confirm_currency_coinname_fee').text($('[data-edexcoin]').attr('data-edexcoin'));
				$('#mdl_confirm_currency_sendfrom_total_dedcut').text($('#edexcoin_total_value').text());
				$('#mdl_confirm_currency_coinname_total').text($('[data-edexcoin]').attr('data-edexcoin'));

				console.log('==> Before confirming tx to send');
				console.log($('[data-edexcoin]').attr('data-edexcoin'));
				console.log($('#edexcoin_sendto').val());
				console.log($('#edexcoin_total_value').text());

				var active_edexcoin = $('[data-edexcoin]').attr('data-edexcoin'),
						tmp_send_to_addr = $('#edexcoin_sendto').val(),
						tmp_send_total_amount = $('#edexcoin_total_value').text();
				$('#edexcoin-send-screen').hide();
				$('#edexcoin-send-confirm-screen').show();
				$('#edexcoin_send_step_1').removeClass( 'current' ).addClass( '' );
				$('#edexcoin_send_step_2').removeClass( '' ).addClass( 'current' );
				$('#edexcoin_send_step_3').removeClass( 'current' ).addClass( '' );

				NProgress.done();
			}
		});

		$('#edexcoin_send_coins_btn').click(function() {
			$('#edexcoin_send_coins_btn').prop('disabled', true);
			console.log('==> After confirming tx to send')
			var active_edexcoin = $('[data-edexcoin]').attr('data-edexcoin'),
					tmp_send_to_addr = $('#edexcoin_sendto').val(),
					tmp_send_total_amount = $('#edexcoin_total_value').text();
			console.log(active_edexcoin);
			console.log(tmp_send_to_addr);
			console.log(tmp_send_total_amount);

			var edexcoin_sendto_result_tbl = '';
			edexcoin_sendto_result_tbl += '<tr class="info">' +
																			'<td>Info</td>' +
																			'<td>The transaction submitted is processing. Once processed the transaction details will be displayed here.</td>' +
																		'</tr>';
			$('#edexcoin_sendto_result tbody').html(edexcoin_sendto_result_tbl);
			$('#edexcoin_send_coins_anothertx_btn').hide();

			var tmp_json_data = {
				'coin': active_edexcoin,
				'sendtoaddr': tmp_send_to_addr,
				'amount': tmp_send_total_amount
			};
			console.log(tmp_json_data);
			EDEXSendToAddr(tmp_json_data);
			$('.edexcoin-send-form')[0].reset();
			$('#edexcoin_total_value').text('0.000');
			$('#edexcoin-send-confirm-screen').hide();
			$('#edexcoin-send-txdetails-screen').show();
			edexcoin_send_form_validator.resetForm();
			$('#edexcoin_send_step_1').removeClass( 'current' ).addClass( '' );
			$('#edexcoin_send_step_2').removeClass( 'current' ).addClass( '' );
			$('#edexcoin_send_step_3').removeClass( '' ).addClass( 'current' );
		});

		$('#edexcoin_send_coins_back_btn').click(function() {
			$('#edexcoin-send-confirm-screen').hide();
			$('#edexcoin-send-txdetails-screen').hide();
			$('#edexcoin-send-screen').show();
			var active_edexcoin = '',
					tmp_send_to_addr = '',
					tmp_send_total_amount = '';
			edexcoin_send_form_validator.resetForm();
			$('#edexcoin_send_step_1').removeClass( '' ).addClass( 'current' );
			$('#edexcoin_send_step_2').removeClass( 'current' ).addClass( '' );
			$('#edexcoin_send_step_3').removeClass( 'current' ).addClass( '' );
		});

		$('#edexcoin_send_coins_anothertx_btn').click(function() {
			$( '#edexcoin_send_coins_back_btn' ).trigger( 'click' );
			var active_edexcoin = '',
					tmp_send_to_addr = '',
					tmp_send_total_amount = '';
			$('#edexcoin_send_coins_btn').prop('disabled', false);
			edexcoin_send_form_validator.resetForm();
		});

		$('.edexcoin_sendto_result').on('click', '.edexcoin_sendto_output_result', function(e) {
			var selected_coin = $(this).data('edexcoin'),
					selected_coin_mode = sessionStorage.getItem('edexTmpMode');
			$( '#nav-iguana-atomic-explorer' ).trigger( 'click' );
			$('#atomic_explorer_select_coin_options option[value=' + selected_coin + ']').attr('selected', 'selected');
			if ( selected_coin_mode == 'Full') {
				$('#atomic_explorer_select_command_options option[value=gettransaction]').attr('selected', 'selected');
			}
			if ( selected_coin_mode == 'Basilisk') {
				$('#atomic_explorer_select_command_options option[value=dex_gettransaction]').attr('selected', 'selected');
			}
			$('#atomic_explorer_input_data').val($(this).data('sendtotxresult'));
			$( '#atomic_explorer_getcoinpeers_btn' ).trigger( 'click' );
		});
	}

	var handle_edex_recieve = function() {
		$('#btn_edexcoin_recieve').click(function() {
			$('#btn_edexcoin_dashboard').show();
			$('#btn_edexcoin_send').show();
			$('#btn_edexcoin_recieve').hide();
			var active_edexcoin = $('[data-edexcoin]').attr('data-edexcoin');
			sessionStorage.setItem('edexTmpRefresh', 'stop');
			$('#edexcoin_dashboardinfo').hide();
			$('#edexcoin_dashoard_section').hide();
			$('#edexcoin_send').hide();
			$('#edexcoin_recieve').show();
			$('#edexcoin_recieve_section').show();
			$('#edexcoin_settings').hide();
			EdexListAllAddr(active_edexcoin);
			$('.edexcoin-send-form')[0].reset();
		});

		$('#edexcoin_get_new_addr').click(function() {
			var active_edexcoin = $('[data-edexcoin]').attr('data-edexcoin');
			console.log('get new T address button clicked...');
			EdexListAllAddr(active_edexcoin);
			toastr.info('Receiving Address list updated', 'Wallet Notification');
		});
	};

	var handleWalletWidgets = function() {
		var walletDivContent = '',
				AddColumnDiv = 0;

		$.each([
			'native',
			'basilisk',
			'full'
			], function( index, value ) {
				var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
						ajax_data = {
							'userpass': tmpIguanaRPCAuth,
							'agent': 'InstantDEX',
							'method': 'allcoins'
						};

				$.ajax({
					type: 'POST',
					data: JSON.stringify(ajax_data),
					url: 'http://127.0.0.1:7778',
					success: function(data, textStatus, jqXHR) {
						var AllcoinsDataOutput = JSON.parse(data);
						$.each(AllcoinsDataOutput[value], function(index) {
							var coinlogo = '',
									coinname = '',
									modecode = '',
									modetip = '',
									modecolor = '';

              switch (value) {
                case 'native':
                  modecode = 'Native';
                  modetip = 'Native';
                  modecolor = 'primary';
                  break;
                case 'basilisk':
                  modecode = 'Basilisk';
                  modetip = 'Basilisk';
                  modecolor = 'info';
                  break;
                case 'full':
                  modecode = 'Full';
                  modetip = 'Full';
                  modecolor = 'success';
                  break;
                case 'virtual':
                  modecode = 'Virtual';
                  modetip = 'Virtual';
                  modecolor = 'danger';
                  break;
                case 'notarychains':
                  modecode = 'Notarychains';
                  modetip = 'Notarychains';
                  modecolor = 'dark';
                  break;
              }

              switch (AllcoinsDataOutput[value][index]) {
                case 'BTC':
                  coinlogo = 'bitcoin';
                  coinname = 'Bitcoin';
                  break;
                case 'BTCD':
                  coinlogo = 'bitcoindark';
                  coinname = 'BitcoinDark';
                  break;
                case 'LTC':
                  coinlogo = 'litecoin';
                  coinname = 'Litecoin';
                  break;
                case 'VPN':
                  coinlogo = 'vpncoin';
                  coinname = 'VPNcoin';
                  break;
                case 'SYS':
                  coinlogo = 'syscoin';
                  coinname = 'Syscoin';
                  break;
                case 'ZEC':
                  coinlogo = 'zcash';
                  coinname = 'Zcash';
                  break;
                case 'NMC':
                  coinlogo = 'namecoin';
                  coinname = 'Namecoin';
                  break;
                case 'DEX':
                  coinlogo = 'dex';
                  coinname = 'DEX';
                  break;
                case 'DOGE':
                  coinlogo = 'dogecoin';
                  coinname = 'Dogecoin';
                  break;
                case 'DGB':
                  coinlogo = 'digibyte';
                  coinname = 'Digibyte';
                  break;
                case 'MZC':
                  coinlogo = 'mazacoin';
                  coinname = 'Mazacoin';
                  break;
                case 'UNO':
                  coinlogo = 'unobtanium';
                  coinname = 'Unobtanium';
                  break;
                case 'ZET':
                  coinlogo = 'zetacoin';
                  coinname = 'Zetacoin';
                  break;
                case 'KMD':
                  coinlogo = 'komodo';
                  coinname = 'Komodo';
                  break;
                case 'BTM':
                  coinlogo = 'bitmark';
                  coinname = 'Bitmark';
                  break;
                case 'CARB':
                  coinlogo = 'carboncoin';
                  coinname = 'Carboncoin';
                  break;
                case 'ANC':
                  coinlogo = 'anoncoin';
                  coinname = 'AnonCoin';
                  break;
                case 'FRK':
                  coinlogo = 'franko';
                  coinname = 'Franko';
                  break;
                case 'SUPERNET':
                  coinlogo = 'SUPERNET';
                  coinname = 'SUPERNET';
                  break;
                case 'REVS':
                  coinlogo = 'REVS';
                  coinname = 'REVS';
                  break;
                case 'WIRELESS':
                  coinlogo = 'WIRELESS';
                  coinname = 'WIRELESS';
                  break;
                case 'USD':
                  coinlogo = 'USD';
                  coinname = 'USD';
                  break;
              }

							walletDivContent += '<!-- Wallet Widget ' + AllcoinsDataOutput[value][index] + ' -->';
							walletDivContent += '<div class="list-group-item col-xlg-6 col-lg-12 wallet-widgets-info" data-edexcoincode="' + AllcoinsDataOutput[value][index] + '">';
								walletDivContent += '<div class="widget widget-shadow">';
									walletDivContent += '<div class="widget-content text-center bg-white padding-20 edexcoin-logo" data-edexcoincode="' + AllcoinsDataOutput[value][index] + '" data-edexcoinmodecode="' + modecode + '" data-edexcoinname="' + coinname + '">';
										walletDivContent += '<a class="avatar margin-bottom-5" href="javascript:void(0)" id="edexcoin-logo">';
											walletDivContent += '<img class="img-responsive" src="assets/images/cryptologo/' + coinlogo + '.png" alt="' + coinname + '"/>';
											walletDivContent += '<span class="badge up badge-' + modecolor + '" id="basfull" data-edexcoincode="' + AllcoinsDataOutput[value][index] + '" data-toggle="tooltip" data-placement="top" data-original-title="' + modetip + '">' + modecode + '</span>';
										walletDivContent += '</a>';
										walletDivContent += '<div class="coin-name">' + coinname + '</div>';
									walletDivContent += '</div>';
								walletDivContent += '</div>';
							walletDivContent += '</div>';
							walletDivContent += '<!-- End Wallet Widget ' + AllcoinsDataOutput[value][index] + ' -->';

							$('.wallet-widgets-row').html(walletDivContent);
							$('.scrollbar-dynamic').scrollbar(); //Make sure widget-body has scrollbar for transactions history
							$('[data-toggle="tooltip"]').tooltip(); //Make sure tooltips are working for wallet widgets and anywhere else in wallet.
							edexCoinBtnAction();
						});
					},
					error: function(xhr, textStatus, error) {
						console.log('failed starting BitcoinDark.');
						console.log(xhr.statusText);
						if ( xhr.readyState == 0 ) {
							Iguana_ServiceUnavailable();
						}
						console.log(textStatus);
						console.log(error);
						if (xhr.readyState == '0' ) {
							toastr.error('Unable to connect to Iguana', 'Account Notification');
						}
					}
				});
		});
	}

	var handleWalletWidgetBtns = function() {
		$('#addcoin_mdl_native_mode').prop('disabled', true);
		$('#addcoin_mdl_basilisk_mode').prop('disabled', true);
		$('#addcoin_mdl_full_mode').prop('disabled', true);
		$('#addcoin_mdl_full_mode').prop('checked', false);

		$('.mdl_addcoin_done_btn').click(function(){
			ExecuteAddCoinFn();
		});

		$( '#addcoin_select_coin_mdl_options' ).change(function() {
			var tmp_coin_val = $('#addcoin_select_coin_mdl_options').val();

			if (tmp_coin_val !== 'KMD' || tmp_coin_val !== 'KMD' ) {
				$('#addcoin_mdl_native_mode').prop('disabled', true);
				$('#addcoin_mdl_basilisk_mode').prop('disabled', true);
				$('#addcoin_mdl_full_mode').prop('disabled', false);
				$('#addcoin_mdl_full_mode').prop('checked', true);
			}
			if (tmp_coin_val == 'KMD') {
				$('#addcoin_mdl_native_mode').prop('disabled', false);
				$('#addcoin_mdl_basilisk_mode').prop('disabled', false);
				$('#addcoin_mdl_full_mode').prop('disabled', false);
				$('#addcoin_mdl_basilisk_mode').prop('checked', true);
			}
			if (tmp_coin_val == 'SUPERNET' ||
					tmp_coin_val == 'REVS' ||
					tmp_coin_val == 'WIRELESS' ||
					tmp_coin_val == 'USD') {
					$('#addcoin_mdl_native_mode').prop('disabled', true);
					$('#addcoin_mdl_basilisk_mode').prop('disabled', false);
					$('#addcoin_mdl_full_mode').prop('disabled', true);
					$('#addcoin_mdl_basilisk_mode').prop('checked', true);
			}
			if (tmp_coin_val == 'BTC') {
				$('#addcoin_mdl_basilisk_mode').prop('disabled', false);
				$('#addcoin_mdl_native_mode').prop('disabled', true);
				$('#addcoin_mdl_full_mode').prop('disabled', false);
				$('#addcoin_mdl_basilisk_mode').prop('checked', true);
			}
		});
	}

	var handleBasiliskWalletActions = function() {
		$('.btn_edexcoin_dashboard_getnotaries').click(function() {
			var selected_coin = $(this).data('edexcoin');
			$( '#nav-iguana-atomic-explorer' ).trigger( 'click' );
			$('#atomic_explorer_select_coin_options option[value=' + selected_coin + ']').attr('selected', 'selected');
			$('#atomic_explorer_select_command_options option[value=dex_getnotaries]').attr('selected', 'selected');
			$( '#atomic_explorer_getcoinpeers_btn' ).trigger( 'click' );
		});

		$('.btn_edexcoin_dashboard_register').click(function() {
			var selected_coin = $(this).data('edexcoin');
			EDEXMainAddr(selected_coin).then(function(result){
				Iguana_DEXImportAllWalletAddr(selected_coin);
			});
		});

		$('.btn_edexcoin_dashboard_fetchdata').click(function() {
			var selected_coin = $(this).data('edexcoin');
			Shepherd_CheckBasiliskCacheData(selected_coin).then(function(result){
				console.log(result)
				console.log(result.coin)
				var call_data = {"allcoins": false,"coin":selected_coin,"calls":"listtransactions:getbalance"}
				console.log(call_data)

				Shepherd_FetchBasiliskData(call_data).then(function(result){
					console.log(result)
					toastr.info('Fetching Data. Please wait for a minute to complete this task.', 'Basilisk Notification');
				})
			})
		});

		$('.btn_edexcoin_dashboard_refresh_basilisk_conn').click(function() {
			var show_mdl = setTimeout(function() {
											var selected_coin = $(this).data('edexcoin');
											$('#RefreshBasiliskConnectionsMdl').modal('show');
										 }, 0)
			var start_refresh = setTimeout(function() {
														EDEX_DEXgetinfoAll();
													}, 3000)

			Promise.all([show_mdl, start_refresh]).then(function() {
				console.log('all promises executed!!!');
			});
		});

		$('.btn_edexcoin_dashboard_validate').click(function() {
			var selected_coin = $(this).data('edexcoin');
			EDEXMainAddr(selected_coin).then(function(result) {
				Iguana_DEXValidateAddr(selected_coin, result);
			});
		});
	}

	var handleWalletToAtomicExplorer = function() {
		$('#edex-tx-history-tbl').on('click', '.kmd-txid-details-btn', function(e) {
			var selected_coin = $(this).data('edexcoin'),
					selected_coin_mode = sessionStorage.getItem('edexTmpMode'),
					selected_txid = $(this).data('txid');

			$( '#nav-iguana-atomic-explorer' ).trigger( 'click' );
			$('#atomic_explorer_select_coin_options option[value=' + selected_coin + ']').attr('selected', 'selected');
			if ( selected_coin_mode == 'Full') {
				$('#atomic_explorer_select_command_options option[value=gettransaction]').attr('selected', 'selected');
			}
			if ( selected_coin_mode == 'Basilisk') {
				$('#atomic_explorer_select_command_options option[value=dex_gettransaction]').attr('selected', 'selected');
			}
			$('#atomic_explorer_input_data').val(selected_txid);
			$( '#atomic_explorer_getcoinpeers_btn' ).trigger( 'click' );
		})
	}

	var handleEdexWalletInfo = function() {
		// Get coin history and pupulate balance and other info to wallet widget
		var ExecuteShowCoinHistory = setInterval(function() {
			if ( sessionStorage.getItem('IguanaActiveAccount') === null ||
					 sessionStorage.getItem('DashboardActions') === null ||
					 sessionStorage.getItem('DashboardActions') === 'stop' ) {
				clearInterval(ExecuteShowCoinHistory);
				console.log('=> No wallet logged in, or Dashboard not ative. No need to Run History.');
			} else if ( sessionStorage.getItem('DashboardActions') === null || sessionStorage.getItem('DashboardActions') === 'start') {
				var active_edexcoin = $('[data-edexcoin]').attr('data-edexcoin'),
						active_edexcoinmodecode = sessionStorage.getItem('edexTmpMode');

				// TODO: refactor
				
				if ( active_edexcoinmodecode == 'Basilisk' || active_edexcoinmodecode == 'Native' ) {
					//console.log(active_edexcoinmodecode)
					//console.log('No need to show Progress bar for Native or Basilisk mode.')
				} else {
					ShowCoinProgressBar(active_edexcoin);
				}
			}
		}, 1000);

		var CheckIfIguanaRunning = setInterval(function() {
			// TODO: refactor
			var active_edexcoin = $('[data-edexcoin]').attr('data-edexcoin'),
						active_edexcoinmodecode = sessionStorage.getItem('edexTmpMode');
			if ( sessionStorage.getItem('IguanaActiveAccount') === null ) {
				//clearInterval(CheckIfIguanaRunning);
				//console.log('=> No wallet logged in, or Dashboard not ative. No need to Run History.');
			} else {
				Iguana_activehandle().then(function(result){
					//console.log(result)
					//console.log("Iguana is running");
				});
			}
		}, 1000);


		var CheckIfIguanaRunning = setInterval(function() {
			// TODO: refactor
			if ( sessionStorage.getItem('IguanaActiveAccount') === null ) {
				//clearInterval(CheckIfIguanaRunning);
				//console.log('=> No wallet logged in, or Dashboard not ative. No need to Run History.');
			} else {
				if ( active_edexcoinmodecode == 'Basilisk') {
					var call_data = {"allcoins": false,"coin":active_edexcoin,"calls":"listtransactions:getbalance"}
					Shepherd_FetchBasiliskData(call_data).then(function(result){
						console.log(result)
					})
				}
			}
		}, 300000);

		var RefreshEdexWalletDashboard = setInterval(function() {
			if ( sessionStorage.getItem('IguanaActiveAccount') === null ||
					 sessionStorage.getItem('DashboardActions') === null ||
					 sessionStorage.getItem('DashboardActions') === 'stop' ) {
				clearInterval(RefreshEdexWalletDashboard);
			} else if ( sessionStorage.getItem('DashboardActions') === null || sessionStorage.getItem('DashboardActions') === 'start') {
				if ( $('[data-edexcoin]').attr('data-edexcoin') !== 'COIN' ) {
					if ( sessionStorage.getItem('edexTmpMode') !== null || sessionStorage.getItem('edexTmpMode') === 'Full') {
						if ( sessionStorage.getItem('edexTmpRefresh') === null || sessionStorage.getItem('edexTmpRefresh') === 'start') {
							$( '#btn_edexcoin_dashboard' ).trigger( 'click' );
						}
					}
				}
			}
		}, 30000);

		var RefreshBasiliskTable = setInterval(function() {
			if ( sessionStorage.getItem('IguanaActiveAccount') === null || sessionStorage.getItem('DashboardActions') === null || sessionStorage.getItem('DashboardActions') === 'stop' ) {
				clearInterval(RefreshBasiliskTable);
			} else if ( sessionStorage.getItem('DashboardActions') === null || sessionStorage.getItem('DashboardActions') === 'start') {
				if ( $('[data-edexcoin]').attr('data-edexcoin') !== 'COIN' ) {
					if ( sessionStorage.getItem('edexTmpMode') !== null || sessionStorage.getItem('edexTmpMode') === 'Basilisk') {
						if ( sessionStorage.getItem('edexTmpRefresh') === null || sessionStorage.getItem('edexTmpRefresh') === 'start') {
							var active_edexcoin = $('[data-edexcoin]').attr('data-edexcoin')
							ShowBasiliskFetchDataProgress(active_edexcoin);
						}
					}
				}
			}
		}, 1000);
	}

	return {
		// main function to initiate the module
		init: function() {
			resizeDashboardWindow();
			handle_edex_wallet();
			handle_edex_dashboard();
			handle_edex_send();
			handle_edex_recieve();

			window.onresize = function(event) {
				resizeDashboardWindow();
			};

			if ( sessionStorage.getItem('IguanaActiveAccount') === null ) {
				console.log('=> No wallet logged in. No need to run Dashboard JS.');
			} else {
				handleWalletWidgets();
				handleWalletWidgetBtns();
				handleEdexWalletInfo();
				handleBasiliskWalletActions();
				handleWalletToAtomicExplorer();
				//TotalFiatValue();
			}

			/*setInterval(function() {
					handleWalletWidgets();
					console.log('wallet widget refereshed (every 15 seconds)');
			}, 15000);*/

			/*RunTotalFiatValue = setInterval(function() {
					if ( sessionStorage.getItem('IguanaActiveAccount') === null ) {
					//console.log('=> No wallet logged in. No need to get Rates.');
					//StopTotalFiatValue();
					} else {
							//TotalFiatValue();
							//console.log('Get Rates (every 60 seconds)');
					}
			}, 60000);*/
		}
	};
}();

jQuery(document).ready(function() {
	Dashboard.init();
});

function resizeDashboardWindow() {
	/* set default map height */
	var navbarH = $('.site-navbar').outerHeight(),
			edexDashH = $('.edexcoin_dashoard_section_main_div').outerHeight(),
			mapH = $(window).height() - navbarH;

	$('.page-main').outerHeight(mapH);
	$('.scrollable-container').outerHeight(mapH);
}

/*function hideExtCoinsinEdexDashboard(coin) {
	var tmp_getinfo = EDEXgetinfo(coin);
	console.log(tmp_getinfo);
}*/