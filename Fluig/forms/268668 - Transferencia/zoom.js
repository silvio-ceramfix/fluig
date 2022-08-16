
function zoom( componente ){

	console.log('Entrei Zoom',componente);
	
	if ( componente == 'btEmpresa' ){
		modalzoom.open("Empresa",
				   "empresa_compl", 
				   "cod_empresa,C&oacutedigo,den_empresa,Empresa", 
				   "", 
				   "",
				   componente, false, 'default', null, null,
				    "descricao" );
	}
	
	if ( componente == 'btEmpresaDest' ){
		modalzoom.open("Empresa",
				   "empresa", 
				   "COD_EMPRESA,C&oacutedigo,DEN_REDUZ,Empresa", 
				   "", 
				   "",
				   componente, false, 'default', null, null,
				    "descricao" );
	}
	
	
	if (componente == 'btDem'){

		var filtro = "";
		if( $('#cod_familia').val() != "" ){
			if( $('#tipo_familia').val() == 'I' ){
				filtro += ",___in___cod_familia,"+$('#cod_familia').val();
			}else{
				filtro += ",___not______in___cod_familia,"+$('#cod_familia').val();
			}
		}
		 
		if( $('#gru_ctr_estoq').val() != "" ){
			if( $('#tipo_grupo').val() == 'I' ){
				filtro += ",___in___gru_ctr_estoq,"+$('#gru_ctr_estoq').val();
			}else{
				filtro += ",___not______in___gru_ctr_estoq,"+$('#gru_ctr_estoq').val();
			}
		}
		
		modalzoom.open("Demanda",
				   "selectTable", 
				   "num_docum,documento,prz_entrega,Prazo", 
				   "distinct,cod_empresa,num_docum,prz_entrega,empresa_necessidade", 
				   "dataBase,java:/jdbc/LogixPRD,table,fluig_v_demanda,cod_empresa,"+$('#cod_empresa').val()+",empresa_necessidade,"+$('#cod_empresa_dest').val()+filtro,
				   componente, false, 'default', null, null,
				    "" );
	}	
	
	if (componente == 'btItem'){

		console.log('Entrei btItem');
		
		modalzoom.open("Item",
				   "selectTable", 
				   "cod_item,C&oacutedigo,den_item,Item,den_familia,Familia", 
				   "cod_item,den_item,den_familia,cod_lin_prod,cod_lin_recei,cod_seg_merc,cod_cla_uso,cod_unid_med", 
				   "dataBase,java:/jdbc/LogixPRD,table,fluig_v_item,sqlLimit,250,___not___ies_tip_item,T,ies_situacao,A,cod_empresa,"+$('#cod_empresa').val(),
				   componente, false, 'default', null, null,
				    "cod_item||'-'||den_item" );
	}
	
	if (componente == 'btNatOper'){					
		zoomDataSetFiltro('Natureza Operacao', 
						  'natureza_operacao_zoom', 
						  'cod_nat_oper,Codigo,den_nat_oper,Natureza', 
						  'cod_nat_oper,den_nat_oper', 
						  'not_natureza,'+getFiltroLista( 'cod_nat_oper' ),
						  componente);
	}

	
	if ( componente.indexOf( 'btCondPagto' ) > -1 ){
		 zoomDataSet('Cond. Pagamento', 
		 			 'condicao_pagamento_vdp', 
					 'cod_cnd_pgto,Codigo,den_cnd_pgto,Descricao', 
					 'cod_cnd_pgto,den_cnd_pgto', 
					 componente);
	}
	
	if ( componente == 'btAENtransf' ){		
	
		modalzoom.open('AEN', 
				  'aen_zoom', 
				  'cod_aen,AEN,aen_compl,Descricao', 
				  'cod_aen,aen_compl', 
				  filtro,
				  componente);
	}
	
	
	if (componente == 'btFornecedorTransf'){
		modalzoom.open("Transportador",
				   "transportador_logix", 
				   "cod_cliente,C&oacutedigo,nom_cliente,Transportador", 
				   "cnpj,cod_cliente,nom_cliente", 
				   "",
				   componente, false, 'default', null, null,
				    "nom_cliente" );
	}

	
}

