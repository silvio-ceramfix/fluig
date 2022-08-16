
var nivel = "";

function zoom(componente, idCampoTexto) {
				
	console.log('Componente.....'+componente);
	var valor = null;
	if ( idCampoTexto != null & idCampoTexto != undefined ){
		valor = $('#'+idCampoTexto).val();
		console.log('VALOR....',valor);
		if (valor == ''){
			return false;
		}
		if (idCampoTexto.split('___')[1] != null && idCampoTexto.split('___')[1] != undefined ){
			componente += '___'+idCampoTexto.split('___')[1];
		}
	}
	
	console.log('VALOR....',valor);
	
	if( componente == 'bt_aen_premix'
	 || componente == 'bt_semiacabado'
     || componente == 'bt_acabado'
	 || componente == 'bt_emb_primaria'
	 || componente == 'bt_emb_secundaria'
	 || componente == 'bt_emb_transporte' ){
		modalzoom.open("AEN",
				   "selectTable", 
				   "cod_aen,Código,den_aen_compl,Descrição", 
				   "cod_aen,den_aen_compl", 
				   "dataBase,java:/jdbc/LogixPRD,table,fluig_v_aen,nivel,4,sqlLimit,500",
				   componente, false, 'default', null, null,
			       "cod_aen||' '||den_aen_compl" );
	}
	
	
	if( componente == 'bt_cest' && $('#tipo_cest').val() == 'E' ){
		modalzoom.open("CEST",
					   "selectTable", 
					   "cest,CEST,des_cest,Descrição", 
					   "distinct,cest,des_cest", 
					   "dataBase,java:/jdbc/LogixPRD,table,obf_cest",
					   componente, false, 'default', null, null,
				       "cest||' '||des_cest" );
	}
	
	if( componente == 'bt_ncm' && $('#tipo_ncm').val() == 'E' ){
		modalzoom.open("NCM",
					   "selectTable", 
					   "cod_cla_fisc,NCM", 
					   "distinct,cod_cla_fisc", 
					   "dataBase,java:/jdbc/LogixPRD,table,clas_fiscal",
					   componente, false, 'default', null, null,
				       "cod_cla_fisc" );
	}

	
	if( componente == 'bt_solicitante'  ){
		var filtroCPL = '';
		var largura = 'default';
		if( $('#origem_solic').val() == 'I' ){
			modalzoom.open("Funcionario",
					   "selectTable", 
					   "ra_filial,Filial,ra_mat,matricula,ra_nome,Funcionario,qb_descric,Departamento", 
					   "ra_filial,ra_mat,ra_nome,ra_depto,qb_descric", 
					   "dataBase,java:/jdbc/LogixPRD,table,fluig_v_funcionario"+filtroCPL,
					   componente, false, largura, null, null,
				       "ra_filial||'-'||ra_mat||'-'||ra_nome" );
		}
		if( $('#origem_solic').val() == 'C' ){
			modalzoom.open("Representante",
					   "selectTable", 
					   "cod_repres,Codigo,raz_social,Representante,den_regional,Regional", 
					   "cod_repres,raz_social,cod_regional,den_regional", 
					   "dataBase,java:/jdbc/LogixPRD,table,fluig_v_representente"+filtroCPL,
					   componente, false, largura, null, null,
				       "cod_repres||'-'||raz_social||'-'||ra_nome" );
		}	
	}
	
	var campo = componente.split('___')[0];
	var seq = componente.split('___')[1];
	
	if( campo == 'cod_unidade_comissao'  ){
		modalzoom.open("Empresa",
				   "empresa_zoom", 
				   "cod_empresa,Codigo,den_reduz,Empresa", 
				   "cod_empresa,den_reduz,den_empresa", 
				   "",
				   componente, false, 'default', null, null,
			       "cod_empresa" );
	}

	if( campo == 'cod_regional_comissao'  ){
		
		console.log('ENTROU LISTA');
		var cri = '';
		var crf = '';
			
		var ct = new Array( DatasetFactory.createConstraint("ies_matriz", 'on', 'on', ConstraintType.MUST) );
		var ds = DatasetFactory.getDataset('empresa_compl', null, ct, null);
		if ( ds != null && ds.values.length ){
			nivel = parseInt( ds.values[0]['nivel_canal_regional'] );
			cri = ds.values[0]['cod_regional_inicio'];
			console.log('cod_regiona_inicio',ds.values[0]['cod_regional_inicio'] );
			crf = ds.values[0]['cod_regional_fim'];
			console.log('cod_regiona_final',ds.values[0]['cod_regional_fim'] );
		}
		var proxNivel = nivel+1;
		
		modalzoom.open('Regional', 
				  'selectTable', 
				  'cod_nivel_'+ nivel +',Codigo,den_canal_vendas,Regional', 
				  'cod_nivel_'+ nivel +',den_canal_vendas', 
				  'dataBase,java:/jdbc/LogixPRD,table,canal_venda,cod_nivel_'+ nivel +','+cri+'|'+crf+',cod_nivel_'+ proxNivel+',0',
				  componente);
		
		
	}
	
	if( campo == 'cod_cliente_verba'  ){
		modalzoom.open("Cliente",
				   "selectTable", 
				   "cod_cliente,Coddigo,nom_reduzido,Nome", 
				   "nom_cliente,cod_cliente,nom_reduzido", 
				   "dataBase,java:/jdbc/LogixPRD,table,clientes,ies_situacao,A",
				   componente, false, 'default', null, null,
			       "cod_cliente||'-'||nom_cliente" );
	}
	
	if( campo == 'bt_mp'  ){
		modalzoom.open("Item",
				   "selectTable", 
				   "cod_item,Codigo,den_item,Item,ies_tip_item,IT,den_familia,Familia,den_gru_ctr_estoq,Grupo Estoque", 
				   "cod_empresa,cod_item,den_item,den_item_reduz,ies_tip_item,cod_familia,den_familia,gru_ctr_estoq,den_gru_ctr_estoq", 
				   "dataBase,java:/jdbc/LogixPRD,table,fluig_v_item,cod_empresa,10,ies_ctr_estoque,S,ies_situacao,A",
				   componente, false, 'default', null, null,
			       "cod_item||'-'||den_item||'-'||den_familia||'-'||den_gru_ctr_estoq" );
	}
	
	if( campo == 'bt_fornec' ){
		if( $('#cod_materia_prima___'+seq).val() == "" ){
			modalzoom.open("Fornecedor",
					   "selectTable", 
					   "cod_fornecedor,Codigo,raz_social,Razão Social", 
					   "cod_fornecedor,raz_social", 
					   "dataBase,java:/jdbc/LogixPRD,table,fluig_v_fornecedor_cpl",
					   componente, false, 'default', null, null,
				       "cod_fornecedor||'-'||raz_social" );
		}else{
			modalzoom.open("Fornecedor",
					   "selectTable", 
					   "cod_fornecedor,Codigo,raz_social,Razão Social", 
					   "cod_fornecedor,raz_social", 
					   "dataBase,java:/jdbc/LogixPRD,table,fluig_v_fornecedor_item,cod_item,"+$('#cod_materia_prima___'+seq).val(),
					   componente, false, 'default', null, null,
					   "cod_fornecedor||'-'||raz_social" );
		}
	}
	if( campo == 'bt_item_densidade') {
		modalzoom.open("Item",
				   "selectTable", 
				   "cod_item,Codigo,den_item,Item", 
				   "cod_empresa,cod_item,den_item,den_item_reduz,ies_tip_item", 
				   "dataBase,java:/jdbc/LogixPRD,table,fluig_v_item,cod_empresa,10,ies_ctr_estoque,S,ies_situacao,A",
				   componente, false, largura, null, null,
			       "cod_item||'-'||den_item" );
	}
	
	if( campo == 'bt_um_densidade') {
		modalzoom.open("UM",
				   "selectTable", 
				   "cod_unid_med,Codigo,den_unid_med_30,Descricao", 
				   "cod_unid_med,den_unid_med_30", 
				   "dataBase,java:/jdbc/LogixPRD,table,unid_med",
				   componente, false, largura, null, null,
			       "cod_unid_med||'-'||den_unid_med_30" );
	}
	
	if( campo == 'bt_cod_interno'
	 || campo == 'bt_cod_fantasma'
     || campo == 'bt_cod_premix'
     || campo == 'bt_cod_emb_primaria'
     || campo == 'bt_cod_emb_secundaria'
     || campo == 'bt_cod_emb_transporte' ){
		
		var filtroCPL = "";
		var largura = 'default';
		if ( valor != null && valor != undefined && valor != "" ){
			filtroCPL += ",cod_item,"+valor;
			largura = 'none';
		}
		
		if( campo == 'bt_cod_emb_primaria'
		 || campo == 'bt_cod_emb_secundaria'
		 || campo == 'bt_cod_emb_transporte' ){
			filtroCPL += ",gru_ctr_estoq,2";
		}
		
		modalzoom.open("Item",
				   "selectTable", 
				   "cod_item,Codigo,den_item,Item", 
				   "cod_empresa,cod_item,den_item,den_item_reduz,ies_tip_item", 
				   "dataBase,java:/jdbc/LogixPRD,table,fluig_v_item,cod_empresa,10,ies_ctr_estoque,S,ies_situacao,A"+filtroCPL,
				   componente, false, largura, null, null,
			       "cod_item||'-'||den_item" );
	}
	
	if( campo == 'bt_cod_etapa' ){
		var filtroCPL = "";
		var largura = 'default';
		if ( valor != null && valor != undefined && valor != "" ){
			filtroCPL += ",cod_etapa,"+valor;
			largura = 'none';
		}
		
		modalzoom.open("Etapa",
				   "selectTable", 
				   "cod_etapa,Codigo,den_etapa,Etapa", 
				   "cod_etapa,den_etapa", 
				   "dataBase,java:/jdbc/LogixPRD,table,etapa,cod_empresa,10"+filtroCPL,
				   componente, false, largura, null, null,
			       "cod_etapa||'-'||den_etapa" );
	} 
	
	if( campo == 'bt_cod_sku_plt'
	 || campo == 'bt_cod_sku_ind' ){
		var filtroCPL = "";
		var largura = 'default';
		if ( valor != null && valor != undefined && valor != "" ){
			filtroCPL += ",sku,"+valor;
			largura = 'none';
		}
		
		modalzoom.open("SKU",
				   "selectTable", 
				   "sku,Codigo,des_reduz_sku,SKU,qtd_item,Quant,peso_bruto,Peso", 
				   "sku,des_reduz_sku", 
				   "dataBase,java:/jdbc/LogixPRD,table,wms_item_sku,empresa,10,item,"+$('#cod_interno___'+seq).val()+filtroCPL,
				   componente, false, largura, null, null,
			       "sku||'-'||des_reduz_sku" );
	}	
	
}

