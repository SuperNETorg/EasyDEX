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


function Iguana_rmd160conv(rmd160conv_data) {
	// comment
	var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			ajax_data = {
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
			console.log(xhr.statusText);
			if ( xhr.readyState == 0 ) {
				Iguana_ServiceUnavailable();
			}
			console.log(textStatus);
			console.log(error);
		}
	});
}

/*var Iguana_activehandle_output = ''; //Storing activehandle output this variable. accessible globally.
function Iguana_activehandle() {

		//comment
		var tmpIguanaRPCAuth = 'tmpIgRPCUser@'+sessionStorage.getItem('IguanaRPCAuth');
		var ajax_data = {'userpass':tmpIguanaRPCAuth,"agent":"SuperNET","method":"activehandle"};
		//console.log(ajax_data);
		$.ajax({
				type: 'POST',
				data: JSON.stringify(ajax_data),
				url: 'http://127.0.0.1:7778',
				//dataType: 'text',
				success: function(data, textStatus, jqXHR) {
						var AjaxOutputData = JSON.parse(data);
						//console.log('== ActiveHandle Data OutPut ==');
						//console.log(AjaxOutputData);
						Iguana_activehandle_output = AjaxOutputData;
						return true;
				},
				error: function(xhr, textStatus, error) {
						console.log(xhr.statusText);
						if ( xhr.readyState == 0 ) {
								Iguana_ServiceUnavailable();
						}
						console.log(textStatus);
						console.log(error);
						return false;
				}
		});
		return 'Executed Iguana_activehandle. Check Iguana_activehandle_output var value.';
}*/

function Iguana_activehandle(callback) {
	return new Promise((resolve) => {
		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth');
				ajax_data = {
					'userpass': tmpIguanaRPCAuth,
					'agent': 'SuperNET',
					'method': 'activehandle'
				},
				AjaxOutputData = IguanaAJAX('http://127.0.0.1:7778', ajax_data).done(function(data) {
					AjaxOutputData = JSON.parse(AjaxOutputData.responseText);
					resolve(AjaxOutputData);
				}).fail(function(xhr, textStatus, error) {
					// handle request failures
					console.log(xhr.statusText);
					if ( xhr.readyState == 0 ) {
						Iguana_ServiceUnavailable();
					}
					console.log(textStatus);
					console.log(error);
				});
	});
}

