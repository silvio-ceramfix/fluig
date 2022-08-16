function zoom(componente, idCampoTexto) {

	if( !editForm ){ return false; }
	
	var valor = null;
	console.log('Quee coisa....',idCampoTexto);
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
	console.log('Zoom.....',componente	);

	var campo = componente.split('___')[0];
	var row = componente.split('___')[1];
	
	if( componente == 'bt_user_repon'
		|| campo == 'bt_resp_acao_imed'
		|| campo == 'bt_resp_acao'
		|| campo == 'bt_user_verificacao' ){
		modalzoom.open("Resposável",
				   "colleague", 
				   "colleagueId,Matricula,colleagueName,Aprovador", 
				   "colleagueId,colleagueName", 
				   "",
				   componente, false, "default", null, null,
			       "colleagueName" );		
	}

	if( componente == 'bt_user_abert' ){
		modalzoom.open("Resposável Garantia",
				   "colleague", 
				   "colleagueId,Matricula,colleagueName,Aprovador", 
				   "colleagueId,colleagueName", 
				   "",
				   componente, false, "default", null, null,
			       "colleagueName" );		
	}	
	
	if (componente == 'bt_cliente'){
		modalzoom.open("Cliente",
				   "selectLogix", 
				   "num_cgc_cpf,C&oacutedigo,nom_cliente,Cliente,den_cidade,Cidade", 
				   "cod_cliente,num_cgc_cpf,nom_cliente,nom_reduzido,cod_cidade,den_cidade,cod_uni_feder", 
				   "table,fluig_v_clientes,sqlLimit,250",
				   componente, false, 'default', null, null,
				    "num_cgc_cpf||'-'||cod_cliente||'-'||nom_cliente" );
	}
	
	if (componente == 'bt_item_cab'){
		modalzoom.open("Item",
				   "selectLogix", 
				   "cod_item,C&oacutedigo,den_item,Item", 
				   "distinct,cod_item,den_item", 
				   "table,fluig_v_item,sqlLimit,250,cod_empresa,"+$('#empresa').val(),
				   componente, false, 'default', null, null,
				    "cod_item||'-'||den_item" );
	}
	
	if (componente == 'bt_motorista'){
		modalzoom.open("Motorista",
				   "selectLogix", 
				   "motorista,C&oacutedigo,nom_motorista,Motorista", 
				   "motorista,nom_motorista", 
				   "table,frt_motorista,sqlLimit,250",
				   componente, false, 'default', null, null,
				    "motorista||'-'||cod_cliente||'-'||nom_cliente" );
	}
	
	if (componente == 'bt_veiculo'){
		modalzoom.open("Veiculo",
				   "selectLogix", 
				   "placa,Placa,fabr_veiculo,Fabricante", 
				   "veiculo,placa,fabr_veiculo", 
				   "table,frt_motorista,sqlLimit,250,veiculo_tracionad,S",
				   componente, false, 'default', null, null,
				    "placa||'-'||fabr_veiculo" );
	}
	
	if (componente == 'bt_causa'){
		
		if( $('#task').val() != "6" 
		 && $('#task').val() != "8" ){
			return false;
		}
			
		modalzoom.open("Causa",
				   "causa_detalhe", 
				   "causa,Causa,detalhe,Detalhe", 
				   "causa,detalhe,id_causa,id_detalhe", 
				   "",
				   componente, false, 'default', null, null,
				    "" );
	}
	
	if (componente == 'bt_acao'){
		
		if( $('#task').val() != "12" ){
		 	return false;
		}
		
		modalzoomPF.open("Ação",
				   "seq_causa", 
				   "seq_causa,Seq,causa,Causa,detalhe,Detalhe,id_area,none,den_area_causa,Area,resumo_causa,Resumo", 
				   "cod_responsavel_causa,"+$('#user_atual').val(),
				   componente, "full" );
	}
	
	if( campo == 'addNF' ){
		
		if( $('#task').val() != "0" 
		 && $('#task').val() != "36"
		 && $('#task').val() != "2" ){
			return false;
		}
			
		
		modalzoom.open("NF",
				   "selectLogix", 
				   "item,Codigo,des_item,Item,dat_emissao_char,Data,nota_fiscal,NF,pedido,Pedido,lote,Lote,qtd_item,Quantidade", 
				   "empresa,dat_emissao_char,nota_fiscal,pedido,lote,qtd_item,item,des_item", 
				   "table,fluig_v_item_nf,sqlLimit,250,empresa,"+$('#empresa').val()+",cliente,"+$('#cod_cliente').val()+",order,dat_emissao desc",
				   componente, false, 'full', null, null,
				    "item||'-'||des_item||'-'||cast(nota_fiscal as char(10))" );			
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
		
}


function setSelectedZoomItem(selectedItem) {
	console.log('selectedItem...........',selectedItem);
	var seq = selectedItem.type.split('___')[1];			
	
	
	if (selectedItem.type == "bt_user_repon") {
		$('#cod_usuario_repon').val( selectedItem.colleagueId );
		$('#usuario_repon').val( selectedItem.colleagueName );
	}
	

	var campo = selectedItem.type.split('___')[0];
	var seq = selectedItem.type.split('___')[1];

	if (campo == "bt_resp_acao_imed") {
		$('#cod_resp_acao_imed___'+seq).val( selectedItem.colleagueId );
		$('#den_resp_acao_imed___'+seq).val( selectedItem.colleagueName );
	}

	if (campo == "bt_resp_acao") {
		$('#cod_resp_acao___'+seq).val( selectedItem.colleagueId );
		$('#den_resp_acao___'+seq).val( selectedItem.colleagueName );	
	}
	
	if (campo == "bt_user_verificacao") {
		$('#cod_usuario_verificacao').val( selectedItem.colleagueId );
		$('#usuario_verificacao').val( selectedItem.colleagueName );	
	}
	
	if (selectedItem.type == "bt_user_abert") {	
		$('#cod_usuario_abert').val( selectedItem.colleagueId );
		$('#usuario_abert').val( selectedItem.colleagueName );
	}
	
	if (selectedItem.type == "bt_motorista") {	
		$('#motorista').val( selectedItem.motorista );
		$('#nom_motorista').val( selectedItem.nom_motorista );
	}
	if (selectedItem.type == "bt_veiculo") {	
		$('#veiculo').val( selectedItem.veiculo );
		$('#placa').val( selectedItem.placa );
		$('#fabr_veiculo').val( selectedItem.fabr_veiculo );
	}

	if (selectedItem.type == "bt_item_cab") {		        
		$('#cod_item_cab').val( selectedItem.cod_item ) ;
		$('#den_item_cab').val( selectedItem.den_item ) ;
	}
	
	if (selectedItem.type == "bt_cliente") {		        
		$('#cnpj_cliente').val( selectedItem.num_cgc_cpf ) ;
		$('#cod_cliente').val( selectedItem.cod_cliente ) ;
		$('#nom_cliente').val( selectedItem.nom_cliente ) ;
		$('#cidade').val( selectedItem.den_cidade.trim()+"-"+selectedItem.cod_uni_feder.trim() ) ;
		$('#cod_cidade').val( selectedItem.cod_cidade ) ;
		$('#den_cidade').val( selectedItem.den_cidade ) ;
		$('#uf').val( selectedItem.cod_uni_feder ) ;
	}

	if (selectedItem.type == "bt_causa") {	
		
		var maxSeq = 0;
		$( "input[name*=seq_causa___]" ).each( function( index ) {
			var seqAtual = parseInt( $(this).val() );
			if( maxSeq < seqAtual){
				maxSeq = seqAtual;
			}
		});
		
		var seq = wdkAddChild(  'causa_detalhe' );
		$('#causa___'+seq).val( selectedItem.causa );
		$('#detalhe___'+seq).val( selectedItem.detalhe );
		$('#id_causa___'+seq).val( selectedItem.id_causa );
		$('#id_detalhe___'+seq).val( selectedItem.id_detalhe );
		$('#id_area___'+seq).val( selectedItem.id_area );
		$('#seq_causa___'+seq).val( maxSeq+1 );
		
		setAreaCausa('id_area___'+seq);
		setMask();
	}
	
	if (selectedItem.type == "bt_acao") {	
		
		var maxSeq = 0;
		$( "input[name*=seq_acao___]" ).each( function( index ) {
			var seqCpl = $(this).val();
			if( seqCpl.split('.')[0] ==  selectedItem.seq_causa ){
				var seqAtual = parseInt( seqCpl.split('.')[1] );
				if( maxSeq < seqAtual){
					maxSeq = seqAtual;
				}
			}
		});
		var seq = wdkAddChild( 'acao' );
		$('#seq_acao___'+seq).val( selectedItem.seq_causa+"."+(maxSeq+1) );
		$('#id_area_acao___'+seq).val( selectedItem.id_area );
		$('#id_area_acao_orig___'+seq).val( selectedItem.id_area );
		setArea('id_area_acao___'+seq);
		setMask();
		//setPermissaoLinha();
	}
	
	if( campo == 'addNF' ){
		seq = wdkAddChild( 'itens' );
		$('#num_nf___'+seq).val( selectedItem.nota_fiscal );
		$('#data_nf___'+seq).val( selectedItem.dat_emissao_char );
		$('#cod_item___'+seq).val( selectedItem.item );
		$('#den_Item___'+seq).val( selectedItem.des_item );
	}
	
	if ( selectedItem.type == 'bt_solicitante' ) {
		if( $('#origem_solic').val() == 'I' ){
			$('#nome_solicitante').val( selectedItem.ra_nome );
			$('#cod_solicitante').val( selectedItem.ra_mat );
			$('#cod_emp_solicitante').val( selectedItem.ra_filial );
		}
		if( $('#origem_solic').val() == 'C' ){
			$('#nome_solicitante').val( selectedItem.raz_social );
			$('#cod_solicitante').val( selectedItem.cod_repres );
			$('#cod_emp_solicitante').val( 'RE' );
		}
	}
	
	
}

function loadCCColab(matricula){
	var result = {};
	if( $.isNumeric(matricula) ){
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint( 'dataBase', 'java:/jdbc/SeniorDS', null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'table', 'fluig_v_funcionario', null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'sqlLimit', '250', '250', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'numcad', matricula, matricula, ConstraintType.MUST) );
		var fields = new Array('codccu','nomccu');
		var dataset = DatasetFactory.getDataset( 'selectTableSQLserver', fields, constraints, null);
		console.log('dataset.....',dataset);
		if ( dataset != null && dataset.values.length > 0 ){
			var ct = new Array();
			ct.push( DatasetFactory.createConstraint( 'cod_cc', dataset.values[0]['codccu'], dataset.values[0]['codccu'], ConstraintType.MUST) );
			var fd = new Array('cod_cc','den_cc','matricula_resp_garantia','nome_resp_garantia');
			var ds = DatasetFactory.getDataset( 'centro_de_custo', fd, ct, null);
			console.log('ds.....',ds);
			if ( ds == null || ds.values.length > 0 ){
				result['cod_cc'] = ds.values[0]['cod_cc'];
				result['den_cc'] = ds.values[0]['den_cc'];
				result['matricula_resp_garantia'] = ds.values[0]['matricula_resp_garantia']; 
				result['nome_resp_garantia'] = ds.values[0]['nome_resp_garantia'];
			}
		}
	}
	return result; 	
}
