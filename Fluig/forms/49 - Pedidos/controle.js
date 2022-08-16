var abaTotal = 5;
var aba = 1;
var qtd = 0;
var qtdSleep = 0;

var valAtu = "";

var loadingPrincipial = FLUIGC.loading("divPrincipal");
loadingPrincipial.title = "Carregando......";

loading = FLUIGC.loading(window, {
	textMessage : '<h3>Filtrando Informa&ccedil;&otilde;es...</h3>',
	title : null,
	css : {
		padding : 0,
		margin : 0,
		width : '30%',
		top : '40%',
		left : '35%',
		textAlign : 'center',
		color : '#000',
		border : '3px solid #aaa',
		backgroundColor : '#fff',
		cursor : 'wait'
	},
	overlayCSS : {
		backgroundColor : '#000',
		opacity : 0.6,
		cursor : 'wait'
	},
	cursorReset : 'default',
	baseZ : 1000,
	centerX : true,
	centerY : true,
	bindEvents : true,
	fadeIn : 200,
	fadeOut : 400,
	timeout : 0,
	showOverlay : true,
	onBlock : null,
	onUnblock : null,
	ignoreIfBlocked : false
});

$(document)
		.bind(
				"DOMNodeRemoved",
				function(e) {

					if (e.target.nodeName == 'LI') {
						var target = $(e.target.parentNode.parentNode.parentNode.parentNode.parentNode);
						if (target.html().indexOf(
								'class="select2-selection__choice"') > 0) {
							if ($('#den_item_edit').val() == null
									&& target.html().indexOf(
											'id="den_item_edit"') > 0) {
								clearItem('den_item');
							}
						}
					}

					var target = $(e.target);
					// console.log('antes zIndex '+target.html() );
					if (target.html().indexOf(
							"class=\"fluig-style-guide modal\"") >= 0) {
						// console.log('entrii para alterar zIndex');
						parent.$('#workflowView-cardViewer').css('zIndex', 0);
					}

					// if ( e.target.nodeName == 'SPAN' ){
					// var target = $(e.target.parentNode.parentNode);
					// if( $('#den_item_edit').val() != ''
					// && $('#den_item_edit').val() != undefined
					// && $('#den_item_edit').val() != null
					// && target.html().indexOf('id="den_item_edit"' ) > 0 ){
					// clearItem( 'den_item' );
					// }
					// }

				});

function clearItem(origem) {

	if (origem == 'cod_item') {
		zoomDestino = window[$("#den_item_edit").attr('filter-instance')];
		zoomDestino.clear();
	}

	if (origem != 'cod_item_edit') {
		$('#cod_item_zoom_edit').val('');
		$('#cod_item_edit').val('');
	}

	$('#peso_edit').val('');
	$('#cubagem_edit').val('');
	$('#qtd_pad_edit').val('');

	$('#cod_lin_prod_edit').val('');
	$('#cod_lin_recei_edit').val('');
	$('#cod_seg_merc_edit').val('');
	$('#cod_cla_uso_edit').val('');
	$('#cod_grupo_item_edit').val('');
	$('#cod_tip_carteira_edit').val('');
	$('#um_edit').val('');

	$('#valor_unit_edit').val('');
	$('#valor_unit_liq_edit').val('');
	$('#valor_unit_lista_edit').val('');
	$('#valor_total_edit').val('');

	$('#desconto_edit').val('');
	$('#quantidade_edit').val('');
	$('#qtd_pad_edit').val('');
	$('#data_entrega_edit').val('');

	$('#pedido_cli_edit').val('');
	$('#seq_pedido_cli_edit').val('');

	$('#linha_edit').val('0');

	$('#obs_item_1_edit').val("");
	$('#obs_item_2_edit').val("");
	$('#obs_item_3_edit').val("");
	$('#obs_item_4_edit').val("");
	$('#obs_item_5_edit').val("");

	$('#ies_mix').val("");
	$('#pct_desc_adic_edit').val("");

	$('#inf_obs').prop("checked", false);
	setObsItem();

	if ($('#ies_inf_pedido').val() == "S") {
		$('#info_Pedido').show();
	} else {
		$('#info_Pedido').hide();
	}

	$('#sequencia_edit').val("");

}

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
	setIsento('isento_ie_ent', 'ie_ent', 'estado_ent');
	$('#ie_ent').val('');

}

function getLinhaCampoPF(campo) {
	return campo.substring(campo.indexOf('___') + 3, campo.length);
}

function fnCustomDelete(oElement) {

	seq = getIdParentChild(oElement).split('___')[1];
	console.log('fnCustomDelete', $('#processo').val(),
			$('#sequencia___' + seq).val());
	if ($('#processo').val() == 'alt_pedido'
			&& $('#sequencia___' + seq).val() != "") {
		FLUIGC
				.toast({
					title : 'Valida&ccedil;&atilde;o: ',
					message : 'N&atilde;o &eacute; permitido excluir item original do pedido.',
					type : 'warning',
					timeout : 'fast'
				});
		return false;
	}
	fnWdkRemoveChild(oElement);
	atulizaRecalcTotal('exclir_linha');
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
		if (aba == 1)
			$("#btn_cancel").show();
		aba++;
		$("#aba_" + aba).show();
		if (aba == abaTotal)
			$("#btn_confirma").hide();

		$('#current_step').html(aba);
		$('#total_steps').html(abaTotal);

		clearItem('movto');
		setCeiOBS();
		
		trataGer();
		
		loadPerguntas();
		
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

	clearItem('movto');
	
	trataGer();
}



function trataGer(){
		
	if( $('#moeda').val() != '1' ){
		$('.lbl_moeda').show();
	}else{
		$('.lbl_moeda').hide();
	}
	
	//recupera se deve exibir o calculo de frete para o fob
		var constraintsPai = new Array(DatasetFactory.createConstraint(
				"ies_matriz", 'on', 'on', ConstraintType.MUST));
		var datasetPai = DatasetFactory.getDataset('empresa_compl', null,
				constraintsPai, null);
		var lstTipoCli = new Array();
		var cod_empresa = $('#empresa').val();
		var cod_lista_preco = $('#lista_preco').val();

		if (datasetPai != null) {
			console.log('Pai Filho ', datasetPai.values.length);
			for (var x = 0; x < datasetPai.values.length; x++) {
				var pai = datasetPai.values[x];
				console.log('INFO ');

				var constraintsFilhos = new Array();
				constraintsFilhos.push(DatasetFactory
						.createConstraint("tablename", 'lista_de_preco_fob',
								'lista_de_preco_fob', ConstraintType.MUST));
				constraintsFilhos.push(DatasetFactory.createConstraint(
						"metadata#id", pai.documentid, pai.documentid,
						ConstraintType.MUST));
				constraintsFilhos.push(DatasetFactory.createConstraint(
						"metadata#version", pai.version, pai.version,
						ConstraintType.MUST));
				constraintsFilhos.push(DatasetFactory.createConstraint(
						"cod_emp_lista_frete_fob", cod_empresa, cod_empresa,
						ConstraintType.MUST));
				constraintsFilhos.push(DatasetFactory.createConstraint(
						"cod_lista_frete_fob", cod_lista_preco, cod_lista_preco,
						ConstraintType.MUST));

				var datasetFilhos = DatasetFactory.getDataset('empresa_compl',
						null, constraintsFilhos, null);
				console.log('filhos dataset ',datasetFilhos);
				if (datasetFilhos != null && datasetFilhos.values.length > 0) {
					$('.frete_calculo').show();
					
				}else {
					$('.frete_calculo').hide();
				}
			}
		}
		console.log('ARRAY tipo cli', lstTipoCli);
		
		//fim recupera se deve exibir o calculo de frete para o fob
	
	if( $('#ies_end_entrega').val() == "S" ){
		$('#btCopyEndereco').show();
	}else{
		$('#btCopyEndereco').hide();
	}
}

function validaItemDuplic(){
	var optArray = new Array();
	var ret = true;
	$( "input[name*=cod_item___]" ).each(function( index ) {
		console.log('optArray',optArray);
		console.log('$(this).val()',$(this).val());
		console.log('$.inArray(  $(this).val(), optArray )', $.inArray(  $(this).val(), optArray ) );
		if ( $.inArray(  $(this).val(), optArray ) > -1 ){
			ret = false;
		}
		optArray.push( $(this).val() );
	});
	return ret;
}

