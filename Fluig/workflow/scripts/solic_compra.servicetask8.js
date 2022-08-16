var debug = true;
var urlBase = 'com.totvs.webservice.';
var servico = 'ordem_sup';

var mailList = new java.util.ArrayList();

function servicetask8(attempt, message) {

	log.info('PROC... ' + getValue("WKNextState") + ' - '
			+ getValue("WKCompletTask") + ' - '
			+ hAPI.getCardValue("perc_conc"));

	var numProcesso = getValue('WKNumProces');
	var userId = getValue("WKUser");

	try {

		var logix = ServiceManager.getService(servico);
		var serviceHelper = logix.getBean();
		log.info('serviceHelper ' + serviceHelper);

		var serviceLocator = serviceHelper.instantiate(urlBase
				+ 'ORDEMCOMPRALocator');
		var service = serviceLocator.getORDEMCOMPRASOAP();

		var ioc = serviceHelper.instantiate(urlBase
				+ 'LISTA_ORDEM_COMPRA_ARRAY');
		var aoc = serviceHelper.instantiate(urlBase
				+ 'ARRAYOFLISTA_ORDEM_COMPRA');
		var loc = new Array();

		var formatter = new java.text.SimpleDateFormat('dd/MM/yyyy');

		var camposItem = hAPI.getCardData(getValue("WKNumProces"));
		var contadorItem = camposItem.keySet().iterator();

		// contador inicia aqui

		var linhasIntegra = [];
		hAPI.setCardValue('integracao_pendente', 'N');

		while (contadorItem.hasNext()) {
			var idItem = contadorItem.next();
			log.info('idItem.......' + idItem);
			var campo = idItem.split('___')[0];
			var seqItem = idItem.split('___')[1];

			if (seqItem != undefined && campo == "QTD_SOLIC") {

				log.info('valor integra '
						+ hAPI.getCardValue('integra___' + seqItem));
				log.info('valor integrou '
						+ hAPI.getCardValue('integrou___' + seqItem));
				if (hAPI.getCardValue('integra___' + seqItem) == "S"
						&& hAPI.getCardValue('integrou___' + seqItem) != "S") {

					var oc = serviceHelper.instantiate(urlBase + 'LISTA_ORDEM_COMPRA');
					
					linhasIntegra.push(seqItem);
					// altera para ja integrado
					hAPI.setCardValue('integrou___' + seqItem, 'S');

					log.info('Entrou para integracao');
					log.info('Sequencia.....' + seqItem);

					log.error('AQUI 1');
					oc.setEMPRESA(hAPI.getCardValue('empresa') + "");

					var tipo_oc = hAPI.getCardValue('tipo') + "";
					if (tipo_oc == "D" || tipo_oc == "M") {
						tipo_oc = "E";
					} else if (tipo_oc == "T") {
						tipo_oc = "P";
					}
					oc.setTIPO_OC(tipo_oc);

					log.error('AQUI C');

					var datEntrega = formatter.parse(hAPI.getCardValue(
							'data_entrega').split("-").reverse().join("/"));
					log.error('datEntrega.... ' + datEntrega);
					var dataAtual = new java.util.Date();
					log.error('dataAtual.... ' + dataAtual);
					if (dataAtual.compareTo(datEntrega) > 0) {
						datEntrega = dataAtual;
					}
					datEntrega = getNextDatUtil(datEntrega);
					log.error('depois do IF.... ' + datEntrega);
					oc.setDAT_ENTREGA(datEntrega);

					log.error('AQUI D');

					var user = hAPI.getCardValue('matricula_solicitante') + "";

					var user_logix = "admlog";
					var constraints = new Array();
					constraints
							.push(DatasetFactory.createConstraint(
									"colleaguePK.companyId", 1, 1,
									ConstraintType.MUST));
					constraints.push(DatasetFactory.createConstraint(
							"colleaguePK.colleagueId", user, user,
							ConstraintType.MUST));
					constraints.push(DatasetFactory.createConstraint("chave",
							'user_logix', 'user_logix', ConstraintType.MUST));
					var usuario = DatasetFactory.getDataset("colleagueParam",
							null, constraints, null);

					if (usuario != null && usuario.values.length > 0) {
						oc.setUSUARIO(usuario.getValue(0, "val_param") + "");
						user_logix = usuario.getValue(0, "val_param");
					} else {
						oc.setUSUARIO("admlog");
					}

					log.error('AQUI E');
					oc.setPROGRAMADOR(new java.math.BigInteger("0"));
					if (user_logix != "admlog") {
						var constraints = new Array();
						constraints.push(DatasetFactory.createConstraint(
								"dataBase", "java:/jdbc/LogixPRD", null,
								ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint(
								"table", "programador", null,
								ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint(
								"cod_empresa", hAPI.getCardValue('empresa'),
								hAPI.getCardValue('empresa'),
								ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint(
								"___lower___login", user_logix, user_logix,
								ConstraintType.MUST));
						var feild = new Array('cod_progr');
						var datasetProg = DatasetFactory.getDataset(
								"selectTable", feild, constraints, null);
						log.info('datasetProg' + datasetProg);
						if (datasetProg != null
								&& datasetProg.values.length > 0) {
							oc.setPROGRAMADOR(new java.math.BigInteger(
									datasetProg.getValue(0, "cod_progr")));
						}
					}
					// AJUSTAR
					// programador

					oc.setORIGEM("GA");

					var aprov = hAPI.getCardValue('matricula_aprovador') + "";

					var constraints = new Array();
					constraints
							.push(DatasetFactory.createConstraint(
									"colleaguePK.companyId", 1, 1,
									ConstraintType.MUST));
					constraints.push(DatasetFactory.createConstraint(
							"colleaguePK.colleagueId", aprov, aprov,
							ConstraintType.MUST));
					constraints.push(DatasetFactory.createConstraint("chave",
							'user_logix', 'user_logix', ConstraintType.MUST));
					var usuario = DatasetFactory.getDataset("colleagueParam",
							null, constraints, null);

					if (usuario != null && usuario.values.length > 0) {
						oc.setUSUARIO_APROVACAO(usuario
								.getValue(0, "val_param")
								+ "");
					} else {
						oc.setUSUARIO_APROVACAO("admlog");
					}

					log.error('AQUI G');
					oc.setORIGEM('F');

					oc.setCOMPRADOR(new java.math.BigInteger("1"));

					var constraints = new Array();
					constraints.push(DatasetFactory.createConstraint(
							"dataBase", "java:/jdbc/LogixPRD", null,
							ConstraintType.MUST));
					constraints.push(DatasetFactory.createConstraint("table",
							"fluig_v_item_sup", null, ConstraintType.MUST));
					constraints.push(DatasetFactory.createConstraint(
							"cod_empresa", hAPI.getCardValue('empresa'), hAPI
									.getCardValue('empresa'),
							ConstraintType.MUST));
					constraints.push(DatasetFactory.createConstraint(
							"cod_item", hAPI.getCardValue('cod_item___'
									+ seqItem), hAPI.getCardValue('cod_item___'
									+ seqItem), ConstraintType.MUST));
					var feild = new Array('cod_comprador', 'login');
					var datasetComprador = DatasetFactory.getDataset(
							"selectTable", feild, constraints, null);
					if (datasetComprador != null
							&& datasetComprador.values.length > 0) {

						log.info('$005q... '
								+ datasetComprador.getValue(0, "cod_comprador")
								+ ' ' + datasetComprador.getValue(0, "login"));
						oc.setCOMPRADOR(new java.math.BigInteger(
								datasetComprador.getValue(0, "cod_comprador")));

						var ct = new Array();
						ct.push(DatasetFactory.createConstraint(
								'colleaguePK.companyId', '1', null,
								ConstraintType.MUST));
						ct.push(DatasetFactory.createConstraint('val_param',
								datasetComprador.getValue(0, "login"), null,
								ConstraintType.MUST));
						ct.push(DatasetFactory.createConstraint('chave',
								'user_logix', null, ConstraintType.MUST));
						log.info('$005q... ');
						var ds = DatasetFactory.getDataset('colleagueParam',
								null, ct, null);
						log.info('$005u... ');
						if (ds != null && ds.rowsCount > 0) {
							if (!mailList.contains(ds.getValue(0, 'val_param'))) {
								mailList.add(ds.getValue(0, 'val_param'));
							}
						}

					}

					log.error('AQUI I');
					if (hAPI.getCardValue('projeto') != null
							&& hAPI.getCardValue('projeto').trim() != "") {
						oc.setNUM_DOCUM(hAPI.getCardValue('projeto') + "");
					} else {
						oc.setNUM_DOCUM("0");
					}

					log.error('AQUI J');

					oc.setNUM_OC_ORIGEM(new java.math.BigInteger(
							getValue('WKNumProces')));

					log.error('AQUI J1');

					oc.setQTD_SOLIC(parseFloat(hAPI.getCardValue(
							'qtd_solic___' + seqItem).replace('.', '').replace(
							',', '.')));

					if (hAPI.getCardValue('preco_unit___' + seqItem) != ""
							&& hAPI.getCardValue('preco_unit___' + seqItem) != null
							&& hAPI.getCardValue('preco_unit___' + seqItem) != undefined) {
						oc.setPRECO_UNIT(parseFloat(hAPI.getCardValue(
								'preco_unit___' + seqItem).replace('.', '')
								.replace(',', '.')));
					} else {
						oc.setPRECO_UNIT(parseFloat("0"));
					}

					log.error('AQUI 001 ' + seqItem);
					log.error('AQUI 001 '
							+ hAPI.getCardValue('cod_item___' + seqItem));
					log.error('AQUI 001 ' + hAPI.getCardValue('cod_item___1'));
					oc.setCOD_ITEM(hAPI.getCardValue('cod_item___' + seqItem)
							+ "");

					log.error('AQUI 00B');
					oc.setTIPO_DESPESA(hAPI.getCardValue('cod_tipo_desp___'
							+ seqItem)
							+ "");

					log.error('AQUI 00D');
					oc.setGRUPO_DESPESA(hAPI.getCardValue('cod_grp_desp___'
							+ seqItem)
							+ "");

					log.error('AQUI 00E');
					oc.setCOD_UNID_MED(hAPI.getCardValue('cod_unid_med___'
							+ seqItem)
							+ "");

					log.error('AQUI 00F');
					var den_item = hAPI.getCardValue('den_item___' + seqItem)
							+ "";
					oc.setDEN_ITEM(den_item.substring(0, 60));

					log.error('AQUI 3');
					var num_conta;

					var num_conta = hAPI.getCardValue('num_conta_item___'
							+ seqItem)
							+ "";

					log.error('AQUI 002');

					// SET R A T E I O // R A T E I O

					var arat = serviceHelper.instantiate(urlBase
							+ 'ARRAYOFRATEIOOC');
					lrat = new Array();
					var cod_desp = hAPI.getCardValue('cod_tipo_desp___'
							+ seqItem)
							+ "";
					var seq = 0;

					var ccDocum = "";
					var ufDocum = "";

					if (hAPI.getCardValue('tipo') == 'T') {
						var constraints = new Array();
						constraints.push(DatasetFactory.createConstraint(
								"dataBase", "java:/jdbc/LogixPRD", null,
								ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint(
								"table", "fluig_v_ordem_oper_cpl", null,
								ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint(
								"sqlLimit", '1', '1', ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint(
								"cod_empresa", hAPI.getCardValue('empresa'),
								hAPI.getCardValue('empresa'),
								ConstraintType.MUST));
						constraints
								.push(DatasetFactory
										.createConstraint(
												"num_ordem",
												hAPI
														.getCardValue('doc_origem_item___'
																+ seqItem),
												hAPI
														.getCardValue('doc_origem_item___'
																+ seqItem),
												ConstraintType.MUST));
						var feild = new Array('cod_cent_cust', 'cod_uni_funcio');
						var datasetOrdem = DatasetFactory.getDataset(
								"selectTable", feild, constraints, null);
						log.info('datasetOrdem' + datasetOrdem);
						if (datasetOrdem != null
								&& datasetOrdem.values.length > 0) {
							ccDocum = datasetOrdem.getValue(0, "cod_cent_cust");
							ufDocum = datasetOrdem
									.getValue(0, "cod_uni_funcio")
						}
					}

					if (oc.getTIPO_OC() != 'E') {
						var camposRateio = hAPI
								.getCardData(getValue("WKNumProces"));
						var contadorRateio = camposRateio.keySet().iterator();
						while (contadorRateio.hasNext()) {
							var idRateio = contadorRateio.next();
							var campo = idRateio.split('___')[0];
							var seqRateio = idRateio.split('___')[1];
							if (seqRateio != undefined
									&& campo == "PERC_REATEIO") {
								log.info('Sequencia.....' + seqRateio);
								var rat = serviceHelper.instantiate(urlBase
										+ 'RATEIOOC');
								seq++;
								rat
										.setSEQ_RATEIO(new java.math.BigInteger(
												seq));

								var cod_cc = hAPI.getCardValue('cod_cc___'
										+ seqRateio)
										+ "";
								var cod_aen = hAPI.getCardValue('cod_aen___'
										+ seqRateio)
										+ "";
								;

								rat.setCOD_AREA_NEGOCIO(parseFloat(cod_aen.substring(0, 2)));
								rat.setCOD_LIN_NEGOCIO(parseFloat(cod_aen.substring(2, 4)));
								rat.setCOD_SEG_MERC(parseFloat(cod_aen.substring(4, 6)));
								rat.setCOD_CLA_USO(parseFloat(cod_aen.substring(6, 8)));

								if (hAPI.getCardValue('tipo') == 'P') {
									var constraints = new Array();
									constraints.push(DatasetFactory
											.createConstraint("dataBase",
													"java:/jdbc/LogixPRD",
													null, ConstraintType.MUST));
									constraints.push(DatasetFactory
											.createConstraint("table",
													"fluig_v_ordem_oper_cpl",
													null, ConstraintType.MUST));
									constraints.push(DatasetFactory
											.createConstraint("sqlLimit", '1',
													'1', ConstraintType.MUST));
									constraints
											.push(DatasetFactory
													.createConstraint(
															"cod_empresa",
															hAPI
																	.getCardValue('empresa'),
															hAPI
																	.getCardValue('empresa'),
															ConstraintType.MUST));
									constraints
											.push(DatasetFactory
													.createConstraint(
															"num_ordem",
															hAPI
																	.getCardValue('doc_origem___'
																			+ seqRateio),
															hAPI
																	.getCardValue('doc_origem___'
																			+ seqRateio),
															ConstraintType.MUST));
									var feild = new Array('cod_cent_cust',
											'cod_uni_funcio');
									var datasetOrdem = DatasetFactory
											.getDataset("selectTable", feild,
													constraints, null);
									log.info('datasetOrdem' + datasetOrdem);
									if (datasetOrdem != null
											&& datasetOrdem.values.length > 0) {
										ccDocum = datasetOrdem.getValue(0,
												"cod_cent_cust");
										ufDocum = datasetOrdem.getValue(0,
												"cod_uni_funcio")
									}
								}

								if (ccDocum == ""
										&& (hAPI.getCardValue('tipo') == 'P' || hAPI
												.getCardValue('tipo') == 'T')) {
									ccDocum = "330";
								}
								if (ufDocum == ""
										&& (hAPI.getCardValue('tipo') == 'P' || hAPI
												.getCardValue('tipo') == 'T')) {
									ufDocum = "1101030301";
								}

								if (oc.getTIPO_OC() == 'P') {
									rat.setCOD_CENT_CUST(parseFloat(ccDocum));
									rat.setCOD_SECAO_RECEB(ufDocum + "");
								} else {
									rat.setCOD_CENT_CUST(parseFloat(cod_cc));
									rat.setCOD_SECAO_RECEB(hAPI
											.getCardValue('cod_unid_func___'
													+ seqRateio)
											+ "");
								}

								log.info('Perc Rateio..... '
										+ hAPI.getCardValue('perc_reateio___'
												+ seqRateio));
								log.info('Perc Rateio..... '
										+ parseFloat(hAPI.getCardValue(
												'perc_reateio___' + seqRateio)
												.replace('.', '').replace(',',
														'.')));
								if (hAPI.getCardValue('tipo') == "T") {
									rat.setNUM_DOCUM(hAPI
											.getCardValue('doc_origem_item___'
													+ seqItem)
											+ "");
									rat.setPCT_PARTICIP_COMP(parseFloat("100"));
								} else {
									rat.setNUM_DOCUM(hAPI
											.getCardValue('doc_origem___'
													+ seqRateio)
											+ "");
									rat
											.setPCT_PARTICIP_COMP(parseFloat(hAPI
													.getCardValue(
															'perc_reateio___'
																	+ seqRateio)
													.replace('.', '').replace(
															',', '.')));
								}
								if (hAPI.getCardValue('tipo') == "A"
										|| hAPI.getCardValue('tipo') == "N") {
									rat.setNUM_DOCUM("0");
								}
								log.info('PASSO AQUI 11082020');
								if (oc.getTIPO_OC() == 'E'
										|| hAPI.getCardValue('ies_conta_item') == 'S') {
									rat.setNUM_CONTA_DEB_DESP(num_conta);
								} else if ((hAPI.getCardValue('regularizacao')) == "S"
										&& (hAPI.getCardValue('num_conta___'
												+ seqRateio) + "") != ''
										&& (hAPI.getCardValue('num_conta___'
												+ seqRateio) + "") != null) {
									log.error('ENTROU NA REGULARIZACAO');
									rat.setNUM_CONTA_DEB_DESP(hAPI
											.getCardValue('num_conta___'
													+ seqRateio)
											+ "");

									rat.setCOD_CENT_CUST(parseFloat(hAPI
											.getCardValue('cod_cc___'
													+ seqRateio)
											+ ""));
								} else if (oc.getTIPO_OC() == 'A'
										|| oc.getTIPO_OC() == 'O') {
									rat.setNUM_CONTA_DEB_DESP(hAPI
											.getCardValue('num_conta___'
													+ seqRateio)
											+ "");
								} else if (oc.getTIPO_OC() == 'P') {
									rat
											.setNUM_CONTA_DEB_DESP(("0000" + ccDocum)
													.substr(-4, 4)
													+ ("0000" + cod_desp)
															.substr(-4, 4));

								} else {
									rat
											.setNUM_CONTA_DEB_DESP(("0000" + cod_cc)
													.substr(-4, 4)
													+ ("0000" + cod_desp)
															.substr(-4, 4));
								}

								lrat.push(rat);

							}
						}
					} else {
						log.error('NÃ£o Entrei rateio..... ');
						var rat = serviceHelper.instantiate(urlBase
								+ 'RATEIOOC');

						rat.setSEQ_RATEIO(new java.math.BigInteger("1"));

						var cod_cc = "";

						// inicia busca da aen do item

						var constraintsItens = new Array();
						var c1 = (DatasetFactory.createConstraint(
								"cod_empresa", hAPI.getCardValue('empresa'),
								hAPI.getCardValue('empresa'),
								ConstraintType.MUST));
						var c2 = (DatasetFactory.createConstraint("cod_item",
								hAPI.getCardValue('cod_item___' + seqItem),
								hAPI.getCardValue('cod_item___' + seqItem),
								ConstraintType.MUST));

						c1.setLikeSearch(true);
						c2.setLikeSearch(true);
						var constraintsItens = new Array(c1, c2);

						var field = new Array('cod_lin_prod', 'cod_lin_recei',
								'cod_seg_merc', 'cod_cla_uso');

						var datasetAENItem = DatasetFactory.getDataset(
								"item_aen", field, constraintsItens, null);

						log.info('datasetAENItem ' + datasetAENItem);

						if (datasetAENItem != null
								&& datasetAENItem.values.length > 0) {
							log.info('AEN ENCONTRADA '
									+ (parseFloat(datasetAENItem.getValue(0,
											"cod_lin_prod")))
									+ (parseFloat(datasetAENItem.getValue(0,
											"cod_lin_recei")))
									+ (parseFloat(datasetAENItem.getValue(0,
											"cod_seg_merc")))
									+ (parseFloat(datasetAENItem.getValue(0,
											"cod_cla_uso"))));
							rat.setCOD_AREA_NEGOCIO(parseFloat(datasetAENItem
									.getValue(0, "cod_lin_prod")));
							rat.setCOD_LIN_NEGOCIO(parseFloat(datasetAENItem
									.getValue(0, "cod_lin_recei")));
							rat.setCOD_SEG_MERC(parseFloat(datasetAENItem
									.getValue(0, "cod_seg_merc")));
							rat.setCOD_CLA_USO(parseFloat(datasetAENItem
									.getValue(0, "cod_cla_uso")));

							// oc.setPROGRAMADOR( new java.math.BigInteger(
							// datasetProg.getValue(0, "cod_progr") ) );
						}

						// fim busca da aen do item
						// var cod_aen =
						// hAPI.getCardValue('cod_aen___1');
						rat.setPCT_PARTICIP_COMP(parseFloat("100"));

						// rat.setCOD_AREA_NEGOCIO( parseFloat(
						// cod_aen.substring( 0, 2 ) ) );
						// rat.setCOD_LIN_NEGOCIO( parseFloat(
						// cod_aen.substring( 2, 4 ) ) );
						// rat.setCOD_SEG_MERC( parseFloat( cod_aen.substring(
						// 4, 6 ) ) );
						// rat.setCOD_CLA_USO( parseFloat( cod_aen.substring( 6,
						// 8 ) ) );
						rat.setCOD_CENT_CUST(parseFloat(cod_cc));

						rat.setCOD_SECAO_RECEB("          ");
						if (hAPI.getCardValue('projeto') != null
								&& hAPI.getCardValue('projeto').trim() != "") {

							rat.setNUM_DOCUM(hAPI.getCardValue('projeto') + "");
						} else {
							rat.setNUM_DOCUM("0");
						}

						rat.setNUM_CONTA_DEB_DESP(num_conta);

						lrat.push(rat);

					}
					arat.setRATEIOOC(lrat);

					oc.setLSTRATEIO(arat);
					log.error('AQUI 003');

					// E N T R E G A

					var aent = serviceHelper.instantiate(urlBase
							+ 'ARRAYOFENTREGAOC');
					var lent = new Array();

					var camposProg = hAPI.getCardData(getValue("WKNumProces"));
					var contadorProg = camposProg.keySet().iterator();
					var seqEnt = 0;
					while (contadorProg.hasNext()) {
						var idProg = contadorProg.next();
						var campo = idProg.split('___')[0];
						var seqProg = idProg.split('___')[1];
						if (seqProg != undefined && campo == "DAT_ENTREGA_ITEM") {
							log.info('Sequencia.....' + seqProg);
							if (hAPI.getCardValue('seq_item_pai___' + seqProg) == hAPI
									.getCardValue('seq_item___' + seqItem)) {
								var ent = serviceHelper.instantiate(urlBase
										+ 'ENTREGAOC');
								log.error('AQUI 004');

								var lead_time = parseInt(hAPI
										.getCardValue('tmp_lead_time___'
												+ seqItem));
								if (lead_time < 7) {
									lead_time = 7;
								}
								var hoje = new Date();
								var dataLead = new Date(hoje.getTime()
										+ (lead_time * 24 * 60 * 60 * 1000));
								var dat_entrega = formatter
										.parse(hAPI
												.getCardValue(
														'dat_entrega_item___'
																+ seqProg)
												.split('-').reverse().join('/'));
								if (dat_entrega < dataLead) {
									dat_entrega = dataLead;
								}

								log
										.error('prog dat_entrega.... '
												+ dat_entrega);
								var dat_Atual = new java.util.Date();
								log.error('prog dat_Atual.... ' + dat_Atual);
								if (dat_Atual.compareTo(dat_entrega) > 0) {
									dat_entrega = dat_Atual;
								}
								dat_entrega = getNextDatUtil(dat_entrega);
								log
										.error('prog dat_justada.... '
												+ dat_entrega);
								ent.setDAT_ENTREGA_PREV(dat_entrega);

								ent.setDAT_ORIGEM(dat_entrega);
								ent.setDAT_PALPITE(dat_entrega);
								ent.setIES_SITUA_PROG('F');
								ent.setNUM_PEDIDO_FORNEC(0);
								log.error('AQUI 005');
								seqEnt += 1;
								ent
										.setNUM_PROG_ENTREGA(new java.math.BigInteger(
												seqEnt));
								ent.setQTD_EM_TRANSITO(0);
								ent.setQTD_RECEBIDA(0);
								log.error('AQUI 006');
								ent.setQTD_SOLIC(parseFloat(hAPI.getCardValue(
										'qtd_entrega_item___' + seqProg)
										.replace('.', '').replace(',', '.')));
								ent.setTEX_OBSERVACAO('');
								lent.push(ent);
							}
						}
					}
					if (seqEnt == 0) {
						var ent = serviceHelper.instantiate(urlBase
								+ 'ENTREGAOC');
						log.error('AQUI 004 F');

						var lead_time = parseInt(hAPI
								.getCardValue('tmp_lead_time___' + seqItem));
						if (lead_time < 7) {
							lead_time = 7;
						}
						var hoje = new Date();
						var dataLead = new Date(hoje.getTime()
								+ (lead_time * 24 * 60 * 60 * 1000));
						var datEntrega = formatter.parse(hAPI.getCardValue(
								'data_entrega').split('-').reverse().join('/'));
						if (datEntrega < dataLead) {
							datEntrega = dataLead;
						}

						log.error('datEntrega.... ' + datEntrega);
						var dataAtual = new java.util.Date();
						log.error('dataAtual.... ' + dataAtual);
						if (dataAtual.compareTo(datEntrega) > 0) {
							datEntrega = dataAtual;
						}
						datEntrega = getNextDatUtil(datEntrega);

						ent.setDAT_ENTREGA_PREV(datEntrega);
						ent.setDAT_ORIGEM(datEntrega);
						ent.setDAT_PALPITE(datEntrega);
						ent.setIES_SITUA_PROG('F');
						ent.setNUM_PEDIDO_FORNEC(0);
						log.error('AQUI 005 F');
						seqEnt += 1;
						ent.setNUM_PROG_ENTREGA(new java.math.BigInteger('1'));
						ent.setQTD_EM_TRANSITO(0);
						ent.setQTD_RECEBIDA(0);
						log.error('AQUI 006 F');
						ent.setQTD_SOLIC(parseFloat(hAPI.getCardValue(
								'qtd_solic___' + seqItem).replace('.', '')
								.replace(',', '.')));
						ent.setTEX_OBSERVACAO('');
						lent.push(ent);
					}

					log.error('AQUI 007');
					aent.setENTREGAOC(lent);
					oc.setLSTENTREGA(aent)

					log.error('AQUI 008');

					var textos = new Array();
					// T E X T O
					var atxt = serviceHelper.instantiate(urlBase
							+ 'ARRAYOFTEXTOOC');

					var obsItem = new String(hAPI.getCardValue(
							'texto_ped_cotacao___' + seqItem).toUpperCase()
							+ "");
					if (obsItem == "undefined" || obsItem == null
							|| obsItem == "null")
						obsItem = " ";
					var obsPed = new String(hAPI.getCardValue('texto_solic')
							.toUpperCase()
							+ "");
					if (obsPed == "undefined" || obsPed == null
							|| obsPed == "null")
						obsPed = " ";

					if (obsItem != " " && obsPed != " ") {

						obsPed = obsItem;
					} else {

						obsPed = obsItem;
					}

					// TEXTO P 1
					var linha = 1;
					while (obsPed.length > 0) {
						if (obsPed == "" || obsPed == undefined
								|| obsPed == "undefined" || obsPed == null
								|| obsPed == "null")
							obsPed = " ";
						var txt = serviceHelper
								.instantiate(urlBase + 'TEXTOOC');
						txt.setTEX_OBSERVACAO(obsPed.substring(0, 60));
						log.error('AQUI 009D');
						txt.setNUM_SEQ(new java.math.BigInteger(linha));
						linha += 1;
						txt.setTIPO_TEXTO('P');
						textos.push(txt);

						obsPed = obsPed.substring(60);
					}

					// TEXTO O 1
					var den_item = new String(hAPI.getCardValue(
							'observacao___' + seqItem).toUpperCase()
							+ "");
					if (den_item == "" || den_item == undefined
							|| den_item == "undefined" || den_item == null
							|| den_item == "null")
						den_item = " ";
					var txt = serviceHelper.instantiate(urlBase + 'TEXTOOC');
					txt.setTEX_OBSERVACAO(den_item.substring(0, 60));
					log.error('AQUI 009D');
					txt.setNUM_SEQ(new java.math.BigInteger(2));
					txt.setTIPO_TEXTO('O');
					textos.push(txt);

					// TEXTO O 2
					var den_item = new String(hAPI.getCardValue(
							'aplicacao___' + seqItem).toUpperCase()
							+ "");
					if (den_item == "" || den_item == undefined
							|| den_item == "undefined" || den_item == null
							|| den_item == "null")
						den_item = " ";
					var txt = serviceHelper.instantiate(urlBase + 'TEXTOOC');
					txt.setTEX_OBSERVACAO(den_item.substring(0, 60));
					log.error('AQUI 009D');
					txt.setNUM_SEQ(new java.math.BigInteger(1));
					txt.setTIPO_TEXTO('O');
					textos.push(txt);

					atxt.setTEXTOOC(textos);

					oc.setLSTTEXTO(atxt);
					log.error('AQUI 010');

					loc.push(oc);

					log.error('AQUI 011');

				} else {
					hAPI.setCardValue('integracao_pendente', 'S');
				}
			}
		}

		
		// integra com o ERP
		log.error('AQUI 012');
		log.error('AQUI 012 NOVO');
		aoc.setLISTA_ORDEM_COMPRA(loc);
		log.error('AQUI 012A');
		ioc.setITEM(aoc);
		log.error('AQUI 013');
		
		if (hAPI.getCardValue('regularizacao') == "S") {
			ioc.setCND_PGTO(hAPI.getCardValue('cnd_pgto') + "");
			ioc.setFORNECEDOR(hAPI.getCardValue('cod_fornecedor') + "");
			ioc.setEMPRESA(hAPI.getCardValue('empresa') + "");
			ioc.setCOMPRADOR(hAPI.getCardValue('cod_comprador') + "");
		}

		log.error("PASSO Z");
		retorno = service.INCLUIR(ioc);
		log.error(retorno);
		if (retorno != null) {
			log.info(' ANTER FOR..... ');
			log.info(' ANTER LENGTH..... ' + retorno.getSTRING().length);
			for (var i = 0; i < retorno.getSTRING().length; i++) {
				log.info('Linha ' + i + ' - ' + retorno.getSTRING(i));
				if (hAPI.getCardValue('regularizacao') == "S"
						&& i + 1 == retorno.getSTRING().length) {
					log.info('Num PED - ' + retorno.getSTRING(i));
					hAPI.setCardValue('num_pedido_sup', retorno.getSTRING(i));
				} else {
					var seqItem = linhasIntegra[i];
					log.info('seqItem21 ' + seqItem);
					log
							.info('Num OC ' + seqItem + ' - '
									+ retorno.getSTRING(i));
					hAPI.setCardValue('num_oc___' + seqItem, retorno
							.getSTRING(i));
					log.info('seqItem21 ' + seqItem);
				}
			}

		}

	} catch (erro) {
		log.error(erro);
		setComment(userId, numProcesso, erro.toString());
		throw erro;
	}
}

// era aqui a integracao

function setComment(user, processo, comentario) {
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint('processo', processo,
			processo, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('user', user, user,
			ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('comentario', comentario,
			comentario, ConstraintType.MUST));
	var dataset = DatasetFactory.getDataset('setComent', null, constraints,
			null);
	if (dataset != null) {
		return dataset.getValue(0, 'retorno');
	}
}

function getNextDatUtil(data) {

	var dia = data.getDay();
	var dataRet = data;
	if (dia == '0') {
		dataRet.setDate(dataRet.getDate() + 1);
	}
	if (dia == '6') {
		dataRet.setDate(dataRet.getDate() + 2);
	}
	return dataRet;
}
