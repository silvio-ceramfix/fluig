var abaTotal = 3;
var aba = 1;
var qtd = 0;
var qtdSleep = 0;

var valAtu = "";

var loadingPrincipial = FLUIGC.loading("divPrincipal");
loadingPrincipial.title = "Carregando......";

$(document).bind("DOMNodeRemoved", function(e) {

});

function clearEndereco(id) {

	zoomDestino = window[$("#cidade_ent").attr('filter-instance')];
	zoomDestino.clear();

	$('#tipo_logradouro_ent').val('');
	$('#endereco_ent').val('');
	$('#sem_numero_ent').prop('checked', false);
	setSemNumero('sem_numero_ent', 'numero_ent');
	$('#numero_ent').val('');
	$('#cod_cidade_ent').val('');
	$('#cep_ent').val('');
	$('#ies_bairro_ent_manual').prop('checked', false);
	alteraCampos('ies_bairro_ent_manual', 'bairro_ent_sel', 'bairro_ent');
	$('#bairro_ent_sel').val('');
	$('#bairro_ent').val('');
	$('#cnpj_ent').val('');
	$('#isento_ie_ent').prop('checked', false);

	$('#ie_ent').val('');

}

function getLinhaCampoPF(campo) {
	return campo.substring(campo.indexOf('___') + 3, campo.length);
}

function fnCustomDelete(oElement) {
	var task = $('#task').val();
	console.log('TASK...', task);
	if (task == 0 || task == 1) {
		seq = getIdParentChild(oElement).split('___')[1];
		console.log('fnCustomDelete', $('#processo').val(), $(
				'#sequencia___' + seq).val());
		var tipo_devolucao_delete = Number($('#tipo_devolucao').val());
		if (tipo_devolucao_delete == 1) {
			FLUIGC
					.toast({
						title : 'Valida&ccedil;&atilde;o: ',
						message : 'Você não pode excluir itens de uma devolução total!',
						type : 'warning',
						timeout : 'fast'
					});
			return false;
		}
		fnWdkRemoveChild(oElement);
	}
}

function getIdParentChild(element) {
	var form, row = null;
	var hasRow = false;
	var hasForm = false;
	while (element != null) {
		if (element.id != null) {
			if (!hasRow && element.nodeName.toUpperCase() == "TR") {
				row = element;
				hasRow = true;
			} else {
				if (!hasForm && element.nodeName.toUpperCase() == "FORM") {
					form = element;
					hasForm = true;
				}
			}
		}
		element = element.parentNode;
	}
	var arrayInput = $(row).find("input");
	$.each(arrayInput, function(index, input) {
		if ($(input).prop("readonly")) {
			$
					.each($(form).find("input[type=hidden]"),
							function(i, inputHidden) {
								var idInput = $(input).attr("name");
								var idInputHidden = "_"
										+ $(inputHidden).attr("name");
								if (idInput
										&& idInputHidden.valueOf() == idInput
												.valueOf()) {
									$(inputHidden).remove();
								}
							});
		}
	});
	console.log(' parent...... ', $(row).attr('id'));
	return $(row).attr('id');
}

function isUndefined(campo) {
	if (campo == null || campo == undefined) {
		return "";
	} else {
		return campo;
	}
}

function nextPage() {

	if (validaAba(aba)) {

		$("#aba_" + aba).hide();
		if (aba == 1) {
			$("#btn_cancel").show();

		}

		aba++;

		$("#aba_" + aba).show();
		if (aba == abaTotal)
			$("#btn_confirma").hide();

		$('#current_step').html(aba);
		$('#total_steps').html(abaTotal);

		// clearItem('movto');

	}
}

function lastPage() {
	if (aba == abaTotal)
		$("#btn_confirma").show();
	$("#aba_" + aba).hide();
	aba--;
	$("#aba_" + aba).show();
	if (aba == 1)
		$("#btn_cancel").hide();

	$('#current_step').html(aba);
	$('#total_steps').html(abaTotal);

	// clearItem('movto');

}

var beforeSendValidate = function(numState, nextState) {

	console.log('Aba....' + aba);
	console.log('Valida....' + validaAba(aba));
	if (aba != 3) {
		alert("Você precisa estar na terceira aba para Enviar este processo!");
		return false;
	} else {
		if ((aba == 3) && ($('#descricao').val() == '' || $('#mercadoria_retorna').val() == '')) {
			if ($('#task').val() == "4" || $('#task').val() == "0") {
				alert("Você precisa informar o campo Observações e o retorno da mercadoria!")
			}
			return false;
		} else {
			return true;
		}
	}
}