var beforeSendValidate = function(numState, nextState) {

	console.log('Aba....' + aba);
	//console.log('Valida....' + validaAba(aba));
	if( ! validaItemDuplic() ){
		alert("Existe produto duplicado.");
		return false;
	}

	var msgO = "";
	$( "input[id^=cod_pergunta___]" ).each(function( index ) {
		var seq = $(this).attr('id').split('___')[1];
		if( ( $('#tipo_pergunta___'+seq).val() == 'O' && $('#opcao___'+seq).val() == "" )
		 || ( $('#tipo_pergunta___'+seq).val() == 'M' && $('#metrica___'+seq).val() == "" )
		 || ( $('#tipo_pergunta___'+seq).val() == 'I' && $('#informado___'+seq).val() == "" ) ){
			msgO +=', '+$('#den_pergunta___'+seq).val();
		}
	});
	if( msgO != "" && $('#tipo_frete').val() != "RET"){
		alert('Você deve preencher o CheckList ' + msgO );
		return false;
	}
	
	if( $('#ies_end_entrega').val() == "S" && $('#tipo_frete').val() != "RET"){
		
		if( $('#tipo_logradouro_ent').val() == ""
		 || $('#cep_ent').val() == ""
		 || $('#cd_cidade_ent').val() == ""
		 || $('#numero_ent').val() == ""
		 || $('#endereco_ent').val() == "" ){
			alert('Para esse tipo de cliente deve ser preencher o endereço de entrega.' );
			return false;
		}
	}
	
	if( validaAba(aba) ){
		if ((aba == 3 || aba == 4 || aba == 5) ) {
			
			if ($('#task').val() == "0" || $('#task').val() == "1"
					|| $('#task').val() == "33") {
				if ($('#processo').val() != 'alt_pedido') {
					alert("O Numero do pedido sera enviado posteriormente para seu e-mail cadastrado.");
				} else {
					alert("Uma copia do pedido sera enviado posteriormente para seu e-mail cadastrado.");
				}
			}
			return true;
		} else {
			alert("Você deve avançar até a aba dos itens.");
			return false;
		}
	}else{
		return false;
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

	$("textarea").on(
			'keyup input keypress keydown change',
			function(e) {
				var tamanhoMin = $(this).attr('rows')
						* $(this).css('line-height').replace(/[^0-9\.]+/g, '');
				$(this).css({
					'height' : 'auto'
				});
				var novoTamanho = this.scrollHeight
						+ parseFloat($(this).css("borderTopWidth"))
						+ parseFloat($(this).css("borderBottomWidth"));
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
}

function setCorFilhos(id, color) {
	// console.log('entrei color',id);
	$('div, span', $('#' + id + '_grp')).each(function() {
		// console.log('entrei grupo color',
		// $(this).attr('class') );
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

	setFocus = true;

	if (aba == 3) {
		if (qtdItens() == 0) {
			msg += 'N&atilde;o existe itens no pedido! ';
		}
		if ($('#cod_item_edit').val() != ""
				|| $('#quantidade_edit').val() != ""
				|| $('#desconto_edit').val() != "") {
			msg += 'Existe item em edi&ccedil;&atilde;o! ';
		}
	}

	$('input, select', $('#aba_' + aba))
			.each(
					function() {

						if (($(this).attr('pf') != "S" || ($(this).attr('pf') == "S" && $(
								this).attr('name').indexOf('___') != -1))
						// && !$(this).attr( 'readonly' )
						) {

							// $( '#'+$(this).attr('id')
							// ).css({'background-color' : '#FFFFFF'});
							// setCorFilhos( $(this).attr('id'), '#FFFFFF' );

							console.log('ATR Valida......', $(this).attr(
									'valida'));
							if ($(this).attr('valida') != undefined
									&& $(this).attr('valida') != ""
									&& ($(this).val() == ""
											|| $(this).val() == null || $(this)
											.val() == undefined)) {

								$('#' + $(this).attr('id')).css({
									'background-color' : '#FFFFFF'
								});
								setCorFilhos($(this).attr('id'), '#FFFFFF');
								// ############
								// ############
								if (!((aba == 1 && $(this).attr('id') == 'cei')
										|| (aba == 5
												&& !$('#ies_bairro_ent_manual')
														.is(":checked") && $(
												this).attr('id') == 'bairro_ent')
										|| (aba == 5
												&& $('#ies_bairro_ent_manual')
														.is(":checked") && $(
												this).attr('id') == 'bairro_ent_sel') || (aba == 5
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

							if (aba == 1
									&& $(this).attr('id') == 'cei'
									&& $.inArray($('#cod_tip_cli').val(),
											getListaTipoCliente()) > -1
									&& $(this).val() == '') {
								console.log('ENTREEEIII NO CEI.........');
								$($(this)).css({
									'background-color' : '#FFE4C4'
								});
								setCorFilhos($(this).attr('id'), '#FFE4C4');
								msg_valida += ' Tipo de cliente obriga informar CEI!';
							}

							if (aba == 1 && $(this).attr('id') == 'ped_cliente'
									&& $('#ies_inf_pedido').val() == 'S'
									&& $(this).val() == '') {
								console.log('ENTREEEIII NO CEI.........');
								$($(this)).css({
									'background-color' : '#FFE4C4'
								});
								setCorFilhos($(this).attr('id'), '#FFE4C4');
								msg_valida += ' Este cliente obriga informar o n&uacute;mero de pedido!';
							}

							if (aba == 2
									&& $(this).attr('id') == 'tipo_desconto'
									&& $('#pct_desc_adicional').val() != ""
									&& $('#pct_desc_adicional').val() != "0,00"
									&& $(this).val() == '') {
								console.log('ENTREEEIII NO CEI.........');
								$($(this)).css({
									'background-color' : '#FFE4C4'
								});
								setCorFilhos($(this).attr('id'), '#FFE4C4');
								msg_valida += ' Deve ser informado tipo de desconto!';
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
			/*FLUIGC.toast({
				title : 'Preenchimento: ',
				message : 'Voc&ecirc; deve informar os campos: ' + msg,
				type : 'warning',
				timeout : 'slow'
			});*/
			alert('Você deve informar os campos: ' + msg);
		}
		if (msg_valida != "") {
			/*FLUIGC.toast({
				title : 'Valida&ccedil;&atilde;o: ',
				message : msg_valida,
				type : 'warning',
				timeout : 'slow'
			});*/
			alert(msg_valida);
		}
		return false;
	}

	/*
	 * if ( aba == 1 && $('#tipo_cadastro').val() == 'N' && validaExistCNPJ(
	 * $('#cnpj').val() ) ){
	 * 
	 * var msgTipo = '';
	 * 
	 * if( $('#cnpj').val().indexOf('/0000-') == -1 ){ msgTipo = 'CNPJ j&atilde;
	 * cadastrado!!'; }else{ msgTipo = 'CPF j&atilde; cadastrado!!'; }
	 * 
	 * FLUIGC.toast({ title: 'Valida&ccedil;&atilde;o: ', message: msgTipo,
	 * type: 'danger', timeout: 'slow' }); return false; }
	 */

	return true;
}

/*
 * var confirmOnPageExit = function (e) { // If we haven't been passed the event
 * get the window.event e = e || window.event; var message = 'VocÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âª deseja
 * continuar?'; // For IE6-8 and Firefox prior to version 4 if (e) {
 * e.returnValue = message; } // For Chrome, Safari, IE8+ and Opera 12+ return
 * message; };
 * 
 * window.onbeforeunload = confirmOnPageExit;
 */

function loadBody() {

	// alert( 'VarGlobal 1 ' );
	// alert( localStorage.getItem("teste1") );
	// console.log( 'VarGlobal 2', localStorage.getItem("teste2") );

	// window.onbeforeunload = false;

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
	loadBairro($('#cod_cidade_ent').val(), 'bairro_ent_sel');

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
	setIsento('isento_ie_ent', 'ie', 'estado');
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
	
	/*if ($('#tipoCadUserAtu').val() != "R"){*/
		$('#mail_adic').show();
	/*}*/
	
	//para inclusao
	if ($('#processo').val() == "inc_pedido") {
		if (!($('#task').val() == "0" || $('#task').val() == "1" || $('#task')
				.val() == "33")) {
			$('.edit_item').hide();
			if ($('#tipoCadUserAtu').val() != "R" && $('#task').val() != '76') {
				$(".linha_gerencial").show();
				$(".col_lob").show();
				if ($('#task').val() == '26')
					$("#obs_reg").show();
				if ($('#task').val() == '30')
					$("#obs_nac").show();
				if ($('#task').val() == '53')
					$("#obs_ctr").show();
				
			}
			
			if ($('#task').val() == '76') {
				$('#pct_desc_financ').attr('readonly', false);
				$('#pct_desc_financ').maskMoney({
					precision : 2,
					thousands : '.',
					decimal : ',',
					defaultZero : true,
					allowZero : true
				});
				$(".linha_gerencial_rob").show();
			}
		}
		
		if( $('#ies_end_entrega').val() == "S" ){
			$('#btCopyEndereco').show();
		}else{
			$('#btCopyEndereco').hide();
		}
		
	}

	if ($('#processo').val() == "alt_pedido") {
		if (!($('#task').val() == "0" || $('#task').val() == "1" || $('#task')
				.val() == "33")) {
			$('.edit_item').hide();
			if ($('#tipoCadUserAtu').val() != "R") {
				$(".linha_gerencial").show();
				
				$(".col_lob").show();
				if ($('#task').val() == '26')
					$("#obs_reg").show();
				if ($('#task').val() == '30')
					$("#obs_nac").show();
				if ($('#task').val() == '53')
					$("#obs_ctr").show();
			}
		}
	}

	if ($('#ped_representante').val != "0") {

		loadRepresCompl($('#cod_repres').val(), $('#cod_cliente').val(), $(
				'#cod_moeda_cli').val(), 'TT');

		setColorAprov();
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
	
	if ($('#processo').val() == 'alt_pedido'){
		$('#btCliente').hide();
	}
	
	// loading.show();
	setTimeout("setFilterCliente( 0 );", 10);

	trataCamposPF();
	setColorRow();
}

function setColorRow(){
	$( "input[id^=cod_item___]" ).each(function( index ) {
		var seq = $(this).attr('id').split('___')[1];
		
		var lobPrev = parseFloat( $('#perc_prev_lob_aen___'+seq).val() );
		var lobReal = parseFloat( $('#perc_lob_item___'+seq).val().replace('.', '').replace(',', '.') );
		
		if( lobReal < lobPrev ){
			$(this).parent().parent().css( {'background-color' : 'red'} );	
		}	
	});
}

function trataCamposPF(){
	console.log('trataCamposPF.........');
	$( "input[id^=cod_pergunta___]" ).each(function( index ) {
		var seq = $(this).attr('id').split('___')[1];

		if( $('#tipo_pergunta___'+seq).val() == 'O' ){
			$('#opcao___'+seq).show();
			$('#informado___'+seq).hide();
			$('#metrica___'+seq).hide();
			
			var opcao = $('#opcao___'+seq).val();
			var dsOpcoes = getDsPaiFilho( "perguntas", "opcoes_pergunta", "", "cod_pergunta", $('#cod_pergunta___'+seq).val() );
			console.log('teste....',dsOpcoes);
			var lstOpcoes = dsOpcoes.values;
			var aTemObs = [];
			$('#opcao___'+seq).empty();
			$('#opcao___'+seq).append("<option value='' ></option>");
			for ( var i in lstOpcoes ) {
				var opcoes = lstOpcoes[i];
				console.log('opcoes',opcoes);
				$('#opcao___'+seq).append("<option value='"+ opcoes.cod_opcao +"' >"+ opcoes.den_opcao +"</option>");
			}
			$('#opcao___'+seq).val( opcao );
			
		}else if( $('#tipo_pergunta___'+seq).val() == 'M' ){
			$('#opcao___'+seq).hide();	
			$('#informado___'+seq).hide();
			$('#metrica___'+seq).show();
			num_precisao = parseInt( $('#num_precisao___'+seq).val().split(',')[0] );
			$('#metrica___'+seq).maskMoney( {precision : num_precisao, thousands : '.',decimal : ',', defaultZero : false, allowZero : true });
		}else{
			$('#opcao___'+seq).hide();	
			$('#informado___'+seq).show();
			$('#metrica___'+seq).hide();
		}
	});
}


function setColorAprov() {

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

	if (($('#task').val() == '26' && $('#ies_pct_lob_reg').val() == 'S')
			|| ($('#task').val() == '30' && $('#ies_pct_lob_nac').val() == 'S')
			|| ($('#task').val() == '53' && $('#ies_pct_lob_ctr').val() == 'S')) {

		$('#perc_lob').css({
			'background-color' : '#FF7F50'
		});
	}

	if (($('#task').val() == '26' && $('#ies_desc_item_reg').val() == 'S')
			|| ($('#task').val() == '30' && $('#ies_desc_item_reg').val() == 'S')) {

		$("input[name^='cod_item___']")
				.each(
						function() {
							console.log('Item...', $(this).attr('name'));
							var seqItem = $(this).attr('name').split('___')[1];

							if (($('#task').val() == '26' && $(
									'#ies_apv_desc_item_reg___' + seqItem)
									.val() == 'S')
									|| ($('#task').val() == '30' && $(
											'#ies_apv_desc_item_nac___'
													+ seqItem).val() == 'S')) {
								if ($('#tipoCadUserAtu').val() != "R") {
									$('#desconto___' + seqItem).css({
										'background-color' : '#FF7F50'
									});
								} else {
									$('#desconto___' + seqItem).css({
										'background-color' : '#E6E6E6'
									});
								}
							}
						});
	}

}

function setFilterCliente(qtd) {
	console.log('TIPO_CADASTRO_DE_USUARIO1', $('#tipoCadUser').val());
	console.log('setFilterCliente..... 1', qtd, $('#razao_social').val());
	if (qtd >= 1000
			|| (qtd == 0 && $('#razao_social').val() != ""
					&& $('#razao_social').val() != null && $('#razao_social')
					.val() != undefined)) {
		console.log('PRIMEIRO IF.....', $('#razao_social').val());
		// loading.hide();
		return false;
	}
	try {
		// loading.show();
		if ($('#tipoCadUser').val() == 'A') {
			console.log('TIPO_CADASTRO_DE_USUARIO2', $('#tipoCadUser').val());
			reloadZoomFilterValues('razao_social', "");
		} else {
			console.log('Tipo .......', $('#processo').val());
			if ($('#razao_social').val() == ""
					|| $('#razao_social').val() == null) {
				console.log("filter ......IES_PEDIDO,S,COD_USER,"
						+ $("#userFluig").val());
				reloadZoomFilterValues('razao_social', "IES_PEDIDO,S,COD_USER,"
						+ $("#userFluig").val());
			}
			if ($('#processo').val() == 'alt_pedido') {
				console.log('DISABLE CAMPO.......');
				zoomDestino = window[$("#razao_social").attr('filter-instance')];
				zoomDestino.disable(true);
				console.log('disable cliente.......');
			}
		}
		console.log('ANTES UPPER');
		setUpper();
		if ($('#editar').val() == 'S') {
			console.log('IF EDITAR.......');
			loadPedidoEdit($('#empresa').val(), $('#num_pedido').val());
		}
		// loading.hide();
	} catch (e) {
		console.log('erro.....', qtd, e);
		qtd += 1;
		setTimeout("setFilterCliente( " + qtd + " );", 10);
	}
}

function setUpper() {

	$("input")
			.keypress(
					function(e) {
						var chr = String.fromCharCode(e.which);
						var name_campo;
						name_campo = $(this).attr("name");

						if (name_campo == "data_coleta") {
							if ("'\"!#$%ÃƒÆ’Ã†â€™Ãƒâ€šÃ¢â‚¬Å¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨&*()+=\ÃƒÆ’Ã†â€™Ãƒâ€šÃ¢â‚¬Å¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â´`[]{}?;:>,<\|~ÃƒÆ’Ã†â€™Ãƒâ€šÃ¢â‚¬Â¡ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â¤Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Âª"
									.indexOf(chr) > 0) {
								return false;
							}
						} 
						if (name_campo == "emailPed"){
							if ("'\"!#$%ÃƒÆ’Ã†â€™Ãƒâ€šÃ¢â‚¬Å¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨&*()+=\ÃƒÆ’Ã†â€™Ãƒâ€šÃ¢â‚¬Å¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â´`[]{}/?;:>,<\|~ÃƒÆ’Ã†â€™Ãƒâ€šÃ¢â‚¬Â¡ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â¤Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Âª"
									.indexOf(chr) > 0) {
								return false;
							}	
						} else {
							if ("'\"!@#$%ÃƒÆ’Ã†â€™Ãƒâ€šÃ¢â‚¬Å¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨&*()_+=-\ÃƒÆ’Ã†â€™Ãƒâ€šÃ¢â‚¬Å¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â´`[]{}/?;:>,<\|~ÃƒÆ’Ã†â€™Ãƒâ€šÃ¢â‚¬Â¡ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â¤Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Âª"
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
		$('#' + idCampoNum).val('SN');
	} else {
		$('#' + idCampoNum).attr('readonly', false);
		$('#' + idCampoNum).attr('type', 'number');
		$('#' + idCampoNum).css('background-color', '#FFFFFF');
		$('#' + idCampoNum).val();
	}
}

function setIsento(idCampo, idCampoIE, idCampoUF) {
	console.log('IE_________');
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
			console.log('IE_________');
			$('#' + idCampoIE).val('');
			setMaskIE($('#' + idCampoUF).val(), idCampoIE);
		} else {
			var tmp = $('#' + idCampoIE).val();
			setMaskIE($('#' + idCampoUF).val(), idCampoIE);
			console.log('IE_________' + tmp);
			$('#' + idCampoIE).val(tmp);
		}

	}
}

var mascaraIE = {
	'RS' : '999-9999999',
	'SC' : '999.999.999',
	'PR' : '99999999-99',
	'SP' : '999.999.999.999',
	'MG' : '999.999.999/9999',
	'RJ' : '99.999.99-9',
	'ES' : '999.999.99-9',
	'BA' : '999.999.99-9',
	'SE' : '999999999-9',
	'AL' : '999999999',
	'PE' : '99.9.999.9999999-9',
	'PB' : '99999999-9',
	'RN' : '99.999.999-9',
	'PI' : '999999999',
	'MA' : '999999999',
	'CE' : '99999999-9',
	'GO' : '99.999.999-9',
	'TO' : '99999999999',
	'MT' : '999999999',
	'MS' : '999999999',
	'DF' : '99999999999-99',
	'AM' : '99.999.999-9',
	'AC' : '99.999.999/999-99',
	'PA' : '99-999999-9',
	'RO' : '999.99999-9',
	'RR' : '99999999-9',
	'AP' : '999999999'
};

function setMaskIE(uf, id) {
	$('#' + id).unmask();
	$('#' + id).val('');
	if (mascaraIE.hasOwnProperty(uf))
		$('#' + id).mask(mascaraIE[uf]);
}

function isNull(valor, padrao) {
	if (isNaN(valor)) {
		return padrao;
	} else {
		return valor;
	}
}

function removeLote() {
	if ($('#cod_item_edit').val() == "") {
		return false;
	}
	var quant = isNull(Math.round(parseFloat($('#quantidade_edit').val().replace('.', '').replace(',', '.')) * 100) / 100, 0);
	var quant_mult = isNull( Math.round( parseFloat( $('#qtd_pad_edit').val().replace(',','.') ) * 100 ) / 100, 1 );
	if (quant <= 0) {
		return false;
	}
	$('#quantidade_edit').val( String( (quant - quant_mult ).toFixed(2) ).replace('.',',') );
	calcDescTotal('quantidade_mais');
	if (quant - quant_mult <= 0) {
		$('#quantidade_edit').val("");
	}
}

function addLote() {
	if ($('#cod_item_edit').val() == "") {
		return false;
	}
	var quant = isNull(Math.round(parseFloat($('#quantidade_edit').val()
			.replace('.', '').replace(',', '.')) * 100) / 100, 0);
	var quant_mult = isNull( Math.round( parseFloat( $('#qtd_pad_edit').val().replace(',','.') ) * 100 ) / 100, 1 );
	$('#quantidade_edit').val(
			String((quant + quant_mult).toFixed(2)).replace('.', ','));
	calcDescTotal('quantidade_menus');
}

function calcDescTotal(id) {

	console.log('Calculo....AAAA....', id, ' valor ', $('#desconto_edit').val());

	if ($('#cod_item_edit').val() == "") {
		$('#quantidade_edit').val("");
		$('#desconto_edit').val("");
		$('#valor_unit_edit').val("");
	} else {
		if ($('#desconto_edit').val() == "") {
			$('#desconto_edit').val("0,00");
		}
	}

	if (id.indexOf('___') < 0) {
		seq = '_edit';
	} else {
		seq = '___' + id.split('___')[1];
	}

	console.log('Calculo....BBBB.....', '#valor_unit_lista' + seq, $(
			'#valor_unit_lista' + seq).val());

	var val_lista = isNull(Math.round(parseFloat($('#valor_unit_lista' + seq).val().replace(/\./g, '').replace(/\,/g, '.')) * 10000) / 10000, 0);
	var val_item = isNull(Math.round(parseFloat($('#valor_unit' + seq).val().replace(/\./g, '').replace(/\,/g, '.')) * 10000) / 10000, 0);
	var perc_desc_tab = isNull(Math.round(parseFloat($('#pct_desc_adic' + seq).val().replace(/\./g, '').replace(/\,/g, '.')) * 10000) / 10000, 0);
	var perc_desc = isNull(Math.round(parseFloat($('#desconto' + seq).val().replace(/\./g, '').replace(/\,/g, '.')) * 10000) / 10000, 0);
	var perc_desc_ped = isNull(Math.round(parseFloat($('#pct_desc_adicional').val().replace(/\./g, '').replace(/\,/g, '.')) * 10000) / 10000, 0);
	var quant = isNull(Math.round(parseFloat($('#quantidade' + seq).val().replace(/\./g, '').replace(/\,/g, '.')) * 10000) / 10000, 0);
	var quant_mult = isNull(Math.round(parseFloat($('#qtd_pad' + seq).val().replace(/\./g, '.').replace(/\,/g, '.')) * 10000) / 10000, 1);
	var val_liq = 0;

	/*
	 * if ( id == 'desconto_edit' ){ $('#valor_unit_edit').val( String( (
	 * val_lista - ( val_lista perc_desc / 100 ) ).toFixed(3) ).replace('.',',') ); }
	 * else
	 */
	if (id == 'valor_unit_edit') {
		if (val_lista > val_item) {
			FLUIGC.toast({
						title : 'Pre&ccedil;o: ',
						message : 'Pre&ccedil;o Unit&aacute;rio nao pode ser inferior a R$: '
								+ String(val_lista.toFixed(3))
										.replace('.', ','),
						type : 'warning',
						timeout : 'fast'
					});
			setTimeout("$('#valor_unit" + seq + "').focus();", 1);
			return false;
		}
	}

	console.log('Teste ', quant % quant_mult);

	if (id == "quantidade_edit" || id == "grava_edit") {
		var teste_divisao = quant / quant_mult;
		//if (!Number.isInteger(teste_divisao.toFixed(2))){
			if (!Number.isInteger(parseFloat(teste_divisao.toFixed(2)))){

			// $('#quantidade_edit').focus();
			setTimeout("$('#quantidade_edit').focus();", 1);

			FLUIGC.toast({
				title : 'Quantidade: ',
				message : 'A quantidade deve ser multiplo de: '
						 +String( quant_mult.toFixed(2) ),
				type : 'warning',
				timeout : 'fast'
			});
			return false;
		}
	}

	var val_calc = val_item - (val_item * perc_desc_ped / 100);
	val_calc = val_calc - (val_calc * perc_desc / 100);
	val_liq = val_calc;
	

	
	$('#valor_unit_liq_edit').val(String((val_liq).toFixed(3)).replace('.', ','));
	console.log('VAL LIQ ',val_liq);
	console.log('VAL LIQ ',$('#valor_unit_liq_edit').val());
	
	var val_bruto = val_item;
	var val_minimo = val_item - (val_item * perc_desc_tab / 100);

	$('#valor_total' + seq).val(String((val_calc * quant).toFixed(3)).replace('.', ','));

	if (id == "grava_edit" && $("#sequencia_edit").val() == "") {

		if ((val_calc * quant) < 0.001) {

			if (quant == 0) {
				setTimeout("$('#quantidade_edit').focus();", 1);
			} else {
				setTimeout("$('#desconto_edit').focus();", 1);
			}

			FLUIGC.toast({
				title : 'Valor Total: ',
				message : 'Valor total do item n&atilde;o pode ser zerado.',
				type : 'warning',
				timeout : 'fast'
			});
			return false;
		}
	}

	return {
		'total_liquido' : val_calc * quant,
		'total_bruto' : val_bruto * quant,
		'total_minimo' : val_minimo * quant,
		'val_liq' : val_liq
	};

}

function gravaItem(table, alteraMotivo) {

	if ($('#cod_item_edit').val() == "" || !calcDescTotal('grava_edit')) {
		return false;
	}

	var total = isNull(Math.round(parseFloat($('#valor_total_edit').val()
			.replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	if ($('#sequencia_edit').val() == "" && total == 0) {
		FLUIGC.toast({
			title : 'Valida&ccedil;&atilde;o: ',
			message : 'Item com valor zerado.',
			type : 'warning',
			timeout : 'fast'
		});
		setTimeout("$('#cod_item_edit').focus();", 1);
		return false;
	}
	var val_lista = isNull(Math.round(parseFloat($('#valor_unit_lista_edit')
			.val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	var val_item = isNull(Math.round(parseFloat($('#valor_unit_edit').val()
			.replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	//if (id == 'valor_unit_edit') {
		if (val_lista > val_item) {
			FLUIGC
					.toast({
						title : 'Pre&ccedil;o: ',
						message : 'Pre&ccedil;o Unit&aacute;rio nao pode ser inferior a R$: '
								+ String(val_lista.toFixed(3))
										.replace('.', ','),
						type : 'warning',
						timeout : 'fast'
					});
			setTimeout("$('#valor_unit" + seq + "').focus();", 1);
			return false;
		}
	//}

	if ($('#ies_inf_pedido').val() == 'N'
			&& ($('#linha_edit').val() == null
					|| $('#linha_edit').val() == undefined
					|| $('#linha_edit').val() == "" || $('#linha_edit').val() == "0")) {
		var duplicado = 'N';
		$("input[name^='cod_item___']")
				.each(
						function() {
							console.log('Item...', $(this).val());
							if ($(this).val() == $('#cod_item_edit').val()) {
								FLUIGC
										.toast({
											title : 'Valida&ccedil;&atilde;o: ',
											message : 'N&atilde;o &eacute; permitido informar item duplicado',
											type : 'warning',
											timeout : 'fast'
										});
								duplicado = 'S';
								setTimeout("$('#cod_item_edit').focus();", 1);
								return false;
							}
						});
		if (duplicado == 'S') {
			setTimeout("$('#cod_item_edit').focus();", 1);
			return false;
		}
	}

	if ($('#ies_inf_pedido').val() == 'S') {
		var msg = "";
		if ($('#pedido_cli_edit').val() == "") {
			$($('#pedido_cli_edit')).css({
				'background-color' : '#FFE4C4'
			});
			msg += ' N&uacute;mero de pedido n&atilde;o informado!';
			setTimeout("$('#pedido_cli_edit').focus();", 1);
		} else {
			$($('#pedido_cli_edit')).css({
				'background-color' : '#FFFFFF'
			});
		}
		if ($('#seq_pedido_cli_edit').val() == "") {
			$($('#seq_pedido_cli_edit')).css({
				'background-color' : '#FFE4C4'
			});
			msg += ' Sequencia do item no pedido n&atilde;o informado!';
			setTimeout("$('#seq_pedido_cli_edit').focus();", 1);
		} else {
			$($('#seq_pedido_cli_edit')).css({
				'background-color' : '#FFFFFF'
			});
		}
		if (msg != "") {
			FLUIGC.toast({
				title : 'Valida&ccedil;&atilde;o: ',
				message : msg,
				type : 'warning',
				timeout : 'fast'
			});
			return false;
		}
	}

	if ($('#desconto_edit').val() != "" && $('#tipo_desconto').val() == ""
			&& $('#desconto_edit').val() != "0,00") {
		setTipDescModal();
		return false;
	}

	var seq = "0";
	console.log('grava_000');
	if ($('#linha_edit').val() == '0') {
		seq = wdkAddChild(table);
	} else {
		seq = $('#linha_edit').val();
	}

	var qtd = isNull(Math.round(parseFloat($('#quantidade_edit').val().replace(
			'.', '').replace(',', '.')) * 10000) / 10000, 0);
	var qtd_orig = isNull(Math.round(parseFloat($('#qtd_orig___' + seq).val()
			.replace('.', '').replace(',', '.')) * 10000) / 10000, 0);

	console.log('Antes..... load motivo..... ', $('#cod_motivo_edit').val(),
			alteraMotivo, qtd, qtd_orig);
	if ((qtd < qtd_orig && $('#cod_motivo_edit').val() == "")
			|| (qtd < qtd_orig && alteraMotivo == true)) {
		console.log('dentro..... load motivo..... ');
		setMotCancelModal();
		return false;
	}
	console.log('Depois..... load motivo..... ');

	console.log('grava_001');

	$('#cod_item___' + seq).val($('#cod_item_edit').val());
	$('#peso___' + seq).val($('#peso_edit').val());
	$('#cubagem___' + seq).val((isNull(Math.round(parseFloat($('#quantidade_edit').val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0)/ isNull(Math.round(parseFloat($('#qtd_pad_edit').val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0) )* isNull(Math.round(parseFloat($('#cubagem_edit').val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0));
	$('#qtd_pad___' + seq).val($('#qtd_pad_edit').val());

	$('#cod_lin_prod___' + seq).val($('#cod_lin_prod_edit').val());
	$('#cod_lin_recei___' + seq).val($('#cod_lin_recei_edit').val());
	$('#cod_seg_merc___' + seq).val($('#cod_seg_merc_edit').val());
	$('#cod_cla_uso___' + seq).val($('#cod_cla_uso_edit').val());
	$('#cod_grupo_item___' + seq).val($('#cod_grupo_item_edit').val());
	$('#cod_tip_carteira___' + seq).val($('#cod_tip_carteira_edit').val());
	$('#um___' + seq).val($('#um_edit').val());
	$('#data_entrega___' + seq).val($('#data_entrega_edit').val());

	$('#valor_unit___' + seq).val($('#valor_unit_edit').val());
	$('#valor_unit_lista___' + seq).val($('#valor_unit_lista_edit').val());
	$('#valor_unit_liq___' + seq).val($('#valor_unit_liq_edit').val());
	$('#pct_desc_adic___' + seq).val($('#pct_desc_adic_edit').val());

	if ($('#desconto_edit').val() == "") {
		$('#desconto___' + seq).val("0,00");
	} else {
		$('#desconto___' + seq).val($('#desconto_edit').val());
	}

	// $('#desconto___'+seq).val( $('#desconto_edit').val( ) );
	$('#quantidade___' + seq).val($('#quantidade_edit').val());
	$('#qtd_pad___' + seq).val($('#qtd_pad_edit').val());
	$('#valor_total___' + seq).val($('#valor_total_edit').val());

	$('#den_item___' + seq).val($('#den_item_edit').val());
	$('#den_item_reduz___' + seq).val($('#den_item_reduz_edit').val());

	$('#pedido_cli_item___' + seq).val($('#pedido_cli_edit').val());
	$('#seq_pedido_cli_item___' + seq).val($('#seq_pedido_cli_edit').val());

	$('#obs_item_1___' + seq).val($('#obs_item_1_edit').val());
	$('#obs_item_2___' + seq).val($('#obs_item_2_edit').val());
	$('#obs_item_3___' + seq).val($('#obs_item_3_edit').val());
	$('#obs_item_4___' + seq).val($('#obs_item_4_edit').val());
	$('#obs_item_5___' + seq).val($('#obs_item_5_edit').val());

	$('#ies_mix___' + seq).val($('#ies_mix_edit').val());
	$('#cod_motivo___' + seq).val($('#cod_motivo_edit').val());

	$('#sequencia___' + seq).val($('#sequencia_edit').val());

	clearItem('cod_item');

	$('#linha_edit').val('0');

	atulizaRecalcTotal('grava_edit');

}

function editItem(id) {

	var seq = id.split('___')[1];

	// var objDestino = { inputId:'den_item_edit', inputName:'den_item_edit',
	// cod_item:$('#cod_item___'+seq).val( ),
	// den_item:$('#den_item___'+seq).val( ) };
	zoomDestino = window[$("#den_item_edit").attr('filter-instance')];
	zoomDestino.setValue($('#den_item___' + seq).val());

	$('#linha_edit').val(seq);

	$('#cod_item_edit').val($('#cod_item___' + seq).val());
	$('#peso_edit').val($('#peso___' + seq).val());
	$('#cubagem_edit').val($('#cubagem___' + seq).val());
	$('#qtd_pad_edit').val($('#qtd_pad___' + seq).val());

	$('#cod_lin_prod_edit').val($('#cod_lin_prod___' + seq).val());
	$('#cod_lin_recei_edit').val($('#cod_lin_recei___' + seq).val());
	$('#cod_seg_merc_edit').val($('#cod_seg_merc___' + seq).val());
	$('#cod_cla_uso_edit').val($('#cod_cla_uso___' + seq).val());
	$('#cod_grupo_item_edit').val($('#cod_grupo_item___' + seq).val());
	$('#cod_tip_carteira_edit').val($('#cod_tip_carteira___' + seq).val());
	$('#um_edit').val($('#um___' + seq).val());
	$('#data_entrega_edit').val($('#data_entrega___' + seq).val());

	$('#valor_unit_edit').val($('#valor_unit___' + seq).val());
	$('#valor_unit_lista_edit').val($('#valor_unit_lista___' + seq).val());
	$('#pct_desc_adic_edit').val($('#pct_desc_adic___' + seq).val());

	if ($('#desconto___' + seq).val() == "") {
		$('#desconto_edit').val("0,00");
	} else {
		$('#desconto_edit').val($('#desconto___' + seq).val());
	}
	$('#quantidade_edit').val($('#quantidade___' + seq).val());
	$('#qtd_pad_edit').val($('#qtd_pad___' + seq).val());
	$('#valor_total_edit').val($('#valor_total___' + seq).val());

	$('#den_item_reduz_edit').val($('#den_item_reduz___' + seq).val());

	$('#pedido_cli_edit').val($('#pedido_cli_item___' + seq).val());
	$('#seq_pedido_cli_edit').val($('#seq_pedido_cli_item___' + seq).val());

	$('#obs_item_1_edit').val($('#obs_item_1___' + seq).val());
	$('#obs_item_2_edit').val($('#obs_item_2___' + seq).val());
	$('#obs_item_3_edit').val($('#obs_item_3___' + seq).val());
	$('#obs_item_4_edit').val($('#obs_item_4___' + seq).val());
	$('#obs_item_5_edit').val($('#obs_item_5___' + seq).val());

	$('#ies_mix_edit').val($('#ies_mix___' + seq).val());
	if ($('#cod_motivo___' + seq).val() != "") {
		$('#cod_motivo_edit').val($('#cod_motivo___' + seq).val());
	}

	$('#sequencia_edit').val($('#sequencia___' + seq).val());

	setTimeout("$('#cod_item_edit').focus();", 1);

}

function atulizaRecalcTotal(id) {

	var total = 0.0;
	var qtd_tot = 0.0;
	var cub_tot = 0.0;
	var qtd_mix = 0.0;
	var qtd_desc_sup = 0.0;
	var total_bruto = 0.0;
	var total_minimo = 0.0;
	var val_liq = 0.0;

	$("input[name^='cod_item___']")
			.each(
					function() {
						console.log('Item...', $(this).attr('name'));

						var oTotal = calcDescTotal($(this).attr('name'));

						total += oTotal.total_liquido;
						total_bruto += oTotal.total_bruto;
						total_minimo += oTotal.total_minimo;
						val_liq = 0.0;
						val_liq = oTotal.val_liq;

						var seq = $(this).attr('name').split('___')[1];
						
						console.log('Seq ',seq);
						console.log('Qtd ', $('#quantidade___' + seq).val());
						console.log('Peso ', $('#peso___' + seq).val());
						console.log('Val Liq ', val_liq);
						
						$('#valor_unit_liq___' + seq).val(String((val_liq).toFixed(3)).replace('.', ','));

						var qtd = isNull((Math.round(parseFloat($('#quantidade___' + seq).val().replace(/\./g, '').replace(/\,/g, '.')) * 10000) / 10000)
								* Math.round(parseFloat($('#peso___' + seq).val().replace(/\./g, '').replace(/\,/g, '.')) * 10000) / 10000, 0);
						
						
						var cub = isNull(parseFloat($('#cubagem___' + seq).val()),0);
						
						cub_tot += cub;
						qtd_tot += qtd;
						if ($('#ies_mix___' + seq).val() == 'S') {
							qtd_mix += qtd;
						}
						console.log('Qtd Total', qtd_tot);
						console.log('Qtd Mix', qtd_mix);
						console.log('Valor', total);
						console.log('Cubagem Total ',cub_tot);

						var desc = isNull((Math.round(parseFloat($('#desconto___' + seq).val().replace(/\./g, '').replace(/\,/g, '.')) * 10000) / 10000), 0);
						var desc_tabela = isNull((Math.round(parseFloat($('#pct_desc_adic___' + seq).val().replace(/\./g,'').replace(/\,/g, '.')) * 10000) / 10000), 0);

						if (desc > desc_tabela) {
							qtd_desc_sup += 1;
						}
					});

	console.log('Valor Total', String((total).toFixed(3)).replace('.', ','));

	var mix = 0;
	if (qtd_tot != 0) {
		mix = (qtd_mix / qtd_tot) * 100;
		console.log('Mix', mix);
	}

	var max_desc = 0;
	if (total_bruto != 0) {
		max_desc = (total_bruto - total_minimo) / total_bruto * 100;
		console.log('Max Desc', max_desc);
	}

	var med_desc = 0;
	if (total_bruto != 0) {
		med_desc = (total_bruto - total) / total_bruto * 100;
		console.log('Max Desc', max_desc);
	}

	var cotacao = isNull( Math.round( parseFloat( $('#cotacao').val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 1 );
	if( isNaN(cotacao) || cotacao == 0 || cotacao == "" ){
		cotacao = 1;
	}
	
	$('#mix_geral').val(String((mix).toFixed(2)).replace('.', ','));

	$('#peso_total_geral').val(String((qtd_tot).toFixed(2)).replace('.', ','));
	$('#cubagem_total_geral').val(String((cub_tot).toFixed(6)).replace('.', ','));
	$('#valor_total_geral').val(String((total).toFixed(2)).replace('.', ','));
	
	$('#valor_total_real').val(String((total*cotacao).toFixed(2)).replace('.', ','));
	
	$('#qtd_item_desc_sup').val(
			String((qtd_desc_sup).toFixed(2)).replace('.', ','));

	$('#valor_minimo').val(String((total_minimo).toFixed(2)).replace('.', ','));
	$('#valor_bruto').val(String((total_bruto).toFixed(2)).replace('.', ','));
	$('#desc_medio').val(String((med_desc).toFixed(2)).replace('.', ','));
	$('#desc_maximo').val(String((max_desc).toFixed(2)).replace('.', ','));
	
}

function validaPedSeq(id) {
	if ($('#cod_item_edit').val() == "") {
		$('#' + id).val("");
		return false;
	}
}

function qtdItens() {
	var total = 0;
	$("input[name^='cod_item___']").each(function() {
		total += calcDescTotal($(this).attr('name')).total_liquido;
	});
	return total;
}

function setObsItem() {

	if ($('#inf_obs').is(":checked") && $('#cod_item_edit').val() != "") {
		$('#obs_item').show();
	} else {
		$('#obs_item').hide();
		$('#inf_obs').prop("checked", false);
	}
}

function setCeiOBS() {
	console.log('CEI.......' + $('#cei').val());
	if ($('#cei').val().trim() != "" && $('#cei').val().trim() != undefined
			&& $('#cei').val().trim() != null) {
		$('#texto_nf_1').val('CEI: ' + $('#cei').val());
		// $('#texto_nf_1').prop("readonly",true);
	}// else{
	// $('#texto_nf_1').prop("readonly",false);
	// }
}

function setTipDescModal() {

	html = $('#div_tip_desc').html();
	html = html.replace('id="tipo_desconto"', 'id="tipo_desconto_mod"');
	console.log(html);

	var myModal = FLUIGC.modal({
		title : 'Tipo Desconto.',
		content : html,
		id : 'fluig-modal',
		size : 'larger',
		actions : [ {
			'label' : 'Confirmar',
			'bind' : 'data-open-modal',
			'classType' : 'confirmar',
			'autoClose' : true
		}, {
			'label' : 'Cancelar',
			'autoClose' : true
		} ]
	}, function(err, data) {
		if (err) {
			// do error handling
		} else {
			$('.confirmar').click(function() {
				$('#tipo_desconto').val($('#tipo_desconto_mod').val());
				gravaItem('ped_itens', true);
			});
		}
	});
}

function setMotCancelModal() {

	html = $('#div_mot_cancel').html();
	html = html.replace('id="mot_cancel"', 'id="mot_cancel_mod"');
	console.log(html);

	var myModal = FLUIGC.modal({
		title : 'Motivo Cancelamento.',
		content : html,
		id : 'fluig-modal',
		size : 'larger',
		actions : [ {
			'label' : 'Confirmar',
			'bind' : 'data-open-modal',
			'classType' : 'confirmar',
			'autoClose' : true
		}, {
			'label' : 'Cancelar',
			'autoClose' : true
		} ]
	}, function(err, data) {
		if (err) {
			// do error handling
		} else {
			$('#mot_cancel_mod').val($('#cod_motivo_edit').val());
			$('.confirmar').click(function() {
				$('#cod_motivo_edit').val($('#mot_cancel_mod').val());
				gravaItem('ped_itens', false);
			});
		}
	});
}

function getDescModal(preco, desc) {

	console.log('PRECO', preco, desc);
	console.log('PRECOANTES', $('#valor_unit_edit').val());
	var valUnitTexto = String($('#valor_unit_edit').val()).replace(',', '.');
	console.log('PRECOANTES2',(parseFloat(valUnitTexto) * 10000));
	console.log('PRECOANTES3', Math.round(parseFloat(valUnitTexto) * 10000) / 10000);
	var valUnit = Math.round(parseFloat(valUnitTexto) * 10000) / 10000;

	console.log('valUnit', valUnit);

	html = "<div> Deseja utilizar o valor da ultima venda. <br>";
	if (preco > valUnit) {
		html += " Pre&ccedil;o: R$ "
				+ String((preco).toFixed(3)).replace('.', ',') + " <br> ";
	}
	html += " Desconto: " + String((desc).toFixed(2)).replace('.', ',')
			+ "% </div>";

	console.log(html);

	var myModal = FLUIGC.modal({
		title : 'Desconto.',
		content : html,
		id : 'fluig-modal',
		size : 'larger',
		actions : [ {
			'label' : 'Confirmar',
			'bind' : 'data-open-modal',
			'classType' : 'confirmar',
			'autoClose' : true
		}, {
			'label' : 'Cancelar',
			'autoClose' : true
		} ]
	}, function(err, data) {
		if (err) {
			// do error handling
		} else {
			$('.confirmar').click(
					function() {
						if (preco > valUnit) {
							$('#valor_unit_edit').val(
									String((preco).toFixed(3))
											.replace('.', ','));
						}
						$('#desconto_edit').val(
								String((desc).toFixed(2)).replace('.', ','));
						calcDescTotal('ultimo_preco');
						// $('#tipo_desconto').val(
						// $('#tipo_desconto_mod').val() );
						// gravaItem('ped_itens', true);
					});
		}
	});
}

function converteMoeda(valor) {
	var inteiro = null, decimal = null, c = null, j = null;
	var aux = new Array();
	valor = "" + valor;
	c = valor.indexOf(".", 0);
	// encontrou o ponto na string
	if (c > 0) {
		// separa as partes em inteiro e decimal
		inteiro = valor.substring(0, c);
		decimal = valor.substring(c + 1, valor.length);
	} else {
		inteiro = valor;
	}

	// pega a parte inteiro de 3 em 3 partes
	for (j = inteiro.length, c = 0; j > 0; j -= 3, c++) {
		aux[c] = inteiro.substring(j - 3, j);
	}

	// percorre a string acrescentando os pontos
	inteiro = "";
	for (c = aux.length - 1; c >= 0; c--) {
		inteiro += aux[c] + '.';
	}
	// retirando o ultimo ponto e finalizando a parte inteiro

	inteiro = inteiro.substring(0, inteiro.length - 1);

	decimal = parseInt(decimal);
	if (isNaN(decimal)) {
		decimal = "00";
	} else {
		decimal = "" + decimal;
		if (decimal.length === 1) {
			decimal = "0" + decimal;
		}
	}

	valor = inteiro + "," + decimal;

	return valor;

}

function alteraPreco(id) {

	if (isNull(Math.round(parseFloat($('#valor_unit_edit').val().replace('.',
			'').replace(',', '.')) * 10000) / 10000, 0) != 0
			&& isNull(Math.round(parseFloat($('#valor_unit_lista_edit').val()
					.replace('.', '').replace(',', '.')) * 10000) / 10000, 0) == 0) {

		$('#' + id).val('0.000');
		FLUIGC
				.toast({
					title : 'Preco: ',
					message : 'Nao é permitido alterar preco, se nao localizado preco do item na lista de preco.',
					type : 'danger',
					timeout : 'slow'
				});
		setTimeout("$('#valor_unit_edit').focus();", 1);
	}

}

function retiraAcento(palavra, obj) {
	com_acento = "àáâãäèéêëìíîïòóôõöùúûüÀÁÂÃÄÈÉÊËÌÍÎÒÓÔÕÖÙÚÛÜçÇñÑ";
	sem_acento = "aaaaaeeeeiiiiooooouuuuAAAAAEEEEIIIOOOOOUUUUcCnN";
	nova = '';
	for (i = 0; i < palavra.length; i++) {
		console.log('entrou1');
		if (com_acento.search(palavra.substr(i, 1)) >= 0) {
			console.log('entrou2');
			nova += sem_acento.substr(com_acento.search(palavra.substr(i, 1)),
					1);
		} else {
			console.log('entrou3');
			nova += palavra.substr(i, 1);
		}
	}
	console.log('nova ', nova.toUpperCase());
	obj.value = nova.toUpperCase();
}

function validaMultiplo(){
	var quant = isNull(Math.round(parseFloat($('#quantidade' + seq).val()
			.replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	var quant_mult = isNull(Math.round(parseFloat($('#qtd_pad' + seq).val()
			.replace('.', '').replace(',', '.')) * 10000) / 10000, 1);
	var teste_divisao = quant / quant_mult;
	if (!Number.isInteger(parseFloat(teste_divisao.toFixed(2)))){
	console.log('entrou na validacao do multiplo');
		// $('#quantidade_edit').focus();
		setTimeout("$('#quantidade_edit').focus();", 1);

		FLUIGC.toast({
			title : 'Quantidade: ',
			message : 'A quantidade deve ser multiplo de: '
					+String( quant_mult.toFixed(2) ),
			type : 'warning',
			timeout : 'fast'
		});
		return false;
	}
	return true;
}

function montaTextoPed(){
	var texto = "";

	if ($('#tipo_frete').val() != "RET") {
		$( "input[id^=cod_pergunta___]" ).each(function( index ) {
			var seq = $(this).attr('id').split('___')[1];
			if( $('#tipo_pergunta___'+seq).val() == 'O' ){
				texto += ' - '+$('#den_pergunta___'+seq).val()+": "+$('#opcao___'+seq+" option:selected" ).text();
			}else if ( $('#tipo_pergunta___'+seq).val() == 'M' ){
				texto += ' - '+$('#den_pergunta___'+seq).val()+": "+$('#metrica___'+seq ).val();
			}else if( $('#tipo_pergunta___'+seq).val() == 'I' ){
				texto += ' - '+$('#den_pergunta___'+seq).val()+": "+$('#informado___'+seq ).val();
			} 
		});
	}
	if( $('#compl_nf').val() != "" ){
		if( texto == "" ){
			texto = $('#compl_nf').val();
		}else{
			texto += ' - '+$('#compl_nf').val();
		}
	}
	
	
	texto = texto.substring(0, texto.length);
	texto = texto.trim();
	
	$('#texto_nf_1').val( texto.substring(0,76) );
	$('#texto_nf_2').val( texto.substring(76,152) );
	$('#texto_nf_3').val( texto.substring(152,228) );
	$('#texto_nf_4').val( texto.substring(228,304) );
	$('#texto_nf_5').val( texto.substring(304,380) );
	
}

function copyEndereco(){
	
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("cod_cliente", $("#cod_cliente").val(), $("#cod_cliente").val(), ConstraintType.MUST));
	var dataset = DatasetFactory.getDataset('clientes_logix', null,	constraints, null);

	if (dataset != null) {

		for (var x = 0; x < dataset.values.length; x++) {

			var row = dataset.values[x];
			console.log('Console.....', row);

			$('#cnpj_ent').val(row.CNPJ.trim());

			$('#pais_ent').val( loadCampoDataSet('paises', 'cod_pais', row.COD_PAIS,	'DEN_PAIS') );
			$('#cod_pais_ent').val(row.COD_PAIS);
			$('#estado_ent').val(row.COD_UNI_FEDER);

			$('#ie_ent').val(row.INS_ESTADUAL.trim());
			$('#cod_cidade_ent').val(row.COD_CIDADE);

			var zoomDestino = {};
			zoomDestino = window[$("#cidade_ent").attr('filter-instance')];
			zoomDestino.setValue(row.DEN_CIDADE);
			zoomDestino.disable(true);

			$('#ipo_logradouro_ent').val(row.COD_CIDADE);
			$('#endereco_ent').val(row.LOGRADOURO);
			$('#cep_ent').val(row.COD_CEP);
			$('#bairro_ent').val(row.DEN_BAIRRO);
			$('#tipo_logradouro_ent').val(row.TIP_LOGRADOURO.trim());
			
			$('#numero_ent').val(row.NUM_IDEN_LOGRAD.trim());
			
			$('#ies_bairro_ent_manual').prop('checked', true);
			alteraCampos('ies_bairro_ent_manual', 'bairro_ent_sel', 'bairro_ent');
			
		}
	
	}
}

function calculafrete() {
	// ////#### F R E T E #####
		var frete_total = 0 ;
		var peso_total = parseFloat($('#peso_total_geral').val());
		var cubagem_total = parseFloat($('#cubagem_total_geral').val().replace(',','.'));
		var cod_cidade_ent = ($('#cod_cidade_ent').val());
		console.log( 'peso_total......... ',peso_total );
		var codCliente = $('#cod_cliente').val();
		var codEmpresa = $('#empresa').val();
		var valor_total_real = parseFloat($('#valor_total_real').val().replace('.',''));
		var SQL ="";
		var i = 0;
		if( peso_total == 0 || peso_total == undefined || peso_total == null || peso_total == ""  ){
			
			peso_total = 0.0;
			pesoP = 0.0;
			
			$("input[name^='quantidade___']").each(function() {

				var seq = $(this).attr('name').split('___')[1];

				peso_total += parseFloat($('#quantidade___' + seq).val());

				if (nrParcela == $('#parcelaID___' + seq).val()) {
					pesoP += parseFloat($('#quantidade___' + seq).val());
				}
			});
			
			hAPI.setCardValue("peso_total_geral", df2.format( peso_total ) );
		}
		
		console.log('peso_total D+. ',peso_total);
		
		
			
			console.log('tipo_frete_logix ');
			console.log('cod_cidade_ent ',cod_cidade_ent);
			
			if (cod_cidade_ent != null && cod_cidade_ent != 0 ) {
				SQL = " select nvl( eis_f_get_valor_tabela_frete( emp.cod_empresa, "+ //empresa
					" '"+$('#cod_trans').val()+"', "+ //cod_transportadora
				" clie.cod_cidade, "+ //cod cidade origem
				" '"+$('#cod_cliente').val()+"', "+ //cod_cliente
	            " '"+ cod_cidade_ent +"', "+ //cod cidade destino 
	            "											pe.parametro_ind, "+ //nivel
	            " 0," + //quantidade
	            "											"+ peso_total +", "+ //peso liquido
	            "											"+ peso_total +", "+  //peso item
	            "											"+cubagem_total+", " + //peso cubado
	            valor_total_real+", "+ //valortotal mercadoria
	            valor_total_real+", "+ //valortotal 
	            " 0, " + //total km
	            " 0, " + //qtd descarga
	            " 'N', "+
	            " 'N' ), 0) as frete_cif "+
	            "    FROM empresa emp "+ 
	            "	 join clientes clie on (clie.cod_cliente = emp.cod_cliente) "+
	            "	 join clientes cli on (1=1) "+
	            "	 left join omc_par_emitente pe on ( pe.emitente = cli.cod_cliente "+
	            "                     				and pe.parametro = 'nivel_servico' ) "+
	            "	where emp.cod_empresa = '"+ codEmpresa +"' "+
	            "	  and cli.cod_cliente = '"+ codCliente +"' ";
				
			} else {
				SQL = " select nvl( eis_f_get_valor_tabela_frete( emp.cod_empresa, "+ //empresa
						" '"+$('#cod_trans').val()+"', "+ //cod_transportadora
						"											clie.cod_cidade, "+ //cod cidade origem
						" '"+$('#cod_cliente').val()+"', "+ //cod_cliente
					    " cli.cod_cidade, "+ //cod cidade destino 
					    "											pe.parametro_ind, "+ //nivel
					    " 0, " + //quantidade
					    "											"+ peso_total +", "+ //peso liquido
					    "											"+ peso_total +", "+  //peso item
					    "											"+cubagem_total+", " + //peso cubado
					    valor_total_real+", "+ //valortotal mercadoria
					    valor_total_real+", "+ //valortotal 
					    " 0, " + //total km
					    " 0, " + //qtd descarga
					    " 'N', "+
					    
					    " 'N' ), 0) as frete_cif "+
					    "    FROM empresa emp "+ 
					    "	 join clientes clie on (clie.cod_cliente = emp.cod_cliente) "+
					    "	 join clientes cli on (1=1) "+
					    "	 left join omc_par_emitente pe on ( pe.emitente = cli.cod_cliente "+
					    "                     				and pe.parametro = 'nivel_servico' ) "+
					    "	where emp.cod_empresa = '"+ codEmpresa +"' "+
					    "	  and cli.cod_cliente = '"+ codCliente +"' ";
			}
		     console.log('cubagem +++',cubagem_total);
	         console.log('SQL FRETE... ',SQL); 
			 var c1 = DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/LogixPRD', 'java:/jdbc/LogixPRD', ConstraintType.MUST);
			 var c2 = DatasetFactory.createConstraint("SQL", SQL, SQL, ConstraintType.MUST);
			 var constraints = new Array(c1,c2);
			 var dataset = DatasetFactory.getDataset("select", null, constraints, null);
			 
			 console.log('dataset sql1',dataset);
			 
			 for (var x = 0; x < dataset.values.length; x++) {
				 var row = dataset.values[x];
				 console.log('dataset frete ',dataset);
				 console.log('console pequeno',(row['frete_cif']));
				 console.log('console grande',(row['FRETE_CIF']));
				 if (dataset != null && (parseFloat(row['frete_cif']))!= 0 ) {
	
					 $('#fretetotal').val(String((parseFloat(row['frete_cif'])).toFixed(2)).replace('.', ',')) ;
					 
					 
				 }else{
					 console.log('ENTROU NO FRETE ZERO');
					 $('#fretetotal').val(parseFloat(0.00)) ;
					 //tratativa para devolver ao comercial para analise quando o tipo de frete for CIF e não tiver valor
					 
					 FLUIGC.toast({
							title : 'Incorreto: ',
							message : 'Atencao: O tipo de Frete selecionado é CIF e não foi possível calcular o valor de Frete a partir das tabelas do TMS!',
							type : 'warning',
							timeout : 'slow'
						});
	
					 //fim tratativa para devolver ao comercial para analise quando o tipo de frete for CIF e não tiver valor
				 }	
			 }
		
	    // ######### F I M F R E T E #######
}