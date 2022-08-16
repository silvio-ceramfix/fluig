function servicetask2(attempt, message) {

	var codEmpresa = getValueForm("empresa", "");
	var numPedido = getValueForm("num_pedido", "");
	var itemSolicAcum = {};
	var dataHora = new Date();

	var numProcesso = getValue('WKNumProces');
	var userId = getValue("WKUser");

	var maxDataEnt = new Date();
	var maxDataEntCalc = new Date();

	var format = new java.text.SimpleDateFormat("dd/MM/yyyy");
	var sdt = new java.text.SimpleDateFormat("yyMMdd");

	// var indexItens = form.getChildrenIndexes("ped_itens");
	// log.info( 'Loop Itens..............'+indexItens.length );
	// for (var i = 0; i < indexItens.length; i++) {
	var camposItem = hAPI.getCardData(getValue("WKNumProces"));
	var contadorItem = camposItem.keySet().iterator();
	log.info('Antes While. ' + camposItem);
	log.info('Antes While..... ' + contadorItem.hasNext());

	// BUSCA EMPRESA
	log.info('Evento Processo ..... 001');
	var c1 = DatasetFactory.createConstraint("cod_empresa", codEmpresa,
			codEmpresa, ConstraintType.MUST);
	var constraints = new Array(c1);
	var dataset = DatasetFactory.getDataset('empresa', null, constraints, null);
	var informa_aen_pedido = "N";
	if (dataset != null) {
		// log.info('DATA SET...'+dataset );
		informa_aen_pedido = dataset.getValue(0, "informa_aen_pedido");
	}

	log.info('Evento Processo ..... 002');
	// BUSCA AEN REPRES
	var aen_repres = "00000000";
	informa_aen_pedido = informa_aen_pedido.trim();
	log.info('AEN INFORMAR1......' + informa_aen_pedido);
	if (informa_aen_pedido == "S") {
		log.info('Evento Processo ..... 001 A...'
				+ getValueForm("cod_repres", "0") + '...');
		var c1 = DatasetFactory.createConstraint("cod_repres", getValueForm(
				"cod_repres", "0"), getValueForm("cod_repres", "0"),
				ConstraintType.MUST);
		log.info('Evento Processo..... 001 B');
		var constraints = new Array(c1);
		log.info('Evento Processo ..... 001 C');
		var dataset = DatasetFactory.getDataset('representante_compl', null,
				constraints, null);
		log.info('Evento Processo ..... 001 D');
		if (dataset != null) {
			// log.info('DATA SET...'+dataset );
			log.info('Evento Processo ..... 001 E ' + dataset.values.length);
			aen_repres = dataset.getValue(0, "cod_aen");
		} else {
			log.info('Evento Processo ..... 001F');
			aen_repres = "00000000";
		}
	}

	log.info('AEN INFORMAR2......' + informa_aen_pedido);
	log.info('AEN REPRES......' + aen_repres);

	/* try { */
	var itensCancel = new Array();
	while (contadorItem.hasNext()) {
		log.info('ENTREIII O M ');
		var idItem = contadorItem.next();
		log.info('Campo. ' + idItem);
		var campo = idItem.split('___')[0];
		var seqItem = idItem.split('___')[1];
		log.info('Seq. ' + seqItem);
		if (seqItem != undefined && campo == "COD_ITEM") {
			log.info('Sequencia.....' + seqItem);
			var codItem = getValueForm("cod_item___" + seqItem, "") + "";
			log.info('Item C.... ' + codItem);
			if (itemSolicAcum[codItem] == null || itemSolicAcum[codItem] == NaN) {
				itemSolicAcum[codItem] = 0.0;
			}

			var qtd = Math.round( getValueFormFloat("quantidade___" + seqItem, "0") * 1000) / 1000;
			if (qtd == null) {
				qtd = 0;
			}
			itemSolicAcum[codItem] += qtd;
			log.info('Par Quantidade C.... ' + itemSolicAcum[codItem]);

			dataEnt = format.parse(getValueForm("data_entrega___" + seqItem, "").split("-").reverse().join("/"));

			var dataEntCalc = calcDataEntrega(codEmpresa, codItem, dataHora, itemSolicAcum[codItem]);
			dataEntCalc = new Date(dataEntCalc.getYear() + 2000, dataEntCalc.getMonth(), dataEntCalc.getDate());
			dataEntCalc = new Date(dataEntCalc.getYear() + 1900, dataEntCalc.getMonth(), dataEntCalc.getDate());

			log.info('DATA ENT.... ' + sdt.format(dataEnt));
			log.info('DATA ENT MAX.... ' + sdt.format(maxDataEnt));
			if (sdt.format(maxDataEnt) < sdt.format(dataEnt)) {
				maxDataEnt = dataEnt;
				log.info('Data de entrega maior');
			} else {
				log.info('Data de entrega menor');
			}

			log.info('DATA CALC.... ' + sdt.format(dataEntCalc));
			log.info('DATA CALC MAX.... ' + sdt.format(maxDataEntCalc));
			if (sdt.format(maxDataEntCalc) < sdt.format(dataEntCalc)) {
				maxDataEntCalc = dataEntCalc;
				log.info('Data de calculada maior');
			} else {
				log.info('Data de calculada menor');
			}

			var dataAjut = '20' + sdt.format(dataEntCalc);
			var sdt4 = new java.text.SimpleDateFormat("yyyyMMdd");

			hAPI.setCardValue("data_entrega_calc___" + seqItem, format
					.format(sdt4.parse(dataAjut)));

			log.info("Read " + "data_entrega_calc___" + seqItem);
			log.info("Read "
					+ getValueForm("data_entrega_calc___" + seqItem, ""));
		}
	}
	log.info('DATA ENT MAX FINAL.... ' + sdt.format(maxDataEnt));
	log.info('DATA CALC MAX FINAL.... ' + sdt.format(maxDataEntCalc));

	log.info("## RESULT POST 2 ## ");
	var clientService = fluigAPI.getAuthorizeClientService();
	var data = {
		companyId : getValue("WKCompany") + "",
		serviceCode : "Logix_PRD",
		endpoint : "/logixrest/vdpr0005/modificaPedidoVenda/" + codEmpresa + "/" + numPedido
		// method : "post" //"post", "delete", "patch", "put", "get"
	};

	// if ( form.getValue( 'tipo_cadastro' ) == 'A'){
	data["method"] = "put"; // "post", "delete", "patch", "post", "get"
	// }else{
	// data["method"] = "post"; //"post", "delete", "patch", "put", "get"
	//data["charset"] = "utf-8";
	log.info("## RESULT POST 23 ## ");
	log.info("## DADOS CABECALHO ##");
	var headers = {};
	headers["Content-Type"] = "application/json;charset=UTF-8";
	data["headers"] = headers;
	log.info("dados header" + headers);
	log.info("## PASSOU DADOS CABECALHO ##");

	var options = {};
	options["encoding"] = "UTF-8";
	options["mediaType"] = "application/json";

	// }
	data["options"] = options;
	var params = {};

	var lr_parametros = {};
	lr_parametros["consistir_pedido"] = "S";
	params["lr_parametros"] = lr_parametros;

	var lr_principal = {};
	lr_principal["cod_empresa"] = getValueForm("empresa", "") + "";
	lr_principal["num_pedido"] = parseInt(numPedido);
	var cod_cliente = getValueForm("cod_cliente", "");
	lr_principal["cod_cliente"] = cod_cliente + "";
	lr_principal["dat_emis_repres"] = getValueForm("data_emissao", "").split("/").reverse().join("-");
	lr_principal["cod_nat_oper"] = getValueForm("nat_operacao", "") + "";

	if (getValueForm("ins_estadual", "") == ""
			|| getValueForm("ins_estadual", "") == null
			|| getValueForm("ins_estadual", "") == undefined) {
		var c1 = DatasetFactory.createConstraint("cod_cliente", cod_cliente,cod_cliente, ConstraintType.MUST);
		var constraints = new Array(c1);
		var dataset = DatasetFactory.getDataset('cliente_rest', null,constraints, null);
		var informa_aen_pedido = "N";
		if (dataset != null) {
			// log.info('DATA SET...'+dataset );
			hAPI.setCardValue("ins_estadual", dataset.getValue(0,"ins_estadual"));
		}
	}

	var insEstadual = getValueForm("ins_estadual", "").replace("[^0-9]", "").trim();
	var iesTipFornec = getValueForm("ies_tip_fornec", "").trim();
	log.info("## INSCRICAO ## " + insEstadual);
	var finalidade = "1";
	log.info("## FINALIDADE ## 0001");
	if (iesTipFornec == "I"
		&& (insEstadual == "" || insEstadual == null || insEstadual == "ISENTO")) {
		finalidade = "3";
		log.info("## FINALIDADE ## 0004");
	} else if ((getValueForm("cod_class", "A") != "U" || getValueForm("cod_class", "A") != "u") 
				&& (insEstadual == "" || insEstadual == null || insEstadual == "ISENTO")  
				&& ((getValueForm("eh_contribuinte", "A")) == 'S')){
						finalidade = "1";
						log.info("## FINALIDADE ## 0005");
	} else if (insEstadual == "" || insEstadual == null
			|| insEstadual == "ISENTO") {
		finalidade = "2";
		log.info("## FINALIDADE ## 0002");
	} else if ((getValueForm("cod_class", "A")) == "U" && insEstadual != "" && insEstadual != null && insEstadual != "ISENTO" && (getValueForm("eh_contribuinte", "A")) == 'N'){
			finalidade = '2';
			log.info('## FINALIDADE ## 0004');
	} else if ((getValueForm("cod_class", "A") == "U" || getValueForm(
			"cod_class", "A") == "u")
			&& (insEstadual != "" || insEstadual != null || insEstadual != "ISENTO")) {
		finalidade = "3";
		log.info("## FINALIDADE ## 0003");
	} 

	log.info("## FIANALIDADE ## " + finalidade);

	lr_principal["ies_finalidade"] = finalidade + "";
	lr_principal["cod_cnd_pgto"] = getValueForm("cond_pagamento", "0") + "";
	lr_principal["ies_tip_entrega"] = getValueForm("tipo_entrega", "0") + "";
	lr_principal["cod_tip_venda"] = getValueForm("tipo_venda", "1") + "";
	lr_principal["cod_tip_carteira"] = getValueForm("cod_tip_carteira_cli",	"01")+ "";

	params["lr_principal"] = lr_principal;

	var lr_representante = {};
	lr_representante["ies_comissao"] = getValueForm("ies_emite_dupl", "S") + "";
	lr_representante["cod_repres"] = getValueForm("cod_repres", "0") + "";
	lr_representante["pct_comissao"] = 0;
	lr_representante["cod_repres_adic"] = "";
	lr_representante["pct_comissao_2"] = 0;
	lr_representante["cod_repres_3"] = "";
	lr_representante["pct_comissao_3"] = 0;

	params["lr_representante"] = lr_representante;

	var lr_adicionais = {};
	lr_adicionais["num_pedido_repres"] = getValue("WKNumProces") + "";
	lr_adicionais["num_pedido_cli"] = getValueForm("ped_cliente", "") + "";
	lr_adicionais["cod_local_estoq"] = "";
	lr_adicionais["pedido_pallet"] = "N";
	lr_adicionais["pct_tolera_minima"] = 0;
	lr_adicionais["pct_tolera_maxima"] = 0;
	lr_adicionais["dat_min_fat"] = "";
	lr_adicionais["nota_empenho"] = "";
	lr_adicionais["contrato_compra"] = "";
	lr_adicionais["forma_pagto"] = "";
	lr_adicionais["processo_export"] = "";
	lr_adicionais["numero_cno_esocial"] = "";
	

	params["lr_adicionais"] = lr_adicionais;

	// tipo_frete_logix

	var lr_frete = {};

	if (getValueForm("tipo_frete", "") == "RET") {
		lr_frete["cod_transpor"] = getValueForm("cod_cliente", "") + "";
	} else {
		lr_frete["cod_transpor"] = getValueForm("cod_trans", "") + "";
	}
	lr_frete["cod_consig"] = "";
	log.info(' informação de tipo de frete no formulário..... '+ getValueForm("tipo_frete_logix", "x"));
	lr_frete["ies_frete"] = getValueForm("tipo_frete_logix", "1") + "";
	log.info(' informação de tipo de frete no json..... '+ lr_frete["ies_frete"]);
	lr_frete["ies_embal_padrao"] = "2";
	lr_frete["pct_frete"] = 0 + "";

	params["lr_frete"] = lr_frete;

	var lr_preco_desconto = {};
	lr_preco_desconto["ies_preco"] = "F";
	lr_preco_desconto["pct_desc_financ"] = getValueFormFloat("pct_desc_financ","0")+ "";
	lr_preco_desconto["pct_desc_adic"] = getValueFormFloat("pct_desc_adicional","0") + "";
	lr_preco_desconto["num_list_preco"] = getValueForm("lista_preco", "") + "";
	lr_preco_desconto["cod_moeda"] = getValueForm("moeda", "") + "";
	if (getValueForm("tipo_desconto", "") == "") {
		lr_preco_desconto["tip_desc"] = null;
	} else {
		lr_preco_desconto["tip_desc"] = getValueForm("tipo_desconto", "") + "";
	}
	lr_preco_desconto["pct_desc_1"] = 0.0 + "";
	lr_preco_desconto["pct_desc_2"] = 0.0 + "";
	lr_preco_desconto["pct_desc_3"] = 0.0 + "";
	lr_preco_desconto["pct_desc_4"] = 0.0 + "";
	lr_preco_desconto["pct_desc_5"] = 0.0 + "";
	lr_preco_desconto["pct_desc_6"] = 0.0 + "";
	lr_preco_desconto["pct_desc_7"] = 0.0 + "";
	lr_preco_desconto["pct_desc_8"] = 0.0 + "";
	lr_preco_desconto["pct_desc_9"] = 0.0 + "";
	lr_preco_desconto["pct_desc_10"] = 0.0 + "";
	
	var dataHora = new Date();
	var sdt5 = new java.text.SimpleDateFormat("dd/MM/yyyy");
	var dataAtual = sdt5.format(dataHora);
	
	
	//ajusta a cotacao caso ela venha vazia na integracao
			if(hAPI.getCardValue("moeda") != "1" ) {
				log.info('comecou o ajuste da cotacao da moeda porque veio sem nada!!! '+hAPI.getCardValue("cotacao").replace('.','').replace(',','.'));
				if ( hAPI.getCardValue("cotacao").replace('.','').replace(',','.') == null || 
						hAPI.getCardValue("cotacao").replace('.','').replace(',','.') == 0 || 
						hAPI.getCardValue("cotacao").replace('.','').replace(',','.') == 0.00) {
					log.info('entrou no ajuste da cotacao da moeda porque veio sem nada!!!');
					
					log.info('entrou no ajuste da cotacao da moeda porque veio sem nada 2 !!! '+ getValueForm("moeda", "")+" "+getValueForm("data_emissao", ""));
					var c1 = DatasetFactory.createConstraint("cod_moeda", getValueForm("moeda", ""),getValueForm("moeda", ""), ConstraintType.MUST);
					var dataFormatada = dataAtualFormatada(getValueForm("data_emissao", ""));
					
					var c2 = DatasetFactory.createConstraint("dat_ref", dataFormatada,dataFormatada, ConstraintType.MUST);
					log.info('data formatada da cotacao '+dataFormatada);
					var c3 = DatasetFactory.createConstraint("table", 'eis_v_cotacao_moeda',null, ConstraintType.MUST);
					var constraints = new Array(c1,c2,c3);
					var dataset = DatasetFactory.getDataset('selectLogix', null,constraints, null);
					log.info('entrou no ajuste da cotacao da moeda porque veio sem nada 3 !!! '+dataset.getValue(0,"val_cotacao"));
					
					if (dataset != null) {
						// log.info('DATA SET...'+dataset );
						log.info('cotacao encontrada '+dataset.getValue(0,"val_cotacao"));
						hAPI.setCardValue("cotacao", dataset.getValue(0,"val_cotacao").replace('.',','));
					}
			
				}
			}
		//fim ajusta cotacao caso venha vazia nesse momento	
	
	if( hAPI.getCardValue("moeda") != "1" ){
		lr_preco_desconto["regra_cotacao"] = "F";
		lr_preco_desconto["val_cotacao_fixa"] = getValueFormFloat("cotacao","0")+ "";
		lr_preco_desconto["data_vigencia"] = dataAtual.split("/").reverse().join("-");	
	} else {
		lr_preco_desconto["regra_cotacao"] = "P";
		lr_preco_desconto["val_cotacao_fixa"] = "";
		lr_preco_desconto["data_vigencia"] = "";
	}

	params["lr_preco_desconto"] = lr_preco_desconto;

	var lr_entrega = {};
	lr_entrega["num_sequencia"] = "";
	if (getValueForm("endereco_ent", "") != "") {
		lr_entrega["end_entrega"] = getValueForm("tipo_logradouro_ent", "")
				+ " " + getValueForm("endereco_ent", "") + ", "
				+ getValueForm("numero_ent", "") + "";
		lr_entrega["den_bairro"] = getValueForm("bairro_ent", getValueForm(
				"bairro_ent_sel", ""))
				+ "";
		lr_entrega["cod_cidade"] = getValueForm("cod_cidade_ent", "") + "";
		lr_entrega["cod_cep"] = getValueForm("cep_ent", "") + "";
		lr_entrega["num_cgc"] = getValueForm("cnpj_ent", "") + "";
		lr_entrega["ins_estadual"] = getValueForm("isento_ie_ent", "") + "";
		lr_entrega["nom_cliente_end_ent"] = getValueForm("razao_social", "")
				+ "";
	} else {
		lr_entrega["end_entrega"] = "";
		lr_entrega["den_bairro"] = "";
		lr_entrega["cod_cidade"] = "";
		lr_entrega["cod_cep"] = "";
		lr_entrega["num_cgc"] = "";
		lr_entrega["ins_estadual"] = "";
		lr_entrega["nom_cliente_end_ent"] = "";
	}

	params["lr_entrega"] = lr_entrega;

	var lr_textos_pedido = {};

	lr_textos_pedido["tex_observ_1"] = getValueForm("texto_pedido_1", "") + "";
	lr_textos_pedido["tex_observ_2"] = getValueForm("texto_pedido_2", "") + "";
	lr_textos_pedido["den_texto_1"] = getValueForm("texto_nf_1", "") + "";
	lr_textos_pedido["den_texto_2"] = getValueForm("texto_nf_2", "") + "";
	lr_textos_pedido["den_texto_3"] = getValueForm("texto_nf_3", "") + "";
	lr_textos_pedido["den_texto_4"] = getValueForm("texto_nf_4", "") + "";
	lr_textos_pedido["den_texto_5"] = getValueForm("texto_nf_5", "") + "";

	params["lr_textos_pedido"] = lr_textos_pedido;

	var lst_la_pedido_itens = [];

	var lst_la_aen_pedido = [];

	// var indexItens = form.getChildrenIndexes("ped_itens");
	// log.info( 'Contatos..............'+indexItens.length );
	// for (var i = 0; i < indexItens.length; i++) {
	var camposItem = hAPI.getCardData(getValue("WKNumProces"));
	var contadorItem = camposItem.keySet().iterator();
	var i = 0;
	var max_i = 0;
	var qtdNovo = 0;
	while (contadorItem.hasNext()) {
		var idItem = contadorItem.next();
		var campo = idItem.split('___')[0];
		var seqItem = idItem.split('___')[1];
		if (seqItem != undefined && campo == "COD_ITEM") {
			var la_pedido_itens = {};
			la_pedido_itens["ind_bonificacao"] = "N";
			if (getValueForm("sequencia___" + seqItem, "") != "") {
				i = parseInt(getValueForm("sequencia___" + seqItem, ""));
			} else {
				i += 1;
				qtdNovo += 1;
			}
			if (i > max_i && qtdNovo == 0) {
				max_i = i;
			}
			if (qtdNovo == 1) {
				i = max_i + 1;
			}
			la_pedido_itens["sequencia_item"] = i + "";
			la_pedido_itens["cod_item"] = getValueForm("cod_item___"+ seqItem, "") + "";
			la_pedido_itens["pct_desc_adic"] = getValueFormFloat("desconto___" + seqItem, "0") + "";
			la_pedido_itens["pre_unit"] = getValueFormFloat("valor_unit___"+ seqItem, "0")+ "";

			var qtd_atu = getValueFormFloat("quantidade___" + seqItem,"0");
			log.info('qtd_atu 2'+qtd_atu);
			var qtd_orig = 0;
			if (getValueForm("qtd_orig___" + seqItem, 0) != "") {
				qtd_orig = getValueFormFloat("qtd_orig___" + seqItem, "0");
				log.info('qtd_orig 2'+qtd_orig);
			}
			var qtd_mais = 0.00;
			var qtd_menos = 0.00;

			if (qtd_atu > qtd_orig) {
				qtd_mais = qtd_atu - qtd_orig;
			}
			if (qtd_atu < qtd_orig) {
				qtd_menos = qtd_orig - qtd_atu;
				log.info('qtd_menos '+qtd_menos);
			}
			la_pedido_itens["qtd_acrescentar"] = qtd_mais + ""; // (
																	// getValueForm(
			log.info('sit_pedido '+(getValueForm("sit_pedido", "")));														// ).replace('.','').replace(',','.')+"";
			if ( getValueForm("sit_pedido", "") == 'E' || getValueForm("sit_pedido", "") == 'W' ) {
				la_pedido_itens["qtd_subtrair"] = qtd_menos + ""; // (
				log.info('qtd_subtrair '+qtd_menos);
				log.info('situacao_pedido '+getValueForm("sit_pedido", ""));
			} else {
				la_pedido_itens["qtd_subtrair"] = 0 + "";
				if (qtd_menos > 0) {
					var la_itens = {};
					la_itens["ind_bonificacao"] = "N";
					la_itens["sequencia_item"] = i + "";
					la_itens["grade_1"] = "";
					la_itens["grade_2"] = "";
					la_itens["grade_3"] = "";
					la_itens["grade_4"] = "";
					la_itens["grade_5"] = "";
					la_itens["qtd_pecas_cancel"] = qtd_menos + "";

					var item_cancel = {};
					item_cancel["item"] = {};
					item_cancel["item"]["la_itens"] = new Array(la_itens);
					item_cancel["cod_empresa"] = codEmpresa + "";
					item_cancel["num_pedido"] = numPedido + "";
					item_cancel["cod_motivo"] = getValueForm("cod_motivo___" + seqItem, 0)+ "";					
					itensCancel.push(item_cancel);
				}
			}

			var dataEntrega = format.parse(getValueForm("data_entrega___" + seqItem, "").split("-").reverse().join("/"));
			var dataEntregaCal = format.parse(getValueForm("data_entrega_calc___" + seqItem, ""));

			if (getValueForm("tipo_entrega", "0") == '1') {
				if (sdt.format(maxDataEnt) > sdt.format(maxDataEntCalc)) {
					dataEntrega = maxDataEnt;
				} else {
					dataEntrega = maxDataEntCalc;
				}
			} else {
				if (sdt.format(dataEntregaCal) > sdt.format(dataEntrega)) {
					dataEntrega = dataEntregaCal;
				}
			}

			var dataAjut = '20' + sdt.format(dataEntrega);
			var sdt4 = new java.text.SimpleDateFormat("yyyyMMdd");

			//log.info('DATA ENVIO.... ' + format.format(sdt4.parse(dataAjut)));

			la_pedido_itens["prz_entrega"] = format.format(sdt4.parse(dataAjut)).split("/").reverse().join("-")+ "";

			log.info('DATA OBEJTO.... ' + la_pedido_itens["prz_entrega"]);

			la_pedido_itens["val_frete_unit"] = 0 + "";
			la_pedido_itens["val_seguro_unit"] = 0 + "";
			la_pedido_itens["pct_desc_1"] = 0 + "";
			la_pedido_itens["pct_desc_2"] = 0 + "";
			la_pedido_itens["pct_desc_3"] = 0 + "";
			la_pedido_itens["pct_desc_4"] = 0 + "";
			la_pedido_itens["pct_desc_5"] = 0 + "";
			la_pedido_itens["pct_desc_6"] = 0 + "";
			la_pedido_itens["pct_desc_7"] = 0 + "";
			la_pedido_itens["pct_desc_8"] = 0 + "";
			la_pedido_itens["pct_desc_9"] = 0 + "";
			la_pedido_itens["pct_desc_10"] = 0 + "";

			la_pedido_itens["den_texto_1"] = getValueForm("obs_item_1___"+ seqItem, "")+ "";
			la_pedido_itens["den_texto_2"] = getValueForm("obs_item_2___"+ seqItem, "")+ "";
			la_pedido_itens["den_texto_3"] = getValueForm("obs_item_3___"+ seqItem, "")+ "";
			la_pedido_itens["den_texto_4"] = getValueForm("obs_item_4___"+ seqItem, "")+ "";
			la_pedido_itens["den_texto_5"] = getValueForm("obs_item_5___"+ seqItem, "")+ "";
			la_pedido_itens["xped"] = getValueForm("pedido_cli_item___"+ seqItem, "")+ "";
			la_pedido_itens["nitemped"] = getValueForm("seq_pedido_cli_item___"+ seqItem, "")+ "";

			lst_la_pedido_itens.push(la_pedido_itens);

			// trata aen
			if (aen_repres != "00000000" && informa_aen_pedido == "S") {
				var la_aen_pedido = {};
				// la_aen_pedido["empresa"] =
				// la_aen_pedido["pedido"] =
				la_aen_pedido["sequencia_item"] = i + "";
				la_aen_pedido["linha_produto"] = aen_repres.substring(0, 2)+ "";
				la_aen_pedido["linha_receita"] = aen_repres.substring(2, 4)+ "";
				la_aen_pedido["segmto_mercado"] = aen_repres.substring(4, 6)+ "";
				la_aen_pedido["classe_uso"] = aen_repres.substring(6, 8)+ "";
				lst_la_aen_pedido.push(la_aen_pedido);
			}

		}
	}

	params["la_pedido_itens"] = lst_la_pedido_itens;

	if (aen_repres != "00000000" && informa_aen_pedido == "S") {
		params["la_aen_pedido"] = lst_la_aen_pedido;
	} else {
		params["la_aen_pedido"] = {};
	}

	params["lr_retirada"] = {};
	params["lr_compl_nfe"] = {};
	params["lr_nf_referencia"] = {};
	params["lr_cliente_interm"] = {};
	params["lr_vendor"] = {};
	params["lr_embarque"] = {};
	params["la_consignatario_adic"] = {};
	params["la_processo_refer"] = {};
	params["la_comissao_item"] = {};
	params["la_pedido_exportacao"] = {};
	params["la_remessa_item"] = {};
	params["la_grades_item"] = {};
	params["la_prazo_grade"] = {};

	data["params"] = params;

	log.info("## antes do stringify ## " + data.toString());
	var jj = JSON.stringify(data);

	log.info("## RESULT POST jj ## " + jj);
	try {
		var vo = clientService.invoke(jj);
		
		log.info('##  clientService ## '+ vo.getServiceCode()+' '+vo.getHttpStatusResult() );
		
		if (vo.getResult() == "" || vo.getResult().isEmpty()) {
			setComment(userId, numProcesso, "Retorno esta vazio!");
			throw "Retorno esta vazio";
		} else {

			// var jr = JSON.parse( vo.getResult() );
			log.info("## RESULT POST res ## " + vo.getResult());

			var jr = JSON.parse(vo.getResult());
			
			log.info("## RESULT POST JR ## " + jr );
			log.info("## RESULT POST JRinfo ## " + jr.length+' '+jr.messages[0].code );
						
			
			log.info("## QUANT. ## " + jr.data.count_mensagens);
			if (jr.data.count_mensagens == null) {
				setComment(userId, numProcesso,	'Nao foi recebido retorno do servidor Logix!');
				throw 'Nao foi recebido retorno do servidor Logix!';
			} else if (jr.data.count_mensagens != 0) {
				var msg = 'Ocorreu erro no processamento do servidor Logix!\n';
				var msgFrm = '';
				// msg += jr.data.mensagens[0].texto;
				for (var y = 0; y < jr.data.count_mensagens; y++) {
					log.info("## YYYYYY ## " + y);
					msg += jr.data.mensagens[y].texto + "\n";
					msgFrm += jr.data.mensagens[y].texto + "#BR#";
				}
				var msgs = new String(msg);
				// msgs = msgs.replace( /||||/g, '\n').replace( /||/, '');
				log.info("## RESULT POST MSG ## " + msgs);
				if (jr.data.sit_pedido == null) {
					setComment(userId, numProcesso, msgs);
					throw msgs;
				} else {
					hAPI.setCardValue("consistencias", msgFrm);
				}
				if( jr.messages[0].code >= '500' 
				 && jr.messages[0].code <= '599' ){
					setComment(userId, numProcesso, msgs);
					throw msgs;
				}
			}
			
			hAPI.setCardValue("sit_pedido", jr.data.sit_pedido);
			var sit_pedido = hAPI.getCardValue("sit_pedido");
			log.info("## SIT_PEDIDO ## " + sit_pedido);
			var num_pedido = hAPI.getCardValue("num_pedido");
			log.info("## NUM_PEDIDO ## " + num_pedido);
			var comentario = ("Pedido " + num_pedido+ "  alterado no Logix com situacao (" + sit_pedido + ") !");
			hAPI.setTaskComments(userId, numProcesso, 0, comentario);
			cancelaItens(itensCancel);
		}
	} catch (e) {

		log.info("ERROOOOOO" + e.toString());

		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint('dataBase',
				'java:/jdbc/LogixPRD', null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('table', 'pedidos',
				null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_empresa',
				getValueForm("empresa", ""), getValueForm("empresa", ""),
				ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('num_pedido_repres',
				numProcesso, numProcesso, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('dat_emis_repres',
				getValueForm("data_emissao", ""), getValueForm("data_emissao",
						""), ConstraintType.MUST));

		var filds = new Array('num_pedido', 'ies_sit_pedido');
		var order = new Array();

		var dataSet = DatasetFactory.getDataset("selectTable", filds,
				constraints, order);

		if (dataSet != null && dataSet != undefined && dataSet.rowsCount > 0) {
			hAPI.setCardValue("sit_pedido", dataSet.getValue(0,
					'ies_sit_pedido'));
			hAPI.setCardValue("num_pedido", dataSet.getValue(0, 'num_pedido'));
			hAPI.setTaskComments(userId, numProcesso, 0, "Pedido "
					+ dataSet.getValue(0, 'num_pedido')
					+ " *alterado no Logix com situacao ("
					+ dataSet.getValue(0, 'ies_sit_pedido') + ") !");
			log.info("Set Pedido DataSet após timeout");
		} else {
			setComment(userId, numProcesso, 'Erro: ' + e.toString());
			throw e.toString();
		}
	}

	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("alertObjectDescription", "Processo " +numProcesso, null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("alertObjectLink","/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID="+ numProcesso, null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("alertObjectDetailKey","e gerou o numero de pedido " + hAPI.getCardValue("num_pedido")+ " na empresa " + codEmpresa, null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("place_alertObjectDescription", "processo de inclusao de pedidos", null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("eventKey","PROCESS_COMPLETED_TO_REQUESTER", null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("loginReceiver", hAPI.getCardValue("userFluig"), null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("priority", "HIGH", null,ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("WDK_TaskNumber",numProcesso + "", null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("WDK_ProcessDescription","Inclusao de Pedidos (" + hAPI.getCardValue("num_pedido") + ") ",	null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("WDK_TaskDescription", " Processo (" + numProcesso + ")", null, ConstraintType.MUST));
	DatasetFactory.getDataset('send_notification', null, constraints, null);
}
/*
 * } catch (err) { setComment(userId, numProcesso, err.toString()); throw
 * err.toString(); }
 */
// #### FUNCTION ######
function getValueForm(campo, padrao) {
	log.info("Campo........" + campo);
	var valor = hAPI.getCardValue(campo);
	if (padrao == "tipoPessoa")
		if (valor.indexOf("/0000-") == -1)
			valor = "F";
		else
			valor = "J";
	log.info("Valor........" + valor);
	if (valor == "" || valor == "") {
		valor = padrao;
		log.info("Valor " + valor);
	}
	return valor;
}

function calcDataEntrega(codEmpresa, codItem, dataHora, qtd_acum) {

	var data = new Date(dataHora.getYear() + 1900, dataHora.getMonth(),
			dataHora.getDate());
	var hora = dataHora.getHours() + ":" + dataHora.getMinutes();
	var dataCalc = new Date(dataHora.getYear() + 1900, dataHora.getMonth(),
			dataHora.getDate());
	try {
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixPRD");
		// var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
		var connectionWD = dataSourceWD.getConnection();

		var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
		var statementWD = connectionWD
				.prepareCall("{ call eis_p_calc_data_entrega( ?, ?, to_date( ?,'dd/MM/yyyy'), ?, ?, ? ) }");

		log.info('PP 00001.........  ');
		statementWD.setString(1, codEmpresa);
		log.info('PP 00002.........  ');
		statementWD.setString(2, codItem);
		log.info('PP 00003.........  ' + sdf.format(data));
		log.info('PP 00003.........  ' + sdf.format(new java.sql.Date(data)));
		log.info('PP 00003.........  ' + new java.sql.Date(data));
		statementWD.setDate(3, new java.sql.Date(data));
		log.info('PP 00004.........  ');
		statementWD.setString(4, hora);
		log.info('PP 00005.........  ');
		statementWD.setString(5, qtd_acum);

		log.info('FF 00001.........  ');

		statementWD.registerOutParameter(6, java.sql.Types.DATE);
		log.info('FF 00002.........  ');
		statementWD.execute();
		log.info('FF 00003.........  ');

		log.info('#################');
		log.info('### 1');
		log.dir(statementWD);
		log.info('### 2');
		log.info("### aqui1: " + statementWD.getDate(6)); // problema aqui
		log.info('### 3');
		log.info("### aqui2: " + statementWD.getDate(6).getTime());
		log.info('#################');
		dataCalc = new Date(statementWD.getDate(6).getTime());

		log.info('Data entrega calc!..' + dataCalc);

		return dataCalc;

	} catch (e) {
		log.info("ERROOOOOO" + e.getMessage());

	} finally {
		if (statementWD != null) {
			statementWD.close();
		}
		if (connectionWD != null) {
			connectionWD.close();
		}
	}
}


function setComment(user, processo, comentario) {
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint('processo', processo,
			processo, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('user', user, user,
			ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('comentario', comentario, comentario, ConstraintType.MUST));
	var dataset = DatasetFactory.getDataset('setComent', null, constraints,
			null);
	if (dataset != null) {
		return dataset.getValue(0, 'retorno');
	}
}

function isNull(valor, padrao) {
	if (isNaN(valor) || valor == null) {
			return padrao;
		} else {
			return valor;
		}
	}

function dataAtualFormatada(){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}


function cancelaItens(itensCancel) {
	log.info('Entrei cancelamento.....');
	if (itensCancel.length > 0) {
		log.info('cancelamento..... ' + itensCancel.length);
		var clientService = fluigAPI.getAuthorizeClientService();
		for (var i = 0; i < itensCancel.length; i++) {
			log.info('cancelamento linha ..... ' + i);
			var data = {
				companyId : getValue("WKCompany") + "",
				serviceCode : "Logix_PRD",
				endpoint : "/logixrest/vdpr0006/cancelaPedidoParcial/"
						+ itensCancel[i].cod_empresa + "/"
						+ itensCancel[i].num_pedido + "/"
						+ itensCancel[i].cod_motivo,
				method : "post", // "post", "delete", "patch", "put",
					// "get"
				params : itensCancel[i].item
			};
			log.info("## antes do stringify ## " + data.toString());
			var jj = JSON.stringify(data);
			log.info("## RESULT POST CANC ## " + jj);
			var vo = clientService.invoke(jj);
			if (vo.getResult() == "" || vo.getResult().isEmpty()) {
				throw "Retorno do cancelamento estÃ¡ vazio";
			} else {
				log.info("## RESULT POST RES CANC ## " + vo.getResult());
				var jr = JSON.parse(vo.getResult());
				// log.info("## QUANT. ## "+jr.data.count_mensagens );
				if (jr.messages == null) {
					throw 'NÃ£o foi recebido retorno do cancelamento do servidor Logix!';
				} else if (jr.messages.length != 0) {
					if (jr.messages[0].code != "201") {
						throw msg = 'Ocorreu erro do cancelamento no processamento do servidor Logix!\n';
					}
				}
			}
		}
	}
}