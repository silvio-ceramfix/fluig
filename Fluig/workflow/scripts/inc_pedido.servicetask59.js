
var lst_aen_margem = {};

function servicetask59(attempt, message) {
	
	hAPI.setCardValue("obs_ger_reg","");
	hAPI.setCardValue("obs_ger_nac","");
	hAPI.setCardValue("obs_ctr","");
	

	var codEmpresa = getValueForm("empresa","10");
	var codCliente = getValueForm("cod_cliente","");
	var natOper = getValueForm("nat_operacao","");
	var uf = getValueForm("estado_ent","");
	var carteira = getValueForm("cod_tip_carteira_cli","01");	
	var codRepres = getValueForm("cod_repres", "");
	var codTipCli = getValueForm("cod_tip_cli", "");
	var codCondPgto = getValueForm("cond_pagamento", "");
	
	var p_desc_finac = getValueFormFloat("pct_desc_financ", "0");

	if( !loadRepres( codRepres ) ){
		throw "Erro ao recuperar dados do representate";
	}

	loadListaLobAEN( codRepres );
	
	var itens = new Array();
	
	var insEstadual = getValueForm("ins_estadual", "").replace("[^0-9]", "").trim();
	log.info("## INSCRICAO ## " + insEstadual);
	var finalidade = "1";
	log.info("## FINALIDADE ## 0001");
	if (insEstadual == "" || insEstadual == null || insEstadual == "ISENTO") {
		finalidade = "2";
		log.info("## FINALIDADE ## 0002");
	} else if ((getValueForm("cod_class", "A") == "U" || getValueForm(
			"cod_class", "A") == "u")
			&& (insEstadual != "" || insEstadual != null || insEstadual != "ISENTO")) {
		finalidade = "3";
		log.info("## FINALIDADE ## 0003");
	}
	
	var ies_mix_geral_reg = 'N';
	var ies_mix_geral_nac = 'N';
	var ies_desc_medio_reg = 'N';
	var ies_desc_medio_nac = 'N';
	var ies_desc_item_reg = 'N';
	var ies_desc_item_nac = 'N';
	var ies_pct_lob_reg = 'N';
	var ies_pct_lob_nac = 'N';
	var ies_pct_lob_ctr = 'N';	
	var ies_alt_list_reg = 'N';
	var ies_pct_lob_aen = 'N';
		
	var pct_custo_ger = 0;
	var ies_mix = '';
	var ies_desc_ped = '';
	var ies_desc_item = '';
	var ies_lob = '';
	var ies_aprov_list = '';
	
	var lob = 0;
    var p_lob = 0;
	var lob3 = 0;
    var p_lob3 = 0;     
	 
    // ### Recupera paramentros da empresa.
	var c1 = DatasetFactory.createConstraint("cod_empresa", codEmpresa, codEmpresa, ConstraintType.MUST);
	var constraints = new Array(c1);
	var dataset = DatasetFactory.getDataset('empresa_compl', null, constraints, null);
		 
	if (dataset != null) {
		pct_custo_ger = parseFloat( dataset.getValue(0, "pct_custo_ger") );
		ies_mix = dataset.getValue(0, "ies_prov_mix");
		ies_desc_ped = dataset.getValue(0, "ies_prov_desc_ped");
		ies_desc_item = dataset.getValue(0, "ies_prov_desc_item");
		ies_lob = dataset.getValue(0, "ies_prov_lob");
		ies_aprov_list = dataset.getValue(0, "ies_aprov_list");
	}
	
	pct_custo_ger = isNull(pct_custo_ger,0);
		
	var dfs = java.text.DecimalFormatSymbols();
	dfs.setDecimalSeparator(',');
	dfs.setPerMill('.');
	df2 = new java.text.DecimalFormat("0.00",dfs);
	
	// busca percentual de lob minimo para novos clientes e se eh o primeiro
	// pedido
	var perc_minimo_lob;
	var prim_pedido;
	
	// log.info('tipo_frete_logix ');
	var SQL1 = " select nvl(caracter_integr,0) as perc_min from vdp_dpara_geral where sistema_integr='LOB_NOVOS_CLI' " +
            "	and caracter_logix = '"+ codEmpresa +"' ";
		
	 var c1 = DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/LogixPRD', 'java:/jdbc/LogixPRD', ConstraintType.MUST);
	 var c2 = DatasetFactory.createConstraint("SQL", SQL1, SQL1, ConstraintType.MUST);
	 var constraints = new Array(c1,c2);
	 var dataset = DatasetFactory.getDataset('select', null, constraints, null);
	 
	 if (dataset != null) {
		 log.info('DATA SET...'+dataset );
		 perc_minimo_lob = parseFloat(dataset.getValue(0, "perc_min"));
	 }else{
		 perc_minimo_lob = parseFloat(0);
	 }
	 log.info('percentual_min_lob...'+perc_minimo_lob);
	 
	 var SQL2 = " select case when count(*) > 0 then 'N' else 'S' end as prim_pedido from pedidos  " +
	 			" where cod_cliente = '"+ codCliente +"' ";
	 log.info('SQL21'+SQL2);
	 var c1 = DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/LogixPRD', 'java:/jdbc/LogixPRD', ConstraintType.MUST);
	 var c2 = DatasetFactory.createConstraint("SQL", SQL2, SQL2, ConstraintType.MUST);
	 var constraints = new Array(c1,c2);
	 var dataset = DatasetFactory.getDataset('select', null, constraints, null);
	 log.info('SQL22'+SQL2);
	 
	 if (dataset != null) {
		 log.info('DATA SET...'+dataset );
		 prim_pedido = dataset.getValue(0, "prim_pedido");
	 }else{
		 prim_pedido = 'N';
	 }
	 log.info('percentual_min_lob...'+perc_minimo_lob);
	 log.info('primeiro_pedido...'+prim_pedido);
	
	// fim busca percentual de lob minimo para novos clientes e se eh o primeiro
	// pedido
	
	// ////#### F R E T E #####
	var numProcesso = getValue('WKNumProces');
	var userId = getValue("WKUser"); 
	var frete_total = 0 ;
	var peso_total = getValueFormFloat( "peso_total_geral", "0" );
	var cod_cidade_ent = getValueForm( 'cod_cidade_ent', '0' );
	log.info( 'peso_total.........'+peso_total );
	var valor_total = getValueFormFloat( "valor_total_real", "0" );
	var cub_total = getValueFormFloat( "cubagem_total_geral", "0" );
	var cod_transp = getValueForm('cod_trans','X');
	
	log.info('peso_total D-. '+peso_total+" SRT "+getValueForm( "peso_total_geral", "0" ));
	
	var i = 0;
	if( peso_total == 0 || peso_total == undefined || peso_total == null || peso_total == ""  ){
		
		peso_total = 0;
		
		var camposItem = hAPI.getCardData(getValue("WKNumProces"));
		var contadorItem = camposItem.keySet().iterator();
		log.info('Antes While. ' + camposItem);
		log.info('Antes While..... ' + contadorItem.hasNext());	 
		
		while (contadorItem.hasNext()) {
			var idItem = contadorItem.next();		
			if( idItem.indexOf("___") == -1 ){
				continue;
			}
			//log.info('Campo. ' + idItem);
			var campo = idItem.split('___')[0];
			var seqItem = '0';
			seqItem = idItem.split('___')[1];
			//log.info('Seq. ' + seqItem);
			if( seqItem != 0 && seqItem != undefined && campo == "COD_ITEM" ) {
				i += 1;
				
				var item = {};
							
				var qtd = getValueFormFloat("quantidade___" + seqItem, "0");
				var peso = getValueFormFloat("peso___" + seqItem, "0");
				
				peso_total += qtd * peso;  
				
			}
		}
		hAPI.setCardValue("peso_total_geral", df2.format( peso_total ) );
	}
	log.info('peso_total D+. '+peso_total);
	if( getValueForm('tipo_frete_logix','X') == '1' ){
		
		log.info('tipo_frete_logix ');
		log.info('cod_cidade_ent '+cod_cidade_ent);
		/*if (cod_cidade_ent != null && cod_cidade_ent != 0 ) {
			var SQL = " select nvl( EIS_F_GET_VLR_FRETE_EMBARCADOR( emp.cod_empresa, "+  
			"											clie.cod_cidade, "+ 
            "											'"+ cod_cidade_ent +"',"+ 
            "											pe.parametro_ind, "+ 
            "											"+ peso_total +", "+ 
            "                          					trunc(sysdate), 0 ), 0) as frete_cif "+
            "    FROM empresa emp "+ 
            "	 join clientes clie on (clie.cod_cliente = emp.cod_cliente) "+
            "	 join clientes cli on (1=1) "+
            "	 left join omc_par_emitente pe on ( pe.emitente = cli.cod_cliente "+
            "                     				and pe.parametro = 'nivel_servico' ) "+
            "	where emp.cod_empresa = '"+ codEmpresa +"' "+
            "	  and cli.cod_cliente = '"+ codCliente +"' ";
			
		} else {
		var SQL = " select nvl( EIS_F_GET_VLR_FRETE_EMBARCADOR( emp.cod_empresa, "+  
				"											clie.cod_cidade, "+ 
	            "											cli.cod_cidade, "+ 
	            "											pe.parametro_ind, "+ 
	            "											"+ peso_total +", "+ 
	            "                          					trunc(sysdate), 0 ), 0) as frete_cif "+
	            "    FROM empresa emp "+ 
	            "	 join clientes clie on (clie.cod_cliente = emp.cod_cliente) "+
	            "	 join clientes cli on (1=1) "+
	            "	 left join omc_par_emitente pe on ( pe.emitente = cli.cod_cliente "+
	            "                     				and pe.parametro = 'nivel_servico' ) "+
	            "	where emp.cod_empresa = '"+ codEmpresa +"' "+
	            "	  and cli.cod_cliente = '"+ codCliente +"' ";
		}*/
		if (cod_cidade_ent != null && cod_cidade_ent != 0 ) {
			var SQL = " select nvl( eis_f_get_valor_tabela_frete( emp.cod_empresa, "+ //empresa
					"'"+cod_transp+"',"+ //cod_transportadora
			"											clie.cod_cidade, "+ //cod cidade origem
			"'"+codCliente+"',"+ //cod_cliente
            "											'"+ cod_cidade_ent +"',"+ //cod cidade destino 
            "											pe.parametro_ind, "+ //nivel
            "0," + //quantidade
            "											"+ peso_total +", "+ //peso liquido
            "											"+ peso_total +", "+  //peso item
            cub_total+"," + //peso cubado
            valor_total+","+ //valortotal mercadoria
            valor_total+","+ //valortotal 
            "0," + //total km
            "0," + //qtd descarga
            "'N',"+
            
            " 'N' ), 0) as frete_cif "+
            "    FROM empresa emp "+ 
            "	 join clientes clie on (clie.cod_cliente = emp.cod_cliente) "+
            "	 join clientes cli on (1=1) "+
            "	 left join omc_par_emitente pe on ( pe.emitente = cli.cod_cliente "+
            "                     				and pe.parametro = 'nivel_servico' ) "+
            "	where emp.cod_empresa = '"+ codEmpresa +"' "+
            "	  and cli.cod_cliente = '"+ codCliente +"' ";
			
		} else {
			var SQL = " select nvl( eis_f_get_valor_tabela_frete( emp.cod_empresa, "+ //empresa
					"'"+cod_transp+"',"+ //cod_transportadora
					"											clie.cod_cidade, "+ //cod cidade origem
					"'"+codCliente+"',"+ //cod_cliente
				    "cli.cod_cidade,"+ //cod cidade destino 
				    "											pe.parametro_ind, "+ //nivel
				    "0," + //quantidade
				    "											"+ peso_total +", "+ //peso liquido
				    "											"+ peso_total +", "+  //peso item
				    cub_total+"," + //peso cubado
		            valor_total+","+ //valortotal mercadoria
		            valor_total+","+ //valortotal 
				    "0," + //total km
				    "0," + //qtd descarga
				    "'N',"+
				    
				    " 'N' ), 0) as frete_cif "+
				    "    FROM empresa emp "+ 
				    "	 join clientes clie on (clie.cod_cliente = emp.cod_cliente) "+
				    "	 join clientes cli on (1=1) "+
				    "	 left join omc_par_emitente pe on ( pe.emitente = cli.cod_cliente "+
				    "                     				and pe.parametro = 'nivel_servico' ) "+
				    "	where emp.cod_empresa = '"+ codEmpresa +"' "+
				    "	  and cli.cod_cliente = '"+ codCliente +"' ";
		}
		
         log.info('SQL FRETE... '+SQL); 
		 var c1 = DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/LogixPRD', 'java:/jdbc/LogixPRD', ConstraintType.MUST);
		 var c2 = DatasetFactory.createConstraint("SQL", SQL, SQL, ConstraintType.MUST);
		 var constraints = new Array(c1,c2);
		 var dataset = DatasetFactory.getDataset('select', null, constraints, null);
		 
		 if (dataset != null && (parseFloat( dataset.getValue(0, "frete_cif")))!= 0 ) {
			 log.info('DATA SET...'+dataset );
			 hAPI.setCardValue("frete", df2.format( parseFloat( dataset.getValue(0, "frete_cif") ) ) );
			 frete_total = parseFloat( dataset.getValue(0, "frete_cif") );
		 }else{
			 log.info('ENTROU NO FRETE ZERO');
			 hAPI.setCardValue("frete", "0,00" );
			 //tratativa para devolver ao comercial para analise quando o tipo de frete for CIF e não tiver valor
			 try{
				 throw "Atencao: O tipo de Frete selecionado é CIF e não foi possível calcular o valor de Frete a partir das tabelas do TMS!";
			 } catch (e){
				 hAPI.setTaskComments(userId, numProcesso, 0, "Atencao: O tipo de Frete selecionado é CIF e não foi possível calcular o valor de Frete a partir das tabelas do TMS!");	 
				 throw "Atencao: O tipo de Frete selecionado é CIF e não foi possível calcular o valor de Frete a partir das tabelas do TMS!";
			 }
			 //fim tratativa para devolver ao comercial para analise quando o tipo de frete for CIF e não tiver valor
		 }		 
	}else{
		hAPI.setCardValue("frete", "0,00" );
	}
    // ######### F I M F R E T E #######
	
	 var custo_total = 0;
	 var icms_total = 0;
	 var pis_total = 0;
	 var cofins_total = 0;
	 var comis_total = 0;
	 
	 var ipi_total = 0;	 
	 var st_total = 0;
	 
	 var acordo_total = 0;
	 var verba_total = 0;
	 var custo_trans_total = 0;

	 var valTotPrevlLobAEN = 0;
	 var valTotRealLobAEN = 0;
	 
	var camposItem = hAPI.getCardData(getValue("WKNumProces"));
	var contadorItem = camposItem.keySet().iterator();
	log.info('Antes While. ' + camposItem);
	log.info('Antes While..... ' + contadorItem.hasNext());	 
	
	var i = 0;
	
	var cotacao = 1;
	if( getValueForm("moeda", "") != "1" 
	  && getValueForm("cotacao", "") != ""
	  && getValueFormFloat("cotacao", "0") ){
		cotacao = getValueFormFloat("cotacao", "0");
	}	
	
	while (contadorItem.hasNext()) {
		var idItem = contadorItem.next();		
		if( idItem.indexOf("___") == -1 ){
			continue;
		}
		//log.info('Campo. ' + idItem);
		var campo = idItem.split('___')[0];
		var seqItem = '0';
		seqItem = idItem.split('___')[1];
		//log.info('Seq. ' + seqItem);
		if( seqItem != 0 && seqItem != undefined && campo == "COD_ITEM" ) {
			i += 1;
			
			var item = {};
						
			log.info('Sequencia.....' + seqItem + ' - ' + i );
			var codItem = getValueForm("cod_item___" + seqItem, "") + "";
			log.info( 'valor......................... '+getValueForm("valor_total___" + seqItem, "") );
			var valor = getValueFormFloat("valor_total___" + seqItem, "0") * cotacao;
			log.info( 'valor......................... '+valor );
			var qtd = getValueFormFloat("quantidade___" + seqItem, "0");
			var peso = getValueFormFloat("peso___" + seqItem, "0");
			
			var aenN1 = getValueForm("cod_lin_prod___" + seqItem, "");
			var aenN2 = getValueForm("cod_lin_recei___" + seqItem, "");
			var aenN3 = getValueForm("cod_seg_merc___" + seqItem, "");
			var aenN4 = getValueForm("cod_cla_uso___" + seqItem, "");
			
			var pctMargeAEN = 0;
			log.info("######### 0 pctMargeAEN ########## "+ leftPad(aenN1, 2)+leftPad(aenN2, 2)+leftPad(aenN3, 2)+leftPad(aenN4, 2) );
			log.info("######### 0 pctMargeAEN ########## "+ lst_aen_margem[ leftPad(aenN1, 2)+'000000' ] );
			if( lst_aen_margem[ leftPad(aenN1, 2)+leftPad(aenN2, 2)+leftPad(aenN3, 2)+leftPad(aenN4, 2) ] != undefined ){
				pctMargeAEN = lst_aen_margem[ leftPad(aenN1, 2)+leftPad(aenN2, 2)+leftPad(aenN3, 2)+leftPad(aenN4, 2) ];
				log.info("######### 4 pctMargeAEN ########## "+pctMargeAEN);
			}else if( lst_aen_margem[ leftPad(aenN1, 2)+leftPad(aenN2, 2)+leftPad(aenN3, 2)+'00' ] != undefined ){
				pctMargeAEN = lst_aen_margem[ leftPad(aenN1, 2)+leftPad(aenN2, 2)+leftPad(aenN3, 2)+'00' ];
				log.info("######### 3 pctMargeAEN ########## "+pctMargeAEN);
			}else if( lst_aen_margem[ leftPad(aenN1, 2)+leftPad(aenN2, 2)+'0000' ] != undefined ){
				pctMargeAEN = lst_aen_margem[ leftPad(aenN1, 2)+leftPad(aenN2, 2)+'0000' ];
				log.info("######### 2 pctMargeAEN ########## "+pctMargeAEN);
			}else if( lst_aen_margem[ leftPad(aenN1, 2)+'000000' ] != undefined ){
				pctMargeAEN = lst_aen_margem[ leftPad(aenN1, 2)+'000000' ];
				log.info("######### 1 pctMargeAEN ########## "+pctMargeAEN);
			}
			log.info("######### 0 pctMargeAEN ########## "+pctMargeAEN);
			
			item["perc_prev_lob_aen"] = pctMargeAEN;
			
			item["num_processo"] = getValue("WKNumProces");
			item["seq_item"] = seqItem;
			item["cod_item"] = codItem;
			item["quantidade"] = qtd;	
			item["valor_total"] = valor;

			
			var SQL = " select  nvl(EIS_F_GET_CUSTO_REAL_PAR('"+ codEmpresa +"', '"+ codItem +"', 'AD', 'S'),0) * "+ qtd +" as custo_aditivo," +
		       		"			nvl(EIS_F_GET_CUSTO_REAL_PAR('"+ codEmpresa +"', '"+ codItem +"', 'AG', 'S'),0) * "+ qtd +" as custo_agregado," +
		       		"			nvl(EIS_F_GET_CUSTO_REAL_PAR('"+ codEmpresa +"', '"+ codItem +"', 'CM', 'S'),0) * "+ qtd +" as custo_cimento," +
		       		"			nvl(EIS_F_GET_CUSTO_REAL_PAR('"+ codEmpresa +"', '"+ codItem +"', 'EM', 'S'),0) * "+ qtd +" as custo_embalagem," +
		       		"			nvl(EIS_F_GET_CUSTO_REAL_PAR('"+ codEmpresa +"', '"+ codItem +"', 'MP', 'S'),0) * "+ qtd +" as custo_materia_prima," +
		       		"			nvl(EIS_F_GET_CUSTO_REAL_PAR('"+ codEmpresa +"', '"+ codItem +"', 'MS', 'S'),0) * "+ qtd +" as custo_material_secundario," +
		       		"			nvl(EIS_F_GET_CUSTO_REAL_PAR('"+ codEmpresa +"', '"+ codItem +"', 'RV', 'S'),0) * "+ qtd +" as custo_material_revenda," +
		       		"			nvl(EIS_F_GET_CUSTO_REAL_PAR('"+ codEmpresa +"', '"+ codItem +"', 'ST', 'S'),0) * "+ qtd +" as custo_servico_terceiro," +
       				"			nvl(EIS_F_GET_CUSTO_REAL_PAR('"+ codEmpresa +"', '"+ codItem +"', 'FT', 'S'),0) * "+ qtd +" as custo_transferecia, "+
       				"			nvl(EIS_F_GET_CUSTO_REAL_PAR('"+ codEmpresa +"', '"+ codItem +"', 'EL', 'S'),0) * "+ qtd +" as custo_embalagem_logistica, "+
		       		" 	       	nvl(eis_f_get_trib_0696('"+ codEmpresa +"', 'ICMS', '"+ natOper +"', '"+ uf +"', '"+ finalidade +"', '"+ codCliente +"', '"+ codItem +"', '"+ carteira +"', "+ valor +", 'V'  ),0) + " +
		       		"			nvl(eis_f_get_trib_0696('"+ codEmpresa +"', 'ICMS_UF_DEST', '"+ natOper +"', '"+ uf +"', '"+ finalidade +"', '"+ codCliente +"', '"+ codItem +"', '"+ carteira +"', "+ valor +", 'V'  ),0) + " +
		       		"			nvl(eis_f_get_trib_0696('"+ codEmpresa +"', 'ICMS_UF_REMET', '"+ natOper +"', '"+ uf +"', '"+ finalidade +"', '"+ codCliente +"', '"+ codItem +"', '"+ carteira +"', "+ valor +", 'V'  ),0) as icms, "+
		       		"			nvl(eis_f_get_trib_0696('"+ codEmpresa +"', 'PIS_REC', '"+ natOper +"', '"+ uf +"', '"+ finalidade +"', '"+ codCliente +"', '"+ codItem +"', '"+ carteira +"', "+ valor +", 'V'  ),0) as pis, "+
		       		"			nvl(eis_f_get_trib_0696('"+ codEmpresa +"', 'COFINS_REC', '"+ natOper +"', '"+ uf +"', '"+ finalidade +"', '"+ codCliente +"', '"+ codItem +"', '"+ carteira +"', "+ valor +", 'V'  ),0) as cofins, " +
		       		"			nvl(eis_f_get_trib_0696('"+ codEmpresa +"', 'ICMS_ST', '"+ natOper +"', '"+ uf +"', '"+ finalidade +"', '"+ codCliente +"', '"+ codItem +"', '"+ carteira +"', "+ valor +", 'V'  ),0) as st, "+
		       		"			nvl(eis_f_get_trib_0696('"+ codEmpresa +"', 'IPI', '"+ natOper +"', '"+ uf +"', '"+ finalidade +"', '"+ codCliente +"', '"+ codItem +"', '"+ carteira +"', "+ valor +", 'V'  ),0) as ipi, "+
		       		"			"+ valor +" * nvl(eis_f_get_commis_item_nf('"+ codEmpresa +"','"+ codRepres +"','"+ codCliente +"','"+ codTipCli +"','"+ codCondPgto +"', "+ aenN1 +", "+ aenN2 +", "+ aenN3 +", "+ aenN4 +", '"+ codItem +"'),0) / 100 as comis," +
		       		"       	nvl(eis_f_get_valor_verba('"+ codCliente +"', '04', trunc(sysdate), lpad("+ aenN1 +",2,'0')||lpad("+ aenN2 +",2,'0')||lpad("+ aenN3 +",2,'0')||lpad("+ aenN4 +",2,'0'), "+ valor +", "+ valor +" ),0) + "+
		       		"       	nvl(eis_f_get_valor_verba('"+ codCliente +"', '02', trunc(sysdate), lpad("+ aenN1 +",2,'0')||lpad("+ aenN2 +",2,'0')||lpad("+ aenN3 +",2,'0')||lpad("+ aenN4 +",2,'0'), "+ valor +", "+ valor +" ),0) + "+
		       		"			nvl(eis_f_get_valor_verba('"+ codCliente +"', '01', trunc(sysdate), lpad("+ aenN1 +",2,'0')||lpad("+ aenN2 +",2,'0')||lpad("+ aenN3 +",2,'0')||lpad("+ aenN4 +",2,'0'), "+ valor +", "+ valor +" ),0) as acordo_comerc "+
		       		"	from dual ";
			
			log.info('SQL...'+SQL );
			
			var c1 = DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/LogixPRD', 'java:/jdbc/LogixPRD', ConstraintType.MUST);
			var c2 = DatasetFactory.createConstraint("SQL", SQL, SQL, ConstraintType.MUST);
			var constraints = new Array(c1,c2);
			var dataset = DatasetFactory.getDataset('select', null, constraints, null);
			 
			var lob_item = parseFloat(0);
			var rol_item = parseFloat(0);
			 
			if (dataset != null) {
				 
				//hAPI.setCardValue("custo___" + seqItem, df2.format( parseFloat( dataset.getValue(0, "custo") ) ) );
				
				var custo = parseFloat( dataset.getValue(0, "custo_aditivo") )
						  + parseFloat( dataset.getValue(0, "custo_agregado") )
						  + parseFloat( dataset.getValue(0, "custo_cimento") )
						  + parseFloat( dataset.getValue(0, "custo_embalagem") )
						  + parseFloat( dataset.getValue(0, "custo_materia_prima") )
						  + parseFloat( dataset.getValue(0, "custo_material_secundario") )
						  + parseFloat( dataset.getValue(0, "custo_material_revenda") )
						  + parseFloat( dataset.getValue(0, "custo_servico_terceiro") )
						  + parseFloat( dataset.getValue(0, "custo_embalagem_logistica") );
						  
				item["custo_aditivo"] = parseFloat( dataset.getValue(0, "custo_aditivo") );
				item["custo_agregado"] = parseFloat( dataset.getValue(0, "custo_agregado") );
				item["custo_cimento"] = parseFloat( dataset.getValue(0, "custo_cimento") );
				item["custo_embalagem"] = parseFloat( dataset.getValue(0, "custo_embalagem") );
				item["custo_materia_prima"] = parseFloat( dataset.getValue(0, "custo_materia_prima") );
				item["custo_material_secundario"] = parseFloat( dataset.getValue(0, "custo_material_secundario") );
				item["custo_material_revenda"] = parseFloat( dataset.getValue(0, "custo_material_revenda") );
				item["custo_servico_terceiro"] = parseFloat( dataset.getValue(0, "custo_servico_terceiro") );
				item["custo_embalagem_logistica"] = parseFloat( dataset.getValue(0, "custo_embalagem_logistica") );
				item["custo_transferecia"] = parseFloat( dataset.getValue(0, "custo_transferecia") );
				
				item["custo"] = custo;
				log.info('CUSTO... '+ getValue("WKNumProces") +' custo___' + seqItem+' - '+custo );
				
				custo_total += custo;
				log.info('CUSTO TOTAL...'+custo_total );
				 
				//hAPI.setCardValue("icms___" + seqItem, df2.format( parseFloat( dataset.getValue(0, "icms") ) ) );
				item["icms"] = parseFloat( dataset.getValue(0, "icms") );
				icms_total += parseFloat( dataset.getValue(0, "icms") );
				
				//hAPI.setCardValue("pis___" + seqItem, df2.format( parseFloat( dataset.getValue(0, "pis") ) ) );
				item["pis"] = parseFloat( dataset.getValue(0, "pis") );
				pis_total += parseFloat( dataset.getValue(0, "pis") );
				
				//hAPI.setCardValue("cofins___" + seqItem, df2.format( parseFloat( dataset.getValue(0, "cofins") ) ) );
				item["cofins"] = parseFloat( dataset.getValue(0, "cofins") );
				cofins_total += parseFloat( dataset.getValue(0, "cofins") );
				
				//hAPI.setCardValue("comis___" + seqItem, df2.format( parseFloat( dataset.getValue(0, "comis") ) ) );
				item["comis"] = parseFloat( dataset.getValue(0, "comis") );
				comis_total += parseFloat( dataset.getValue(0, "comis") );

				//hAPI.setCardValue("st___" + seqItem, df2.format( parseFloat( dataset.getValue(0, "st") ) ) );
				item["st"] = parseFloat( dataset.getValue(0, "st") );
				st_total += parseFloat( dataset.getValue(0, "st") );
				
				//hAPI.setCardValue("ipi___" + seqItem, df2.format( parseFloat( dataset.getValue(0, "ipi") ) ) );
				item["ipi"] = parseFloat( dataset.getValue(0, "ipi") );
				ipi_total += parseFloat( dataset.getValue(0, "ipi") );
				
				//hAPI.setCardValue("acordo_comerc___" + seqItem, df2.format( parseFloat( dataset.getValue(0, "acordo_comerc") ) ) );
				item["acordo_comerc"] = parseFloat( dataset.getValue(0, "acordo_comerc") );
				acordo_total += parseFloat( dataset.getValue(0, "acordo_comerc") );
				 
				//hAPI.setCardValue("custo_trans___" + seqItem, df2.format( parseFloat( dataset.getValue(0, "custo_trans") ) ) );
				item["custo_trans"] = parseFloat( dataset.getValue(0, "custo_transferecia") );
				custo_trans_total += parseFloat( dataset.getValue(0, "custo_transferecia") );
				 
				rol_item = valor - parseFloat( dataset.getValue(0, "icms") ) - parseFloat( dataset.getValue(0, "pis") ) - parseFloat( dataset.getValue(0, "cofins") );
				log.info('rol_item1...'+rol_item );
				 	
				var desc_finac =  ( valor + parseFloat( dataset.getValue(0, "st") ) + parseFloat( dataset.getValue(0, "ipi") ) ) * p_desc_finac / 100;
				//var custo = parseFloat( dataset.getValue(0, "custo") );
				log.info('custo1...'+custo );
				custo += custo * pct_custo_ger/ 100;
				log.info('pct_custo_ger...'+pct_custo_ger);
				log.info('custo2...'+custo );
				var frete = 0; 
				if( peso_total > 0 ){
					frete = frete_total * ( ( qtd * peso ) / peso_total );
				}
				log.info('frete...'+frete );
				lob_item = rol_item - custo - frete - desc_finac;
				lob_item -= parseFloat( dataset.getValue(0, "comis") );
				lob_item -= parseFloat( dataset.getValue(0, "acordo_comerc") );
					
				lob_item -= parseFloat( dataset.getValue(0, "custo_transferecia") );
				log.info('lob_item...'+lob_item );
					
			 }

			log.info('rol_item2...'+rol_item );
						 
			 // calcula o valor da verba de marketing apartir do cadastro no
			 // cer0023 e calcula o percentual de lob para retornar ao campo
			var SQL2 = " select nvl( eis_f_get_valor_verba('"+ codCliente +"', '01', trunc(sysdate), lpad("+ aenN1 +",2,'0')||lpad("+ aenN2 +",2,'0')||lpad("+ aenN3 +",2,'0')||lpad("+ aenN4 +",2,'0'), "+ valor +", "+ valor +", 'F', "+ rol_item +" ), 0) as verba_rapel, " +
						"		nvl( eis_f_get_valor_verba('"+ codCliente +"', '02', trunc(sysdate), lpad("+ aenN1 +",2,'0')||lpad("+ aenN2 +",2,'0')||lpad("+ aenN3 +",2,'0')||lpad("+ aenN4 +",2,'0'), "+ valor +", "+ valor +", 'F', "+ rol_item +" ), 0) as acordo_comercial, "+
						"		nvl( eis_f_get_valor_verba('"+ codCliente +"', '03', trunc(sysdate), lpad("+ aenN1 +",2,'0')||lpad("+ aenN2 +",2,'0')||lpad("+ aenN3 +",2,'0')||lpad("+ aenN4 +",2,'0'), "+ valor +", "+ valor +", 'F', "+ rol_item +" ), 0) as verba_marketing, "+
						"		nvl( eis_f_get_valor_verba('"+ codCliente +"', '04', trunc(sysdate), lpad("+ aenN1 +",2,'0')||lpad("+ aenN2 +",2,'0')||lpad("+ aenN3 +",2,'0')||lpad("+ aenN4 +",2,'0'), "+ valor +", "+ valor +", 'F', "+ rol_item +" ), 0) as verba_cross_dock," +
						"      	nvl( eis_f_get_val_royaltie('"+ codEmpresa +"', '"+ codItem +"',"+ valor +","+ qtd +"), 0) as royaltie " +
						" from dual ";
			 
			var c1 = DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/LogixPRD', 'java:/jdbc/LogixPRD', ConstraintType.MUST);
			var c2 = DatasetFactory.createConstraint("SQL", SQL2, SQL2, ConstraintType.MUST);
			var constraints = new Array(c1,c2);
			var dataset = DatasetFactory.getDataset('select', null, constraints, null);
			 
			if (dataset != null) {
				//hAPI.setCardValue("verb_mark___" + seqItem, df2.format( parseFloat( dataset.getValue(0, "verb_mark") ) ) );
				item["verb_mark"] = parseFloat( dataset.getValue(0, "verba_marketing") );
				verba_total += parseFloat( dataset.getValue(0, "verba_marketing") );
				log.info('verba_mkt_item...'+hAPI.getCardValue("verb_mark___" + seqItem));
				log.info('verba_mkt_total...'+verba_total );				 
				 
				lob_item -= parseFloat( dataset.getValue(0, "verba_marketing") );
				lob_item -= parseFloat( dataset.getValue(0, "royaltie") );
				 
				var p_lob_item = lob_item / rol_item * 100;
				
				if( pctMargeAEN > 0 ){
					
					valTotRealLobAEN += lob_item;
					valTotPrevlLobAEN += rol_item * pctMargeAEN / 100;
		
				}
				
				//hAPI.setCardValue("perc_lob_item___" + seqItem, df2.format( p_lob_item ) );
				item["perc_lob_item"] = parseFloat( p_lob_item );
				log.info('lob_item...'+p_lob_item );
				
				item["verba_marketing"] = parseFloat( dataset.getValue(0, "verba_marketing") );
				item["acordo_comercial"] = parseFloat( dataset.getValue(0, "acordo_comercial") );
				item["verba_rapel"] = parseFloat( dataset.getValue(0, "verba_rapel") );
				item["verba_cross_dock"] = parseFloat( dataset.getValue(0, "verba_cross_dock") );
				item["royaltie"] = parseFloat( dataset.getValue(0, "royaltie") );
				
			}

			var c1 = DatasetFactory.createConstraint("cod_empresa", codEmpresa, codEmpresa, ConstraintType.MUST);
			var c2 = DatasetFactory.createConstraint("cod_item", codItem, codItem, ConstraintType.MUST);
			var c3 = DatasetFactory.createConstraint("cod_cliente", codCliente, codCliente, ConstraintType.MUST);
			var c4 = DatasetFactory.createConstraint("num_list_preco", '0', '0', ConstraintType.MUST);
			var constraints = new Array(c1,c2,c3,c4);
			var dataset = DatasetFactory.getDataset('ultimo_preco_item_cliente', null, constraints, null);
			 
			if (dataset != null ) {
				var pre_unit = (df2.format( parseFloat( dataset.getValue(0, "PRE_UNIT") ) ));
				var pct_desc_adic = df2.format( parseFloat( dataset.getValue(0, "PCT_DESC_ADIC") ) );
				var ult_preco_unit_liq = df2.format( parseFloat( dataset.getValue(0, "ULT_PRECO_UNIT_LIQ") ) );
				log.info('DATA SET...'+dataset );
				log.info('PRE_UNIT '+pre_unit);
				if (pre_unit != null && dataset.rowsCount>0){
					log.info('ENTROU NO IF DO PRE_UNIT');
					//hAPI.setCardValue("ult_preco___" + seqItem,  pre_unit);
					item["ult_preco"] = parseFloat( pre_unit );
				} else {
					//hAPI.setCardValue("ult_preco___" + seqItem, '0,00' );
					item["ult_preco"] = parseFloat( '0.00' );
				}
				//ultimo preco unit liquido
				if (ult_preco_unit_liq != null && dataset.rowsCount>0){
					log.info('ENTROU NO IF DO ult_preco_unit_liq');
					//hAPI.setCardValue("ult_preco___" + seqItem,  pre_unit);
					item["ult_preco_unit_liq"] = parseFloat( dataset.getValue(0, "ULT_PRECO_UNIT_LIQ") );
					log.info('ENTROU NO IF DO ult_preco_unit_liq2 '+dataset.getValue(0, "ULT_PRECO_UNIT_LIQ") );
				} else {
					//hAPI.setCardValue("ult_preco___" + seqItem, '0,00' );
					item["ult_preco_unit_liq"] = parseFloat( '0.00' );
					log.info('ENTROU NO IF DO ult_preco_unit_liq3');
				}
				
				
				log.info('ULT_DESC '+pct_desc_adic);
				if (pct_desc_adic != null && dataset.rowsCount>0){
					log.info('ENTROU NO IF DO ULT_DESC');
					//hAPI.setCardValue("ult_desc___" + seqItem,  pct_desc_adic);
					item["ult_desc"] = parseFloat( dataset.getValue(0, "PCT_DESC_ADIC") ); 
					hAPI.setCardValue('ult_desc___'+seqItem,pct_desc_adic);
					log.info('ENTROU NO IF DO ULT_DESC2 '+parseFloat( dataset.getValue(0, "PCT_DESC_ADIC") ));
				} else {
					//hAPI.setCardValue("ult_desc___" + seqItem, '0,00' );
					item["ult_desc"] = parseFloat( '0.00' );
				}
			}else{
				//hAPI.setCardValue("ult_preco___" + seqItem, '0,00' );
				//hAPI.setCardValue("ult_desc___" + seqItem, '0,00' );
				item["ult_preco"] = parseFloat( '0.00' );
				item["ult_desc"] = parseFloat( '0.00' );
			}
			item["ies_apv_desc_item_reg"] = "N";
			item["ies_apv_desc_item_nac"] = "N";
			
			if( ies_desc_item == 'on'){
				log.info('ENTROU NO DESCONTO DO ITEM');
				var ult_desc_tela = getValueFormFloat("ult_desc___" + seqItem,"0"); 
				var desconto_tela = getValueFormFloat("desconto___" + seqItem,"0"); 
				
				var pct_desc_adic_tela = getValueFormFloat("pct_desc_adic___" + seqItem,"0"); 
				if ( desconto_tela > ult_desc_tela ){
					log.info('ENTROU NO DESCONTO DO ITEM 2');
					log.info('ENTROU NO DESCONTO DO ITEM 2 DESCONTO: '+desconto_tela);
					log.info('ENTROU NO DESCONTO DO ITEM 2 ULT DESC: '+ult_desc_tela);
					if( desconto_tela > ult_desc_tela ) {
						ies_desc_item_reg = 'S';
						//hAPI.setCardValue("ies_apv_desc_item_reg___" + seqItem, "S" );
						item["ies_apv_desc_item_reg"] = "S";
						//hAPI.setCardValue("ies_apv_desc_item_nac___" + seqItem, "N" );
						item["ies_apv_desc_item_nac"] = "N";
						//hAPI.setCardValue("obs_ger_reg", hAPI.getCardValue("obs_ger_reg")+'\n'+codItem+" - Ult. Desc: "+getValueForm("ult_desc___" + seqItem, "0" )+" Desc. Atual: "+getValueFormFloat("desconto___" + seqItem, "0" )+ "% + "+getValueFormFloat("pct_desc_adicional","0")+"%" );
					}
					if( desconto_tela > pct_desc_adic_tela ) {
						log.info('ENTROU NO DESCONTO DO ITEM 3');
						log.info('ENTROU NO DESCONTO DO ITEM 3 DESCONTO: '+desconto_tela);
						log.info('ENTROU NO DESCONTO DO ITEM 3 PCT DESC ADIC: '+pct_desc_adic_tela);
						ies_desc_item_reg = 'S';
						ies_desc_item_nac = 'S';
						//hAPI.setCardValue("ies_apv_desc_item_reg___" + seqItem, "S" );
						item["ies_apv_desc_item_reg"] = "S";
						//hAPI.setCardValue("ies_apv_desc_item_nac___" + seqItem, "S" );
						item["ies_apv_desc_item_nac"] = "S";
						//hAPI.setCardValue("obs_ger_nac", hAPI.getCardValue("obs_ger_nac")+'\n'+codItem+" - Desc. Lista: "+getValueForm("pct_desc_adic___" + seqItem, "0" )+" Desc. Atual: "+getValueFormFloat("desconto___" + seqItem, "0" )+ "% + "+getValueFormFloat("pct_desc_adicional","0")+"%" );
					}
				}
			}
			log.info('Item '+ item );
			itens[ parseInt( seqItem ) ] = item;
		}
	}
			
	log.info('Antes set valor ');

	custo_total += custo_total * pct_custo_ger/ 100;
	
	log.info('custo_total......... '+custo_total+' '+pct_custo_ger);
	
	hAPI.setCardValue("custo_total", df2.format( custo_total ) );
	hAPI.setCardValue("icms_total", df2.format( icms_total ) );
	hAPI.setCardValue("pis_total", df2.format( pis_total ) );
	hAPI.setCardValue("cofins_total", df2.format( cofins_total ) );
	hAPI.setCardValue("comis_total", df2.format( comis_total ) );
	hAPI.setCardValue("acordo_total", df2.format( acordo_total ) );
	hAPI.setCardValue("verba_total", df2.format( verba_total ) );
	hAPI.setCardValue("custo_trans_total", df2.format( custo_trans_total ) );

	hAPI.setCardValue("val_lob_prev_aen", valTotPrevlLobAEN );
	hAPI.setCardValue("val_lob_real_aen", valTotRealLobAEN );
	
	log.info(" valTotRealLobAEN "+valTotRealLobAEN+" valTotPrevlLobAEN "+valTotPrevlLobAEN);
	if( parseFloat( valTotRealLobAEN ) < parseFloat( valTotPrevlLobAEN ) ){
		log.info(" Entrou para setar S ");
		hAPI.setCardValue("ies_pct_lob_aen", "S" );	
	}else{
		log.info(" Entrou para setar N ");
		hAPI.setCardValue("ies_pct_lob_aen", "N" );
	}
	
	hAPI.setCardValue("st_total", df2.format( st_total ) );
	hAPI.setCardValue("ipi_total", df2.format( ipi_total ) );	
	
	log.info('Depois set valor ');
	
	var valor_total = getValueFormFloat( "valor_total_geral", "0" ) * cotacao;
	log.info( 'valor_total.........'+valor_total );
	
	hAPI.setCardValue("valor_total_com_imp", df2.format( valor_total + ipi_total + st_total ) );	
	hAPI.setCardValue("valor_total_real", df2.format( valor_total ) );	
	
	
	log.info( 'variaveis ROL.........'+valor_total+' '+icms_total+' '+pis_total+' '+cofins_total );
	
	//recuperar o percentual adicional do tipo de venda
	var perc_adic_tipo_venda = 0 ;
	
	var constraintsPai =  new Array();
	constraintsPai.push( DatasetFactory.createConstraint("ies_matriz", "on", "on", ConstraintType.MUST)) ;
	//alert('DatasetFactory empresa_compl ');
	var datasetPai = DatasetFactory.getDataset('empresa_compl', null, constraintsPai, null);
	
	//alert('antes if null empresa_compl ');
	if ( datasetPai != null /*&& datasetPai.values.length > 0*/  ){
		
		log.info('DatasetPAI TIPO VENDA '+datasetPai.values[0]);
		log.info('DatasetPAI TIPO VENDA '+datasetPai.values[1]);
		var pai = datasetPai.values[0];
		var documentid = datasetPai.getValue(0, "DOCUMENTID");
		var version = datasetPai.getValue(0, "VERSION");
		
		var constraintsFilhos = new Array();
		//alert(' constraintsFilhos 0;..... ');
		constraintsFilhos.push( DatasetFactory.createConstraint("tablename", "tipo_venda_adic", "tipo_venda_adic", ConstraintType.MUST) );
		//alert(' constraintsFilhos 1;..... ');
		constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", documentid, documentid, ConstraintType.MUST) );
		//alert(' constraintsFilhos 2;..... ');
		constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", version, version, ConstraintType.MUST) );
		//alert(' constraintsFilhos 3;..... ');
		constraintsFilhos.push( DatasetFactory.createConstraint("cod_tipo_venda_adic", getValueForm("tipo_venda",""), getValueForm("tipo_venda",""), ConstraintType.MUST) );
		//alert(' constraintsFilhos 4;..... ');
		//alert('antes DatasetFactory');
		
		var datasetFilhos = DatasetFactory.getDataset('empresa_compl', null, constraintsFilhos, null);
		
		log.info('antes do IF');
		if( datasetFilhos != null && datasetFilhos.values.length > 0 ){
			log.info('depois do IF');
			var filho = datasetFilhos.values[0];
			log.info('depois do filho');
			if ( datasetFilhos.getValue(0, "PERC_TIPO_VENDA_ADIC") != null && datasetFilhos.getValue(0, "PERC_TIPO_VENDA_ADIC") != "" ){
				log.info('seta valor.');
				perc_adic_tipo_venda = datasetFilhos.getValue(0, "PERC_TIPO_VENDA_ADIC");
			} else {
				log.info('entrou no perc adic tipo de venda 0');
				perc_adic_tipo_venda = 0;
			}
		}
	}
	
	log.info('perc adic tipo de venda..... '+perc_adic_tipo_venda);
	
	perc_adic_tipo_venda = parseFloat(perc_adic_tipo_venda);
	//fim recuperar o percentual adicional do tipo de venda
	
	var valor_adic_tipo_venda = ( valor_total + st_total + ipi_total ) * perc_adic_tipo_venda / 100;
	
	var rol = valor_total - icms_total - pis_total - cofins_total;
	
	var desc_finac =  ( valor_total + st_total + ipi_total ) * p_desc_finac / 100;
	
	log.info( 'variaveis LOB.........'+custo_total+' '+comis_total+' '+acordo_total+' '+verba_total+' '+custo_trans_total+' '+frete_total+' '+desc_finac+' '+valor_adic_tipo_venda );
	
	lob = rol - custo_total - comis_total - acordo_total - verba_total - custo_trans_total - frete_total - desc_finac - valor_adic_tipo_venda;
	
	p_lob = lob / rol * 100;

	hAPI.setCardValue("perc_lob", df2.format( p_lob )+' %' );

	//try
	{
		var peso3 = 0;
		var pesomix3 = 0;
		var rol3 = 0;
		var cpv3 = 0;
		var dvv3 = 0;
		
		log.info(' acumulado ');
		var SQL = " select SUM((EIS_V_COMERCIAL.VAL_LIQ_ITEM - "+
				"	            EIS_V_COMERCIAL.VLR_DEVOLUCAO_DEV) - "+
				"	           (EIS_V_COMERCIAL.VRL_ICMS - "+
				"	            EIS_V_COMERCIAL.VLR_ICMS_DEVOLUCAO_DEV + "+
				"	            EIS_V_COMERCIAL.vrl_icms_uf_dest + "+
				"	            EIS_V_COMERCIAL.vrl_icms_uf_remet) - "+
				"	           (EIS_V_COMERCIAL.VRL_PIS -  "+
				"	            EIS_V_COMERCIAL.VLR_PIS_DEVOLUCAO_DEV) - "+
				"	           (EIS_V_COMERCIAL.VRL_COFINS - "+
				"	            EIS_V_COMERCIAL.VLR_COFINS_DEVOLUCAO_DEV)) rol, "+
				"	       SUM(EIS_V_COMERCIAL.custo_embalagem + "+
				"	           EIS_V_COMERCIAL.custo_materia_prima + "+
				"	           EIS_V_COMERCIAL.custo_servico_ext + "+
				"	           EIS_V_COMERCIAL.custo_aditivo +  "+
				"	           EIS_V_COMERCIAL.custo_agregado + "+
				"	           EIS_V_COMERCIAL.custo_cimento) cpv, "+
				"	       SUM(EIS_V_COMERCIAL.VALOR_COMIS + "+
				"	           eis_v_comercial.val_verb_acordo_prev + "+
				"	           eis_v_comercial.val_verb_rapel_prev + "+
				"	           eis_v_comercial.val_verb_mark_prev +  "+
				"	           EIS_V_COMERCIAL.custo_frete + "+
				"	           EIS_V_COMERCIAL.frete_tabela) dvv, "+           
				"	       SUM(EIS_V_COMERCIAL.QTD_MIX -  "+
				"	           EIS_V_COMERCIAL.qtd_mix_dev) pesomix, "+
				"	       SUM(EIS_V_COMERCIAL.PESO_FATU -  "+
				"	           EIS_V_COMERCIAL.PESO_DECLARAD_NF_DEV) peso "+
				"	  FROM EIS_V_COMERCIAL@BI EIS_V_COMERCIAL "+
				"	 where EIS_V_COMERCIAL.ORIGEM IN ('NF', 'NS', 'DEV') "+ 
				"	   and EIS_V_COMERCIAL.COD_MOVTO_ESTOQ IN ('VEND', 'REVE') "+ 
				"	   and EIS_V_COMERCIAL.DAT_REFER >= trunc( sysdate ) - 90 "+
				"	   and EIS_V_COMERCIAL.DAT_REFER <= trunc( sysdate ) "+
				"	   and EIS_V_COMERCIAL.cliente = '"+ codCliente +"' ";
			
		 var c1 = DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/LogixPRD', 'java:/jdbc/LogixPRD', ConstraintType.MUST);
		 var c2 = DatasetFactory.createConstraint("SQL", SQL, SQL, ConstraintType.MUST);
		 var constraints = new Array(c1,c2);
		 var dataset = DatasetFactory.getDataset('select', null, constraints, null);
		 
		 if (dataset != null) {
			 
			log.info( " Retornei data set acumulado..... ");
			 
			peso3 = parseFloat( dataset.getValue(0, "peso") );
			pesomix3 = parseFloat( dataset.getValue(0, "pesomix") );
			rol3 = parseFloat( dataset.getValue(0, "rol") );
			cpv3 = parseFloat( dataset.getValue(0, "cpv") );
			dvv3 = parseFloat( dataset.getValue(0, "dvv") );
			 
			cpv3 += cpv3 * pct_custo_ger / 100;
			
			log.info( " Variaveis "+ pesomix3 + peso3 + rol3 + cpv3 + dvv3);
			
			log.info( " ROL_PLOB "+ rol3);
			log.info( " CPV_PLOB "+ cpv3);
			log.info( " DVV_PLOB "+ dvv3);
			lob3 = rol3 - cpv3 - dvv3; 
			log.info( " LOB_PLOB "+ lob3);
			p_lob3 = lob3 / rol3 * 100;
			
			log.info( " LOB "+ p_lob3);
			
			var p_mix3 = pesomix3 / peso3 * 100; 
			 
			log.info( " LOB "+ p_mix3);
			if (p_lob3 != 0 && p_lob3 != null && !isNaN(p_lob3)){
				hAPI.setCardValue("perc_lob3", df2.format( p_lob3 )+' %' );
			} else {
				hAPI.setCardValue("perc_lob3", '0'+' %' );
			}
			if (p_mix3 != 0 && p_mix3 != null && !isNaN(p_mix3) ){
				hAPI.setCardValue("mix_geral3", df2.format( p_mix3 )+' %' );
			} else {
				hAPI.setCardValue("mix_geral3", '0'+' %' );
			}
		 }
	}
	/*catch (e){
		//return true;
		hAPI.setTaskComments(userId, numProcesso, 0, "Atencao: Verifique o cadastro do representante no Logix, possivelmente esta bloqueado ou nao existente!");
		throw "Atencao: Verifique o cadastro do representante no Logix, possivelmente esta bloqueado ou nao existente!";
	}*/
	
	try{
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixPRD");
		var connectionWD = dataSourceWD.getConnection();
		
		connectionWD.setAutoCommit(false);
		
		var sqldelete = " delete fluig_proc_item where num_processo = ? "; 
		var statementWD = connectionWD.prepareStatement( sqldelete );
		statementWD.setInt(1, getValue("WKNumProces") );
		statementWD.executeUpdate();
		
		var sql = " insert into fluig_proc_item( "+ 
	    			" 	num_processo, seq_item, cod_item, quantidade, valor_total, custo, "+ 
	    			" 	icms, pis, cofins, comis, st, ipi, acordo_comerc, custo_trans, "+
	    			" 	verb_mark, perc_lob_item, ult_preco, ult_desc, "+
	    			" 	ies_apv_desc_item_reg, ies_apv_desc_item_nac, ult_preco_unit_liq," +
	    			"	custo_aditivo, custo_agregado, custo_cimento, custo_embalagem, custo_materia_prima, " +
	    			"	custo_material_secundario, custo_material_revenda, custo_servico_terceiro, custo_embalagem_logistica, custo_transferecia, " +
	    			"	verba_marketing, acordo_comercial, verba_rapel, verba_cross_dock, royaltie, perc_prev_lob_aen ) "+
	    			" values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?," +
	    			"		?, ?, ?, ?, ?,     ?, ?, ?, ?, ?,     ?, ?, ?, ?, ?,  ? ) ";
	
		var statementWD = connectionWD.prepareStatement( sql );
		
		for( var p = 0; p < itens.length; p++ ){
			log.info('P.................... '+ p );
			if( itens[p] != undefined ){
				log.info('num_processo......... '+ itens[p].num_processo );
				statementWD.setInt(1, itens[p].num_processo );
				
				log.info('seq_item............. '+ itens[p].seq_item );
				statementWD.setInt(2, itens[p].seq_item );
				
				log.info('cod_item............. '+ itens[p].cod_item );
				statementWD.setString(3, itens[p].cod_item );
				
				log.info('quantidade........... '+ itens[p].quantidade );
				statementWD.setFloat(4, itens[p].quantidade );
				
				log.info('valor_total.......... '+ itens[p].valor_total );
				statementWD.setFloat(5, itens[p].valor_total );
				
				log.info('custo................ '+ itens[p].custo );
				hAPI.setCardValue("custo___" + itens[p].seq_item, df2.format( itens[p].custo ) );
				statementWD.setFloat(6, itens[p].custo );
				
				log.info('icms................. '+ itens[p].icms );
				hAPI.setCardValue("icms___" + itens[p].seq_item, df2.format( itens[p].icms ) );
				statementWD.setFloat(7, itens[p].icms );
				
				log.info('pis.................. '+ itens[p].pis );
				hAPI.setCardValue("pis___" + itens[p].seq_item, df2.format( itens[p].pis ) );
				statementWD.setFloat(8, itens[p].pis );
				
				log.info('cofins............... '+ itens[p].cofins );
				hAPI.setCardValue("cofins___" + itens[p].seq_item, df2.format( itens[p].cofins ) );
				statementWD.setFloat(9, itens[p].cofins );
				
				log.info('comis................ '+ itens[p].comis );
				hAPI.setCardValue("comis___" + itens[p].seq_item, df2.format( itens[p].comis ) );
				statementWD.setFloat(10, itens[p].comis );
				
				log.info('st................... '+ itens[p].st );
				hAPI.setCardValue("st___" + itens[p].seq_item, df2.format( itens[p].st ) );
				statementWD.setFloat(11, itens[p].st );
				
				log.info('ipi.................. '+ itens[p].ipi );
				hAPI.setCardValue("ipi___" + itens[p].seq_item, df2.format( itens[p].ipi ) );
				statementWD.setFloat(12, itens[p].ipi );
				
				log.info('acordo_comerc........ '+ itens[p].acordo_comerc );
				hAPI.setCardValue("acordo_comerc___" + itens[p].seq_item, df2.format( itens[p].acordo_comerc ) );
				statementWD.setFloat(13, itens[p].acordo_comerc );
				
				log.info('custo_trans.......... '+ itens[p].custo_trans );
				hAPI.setCardValue("custo_trans___" + itens[p].seq_item, df2.format( itens[p].custo_trans ) );
				statementWD.setFloat(14, itens[p].custo_trans );
				
			    log.info('verb_mark............ '+ itens[p].verb_mark );
			    hAPI.setCardValue("verb_mark___" + itens[p].seq_item, df2.format( itens[p].verb_mark ) );
			    statementWD.setFloat(15, itens[p].verb_mark );
			    
			    log.info('perc_lob_item........ '+ itens[p].perc_lob_item );
			    hAPI.setCardValue("perc_lob_item___" + itens[p].seq_item, df2.format( itens[p].perc_lob_item ) );
			    statementWD.setFloat(16, itens[p].perc_lob_item );
			    
			    log.info('ult_preco............ '+ itens[p].ult_preco );
			    hAPI.setCardValue("ult_preco___" + itens[p].seq_item, df2.format( itens[p].ult_preco ) );
			    statementWD.setFloat(17, itens[p].ult_preco );
			    
			    log.info('ult_desc............. '+ itens[p].ult_desc );
			    hAPI.setCardValue("ult_desc___" + itens[p].seq_item, df2.format( itens[p].ult_desc ) );
			    statementWD.setFloat(18, itens[p].ult_desc );
			    
			    log.info('ies_apv_desc_item_reg '+ itens[p].ies_apv_desc_item_reg );
			    hAPI.setCardValue("ies_apv_desc_item_reg___" + itens[p].seq_item, itens[p].ies_apv_desc_item_reg );
			    statementWD.setString(19, itens[p].ies_apv_desc_item_reg );
			    
			    log.info('ies_apv_desc_item_nac '+ itens[p].ies_apv_desc_item_nac );
			    hAPI.setCardValue("ies_apv_desc_item_nac___" + itens[p].seq_item, itens[p].ies_apv_desc_item_nac );
			    statementWD.setString(20, itens[p].ies_apv_desc_item_nac );
			    
			    log.info('ult_preco_unit_liq '+ itens[p].ult_preco_unit_liq );
			    hAPI.setCardValue("ult_preco_unit_liq___" + itens[p].seq_item, itens[p].ult_preco_unit_liq );
			    statementWD.setFloat(21, itens[p].ult_preco_unit_liq );
			    
			    log.info('custo_aditivo '+ itens[p].custo_aditivo );
			    hAPI.setCardValue("custo_aditivo___" + itens[p].seq_item, itens[p].custo_aditivo );
			    statementWD.setFloat(22, itens[p].custo_aditivo );
			    
			    log.info('custo_agregado '+ itens[p].custo_agregado );
			    hAPI.setCardValue("custo_agregado___" + itens[p].seq_item, itens[p].custo_agregado );
			    statementWD.setFloat(23, itens[p].custo_agregado );
			    
			    log.info('custo_cimento '+ itens[p].custo_cimento );
			    hAPI.setCardValue("custo_cimento___" + itens[p].seq_item, itens[p].custo_cimento );
			    statementWD.setFloat(24, itens[p].custo_cimento );
			    
			    log.info('custo_embalagem '+ itens[p].custo_embalagem );
			    hAPI.setCardValue("custo_embalagem___" + itens[p].seq_item, itens[p].custo_embalagem );
			    statementWD.setFloat(25, itens[p].custo_embalagem );
			    
			    log.info('custo_materia_prima '+ itens[p].custo_materia_prima );
			    hAPI.setCardValue("custo_materia_prima___" + itens[p].seq_item, itens[p].custo_materia_prima );
			    statementWD.setFloat(26, itens[p].custo_materia_prima );
			    
			    log.info('custo_material_secundario '+ itens[p].custo_material_secundario );
			    hAPI.setCardValue("custo_material_secundario___" + itens[p].seq_item, itens[p].custo_material_secundario );
			    statementWD.setFloat(27, itens[p].custo_material_secundario );
			    
			    log.info('custo_material_revenda '+ itens[p].custo_material_revenda );
			    hAPI.setCardValue("custo_material_revenda___" + itens[p].seq_item, itens[p].custo_material_revenda );
			    statementWD.setFloat(28, itens[p].custo_material_revenda );
			    
			    log.info('custo_servico_terceiro '+ itens[p].custo_servico_terceiro );
			    hAPI.setCardValue("custo_servico_terceiro___" + itens[p].seq_item, itens[p].custo_servico_terceiro );
			    statementWD.setFloat(29, itens[p].custo_servico_terceiro );
			    
			    log.info('custo_embalagem_logistica '+ itens[p].custo_embalagem_logistica );
			    hAPI.setCardValue("custo_embalagem_logistica___" + itens[p].seq_item, itens[p].custo_embalagem_logistica );
			    statementWD.setFloat(30, itens[p].custo_embalagem_logistica );
			    
			    log.info('custo_transferecia '+ itens[p].custo_transferecia );
			    hAPI.setCardValue("custo_transferecia___" + itens[p].seq_item, itens[p].custo_transferecia );
			    statementWD.setFloat(31, itens[p].custo_transferecia );
			    
			    log.info('verba_marketing '+ itens[p].verba_marketing );
			    hAPI.setCardValue("verba_marketing___" + itens[p].seq_item, itens[p].verba_marketing );
			    statementWD.setFloat(32, itens[p].verba_marketing );
			    
			    log.info('acordo_comercial '+ itens[p].acordo_comercial );
			    hAPI.setCardValue("acordo_comercial___" + itens[p].seq_item, itens[p].acordo_comercial );
			    statementWD.setFloat(33, itens[p].acordo_comercial );
			    
			    log.info('verba_rapel '+ itens[p].verba_rapel );
			    hAPI.setCardValue("verba_rapel___" + itens[p].seq_item, itens[p].verba_rapel );
			    statementWD.setFloat(34, itens[p].verba_rapel );
			    
			    log.info('verba_cross_dock '+ itens[p].verba_cross_dock );
			    hAPI.setCardValue("verba_cross_dock___" + itens[p].seq_item, itens[p].verba_cross_dock );
			    statementWD.setFloat(35, itens[p].verba_cross_dock );
			    
			    log.info('royaltie '+ itens[p].royaltie );
			    hAPI.setCardValue("royaltie___" + itens[p].seq_item, itens[p].royaltie );
			    statementWD.setFloat(36, itens[p].royaltie );
			    
			    log.info('perc_prev_lob_aen '+ itens[p].perc_prev_lob_aen );
			    hAPI.setCardValue("perc_prev_lob_aen___" + itens[p].seq_item, itens[p].perc_prev_lob_aen );
			    statementWD.setFloat(37, itens[p].perc_prev_lob_aen );
			    
			    statementWD.executeUpdate();
			}
		}
		connectionWD.commit();
	}catch (e){
		log.info( "ERROOOOOO"+ e.toString() );
		throw( "ERRO:"+ e.toString() );
	}finally {
		//rsWD.close();
		if(statementWD != null) statementWD.close();
		if(connectionWD != null) connectionWD.close();
	}	
	
	if( ies_mix == 'on' ){
		if ( getValueFormFloat( "mix_geral", "0")
		   <= getValueFormFloat("perc_mix_ger_reg", "0") ){
			ies_mix_geral_reg = 'S';
		} 
		if ( getValueFormFloat("mix_geral", "0")
		   <= getValueFormFloat("perc_mix_ger_nac", "0") ){
			ies_mix_geral_nac = 'S';
		} 	
	}
	
	if( ies_desc_ped == 'on' ){
		if ( getValueFormFloat("desc_medio", "0")
		    > ( getValueFormFloat("desc_maximo", "0")
		      + getValueFormFloat("perc_desc_ger_reg", "0") ) ){
			ies_desc_medio_reg = 'S';
		}
		if ( getValueFormFloat("desc_medio", "0")
			    > ( getValueFormFloat("desc_maximo", "0")
			      + getValueFormFloat("perc_desc_ger_nac", "0") ) ){
			ies_desc_medio_nac = 'S';
		} 
	}
	
	if( ies_lob == 'on'){
		
		if (prim_pedido != 'S') {
			if( p_lob < p_lob3 || p_lob3 == 0 || isNaN(p_lob3) || p_lob < 0){
				ies_pct_lob_reg = 'S';
				hAPI.setCardValue("obs_ger_reg", hAPI.getCardValue("obs_ger_reg")+"\n Lob: "+getValueForm("perc_lob" , "0" )+" < Lob Médio: "+getValueFormFloat("perc_lob3", "0" )+" ou LOB está negativo!" );
			}  
			
			var p_reduz = (1-p_lob/p_lob3)*100;
			
			if( ( p_reduz > getValueFormFloat( "perc_lob_ger_nac", "0") || p_lob3 == 0 || isNaN(p_lob3))
				&& getValueFormFloat( "perc_lob_ger_nac", "0") > 0 ){
				ies_pct_lob_nac = 'S';
				hAPI.setCardValue("obs_ger_nac", hAPI.getCardValue("obs_ger_nac")+"\n Lob: "+getValueForm("perc_lob" , "0" )+" < Lob Médio: "+getValueFormFloat("perc_lob3", "0" ) );
			} 
	
			if( ( p_reduz > getValueFormFloat( "perc_lob_ctr", "0" ) || p_lob3 == 0 || isNaN(p_lob3))
				&& getValueFormFloat( "perc_lob_ctr", "0") > 0 ){
				ies_pct_lob_ctr = 'S';
				hAPI.setCardValue("obs_ctr", hAPI.getCardValue("obs_ctr")+"\n Lob: "+getValueForm("perc_lob" , "0" )+" < Lob Médio: "+getValueFormFloat("perc_lob3", "0" ) );			
			} 		
		} else {
			if (perc_minimo_lob>p_lob){
				ies_pct_lob_reg = 'N';
				ies_pct_lob_nac = 'N';
				ies_pct_lob_ctr = 'N';
			} else {
				if( p_lob < p_lob3 || p_lob3 == 0 || isNaN(p_lob3)){
					ies_pct_lob_reg = 'S';
					hAPI.setCardValue("obs_ger_reg", hAPI.getCardValue("obs_ger_reg")+"\n Lob: "+getValueForm("perc_lob" , "0" )+" < Lob Médio: "+getValueFormFloat("perc_lob3", "0" ) );
				}  
				
				var p_reduz = (1-p_lob/p_lob3)*100;
				
				if( ( p_reduz > getValueFormFloat( "perc_lob_ger_nac", "0") || p_lob3 == 0 || isNaN(p_lob3))
					&& getValueFormFloat( "perc_lob_ger_nac", "0") > 0 ){
					ies_pct_lob_nac = 'S';
					hAPI.setCardValue("obs_ger_nac", hAPI.getCardValue("obs_ger_nac")+"\n Lob: "+getValueForm("perc_lob" , "0" )+" < Lob Médio: "+getValueFormFloat("perc_lob3", "0" ) );
				} 
		
				if( ( p_reduz > getValueFormFloat( "perc_lob_ctr", "0" ) || p_lob3 == 0 || isNaN(p_lob3))
					&& getValueFormFloat( "perc_lob_ctr", "0") > 0 ){
					ies_pct_lob_ctr = 'S';
					hAPI.setCardValue("obs_ctr", hAPI.getCardValue("obs_ctr")+"\n Lob: "+getValueForm("perc_lob" , "0" )+" < Lob Médio: "+getValueFormFloat("perc_lob3", "0" ) );			
				}
			}
		} 	
	}
	
	//inicio da consistencia se a lista foi alterada
	if (ies_aprov_list == 'on' ){
		
		var listaEsp = '';
		var temListaEsp = '';
		var listaPedido = '';
		var codListaPedido = '';
		log.info('Antes Pai Filho....' );
		listaPedido = hAPI.getCardValue('empresa_hd')+hAPI.getCardValue('lista_preco_hd');
		codListaPedido = hAPI.getCardValue('lista_preco_hd');
		log.info('Lista de Preco '+listaPedido);
		
		var cons = new Array();
		
		cons.push( DatasetFactory.createConstraint( 'dataSet', 'empresa_compl', 'empresa_compl', ConstraintType.MUST) );
		cons.push( DatasetFactory.createConstraint( 'table', 'lista_esp', 'lista_esp', ConstraintType.MUST) );
		var datasetP = DatasetFactory.getDataset( 'paiFilho', null, cons, null);
		
		log.info('Data set ListaPrecoEsp....'+datasetP );
		if ( datasetP != null ){
			for (var x = 0; x < datasetP.values.length; x++) {
				log.info('lista....'+ datasetP.getValue(x,"chave_lista_esp") );
				if ( x > 0 ){
					listaEsp = datasetP.getValue(x,"chave_lista_esp");
					log.info('Lista ESPECIAL '+ listaEsp);
					if (listaEsp == listaPedido){
						temListaEsp = 'S';
						log.info('Entrou na lista especial');
						break;
					}
				}
			}
		}
		var constraints = new Array();
		var codUltLista = '';
		constraints.push( DatasetFactory.createConstraint("cod_cliente", codCliente, codCliente, ConstraintType.MUST) );
		var dataset2 = DatasetFactory.getDataset('clientes_ult_ped', null, constraints, null);
		
		if ( dataset2 != null ){
			codUltLista = dataset2.getValue(0,"num_list_preco");
			log.info('Ultima Lista de Preco Utilizada '+codUltLista);
			if (temListaEsp != 'S'){
				if (codUltLista != codListaPedido) {
					ies_alt_list_reg = 'S';
					hAPI.setCardValue("obs_ger_reg", hAPI.getCardValue("obs_ger_reg")+"\n A lista de preço foi alterada!" );
				}
			}
		}	
	}
	//fim da consistencia se a lista foi alterada

	hAPI.setCardValue("ies_mix_geral_reg", ies_mix_geral_reg );
	hAPI.setCardValue("ies_mix_geral_nac", ies_mix_geral_nac );
	hAPI.setCardValue("ies_desc_medio_reg", ies_desc_medio_reg );
	hAPI.setCardValue("ies_desc_medio_nac", ies_desc_medio_nac );
	
	hAPI.setCardValue("ies_desc_item_reg", ies_desc_item_reg );
	hAPI.setCardValue("ies_desc_item_nac", ies_desc_item_nac );
	hAPI.setCardValue("ies_pct_lob_reg", ies_pct_lob_reg );
	hAPI.setCardValue("ies_pct_lob_nac", ies_pct_lob_nac );
	hAPI.setCardValue("ies_pct_lob_ctr", ies_pct_lob_ctr );
	
	hAPI.setCardValue("ies_alt_list_reg", ies_alt_list_reg);
	
	// regra para clientes exceção, valida somente se tem desconto dentro do
	// pedido. Pq não deve ter,
	// estes clientes já tem lista previamente negociada
	var cli_exc_mix = getValueForm("cli_exc_mix" , "" );
	log.info('cliente_excecao '+cli_exc_mix);
	if (cli_exc_mix.trim() == 'S'){
		log.info('entrou if cliente excecao');
		hAPI.setCardValue("ies_mix_geral_reg", "N" );
		hAPI.setCardValue("ies_pct_lob_reg", "N" );
		hAPI.setCardValue("ies_mix_geral_nac", "N" );
		hAPI.setCardValue("ies_pct_lob_nac", "N" );
		hAPI.setCardValue("ies_pct_lob_ctr", "N");
	}
	
}

