var abaTotal = 5;
var aba = 1;
var qtd = 0;
var qtdSleep = 0;

var valAtu = "";
var tipo_produto;
tipo_produto = 0;

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

	var countMensagens = 0.00;
	var msg = '';
	var task = $('#task').val();
	var tipo_processo =$('#tipo_processo').val();
	console.log('tipo_processo ',tipo_processo);
		
	if (aba != 5 && tipo_processo == 'E') {
		countMensagens += 1;
		msg += ' - Você precisa estar na quinta aba para Enviar este processo! - ';
	}

	if ((aba == 3) && ($('#descricao').val() == '')) {
		if ($('#task').val() == "4" || $('#task').val() == "0") {
			countMensagens += 1;
			msg += ' - Você precisa informar o campo Descrição! - ';
		}
	}


	//recupera papel assistencia tecnica
	//se tiver o papel não é obrigado a responder as perguntas
	var cod_usu_ass_tecnica = 0;
	var constraints_papel = new Array();
	constraints_papel.push( DatasetFactory.createConstraint('workflowColleagueRolePK.colleagueId',
					$('#userFluig').val(), $('#userFluig').val(), ConstraintType.MUST, true));
	constraints_papel.push( DatasetFactory.createConstraint('workflowColleagueRolePK.roleId',
					'assistencia_tecnica', 'assistencia_tecnica', ConstraintType.MUST));				
	
	
			var dataset = DatasetFactory.getDataset("workflowColleagueRole",
					null, constraints_papel, null);
			console.log(dataset);
			console.log('antes dataset');
			if (dataset != null && dataset.values.length > 0 ) {
				cod_usu_ass_tecnica = 1;
				console.log('antes dataset1');
			} else {
				cod_usu_ass_tecnica = 0;
				console.log('antes dataset2');
			}
	//fim recupera papel assistencia tecnica
	if (aba == 5 && cod_usu_ass_tecnica == 0 ) {
		console.log('ENTROU ABA ', aba);
		$("select[name^='questao___']")
				.each(
						function() {
							console.log('ENTROU EACH');
							var seq = $(this).attr('name').split('___')[1];
							console.log('SEQUENCIAL ', seq);
							var result = $(this).val();
							console.log('VALOR ', result);
							if (result == null || result == '') {
								countMensagens += 1;
								msg += ' - Você não pode deixar questões sem resposta! - Questão: '
										+ seq + ' - ';
							}
						});
	}

	var forma_pagamento = $('#forma_pagamento').val();
	var valor_pagamento = $('#valor_bonficacao').val();
	if (task == 24
			&& (forma_pagamento == null || valor_bonficacao == 0
					|| valor_bonficacao == 0 || valor_bonficacao == 0.00 || valor_bonficacao == null)) {
		countMensagens += 1;
		msg += ' - Você precisa informar os campos de Valor e Tipo de Pagamento ! - '
	}

	if (task == 19 && (resolucao == null || resolucao == 0 || resolucao == '')) {
		countMensagens += 1;
		msg += ' - Informe o campo de Descrição da Resolução ! - '
	}

	console.log('COUNT MENSAGENS ', countMensagens);
	if (countMensagens != 0.00) {
		alert(msg);
		return false;
	} else {
		return true;
	}

	/*
	 * console.log('Aba....' + aba); console.log('Valida....' + validaAba(aba));
	 * if (aba != 5) { alert("Você precisa estar na quinta aba para Enviar este
	 * processo!"); return false; } else { if ((aba == 3) &&
	 * ($('#descricao').val() == '')) { if ($('#task').val() == "4" ||
	 * $('#task').val() == "0") { alert("Você precisa informar o campo
	 * Descrição!"); return false; } } else { // valida se todas as perguntas
	 * estão respondidas var countMensagens = 0.00;
	 * 
	 * $("input[name^='questao___']").each(function() { console.log('ENTROU
	 * EACH'); var seq = $(this).attr('name').split('___')[1];
	 * console.log('SEQUENCIAL ', seq); var result = $(this).val();
	 * console.log('VALOR ', result); if (result == null || result == '') {
	 * countMensagens += 1; } });
	 * 
	 * console.log('COUNT MENSAGENS ', countMensagens); if (countMensagens !=
	 * null || countMensagens != 0) { alert("Você não pode deixar questões sem
	 * resposta!"); return false; } else { return true; } } }
	 */

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