function setSelectedZoomItem(selectedItem) {
	console.log('selectedItem',selectedItem);
	if ( selectedItem.type == 'bt_solicitante' ) {
		if( $('#origem_solic').val() == 'I' ){
			$('#nome_solicitante').val( selectedItem.ra_nome );
			$('#cod_solicitante').val( selectedItem.ra_mat );
			$('#cod_emp_solicitante').val( selectedItem.ra_filial );
			$('#regional_departamento').val( selectedItem.qb_descric );
			$('#cod_regional_departamento').val( selectedItem.ra_depto );
		}
		if( $('#origem_solic').val() == 'C' ){
			$('#nome_solicitante').val( selectedItem.raz_social );
			$('#cod_solicitante').val( selectedItem.cod_repres );
			$('#cod_emp_solicitante').val( 'RE' );
			$('#regional_departamento').val( selectedItem.den_regional );
			$('#cod_regional_departamento').val( selectedItem.cod_regional );
		}
	}
	
	if ( selectedItem.type == 'bt_ncm' ) {
		$('#num_ncm').val( selectedItem.cod_cla_fisc );
	}
	 
	if ( selectedItem.type == 'bt_cest' ) {
		$('#den_cest').val( selectedItem.cest.trim()+'-'+selectedItem.des_cest.trim() );
		$('#num_cest').val( selectedItem.cest );
	}
	
	if ( selectedItem.type == 'bt_item_densidade' ) {
		$('#cod_item_densidade').val( selectedItem.cod_item );
		$('#den_item_densidade').val( selectedItem.den_item );
	}
	
	if ( selectedItem.type == 'bt_um_densidade' ) {
		$('#um_densidade').val( selectedItem.cod_unid_med );
	}
	
	if ( selectedItem.type == 'bt_aen_premix' ) {
		$('#aen_premix').val( selectedItem.cod_aen.trim() );
		$('#den_aen_premix').val( selectedItem.den_aen_compl.trim() );
	}	
	if ( selectedItem.type == 'bt_semiacabado' ) {
		$('#aen_semiacabado').val( selectedItem.cod_aen.trim() );
		$('#den_aen_semiacabado').val( selectedItem.den_aen_compl.trim() );
	}	
	if ( selectedItem.type == 'bt_acabado' ) {
		$('#aen_acabado').val( selectedItem.cod_aen.trim() );
		$('#den_aen_acabado').val( selectedItem.den_aen_compl.trim() );
	}	
	if ( selectedItem.type == 'bt_emb_primaria' ) {
		$('#aen_emb_primaria').val( selectedItem.cod_aen.trim() );
		$('#den_aen_emb_primaria').val( selectedItem.den_aen_compl.trim() );
	}	
	if ( selectedItem.type == 'bt_emb_secundaria' ) {
		$('#aen_emb_secundaria').val( selectedItem.cod_aen.trim() );
		$('#den_aen_emb_secundaria').val( selectedItem.den_aen_compl.trim() );
	}	
	if ( selectedItem.type == 'bt_emb_transporte' ) {
		$('#aen_emb_transporte').val( selectedItem.cod_aen.trim() );
		$('#den_aen_emb_transporte').val( selectedItem.den_aen_compl.trim() );
	}		
	
	var campo = selectedItem.type.split('___')[0];
	var seq = selectedItem.type.split('___')[1];
	
	
	if( campo == 'cod_unidade_comissao' ){
		$('#cod_unidade_comissao___'+seq).val( selectedItem.cod_empresa );
		$('#unidade_comissao___'+seq).val( selectedItem.den_reduz );
	}

	if( campo == 'cod_regional_comissao' ){
		$('#cod_regional_comissao___'+seq).val( selectedItem['cod_nivel_'+ nivel] );
		$('#regional_comissao___'+seq).val( selectedItem.den_canal_vendas );
	}

	if( campo == 'cod_cliente_verba' ){
		$('#den_cliente_verba___'+seq).val( selectedItem.nom_cliente );
		$('#cod_cliente_verba___'+seq).val( selectedItem.cod_cliente );
	}

	
	if( campo == 'bt_mp' ){
		$('#den_materia_prima___'+seq).val( selectedItem.cod_item.trim()+'-'+selectedItem.den_item.trim() );
		$('#den_materia_prima_orig___'+seq).val( selectedItem.cod_item.trim()+'-'+selectedItem.den_item.trim() );
		$('#cod_materia_prima___'+seq).val( selectedItem.cod_item.trim() );
		iesMpNova();
	}

	
	if( campo == 'bt_fornec' ){
		$('#fornecedor_materia_prima___'+seq).val( selectedItem.cod_fornecedor.trim()+'-'+selectedItem.raz_social.trim() );
		$('#fornecedor_materia_prima_orig___'+seq).val( selectedItem.cod_fornecedor.trim()+'-'+selectedItem.raz_social.trim() );
		$('#cod_fornec_materia_prima___'+seq).val( selectedItem.cod_fornecedor.trim() );
	}
	console.log('campo.....',campo);
	if( campo == 'bt_cod_interno' ){
		if( ( selectedItem.cod_item == '' || selectedItem.cod_item == undefined )
		 && selectedItem.size == 'none' ){
			setTimeout("$('#cod_interno___"+seq + "' ).focus();", 1);
			alert( 'Item não localizado' );
		}else{
			$('#cod_interno___'+seq).val( selectedItem.cod_item.trim() );
		}
	}
	
	if( campo == 'bt_cod_fantasma' ){
		if( ( selectedItem.cod_item == '' || selectedItem.cod_item == undefined )
		 && selectedItem.size == 'none' ){
			setTimeout("$('#cod_fantasma___"+seq + "' ).focus();", 1);
			alert( 'Item não localizado' );
		}else{
			$('#cod_fantasma___'+seq).val( selectedItem.cod_item.trim() );
		}
	}	
	
	if( campo == 'bt_cod_premix' ){
		if( ( selectedItem.cod_item == '' || selectedItem.cod_item == undefined )
		 && selectedItem.size == 'none' ){
			setTimeout("$('#cod_premix___"+seq + "' ).focus();", 1);
			alert( 'Item não localizado' );
		}else{
			$('#cod_premix___'+seq).val( selectedItem.cod_item.trim() );
		}
	}

	if( campo == 'bt_cod_etapa' ){
		if( ( selectedItem.cod_etapa == '' || selectedItem.cod_etapa == undefined )
		 && selectedItem.size == 'none' ){
			setTimeout("$('#cod_etapa___"+seq + "' ).focus();", 1);
			alert( 'Etapa não localizado' );
		}else{
			$('#cod_etapa___'+seq).val( selectedItem.cod_etapa.trim() );
		}
	}
	
	if( campo == 'bt_cod_sku_plt' ){
		if( ( selectedItem.sku == '' || selectedItem.sku == undefined )
		 && selectedItem.size == 'none' ){
			setTimeout("$('#cod_sku_plt___"+seq + "' ).focus();", 1);
			alert( 'Etapa não localizado' );
		}else{
			$('#cod_sku_plt___'+seq).val( selectedItem.sku.trim() );
		}
	}

	if( campo == 'bt_cod_sku_ind' ){
		if( ( selectedItem.sku == '' || selectedItem.sku == undefined )
		 && selectedItem.size == 'none' ){
			setTimeout("$('#cod_sku_ind___"+seq + "' ).focus();", 1);
			alert( 'Etapa não localizado' );
		}else{
			$('#cod_sku_ind___'+seq).val( selectedItem.sku.trim() );
		}
	}	
	
	
	if( campo == 'bt_cod_emb_primaria' ){
		if( ( selectedItem.cod_item == '' || selectedItem.cod_item == undefined )
		 && selectedItem.size == 'none' ){
			setTimeout("$('#cod_emb_primaria' ).focus();", 1);
			alert( 'Item não localizado' );
		}else{
			$('#cod_emb_primaria').val( selectedItem.cod_item.trim() );
		}
	}
	
	if( campo == 'bt_cod_emb_secundaria' ){
		if( ( selectedItem.cod_item == '' || selectedItem.cod_item == undefined )
		 && selectedItem.size == 'none' ){
			setTimeout("$('#cod_emb_secundaria' ).focus();", 1);
			alert( 'Item não localizado' );
		}else{
			$('#cod_emb_secundaria').val( selectedItem.cod_item.trim() );
		}
	}	
	
	if( campo == 'bt_cod_emb_transporte' ){
		if( ( selectedItem.cod_item == '' || selectedItem.cod_item == undefined )
		 && selectedItem.size == 'none' ){
			setTimeout("$('#cod_emb_transporte' ).focus();", 1);
			alert( 'Item não localizado' );
		}else{
			$('#cod_emb_transporte').val( selectedItem.cod_item.trim() );
		}
	}	
	
}



function clearSelectedZoomItem(type) {

}