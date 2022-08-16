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
			carregaNotasFiscais();
		}

	}

}

function loadTipoDevolucao() {
	tipo_devolucao = $('#tipo_devolucao').val();
	console.log('TIPO DEVOLUCAO LOADTIPODEVOLUCAO', tipo_devolucao);
	if (tipo_devolucao == '1'){
		$('#div_ceramfix_nota').css("visibility", "visible");
	} else {
		$('#div_ceramfix_nota').css("visibility", "hidden");
	}
}

function carregaNotasFiscais() {
	var cod_empresa = $('#empresa').val();
	var cod_cliente = $('#cod_cliente').val();
	var cod_representante = $('#cod_repres').val();
	console.log("empresa...", cod_empresa);
	console.log("cliente...", cod_cliente);
	console.log("representante...", cod_representante);
	loadDataSetCombo('nota_fiscal', 'ds_busca_notas_rep', 'TRANS_NOTA_FISCAL',
			'NOTA_FISCAL', 'empresa', cod_empresa, 'cliente', cod_cliente,
			null, null, "N", "S");
	selectElement("nota_fiscal", 0);
	//carrega os motivos de devolucao
	loadDataSetCombo('motivo_devolucao', 'motivos_devolucao', 'cod_motivo_devolucao', 'desc_motivo_devolucao', '', '', '', '', '', '', "N", "S");
	//fim da carga dos motivos de devolucao
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
		if (adicionaLinhaVazia == "S") {
			$("#" + combo).val("");
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

function loadItensNota(codEmpresa, transNotaFiscal) {
	
	//limpa campos de totais
	var valTotal = 0.00;
	$('#valor_total_geral').val(valTotal); 
	
	var valTotalFCP = 0.00;
	$('#valor_total_FCP').val(valTotalFCP); 
	
	var valTotalIPI = 0.00;
	$('#valor_total_IPI').val(valTotalIPI); 
	
	var valTotalICMS = 0.00;
	$('#valor_total_ICMS').val(valTotalICMS);
	
	var valTotalICMSST = 0.00;
	$('#valor_total_ICMS_ST').val(valTotalICMSST);
	
	var valTotalBaseFCP = 0.00;
	$('#valor_total_bc_fcp').val(valTotalBaseFCP);
	
	var valTotalBaseIPI = 0.00;
	$('#valor_total_bc_ipi').val(valTotalBaseIPI);
	
	var valTotalBaseICMSST = 0.00;
	$('#valor_total_bc_icms_st').val(valTotalBaseICMSST);
	
	var valTotalBaseICMS = 0.00;
	$('#valor_total_bc_icms').val(valTotalBaseICMS);
	
	var valTotalcomImpostos = 0.00;
	$('#valor_total_impostos').val(valTotalcomImpostos);
	//fim limpa campos de totais

	var c1 = (DatasetFactory.createConstraint("cod_empresa", codEmpresa,
			codEmpresa, ConstraintType.MUST));
	var c2 = (DatasetFactory.createConstraint("trans_nota_fiscal",
			transNotaFiscal, transNotaFiscal, ConstraintType.MUST));
	var constraints = new Array(c1, c2);

	var itensnota = DatasetFactory.getDataset("ds_busca_itens_nota_fiscal",
			null, constraints, null);
	console.log('EMPRESA NOTA FISCAL...', codEmpresa);
	console.log('TRANS NOTA FISCAL...', transNotaFiscal);
	console.log('Itens Nota Fiscal... ', itensnota);

	if (itensnota != null) {
		console.log('Entrou aqui...!!!');

	}
	var qtd_item_total = 0;
	var qtd_devolvida_total = 0;
	tipo_devolucao = $('#tipo_devolucao').val();
	$('#qtd_itens').val(itensnota.values.length);
	for (var x = 0; x < itensnota.values.length; x++) {

		var row = itensnota.values[x];
		console.log('SEQ...', row.SEQ_ITEM_NF);
		console.log('QTDE_ITEM...', row.QTD_ITEM);
		console.log('QTDE_DEVOLVIDA...', row.QTD_DEVOLVIDA);
		qtd_item_total = qtd_item_total + Number(row.QTD_ITEM);
		qtd_devolvida_total = qtd_devolvida_total + Number(row.QTD_DEVOLVIDA);
		var num_nota_fiscal = row.NOTA_FISCAL;
		console.log('NOTA FISCAL...!!! ', num_nota_fiscal);
		$('#num_nota_fiscal').val(num_nota_fiscal);
	}
	$('#qtd_saldo_a_devolver').val(0);
	var qtd_saldo_a_devolver = 0;
	qtd_saldo_a_devolver = qtd_item_total - qtd_devolvida_total;
	console.log('QTDE_ITEM_TOTAL...', qtd_item_total);
	console.log('QTDE_DEVOLVIDA_TOTAL...', qtd_devolvida_total);
	console.log('SALDO A DEVOLVER...', qtd_saldo_a_devolver);
	$('#qtd_saldo_a_devolver').val(qtd_saldo_a_devolver);
	console.log('SALDO VALIDA ORIGINAL...', $('#qtd_saldo_a_devolver').val());

	if (qtd_saldo_a_devolver != 0) {

		// limpa os itens da table de itens da nota fiscal
		$('input[name]').each(
				function() {

					if ($(this).is('input')
							&& $(this).attr('name').indexOf('___') != -1) {
						fnWdkRemoveChild(this);
					}
				});

		for (var x = 0; x < itensnota.values.length; x++) {

			var row = itensnota.values[x];

			qtd_item_total = qtd_item_total + Number(row.QTD_ITEM);
			qtd_devolvida_total = qtd_devolvida_total
					+ Number(row.QTD_DEVOLVIDA);

			var seq = wdkAddChild('nota_itens');

			console.log('ENTROU NA CARGA DE ITENS...');
			var pre_unit = Number(row.PRECO_UNIT_LIQUIDO);
			var quantidade = Number(row.QTD_ITEM);
			var pre_total = Number(row.VAL_LIQUIDO_ITEM);
			console.log('COD ITEM...', row.ITEM);
			$('#seq_item___' + seq).val(row.SEQ_ITEM_NF);
			$('#cod_item___' + seq).val(row.ITEM);
			$('#des_item___' + seq).val(row.DES_ITEM);
			$('#um___' + seq).val(row.UNID_MEDIDA);
			$('#pre_unit___' + seq).val(
					(String(pre_unit.toFixed(3)).replace('.', ',')));
			$('#quantidade___' + seq).val(
					(String(quantidade.toFixed(3)).replace('.', ',')));
			$('#pre_total___' + seq).val(
					(String(pre_total.toFixed(2)).replace('.', ',')));
			$('#qtd_devolvida___' + seq).val(row.QTD_DEVOLVIDA);
			$('#qtd_devolvida___' + seq).val(row.QTD_DEVOLVIDA);
			$('#bc_fecomp___' + seq).val(row.BC_FECOMP);
			$('#val_fecomp___' + seq).val(row.VAL_FECOMP);
			$('#bc_ipi___' + seq).val(row.BC_IPI);
			$('#val_ipi___' + seq).val(row.VAL_IPI);
			$('#bc_st___' + seq).val(row.BC_ST);
			$('#val_st___' + seq).val(row.VAL_ST);
			$('#bc_st_gnre___' + seq).val(row.BC_ST_GNRE);
			$('#val_st_gnre___' + seq).val(row.VAL_ST_GNRE);
			$('#bc_icms___' + seq).val(row.BC_ICMS);
			$('#val_icms___' + seq).val(row.VAL_ICMS);
			
			$('#aliquota_icms___' + seq).val(row.ALIQ_ICMS);
			console.log('ALIQUOTA ICMS ',$('#aliquota_icms___' + seq).val());
			
			$('#aliquota_icms_geral').val(row.ALIQ_ICMS);
			console.log('ALIQUOTA ICMS 3',$('#aliquota_icms_geral').val());
			
			$('#cfop___' + seq).val(row.CFOP);		
			$('#cfop_geral').val(row.CFOP);

			console.log('QTDE_PADR_EMBAL_ANTES', row.QTD_PADR_EMBAL);
			$('#qtd_pad_edit___' + seq).val(row.QTD_PADR_EMBAL);
			console.log('QTDE_PADR_EMBAL_DEPOIS', $('#qtd_pad_edit___' + seq)
					.val());

			if (tipo_devolucao != 1) {
				$('#qtd_devolver___' + seq).maskMoney({
					precision : 0,
					thousands : '.',
					decimal : ',',
					defaultZero : true,
					allowZero : true
				});
			}

			$('#qtd_devolver___' + seq)
					.blur(
							function() {
								// buscar quantidade multipla e quantidade da
								// nota fiscal e já devolvida
								var comp_multiplo = $(this).attr('name').split(
										"___")[1];
								console.log('COMP', comp_multiplo);
								var qtd_multiplo = Number($(
										'#qtd_pad_edit___' + comp_multiplo)
										.val());
								var qtd_nota_fiscal = ($('#quantidade___'
										+ comp_multiplo).val());
								var qtd_nota_fiscal_tratada = Number(qtd_nota_fiscal
										.substring(0, qtd_nota_fiscal
												.indexOf(',')));
								var qtd_devolvida = Number($(
										'#qtd_devolvida___' + comp_multiplo)
										.val());
								// termina busca

								var qtd_digitada_original = $(this).val();
								var qtd_digitada = Number(qtd_digitada_original
										.replace(".", ""));
								// valida o multiplo

								console.log('QTDE_MULTIPLO', qtd_multiplo);
								/*if ((qtd_digitada % qtd_multiplo) != 0) {

									// $('#quantidade_edit').focus();
									$(this).focus();

									FLUIGC
											.toast({
												title : 'Quantidade: ',
												message : 'A quantidade deve ser multiplo de: '
														+ String(qtd_multiplo),
												type : 'warning',
												timeout : 'fast'
											});
									return false;
								}*/
								console.log('TIPO DEVOL', tipo_devolucao);
								if (Number(tipo_devolucao) == 2) {
									console.log('QTD_DIGITADA', qtd_digitada);
									console.log('QTD_NOTA_FISCAL_TRATADA',
											qtd_nota_fiscal_tratada);
									console.log('QTD_DEVOLVIDA', qtd_devolvida);
									if ((qtd_digitada + qtd_devolvida) > qtd_nota_fiscal_tratada) {
										$('#diferenca_qtd').val("S");
										console.log('ENTROU NO IF 2');
										$(this).focus();

										FLUIGC
												.toast({
													title : 'Quantidade: ',
													message : 'Quantidade Devolvida não pode ser maior que o saldo a devolver a nota fiscal!',
													type : 'warning',
													timeout : 'fast'
												});
										return false;
									} else {
										$('#diferenca_qtd').val("N");
									}

								}

							});

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