function getValueForm( campo, padrao ){
	//log.info( "Campo........"+campo );
	var valor = hAPI.getCardValue( campo );
	if( padrao == "tipoPessoa" ) 
		if ( valor.indexOf("/0000-") == -1 )
			valor = "F";
		else
			valor = "J";
	log.info( "Valor........"+valor );
	if ( valor == "" || valor == undefined || valor == "null" ){
		valor = padrao;
		//log.info( "Valor padrao........"+valor );
	}
	return valor;
}

function isNull( valor, padrao ){
	if ( isNaN( valor ) ){
		return padrao;
	}else{
		return valor;
	}
}

function kbtReplaceAll( valor, needle, replacement) {
	log.info( 'Valor kbtReplaceAll 1.........'+ valor+' '+needle+' '+replacement );
	log.info( 'Valor kbtReplaceAll 2.........'+ valor.split(needle).length );
	log.info( 'Valor kbtReplaceAll 3.........'+ valor.split(needle).join(replacement) );
    return valor.split(needle).join(replacement);
};


/*function getValueFormFloat( campo, padrao ){
	log.info('getValueFormFloat.........'+campo+' '+padrao);
	var vnPadrao = padrao+"";
	var vnValor = getValueForm(campo, vnPadrao)+"";
	log.info('getValueFormFloat vnValor.........'+vnValor+' '+vnPadrao);
	var valor = parseFloat( vnValor.replaceAll(".", "").replaceAll(",",".") );
	return isNull( valor, parseFloat( vnPadrao.replaceAll(".","").replaceAll(",",".") ) );
}*/


