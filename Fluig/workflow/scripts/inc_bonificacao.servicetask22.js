function servicetask22(attempt, message) {

	log.info('ENTROU NA FUNCAO DE INCLUSAO DO PEDIDO...');

	var codEmpresa = getValueForm("empresa", "") + "";
	var natOperacao = getValueForm("nat_operacao", "") + "";
	var qtdVezes = getValueForm("qtdVezes", "") + "";
	var numProcesso;
	var userId;


	var clientService = fluigAPI.getAuthorizeClientService();
	numProcesso = getValue('WKNumProces');
	userId = getValue("WKUser");

	for (var parcAtual = 1; parcAtual <= qtdVezes; parcAtual++) {
		try {
			log.info('###Passou vez' + parcAtual);

			var data = {
				companyId : getValue("WKCompany") + "",
				serviceCode : "Logix_PRD",
				endpoint : "/logixrest/vdpr0001/incluiPedidoVenda",
				method : "post" // "post", "delete", "patch", "put", "get"
			};
			
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

			// IMPRIME OS LOGS-------------------------------------------
			log.info('PARAMETROS lr_parametros###');
			log.info('consistir_pedido' + lr_parametros["consistir_pedido"]);
			// IMPRIME OS LOGS-------------------------------------------

			var lr_principal = {};
			lr_principal["cod_empresa"] = codEmpresa + "";
			lr_principal["num_pedido"] = "0";
			lr_principal["cod_cliente"] = getValueForm("cod_cliente", "") + "";
			lr_principal["dat_emis_repres"] = getValueForm("data_emissao", "")
					.split("/").reverse().join("-");
			lr_principal["cod_nat_oper"] = natOperacao + "";

			// 1- Se a
			// InscriÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ§ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ£o
			// Estadual estiver em "BRANCO" ou com a
			// palavra "ISENTO" o campo Finalidade deverÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¡
			// ser = 2".
			// 2- Se a IE estiver com numeros o campo finalidade
			// deverÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¡ ser =
			// "1".
			// 3- Se a IE estiver com nÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂºmeros e o campo
			// Classe estiver
			// preenchida com "U"
			// o campo Finalidade deverÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¡ ser = "3".
			// também se o tipo de fornecedor no vdp10000 estiver como microempresa
			// individual e estiver isento ou vazio
			// será gravado como finalidade 3
			// 4 - se tiver inscricao estadual, estivo como U na classe, porém nos parametros do VDP10000
			// GERAL estiver como não contribuinte irá gravar 2
			// 5 - Se não tiver inscricao estadual, porém o campo eh contribuinte da aba 2 dos parametros
			// do vdp10000 estiver como eh_contribuinte e a classe não for U o campo finalidade irá receber 1

			if (getValueForm("ins_estadual", "") == ""
					|| getValueForm("ins_estadual", "") == null
					|| getValueForm("ins_estadual", "") == undefined) {
				var c1 = DatasetFactory.createConstraint("cod_cliente", cod_cliente,
						cod_cliente, ConstraintType.MUST);
				var constraints = new Array(c1);
				var dataset = DatasetFactory.getDataset('cliente_rest', null,
						constraints, null);
				var informa_aen_pedido = "N";
				if (dataset != null) {
					// log.info('DATA SET...'+dataset );
					hAPI.setCardValue("ins_estadual", dataset.getValue(0,
							"ins_estadual"));
				}
			}

			var insEstadual = getValueForm("ins_estadual", "").replace("[^0-9]", "")
					.trim();
			var iesTipFornec = getValueForm("ies_tip_fornec", "").trim();
			log.info("## INSCRICAO ## " + insEstadual);
			log.info("## COD_CLASS ## " + getValueForm("cod_class", "A"));
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

			log.info('BUSCA DATASET NATUREZA OPERACAO...');
			var cons = new Array();
			log.info('Antes Pai Filho....');
			cons.push(DatasetFactory.createConstraint('dataSet',
					'empresa_compl', 'empresa_compl', ConstraintType.MUST));
			cons.push(DatasetFactory.createConstraint('table', 'nat_oper',
					'nat_oper', ConstraintType.MUST));
			cons.push(DatasetFactory.createConstraint('pai_cod_empresa',
					codEmpresa, codEmpresa, ConstraintType.MUST));
			cons.push(DatasetFactory.createConstraint('filho_cod_nat_oper',
					natOperacao, natOperacao, ConstraintType.MUST));
			log.info(cons);

			var dataset = DatasetFactory.getDataset('paiFilho', null, cons,
					null);
			if (dataset != null) {
				lr_principal["cod_cnd_pgto"] = dataset.getValue(0,
						'cod_cond_pagto')
						+ "";
				lr_principal["ies_tip_entrega"] = dataset.getValue(0,
						'tipo_entrega')
						+ "";
				lr_principal["cod_tip_venda"] = dataset.getValue(0,
						'tipo_venda')
						+ "";
				lr_principal["cod_tip_carteira"] = dataset.getValue(0,
						'carteiraNat')
						+ "";
			} else {
				log.info('NULO RESULT DATASET NATUREZA OPERACAO');
			}

			params["lr_principal"] = lr_principal;

			// IMPRIME OS LOGS-------------------------------------------
			log.info('PARAMETROS lr_principal###');
			log.info('cod_empresa:' + lr_principal["cod_empresa"]);
			log.info('num_pedido:' + lr_principal["num_pedido"]);
			log.info('cod_cliente:' + lr_principal["cod_cliente"]);
			log.info('dat_emis_repres:' + lr_principal["dat_emis_repres"]);
			log.info('cod_nat_oper:' + lr_principal["cod_nat_oper"]);
			log.info('ies_finalidade:' + lr_principal["ies_finalidade"]);
			log.info('RESULT DATASET NATUREZA OPERACAO...:'
					+ dataset.values.length);
			log.info('cod_cnd_pgto:' + lr_principal["cod_cnd_pgto"]);
			log.info('ies_tip_entrega:' + lr_principal["ies_tip_entrega"]);
			log.info('cod_tip_venda:' + lr_principal["cod_tip_venda"]);
			log.info('cod_tip_carteira:' + lr_principal["cod_tip_carteira"]);
			// IMPRIME OS LOGS-------------------------------------------

			var lr_representante = {};

			// validar se comissao estão ou nao marcado. teste

			var ies_comissao = dataset.getValue(0, 'ies_comissao') + "";
			if (ies_comissao == 'on') {
				lr_representante["ies_comissao"] = 'S';
			} else {
				lr_representante["ies_comissao"] = 'N';
			}

			var perc_comissao = dataset.getValue(0, 'perc_comissao') + "";

			if (perc_comissao != '' && perc_comissao != undefined
					&& perc_comissao != null) {
				lr_representante["pct_comissao"] = perc_comissao;
			} else {
				lr_representante["pct_comissao"] = 0;
			}

			lr_representante["cod_repres"] = getValueForm("cod_repres", "0")
					+ "";
			// lr_representante["pct_comissao"] = "0";
			lr_representante["cod_repres_adic"] = "";
			lr_representante["pct_comissao_2"] = "0";
			lr_representante["cod_repres_3"] = "";
			lr_representante["pct_comissao_3"] = "0";

			params["lr_representante"] = lr_representante;

			// IMPRIME OS LOGS-------------------------------------------
			log.info('PARAMETROS lr_representante###');
			log.info('ies_comissao:' + lr_representante["ies_comissao"]);
			log.info('cod_repres:' + lr_representante["cod_repres"]);
			log.info('pct_comissao:' + lr_representante["pct_comissao"]);
			log.info('cod_repres_adic:' + lr_representante["cod_repres_adic"]);
			log.info('pct_comissao_2:' + lr_representante["pct_comissao_2"]);
			log.info('cod_repres_3:' + lr_representante["cod_repres_3"]);
			log.info('pct_comissao_3:' + lr_representante["pct_comissao_3"]);
			// IMPRIME OS LOGS-------------------------------------------

			var lr_adicionais = {};
			lr_adicionais["num_pedido_repres"] = getValue("WKNumProces") + "";
			lr_adicionais["num_pedido_cli"] = "";
			lr_adicionais["cod_local_estoq"] = "";
			lr_adicionais["pedido_pallet"] = "N";
			lr_adicionais["pct_tolera_minima"] = "0";
			lr_adicionais["pct_tolera_maxima"] = "0";
			lr_adicionais["dat_min_fat"] = "";
			lr_adicionais["nota_empenho"] = "";
			lr_adicionais["contrato_compra"] = "";
			lr_adicionais["forma_pagto"] = "";
			lr_adicionais["processo_export"] = "";
			lr_adicionais["numero_cno_esocial"] = "";
			lr_adicionais["cnpj_cpf_subempreiteiro"] = "";

			params["lr_adicionais"] = lr_adicionais;

			// IMPRIME OS LOGS-------------------------------------------
			log.info('PARAMETROS lr_adicionais###');
			log.info('num_pedido_repres:' + lr_adicionais["num_pedido_repres"]);
			log.info('num_pedido_cli:' + lr_adicionais["num_pedido_cli"]);
			log.info('cod_local_estoq:' + lr_adicionais["cod_local_estoq"]);
			log.info('pedido_pallet:' + lr_adicionais["pedido_pallet"]);
			log.info('pct_tolera_minima:' + lr_adicionais["pct_tolera_minima"]);
			log.info('pct_tolera_maxima:' + lr_adicionais["pct_tolera_maxima"]);
			log.info('dat_min_fat:' + lr_adicionais["dat_min_fat"]);
			log.info('nota_empenho:' + lr_adicionais["nota_empenho"]);
			log.info('contrato_compra:' + lr_adicionais["contrato_compra"]);
			log.info('forma_pagto:' + lr_adicionais["forma_pagto"]);
			log.info('processo_export:' + lr_adicionais["processo_export"]);
			log.info('numero_cno_esocial:'
					+ lr_adicionais["numero_cno_esocial"]);
			log.info('cnpj_cpf_subempreiteiro:'
					+ lr_adicionais["cnpj_cpf_subempreiteiro"]);
			// IMPRIME OS LOGS-------------------------------------------

			var lr_frete = {};

			if (dataset.getValue(0, 'tipo_frete') == "RET") {
				lr_frete["cod_transpor"] = getValueForm("cod_cliente", "") + "";
			} else {
				lr_frete["cod_transpor"] = getValueForm("cod_transportadora",
						"")
						+ "";
			}
			lr_frete["cod_consig"] = "";
			if (getValueForm("tipo_frete") == 'CIF') {
				lr_frete["ies_frete"] = '1'+"";
			} else {
				lr_frete["ies_frete"] = dataset.getValue(0, 'tipo_frete') + "";
			}	
			lr_frete["ies_embal_padrao"] = "3";
			lr_frete["pct_frete"] = 0 + "";

			params["lr_frete"] = lr_frete;

			// IMPRIME OS LOGS-------------------------------------------
			log.info('PARAMETROS lr_frete###');
			log.info('cod_transpor:' + lr_frete["cod_transpor"]);
			log.info('cod_consig:' + lr_frete["cod_consig"]);
			log.info('ies_frete:' + lr_frete["ies_frete"]);
			log.info('ies_embal_padrao:' + lr_frete["ies_embal_padrao"]);
			log.info('pct_frete:' + lr_frete["pct_frete"]);
			// IMPRIME OS LOGS-------------------------------------------

			var lr_preco_desconto = {};

			lr_preco_desconto["ies_preco"] = "F";
			lr_preco_desconto["pct_desc_financ"] = 0 + "";
			lr_preco_desconto["pct_desc_adic"] = 0 + "";
			lr_preco_desconto["num_list_preco"] = getValueForm("lstPreco", "")
					+ "";
			
			if (getValueForm("cod_moeda_lista", "")!='' && getValueForm("cod_moeda_lista", "")!=null) {
				lr_preco_desconto["cod_moeda"] = getValueForm("cod_moeda_lista", "")+"";
			} else {
				lr_preco_desconto["cod_moeda"] = dataset.getValue(0, 'moeda') + "";
			}
			lr_preco_desconto["tip_desc"] = 6; // dataset.getValue(0,'tipo_desconto')+"";
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
			var sdt = new java.text.SimpleDateFormat("dd/MM/yyyy");
			var dataAtual = sdt.format(dataHora);
			
			if( hAPI.getCardValue("cod_moeda_lista") != "1" && hAPI.getCardValue("cod_moeda_lista") != "" && hAPI.getCardValue("cod_moeda_lista") != null ){
				lr_preco_desconto["regra_cotacao"] = "F";
				lr_preco_desconto["val_cotacao_fixa"] = parseFloat( hAPI.getCardValue("cotacao").replace('.','').replace(',','.') ) + "";
				lr_preco_desconto["data_vigencia"] = dataAtual.split("/").reverse().join("-");		
			} else {
				lr_preco_desconto["regra_cotacao"] = "P";
				lr_preco_desconto["val_cotacao_fixa"] = "";
				lr_preco_desconto["data_vigencia"] = "";
			}

			params["lr_preco_desconto"] = lr_preco_desconto;

			// IMPRIME OS LOGS-------------------------------------------
			log.info('PARAMETROS lr_preco_desconto###');
			log.info('ies_preco:' + lr_preco_desconto["ies_preco"]);
			log.info('pct_desc_financ:' + lr_preco_desconto["pct_desc_financ"]);
			log.info('pct_desc_adic:' + lr_preco_desconto["pct_desc_adic"]);
			log.info('num_list_preco:' + lr_preco_desconto["num_list_preco"]);
			log.info('cod_moeda:' + getValueForm("cod_moeda_lista", "")+"");
			log.info('tip_desc:' + lr_preco_desconto["tip_desc"]);
			log.info('pct_desc_1:' + lr_preco_desconto["pct_desc_1"]);
			log.info('pct_desc_2:' + lr_preco_desconto["pct_desc_2"]);
			log.info('pct_desc_3:' + lr_preco_desconto["pct_desc_3"]);
			log.info('pct_desc_4:' + lr_preco_desconto["pct_desc_4"]);
			log.info('pct_desc_5:' + lr_preco_desconto["pct_desc_5"]);
			log.info('pct_desc_6:' + lr_preco_desconto["pct_desc_6"]);
			log.info('pct_desc_7:' + lr_preco_desconto["pct_desc_7"]);
			log.info('pct_desc_8:' + lr_preco_desconto["pct_desc_8"]);
			log.info('pct_desc_9:' + lr_preco_desconto["pct_desc_9"]);
			log.info('pct_desc_10:' + lr_preco_desconto["pct_desc_10"]);
			// IMPRIME OS LOGS-------------------------------------------

			var lr_entrega = {};

			lr_entrega["num_sequencia"] = "";

			if (getValueForm("endereco_ent", "") != "") {
				lr_entrega["end_entrega"] = getValueForm("tipo_logradouro_ent",
						"")
						+ " "
						+ getValueForm("endereco_ent", "")
						+ ", "
						+ getValueForm("numero_ent", "") + "";
				lr_entrega["den_bairro"] = getValueForm("bairro_ent",
						getValueForm("bairro_ent_sel", ""))
						+ "";
				lr_entrega["cod_cidade"] = getValueForm("cod_cidade_ent", "")
						+ "";
				lr_entrega["cod_cep"] = getValueForm("cep_ent", "") + "";
				lr_entrega["num_cgc"] = getValueForm("cnpj_ent", "") + "";
				lr_entrega["ins_estadual"] = getValueForm("isento_ie_ent", "")
						+ "";
				lr_entrega["nom_cliente_end_ent"] = getValueForm(
						"razao_social", "")
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
			log.info('lr_entrega...' + lr_entrega);

			// IMPRIME OS LOGS-------------------------------------------
			log.info('PARAMETROS lr_entrega###');
			log.info('num_sequencia:' + lr_entrega["num_sequencia"]);
			log.info('end_entrega:' + lr_entrega["end_entrega"]);
			log.info('den_bairro:' + lr_entrega["den_bairro"]);
			log.info('cod_cidade:' + lr_entrega["cod_cidade"]);
			log.info('cod_cep:' + lr_entrega["cod_cep"]);
			log.info('num_cgc:' + lr_entrega["num_cgc"]);
			log.info('ins_estadual:' + lr_entrega["ins_estadual"]);
			log
					.info('nom_cliente_end_ent:'
							+ lr_entrega["nom_cliente_end_ent"]);
			// IMPRIME OS LOGS-------------------------------------------

			var lr_textos_pedido = {};

			lr_textos_pedido["tex_observ_1"] = "";
			lr_textos_pedido["tex_observ_2"] = "";

			var textoTotal = getValueForm("descricao", "") + "";
			var texto_nf_2 = textoTotal.substring(0, 76) + "";
			var texto_nf_3 = textoTotal.substring(77, 153) + "";
			var texto_nf_4 = textoTotal.substring(154, 228) + "";
			var texto_nf_5 = textoTotal.substring(229, 304) + "";
			var texto_nf_1 = "Fluxo de Bonificacao "+ numProcesso + "";

			lr_textos_pedido["den_texto_1"] = texto_nf_1 + "";
			lr_textos_pedido["den_texto_2"] = texto_nf_2 + "";
			lr_textos_pedido["den_texto_3"] = texto_nf_3 + "";
			lr_textos_pedido["den_texto_4"] = texto_nf_4 + "";
			lr_textos_pedido["den_texto_5"] = texto_nf_5 + "";

			params["lr_textos_pedido"] = lr_textos_pedido;

			// IMPRIME OS LOGS-------------------------------------------
			log.info('PARAMETROS lr_representante###');
			log.info('den_texto_1:' + lr_textos_pedido["den_texto_1"]);
			log.info('den_texto_2:' + lr_textos_pedido["den_texto_2"]);
			log.info('den_texto_3:' + lr_textos_pedido["den_texto_3"]);
			log.info('den_texto_4:' + lr_textos_pedido["den_texto_4"]);
			log.info('den_texto_5:' + lr_textos_pedido["den_texto_5"]);
			// IMPRIME OS LOGS-------------------------------------------

			var lst_la_pedido_itens = [];

			var lst_la_aen_pedido = [];

			var camposItem = hAPI.getCardData(getValue("WKNumProces"));
			var contadorItem = camposItem.keySet().iterator();
			var i = 0;

			log.info('ANTES DO WHILE DE CADA ITEM');

			while (contadorItem.hasNext()) {
				var idItem = contadorItem.next();
				var campo = idItem.split('___')[0];
				var seqItem = idItem.split('___')[1];

				// log.info('idItem:' +idItem)
				// log.info('campo:' +campo)
				// log.info('seqItem:'+seqItem)

				if (seqItem != undefined && campo == "COD_ITEM") {

					var parcelaID = getValueForm("parcelaID___" + seqItem, "")
							+ "";

					// Lógica para pegar somente os itens da parcela
					log.info('parcelaID: ' + parcelaID);
					log.info('Parcela atual: ' + parcAtual);

					if (parcelaID != parcAtual)
						continue; // 

					i += 1;
					var la_pedido_itens = {};

					la_pedido_itens["ind_bonificacao"] = "N";
					la_pedido_itens["sequencia_item"] = i + "";
					la_pedido_itens["cod_item"] = getValueForm("cod_item___"
							+ seqItem, "")
							+ "";
					la_pedido_itens["pct_desc_adic"] = (getValueForm(
							"desconto___" + seqItem, 0) + "").replace('.', '')
							.replace(',', '.')
							+ "";
					la_pedido_itens["pre_unit"] = (getValueForm(
							"valUnitario___" + seqItem, 0) + "").replace('.',
							'').replace(',', '.')
							+ "";
					la_pedido_itens["qtd_pecas_solic"] = (getValueForm(
							"quantidade___" + seqItem, 0) + "")
							.replace('.', '').replace(',', '.')
							+ "";

					// var dataEntrega = format.parse( getValueForm(
					// "data_entrega___"+seqItem, "" ) );
					// var dataEntregaCal = format.parse( getValueForm(
					// "data_entrega_calc___"+seqItem, "" ) );

					// CALCULA A DATA COM O ULTIMO DIA DO MES

					dataEntrega = carregaDataPgto(parcelaID);
					log.info('Data5...' + dataEntrega);

					la_pedido_itens["prz_entrega"] = dataEntrega + "";
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

					la_pedido_itens["den_texto_1"] = '';
					la_pedido_itens["den_texto_2"] = '';
					la_pedido_itens["den_texto_3"] = '';
					la_pedido_itens["den_texto_4"] = '';
					la_pedido_itens["den_texto_5"] = '';
					la_pedido_itens["xped"] = '';
					la_pedido_itens["nitemped"] = '';

					lst_la_pedido_itens.push(la_pedido_itens);

					// IMPRIME OS
					// LOGS-------------------------------------------
					log.info('PARAMETROS la_pedido_itens###');
					log.info('prz_entrega:' + la_pedido_itens["prz_entrega"]);
					// IMPRIME OS
					// LOGS-------------------------------------------

					// trata aen

					// var aen_repres = getValueForm( "aen", '' )+"";

					var la_aen_pedido = {};

					// 01100103
					cod_aen = getValueForm("cod_aen") + "";
					log.info('cod_aen' + cod_aen);

					la_aen_pedido["sequencia_item"] = i + "";
					la_aen_pedido["linha_produto"] = cod_aen.substring(0, 2);
					la_aen_pedido["linha_receita"] = cod_aen.substring(2, 4);
					la_aen_pedido["segmto_mercado"] = cod_aen.substring(4, 6);
					la_aen_pedido["classe_uso"] = cod_aen.substring(6, 8);
					lst_la_aen_pedido.push(la_aen_pedido);

					// IMPRIME OS
					// LOGS-------------------------------------------
					log.info('PARAMETROS la_aen_pedido###');
					log.info('sequencia_item:'
							+ la_aen_pedido["sequencia_item"]);
					log.info('linha_produto:' + la_aen_pedido["linha_produto"]);
					log.info('linha_receita:' + la_aen_pedido["linha_receita"]);
					log.info('segmto_mercado:'
							+ la_aen_pedido["segmto_mercado"]);
					log.info('classe_uso:' + la_aen_pedido["classe_uso"]);
					// IMPRIME OS
					// LOGS-------------------------------------------

				}
			}

			params["la_pedido_itens"] = lst_la_pedido_itens;

			params["la_aen_pedido"] = lst_la_aen_pedido;

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
			var vo = clientService.invoke(jj);

			if (vo.getResult() == "" || vo.getResult().isEmpty()) {
				throw "Retorno está vazio";
			} else {

				// var jr = JSON.parse( vo.getResult() );
				log.info("## RESULT POST res ## " + vo.getResult());

				var jr = JSON.parse(vo.getResult());
				log.info("## QUANT. ## " + jr.data.count_mensagens);
				if (jr.data.count_mensagens == null) {
					throw 'Não foi recebido retorno do servidor Logix!';
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
						throw msgs;
					} else {
						hAPI.setCardValue("consistencias", msgFrm);
					}
				}
				// agora aqui
				// hAPI.setCardValue( "sit_pedido", jr.data.sit_pedido );
				hAPI.setCardValue( "num_pedido", jr.data.pedido );
				
				
				//entrou na atividade de envio de e-mail dos pedidos gerados pela bonificação
				//######### RECUPERA INFORMAÃ¿Ã¿ES DO PEDIDO DO LOGIX
				var cod_empresa = hAPI.getCardValue( "empresa" );
				var num_pedido = hAPI.getCardValue( "num_pedido" ); 
				var cod_cliente = hAPI.getCardValue( "cod_cliente" );
				var cod_repres = hAPI.getCardValue( "cod_repres" );
				var consistencias = hAPI.getCardValue('consistencias');
				var numProcesso = getValue('WKNumProces');
				var userId = getValue("WKUser");

				
				
				
				//grava o campo dos numeros do pedido para recuperar depois
				hAPI.setCardValue("num_pedidos_gerados", hAPI.getCardValue("num_pedidos_gerados")+parcAtual+'-'+num_pedido+';');
				
				
				log.info("ANTES DE GRAVAR MENSAGEM!");
				
				
				hAPI.setTaskComments(userId, numProcesso, 0, "Pedido " + jr.data.pedido
						+ "  incluido no Logix com situação ("
						+ jr.data.sit_pedido + ") !");
				log.info("DEPOIS DE GRAVAR MENSAGEM!");
			}
		} catch (err) {
			log.info('ERROOOOO ' + err.toString());
			setComment(userId, numProcesso, err.toString());
			throw err.toString();
		}
	} // End for

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
			log.info("Valor padrão........" + valor);
		}
		return valor;
	}

	function carregaDataPgto(parcela) {

		
		var dataAtual = new Date();
		log.info('Data1...' + dataAtual);

		var ultimoDiaDoMes = dataAtual.getDate();
		log.info('Data2...' + ultimoDiaDoMes);

		dataAtual.setDate(ultimoDiaDoMes);
		log.info('Data3...' + dataAtual);

		dataFinal = pegarDataAtual(dataAtual,parcela);
		log.info('Data4...' + dataFinal);

		return dataFinal;

	}

	function RetornaUltimoDiaDoMes(objetoDate,parcela) {
		log.info('ULTIMO DIA DO MES '+ (new Date(objetoDate.getFullYear(), objetoDate.getMonth() + (parcela), 0))
		.getDate());
		return (new Date(objetoDate.getFullYear(), objetoDate.getMonth() + (parcela), 0))
				.getDate();
	}

	function pegarDataAtual(data,parcela) {

		ano = data.getFullYear(); // Get the four digit year (yyyy)
		mes = data.getMonth(); // Get the month (0-11)
		var mestratado = (parseInt(mes))+ parseInt(parcela);
		log.info('MES TRATADO '+mestratado);
		dia = data.getDate(); // Get the day as a number (1-31)
		
		mes = mestratado;
		if (mestratado < 10) {
			mes = "0" + mes;
		}

		if (dia < 10) {
			dia = "0" + dia;
		}

		dataFinal = ano + "-" + mes + "-" + dia;
		log.info('DATA FINAL '+dataFinal);
		return dataFinal;
	}
	function setComment(user, processo, comentario) {
		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint('processo', processo,
				processo, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('user', user, user,
				ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('comentario',
				comentario, comentario, ConstraintType.MUST));
		var dataset = DatasetFactory.getDataset('setComent', null, constraints,
				null);
		if (dataset != null) {
			return dataset.getValue(0, 'retorno');
		}
	}

}