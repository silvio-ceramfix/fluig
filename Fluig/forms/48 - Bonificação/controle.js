var aba  	 = 1;
var abaTotal = 3;


$(document).bind("DOMNodeRemoved", function(e){
	
	if ( e.target.nodeName == 'LI' ){	
		var target = $(e.target.parentNode.parentNode.parentNode.parentNode.parentNode);
		if( target.html().indexOf('class="select2-selection__choice"' ) > 0 ){
			if( $('#razao_social').val() == null 
		     && target.html().indexOf('id="razao_social"' ) > 0 ){
				clearCliente();
			}
		}
	} 

	if ( e.target.nodeName == 'LI' ){	
		// console.log('entrei no LI1');
		var target = $(e.target.parentNode.parentNode.parentNode.parentNode.parentNode);
		if( target.html().indexOf('class="select2-selection__choice"' ) > 0 ){
			// console.log('entrei no LI2');
			if( $('#transportadora').val() == null 
		     && target.html().indexOf('id="transportadora"' ) > 0 ){
				// console.log('entrei no LI3');
				$('#cod_transportadora').val(null);
			}
		}
	} 

	if ( e.target.nodeName == 'LI' ){	
		var target = $(e.target.parentNode.parentNode.parentNode.parentNode.parentNode);
		if( target.html().indexOf('class="select2-selection__choice"' ) > 0 ){
			
			if (typeof seq != 'undefined'){
				if( $('#desc_item__'+seq).val() == null && target.html().indexOf('id="desc_item"' ) > 0 ){
			    	$('#cod_item___'+seq).val('');
					$('#valUnitario___'+seq).val(0);
					$('#desconto___'+seq).val(0);
					$('#quantidade___'+seq).val(0);
					$('#total___'+seq).val(0);
				}
			}
			
		}
	} 

	/*
	 * console.log('jero',e.target.parentNode.parentNode)
	 * 
	 * if ( e.target.nodeName == 'SPAN' ){ var target =
	 * $(e.target.parentNode.parentNode); if( $('#den_item_edit').val() != '' &&
	 * $('#den_item_edit').val() != undefined && $('#den_item_edit').val() !=
	 * null && target.html().indexOf('id="den_item_edit"' ) > 0 ){ clearItem(
	 * 'den_item' ); } }
	 */
	// Habilita o botÃ£o de enviar
	var target = $(e.target);
	// console.log('antes zIndex '+target.html() );
	if( target.html().indexOf("class=\"fluig-style-guide modal\"" ) >= 0 ){
		console.log('entrei para alterar zIndex');
		parent.$('#workflowView-cardViewer').css( 'zIndex', 0 );
	}
	
	if ( e.target.nodeName == 'SPAN' ){	
		if($('#descricao').val() == null)
			setUpper();
	}
});

function addlinha(tabela){

	nrParcela = document.getElementById('nrParcela').value;
	lstPreco  = document.getElementById('lstPreco').value;
	var retorno = 0;

	if(nrParcela != ''){

		$( "input[name^='total___']" ).each( function () 
		{
			var seq = $(this).attr('name').split('___')[1];

			var result = $(this).val()
			if(	result == null ||result == 0)
			{
				FLUIGC.toast({
					title: 'Atenção: ',
					message: 'Valor precisa ser maior que zero .',
					type: 'warning',
					timeout: 'fast'
			
				});
				setTimeout("$('#total___'+seq).focus();",1);
				retorno = 1
				return
			}
		});

		if (retorno == 1){
			return false
		}

		seq = wdkAddChild(tabela);
		$('#parcelaID___'+seq).val(nrParcela);
		$('#listaID___'+seq).val(lstPreco);

		setFormatNumber();

		var empresa = $('#empresa').val();

		
		var param = "" ;
		reloadZoomFilterValues('desc_item___'+seq, "NUM_LIST_PRECO,"+$('#lstPreco').val()+ ",COD_EMPRESA,"+$('#empresa').val()+ ",IES_BONIFICA,"+"S");
		//reloadZoomFilterValues('razao_social', "IES_PEDIDO,S,COD_USER,"+ $("#userFluig").val());
		
		console.log('FILTRO DA LISTA ',"NUM_LIST_PRECO ",$('#lstPreco').val(), " COD_EMPRESA ",$('#empresa').val(), " IES_BONIFICA ", "S ",param);
		// reloadZoomFilterValues('desc_item___'+seq,
		// "NUM_LIST_PRECO,"+$('#lstPreco').val()+
		// ",COD_EMPRESA,"+$('#empresa').val()+ ",IES_BONIFICA,"+"S");

		habilitaCampos(true,seq);

		document.getElementById("val_invest").readOnly = true;

	}else{
		FLUIGC.toast({
				title: 'Atenção: ',
				message: 'Selecione a parcela .',
				type: 'warning',
				timeout: 'fast'
		});
	}

}

