var tipo_devolucao = 0;

function setSelectedZoomItem(selectedItem) {

	console.log('ret zoom', selectedItem);
	console.log('ret zoom', selectedItem.inputName);

	// preenche os dados de representante
	if (selectedItem.inputName == 'razao_social') {
		$('#cod_cliente').val(selectedItem.cod_cliente);
		loadCliente(selectedItem.cod_cliente);
		// verifica se o usuário é do tipo ADM DE VENDAS para carregar todas as
		// empresas do cadastro deste usuário ao invés das
		// empresas do cadastro do usuário de representante
		if ($('#tipoCadUser').val() == 'A') {
			cod_repres = 0;
			cod_matricula = $('#userFluig').val();
			console.log('USUARIO ', cod_matricula);
			var c1 = DatasetFactory.createConstraint('matricula',
					cod_matricula, cod_matricula, ConstraintType.MUST);
			var constraints = new Array(c1);
			// Busca o dataset
			var dataset = DatasetFactory.getDataset('representante_compl',
					null, constraints, null);
			if (dataset != null) {
				cod_repres = dataset.values[0].cod_repres;
			}
			loadRepresCompl(cod_repres, selectedItem.cod_cliente, '01', 'TT');
			carregaNotasFiscais();
		} else {
			console.log('COD_REPRES_SET', $('#cod_repres').val());
			loadRepresCompl($('#cod_repres').val(), selectedItem.cod_cliente,
					'01', 'TT');

			loadRepres($('#cod_repres').val());
			
		}

	}
	
	if ($('#tipoCadUser').val() == 'R'){
		$('#tipo_processo').val('E');
	} else {
		$('#tipo_processo').val('I');
	}
	
	if( selectedItem.type == 'btCliente' ){
		console.log('Codigo do Cliente',selectedItem.cod_cliente);
		$('#cod_cliente').val( selectedItem.cod_cliente );

		loadCliente(selectedItem.cod_cliente);
		var objDestino = { inputId:'razao_social', inputName:'razao_social', cod_cliente:selectedItem.cod_cliente, nom_cliente:selectedItem.nom_cliente.trim() };
		zoomDestino = window[$("#razao_social").attr('filter-instance')];
		zoomDestino.clear();
		//zoomDestino.add( objDestino );				
		zoomDestino.setValue( selectedItem.nom_cliente.trim() );	
		
		if ($('#tipoCadUser').val() == 'A') {
			cod_repres = 0;
			cod_matricula = $('#userFluig').val();
			console.log('USUARIO ', cod_matricula);
			var c1 = DatasetFactory.createConstraint('matricula',
					cod_matricula, cod_matricula, ConstraintType.MUST);
			var constraints = new Array(c1);
			// Busca o dataset
			var dataset = DatasetFactory.getDataset('representante_compl',
					null, constraints, null);
			if (dataset != null) {
				cod_repres = dataset.values[0].cod_repres;
			}
			loadRepresCompl(cod_repres, selectedItem.cod_cliente, '01', 'TT');
			carregaNotasFiscais();
		} else {
			console.log('COD_REPRES_SET', $('#cod_repres').val());
			loadRepresCompl($('#cod_repres').val(), selectedItem.cod_cliente,
					'01', 'TT');

			loadRepres($('#cod_repres').val());
			
		}
	}

}

function loadTipoDevolucao() {
	tipo_devolucao = $('#tipo_devolucao').val();
	console.log('TIPO DEVOLUCAO LOADTIPODEVOLUCAO', tipo_devolucao);
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
	return ' ';
	console.log('fim..... loadCampoDataSet');
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
	constraintsFilhos.push(DatasetFactory.createConstraint("metadata#active",
			true, true, ConstraintType.MUST));
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
		fildFilterValue, fildFilter2, fildFilterValue2, fildFilter3,
		fildFilterValue3, exibeCodigo, adicionaLinhaVazia) {

	console.log('Passo 001');

	var constraintsFilhos = new Array();
	if (fildFilter != '' && fildFilter != null) {
		constraintsFilhos.push(DatasetFactory.createConstraint(fildFilter,
				fildFilterValue, fildFilterValue, ConstraintType.MUST));
	}
	if (fildFilter2 != '' && fildFilter2 != null) {
		constraintsFilhos.push(DatasetFactory.createConstraint(fildFilter2,
				fildFilterValue2, fildFilterValue2, ConstraintType.MUST));
	}
	if (fildFilter3 != '' && fildFilter3 != null) {
		constraintsFilhos.push(DatasetFactory.createConstraint(fildFilter3,
				fildFilterValue3, fildFilterValue3, ConstraintType.MUST));
	}
	var orderFilhos = new Array();
	orderFilhos.push(fieldCodigo);
	var datasetFilhos = DatasetFactory.getDataset(dataSet, null,
			constraintsFilhos, orderFilhos);
	if (datasetFilhos != null) {

		var filhos = datasetFilhos.values;
		console.log('Passo 002');
		// $("#empresa").append("<option value='' ></option>");

		var valDefault = '';
		$("#" + combo).empty();
		if (adicionaLinhaVazia == "S") {
			$("#" + combo).append(
					"<option value='" + 0 + "' >" + " " + "</option>");
		}
		for ( var i in filhos) {
			var filho = filhos[i];
			console.log('Passo 002', filho[fieldCodigo]);
			var den = '';
			if (valDefault == '') {
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
				console.log("exibeCodigo" + exibeCodigo);
				if (exibeCodigo == "S") {
					den = filho[fieldCodigo] + ' - ' + filho[fieldDesc];
				} else {
					den = filho[fieldDesc];
				}
			}

			$("#" + combo).append(
					"<option value='" + filho[fieldCodigo] + "' >" + den
							+ "</option>");
			console.log('Apende 003', filho[fieldCodigo]);
		}
		if (valDefault != '') {
			$("#" + combo).val(valDefault);
		}
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
			$('#den_cidade').val(row.DEN_CIDADE);
			$('#uf').val(row.COD_UNI_FEDER);
			$('#nom_repres').val(row.RAZ_SOCIAL);
			$('#telefone').val(row.NUM_TELEFONE);

		}
	}

}

