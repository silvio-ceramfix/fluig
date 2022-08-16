var data = '';

function loadBody() {
	
	
	var hoje = new Date();
	if( $('#data_entrega').val() == "" ){
		$('#data_entrega').val(dataAtualFormatada(new Date(hoje.getTime() + (7 * 24 * 60 * 60 * 1000))));
	}

	autoSize();
	setTipo();
	verificaItemPendente();
	
	if( ['4','35','48','54'].indexOf( $('#task').val() ) > -1 ) {
		$('.fluigicon-envelope').hide();
		readOnlyAll("",true);
		$('#motivo').attr('readonly', false);
		desabilitaIntegra();

	}else if( ['16','64','41','82'].indexOf( $('#task').val() ) > -1  ){
		//readOnlyAll("",false);
		habilitaIntegra();
		
		FLUIGC.calendar('#data_entrega');
		FLUIGC.calendar('#data_vencimento');
		FLUIGC.calendar('#data_emissao');

	}else if( ['0','1','6'].indexOf( $('#task').val() ) > -1  ){
		$('.fluigicon-envelope').hide();
		$('#motivo').attr('readonly', true);
		desabilitaIntegra();
		FLUIGC.calendar('#data_entrega');
		FLUIGC.calendar('#data_vencimento');
		FLUIGC.calendar('#data_emissao');

	}else{
		FLUIGC.calendar('#data_entrega');
		FLUIGC.calendar('#data_vencimento');
		FLUIGC.calendar('#data_emissao');
	}
	
	trataItens();
	
	//FLUIGC.switcher.init('#envia_anexo_compras');
	
}

function desabilitaLinhaIntegrada() {
	console.log('chamoulinha1');
	$("td[name^='linha_item___']")
	.each(
			function() {
				var seq = this.id.split('___')[1];
				if ($('#integrou___'+seq).val() == 'S') {
					console.log('chamoulinha1.1');
					this.setAttribute('style', 'display: none;' );
				}
			});
}

function habilitaLinhaIntegrada() {
	console.log('chamoulinha2');
	$("td[name^='linha_item___']")
	.each(
			function() {
				var seq = this.id.split('___')[1];
				if ($('#integrou___'+seq).val() != 'S') {
					console.log('chamoulinha2.1');
					this.setAttribute('style', 'display: true;' );
				}
			});
}

function readOnlyAll(pnGrp,tipo){
	var vnGrp = pnGrp;
	if( vnGrp == "" || vnGrp == undefined ){
		vnGrp = "fluig-style-guide";	
	}
	$('input, select, textarea', $('.'+vnGrp) ).each(function(){
		console.log(' estou bloqueando ', vnGrp, $(this).attr('id') );
		if( $(this).is('select') ){			
			$('#'+ $(this).attr('id') +' option:not(:selected)').prop('disabled', tipo);
		}else{
			$(this).attr('readonly',tipo);
		}
	});
	
}

function desabilitaIntegra() {
	console.log('chamou1');
	$("div[name^='integra_col']")
	.each(
			function() {
				console.log('chamou1.1');
				this.setAttribute('style', 'display: none;' );
			});
}

function habilitaIntegra() {
	console.log('chamou2');
	$("div[name^='integra_col']")
	.each(
			function() {
				console.log('chamou2.1');
				this.setAttribute('style', 'display: true;' );
			});
}


$(document).bind("DOMNodeRemoved", function (e) {
	var target = $(e.target);
	if (target.html().indexOf("id='pai_filho_modal'") > 0 || target.html().indexOf("id='modal-zoom'")) {
		//parent.$('#workflowView-cardViewer').css( 'zIndex', 0 );
		parent.$('#workflowview-header').show();
	}
});

function contaLinhasTabela(id){  
	var tabela = document.getElementById(id);  
	var linhas = tabela.getElementsByTagName('tr');    
	//alert('A tabela ' + id +' possui ' + linhas.length + ' linhas');
	return linhas.length;
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
		decimal = "000";
	} else {
		decimal = "" + decimal;
		if (decimal.length === 1) {
			decimal = "0" + decimal;
		}
	}

	valor = inteiro + "," + decimal;

	return valor;

}

function addLinha(tabela, origem) {
	if ( ( $('#tipo').val() == '' || $('#empresa').val() == '' ) && origem != 'auto' ) {
		var msg = '';
		if (tabela == 'itens_solic')
			msg += '\n\rPara poder adicionar ITENS!';
		if (tabela == 'rateio')
			msg += '\n\rPara poder adicionar RATEIO!';
		FLUIGC.toast({
			title: 'Preenchimento: ',
			message: 'Voc&ecirc; deve selecionar uma empresa e um tipo de compra. ' + msg,
			type: 'warning',
			timeout: 'slow'
		});
		return 0;
	}

	var seq = 0;
	if (tabela == 'itens_solic') {
		
		console.log('quantidade de linhas ',contaLinhasTabela('rateio'));
		if (contaLinhasTabela('rateio')>2 && $('#tipo').val() == 'O') {
			FLUIGC.toast({
				title: 'Preenchimento: ',
				message: 'Para adicionar novos itens/OC não pode haver rateio preenchido. Se desejar incluir novos itens exclua o rateio preenchido! ' + msg,
				type: 'warning',
				timeout: 'slow'
			});
			return 0;
		} else {

			seq = wdkAddChild(tabela);
			autoSize();
			
			var seqItem = 0;
			$("input[name^=seq_item___]").each(function (index) {
				
				var seqAtu = parseInt( $( this ).val() );
				if( seqItem < seqAtu ){
					seqItem = seqAtu;
				}
			});
			
			$('#seq_item___' + seq).val( seqItem + 1 );
			$('#qtd_solic___' + seq).maskMoney({ precision: 3, thousands: '.', decimal: ',' });
			$('#preco_unit___' + seq).maskMoney({ precision: 3, thousands: '.', decimal: ',' });
			$('#preco_est___' + seq).maskMoney({ precision: 3, thousands: '.', decimal: ',' });
	
			if (origem == 'button') {
				$('#cod_item___' + seq).focus();
			}
			document.body.scrollTop = $('#qtd_solic___' + seq).offset().top;
		}
	}
	if (tabela == 'rateio') {

		var total = 0.00;
		$("input[name*=perc_reateio___]").each(function (index) {
			total += Math.round(parseFloat($(this).val().replace('.', '').replace(',', '.')) * 1000) / 1000;
		});
		console.log(' Add Linha..... 001');
		total = Math.round(total * 1000) / 1000;
		console.log(' Add Linha..... 002');
		if (total >= 100) {
			return -1;
		}
		console.log(' Add Linha..... 003');
		seq = wdkAddChild(tabela);
		console.log(' Add Linha..... 004');
		autoSize();

		$('#perc_reateio___' + seq).maskMoney({ precision: 2, thousands: '.', decimal: ',' });
		$('#perc_reateio___' + seq).val(String((100 - total).toFixed(2)).replace('.', ','));
		$('#perc_reateio___' + seq).focus();
		document.body.scrollTop = $('#perc_reateio___' + seq).offset().top;

		if (['N', 'A'].indexOf($('#tipo').val()) > -1) {
			$('#doc_origem___' + seq).prop('readonly', true);
		} else {
			$('#doc_origem___' + seq).prop('readonly', false);
		}	
		if (['N', 'P', 'O', 'S', 'T'].indexOf($('#tipo').val()) > -1 && $('#conta').val() == "") {
			$('#num_conta___' + seq).prop('readonly', true);
		}
		if (['S'].indexOf($('#tipo').val()) > -1) {
			$('#cod_unid_func___' + seq).prop('readonly', true);
		}
		if (['O', 'S'].indexOf($('#tipo').val()) > -1) {
			$('#cod_cc___' + seq).prop('readonly', true);
		}

		/*if( ['P','T'].indexOf( $('#tipo').val() ) > -1 ){
			var retorno  = confirm("Deseja informar um centro de custo diferente?");
			console.log('MSG.....',retorno );
			if( retorno == false ){
				console.log( 'getCCUserRH.....', getCCUserRH( $('#matricula_solicitante').val() ) );
				ccUser = getCCUserRH( $('#matricula_solicitante').val() );
				if( ccUser != ''){
					$('#cod_cc___'+seq).val( ccUser );
					console.log( 'COD CC.....', $('#cod_cc___'+seq).val() );
					zoom( 'bt_cc', 'cod_cc___'+seq );
					console.log( 'DEPOIS DO ZOOM' );
				}
			}
		}*/

	}
	setUpper();
	return seq;
}

function validaPercent(id, next) {
	var total = 0.00;
	$("input[name*=perc_reateio___]").each(function (index) {
		total += Math.round(parseFloat($(this).val().replace('.', '').replace(',', '.')) * 1000) / 1000;
	});

	total = Math.round(total * 1000) / 1000;

	if (total < 100 && next) {
		var seq = addLinha('rateio', 'field');
		$('#perc_reateio___' + seq).val(String((100 - total).toFixed(2)).replace('.', ','));
	}
	if (total > 100) {
		var seq = id.split('___')[1];
		$('#perc_reateio___' + seq).focus();
		FLUIGC.toast({
			title: 'Valida&ccedil;&atilde;o: ',
			message: 'A soma dos percentuais ultrapassa 100%',
			type: 'warning',
			timeout: 'slow'
		});
		return false;
	}
	return true;

}