function removedZoomItem(removedItem) {
	console.log('removedItem...........',removedItem);
	if(  removedItem.inputName == "den_familia" ){
		var aFamilia = $('#cod_familia').val().split('|');
		var anFamilia = [];
		
		for( var i = 0; i < aFamilia.length; i ++ ){
			if( aFamilia[i] != removedItem.COD_FAMILIA ){
				anFamilia.push( aFamilia[i] )	
			}
		}
		$('#cod_familia').val( anFamilia.join('|') );
	}
	if(  removedItem.inputName == "den_gru_ctr_estoq" ){
		var aGrupo = $('#gru_ctr_estoq').val().split('|');
		var anGrupo = [];
		
		for( var i = 0; i < aGrupo.length; i ++ ){
			if( aGrupo[i] != removedItem.GRU_CTR_ESTOQ ){
				anGrupo.push( aGrupo[i] )	
			}
		}
		$('#gru_ctr_estoq').val( anGrupo.join('|') );
	}
}

function setSelectedZoomItem(selectedItem) {

	console.log('selectedItem...........',selectedItem);
	
	if(  selectedItem.inputName == "den_familia" ){
	
		var aFamilia = [];
		if( $('#cod_familia').val() != "" ){
			aFamilia = $('#cod_familia').val().split('|');
		}
		if( aFamilia.indexOf( selectedItem.COD_FAMILIA ) == -1 ){
			aFamilia.push( selectedItem.COD_FAMILIA );
		} 
		$('#cod_familia').val( aFamilia.join('|') );
		return true;
	}
	if(  selectedItem.inputName == "den_gru_ctr_estoq" ){
		
		var aGrupo = [];
		if( $('#gru_ctr_estoq').val() != "" ){
			aFamilia = $('#gru_ctr_estoq').val().split('|');
		}

		if( aGrupo.indexOf( selectedItem.GRU_CTR_ESTOQ ) == -1 ){
			aGrupo.push( selectedItem.GRU_CTR_ESTOQ );
		} 
		$('#gru_ctr_estoq').val( aGrupo.join('|') );
		return true;
	}
	
	var seq = selectedItem.type.split('___')[1];	
	
	if ( selectedItem.type == 'btEmpresa' ){	
		$('#den_empresa').val( selectedItem.den_empresa ) ;
		$('#cod_empresa').val( selectedItem.cod_empresa ) ;
		loadDsCombo('lista_preco_transf', 'lista_de_preco', 'NUM_LIST_PRECO', 'DEN_LIST_PRECO', 'cod_empresa', ''+$('#cod_empresa').val(), 'NUM_LIST_PRECO' );
		$('#lista_preco_transf').val( selectedItem.lista_preco_transf ) ;
		$('#cod_aen_transf').val( selectedItem.cod_aen_transf ) ;
		$('#nat_oper_transf').val( selectedItem.nat_oper_transf ) ;
		$('#cond_pagto_transf').val( selectedItem.cond_pagto_transf ) ;
		$('#carteira_transf').val( selectedItem.carteira_transf ) ;
		$('#tipo_venda_transf').val( selectedItem.tipo_venda_transf ) ;
		$('#finalidade_transf').val( selectedItem.finalidade_transf ) ;
		$('#tipo_entrega_transf').val( selectedItem.tipo_entrega_transf ) ;
		$('#tipo_frete_transf').val( selectedItem.tipo_frete_transf ) ;
		$('#cod_fornecedor_transf').val( selectedItem.cod_fornecedor_transf ) ;	
		
		$('#cnpj_fornecedor_transf').val( selectedItem.cnpj_fornecedor_transf ) ;
		$('#fornecedor_transf').val( selectedItem.fornecedor_transf ) ;
		
		$('#cod_aen_transf').val( selectedItem.cod_aen_transf ) ;
		$('#den_aen_transf').val( selectedItem.den_aen_transf ) ;
		
		
		reloadZoomFilterValues("den_familia", "COD_EMPRESA,"+ selectedItem.cod_empresa );
		reloadZoomFilterValues("den_gru_ctr_estoq", "COD_EMPRESA,"+ selectedItem.cod_empresa );
		
	}
	
	if ( selectedItem.type == 'btEmpresaDest' ){	
		$('#den_empresa_dest').val( selectedItem.DEN_REDUZ ) ;
		$('#cod_empresa_dest').val( selectedItem.COD_EMPRESA ) ;
		$('#cod_cliente').val( selectedItem.COD_CLIENTE ) ;
		$('#uni_feder').val( selectedItem.UNI_FEDER ) ;
		
	}
	
	if (selectedItem.type == "btDem") {
		
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint("dataBase", "java:/jdbc/LogixPRD", null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint("table", "fluig_v_demanda", null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint("cod_empresa", $('#cod_empresa').val(), $('#cod_empresa').val(), ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint("empresa_necessidade", $('#cod_empresa_dest').val(), $('#cod_empresa_dest').val(), ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint("num_docum", selectedItem.num_docum, selectedItem.num_docum, ConstraintType.MUST) );

		if( $('#cod_familia').val() != "" ){
			if( $('#tipo_familia').val() == 'I' ){
				constraints.push( DatasetFactory.createConstraint("___in___cod_familia", $('#cod_familia').val(), null, ConstraintType.MUST) );
			}else{
				constraints.push( DatasetFactory.createConstraint("___not______in___cod_familia", $('#cod_familia').val(), null, ConstraintType.MUST) );
			}
		}
		 
		if( $('#gru_ctr_estoq').val() != "" ){
			if( $('#tipo_grupo').val() == 'I' ){
				constraints.push( DatasetFactory.createConstraint("___in___gru_ctr_estoq", $('#gru_ctr_estoq').val(), null, ConstraintType.MUST) );
			}else{
				constraints.push( DatasetFactory.createConstraint("___not______in___gru_ctr_estoq", $('#gru_ctr_estoq').val(), null, ConstraintType.MUST) );
			}
		}
		
		var dataset = DatasetFactory.getDataset("selectTable", ["cod_item","den_item","qtd_saldo","cod_unid_med","cod_lin_prod","cod_lin_recei","cod_seg_merc","cod_cla_uso"], constraints, ["den_item"] );
		console.log('dataset demanda ', dataset);
		if ( dataset != null ){
			var linhas = dataset.values;
			for( var i = 0; i < linhas.length; i++ ){
				var row = wdkAddChild("itens");
				setValorSeq( "cod_item", row, linhas[i]["cod_item"].trim() );
				setValorSeq( "den_item", row, linhas[i]["den_item"] );
				setValorSeq( "qtd_nec", row, linhas[i]["qtd_saldo"] );
				setValorSeq( "qtd_envio", row, linhas[i]["qtd_saldo"] );
				
				setValorSeq( "cod_unid_med", row, linhas[i]["cod_unid_med"] );
				setValorSeq( "cod_lin_prod", row, linhas[i]["cod_lin_prod"] );
				setValorSeq( "cod_lin_recei", row, linhas[i]["cod_lin_recei"] );
				setValorSeq( "cod_seg_merc", row, linhas[i]["cod_seg_merc"] );
				setValorSeq( "cod_cla_uso", row, linhas[i]["cod_cla_uso"] );
			
				var preco = getPrecoListaItem( $('#cod_empresa').val(), 
												$('#lista_preco_transf').val(), 
												linhas[i]["cod_item"].trim(), 
												linhas[i]["cod_lin_prod"], 
												linhas[i]["cod_lin_recei"] , 
												linhas[i]["cod_seg_merc"], 
												linhas[i]["cod_cla_uso"], 
												$('#cod_cliente').val(), 
												$('#uni_feder').val(), 
												$('#cond_pagto_transf').val(), '', '' )
				console.log('preco..',preco);
				setValorSeq( "custo", row, frmNumber( preco["PRE_UNIT"], 3 ) );
			}
			
		}
					
		setMask();
	}
	
	if (selectedItem.type == "btItem") {
		
		var row = wdkAddChild("itens");
		setValorSeq( "cod_item", row, selectedItem.cod_item.trim() );
		setValorSeq( "den_item", row, selectedItem.den_item );
		setValorSeq( "qtd_nec", row, "0" );
		setValorSeq( "qtd_envio", row, "0" );
		
		setValorSeq( "cod_unid_med", row, selectedItem.cod_unid_med );
		setValorSeq( "cod_lin_prod", row, selectedItem.cod_lin_prod );
		setValorSeq( "cod_lin_recei", row, selectedItem.cod_lin_recei );
		setValorSeq( "cod_seg_merc", row, selectedItem.cod_seg_merc );
		setValorSeq( "cod_cla_uso", row, selectedItem.cod_cla_uso );
					
		var preco = getPrecoListaItem( $('#cod_empresa').val(), $('#lista_preco_transf').val(), selectedItem.cod_item.trim(), selectedItem.cod_lin_prod, selectedItem.cod_lin_recei , selectedItem.cod_seg_merc, selectedItem.cod_cla_uso, $('#cod_cliente').val(), $('#uni_feder').val(), $('#cond_pagto_transf').val(), '', '' )
		console.log('preco..',preco);
		setValorSeq( "custo", row, frmNumber( preco["PRE_UNIT"], 3 ) );
		
		setMask();
	}
	
	if (selectedItem.type == "btNatOper") {
	       var row = wdkAddChild('nat_oper'); 
		   $('#cod_nat_oper___'+row).val( selectedItem.cod_nat_oper ) ;
		   $('#den_nat_oper___'+row).val( selectedItem.den_nat_oper ) ;
		   fnFirstDefault( 'ies_nat_oper_default___'+row );
		   fnComissao( 'ies_comissao___'+row  );
	}

	if (selectedItem.type == "btAEN") {
	       var row = wdkAddChild('aen_dias_entrega'); 
		   $('#aen___'+row).val( selectedItem.cod_aen );
		   $('#den_aen___'+row).val( selectedItem.aen_compl );
	}
	
	if (selectedItem.type.indexOf( 'btCondPagto' ) > -1) {
		   $('#cod_cond_pagto___'+getLinhaCampoPF( selectedItem.type ) ).val( selectedItem.cod_cnd_pgto ) ;
		   $('#den_cond_pagto___'+getLinhaCampoPF( selectedItem.type ) ).val( selectedItem.den_cnd_pgto ) ;
	}
	
	if (selectedItem.type == "btFornecedorTransf") {
		$('#cnpj_fornecedor_transf').val( selectedItem.cnpj ) ;
		$('#cod_fornecedor_transf').val( selectedItem.cod_cliente ) ;
		$('#fornecedor_transf').val( selectedItem.nom_cliente ) ;
	}

	if (selectedItem.type == "btAENtransf") {
		$('#den_aen_transf').val( selectedItem.aen_compl ) ;
		$('#cod_aen_transf').val( selectedItem.cod_aen ) ;
	}

}

function getPrecoListaItem( codEmpresa, numLista, codItem, codAen1, codAen2, codAen3, codAen4, codCliente, codUF, codCond, codGrupo, codAcabam ){
	
	console.log( 'entrou da busca',codEmpresa, numLista, codItem, codAen1, codAen2, codAen3, codAen4, codCliente, codUF, codCond, codGrupo, codAcabam );

	var result = {};
	result['PRE_UNIT'] = 0.00;
	result['PCT_DESC_ADIC'] = 0.00;
	
	var consAcesso = new Array();
	consAcesso.push( DatasetFactory.createConstraint( 'NUM_LIST_PRECO', numLista, numLista, ConstraintType.MUST) );
	var orderAcesso = new Array();
	orderAcesso.push( 'SEQUENCIA' );
	
	var datasetAcesso = DatasetFactory.getDataset( 'lista_de_preco_acesso', null, consAcesso, orderAcesso);

	console.log( 'busca acesso', datasetAcesso );
	
	
	if ( datasetAcesso != null ){
		for (var x = 0; x < datasetAcesso.values.length; x++) {
			
			var acess =   parseInt( datasetAcesso.values[x]['SEQUENCIA'] );

			console.log( '		', x, acess );
			
			var constraints = new Array();
			constraints.push( DatasetFactory.createConstraint( 'cod_empresa', codEmpresa, codEmpresa, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint( 'num_list_preco', numLista, numLista, ConstraintType.MUST) );
			
			//UF
			
			if ( [14,16,17,18,19,20].indexOf( acess ) > -1 ){
				constraints.push( DatasetFactory.createConstraint( 'cod_uni_feder', codUF, codUF, ConstraintType.MUST) );
			}else{
				constraints.push( DatasetFactory.createConstraint( 'cod_uni_feder', '#', '#', ConstraintType.MUST) );
			}
			//CLIENTE
			if ( [1,2,4,6,9,10,11,12,13].indexOf( acess ) > -1 ){
				constraints.push( DatasetFactory.createConstraint( 'cod_cliente', codCliente, codCliente, ConstraintType.MUST) );
			}else{
				constraints.push( DatasetFactory.createConstraint( 'cod_cliente', '#', '#', ConstraintType.MUST) );
			}
			
			// AEN N1
			if ( [9,10,11,12,16,17,18,19,21,22,23,24].indexOf( acess ) > -1 ){
				constraints.push( DatasetFactory.createConstraint( 'cod_lin_prod', codAen1, codAen1, ConstraintType.MUST) );
			}else{
				constraints.push( DatasetFactory.createConstraint( 'cod_lin_prod', '0', '0', ConstraintType.MUST) );
			}
			// AEN N2
			if ( [9,10,11,16,17,18,21,22,23].indexOf( acess ) > -1 ){
				constraints.push( DatasetFactory.createConstraint( 'cod_lin_recei', codAen2, codAen2, ConstraintType.MUST) );
			}else{
				constraints.push( DatasetFactory.createConstraint( 'cod_lin_recei', '0', '0', ConstraintType.MUST) );
			}
			// AEN N3
			if ( [9,10,16,17,21,22].indexOf( acess ) > -1 ){
				constraints.push( DatasetFactory.createConstraint( 'cod_seg_merc', codAen3, codAen3, ConstraintType.MUST) );
			}else{
				constraints.push( DatasetFactory.createConstraint( 'cod_seg_merc', '0', '0', ConstraintType.MUST) );
			}
			// AEN N4
			if ( [9,16,21].indexOf( acess ) > -1 ){
				constraints.push( DatasetFactory.createConstraint( 'cod_cla_uso', codAen4, codAen4, ConstraintType.MUST) );
			}else{
				constraints.push( DatasetFactory.createConstraint( 'cod_cla_uso', '0', '0', ConstraintType.MUST) );
			}
			
			// ITEM
			console.log('Anter o M',acess);
			if ( [1,2,5,6,8,14,15].indexOf( acess ) > -1 ){
				console.log('Entrei o M',codItem);
				constraints.push( DatasetFactory.createConstraint( 'cod_item', codItem, codItem, ConstraintType.MUST) );
			}else{
				constraints.push( DatasetFactory.createConstraint( 'cod_item', '#', '#', ConstraintType.MUST) );
			}
		/*						
			//GRUPO
			if ( [3,4,5,6,7,8].indexOf( acess ) > -1 ){
				constraints.push( DatasetFactory.createConstraint( 'cod_grupo', codGrupo, codGrupo, ConstraintType.MUST) );
			}else{
				constraints.push( DatasetFactory.createConstraint( 'cod_grupo', '0','0', ConstraintType.MUST) );
			}
			// Acabam
			if ( [3,4,5,6,7,8].indexOf( acess ) > -1 ){
				constraints.push( DatasetFactory.createConstraint( 'cod_acabam', codAcabam, codAcabam, ConstraintType.MUST) );
			}else{
				constraints.push( DatasetFactory.createConstraint( 'cod_acabam', '0', '0', ConstraintType.MUST) );
			}
			// Cond Pagamento
			if ( [2].indexOf( acess ) > -1 ){
				constraints.push( DatasetFactory.createConstraint( 'cod_cnd_pgto', codCond, codCond, ConstraintType.MUST) );
			}else{
				constraints.push( DatasetFactory.createConstraint( 'cod_cnd_pgto', '0', '0', ConstraintType.MUST) );
			}
		*/					
			console.log(  'Antes loop', constraints );
			
			//Busca o dataset
			var dataset = DatasetFactory.getDataset( 'lista_de_preco_item_desc', null, constraints, null);
			console.log(  'Data SET', dataset );
			if ( dataset != null ){
				for (var i = 0; i < dataset.values.length; i++) {
					console.log( dataset );
					console.log(  'Valor SET',dataset.values[i] );
					var row = dataset.values[i];
					var val = {};
					val['PRE_UNIT'] = getFloat(  row[ 'PRE_UNIT' ], 0  );
					val['PCT_DESC_ADIC'] = getFloat(  row[ 'PCT_DESC_ADIC' ], 0 );
					return val;
				}
			}
		}
	}
	return result;
}


function setValorSeq(campo, linha, valor){
	$( '#'+campo+'___'+linha).val( valor ) ;
}

function getValorSeq(campo, linha){
	return $( '#'+campo+'___'+linha ).val();
}


function getFloat(valor, padrao) {
	var txt = valor;
	// exp = /\./g;
	// txt = txt.toString().replace( exp, "" );
	exp = /\,/g;
	txt = txt.toString().replace(exp, ".");
	return isNull(Math.round(parseFloat(txt) * 100000000) / 100000000, padrao);
}

function frmNumber(valor, precisao) {

	var numero = valor;

	numero = numero.toFixed(precisao).split('.');
	numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
	return numero.join(',');

	// return String( ( valor ).toFixed( precisao ) ).replace('.',',');

}

function isNull(valor, padrao) {
	if (isNaN(valor)) {
		return padrao;
	} else {
		return valor;
	}
}