function loadRepres(cod_repres) {

	console.log("## Repres ## " + cod_repres);
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("cod_repres", cod_repres,
			cod_repres, ConstraintType.MUST));
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

	if (dataset != null) {
		console.log(dataset);

		// for (var x = 0; x < dataset.values.length; x++) {

		/*console.log("## parametros ## " + dataset.values[0].perc_mix_ger_reg);
		$("#perc_mix_ger_reg").val(dataset.values[0].perc_mix_ger_reg);
		$("#perc_mix_ger_nac").val(dataset.values[0].perc_mix_ger_nac);
		$("#perc_desc_ger_reg").val(dataset.values[0].perc_desc_ger_reg);
		$("#perc_desc_ger_nac").val(dataset.values[0].perc_desc_ger_nac);*/

		// }
	}
}

function loadRepresCompl(codRepres, codCliente, codMoeda, info) {

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
	if (datasetPai != null) {
		console.log('Pai Filho ', datasetPai.values.length);
		for (var x = 0; x < datasetPai.values.length; x++) {
			var pai = datasetPai.values[x];
			console.log('LINHA................', x, pai);
			console.log('INFO ', info);
			if (info == 'EMP' || info == 'TT') {
				// Carga Empresa
				// $("#empresa option").remove();
				console.log('CHAMOU CARGA DOS COMBOS DE PAI E FILHO');
				loadPaiFilhoCombo('empresa', 'representante_compl', 'empresa',
						pai.documentid, pai.version, 'cod_empresa',
						'emp_reduz', 'ies_empresa_default', null, null);
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

function selectElement(element, valueToSelect) {
	var element = document.getElementById(element);
	element.value = valueToSelect;
}

function loadPerguntas() {
	var task = $('#task').val();
	if (task == 0 || task == 4 || task == 5){
	var tipoProduto;
	tipoProduto = $('#tipo_produto').val();
	console.log('ENTROU NAS PERGUNTAS', tipoProduto);
	var foi_alterado = $('#tipo_alterado').val();

	if (foi_alterado == "S") {
		// limpa os itens da table de perguntas
		$('textarea').each(
				function() {
					console.log('ENTROU NO LAÇO');
					if ($(this).is('textarea')
							&& $(this).attr('name').indexOf('___') != -1) {
						fnWdkRemoveChild(this);
					}
				});

		var constraints;
		if (tipoProduto == '1') {
			var c1 = (DatasetFactory.createConstraint("tipo_produto", 1, 1,
					ConstraintType.SHOULD));
			var c2 = (DatasetFactory.createConstraint("tipo_produto", 4, 4,
					ConstraintType.SHOULD));
			var c3 = (DatasetFactory.createConstraint("tipo_produto", 5, 5,
					ConstraintType.SHOULD));
			constraints = new Array(c1, c2, c3);
		}

		if (tipoProduto == '2') {
			var c1 = (DatasetFactory.createConstraint("tipo_produto", 2, 2,
					ConstraintType.SHOULD));
			var c2 = (DatasetFactory.createConstraint("tipo_produto", 4, 4,
					ConstraintType.SHOULD));
			var c3 = (DatasetFactory.createConstraint("tipo_produto", 5, 5,
					ConstraintType.SHOULD));
			constraints = new Array(c1, c2, c3);
		}

		if (tipoProduto == '3') {
			var c1 = (DatasetFactory.createConstraint("tipo_produto", 3, 3,
					ConstraintType.SHOULD));
			var c2 = (DatasetFactory.createConstraint("tipo_produto", 5, 5,
					ConstraintType.SHOULD));
			constraints = new Array(c1, c2);
		}
		
		if (tipoProduto == '6') {
			var c1 = (DatasetFactory.createConstraint("tipo_produto", 6, 6,
					ConstraintType.SHOULD));
			var c2 = (DatasetFactory.createConstraint("tipo_produto", 5, 5,
					ConstraintType.SHOULD));
			constraints = new Array(c1, c2);
		}
		
		if (tipoProduto == 'F') {
			var c1 = (DatasetFactory.createConstraint("tipo_produto", 'F', 'F',
					ConstraintType.SHOULD));
			constraints = new Array(c1);
		}
		

		var perguntas = DatasetFactory.getDataset("perguntas_asstecnica", null,
				constraints, null);
		if (perguntas != null) {
			for (var x = 0; x < perguntas.values.length; x++) {
				var row = perguntas.values[x];
				console.log(row);
				console.log('PERGUNTA...', row.descricao_pergunta);
				console.log('TIPO_PRODUTO...', row.tipo_produto);
				var seq = wdkAddChild('perguntas');
				$('#pergunta___' + seq).val(row.descricao_pergunta);
				// autodimensional inicio
				$('#pergunta___' + seq).on(
						'keyup input keypress keydown change',
						function(e) {
							var tamanhoMin = $(this).attr('rows')
									* $(this).css('line-height').replace(
											/[^0-9\.]+/g, '');
							$(this).css({
								'height' : 'auto'
							});
							var novoTamanho = this.scrollHeight
									+ parseFloat($(this).css("borderTopWidth"))
									+ parseFloat($(this).css(
											"borderBottomWidth"));
							if (tamanhoMin > novoTamanho)
								novoTamanho = tamanhoMin;
							$(this).css({
								'height' : novoTamanho
							});
						}).css({
					'overflow' : 'hidden',
					'resize' : 'none'
				}).delay(0).show(0, function() {
					var el = $(this);
					setTimeout(function() {
						el.trigger('keyup');
					}, 100);
				});
				// autodimensinal fim
			}
			autoSize();
		}
		console.log('SAIU AS PERGUNTAS', tipoProduto);
		$('#tipo_alterado').val("N");
	}
	}
}


function getResponsavelDevolucao() {
	// recuperando do dataset interno de cadastro de motivos de devolução o tipo
	// da devolução
	// Monta as constraints para consulta

	cod_motivo = $('#motivo_devolucao').val();
	var c1 = DatasetFactory.createConstraint("cod_motivo_devolucao",
			cod_motivo, cod_motivo, ConstraintType.MUST);
	var constraints = new Array(c1);

	// Define os campos para ordenação
	// var sortingFields = new Array("cod_motivo_devolucao");

	// Busca o dataset
	var dataset = DatasetFactory.getDataset("motivos_devolucao", null,
			constraints, null);

	console.log(dataset);
	var responsavel = dataset.values[0].responsavel;

	// fim da recuperação

	$('#responsavel_devolucao').val(responsavel);
	console.log('RESPONSAVEL_DEVOLUCAO', $('#responsavel_devolucao').val());
}

function zoomButton(componente) {
	
	console.log('Busca Pedido....',componente );
	
	if ( componente == 'btCliente' ){
		
		console.log('Busca Clientes....',componente );

		console.log('Busca Clientes....',componente );

		if ($('#tipoCadUser').val() == "R" ) {
			modalzoom.open("Clientes",
						   "clientes_logix", 
						   "cod_cliente,Cod. Cliente,nom_cliente,Nome,cnpj,CNPJ,den_cidade,Cidade,cod_uni_feder,UF", 
						   "cod_cliente,nom_cliente,cnpj,cod_repres,cod_user,den_cidade,cod_uni_feder", 
						   "cod_user,"+$('#userFluig').val(),
						   componente, false, "default", null, null,
						   "cod_cliente||'-'||nom_cliente||'-'||cnpj||'-'||den_cidade||'-'||cod_uni_feder" );	
		} else {
			if ($('#tipoCadUser').val() == "A" ) {
				modalzoom.open("Clientes",
						   "clientes_logix", 
						   "cod_cliente,Cod. Cliente,nom_cliente,Nome,cnpj,CNPJ,den_cidade,Cidade,cod_uni_feder,UF", 
						   "cod_cliente,nom_cliente,cnpj,cod_repres,cod_user,den_cidade,cod_uni_feder", 
						   "",
						   componente, false, "default", null, null,
						   "cod_cliente||'-'||nom_cliente||'-'||cnpj||'-'||den_cidade||'-'||cod_uni_feder" );	
			} else {
				modalzoom.open("Clientes",
						   "clientes_logix", 
						   "cod_cliente,Cod. Cliente,nom_cliente,Nome,cnpj,CNPJ,den_cidade,Cidade,cod_uni_feder,UF", 
						   "cod_cliente,nom_cliente,cnpj,cod_repres,cod_user,den_cidade,cod_uni_feder", 
						   "cod_user,"+$('#userFluig').val(),
						   componente, false, "default", null, null,
						   "cod_cliente||'-'||nom_cliente||'-'||cnpj||'-'||den_cidade||'-'||cod_uni_feder" );	
			}
		}
	}
}