function Iguana_Setactivehandle() {
	//comment
	var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth');
			ajax_data = {
				'userpass': tmpIguanaRPCAuth,
				'agent': 'SuperNET',
				'method': 'activehandle'
			};

	$.ajax({
		type: 'POST',
		data: JSON.stringify(ajax_data),
		url: 'http://127.0.0.1:7778',
		success: function(data, textStatus, jqXHR) {
			var AjaxOutputData = JSON.parse(data),
					AjaxOutputDataToStore = JSON.stringify(data);
			sessionStorage.setItem('IguanaActiveAccount', AjaxOutputDataToStore);
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

	return 'Executed Iguana_activehandle. Check Iguana_activehandle_output var value.';
}

function Iguana_addcoinLogin(addcoin_data) {
	var tmpinternval = 0;

	if ( addcoin_data.coin == 'BTC' ) {
		var logincoinfullname = 'Bitcoin',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) {
			logincoinmodeinfo = 'Full';
		} else {
			logincoinmodeinfo = 'Basilisk';
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				AddCoinData = {
					'userpass': tmpIguanaRPCAuth,
					'prefetchlag': 5,
					'poll': 1,
					'active': 1,
					'agent': "iguana",
					'method': "addcoin",
					'newcoin': "BTC",
					'startpend': 64,
					'endpend': 2,
					'services': 128,
					'maxpeers': 512,
					'RELAY': addcoin_data.mode,
					'VALIDATE': addcoin_data.mode,
					'portp2p': 8333
				};
	}
	if ( addcoin_data.coin == 'BTCD' ) {
			var logincoinfullname = 'BitcoinDark',
					logincoinmodeinfo = '';

			if ( addcoin_data.mode == '1' ) {
				logincoinmodeinfo = 'Full';
			} else {
				logincoinmodeinfo = 'Basilisk';
			}

			var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
					AddCoinData = {
						'userpass': tmpIguanaRPCAuth,
						'prefetchlag': -1,
						'poll': 50,
						'active': 1,
						'agent': 'iguana',
						'method': 'addcoin',
						'newcoin': 'BTCD',
						'startpend': 8,
						'endpend': 4,
						'services': 129,
						'maxpeers': 64,
						'RELAY': addcoin_data.mode,
						'VALIDATE': addcoin_data.mode,
						'portp2p': 14631,
						'rpc': 14632
					};
	}

	if ( addcoin_data.coin == 'KMD' ) {
		var logincoinfullname = 'Komodo',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) { logincoinmodeinfo = 'Full'; }
		if ( addcoin_data.mode == '0' ) { logincoinmodeinfo = 'Basilisk'; }
		if ( addcoin_data.mode == '-1' ) {
			logincoinmodeinfo = 'Native';
			var confpath = Shepherd_getConf('komodod');
			console.log(confpath[0].path);
		}
		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth');

		if ( addcoin_data.mode == '-1' ) {
			var setconfig = function() {
				return new Promise(function(resolve, reject) {
					Shepherd_setConf('komodod');
					var result = 'setconfig: DONE';
					console.log(result);
					resolve(result);
				});
			}

			var startcoin = function() {
				return new Promise(function(resolve, reject) {
					Shepherd_herd('komodod', {
						'ac_name': 'komodod',
						'ac_options': [ '-addnode=78.47.196.146' ]
					});
					var result = 'startcoin: DONE';
					console.log(result);
					resolve(result);
				});
			}

			setconfig()
			.then(function(result) {
				return startcoin();
			});
			var tmpinternval = 6000,
			AddCoinData = {"conf":"komodo.conf","path":confpath[0].path,"unitval":"20","zcash":1,"RELAY":-1,"VALIDATE":0,"prefetchlag":-1,"poll":10,"active":1,"agent":"iguana","method":"addcoin","startpend":8,"endpend":8,"services":0,"maxpeers":32,"newcoin":"KMD","name":"Komodo","hasheaders":1,"useaddmultisig":0,"netmagic":"f9eee48d","p2p":7770,"rpc":7771,"pubval":60,"p2shval":85,"wifval":188,"txfee_satoshis":"10000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71","protover":170002,"genesisblock":"0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a000000000000000000000000000000000000000000000000000000000000000029ab5f490f0f0f200b00000000000000000000000000000000000000000000000000000000000000fd4005000d5ba7cda5d473947263bf194285317179d2b0d307119c2e7cc4bd8ac456f0774bd52b0cd9249be9d40718b6397a4c7bbd8f2b3272fed2823cd2af4bd1632200ba4bf796727d6347b225f670f292343274cc35099466f5fb5f0cd1c105121b28213d15db2ed7bdba490b4cedc69742a57b7c25af24485e523aadbb77a0144fc76f79ef73bd8530d42b9f3b9bed1c135ad1fe152923fafe98f95f76f1615e64c4abb1137f4c31b218ba2782bc15534788dda2cc08a0ee2987c8b27ff41bd4e31cd5fb5643dfe862c9a02ca9f90c8c51a6671d681d04ad47e4b53b1518d4befafefe8cadfb912f3d03051b1efbf1dfe37b56e93a741d8dfd80d576ca250bee55fab1311fc7b3255977558cdda6f7d6f875306e43a14413facdaed2f46093e0ef1e8f8a963e1632dcbeebd8e49fd16b57d49b08f9762de89157c65233f60c8e38a1f503a48c555f8ec45dedecd574a37601323c27be597b956343107f8bd80f3a925afaf30811df83c402116bb9c1e5231c70fff899a7c82f73c902ba54da53cc459b7bf1113db65cc8f6914d3618560ea69abd13658fa7b6af92d374d6eca9529f8bd565166e4fcbf2a8dfb3c9b69539d4d2ee2e9321b85b331925df195915f2757637c2805e1d4131e1ad9ef9bc1bb1c732d8dba4738716d351ab30c996c8657bab39567ee3b29c6d054b711495c0d52e1cd5d8e55b4f0f0325b97369280755b46a02afd54be4ddd9f77c22272b8bbb17ff5118fedbae2564524e797bd28b5f74f7079d532ccc059807989f94d267f47e724b3f1ecfe00ec9e6541c961080d8891251b84b4480bc292f6a180bea089fef5bbda56e1e41390d7c0e85ba0ef530f7177413481a226465a36ef6afe1e2bca69d2078712b3912bba1a99b1fbff0d355d6ffe726d2bb6fbc103c4ac5756e5bee6e47e17424ebcbf1b63d8cb90ce2e40198b4f4198689daea254307e52a25562f4c1455340f0ffeb10f9d8e914775e37d0edca019fb1b9c6ef81255ed86bc51c5391e0591480f66e2d88c5f4fd7277697968656a9b113ab97f874fdd5f2465e5559533e01ba13ef4a8f7a21d02c30c8ded68e8c54603ab9c8084ef6d9eb4e92c75b078539e2ae786ebab6dab73a09e0aa9ac575bcefb29e930ae656e58bcb513f7e3c17e079dce4f05b5dbc18c2a872b22509740ebe6a3903e00ad1abc55076441862643f93606e3dc35e8d9f2caef3ee6be14d513b2e062b21d0061de3bd56881713a1a5c17f5ace05e1ec09da53f99442df175a49bd154aa96e4949decd52fed79ccf7ccbce32941419c314e374e4a396ac553e17b5340336a1a25c22f9e42a243ba5404450b650acfc826a6e432971ace776e15719515e1634ceb9a4a35061b668c74998d3dfb5827f6238ec015377e6f9c94f38108768cf6e5c8b132e0303fb5a200368f845ad9d46343035a6ff94031df8d8309415bb3f6cd5ede9c135fdabcc030599858d803c0f85be7661c88984d88faa3d26fb0e9aac0056a53f1b5d0baed713c853c4a2726869a0a124a8a5bbc0fc0ef80c8ae4cb53636aa02503b86a1eb9836fcc259823e2692d921d88e1ffc1e6cb2bde43939ceb3f32a611686f539f8f7c9f0bf00381f743607d40960f06d347d1cd8ac8a51969c25e37150efdf7aa4c2037a2fd0516fb444525ab157a0ed0a7412b2fa69b217fe397263153782c0f64351fbdf2678fa0dc8569912dcd8e3ccad38f34f23bbbce14c6a26ac24911b308b82c7e43062d180baeac4ba7153858365c72c63dcf5f6a5b08070b730adb017aeae925b7d0439979e2679f45ed2f25a7edcfd2fb77a8794630285ccb0a071f5cce410b46dbf9750b0354aae8b65574501cc69efb5b6a43444074fee116641bb29da56c2b4a7f456991fc92b2","debug":0}
		} else {
			var AddCoinData = {'userpass':tmpIguanaRPCAuth,"unitval":"20","zcash":1,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"prefetchlag":-1,"poll":10,"active":1,"agent":"iguana","method":"addcoin","startpend":32,"endpend":32,"services":129,"maxpeers":32,"newcoin":"KMD","name":"Komodo","hasheaders":1,"useaddmultisig":0,"netmagic":"f9eee48d","p2p":7770,"rpc":7771,"pubval":60,"p2shval":85,"wifval":188,"txfee_satoshis":"10000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71","protover":170002,"genesisblock":"0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a000000000000000000000000000000000000000000000000000000000000000029ab5f490f0f0f200b00000000000000000000000000000000000000000000000000000000000000fd4005000d5ba7cda5d473947263bf194285317179d2b0d307119c2e7cc4bd8ac456f0774bd52b0cd9249be9d40718b6397a4c7bbd8f2b3272fed2823cd2af4bd1632200ba4bf796727d6347b225f670f292343274cc35099466f5fb5f0cd1c105121b28213d15db2ed7bdba490b4cedc69742a57b7c25af24485e523aadbb77a0144fc76f79ef73bd8530d42b9f3b9bed1c135ad1fe152923fafe98f95f76f1615e64c4abb1137f4c31b218ba2782bc15534788dda2cc08a0ee2987c8b27ff41bd4e31cd5fb5643dfe862c9a02ca9f90c8c51a6671d681d04ad47e4b53b1518d4befafefe8cadfb912f3d03051b1efbf1dfe37b56e93a741d8dfd80d576ca250bee55fab1311fc7b3255977558cdda6f7d6f875306e43a14413facdaed2f46093e0ef1e8f8a963e1632dcbeebd8e49fd16b57d49b08f9762de89157c65233f60c8e38a1f503a48c555f8ec45dedecd574a37601323c27be597b956343107f8bd80f3a925afaf30811df83c402116bb9c1e5231c70fff899a7c82f73c902ba54da53cc459b7bf1113db65cc8f6914d3618560ea69abd13658fa7b6af92d374d6eca9529f8bd565166e4fcbf2a8dfb3c9b69539d4d2ee2e9321b85b331925df195915f2757637c2805e1d4131e1ad9ef9bc1bb1c732d8dba4738716d351ab30c996c8657bab39567ee3b29c6d054b711495c0d52e1cd5d8e55b4f0f0325b97369280755b46a02afd54be4ddd9f77c22272b8bbb17ff5118fedbae2564524e797bd28b5f74f7079d532ccc059807989f94d267f47e724b3f1ecfe00ec9e6541c961080d8891251b84b4480bc292f6a180bea089fef5bbda56e1e41390d7c0e85ba0ef530f7177413481a226465a36ef6afe1e2bca69d2078712b3912bba1a99b1fbff0d355d6ffe726d2bb6fbc103c4ac5756e5bee6e47e17424ebcbf1b63d8cb90ce2e40198b4f4198689daea254307e52a25562f4c1455340f0ffeb10f9d8e914775e37d0edca019fb1b9c6ef81255ed86bc51c5391e0591480f66e2d88c5f4fd7277697968656a9b113ab97f874fdd5f2465e5559533e01ba13ef4a8f7a21d02c30c8ded68e8c54603ab9c8084ef6d9eb4e92c75b078539e2ae786ebab6dab73a09e0aa9ac575bcefb29e930ae656e58bcb513f7e3c17e079dce4f05b5dbc18c2a872b22509740ebe6a3903e00ad1abc55076441862643f93606e3dc35e8d9f2caef3ee6be14d513b2e062b21d0061de3bd56881713a1a5c17f5ace05e1ec09da53f99442df175a49bd154aa96e4949decd52fed79ccf7ccbce32941419c314e374e4a396ac553e17b5340336a1a25c22f9e42a243ba5404450b650acfc826a6e432971ace776e15719515e1634ceb9a4a35061b668c74998d3dfb5827f6238ec015377e6f9c94f38108768cf6e5c8b132e0303fb5a200368f845ad9d46343035a6ff94031df8d8309415bb3f6cd5ede9c135fdabcc030599858d803c0f85be7661c88984d88faa3d26fb0e9aac0056a53f1b5d0baed713c853c4a2726869a0a124a8a5bbc0fc0ef80c8ae4cb53636aa02503b86a1eb9836fcc259823e2692d921d88e1ffc1e6cb2bde43939ceb3f32a611686f539f8f7c9f0bf00381f743607d40960f06d347d1cd8ac8a51969c25e37150efdf7aa4c2037a2fd0516fb444525ab157a0ed0a7412b2fa69b217fe397263153782c0f64351fbdf2678fa0dc8569912dcd8e3ccad38f34f23bbbce14c6a26ac24911b308b82c7e43062d180baeac4ba7153858365c72c63dcf5f6a5b08070b730adb017aeae925b7d0439979e2679f45ed2f25a7edcfd2fb77a8794630285ccb0a071f5cce410b46dbf9750b0354aae8b65574501cc69efb5b6a43444074fee116641bb29da56c2b4a7f456991fc92b2","debug":0}
		}
	}
	if ( addcoin_data.coin == 'SUPERNET' ) {
		var logincoinfullname = 'SUPERNET',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) { logincoinmodeinfo = 'Full'; }
		if ( addcoin_data.mode == '0' ) { logincoinmodeinfo = 'Basilisk'; }
		if ( addcoin_data.mode == '-1' ) {
			logincoinmodeinfo = 'Native';
			var confpath = Shepherd_getConf('SUPERNET');
			console.log(confpath[0].path);
		}
		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth');

		if ( addcoin_data.mode == '-1' ) {
			var setconfig = function() {
				return new Promise(function(resolve, reject) {
					Shepherd_setConf('SUPERNET');
					var result = 'setconfig: DONE';
					console.log(result);
					resolve(result);
				});
			}

			var startcoin = function() {
				return new Promise(function(resolve, reject) {
					Shepherd_herd('SUPERNET', {
						'ac_name': 'SUPERNET',
						'ac_options': [
							'-server',
							'-ac_name=SUPERNET',
							'-addnode=78.47.196.146'
						]
					});

					var result = 'startcoin: DONE';
					console.log(result);
					resolve(result);
				});
			}

			setconfig()
			.then(function(result) {
				return startcoin();
			});

			var tmpinternval = 6000,
					AddCoinData = {"conf":"SUPERNET.conf","path":confpath[0].path,"unitval":"20","zcash":1,"RELAY":-1,"VALIDATE":0,"prefetchlag":-1,"poll":100,"active":1,"agent":"iguana","method":"addcoin","startpend":4,"endpend":4,"services":129,"maxpeers":32,"newcoin":"SUPERNET","name":"SUPERNET","hasheaders":1,"useaddmultisig":0,"netmagic":"cc55d9d4","p2p":11340,"rpc":11341,"pubval":60,"p2shval":85,"wifval":188,"txfee_satoshis":"10000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71","protover":170002,"genesisblock":"0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a000000000000000000000000000000000000000000000000000000000000000029ab5f490f0f0f200b00000000000000000000000000000000000000000000000000000000000000fd4005000d5ba7cda5d473947263bf194285317179d2b0d307119c2e7cc4bd8ac456f0774bd52b0cd9249be9d40718b6397a4c7bbd8f2b3272fed2823cd2af4bd1632200ba4bf796727d6347b225f670f292343274cc35099466f5fb5f0cd1c105121b28213d15db2ed7bdba490b4cedc69742a57b7c25af24485e523aadbb77a0144fc76f79ef73bd8530d42b9f3b9bed1c135ad1fe152923fafe98f95f76f1615e64c4abb1137f4c31b218ba2782bc15534788dda2cc08a0ee2987c8b27ff41bd4e31cd5fb5643dfe862c9a02ca9f90c8c51a6671d681d04ad47e4b53b1518d4befafefe8cadfb912f3d03051b1efbf1dfe37b56e93a741d8dfd80d576ca250bee55fab1311fc7b3255977558cdda6f7d6f875306e43a14413facdaed2f46093e0ef1e8f8a963e1632dcbeebd8e49fd16b57d49b08f9762de89157c65233f60c8e38a1f503a48c555f8ec45dedecd574a37601323c27be597b956343107f8bd80f3a925afaf30811df83c402116bb9c1e5231c70fff899a7c82f73c902ba54da53cc459b7bf1113db65cc8f6914d3618560ea69abd13658fa7b6af92d374d6eca9529f8bd565166e4fcbf2a8dfb3c9b69539d4d2ee2e9321b85b331925df195915f2757637c2805e1d4131e1ad9ef9bc1bb1c732d8dba4738716d351ab30c996c8657bab39567ee3b29c6d054b711495c0d52e1cd5d8e55b4f0f0325b97369280755b46a02afd54be4ddd9f77c22272b8bbb17ff5118fedbae2564524e797bd28b5f74f7079d532ccc059807989f94d267f47e724b3f1ecfe00ec9e6541c961080d8891251b84b4480bc292f6a180bea089fef5bbda56e1e41390d7c0e85ba0ef530f7177413481a226465a36ef6afe1e2bca69d2078712b3912bba1a99b1fbff0d355d6ffe726d2bb6fbc103c4ac5756e5bee6e47e17424ebcbf1b63d8cb90ce2e40198b4f4198689daea254307e52a25562f4c1455340f0ffeb10f9d8e914775e37d0edca019fb1b9c6ef81255ed86bc51c5391e0591480f66e2d88c5f4fd7277697968656a9b113ab97f874fdd5f2465e5559533e01ba13ef4a8f7a21d02c30c8ded68e8c54603ab9c8084ef6d9eb4e92c75b078539e2ae786ebab6dab73a09e0aa9ac575bcefb29e930ae656e58bcb513f7e3c17e079dce4f05b5dbc18c2a872b22509740ebe6a3903e00ad1abc55076441862643f93606e3dc35e8d9f2caef3ee6be14d513b2e062b21d0061de3bd56881713a1a5c17f5ace05e1ec09da53f99442df175a49bd154aa96e4949decd52fed79ccf7ccbce32941419c314e374e4a396ac553e17b5340336a1a25c22f9e42a243ba5404450b650acfc826a6e432971ace776e15719515e1634ceb9a4a35061b668c74998d3dfb5827f6238ec015377e6f9c94f38108768cf6e5c8b132e0303fb5a200368f845ad9d46343035a6ff94031df8d8309415bb3f6cd5ede9c135fdabcc030599858d803c0f85be7661c88984d88faa3d26fb0e9aac0056a53f1b5d0baed713c853c4a2726869a0a124a8a5bbc0fc0ef80c8ae4cb53636aa02503b86a1eb9836fcc259823e2692d921d88e1ffc1e6cb2bde43939ceb3f32a611686f539f8f7c9f0bf00381f743607d40960f06d347d1cd8ac8a51969c25e37150efdf7aa4c2037a2fd0516fb444525ab157a0ed0a7412b2fa69b217fe397263153782c0f64351fbdf2678fa0dc8569912dcd8e3ccad38f34f23bbbce14c6a26ac24911b308b82c7e43062d180baeac4ba7153858365c72c63dcf5f6a5b08070b730adb017aeae925b7d0439979e2679f45ed2f25a7edcfd2fb77a8794630285ccb0a071f5cce410b46dbf9750b0354aae8b65574501cc69efb5b6a43444074fee116641bb29da56c2b4a7f456991fc92b2","debug":0,"seedipaddr":"78.47.196.146"}
		} else {
			var AddCoinData = {'userpass':tmpIguanaRPCAuth,"unitval":"20","zcash":1,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"prefetchlag":-1,"poll":100,"active":1,"agent":"iguana","method":"addcoin","startpend":4,"endpend":4,"services":129,"maxpeers":32,"newcoin":"SUPERNET","name":"SUPERNET","hasheaders":1,"useaddmultisig":0,"netmagic":"cc55d9d4","p2p":11340,"rpc":11341,"pubval":60,"p2shval":85,"wifval":188,"txfee_satoshis":"10000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71","protover":170002,"genesisblock":"0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a000000000000000000000000000000000000000000000000000000000000000029ab5f490f0f0f200b00000000000000000000000000000000000000000000000000000000000000fd4005000d5ba7cda5d473947263bf194285317179d2b0d307119c2e7cc4bd8ac456f0774bd52b0cd9249be9d40718b6397a4c7bbd8f2b3272fed2823cd2af4bd1632200ba4bf796727d6347b225f670f292343274cc35099466f5fb5f0cd1c105121b28213d15db2ed7bdba490b4cedc69742a57b7c25af24485e523aadbb77a0144fc76f79ef73bd8530d42b9f3b9bed1c135ad1fe152923fafe98f95f76f1615e64c4abb1137f4c31b218ba2782bc15534788dda2cc08a0ee2987c8b27ff41bd4e31cd5fb5643dfe862c9a02ca9f90c8c51a6671d681d04ad47e4b53b1518d4befafefe8cadfb912f3d03051b1efbf1dfe37b56e93a741d8dfd80d576ca250bee55fab1311fc7b3255977558cdda6f7d6f875306e43a14413facdaed2f46093e0ef1e8f8a963e1632dcbeebd8e49fd16b57d49b08f9762de89157c65233f60c8e38a1f503a48c555f8ec45dedecd574a37601323c27be597b956343107f8bd80f3a925afaf30811df83c402116bb9c1e5231c70fff899a7c82f73c902ba54da53cc459b7bf1113db65cc8f6914d3618560ea69abd13658fa7b6af92d374d6eca9529f8bd565166e4fcbf2a8dfb3c9b69539d4d2ee2e9321b85b331925df195915f2757637c2805e1d4131e1ad9ef9bc1bb1c732d8dba4738716d351ab30c996c8657bab39567ee3b29c6d054b711495c0d52e1cd5d8e55b4f0f0325b97369280755b46a02afd54be4ddd9f77c22272b8bbb17ff5118fedbae2564524e797bd28b5f74f7079d532ccc059807989f94d267f47e724b3f1ecfe00ec9e6541c961080d8891251b84b4480bc292f6a180bea089fef5bbda56e1e41390d7c0e85ba0ef530f7177413481a226465a36ef6afe1e2bca69d2078712b3912bba1a99b1fbff0d355d6ffe726d2bb6fbc103c4ac5756e5bee6e47e17424ebcbf1b63d8cb90ce2e40198b4f4198689daea254307e52a25562f4c1455340f0ffeb10f9d8e914775e37d0edca019fb1b9c6ef81255ed86bc51c5391e0591480f66e2d88c5f4fd7277697968656a9b113ab97f874fdd5f2465e5559533e01ba13ef4a8f7a21d02c30c8ded68e8c54603ab9c8084ef6d9eb4e92c75b078539e2ae786ebab6dab73a09e0aa9ac575bcefb29e930ae656e58bcb513f7e3c17e079dce4f05b5dbc18c2a872b22509740ebe6a3903e00ad1abc55076441862643f93606e3dc35e8d9f2caef3ee6be14d513b2e062b21d0061de3bd56881713a1a5c17f5ace05e1ec09da53f99442df175a49bd154aa96e4949decd52fed79ccf7ccbce32941419c314e374e4a396ac553e17b5340336a1a25c22f9e42a243ba5404450b650acfc826a6e432971ace776e15719515e1634ceb9a4a35061b668c74998d3dfb5827f6238ec015377e6f9c94f38108768cf6e5c8b132e0303fb5a200368f845ad9d46343035a6ff94031df8d8309415bb3f6cd5ede9c135fdabcc030599858d803c0f85be7661c88984d88faa3d26fb0e9aac0056a53f1b5d0baed713c853c4a2726869a0a124a8a5bbc0fc0ef80c8ae4cb53636aa02503b86a1eb9836fcc259823e2692d921d88e1ffc1e6cb2bde43939ceb3f32a611686f539f8f7c9f0bf00381f743607d40960f06d347d1cd8ac8a51969c25e37150efdf7aa4c2037a2fd0516fb444525ab157a0ed0a7412b2fa69b217fe397263153782c0f64351fbdf2678fa0dc8569912dcd8e3ccad38f34f23bbbce14c6a26ac24911b308b82c7e43062d180baeac4ba7153858365c72c63dcf5f6a5b08070b730adb017aeae925b7d0439979e2679f45ed2f25a7edcfd2fb77a8794630285ccb0a071f5cce410b46dbf9750b0354aae8b65574501cc69efb5b6a43444074fee116641bb29da56c2b4a7f456991fc92b2","debug":0,"seedipaddr":"78.47.196.146"}
		}
	}
	setTimeout(function() {
		$.ajax({
			type: 'POST',
			data: JSON.stringify(AddCoinData),
			url: 'http://127.0.0.1:7778',
			//dataType: 'text',
			success: function(data, textStatus, jqXHR) {
				var addcoinData = JSON.parse(data);

				if (addcoinData.result === 'coin added') {
					console.log('coin added');
					toastr.success(logincoinfullname + ' started in ' + logincoinmodeinfo + ' Mode', 'Coin Notification');
					//if ( sessionStorage.getItem('IguanaActiveAccount') === null ) {
						$( '.login-form' ).submit();
						console.log('There was no wallet logged in. Logged in now.');
					//}
				} else if (addcoinData.result === 'coin already there') {
					console.log('coin already there');
					toastr.info('Looks like ' + logincoinfullname + ' already running.', 'Coin Notification');
				} else if (addcoinData.result === null) {
					console.log('coin already there');
					toastr.info('Looks like ' + logincoinfullname + ' already running.', 'Coin Notification');
				}
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
	}, tmpinternval);
}

function Iguana_addcoin(addcoin_data) {
	var tmpinternval = 0;

	if ( addcoin_data.coin == 'BTC' ) {
		var logincoinfullname = 'Bitcoin',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) {
			logincoinmodeinfo = 'Full';
		} else {
			logincoinmodeinfo = 'Basilisk';
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				AddCoinData = {'userpass':tmpIguanaRPCAuth,"prefetchlag":5,"poll":1,"active":1,"agent":"iguana","method":"addcoin","newcoin":"BTC","startpend":64,"endpend":2,"services":128,"maxpeers":512,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"portp2p":8333}
	}
	if ( addcoin_data.coin == 'BTCD' ) {
		var logincoinfullname = 'BitcoinDark',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) {
			logincoinmodeinfo = 'Full';
		} else {
			logincoinmodeinfo = 'Basilisk';
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				AddCoinData = {'userpass':tmpIguanaRPCAuth,"prefetchlag":-1,"poll":50,"active":1,"agent":"iguana","method":"addcoin","newcoin":"BTCD","startpend":8,"endpend":4,"services":129,"maxpeers":64,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"portp2p":14631,"rpc":14632}
	}
	if ( addcoin_data.coin == 'LTC' ) {
		var logincoinfullname = 'Litecoin',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) {
			logincoinmodeinfo = 'Full';
		} else {
			logincoinmodeinfo = 'Basilisk';
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				AddCoinData = {'userpass':tmpIguanaRPCAuth,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"prefetchlag":-1,"poll":10,"active":1,"agent":"iguana","method":"addcoin","startpend":8,"endpend":8,"services":129,"maxpeers":256,"newcoin":"LTC","name":"Litecoin","hasheaders":1,"useaddmultisig":0,"netmagic":"fbc0b6db","p2p":9333,"rpc":9332,"pubval":48,"p2shval":5,"wifval":176,"txfee_satoshis":"100000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"12a765e31ffd4059bada1e25190f6e98c99d9714d334efa41a195a7e7e04bfe2","genesis":{"hashalgo":"scrypt","version":1,"timestamp":1317972665,"nBits":"1e0ffff0","nonce":2084524493,"merkle_root":"97ddfbbae6be97fd6cdf3e7ca13232a3afff2353e29badfab7f73011edd4ced9"},"alertpubkey":"040184710fa689ad5023690c80f3a49c8f13f8d45b8c857fbcbc8bc4a8e4d3eb4b10f4d4604fa08dce601aaf0f470216fe1b51850b4acf21b179c45070ac7b03a9","protover":70002}
	}
	if ( addcoin_data.coin == 'DOGE' ) {
		var logincoinfullname = 'Dogecoin',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) {
			logincoinmodeinfo = 'Full';
		} else {
			logincoinmodeinfo = 'Basilisk';
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@'+sessionStorage.getItem('IguanaRPCAuth'),
				AddCoinData = {'userpass':tmpIguanaRPCAuth,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"startpend":8,"endpend":4,"services":129,"auxpow":1,"prefetchlag":-1,"poll":10,"active":1,"agent":"iguana","method":"addcoin","maxpeers":256,"newcoin":"DOGE","name":"Dogecoin","netmagic":"C0C0C0C0","p2p":22556,"rpc":22555,"pubval":30,"p2shval":5,"wifval":128,"txfee_satoshis":"100000000","minconfirms":2,"genesishash":"1a91e3dace36e2be3bf030a65679fe821aa1d6ef92e7c9902eb318182c355691","genesis":{"hashalgo": "scrypt","version":1,"timestamp":1386325540,"nBits":"1e0ffff0","nonce":99943,"merkle_root":"5b2a3f53f605d62c53e62932dac6925e3d74afa5a4b459745c36d42d0ed26a69"},"alertpubkey":"04d4da7a5dae4db797d9b0644d57a5cd50e05a70f36091cd62e2fc41c98ded06340be5a43a35e185690cd9cde5d72da8f6d065b499b06f51dcfba14aad859f443a"}
	}
	if ( addcoin_data.coin == 'DGB' ) {
		var logincoinfullname = 'Digibyte',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) {
			logincoinmodeinfo = 'Full';
		} else {
			logincoinmodeinfo = 'Basilisk';
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				AddCoinData = {'userpass':tmpIguanaRPCAuth,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"startpend":16,"endpend":8,"services":129,"prefetchlag":-1,"poll":10,"active":1,"agent":"iguana","method":"addcoin","maxpeers":256,"newcoin":"DGB","name":"Digibyte","netmagic":"FAC3B6DA","p2p":12024,"rpc":14022,"pubval":30,"p2shval":5,"wifval":128,"txfee_satoshis":"10000","minconfirms":2,"genesishash":"7497ea1b465eb39f1c8f507bc877078fe016d6fcb6dfad3a64c98dcc6e1e8496","genesis":{"version":1,"timestamp":1389388394,"nBits":"1e0ffff0","nonce":2447652,"merkle_root":"72ddd9496b004221ed0557358846d9248ecd4c440ebd28ed901efc18757d0fad"},"alertpubkey":"04F04441C4757F356290A37C313C3772C5BC5003E898EB2E0CF365795543A7BF690C8BBBFA32EE3A3325477CE2000B7D0453EFBB203329D0F9DF34D5927D022BC9"}
	}
	if ( addcoin_data.coin == 'MZC' ) {
		var logincoinfullname = 'MazaCoin',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) {
			logincoinmodeinfo = 'Full';
		} else {
			logincoinmodeinfo = 'Basilisk';
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				AddCoinData = {'userpass':tmpIguanaRPCAuth,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"services":129,"prefetchlag":-1,"poll":10,"active":1,"agent":"iguana","method":"addcoin","maxpeers":256,"newcoin":"MZC","name":"MazaCoin","netmagic":"f8b503df","p2p":12835,"rpc":12832,"pubval":50,"p2shval":9,"wifval":224,"txfee_satoshis":"0","minconfirms":2,"genesishash":"00000c7c73d8ce604178dae13f0fc6ec0be3275614366d44b1b4b5c6e238c60c","genesis":{"version":1,"timestamp":1390747675,"nBits":"1e0ffff0","nonce":2091390249,"merkle_root":"62d496378e5834989dd9594cfc168dbb76f84a39bbda18286cddc7d1d1589f4f"},"alertpubkey":"04f09702847840aaf195de8442ebecedf5b095cdbb9bc716bda9110971b28a49e0ead8564ff0db22209e0374782c093bb899692d524e9d6a6956e7c5ecbcd68284"}
	}
	if ( addcoin_data.coin == 'SYS' ) {
		var logincoinfullname = 'SysCoin',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) {
			logincoinmodeinfo = 'Full';
		} else {
			logincoinmodeinfo = 'Basilisk';
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				AddCoinData = {'userpass':tmpIguanaRPCAuth,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"prefetchlag":-1,"poll":10,"active":1,"agent":"iguana","method":"addcoin","startpend":18,"endpend":18,"services":129,"maxpeers":256,"newcoin":"SYS","name":"SysCoin","hasheaders":0,"useaddmultisig":0,"netmagic":"f9beb4d9","p2p":8369,"rpc":8370,"pubval":0,"p2shval":5,"wifval":128,"txfee_satoshis":"100000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"0000072d66e51ab87de265765cc8bdd2d229a4307c672a1b3d5af692519cf765","genesis":{"version":1,"timestamp":1450473723,"nBits":"1e0ffff0","nonce":5258726,"merkle_root":"5215c5a2af9b63f2550b635eb2b354bb13645fd8fa31275394eb161944303065"},"protover":70012,"auxpow":1}
	}
	if ( addcoin_data.coin == 'UNO' ) {
		var logincoinfullname = 'Unobtanium',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) {
			logincoinmodeinfo = 'Full';
		} else {
			logincoinmodeinfo = 'Basilisk';
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				AddCoinData = {'userpass':tmpIguanaRPCAuth,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"services":129,"auxpow":1,"prefetchlag":-1,"poll":10,"active":1,"agent":"iguana","method":"addcoin","maxpeers":256,"newcoin":"UNO","name":"Unobtanium","netmagic":"03d5b503","p2p":65534,"rpc":65535,"pubval":130,"p2shval":30,"wifval":224,"txfee_satoshis":"1000000","minconfirms":2,"genesishash":"000004c2fc5fffb810dccc197d603690099a68305232e552d96ccbe8e2c52b75","genesis":{"version":1,"timestamp":1375548986,"nBits":"1e0fffff","nonce":1211565,"merkle_root":"36a192e90f70131a884fe541a1e8a5643a28ba4cb24cbb2924bd0ee483f7f484"},"alertpubkey":"04fd68acb6a895f3462d91b43eef0da845f0d531958a858554feab3ac330562bf76910700b3f7c29ee273ddc4da2bb5b953858f6958a50e8831eb43ee30c32f21d"}
	}
	if ( addcoin_data.coin == 'ZET' ) {
		var logincoinfullname = 'Zetacoin',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) {
			logincoinmodeinfo = 'Full';
		} else {
			logincoinmodeinfo = 'Basilisk';
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				AddCoinData = {'userpass':tmpIguanaRPCAuth,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"services":129,"prefetchlag":-1,"poll":10,"active":1,"agent":"iguana","method":"addcoin","maxpeers":256,"newcoin":"ZET","name":"Zetacoin","netmagic":"fab503df","p2p":17333,"rpc":17335,"pubval":80,"p2shval":9,"wifval":224,"txfee_satoshis":"10000","minconfirms":2,"genesishash":"000006cab7aa2be2da91015902aa4458dd5fbb8778d175c36d429dc986f2bff4","genesis":{"version":1,"timestamp":1375548986,"nBits":"1e0fffff","nonce":2089928209,"merkle_root":"d0227b8c3e3d07bce9656b3d9e474f050d23458aaead93357dcfdac9ab9b79f9"},"alertpubkey":"045337216002ca6a71d63edf062895417610a723d453e722bf4728996c58661cdac3d4dec5cecd449b9086e9602b35cc726a9e0163e1a4d40f521fbdaebb674658"}
	}
	if ( addcoin_data.coin == 'KMD' ) {
		var logincoinfullname = 'Komodo',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) { logincoinmodeinfo = 'Full'; }
		if ( addcoin_data.mode == '0' ) { logincoinmodeinfo = 'Basilisk'; }
		if ( addcoin_data.mode == '-1' ) {
			logincoinmodeinfo = 'Native';
			var confpath = Shepherd_getConf('komodod');
			console.log(confpath[0].path);
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth');

		if ( addcoin_data.mode == '-1' ) {
			var setconfig = function() {
				return new Promise(function(resolve, reject) {
					Shepherd_setConf('komodod');
					var result = 'setconfig: DONE';
					console.log(result);
					resolve(result);
				});
			}

			var startcoin = function() {
				return new Promise(function(resolve, reject) {
					Shepherd_herd('komodod', {
						'ac_name': 'komodod',
						'ac_options': [
							'-addnode=78.47.196.146'
						]
					});

					var result = 'startcoin: DONE';
					console.log(result);
					resolve(result);
				});
			}

			setconfig()
			.then(function(result) {
				return startcoin();
			});

			var tmpinternval = 6000,
					AddCoinData = {"conf":"komodo.conf","path":confpath[0].path,"unitval":"20","zcash":1,"RELAY":-1,"VALIDATE":0,"prefetchlag":-1,"poll":10,"active":1,"agent":"iguana","method":"addcoin","startpend":8,"endpend":8,"services":0,"maxpeers":32,"newcoin":"KMD","name":"Komodo","hasheaders":1,"useaddmultisig":0,"netmagic":"f9eee48d","p2p":7770,"rpc":7771,"pubval":60,"p2shval":85,"wifval":188,"txfee_satoshis":"10000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71","protover":170002,"genesisblock":"0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a000000000000000000000000000000000000000000000000000000000000000029ab5f490f0f0f200b00000000000000000000000000000000000000000000000000000000000000fd4005000d5ba7cda5d473947263bf194285317179d2b0d307119c2e7cc4bd8ac456f0774bd52b0cd9249be9d40718b6397a4c7bbd8f2b3272fed2823cd2af4bd1632200ba4bf796727d6347b225f670f292343274cc35099466f5fb5f0cd1c105121b28213d15db2ed7bdba490b4cedc69742a57b7c25af24485e523aadbb77a0144fc76f79ef73bd8530d42b9f3b9bed1c135ad1fe152923fafe98f95f76f1615e64c4abb1137f4c31b218ba2782bc15534788dda2cc08a0ee2987c8b27ff41bd4e31cd5fb5643dfe862c9a02ca9f90c8c51a6671d681d04ad47e4b53b1518d4befafefe8cadfb912f3d03051b1efbf1dfe37b56e93a741d8dfd80d576ca250bee55fab1311fc7b3255977558cdda6f7d6f875306e43a14413facdaed2f46093e0ef1e8f8a963e1632dcbeebd8e49fd16b57d49b08f9762de89157c65233f60c8e38a1f503a48c555f8ec45dedecd574a37601323c27be597b956343107f8bd80f3a925afaf30811df83c402116bb9c1e5231c70fff899a7c82f73c902ba54da53cc459b7bf1113db65cc8f6914d3618560ea69abd13658fa7b6af92d374d6eca9529f8bd565166e4fcbf2a8dfb3c9b69539d4d2ee2e9321b85b331925df195915f2757637c2805e1d4131e1ad9ef9bc1bb1c732d8dba4738716d351ab30c996c8657bab39567ee3b29c6d054b711495c0d52e1cd5d8e55b4f0f0325b97369280755b46a02afd54be4ddd9f77c22272b8bbb17ff5118fedbae2564524e797bd28b5f74f7079d532ccc059807989f94d267f47e724b3f1ecfe00ec9e6541c961080d8891251b84b4480bc292f6a180bea089fef5bbda56e1e41390d7c0e85ba0ef530f7177413481a226465a36ef6afe1e2bca69d2078712b3912bba1a99b1fbff0d355d6ffe726d2bb6fbc103c4ac5756e5bee6e47e17424ebcbf1b63d8cb90ce2e40198b4f4198689daea254307e52a25562f4c1455340f0ffeb10f9d8e914775e37d0edca019fb1b9c6ef81255ed86bc51c5391e0591480f66e2d88c5f4fd7277697968656a9b113ab97f874fdd5f2465e5559533e01ba13ef4a8f7a21d02c30c8ded68e8c54603ab9c8084ef6d9eb4e92c75b078539e2ae786ebab6dab73a09e0aa9ac575bcefb29e930ae656e58bcb513f7e3c17e079dce4f05b5dbc18c2a872b22509740ebe6a3903e00ad1abc55076441862643f93606e3dc35e8d9f2caef3ee6be14d513b2e062b21d0061de3bd56881713a1a5c17f5ace05e1ec09da53f99442df175a49bd154aa96e4949decd52fed79ccf7ccbce32941419c314e374e4a396ac553e17b5340336a1a25c22f9e42a243ba5404450b650acfc826a6e432971ace776e15719515e1634ceb9a4a35061b668c74998d3dfb5827f6238ec015377e6f9c94f38108768cf6e5c8b132e0303fb5a200368f845ad9d46343035a6ff94031df8d8309415bb3f6cd5ede9c135fdabcc030599858d803c0f85be7661c88984d88faa3d26fb0e9aac0056a53f1b5d0baed713c853c4a2726869a0a124a8a5bbc0fc0ef80c8ae4cb53636aa02503b86a1eb9836fcc259823e2692d921d88e1ffc1e6cb2bde43939ceb3f32a611686f539f8f7c9f0bf00381f743607d40960f06d347d1cd8ac8a51969c25e37150efdf7aa4c2037a2fd0516fb444525ab157a0ed0a7412b2fa69b217fe397263153782c0f64351fbdf2678fa0dc8569912dcd8e3ccad38f34f23bbbce14c6a26ac24911b308b82c7e43062d180baeac4ba7153858365c72c63dcf5f6a5b08070b730adb017aeae925b7d0439979e2679f45ed2f25a7edcfd2fb77a8794630285ccb0a071f5cce410b46dbf9750b0354aae8b65574501cc69efb5b6a43444074fee116641bb29da56c2b4a7f456991fc92b2","debug":0}
		} else {
			var AddCoinData = {'userpass':tmpIguanaRPCAuth,"unitval":"20","zcash":1,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"prefetchlag":-1,"poll":10,"active":1,"agent":"iguana","method":"addcoin","startpend":32,"endpend":32,"services":129,"maxpeers":32,"newcoin":"KMD","name":"Komodo","hasheaders":1,"useaddmultisig":0,"netmagic":"f9eee48d","p2p":7770,"rpc":7771,"pubval":60,"p2shval":85,"wifval":188,"txfee_satoshis":"10000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71","protover":170002,"genesisblock":"0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a000000000000000000000000000000000000000000000000000000000000000029ab5f490f0f0f200b00000000000000000000000000000000000000000000000000000000000000fd4005000d5ba7cda5d473947263bf194285317179d2b0d307119c2e7cc4bd8ac456f0774bd52b0cd9249be9d40718b6397a4c7bbd8f2b3272fed2823cd2af4bd1632200ba4bf796727d6347b225f670f292343274cc35099466f5fb5f0cd1c105121b28213d15db2ed7bdba490b4cedc69742a57b7c25af24485e523aadbb77a0144fc76f79ef73bd8530d42b9f3b9bed1c135ad1fe152923fafe98f95f76f1615e64c4abb1137f4c31b218ba2782bc15534788dda2cc08a0ee2987c8b27ff41bd4e31cd5fb5643dfe862c9a02ca9f90c8c51a6671d681d04ad47e4b53b1518d4befafefe8cadfb912f3d03051b1efbf1dfe37b56e93a741d8dfd80d576ca250bee55fab1311fc7b3255977558cdda6f7d6f875306e43a14413facdaed2f46093e0ef1e8f8a963e1632dcbeebd8e49fd16b57d49b08f9762de89157c65233f60c8e38a1f503a48c555f8ec45dedecd574a37601323c27be597b956343107f8bd80f3a925afaf30811df83c402116bb9c1e5231c70fff899a7c82f73c902ba54da53cc459b7bf1113db65cc8f6914d3618560ea69abd13658fa7b6af92d374d6eca9529f8bd565166e4fcbf2a8dfb3c9b69539d4d2ee2e9321b85b331925df195915f2757637c2805e1d4131e1ad9ef9bc1bb1c732d8dba4738716d351ab30c996c8657bab39567ee3b29c6d054b711495c0d52e1cd5d8e55b4f0f0325b97369280755b46a02afd54be4ddd9f77c22272b8bbb17ff5118fedbae2564524e797bd28b5f74f7079d532ccc059807989f94d267f47e724b3f1ecfe00ec9e6541c961080d8891251b84b4480bc292f6a180bea089fef5bbda56e1e41390d7c0e85ba0ef530f7177413481a226465a36ef6afe1e2bca69d2078712b3912bba1a99b1fbff0d355d6ffe726d2bb6fbc103c4ac5756e5bee6e47e17424ebcbf1b63d8cb90ce2e40198b4f4198689daea254307e52a25562f4c1455340f0ffeb10f9d8e914775e37d0edca019fb1b9c6ef81255ed86bc51c5391e0591480f66e2d88c5f4fd7277697968656a9b113ab97f874fdd5f2465e5559533e01ba13ef4a8f7a21d02c30c8ded68e8c54603ab9c8084ef6d9eb4e92c75b078539e2ae786ebab6dab73a09e0aa9ac575bcefb29e930ae656e58bcb513f7e3c17e079dce4f05b5dbc18c2a872b22509740ebe6a3903e00ad1abc55076441862643f93606e3dc35e8d9f2caef3ee6be14d513b2e062b21d0061de3bd56881713a1a5c17f5ace05e1ec09da53f99442df175a49bd154aa96e4949decd52fed79ccf7ccbce32941419c314e374e4a396ac553e17b5340336a1a25c22f9e42a243ba5404450b650acfc826a6e432971ace776e15719515e1634ceb9a4a35061b668c74998d3dfb5827f6238ec015377e6f9c94f38108768cf6e5c8b132e0303fb5a200368f845ad9d46343035a6ff94031df8d8309415bb3f6cd5ede9c135fdabcc030599858d803c0f85be7661c88984d88faa3d26fb0e9aac0056a53f1b5d0baed713c853c4a2726869a0a124a8a5bbc0fc0ef80c8ae4cb53636aa02503b86a1eb9836fcc259823e2692d921d88e1ffc1e6cb2bde43939ceb3f32a611686f539f8f7c9f0bf00381f743607d40960f06d347d1cd8ac8a51969c25e37150efdf7aa4c2037a2fd0516fb444525ab157a0ed0a7412b2fa69b217fe397263153782c0f64351fbdf2678fa0dc8569912dcd8e3ccad38f34f23bbbce14c6a26ac24911b308b82c7e43062d180baeac4ba7153858365c72c63dcf5f6a5b08070b730adb017aeae925b7d0439979e2679f45ed2f25a7edcfd2fb77a8794630285ccb0a071f5cce410b46dbf9750b0354aae8b65574501cc69efb5b6a43444074fee116641bb29da56c2b4a7f456991fc92b2","debug":0}
		}
	}
	if ( addcoin_data.coin == 'BTM' ) {
		var logincoinfullname = 'Bitmark',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) {
			logincoinmodeinfo = 'Full';
		} else {
			logincoinmodeinfo = 'Basilisk';
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				AddCoinData = {'userpass':tmpIguanaRPCAuth,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"prefetchlag":-1,"poll":10,"active":1,"agent":"iguana","method":"addcoin","maxpeers":256,"newcoin":"BTM","name":"Bitmark","netmagic":"f9beb4d9","p2p":9265,"rpc":9266,"pubval":85,"p2shval":5,"wifval":213,"txfee_satoshis":"0","minconfirms":2,"genesishash":"c1fb746e87e89ae75bdec2ef0639a1f6786744639ce3d0ece1dcf979b79137cb","genesis":{"hashalgo":"scrypt","version":1,"timestamp":1405274442,"nBits":"1d00ffff","nonce":14385103,"merkle_root":"d4715adf41222fae3d4bf41af30c675bc27228233d0f3cfd4ae0ae1d3e760ba8"},"alertpubkey":"04bf5a75ff0f823840ef512b08add20bb4275ff6e097f2830ad28645e28cb5ea4dc2cfd0972b94019ad46f331b45ef4ba679f2e6c87fd19c864365fadb4f8d2269"}
	}
	if ( addcoin_data.coin == 'CARB' ) {
		var logincoinfullname = 'Carboncoin',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) {
			logincoinmodeinfo = 'Full';
		} else {
			logincoinmodeinfo = 'Basilisk';
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				AddCoinData = {'userpass':tmpIguanaRPCAuth,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"prefetchlag":-1,"poll":10,"active":1,"agent":"iguana","method":"addcoin","maxpeers":256,"newcoin":"CARB","name":"Carboncoin","netmagic":"abccbbdf","p2p":9350,"rpc":9351,"pubval":47,"p2shval":5,"wifval":175,"txfee_satoshis":"0","minconfirms":2,"genesishash":"a94f1aae8c409a0bd1e53cbca92d7e506b61c51d955cf56f76da501718d48d6c","genesis":{"hashalgo":"scrypt","version":1,"timestamp":1389199888,"nBits":"1e0ffff0","nonce":605268,"merkle_root":"074bbb9d355731bfa8f67130e2179db7518d1387ad52e55309d4debe7d4e6383"},"alertpubkey":"046d6918a7c0c053aa942dbb8861499be4bd915c8bfb6a2b77b3787e207097cc2734b9321226ff107c1a95dae98570a66baec66e350d78ceba091b54411654d33f"}
	}
	if ( addcoin_data.coin == 'ANC' ) {
		var logincoinfullname = 'AnonCoin',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) {
			logincoinmodeinfo = 'Full';
		} else {
			logincoinmodeinfo = 'Basilisk';
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				AddCoinData = {'userpass':tmpIguanaRPCAuth,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"prefetchlag":-1,"poll":10,"active":1,"agent":"iguana","method":"addcoin","maxpeers":256,"newcoin":"ANC","name":"AnonCoin","netmagic":"facabada","p2p":9377,"rpc":28332,"pubval":23,"p2shval":5,"wifval":151,"txfee_satoshis":"2000000","minconfirms":2,"genesishash":"00000be19c5a519257aa921349037d55548af7cabf112741eb905a26bb73e468","genesis":{"version":1,"timestamp":1370190760,"nBits":"1e0ffff0","nonce":347089008,"merkle_root":"7ce7004d764515f9b43cb9f07547c8e2e00d94c9348b3da33c8681d350f2c736"},"alertpubkey":"04c6db35c11724e526f6725cc5bd5293b4bc9382397856e1bcef7111fb44ce357fd12442b34c496d937a348c1dca1e36ae0c0e128905eb3d301433887e8f0b4536"}
	}
	if ( addcoin_data.coin == 'FRK' ) {
		var logincoinfullname = 'Franko',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) {
			logincoinmodeinfo = 'Full';
		} else {
			logincoinmodeinfo = 'Basilisk';
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth');
				AddCoinData = {'userpass':tmpIguanaRPCAuth,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"prefetchlag":-1,"poll":10,"active":1,"agent":"iguana","method":"addcoin","maxpeers":256,"newcoin":"FRK","name":"Franko","netmagic":"7defaced","p2p":7912,"rpc":7913,"pubval":35,"p2shval":5,"wifval":163,"txfee_satoshis":"0","minconfirms":2,"genesishash":"19225ae90d538561217b5949e98ca4964ac91af39090d1a4407c892293e4f44f","genesis":{"hashalgo":"scrypt","version":1,"timestamp":1368144664,"nBits":"1e0ffff0","nonce":731837,"merkle_root":"b78f79f1d10029cc45ed3d5a1db7bd423d4ee170c03baf110a62565d16a21dca"},"alertpubkey":"04d4da7a5dae4db797d9b0644d57a5cd50e05a70f36091cd62e2fc41c98ded06340be5a43a35e185690cd9cde5d72da8f6d065b499b06f51dcfba14aad859f443a"}
	}
	if ( addcoin_data.coin == 'SUPERNET' ) {
		var logincoinfullname = 'SUPERNET',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) { logincoinmodeinfo = 'Full'; }
		if ( addcoin_data.mode == '0' ) { logincoinmodeinfo = 'Basilisk'; }
		if ( addcoin_data.mode == '-1' ) {
			logincoinmodeinfo = 'Native';
			var confpath = Shepherd_getConf('SUPERNET');
			console.log(confpath[0].path);
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth');

		if ( addcoin_data.mode == '-1' ) {
			var setconfig = function() {
				return new Promise(function(resolve, reject) {
					Shepherd_setConf('SUPERNET');
					var result = 'setconfig: DONE';
					console.log(result);
					resolve(result);
				});
			}

			var startcoin = function() {
				return new Promise(function(resolve, reject) {
					Shepherd_herd('SUPERNET', {
						'ac_name': 'SUPERNET',
						'ac_options': [
							'-server',
							'-ac_name=SUPERNET',
							'-addnode=78.47.196.146'
						]
					});

					var result = 'startcoin: DONE';
					console.log(result);
					resolve(result);
				});
			}

			setconfig()
			.then(function(result) {
				return startcoin();
			});

			var tmpinternval = 6000,
					AddCoinData = {"conf":"SUPERNET.conf","path":confpath[0].path,"unitval":"20","zcash":1,"RELAY":-1,"VALIDATE":0,"prefetchlag":-1,"poll":100,"active":1,"agent":"iguana","method":"addcoin","startpend":4,"endpend":4,"services":129,"maxpeers":32,"newcoin":"SUPERNET","name":"SUPERNET","hasheaders":1,"useaddmultisig":0,"netmagic":"cc55d9d4","p2p":11340,"rpc":11341,"pubval":60,"p2shval":85,"wifval":188,"txfee_satoshis":"10000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71","protover":170002,"genesisblock":"0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a000000000000000000000000000000000000000000000000000000000000000029ab5f490f0f0f200b00000000000000000000000000000000000000000000000000000000000000fd4005000d5ba7cda5d473947263bf194285317179d2b0d307119c2e7cc4bd8ac456f0774bd52b0cd9249be9d40718b6397a4c7bbd8f2b3272fed2823cd2af4bd1632200ba4bf796727d6347b225f670f292343274cc35099466f5fb5f0cd1c105121b28213d15db2ed7bdba490b4cedc69742a57b7c25af24485e523aadbb77a0144fc76f79ef73bd8530d42b9f3b9bed1c135ad1fe152923fafe98f95f76f1615e64c4abb1137f4c31b218ba2782bc15534788dda2cc08a0ee2987c8b27ff41bd4e31cd5fb5643dfe862c9a02ca9f90c8c51a6671d681d04ad47e4b53b1518d4befafefe8cadfb912f3d03051b1efbf1dfe37b56e93a741d8dfd80d576ca250bee55fab1311fc7b3255977558cdda6f7d6f875306e43a14413facdaed2f46093e0ef1e8f8a963e1632dcbeebd8e49fd16b57d49b08f9762de89157c65233f60c8e38a1f503a48c555f8ec45dedecd574a37601323c27be597b956343107f8bd80f3a925afaf30811df83c402116bb9c1e5231c70fff899a7c82f73c902ba54da53cc459b7bf1113db65cc8f6914d3618560ea69abd13658fa7b6af92d374d6eca9529f8bd565166e4fcbf2a8dfb3c9b69539d4d2ee2e9321b85b331925df195915f2757637c2805e1d4131e1ad9ef9bc1bb1c732d8dba4738716d351ab30c996c8657bab39567ee3b29c6d054b711495c0d52e1cd5d8e55b4f0f0325b97369280755b46a02afd54be4ddd9f77c22272b8bbb17ff5118fedbae2564524e797bd28b5f74f7079d532ccc059807989f94d267f47e724b3f1ecfe00ec9e6541c961080d8891251b84b4480bc292f6a180bea089fef5bbda56e1e41390d7c0e85ba0ef530f7177413481a226465a36ef6afe1e2bca69d2078712b3912bba1a99b1fbff0d355d6ffe726d2bb6fbc103c4ac5756e5bee6e47e17424ebcbf1b63d8cb90ce2e40198b4f4198689daea254307e52a25562f4c1455340f0ffeb10f9d8e914775e37d0edca019fb1b9c6ef81255ed86bc51c5391e0591480f66e2d88c5f4fd7277697968656a9b113ab97f874fdd5f2465e5559533e01ba13ef4a8f7a21d02c30c8ded68e8c54603ab9c8084ef6d9eb4e92c75b078539e2ae786ebab6dab73a09e0aa9ac575bcefb29e930ae656e58bcb513f7e3c17e079dce4f05b5dbc18c2a872b22509740ebe6a3903e00ad1abc55076441862643f93606e3dc35e8d9f2caef3ee6be14d513b2e062b21d0061de3bd56881713a1a5c17f5ace05e1ec09da53f99442df175a49bd154aa96e4949decd52fed79ccf7ccbce32941419c314e374e4a396ac553e17b5340336a1a25c22f9e42a243ba5404450b650acfc826a6e432971ace776e15719515e1634ceb9a4a35061b668c74998d3dfb5827f6238ec015377e6f9c94f38108768cf6e5c8b132e0303fb5a200368f845ad9d46343035a6ff94031df8d8309415bb3f6cd5ede9c135fdabcc030599858d803c0f85be7661c88984d88faa3d26fb0e9aac0056a53f1b5d0baed713c853c4a2726869a0a124a8a5bbc0fc0ef80c8ae4cb53636aa02503b86a1eb9836fcc259823e2692d921d88e1ffc1e6cb2bde43939ceb3f32a611686f539f8f7c9f0bf00381f743607d40960f06d347d1cd8ac8a51969c25e37150efdf7aa4c2037a2fd0516fb444525ab157a0ed0a7412b2fa69b217fe397263153782c0f64351fbdf2678fa0dc8569912dcd8e3ccad38f34f23bbbce14c6a26ac24911b308b82c7e43062d180baeac4ba7153858365c72c63dcf5f6a5b08070b730adb017aeae925b7d0439979e2679f45ed2f25a7edcfd2fb77a8794630285ccb0a071f5cce410b46dbf9750b0354aae8b65574501cc69efb5b6a43444074fee116641bb29da56c2b4a7f456991fc92b2","debug":0,"seedipaddr":"78.47.196.146"}
		} else {
			var AddCoinData = {'userpass':tmpIguanaRPCAuth,"unitval":"20","zcash":1,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"prefetchlag":-1,"poll":100,"active":1,"agent":"iguana","method":"addcoin","startpend":4,"endpend":4,"services":129,"maxpeers":32,"newcoin":"SUPERNET","name":"SUPERNET","hasheaders":1,"useaddmultisig":0,"netmagic":"cc55d9d4","p2p":11340,"rpc":11341,"pubval":60,"p2shval":85,"wifval":188,"txfee_satoshis":"10000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71","protover":170002,"genesisblock":"0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a000000000000000000000000000000000000000000000000000000000000000029ab5f490f0f0f200b00000000000000000000000000000000000000000000000000000000000000fd4005000d5ba7cda5d473947263bf194285317179d2b0d307119c2e7cc4bd8ac456f0774bd52b0cd9249be9d40718b6397a4c7bbd8f2b3272fed2823cd2af4bd1632200ba4bf796727d6347b225f670f292343274cc35099466f5fb5f0cd1c105121b28213d15db2ed7bdba490b4cedc69742a57b7c25af24485e523aadbb77a0144fc76f79ef73bd8530d42b9f3b9bed1c135ad1fe152923fafe98f95f76f1615e64c4abb1137f4c31b218ba2782bc15534788dda2cc08a0ee2987c8b27ff41bd4e31cd5fb5643dfe862c9a02ca9f90c8c51a6671d681d04ad47e4b53b1518d4befafefe8cadfb912f3d03051b1efbf1dfe37b56e93a741d8dfd80d576ca250bee55fab1311fc7b3255977558cdda6f7d6f875306e43a14413facdaed2f46093e0ef1e8f8a963e1632dcbeebd8e49fd16b57d49b08f9762de89157c65233f60c8e38a1f503a48c555f8ec45dedecd574a37601323c27be597b956343107f8bd80f3a925afaf30811df83c402116bb9c1e5231c70fff899a7c82f73c902ba54da53cc459b7bf1113db65cc8f6914d3618560ea69abd13658fa7b6af92d374d6eca9529f8bd565166e4fcbf2a8dfb3c9b69539d4d2ee2e9321b85b331925df195915f2757637c2805e1d4131e1ad9ef9bc1bb1c732d8dba4738716d351ab30c996c8657bab39567ee3b29c6d054b711495c0d52e1cd5d8e55b4f0f0325b97369280755b46a02afd54be4ddd9f77c22272b8bbb17ff5118fedbae2564524e797bd28b5f74f7079d532ccc059807989f94d267f47e724b3f1ecfe00ec9e6541c961080d8891251b84b4480bc292f6a180bea089fef5bbda56e1e41390d7c0e85ba0ef530f7177413481a226465a36ef6afe1e2bca69d2078712b3912bba1a99b1fbff0d355d6ffe726d2bb6fbc103c4ac5756e5bee6e47e17424ebcbf1b63d8cb90ce2e40198b4f4198689daea254307e52a25562f4c1455340f0ffeb10f9d8e914775e37d0edca019fb1b9c6ef81255ed86bc51c5391e0591480f66e2d88c5f4fd7277697968656a9b113ab97f874fdd5f2465e5559533e01ba13ef4a8f7a21d02c30c8ded68e8c54603ab9c8084ef6d9eb4e92c75b078539e2ae786ebab6dab73a09e0aa9ac575bcefb29e930ae656e58bcb513f7e3c17e079dce4f05b5dbc18c2a872b22509740ebe6a3903e00ad1abc55076441862643f93606e3dc35e8d9f2caef3ee6be14d513b2e062b21d0061de3bd56881713a1a5c17f5ace05e1ec09da53f99442df175a49bd154aa96e4949decd52fed79ccf7ccbce32941419c314e374e4a396ac553e17b5340336a1a25c22f9e42a243ba5404450b650acfc826a6e432971ace776e15719515e1634ceb9a4a35061b668c74998d3dfb5827f6238ec015377e6f9c94f38108768cf6e5c8b132e0303fb5a200368f845ad9d46343035a6ff94031df8d8309415bb3f6cd5ede9c135fdabcc030599858d803c0f85be7661c88984d88faa3d26fb0e9aac0056a53f1b5d0baed713c853c4a2726869a0a124a8a5bbc0fc0ef80c8ae4cb53636aa02503b86a1eb9836fcc259823e2692d921d88e1ffc1e6cb2bde43939ceb3f32a611686f539f8f7c9f0bf00381f743607d40960f06d347d1cd8ac8a51969c25e37150efdf7aa4c2037a2fd0516fb444525ab157a0ed0a7412b2fa69b217fe397263153782c0f64351fbdf2678fa0dc8569912dcd8e3ccad38f34f23bbbce14c6a26ac24911b308b82c7e43062d180baeac4ba7153858365c72c63dcf5f6a5b08070b730adb017aeae925b7d0439979e2679f45ed2f25a7edcfd2fb77a8794630285ccb0a071f5cce410b46dbf9750b0354aae8b65574501cc69efb5b6a43444074fee116641bb29da56c2b4a7f456991fc92b2","debug":0,"seedipaddr":"78.47.196.146"}
		}
	}
	if ( addcoin_data.coin == 'REVS' ) {
		var logincoinfullname = 'REVS',
				logincoinmodeinfo = '';

		if ( addcoin_data.mode == '1' ) { logincoinmodeinfo = 'Full'; }
		if ( addcoin_data.mode == '0' ) { logincoinmodeinfo = 'Basilisk'; }
		if ( addcoin_data.mode == '-1' ) {
			logincoinmodeinfo = 'Native';
			var confpath = Shepherd_getConf('REVS');
			console.log(confpath[0].path);
		}

		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth');

		if ( addcoin_data.mode == '-1' ) {
			var setconfig = function() {
				return new Promise(function(resolve, reject) {
					Shepherd_setConf('REVS');
					var result = 'setconfig: DONE';
					console.log(result);
					resolve(result);
				});
			}

			var startcoin = function() {
				return new Promise(function(resolve, reject) {
					Shepherd_herd('REVS', {
						'ac_name': 'REVS',
						'ac_options': [
							'-server',
							'-ac_name=REVS',
							'-addnode=78.47.196.146'
						]
					});

					var result = 'startcoin: DONE';
					console.log(result);
					resolve(result);
				});
			}

			setconfig()
			.then(function(result) {
				return startcoin();
			});

			var tmpinternval = 6000,
					AddCoinData = {"conf":"REVS.conf","path":confpath[0].path,"unitval":"20","zcash":1,"RELAY":-1,"VALIDATE":0,"prefetchlag":-1,"poll":100,"active":1,"agent":"iguana","method":"addcoin","startpend":4,"endpend":4,"services":129,"maxpeers":8,"newcoin":"REVS","name":"REVS","hasheaders":1,"useaddmultisig":0,"netmagic":"905c3498","p2p":10195,"rpc":10196,"pubval":60,"p2shval":85,"wifval":188,"txfee_satoshis":"10000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71","protover":170002,"genesisblock":"0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a000000000000000000000000000000000000000000000000000000000000000029ab5f490f0f0f200b00000000000000000000000000000000000000000000000000000000000000fd4005000d5ba7cda5d473947263bf194285317179d2b0d307119c2e7cc4bd8ac456f0774bd52b0cd9249be9d40718b6397a4c7bbd8f2b3272fed2823cd2af4bd1632200ba4bf796727d6347b225f670f292343274cc35099466f5fb5f0cd1c105121b28213d15db2ed7bdba490b4cedc69742a57b7c25af24485e523aadbb77a0144fc76f79ef73bd8530d42b9f3b9bed1c135ad1fe152923fafe98f95f76f1615e64c4abb1137f4c31b218ba2782bc15534788dda2cc08a0ee2987c8b27ff41bd4e31cd5fb5643dfe862c9a02ca9f90c8c51a6671d681d04ad47e4b53b1518d4befafefe8cadfb912f3d03051b1efbf1dfe37b56e93a741d8dfd80d576ca250bee55fab1311fc7b3255977558cdda6f7d6f875306e43a14413facdaed2f46093e0ef1e8f8a963e1632dcbeebd8e49fd16b57d49b08f9762de89157c65233f60c8e38a1f503a48c555f8ec45dedecd574a37601323c27be597b956343107f8bd80f3a925afaf30811df83c402116bb9c1e5231c70fff899a7c82f73c902ba54da53cc459b7bf1113db65cc8f6914d3618560ea69abd13658fa7b6af92d374d6eca9529f8bd565166e4fcbf2a8dfb3c9b69539d4d2ee2e9321b85b331925df195915f2757637c2805e1d4131e1ad9ef9bc1bb1c732d8dba4738716d351ab30c996c8657bab39567ee3b29c6d054b711495c0d52e1cd5d8e55b4f0f0325b97369280755b46a02afd54be4ddd9f77c22272b8bbb17ff5118fedbae2564524e797bd28b5f74f7079d532ccc059807989f94d267f47e724b3f1ecfe00ec9e6541c961080d8891251b84b4480bc292f6a180bea089fef5bbda56e1e41390d7c0e85ba0ef530f7177413481a226465a36ef6afe1e2bca69d2078712b3912bba1a99b1fbff0d355d6ffe726d2bb6fbc103c4ac5756e5bee6e47e17424ebcbf1b63d8cb90ce2e40198b4f4198689daea254307e52a25562f4c1455340f0ffeb10f9d8e914775e37d0edca019fb1b9c6ef81255ed86bc51c5391e0591480f66e2d88c5f4fd7277697968656a9b113ab97f874fdd5f2465e5559533e01ba13ef4a8f7a21d02c30c8ded68e8c54603ab9c8084ef6d9eb4e92c75b078539e2ae786ebab6dab73a09e0aa9ac575bcefb29e930ae656e58bcb513f7e3c17e079dce4f05b5dbc18c2a872b22509740ebe6a3903e00ad1abc55076441862643f93606e3dc35e8d9f2caef3ee6be14d513b2e062b21d0061de3bd56881713a1a5c17f5ace05e1ec09da53f99442df175a49bd154aa96e4949decd52fed79ccf7ccbce32941419c314e374e4a396ac553e17b5340336a1a25c22f9e42a243ba5404450b650acfc826a6e432971ace776e15719515e1634ceb9a4a35061b668c74998d3dfb5827f6238ec015377e6f9c94f38108768cf6e5c8b132e0303fb5a200368f845ad9d46343035a6ff94031df8d8309415bb3f6cd5ede9c135fdabcc030599858d803c0f85be7661c88984d88faa3d26fb0e9aac0056a53f1b5d0baed713c853c4a2726869a0a124a8a5bbc0fc0ef80c8ae4cb53636aa02503b86a1eb9836fcc259823e2692d921d88e1ffc1e6cb2bde43939ceb3f32a611686f539f8f7c9f0bf00381f743607d40960f06d347d1cd8ac8a51969c25e37150efdf7aa4c2037a2fd0516fb444525ab157a0ed0a7412b2fa69b217fe397263153782c0f64351fbdf2678fa0dc8569912dcd8e3ccad38f34f23bbbce14c6a26ac24911b308b82c7e43062d180baeac4ba7153858365c72c63dcf5f6a5b08070b730adb017aeae925b7d0439979e2679f45ed2f25a7edcfd2fb77a8794630285ccb0a071f5cce410b46dbf9750b0354aae8b65574501cc69efb5b6a43444074fee116641bb29da56c2b4a7f456991fc92b2","debug":0,"seedipaddr":"78.47.196.146"}
		} else {
			var AddCoinData = {'userpass':tmpIguanaRPCAuth,"unitval":"20","zcash":1,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"prefetchlag":-1,"poll":100,"active":1,"agent":"iguana","method":"addcoin","startpend":4,"endpend":4,"services":129,"maxpeers":8,"newcoin":"REVS","name":"REVS","hasheaders":1,"useaddmultisig":0,"netmagic":"905c3498","p2p":10195,"rpc":10196,"pubval":60,"p2shval":85,"wifval":188,"txfee_satoshis":"10000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71","protover":170002,"genesisblock":"0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a000000000000000000000000000000000000000000000000000000000000000029ab5f490f0f0f200b00000000000000000000000000000000000000000000000000000000000000fd4005000d5ba7cda5d473947263bf194285317179d2b0d307119c2e7cc4bd8ac456f0774bd52b0cd9249be9d40718b6397a4c7bbd8f2b3272fed2823cd2af4bd1632200ba4bf796727d6347b225f670f292343274cc35099466f5fb5f0cd1c105121b28213d15db2ed7bdba490b4cedc69742a57b7c25af24485e523aadbb77a0144fc76f79ef73bd8530d42b9f3b9bed1c135ad1fe152923fafe98f95f76f1615e64c4abb1137f4c31b218ba2782bc15534788dda2cc08a0ee2987c8b27ff41bd4e31cd5fb5643dfe862c9a02ca9f90c8c51a6671d681d04ad47e4b53b1518d4befafefe8cadfb912f3d03051b1efbf1dfe37b56e93a741d8dfd80d576ca250bee55fab1311fc7b3255977558cdda6f7d6f875306e43a14413facdaed2f46093e0ef1e8f8a963e1632dcbeebd8e49fd16b57d49b08f9762de89157c65233f60c8e38a1f503a48c555f8ec45dedecd574a37601323c27be597b956343107f8bd80f3a925afaf30811df83c402116bb9c1e5231c70fff899a7c82f73c902ba54da53cc459b7bf1113db65cc8f6914d3618560ea69abd13658fa7b6af92d374d6eca9529f8bd565166e4fcbf2a8dfb3c9b69539d4d2ee2e9321b85b331925df195915f2757637c2805e1d4131e1ad9ef9bc1bb1c732d8dba4738716d351ab30c996c8657bab39567ee3b29c6d054b711495c0d52e1cd5d8e55b4f0f0325b97369280755b46a02afd54be4ddd9f77c22272b8bbb17ff5118fedbae2564524e797bd28b5f74f7079d532ccc059807989f94d267f47e724b3f1ecfe00ec9e6541c961080d8891251b84b4480bc292f6a180bea089fef5bbda56e1e41390d7c0e85ba0ef530f7177413481a226465a36ef6afe1e2bca69d2078712b3912bba1a99b1fbff0d355d6ffe726d2bb6fbc103c4ac5756e5bee6e47e17424ebcbf1b63d8cb90ce2e40198b4f4198689daea254307e52a25562f4c1455340f0ffeb10f9d8e914775e37d0edca019fb1b9c6ef81255ed86bc51c5391e0591480f66e2d88c5f4fd7277697968656a9b113ab97f874fdd5f2465e5559533e01ba13ef4a8f7a21d02c30c8ded68e8c54603ab9c8084ef6d9eb4e92c75b078539e2ae786ebab6dab73a09e0aa9ac575bcefb29e930ae656e58bcb513f7e3c17e079dce4f05b5dbc18c2a872b22509740ebe6a3903e00ad1abc55076441862643f93606e3dc35e8d9f2caef3ee6be14d513b2e062b21d0061de3bd56881713a1a5c17f5ace05e1ec09da53f99442df175a49bd154aa96e4949decd52fed79ccf7ccbce32941419c314e374e4a396ac553e17b5340336a1a25c22f9e42a243ba5404450b650acfc826a6e432971ace776e15719515e1634ceb9a4a35061b668c74998d3dfb5827f6238ec015377e6f9c94f38108768cf6e5c8b132e0303fb5a200368f845ad9d46343035a6ff94031df8d8309415bb3f6cd5ede9c135fdabcc030599858d803c0f85be7661c88984d88faa3d26fb0e9aac0056a53f1b5d0baed713c853c4a2726869a0a124a8a5bbc0fc0ef80c8ae4cb53636aa02503b86a1eb9836fcc259823e2692d921d88e1ffc1e6cb2bde43939ceb3f32a611686f539f8f7c9f0bf00381f743607d40960f06d347d1cd8ac8a51969c25e37150efdf7aa4c2037a2fd0516fb444525ab157a0ed0a7412b2fa69b217fe397263153782c0f64351fbdf2678fa0dc8569912dcd8e3ccad38f34f23bbbce14c6a26ac24911b308b82c7e43062d180baeac4ba7153858365c72c63dcf5f6a5b08070b730adb017aeae925b7d0439979e2679f45ed2f25a7edcfd2fb77a8794630285ccb0a071f5cce410b46dbf9750b0354aae8b65574501cc69efb5b6a43444074fee116641bb29da56c2b4a7f456991fc92b2","debug":0,"seedipaddr":"78.47.196.146"}
		}
	}

    if ( addcoin_data.coin == 'WIRELESS' ) {
        var logincoinfullname = 'WIRELESS',
                logincoinmodeinfo = '';

        if ( addcoin_data.mode == '1' ) { logincoinmodeinfo = 'Full'; }
        if ( addcoin_data.mode == '0' ) { logincoinmodeinfo = 'Basilisk'; }
        if ( addcoin_data.mode == '-1' ) {
            logincoinmodeinfo = 'Native';
            var confpath = Shepherd_getConf('WIRELESS');
            console.log(confpath[0].path);
        }

        var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth');

        if ( addcoin_data.mode == '-1' ) {
            var setconfig = function() {
                return new Promise(function(resolve, reject) {
                    Shepherd_setConf('WIRELESS');
                    var result = 'setconfig: DONE';
                    console.log(result);
                    resolve(result);
                });
            }

            var startcoin = function() {
                return new Promise(function(resolve, reject) {
                    Shepherd_herd('WIRELESS', {
                        'ac_name': 'WIRELESS',
                        'ac_options': [
                            '-server',
                            '-ac_name=WIRELESS',
                            '-addnode=78.47.196.146'
                        ]
                    });

                    var result = 'startcoin: DONE';
                    console.log(result);
                    resolve(result);
                });
            }

            setconfig()
            .then(function(result) {
                return startcoin();
            });

            var tmpinternval = 6000,
                    AddCoinData = {"conf":"WIRELESS.conf","path":confpath[0].path,"unitval":"20","zcash":1,"RELAY":-1,"VALIDATE":0,"prefetchlag":-1,"poll":100,"active":1,"agent":"iguana","method":"addcoin","startpend":4,"endpend":4,"services":129,"maxpeers":8,"newcoin":"WIRELESS","name":"WIRELESS","hasheaders":1,"useaddmultisig":0,"netmagic":"62071ed3","p2p":11666,"rpc":11667,"pubval":60,"p2shval":85,"wifval":188,"txfee_satoshis":"10000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71","protover":170002,"genesisblock":"0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a000000000000000000000000000000000000000000000000000000000000000029ab5f490f0f0f200b00000000000000000000000000000000000000000000000000000000000000fd4005000d5ba7cda5d473947263bf194285317179d2b0d307119c2e7cc4bd8ac456f0774bd52b0cd9249be9d40718b6397a4c7bbd8f2b3272fed2823cd2af4bd1632200ba4bf796727d6347b225f670f292343274cc35099466f5fb5f0cd1c105121b28213d15db2ed7bdba490b4cedc69742a57b7c25af24485e523aadbb77a0144fc76f79ef73bd8530d42b9f3b9bed1c135ad1fe152923fafe98f95f76f1615e64c4abb1137f4c31b218ba2782bc15534788dda2cc08a0ee2987c8b27ff41bd4e31cd5fb5643dfe862c9a02ca9f90c8c51a6671d681d04ad47e4b53b1518d4befafefe8cadfb912f3d03051b1efbf1dfe37b56e93a741d8dfd80d576ca250bee55fab1311fc7b3255977558cdda6f7d6f875306e43a14413facdaed2f46093e0ef1e8f8a963e1632dcbeebd8e49fd16b57d49b08f9762de89157c65233f60c8e38a1f503a48c555f8ec45dedecd574a37601323c27be597b956343107f8bd80f3a925afaf30811df83c402116bb9c1e5231c70fff899a7c82f73c902ba54da53cc459b7bf1113db65cc8f6914d3618560ea69abd13658fa7b6af92d374d6eca9529f8bd565166e4fcbf2a8dfb3c9b69539d4d2ee2e9321b85b331925df195915f2757637c2805e1d4131e1ad9ef9bc1bb1c732d8dba4738716d351ab30c996c8657bab39567ee3b29c6d054b711495c0d52e1cd5d8e55b4f0f0325b97369280755b46a02afd54be4ddd9f77c22272b8bbb17ff5118fedbae2564524e797bd28b5f74f7079d532ccc059807989f94d267f47e724b3f1ecfe00ec9e6541c961080d8891251b84b4480bc292f6a180bea089fef5bbda56e1e41390d7c0e85ba0ef530f7177413481a226465a36ef6afe1e2bca69d2078712b3912bba1a99b1fbff0d355d6ffe726d2bb6fbc103c4ac5756e5bee6e47e17424ebcbf1b63d8cb90ce2e40198b4f4198689daea254307e52a25562f4c1455340f0ffeb10f9d8e914775e37d0edca019fb1b9c6ef81255ed86bc51c5391e0591480f66e2d88c5f4fd7277697968656a9b113ab97f874fdd5f2465e5559533e01ba13ef4a8f7a21d02c30c8ded68e8c54603ab9c8084ef6d9eb4e92c75b078539e2ae786ebab6dab73a09e0aa9ac575bcefb29e930ae656e58bcb513f7e3c17e079dce4f05b5dbc18c2a872b22509740ebe6a3903e00ad1abc55076441862643f93606e3dc35e8d9f2caef3ee6be14d513b2e062b21d0061de3bd56881713a1a5c17f5ace05e1ec09da53f99442df175a49bd154aa96e4949decd52fed79ccf7ccbce32941419c314e374e4a396ac553e17b5340336a1a25c22f9e42a243ba5404450b650acfc826a6e432971ace776e15719515e1634ceb9a4a35061b668c74998d3dfb5827f6238ec015377e6f9c94f38108768cf6e5c8b132e0303fb5a200368f845ad9d46343035a6ff94031df8d8309415bb3f6cd5ede9c135fdabcc030599858d803c0f85be7661c88984d88faa3d26fb0e9aac0056a53f1b5d0baed713c853c4a2726869a0a124a8a5bbc0fc0ef80c8ae4cb53636aa02503b86a1eb9836fcc259823e2692d921d88e1ffc1e6cb2bde43939ceb3f32a611686f539f8f7c9f0bf00381f743607d40960f06d347d1cd8ac8a51969c25e37150efdf7aa4c2037a2fd0516fb444525ab157a0ed0a7412b2fa69b217fe397263153782c0f64351fbdf2678fa0dc8569912dcd8e3ccad38f34f23bbbce14c6a26ac24911b308b82c7e43062d180baeac4ba7153858365c72c63dcf5f6a5b08070b730adb017aeae925b7d0439979e2679f45ed2f25a7edcfd2fb77a8794630285ccb0a071f5cce410b46dbf9750b0354aae8b65574501cc69efb5b6a43444074fee116641bb29da56c2b4a7f456991fc92b2","debug":0,"seedipaddr":"78.47.196.146"}
        } else {
            var AddCoinData = 
            {'userpass':tmpIguanaRPCAuth,"unitval":"20","zcash":1,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"prefetchlag":-1,"poll":100,"active":1,"agent":"iguana","method":"addcoin","startpend":4,"endpend":4,"services":129,"maxpeers":8,"newcoin":"WIRELESS","name":"WIRELESS","hasheaders":1,"useaddmultisig":0,"netmagic":"62071ed3","p2p":11666,"rpc":11667,"pubval":60,"p2shval":85,"wifval":188,"txfee_satoshis":"10000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71","protover":170002,"genesisblock":"0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a000000000000000000000000000000000000000000000000000000000000000029ab5f490f0f0f200b00000000000000000000000000000000000000000000000000000000000000fd4005000d5ba7cda5d473947263bf194285317179d2b0d307119c2e7cc4bd8ac456f0774bd52b0cd9249be9d40718b6397a4c7bbd8f2b3272fed2823cd2af4bd1632200ba4bf796727d6347b225f670f292343274cc35099466f5fb5f0cd1c105121b28213d15db2ed7bdba490b4cedc69742a57b7c25af24485e523aadbb77a0144fc76f79ef73bd8530d42b9f3b9bed1c135ad1fe152923fafe98f95f76f1615e64c4abb1137f4c31b218ba2782bc15534788dda2cc08a0ee2987c8b27ff41bd4e31cd5fb5643dfe862c9a02ca9f90c8c51a6671d681d04ad47e4b53b1518d4befafefe8cadfb912f3d03051b1efbf1dfe37b56e93a741d8dfd80d576ca250bee55fab1311fc7b3255977558cdda6f7d6f875306e43a14413facdaed2f46093e0ef1e8f8a963e1632dcbeebd8e49fd16b57d49b08f9762de89157c65233f60c8e38a1f503a48c555f8ec45dedecd574a37601323c27be597b956343107f8bd80f3a925afaf30811df83c402116bb9c1e5231c70fff899a7c82f73c902ba54da53cc459b7bf1113db65cc8f6914d3618560ea69abd13658fa7b6af92d374d6eca9529f8bd565166e4fcbf2a8dfb3c9b69539d4d2ee2e9321b85b331925df195915f2757637c2805e1d4131e1ad9ef9bc1bb1c732d8dba4738716d351ab30c996c8657bab39567ee3b29c6d054b711495c0d52e1cd5d8e55b4f0f0325b97369280755b46a02afd54be4ddd9f77c22272b8bbb17ff5118fedbae2564524e797bd28b5f74f7079d532ccc059807989f94d267f47e724b3f1ecfe00ec9e6541c961080d8891251b84b4480bc292f6a180bea089fef5bbda56e1e41390d7c0e85ba0ef530f7177413481a226465a36ef6afe1e2bca69d2078712b3912bba1a99b1fbff0d355d6ffe726d2bb6fbc103c4ac5756e5bee6e47e17424ebcbf1b63d8cb90ce2e40198b4f4198689daea254307e52a25562f4c1455340f0ffeb10f9d8e914775e37d0edca019fb1b9c6ef81255ed86bc51c5391e0591480f66e2d88c5f4fd7277697968656a9b113ab97f874fdd5f2465e5559533e01ba13ef4a8f7a21d02c30c8ded68e8c54603ab9c8084ef6d9eb4e92c75b078539e2ae786ebab6dab73a09e0aa9ac575bcefb29e930ae656e58bcb513f7e3c17e079dce4f05b5dbc18c2a872b22509740ebe6a3903e00ad1abc55076441862643f93606e3dc35e8d9f2caef3ee6be14d513b2e062b21d0061de3bd56881713a1a5c17f5ace05e1ec09da53f99442df175a49bd154aa96e4949decd52fed79ccf7ccbce32941419c314e374e4a396ac553e17b5340336a1a25c22f9e42a243ba5404450b650acfc826a6e432971ace776e15719515e1634ceb9a4a35061b668c74998d3dfb5827f6238ec015377e6f9c94f38108768cf6e5c8b132e0303fb5a200368f845ad9d46343035a6ff94031df8d8309415bb3f6cd5ede9c135fdabcc030599858d803c0f85be7661c88984d88faa3d26fb0e9aac0056a53f1b5d0baed713c853c4a2726869a0a124a8a5bbc0fc0ef80c8ae4cb53636aa02503b86a1eb9836fcc259823e2692d921d88e1ffc1e6cb2bde43939ceb3f32a611686f539f8f7c9f0bf00381f743607d40960f06d347d1cd8ac8a51969c25e37150efdf7aa4c2037a2fd0516fb444525ab157a0ed0a7412b2fa69b217fe397263153782c0f64351fbdf2678fa0dc8569912dcd8e3ccad38f34f23bbbce14c6a26ac24911b308b82c7e43062d180baeac4ba7153858365c72c63dcf5f6a5b08070b730adb017aeae925b7d0439979e2679f45ed2f25a7edcfd2fb77a8794630285ccb0a071f5cce410b46dbf9750b0354aae8b65574501cc69efb5b6a43444074fee116641bb29da56c2b4a7f456991fc92b2","debug":0,"seedipaddr":"78.47.196.146"}
        }
    }


    if ( addcoin_data.coin == 'USD' ) {
        var logincoinfullname = 'USD',
                logincoinmodeinfo = '',
                tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth');

        if ( addcoin_data.mode == '1' ) {
            logincoinmodeinfo = 'Full';
            var AddCoinData = {
                'userpass': tmpIguanaRPCAuth,
                'agent': 'iguana',
                'method': 'paxfiats',
                'mask': 1
            };
        }
        if ( addcoin_data.mode == '0' ) {
            logincoinmodeinfo = 'Basilisk';
            var AddCoinData = {
                'userpass': tmpIguanaRPCAuth,
                'agent': 'basilisk',
                'method': 'paxfiats',
                'mask': 1
            };
        }
        if ( addcoin_data.mode == '-1' ) {
            logincoinmodeinfo = 'Native';
            var confpath = Shepherd_getConf('USD');
            console.log(confpath[0].path);
        }

        var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth');

        if ( addcoin_data.mode == '-1' ) {
            var setconfig = function() {
                return new Promise(function(resolve, reject) {
                    Shepherd_setConf('USD');
                    var result = 'setconfig: DONE';
                    console.log(result);
                    resolve(result);
                });
            }

            var startcoin = function() {
                return new Promise(function(resolve, reject) {
                    Shepherd_herd('USD', {
                        'ac_name': 'USD',
                        'ac_options': [
                            '-server',
                            '-ac_name=USD',
                            '-addnode=78.47.196.146'
                        ]
                    });

                    var result = 'startcoin: DONE';
                    console.log(result);
                    resolve(result);
                });
            }

            setconfig()
            .then(function(result) {
                return startcoin();
            });

            var tmpinternval = 6000,
                    AddCoinData = {"conf":"USD.conf","path":confpath[0].path,"unitval":"20","zcash":1,"RELAY":-1,"VALIDATE":1,"prefetchlag":-1,"poll":100,"active":1,"agent":"iguana","method":"addcoin","startpend":4,"endpend":4,"services":129,"maxpeers":8,"newcoin":"USD","name":"USD","hasheaders":1,"useaddmultisig":0,"netmagic":"2d8e7803","p2p":13966,"rpc":13967,"pubval":60,"p2shval":85,"wifval":188,"txfee_satoshis":"10000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71","protover":170002,"genesisblock":"0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a000000000000000000000000000000000000000000000000000000000000000029ab5f490f0f0f200b00000000000000000000000000000000000000000000000000000000000000fd4005000d5ba7cda5d473947263bf194285317179d2b0d307119c2e7cc4bd8ac456f0774bd52b0cd9249be9d40718b6397a4c7bbd8f2b3272fed2823cd2af4bd1632200ba4bf796727d6347b225f670f292343274cc35099466f5fb5f0cd1c105121b28213d15db2ed7bdba490b4cedc69742a57b7c25af24485e523aadbb77a0144fc76f79ef73bd8530d42b9f3b9bed1c135ad1fe152923fafe98f95f76f1615e64c4abb1137f4c31b218ba2782bc15534788dda2cc08a0ee2987c8b27ff41bd4e31cd5fb5643dfe862c9a02ca9f90c8c51a6671d681d04ad47e4b53b1518d4befafefe8cadfb912f3d03051b1efbf1dfe37b56e93a741d8dfd80d576ca250bee55fab1311fc7b3255977558cdda6f7d6f875306e43a14413facdaed2f46093e0ef1e8f8a963e1632dcbeebd8e49fd16b57d49b08f9762de89157c65233f60c8e38a1f503a48c555f8ec45dedecd574a37601323c27be597b956343107f8bd80f3a925afaf30811df83c402116bb9c1e5231c70fff899a7c82f73c902ba54da53cc459b7bf1113db65cc8f6914d3618560ea69abd13658fa7b6af92d374d6eca9529f8bd565166e4fcbf2a8dfb3c9b69539d4d2ee2e9321b85b331925df195915f2757637c2805e1d4131e1ad9ef9bc1bb1c732d8dba4738716d351ab30c996c8657bab39567ee3b29c6d054b711495c0d52e1cd5d8e55b4f0f0325b97369280755b46a02afd54be4ddd9f77c22272b8bbb17ff5118fedbae2564524e797bd28b5f74f7079d532ccc059807989f94d267f47e724b3f1ecfe00ec9e6541c961080d8891251b84b4480bc292f6a180bea089fef5bbda56e1e41390d7c0e85ba0ef530f7177413481a226465a36ef6afe1e2bca69d2078712b3912bba1a99b1fbff0d355d6ffe726d2bb6fbc103c4ac5756e5bee6e47e17424ebcbf1b63d8cb90ce2e40198b4f4198689daea254307e52a25562f4c1455340f0ffeb10f9d8e914775e37d0edca019fb1b9c6ef81255ed86bc51c5391e0591480f66e2d88c5f4fd7277697968656a9b113ab97f874fdd5f2465e5559533e01ba13ef4a8f7a21d02c30c8ded68e8c54603ab9c8084ef6d9eb4e92c75b078539e2ae786ebab6dab73a09e0aa9ac575bcefb29e930ae656e58bcb513f7e3c17e079dce4f05b5dbc18c2a872b22509740ebe6a3903e00ad1abc55076441862643f93606e3dc35e8d9f2caef3ee6be14d513b2e062b21d0061de3bd56881713a1a5c17f5ace05e1ec09da53f99442df175a49bd154aa96e4949decd52fed79ccf7ccbce32941419c314e374e4a396ac553e17b5340336a1a25c22f9e42a243ba5404450b650acfc826a6e432971ace776e15719515e1634ceb9a4a35061b668c74998d3dfb5827f6238ec015377e6f9c94f38108768cf6e5c8b132e0303fb5a200368f845ad9d46343035a6ff94031df8d8309415bb3f6cd5ede9c135fdabcc030599858d803c0f85be7661c88984d88faa3d26fb0e9aac0056a53f1b5d0baed713c853c4a2726869a0a124a8a5bbc0fc0ef80c8ae4cb53636aa02503b86a1eb9836fcc259823e2692d921d88e1ffc1e6cb2bde43939ceb3f32a611686f539f8f7c9f0bf00381f743607d40960f06d347d1cd8ac8a51969c25e37150efdf7aa4c2037a2fd0516fb444525ab157a0ed0a7412b2fa69b217fe397263153782c0f64351fbdf2678fa0dc8569912dcd8e3ccad38f34f23bbbce14c6a26ac24911b308b82c7e43062d180baeac4ba7153858365c72c63dcf5f6a5b08070b730adb017aeae925b7d0439979e2679f45ed2f25a7edcfd2fb77a8794630285ccb0a071f5cce410b46dbf9750b0354aae8b65574501cc69efb5b6a43444074fee116641bb29da56c2b4a7f456991fc92b2","debug":0,"seedipaddr":"78.47.196.146"}
        } else {
            var AddCoinData = {'userpass':tmpIguanaRPCAuth,"unitval":"20","zcash":1,"RELAY":addcoin_data.mode,"VALIDATE":addcoin_data.mode,"prefetchlag":-1,"poll":100,"active":1,"agent":"iguana","method":"addcoin","startpend":4,"endpend":4,"services":129,"maxpeers":8,"newcoin":"USD","name":"USD","hasheaders":1,"useaddmultisig":0,"netmagic":"2d8e7803","p2p":13966,"rpc":13967,"pubval":60,"p2shval":85,"wifval":188,"txfee_satoshis":"10000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71","protover":170002,"genesisblock":"0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a000000000000000000000000000000000000000000000000000000000000000029ab5f490f0f0f200b00000000000000000000000000000000000000000000000000000000000000fd4005000d5ba7cda5d473947263bf194285317179d2b0d307119c2e7cc4bd8ac456f0774bd52b0cd9249be9d40718b6397a4c7bbd8f2b3272fed2823cd2af4bd1632200ba4bf796727d6347b225f670f292343274cc35099466f5fb5f0cd1c105121b28213d15db2ed7bdba490b4cedc69742a57b7c25af24485e523aadbb77a0144fc76f79ef73bd8530d42b9f3b9bed1c135ad1fe152923fafe98f95f76f1615e64c4abb1137f4c31b218ba2782bc15534788dda2cc08a0ee2987c8b27ff41bd4e31cd5fb5643dfe862c9a02ca9f90c8c51a6671d681d04ad47e4b53b1518d4befafefe8cadfb912f3d03051b1efbf1dfe37b56e93a741d8dfd80d576ca250bee55fab1311fc7b3255977558cdda6f7d6f875306e43a14413facdaed2f46093e0ef1e8f8a963e1632dcbeebd8e49fd16b57d49b08f9762de89157c65233f60c8e38a1f503a48c555f8ec45dedecd574a37601323c27be597b956343107f8bd80f3a925afaf30811df83c402116bb9c1e5231c70fff899a7c82f73c902ba54da53cc459b7bf1113db65cc8f6914d3618560ea69abd13658fa7b6af92d374d6eca9529f8bd565166e4fcbf2a8dfb3c9b69539d4d2ee2e9321b85b331925df195915f2757637c2805e1d4131e1ad9ef9bc1bb1c732d8dba4738716d351ab30c996c8657bab39567ee3b29c6d054b711495c0d52e1cd5d8e55b4f0f0325b97369280755b46a02afd54be4ddd9f77c22272b8bbb17ff5118fedbae2564524e797bd28b5f74f7079d532ccc059807989f94d267f47e724b3f1ecfe00ec9e6541c961080d8891251b84b4480bc292f6a180bea089fef5bbda56e1e41390d7c0e85ba0ef530f7177413481a226465a36ef6afe1e2bca69d2078712b3912bba1a99b1fbff0d355d6ffe726d2bb6fbc103c4ac5756e5bee6e47e17424ebcbf1b63d8cb90ce2e40198b4f4198689daea254307e52a25562f4c1455340f0ffeb10f9d8e914775e37d0edca019fb1b9c6ef81255ed86bc51c5391e0591480f66e2d88c5f4fd7277697968656a9b113ab97f874fdd5f2465e5559533e01ba13ef4a8f7a21d02c30c8ded68e8c54603ab9c8084ef6d9eb4e92c75b078539e2ae786ebab6dab73a09e0aa9ac575bcefb29e930ae656e58bcb513f7e3c17e079dce4f05b5dbc18c2a872b22509740ebe6a3903e00ad1abc55076441862643f93606e3dc35e8d9f2caef3ee6be14d513b2e062b21d0061de3bd56881713a1a5c17f5ace05e1ec09da53f99442df175a49bd154aa96e4949decd52fed79ccf7ccbce32941419c314e374e4a396ac553e17b5340336a1a25c22f9e42a243ba5404450b650acfc826a6e432971ace776e15719515e1634ceb9a4a35061b668c74998d3dfb5827f6238ec015377e6f9c94f38108768cf6e5c8b132e0303fb5a200368f845ad9d46343035a6ff94031df8d8309415bb3f6cd5ede9c135fdabcc030599858d803c0f85be7661c88984d88faa3d26fb0e9aac0056a53f1b5d0baed713c853c4a2726869a0a124a8a5bbc0fc0ef80c8ae4cb53636aa02503b86a1eb9836fcc259823e2692d921d88e1ffc1e6cb2bde43939ceb3f32a611686f539f8f7c9f0bf00381f743607d40960f06d347d1cd8ac8a51969c25e37150efdf7aa4c2037a2fd0516fb444525ab157a0ed0a7412b2fa69b217fe397263153782c0f64351fbdf2678fa0dc8569912dcd8e3ccad38f34f23bbbce14c6a26ac24911b308b82c7e43062d180baeac4ba7153858365c72c63dcf5f6a5b08070b730adb017aeae925b7d0439979e2679f45ed2f25a7edcfd2fb77a8794630285ccb0a071f5cce410b46dbf9750b0354aae8b65574501cc69efb5b6a43444074fee116641bb29da56c2b4a7f456991fc92b2","debug":0,"seedipaddr":"78.47.196.146"}
        }
    }
	setTimeout(function() {
		$.ajax({
			type: 'POST',
			data: JSON.stringify(AddCoinData),
			url: 'http://127.0.0.1:7778',
			success: function(data, textStatus, jqXHR) {
				var addcoinData = JSON.parse(data);

				if (addcoinData.result === 'coin added') {
					Iguana_Setactivehandle();
					console.log('coin added');
					toastr.success(logincoinfullname + ' started in ' + logincoinmodeinfo + ' Mode', 'Coin Notification');

					if (addcoin_data.logincmd == undefined) {
						console.log('command NOT executed from login. RELOADING WALLET WIDGETS...');
						refreshEDEXCoinWalletList();
						//Iguana_DEXImportAll();
						Shepherd_FetchBasiliskData().then(function(result) {
							console.log(result);
						});
						//EDEXMainAddr(addcoin_data.coin).then(function(result){
								//console.log(result)
								//Iguana_DEXImportAddr(addcoin_data.coin,result);
						//})
						//Iguana_DEXImportAllWalletAddr(addcoin_data.coin)
						//$(document).ready(function() { window.location.reload(); });
					} else {
						Iguana_CheckActiveCoins().then(function(result) {
							if (result.length !== 0 ) {
								$('#section-login-addcoin-btn').hide();
								$('#section-login').show();
							}
						});
					}

					$('#addcoin_mdl_full_mode').prop('checked', false);
					$('#addcoin_mdl_basilisk_mode').prop('checked', false);
					$('#addcoin_mdl_native_mode').prop('checked', false);
					$('#addcoin_select_coin_mdl_options').val('-Select-');
				} else if (addcoinData.result === 'coin already there') {
					console.log('coin already there');
					toastr.info('Looks like ' + logincoinfullname + ' already running.', 'Coin Notification');
				} else if (addcoinData.result === null) {
					console.log('coin already there');
					toastr.info('Looks like ' + logincoinfullname + ' already running.', 'Coin Notification');
				}
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
	}, tmpinternval);
}

function ExecuteAddCoinFn() {
	var addcoin_selected_mode_val = $('input[name="addcoin_select_mode_mdl"]:checked').val(),
			addcoin_selected_coinname_code_val = $('option:selected', '#addcoin_select_coin_mdl_options').val(),
			ExecAddCoinData = {
				'coin': addcoin_selected_coinname_code_val,
				'mode': addcoin_selected_mode_val
			};

	Iguana_addcoin(ExecAddCoinData);
}

function ExecuteAddCoinLoginFn() {
	var addcoin_selected_mode_val = $('input[name="addcoin_select_mode_mdl-login"]:checked').val(),
			addcoin_selected_coinname_code_val = $('option:selected', '#addcoin_select_coin_mdl_options-login').val(),
			ExecAddCoinData = {
				'coin': addcoin_selected_coinname_code_val,
				'mode': addcoin_selected_mode_val,
				'logincmd': 1
			};

	Iguana_addcoin(ExecAddCoinData);
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
      hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours(),
			min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes(),
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


function EDEXlistunspent(coin, addr) {
	NProgress.done(true);
	NProgress.configure({
		template: '<div class="bar nprogress-bar-header nprogress-bar-info" role="bar"></div>' +
							'<div class="spinner" role="spinner">' +
								'<div class="spinner-icon"></div>' +
							'</div>'
	});
	NProgress.start();

	return new Promise((resolve) => {
		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth');

		if (addr == undefined) {
			addr = '';

			var ajax_data = {
				'userpass': tmpIguanaRPCAuth,
				'coin': coin,
				'method': 'listunspent',
				'params': [
					1,
					9999999,
					[]
				]
			};
		} else {
			var ajax_data = {
				'userpass': tmpIguanaRPCAuth,
				'coin': coin,
				'method': 'listunspent',
				'params': [
					1,
					9999999,
					[addr]
				]
			};
		}
		var active_edexcoinmodecode = sessionStorage.getItem('edexTmpMode');

		var ajaxCall = $.ajax({
			data: JSON.stringify(ajax_data),
			url: 'http://127.0.0.1:7778',
			type: 'POST',
			dataType: 'json'
		});

		ajaxCall.done(function(data) {
			var result = [];

			// This code using undscore.js takes only the address into an array which are unique in that list
			var unique_addresses  = _.keys(_.countBy(data, function(data) { return data.address; }));

			// This function calls each unique address and calculates the total amount of coins in it.
			$.each(unique_addresses, function(index) {
				var unique_addr_tmp_array = _.where(data, { address: unique_addresses[index] }),
						tmpcalcnum = 0,
						tmpcalcinterest = 0,
						interest_enable = false,
						tmptotalbalance = 0;

				$.each(data, function(index) {
					if ( data[index].interest !== undefined ) {
						// console.log('interest is available for this currency. Adding to total balance.');
						tmpcalcnum = tmpcalcnum + data[index].amount;
						tmpcalcinterest = tmpcalcinterest + data[index].interest;
						interest_enable = true;
					}
					if ( data[index].interest === undefined ) {
						tmpcalcnum = tmpcalcnum + data[index].amount;
					}
				});

				if ( coin == 'KMD' ) {
					tmptotalbalance = parseFloat(tmpcalcnum) + parseFloat(tmpcalcinterest);
					var tmp_addr_total_balance_output = {
						'addr': unique_addr_tmp_array[0].address,
						'total': tmpcalcnum.toFixed(8),
						'interest': tmpcalcinterest.toFixed(8),
						'totalbalance': tmptotalbalance.toFixed(8)
					};
				}
				if ( coin !== 'KMD' ) {
					var tmp_addr_total_balance_output = {
						'addr': unique_addr_tmp_array[0].address,
						'total': tmpcalcnum.toFixed(8)
					};
				}

				/*var tmpcalcnum = 0;
				$.each(unique_addr_tmp_array, function(index, value) {
						//console.log(value.amount);
						if ( value.interest !== undefined ) {
								tmpcalcnum = tmpcalcnum + value.amount + value.interest;
						}
						if ( value.interest === undefined ) {
								tmpcalcnum = tmpcalcnum + value.amount;
						}
				});
				//console.log(tmpcalcnum);
				var tmp_addr_total_balance_output = {"addr": unique_addr_tmp_array[0].address, "total": tmpcalcnum};*/
				//console.log(tmp_addr_total_balance_output);

				result.push(tmp_addr_total_balance_output);
			});

			resolve(result);
		}).fail(function(xhr, textStatus, error) {
			// handle request failures
			console.log(xhr.statusText);
			if ( xhr.readyState == 0 ) {
				Iguana_ServiceUnavailable();
			}
			console.log(textStatus);
			console.log(error);
		});
	});

	NProgress.done();
}

function clearEdexSendFieldData() {
	$('.showedexcoinaddrs').selectpicker('refresh');
	$('#edexcoin_sendto').val('');
	$('#edexcoin_total_value').text('');
	$('#edexcoin_amount').val('');
}

function EDEXMainAddr(coin) {
	NProgress.done(true);
	NProgress.configure({
		template: '<div class="bar nprogress-bar-header nprogress-bar-info" role="bar"></div>' +
							'<div class="spinner" role="spinner">' +
								'<div class="spinner-icon"></div>' +
							'</div>'
	});
	NProgress.start();

	return new Promise((resolve) => {
		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				ajax_data = {
					'userpass': tmpIguanaRPCAuth,
					'agent': 'SuperNET',
					'method': 'activehandle'
				};

		var ajaxCall = $.ajax({
			data: JSON.stringify(ajax_data),
			url: 'http://127.0.0.1:7778',
			type: 'POST',
			dataType: 'json'
		});

		ajaxCall.done(function(data) {
			tmp_coin_addr = data[coin];
			resolve(tmp_coin_addr);
			NProgress.done();
		}).fail(function(xhr, textStatus, error) {
			// handle request failures
			console.log(xhr.statusText);
			if ( xhr.readyState == 0 ) {
				Iguana_ServiceUnavailable();
			}
			console.log(textStatus);
			console.log(error);
			NProgress.done();
		});
	});
}

function EDEXgetBalance(coin) {
	// comment
	var result = [],
			tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			ajax_data = {
				'userpass': tmpIguanaRPCAuth,
				'agent': 'bitcoinrpc',
				'method': 'getbalance',
				'coin': coin
			};

	$.ajax({
		type: 'POST',
		data: JSON.stringify(ajax_data),
		url: 'http://127.0.0.1:7778',
		success: function(data, textStatus, jqXHR) {
			var AjaxOutputData = JSON.parse(data);
			result.push(AjaxOutputData['result']);
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

function EDEXSendToAddr(data) {
	var result = [],
			confirm_coinname_to_send = data.coin,
			confirm_send_amount = data.amount,
			confirm_sendto_address = data.sendtoaddr;

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
				]};

	console.log(sendtoaddrvalues);
	console.log(sendtoaddrvalues.params);

	$.ajax({
		type: 'POST',
		data: JSON.stringify(sendtoaddrvalues),
		url: 'http://127.0.0.1:7778',
		success: function(data, textStatus, jqXHR) {
			var SendToAddrData = JSON.parse(data),
					edexcoin_sendto_result_tbl = '';

			result.push(SendToAddrData);

			if ( SendToAddrData.error !== undefined ) {
				toastr.error('Sent Transaction failed. Please check send Transaction page for details.', 'Wallet Notification');
				edexcoin_sendto_result_tbl += '<tr class="active">' +
																				'<td>error</td>' +
																				'<td>' +
																					'<span class="label label-danger">' + SendToAddrData.error + '</span>' +
																				'</td>' +
																			'</tr>';
				$('#edexcoin_sendto_result tbody').html(edexcoin_sendto_result_tbl);
				$('#edexcoin_send_coins_anothertx_btn').show();
			}

			if ( SendToAddrData.complete !== undefined ) {
				var active_edexcoin = $('[data-edexcoin]').attr('data-edexcoin');
				toastr.success('Transaction sent successfully. Check send section for details.', 'Wallet Notification');
				edexcoin_sendto_result_tbl += '<tr class="">' +
																				'<td>complete</td>' +
																				'<td>' +
																					'<span class="label label-info">' + SendToAddrData.complete + '</span>' +
																				'</td>' +
																			'</tr>';
				edexcoin_sendto_result_tbl += '<tr>' +
																				'<td>result</td>' +
																				'<td>' +
																					'<a href="javascript:void(0)" data-edexcoin="' + active_edexcoin + '" data-sendtotxresult="' + SendToAddrData.result + '" class="edexcoin_sendto_output_result">' + SendToAddrData.result + '</a>' +
																				'</td>' +
																			'</tr>';
				edexcoin_sendto_result_tbl += '<tr class="">' +
																				'<td>sendrawtransaction</td>' +
																				'<td>' +
																					'<span class="label label-primary">' + SendToAddrData.sendrawtransaction + '</span>' +
																				'</td>' +
																			'</tr>';
				edexcoin_sendto_result_tbl += '<tr class="">' +
																				'<td>signedtx</td>' +
																				'<td>' +
																					'<span style="display: block; width: 400px;word-wrap: break-word;">' + SendToAddrData.signedtx + '</span>' +
																				'</td>' +
																			'</tr>';
				$('#edexcoin_sendto_result tbody').html(edexcoin_sendto_result_tbl);
				$('#edexcoin_send_coins_anothertx_btn').show();
			}

			var selected_coinmode = sessionStorage.getItem('edexTmpMode');
			if ( selected_coinmode == 'Basilisk' ) {
				var active_edexcoin = $('[data-edexcoin]').attr('data-edexcoin');
				getDEXGetBalance(active_edexcoin).then(function(result){
					$('#edex_total_balance').text(result.total);
				});
			} else {
				var active_edexcoin = $('[data-edexcoin]').attr('data-edexcoin'),
						tmp_get_coin_balance = EDEXlistunspent(active_edexcoin);

				if (tmp_get_coin_balance[0] != undefined) {
					$('#edex_total_balance').text(tmp_get_coin_balance[0].total.toFixed(8));
				} else {
					$('#edex_total_balance').text('0');
				}
			}

			$('#edexcoin_send_coins_btn').prop('disabled', false);
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

function EDEXgetinfo(coin) {
	return new Promise((resolve) => {
		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				ajax_data = {
					'userpass': tmpIguanaRPCAuth,
					'coin': coin,
					'agent': 'bitcoinrpc',
					'method': 'getinfo',
					'immediate': 100,
					'timeout': 4000
				},
				AjaxOutputData = IguanaAJAX('http://127.0.0.1:7778',ajax_data).done(function(data) {
					AjaxOutputData = JSON.parse(AjaxOutputData.responseText)
					resolve(AjaxOutputData);
				}).fail(function(xhr, textStatus, error) {
					// handle request failures
					console.log(xhr.statusText);
					if ( xhr.readyState == 0 ) {
					}
					console.log(textStatus);
					console.log(error);
				});
	})
}

function EDEXgetaddrbyaccount_cache(coin) {
    return new Promise((resolve) => {
        Shepherd_GetBasiliskCache().then(function(result){
            var _data = JSON.parse(result)
                query = _data.result.basilisk
                tmp_addr_label = '<span class="label label-default">' +
                                                   '<i class="icon fa-eye"></i> public' +
                                                 '</span>';
                active_edexcoinmodecode = sessionStorage.getItem('edexTmpMode');

            //console.log(query[coin].addresses)
            
            Promise.all(query[coin].addresses.map((coinaddr_value, coinaddr_index) => {
                return new Promise((resolve, reject) => {
                    //console.log(coinaddr_index)
                    //console.log(coinaddr_value)
                    coinaddr_balances = query[coin][coinaddr_value].getbalance.data

                    if (coinaddr_balances.interest !== undefined) {
                        var pass_data = {
                                    'label': tmp_addr_label,
                                    'addr': coinaddr_value,
                                    'total': coinaddr_balances.balance.toFixed(8),
                                    'interest': coinaddr_balances.interest.toFixed(8)
                                };
                    }
                    if (coinaddr_balances.interest == undefined) {
                        var pass_data = {
                            'label': tmp_addr_label,
                            'addr': coinaddr_value,
                            'total': coinaddr_balances.balance.toFixed(8)
                        };
                    }

                    //console.log(pass_data)
                    resolve(pass_data)
                })

            })).then(result => {
                //console.log(result)
                resolve(result)
            })

        })
    })
}

function EDEXgetaddrbyaccount(coin) {
	return new Promise((resolve) => {
		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				ajax_data = {
					'userpass': tmpIguanaRPCAuth,
					'coin': coin,
					'agent': 'bitcoinrpc',
					'method': 'getaddressesbyaccount',
					'account': '*'
				},
				tmp_addr_label = '<span class="label label-default">' +
												   '<i class="icon fa-eye"></i> public' +
												 '</span>';
				active_edexcoinmodecode = sessionStorage.getItem('edexTmpMode');

		var AjaxOutputData = IguanaAJAX('http://127.0.0.1:7778', ajax_data).done(function(data) {
				data = JSON.parse(AjaxOutputData.responseText);
				console.log(data);

				if (active_edexcoinmodecode == 'Basilisk' &&
						coin !== 'BTC' &&
						coin !== 'BTCD' &&
						coin !== 'LTC' &&
						coin !== 'DOGE' &&
						coin !== 'DGB' &&
						coin !== 'SYS' &&
						coin !== 'MZC' &&
						coin !== 'UNO' &&
						coin !== 'ZET' &&
						coin !== 'BTM' &&
						coin !== 'CARB' &&
						coin !== 'ANC' &&
						coin !== 'FRK' ) {
							Promise.all(data.result.map((coinaddr_value, coinaddr_index) => {
								let params = {
									'userpass': tmpIguanaRPCAuth,
									'agent': 'dex',
									'method': 'getbalance',
									'address': coinaddr_value,
									'symbol': coin
								};

								console.log(params);
								return new Promise((resolve, reject) => {
									$.ajax({
										data: JSON.stringify(params),
										url: 'http://127.0.0.1:7778',
										type: 'POST',
										dataType: 'json'
									}).then(data => {
										if (data.interest !== undefined) {
											var pass_data = {
														'label': tmp_addr_label,
														'addr': coinaddr_value,
														'total': data.balance.toFixed(8),
														'interest': data.interest.toFixed(8)
													};
										}
										if (data.interest == undefined) {
											var pass_data = {
												'label': tmp_addr_label,
												'addr': coinaddr_value,
												'total': data.balance.toFixed(8)
											};
										}

										resolve(pass_data);
									});
								});

							})).then(result => {
								resolve(result);
								NProgress.done();
							});
				} else if (active_edexcoinmodecode == 'Basilisk' ) {
					Promise.all(data.result.map((coinaddr_value, coinaddr_index) => {
						let params = {
							'userpass': tmpIguanaRPCAuth,
							'agent': 'dex',
							'method': 'listunspent',
							'address': coinaddr_value,
							'symbol': coin
						};

						console.log(params)
						return new Promise((resolve, reject) => {
							$.ajax({
								data: JSON.stringify(params),
								url: 'http://127.0.0.1:7778',
								type: 'POST',
								dataType: 'json'
							})
							.then(data => {
								console.log(coinaddr_value);
								console.log(data);

								if (data.error === 'less than required responses') {
									toastr.error('Less than required responses. Please try again.', 'Basilisk Notification');
								}

								var tmpcalcnum = 0;
								$.each(data, function(index) {
									tmpcalcnum = tmpcalcnum + data[index].amount;
								});

								var tmp_addr_total_balance_output = {
									'label': tmp_addr_label,
									'addr': coinaddr_value,
									'total': tmpcalcnum.toFixed(8)
								};
								console.log(tmp_addr_total_balance_output);

								if (data == '' ) {
									tmp_addr_total_balance_output = {
										'label': tmp_addr_label,
										'addr': coinaddr_value,
										'total': 0
									};
								}

								resolve(tmp_addr_total_balance_output);
							});
						});

					})).then(result => {
						resolve(result);
						NProgress.done();
					});
				}

				if (active_edexcoinmodecode == 'Full' &&
						coin !== 'BTC' &&
						coin !== 'BTCD' &&
						coin !== 'LTC' &&
						coin !== 'DOGE' &&
						coin !== 'DGB' &&
						coin !== 'SYS' &&
						coin !== 'MZC' &&
						coin !== 'UNO' &&
						coin !== 'ZET' &&
						coin !== 'BTM' &&
						coin !== 'CARB' &&
						coin !== 'ANC' &&
						coin !== 'FRK' ) {
							Promise.all(data.result.map((coinaddr_value, coinaddr_index) => {
								return new Promise((resolve, reject) => {
									EDEXlistunspent(coin, coinaddr_value).then(function(data) {
										var pass_data;
										console.log(data);

										if (data.length !== 0) {
											if (data[0].interest !== undefined) {
												pass_data = {
													'label': tmp_addr_label,
													'addr': coinaddr_value,
													'total': data[0].total,
													'interest': data[0].interest
												};
											}
											if (data[0].interest == undefined) {
												pass_data = {
													'label': tmp_addr_label,
													'addr': coinaddr_value,
													'total': data[0].total
												};
											}
										} else {
											pass_data = {
												'label': tmp_addr_label,
												'addr': coinaddr_value,
												'total': 0.00000000
											};
										}

										console.log(pass_data);
										resolve(pass_data);
									});
								});
							})).then(result => {
								console.log(result);
								resolve(result);
								NProgress.done();
							});
				}
		}).fail(function(xhr, textStatus, error) {
			// handle request failures
			console.log(xhr.statusText);
			if ( xhr.readyState == 0 ) {
			}
			console.log(textStatus);
			console.log(error);
		})
	});
}

function EDEXgetnewaddress(coin) {
	return new Promise((resolve) => {
		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				ajax_data = {
					'userpass': tmpIguanaRPCAuth,
					'coin': coin,
					'agent': 'bitcoinrpc',
					'method': 'getnewaddress',
					'account': ''
				},
				AjaxOutputData = IguanaAJAX('http://127.0.0.1:7778', ajax_data).done(function(data) {
					AjaxOutputData = JSON.parse(AjaxOutputData.responseText);
					resolve(AjaxOutputData.result);
				}).fail(function(xhr, textStatus, error) {
					// handle request failures
					console.log(xhr.statusText);
					if ( xhr.readyState == 0 ) {
					}
					console.log(textStatus);
					console.log(error);
				});
	});
}

function EDEXimportprivkey(params_data) {
	return new Promise((resolve) => {
		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				ajax_data = {
					'userpass': tmpIguanaRPCAuth,
					'method': 'importprivkey',
					'params': [
						params_data,
						'imported'
					]
				},
				AjaxOutputData = IguanaAJAX('http://127.0.0.1:7778', ajax_data).done(function(data) {
					AjaxOutputData = JSON.parse(AjaxOutputData.responseText);
					resolve(AjaxOutputData);
				}).fail(function(xhr, textStatus, error) {
					// handle request failures
					console.log(xhr.statusText);
					if ( xhr.readyState == 0 ) {
					}
					console.log(textStatus);
					console.log(error);
				});
	})
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
				AjaxOutputData = IguanaAJAX('http://127.0.0.1:7778', ajax_data).done(function(data) {
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
		}).fail(function(xhr, textStatus, error) {
				// handle request failures
				console.log(xhr.statusText);
				if ( xhr.readyState == 0 ) {
				}
				console.log(textStatus);
				console.log(error);
		})
	});
}

function Iguana_DEXgetNotaries(coin) {
	var result = [];

	// Get parameters values from confirm dialog and send currency
	var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			ajax_data = {
				'userpass': tmpIguanaRPCAuth,
				'agent': 'dex',
				'method': 'getnotaries',
				'symbol': coin
			};

	console.log(ajax_data);
	$.ajax({
		type: 'POST',
		data: JSON.stringify(ajax_data),
		url: 'http://127.0.0.1:7778',
		success: function(data, textStatus, jqXHR) {
			var AjaxOutputData = JSON.parse(data);

			result.push(AjaxOutputData);
			if (AjaxOutputData.error === 'less than required responses') {
				toastr.error('Less than required responses. Please try again.', 'Basilisk Notification');
			}
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

	return result[0];
}

function Iguana_DEXImportAddr(coin,addr) {
	var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			ajax_data_1 = {
				'userpass': tmpIguanaRPCAuth,
				'agent': 'dex',
				'method': 'checkaddress',
				'address': addr,
				'symbol': coin
			};

	ajax_call_1 = $.ajax({
		data: JSON.stringify(ajax_data_1),
		url: 'http://127.0.0.1:7778',
		type: 'POST',
		dataType: 'json'
	});

	var ajax_call_2 = ajax_call_1.then(function(data) {
		if (('error' in data)) {
			var ajax_data_2 = {
				'userpass': tmpIguanaRPCAuth,
				'agent': 'dex',
				'method': 'importaddress',
				'address': addr,
				'symbol': coin
			};

			return $.ajax({
				data: JSON.stringify(ajax_data_2),
				url: 'http://127.0.0.1:7778',
				type: 'POST',
				dataType: 'json'
			});
		} else {
			var tmp_result = 'already in list';
			return tmp_result;
		}
	});

	ajax_call_2.done(function(data) {
		console.log(data);

		if (data == 'already in list') {
			toastr.info(coin + ' address already registered on network.', 'Basilisk Notification');
		} else {
			if (data.iswatchonly == true) {
				toastr.success('Registered ' + coin + ' address  on network.', 'Basilisk Notification');
			}
			if (data.iswatchonly == false) {
				toastr.success(coin + ' address Registeration failed. Please try again.', 'Basilisk Notification');
			}
			if (data.iswatchonly == undefined) {
				toastr.error('Invalid query sent for ' + coin + '. Please try again.', 'Basilisk Notification');
			}
			if (data.error === 'less than required responses') {
				toastr.error('Less than required responses. Please try again.', 'Basilisk Notification');
			}
		}
	});
}

function Iguana_DEXImportAllWalletAddr(coin) {
	var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			ajax_data_2 = {
				'userpass': tmpIguanaRPCAuth,
				'coin': coin,
				'agent': 'bitcoinrpc',
				'method': 'getaddressesbyaccount',
				'account': '*'
			},
			tmp_coin_addr = null,
			ajax_call_2 = $.ajax({
				data: JSON.stringify(ajax_data_2),
				url: 'http://127.0.0.1:7778',
				type: 'POST',
				dataType: 'json'
			}),
			ajax_call_3 = ajax_call_2.then(function(data) {
				$.each(data.result, function(coinaddr_index, coinaddr_value) {
					console.log(coinaddr_index)
					console.log(coinaddr_value)

					var ajax_data_4 = {
								'userpass': tmpIguanaRPCAuth,
								'agent': 'dex',
								'method': 'checkaddress',
								'address': coinaddr_value,
								'symbol': coin
							};
					ajax_call_4 = $.ajax({
							data: JSON.stringify(ajax_data_4),
							url: 'http://127.0.0.1:7778',
							type: 'POST',
							dataType: 'json',
					});
					var ajax_call_5 = ajax_call_4.then(function(data) {
						console.log(data)
						console.log(coinaddr_value);

						if (('error' in data) || !('address' in data)) {
							var ajax_data_4 = {
								'userpass': tmpIguanaRPCAuth,
								'agent': 'dex',
								'method': 'importaddress',
								'address': coinaddr_value,
								'symbol': coin
							};

							return $.ajax({
								data: JSON.stringify(ajax_data_4),
								url: 'http://127.0.0.1:7778',
								type: 'POST',
								dataType: 'json'
							});
						} else {
							var tmp_result = 'already in list';
							return tmp_result;
						}
					});

					ajax_call_5.done(function(data) {
						console.log(coin)
						console.log(data);

						if (data == 'already in list') {
							toastr.info(coinaddr_value + ' already registered on network.', 'Basilisk Notification - ' + coin);
						} else {
							if (data.iswatchonly == true) {
								toastr.success('Registered ' + coinaddr_value + ' on network.', 'Basilisk Notification - ' + coin);
							}
							if (data.iswatchonly == false) {
								toastr.success(coinaddr_value + ' Registeration failed. Please try again.', 'Basilisk Notification - ' + coin);
							}
							if (data.iswatchonly == undefined) {
								toastr.error('Invalid query sent for ' + coinaddr_value + '. Please try again.', 'Basilisk Notification - ' + coin);
							}
							if (data.error === 'less than required responses') {
								toastr.error('Less than required responses. Please try again.', 'Basilisk Notification - ' + coin);
							}
						}
					});
				});
			});
}

function Iguana_DEXImportAll() {
	var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			ajax_data_1 = {
				'userpass': tmpIguanaRPCAuth,
				'agent': 'InstantDEX',
				'method': 'allcoins'
			},
			ajax_call_1 = $.ajax({
				data: JSON.stringify(ajax_data_1),
				url: 'http://127.0.0.1:7778',
				type: 'POST',
				dataType: 'json'
			});

	ajax_call_1.done(function(data) {
		$.each([ 'basilisk','full' ], function(data_index,data_value) {
			$.each(data[data_value], function(mode_index,mode_value) {
				var ajax_data_2 = {
							'userpass': tmpIguanaRPCAuth,
							'coin': mode_value,
							'agent': 'bitcoinrpc',
							'method': 'getaddressesbyaccount',
							'account': '*'
						},
						tmp_coin_addr = null,
						ajax_call_2 = $.ajax({
							data: JSON.stringify(ajax_data_2),
							url: 'http://127.0.0.1:7778',
							type: 'POST',
							dataType: 'json'
						}),
						ajax_call_3 = ajax_call_2.then(function(data) {
							$.each(data.result, function(coinaddr_index, coinaddr_value) {
								console.log(coinaddr_index)
								console.log(coinaddr_value)

								var ajax_data_4 = {
											'userpass': tmpIguanaRPCAuth,
											'agent': 'dex',
											'method': 'checkaddress',
											'address': coinaddr_value,
											'symbol': mode_value
										},
										ajax_call_4 = $.ajax({
											data: JSON.stringify(ajax_data_4),
											url: 'http://127.0.0.1:7778',
											type: 'POST',
											dataType: 'json'
										}),
										ajax_call_5 = ajax_call_4.then(function(data) {
											console.log(data)
											console.log(coinaddr_value);

											if (('error' in data) || !('address' in data)) {
												var ajax_data_4 = {
													'userpass': tmpIguanaRPCAuth,
													'agent': 'dex',
													'method': 'importaddress',
													'address': coinaddr_value,
													'symbol': mode_value
												};

												return $.ajax({
													data: JSON.stringify(ajax_data_4),
													url: 'http://127.0.0.1:7778',
													type: 'POST',
													dataType: 'json',
												});
											} else {
												var tmp_result = 'already in list';
												return tmp_result;
											}
										});

								ajax_call_5.done(function(data) {
									console.log(mode_value)
									console.log(data);

									if (data == 'already in list') {
										toastr.info(coinaddr_value + ' already registered on network.', 'Basilisk Notification - ' + mode_value);
									} else {
										if (data.iswatchonly == true) {
											toastr.success('Registered ' + coinaddr_value + ' on network.', 'Basilisk Notification - ' + mode_value);
										}
										if (data.iswatchonly == false) {
											toastr.success(coinaddr_value + ' Registeration failed. Please try again.', 'Basilisk Notification - ' + mode_value);
										}
										if (data.iswatchonly == undefined) {
											toastr.error('Invalid query sent for ' + coinaddr_value + '. Please try again.', 'Basilisk Notification - ' + mode_value);
										}
										if (data.error === 'less than required responses') {
											toastr.error('Less than required responses. Please try again.', 'Basilisk Notification - ' + mode_value);
										}
									}
								});
							});
						});

				ajax_call_3.done(function() {
					console.log('Registered addresses from all active coin wallets.');
				});
			});
		});
	});
}

function Iguana_DEXCheckAddr(coin,addr) {
	var result = [];

	// Get parameters values from confirm dialog and send currency
	var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			ajax_data = {
				'userpass': tmpIguanaRPCAuth,
				'agent': 'dex',
				'method': 'checkaddress',
				'address': addr,
				'symbol': coin
			};

	console.log(ajax_data);
	$.ajax({
		type: 'POST',
		data: JSON.stringify(ajax_data),
		url: 'http://127.0.0.1:7778',
		success: function(data, textStatus, jqXHR) {
			var AjaxOutputData = JSON.parse(data);
			result.push(AjaxOutputData);

			if (AjaxOutputData.error === 'less than required responses') {
				toastr.error('Less than required responses. Please try again.', 'Basilisk Notification');
			}
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

function Iguana_DEXValidateAddr(coin, addr) {
	var result = [];

	// Get parameters values from confirm dialog and send currency
	var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			ajax_data = {
				'userpass': tmpIguanaRPCAuth,
				'agent': 'dex',
				'method': 'validateaddress',
				'address': addr,
				'symbol': coin
			};

	console.log(ajax_data);
	$.ajax({
		type: 'POST',
		data: JSON.stringify(ajax_data),
		url: 'http://127.0.0.1:7778',
		success: function(data, textStatus, jqXHR) {
			var AjaxOutputData = JSON.parse(data);

			if (AjaxOutputData.iswatchonly == true) {
				toastr.success('Validation Success on Network', 'Basilisk Notification');
			}
			if (AjaxOutputData.iswatchonly == false) {
				toastr.info('Address isn\'t Registered on Network. Please Register', 'Basilisk Notification');
			}
			if (AjaxOutputData.iswatchonly == undefined) {
				toastr.error('Invalid query sent. Please try again.', 'Basilisk Notification');
			}
			result.push(AjaxOutputData);
			if (AjaxOutputData.error === 'less than required responses') {
				toastr.error('Less than required responses. Please try again.', 'Basilisk Notification');
			}
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

function EDEX_DEXlistunspent(coin, addr) {
	NProgress.done(true);
	NProgress.configure({
		template: '<div class="bar nprogress-bar-header nprogress-bar-info" role="bar"></div>' +
							'<div class="spinner" role="spinner">' +
								'<div class="spinner-icon"></div>' +
							'</div>'
	});
	NProgress.start();

	return new Promise((resolve) => {
		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				ajax_data = {
					'userpass': tmpIguanaRPCAuth,
					'agent': 'dex',
					'method': 'listunspent',
					'address': addr,
					'symbol': coin
				},
				AjaxOutputData = IguanaAJAX('http://127.0.0.1:7778',ajax_data).done(function(data) {
					AjaxOutputData = JSON.parse(AjaxOutputData.responseText)

					if (AjaxOutputData == '' ) {
						result.push([{ 'amount': 0 }]);
					}
					if (AjaxOutputData.error === 'less than required responses') {
						toastr.error('Less than required responses. Please try again.', 'Basilisk Notification');
					}
					resolve(AjaxOutputData);
				}).fail(function(xhr, textStatus, error) {
					// handle request failures
					console.log(xhr.statusText);
					if ( xhr.readyState == 0 ) {
					}
					console.log(textStatus);
					console.log(error);
				});

		NProgress.done();
	});
}

function EDEX_DEXnotarychains() {
	NProgress.done(true);
	NProgress.configure({
		template: '<div class="bar nprogress-bar-header nprogress-bar-info" role="bar"></div>' +
							'<div class="spinner" role="spinner">' +
								'<div class="spinner-icon"></div>' +
							'</div>'
	});
	NProgress.start();

	var result = [],
			tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			ajax_data = {
				'userpass': tmpIguanaRPCAuth,
				'agent': 'dpow',
				'method': 'notarychains'
			};

	console.log(ajax_data);
	$.ajax({
		type: 'POST',
		data: JSON.stringify(ajax_data),
		url: 'http://127.0.0.1:7778',
		success: function(data, textStatus, jqXHR) {
			var AjaxOutputData = JSON.parse(data); // Ajax output gets the whole list of unspent coin with addresses
			console.log('== EDEX_DEXnotarychains Data OutPut ==');
			result.push(AjaxOutputData);
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

	NProgress.done();
	return result[0];
}

function EDEX_DEXgetinfoAll() {
	NProgress.done(true);
	NProgress.configure({
		template: '<div class="bar nprogress-bar-header nprogress-bar-info" role="bar"></div>' +
							'<div class="spinner" role="spinner">' +
								'<div class="spinner-icon"></div>' +
							'</div>'
	});
	NProgress.start();

	var result = [],
			tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
			ajax_data = {
				'userpass': tmpIguanaRPCAuth,
				'agent': 'dpow',
				'method': 'notarychains'
			},
			get_dex_notarychains = IguanaAJAX('http://127.0.0.1:7778', ajax_data).done(function(data) {
				get_dex_notarychains = JSON.parse(get_dex_notarychains.responseText);

				var refresh_percent = '';

				$.each(get_dex_notarychains, function( coin_index, coin_value ) {
						console.log(coin_index + ': ' + coin_value);
						var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
								ajax_data = {
									'userpass': tmpIguanaRPCAuth,
									'agent': 'dex',
									'method': 'getinfo',
									'symbol': coin_value
								};
						console.log(ajax_data);

						if (coin_value !== 'MESH') {
							var getinfo_each_chain = IguanaAJAX('http://127.0.0.1:7778', ajax_data).done(function(data) {
								getinfo_each_chain = JSON.parse(getinfo_each_chain.responseText);
								console.log('== EDEX_DEXgetinfoAll Data OutPut ==');
								console.log(getinfo_each_chain);

								var tmp_index = parseInt(coin_index) + 1,
										refresh_percent = parseFloat(parseInt(coin_index, 10) * 100) / parseInt(get_dex_notarychains.length, 10);
								console.log(refresh_percent)
								$('#basilisk-connections-refresh-title').text('Connection status... ' + tmp_index + '/' + get_dex_notarychains.length + ': ' + coin_value);
								$('#basilisk-connections-refresh-percent').text(refresh_percent + '%');
								$('#basilisk-connections-refresh-progress-bar').width(refresh_percent + '%')

								if (getinfo_each_chain == '' ) {
									result.push([{ 'amount': 0 }]);
								}
								result.push(getinfo_each_chain);
								if (getinfo_each_chain.error === 'less than required responses') {
									toastr.info('Less than required responses for ' + coin_value + '.', 'Basilisk Notification');
									$('#basilisk-connections-refresh-status-output').text('Output: ' + getinfo_each_chain.error);
								} else {
									$('#basilisk-connections-refresh-status-output').text('Output: Connected');
								}
								if ( tmp_index == get_dex_notarychains.length-1 ) {
									$('#basilisk-connections-refresh-progress-bar').width('100%');
									$('#RefreshBasiliskConnectionsMdl').modal('hide');
									toastr.success('Basilsk nodes connections refreshed.', 'Basilisk Notification');
								}
							});
						}
				});
			});

	NProgress.done();
	return result[0];
}

function Shepherd_getConf(coin) {
	var result = [],
			ajax_data = { 'chain': coin };

	console.log(ajax_data);
	$.ajax({
		async: false,
		type: 'POST',
		data: JSON.stringify(ajax_data),
		url: 'http://127.0.0.1:17777/shepherd/getconf',
		contentType: 'application/json', // send as JSON
		success: function(data, textStatus, jqXHR) {
			var AjaxOutputData = JSON.parse(data);
			console.log(AjaxOutputData['result']);
			result.push({ 'path': AjaxOutputData['result'] });
		},
		error: function(xhr, textStatus, error) {
			//console.log(xhr.statusText);
			//if ( xhr.readyState == 0 ) {
			//}
			//console.log(textStatus);
			//console.log(error);
		}
	});

	return result;
}

function Shepherd_setConf(coin) {
	var result = [],
			ajax_data = { 'chain': coin };

	console.log(ajax_data);
	$.ajax({
		async: false,
		type: 'POST',
		data: JSON.stringify(ajax_data),
		url: 'http://127.0.0.1:17777/shepherd/setconf',
		contentType: 'application/json', // send as JSON
		success: function(data, textStatus, jqXHR) {
			var AjaxOutputData = JSON.parse(data);
			console.log(AjaxOutputData);
			result.push({ 'result': AjaxOutputData['msg'] });
		},
		error: function(xhr, textStatus, error) {
			//console.log(xhr.statusText);
			//if ( xhr.readyState == 0 ) {
			//}
			//console.log(textStatus);
			//console.log(error);
		}
	});

	return result;
}

function Shepherd_herd(coin,herd_data) {
	var result = [];
			ajax_data = {
				'herd': coin,
				'options': herd_data
			};

	console.log(ajax_data);
	$.ajax({
		async: false,
		type: 'POST',
		data: JSON.stringify(ajax_data),
		url: 'http://127.0.0.1:17777/shepherd/herd',
		contentType: 'application/json', // send as JSON
		success: function(data, textStatus, jqXHR) {
			var AjaxOutputData = JSON.parse(data);
			console.log(AjaxOutputData);
			result.push({ 'result': AjaxOutputData['msg'] });
		},
		error: function(xhr, textStatus, error) {
			//console.log(xhr.statusText);
			//if ( xhr.readyState == 0 ) {
			//}
			//console.log(textStatus);
			//console.log(error);
		}
	});

	return result;
}

function Shepherd_herdlist(data) {
	return new Promise((resolve) => {
		var ajax_data_1 = { 'herdname': data },
				ajax_call_1 = $.ajax({
					data: JSON.stringify(ajax_data_1),
					url: 'http://127.0.0.1:17777/shepherd/herdlist',
					type: 'POST',
					contentType: 'application/json'
				});

		ajax_call_1.done(function(data) {
			resolve(data);
		});
	});
}

function Shepherd_FetchBasiliskData(req_data) {
	return new Promise((resolve) => {
		var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
				parse_session_data = sessionStorage.getItem('IguanaActiveAccount');

		parse_session_data = JSON.parse(JSON.parse(parse_session_data));

		var session_pubkey = parse_session_data.pubkey,
				ajax_data = {
					'userpass': tmpIguanaRPCAuth,
					'pubkey': session_pubkey
				};

    console.log(req_data)
    if (req_data.allcoins !== false ) {
      var req_url = 'http://127.0.0.1:17777/shepherd/cache-all';
    } else {
      var req_url = 'http://127.0.0.1:17777/shepherd/cache-one';
      ajax_data.coin = req_data.coin;
      ajax_data.calls = req_data.calls;
    }

    console.log(ajax_data)

		$.ajax({
			type: 'GET',
			data: ajax_data,
			url: req_url,
			contentType: 'application/json', // send as JSON
		}).done(function(data) {
			resolve(data);
		});
	});
}

function Shepherd_GetBasiliskCache() {
	return new Promise((resolve) => {
		var parse_session_data = sessionStorage.getItem('IguanaActiveAccount');
		parse_session_data = JSON.parse(JSON.parse(parse_session_data));
		var session_pubkey = parse_session_data.pubkey,
				ajax_data = { 'pubkey': session_pubkey };

		$.ajax({
			type: 'GET',
			data: ajax_data,
			url: 'http://127.0.0.1:17777/shepherd/cache',
			contentType: 'application/json' // send as JSON
		}).done(function(data) {
			resolve(data);
		});
	});
}

function Shepherd_CheckBasiliskCacheData(coin) {
  return new Promise((resolve) => {
    Shepherd_GetBasiliskCache().then(function(result) {
      var _data = JSON.parse(result),
      		query = _data.result.basilisk,
          coin_exists = true,
          addresses_exists = true,
          getbalance_exists = true,
          listtransactions_exists = true,
          listunspent_exists = true,
          refresh_exists = true;

      if (!query) {
        console.log('data not found.');
        var res_data = {
		        	'coin': false,
		        	'addresses': false,
		        	'getbalance': false,
		        	'listtransactions': false,
		        	'listunspent': false,
		        	'refresh': false
		        };
        resolve(res_data);
      } else if (!query[coin]) {
          console.log(coin + ' not found.');
          coin_exists = false;
          var res_data = {
          			'coin': coin_exists,
          			'addresses': false,
          			'getbalance': false,
          			'listtransactions': false,
          			'listunspent': false,
          			'refresh': false
          		};
          resolve(res_data);
      } else if (!('addresses' in query[coin])) {
          console.log(coin + ' addresses not found.');
          addresses_exists = false;
          res_data = {
          	'coin': coin_exists,
          	'getbalance': false,
          	'listtransactions': false,
          	'listunspent': false,
          	'refresh': false
          };
          resolve(res_data)
      } else {
        Promise.all(query[coin].addresses.map((coinaddr_value,coinaddr_index) => {
          return new Promise((resolve, reject) => {
            var data = query[coin][coinaddr_value].getbalance;

            if (!('getbalance' in query[coin][coinaddr_value])) {
              //console.log(coin + '>>>' + coinaddr_value + ' => getbalance not found.')
              getbalance_exists = false;
            }

            if (!('listtransactions' in query[coin][coinaddr_value])) {
              //console.log(coin + '>>>' + coinaddr_value + ' => listtransactions not found.')
              listtransactions_exists = false;
            }

            if (!('listunspent' in query[coin][coinaddr_value])) {
              //console.log(coin + '>>>' + coinaddr_value + ' => listunspent not found.')
              listunspent_exists = false;
            }

            if (!('refresh' in query[coin][coinaddr_value])) {
              //console.log(coin + '>>>' + coinaddr_value + ' => refresh not found.')
              refresh_exists = false;
            }

            pass_data = {
            	'getbalance': getbalance_exists,
            	'listtransactions': listtransactions_exists,
            	'listunspent': listunspent_exists,
            	'refresh': refresh_exists
            };
            resolve(pass_data);
          });
        })).then(result => {
          var res_data = result[result.length - 1];
          res_data.coin = coin_exists;
          res_data.addresses = addresses_exists;
          resolve(res_data);
        });
      }
    });
  });
}