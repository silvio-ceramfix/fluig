function servicetask88(attempt, message) {
	
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
	
	
	var camposItem = hAPI.getCardData(getValue("WKNumProces"));
	var contadorItem = camposItem.keySet().iterator();
	log.info('Antes While. ' + camposItem);
	log.info('Antes While..... ' + contadorItem.hasNext());	 
	
	var i = 0;
	
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
			
			var codItem = getValueForm("cod_item___" + seqItem, "") + "";
			if( ies_desc_item == 'on'){
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
				
					
					if ( getValueFormFloat( "desconto___" + seqItem, "0" )
					   > pct_desc_adic ){
						ies_desc_item_reg = 'S';
						ies_desc_item_nac = 'S';
					}
				}else{
					ies_desc_item_reg = 'S';
					ies_desc_item_nac = 'S';
				}
			}
			log.info('Item '+ item );
		}
	}
			
	
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
		
		var p_lob = getValueFormFloat("perc_lob_geral_total", "0");
		
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