function exitObsArea(e) {
	if (e.keyCode == 9) {
		var r = confirm("Deseja adicionar um novo item?");
		if (r == true) {
			addLinha('itens_solic', 'field');
		}
		return false;
	}
	return true;
}

function fnCustomDelete(id, oElement) {

	if ($('#task').val() != 1 && $('#task').val() != 0 && $('#task').val() != 6) {
		return false;
	}
	
	/*console.log(oElement);
	var id2 = oElement.parent("input");
	console.log('id2 ',id2);
	console.log(oElement.parent("input:first"));
	var seq = id2.split('___')[1];
	console.log('DELECAO ',seq);
	console.log('DELECAO ',$('#integrou___'+seq).val());
	if ($('#integrou___'+seq).val()=='S') {
		FLUIGC.toast({
			title: 'Valida&ccedil;&atilde;o: ',
			message: 'Você não pode excluir um item já integrado!',
			type: 'warning',
			timeout: 'slow'
		});
		return false;
	}*/

	fnWdkRemoveChild(oElement);
}

function setTipo() {

	if ( $('#tipo') == '' || $('#empresa') == '' ) {
		return false;
	}

	$(".linha_dd").show();
	$(".titulo_rateio").show();
	$(".titulo_rateio").show();
	$(".linha_desp").show();
	$(".linha_pec").show();
	$(".docum_item").hide();
	$(".um_item").show();

	$(".den_item_item").show();

	$("#bt_rateio").show();

	$("#lb_projeto").css("color", "#595959");

	if ($('#tipo').val() == 'E' || $('#tipo').val() == 'M') {
		//$( ".linha_dd" ).hide();
		$(".titulo_rateio").hide();
		//$( ".titulo_rateio" ).hide();
		//$(".linha_desp").hide();
	} else if ($('#tipo').val() == 'D') {
		$(".linha_dd").hide();
		$(".titulo_rateio").hide();
		$(".linha_desp").hide();
	}

	if ($('#tipo').val() == 'D') {
		$("#lb_projeto").css("color", "red");
	} else {
		$("#lb_projeto").css("color", "#595959");
	}

	if ( ['T'].indexOf($('#tipo').val()) > -1 
	  || $("#ies_conta_item").val() == "S" ) {
		var qtd_rat = 0;
		$("input[name*=perc_reateio___]").each(function (index) {
			qtd_rat += 1;
		});
		if (qtd_rat == 0) {
			var seq = addLinha('rateio', 'auto');
			$("#perc_reateio___" + seq).val("100,00");
			$("#linha_btn_rat").hide();
			$(".linha_perc").hide();
		}
	}
	if ($("#regularizacao").val() == "S") {
		$(".regulariza").show();
		$(".nao_regulariza").hide();
	} else {
		$(".regulariza").hide();
		$(".nao_regulariza").show();
	}
}

function clearForm() {

	if ($('#tipo_c').val() != '') {
		if (!confirm('Deseja limpar o formulário?')) {
			$('#tipo').val($('#tipo_c').val());
			return false;
		}
	}

	$('#tipo_c').val($('#tipo').val());

	$('input[name], select[name], checkbox[name], textarea[name], img', $('#divPrincipal')).each(function () {

		if (!($(this).attr('name') == 'tipo'
			|| $(this).attr('name') == 'empresa'
			|| $(this).attr('name') == 'num_solic'
			|| $(this).attr('name') == 'data_abertura'
			|| $(this).attr('name') == 'data_entrega'
			|| $(this).attr('name') == 'nom_solicitante'
			|| $(this).attr('name') == 'matricula_solicitante'
			|| $(this).attr('name') == 'mail_solic'
			|| $(this).attr('name') == 'envia_anexo_compras'
			|| $(this).attr('name') == 'tipo_c')) {

			if ($(this).is('input') || $(this).is('textarea') || $(this).is('hidden')) {
				$(this).val('');
			}

			if ($(this).is('input') && $(this).attr('type') == 'zoom') {
				zoomDestino = window[$("#" + $(this).attr('name')).attr('filter-instance')];
				zoomDestino.removeAll();
			}
			if ($(this).is('input') && $(this).attr('name').indexOf('___') != -1) {
				fnWdkRemoveChild(this);
			}

			if ($(this).is(':checkbox')) {
				$(this).prop('checked', false);
			}

			if ($(this).is('select'))
				$(this).val('');
		}
	});

}

function setUpper() {

	$("textarea").keypress(function (e) {
		var chr = String.fromCharCode(e.which);
		console.log(e.target.type, chr);
		if ("\"ÃÂ´`|^<>".indexOf(chr) > 0) {
			console.log(' controle..... ', chr);
			return false;
		}
	});

}

function autoSize() {

	$('textarea').each(function () {
		$(this).on(
			'keyup input keypress keydown change',
			function (e) {
				var tamanhoMin = $(this).attr('rows')
					* $(this).css('line-height').replace(
						/[^0-9\.]+/g, '');
				$(this).css({
					'height': 'auto'
				});
				var novoTamanho = this.scrollHeight
					+ parseFloat($(this).css("borderTopWidth"))
					+ parseFloat($(this).css("borderBottomWidth"));
				if (tamanhoMin > novoTamanho)
					novoTamanho = tamanhoMin;
				$(this).css({
					'height': novoTamanho
				});
			}).css({
				'overflow': 'hidden',
				'resize': 'none'
			}).delay(0).show(0, function () {
				var el = $(this);
				setTimeout(function () {
					el.trigger('keyup');
				}, 100);
			});
	})
}

function setEventEnter() {
	$('input').on("keypress", function (e) {
		/* ENTER PRESSED*/
		if (e.keyCode == 13) {
			/* FOCUS ELEMENT */
			var inputs = $(this).parents("form").eq(0).find(":input");
			var idx = inputs.index(this);

			if (idx == inputs.length - 1) {
				inputs[0].select()
			} else {
				inputs[idx + 1].focus(); //  handles submit buttons
				inputs[idx + 1].select();
			}
			return false;
		}
	});
}

function getLinhaCampoPF(campo) {
	return campo.substring(campo.indexOf('___') + 3, campo.length);
}

function pad(number, length) {
	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}


function progEntrega(id) {
	
	if( $('#integrou___'+ id.split('___')[1] ).val() == "S" ){
		return false;
	}
	
	var fields = [{
		'field': 'dat_entrega_item',
		'titulo': 'Data Entrega',
		'type': 'date',
		'style': '',
		'class': 'form-control',
		'livre': '',
		'width': '50%'
	},
	{
		'field': 'qtd_entrega_item',
		'titulo': 'Quantidade',
		'type': 'tel',
		'style': 'text-align:right',
		'class': 'form-control',
		'precision': 3,
		'width': '50%'
	}];

	var seqLinhaEdit = $('#seq_item___' + id.split('___')[1] ).val( );
	var dados = [];
	$("input[name*=seq_item_pai___]").each(function (index) {
		seq = $(this).attr('name').split('___')[1];
		if ($('#seq_item_pai___' + seq).val() == seqLinhaEdit ) {
			reg = {
				'dat_entrega_item': $('#dat_entrega_item___' + seq).val(),
				'qtd_entrega_item': $('#qtd_entrega_item___' + seq).val()
			};
			dados.push(reg);
		}
	});
	if (dados.length == 0) {
		seq = $("#" + id).attr('name').split('___')[1];
		reg = {
			'dat_entrega_item': $('#data_entrega').val(),
			'qtd_entrega_item': $('#qtd_solic___' + seq).val()
		};
		dados.push(reg);
	}
	
	modalTable('modal_table_entrega', 'Programacao de Entrega', fields, dados, 'large', id, '', 'T');
}

function progVencimento(id) {
	
		
	var fields = [{
		'field': 'dat_vencimento_item',
		'titulo': 'Data Vencimento',
		'type': 'date',
		'style': '',
		'class': 'form-control',
		'livre': '',
		'width': '50%'
	}];


	var dados = [];
	$("input[name*=seq_item_pai_vencimento___]").each(function (index) {
		seq = $(this).attr('name').split('___')[1];
		console.log('seq.... ',seq);
		console.log('id....',id);
		//console.log('seq_item_pai_vencimento___ ',$("#" + id).attr('name').split('___')[1]);
		console.log('seq_item_pai_vencimento___1 ',$('#seq_item_pai_vencimento___'+seq).val());
		console.log('seq ',seq);
		console.log('seq_item_pai_vencimento___1 ',$('#dat_vencimento_item___'+seq).val());
		if ($('#seq_item_pai_vencimento___'+seq).val() == $(this).attr('name').split('___')[1]) {
		
			reg = {
				'dat_vencimento_item': $('#dat_vencimento_item___'+seq).val()
			};
			console.log('reg... ',reg);
			dados.push(reg);
		}
	});
	
	console.log('dados length ',dados);
	console.log('id ',id);
	console.log('seq ',$("#" + id).attr('name').split('___')[1]);
	if (dados.length == 0) {
		$("input[name*=seq_item_pai_vencimento___]").each(function (index) {
			seq = $(this).attr('name').split('___')[1];
		reg = {
			'dat_vencimento_item': $('#dat_vencimento_item___'+seq).val()
		};
		dados.push(reg);
		});
	}
	console.log('dados final ',dados);
	modalTable('modal_table_vencimento', 'Vencimentos', fields, dados, 'large', id, '', 'T');
}