function autoSize() {
	$('textarea').each(
			function() {
				this.setAttribute('style', 'height:' + (this.scrollHeight + 32)
						+ 'px;overflow-y:hidden;');
			}).on('input', function() {
		// style="height: 32px; overflow-y: hidden;"
		this.style.height = 'auto';
		this.style.height = (this.scrollHeight) + 'px';
	});
}

function setCorFilhos(id, color) {
	// console.log('entrei color',id);
	$('div, span', $('#' + id + '_grp')).each(function() {
		// console.log('entrei grupo color', $(this).attr('class') );
		if ($(this).hasClass('bootstrap-tagsinput') /*
													 * ||
													 * $(this).hasClass('select2-selection--multiple')
													 */) {
			$($(this)).css({
				'background-color' : color
			});
		}
	});
}

function validaAba(aba) {

	if ($("#modo").val() == "VIEW") {
		return true;
	}

	var msg = '';
	var msg_valida = '';
	var task = $('#task').val();
	setFocus = true;
	console.log('ABA', aba);

	// desabilita e habilita o campo para solicitar anexo de nota fiscal de
	// devolução internamente
	if (aba == 2 && $('#tipoCadUser').val() == 'A') {
		$('#div_check_anexa_nfd').css("visibility", "visible");
	} else {
		$('#div_check_anexa_nfd').css("visibility", "hidden");
	}
	// valida quantidades devolvidas e carrega as quantidades totais caso a
	// devolucao seja total
	if (aba == 1) {
		
		if (task == 0 || task == 1 || task == 4) {
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
			
			var valTotalBaseIPI = 0.00;
			$('#valor_total_bc_ipi').val(valTotalBaseIPI);
			
			var valTotalBaseICMSST = 0.00;
			$('#valor_total_bc_icms_st').val(valTotalBaseICMSST);
			
			var valTotalBaseICMS = 0.00;
			$('#valor_total_bc_icms').val(valTotalBaseICMS);
			
			var valTotalcomImpostos = 0.00;
			$('#valor_total_impostos').val(valTotalcomImpostos);
			//fim limpa campos de totais
		}

		var tipo_devolucao = $('#tipo_devolucao').val();
		console.log('TIPO DEV ABA 1', tipo_devolucao);

		if (task == 0 || task == 1) {
			if (tipo_devolucao == 1) {
				// total
				console.log('ENTROU NO IF DE TIPO DE DEVOLUCAO');
				console.log('TOTAL');
				console.log('QTD_ITENS', $('#qtd_itens').val());

				var qtd_itens_percorrer = Number($('#qtd_itens').val());

				$('input[name]')
						.each(
								function() {

									if ($(this).is('input')
											&& $(this).attr('name').indexOf(
													'quantidade___') != -1) {
										var sequencial = 0;
										sequencial = $(this).attr('name')
												.split("___")[1];
										console.log('SEQUENCIAL DO EACH...',
												sequencial);

										var qtd = isNull(
												(Math
														.round(parseFloat(($('#quantidade___'
																+ sequencial)
																.val())
																.replace('.',
																		'')
																.replace(',',
																		'.')) * 10000) / 10000),
												0);// ($('#quantidade___' +
										// sequencial)
										// .val());
										console.log('QTD_NEGOCIO', qtd);
										// var qtd_tratada =
										// Number(qtd.replace(',',
										// ''));
										var qtd_devolvida = isNull(
												(Math
														.round(parseFloat(($('#qtd_devolvida___'
																+ sequencial)
																.val())
																.replace('.',
																		'')
																.replace(',',
																		'.')) * 10000) / 10000),
												0);// Number($('#qtd_devolvida___'
										// + sequencial).val());
										var qtd_saldo = 0;
										qtd_saldo = qtd - qtd_devolvida;
										$('#qtd_devolver___' + sequencial).val(
												qtd_saldo);
										/*
										 * $('#qtd_devolver___' + sequencial)
										 * .removeAttr('readonly', true);
										 */
										$('#qtd_devolver___' + sequencial)
												.attr('readonly', true);
										calculaTotal($('#qtd_devolver___' + sequencial), 'S');
									}
									
								});

			} else {
				// parcial
				// var qtd_itens_percorrer = Number($('#qtd_itens').val());
				$('input[name]')
						.each(
								function() {

									if ($(this).is('input')
											&& $(this).attr('name').indexOf(
													'quantidade___') != -1) {
										var sequencial = 0;
										sequencial = $(this).attr('name')
												.split("___")[1];
										console.log('SEQUENCIAL DO EACH...',
												sequencial);

										// console.log('ENTROU NO FOR 2', x);
										$('#qtd_devolver___' + sequencial).val(
												0);
										$('#qtd_devolver___' + sequencial)
												.attr('readonly', false);
									}
								});
			}
		}

	}
	// valida quantidades devolvidas na devolução
	// parcial se não estão como zero
	var tipo_devolucao = $('#tipo_devolucao').val();
	if (task == 0 || task == 1) {
		
		if (aba == 2 && $('#diferenca_qtd').val()=="S"){
			msg_valida += 'A quantidade a devolver não pode ser maior que o saldo a ser devolvido! ';
		}

		if (aba == 2 && tipo_devolucao == 2) {

			var qtd_devolver_digitada_total;
			qtd_devolver_digitada_total = Number(0);
			// var tipo_devolucao = $('#tipo_devolucao').val();
			if (tipo_devolucao == 2) {
				var qtd_itens_percorrer = Number($('#qtd_itens').val());

				$("input[name^='qtd_devolver___']")
						.each(
								function() {
									var qtd = isNull(
											(Math
													.round(parseFloat(($(this)
															.val()).replace(
															'.', '').replace(
															',', '.')) * 10000) / 10000),
											0);
									console.log('QTD_DEVOLVER_TOTAL_QTD', qtd);
									if (isNaN(qtd)) {
										qtd = 0;
									}

									qtd_devolver_digitada_total = (qtd_devolver_digitada_total + qtd);
									console.log('QTD_DEVOLVER_TOTAL',
											qtd_devolver_digitada_total);

								});
			}
			if (qtd_devolver_digitada_total == 0) {
				msg_valida += ' Você deve informar quantidade em pelo menos um item!';
			}
		}
	}
	// fim valida quantidades devolvidas na devolução
	// parcial se não estão como zero

	$('input, select', $('#aba_' + aba))
			.each(
					function() {

						if (($(this).attr('pf') != "S" || ($(this).attr('pf') == "S" && $(
								this).attr('name').indexOf('___') != -1))
								&& !$(this).attr('readonly')) {

							$('#' + $(this).attr('id')).css({
								'background-color' : '#FFFFFF'
							});
							setCorFilhos($(this).attr('id'), '#FFFFFF');

							console.log('ATR Valida......', $(this).attr(
									'valida'));
							if ($(this).attr('valida') != undefined
									&& $(this).attr('valida') != ""
									&& ($(this).val() == ""
											|| $(this).val() == null || $(this)
											.val() == undefined)) {

								// ############
								// ############
								if (!((aba == 1 && $(this).attr('id') == 'cei')
										|| (aba == 3
												&& !$('#ies_bairro_ent_manual')
														.is(":checked") && $(
												this).attr('id') == 'bairro_ent')
										|| (aba == 3
												&& $('#ies_bairro_ent_manual')
														.is(":checked") && $(
												this).attr('id') == 'bairro_ent_sel') || (aba == 3
										&& $('#tipo_logradouro_ent').val() == ""
										&& $('#cep_ent').val() == ""
										&& $('#cidade_ent').val() == null
										&& $('#numero_ent').val() == ""
										&& $('#endereco_ent').val() == ""
										&& ($('#bairro_ent').val() == "" || $(
												'#bairro_ent_sel').val() == "") && ($(
										'#bairro_ent_sel').val() == ""
										|| $('#bairro_ent_sel').val() == null || $(
										'#bairro_ent_sel').val() == undefined)))) {
									$($(this)).css({
										'background-color' : '#FFE4C4'
									});
									setCorFilhos($(this).attr('id'), '#FFE4C4');
									msg += ' ' + $(this).attr('valida');

									if (setFocus) {
										setFocus = false;
										// $(this).focus();
										console.log('ID......'
												+ $(this).attr('id'));
										setTimeout("$('#" + $(this).attr('id')
												+ "').focus();", 1);
									}
								}
							}

							if (aba == 1 && $(this).attr('id') == 'nota_fiscal'
									&& $('#nota_fiscal').val() == 0) {

								$($(this)).css({
									'background-color' : '#FFE4C4'
								});
								setCorFilhos($(this).attr('id'), '#FFE4C4');
								msg_valida += ' Selecione uma nota fiscal!';
							}

							if (aba == 1
									&& $('#nota_fiscal').val() != 0
									&& $(this).attr('id') == 'qtd_saldo_a_devolver'
									&& $('#qtd_saldo_a_devolver').val() == 0) {
								msg_valida += 'Esta nota fiscal não possui saldo para devolução!';

							}

							if ($(this).val() != '') {

								if ($(this).attr('regra') == 'cnpjcpf') {
									var valido = false;
									var tipo = '';
									if ($(this).val().indexOf('/0000-') == -1) {
										console.log('CNPJ...' + $(this).val()
												+ ' '
												+ $(this).val().substring(1));
										valido = validaCNPJ($(this).val()
												.substring(1));
										tipo = 'CNPJ';
									} else {
										console.log('CPF...'
												+ $(this).val()
												+ ' '
												+ $(this).val().replace(
														'/0000-', ''));
										valido = validaCPF($(this).val()
												.replace('/0000-', ''));
										tipo = 'CPF';
									}
									if (!valido) {
										$($(this)).css({
											'background-color' : '#FFA500'
										});
										setCorFilhos($(this).attr('id'),
												'#FFA500');
										msg_valida += ' ' + tipo
												+ ' Inv&aacute;lido!';
									}
								}

								if ($(this).attr('regra') == 'cnpj'
										&& !validaCNPJ($(this).val())) {
									$($(this)).css({
										'background-color' : '#FFA500'
									});
									setCorFilhos($(this).attr('id'), '#FFA500');
									msg_valida += ' CNPJ Inv&aacute;lido!';
								}

								if ($(this).attr('regra') == 'cpf'
										&& !validaCPF($(this).val())) {
									$($(this)).css({
										'background-color' : '#FFA500'
									});
									setCorFilhos($(this).attr('id'), '#FFA500');
									msg_valida += ' CPF Inv&aacute;lido!';
								}

								if ($(this).attr('regra') == 'cep'
										&& !validaCEP($(this).val())) {
									$($(this)).css({
										'background-color' : '#FFA500'
									});
									setCorFilhos($(this).attr('id'), '#FFA500');
									msg_valida += ' CEP Inv&aacute;lido!';
								}

								if ($(this).attr('regra') == 'email'
										&& !validaEmail($(this).val())) {
									$($(this)).css({
										'background-color' : '#FFA500'
									});
									setCorFilhos($(this).attr('id'), '#FFA500');
									msg_valida += ' E-Mail Inv&aacute;lido!';
								}

								if ($(this).attr('regra') == 'ie'
										&& !validaIE($(this).val(), $(
												'#'
														+ $(this).attr(
																'campoEstado'))
												.val())) {
									$($(this)).css({
										'background-color' : '#FFA500'
									});
									setCorFilhos($(this).attr('id'), '#FFA500');
									msg_valida += ' Inscri&ccedil;&atilde;o Estadual Inv&aacute;lido!';
								}

								if (msg_valida != '' && setFocus) {
									setFocus = false;
									// $(this).focus();
									setTimeout("$('#" + $(this).attr('id')
											+ "').focus();", 1);
								}

							}
						}
					});

	if (msg != "" || msg_valida != "") {
		if (msg != "") {
			FLUIGC.toast({
				title : 'Preenchimento: ',
				message : 'Voc&ecirc; deve informar os campos: ' + msg,
				type : 'warning',
				timeout : 'slow'
			});
		}
		if (msg_valida != "") {
			FLUIGC.toast({
				title : 'Valida&ccedil;&atilde;o: ',
				message : msg_valida,
				type : 'warning',
				timeout : 'slow'
			});
		}
		return false;
	}

	return true;
}