function getValueFormFloat( campo, padrao ){
	log.info('getValueFormFloat.........'+campo+' '+padrao);
	var vnPadrao = padrao+"";
	var vnValor = getValueForm(campo, vnPadrao)+"";
	log.info('getValueFormFloat vnValor.........'+vnValor+' '+vnPadrao);
	var valor = parseFloat( kbtReplaceAll( kbtReplaceAll( vnValor, ".", ""), ",",".") );
	return isNull( valor, parseFloat( kbtReplaceAll( kbtReplaceAll( vnPadrao, ".", "" ), "," ,".") ) );
}

function leftPad(value, length) { 
	log.info('######## value ########### '+value )
    //return ("0".repeat(length) + value + "").slice(-length); 
	return org.apache.commons.lang.StringUtils.leftPad( value+"", length, "0");
}

function loadRepres( cod_repres ){
	var numProcesso = getValue('WKNumProces');
	var userId = getValue("WKUser");
	try{
		log.info("## Repres ## "+cod_repres );
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint("cod_repres", cod_repres, cod_repres, ConstraintType.MUST) );
		var dsRep = DatasetFactory.getDataset("representante", null, constraints, null);
		var codRegional = "";
		if ( dsRep != null  ){
			codRegional = dsRep.getValue(0, "cv_4");
			log.info('codRegional......'+codRegional);
		}
		log.info("## Regional ## "+codRegional );
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint("tablename", "regional", "regional", ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint("cod_regional", codRegional, codRegional, ConstraintType.MUST) );
		var dsRepCpl = DatasetFactory.getDataset("representante_compl", null, constraints, null);
		
		if ( dsRepCpl != null && dsRepCpl.rowsCount>0){
			log.info("## parametros ## "+ dsRepCpl.getValue(0, "perc_mix_ger_reg") );
			hAPI.setCardValue("perc_mix_ger_reg", dsRepCpl.getValue(0, "perc_mix_ger_reg") );
			hAPI.setCardValue("perc_mix_ger_nac", dsRepCpl.getValue(0, "perc_mix_ger_nac") );
			hAPI.setCardValue("perc_desc_ger_reg", dsRepCpl.getValue(0, "perc_desc_ger_reg") );
			hAPI.setCardValue("perc_desc_ger_nac", dsRepCpl.getValue(0, "perc_desc_ger_nac") );
		
			hAPI.setCardValue("perc_lob_ger_nac", dsRepCpl.getValue(0, "lob_ger_nac") );
			hAPI.setCardValue("perc_lob_ctr", dsRepCpl.getValue(0, "lob_controller") );			
		}
		
	} catch (e){
		hAPI.setTaskComments(userId, numProcesso, 0, "Atencao: Verifique o cadastro do representante no Logix, possivelmente esta bloqueado ou nao existente!");
		throw "Atencao: Verifique o cadastro do representante no Logix, possivelmente esta bloqueado ou nao existente!";
	}
	return true;
}

