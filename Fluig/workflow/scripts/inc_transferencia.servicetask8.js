var debug = true;

function servicetask8(attempt, message) {
	
	printLog( 'info', 'ENTREI SEVIÇO' );
	printLog( 'info', 'PROC... '+getValue("WKNextState")+' - '+getValue("WKCompletTask")  );
	
	var numProcesso = getValue('WKNumProces');
	var userId = getValue("WKUser");	
	
	try{

		var dataAtual = new java.util.Date();
		var sdt = new java.text.SimpleDateFormat("yyyy-MM-dd");
		var sdt2 = new java.text.SimpleDateFormat("dd/MM/yyyy");
			
		log.info("## RESULT POST 2 ## ");
			
		var clientService = fluigAPI.getAuthorizeClientService();
		log.info("## RESULT POST 21 ## ");
		var data = {
			companyId : getValue("WKCompany") + "",
			serviceCode : "Logix_PRD",
			endpoint : "/logixrest/vdpr0001/incluiPedidoVenda",
			timeoutService : "240",
			method : "post"
		};
		printLog( 'info', "## DADOS CABECALHO ##");
			
		var headers = {};
		headers["Content-Type"] = "application/json;charset=UTF-8";
		data["headers"] = headers;
			
		printLog( 'info', "## DADOS OPTION ##");
		var options = {};
		options["encoding"] = "UTF-8";
		options["mediaType"] = "application/json";
		data["options"] = options;
		
		printLog( 'info', "## DADOS PARAMS ##");
		var params = {};
		var lr_parametros = {};
		lr_parametros["consistir_pedido"] = "S";
		params["lr_parametros"] = lr_parametros;
	
		var lr_principal = {};
		lr_principal["cod_empresa"] = getValueForm("cod_empresa", "") + "";
		lr_principal["num_pedido"] = 0 + "";
		var cod_cliente = getValueForm("cod_cliente", "");
		lr_principal["cod_cliente"] = getValueForm("cod_cliente", "") + "";

		hAPI.setCardValue("data_pedido_fat", sdt2.format( dataAtual ));
		//lr_principal["dat_emis_repres"] = sdt.format( dataAtual ); 
		lr_principal["dat_emis_repres"] = getValueForm("data_pedido_fat", "").split("/").reverse().join("-") + "";
		lr_principal["cod_nat_oper"] = getValueForm("nat_oper_transf", "") + "";

		lr_principal["ies_finalidade"] = getValueForm("finalidade_transf", "") + "";
		
		lr_principal["cod_cnd_pgto"] = getValueForm("cond_pagto_transf", "") + "";
		lr_principal["ies_tip_entrega"] = getValueForm("tipo_entrega_transf", "") + "";
		lr_principal["cod_tip_venda"] = getValueForm("tipo_venda_transf", "") + "";
		lr_principal["cod_tip_carteira"] = getValueForm("carteira_transf", "") + "";
		params["lr_principal"] = lr_principal;
			
		printLog( 'info', "## DADOS REPRESENTANTE ##");
		var lr_representante = {};
		lr_representante["ies_comissao"] = "N"; // fixo
		lr_representante["cod_repres"] = "";
		lr_representante["pct_comissao"] = 0 + "";
		lr_representante["cod_repres_adic"] = "";
		lr_representante["pct_comissao_2"] = 0 + "";
		lr_representante["cod_repres_3"] = "";
		lr_representante["pct_comissao_3"] = 0 + "";
		params["lr_representante"] = lr_representante;
	
		printLog( 'info', "## DADOS ADICIONAIS ##");
		var lr_adicionais = {};
		lr_adicionais["num_pedido_repres"] = getValue("WKNumProces")+"";
		lr_adicionais["num_pedido_cli"] = "";
		lr_adicionais["cod_local_estoq"] = "";
		lr_adicionais["pedido_pallet"] = "N";
		lr_adicionais["pct_tolera_minima"] = 0 + "";
		lr_adicionais["pct_tolera_maxima"] = 0 + "";
		lr_adicionais["dat_min_fat"] = "";
		lr_adicionais["nota_empenho"] = "";
		lr_adicionais["contrato_compra"] = "";
		lr_adicionais["forma_pagto"] = "";
		lr_adicionais["processo_export"] = "";
		lr_adicionais["numero_cno_esocial"] = "";
		lr_adicionais["cnpj_cpf_subempreiteiro"] = "";
		params["lr_adicionais"] = lr_adicionais;
		
		printLog( 'info', "## DADOS FRETE ##");
		var lr_frete = {};
		lr_frete["cod_transpor"] = getValueForm("cod_fornecedor_transf","")+ "";//"200"; //fixo getValueForm("cod_cliente", "") + "";
		lr_frete["cod_consig"] = "";
		lr_frete["ies_frete"] = getValueForm("tipo_frete_transf","")+ ""; //"1"; // fixo getValueForm("tipo_frete_logix", "1") + "";
		lr_frete["ies_embal_padrao"] = "3";
		lr_frete["pct_frete"] = 0 + "";
		params["lr_frete"] = lr_frete;
		printLog( 'info', "## DADOS COMPL NFE ##");
		var lr_compl_nfe = {};
		/*if( getValueForm("tipo_frete_transf","") == "1" ){
			lr_compl_nfe["modalidade_frete_nfe"] = "0"; 
		}else{
			lr_compl_nfe["modalidade_frete_nfe"] = "1"; 
		}
		lr_compl_nfe["inf_adic_fisco"] = ""; 
		lr_compl_nfe["dat_saida"] = "";
		lr_compl_nfe["hor_saida"] = "";*/
		params["lr_compl_nfe"] = lr_compl_nfe;
		
		printLog( 'info', "## DADOS DESCONTO ##");
		var lr_preco_desconto = {};
		lr_preco_desconto["ies_preco"] = "F";
		lr_preco_desconto["pct_desc_financ"] = 0.0 + "";
		lr_preco_desconto["pct_desc_adic"] = 0.0 + "";
		lr_preco_desconto["num_list_preco"] = getValueForm("lista_preco_transf", "") + "";
		lr_preco_desconto["cod_moeda"] = "1"; //fixo "1getValueForm("moeda", "") + "";
		lr_preco_desconto["tip_desc"] = null;
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
		params["lr_preco_desconto"] = lr_preco_desconto;
		
		printLog( 'info', "## DADOS ENTREGA ##");
		var lr_entrega = {};
		lr_entrega["num_sequencia"] = "";
		lr_entrega["end_entrega"] = "";
		lr_entrega["den_bairro"] = "";
		lr_entrega["cod_cidade"] = "";
		lr_entrega["cod_cep"] = "";
		lr_entrega["num_cgc"] = "";
		lr_entrega["ins_estadual"] = "";
		lr_entrega["nom_cliente_end_ent"] = "";
		params["lr_entrega"] = lr_entrega;
		printLog( 'info', "## DADOS TEXTOS ##");
		var lr_textos_pedido = {};
		//insert numero da OC e PEDIDO
		lr_textos_pedido["tex_observ_1"] = "";//getValueForm("texto_pedido_1", "") + "";
		lr_textos_pedido["tex_observ_2"] = "";// getValueForm("texto_pedido_2", "") + "";
		lr_textos_pedido["den_texto_1"] = "";//"Pedido: "+ getValueForm('num_pedido',"") + "";
		lr_textos_pedido["den_texto_2"] = "";
		lr_textos_pedido["den_texto_3"] = "";
		lr_textos_pedido["den_texto_4"] = "";
		lr_textos_pedido["den_texto_5"] = "";
		params["lr_textos_pedido"] = lr_textos_pedido;
		printLog( 'info', "## DADOS ITENS ##");
		
		var lst_la_pedido_itens = [];
		var lst_la_aen_pedido = [];
		var lst_la_remessa_item = [];
		var camposItem = hAPI.getCardData(getValue("WKNumProces"));
		var contadorItem = camposItem.keySet().iterator();
		var i = 0;
		while (contadorItem.hasNext()) {
			var idItem = contadorItem.next();
			var campo = idItem.split('___')[0];
			var seqItem = idItem.split('___')[1];
			printLog( 'info', "## campo ## "+ campo);
			if (seqItem != undefined && campo == "COD_ITEM") {
				
				i += 1;
								
				var la_pedido_itens = {};
				var la_remessa_item = {}
					
				la_pedido_itens["ind_bonificacao"] = "N";
				la_pedido_itens["sequencia_item"] = i+"";
				la_pedido_itens["cod_item"] = getValueForm("cod_item___" + seqItem,"")+ "";
				la_pedido_itens["pct_desc_adic"] = 0.0 + "";
				//FIXO BUSCA DA LISTA DE PREÇO 
				la_pedido_itens["pre_unit"] = (getValueForm("custo___"+ seqItem, 0) + "").replace('.', '').replace(',', '.')+"";
				
				//hAPI.setCardValue("qtd_item_origem___"+ seqItem, getValueForm("qtd_item___"+ seqItem, 0) ); 
				
				la_pedido_itens["qtd_pecas_solic"] = (getValueForm("qtd_envio___"+ seqItem, 0) + "").replace('.', '').replace(',', '.')+"";
					
				la_pedido_itens["prz_entrega"] = getValueForm("data_envio", "").split("/").reverse().join("-") + "";
				printLog( 'info', 'DATA OBEJTO.... ' + la_pedido_itens["prz_entrega"]);
	
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
	
				la_pedido_itens["den_texto_1"] = "";
				la_pedido_itens["den_texto_2"] = "";
				la_pedido_itens["den_texto_3"] = "";
				la_pedido_itens["den_texto_4"] = "";
				la_pedido_itens["den_texto_5"] = "";
				la_pedido_itens["xped"] = "";
				la_pedido_itens["nitemped"] = "";
				
				lst_la_pedido_itens.push(la_pedido_itens);
			}
		}
		params["la_pedido_itens"] = lst_la_pedido_itens;
			
		params["la_remessa_item"] = {};
	
		printLog( 'info', "## DADOS TAGS SEM USO ##");
		params["la_aen_pedido"] = {};
		params["lr_retirada"] = {};
		//params["lr_compl_nfe"] = {};
		params["lr_nf_referencia"] = {};
		params["lr_cliente_interm"] = {};
		params["lr_vendor"] = {};
		params["lr_embarque"] = {};
		params["la_consignatario_adic"] = {};
		params["la_processo_refer"] = {};
		params["la_comissao_item"] = {};
		params["la_pedido_exportacao"] = {};
		params["la_grades_item"] = {};
		params["la_prazo_grade"] = {};
		//params["la_remessa_item"] = {};
		data["params"] = params;
	
		if( i > 0 ){
			printLog( 'info', "## antes do stringify ## " + data.toString());
			var jj = JSON.stringify(data);
						printLog( 'info', "## RESULT POST jj ## " + jj);
			
			var vo = clientService.invoke(jj);
			if (vo.getResult() == "" || vo.getResult().isEmpty()) {
				throw "Retorno esta vazio";
			} else {
				printLog( 'info', "## RESULT POST REST ## " + vo.getResult());
				var jr = JSON.parse(vo.getResult());
				printLog( 'info', "## QUANT. ## " + jr.data.count_mensagens);
				if (jr.data.count_mensagens == null) {
					throw 'Nao foi recebido retorno do servidor Logix!';
				} else if (jr.data.count_mensagens != 0) {
					var msg = 'Ocorreu erro no processamento do servidor Logix!\n';
					var msgFrm = '';
					for (var y = 0; y < jr.data.count_mensagens; y++) {
						printLog( 'info', "## LINHA ## " + y);
						msg += jr.data.mensagens[y].texto + "\n";
						msgFrm += jr.data.mensagens[y].texto + "#BR#";
					}
					var msgs = new String(msg);
					printLog( 'erro', "## RESULT POST MSG ## "+ jr.data.pedido +" - "+ msgs);
					if (jr.data.sit_pedido == null) {
						throw msgs;
					} 
				}
				hAPI.setCardValue("sit_pedido", jr.data.sit_pedido);
				hAPI.setCardValue("num_pedido", jr.data.pedido);
				var sit_pedido = hAPI.getCardValue("sit_pedido");
				printLog( 'info', "## SIT_PEDIDO ## " + sit_pedido);
				var num_pedido = hAPI.getCardValue("num_pedido");
				printLog( 'info', "## NUM_PEDIDO ## " + num_pedido);
			}
		}else{
			throw 'Não informado itens.';
		}
		
	} catch(erro) { 
		printLog( 'erro', "ERROOOOOO" + erro.toString() );
		throw erro.toString();
	}
	return true;
}


function getNextDatUtil( data ){
	
	var dia = data.getDay();
	var dataRet = data;
	if( dia == '0' ){
		dataRet.setDate( dataRet.getDate() + 1 );
	}
	if( dia == '6' ){
		dataRet.setDate( dataRet.getDate() + 2 );
	}
	return dataRet;
}

function printLog( tipo, msg ){
	
	if( debug ){
		var msgs = getValue("WKDef")+" - "+getValue("WKNumProces")+" - "+msg
		if( tipo == 'info'){
			log.info( msgs );
		}else if( tipo == 'error' ){
			log.error( msgs );
		}else if( tipo == 'fatal' ){
			log.fatal( msgs );
		}else{
			log.warn( msgs );
		}
	}
}

function getValueForm(campo, padrao) {
	printLog( "info", "Campo........" + campo);
	var valor = hAPI.getCardValue(campo);
	if (valor == "" || valor == undefined) {
		valor = padrao;
		printLog( "info", "Valor padrao........" + valor);
	}
	return valor;
}