function loadBody() {

	// alert( 'VarGlobal 1 ' );
	// alert( localStorage.getItem("teste1") );
	// console.log( 'VarGlobal 2', localStorage.getItem("teste2") );

	$('#current_step').html(aba);
	$('#total_steps').html(abaTotal);

	var data_coleta = FLUIGC.calendar('#data_coleta');
	var data_entrega_edit = FLUIGC.calendar('#data_entrega_edit');

	autoSize();
	// parent.$('#workflowView-cardViewer').css( 'zIndex', 100 );

	console.log('set lista 001', $("#lista_preco").val());
	console.log('set lista 001', $("#lista_preco_hd").val());

	console.log('LOAD 1....', $('#cod_cidade_ent').val(), $('#bairro_ent_sel')
			.val());
	var bairro = $('#bairro_ent_sel').val();

	console.log('BAIRRROOOO......', bairro);
	if (bairro != "" && bairro != null) {
		console.log('ENTREI......', bairro);
		$('#bairro_ent_sel').val(bairro);
	}
	console.log('LOAD 2....');

	console.log('LOAD 3....');
	if ($('#ies_bairro_ent_manual').is(":checked")) {
		$('#bairro_ent_sel').hide();
	} else {
		$('#bairro_ent').hide();
	}
	console.log('LOAD 4....');

	setSemNumero('sem_numero_ent', 'numero_ent');
	console.log('LOAD 5....');
	$('#current_step').html(aba);
	console.log('LOAD 7....');

	$('#etapa').val(aba);
	$('#total_steps').html(abaTotal);

	$('#linha_edit').val('0');

	$('.decimal_6').maskMoney({
		precision : 6,
		thousands : '.',
		decimal : ',',
		defaultZero : true,
		allowZero : true
	});
	$('.decimal_5').maskMoney({
		precision : 5,
		thousands : '.',
		decimal : ',',
		defaultZero : true,
		allowZero : true
	});
	$('.decimal_4').maskMoney({
		precision : 4,
		thousands : '.',
		decimal : ',',
		defaultZero : true,
		allowZero : true
	});
	$('.decimal_3').maskMoney({
		precision : 3,
		thousands : '.',
		decimal : ',',
		defaultZero : true,
		allowZero : true
	});
	$('.decimal_2').maskMoney({
		precision : 2,
		thousands : '.',
		decimal : ',',
		defaultZero : true,
		allowZero : true
	});
	$('.decimal_1').maskMoney({
		precision : 1,
		thousands : '.',
		decimal : ',',
		defaultZero : true,
		allowZero : true
	});
	$('.decimal_0').maskMoney({
		precision : 0,
		thousands : '.',
		decimal : ',',
		defaultZero : true,
		allowZero : true
	});
	$('.integer_0').maskMoney({
		precision : 0,
		thousands : '',
		decimal : '',
		defaultZero : true,
		allowZero : true
	});

	if ($('#ped_representante').val != "0") {
		loadRepresCompl($('#cod_repres').val(), $('#cod_cliente').val(), $(
				'#cod_moeda_cli').val(), 'TT');

		if (($('#task').val() == '26' && $('#ies_desc_medio_reg').val() == 'S')
				|| ($('#task').val() == '30' && $('#ies_desc_medio_nac').val() == 'S')) {
			$('#desc_medio').css({
				'background-color' : '#FF7F50'
			});
		}

		if (($('#task').val() == '26' && $('#ies_mix_geral_reg').val() == 'S')
				|| ($('#task').val() == '30' && $('#ies_mix_geral_nac').val() == 'S')) {
			$('#mix_geral').css({
				'background-color' : '#FF7F50'
			});
		}
	}

	$(".validaAltera").focus(function() {
		console.log('entrei validaAltera focus');
		valAtu = this.value;
	});

	$(".validaAltera").blur(function() {
		console.log('entrei validaAltera blur');
		if (valAtu != this.value) {
			$('#seq_end').val("0");
		}
		valAtu = "";
	});

	$(".validaAltera").change(function() {
		console.log('entrei validaAltera change');
		if (valAtu != this.value) {
			$('#seq_end').val("0");
		}
		valAtu = "";
	});

	if ($('#processo').val() != 'alt_pedido' && $('#task') != "0"
			&& $('#task') != "1") {
		$('#btPedido').hide();
	}
	console.log('entrei na carga do combo');
	
	loadDataSetCombo('motivo_devolucao', 'motivos_devolucao', 'cod_motivo_devolucao', 'desc_motivo_devolucao', 'cod_motivo_devolucao', $('#motivo_devolucao').val(), '', '', '', '', "N", "N");
	
	if ($('#task').val() != 0 ) {
		getResponsavelDevolucao();
	}	
	console.log('sai da carga do combo');
	setTimeout("setFilterCliente( 0 );", 10);

}

