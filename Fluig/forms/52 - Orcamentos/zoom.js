function zoomButton(componente) {

	if (componente == 'btEndereco') {

		modalzoom
				.open(
						"Endereco de Entrega",
						"endereco_entrega",
						"sequencia,Seq.,end_entrega_compl,Endereco",
						"cliente,tip_endereco,sequencia,tip_logradouro,logradouro,num_iden_lograd,complemento_endereco,bairro_cobr_entga,cod_cidade,den_cidade,cod_uni_feder,den_uni_feder,cod_pais,den_pais,cod_cep,num_cgc,ins_estadual,end_entrega_compl",
						"cliente," + $('#cod_cliente').val()
								+ ",cod_uni_feder," + $('#estado_ent').val(),
						componente, 'list', 'default', null, null,
						"end_entrega_compl");
	}
	
	if (componente == 'bt_repres') {

		modalzoom.open("Representante",
				   "representante", 
				   "cod_repres,Código,raz_social,Nome", 
				   "cod_repres,raz_social,nom_repres,nom_guerra", 
				   "",
				   componente, false, 'default', null, null,
				   "representante_compl" );
	}

}

function setSelectedZoomItem(selectedItem) {
	
	if (selectedItem.type == "bt_repres") {
		   $('#cod_repres').val( selectedItem.cod_repres ) ;
		   $('#raz_social').val( selectedItem.raz_social ) ;
		   $('#nom_repres').val( selectedItem.nom_repres ) ;
		   $('#nom_guerra').val( selectedItem.nom_guerra ) ;
		   $('#descricao').val( selectedItem.cod_repres+' - '+selectedItem.raz_social );  
		   $('#ecm-cardPublisher-documentDescription-input').val( selectedItem.raz_social ) ;
		   loadRepresCompl($('#cod_repres').val(), "", '1', 'TT', "");
		   reloadZoomFilterValues('cidade', '','');
		   
	}	

	if (selectedItem.inputName == 'den_item_edit') {
		$('#cod_item_edit').val(selectedItem.cod_item);
		$('#um_edit').val(selectedItem.cod_unid_med);

		loadItem($('#empresa').val(), selectedItem.cod_item, $('#lista_preco').val(), 'zoom');
	}
	
	if ( selectedItem.inputName == "cidade_ent" ){
		console.log('entrou na cidade entrega');
		$('#cod_cidade_ent').val( selectedItem.cod_cidade );
		$('#cep_ent').focus();
		loadBairro( selectedItem.cod_cidade, 'bairro_ent_sel' );
	}

	if (selectedItem.inputName == 'razao_social_zoom') {
		$('#cod_cliente').val(selectedItem.cod_cliente);
		loadCliente(selectedItem.cod_cliente);
		console.log('$(#cod_repres).val().....', $('#cod_repres').val());
		loadRepresCompl($('#cod_repres').val(), selectedItem.cod_cliente, $('#cod_moeda_cli').val()+ "", 'TT', $('#cod_tip_cli').val() + "");
		loadRepres($('#cod_repres').val());
		setValidadeOrcamento();
	}

	if (selectedItem.inputName == 'transportadora') {
		$('#cod_trans').val(selectedItem.cod_cliente);
		$('#cnpj_trans').val(
				loadCampoDataSet('clientes_logix', 'cod_cliente',
						selectedItem.cod_cliente, 'CNPJ'));
	}

	if (selectedItem.inputName == 'cidade') {
		$('#cod_cidade').val(selectedItem.cod_cidade);
		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint("cod_cidade",
				selectedItem.cod_cidade, selectedItem.cod_cidade,
				ConstraintType.MUST));
		/*constraints.push(DatasetFactory
				.createConstraint("cod_user", $("#userFluig").val(), $(
						"#userFluig").val(), ConstraintType.MUST));*/
		var dataset = DatasetFactory.getDataset('cidades', null,
				constraints, null);
		if (dataset != null) {
			for (var x = 0; x < dataset.values.length; x++) {
				var row = dataset.values[x];
				console.log('Console.....', row);
				$('#pais_ent').val(
						loadCampoDataSet('paises', 'cod_pais', row.COD_PAIS,
								'DEN_PAIS'));
				$('#cod_pais_ent').val(row.COD_PAIS);
				$('#estado_ent').val(row.COD_UNI_FEDER);
			}
		}
		
		if ($('#tipoCadUser').val() == "A"){
			$('#cod_cidade').val(selectedItem.cod_cidade);
			var constraints = new Array();
			constraints.push(DatasetFactory.createConstraint("cod_cidade",
					selectedItem.cod_cidade, selectedItem.cod_cidade,
					ConstraintType.MUST));
			/*constraints.push(DatasetFactory
					.createConstraint("cod_user", $("#userFluig").val(), $(
							"#userFluig").val(), ConstraintType.MUST));*/
			var dataset = DatasetFactory.getDataset('cidades', null,
					constraints, null);
			if (dataset != null) {
				for (var x = 0; x < dataset.values.length; x++) {
					var row = dataset.values[x];
					console.log('Console.....', row);
					$('#pais_ent').val(
							loadCampoDataSet('paises', 'cod_pais', row.COD_PAIS,
									'DEN_PAIS'));
					$('#cod_pais_ent').val(row.COD_PAIS);
					$('#estado_ent').val(row.COD_UNI_FEDER);
				}
			}
		}
	}

	if (selectedItem.type == 'btEndereco') {

		console.log('Tipo....', selectedItem.tip_logradouro);
		$('#tipo_logradouro_ent').val(selectedItem.tip_logradouro);
		$('#endereco_ent').val(selectedItem.logradouro);
		$('#seq_end').val(selectedItem.sequencia);

		if ($.isNumeric(selectedItem.num_iden_lograd))
			$('#sem_numero_ent').prop('checked', false);
		else
			$('#sem_numero_ent').prop('checked', true);
		setSemNumero($('#sem_numero_ent').attr('id'), 'numero_ent');

		if ($.isNumeric(selectedItem.num_iden_lograd))
			$('#numero_ent').val(selectedItem.num_iden_lograd);

		$('#cod_cidade_ent').val(selectedItem.cod_cidade);
		$('#complemento_ent').val(selectedItem.complemento_endereco);

		console.log(selectedItem.complemento_endereco);

		var zoomDestino = {};

		// selectedItem.den_cidade

		console.log('cidade', 'xx'
				+ loadCampoDataSet('cidades', 'cod_cidade',
						selectedItem.cod_cidade, 'DEN_CIDADE').trim() + 'XX');
		// var objDestino = { inputId:'cidade_ent', inputName:'cidade_ent',
		// cod_cidade:selectedItem.cod_cidade, den_cidade:loadCampoDataSet(
		// 'cidades', 'cod_cidade', selectedItem.cod_cidade, 'DEN_CIDADE'
		// ).trim() };
		zoomDestino = window[$("#cidade_ent").attr('filter-instance')];
		zoomDestino.setValue(loadCampoDataSet('cidades', 'cod_cidade',
				selectedItem.cod_cidade, 'DEN_CIDADE').trim());

		$('.tt-input').each(function() {
			$(this).css('width', $(this).width() - 5);
		});

		$('#cep_ent').val(selectedItem.cod_cep);

		loadBairro(selectedItem.cod_cidade, 'bairro_ent_sel');
		$('#bairro_ent_sel').val(selectedItem.bairro_cobr_entga);
		if ($('#bairro_ent_sel').val() == undefined
				|| $('#bairro_ent_sel').val() == null
				|| $('#bairro_ent_sel').val() == '') {
			$('#bairro_ent').val(selectedItem.bairro_cobr_entga);
			$("#ies_bairro_ent_manual").prop("checked", true);
		}
		alteraCampos('ies_bairro_ent_manual', 'bairro_ent_sel', 'bairro_ent');

		$('#cnpj_ent').val(selectedItem.num_cgc.trim());

		console.log(' mascaras........', mascaraIE);
		console.log(' 11........', mascaraIE[$('#estado_ent').val()]);

		var eiNum = '';
		if (selectedItem.ins_estadual != null)
			eiNum = selectedItem.ins_estadual.replace(/[^0-9]/g, '');
		console.log('IE...' + eiNum + ' ' + selectedItem.ins_estadual);
		if (eiNum == '') {
			$('#isento_ie_ent').prop('checked', true);
			setIsento('isento_ie_ent', 'ie_ent', 'estado_ent');
		} else {
			$('#isento_ie_ent').prop('checked', false);
			setIsento('isento_ie_ent', 'ie_ent', 'estado_ent');
			$('#ie_ent').val(selectedItem.ins_estadual);
			if ($('#estado_ent').val() != '') {
				// setMaskIE( $('#estado_ent').val( ), 'ie_ent' )
				$('#ie_ent').mask(mascaraIE[$('#estado_ent').val()]);
			}
		}

	}

}