function alterado_tipo() {


	var task = $('#task').val();
	if (task == 0 || task == 4){
		console.log('TIPO_PRODUTO_ANTERIOR ', tipo_produto);
		var novo_tipo_produto = $('#tipo_produto').val();
		console.log('TIPO_PRODUTO_NOVO ', novo_tipo_produto);
		if (tipo_produto != novo_tipo_produto) {
			console.log('TIPO FOI ALTERADO');
			$('#tipo_alterado').val("S");
		}
		tipo_produto = $('#tipo_produto').val();
	} else {
		$('#tipo_alterado').val('N');
	}

}

function validaAba(aba) {

	if ($("#modo").val() == "VIEW") {
		return true;
	}

	var msg = '';
	var msg_valida = '';
	var task = $('#task').val();
	// var tipo_produto = $('#tipo_produto').val();
	setFocus = true;
	console.log('ABA', aba);
	var tipo_alterado;
	tipo_alterado = "N";
	tipo_alterado = $('#tipo_alterado').val();
	console.log('ENTROU NA ALTERACAO DE TIPO ', tipo_alterado);

	// desabilita e habilita o campo para solicitar anexo de nota fiscal de
	// devolução internamente
	if (aba == 2 && $('#tipoCadUser').val() == 'A') {
		$('#div_check_anexa_nfd').css("visibility", "visible");
	} else {
		$('#div_check_anexa_nfd').css("visibility", "hidden");
	}

	if (aba == 4) {
		$('#novo_tipo_produto').val(tipo_produto);
	}

	if (aba == 4 && tipo_alterado == "S") {
		console.log('TIPO_PRODUTO_FORMULARIO ', tipo_produto);
		loadPerguntas();
	}

	/*
	 * if (aba == 4) { tipo_produto = $('#tipo_produto').val(); }
	 */

	// oculta os campos de acordo com o tipo de produto selecionado
	if (aba == 3) {
		console.log('TIPO_PRODUTO_FORMULARIO ', tipo_produto);
		if (tipo_produto == 1) {
			$('#div_argamassa').show();
			$('#div_rejunte').hide();
			$('#div_revestimento').hide();
			msg_valida = "";
		}
		if (tipo_produto == 2) {
			$('#div_argamassa').hide();
			$('#div_rejunte').show();
			$('#div_revestimento').hide();
			msg_valida = "";
		}
		if (tipo_produto == 3) {
			$('#div_argamassa').hide();
			$('#div_rejunte').hide();
			$('#div_revestimento').show();
			msg_valida = "";
		}
		if (tipo_produto == 0 && (task == 0 || task == 4)) {
			msg_valida += 'Selecione um Tipo de Produto';
		}
	}

	var observacoes = $('#observacoes').val();
	if (aba == 3 && (observacoes == "" || observacoes == null)) {
		msg_valida += 'Informe o campo Observações! ';
	}
	var cor = $('#cor_produto').val();
	if (aba == 3 && (cor == "" || cor == null)) {
		msg_valida += 'Informe o campo Cor! ';
	}
	
	var den_item_edit = $('#den_item_edit').val();
	if (aba == 3 && (den_item_edit == "" || den_item_edit == null)) {
		msg_valida += 'Informe o campo Produto! ';
	}

	$('input, select', $('#aba_' + aba))
			.each(
					function() {

						if (($(this).attr('pf') != "S" || ($(this).attr('pf') == "S" && $(
								this).attr('name').indexOf('___') != -1))
						/* && !$(this).attr('readonly') */) {

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
	tipo_produto = $('#tipo_produto').val();

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

	$("input").keypress(
			function(e) {
				var chr = String.fromCharCode(e.which);
				var name_campo;
				name_campo = $(this).attr("name");

				if (name_campo == "email") {
					if ("'\"!#$%ÃÂ¨&*()+=\ÃÂ´`[]{}/?;:>,<\|~ÃÃ§"
							.indexOf(chr) > 0) {
						return false;
					}
				} else {
					if ("'\"!@#$%ÃÂ¨&*()_+=-\ÃÂ´`[]{}/?;:.>,<\|~ÃÃ§"
							.indexOf(chr) > 0) {
						return false;
					}
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