function setFilterCliente(qtd) {
	console.log('setFilterCliente.....', qtd, $('#razao_social').val());
	if (qtd >= 10000
			|| (qtd == 0 && $('#razao_social').val() != ""
					&& $('#razao_social').val() != null && $('#razao_social')
					.val() != undefined)) {
		return false;
	}
	try {
		if ($('#tipoCadUser').val() == 'A') {
			console.log('TIPO_CADASTRO_DE_USUARIO2', $('#tipoCadUser').val());
			reloadZoomFilterValues('razao_social', "");
		} else {
			if ($('#razao_social').val() == ""
					|| $('#razao_social').val() == null /*
														 * &&
														 * $('#processo').val() !=
														 * 'alt_pedido'
														 */) {
				console.log("filter ......IES_PEDIDO,S,COD_USER,"
						+ $("#userFluig").val());
				reloadZoomFilterValues('razao_social', "IES_PEDIDO,S,COD_USER,"
						+ $("#userFluig").val());
			} else if ($('#processo').val() == 'alt_pedido') {
				zoomDestino = window[$("#razao_social").attr('filter-instance')];
				zoomDestino.disable(true);
			}
		}
		setUpper();
	} catch (e) {
		console.log('erro.....', qtd, e);
		qtd += 1;
		setTimeout("setFilterCliente( " + qtd + " );", 10);
	}
}

