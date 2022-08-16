function setSelectedZoomItem(selectedItem) {

	if (selectedItem.inputName != null) {

		var campo = selectedItem.inputName.split('___')[0];
		var seq = selectedItem.inputName.split('___')[1];

		if (selectedItem.inputName == 'razao_social') {
			$('#cod_cliente').val(selectedItem.cod_cliente);
			loadCliente(selectedItem.cod_cliente);
			loadRepresCompl($('#cod_repres').val(), selectedItem.cod_cliente,
					$('#cod_moeda_cli').val());
			buscaMedia(selectedItem.cod_cliente);
			setNatOper();
			setEmpresa();
			setLstPreco();
			setQtdVezes();
			nrParcelas(1) // Caso o usuário não altere, irá carregar a combo
			// de parcela pela primeira vez

		}

		if (campo == 'desc_item') {
			$('#cod_item___' + seq).val(selectedItem.cod_item);
			$('#cod_local___' + seq).val(selectedItem.cod_local);

			loadItem($('#empresa').val(), selectedItem.cod_item, $('#lstPreco')
					.val(), 'zoom', selectedItem.inputName);
		}

		if (selectedItem.inputName == "cidade_ent") {
			$('#cod_cidade_ent').val(selectedItem.cod_cidade);
			$('#cep_ent').focus();
			loadBairro(selectedItem.cod_cidade, 'bairro_ent_sel');
		}

		if (selectedItem.inputName == "transportadora") {
			$('#cod_transportadora').val(selectedItem.cod_cliente);
		}

		if (selectedItem.inputName == "aen") {
			$('#cod_aen').val(selectedItem.cod_aen_mkt);
		}
	}

	if (selectedItem.type == 'btEndereco') {

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

		var zoomDestino = {};

		// selectedItem.den_cidade

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

		var eiNum = '';
		if (selectedItem.ins_estadual != null)
			eiNum = selectedItem.ins_estadual.replace(/[^0-9]/g, '');
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

function setNatOper() {
	$('#nat_operacao_aux').val($('#nat_operacao').val());
}

function setEmpresa() {
	empresaaux = document.getElementById('empresa').value;
	$('#empresa_aux').val(empresaaux);
}

function setLstPreco() {

	lstPrecoaux = document.getElementById('lstPreco').value;
	$('#lstpreco_aux').val(lstPrecoaux);
		
}

function setMoedaLista() {
	var cod_moeda = '1';
	// CARGA DADOS
	var constraintsPai = new Array();
	constraintsPai.push(DatasetFactory.createConstraint("num_list_preco", document.getElementById('lstPreco').value,
			document.getElementById('lstPreco').value, ConstraintType.MUST));
	constraintsPai.push(DatasetFactory.createConstraint("cod_empresa",
			$('#empresa').val(), $('#empresa').val(), ConstraintType.MUST));
			
		var datasetPai = DatasetFactory.getDataset('lista_de_preco', null,
				constraintsPai, null);
		if (datasetPai != null) {
			for (var x = 0; x < datasetPai.values.length; x++) {

				var cod_moeda_lista = datasetPai.values[x].COD_MOEDA;
				console.log('cod_moeda_lista1 ',datasetPai.values[x]);
				console.log('cod_moeda_lista ',cod_moeda_lista);
				$('#cod_moeda_lista').val(cod_moeda_lista);
				cod_moeda = cod_moeda_lista;
				$('#den_moeda').val(datasetPai.values[x].DEN_MOEDA);
			}
		}
	
	//recupera cotacao	
	if (cod_moeda != '1') {
		var ct = new Array();
		ct.push( DatasetFactory.createConstraint("cod_moeda", $('#cod_moeda_lista').val(), $('#cod_moeda_lista').val(), ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("table", 'fluig_v_moeda_cotacao', null, ConstraintType.MUST) );
		var ds = DatasetFactory.getDataset('selectLogix', null, ct, null );
		
		if( ds != null ){
			$('#cotacao').val( ds.values[0]['VAL_COTACAO'].replace('.',',') );
		}
	} else {
		$('#cotacao').val('1');
	}
}

function setQtdVezes() {

	qtdVezes_aux = document.getElementById('qtdVezes').value;
	$('#qtdVezes_aux').val(qtdVezes_aux);
}

function loadBairro(cidade, campoBairro) {

	// Cria as constraints para buscar os campos filhos, passando o tablename,
	// nÃÆÃâÃâÃâÃÆÃ¢â¬Å¡ÃâÃâÃÆÃâÃâÃ¢â¬Å¡ÃÆÃ¢â¬Å¡ÃâÃâÃÆÃâÃâÃâÃÆÃ¢â¬Å¡ÃâÃ¢â¬Å¡ÃÆÃâÃâÃ¢â¬Å¡ÃÆÃ¢â¬Å¡ÃâÃâÃÆÃâÃâÃâÃÆÃ¢â¬Å¡ÃâÃâÃÆÃâÃâÃ¢â¬Å¡ÃÆÃ¢â¬Å¡ÃâÃ¢â¬Å¡ÃÆÃâÃâÃâÃÆÃ¢â¬Å¡ÃâÃ¢â¬Å¡ÃÆÃâÃâÃ¢â¬Å¡ÃÆÃ¢â¬Å¡ÃâÃÂºmero
	// da
	// formulÃÆÃâÃâÃâÃÆÃ¢â¬Å¡ÃâÃâÃÆÃâÃâÃ¢â¬Å¡ÃÆÃ¢â¬Å¡ÃâÃâÃÆÃâÃâÃâÃÆÃ¢â¬Å¡ÃâÃ¢â¬Å¡ÃÆÃâÃâÃ¢â¬Å¡ÃÆÃ¢â¬Å¡ÃâÃâÃÆÃâÃâÃâÃÆÃ¢â¬Å¡ÃâÃâÃÆÃâÃâÃ¢â¬Å¡ÃÆÃ¢â¬Å¡ÃâÃ¢â¬Å¡ÃÆÃâÃâÃâÃÆÃ¢â¬Å¡ÃâÃ¢â¬Å¡ÃÆÃâÃâÃ¢â¬Å¡ÃÆÃ¢â¬Å¡ÃâÃÂ¡rio
	// e
	// versÃÆÃâÃâÃâÃÆÃ¢â¬Å¡ÃâÃâÃÆÃâÃâÃ¢â¬Å¡ÃÆÃ¢â¬Å¡ÃâÃâÃÆÃâÃâÃâÃÆÃ¢â¬Å¡ÃâÃ¢â¬Å¡ÃÆÃâÃâÃ¢â¬Å¡ÃÆÃ¢â¬Å¡ÃâÃâÃÆÃâÃâÃâÃÆÃ¢â¬Å¡ÃâÃâÃÆÃâÃâÃ¢â¬Å¡ÃÆÃ¢â¬Å¡ÃâÃ¢â¬Å¡ÃÆÃâÃâÃâÃÆÃ¢â¬Å¡ÃâÃ¢â¬Å¡ÃÆÃâÃâÃ¢â¬Å¡ÃÆÃ¢â¬Å¡ÃâÃÂ£o
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

function alteraCampos(idCampo, campo1, campo2) {
	if ($("#" + idCampo).is(':checked')) {
		$('#' + campo1).hide();
		$('#' + campo2).show();
	} else {
		$('#' + campo1).show();
		$('#' + campo2).hide();
	}
}

function setIsento(idCampo, idCampoIE, idCampoUF) {
	if ($("#" + idCampo).is(':checked')) {
		$('#' + idCampoIE).unmask();
		$('#' + idCampoIE).attr('readonly', true);
		$('#' + idCampoIE).css('background-color', '#DEDEDE');
		$('#' + idCampoIE).val('ISENTO');
	} else {
		$('#' + idCampoIE).unmask();
		$('#' + idCampoIE).attr('readonly', false);
		$('#' + idCampoIE).css('background-color', '#FFFFFF');
		if ($('#' + idCampoIE).val() == 'ISENTO') {
			$('#' + idCampoIE).val('');
			setMaskIE($('#' + idCampoUF).val(), idCampoIE);
		} else {
			var tmp = $('#' + idCampoIE).val();
			setMaskIE($('#' + idCampoUF).val(), idCampoIE);
			$('#' + idCampoIE).val(tmp);
		}

	}
}

function buscaItem(id) {

	var item = $('#' + id).val();

	var seq = id.split('___')[1];

	clearItem('cod_item', id);
	$('#valUnitario___' + seq).val(0);
	$('#desconto___' + seq).val(0);
	$('#quantidade___' + seq).val(0);
	$('#cubagem___' + seq).val(0);
	$('#peso___' + seq).val(0);
	$('#quantidade___' + seq).val(0);
	$('#total___' + seq).val(0);
	$('#cod_local___' + seq).val('');
	habilitaCampos(true, seq);
	var cod_local;
	console.log("COD_LOCAL_DIGITA_ITEM", cod_local);

	
	
	
	if (validaItemInformado(seq) == false) {
		console.log('PASSOU ANTES');
		loadItem($('#empresa').val(), item, $('#lstPreco').val(), 'field', id);
		console.log('PASSOU ANTES 2');
		cod_local = $('#cod_local___' + seq).val();
		console.log('PASSOU ANTES 3');
	}
	console.log("COD_LOCAL_DIGITA_ITEM", cod_local);
	
	setNatOper();
	console.log("COD_NAT_OPER_AUX ",$('#nat_operacao_aux').val());
	var cod_local_lista = recuperaLocalEmpresa($('#empresa').val(), cod_local, $('#nat_operacao_aux').val());
	console.log("COD_LOCAL", cod_local_lista);
	
	if (cod_local_lista == '' || cod_local_lista == null || cod_local_lista == undefined){
		//cod_local_lista = cod_local;
		clearItem('cod_item', id);
		$('#valUnitario___' + seq).val(0);
		$('#desconto___' + seq).val(0);
		$('#quantidade___' + seq).val(0);
		$('#cubagem___' + seq).val(0);
		$('#peso___' + seq).val(0)
		$('#total___' + seq).val(0);
		$('#cod_local___' + seq).val('');
		FLUIGC.toast({
			title : 'Incorreto: ',
			message : 'Item não pertence a um local de estoque cadastrado ou não está cadastrado na lista de preco selecionada, solicite ao MARKETING que revise o cadastro da empresa e acrescente os dados: '+'Local de estoque: '+cod_local+' e Natureza de Operação: '+$('#nat_operacao_aux').val(),
			type : 'warning',
			timeout : 'slow'
		});
	}
	
	if (cod_local != cod_local_lista){
		clearItem('cod_item', id);
		$('#valUnitario___' + seq).val(0);
		$('#desconto___' + seq).val(0);
		$('#quantidade___' + seq).val(0);
		$('#cubagem___' + seq).val(0);
		$('#peso___' + seq).val(0)
		$('#total___' + seq).val(0);
		$('#cod_local___' + seq).val('');
		FLUIGC.toast({
			title : 'Incorreto: ',
			message : 'Item não pertence a um local de estoque possível a esta lista!',
			type : 'warning',
			timeout : 'slow'
		});
	}

}

function validaItemInformado(seq) {

	var item_informado = $('#cod_item___' + seq).val();
	var parcelaID_informado = $('#parcelaID___' + seq).val();
	var retorno = false

	$("input[name^='cod_item___']").each(
			function() {
				var seq_aux = $(this).attr('name').split('___')[1];

				var item_atual = $(this).val()
				var parcelaID_atual = $('#parcelaID___' + seq_aux).val();

				if (seq_aux != seq) {
					if (item_informado == item_atual
							&& parcelaID_informado == parcelaID_atual) {
						FLUIGC.toast({
							title : 'Duplicado: ',
							message : 'Item já informado!',
							type : 'warning',
							timeout : 'fast'
						});
						setTimeout("$('#cod_item___'+seq).focus();", 1);
						retorno = true
					}
				}
			});

	return retorno

}

function clearCliente() {

	$('#cnpj').val('');
	$('#media').val('');
	$('#cod_repres').val('');
	$('#nom_repres').val('');

	empresa = document.getElementById("empresa")
	var x = empresa.length;

	for (i = 0; i < x; i++) {
		empresa.remove(0);
	}

	nat_operacao = document.getElementById("nat_operacao")
	var y = nat_operacao.length;

	for (i = 0; i < y; i++) {
		nat_operacao.remove(0);
	}

	// inicio hidden
	$('#cod_class').val('');
	$('#ins_estadual').val('');
	$('#cod_tip_carteira_cli').val('');
	$('#cod_moeda_cli').val('');
	$('#cod_tip_cli').val('');
	$('#ies_inf_pedido').val('');
	// fim hidden
}

function clearItem(origem, id) {

	var seq = id.split('___')[1];

	if (origem == 'cod_item') {
		zoomDestino = window[$("#desc_item___" + seq).attr('filter-instance')];
		zoomDestino.clear();
		// $("#desc_item___"+seq).val(null)
		console.log('zoomDestino', zoomDestino)
	}

	$('#qtd_pad_edit___' + seq).val('');
}

function loadItem(codEmpresa, codItem, numLista, origem, id) {

	// if ( $('#cod_item_zoom_edit').val() == $('#cod_item_edit').val() ){
	// return false;
	// }else{
	// $('#cod_item_zoom_edit').val( $('#cod_item_edit').val() );
	// }

	// We can show the message of loading
	console.log('entrou para buscar a lista ',codEmpresa,' ',codItem,' ', numLista, ' ',origem,' ', id);
	var seq = id.split('___')[1];
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("cod_empresa", codEmpresa,
			codEmpresa, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("cod_item", codItem,
			codItem, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("num_list_preco",
			numLista, numLista, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("ies_bonifica", 'S', 'S',
			ConstraintType.MUST));

	var dataset = DatasetFactory.getDataset('lista_de_preco_item', null,
			constraints, null);

	if (dataset != null && dataset.values.length > 0) {
		for (var x = 0; x < dataset.values.length; x++) {

			var row = dataset.values[x];

			if (origem == 'field') {
				// var objDestino = { inputId:'desc_item___'+seq,
				// inputName:'desc_item____'+seq, cod_item:row.COD_ITEM,
				// den_item:row.DEN_ITEM };
				zoomDestino = window[$("#desc_item___" + seq).attr(
						'filter-instance')];
				zoomDestino.setValue(row.DEN_ITEM);
			}

			$('.tt-input').each(function() {
				$(this).css('width', $(this).width() - 100);
			});

			// $('#peso_edit').val( row.PES_UNIT );
			$('#qtd_pad_edit___' + seq).val(row.QTD_PADR_EMBAL);
			$('#cod_local___' + seq).val(row.COD_LOCAL);
			$('#peso___' + seq).val(String(row.PES_UNIT.toFixed(2)).replace('.', ','));
			$('#cubagem___' + seq).val(String(row.CUBAGEM.toFixed(6)).replace('.', ','));

			// $('#cod_lin_prod_edit').val( row.COD_LIN_PROD );
			// $('#cod_lin_recei_edit').val( row.COD_LIN_RECEI );
			// $('#cod_seg_merc_edit').val( row.COD_SEG_MERC );
			// $('#cod_cla_uso_edit').val( row.CLA_USO_EDIT );
			// $('#cod_grupo_item_edit').val( row.COD_GRUPO_ITEM );
			// $('#cod_tip_carteira_edit').val( row.COD_TIP_CARTEIRA );
			// $('#den_item_reduz_edit').val( row.DEN_ITEM_REDUZ );
			// $('#ies_mix_edit').val( row.MIX_PRODUTO );

			// $('#um_edit').val( row.COD_UNID_MED );
			var preco = getPrecoListaItem(codEmpresa, numLista, codItem,
					row.COD_LIN_PROD, row.COD_LIN_RECEI, row.COD_SEG_MERC,
					row.CLA_USO_EDIT, $('#cod_cliente').val(), 'XX', "00",
					row.COD_GRUPO_ITEM, row.COD_TIP_CARTEIRA);
			$('#valUnitario___' + seq).val(
					String(preco['PRE_UNIT'].toFixed(3)).replace('.', ','));
			$('#valUnitarioLista___' + seq).val(
					String(preco['PRE_UNIT'].toFixed(3)).replace('.', ','));
			$('#desc_max___' + seq)
					.val(
							String(preco['PCT_DESC_ADIC'].toFixed(3)).replace(
									'.', ','));
			

			// $('#data_entrega_edit').val( $('#data_coleta').val() );
			// $('#pedido_cli_edit').val( $('#ped_cliente').val() );

			// $('#quantidade_edit').focus();
			// setTimeout("$('#quantidade').focus();",1);
			if (preco['PRE_UNIT'] == 0) {
				FLUIGC
						.toast({
							title : 'Preco: ',
							message : 'Valor para item nao localizado na tabela de precos.',
							type : 'danger',
							timeout : 'slow'
						});
				setTimeout("$('#valUnitario___" + seq + "').focus();", 1);
			} else {
				setTimeout("$('#quantidade___" + seq + "').focus();", 1);
			}
		}
		habilitaCampos(false, seq)
	} else {

		if ($('#cod_item___' + seq).val() != ""
				&& $('#cod_item___' + seq).val() != undefined) {
			FLUIGC.toast({
				title : 'Busca: ',
				message : 'Item não localizado!',
				type : 'warning',
				timeout : 'fast'
			});
			setTimeout("$('#cod_item___'+seq).focus();", 1);
			habilitaCampos(true, seq)
		}
		clearItem('cod_item', id);

	}
}

function getPrecoListaItem(codEmpresa, numLista, codItem, codAen1, codAen2,
		codAen3, codAen4, codCliente, codUF, codCond, codGrupo, codAcabam) {

	console.log('entrou da busca', codEmpresa, numLista, codItem, codAen1,
			codAen2, codAen3, codAen4, codCliente, codUF, codCond, codGrupo,
			codAcabam);

	var result = {};
	result['PRE_UNIT'] = 0;
	result['PCT_DESC_ADIC'] = 0;

	var consAcesso = new Array();
	consAcesso.push(DatasetFactory.createConstraint('num_list_preco', numLista,
			numLista, ConstraintType.MUST));
	var orderAcesso = new Array();
	orderAcesso.push('sequencia');

	var datasetAcesso = DatasetFactory.getDataset('lista_de_preco_acesso',
			null, consAcesso, orderAcesso);

	if (datasetAcesso != null) {
		for (var x = 0; x < datasetAcesso.values.length; x++) {

			var acess = parseInt(datasetAcesso.values[x].SEQUENCIA);

			var constraints = new Array();
			constraints.push(DatasetFactory.createConstraint('cod_empresa',
					codEmpresa, codEmpresa, ConstraintType.MUST));
			constraints.push(DatasetFactory.createConstraint('num_list_preco',
					numLista, numLista, ConstraintType.MUST));

			// UF

			/*if ([ 14, 16, 17, 18, 19, 20 ].indexOf(acess) > -1) {
				constraints.push(DatasetFactory.createConstraint(
						'cod_uni_feder', codUF, codUF, ConstraintType.MUST));
			} else {
				constraints.push(DatasetFactory.createConstraint(
						'cod_uni_feder', '#', '#', ConstraintType.MUST));
			}*/
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
			if ([ 1, 2, 5, 6, 8, 14, 15 ].indexOf(acess) > -1) {
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

			// Busca o dataset
			var dataset = DatasetFactory.getDataset('lista_de_preco_item_desc',
					null, constraints, null);
			if (dataset != null) {
				for (var i = 0; i < dataset.values.length; i++) {
					var row = dataset.values[i];
					var val = {};
					val['PRE_UNIT'] = row['PRE_UNIT'];
					val['PCT_DESC_ADIC'] = row['PCT_DESC_ADIC'];
					return val;
				}
			}
		}
	}
	return result;
}

function loadCliente(codCliente) {

	// We can show the message of loading

	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("cod_cliente", codCliente,
			codCliente, ConstraintType.MUST));
	var dataset = DatasetFactory.getDataset('clientes_logix', null,
			constraints, null);
	if (dataset != null) {
		for (var x = 0; x < dataset.values.length; x++) {
			var row = dataset.values[x];
			$('#cnpj').val(row.CNPJ.trim());
			$('#cod_repres').val(row.COD_REPRES);
			$('#nom_repres').val(row.RAZ_SOCIAL);

			$('#pais_ent').val(
					loadCampoDataSet('paises', 'cod_pais', row.COD_PAIS,
							'DEN_PAIS'));
			$('#cod_pais_ent').val(row.COD_PAIS);
			$('#estado_ent').val(row.COD_UNI_FEDER);

			$('#cod_class').val(row.COD_CLASS);
			$('#ins_estadual').val(row.INS_ESTADUAL.trim());
			$('#cod_tip_carteira_cli').val(row.COD_TIP_CARTEIRA);

			$('#pct_desc_financ').val((row.PCT_DESC_FIN).replace('.', ','));

			$('#cod_moeda_cli').val(row.MOEDA);
			$('#cod_tip_cli').val(row.COD_TIP_CLI);
			$('#cei').val(row.CEI);
			$('#ies_inf_pedido').val(row.IES_INF_PEDIDO);
			$('#ies_tip_fornec').val(row.IES_TIP_FORNEC);
			$('#eh_contribuinte').val( row.EH_CONTRIBUINTE );

			reloadZoomFilterValues("cidade_ent", "cod_uni_feder,"
					+ row.COD_UNI_FEDER);
		}
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
		$('#lista_preco').val($("#lista_preco_hd").val());
		return false;
	} else {
		reloadZoomFilterValues('den_item_edit', "NUM_LIST_PRECO,"
				+ $('#lista_preco').val() + ",COD_EMPRESA,"
				+ $('#empresa').val());
		$('#lista_preco_hd').val($("#lista_preco").val());
	}
}

function loadRepresCompl(codRepres, codCliente, codMoeda) {

	// CARGA DADOS
	var constraintsPai = new Array(DatasetFactory.createConstraint(
			"cod_repres", codRepres, codRepres, ConstraintType.MUST));
	// var constraintsPai = new Array(
	// DatasetFactory.createConstraint("metadata#active", 1, 1,
	// ConstraintType.MUST) );
	var datasetPai = DatasetFactory.getDataset('representante_compl', null,
			constraintsPai, null);
	if (datasetPai != null) {
		for (var x = 0; x < datasetPai.values.length; x++) {
			// Carga Empresa
			// $("#empresa option").remove();

			var pai = datasetPai.values[x];

			loadPaiFilhoCombo('empresa', 'representante_compl', 'empresa',
					pai.documentid, pai.version, 'cod_empresa', 'emp_reduz',
					'ies_empresa_default', null, null);
			loadNatOper($("#empresa").val());
			loadListaPreco($("#empresa").val());
			exibeLinhas(1);
		}
	}
	loadDataSetCombo( 'tipo_frete', 'tipo_frete_repres', 'COD_TIPO_FRETE', '', 'cod_repres', codRepres, 'IES_TIPO_FRETE_DEFAULT', 'S','S' );
	setTimeout("setTipoFrete();",3000);
}

function loadNatOper(empresa) {

	// CARGA DADOS
	var cons = new Array();
	cons.push(DatasetFactory.createConstraint(
			"cod_empresa", empresa, empresa, ConstraintType.MUST,true));
	cons.push(DatasetFactory.createConstraint("metadata#active", 1, 1,
	 ConstraintType.MUST) );
	var datasetPai = DatasetFactory.getDataset('empresa_compl', null,
			cons, null);
	if (datasetPai != null) {
		for (var x = 0; x < datasetPai.values.length; x++) {
			var pai = datasetPai.values[x];

			// Carga Empresa
			// $("#empresa option").remove();
			loadPaiFilhoCombo('nat_operacao', 'empresa_compl', 'nat_oper',
					pai.documentid, pai.version, 'cod_nat_oper',
					'den_nat_oper', 'ies_nat_oper_default', null, null);
		}
	}
}

function loadAbaNatOper(valor) {

	var cons = new Array();
	cons.push(DatasetFactory.createConstraint("dataSet", 'empresa_compl',
			'empresa_compl', ConstraintType.MUST));
	cons.push(DatasetFactory.createConstraint("table", 'nat_oper', 'nat_oper',
			ConstraintType.MUST));
	cons.push(DatasetFactory.createConstraint("pai_cod_empresa", $("#empresa")
			.val(), $("#empresa").val(), ConstraintType.MUST));
	cons.push(DatasetFactory.createConstraint("filho_cod_nat_oper", valor,
			valor, ConstraintType.MUST));

	var dataset = DatasetFactory.getDataset('paiFilho', null, cons, null);

	console.log('jerodataset', dataset)

	if (dataset != null) {
		for (var x = 0; x < dataset.values.length; x++) {
			var row = dataset.values[x];
			console.log('Console.....', row);
			$('#cond_pagamento').val(row.COND_PAGTO);
			$('#nom_repres').val(row.RAZ_SOCIAL);
			$('#tipo_entrega').val(row.TIPO_ENTREGA);
			$('#tipo_venda').val(row.TIPO_VENDA);

		}
	}
}

function loadListaPreco(empresa) {

	console.log('Parametros loadListaPreco.... ', empresa);

	// CARGA DADOS empresa
	var constraintsPai = new Array(DatasetFactory.createConstraint(
			"cod_empresa", empresa, empresa, ConstraintType.MUST));
	// var constraintsPai = new Array(
	// DatasetFactory.createConstraint("metadata#active", 1, 1,
	// ConstraintType.MUST) );
	var datasetPai = DatasetFactory.getDataset('empresa_compl', null,
			constraintsPai, null);
	if (datasetPai != null) {
		for (var x = 0; x < datasetPai.values.length; x++) {
			var pai = datasetPai.values[x];
			loadPaiFilhoCombo('lstPreco', 'empresa_compl', 'lista',
					pai.documentid, pai.version, 'cod_lista', 'den_lista',
					'ies_lista_default', 'cod_empresa_lista', $('#empresa')
							.val(), true);
		}
	}

	// CARGA DADOS repres
	var constraintsPai = new Array(DatasetFactory.createConstraint(
			"cod_repres", $("#cod_repres").val(), $("#cod_repres").val(),
			ConstraintType.MUST));
	// var constraintsPai = new Array(
	// DatasetFactory.createConstraint("metadata#active", 1, 1,
	// ConstraintType.MUST) );
	var datasetPai = DatasetFactory.getDataset('representante_compl', null,
			constraintsPai, null);
	if (datasetPai != null) {
		for (var x = 0; x < datasetPai.values.length; x++) {
			var pai = datasetPai.values[x];
			loadPaiFilhoCombo('lstPreco', 'representante_compl', 'lista',
					pai.documentid, pai.version, 'cod_lista', 'den_lista',
					'ies_lista_default', 'cod_empresa_lista', $('#empresa')
							.val(), false);
		}
	}

	var f1 = DatasetFactory.createConstraint("cod_empresa", empresa, empresa,
			ConstraintType.MUST);
	var f2 = DatasetFactory.createConstraint("cod_cliente", $("#cod_cliente")
			.val(), $("#cod_cliente").val(), ConstraintType.MUST);
	var constraintsCliEmpre = new Array(f1, f2);
	console.log('Lista Constr......', constraintsCliEmpre);

	var datasetCliEmp = DatasetFactory.getDataset('clientes_empresa', null,
			constraintsCliEmpre, null);
	console.log('DATA SET LISTA ESPEC........', datasetCliEmp);
	if (datasetCliEmp != null && datasetCliEmp.values.length) {
		if ($.inArray(datasetCliEmp.values[0].lista, getOptCombo('lstPreco')) == -1) {
			console.log('ADICIONA LISTA ESPEC......',
					datasetCliEmp.values[0].LISTA);
			$("#lstPreco").append(
					"<option value='" + datasetCliEmp.values[0].LISTA + "' >"
							+ datasetCliEmp.values[0].LISTA + " - "
							+ datasetCliEmp.values[0].DEN_LISTA + "</option>");
		}
	}

}

function loadLocal(empresa) {

	// CARGA DADOS
	var constraintsPai = new Array(DatasetFactory.createConstraint(
			"cod_empresa", empresa, empresa, ConstraintType.MUST));
	// var constraintsPai = new Array(
	// DatasetFactory.createConstraint("metadata#active", 1, 1,
	// ConstraintType.MUST) );
	var datasetPai = DatasetFactory.getDataset('empresa_compl', null,
			constraintsPai, null);

	if (datasetPai != null) {
		for (var x = 0; x < datasetPai.values.length; x++) {
			var pai = datasetPai.values[x];

			// Carga Empresa
			// $("#empresa option").remove();
			var datasetFilhos = loadPaiFilhoLista('empresa_compl',
					'locais_estoque_mkt', pai.documentid, pai.version,
					'cod_local', null, null);
			return datasetFilhos
		}
	}
}

function loadPaiFilhoLista(dataSet, table, idDocPai, versionDocPai,
		fieldCodigo, fildFilter, fildFilterValue) {

	var constraintsFilhos = new Array();
	constraintsFilhos.push(DatasetFactory.createConstraint("tablename", table,
			table, ConstraintType.MUST));
	constraintsFilhos.push(DatasetFactory.createConstraint("metadata#id",
			idDocPai, idDocPai, ConstraintType.MUST));
	constraintsFilhos.push(DatasetFactory.createConstraint("metadata#version",
			versionDocPai, versionDocPai, ConstraintType.MUST));

	if (fildFilter != '' && fildFilter != null) {
		constraintsFilhos.push(DatasetFactory.createConstraint(fildFilter,
				fildFilterValue, fildFilterValue, ConstraintType.MUST));
	}

	var orderFilhos = new Array();
	orderFilhos.push(fieldCodigo);
	var datasetFilhos = DatasetFactory.getDataset(dataSet, null,
			constraintsFilhos, orderFilhos)

	if (datasetFilhos != null) {
		return datasetFilhos;
	}
}

function loadPaiFilhoCombo(combo, dataSet, table, idDocPai, versionDocPai,
		fieldCodigo, fieldDesc, fieldFlag, fildFilter, fildFilterValue, clear) {

	console.log('loadPaiFilhoCombo')
	console.log('combo', combo)

	var constraintsFilhos = new Array();
	constraintsFilhos.push(DatasetFactory.createConstraint("tablename", table,
			table, ConstraintType.MUST));
	constraintsFilhos.push(DatasetFactory.createConstraint("metadata#id",
			idDocPai, idDocPai, ConstraintType.MUST));
	constraintsFilhos.push(DatasetFactory.createConstraint("metadata#version",
			versionDocPai, versionDocPai, ConstraintType.MUST));

	if (fildFilter != '' && fildFilter != null) {
		constraintsFilhos.push(DatasetFactory.createConstraint(fildFilter,
				fildFilterValue, fildFilterValue, ConstraintType.MUST));
	}

	var orderFilhos = new Array();
	orderFilhos.push(fieldCodigo);
	var datasetFilhos = DatasetFactory.getDataset(dataSet, null,
			constraintsFilhos, orderFilhos);

	if (datasetFilhos != null) {
		var valDefault = "";
		if ($("#" + combo).val() != "" && $("#" + combo).val() != null) {
			valDefault = $("#" + combo).val();
		}
		if (clear != false) {
			$("#" + combo + " option").remove();
		}
		var filhos = datasetFilhos.values;
		//$("#empresa").append("<option value='' ></option>");

		for ( var i in filhos) {
			var filho = filhos[i];
			var den = '';

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

			$("#" + combo).append(
					"<option value='" + filho[fieldCodigo] + "' >" + den
							+ "</option>");

		}
		$("#" + combo).val(valDefault);
	}
}

function getOptCombo(combo) {

	var optArray = new Array();
	$("#" + combo + " option").each(function() {
		optArray.push($(this).val());
	});
	return optArray;
}

function buscaMedia(cliente) {

	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint('dataBase',
			'java:/jdbc/LogixPRD', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('table',
			'eis_v_fluig_media_3_meses', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('sqlLimit', '100', null,
			ConstraintType.MUST));

	constraints.push(DatasetFactory.createConstraint('cliente', cliente,
			cliente, ConstraintType.MUST));

	var fields = new Array('media');

	var order = new Array('media');

	// Busca o dataset

	var dataset = DatasetFactory.getDataset('selectTable', fields, constraints,
			order);

	if (dataset != null) {

		for (var x = 0; x < dataset.values.length; x++) {

			media = parseFloat(dataset.values[x].media);

			mediaFinal = media.toFixed(2);

			mediaFinal = converteMoeda(mediaFinal)

			$('#media').val(mediaFinal);

		}
	}
}

/*
 * function carregaOfertas(qtdVezes){
 * 
 * for (var x = 1; x <= qtdVezes; x++) { idOpc = "idOpc_"+x;
 * document.getElementById(idOpc).innerHTML =
 * document.getElementById("ofertaBase").innerHTML.replace(/01a12/g,x); } }
 */

function loadCampoDataSet(denDataSet, campo, valor, campoRetorno) {
	var c1 = DatasetFactory.createConstraint(campo, valor, valor,
			ConstraintType.MUST);
	var constraints = new Array(c1);
	// Busca o dataset
	var dataset = DatasetFactory
			.getDataset(denDataSet, null, constraints, null);
	if (dataset != null) {
		for (var x = 0; x < dataset.values.length; x++) {
			var row = dataset.values[x];
			return row[campoRetorno];
		}
	}
	return ' ';
}

function zoom(componente) {

	if (componente == 'btEndereco') {

		modalzoom
				.open(
						"Endereço de Entrega",
						"endereco_entrega",
						"sequencia,Seq.,end_entrega_compl,Endereço",
						"cliente,tip_endereco,sequencia,tip_logradouro,logradouro,num_iden_lograd,complemento_endereco,bairro_cobr_entga,cod_cidade,den_cidade,cod_uni_feder,den_uni_feder,cod_pais,den_pais,cod_cep,num_cgc,ins_estadual,end_entrega_compl",
						"cliente," + $('#razao_social').val()
								+ ",cod_uni_feder," + $('#estado_ent').val(),
						componente, 'list', 'default', null, null,
						"end_entrega_compl");
	}
}

function escolheretira(tipo) {

	if (tipo == "1") {
		// var objDestino = { inputId:'transportadora',
		// inputName:'transportadora', cod_cliente:$('#cod_cliente').val( ),
		// nom_cliente:$('#razao_social').val( ) };
		zoomDestino = window[$("#transportadora").attr('filter-instance')];
		zoomDestino.clear();
		zoomDestino.setValue($('#razao_social').val());
		zoomDestino.disable(true);
		// $('#cnpj_trans').val($('#cnpj').val());
		$('#cod_transportadora').val($('#cod_cliente').val());
	} else {
		zoomDestino.clear();
		$('#cod_transportadora').val();
		zoomDestino.disable(false);
	}
}

function carregaAEN() {

	var AENdigitada = $('#cod_aen').val();

	if (AENdigitada != null && AENdigitada != "") {
		var constraints = new Array();
		console.log(AENdigitada);
		constraints.push(DatasetFactory.createConstraint("cod_aen",
				AENdigitada, AENdigitada, ConstraintType.MUST));

		var descAEN = "";
		// Busca o dataset
		var dataset = DatasetFactory.getDataset('aen', null, constraints, null);
		if (dataset != null && dataset.values.length > 0) {
			console.log(dataset);
			descAEN = dataset.values[0].AEN_COMPL;
			console.log('DESC_AEN ', descAEN);
			zoomDestino = window[$("#aen").attr('filter-instance')];
			zoomDestino.clear();
			zoomDestino.setValue(descAEN);
		} else {
			console.log('ENTROU ELSE');
			if (AENdigitada != null && AENdigitada != "") {
				console.log('ENTROU IF');
				FLUIGC.toast({
					title : 'AEN: ',
					message : 'A AEN digitada não foi encontrada!',
					type : 'warning',
					timeout : 'slow'
				});
				$('#cod_aen').focus();
			}
		}
	} else {
		zoomDestino = window[$("#aen").attr('filter-instance')];
		zoomDestino.clear();
	}
}

function removedZoomItem(removedItem) {

	if (removedItem.inputId == "aen") {
		console.log("Retornando resultado removedZoomItem");
		console.log(removedItem);
		$('#cod_aen').val("");
	}
}

function recuperaLocalEmpresa(empresa,local, naturezaoperacao){
	
	var constraintsPai = new Array( DatasetFactory.createConstraint("cod_empresa", empresa, empresa, ConstraintType.MUST) );
	var datasetPai = DatasetFactory.getDataset('empresa_compl', null, constraintsPai, null);
	var cod_local = '';

	if ( datasetPai != null ){
		console.log( 'Pai Filho ', datasetPai.values.length );
		for (var x = 0; x < datasetPai.values.length; x++) {
			var pai = datasetPai.values[x];
			console.log( 'INFO ' );
					
			var constraintsFilhos = new Array();
			constraintsFilhos.push( DatasetFactory.createConstraint("tablename", 'locais_estoque_mkt', 'locais_estoque_mkt', ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pai.documentid, pai.documentid, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pai.version, pai.version, ConstraintType.MUST) );
			console.log('LOCAL FILTRO ',local);
			constraintsFilhos.push( DatasetFactory.createConstraint("COD_LOCAL", local, local, ConstraintType.MUST));
			console.log('NATOPER FILTRO ',naturezaoperacao);
			constraintsFilhos.push( DatasetFactory.createConstraint("COD_NAT_OPER_LOC", naturezaoperacao, naturezaoperacao, ConstraintType.MUST));
				
			var datasetFilhos = DatasetFactory.getDataset('empresa_compl', null, constraintsFilhos, null );
				
			if ( datasetFilhos != null ){
			console.log ('ENTROU NO DATASET FILHO')	
			
			var filhos = datasetFilhos.values;
			console.log (filhos);	
				for ( var i in filhos ) {
					var filho = filhos[i];
					console.log("FILHO");
					console.log(filho);
					console.log(filho[ "cod_local" ]);
					console.log(filhos[i]);
					cod_local = (filho[ "cod_local" ]);
				}
			}
		}
	}
	console.log('LOCAL ENCONTRADO',cod_local);
	return cod_local;
}

function loadDataSetCombo( combo, dataSet, fieldCodigo, fieldDesc, fildFilter, fildFilterValue, fieldFlag, clear, addBlankLine ){
	
	console.log( 'Passo 001' );
	
	var constraintsFilhos = new Array();
	var lstFilter = fildFilter.split(',');
	var lstFilterValue = fildFilterValue.split(',');
	for ( var j = 0; j < lstFilter.length; j ++ ){
		console.log( 'Passo 00X',lstFilter[j],lstFilterValue[j] );
		if ( lstFilter[j] != '' && lstFilter[j] != null ){
			constraintsFilhos.push( DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST) );
		}
	}
	var orderFilhos = new Array();
	orderFilhos.push( fieldCodigo );						
	var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos );
	if ( datasetFilhos != null ){

		var valDefault = "";
		console.log('ANTES TESTE VALOR DEFAULT.....',$("#"+combo).val());
		if ( $("#"+combo).val() != "" && $("#"+combo).val() != null && $("#"+combo).val() != undefined ){
			valDefault = $("#"+combo).val();
			console.log('TEM VALOR DEFAULT Jah EXISTEMTE.....',valDefault);
		}
		if( clear == 'S' ){
			$("#"+combo+" option").remove();
		}
		var filhos = datasetFilhos.values;
		console.log( 'Passo 002' );
		
		if( addBlankLine == 'S' ){
			$("#"+combo).append("<option value='' ></option>");
		}
		//var valDefault = '';
		for ( var i in filhos ) {
			var filho = filhos[i];
			console.log( 'Passo 002', filho[ fieldCodigo ] );
			var den = '';
			//if ( valDefault == '' ){
			//	valDefault = filho[ fieldCodigo ];
			//}
			console.log( filho[ fieldFlag ] );
			if (  valDefault == "" && ( filho[ fieldFlag ] || filho[ fieldFlag ] == 'on' ) ){
				valDefault = filho[ fieldCodigo ];
			}
			
			console.log( 'Passo 002 A',  $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) );
			if ( $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) > -1 ){
				continue;
			} 
			
			if ( fieldDesc == '' ){
				den = filho[ fieldCodigo ];
			}else{
				den = filho[ fieldCodigo ]+' - '+filho[ fieldDesc ];
			}
			$("#"+combo).append("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
			console.log( 'Apende 003',filho[ fieldCodigo ] );
		}
		console.log('valDefault.......',valDefault);
		if ( valDefault != '' ){
			$("#"+combo).val( valDefault );
		}
	}
	
}	

function setTipoFrete(){
	console.log( 'Entrei!!!!' );
	$('#tipo_frete_logix').val( loadCampoDataSet( 'tipo_frete', 'tipo_frete_fluig', $('#tipo_frete').val(), 'tipo_frete_logix' ) );
	
	if (  $('#tipo_frete').val() == "RET"  ){
		//var objDestino = { inputId:'transportadora', inputName:'transportadora', cod_cliente:$('#cod_cliente').val( ), nom_cliente:$('#razao_social').val( ) };
		zoomDestino = window[$("#transportadora").attr('filter-instance')];
		zoomDestino.clear();
		zoomDestino.setValue( $('#razao_social').val( ) );				
		zoomDestino.disable(true);
		$('#cnpj_trans').val(  $('#cnpj').val( ) );
		$('#cod_trans').val(  $('#cod_cliente').val( ) );
	}else if( $('#cod_trans').val() == $('#cod_cliente').val() ){
		zoomDestino = window[$("#transportadora").attr('filter-instance')];
		zoomDestino.clear();		
		zoomDestino.disable(false);
		$('#cnpj_trans').val( "" );
		$('#cod_trans').val( "" );
	}
}