function cotacaoItem(id){
	
	seq = id.split('___')[1];
	
	if( $('#integrou___'+seq ).val() == "S" ){
		return false;
	}
	
	var fields = [{'field':'designado',
		'titulo':'Sel.',
		'type':'checkbox',
		'style':'margin-top: 8px;padding-top: 0px;padding-bottom: 0px;',
		'class':'form-control unique-checkbox',
		'livre':'',
		'width':'5%',
	},{
		'field': 'cod_fornec_cotacao',
		'titulo': 'Codigo',
		'type': 'text',
		'style': '',
		'class': 'form-control',
		'livre': '',
		'width': '15%',
		'zoom': 'bt_fornec',
	},{
		'field': 'den_fornec_cotacao',
		'titulo': 'Fornecedor',
		'type': 'text',
		'style': '',
		'class': 'form-control',
		'livre': '',
		'width': '20%',
	},{
		'field': 'cotacao',
		'titulo': 'Cota&ccedil;&atilde;o',
		'type': 'tel',
		'style': 'text-align:right',
		'class': 'form-control',
		'precision': 3,
		'width': '10%'
	},{
		'field': 'observ_cotacao',
		'titulo': 'Observação',
		'type': 'text',
		'style': '',
		'class': 'form-control',
		'width': '50%'
	}];


	var dados = [];

	var seqLinhaEdit = $('#seq_item___' + id.split('___')[1] ).val( );
	var dados = [];
	$("input[name*=seq_item_cotacao_pai___]").each(function (index) {
		seq = $(this).attr('name').split('___')[1];
		if ( $(this).val() == seqLinhaEdit ) {
			reg = {
				'designado': $('#designado___' + seq).val(),
				'cod_fornec_cotacao': $('#cod_fornec_cotacao___' + seq).val(),
				'den_fornec_cotacao': $('#den_fornec_cotacao___' + seq).val(),
				'cotacao': $('#cotacao___' + seq).val(),
				'observ_cotacao': $('#observ_cotacao___' + seq).val()
			};
			dados.push(reg);
		}
	});
	
	
	if (dados.length == 0) {
		$("input[name*=cnpj_fornecedor___]").each(function (index) {
			seq = $(this).attr('name').split('___')[1];
			reg = {
				'cod_fornec_cotacao': $('#cod_fornecedor_sugerido___' + seq).val(),
				'den_fornec_cotacao': $('#nom_fornecedor___' + seq).val(),
			};
			dados.push(reg);
		});	
		
	}
	
	
	var denModal = $('#cod_item___'+seq).val()+' '+$('#den_item___'+seq).val()+' '+$('#cod_unid_med___'+seq).val()+' '+$('#qtd_solic___'+seq).val();
	modalTable('modal_table_cotacao', denModal, fields, dados, 'full', id, '', 'T');
	
	
}

function returnModalTable(retorno) {
	
	if( retorno.id == 'modal_itens_mail' ){
		for( var i = 0; i < retorno.dados.length; i++ ){
			if( retorno.dados[i].select == 'S' ){
				aItesSel.push(retorno.dados[i].seq_linha);
			}
		}
		sendMailSeq( retorno.idChave.split('___')[1] );
		return true;
	}
	
	if (retorno.id == 'modal_table_entrega') {
		seqOrig = retorno.idChave.split('___')[1];
		console.log('retorno ', retorno);
		
		var total = 0;
		$("input[name*=seq_item_pai___]").each(function (index) {
			if( $(this).val() == $( '#seq_item___'+seqOrig ).val() )
				fnWdkRemoveChild(this);
		});
	
		for (var i = 0; i < retorno.dados.length; i++) {
			var val = Math.round(parseFloat((retorno.dados[i].qtd_entrega_item).replace('.', '').replace(',', '.')) * 1000) / 1000;
			if (isNaN(val) || !isDate(retorno.dados[i].dat_entrega_item)) {
				$("input[name*=seq_item_pai___]").each(function (index) {
					if ($(this).val() == seqOrig)
						fnWdkRemoveChild(this);
				});
				FLUIGC.toast({
					title: 'Valida&ccedil;&atilde;o: ',
					message: 'Favor validar as programações informadas.',
					type: 'warning',
					timeout: 'slow'
				});
				$('#qtd_solic___' + seqOrig).attr('readonly', false);
				return false;
			}
			
			var seq = wdkAddChild('programacao_entrega_item');
			$('#seq_item_pai___' + seq).val( $( '#seq_item___'+seqOrig ).val() );
			$('#dat_entrega_item___' + seq).val(retorno.dados[i].dat_entrega_item);
			$('#qtd_entrega_item___' + seq).val(retorno.dados[i].qtd_entrega_item);

			total += val;
			
			//seqLinhaEdit = 0;
		}

		$('#qtd_solic___' + seqOrig).val(String((total).toFixed(3)).replace('.', ','));
		if (total > 0) {
			$('#qtd_solic___' + seqOrig).attr('readonly', true);
		} else {
			$('#qtd_solic___' + seqOrig).attr('readonly', false);
		}
		return true;
	}
	
	if (retorno.id == 'modal_table_vencimento') {
		//seqOrig = retorno.idChave.split('___')[1];
		console.log('retorno ', retorno);
		//console.log('seqorig ',retorno.idChave.split('___')[1]);
		$("input[name*=seq_item_pai_vencimento___]").each(function (index) {
			//if ($(this).val() == seqOrig)
				fnWdkRemoveChild(this);
		});
		//var total = 0;
		for (var i = 0; i < retorno.dados.length; i++) {
			//var val = Math.round(parseFloat((retorno.dados[i].qtd_entrega_item).replace('.', '').replace(',', '.')) * 1000) / 1000;
			/*if (isNaN(val) || !isDate(retorno.dados[i].dat_vencimento_item)) {
				*/
			/*$("input[name*=seq_item_pai_vencimento___]").each(function (index) {
					if ($(this).val() == seqOrig)
						fnWdkRemoveChild(this);
				});*/
				/*FLUIGC.toast({
					title: 'Valida&ccedil;&atilde;o: ',
					message: 'Favor validar os vencimentos!',
					type: 'warning',
					timeout: 'slow'
				});
				
				return false;
			}*/

			var seq = wdkAddChild('programacao_vencimento_item');
			console.log('seq adicao ',seq);
			$('#seq_item_pai_vencimento___' + seq).val(seq);
			console.log('seqt_item_adicao ',$('#seq_item_pai_vencimento___' + seq).val());
			$('#dat_vencimento_item___' + seq).val(retorno.dados[i].dat_vencimento_item);
			console.log('dat_vencimento_adicao',$('#dat_vencimento_item___' + seq).val());

			//total += val;
		}

		//$('#qtd_solic___' + seqOrig).val(String((total).toFixed(3)).replace('.', ','));
		//if (total > 0) {
		//	$('#qtd_solic___' + seqOrig).attr('readonly', true);
		//} else {
		//	$('#qtd_solic___' + seqOrig).attr('readonly', false);
		//}
		return true;
	}
	
	if (retorno.id == 'modal_table_cotacao') {
		seqOrig = retorno.idChave.split('___')[1];
		console.log('retorno ', retorno);
		
		var total = 0;
		$("input[name*=seq_item_cotacao_pai___]").each(function (index) {
			if( $(this).val() == $( '#seq_item___'+seqOrig ).val() )
				fnWdkRemoveChild(this);
		});
	
		for (var i = 0; i < retorno.dados.length; i++) {
			if( retorno.dados[i].designado == "S" ){
				var val = Math.round(parseFloat((retorno.dados[i].cotacao).replace('.', '').replace(',', '.')) * 1000) / 1000;
				if ( isNaN(val)
				  || retorno.dados[i].cod_fornec_cotacao.trim() == ""
				  || retorno.dados[i].den_fornec_cotacao.trim() == ""		
				) {
					$("input[name*=seq_item_cotacao_pai___]").each(function (index) {
						if ($(this).val() == seqOrig)
							fnWdkRemoveChild(this);
					});
					FLUIGC.toast({
						title: 'Valida&ccedil;&atilde;o: ',
						message: 'Favor validar as cotacões informadas.',
						type: 'warning',
						timeout: 'slow'
					});
					return false;
				}
			}
			
			var seq = wdkAddChild('cotacao_item');
			$('#seq_item_cotacao_pai___' + seq).val( $( '#seq_item___'+seqOrig ).val() );
			$('#designado___' + seq).val(retorno.dados[i].designado);
			$('#cod_fornec_cotacao___' + seq).val(retorno.dados[i].cod_fornec_cotacao);
			$('#den_fornec_cotacao___' + seq).val(retorno.dados[i].den_fornec_cotacao);
			$('#cotacao___' + seq).val(retorno.dados[i].cotacao);
			$('#observ_cotacao___' + seq).val(retorno.dados[i].observ_cotacao);
		}

		return true;

	}
	
	return false;
}