function setFilterAEN(empresa){

	/*
	 * console.log('setFilterAEN',empresa) var constraintsPai = new Array(
	 * DatasetFactory.createConstraint("pai_cod_empresa", empresa, empresa,
	 * ConstraintType.MUST) ); // var constraintsPai = new Array( //
	 * DatasetFactory.createConstraint("metadata#active", 1, 1, //
	 * ConstraintType.MUST) ); var datasetPai =
	 * DatasetFactory.getDataset('empresa_compl', null, constraintsPai, null);
	 * if ( datasetPai != null ) { for (var x = 0; x < datasetPai.values.length;
	 * x++) {
	 */
			
			reloadZoomFilterValues("aen","dataSet,empresa_compl,table,aen_mkt,pai_cod_empresa,"+empresa);

		/*
		 * } }
		 */

	
}


function setFilterCliente(){

	/*
	 * if ( 'N' == 'S' ){ reloadZoomFilterValues('razao_social', "" ); }else{ if (
	 * $('#razao_social').val() == null ){
	 * reloadZoomFilterValues('razao_social', "COD_USER,"+$("#userFluig").val() );
	 * }else{ zoomDestino = window[$("#razao_social").attr('filter-instance')]; } }
	 * setUpper();
	 */
	console.log('TIPO_CADASTRO_DE_USUARIO',$('#tipoCadUser').val());
	console.log( 'setFilterCliente..... 1', $('#razao_social').val() );

	try{
		// loading.show();
		if ( $('#tipoCadUser').val() == 'A' || $('#tipoCadUser').val() == 'M'){
			console.log('TIPO_CADASTRO_DE_USUARIO2',$('#tipoCadUser').val());
			reloadZoomFilterValues('razao_social', "" );
		}else{
			if ( $('#razao_social').val() == "" || $('#razao_social').val() == null /*
																					 * &&
																					 * $('#processo').val() !=
																					 * 'alt_pedido'
																					 */ ){
				console.log('ENTROU NO IF DE FILTRO DE CLIENTE');
				reloadZoomFilterValues('razao_social', "COD_USER,"+$("#userFluig").val() );
			}else if ( $('#processo').val() == 'alt_pedido' ){
				console.log('DISABLE CAMPO.......');
				zoomDestino = window[$("#razao_social").attr('filter-instance')];			
				zoomDestino.disable(true);
			}
		}
		console.log('ANTES UPPER');
		
		if ( $('#editar').val() == 'S' ){
			console.log('IF EDITAR.......');
			loadPedidoEdit( $('#empresa').val(), $('#num_pedido').val() ); 
		}
		var empresa = $('#empresa').val();
		setFilterAEN(empresa);
		// loading.hide();
	}catch( e ){
		console.log( 'erro.....',qtd,e );
		qtd += 1;
		setTimeout("setFilterCliente( "+ qtd +" );",10);
	}
	setUpper();
}