function loadPedidoEdit(empresa, pedido) {

	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint('dataBase',
			'java:/jdbc/LogixPRD', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('table',
			'eis_v_fluig_ped_aberto@tst', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('cod_empresa', empresa,
			empresa, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('num_pedido', pedido,
			pedido, ConstraintType.MUST));

	var fields = new Array('cod_empresa', 'den_reduz', 'cod_cliente',
			'nom_cliente', 'nom_reduzido', 'num_pedido', 'dat_pedido',
			'qtd_saldo', 'val_pedido', 'cod_repres', 'cod_nat_oper',
			'tip_frete');
	var order = new Array();

	var datasetReturned = DatasetFactory.getDataset("selectTable", fields,
			constraints, order);

	if (datasetReturned != null && datasetReturned.values != null
			&& datasetReturned.values.length > 0) {
		var selectedItem = datasetReturned.values[0];
		console.log(selectedItem);
		selectedItem.type = 'btPedido';
		setSelectedZoomItem(selectedItem);
	}
}

function getPrecoListaItem(codEmpresa, numLista, codItem, codAen1, codAen2,
		codAen3, codAen4, codCliente, codUF, codCond, codGrupo, codAcabam) {

	console.log('entrou da busca', codEmpresa, numLista, codItem, codAen1,
			codAen2, codAen3, codAen4, codCliente, codUF, codCond, codGrupo,
			codAcabam);

	var result = {};
	result['PRE_UNIT'] = 0.00;
	result['PRE_UNIT_MOEDA'] = 0.00;
	result['PCT_DESC_ADIC'] = 0.00;

	var consAcesso = new Array();
	consAcesso.push(DatasetFactory.createConstraint('num_list_preco', numLista,
			numLista, ConstraintType.MUST));
	var orderAcesso = new Array();
	orderAcesso.push('sequencia');

	var datasetAcesso = DatasetFactory.getDataset('lista_de_preco_acesso',
			null, consAcesso, orderAcesso);

	console.log('busca acesso', datasetAcesso);

	if (datasetAcesso != null) {
		for (var x = 0; x < datasetAcesso.values.length; x++) {

			var acess = parseInt(datasetAcesso.values[x].SEQUENCIA);

			console.log('		', x, acess);

			var constraints = new Array();
			constraints.push(DatasetFactory.createConstraint('cod_empresa',
					codEmpresa, codEmpresa, ConstraintType.MUST));
			constraints.push(DatasetFactory.createConstraint('num_list_preco',
					numLista, numLista, ConstraintType.MUST));

			// UF

			if ([ 14, 16, 17, 18, 19, 20 ].indexOf(acess) > -1) {
				constraints.push(DatasetFactory.createConstraint(
						'cod_uni_feder', codUF, codUF, ConstraintType.MUST));
			} else {
				constraints.push(DatasetFactory.createConstraint(
						'cod_uni_feder', '#', '#', ConstraintType.MUST));
			}
			// CLIENTE
			if ([ 1, 2, 4, 6, 9, 10, 11, 12, 13 ].indexOf(acess) > -1) {
				constraints.push(DatasetFactory.createConstraint('cod_cliente',
						codCliente, codCliente, ConstraintType.MUST));
			} else {
				constraints.push(DatasetFactory.createConstraint('cod_cliente',
						'#', '#', ConstraintType.MUST));
			}

			// AEN N1
			if ([ 9, 10, 11, 12, 16, 17, 18, 19, 21, 22, 23, 24 ]
					.indexOf(acess) > -1) {
				constraints.push(DatasetFactory.createConstraint(
						'cod_lin_prod', codAen1, codAen1, ConstraintType.MUST));
			} else {
				constraints.push(DatasetFactory.createConstraint(
						'cod_lin_prod', '0', '0', ConstraintType.MUST));
			}
			// AEN N2
			if ([ 9, 10, 11, 16, 17, 18, 21, 22, 23 ].indexOf(acess) > -1) {
				constraints
						.push(DatasetFactory.createConstraint('cod_lin_recei',
								codAen2, codAen2, ConstraintType.MUST));
			} else {
				constraints.push(DatasetFactory.createConstraint(
						'cod_lin_recei', '0', '0', ConstraintType.MUST));
			}
			// AEN N3
			if ([ 9, 10, 16, 17, 21, 22 ].indexOf(acess) > -1) {
				constraints.push(DatasetFactory.createConstraint(
						'cod_seg_merc', codAen3, codAen3, ConstraintType.MUST));
			} else {
				constraints.push(DatasetFactory.createConstraint(
						'cod_seg_merc', '0', '0', ConstraintType.MUST));
			}
			// AEN N4
			if ([ 9, 16, 21 ].indexOf(acess) > -1) {
				constraints.push(DatasetFactory.createConstraint('cod_cla_uso',
						codAen4, codAen4, ConstraintType.MUST));
			} else {
				constraints.push(DatasetFactory.createConstraint('cod_cla_uso',
						'0', '0', ConstraintType.MUST));
			}

			// ITEM
			console.log('Anter o M', acess);
			if ([ 1, 2, 5, 6, 8, 14, 15 ].indexOf(acess) > -1) {
				console.log('Entrei o M', codItem);
				constraints.push(DatasetFactory.createConstraint('cod_item',
						codItem, codItem, ConstraintType.MUST));
			} else {
				constraints.push(DatasetFactory.createConstraint('cod_item',
						'#', '#', ConstraintType.MUST));
			}
			/*
			 * //GRUPO if ( [3,4,5,6,7,8].indexOf( acess ) > -1 ){
			 * constraints.push( DatasetFactory.createConstraint( 'cod_grupo',
			 * codGrupo, codGrupo, ConstraintType.MUST) ); }else{
			 * constraints.push( DatasetFactory.createConstraint( 'cod_grupo',
			 * '0','0', ConstraintType.MUST) ); } // Acabam if (
			 * [3,4,5,6,7,8].indexOf( acess ) > -1 ){ constraints.push(
			 * DatasetFactory.createConstraint( 'cod_acabam', codAcabam,
			 * codAcabam, ConstraintType.MUST) ); }else{ constraints.push(
			 * DatasetFactory.createConstraint( 'cod_acabam', '0', '0',
			 * ConstraintType.MUST) ); } // Cond Pagamento if ( [2].indexOf(
			 * acess ) > -1 ){ constraints.push(
			 * DatasetFactory.createConstraint( 'cod_cnd_pgto', codCond,
			 * codCond, ConstraintType.MUST) ); }else{ constraints.push(
			 * DatasetFactory.createConstraint( 'cod_cnd_pgto', '0', '0',
			 * ConstraintType.MUST) ); }
			 */
			console.log('Antes loop', constraints);

			// Busca o dataset
			var dataset = DatasetFactory.getDataset('lista_de_preco_item_desc',
					null, constraints, null);
			console.log('Data SET', dataset);
			if (dataset != null) {
				for (var i = 0; i < dataset.values.length; i++) {
					console.log(dataset);
					console.log('Valor SET', dataset.values[i]);
					var row = dataset.values[i];
					var val = {};
					var cotacao = fieldFloat( 'cotacao', 1 );
					if( cotacao == 0 ){
						cotacao = 1;
					}
					val['PRE_UNIT'] = row['PRE_UNIT'] /* cotacao*/;
					val['PRE_UNIT_MOEDA'] = row['PRE_UNIT']
					val['PCT_DESC_ADIC'] = row['PCT_DESC_ADIC'];
					return val;
				}
			}
		}
	}
	return result;
}

function setMoeda(){
	
	if( setLista() ){
	
		var ct = new Array();
		ct.push( DatasetFactory.createConstraint("cod_moeda", $('#moeda').val(), $('#moeda').val(), ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("table", 'fluig_v_moeda_cotacao', null, ConstraintType.MUST) );
		var ds = DatasetFactory.getDataset('selectLogix', null, ct, null );
		
		if( ds != null ){
			$('#cotacao').val( ds.values[0]['VAL_COTACAO'].replace('.',',') );
		}
		
		if( $('#moeda').val() != '1' ){
			$('.lbl_moeda').show();
		}else{
			$('.lbl_moeda').hide();
		}
		
	}
	
}

function buscaItem(id) {

	if ($('#' + id).val() == '') {
		clearItem('cod_item');
	}
	console.log('NOVO.......' + id);
	console.log('NOVO.......' + $('#' + id).val());
	console.log('Antes Item....', $('#lista_preco').val());
	loadItem($('#empresa').val(), $('#' + id).val(), $('#lista_preco').val(),
			'field');
	// $('#cod_item_zoom_edit').val( $('#'+id).val() );
}

function loadBairro(cidade, campoBairro) {
	// Cria as constraints para buscar os campos filhos, passando o tablename,
	// nÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂºmero
	// da
	// formulÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¡rio
	// e
	// versÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ£o
	var c1 = DatasetFactory.createConstraint("cod_cidade", cidade, cidade,
			ConstraintType.MUST);
	var constraints = new Array(c1);
	var order = new Array('DEN_BAIRRO');
	// Busca o dataset
	var dataset = DatasetFactory
			.getDataset('bairros', null, constraints, order);
	if (dataset != null) {
		$("#" + campoBairro + " option").remove();
		$("#" + campoBairro).append("<option value='' ></option>");
		for (var x = 0; x < dataset.values.length; x++) {
			var row = dataset.values[x];
			$("#" + campoBairro).append(
					"<option value='" + row['COD_BAIRRO'] + "' >"
							+ row['DEN_BAIRRO'] + "</option>");
		}
	}
}


function loadPerguntas(){
	
	if( $('#tipo_frete').val() == "RET" ){
		return false;
	}
	
	var row = 0;
	$( "input[name^=cod_pergunta___]" ).each(function( index ) {
		row += 1;
	});
	if( row != 0 ){
		return false;
	}
	
	var dsTeste = getDsPaiFilho( "tipo_cliente_perguntas", "tipo_perguntas", "", "cod_tip_cli", $('#cod_tip_cli').val() );
	if( dsTeste == null ){
		return false;
	}
	if( dsTeste.values.length == 0 ){
		return false;
	}
	
	var cons = new Array();
	cons.push( DatasetFactory.createConstraint('cod_tip_cli', $('#cod_tip_cli').val(), $('#cod_tip_cli').val(), ConstraintType.MUST) );
	var tipoPergunta = DatasetFactory.getDataset('tipo_cliente_perguntas', null, cons, null );
	
	if(tipoPergunta.values.length > 0){
		$("#ies_end_entrega").val( tipoPergunta.values[0].ies_end_entrega ) ;
	}
	
	
	var lstTeste = dsTeste.values;
	for ( var y in lstTeste ) {
		var teste = lstTeste[y];

		var row = wdkAddChild('perguntas');
		
		console.log('Add row ....' , row )
		$('#cod_pergunta___'+row).val( teste.cod_pergunta ) ;
		
		var cons = new Array();
		cons.push( DatasetFactory.createConstraint('cod_pergunta', teste.cod_pergunta, teste.cod_pergunta, ConstraintType.MUST) );
		var dsTesteCpl = DatasetFactory.getDataset('perguntas', null, cons, null );
		console.log('dsTesteCpl',dsTesteCpl);
		
		var tipo_teste = 'I';
		
		
		$('#tipo_pergunta___'+row).val( dsTesteCpl.values[0].tipo_pergunta ) ;
		$('#den_pergunta___'+row).val( teste.den_pergunta ) ;
		
		if( dsTesteCpl != undefined && dsTesteCpl != null ){
			tipo_teste = dsTesteCpl.values[0].tipo_pergunta;
			num_precisao = dsTesteCpl.values[0].num_precisao;
			cod_um = dsTesteCpl.values[0].cod_um;
		}
		
		console.log('tipo_teste.....',tipo_teste);
		if( tipo_teste == 'O' ){
			$('#opcao___'+row).show();
			$('#informado___'+row).hide();
			$('#metrica___'+row).hide();
				
			var dsOpcoes = getDsPaiFilho( "perguntas", "opcoes_pergunta", "", "cod_pergunta", teste.cod_pergunta );
			if( dsOpcoes != undefined && dsOpcoes != null ){
				var lstOpcoes = dsOpcoes.values;
				var aTemObs = [];
				$('#opcao___'+row).append("<option value='' ></option>");
				for ( var i in lstOpcoes ) {
					var opcoes = lstOpcoes[i];
					console.log('opcoes',opcoes);
					$('#opcao___'+row).append("<option value='"+ opcoes.cod_opcao +"' >"+ opcoes.den_opcao.toUpperCase() +"</option>");
				}
			}
		}else{
			$('#opcao___'+row).hide();								
			if( tipo_teste == 'M' ){
				$('#metrica___'+row).show();
				$('#informado___'+row).hide();
				
				$('#num_precisao___'+row).val( dsTesteCpl.values[0].num_precisao );
				$('#cod_um___'+row).val( dsTesteCpl.values[0].cod_um );
				
				num_precisao = parseInt( dsTesteCpl.values[0].num_precisao.split(',')[0]  );
				$('#metrica___'+row).maskMoney( {precision : num_precisao, thousands : '.',decimal : ',', defaultZero : false, allowZero : true });	
				
			}else{
				$('#metrica___'+row).hide();
				$('#informado___'+row).show();
			}
		}
	}
	
	setUpper();
}


function loadCampoDataSet(denDataSet, campo, valor, campoRetorno) {
	console.log('inicio..... loadCampoDataSet');
	
	var c1 = DatasetFactory.createConstraint(campo, valor, valor,
			ConstraintType.MUST);
	console.log('loadCampoDataSet ', campo, valor, denDataSet);
	
	var constraints = new Array(c1);
	console.log('constrait ');
	// Busca o dataset
	var dataset = DatasetFactory
			.getDataset(denDataSet, null, constraints, null);
	console.log('dataset ');
	if (dataset != null) {
		console.log('dataset ');
		
		for (var x = 0; x < dataset.values.length; x++) {
			console.log('loadCampoDataSet.... ' + 1);
			
			var row = dataset.values[x];
			return row[campoRetorno];
		}
	}
	console.log('fim..... loadCampoDataSet');
	
	return ' ';

}

function loadPaiFilhoCombo(combo, dataSet, table, idDocPai, versionDocPai,
		fieldCodigo, fieldDesc, fieldFlag, fildFilter, fildFilterValue) {

	console.log(combo, dataSet, table, idDocPai, versionDocPai, fieldCodigo,
			fieldDesc, fieldFlag, fildFilter, fildFilterValue);

	var constraintsFilhos = new Array();
	constraintsFilhos.push(DatasetFactory.createConstraint("tablename", table,
			table, ConstraintType.MUST));
	constraintsFilhos.push(DatasetFactory.createConstraint("metadata#id",
			idDocPai, idDocPai, ConstraintType.MUST));
	constraintsFilhos.push(DatasetFactory.createConstraint("metadata#version",
			versionDocPai, versionDocPai, ConstraintType.MUST));
	// constraintsFilhos.push(
	// DatasetFactory.createConstraint("metadata#active", true, true,
	// ConstraintType.MUST) );
	if (fildFilter != '' && fildFilter != null) {
		console.log(' FILTRO ESP........ ', fildFilter, fildFilterValue);
		constraintsFilhos.push(DatasetFactory.createConstraint(fildFilter,
				fildFilterValue, fildFilterValue, ConstraintType.MUST));
		console.log(' FILTRO ESP........ ', constraintsFilhos);
	}

	var orderFilhos = new Array();
	orderFilhos.push(fieldCodigo);
	var datasetFilhos = DatasetFactory.getDataset(dataSet, null,
			constraintsFilhos, orderFilhos);
	console.log('DataSet', datasetFilhos);
	if (datasetFilhos != null) {
		var valDefault = "";
		console.log('ANTES TESTE VALOR DEFAULT.....', $("#" + combo).val());
		if ($("#" + combo).val() != "" && $("#" + combo).val() != null) {
			valDefault = $("#" + combo).val();
			console.log('TEM VALOR DEFAULT Jah EXISTEMTE.....', valDefault);
		}
		$("#" + combo + " option").remove();
		var filhos = datasetFilhos.values;
		console.log('DataSet', datasetFilhos);
		console.log('DataSet', filhos);
		
		// if ( dataset != null && dataset.values.length > 0 ){ }
		for ( var i in filhos) {

			console.log('Linha DataSet.....', i);
			

			var filho = filhos[i];
			var den = '';

			console.log(filho[fieldFlag]);
			
			if (valDefault == "" && filho[fieldFlag]) {
				valDefault = filho[fieldCodigo];
			}

			if ($.inArray(filho[fieldCodigo], getOptCombo(combo)) > -1) {
				continue;
			}
			
			if (fieldDesc == '') {
				den = filho[fieldCodigo];
			} else {
				den = filho[fieldCodigo] + ' - ' + filho[fieldDesc];
			}
			
			console.log("<option value='" + filho[fieldCodigo] + "' >" + den
					+ "</option>");
			$("#" + combo).append(
					"<option value='" + filho[fieldCodigo] + "' >" + den
							+ "</option>");

		}
		console.log('antes de setar valor.....', valDefault, $("#" + combo)
				.val());
		$("#" + combo).val(valDefault);
		console.log('depois de setar valor.....', valDefault, $("#" + combo)
				.val());
	}
}

function getOptCombo(combo) {

	var optArray = new Array();
	$("#" + combo + " option").each(function() {
		optArray.push($(this).val());
	});
	return optArray;
}

function loadDataSetCombo(combo, dataSet, fieldCodigo, fieldDesc, fildFilter,
		fildFilterValue, fieldFlag, clear) {

	console.log('Passo 001');

	var constraintsFilhos = new Array();
	var lstFilter = fildFilter.split(',');
	var lstFilterValue = fildFilterValue.split(',');
	for (var j = 0; j < lstFilter.length; j++) {
		console.log('Passo 00X', lstFilter[j], lstFilterValue[j]);
		if (lstFilter[j] != '' && lstFilter[j] != null) {
			constraintsFilhos.push(DatasetFactory.createConstraint(
					lstFilter[j], lstFilterValue[j], lstFilterValue[j],
					ConstraintType.MUST));
		}
	}
	var orderFilhos = new Array();
	orderFilhos.push(fieldCodigo);
	var datasetFilhos = DatasetFactory.getDataset(dataSet, null,
			constraintsFilhos, orderFilhos);
	if (datasetFilhos != null) {

		var valDefault = "";
		console.log('ANTES TESTE VALOR DEFAULT.....', $("#" + combo).val());
		if ($("#" + combo).val() != "" && $("#" + combo).val() != null
				&& $("#" + combo).val() != undefined) {
			valDefault = $("#" + combo).val();
			console.log('TEM VALOR DEFAULT Jah EXISTEMTE.....', valDefault);
		}
		if (clear == 'S') {
			$("#" + combo + " option").remove();
		}
		var filhos = datasetFilhos.values;
		console.log('Passo 002');
		// $("#empresa").append("<option value='' ></option>");
		// var valDefault = '';
		for ( var i in filhos) {
			var filho = filhos[i];
			console.log('Passo 002', filho[fieldCodigo]);
			var den = '';
			// if ( valDefault == '' ){
			// valDefault = filho[ fieldCodigo ];
			// }
			console.log(filho[fieldFlag]);
			if (valDefault == ""
					&& (filho[fieldFlag] || filho[fieldFlag] == 'on')) {
				valDefault = filho[fieldCodigo];
			}

			console.log('Passo 002 A', $.inArray(filho[fieldCodigo],
					getOptCombo(combo)));
			if ($.inArray(filho[fieldCodigo], getOptCombo(combo)) > -1) {
				continue;
			}

			if (fieldDesc == '') {
				den = filho[fieldCodigo];
			} else {
				den = filho[fieldCodigo] + ' - ' + filho[fieldDesc];
			}
			$("#" + combo).append(
					"<option value='" + filho[fieldCodigo] + "' >" + den
							+ "</option>");
			console.log('Apende 003', filho[fieldCodigo]);
		}
		console.log('valDefault.......', valDefault);
		if (valDefault != '') {
			$("#" + combo).val(valDefault);
		}
	}

}

function loadItem(codEmpresa, codItem, numLista, origem) {

	if ($('#cod_item_zoom_edit').val() == $('#cod_item_edit').val()) {
		return false;
	} else {
		$('#cod_item_zoom_edit').val($('#cod_item_edit').val());
	}

	// We can show the message of loading
	console.log("t Antes do load..... ", codEmpresa, codItem, numLista);

	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("cod_empresa", codEmpresa,
			codEmpresa, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("cod_item", codItem,
			codItem, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("num_list_preco",
			numLista, numLista, ConstraintType.MUST));

	var dataset = DatasetFactory.getDataset('lista_de_preco_item', null,
			constraints, null);

	console.log("load..... " + dataset);

	if (dataset != null && dataset.values.length > 0) {
		for (var x = 0; x < dataset.values.length; x++) {

			var row = dataset.values[x];

			console.log("linha..... " + row);

			if (origem == 'field') {
				// var objDestino = { inputId:'den_item_edit',
				// inputName:'den_item_edit', cod_item:row.COD_ITEM,
				// den_item:row.DEN_ITEM };
				zoomDestino = window[$("#den_item_edit")
						.attr('filter-instance')];
				zoomDestino.setValue(row.DEN_ITEM);
			}

			$('#peso_edit').val(row.PES_UNIT);
			console.log('cubagem ',row.CUBAGEM);
			$('#cubagem_edit').val( String( row.CUBAGEM.toFixed(6)).replace('.',',') );
			$('#qtd_pad_edit').val(row.QTD_PADR_EMBAL);

			$('#cod_lin_prod_edit').val(row.COD_LIN_PROD);
			$('#cod_lin_recei_edit').val(row.COD_LIN_RECEI);
			$('#cod_seg_merc_edit').val(row.COD_SEG_MERC);
			$('#cod_cla_uso_edit').val(row.COD_CLA_USO);
			$('#cod_grupo_item_edit').val(row.COD_GRUPO_ITEM);
			$('#cod_tip_carteira_edit').val(row.COD_TIP_CARTEIRA);
			$('#den_item_reduz_edit').val(row.DEN_ITEM_REDUZ);
			$('#ies_mix_edit').val(row.MIX_PRODUTO);

			$('#um_edit').val(row.COD_UNID_MED);
			var preco = getPrecoListaItem(codEmpresa, numLista, codItem,
					row.COD_LIN_PROD, row.COD_LIN_RECEI, row.COD_SEG_MERC,
					row.CLA_USO_EDIT, $('#cod_cliente').val(), $('#estado_ent')
							.val(), $('#cond_pagamento').val(),
					row.COD_GRUPO_ITEM, row.COD_TIP_CARTEIRA);
			console.log('Preco... ', preco);
			$('#valor_unit_edit').val(String(preco['PRE_UNIT'].toFixed(3)).replace('.', ','));
			$('#valor_unit_lista_edit').val( String(preco['PRE_UNIT'].toFixed(3)).replace('.', ',') );
			$('#valor_unit_moeda_edit').val( String(preco['PRE_UNIT_MOEDA'].toFixed(3)).replace('.', ',') );
			$('#pct_desc_adic_edit').val( String(preco['PCT_DESC_ADIC'].toFixed(3)).replace('.', ','));

			$('#data_entrega_edit').val($('#data_coleta').val());
			$('#pedido_cli_edit').val($('#ped_cliente').val());

			// $('#quantidade_edit').focus();
			if (preco['PRE_UNIT'] == 0) {
				FLUIGC
						.toast({
							title : 'Preco: ',
							message : 'Valor para item nao localizado na tabela de precos.',
							type : 'danger',
							timeout : 'slow'
						});
				setTimeout("$('#valor_unit_edit').focus();", 1);
			} else {
				setTimeout("$('#quantidade_edit').focus();", 1);
			}

		}
	} else {
		FLUIGC.toast({
			title : 'Busca: ',
			message : 'Item n&atilde;o localizado!',
			type : 'warning',
			timeout : 'fast'
		});
		// $('#cod_item').focus();
		setTimeout("$('#cod_item_edit').focus();", 1);
	}
}

function loadCliente(codCliente) {

	// We can show the message of loading
	console.log("t Antes do load..... " + codCliente);
	loadingPrincipial.show();

	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("cod_cliente", codCliente,
			codCliente, ConstraintType.MUST));
	var dataset = DatasetFactory.getDataset('clientes_logix', null,
			constraints, null);

	if (dataset != null) {

		for (var x = 0; x < dataset.values.length; x++) {



			var row = dataset.values[x];
			console.log('Console.....', row);

			$('#cnpj').val(row.CNPJ.trim());

			$('#cod_repres').val(row.COD_REPRES);
			$('#raz_social').val(row.RAZ_SOCIAL);

			$('#pais_ent').val(loadCampoDataSet('paises', 'cod_pais', row.COD_PAIS,	'DEN_PAIS'));
			$('#cod_pais_ent').val(row.COD_PAIS);
			$('#estado_ent').val(row.COD_UNI_FEDER);

			$('#cod_class').val(row.COD_CLASS);
			$('#eh_contribuinte').val(row.EH_CONTRIBUINTE);
			$('#aprovacao_cre').val(row.APROVACAO_CRE.trim());
			$('#ins_estadual').val(row.INS_ESTADUAL.trim());
			$('#cod_tip_carteira_cli').val(row.COD_TIP_CARTEIRA);

			$('#pct_desc_financ').val((row.PCT_DESC_FIN).replace('.', ','));

			$('#cod_moeda_cli').val(row.MOEDA);
			$('#cod_tip_cli').val(row.COD_TIP_CLI);
			$('#ies_tip_fornec').val(row.IES_TIP_FORNEC);
			
			$('#cli_exc_mix').val(row.CLI_EXC_MIX);
			
			if (row.COD_CLASS == 'U') {
				$('#uso_consumo').val('S');
			}
			$('#uso_consumo option:not(:selected)').prop('disabled', true);
			
			if (row.EH_CONTRIBUINTE == 'N' || row.INS_ESTADUAL.trim() == null || row.INS_ESTADUAL.trim() == '' || row.INS_ESTADUAL.trim() == 'ISENTO' || row.INS_ESTADUAL.trim() == 'isento') {
				$('#ies_isento_ie').val('S');
			}
			$('#ies_isento_ie option:not(:selected)').prop('disabled', true);

			// tratamento para que quando o canal for engenharia permita
			// selecionar qualquer cidade
			var tipoCli = $('#cod_tip_cli').val();
			console.log('tipo ', tipoCli);
			var constraintsPai = new Array();
			constraintsPai.push(DatasetFactory.createConstraint("cod_tip_cli",	tipoCli, tipoCli, ConstraintType.MUST));

			var datasetPai = DatasetFactory.getDataset("tipo_cliente", null, constraintsPai, null);

			if (datasetPai != null) {
				for (var x = 0; x < datasetPai.values.length; x++) {
					console.log(datasetPai);
					var per_sel_cidades = 'N';
					per_sel_cidades = datasetPai.values[x].PER_SEL_CIDADES;
					console.log(per_sel_cidades);
					if (per_sel_cidades == null || per_sel_cidades == '') {
						per_sel_cidades = 'N';
					}
					per_sel_cidades = per_sel_cidades.trim();
					if (per_sel_cidades == 'S') {
						console.log('entrou em cidades');
						$('#per_sel_cidades').val('S');
						// setFilterCidade( 'cidade', '', '' );
					} else {
						$('#per_sel_cidades').val('N');
						// setFilterCidade( 'cidade', 'userFluig', 'cod_repres'
						// );
					}
				}
			} else {
				$('#per_sel_cidades').val('N');
			}

			// fim tratamento para que quando o canal for engenharia permita
			// selecionar qualquer cidade
			var per_sel_cidades = $('#per_sel_cidades').val();

			$('#cei').val(row.CEI);
			$('#ies_inf_pedido').val(row.IES_INF_PEDIDO);

			$('#cod_cidade').val(row.COD_CIDADE);
			
			//tratamento do campo finalidade
			
			
			var insEstadual = $('#ins_estadual').val().replace("[^0-9]", "").trim();
			var codClass = $('#cod_class').val().trim();
			var iesTipFornec = $('#ies_tip_fornec').val().trim(); 
			var ehContribuinte = $('#eh_contribuinte').val().trim();
			
			console.log("## INSCRICAO ## " , insEstadual);
			console.log("## COD_CLASS ## " , codClass);
			
			var finalidade = "1";
			
			console.log("## FINALIDADE ## 0001");
			
			if (iesTipFornec == "I"
					&& (insEstadual == "" || insEstadual == null || insEstadual == "ISENTO")) {
				finalidade = "3";
				$('#ies_finalidade').val(finalidade);
				console.log("## FINALIDADE ## 0004");
				
			} else if ((codClass != "U" || codClass != "u") 
						&& (insEstadual == "" || insEstadual == null || insEstadual == "ISENTO")  
						&& ((ehContribuinte) == 'S')){
								finalidade = "1";
								$('#ies_finalidade').val(finalidade);
								console.log("## FINALIDADE ## 0005");
			} else if (insEstadual == "" || insEstadual == null
					|| insEstadual == "ISENTO") {
				finalidade = "2";
				$('#ies_finalidade').val(finalidade);
				console.log("## FINALIDADE ## 0002");
			} else if ((codClass) == "U" && insEstadual != "" && insEstadual != null && insEstadual != "ISENTO" && (ehContribuinte) == 'N'){
					finalidade = '2';
					$('#ies_finalidade').val(finalidade);
					console.log('## FINALIDADE ## 0004');
			} else if ((codClass == "U" || codClass == "u")
					&& (insEstadual != "" || insEstadual != null || insEstadual != "ISENTO")) {
					finalidade = "3";
					$('#ies_finalidade').val(finalidade);
					console.log("## FINALIDADE ## 0003");
			}


			var emailorc = '';
			emailorc = row.EMAIL.replace('#', '');
			$('#emailOrc').val(emailorc.trim());


			var zoomDestino = {};
			zoomDestino = window[$("#cidade").attr('filter-instance')];
			zoomDestino.setValue(loadCampoDataSet('cidades', 'cod_cidade', row.COD_CIDADE, 'DEN_CIDADE'));
			zoomDestino.disable(true);

		}
	} else {
		alert('Nao retornou dados do cliente.');
	}

}

function loadRepres(cod_repres) {

	console.log("## Repres ## " + cod_repres);
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("cod_repres", cod_repres,
			cod_repres, ConstraintType.MUST, true));
	var dataset = DatasetFactory.getDataset("representante", null, constraints,
			null);
	var codRegional = "";
	if (dataset != null) {
		console.log(dataset);
		codRegional = dataset.values[0].cv_4;
	}

	console.log("## Regional ## " + codRegional);
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("tablename", "regional",
			"regional", ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("metadata#active", true,
			true, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("cod_regional",
			codRegional, codRegional, ConstraintType.MUST));
	var dataset = DatasetFactory.getDataset("representante_compl", null,
			constraints, null);

	if (dataset != null && dataset.values.length > 0 ) {
		console.log(dataset);

		// for (var x = 0; x < dataset.values.length; x++) {

		console.log("## parametros ## " + dataset.values[0]['perc_mix_ger_reg']);
		$("#perc_mix_ger_reg").val(dataset.values[0]['perc_mix_ger_reg']);
		$("#perc_mix_ger_nac").val(dataset.values[0]['perc_mix_ger_nac']);
		$("#perc_desc_ger_reg").val(dataset.values[0]['perc_desc_ger_reg']);
		$("#perc_desc_ger_nac").val(dataset.values[0]['perc_desc_ger_nac']);

		
		$("#perc_lob_ger_nac").val(dataset.values[0]['lob_ger_nac']);
		$("#perc_lob_ctr").val(dataset.values[0]['lob_controller']);
	
		
		// }
	}
}

function loadRepresCompl(codRepres, codCliente, codMoeda, info, codTipCli) {

	if (codRepres == "" || codRepres == null) {
		return false;
	}

	qtd += 1;
	console.log('QUANTIDADE...........', qtd);
	console.log('LOAD REPRESENTANTE.........', codRepres, codCliente, codMoeda,
			info);
	// CARGA DADOS
	var constraintsPai = new Array(DatasetFactory.createConstraint(
			"cod_repres", codRepres, codRepres, ConstraintType.MUST));
	// var constraintsPai = new Array(
	// DatasetFactory.createConstraint("metadata#active", 1, 1,
	// ConstraintType.MUST) );
	var datasetPai = DatasetFactory.getDataset('representante_compl', null,
			constraintsPai, null);

	console.log('PAI FILHO ' + $('#cod_repres').val());
	console.log('DATA SET PAI ', datasetPai);
	console.log('INFO......12',info);
	if (info == 'TT'
			&& (datasetPai == null || datasetPai == undefined || datasetPai.values.length == 0)) {
		FLUIGC.toast({
			title : 'Representante: ',
			message : 'Representante nao cadastrado no Fluig: ' + codRepres,
			type : 'danger',
			timeout : 'slow'
		});
		return false;
	}
	console.log('INFO......13',info);
	if (datasetPai != null) {
		console.log('Pai Filho ', datasetPai.values.length);
		for (var x = 0; x < datasetPai.values.length; x++) {
			
			var pai = datasetPai.values[x];
			console.log('LINHA................', x, pai);
			console.log('INFO ', info);
			
			if (info == 'EMP' || info == 'TT' || info == 'SC') {
				// Carga Empresa
				// $("#empresa option").remove();
				loadDataSetCombo('empresa', 'empresa_repres', 'COD_EMPRESA',
						'DEN_REDUZ', 'cod_repres', codRepres,
						'IES_EMPRESA_DEFAULT', 'S');
				// loadPaiFilhoCombo( 'empresa', 'representante_compl',
				// 'empresa', pai.documentid, pai.version, 'cod_empresa',
				// 'emp_reduz', 'ies_empresa_default', null, null );
			}
			console.log('INFO......14',info);
			atualizaEmpresa();
			
			if (info == 'TV' || info == 'TT' || info == 'SC') {

				
				// Tipo de Venda
				if ($('#tipoCadUser').val() == "R") {
					// carrega o tipo de vendas do representante quando o tipo
					// do cadastro for R - Representante
					loadDataSetCombo('tipo_venda', 'tipo_venda_repres',
							'COD_TIP_VENDA', 'DEN_TIP_VENDA', 'cod_repres',
							codRepres, 'IES_TIPO_VENDA_DEFAULT', 'S');
				} else {
					if ($('#tipoCadUser').val() == "A") {
						// quando o tipo de cadastro for A - administrativo de
						// vendas carrega o tipo de vendas liberado para o
						// usuário logado e não o do representante
						// recupera qual o código de representante do usuário
						// logado
						var cons = new Array();
						var userFluig = $('#userFluig').val();
						cons.push(DatasetFactory.createConstraint('matricula',
								userFluig, userFluig, ConstraintType.MUST,true));
						// var constraintsPai = new Array(
						// DatasetFactory.createConstraint("metadata#active", 1,
						// 1, ConstraintType.MUST) );
						console.log('USUARIO ', userFluig);
						var datasetPai = DatasetFactory.getDataset(
								'representante_compl', null, cons, null);
						if (datasetPai != null && datasetPai != undefined) {
							// var selectedItem = datasetPai.values[0];
							// console.log( selectedItem );
							console.log('REPRESENTANTE ',
									datasetPai.values[0].cod_repres);
							var cod_repres_user = datasetPai.values[0].cod_repres;
							loadDataSetCombo('tipo_venda', 'tipo_venda_repres',
									'COD_TIP_VENDA', 'DEN_TIP_VENDA',
									'cod_repres', cod_repres_user,
									'IES_TIPO_VENDA_DEFAULT', 'S');
						}
					} else {
						// se não for nem R nem A carrega com os dados do
						// representante do cliente selecionado
						loadDataSetCombo('tipo_venda', 'tipo_venda_repres',
								'COD_TIP_VENDA', 'DEN_TIP_VENDA', 'cod_repres',
								codRepres, 'IES_TIPO_VENDA_DEFAULT', 'S');
					}
				}
			}
			console.log('INFO......15',info);
			if (info == 'CP' || info == 'TT' || info == 'SC') {
				
				if ($('#aprovacao_cre').val()=='D' && $('#aprovacao_cre').val() != null) {
					loadDataSetCombo( 'cond_pagamento', 'condicao_pagamento_vdp_repres', 'COD_CND_PGTO', 'DEN_CND_PGTO', 'cod_cnd_pgto', '1', 'IES_COND_PAGTO_DEFAULT', 'S' );
					setCondPagto();
				} else {
				
					loadDataSetCombo('cond_pagamento',
							'condicao_pagamento_vdp_repres', 'COD_CND_PGTO',
							'DEN_CND_PGTO', 'cod_repres', codRepres,
							'IES_COND_PAGTO_DEFAULT', 'S');
					if (codCliente.trim() != "") {
						loadDataSetCombo('cond_pagamento',
								'condicao_pagamento_cliente', 'COD_CND_PGTO',
								'DEN_CND_PGTO', 'cod_cliente', codCliente, '', 'N');
					}
					setCondPagto();
				}
			}
			console.log('INFO......16',info);
			if (info == 'NT' || info == 'TT' || info == 'SC') {
				// Natura de Operacao
				loadDataSetCombo('nat_operacao', 'natureza_operacao_repres',
						'COD_NAT_OPER', 'DEN_NAT_OPER', 'cod_repres',
						codRepres, 'IES_NAT_OPER_DEFAULT', 'S');
				setNatOper();
			}
			console.log('INFO......17',info);
			if (info == 'TC' || info == 'TT') {
				// Natura de Operacao
				
				loadDataSetCombo('tipo_cliente', 'tipo_cliente_repres',
						'COD_TIP_CLI', 'DEN_TIP_CLI', 'cod_repres', codRepres,
						'IES_TIPO_CLIENTE_DEFAULT', 'S');

				
				if (codTipCli.trim() != "") {
					if (codTipCli != " "
							&& $.inArray(codTipCli.trim(),
									getOptCombo('tipo_cliente')) == -1) {
						$("#tipo_cliente")
								.append(
										"<option value='"
												+ codTipCli.trim()
												+ "' >"
												+ codTipCli.trim()
												+ " - "
												+ loadCampoDataSet(
														'tipo_cliente',
														'cod_tip_cli',
														codTipCli.trim(),
														'DEN_TIP_CLI')
												+ "</option>");
					}
					$("#tipo_cliente").val(codTipCli.trim());
				}
				
				setValidadeOrcamento();
				
			}
			console.log('INFO......18',info);
			if (info == 'MD' || info == 'TT' || info == 'SC') {
				// Moeda
				
				loadDataSetCombo('moeda', 'moeda_repres', 'COD_MOEDA',
						'DEN_MOEDA', 'cod_repres', codRepres,
						'IES_MOEDA_DEFAULT', 'S');
			/*if ($('#moeda').val().trim() != "") {
					if ($.inArray(codMoeda, getOptCombo('moeda')) == -1) {
						$("#moeda").append(
								"<option value='"
										+ codMoeda
										+ "' >"
										+ codMoeda
										+ " - "
										+ loadCampoDataSet('moeda',
												'cod_moeda', codMoeda,
												'DEN_MOEDA_ABREV')
										+ "</option>");
					}
					$("#moeda").val(codMoeda);
				}*/
			}
			console.log('INFO......1',info);
			if (info == 'TF' || info == 'TT' || info == 'SC') {
				// Tipo Frete
				
				loadPaiFilhoCombo('tipo_frete', 'representante_compl',
						'tipo_frete', pai.documentid, pai.version,
						'cod_tipo_frete', '', 'ies_tipo_frete_default', null,
						null);
				setTimeout("setTipoFrete();", 3000);
				
			}
			console.log('INFO......2',info);
			if (info == 'LT' || info == 'TT' || info == 'SC') {
				// lista de preo

				var valAtual = $("#lista_preco").val();
				console.log('LISTA DE PREO ATUAL....', valAtual);
				
				loadDataSetCombo('lista_preco', 'lista_de_preco_repres', 'NUM_LIST_PRECO', 'DEN_LIST_PRECO', 'cod_empresa,cod_repres,cod_moeda', $('#empresa').val()+','+codRepres+','+$('#moeda').val(), 'IES_LISTA_DEFAULT', 'S');
				// busca lista clietne

				if (codCliente.trim() != "") {
					var f1 = DatasetFactory.createConstraint("cod_empresa", $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST);
					var f2 = DatasetFactory.createConstraint("cod_cliente",	codCliente, codCliente, ConstraintType.MUST);
					var constraintsCliEmpre = new Array(f1, f2);
					console.log('Lista Constr......', constraintsCliEmpre);
					// Busca o dataset
					var datasetCliEmp = DatasetFactory.getDataset('clientes_empresa', null, constraintsCliEmpre, null);
					console.log('DATA SET LISTA ESPEC........', datasetCliEmp);
					if (datasetCliEmp != null && datasetCliEmp.values.length) {
						if ( $.inArray( datasetCliEmp.values[0].lista, getOptCombo('lista_preco') ) == -1) {
							console.log('ADICIONA LISTA ESPEC......',datasetCliEmp.values[0].LISTA);
							$("#lista_preco").append( "<option value='"+ datasetCliEmp.values[0].LISTA+ "' >"+ datasetCliEmp.values[0].LISTA+ " - "+ datasetCliEmp.values[0].DEN_LISTA+ "</option>");
						}
						console.log('ANTES LISTA PADRÃO......');
						if ((valAtual == "" || valAtual == null)
								&& $('#ped_representante').val() == "0") {
							console.log('ENTREI PADRÃO......',datasetCliEmp.values[0].LISTA);
							$("#lista_preco").val(datasetCliEmp.values[0].LISTA);
						} else {
							console.log('ENTREI ELSE PADRAO......', valAtual);
							$("#lista_preco").val(valAtual);
						}
					}
				}

				$("#lista_preco option").each(function() {

							console.log('TESTA LISTA PARA LIMPAR.....', $(this).val());

							var today = new Date();
							today = [ today.getFullYear(),
									('0' + (today.getMonth() + 1)).slice(-2),
									('0' + today.getDate()).slice(-2) ]
									.join('');
							var dtIni = '18900101';
							var dtFim = '29991231';

							var constraintsLista = new Array();

							constraintsLista.push(DatasetFactory.createConstraint("cod_empresa", $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST));
							constraintsLista.push(DatasetFactory.createConstraint("num_list_preco", $(this).val(), $(this).val(), ConstraintType.MUST));
							constraintsLista.push(DatasetFactory.createConstraint("dat_ini_vig", dtIni,	today, ConstraintType.MUST));
							constraintsLista.push(DatasetFactory.createConstraint("dat_fim_vig", today,	dtFim, ConstraintType.MUST));

							console.log('listaConst', constraintsLista);

							var datasetLista = DatasetFactory.getDataset('lista_de_preco', null, constraintsLista, null);

							console.log('SERA QUE LIMPO ESSA LISTA....', $(this).val());

							if (datasetLista == null
									|| datasetLista.values.length == 0) {
								console.log('VOU LIMPTAR ESSA LISTA....', $(this).val());
								$(this).remove();
							}
							console.log('APOS LIMPAR A LISTA');

						});

				$('#lista_preco_hd').val($("#lista_preco").val());
				$('#empresa_hd').val($("#empresa").val());
				console.log('LOG FILTRO.........  NUM_LIST_PRECO,'+ $('#lista_preco').val() + ',COD_EMPRESA,'+ $('#empresa').val());
				setTimeout(
						"reloadZoomFilterValues('den_item_edit', 'NUM_LIST_PRECO,"
								+ $('#lista_preco').val() + ",COD_EMPRESA,"
								+ $('#empresa').val() + "' );", 3000);
				// "reloadZoomFilterValues('den_item_edit',
				// 'NUM_LIST_PRECO,"+$('#lista_preco').val()+",COD_EMPRESA,"+$('#empresa').val()+"
				// )";
				//setar a moedavar ct = new Array();
				var ct = new Array();
				ct.push( DatasetFactory.createConstraint("cod_moeda", $('#moeda').val(), $('#moeda').val(), ConstraintType.MUST) );
				ct.push( DatasetFactory.createConstraint("table", 'fluig_v_moeda_cotacao', null, ConstraintType.MUST) );
				var ds = DatasetFactory.getDataset('selectLogix', null, ct, null );
				
				if( ds != null ){
					$('#cotacao').val( ds.values[0]['VAL_COTACAO'].replace('.',',') );
				}
				
				if( $('#moeda').val() != '1' ){
					$('.lbl_moeda').show();
				}else{
					$('.lbl_moeda').hide();
				}
			}
		}
	}
	console.log("FIM do load.");
	loadingPrincipial.hide();
}

function mvalor(v) {

	v = v.replace(/\D/g, "");// Remove tudo o que nao e digito
	v = v.replace(/(\d)(\d{9})$/, "$1.$2");// coloca o ponto dos milhoes
	v = v.replace(/(\d)(\d{6})$/, "$1.$2");// coloca o ponto dos milhares
	v = v.replace(/(\d)(\d{3})$/, "$1,$2");// coloca a virgula antes dos 3
	// ultimos digitos

	return v;
}

function setCondPagto() {
	console.log('Entrei!!!!');
	$('#ies_emite_dupl_cond').val(
			loadCampoDataSet('condicao_pagamento_vdp', 'cod_cnd_pgto', $(
					'#cond_pagamento').val(), 'IES_EMITE_DUPL'));
}

function setNatOper() {
	console.log('Entrei!!!!');
	$('#ies_emite_dupl').val(
			loadCampoDataSet('natureza_operacao', 'cod_nat_oper', $(
					'#nat_operacao').val(), 'IES_EMITE_DUPL'));
}

function setTipoFrete() {
	console.log('Entrei!!!!');
	$('#tipo_frete_logix').val(
			loadCampoDataSet('tipo_frete', 'tipo_frete_fluig', $('#tipo_frete')
					.val(), 'tipo_frete_logix'));

	if ($('#tipo_frete').val() == "RET") {
		// var objDestino = { inputId:'transportadora',
		// inputName:'transportadora', cod_cliente:$('#cod_cliente').val( ),
		// nom_cliente:$('#razao_social').val( ) };
		zoomDestino = window[$("#transportadora").attr('filter-instance')];
		zoomDestino.clear();
		if ($('#tipo_cadastro').val() == 'N') {
			zoomDestino.setValue($('#razao_social').val());
		} else {
			zoomDestino.setValue($('#razao_social_zoom').val());
		}
		zoomDestino.disable(true);
		$('#cnpj_trans').val($('#cnpj').val());
		$('#cod_trans').val($('#cod_cliente').val());
	} else if ($('#cod_trans').val() == $('#cod_cliente').val()) {
		zoomDestino = window[$("#transportadora").attr('filter-instance')];
		zoomDestino.clear();
		zoomDestino.disable(false);
		$('#cnpj_trans').val("");
		$('#cod_trans').val("");
	}
}

function setLista() {
	if (qtdItens() > 0) {
		FLUIGC
				.toast({
					title : 'Altera&ccedil;&atilde;o: ',
					message : 'N&atilde;o &eacute permitido alterar empresa ap&oacute; inserir itens no pedido.',
					type : 'warning',
					timeout : 'fast'
				});
		$('#empresa').val($("#empresa_hd").val());
		return false;
	} else {
		loadRepresCompl($('#cod_repres').val(), $('#cod_cliente').val(), $('#cod_moeda_cli').val()+ "", 'LT', $('#cod_tip_cli').val() + "");
		$('#empresa_hd').val($("#empresa").val());
		return true;
	}

}

function setListaPreco() {
	if (qtdItens() > 0) {
		FLUIGC
				.toast({
					title : 'Altera&ccedil;&atilde;o: ',
					message : 'N&atilde;o &eacute permitido alterar lista de pre&ccedil;o ap&oacute; inserir itens no pedido.',
					type : 'warning',
					timeout : 'fast'
				});
		console.log('set lista 001', $("#lista_preco").val());
		console.log('set lista 001', $("#lista_preco_hd").val());
		$('#lista_preco').val($("#lista_preco_hd").val());
		return false;
	} else {
		setLista();
		reloadZoomFilterValues('den_item_edit', "NUM_LIST_PRECO,"+ $('#lista_preco').val() + ",COD_EMPRESA,"+ $('#empresa').val());
		$('#lista_preco_hd').val($("#lista_preco").val());
	}
}

function getListaTipoCliente() {

	var constraintsPai = new Array(DatasetFactory.createConstraint(
			"ies_matriz", 'on', 'on', ConstraintType.MUST));
	var datasetPai = DatasetFactory.getDataset('empresa_compl', null,
			constraintsPai, null);
	var lstTipoCli = new Array();
	console.log('Pai Filho ' + $('#empresa').val());
	if (datasetPai != null) {
		console.log('Pai Filho ', datasetPai.values.length);
		for (var x = 0; x < datasetPai.values.length; x++) {
			var pai = datasetPai.values[x];
			console.log('INFO ');

			var constraintsFilhos = new Array();
			constraintsFilhos.push(DatasetFactory
					.createConstraint("tablename", 'tipo_cliente_cei',
							'tipo_cliente_cei', ConstraintType.MUST));
			constraintsFilhos.push(DatasetFactory.createConstraint(
					"metadata#id", pai.documentid, pai.documentid,
					ConstraintType.MUST));
			constraintsFilhos.push(DatasetFactory.createConstraint(
					"metadata#version", pai.version, pai.version,
					ConstraintType.MUST));

			var datasetFilhos = DatasetFactory.getDataset('empresa_compl',
					null, constraintsFilhos, null);

			if (datasetFilhos != null) {

				var filhos = datasetFilhos.values;
				console.log('DataSet', datasetFilhos);

				for ( var i in filhos) {
					var filho = filhos[i];
					console.log(filho["cod_tipo_cliente"]);
					lstTipoCli.push(filho["cod_tipo_cliente"]);
				}
			}
		}
	}
	console.log('ARRAY tipo cli', lstTipoCli);
	return lstTipoCli;
}

function loadTipoClient(user, campoTC) {

	var temTipoCliente = -2;
	var constraintsPai = new Array();
	constraintsPai.push(DatasetFactory.createConstraint("matricula", user,
			user, ConstraintType.MUST,true));
	constraintsPai.push(DatasetFactory.createConstraint("tipo_cadastro", 'R',
			'R', ConstraintType.MUST));
	var datasetPai = DatasetFactory.getDataset('representante_compl', null,
			constraintsPai, null);

	console.log('UsuÃ¡rio.....', user);
	console.log('dataSet repres.....', datasetPai);
	$("#" + campoTC + " option").remove();
	$("#" + campoTC).append("<option value='' ></option>");

	if (datasetPai != null) {

		console.log('QTD.....', datasetPai.values.length);

		for (var x = 0; x < datasetPai.values.length; x++) {

			console.log('Entrei....X', x);

			if (temTipoCliente == -2) {
				temTipoCliente = -1;
			}
			var pai = datasetPai.values[x];
			var constraintsFilhos = new Array();
			constraintsFilhos.push(DatasetFactory.createConstraint("tablename",
					"tipo_cliente", "tipo_cliente", ConstraintType.MUST));
			constraintsFilhos.push(DatasetFactory.createConstraint(
					"metadata#id", pai.documentid, pai.documentid,
					ConstraintType.MUST));
			constraintsFilhos.push(DatasetFactory.createConstraint(
					"metadata#version", pai.version, pai.version,
					ConstraintType.MUST));
			var datasetFilhos = DatasetFactory.getDataset(
					'representante_compl', null, constraintsFilhos, null);
			var filhos = datasetFilhos.values;
			for (var i = 0; i < filhos.length; i++) {

				console.log('Entrei....i', i);

				var filho = filhos[i];
				$("#" + campoTC).append(
						"<option value='" + filho.cod_tip_cli + "' >"
								+ filho.cod_tip_cli + " - " + filho.den_tip_cli
								+ "</option>");
				temTipoCliente = 1;
			}
		}
	}
	return temTipoCliente;
}

function buscaUltimoPreco( id ){
	
	if (!validaMultiplo()) {
		return false;
	}
	//busca lista clietne
	var f1 = DatasetFactory.createConstraint( "cod_empresa", $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST );
	var f2 = DatasetFactory.createConstraint( "num_list_preco", 0, 0, ConstraintType.MUST );
	var f3 = DatasetFactory.createConstraint( "cod_cliente", $('#cod_cliente').val(), $('#cod_cliente').val(), ConstraintType.MUST );
	var f4 = DatasetFactory.createConstraint( "cod_item", $('#cod_item_edit').val(), $('#cod_item_edit').val(), ConstraintType.MUST );	
	
	var constraintsCliItem = new Array(f1,f2,f3,f4);
	console.log('Lista Constr......',constraintsCliItem);
	//Busca o dataset
	var datasetCliItem = DatasetFactory.getDataset( 'ultimo_preco_item_cliente', null, constraintsCliItem, null);
	console.log( 'retorno......',datasetCliItem );
	if ( datasetCliItem != null && datasetCliItem.values.length ){
		console.log('Lista......',datasetCliItem);
		console.log('preco......', datasetCliItem.values[0].PRE_UNIT);
		console.log('desc......', datasetCliItem.values[0].PCT_DESC_ADIC);
		getDescModal(  datasetCliItem.values[0]['PRE_UNIT'], datasetCliItem.values[0]['PCT_DESC_ADIC'] );		
		console.log('set default......');
	}else{
		FLUIGC.toast({
			title: 'Valida&ccedil;&atilde;o: ',
			message: 'N&atilde;o localizado pre&ccedil;o anterior!',
			type: 'warning',
			timeout: 'fast'
		});
	}
	
}

function atualizaEmpresa() {

	var f1 = DatasetFactory.createConstraint("cod_empresa", $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST);
	var constraintsEmp = new Array(f1);
	console.log('Lista Constr......', constraintsEmp);
	// Busca o dataset
	var datasetEmp = DatasetFactory.getDataset('empresa', null, constraintsEmp,
			null);
	console.log('retorno......', datasetEmp);

	if (datasetEmp != null && datasetEmp.values.length) {

		console.log('Lista......', datasetEmp);
		console.log('IES_ITEM........', datasetEmp.values[0].IES_ITEM_PED);
		console.log('QTD_CASAS........',
				datasetEmp.values[0].QTD_CASAS_DECIMAIS_PRECO_UNIT);

		$('#dup_item').val(datasetEmp.values[0].IES_ITEM_PED);

		$('.preco_unit')
				.maskMoney(
						{
							precision : parseInt(datasetEmp.values[0].QTD_CASAS_DECIMAIS_PRECO_UNIT),
							thousands : '.',
							decimal : ','
						});
		$('#casas_preco').val(
				datasetEmp.values[0].QTD_CASAS_DECIMAIS_PRECO_UNIT);
			
		
	}
}

function getRepresUserTipoCli(user, tipCli) {

	console.log(" ##### antes busca repres ##### ");
	var constraintsPai = new Array();
	constraintsPai.push(DatasetFactory.createConstraint("matricula", user,
			user, ConstraintType.MUST));
	constraintsPai.push(DatasetFactory.createConstraint("tipo_cadastro", 'R',
			'R', ConstraintType.MUST));
	constraintsPai.push(DatasetFactory.createConstraint("metadata#active",
			true, true, ConstraintType.MUST));
	var datasetPai = DatasetFactory.getDataset("representante_compl", null,
			constraintsPai, null);
	console.log(" ##### dts Pai busca repres ##### ", datasetPai);

	if (datasetPai != null) {
		for (var x = 0; x < datasetPai.values.length; x++) {
			var constraintsFilhos = new Array();

			console.log(" ##### busca repres ##### ",
					datasetPai.values[x]["cod_repres"]);
			constraintsFilhos.push(DatasetFactory.createConstraint("tablename",
					"tipo_cliente", "tipo_cliente", ConstraintType.MUST));
			constraintsFilhos.push(DatasetFactory.createConstraint(
					"metadata#id", datasetPai.values[x]["documentid"],
					datasetPai.values[x]["documentid"], ConstraintType.MUST));
			constraintsFilhos.push(DatasetFactory.createConstraint(
					"metadata#version", datasetPai.values[x]["version"],
					datasetPai.values[x]["version"], ConstraintType.MUST));
			constraintsFilhos.push(DatasetFactory.createConstraint(
					"metadata#active", true, true, ConstraintType.MUST));
			constraintsFilhos.push(DatasetFactory.createConstraint(
					"cod_tip_cli", tipCli, tipCli, ConstraintType.MUST));

			var datasetFilhos = DatasetFactory.getDataset(
					"representante_compl", null, constraintsFilhos, null);

			console.log('retorn filho....', datasetFilhos.values.length,
					datasetFilhos);
			if (datasetFilhos != null && datasetFilhos.values.length > 0) {
				console.log(" ##### entrei filho  busca repres ##### "
						+ datasetPai.values[x]["cod_repres"]);
				$('#cod_repres').val(datasetPai.values[x]["cod_repres"]);
				$('#raz_social').val(datasetPai.values[x]["raz_social"]);
				return datasetPai.values[x]["cod_repres"];
			}
		}
	}
}

function setValidadeOrcamento() {

	var dias_orcamento = 0;
	
	console.log('console.log(dias_orcamento);..... ', dias_orcamento);

	var constraintsPai = new Array();
	constraintsPai.push(DatasetFactory.createConstraint("ies_matriz", "on",
			"on", ConstraintType.MUST));
	
	var datasetPai = DatasetFactory.getDataset('empresa_compl', null,
			constraintsPai, null);

	
	if (datasetPai != null /* && datasetPai.values.length > 0 */) {

		
		var pai = datasetPai.values[0];
		if (pai.dias_validade_orc != null && pai.dias_validade_orc != "") {
			
			dias_orcamento = pai.dias_validade_orc;
		}
		

		var constraintsFilhos = new Array();
		
		constraintsFilhos.push(DatasetFactory.createConstraint("tablename",
				"tipo_cliente_orc", "tipo_cliente_orc", ConstraintType.MUST));
		
		constraintsFilhos.push(DatasetFactory.createConstraint("metadata#id",
				pai.documentid, pai.documentid, ConstraintType.MUST));
		
		constraintsFilhos.push(DatasetFactory.createConstraint(
				"metadata#version", pai.version, pai.version,
				ConstraintType.MUST));
		
		constraintsFilhos.push(DatasetFactory.createConstraint(
				"cod_tip_cli_orc", $('#tipo_cliente').val(), $('#tipo_cliente')
						.val(), ConstraintType.MUST));

		var datasetFilhos = DatasetFactory.getDataset('empresa_compl', null,
				constraintsFilhos, null);

		console.log('antes do IF');
		if (datasetFilhos != null && datasetFilhos.values.length > 0) {
			console.log('depois do IF');
			var filho = datasetFilhos.values[0];
			console.log('depois do filho');
			if (filho.dias_tip_cli_orc != null && filho.dias_tip_cli_orc != "") {
				console.log('seta valor.');
				dias_orcamento = filho.dias_tip_cli_orc;
			}
		}
	}

	console.log('console.log(dias_orcamento);..... ', dias_orcamento);

	var date = new Date(Date.now()
			+ (parseInt(dias_orcamento) * (24 * 60 * 60 * 1000)));
	var str = String(date.getDate() + "").padStart(2, 0) + "/"
			+ String((date.getMonth() + 1) + "").padStart(2, 0) + "/"
			+ String(date.getFullYear() + "").padStart(2, 0);
	$('#data_validade').val(str);

}

function cargaCidadesEnt() {
	reloadZoomFilterValues("cidade_ent", "cod_uni_feder,"
			+ $('#estado_ent').val());
}

function getDsPaiFilho( dataSet, table, fieldCodigo, fildFilter, fildFilterValue ){
	
	console.log( dataSet, table, fieldCodigo, fildFilter, fildFilterValue  );

	var constraintsPai = new Array();
	var lstFilter = fildFilter.split(',');
	var lstFilterValue = fildFilterValue.split(',');
	for ( var j = 0; j < lstFilter.length; j ++ ){
		console.log( 'Passo 00X',lstFilter[j],lstFilterValue[j] );
		if ( lstFilter[j] != '' && lstFilter[j] != null ){
			constraintsPai.push( DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST) );
		}
	}
	var datasetPai = DatasetFactory.getDataset(dataSet, null, constraintsPai, null );
	console.log('datasetPai',datasetPai);
	if( datasetPai != undefined && datasetPai != null ){
		var pais = datasetPai.values;
		for ( var y in pais ) {
			var pai = pais[y];
			
			var constraintsFilhos = new Array();
			constraintsFilhos.push( DatasetFactory.createConstraint("tablename", table, table, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pai.documentid, pai.documentid, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pai.version, pai.version, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
			
			var orderFilhos = new Array();
			orderFilhos.push( fieldCodigo );						
			var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos );
			console.log('DataSet',datasetFilhos);
			if ( datasetFilhos != null ){
				return datasetFilhos;
			}
		}
	}
	return null;
}			