var beforeSendValidate = function (numState, nextState) {

	if ($('#task').val() == '6' || $('#task').val() == '1' || $('#task').val() == '0') {

		var hoje = new Date();
		var data7 = dataAtualFormatada(new Date(hoje.getTime() + (1 * 24 * 60 * 60 * 1000))).split('/').reverse().join('');
		
		var data = $('#data_entrega').val().split('/').reverse().join('');

		if (data < data7 && $('#regularizacao').val() != 'S') {
			alert('Data de entrega inferior a 1 dia!');
			return false;
		}

	}
	
	if ($('#regularizacao').val() == 'S') {

		var hoje = new Date();
		var data_completa = new Date(hoje.getTime() + (4 * 24 * 60 * 60 * 1000));
		console.log('data_completa ',data_completa);
		console.log(data_completa.toString().substring(0,3));
		var dia_semana = data_completa.toString().substring(0,3);
		var data4 = dataAtualFormatada(new Date(hoje.getTime() + (4 * 24 * 60 * 60 * 1000))).split('/').reverse().join('');
		console.log('Entrou no primeiro ',data4);
		console.log('Entrou no dia_semana ',dia_semana);
				
		var now = new Date(); // Data de hoje
		var future = new Date($('#data_vencimento').val().split('/').reverse().join('-')); // Outra data no passado
		var diff = Math.abs(future.getTime() - now.getTime()); // Subtrai uma data pela outra
		var days = Math.ceil(diff / (1000 * 60 * 60 * 24)); // Divide o total pelo total de milisegundos correspondentes a 1 dia. (1000 milisegundos = 1 segundo).

		// Mostra a diferença em dias
		console.log('Diferenca entre dias ', days, ' dias');

		var temfinaldesemana = 'N';
		for (var x = 1; x < days; x++) {
			var minhadata = new Date(hoje.getTime() + (x * 24 * 60 * 60 * 1000));
			console.log('minhadata ',minhadata);
			console.log('minhadata.getDay() ',minhadata.getDay());
			if ( minhadata.getDay() == '6' || minhadata.getDay() =='0' ){
				temfinaldesemana = 'S';
			}
			console.log(temfinaldesemana);
		}
		if (temfinaldesemana == 'S'){
			var data4 = dataAtualFormatada(new Date(hoje.getTime() + (6 * 24 * 60 * 60 * 1000))).split('/').reverse().join('');
		}
		
		var data = $('#data_vencimento').val().split('/').reverse().join('');

		if (data < data4 ) {
			alert('Data de vencimento inferior a 4 dias!');
			$('#aprova_financeiro').val('S');
			
		} else {
			$('#aprova_financeiro').val('N');
		}

	}

	if ($('#tipo').val() == 'D' && $('#data_abertura').val() == $('#data_entrega').val()) {
		if (!confirm('Data de entrega igual a data de abertura, deseja continuar?')) {
			return false;
		}
	}

	if ($('#task').val() != 1 && $('#task').val() != 0 && $('#task').val() != 6) {
		return true;
	}

	var msg = "";
	
	if ($('#regularizacao').val() == 'S' && $('#cod_fornecedor').val() =='') {
		msg += " Fornecedor,";
	}
	if ($('#regularizacao').val() == 'S' && $('#numero_nf').val() =='') {
		msg += " Numero NF,";
	}
	if ($('#regularizacao').val() == 'S' && $('#data_vencimento').val() =='') {
		msg += " Vencimento,";
	}
	
	
			
	if ($('#regularizacao').val() == 'S' && $('#des_cnd_pgto').val() =='') {
		msg += " Condicao de Pagamento,";
	}
	
	if ($('#regularizacao').val() == 'S' && $('#nom_comprador').val() =='') {
		msg += " Comprador,";
	}
	
	if ($('#empresa').val() == '') {
		msg += " Empresa,";
	}

	if ($('#tipo').val() == '') {
		msg += " Tipo de Compra,";
	}

	if ($('#data_entrega').val() == '') {
		msg += " Data de Entrega,";
	}

	if ($('#tipo').val() == 'D' && $('#projeto').val() == '') {
		msg += " Projeto,";
	} else if ($('#tipo').val() == 'D' && $('#projeto').val() != '') {
		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint("cod_empresa", $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("num_pedido", $('#projeto').val(), $('#projeto').val(), ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cod_respon", "", "", ConstraintType.MUST_NOT));
		var projetos = DatasetFactory.getDataset("projeto", null, constraints, null);
		console.log('projetos....', projetos);
		if (projetos.values.length == 0) {
			alert('Responsavel do projeto n&atilde;o configurado no Fluig!');
			$('#projeto').focus();
			return false;
		}
	}
	
	//armazenado a descricao
	var qtd_texto;
	var valor_texto;
	var desc_texto;
	var texto_linha  = '';
	var texto_completo = '';
	$('#texto_completo').val('');
	$("input[name*=qtd_solic___]").each(function (index) {
		var seqOrig = $(this).attr('name').split('___')[1];
		console.log('Quantidade item....,', seqOrig, $('#qtd_solic___' + seqOrig).val());
		if ($('#qtd_solic___' + seqOrig).val() != "" && $('#qtd_solic___' + seqOrig).val() != 'undefined') {
			qtd_texto = $('#qtd_solic___' + seqOrig).val();
			desc_texto = $('#texto_ped_cotacao___' + seqOrig).val();
			valor_texto = $('#preco_est___' + seqOrig).val();
		}
		texto_linha = desc_texto + ' Qtd: ' + qtd_texto + ' Total: ' + valor_texto + ' \n ';
		texto_completo += texto_linha;
		
	});
	$("input[name*=cod_cc___]").each(function (index) {
		var seqOrig = $(this).attr('name').split('___')[1];
		console.log('Quantidade item....,', seqOrig, $('#qtd_solic___' + seqOrig).val());
		if ($('#qtd_solic___' + seqOrig).val() != "" && $('#qtd_solic___' + seqOrig).val() != 'undefined') {
			qtd_texto = $('#cod_cc___' + seqOrig).val();
			desc_texto = $('#den_cc___' + seqOrig).val();
			valor_texto = $('#perc_reateio___' + seqOrig).val();
		}
		texto_linha = qtd_texto + ' - ' + desc_texto + ' Perc.: ' + valor_texto + ' \n ';
		texto_completo += texto_linha;
		
	});
	
	
	$('#texto_completo').val(texto_completo.substring(0,1000));
	//finaliza o armazenamento da descricao

	var qtdVazio = 0;
	var itemVazio = 0;
	var docOrigVazioItem = 0;
    var precoEstimado = 0;


	var qtd = 0;
	$("input[name*=qtd_solic___]").each(function (index) {
		qtd += 1;
		var seqOrig = $(this).attr('name').split('___')[1];
		console.log('Quantidade item....,', seqOrig, $('#qtd_solic___' + seqOrig).val());
		if ($('#qtd_solic___' + seqOrig).val() == "") {
			qtdVazio += 1;
		}
		if ($('#cod_item___' + seqOrig).val() == "") {
			itemVazio += 1;
		}
		if ($('#doc_origem_item___' + seqOrig).val() == "") {
			docOrigVazioItem += 1;
		}
		if ($('#preco_est___' + seqOrig).val() == "" || parseFloat($('#preco_est___' + seqOrig).val().replace('.','').replace(',','.')) == 0 || parseFloat($('#preco_est___' + seqOrig).val().replace('.','').replace(',','.')) == null 
				|| $('#preco_est___' + seqOrig).val() == "NaN") {
			precoEstimado += 1;
		}
		
		
	});
	
	if (qtd == 0) {
		msg += " Itens,";
	}

	var percRatVazio = 0;
	var codCCVazio = 0;
	var codAEN = 0;
	var codUniFunVazio = 0;
	var numContaVazio = 0;
	var docOrigVazio = 0

	var qtd = 0;
	$("input[name*=perc_reateio___]").each(function (index) {
		qtd += 1;
		var seqOrig = $(this).attr('name').split('___')[1];
		if ($('#perc_reateio___' + seqOrig).val() == "") {
			qtdVazio += 1;
		}
		if ($('#doc_origem___' + seqOrig).val() == "") {
			docOrigVazio += 1;
		}
		if ($('#cod_cc___' + seqOrig).val() == "") {
			codCCVazio += 1;
		}
		if ($('#cod_aen___' + seqOrig).val() == "") {
			codAEN += 1;
		}
		if ($('#cod_unid_func___' + seqOrig).val() == "") {
			codUniFunVazio += 1;
		}
		if ($('#num_conta___' + seqOrig).val() == "") {
			numContaVazio += 1;
		}
	});

	if ($('#tipo').val() != 'D' && $('#tipo').val() != 'E' && $('#tipo').val() != 'M' && qtd == 0 && $('#ies_simples_cotacao').val()!='S') {
		msg += " Rateios,";
	}

	if (msg != "") {
		/*FLUIGC.toast({
			title: 'Validacao: ',
			message: 'Informacoes Faltantes: '+msg.substring( 0, msg.length - 1 ),
			type: 'warning',
			timeout: 'slow'
		});
		*/
		alert('Informacoes Faltantes: ' + msg.substring(0, msg.length - 1));
		return false;
	}

	console.log('Quantidade....', qtdVazio, itemVazio);
	msg = "";
	if (qtdVazio > 0) {
		msg += " Quantidade,";
	}
	if (docOrigVazioItem > 0 && docOrigVazio == 'T') {
		msg += " Quantidade,";
	}
	if (precoEstimado > 0 && $('#ies_simples_cotacao').val()!='S') {
		msg += "Preço Estimado,";
	}

	if (itemVazio > 0) {
		msg += " Item,";
	}
	if (msg != "") {
		FLUIGC.toast({
			title: 'Validacaoo: ',
			message: 'Informacoes de Item Faltantes: ' + msg.substring(0, msg.length - 1),
			type: 'warning',
			timeout: 'slow'
		});
		alert('Informacoes de Item Faltantes: ' + msg.substring(0, msg.length - 1));
		return false;
	}

	console.log('Quantidade....', percRatVazio, docOrigVazio, codCCVazio, codUniFunVazio, numContaVazio);
	msg = "";
	if (percRatVazio > 0) {
		msg += " Perc Rateio,";
	}
	if (docOrigVazio > 0 && $.inArray($('#tipo').val(), ['P', 'O', 'S']) > -1) {
		msg += " Documento,";
	}
	if (codCCVazio > 0 && $.inArray($('#tipo').val(), ['N', 'P', 'A', 'T']) > -1) {
		msg += " Centro de Custo,";
	}
	if (codAEN > 0 && $('#tipo').val() !='E' ) {
		msg += " AEN,";
	}
	if (codUniFunVazio > 0 && $.inArray($('#tipo').val(), ['N', 'P', 'A', 'O', 'T']) > -1) {
		msg += " Unidade Funcional,";
	}
	if (numContaVazio > 0 && ($.inArray($('#tipo').val(), ['A']) > -1 || $('#conta').val() != "")) {
		msg += " Conta,";
	}
		
	
	if (msg != "") {
		/*FLUIGC.toast({
			title: 'ValidaÃÂÃÂ§ÃÂÃÂ£o: ',
			message: 'InformaÃÂÃÂ§ÃÂÃÂµes de Rateio Faltantes: '+msg.substring( 0, msg.length - 1 ),
			type: 'warning',
			timeout: 'slow'
		});*/
		alert('Informacoes de Rateio Faltantes: ' + msg.substring(0, msg.length - 1));
		return false;
	}

	if ($('#tipo').val() != 'D' && $('#tipo').val() != 'E' && $('#tipo').val() != 'M' && $('#ies_simples_cotacao').val() != 'S') {
		var total = 0.00;
		$("input[name*=perc_reateio___]").each(function (index) {
			total += Math.round(parseFloat($(this).val().replace('.', '').replace(',', '.')) * 1000) / 1000;
		});

		total = Math.round(total * 1000) / 1000;
		if (total != 100) {
			/*FLUIGC.toast({
				title: 'ValidaÃÂÃÂ§ÃÂÃÂ£o: ',
				message: 'Total de rateio diferente de 100%',
				type: 'warning',
				timeout: 'slow'
			});*/
			alert('Total de rateio diferente de 100%');
			return false;
		}
	}

	if ($.inArray($('#tipo').val(), ['N', 'P', 'A', 'T']) > -1) {
		console.log('Entrei IF validaConta()');
		return validaConta();
	}
	
	if ($('#tipo').val() == 'O' ) {
		var saldototal = 0.00;
		$("input[name*=saldo_os_rat___]").each(function (index) {
			saldototal = Math.round(parseFloat($(this).val().replace('.', '').replace(',', '.')) * 1000) / 1000;
			if (saldototal < 0 ) {
				$('#tem_os_negativa').val("S");
			} 
		});
	}


	return true;
}

function maiuscula(z) {
	v = z.value.toUpperCase();
	z.value = v;
}

function calcPerc(id) {

	console.log('Retorno.... ID', id);

	var seqOrig = id.split('___')[1];

	if ($('#num_lote_nf___' + seqOrig).val() == '') {
		return false;
	}

	var quantidade = 0;
	$("input[name*=qtd_solic___]").each(function (index) {
		if ($(this).val() != "") {
			quantidade = $(this).val();
			return;
		}
	});

	if (quantidade != "") {
		html = ' <div class="row row_table" id="promp_modal"> ' +
			'		<div class="col-sm-6 pd_her"> ' +
			'				<label for="exampleTag">Qtd. Total</label> ' +
			'				<input type="tel" class="form-control" name="qtd_total" id="qtd_total" style="text-align:right" value="' + quantidade + '" /> ' +
			'			</div> ' +
			'			<div class="col-sm-6 pd_her"> ' +
			'				<label for="exampleTag">Qtd. Parcial</label> ' +
			'				<input type="tel" class="form-control" name="qtd_parcial" id="qtd_parcial" style="text-align:right" value=""/> ' +
			'			</div> ' +
			'		</div> ';

		var myModal = FLUIGC.modal({
			title: 'Calculadora',
			content: html,
			id: 'fluig-modal',
			size: 'small',
			actions: [{
				'label': 'Calcular',
				'bind': 'data-open-modal',
				'classType': 'calcula',
				'autoClose': true
			}, {
				'label': 'Cancelar',
				'autoClose': true
			}]
		}, function (err, data) {
			if (err) {
				// do error handling
			} else {
				$('#qtd_total').maskMoney({ precision: 3, thousands: '.', decimal: ',' });
				$('#qtd_parcial').maskMoney({ precision: 3, thousands: '.', decimal: ',' });
				setTimeout("$('#qtd_parcial').focus();", 1);
				// do something with data

				$('.calcula').click(function () {

					var qtd_total = isNull(Math.round(parseFloat($('#qtd_total').val().replace('.', '').replace(',', '.')) * 1000) / 1000, 0);
					var qtd_parcial = isNull(Math.round(parseFloat($('#qtd_parcial').val().replace('.', '').replace(',', '.')) * 1000) / 1000, 0);
					if (qtd_total > 0) {

						perc_calc = qtd_parcial / qtd_total * 100;

						$('#perc_reateio___' + seqOrig).val(String((perc_calc).toFixed(2)).replace('.', ','));

						var total = 0.00;
						$("input[name*=perc_reateio___]").each(function (index) {
							total += isNull(Math.round(parseFloat($(this).val().replace('.', '').replace(',', '.')) * 1000) / 1000, 0);
						});

						if (total > 100) {

							console.log(' entrei maior que 100 ', total);

							FLUIGC.toast({
								title: 'Validacao: ',
								message: 'Total do rateio maior que 100%',
								type: 'warning',
								timeout: 'slow'
							});

							$('#perc_reateio___' + seqOrig).val(String((100 - (total - perc_calc)).toFixed(2)).replace('.', ','));

							setTimeout("$('#perc_reateio___	" + seqOrig + "').focus();", 1);

							console.log(' depois focus......');
						}
					}
				});
			}
		});
	}
}

function isNull(valor, padrao) {
	if (isNaN(valor)) {
		return padrao;
	} else {
		return valor;
	}
}

function bloqCampos() {

	$("input[name*=qtd_solic___]").each(function (index) {
		console.log('Bloque campos....');
		var seq = $(this).attr('name').split('___')[1];
		console.log('Seq campos....', seq);
		$(this).maskMoney({ precision: 3, thousands: '.', decimal: ',' });
		$('#preco_unit___' + seq).maskMoney({ precision: 3, thousands: '.', decimal: ',' });


		var campo = this;
		$("input[name*=seq_item_pai___]").each(function (index) {
			if ($(this).val() == seq) {
				$(campo).attr('readonly', true);
			}
		});

	});

	$("input[name*=perc_reateio___]").each(function (index) {
		$(this).maskMoney({ precision: 3, thousands: '.', decimal: ',' });

		var seq = $(this).attr('name').split('___')[1];

		if (['N'].indexOf($('#tipo').val()) > -1) {
			$('#doc_origem___' + seq).prop('readonly', true);
		}
		if (['N', 'P', 'O', 'S', 'T'].indexOf($('#tipo').val()) > -1 && $('#conta').val() == "") {
			$('#num_conta___' + seq).prop('readonly', true);
		}
		if (['S'].indexOf($('#tipo').val()) > -1) {
			$('#cod_unid_func___' + seq).prop('readonly', true);
		}
		if (['O', 'S'].indexOf($('#tipo').val()) > -1) {
			$('#cod_cc___' + seq).prop('readonly', true);
		}
	})
}


function calcTotalItem(id) {
	var seq = id.split('___')[1];
	var total = isNull(Math.round(parseFloat($('#preco_unit___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0)
		* isNull(Math.round(parseFloat($('#qtd_solic___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	$('#preco_total___' + seq).val(String(total.toFixed(2)).replace('.', ','));
	$('#preco_est___' + seq).val(String(total.toFixed(2)).replace('.', ','));

	var total_geral = 0;
	$("input[name*=preco_total___]").each(function (index) {
		total_geral += isNull(Math.round(parseFloat($(this).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	})

	$('#total_geral').val(String(total_geral.toFixed(2)).replace('.', ','));
	$('#total_geral_est').val(String(total_geral.toFixed(2)).replace('.', ','));


}

function guardaEstimadoOriginal(id) {
	var seq = id.split('___')[1];
	var original = isNull(Math.round(parseFloat($('#preco_est___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	if (original != 0 && original != null) {
		$('#preco_est_ori___' + seq).val(converteMoeda(original));
		
	}	
}

function calcTotalItemEstimado(id) {
	var seq = id.split('___')[1];
	var total = isNull(Math.round(parseFloat($('#preco_est___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	console.log('quantidade de linhas ',contaLinhasTabela('rateio'));
	//if (contaLinhasTabela('rateio')>2 && $('#preco_est___' + seq).val() != $('#preco_est_ori___' + seq).val() && $('#tipo').val() == 'O') {
		if ($('#tipo').val() == 'O' && $('#task').val() != '41' && contaLinhasTabela('rateio')>2 && $('#preco_est___' + seq).val() != $('#preco_est_ori___' + seq).val()) {
		FLUIGC.toast({
			title: 'Preenchimento: ',
			message: 'Para alterar os valores estimados o rateio deve ser excluido! ',
			type: 'warning',
			timeout: 'slow'
		});
		$('#preco_est___' + seq).val($('#preco_est_ori___' + seq).val());
		return 0;
		}
	 else {
	
		console.log('entrou no else!!!!');
			/* isNull(Math.round(parseFloat($('#qtd_solic___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);*/
		$('#total_geral_est' + seq).val(String(total.toFixed(2)).replace('.', ','));
	
		var total_geral = 0;
		$("input[name*=preco_est___]").each(function (index) {
			total_geral += isNull(Math.round(parseFloat($(this).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
		})
	
		$('#total_geral_est').val(String(total_geral.toFixed(2)).replace('.', ','));
		}
		
		if ($('#tipo').val() == 'O' && $('#task').val() == '41') {
			$("input[name^=saldo_os_rat___]").each(function (index) {
				var seq = $(this).attr('id').split('___')[1];
				calcSaldoOSposOC($(this).attr('id'));
			});
		}
	//}
	
	//valida se a tolerancia informada no tipo de solicitacao é menor que a alteracao de valor informada pelo compras na alteracao
	if ($('#task').val() == '41') {
		var valor_original = isNull(Math.round(parseFloat($('#preco_est_ori___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0); 
		var tolerancia = isNull(Math.round(parseFloat($('#perc_tolerancia').val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0); 
		var novo_valor = isNull(Math.round(parseFloat($('#preco_est___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
		
		if ( ((novo_valor/(valor_original/100))-100) > tolerancia ) {
			$('#maior_que_tolerancia___'+seq).val('S');
		}
	}
}

function calcSaldoOSposOC(id) {
	if ($('#tipo').val() == 'O') {
	var seq = id.split('___')[1];
	var totalest = $('#total_geral_est').val();
	var percentual = isNull((parseFloat($('#perc_reateio___' + seq).val())),0);
	var saldoOS = isNull(Math.round(parseFloat($('#saldo_os___' + seq).val().replace('.', '').replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	console.log('Seq campos....', seq);
	console.log('Total Estimado....', totalest);
	console.log('Percentual....', percentual);
	console.log('Saldo OS....', saldoOS);
	var saldocalculado = 0;
	
	saldocalculado = saldoOS-((parseFloat(totalest)/100)*percentual);

	$('#saldo_os_rat___'+seq).val(String(saldocalculado.toFixed(2)).replace('.', ','));
	
	
	} else {
		$('#saldo_os_rat___'+seq).val(0);
	}

}

function validaData(id) {

	dataTxt = $('#' + id).val();

	if (!isDate(dataTxt)) {
		setTimeout("$('#" + id + "').focus();", 1);
	}

}


function isDate(txtDate) {
	var currVal = txtDate;
	if (currVal == '')
		return false;

	//Declare Regex  
	var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
	var dtArray = currVal.match(rxDatePattern); // is format OK?

	if (dtArray == null)
		return false;

	//Checks for dd/mm/yyyy format.
	var dtDay = dtArray[1];
	var dtMonth = dtArray[3];
	var dtYear = dtArray[5];

	if (dtMonth < 1 || dtMonth > 12)
		return false;
	else if (dtDay < 1 || dtDay > 31)
		return false;
	else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
		return false;
	else if (dtMonth == 2) {
		var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
		if (dtDay > 29 || (dtDay == 29 && !isleap))
			return false;
	}

	return true;
}


function detalheCotacao(id) {

	//seq = id.split('___')[1];

	var html = "<table width='100%' id='consulta_cotacoes' >"+
			" <tr> " +
			"	<td width='10%' > " +
			"	  Cod Item " +
			"	</td> " +
			"	<td width='30%' > " +
			"	  Item " +
			"	</td> " +
			"	<td width='5%' > " +
			"	  UM " +
			"	</td> " +
			"	<td width='5%' > " +
			"	   Sel." +
			"	</td> " +
			"	<td width='30%' > " +
			"	  Fornecedor " +
			"	</td> " +
			"	<td width='20%' > " +
			"	  Preço " +
			"	</td>" +
			" </tr> " ;

	$("input[name^=seq_item___]").each(function (index) {
		var seqRow = $(this).attr('id').split('___')[1];
		var seqItem = $(this).val();
			var achou = false;
			$("input[name^=seq_item_cotacao_pai___]").each(function (index) {
				var seqCod = $(this).attr('id').split('___')[1];

				if( $('#seq_item___'+seqRow).val() == $('#seq_item_cotacao_pai___'+seqCod).val()
				 && $('#designado___'+seqCod).val() == "S" ){
					achou = true;
					html += " <tr> " +
							"	<td> " +
								$('#cod_item___'+seqRow).val() +
							"	</td> " +
							"	<td> " +
								$('#den_item___'+seqRow).val() +
							"	</td> " +
							"	<td> " +
								$('#cod_unid_med___'+seqRow).val() +
							"	</td> " +
							"	<td> " +
								$('#designado___'+seqCod).val() +
							"	</td> " +
							"	<td> " +
								$('#den_fornec_cotacao___'+seqCod).val() +
							"	</td> " +
							"	<td> " +
								$('#cotacao___'+seqCod).val() +
							"	</td>" +
							" </tr> " ;
				}
			});
			if( !achou ){
				html += " <tr> " +
						"	<td> " +
							$('#cod_item___'+seqRow).val() +
						"	</td> " +
						"	<td> " +
							$('#den_item___'+seqRow).val() +
						"	</td> " +
						"	<td> " +
							$('#cod_unid_med___'+seqRow).val() +
						"	</td> " +
						"	<td> " +
						"	</td> " +
						"	<td> " +
						"	</td> " +
						"	<td> " +
						"	</td>" +
						" </tr> " ;
			}
	});
	html += " </table> ";
	

	var myModal = FLUIGC.modal({
		title: "Cotação",
		content: html,
		id: 'fluig-modal',
		size: 'full',
		actions: [{
			'label': 'Exportar',
			'classType': 'save',
			'autoClose': true
		},{
			'label': 'Fechar',
			'autoClose': true
		}]
	}, function (err, data) {
		if (err) {

		} else {
			parent.$('#workflowview-header').hide();
			//$(".modal-body").css("max-height", "380px");
			autoSize();
			
			
			$('.save').click(function() {
								 
				var fileName = "cotacao_"+parent.WCMAPI.getUserLogin()+'_'+$.now(); 
				
				$("#consulta_cotacoes").btechco_excelexport({
							containerid: "consulta_cotacoes",
							datatype: $datatype.Table,
							returnUri: true,
							filename: fileName
				});
			});
			
		}
	});

	/*$("input[name*=seq_item_cotacao_pai___]").each(function (index) {
		if ($(this).val() == seqOrig)
			fnWdkRemoveChild(this);
	});*/
	
}

function detalheItem(id) {

	seq = id.split('___')[1];

	html = '<div id="modal-consulta" style="max-height: 380px; overflow: auto; margin: 0px auto;" >';
	// Estoque

	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint('dataBase', 'java:/jdbc/LogixPRD', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('table', 'fluig_v_estoque_local', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('sqlLimit', '250', null, ConstraintType.MUST));

	constraints.push(DatasetFactory.createConstraint('cod_empresa', $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('cod_item', $('#cod_item___' + seq).val(), $('#cod_item___' + seq).val(), ConstraintType.MUST));
	//constraints.push( DatasetFactory.createConstraint('num_versao', $('#num_versao___'+seq).val(), $('#num_versao___'+seq).val(), ConstraintType.MUST) );

	var fields = new Array('cod_local', /*'num_lote',*/ 'ies_situa_qtd', 'qtd_saldo');

	var order = new Array('cod_local'/*, 'num_lote'*/);

	console.log('Selec...... 003');

	//Busca o dataset
	var dataset = DatasetFactory.getDataset('selectTable', fields, constraints, order);

	console.log('Selec...... 004', dataset.values.length);

	for (var x = 0; x < dataset.values.length; x++) {

		var reg = dataset.values[x];
		console.log('Selec...... 005', reg);
		var visible = '';
		if (x > 0) {
			visible = 'style="visibility: hidden; height: 0px; width: 0px;"';
		}
		var color = '';
		if (x % 2 == 0) {
			color = 'style="background-color: #FFFAFA"';
		}
		html += ' <div ' + color + ' >' +
			'	<div class="row row_table" > ' +
			'		<div class="col-sm-2 pd_her"> ' +
			'			<label for="exampleTag" ' + visible + '>Local</label> ' +
			'			<input type="text" class="form-control" name="local" id="local" readonly value="' + dataset.values[x]['cod_local'] + '" /> ' +
			'		</div> ' +
			/*'		<div class="col-sm-2 pd_her"> '+
			'			<label for="exampleTag" '+visible+'>Lote</label> '+
			'			<input type="text" class="form-control" name="lote" id="lote" readonly value="'+ dataset.values[x][ 'num_lote' ] +'" /> '+
			'		</div> '+*/
			'		<div class="col-sm-1 pd_her"> ' +
			'			<label for="exampleTag" ' + visible + '>Situa</label> ' +
			'			<input type="text" class="form-control" name="lote" id="lote" readonly value="' + dataset.values[x]['ies_situa_qtd'] + '" /> ' +
			'		</div> ' +
			'		<div class="col-sm-2 pd_her"> ' +
			'			<label for="exampleTag" ' + visible + '>Quantidade</label> ' +
			'			<input type="text" class="form-control" name="quantidade" id="quantidade" style="text-align: right;" readonly value="' + frmNumber(getFloat(dataset.values[x]['qtd_saldo'], 0), 3) + '" /> ' +
			'		</div> ' +
			'	</div> ' +
			'</div> ';

	}

	// OCs

	html += '<div>';// class="row row_table" id="promp_modal"> '

	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint('dataBase', 'java:/jdbc/LogixPRD', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('table', 'fluig_v_ordem', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('sqlLimit', '10', null, ConstraintType.MUST));

	constraints.push(DatasetFactory.createConstraint('cod_empresa', $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('cod_item', $('#cod_item___' + seq).val(), $('#cod_item___' + seq).val(), ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('___in___ies_situa_oc', 'R|A', null, ConstraintType.MUST));
	//constraints.push( DatasetFactory.createConstraint('num_versao', $('#num_versao___'+seq).val(), $('#num_versao___'+seq).val(), ConstraintType.MUST) );


	var fields = new Array('num_oc', 'tipo_compra', 'raz_social', 'dat_emis_ped', 'tex_observ_oc_item', 'nom_funcio_solicei', 'status', 'qtd_solic', 'den_situa_oc', 'dat_entrega_prev', 'num_docum', 'tex_observ_oc_item', 'raz_social');

	var order = new Array('num_oc desc');

	console.log('Selec...... 003');

	//Busca o dataset
	var dataset = DatasetFactory.getDataset('selectTable', fields, constraints, order);

	console.log('Selec...... 004', dataset.values.length);



	for (var x = 0; x < dataset.values.length; x++) {

		var reg = dataset.values[x];
		console.log('Selec...... 005', reg);
		var visible = '';
		if (x > 0) {
			visible = 'style="visibility: hidden; height: 0px; width: 0px;"';
		}
		var color = '';
		if (x % 2 == 0) {
			color = 'style="background-color: #FFFAFA"';
		}
		html += ' <div ' + color + ' >' +
			'	<div class="row row_table" > ' +
			'		<div class="col-sm-1 pd_her"> ' +
			'			<label for="exampleTag" ' + visible + '>OC</label> ' +
			'			<input type="text" class="form-control" name="oc" id="oc" readonly value="' + dataset.values[x]['num_oc'] + '" /> ' +
			'		</div> ' +
			'		<div class="col-sm-1 pd_her"> ' +
			'			<label for="exampleTag" ' + visible + '>Tipo</label> ' +
			'			<input type="text" class="form-control" name="tipo" id="tipo" readonly value="' + dataset.values[x]['tipo_compra'] + '" /> ' +
			'		</div> ' +
			'		<div class="col-sm-1 pd_her"> ' +
			'			<label for="exampleTag" ' + visible + '>Situacao</label> ' +
			'			<input type="text" class="form-control" name="status" id="status" readonly value="' + dataset.values[x]['den_situa_oc'] + '" /> ' +
			'		</div> ' +
			'		<div class="col-sm-2 pd_her"> ' +
			'			<label for="exampleTag" ' + visible + '>Solicitante</label> ' +
			'			<input type="text" class="form-control" name="solicitante" id="solicitante" readonly value="' + dataset.values[x]['nom_funcio_solicei'] + '" /> ' +
			'		</div> ' +
			'		<div class="col-sm-3 pd_her"> ' +
			'			<div class="col-sm-6 pd_her"> ' +
			'				<label for="exampleTag" ' + visible + '>Quantidade</label> ' +
			'				<input type="text" class="form-control" name="quantidade" id="quantidade" readonly style="text-align: right;" value="' + frmNumber(getFloat(dataset.values[x]['qtd_solic'], 0), 3) + '" /> ' +
			'			</div> ' +
			'			<div class="col-sm-6 pd_her"> ' +
			'				<label for="exampleTag" ' + visible + '>Entrega</label> ' +
			'				<input type="text" class="form-control" name="data_entrega" id="data_entrega" readonly value="' + dateToDMY(dataset.values[x]['dat_entrega_prev']) + '" /> ' +
			'			</div> ' +
			'		</div> ' +
			'		<div class="col-sm-1 pd_her"> ' +
			'			<label for="exampleTag" ' + visible + '>Projeto</label> ' +
			'			<input type="text" class="form-control" name="projeto" id="projeto" readonly value="' + dataset.values[x]['num_docum'] + '" /> ' +
			'		</div> ' +
			'		<div class="col-sm-3 pd_her"> ' +
			'			<label for="exampleTag" ' + visible + '>Fornecedor</label> ' +
			'			<input type="text" class="form-control" name="fornecedor" id="fornecedor" readonly value="' + dataset.values[x]['raz_social'] + '" /> ' +
			'		</div> ' +
			'   </div> ' +
			'   <div class="row row_table" ' + color + '> ' +
			'		<div class="col-sm-12 pd_her"> ' +
			'			<label for="exampleTag" ' + visible + '>Observacoes</label> ' +
			'			<textarea class="form-control" name="obs" id="obss" rows="1" readonly >' + dataset.values[x]['tex_observ_oc_item'] + ' </textarea> ' +
			'		</div> ' +
			'	</div> ' +
			'</div> ';

	}
	html += ' </div> ' +
		'</div> ';

	// FIM RATEIO	

	// COTACAO
	/*	
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/LogixDS', null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('table', 'fluig_v_cot_oc', null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('sqlLimit', '600', null, ConstraintType.MUST) );
							
		constraints.push( DatasetFactory.createConstraint('cod_empresa', $('#cod_empresa').val(), $('#cod_empresa').val(), ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('num_oc', $('#num_oc___'+seq).val(), $('#num_oc___'+seq).val(), ConstraintType.MUST) );
		//constraints.push( DatasetFactory.createConstraint('num_versao', $('#num_versao___'+seq).val(), $('#num_versao___'+seq).val(), ConstraintType.MUST) );
						
		var fields = new Array('cod_empresa', 'num_oc', 'num_versao', 'num_cotacao', 'num_cotacao_ord', 'cod_fornecedor', 'nom_fornecedor', 'dat_entrega', 'cnd_pgto', 'des_cnd_pgto', 'cod_mod_embar', 'den_mod_embar', 'pre_unit_base', 'val_ipi', 'val_icms');
						
		var order = new Array( 'num_cotacao_ord' );
						
		console.log( 'Selec...... 003' );
						
		//Busca o dataset
		var dataset = DatasetFactory.getDataset('selectTable', fields, constraints, order);
								
		console.log( 'Selec...... 004',dataset.values.length );
		
		html +=	' <div> ';
		
		for (var x = 0; x < dataset.values.length; x++) {
			
			var reg = dataset.values[x];
			console.log( 'Selec...... 005',reg );
			
			html +='<div class="row row_table"> '+x+
			'		 	<div class="col-sm-2 pd_her"> '+
			'				<input type="text" class="form-control" name="conta" id="conta" value="'+ reg[ 'num_docum_rat' ] +'" readonly /> '+
			'			</div> '+						
			'		 	<div class="col-sm-2 pd_her"> '+
			'				<input type="text" class="form-control" name="conta" id="conta" value="'+ reg[ 'num_conta' ] +'" readonly /> '+
			'			</div> '+		
			'		 	<div class="col-sm-6 pd_her"> '+
			'				<input type="text" class="form-control" name="conta" id="conta" value="'+ reg[ 'conta' ] +'" readonly /> '+
			'			</div> '+
			'			<div class="col-sm-2 pd_her"> '+
			'				<input type="text" class="form-control" name="perc" id="perc" style="text-align: right;" value="'+ String( Number( reg[ 'pct_particip_comp' ] ).toFixed(2) ).replace('.',',') +'" readonly  /> '+
			'			</div> '+
			'		 </div> ';
	
		}
		html +=	' </div> ';
	
		
	//	FIM COTACAO
		*/
	var titulo = $('#cod_item___' + seq).val() + ' - ' + $('#den_item___' + seq).val();

	var myModal = FLUIGC.modal({
		title: titulo,
		content: html,
		id: 'fluig-modal',
		size: 'full',
		actions: [{
			'label': 'Fechar',
			'autoClose': true
		}]
	}, function (err, data) {
		if (err) {

		} else {
			parent.$('#workflowview-header').hide();
			//$(".modal-body").css("max-height", "380px");
			autoSize();
		}
	});

}

function frmNumber(valor, precisao) {
	var numero = valor;
	numero = numero.toFixed(precisao).split('.');
	numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
	return numero.join(',');
	//return String( ( valor ).toFixed( precisao ) ).replace('.',',');
}

function dateToDMY(dateSTR) {
	date = new Date(dateSTR);
	var d = date.getDate();
	var m = date.getMonth() + 1;
	var y = date.getFullYear();
	return (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
}

function getFloat(valor, padrao) {
	var txt = valor;
	//	exp = /\./g;
	//	txt = txt.toString().replace( exp, "" );
	//	exp = /\,/g;
	//	txt = txt.toString().replace( exp, "." );
	return isNull(Math.round(parseFloat(txt) * 100000000) / 100000000, padrao);
}

function maiuscula(z) {
	v = z.value.toUpperCase();
	z.value = v;
}

function loadDsCombo(combo,
	dataSet,
	fieldCodigo,
	fieldDesc,
	fieldFilter,
	fieldFilterValue,
	fieldOrder,
	printCod,
	clear,
	addblank) {

	console.log('Passo 001 tipo', $('#' + combo).is('select'));

	if (!$('#' + combo).is('select')) {
		return false;
	}

	if (printCod == undefined) {
		printCod = 'S';
	}

	var constraintsFilhos = new Array();
	var lstFilter = fieldFilter.split(',');
	var lstFilterValue = fieldFilterValue.split(',');
	for (var j = 0; j < lstFilter.length; j++) {
		console.log('Passo 00X', lstFilter[j], lstFilterValue[j]);
		if (lstFilter[j] != '' && lstFilter[j] != null) {
			constraintsFilhos.push(DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST));
		}
	}
	var orderFilhos = new Array();
	var lstOrder = fieldOrder.split(',');
	for (var j = 0; j < lstOrder.length; j++) {
		orderFilhos.push(lstOrder[j]);
	}
	var fieldFilhos = new Array(fieldCodigo, fieldDesc);
	var datasetFilhos = DatasetFactory.getDataset(dataSet, fieldFilhos, constraintsFilhos, orderFilhos);

	console.log(constraintsFilhos);
	console.log(datasetFilhos.values);

	if (datasetFilhos != null) {

		if (clear == 'S') {
			$("#" + combo + " option").remove();
		}

		var valDefault = "";
		if ($("#" + combo).val() != "" && $("#" + combo).val() != null && $("#" + combo).val() != undefined) {
			valDefault = $("#" + combo).val();
		}

		if (addblank == 'S') {
			$("#" + combo).append("<option value='' ></option>");
		}

		var filhos = datasetFilhos.values;
		for (var i in filhos) {
			var filho = filhos[i];
			var den = '';

			if ($.inArray(filho[fieldCodigo], getOptCombo(combo)) > -1) {
				continue;
			}
			if (fieldDesc == '') {
				den = filho[fieldCodigo];
			} else {
				if (printCod == 'S') {
					den = filho[fieldCodigo] + ' - ' + filho[fieldDesc];
				} else {
					den = filho[fieldDesc];
				}
			}
			$("#" + combo).append("<option value='" + filho[fieldCodigo] + "' >" + den + "</option>");
		}
		console.log('valDefault.......', valDefault);
		if (valDefault != '') {
			$("#" + combo).val(valDefault);
		}
	}
}

function getOptCombo(combo) {

	var optArray = new Array();
	$("#" + combo + " option").each(function () {
		optArray.push($(this).val());
	});
	return optArray;
}

function addlinhaFornec() {
	var seq = wdkAddChild('fornecedor');
	$('#cnpj_fornecedor___'+seq).val(' ');
	$('#nom_fornecedor___'+seq).val(' ');
	$('#cidade_fornecedor___'+seq).val(' ');
	$('#email_fornecedor___'+seq).val('');
	autoSize();
}


function trataItens(){
	
	$("input[name^=cod_item___]").each(function (index) {
		var seq = $(this).attr('id').split('___')[1];
		if( $('#integrou___'+seq).val() == "S" ){
			//$("#linha_item___"+seq +" :input").each(function () {
			$(this).closest('tr').find( "input" ).each( function () {
				$(this).attr('readonly',true);
			});
			$(this).closest('tr').find( "textarea" ).each( function () {
				$(this).attr('readonly',true);
			});
			$(this).closest('tr').find( "button" ).each( function () {
				$(this).attr('disabled',true);
			});
		}
		
		if( $('#seq_item___' + seq).val() == "" ){
			var seqItem = 0;
			$("input[name^=seq_item___]").each(function (index) {
				
				var seqAtu = parseInt( $( this ).val() );
				if( seqItem < seqAtu ){
					seqItem = seqAtu;
				}
			});
			$('#seq_item___' + seq).val( seqItem + 1 );
		}
		$('#qtd_solic___' + seq).maskMoney({ precision: 3, thousands: '.', decimal: ',' });
		$('#preco_unit___' + seq).maskMoney({ precision: 3, thousands: '.', decimal: ',' });
		$('#preco_est___' + seq).maskMoney({ precision: 3, thousands: '.', decimal: ',' });
	});

	$("input[name^=perc_reateio___]").each(function (index) {
		var seq = $(this).attr('id').split('___')[1];
		$('#perc_reateio___' + seq).maskMoney({ precision: 2, thousands: '.', decimal: ',' });
		
		if (['N', 'A'].indexOf($('#tipo').val()) > -1) {
			$('#doc_origem___' + seq).prop('readonly', true);
		}
		if (['N', 'P', 'O', 'S', 'T'].indexOf($('#tipo').val()) > -1 && $('#conta').val() == "") {
			$('#num_conta___' + seq).prop('readonly', true);
		}
		if (['S'].indexOf($('#tipo').val()) > -1) {
			$('#cod_unid_func___' + seq).prop('readonly', true);
		}
		if (['O', 'S'].indexOf($('#tipo').val()) > -1) {
			$('#cod_cc___' + seq).prop('readonly', true);
		}
		
	});
	
}

function verificaItemPendente(){
	console.log('entrou1');
	$("input[name*=cod_item___]").each(function (index) {
		var seq = $(this).attr('id').split('___')[1];
		console.log('integrou 1 ',$('#integrou___'+seq).val());
		if( $('#integrou___'+seq).val() != "S" ){
			console.log('entrou2');
			$('#integracao_pendente').val('S');
			return 0;
		} else
		{
			console.log('entrou3');
			$('#integracao_pendente').val('N');
		}
	});
}

function openFile( obj ){

	var parentOBJ;

	if (window.opener) {
		parentOBJ = window.opener.parent;
	} else {
	    parentOBJ = parent;
	}

	var cfg = {
			url : "/ecm_documentview/documentView.ftl",
	        maximized : true,
	        title : "Anexo",
	        callBack : function() {
	            parentOBJ.ECM.documentView.getDocument( $($(obj).parent().children()[0]).val() );
	        },
	        customButtons : []
	};
	parentOBJ.ECM.documentView.panel = parentOBJ.WCMC.panel(cfg);
	
}

function calcVencimentos(){
	if( $("#data_emissao").val() != "" && $('#cnd_pgto').val() != "" ){
		if( $("#data_vencimento").val() != "" || $("[name^='dat_vencimento_item___']").length > 0  ){	
			if( confirm('Vencimentos já preenchidos deseja recalcular?') ){
				$("#data_vencimento").val("");
				$("[name^='dat_vencimento_item___']").each(function() {
					fnWdkRemoveChild( this );
				});
			}else{
				return false;
			}
			
		}
		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint('dataBase', 'java:/jdbc/LogixPRD', null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('table', 'cond_pg_item_cap', null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('sqlLimit', '600', null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cnd_pgto', $('#cnd_pgto').val(), $('#cnd_pgto').val(), ConstraintType.MUST));
		var fields = new Array('qtd_dias');
		var order = new Array('qtd_dias');
		//Busca o dataset
		var dataset = DatasetFactory.getDataset('selectTable', fields, constraints, order);
		if( dataset.values.length > 0 ){
			var dtEmissao =  new Date( $("#data_emissao").val().split('/').reverse().join('-') );
			$("#data_vencimento").val( dataAtualFormatada(new Date(dtEmissao.getTime() + ( parseInt( dataset.values[0]["qtd_dias"] ) * 24 * 60 * 60 * 1000)))  )
			for (var x = 1; x < dataset.values.length; x++) {
				var seq = wdkAddChild('programacao_vencimento_item');
				$("#dat_vencimento_item___"+seq).val( dataAtualFormatada(new Date( dtEmissao.getTime() + ( parseInt( dataset.values[x]["qtd_dias"] ) * 24 * 60 * 60 * 1000)))  )
			}
		}
	}	
}