function setUpper() {

	$("input").keypress(function(e) {
		var chr = String.fromCharCode(e.which);
		if ("'\"!#$%ÃÂ¨&*()+=\ÃÂ´`[]{}/?;:>,<\|~ÃÃ§".indexOf(chr) > 0) {
			return false;
		}
	});

	$("input").keyup(function() {
		$(this).val($(this).val().toUpperCase());
	});
}

function maskFone(id) {
	if ($('#' + id).val().length > 14) {
		$('#' + id).unmask();
		$('#' + id).mask("(99) 99999-9999");
	} else {
		$('#' + id).unmask();
		$('#' + id).mask("(99) 9999-9999?9");
	}
}

function mascara(src, mask) {
	var i = src.value.length;
	var saida = mask.substring(0, 1);
	var texto = mask.substring(i);
	if (texto.substring(0, 1) != saida) {
		src.value += texto.substring(0, 1);
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

function setSemNumero(idCampo, idCampoNum, idCampoUF) {
	if ($("#" + idCampo).is(':checked')) {
		$('#' + idCampoNum).attr('readonly', true);
		$('#' + idCampoNum).attr('type', 'text');
		$('#' + idCampoNum).css('background-color', '#DEDEDE');
		$('#' + idCampoNum).val('S/N');
	} else {
		$('#' + idCampoNum).attr('readonly', false);
		$('#' + idCampoNum).attr('type', 'number');
		$('#' + idCampoNum).css('background-color', '#FFFFFF');
		$('#' + idCampoNum).val();
	}
}

function isNull(valor, padrao) {
	if (isNaN(valor)) {
		return padrao;
	} else {
		return valor;
	}
}

function calculaTotal(id, exibe) {
	
	if (($('#task').val() == 0) || ($('#task').val() == 4)){
	
		var valTotal = 0.00;
		$('#valor_total_geral').val(valTotal); 
		
		var valTotalFecomp = 0.00;
		$('#valor_total_fecomp').val(valTotalFecomp); 
		
		var valTotalIPI = 0.00;
		$('#valor_total_IPI').val(valTotalIPI); 
		
		var valTotalICMS = 0.00;
		$('#valor_total_ICMS').val(valTotalICMS);
		
		var valTotalICMSST = 0.00;
		$('#valor_total_ICMS_ST').val(valTotalICMSST);
		
		var valTotalBaseFecomp = 0.00;
		$('#valor_total_bc_fecomp').val(valTotalBaseFecomp);
		
		var valTotalBaseIPI = 0.00;
		$('#valor_total_bc_ipi').val(valTotalBaseIPI);
		
		var valTotalBaseICMSST = 0.00;
		$('#valor_total_bc_icms_st').val(valTotalBaseICMSST);
		
		var valTotalBaseICMS = 0.00;
		$('#valor_total_bc_icms').val(valTotalBaseICMS);
		
		var valTotalcomImpostos = 0.00;
		$('#valor_total_impostos').val(valTotalcomImpostos);
		
		$('input[name]')
		.each(
				function() {
	
					if ($(this).is('input')
							&& $(this).attr('name').indexOf(
									'qtd_devolver___') != -1) {
						var seq = 0;
						seq = $(this).attr('name')
								.split("___")[1];
						console.log('SEQUENCIAL DO EACH...',
								seq);
	
						if ($('#qtd_devolver___' + seq)
								.val() > 0){
						
							
							var qtdDevolver = isNull(Math.round(parseFloat($('#qtd_devolver___' + seq)
									.val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
							var qtdNFVenda = isNull(Math.round(parseFloat($('#quantidade___' + seq)
									.val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0); 
							
							var valBCFecompItem = 0.00;
							valBCFecompItem = parseFloat($('#bc_fecomp___' + seq).val());
							
							var valFecompItem = 0.00;
							valFecompItem = parseFloat($('#val_fecomp___' + seq).val());
							
							var valBCIPIItem = 0.00;
							valBCIPIItem = parseFloat($('#bc_ipi___' + seq).val());
							
							var valIPIItem = 0.00;
							valIPIItem = parseFloat($('#val_ipi___' + seq).val());
							
							var valBCSTItem = 0.00;
							valBCSTItem =  parseFloat($('#bc_st___' + seq).val());
							
							var valSTItem = 0.00;
							valSTItem = parseFloat($('#val_st___' + seq).val());
							
							var valBCSTGNREItem = 0.00;
							valBCSTGNREItem = parseFloat($('#bc_st_gnre___' + seq).val()); 
							
							var valSTGNREItem = 0.00;
							valSTGNREItem = parseFloat($('#val_st_gnre___' + seq).val()); 
							
							var valBCICMSItem = 0.00;
							valBCICMSItem = parseFloat($('#bc_icms___' + seq).val());  
							
							var valICMSItem = 0.00;
							valICMSItem = parseFloat($('#val_icms___' + seq).val());
							
							var valItemTotal = 0.00;
							console.log('Pre_TOTAL ', $('#pre_total___' + seq).val());
							valItemTotal = isNull(Math.round(parseFloat($('#pre_total___' + seq)
									.val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
							console.log('Pre_TOTAL_Apos ',valItemTotal);
							
							var valAliqICMSItem = $('#aliquota_icms___'+seq);
							var valICMSProporcional = 0.00;
							var valFecompProporcional = 0.00;
							var valIPIProporcional = 0.00;
							var valICMSSTProporcional = 0.00;
							var valBaseICMSProporcional = 0.00;
							var valBaseIPIProporcional = 0.00;
							var valBaseICMSSTProporcional = 0.00;
							var TotalProporcional = 0.00;
							
							//ICMS Normal
							valBaseICMSProporcional = ((valBCICMSItem / qtdNFVenda)* qtdDevolver);
							$('#base_icms_proporcional___'+seq).val(valBaseICMSProporcional);
							console.log('valICMSItem ',valICMSItem);
							console.log('qtdNFVenda ',qtdNFVenda);
							console.log('qtdDevolver ',qtdDevolver);		
							valICMSProporcional = ((valICMSItem / qtdNFVenda)* qtdDevolver);
							$('#icms_proporcional___'+seq).val(valICMSProporcional);
							
							valTotalBaseICMS = parseFloat($('#valor_total_bc_icms').val());
							valTotalBaseICMS = (valTotalBaseICMS + valBaseICMSProporcional);
							$('#valor_total_bc_icms').val((String((valTotalBaseICMS).toFixed(2)).replace(',', '')));
							valTotalICMS = parseFloat($('#valor_total_ICMS').val());
							valTotalICMS = (valTotalICMS + valICMSProporcional);
							$('#valor_total_ICMS').val((String((valTotalICMS).toFixed(2)).replace(',', '')));
							
							//ICMS ST e ICMS ST GNRE
							if (valSTGNREItem == 0){
								valBaseICMSSTProporcional = ((valBCSTItem / qtdNFVenda)* qtdDevolver);
								$('#base_icms_st_proporcional___'+seq).val(valBaseICMSSTProporcional);
								console.log('valICMSSTItem ',valSTItem);
								console.log('qtdNFVenda ',qtdNFVenda);
								console.log('qtdDevolver ',qtdDevolver);		
								
								valICMSSTProporcional = ((valSTItem / qtdNFVenda)* qtdDevolver);
								$('#icms_st_proporcional___'+seq).val(valICMSSTProporcional);
								
								valTotalBaseICMSST = parseFloat($('#valor_total_bc_icms_st').val());
								valTotalBaseICMSST = (valTotalBaseICMSST + valBaseICMSSTProporcional);
								$('#valor_total_bc_icms_st').val((String((valTotalBaseICMSST).toFixed(2)).replace(',', '')));
								
								valTotalICMSST = parseFloat($('#valor_total_ICMS_ST').val());
								valTotalICMSST = (valTotalICMSST + valICMSSTProporcional);
								$('#valor_total_ICMS_ST').val((String((valTotalICMSST).toFixed(2)).replace(',', '')));
							} else {
								valBaseICMSSTProporcional = ((valBCSTGNREItem / qtdNFVenda)* qtdDevolver);
								$('#base_icms_st_proporcional___'+seq).val(valBaseICMSSTProporcional);
								console.log('valICMSSTItem ',valSTItem);
								console.log('qtdNFVenda ',qtdNFVenda);
								console.log('qtdDevolver ',qtdDevolver);		
								
								valICMSSTProporcional = ((valSTGNREItem / qtdNFVenda)* qtdDevolver);
								$('#icms_st_proporcional___'+seq).val(valICMSSTProporcional);
								
								valTotalBaseICMSST = parseFloat($('#valor_total_bc_icms_st').val());
								valTotalBaseICMSST = (valTotalBaseICMSST + valBaseICMSSTProporcional);
								$('#valor_total_bc_icms_st').val((String((valTotalBaseICMSST).toFixed(2)).replace(',', '')));
								
								valTotalICMSST = parseFloat($('#valor_total_ICMS_ST').val());
								valTotalICMSST = (valTotalICMSST + valICMSSTProporcional);
								$('#valor_total_ICMS_ST').val((String((valTotalICMSST).toFixed(2)).replace(',', '')));
							}
							
							//FCP
							valBaseFecompProporcional = ((valBCFecompItem / qtdNFVenda)* qtdDevolver);
							$('#base_fecompe_proporcional___'+seq).val(valBaseFecompProporcional);
							console.log('valFecompItem ',valFecompItem);
							console.log('qtdNFVenda ',qtdNFVenda);
							console.log('qtdDevolver ',qtdDevolver);		
							valFecompProporcional = ((valFecompItem / qtdNFVenda)* qtdDevolver);
							$('#fecomp_proporcional___'+seq).val(valFecompProporcional);
							console.log('valFecompProporcional ',valFecompProporcional);
							
							valTotalBaseFecomp = parseFloat($('#valor_total_bc_fecomp').val());
							valTotalBaseFecomp = (valTotalBaseFecomp + valBaseFecompProporcional);
							$('#valor_total_bc_fecomp').val((String((valTotalBaseFecomp).toFixed(2)).replace(',', '')));
							console.log('valTotalBaseFecomp ',valTotalBaseFecomp);
							
							valTotalFecomp = parseFloat($('#valor_total_fecomp').val());
							valTotalFecomp = (valTotalFecomp + valFecompProporcional);
							$('#valor_total_fecomp').val((String((valTotalFecomp).toFixed(2)).replace(',', '')));
							console.log('valTotalFecomp ',valTotalFecomp);
							
							//IPI
							valBaseIPIProporcional = ((valBCIPIItem / qtdNFVenda)* qtdDevolver);
							$('#base_ipi_proporcional___'+seq).val(valBaseIPIProporcional);
							console.log('valIPIItem ',valIPIItem);
							console.log('qtdNFVenda ',qtdNFVenda);
							console.log('qtdDevolver ',qtdDevolver);		
							valIPIProporcional = ((valIPIItem / qtdNFVenda)* qtdDevolver);
							$('#ipi_proporcional___'+seq).val(valIPIProporcional);
							
							valTotalBaseIPI = parseFloat($('#valor_total_bc_ipi').val());
							valTotalBaseIPI = (valTotalBaseIPI + valBaseIPIProporcional);
							$('#valor_total_bc_ipi').val((String((valTotalBaseIPI).toFixed(2)).replace(',', '')));
							
							valTotalIPI = parseFloat($('#valor_total_IPI').val());
							valTotalIPI = (valTotalIPI + valIPIProporcional);
							$('#valor_total_IPI').val((String((valTotalIPI).toFixed(2)).replace(',', '')));
							
							//Total e Total com Impostos
							valTotalProporcional = ((valItemTotal / qtdNFVenda)* qtdDevolver);
							$('#valor_proporcional___'+seq).val(valTotalProporcional);
							console.log('valItem ',valItemTotal);
							console.log('qtdNFVenda ',qtdNFVenda);
							console.log('qtdDevolver ',qtdDevolver);		
							
							valTotal = parseFloat($('#valor_total_geral').val());
							valTotal = (valTotal + valTotalProporcional);
							$('#valor_total_geral').val((String((valTotal).toFixed(2)).replace(',', '')));
							
							valTotalcomImpostos = valTotal + valTotalICMSST + valTotalIPI + valTotalFecomp;
							$('#valor_total_impostos').val((String((valTotalcomImpostos).toFixed(2)).replace(',', '')));
						}
					}
				});
	}
}