function loadListaLobAEN( cod_repres ){
	
	var numProcesso = getValue('WKNumProces');
	var userId = getValue("WKUser");
	
	try{
		
		log.info("## Repres ## "+cod_repres );
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint("cod_repres", cod_repres, cod_repres, ConstraintType.MUST) );
		var dsRep = DatasetFactory.getDataset("representante", null, constraints, null);
		var codRegional = "";
		if ( dsRep != null  ){
			codRegional = dsRep.getValue(0, "cv_4");
			log.info('codRegional......'+codRegional);
		}
		
		log.info("## Regional ## "+codRegional );
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint("tablename", "regional", "regional", ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint("cod_regional", codRegional, codRegional, ConstraintType.MUST) );
		var dsRepCpl = DatasetFactory.getDataset("representante_compl", null, constraints, null);
		
		
		if ( dsRepCpl != null && dsRepCpl.rowsCount>0){

			if( dsRepCpl.getValue(0, "cod_supervisor") != ""
			 && dsRepCpl.getValue(0, "cod_supervisor") != undefined ){
				
				hAPI.setCardValue("ies_supervisor", "S");
			
				var idPai = dsRepCpl.getValue(0, "metadata#id"); 
				var versionPai = dsRepCpl.getValue(0, "metadata#version");
					
				var constraints = new Array();
				constraints.push( DatasetFactory.createConstraint("documentid", idPai, idPai, ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint("version", versionPai, versionPai, ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint("tablename", "aen_margem", "aen_margem", ConstraintType.MUST) );
			    var dataset = DatasetFactory.getDataset("representante_compl", null, constraints, null);
			    //var login = "";
			    var matricula = "";
			    if ( dataset != null && dataset.rowsCount > 0 ){
			    	for( var i = 0; i < dataset.rowsCount; i ++ ){
			    		log.info( "#########  dataset.getValue(i, 'cod_aen_margem') ############ "+ dataset.getValue(i, "cod_aen_margem") );
			    		log.info( "#########  dataset.getValue(i, 'lob_aen_margem') ############ "+ dataset.getValue(i, "lob_aen_margem") );
			    		lst_aen_margem[ dataset.getValue(i, "cod_aen_margem") ] = parseFloat( kbtReplaceAll( kbtReplaceAll( dataset.getValue(i, "lob_aen_margem")+"", ".", ""), ",",".") );
			    	}
			    }    			
			}
		}
		log.info( "######### lst_aen_margem ############ "+ lst_aen_margem );
		
	} catch (e){
		hAPI.setTaskComments(userId, numProcesso, 0, "Atencao: Não foi possivel recuperar os dados de Margem por AEN!");
	}
	return true;
}