// Funcao para validar se informou todos os campos
var beforeSendValidate = function(numState,nextState){


	console.log('entrou no beforeSendValidate');
	var erro = 0;

	var razao_social 	= $('#razao_social').val();
	var descricao 		= $('#descricao').val();
	var val_invest 		= $('#val_invest').val();
	var tot_parcela		= $('#totParcela').val();
	var optionsRadios   = $("input[name='optionsRadios']:checked").val();	
	var qtd_parcelas    = $('#qtdVezes').val();

	var msg = 'Campos devem ser informados: '

	if (razao_social == null || razao_social == ''){
		msg += ' - Cliente ';
		erro = 1;
	}
	
	if (tot_parcela == null || tot_parcela == '' || tot_parcela == 0){
		if (optionsRadios == 'option1' || optionsRadios == 'OPTION1') {
		msg += ' - Uma parcela não pode ter valor zerado! ';
		erro = 1;
		}
	}
	
	if (descricao == null || descricao == ''){
		msg += ' - Descrição da Ação ';
		erro = 1;
		}
	
	if (val_invest == null || val_invest == ''){
		msg += ' - Valor do investimento ';
		erro = 1;
	}
	
	$( "input[name^='cod_item___']" ).each( function () 
			{
				var seq = $(this).attr('name').split('___')[1];

				var result = $(this).val()
				if(	result == null ||result == 0 || result == '')
				{		
					if (optionsRadios == 'OPTION1' || optionsRadios == 'option1'){
						msg += ' - O campo de código do item deve ser preenchido! -  ';
						erro = 1;
					}
				}
			});
	
	$( "input[name^='desc_max___']" ).each( function () 
			{
				var seq = $(this).attr('name').split('___')[1];

				var result = $(this).val()
			    var desc_max = isNull(Math.round(parseFloat($('#desc_max___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
				var desc_informado = isNull(Math.round(parseFloat($('#desconto___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
				var cod_item = $('#cod_item___'+seq).val();
				if (desc_informado > desc_max)
				{		
					if (optionsRadios == 'OPTION1' || optionsRadios == 'option1'){
						msg += ' - Existem itens com desconto maior que o permitido! - Cod. Item: '+ cod_item + ' - ';
						erro = 1;
					}
				}
			});
	
	$( "input[name^='quantidade___']" ).each( function () 
			{
				var seq = $(this).attr('name').split('___')[1];

				var result = $(this).val()
				if(	result == null ||result == 0 || result == '')
				{		
					if (optionsRadios == 'OPTION1' || optionsRadios == 'option1'){
						msg += ' - Nenhum item pode ter quantidade igual a zero! -  ';
						erro = 1;
					}
				}
			});
	
	// valida se possuem itens na parcela com valor zerado
	$( "input[name^='total___']" ).each( function () 
			{
				var seq = $(this).attr('name').split('___')[1];

				var result = $(this).val()
				if(	result == null ||result == 0)
				{		
					if (optionsRadios == 'OPTION1' || optionsRadios == 'option1'){
						msg += ' - Itens das Parcelas precisam possuir valor! ';
						erro = 1;
					}
				}
			});
	
	if (optionsRadios == 'OPTION1' || optionsRadios == 'option1') {
	for ( i=1 ; i<=qtd_parcelas; i++) {
			var parcela = i;
			if (parcela !=0 || parcela !=null){
			console.log('PARCELA ',parcela);
			
			var somaP = 0.00;
			var somaParcela = 0.00;
			var somaG = 0.00;

			$("input[name^='total___']").each(function() {

				var seq = $(this).attr('name').split('___')[1];

				somaG += parseFloat($('#total___' + seq).val());

				if (parcela == $('#parcelaID___' + seq).val()) {
					somaP += parseFloat($('#total___' + seq).val());
				}
			});
			
			if (somaP == null || somaP == '' || somaP == 0.00){
				msg += ' - Uma parcela não pode ter valor zerado! Parcela: '+parcela;
				erro = 1;
			}

		}
	}
	}
		
    console.log('entrou 1');
    if(erro == 1)
    	throw(msg);

    var task = $('#task').val();

    if ( task == 9 ){
    	

		if(optionsRadios == 'option2' || optionsRadios == 'OPTION2')
			alert( "O Número do pedido será envido posteriormente para seu e-mail cadastrado." );
	}

	return true

}

function validaAba( aba ){
	
	var msg = '';
	var msg_valida = '';

	setFocus = true;
	
	$( 'input, select, textarea', $('#aba_'+aba) ).each(function () 
	{

		$( '#'+$(this).attr('id') ).css({'background-color' : '#FFFFFF'});
		setCorFilhos( $(this).attr('id'), '#FFFFFF' );

		if ( $(this).attr( 'valida' ) != undefined  && 
			 $(this).attr( 'valida' ) != "" && 
			($(this).val() == "" || $(this).val() == null || $(this).val() == undefined ))
		{

			if ( aba == 2 ){
				if ($('#tipo_logradouro_ent').val() == "" &&
					$('#endereco_ent').val() == "" &&
					$('#numero_ent').val() == "" &&
					$('#cep_ent').val() == "" &&
					$('#bairro_ent_sel').val() == "" &&
					$('#bairro_ent').val() == "")
				{
					msg = ''
					return;
				}
			}

			if (!(( aba == 1 && $(this).attr( 'id' ) == 'cei' ) ||
				 ( aba == 2 && !$('#ies_bairro_ent_manual').is(":checked") && $(this).attr( 'id' ) == 'bairro_ent' ) ||
				 ( aba == 2 && $('#ies_bairro_ent_manual').is(":checked") && $(this).attr( 'id' ) == 'bairro_ent_sel' ) ||			
				 ( aba == 2 && $('#cep_ent' ).val() == "" &&  $('#cidade_ent' ).val() == "" &&  $('#numero_ent' ).val() == "" 
				            && $('#endereco_ent' ).val() == "" &&  ( $('#bairro_ent' ).val() == "" || $('#bairro_ent_sel' ).val() == "" )
							&& ( $('#bairro_ent_sel' ).val() == "" || $('#bairro_ent_sel' ).val() == null  || $('#bairro_ent_sel' ).val() == undefined  ) )
				)){
					$( $(this) ).css({'background-color' : '#FFE4C4'});
					setCorFilhos( $(this).attr('id'), '#FFE4C4' );
					msg += ' '+$(this).attr( 'valida' );
					
					if ( setFocus ){
						setFocus = false;
						// $(this).focus();
						setTimeout("$('#"+$(this).attr('id')+"').focus();",1);
					}
				}
		}
	});

	var optionsRadios = $("input[name='optionsRadios']:checked").val();	
	console.log('optionsRadios',optionsRadios)

	if ( aba == 1 ){
		if(optionsRadios == 'option1'){
			if($('#cod_transportadora').val() == null || $('#cod_transportadora').val() == undefined ){
				msg += ' Transportadora'
			}
		}
	}

	if ( msg != "" || msg_valida != "" ){
		if ( msg != "" ){
			FLUIGC.toast({
				title: 'Preenchimento: ',
				message: 'Você deve informar os campos: '+msg,
				type: 'warning',
				timeout: 'slow'
			});	
		}
		if ( msg_valida != "" ){
			FLUIGC.toast({
				title: 'Validação: ',
				message: msg_valida,
				type: 'warning',
				timeout: 'slow'
			});	
		}				
		return false;
	}
	
	return true;
}

function setCorFilhos( id, color ){
	$( 'div', $( '#'+id+'_grp' ) ).each( function () {
		if( $(this).hasClass('bootstrap-tagsinput') ){
			$( $(this) ).css({'background-color' : color });
		}
	});
}

var mascaraIE = {
    'RS': '999-9999999',
	'SC': '999.999.999',
	'PR': '99999999-99',
	'SP': '999.999.999.999',
	'MG': '999.999.999/9999',
	'RJ': '99.999.99-9',
	'ES': '999.999.99-9',
	'BA': '999.999.99-9',
	'SE': '999999999-9',
	'AL': '999999999',
	'PE': '99.9.999.9999999-9',
	'PB': '99999999-9',
	'RN': '99.999.999-9',
	'PI': '999999999',
	'MA': '999999999',
	'CE': '99999999-9',
	'GO': '99.999.999-9',
	'TO': '99999999999',
	'MT': '999999999',
	'MS': '999999999',
	'DF': '99999999999-99',
	'AM': '99.999.999-9',
	'AC': '99.999.999/999-99',
	'PA': '99-999999-9',
	'RO': '999.99999-9',
	'RR': '99999999-9',
	'AP': '999999999'
};

function loadBody(){
	
	console.log('Valores salvos no formulário')
	
	var qtdVezes = $('#qtdVezes').val();
	console.log('Quantas vezes?',qtdVezes)

	calculaqtdVezes();
	if (qtdVezes > 0){
		document.getElementById('qtdVezes').value = qtdVezes
		
		var nrParcela = $('#nrParcela').val();
		nrParcelas(qtdVezes) // Atualiza o campo parcelas
		$('#nrParcela').val(nrParcela);
		exibeLinhas(nrParcela)
	}

	var optionsRadios = $("input[name='optionsRadios']:checked").val();
	console.log('Produto/Dinheiro',optionsRadios)

	if(optionsRadios != null && optionsRadios != '' && optionsRadios != undefined){
		if(optionsRadios == 'option2'){
			mostradiv('camposFinal',2);
		}else{
			$('#current_step').html( aba );
			$('#total_steps').html( abaTotal );

			// $('#aprova_regional').val( 'S' );
			// console.log('Dinherio',$('#aprova_regional').val);
		}
	}

	if($('#cod_repres').val() != null && $('#cod_repres').val() != '' && $('#cod_repres').val() != undefined){
		
		var empresa 		= $('#empresa').val();
		var nat_operacao 	= $('#nat_operacao').val();

		loadRepresCompl( $('#cod_repres').val(), $('#cod_cliente').val(), $('#cod_moeda_cli').val() );

		$('#empresa').val(empresa);
		$('#nat_operacao').val(nat_operacao);
	}

	var task = $('#task').val()
	console.log('taskxxxxx',task)
	if (task == 9 || task == 45){
		abaTotal = 4;		
	}
	else{
		abaTotal = 3;
	}

	// var nat_operacao = $('#nat_operacao').val();
	// loadNatOper($("#empresa").val())
	// document.getElementById('nat_operacao').value = nat_operacao
	
	autoSize();	

	$('.preco_unit').maskMoney( { precision:2, thousands:'.',decimal:','} );
	// parent.$('#workflowView-cardViewer').css( 'zIndex', 100 );


	var bairro = $('#bairro_ent_sel' ).val();
	loadBairro( $('#cod_cidade_ent' ).val(), 'bairro_ent_sel' );	
	
	
	if ( bairro != "" && bairro != null ){
		$('#bairro_ent_sel' ).val( bairro );
	}
	
	if ( $('#ies_bairro_ent_manual').is(":checked") ){
		$( '#bairro_ent_sel' ).hide();
	}else{
		$( '#bairro_ent' ).hide();
	}
		
	setIsento( 'isento_ie_ent', 'ie', 'estado' );
	setSemNumero( 'sem_numero_ent', 'numero_ent' ); 

	$('#current_step').html( aba );		

	
	$('#etapa').val( aba );
	$('#total_steps').html( abaTotal );
	
	$('#linha_edit').val( '0' );

	
	setFormatNumber();
	setTimeout("setFilterCliente();",2000);
	// setTimeout("setFilterProduto();",2000);

}

function calculaqtdVezes(){
	
	var date = new Date();

	// recupera ao mes atual
	mes  = date.getMonth() + 1;
	
	// se mes atual for menor que 10 adiciona um 0 na frente do mês
	if (mes<10) {
		mes = "0"+mes;
	}

	// variavel qtd vezes recebe o conteudo do campo qtdvezes da tela
	qtdVezes = document.getElementById('qtdVezes');
	qtdVezes.options[0] = new Option();
	var position = 1;

	if (mes != 12)
		{
			for (x=11; x>=mes; x--){
		
				qtdVezes.options[position] = new Option(12-x, 12-x);
				position = position + 1;
			}
	} else{
		qtdVezes.options[1] = new Option(1);
	}
}

function setFormatNumber(){

	$('.decimal_6').maskMoney( { precision:6, thousands:'.',decimal:','} );
	$('.decimal_5').maskMoney( { precision:5, thousands:'.',decimal:','} );
	$('.decimal_4').maskMoney( { precision:4, thousands:'.',decimal:','} );
	$('.decimal_3').maskMoney( { precision:3, thousands:'.',decimal:','} );
	$('.decimal_2').maskMoney( { precision:2, thousands:'.',decimal:','} );
	$('.decimal_1').maskMoney( { precision:1, thousands:'.',decimal:','} );
	$('.decimal_0').maskMoney( { precision:0, thousands:'.',decimal:','} );

	$('.integer_0').maskMoney( { precision:0, thousands:'' ,decimal:''} );
}

function setUpper(){
	
	$("input").keypress( function(e) {
        var chr = String.fromCharCode(e.which);
        if ("'\"!@#$%ÃƒÂ‚Ã‚Â¨&*()_+=-\ÃƒÂ‚Ã‚Â´`[]{}/?;:>,<\|~ÃƒÂ‡ÃƒÂ§".indexOf(chr) > 0 ){
          return false;
        }
     });
	
	$("input,textarea").keyup(function(){
		console.log('jeropassou1')
		$(this).val($(this).val().toUpperCase());
	});
}

function SomenteNumero(e){
    var tecla=(window.event)?event.keyCode:e.which;

    if((tecla>47 && tecla<58))
    	return true;
    else{
    	if (tecla==8 || tecla==0 || tecla==44 || tecla==46) // 44=virgula
															// 46=ponto
    		return true;
		else
			return false;
    }
}



function autoSize(){		
	$('textarea').each(function () {
		  this.setAttribute('style', 'height:' + (this.scrollHeight + 32 ) + 'px;overflow-y:hidden;');
	}).on('input', function () {
		// style="height: 32px; overflow-y: hidden;"
		  this.style.height = 'auto';
		  this.style.height = (this.scrollHeight) + 'px';
	});
}


function nextPage(){
		

	console.log('abaTotal',abaTotal)

	if ( validaAba(aba) )
	{ 
		$( "#aba_"+aba ).hide();
		if (aba == 1)
			$( "#btn_cancel" ).show();
		
		aba ++;
		
		$( "#aba_"+aba ).show();
		
		console.log('aba',aba)
		

		if (aba == abaTotal){
			$( "#btn_confirma" ).hide();
			var empresa = $('#empresa').val();
			setFilterAEN(empresa);
		}
			
		$('#current_step').html( aba );
		$('#total_steps').html( abaTotal );
	}

}

function lastPage(){
	console.log('LabaTotal',abaTotal)

	if (aba == abaTotal)
		$( "#btn_confirma" ).show();
	$( "#aba_"+aba ).hide();
	aba --;
	$( "#aba_"+aba ).show();
	if (aba == 1)
		$( "#btn_cancel" ).hide();	
	
	$('#current_step').html( aba );
	$('#total_steps').html( abaTotal );
		
}


// PÃ�GINA 2

function clearEndereco( id ){

	zoomDestino = window[$("#cidade_ent").attr('filter-instance')];
	zoomDestino.clear();
	
	$('#tipo_logradouro_ent').val( '' );
	$('#endereco_ent').val( '' );
	$('#sem_numero_ent').prop('checked', false);
	setSemNumero( 'sem_numero_ent', 'numero_ent' );
	$('#numero_ent').val( '' );
	$('#cod_cidade_ent').val( '' );
	$('#cep_ent').val( '' );
	$('#ies_bairro_ent_manual').prop('checked', false);
	alteraCampos( 'ies_bairro_ent_manual', 'bairro_ent_sel', 'bairro_ent' );
	$('#bairro_ent_sel').val( '' );
	$('#bairro_ent').val( '' );
	$('#cnpj_ent').val( '' );
	$('#isento_ie_ent').prop('checked', false);
	setIsento( 'isento_ie_ent', 'ie_ent', 'estado_ent' );
	$('#ie_ent').val( '' );
	
	
}

function setSemNumero( idCampo, idCampoNum, idCampoUF ){
	if ( $("#"+idCampo).is(':checked') ){
		$('#'+idCampoNum).attr( 'readonly', true );
		$('#'+idCampoNum).attr('type', 'text');
		$('#'+idCampoNum).css('background-color' , '#DEDEDE');
		$( '#'+idCampoNum ).val('S/N');
	}else{
		$('#'+idCampoNum).attr( 'readonly', false );
		$('#'+idCampoNum).attr('type', 'number');
		$('#'+idCampoNum).css('background-color' , '#FFFFFF');
		$( '#'+idCampoNum ).val();
	}
}

function alteraCampos( idCampo, campo1, campo2 ){
	if ( $("#"+idCampo).is(':checked') ){
		$( '#'+campo1 ).hide() ;
		$( '#'+campo2 ).show();
	}else{
		$( '#'+campo1 ).show() ;
		$( '#'+campo2 ).hide();
	}				
}

function setIsento( idCampo, idCampoIE, idCampoUF ){
	
	if ( $("#"+idCampo).is(':checked') ){
		$('#'+idCampoIE).unmask();
		$('#'+idCampoIE).attr( 'readonly', true );
		$('#'+idCampoIE).css('background-color' , '#DEDEDE');
		$( '#'+idCampoIE ).val('ISENTO');
	}else{
		$('#'+idCampoIE).unmask();
		$('#'+idCampoIE).attr( 'readonly', false );
		$('#'+idCampoIE).css('background-color' , '#FFFFFF');
		if ( $( '#'+idCampoIE ).val() == 'ISENTO' ){
			
			$( '#'+idCampoIE ).val('');
			setMaskIE( $('#'+idCampoUF).val(), idCampoIE );
		}else{
			var tmp = $( '#'+idCampoIE ).val();
			setMaskIE( $('#'+idCampoUF).val(), idCampoIE );
	
			$( '#'+idCampoIE ).val( tmp );
		}
		
	}
}

function setMaskIE( uf, id ){
		$('#'+id).unmask();
		$('#'+id).val('');
		if ( mascaraIE.hasOwnProperty(uf) )
			$('#'+id).mask( mascaraIE[uf] );  
}


function removeLote(id,exibe){
	
	var seq   = id.split('___')[1];

	if( $('#cod_item___'+seq).val() == "" ){
		return false;
	}
	var quant = isNull( Math.round( parseFloat( $('#quantidade___'+seq).val().replace('.','').replace(',','.') ) * 10000 ) / 10000, 0 );
	var quant_mult = isNull( Math.round( parseFloat( $('#qtd_pad_edit___'+seq).val().replace(',','.') ) * 10000 ) / 10000, 1 );
	if ( quant <= 0 ){
		return false;
	}
	$('#quantidade___'+seq).val( String( (quant - quant_mult ).toFixed(2) ).replace('.',',') );

	calculaTotal( id,exibe )
}

function addLote(id){

	var seq   = id.split('___')[1];

	if( $('#cod_item___'+seq).val() == "" ){
		return false;
	}
	var quant = isNull( Math.round( parseFloat( $('#quantidade___'+seq).val().replace('.','').replace(',','.') ) * 10000 ) / 10000, 0 );
	console.log('quantidade ',quant);
	var quant_mult = isNull( Math.round( parseFloat( $('#qtd_pad_edit___'+seq).val().replace(',','.') ) * 10000 ) / 10000, 1 );
	console.log('quant_mult ',quant_mult);
	
	if ($('#cod_item_edit').val() == "") {
		return false;
	}
	
	
	$('#quantidade___'+seq).val( String( (quant + quant_mult).toFixed(2) ).replace('.',',') );

	calculaTotal( id,'S' )
}


function alteraPreco( id ){

	
	var seq = id.split('___')[1];
	
	if( isNull( Math.round( parseFloat( $('#valUnitario___'+seq).val().replace('.','').replace(',','.') ) * 10000 ) / 10000, 0 ) != 0
 	 && isNull( Math.round( parseFloat( $('#valUnitarioLista___'+seq).val().replace('.','').replace(',','.') ) * 10000 ) / 10000, 0 ) == 0  ){
		
		$('#valUnitario___'+seq).val('0.000');
		FLUIGC.toast({
			title: 'Preco: ',
			message: 'Nao é permitido alterar preco, se nao localizado preco do item na lista de preco.',
			type: 'danger',
			timeout: 'slow'
		});
		setTimeout("$('#valUnitario___"+seq+"').focus();",1);
	}
	
	if ( (isNull( Math.round( parseFloat( $('#valUnitario___'+seq).val().replace('.','').replace(',','.') ) * 10000 ) / 10000, 0 )) 
 	 < (isNull( Math.round( parseFloat( $('#valUnitarioLista___'+seq).val().replace('.','').replace(',','.') ) * 10000 ) / 10000, 0 ))   ){
		
		$('#valUnitario___'+seq).val($('#valUnitarioLista___'+seq).val());
		FLUIGC.toast({
			title: 'Preco: ',
			message: 'Você somente pode aumentar o preço!',
			type: 'danger',
			timeout: 'slow'
		});
		setTimeout("$('#valUnitario___"+seq+"').focus();",1);
	}
	if ($('#quantidade___')+seq.val()>0){
		FLUIGC.toast({
			title: 'Preco: ',
			message: 'Você deve zerar a quantidade para alterar o preço!',
			type: 'danger',
			timeout: 'slow'
		});
		setTimeout("$('#valUnitario___"+seq+"').focus();",1);
	}
}


function removedZoomItem(componente){
	
	
	if (componente.inputName == 'aen'){
		$('#cod_aen').val('');
	}
}

function retiraAcento(palavra, obj) {
	com_acento = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ';
	sem_acento = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC';
	nova = '';
	for (i = 0; i < palavra.length; i++) {
		if (com_acento.search(palavra.substr(i, 1)) >= 0) {
			nova += sem_acento.substr(com_acento.search(palavra.substr(i, 1)),
					1);
		} else {
			nova += palavra.substr(i, 1);
		}
	}
	obj.value = nova.toUpperCase();
}

function calculafrete() {
	// ////#### F R E T E #####
		var frete_total = 0 ;
		var peso_total = parseFloat($('#pesototal').val());
		var cubagem_total = parseFloat($('#cubagem_total_geral').val().replace(',','.'));
		var cod_cidade_ent = ($('#cod_cidade_ent').val());
		console.log( 'peso_total......... ',peso_total );
		var codCliente = $('#cod_cliente').val();
		var codEmpresa = $('#empresa').val();
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
		
		if( $('#tipo_frete_logix').val() == '1' ){
			
			console.log('tipo_frete_logix ');
			console.log('cod_cidade_ent ',cod_cidade_ent);
			
			if (cod_cidade_ent != null && cod_cidade_ent != 0 ) {
				SQL = " select nvl( eis_f_get_valor_tabela_frete( emp.cod_empresa, "+ //empresa
					" '"+$('#cod_transportadora').val()+"', "+ //cod_transportadora
				" clie.cod_cidade, "+ //cod cidade origem
				" '"+$('#cod_cliente').val()+"', "+ //cod_cliente
	            " '"+ cod_cidade_ent +"', "+ //cod cidade destino 
	            "											pe.parametro_ind, "+ //nivel
	            " 0," + //quantidade
	            "											"+ peso_total +", "+ //peso liquido
	            "											"+ peso_total +", "+  //peso item
	            "											"+cubagem_total+", " + //peso cubado
	            $('#totGeral').val()+", "+ //valortotal mercadoria
	            $('#totGeral').val()+", "+ //valortotal 
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
						" '"+$('#cod_transportadora').val()+"', "+ //cod_transportadora
						"											clie.cod_cidade, "+ //cod cidade origem
						" '"+$('#cod_cliente').val()+"', "+ //cod_cliente
					    " cli.cod_cidade, "+ //cod cidade destino 
					    "											pe.parametro_ind, "+ //nivel
					    " 0, " + //quantidade
					    "											"+ peso_total +", "+ //peso liquido
					    "											"+ peso_total +", "+  //peso item
					    "											"+cubagem_total+", " + //peso cubado
					    $('#totGeral').val()+", "+ //valortotal mercadoria
					    $('#totGeral').val()+", "+ //valortotal 
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
		}else{
			 $('#fretetotal').val(parseFloat(0.00)) ;
			 FLUIGC.toast({
					title : 'Incorreto: ',
					message : 'Atencao: Você somente pode calcular o frete se o tipo selecionado for CIF!',
					type : 'warning',
					timeout : 'slow'
				});
		}
	    // ######### F I M F R E T E #######
}