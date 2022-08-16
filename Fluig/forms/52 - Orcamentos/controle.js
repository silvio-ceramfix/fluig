var abaTotal = 4;
var aba = 1;
var qtd = 0;
var qtdSleep = 0;

var valAtu = "";

var loadingPrincipial = FLUIGC.loading("divPrincipal");
loadingPrincipial.title = "Carregando......";


loading = FLUIGC.loading(window , {
	textMessage:  '<h3>Filtrando Informa&ccedil;&otilde;es...</h3>',
    title: null,
    css: {
        padding:        0,
        margin:         0,
        width:          '30%',
        top:            '40%',
        left:           '35%',
        textAlign:      'center',
        color:          '#000',
        border:         '3px solid #aaa',
        backgroundColor:'#fff',
        cursor:         'wait'
    },
    overlayCSS:  { 
        backgroundColor: '#000', 
        opacity:         0.6, 
        cursor:          'wait'
    }, 
    cursorReset: 'default',
    baseZ: 1000,
    centerX: true,
    centerY: true,
    bindEvents: true,
    fadeIn:  200,
    fadeOut:  400,
    timeout: 0,
    showOverlay: true, 
    onBlock: null,
    onUnblock: null,
    ignoreIfBlocked: false		
});


$(document).bind("DOMNodeRemoved", function(e){

	if ( e.target.nodeName == 'LI' ){	
		var target = $(e.target.parentNode.parentNode.parentNode.parentNode.parentNode);
		if( target.html().indexOf('class="select2-selection__choice"' ) > 0 ){
			if( $('#den_item_edit').val() == null 
		     && target.html().indexOf('id="den_item_edit"' ) > 0 ){
				clearItem( 'den_item' );
			}
		}
	} 
	
	var target = $(e.target);
	//console.log('antes zIndex '+target.html() );
	if( target.html().indexOf("class=\"fluig-style-guide modal\"" ) >= 0 ){
		//console.log('entrii para alterar zIndex');
		parent.$('#workflowView-cardViewer').css( 'zIndex', 0 );
	}
	
	
});


function clearItem( origem ){

	if ( origem == 'cod_item' ){
		zoomDestino = window[$("#den_item_edit").attr('filter-instance')];
		zoomDestino.clear();
	}
	
	$('#cod_item_zoom_edit').val( '' );
	$('#cod_item_edit').val( '' );
	$('#peso_edit').val( '' );
	$('#cubagem_edit').val('');
	$('#qtd_pad_edit').val( '' );
						
	$('#cod_lin_prod_edit').val( '' );
	$('#cod_lin_recei_edit').val( '' );
	$('#cod_seg_merc_edit').val( '' );
	$('#cod_cla_uso_edit').val( '' );
	$('#cod_grupo_item_edit').val( '' );
	$('#cod_tip_carteira_edit').val( '' );
	$('#um_edit').val( '' );
								
	$('#valor_unit_edit').val( '' );
	$('#valor_unit_liq_edit').val('');
	$('#valor_unit_moeda_edit').val('');
	$('#valor_unit_lista_edit').val( '' );
	$('#valor_total_edit').val( '' );
	
	$('#desconto_edit').val( '' );
	$('#quantidade_edit').val( '' );
	$('#qtd_pad_edit').val( '' );
	$('#data_entrega_edit').val( '' );
	
	$('#pedido_cli_edit').val( '' );
	$('#seq_pedido_cli_edit').val( '' );
	
	$('#linha_edit').val( '0' );

	$('#obs_item_1_edit').val( "" );
	$('#obs_item_2_edit').val( "" );
	$('#obs_item_3_edit').val( "" );
	$('#obs_item_4_edit').val( "" );
	$('#obs_item_5_edit').val( "" );
	
	$('#ies_mix').val( "" );
	$('#pct_desc_adic_edit').val( "" );
	
	
	$('#inf_obs').prop("checked",false);
	setObsItem();
	
	if( $('#ies_inf_pedido').val() == "S" ){
		$('#info_Pedido').show();
	}else{
		$('#info_Pedido').hide();
	}
	
	$('#sequencia_edit').val( "" );
	
	$('#val_icms_edit').val( "" );
	$('#perc_icms_edit').val( "" );
	$('#val_pis_edit').val( "" );
	$('#perc_pis_edit').val( "" );
	$('#val_cofins_edit').val( "" );
	$('#perc_cofins_edit').val( "" );
	$('#val_cofins_edit').val( "" );
	$('#perc_cofins_edit').val( "" );
	$('#val_ipi_edit').val( "" );
	$('#perc_ipi_edit').val( "" );
	$('#val_st_edit').val( "" );
	$('#perc_st_edit').val( "" );
	$('#val_rol_edit').val( "" );
	$('#perc_rol_edit').val( "" );
	$('#custo_edit').val( "" );
	$('#perc_custo_edit').val( "" );
	$('#custo_trans_edit').val( "" );
	$('#perc_trans_edit').val( "" );
	$('#val_comis_edit').val( "" );
	$('#perc_comis_edit').val( "" );
	
	$('#val_comis_adic_edit').val( "" );
	//$('#perc_comis_adic_edit').val( "" );
	
	$('#val_royaltie_edit').val( "" );
	$('#perc_royaltie_edit').val( "" );
	
	$('#val_acordo_edit').val( "" );
	$('#perc_acordo_edit').val( "" );
	$('#val_verba_edit').val( "" );
	$('#perc_verba_edit').val( "" );
	$('#val_finac_edit').val( "" );
	$('#perc_finac_edit').val( "" );
	$('#val_lob_edit').val( "" );
	$('#val_lob_total_edit').val( "" );
	$('#val_lob_ton_edit').val( "" );
	$('#val_lob_perc_edit').val( "" );
	
}

function getLinhaCampoPF( campo ){
	return campo.substring( campo.indexOf( '___' )+3, campo.length );
}

function fnCustomDelete(oElement){
	
	seq = getIdParentChild(oElement).split('___')[1];
	console.log('fnCustomDelete', $('#processo').val(), $('#sequencia___'+seq).val() );
	if ( $('#processo').val() == 'alt_pedido' &&  $('#sequencia___'+seq).val() != ""  ){
		FLUIGC.toast({
			title: 'Valida&ccedil;&atilde;o: ',
			message: 'N&atilde;o &eacute; permitido excluir item original do pedido.',
			type: 'warning',
			timeout: 'fast'
		});
		return false;
	}
	fnWdkRemoveChild(oElement);
	atulizaRecalcTotal( 'exclir_linha' );
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
            $.each($(form).find("input[type=hidden]"), function(i, inputHidden) {
                var idInput = $(input).attr("name");
                var idInputHidden = "_" + $(inputHidden).attr("name");
                if (idInput && idInputHidden.valueOf() == idInput.valueOf()) {
                    $(inputHidden).remove();
                }
            });
        }
    });
    console.log( ' parent...... ', $( row ).attr('id') );
    return $( row ).attr('id');
}

function setTipoCliente( tipo ){
	
	console.log('Entrei no setTipoCliente.............. ');
	
	if( qtdItens() > 0 ){
		FLUIGC.toast({
				title: 'Altera&ccedil;&atilde;o: ',
				message: 'N&atilde;o &eacute permitido alterar ap&oacute; inserir itens no pedido.',
				type: 'warning',
				timeout: 'fast'
		});
		$('#tipo_cliente').val( $("#tipo_cliente_hd").val() );
		return false;
	}
	
	$('#tipo_cliente_hd').val( $("#tipo_cliente").val() );
	
	if( $('#razao_social_zoom').val() != "" && $('#razao_social_zoom').val() != null ){
		$('#tipo_cliente').val( $('#cod_tip_cli').val().trim() );
		$('#tipo_cliente_hd').val( $("#tipo_cliente").val() );
		return;
	}else{  
		var repres = getRepresUserTipoCli( $('#userFluig').val(), $('#tipo_cliente').val() );
		loadRepresCompl( repres, "", "", 'SC', "" );
		loadRepres( repres );
		setValidadeOrcamento();
	}
	
	setValidadeOrcamento();
	

		//tratamento para que quando o canal for engenharia permita selecionar qualquer cidade
		var tipoCli = $('#tipo_cliente_hd').val();
		console.log('tipo ',tipoCli);
		var constraintsPai = new Array();
		constraintsPai.push( DatasetFactory.createConstraint("cod_tip_cli", tipoCli, tipoCli, ConstraintType.MUST) );
	
	    var datasetPai = DatasetFactory.getDataset("tipo_cliente", null, constraintsPai, null);
	   
		if ( datasetPai != null ){
			for (var x = 0; x < datasetPai.values.length; x++) {	
			console.log(datasetPai);	
			var per_sel_cidades = 'N';
			per_sel_cidades = datasetPai.values[x].PER_SEL_CIDADES;
			console.log(per_sel_cidades);
			if (per_sel_cidades == null || per_sel_cidades == ''){
				per_sel_cidades = 'N';
				$('#per_sel_cidades').val('N');
			}
			per_sel_cidades = per_sel_cidades.trim();
				if (per_sel_cidades == 'S'){
					console.log('entrou em cidades');
					$('#per_sel_cidades').val('S');
					setFilterCidade( 'cidade', '', '' );
				} else {
					$('#per_sel_cidades').val('N');
					setFilterCidade( 'cidade', 'userFluig', 'cod_repres' );
				} 	
			}
		} else {
			$('#per_sel_cidades').val('N');
		}
		
		//fim tratamento para que quando o canal for engenharia permita selecionar qualquer cidade
	
}

function setTipoFormulario( tipo ){
	
	if( $('#razao_social_zoom').val() != "" && $('#razao_social_zoom').val() != null ){
		$('#tipo_cadastro').val( 'E' );
	}else if( $('#razao_social').val() != "" && $('#razao_social').val() != null ){
		$('#tipo_cadastro').val( 'N' );
	}
	
	if( tipo != 'load' ){
		if( $('#tipo_cadastro_hd').val() == $("#tipo_cadastro").val() ){
			$('#tipo_cadastro_hd').val( $("#tipo_cadastro").val() );
			return false;
		}else{
			$('#tipo_cadastro_hd').val( $("#tipo_cadastro").val() );
		}
			
		if( qtdItens() > 0 ){
			FLUIGC.toast({
					title: 'Altera&ccedil;&atilde;o: ',
					message: 'N&atilde;o &eacute permitido alterar ap&oacute; inserir itens no pedido.',
					type: 'warning',
					timeout: 'fast'
			});
			$('#tipo_cadastro').val( $("#tipo_cadastro_hd").val() );
			return false;
		}	
	}
	
	var zoomDestino = {};
	zoomDestino = window[ $("#cidade").attr('filter-instance') ];
						
	if ( $('#tipo_cadastro').val() == 'E'){
		$( '#rs_zoom' ).show();
		$( '#rs_input' ).hide();
		$( '#cnpj').prop("readonly", true);
		
		
		
		
		if( zoomDestino != undefined )
			zoomDestino.disable(true);
	}else{
		$('#cod_tip_carteira').val( '01' );
		$('#cod_tip_carteira_cli').val( '01' );
		$('#cod_moeda_cli').val("1");
		$( '#rs_zoom' ).hide();
		$( '#rs_input' ).show();
		$( '#cnpj').prop("readonly", false);
		
		$('#uso_consumo option:not(:selected)').prop('disabled', false);
		$('#ies_isento_ie option:not(:selected)').prop('disabled', false);
		
		if( zoomDestino != undefined )
			zoomDestino.disable(false);
		if( tipo != 'load'){
			loadTipoClient( $('#userFluig').val(), 'tipo_cliente' )
		}
	}
		
	if( tipo != 'load'){
		$( '#cnpj').val("");
		setFilterCidade( 'cidade', 'userFluig', 'cod_repres' );
		zoomDestino.clear();
	}
}


function isUndefined( campo ){
	if ( campo == null  || campo == undefined  ){
		return  "";
	}else{
		return campo;
	}
}

function nextPage(){
	if ( validaAba(aba) ){ 
		$( "#aba_"+aba ).hide();
		if (aba == 1)
			$( "#btn_cancel" ).show();
		aba ++;
		$( "#aba_"+aba ).show();
		if (aba == abaTotal)
			$( "#btn_confirma" ).hide();	
		
		$('#current_step').html( aba );
		$('#total_steps').html( abaTotal );
		
		clearItem( 'movto' );
		//setCeiOBS();
		
		trataGer();
		
		loadPerguntas();
		
	}
}

function lastPage(){
	if (aba == abaTotal)
		$( "#btn_confirma" ).show();
	$( "#aba_"+aba ).hide();
	aba --;
	$( "#aba_"+aba ).show();
	if (aba == 1)
		$( "#btn_cancel" ).hide();	
	
	$('#current_step').html( aba );
	$('#total_steps').html( abaTotal );
	
	clearItem( 'movto' );
	
	trataGer();
}


function trataGer(){
	
	if( $('#task').val() == "15"){
		$(".gerencial").hide();
	} else if( ( $('#task').val() == "0"
		 	  || $('#task').val() == "31" ) 
		 	 && $("#tipoCadUser").val() == "R" ){
		$(".gerencial").hide();
	} else if( $('#task').val() == "42" 
			|| $('#task').val() == "44" 
			|| $('#task').val() == "83" ){
		//if( $('#simulacao').val() != "S" ){
		//	$('.simulacao').hide();
		//}else{
			$('.simulacao').show();
		//}
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
	
	if( $('#moeda').val() != '1' ){
		$('.lbl_moeda').show();
	}else{
		$('.lbl_moeda').hide();
	}
	
	if( $('#ies_end_entrega').val() == "S" ){
		$('#btCopyEndereco').show();
	}else{
		$('#btCopyEndereco').hide();
	}
	
}

var beforeSendValidate = function(numState,nextState){
	
	console.log('Aba....'+aba);
	console.log('Valida....'+validaAba(aba));
	var motivo_cancelamento = $('#motivo_cancelamento').val();
	
	if ( ( $('#acao').val() == 'P' && validaAba(2) && validaAba(3) )
	   ||( $('#acao').val() != 'P' && validaAba(2) ) ) {
		
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
		
		if ((numState == 15 && nextState == 79 && (motivo_cancelamento == '' || motivo_cancelamento == null)) || (numState == 48 && nextState == 53 && (motivo_cancelamento == '' || motivo_cancelamento == null))) {
			alert( 'Voce deve informar o motivo do cancelamento na Etapa 4 deste processo!' );
			return false;
		} else {
			if ((numState == 15 && nextState == 79 && (motivo_cancelamento != '' && motivo_cancelamento != null)) || (numState == 48 && nextState == 53 && (motivo_cancelamento != '' && motivo_cancelamento != null))) {
				FLUIGC.toast({
		            message: 'Cancelamento Efetuado com sucesso!',
		            type: 'success'
		        });
				//alert('Cancelamento Efetuado com sucesso!')
				return true;
			} else {
				alert( "Uma copia do orcamento sera enviado para seu e-mail e para o e-mail informado no orcamento." );	
				return true;
			}
		}
	}else{
		alert( 'Existem inconsistencias no preenchimento do orcamento' );
		return false;
	}
}

function autoSize(){		
	$('textarea').each(function () {
		  this.setAttribute('style', 'height:' + (this.scrollHeight + 32 ) + 'px;overflow-y:hidden;');
	}).on('input', function () {
		//style="height: 32px; overflow-y: hidden;"
		  this.style.height = 'auto';
		  this.style.height = (this.scrollHeight) + 'px';
	});
}


function setCorFilhos( id, color ){
	//console.log('entrei color',id);
	$( 'div, span', $( '#'+id+'_grp' ) ).each( function () {
		//console.log('entrei grupo color', $(this).attr('class') );
		if( $(this).hasClass('bootstrap-tagsinput') /*|| $(this).hasClass('select2-selection--multiple') */ ){
			$( $(this) ).css({'background-color' : color });
		}
	});
}

function validaAba( aba ){
	
	if( $( "#modo").val() == "VIEW" ){
		return true;
	}
	
	var msg = '';
	var msg_valida = '';

	setFocus = true;
	
	if ( aba == 2 ){
		if ( qtdItens() == 0 ){
			msg += 'N&atilde;o existe itens no or&ccedil;amento! ';
		}
		if ( $('#cod_item_edit').val() != "" || $('#quantidade_edit').val() != "" || $('#desconto_edit').val() != "" ){
			msg += 'Existe item em edi&ccedil;&atilde;o! ';
		}
	}
	
	
	$( 'input, select', $('#aba_'+aba) ).each(function () {
		
		if ( ( $(this).attr( 'pf' ) != "S" 
		  || ( $(this).attr( 'pf' ) == "S" && $(this).attr( 'name' ).indexOf('___') != -1 ) )
			//&& !$(this).attr( 'readonly' ) 
					){
		
			//$( '#'+$(this).attr('id') ).css({'background-color' : '#FFFFFF'});
			//setCorFilhos( $(this).attr('id'), '#FFFFFF' );
			
			console.log( 'ATR Valida......',$(this).attr( 'valida' ) );
			if ( $(this).attr( 'valida' ) != undefined  
				&& $(this).attr( 'valida' ) != "" 
				&& ( $(this).val() == "" || $(this).val() == null || $(this).val() == undefined )
			){

				$( $(this) ).css({'background-color' : '#FFFFFF'});
				setCorFilhos( $(this).attr('id'), '#FFFFFF' );
				//############
							//############
				if (!( ( aba == 1 && $('#tipo_cadastro').val() == 'E' && $(this).attr( 'id' ) == 'razao_social' )  )
				){
					$( $(this) ).css({'background-color' : '#FFE4C4'});
					setCorFilhos( $(this).attr('id'), '#FFE4C4' );
					msg += ' '+$(this).attr( 'valida' );
						
					if ( setFocus ){
						setFocus = false;
						//$(this).focus();
						console.log('ID......'+ $(this).attr('id') );
						setTimeout("$('#"+$(this).attr('id')+"').focus();",1);
					}
				}
			}
								
			if( aba == 3 
			 && $(this).attr( 'id' ) == 'cei' 
			 && $.inArray(  $('#cod_tip_cli').val(), getListaTipoCliente() ) > -1 
			 && $(this).val() == '' ) {
					console.log('ENTREEEIII NO CEI.........');
					$( $(this) ).css( {'background-color' : '#FFE4C4'} );
					setCorFilhos( $(this).attr('id'), '#FFE4C4' );
					msg_valida += ' Tipo de cliente obriga informar CEI!';				
			}

			if( aba == 3 
			 && $(this).attr( 'id' ) == 'ped_cliente' 
			 && $('#ies_inf_pedido').val() == 'S'
			 && $(this).val() == '' ) {
					console.log('ENTREEEIII NO CEI.........');
					$( $(this) ).css( {'background-color' : '#FFE4C4'} );
					setCorFilhos( $(this).attr('id'), '#FFE4C4' );
					msg_valida += ' Este cliente obriga informar o n&uacute;mero de pedido!';
			}
			
			if( aba == 3
			 && $(this).attr( 'id' ) == 'tipo_desconto' 
			 && $('#pct_desc_adicional').val() != "" && $('#pct_desc_adicional').val() != "0,00"
			 &&	$(this).val() == '' ) {
					console.log('ENTREEEIII NO CEI.........');
					$( $(this) ).css( {'background-color' : '#FFE4C4'} );
					setCorFilhos( $(this).attr('id'), '#FFE4C4' );
					msg_valida += ' Deve ser informado tipo de desconto!';
			}		
			
			if( aba == 1 
			 && ( $('#acao').val() == 'P' || $('#simulacao').val() == 'S' )
			 && ( $(this).attr( 'id' ) == "nat_operacao" )
			 && $(this).val() == '' ){
				console.log('ENTREEEIII NO CEI.........');
				$( $(this) ).css( {'background-color' : '#FFE4C4'} );
				setCorFilhos( $(this).attr('id'), '#FFE4C4' );
				msg_valida += ' Deve ser informado a natureza de operação!';
			}
				
			if ( $(this).val() != '' ){
				if ( $(this).attr( 'regra' ) == 'cnpjcpf' ) {
					var valido = false;
					var tipo = '';
					if( $(this).val().indexOf('/0000-') == -1  ){
						console.log(  'CNPJ...'+ $(this).val() +' '+$(this).val().substring(1) );
						valido = validaCNPJ( $(this).val().substring(1) );
						tipo = 'CNPJ';
					}else{
						console.log(  'CPF...'+ $(this).val() +' '+$(this).val().replace('/0000-','') );
						valido = validaCPF( $(this).val().replace('/0000-','') );
						tipo = 'CPF';
					}
					if ( !valido ){
						$( $(this) ).css({'background-color' : '#FFA500'});
						setCorFilhos( $(this).attr('id'), '#FFA500' );
						msg_valida += ' '+tipo+' Inv&aacute;lido!';
					}
				}
				
				if ( $(this).attr( 'regra' ) == 'cnpj' 
					&& !validaCNPJ( $(this).val() ) ){
						$( $(this) ).css({'background-color' : '#FFA500'});
						setCorFilhos( $(this).attr('id'), '#FFA500' );
						msg_valida += ' CNPJ Inv&aacute;lido!';
				}

				if ( $(this).attr( 'regra' ) == 'cpf' 
					&& !validaCPF( $(this).val() ) ){
						$( $(this) ).css({'background-color' : '#FFA500'});
						setCorFilhos( $(this).attr('id'), '#FFA500' );
						msg_valida += ' CPF Inv&aacute;lido!';
				}
			
				if ( $(this).attr( 'regra' ) == 'cep' 
					&& !validaCEP( $(this).val() ) ){
						$( $(this) ).css({'background-color' : '#FFA500'});
						setCorFilhos( $(this).attr('id'), '#FFA500' );
						msg_valida += ' CEP Inv&aacute;lido!';
				}
 
				if ( $(this).attr( 'regra' ) == 'email' 
					&& !validaEmail( $(this).val() ) ){
						$( $(this) ).css({'background-color' : '#FFA500'});
						setCorFilhos( $(this).attr('id'), '#FFA500' );
						msg_valida += ' E-Mail Inv&aacute;lido!';
				}
				
					if ( $(this).attr( 'regra' ) == 'ie'  
					&& !validaIE( $(this).val(), $('#'+$(this).attr( 'campoEstado' ) ).val() ) ){
						$( $(this) ).css({'background-color' : '#FFA500'});

						setCorFilhos( $(this).attr('id'), '#FFA500' );
						msg_valida += ' Inscri&ccedil;&atilde;o Estadual Inv&aacute;lido!';
				}
				
				if ( msg_valida != '' && setFocus ){
						setFocus = false;
						//$(this).focus();
						setTimeout("$('#"+ $(this).attr( 'id' ) +"').focus();",1);
				}
				
			}
		}			
	});
				
	if ( msg != "" || msg_valida != "" ){
		if ( msg != "" ){
			
			FLUIGC.toast({
				title: 'Preenchimento: ',
				message: 'Voc&ecirc; deve informar os campos: '+msg,
				type: 'warning',
				timeout: 'slow'
			});
		}
		
		if ( msg_valida != "" ){
			FLUIGC.toast({
				title: 'Valida&ccedil;&atilde;o: ',
				message: msg_valida,
				type: 'warning',
				timeout: 'slow'
			});
		}			
		
		return false;	
	}
		
	
	if ( aba == 1 && $('#tipo_cadastro').val() == 'N' && validaExistCNPJ( $('#cnpj').val() ) && ($('#task').val() == 0 || $('#task').val() == 1 )){
		
		var msgTipo = '';
		
		if( $('#cnpj').val().indexOf('/0000-') == -1  ){
			msgTipo = 'CNPJ j&atilde; cadastrado!!';
		}else{
			msgTipo = 'CPF j&atilde; cadastrado!!';
		}
		
		FLUIGC.toast({
				title: 'Valida&ccedil;&atilde;o: ',
				message: msgTipo,
				type: 'danger',
				timeout: 'slow'
			});	
		return false;
	}
	
	
	return true;
}

function loadBody(){
	
	$('#current_step').html( aba );
	$('#total_steps').html( abaTotal );
	
	var data_coleta = FLUIGC.calendar('#data_coleta');
	var data_entrega_edit = FLUIGC.calendar('#data_entrega_edit');
	var data_entrega_edit = FLUIGC.calendar('#data_prevista');
	
	
	$('#tipo_cadastro_hd').val( $("#tipo_cadastro").val() );
	
	//if( $("#tipo_cadastro").val() == "R" ){
	//	$('#simulacao option:not(:selected)').prop('disabled', true);
	//}
	
	autoSize();		
	
	console.log( 'set lista 001',$("#lista_preco").val() );
	console.log( 'set lista 001',$("#lista_preco_hd").val() );

		
	$('#etapa').val( aba );
	$('#total_steps').html( abaTotal );
	
	$('#linha_edit').val( '0' );
		
	$('.decimal_6').maskMoney( { precision:6, thousands:'.',decimal:',', defaultZero:true, allowZero:true } );
	$('.decimal_5').maskMoney( { precision:5, thousands:'.',decimal:',', defaultZero:true, allowZero:true} );
	$('.decimal_4').maskMoney( { precision:4, thousands:'.',decimal:',', defaultZero:true, allowZero:true} );
	$('.decimal_3').maskMoney( { precision:3, thousands:'.',decimal:',', defaultZero:true, allowZero:true} );
	$('.decimal_2').maskMoney( { precision:2, thousands:'.',decimal:',', defaultZero:true, allowZero:true} );
	$('.decimal_1').maskMoney( { precision:1, thousands:'.',decimal:',', defaultZero:true, allowZero:true} );
	$('.decimal_0').maskMoney( { precision:0, thousands:'.',decimal:',', defaultZero:true, allowZero:true} );
	$('.integer_0').maskMoney( { precision:0, thousands:'',decimal:'', defaultZero:true, allowZero:true} );	
	
	
	if( $('#ped_representante').val != "0" ){
		loadRepresCompl( $('#cod_repres').val(), $('#cod_cliente').val(), $('#cod_moeda').val(), 'TT', $('#tipo_cliente_hd').val() );
									
		if( ( $('#task').val() == '42' &&  $('#ies_desc_medio_reg').val() == 'S' )
		 || ( $('#task').val() == '44' &&  $('#ies_desc_medio_nac').val() == 'S' ) ){
			$('#desc_medio').css( {'background-color' : '#FF7F50'} );
		 }
		 
		if( ( $('#task').val() == '42' &&  $('#ies_mix_geral_reg').val() == 'S' )
		 || ( $('#task').val() == '44' &&  $('#ies_mix_geral_nac').val() == 'S' ) ){
			$('#mix_geral').css( {'background-color' : '#FF7F50'} );
		 }
	}
	
	
	$(".validaAltera").focus(function(){
		console.log( 'entrei validaAltera focus' );
		valAtu = this.value;
	});

	$(".validaAltera").blur(function(){
		console.log( 'entrei validaAltera blur' );
	    if ( valAtu != this.value )
	    {
	    	$('#seq_end').val( "0" );
	    	$('#orcamento_alterado').val( "S" );
	    }
	    valAtu = "";
	});

	$(".validaAltera").change(function(){
		console.log( 'entrei validaAltera change' );
	    if ( valAtu != this.value )
	    {
	    	$('#seq_end').val( "0" );
	    	$('#orcamento_alterado').val( "S" );
	    }
	    valAtu = "";
	});	
	
	trataGer();
		
	//loading.show();
	console.log( 'entrei else' );
	setTimeout("setFilterCliente( 0 );",10);
	
	alteraCampos('ies_bairro_ent_manual', 'bairro_ent_sel', 'bairro_ent');
	
	$('#perc_comis_adic_edit').val("");
	$('#val_comis_adic_edit').val("");
	//loadDataSetCombo('motivo_cancelamento', 'motivos_cancelamento', 'cod_motivo_cancelamento', 'desc_motivo_cancelamento', '', '', '', '', '', '', "N", "S");
	
	if( $('#ies_end_entrega').val() == "S" ){
		$('#btCopyEndereco').show();
	}else{
		$('#btCopyEndereco').hide();
	}
	
	trataCamposPF();
	
	setTipoFormulario( "load" );
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

//function setFilterCliente( qtd ){
	//console.log('TIPO_CADASTRO_DE_USUARIO1',$('#tipoCadUser').val());
	//console.log( 'setFilterCliente..... 1', qtd, $('#razao_social_zoom').val() );
	//if ( qtd >= 10000 || 
		//( qtd == 0 && $('#razao_social_zoom').val() != "" && $('#razao_social_zoom').val() != null && $('#razao_social_zoom').val() != undefined ) ){
		//console.log('PRIMEIRO IF.....', $('#razao_social_zoom').val() );
		//loading.hide();
		//return false;
	//}
	//try{
		//loading.show();
		//if( $( "#modo").val() != 'VIEW'  ){
			//if ( $('#razao_social_zoom').val() == "" || $('#razao_social_zoom').val() == null /* && $('#processo').val() != 'alt_pedido' */ ){
				//console.log( "filter ......IES_PEDIDO,S,COD_USER,"+$("#userFluig").val() );
				//reloadZoomFilterValues('razao_social_zoom', "IES_PEDIDO,S,COD_USER,"+$("#userFluig").val() );
			//}else if ( $('#processo').val() == 'alt_pedido' ){
				//console.log('DISABLE CAMPO.......');
				//zoomDestino = window[$("#razao_social_zoom").attr('filter-instance')];			
				//zoomDestino.disable(true);
			//}
			//setFilterCidade( 'cidade', 'userFluig', 'cod_repres' );	
			//reloadZoomFilterValues("cidade", "cod_user,"+$("#userFluig").val() );
		//}
		//setTipoFormulario( 'load' );
		//console.log('ANTES UPPER');
		//setUpper();
		//console.log('TIPO CLIENTE,,,,,,,,,,,,,,');
		//var tipoCli = $('#tipo_cliente').val();
		//console.log('TIPO CLIENTE,,,,,,,,,,,,,,',tipoCli);
		//loadTipoClient( $('#userFluig').val(), 'tipo_cliente' );
		//$('#tipo_cliente').val( tipoCli );
		//loading.hide();
	//}catch( e ){
		//console.log( 'erro.....',qtd,e );
		//qtd += 1;
		//setTimeout("setFilterCliente( "+ qtd +" );",10);
	//}
//}

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
		} if ($('#tipoCadUser').val() == 'G') {
			console.log('TIPO_CADASTRO_DE_USUARIO2', $('#tipoCadUser').val());
			reloadZoomFilterValues("razao_social_zoom","COD_USER_GERENTE,"+$("#userFluig").val() );
		} else {
			console.log('Tipo .......', $('#processo').val());
			if ($('#razao_social').val() == "" || $('#razao_social').val() == null) {
				console.log("filter ......IES_PEDIDO,S,COD_USER,"+ $("#userFluig").val());
				reloadZoomFilterValues('razao_social_zoom', "IES_PEDIDO,S,COD_USER,"+$("#userFluig").val());
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

function setFilterCidade( campoCid, campoUser, compoRepres ){			
	console.log( 'USER.....'+$("#"+campoUser).val() );
	console.log( 'REPRES.....'+$("#"+compoRepres).val() );
	
	if (campoUser == '' && compoRepres == '') {
		//inicia tratativa do tipo de cliente que pode selecionar todas as cidades	
			console.log('ENTROU NO VAZIO');
			if ($('#per_sel_cidades').val() == 'S'){
				console.log('posso ocultar');
				reloadZoomFilterValues(campoCid, '','');
			}
			//fim tratativa do tipo de cliente que pode selecionar todas as cidades
		} else {
			reloadZoomFilterValues(campoCid, "cod_user,"+$("#"+campoUser).val()+",cod_repres,"+$("#"+compoRepres).val() );
		}	
}


function setUpper(){
	
	$("input").keypress( function(e) {
        var chr = String.fromCharCode(e.which);
		console.log( e, e.target.getAttribute("regra") );
		if ( e.target.getAttribute("regra") == "email" 
		  && "'\"!#$%¨&*()+=\+´`[]{}/?:>,<\|~?^".indexOf(chr) > 0 ){
			console.log( ' email..... ',chr );
			return false;
		}else if ( e.target.getAttribute("regra") != 'email' 
				&&"'\"!#$%¨&*()+=\+´`[]{}/?;:.>,<\|~?^@_-".indexOf(chr) > 0 ){
			console.log( ' controle..... ',chr );
			return false;
        }
     });
	
	$("input").keyup(function(){
		$(this).val($(this).val().toUpperCase());
	});
}

function maskFone( id ){
	if($('#'+id).val().length > 14 ) {  
		$('#'+id).unmask();
		$('#'+id).mask("(99) 99999-9999");  
	} else {  
		$('#'+id).unmask();
		$('#'+id).mask("(99) 9999-9999?9");  
	} 
}

function mascara(src, mask){
	var i = src.value.length;
	var saida = mask.substring(0,1);
	var texto = mask.substring(i);
	if (texto.substring(0,1) != saida){
		src.value += texto.substring(0,1);
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
			

function setCodCliente( id ){
	$('#cod_cliente').val( $('#'+id).val().replace('.','').replace('.','').replace('/','').replace('-','') );
	console.log('CNPJ.....', $('#'+id).val() );
	console.log('COD CLIENTE.....', $('#cod_cliente').val( ) );
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

function setIsento( idCampo, idCampoIE, idCampoUF ){
	console.log( 'IE_________' );
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
			console.log( 'IE_________' );
			$( '#'+idCampoIE ).val('');
			setMaskIE( $('#'+idCampoUF).val(), idCampoIE );
		}else{
			var tmp = $( '#'+idCampoIE ).val();
			setMaskIE( $('#'+idCampoUF).val(), idCampoIE );
			console.log( 'IE_________'+tmp );
			$( '#'+idCampoIE ).val( tmp );
		}
		
	}
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

function setMaskIE( uf, id ){
		$('#'+id).unmask();
		$('#'+id).val('');
		if ( mascaraIE.hasOwnProperty(uf) )
			$('#'+id).mask( mascaraIE[uf] );  
}


function isNull( valor, padrao ){
	if ( isNaN( valor ) ){
		return padrao;
	}else{
		return valor;
	}
}


function removeLote(){
	if( $('#cod_item_edit').val() == "" ){
		return false;
	}
	var quant = isNull( Math.round( parseFloat( $('#quantidade_edit').val().replace(/\./g,'').replace(/\,/g,'.') ) * 100 ) / 100, 0 );
	var quant_mult = isNull( Math.round( parseFloat( $('#qtd_pad_edit').val().replace(/\./g,'').replace(/\,/g,'.') ) * 100 ) / 100, 1 );
	if ( quant <= 0 ){
		return false;
	}
	$('#quantidade_edit').val( String( (quant - quant_mult ).toFixed(2) ).replace('.',',') );
	calcDescTotal( 'quantidade_mais' );
	if ( quant - quant_mult <= 0 ){
		$('#quantidade_edit').val("");
	}
}

function addLote(){
	if( $('#cod_item_edit').val() == "" ){
		return false;
	}
	var quant = isNull( Math.round( parseFloat( $('#quantidade_edit').val().replace(/\./g,'').replace(/\,/g,'.') ) * 100 ) / 100, 0 );
	var quant_mult = isNull( Math.round( parseFloat( $('#qtd_pad_edit').val().replace(/\./g,'').replace(/\,/g,'.') ) * 100 ) / 100, 1 );
	$('#quantidade_edit').val( String( (quant + quant_mult).toFixed(2) ).replace('.',',') );
	calcDescTotal( 'quantidade_menus' );
}

function fieldFloat( id, padrao ){
	return isNull( Math.round( parseFloat( $('#'+id).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, padrao );
}

function atuComissAdicional(){
	
	
	var val_liq_total = fieldFloat('valor_total_edit',0);
	var quant = fieldFloat('quantidade_edit',0);
	
	var percComissAdic = fieldFloat('perc_comis_adic_edit',0);
	var valComissAdic = valComissAdic = val_liq_total * percComissAdic / 100;
	
	$('#val_comis_adic'+seq).val( formatNumber( valComissAdic , 2 ) );
	
	
	var lob = fieldFloat('val_rol_edit',0)
			- fieldFloat('custo_edit',0)
			- fieldFloat('val_finac_edit',0)
			- fieldFloat('custo_trans_edit',0)
			- fieldFloat('val_comis_edit',0)
			- valComissAdic
			- fieldFloat('val_royaltie_edit',0)
			- fieldFloat('val_acordo_edit',0)
			- fieldFloat('val_verba_edit',0);
	
	$('#val_lob'+seq).val( formatNumber( lob / quant, 2 ) );
	$('#val_lob_total'+seq).val( formatNumber( lob, 2 ) );
	$('#val_lob_ton'+seq).val( formatNumber( lob / quant * 1000 , 2 ) );
	$('#val_lob_perc'+seq).val( formatNumber( lob / val_liq_total * 100, 2 ) );			
			
}

function calcDescTotal( id ){

	console.log('Calculo....AAAA....',id,' valor ',$('#desconto_edit').val() );
	
	if( $('#cod_item_edit').val() == "" ){
		$('#quantidade_edit').val( "" );
		$('#desconto_edit').val("");
		$('#valor_unit_edit').val("");
	}else{
		if ( $('#desconto_edit').val() == "" ){
			$('#desconto_edit').val("0,00");
		}
	}
	
	
	if ( id.indexOf( '___' ) < 0 ){
		seq = '_edit';
	}else{
		seq = '___'+id.split('___')[1];
	}
	
	console.log('Calculo....BBBB.....','#valor_unit_lista'+seq,$('#valor_unit_lista'+seq).val() );

	var val_lista = isNull( Math.round( parseFloat( $('#valor_unit_lista'+seq).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
	var val_item = isNull( Math.round( parseFloat( $('#valor_unit'+seq).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
	var perc_desc_tab = isNull( Math.round( parseFloat( $('#pct_desc_adic'+seq).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
	var perc_desc = isNull( Math.round( parseFloat( $('#desconto'+seq).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
	var perc_desc_ped = isNull( Math.round( parseFloat( $('#pct_desc_adicional').val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
	var quant = isNull( Math.round( parseFloat( $('#quantidade'+seq).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
	var cubagem = isNull( Math.round( parseFloat( $('#cubagem'+seq).val().replace(/\./g,'.') ) * 10000 ) / 10000, 0 );
	var peso = isNull( Math.round( parseFloat( $('#peso'+seq).val().replace(/\./g,'.').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
	var quant_mult = isNull( Math.round( parseFloat( $('#qtd_pad'+seq).val().replace(/\./g,'.').replace(/\,/g,'.') ) * 10000 ) / 10000, 1 );
	var val_liq = 0;
	
	/*if ( id == 'desconto_edit' ){
		$('#valor_unit_edit').val( String( ( val_lista
										 - ( val_lista 
										   * perc_desc / 100 ) ).toFixed(3) ).replace('.',',') );
	} else*/
	if ( id == 'valor_unit_edit' ){
		if ( val_lista > val_item ){
			FLUIGC.toast({
					title: 'Pre&ccedil;o: ',
					message: 'Pre&ccedil;o Unit&aacute;rio nao pode ser inferior a R$: '+String( val_lista.toFixed(3) ).replace('.',','),
					type: 'warning',
					timeout: 'fast'
			});
			//$('#valor_unit_edit').focus();
			setTimeout("$('#valor_unit"+seq+"').focus();",1);
			return false;
		}
	}
	
	console.log( 'Teste ', quant % quant_mult );	
	
	if ( id == "quantidade_edit" ){
		var teste_divisao = quant / quant_mult;
		if (!Number.isInteger(teste_divisao)){
			
			//$('#quantidade_edit').focus();
			setTimeout("$('#quantidade_edit').focus();",1);
			 console.log('teste da quantidate 2',quant,' ',quant_mult);
			FLUIGC.toast({
					title: 'Quantidade: ',
					message: 'A quantidade deve ser multiplo de: '+String( quant_mult.toFixed(2) ),
					type: 'warning',
					timeout: 'fast'
			});
			return false;
		}
	}
	
	var val_calc = val_item - ( val_item * perc_desc_ped / 100 );
	val_calc = val_calc - ( val_calc * perc_desc / 100 );
	console.log('VAL CALC ',val_calc);
	val_calc = parseFloat((val_calc).toFixed(4));
	console.log('VAL CALC ',val_calc);
	val_liq = val_calc;
		

	$('#valor_unit_liq_edit').val( String((val_liq).toFixed(4)).replace('.', ','));
	console.log('VAL LIQ ',val_liq);
	console.log('VAL LIQ ',$('#valor_unit_liq_edit').val());	

	var val_bruto = val_item;
	var val_minimo = val_item - (  val_item * perc_desc_tab / 100 );	
	var val_liq_total = val_calc * quant;
	$('#valor_total'+seq).val( formatNumber( val_liq_total, 3) );
	
	if( val_liq_total > 0 ){
		
		$('#linha_edit').val()
		
		var peso_total = peso * quant;
		
		/*$( "input[name^='cod_item___']" ).each( function () {
			
			var seq = $(this).attr('id').split('___')[1];
		
			if( $('#linha_edit').val() != seq ){
				console.log ('entrou no calco do peso de novo!');
				var quant_seq = isNull( Math.round( parseFloat( $('#quantidade___'+seq).val().replace('.','').replace(',','.') ) * 10000 ) / 10000, 0 );
				var peso_seq = isNull( Math.round( parseFloat( $('#peso___'+seq).val().replace('.','').replace(',','.') ) * 10000 ) / 10000, 0 );
				peso_total += peso_seq * quant_seq; 
			} 
		});*/
		
		/*if ($('#uso_consumo').val() == 'S') {
			$('#ies_finalidade').val('3');
		} else */
		
		//ajusta a finalidade
			if ($('#ies_isento_ie').val() == 'S') {
				$('#ies_finalidade').val('2');
			} else if ($('#uso_consumo').val() == 'S') {
				$('#ies_finalidade').val('3');
			}else {
				$('#ies_finalidade').val('1');
			}
		
		var cotacao = isNull( Math.round( parseFloat( $('#cotacao').val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 1 );
		if( isNaN(cotacao) || cotacao == 0 || cotacao == "" ){
			cotacao = 1;
		}
		
		val_liq_total = val_liq_total * cotacao;
		
		var constraints = new Array();
		console.log('peso total frete ',peso_total);
		console.log('cubagem calcdesctotal ',cubagem );
		
		constraints.push(DatasetFactory.createConstraint("ies_isento_ie", 	$('#ies_isento_ie').val(), 		null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("uso_consumo",   	$('#uso_consumo').val(), 		null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cod_cliente",   	$('#cod_cliente').val(), 		null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cod_transportador",   	$('#cod_trans').val(), 		null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cod_tipo_cliente", $('#tipo_cliente').val(), 		null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cond_pagamento", 	$('#cond_pagamento').val(), 	null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cod_repres", 		$('#cod_repres').val(), 		null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cod_empresa", 	$('#empresa').val(), 			null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("uf", 				$('#estado_ent').val(), 		null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cod_item", 		$('#cod_item'+seq).val(), 		null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("nat_operacao", 	$('#nat_operacao').val(), 		null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cod_tipo_carteira", '01', 						null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("valor_total", 	val_liq_total,					null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("quantidade", 		quant,  						null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("peso_total", 		peso_total,  					null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cubagem_total",   cubagem, 					null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("tipo_frete_logix", $('#tipo_frete_logix').val(),  null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cod_cidade_ent",   $('#cod_cidade').val(),  		null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("finalidade",   $('#ies_finalidade').val(),  		null, ConstraintType.MUST));
		
		//if( $('#simulacao').val() == "S" ){
			constraints.push(DatasetFactory.createConstraint("tipo",   	'S',  		null, ConstraintType.MUST));
		//}else{
		//	constraints.push(DatasetFactory.createConstraint("tipo",   	'I',  		null, ConstraintType.MUST));
		//}
		
		var dataset = DatasetFactory.getDataset('dsk_calc_lob', null, constraints, null);
		if( dataset.values.length > 0 ) {
			
			var value = dataset.values[0];
			
			$('#val_icms'+seq).val( formatNumber( parseFloat( value['icms'] ), 2 ) );
			$('#perc_icms'+seq).val( formatNumber( parseFloat( value['icms'] ) / val_liq_total * 100 , 2 ) );
			
			$('#val_pis'+seq).val( formatNumber( parseFloat( value['pis'] ), 2 ) );
			$('#perc_pis'+seq).val( formatNumber( parseFloat( value['pis'] ) / val_liq_total * 100 , 2 ) );
			
			$('#val_cofins'+seq).val( formatNumber( parseFloat( value['cofins'] ), 2 ) );
			$('#perc_cofins'+seq).val( formatNumber( parseFloat( value['cofins'] ) / val_liq_total * 100 , 2 ) );
			
			$('#val_ipi'+seq).val( formatNumber( parseFloat( value['ipi'] ), 2 ) );
			$('#perc_ipi'+seq).val( formatNumber( parseFloat( value['ipi'] ) / val_liq_total * 100 , 2 ) );
			
			$('#val_st'+seq).val( formatNumber( parseFloat( value['st'] ), 2 ) );
			$('#perc_st'+seq).val( formatNumber( parseFloat( value['st'] ) / val_liq_total * 100 , 2 ) );
			
			var rob = val_liq_total + isNull( parseFloat( value['st'] ), 0 ) - isNull( parseFloat( value['ipi'] ), 0 );
			var rol = val_liq_total - isNull( parseFloat( value['icms'] ), 0 ) - isNull( parseFloat( value['pis'] ), 0 ) - isNull( parseFloat( value['cofins'] ), 0 ); 
			
			$('#val_rol'+seq).val( formatNumber( rol, 2 ) );
			$('#perc_rol'+seq).val( formatNumber( rol / val_liq_total * 100 , 2 ) );

			//if( $('#simulacao').val() == "S" ){
				var pctCustFin = parseFloat( value['pct_custo_financ'] );
				var przMedio = parseFloat( value['prazo_medio'] );
				if( isNaN( pctCustFin ) ){
					pctCustFin = 0;
				}
				if( isNaN( przMedio ) ){
					przMedio = 0;
				}
				
				var custo = parseFloat( value['custo'] ) + ( parseFloat( value['custo'] ) * pctCustFin / 100 );
				
				$('#custo'+seq).val( formatNumber( custo, 2 ) );
				$('#perc_custo'+seq).val( formatNumber( custo / val_liq_total * 100 , 2 ) );
	
				$('#custo_trans'+seq).val( formatNumber( parseFloat( value['custo_trans'] ), 2 ) );
				$('#perc_trans'+seq).val( formatNumber( parseFloat( value['custo_trans'] ) / val_liq_total * 100 , 2 ) );
	
				$('#val_comis'+seq).val( formatNumber( parseFloat( value['comis'] ), 2 ) );
				$('#perc_comis'+seq).val( formatNumber( parseFloat( value['comis'] ) / val_liq_total * 100 , 2 ) );
				 
				if( $('#perc_comis_adic'+seq).val()== "" ){
					$('#perc_comis_adic'+seq).val("0,00");
				}
				var percComissAdic = isNull( Math.round( parseFloat($('#perc_comis_adic'+seq).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
				var valComissAdic = val_liq_total * percComissAdic / 100;
				
				$('#val_comis_adic'+seq).val( formatNumber( valComissAdic , 2 ) );
							
				$('#val_royaltie'+seq).val( formatNumber( parseFloat( value['royaltie'] ), 2 ) );
				$('#perc_royaltie'+seq).val( formatNumber( parseFloat( value['royaltie'] ) / val_liq_total * 100 , 2 ) );
				
				$('#val_acordo'+seq).val( formatNumber( parseFloat( value['acordo_comerc'] ), 2 ) );
				$('#perc_acordo'+seq).val( formatNumber( parseFloat( value['acordo_comerc'] ) / val_liq_total * 100 , 2 ) );
	
				$('#val_verba'+seq).val( formatNumber( parseFloat( value['verb_mark'] ), 2 ) );
				$('#perc_verba'+seq).val( formatNumber( parseFloat( value['verb_mark'] ) / val_liq_total * 100 , 2 ) );
	
				var custo_finac = ( val_liq_total * pctCustFin / 100 ) / 30 * przMedio;
				
				$('#val_finac'+seq).val( formatNumber( custo_finac, 2 ) );
				$('#perc_finac'+seq).val( formatNumber( custo_finac / val_liq_total * 100, 2 ) );
				
				
				var lob = rol - custo - custo_finac 
						- parseFloat( value['custo_trans'] ) 
						- parseFloat( value['comis'] ) 
						- parseFloat( value['royaltie'] ) 
						- parseFloat( value['acordo_comerc'] ) 
						- parseFloat( value['verb_mark'] )
						- valComissAdic;
				
				$('#val_lob'+seq).val( formatNumber( lob / quant, 2 ) );
				$('#val_lob_total'+seq).val( formatNumber( lob, 2 ) );
				$('#val_lob_ton'+seq).val( formatNumber( lob / quant * 1000 , 2 ) );
				$('#val_lob_perc'+seq).val( formatNumber( lob / val_liq_total * 100, 2 ) );
						
				$('#adic_tipo_venda').val( formatNumber( parseFloat( value['adic_tipo_venda'] ), 2 ) );
				
	//			newDataset.addColumn( 'frete_cif' );
				if( parseFloat( value['frete_cif'] ) > 0 ){
					$('#vlr_frete_total').val( formatNumber( parseFloat( value['frete_cif'] ) + ( rob * parseFloat( value['adic_tipo_venda'] ) / 100  ), 2 ) );	
				}else{
					$('#vlr_frete_total').val( "0,00" );
				}
				
				$('#custo_aditivo'+seq).val( formatNumber( parseFloat( value['custo_aditivo'] ), 2 ) );
				$('#custo_agregado'+seq).val( formatNumber( parseFloat( value['custo_agregado'] ), 2 ) );
				$('#custo_cimento'+seq).val( formatNumber( parseFloat( value['custo_cimento'] ), 2 ) );
				$('#custo_embalagem'+seq).val( formatNumber( parseFloat( value['custo_embalagem'] ), 2 ) );
				$('#custo_materia_prima'+seq).val( formatNumber( parseFloat( value['custo_materia_prima'] ), 2 ) );
				$('#custo_material_secundario'+seq).val( formatNumber( parseFloat( value['custo_material_secundario'] ), 2 ) );
				$('#custo_material_revenda'+seq).val( formatNumber( parseFloat( value['custo_material_revenda'] ), 2 ) );
				$('#custo_servico_terceiro'+seq).val( formatNumber( parseFloat( value['custo_servico_terceiro'] ), 2 ) );
				$('#custo_embalagem_logistica'+seq).val( formatNumber( parseFloat( value['custo_embalagem_logistica'] ), 2 ) );
				$('#custo_transferecia'+seq).val( formatNumber( parseFloat( value['custo_transferecia'] ), 2 ) );
				$('#verba_marketing'+seq).val( formatNumber( parseFloat( value['verba_marketing'] ), 2 ) );
				$('#acordo_comercial'+seq).val( formatNumber( parseFloat( value['acordo_comercial'] ), 2 ) );
				$('#verba_rapel'+seq).val( formatNumber( parseFloat( value['verba_rapel'] ), 2 ) );
				$('#verba_cross_dock'+seq).val( formatNumber( parseFloat( value['verba_cross_dock'] ), 2 ) );

			//}			
		}
		
	}
	
	if ( id == "grava_edit" && $("#sequencia_edit").val() == "" ){
		
		if ( ( val_calc * quant ) < 0.001 ){
				
				if ( quant == 0 ){
					setTimeout("$('#quantidade_edit').focus();",1);
				}else{
					setTimeout("$('#desconto_edit').focus();",1);
				}
				 
				FLUIGC.toast({
						title: 'Valor Total: ',
						message: 'Valor total do item n&atilde;o pode ser zerado.',
						type: 'warning',
						timeout: 'fast'
				});
				return false;
		}
	}
	
	return{ 'total_liquido':val_calc * quant, 'total_bruto':val_bruto * quant, 'total_minimo':val_minimo * quant };
	
}


function gravaItem( table, alteraMotivo ){
	
	if( $('#cod_item_edit').val() == "" || !calcDescTotal( 'grava_edit' ) ){
		return false;
	}

	$('#orcamento_alterado').val( 'S' );
	
	var total = isNull( Math.round( parseFloat( $('#valor_total_edit').val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
	if( $('#sequencia_edit').val( ) == "" && total == 0 ){
		FLUIGC.toast({
			title: 'Valida&ccedil;&atilde;o: ',
			message: 'Item com valor zerado.',
			type: 'warning',
			timeout: 'fast'
		});
		setTimeout("$('#cod_item_edit').focus();",1);
		return false;
	}
	
	if ( $('#ies_inf_pedido').val() == 'N' 
	  && ( $('#linha_edit').val() == null
	    || $('#linha_edit').val() == undefined
	    || $('#linha_edit').val() == ""
	    || $('#linha_edit').val() == "0" ) ){
		var duplicado = 'N';
		$( "input[name^='cod_item___']" ).each( function () {
			console.log('Item...', $(this).val() );
			if ( $(this).val() == $('#cod_item_edit').val() ){
				FLUIGC.toast({
					title: 'Valida&ccedil;&atilde;o: ',
					message: 'N&atilde;o &eacute; permitido informar item duplicado',
					type: 'warning',
					timeout: 'fast'
				});
				duplicado = 'S';
				setTimeout("$('#cod_item_edit').focus();",1);
				return false;
			}
		});
		if ( duplicado == 'S' ){
			setTimeout("$('#cod_item_edit').focus();",1);
			return false;
		}
	}

	if ( $('#ies_inf_pedido').val() == 'S' ){
		var msg = "";
		if ( $('#pedido_cli_edit').val() == "" ){
			$( $('#pedido_cli_edit') ).css( {'background-color' : '#FFE4C4'} );
			msg += ' N&uacute;mero de pedido n&atilde;o informado!';
			setTimeout("$('#pedido_cli_edit').focus();",1);
		}else{
			$( $('#pedido_cli_edit') ).css( {'background-color' : '#FFFFFF'} );
		}
		if ( $('#seq_pedido_cli_edit').val() == "" ) {
			$( $('#seq_pedido_cli_edit') ).css( {'background-color' : '#FFE4C4'} );
			msg += ' Sequencia do item no pedido n&atilde;o informado!';
			setTimeout("$('#seq_pedido_cli_edit').focus();",1);
		}else{
			$( $('#seq_pedido_cli_edit') ).css( {'background-color' : '#FFFFFF'} );
		}
		if ( msg != "" ){
			FLUIGC.toast({
					title: 'Valida&ccedil;&atilde;o: ',
					message: msg,
					type: 'warning',
					timeout: 'fast'
			});
			return false;
		}
	}
	
	if ( $('#desconto_edit').val( ) != "" && $('#tipo_desconto').val( ) == "" && $('#desconto_edit').val( ) != "0,00" ){
		setTipDescModal();
		return false;
	}
	
	
	var seq = "0";
	console.log( 'grava_000' );
	if ( $('#linha_edit').val() == '0' ){
		seq = wdkAddChild( table );
	}else{
		seq = $('#linha_edit').val();
	}
	
	var qtd = isNull( Math.round( parseFloat( $('#quantidade_edit').val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
	var qtd_orig = isNull( Math.round( parseFloat( $('#qtd_orig___'+seq).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
	
	console.log( 'Antes..... load motivo..... ', $('#cod_motivo_edit').val( ), alteraMotivo, qtd, qtd_orig );
	if ( ( qtd < qtd_orig && $('#cod_motivo_edit').val( ) == "" ) 
 	  || ( qtd < qtd_orig && alteraMotivo == true ) ){
		console.log( 'dentro..... load motivo..... ' );
		setMotCancelModal();
		return false;
	}
	console.log( 'Depois..... load motivo..... ' );
	
	console.log( 'grava_001' );
	
	$('#cod_item___'+seq).val( $('#cod_item_edit').val( ) );
	$('#peso___'+seq).val( $('#peso_edit').val( ) );
	$('#cubagem___' + seq).val((isNull(Math.round(parseFloat($('#quantidade_edit').val().replace(/\./g, '').replace(/\,/g, '.')) * 10000) / 10000, 0)/ isNull(Math.round(parseFloat($('#qtd_pad_edit').val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0) )* isNull(Math.round(parseFloat($('#cubagem_edit').val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0));
	$('#qtd_pad___'+seq).val( $('#qtd_pad_edit').val( ) );
						
	$('#cod_lin_prod___'+seq).val( $('#cod_lin_prod_edit').val( ) );
	$('#cod_lin_recei___'+seq).val( $('#cod_lin_recei_edit').val( ) );
	$('#cod_seg_merc___'+seq).val( $('#cod_seg_merc_edit').val( ) );
	$('#cod_cla_uso___'+seq).val( $('#cod_cla_uso_edit').val( ) );
	$('#cod_grupo_item___'+seq).val( $('#cod_grupo_item_edit').val( ) );
	$('#cod_tip_carteira___'+seq).val( $('#cod_tip_carteira_edit').val( ) );
	$('#um___'+seq).val( $('#um_edit').val( ) );
	$('#data_entrega___'+seq).val( $('#data_entrega_edit').val( ) );
							
	$('#valor_unit___'+seq).val( $('#valor_unit_edit').val( ) );
	$('#valor_unit_lista___'+seq).val( $('#valor_unit_lista_edit').val( ) );
	$('#valor_unit_moeda___'+seq).val( $('#valor_unit_moeda_edit').val( ) );
	$('#valor_unit_liq___' + seq).val($('#valor_unit_liq_edit').val());
	$('#pct_desc_adic___'+seq).val( $('#pct_desc_adic_edit').val( ) );
	
	if ( $('#desconto_edit').val( ) == "" ){
		$('#desconto___'+seq).val( "0,00" );
	}else{
		$('#desconto___'+seq).val( $('#desconto_edit').val( ) );
	}
	
	//$('#desconto___'+seq).val( $('#desconto_edit').val( ) );
	$('#quantidade___'+seq).val( $('#quantidade_edit').val( ) );
	$('#qtd_pad___'+seq).val( $('#qtd_pad_edit').val( ) );
	$('#valor_total___'+seq).val( $('#valor_total_edit').val( ) );
	
	$('#den_item___'+seq).val( $('#den_item_edit').val( ) );
	$('#den_item_reduz___'+seq).val( $('#den_item_reduz_edit').val( ) );

	$('#pedido_cli_item___'+seq).val( $('#pedido_cli_edit').val( ) );
	$('#seq_pedido_cli_item___'+seq).val( $('#seq_pedido_cli_edit').val( ) );

	
	$('#obs_item_1___'+seq).val( $('#obs_item_1_edit').val( ) );
	$('#obs_item_2___'+seq).val( $('#obs_item_2_edit').val( ) );	
	$('#obs_item_3___'+seq).val( $('#obs_item_3_edit').val( ) );
	$('#obs_item_4___'+seq).val( $('#obs_item_4_edit').val( ) );
	$('#obs_item_5___'+seq).val( $('#obs_item_5_edit').val( ) );
	
	$('#ies_mix___'+seq).val( $('#ies_mix_edit').val( ) );
	$('#cod_motivo___'+seq).val( $('#cod_motivo_edit').val( ) );
	
	$('#sequencia___'+seq).val( $('#sequencia_edit').val( ) );
	
	$('#val_icms___'+seq).val( $('#val_icms_edit').val( ) );
	$('#perc_icms___'+seq).val( $('#perc_icms_edit').val( ) );
	$('#val_pis___'+seq).val( $('#val_pis_edit').val( ) );
	$('#perc_pis___'+seq).val( $('#perc_pis_edit').val( ) );
	$('#val_cofins___'+seq).val( $('#val_cofins_edit').val( ) );
	$('#perc_cofins___'+seq).val( $('#perc_cofins_edit').val( ) );
	$('#val_cofins___'+seq).val( $('#val_cofins_edit').val( ) );
	$('#perc_cofins___'+seq).val( $('#perc_cofins_edit').val( ) );
	$('#val_ipi___'+seq).val( $('#val_ipi_edit').val( ) );
	$('#perc_ipi___'+seq).val( $('#perc_ipi_edit').val( ) );
	$('#val_st___'+seq).val( $('#perc_ipi_edit').val( ) );
	$('#perc_st___'+seq).val( $('#perc_st_edit').val( ) );
	$('#val_rol___'+seq).val( $('#val_rol_edit').val( ) );
	$('#perc_rol___'+seq).val( $('#perc_rol_edit').val( ) );
	$('#custo___'+seq).val( $('#custo_edit').val( ) );
	$('#perc_custo___'+seq).val( $('#perc_custo_edit').val( ) );
	$('#custo_trans___'+seq).val( $('#custo_trans_edit').val( ) );
	$('#perc_trans___'+seq).val( $('#perc_trans_edit').val( ) );
	$('#val_comis___'+seq).val( $('#val_comis_edit').val( ) );
	$('#perc_comis___'+seq).val( $('#perc_comis_edit').val( ) );

	$('#val_comis_adic___'+seq).val( $('#val_comis_adic_edit').val( ) );
	$('#perc_comis_adic___'+seq).val( $('#perc_comis_adic_edit').val( ) );

	$('#val_royaltie___'+seq).val( $('#val_royaltie_edit').val( ) );
	$('#perc_royaltie___'+seq).val( $('#perc_royaltie_edit').val( ) );
	
	$('#val_acordo___'+seq).val( $('#val_acordo_edit').val( ) );
	$('#perc_acordo___'+seq).val( $('#perc_acordo_edit').val( ) );
	$('#val_verba___'+seq).val( $('#val_verba_edit').val( ) );
	$('#perc_verba___'+seq).val( $('#perc_verba_edit').val( ) );
	$('#val_finac___'+seq).val( $('#val_finac_edit').val( ) );
	$('#perc_finac___'+seq).val( $('#perc_finac_edit').val( ) );
	$('#val_lob___'+seq).val( $('#val_lob_edit').val( ) );
	$('#val_lob_total___'+seq).val( $('#val_lob_total_edit').val( ) );
	$('#val_lob_ton___'+seq).val( $('#val_lob_ton_edit').val( ) );
	$('#val_lob_perc___'+seq).val( $('#val_lob_perc_edit').val( ) );
	
	
	$('#custo_aditivo___'+seq).val( $('#custo_aditivo_edit').val( ) );
	$('#custo_agregado___'+seq).val( $('#custo_agregado_edit').val( ) );
	$('#custo_cimento___'+seq).val( $('#custo_cimento_edit').val( ) );
	$('#custo_embalagem___'+seq).val( $('#custo_embalagem_edit').val( ) );
	$('#custo_materia_prima___'+seq).val( $('#custo_materia_prima_edit').val( ) );
	$('#custo_material_secundario___'+seq).val( $('#custo_material_secundario_edit').val( ) );
	$('#custo_material_revenda___'+seq).val( $('#custo_material_revenda_edit').val( ) );
	$('#custo_servico_terceiro___'+seq).val( $('#custo_servico_terceiro_edit').val( ) );
	$('#custo_embalagem_logistica___'+seq).val( $('#custo_embalagem_logistica_edit').val( ) );
	$('#custo_transferecia___'+seq).val( $('#custo_transferecia_edit').val( ) );
	$('#verba_marketing___'+seq).val( $('#verba_marketing_edit').val( ) );
	$('#acordo_comercial___'+seq).val( $('#acordo_comercial_edit').val( ) );
	$('#verba_rapel___'+seq).val( $('#verba_rapel_edit').val( ) );
	$('#verba_cross_dock___'+seq).val( $('#verba_cross_dock_edit').val( ) );
	
	clearItem( 'cod_item' );
	
	$('#linha_edit').val( '0' );
	
	atulizaRecalcTotal( 'grava_edit' );
	
}

function editItem( id ){
	
	var seq = id.split('___')[1];

	//var objDestino = { inputId:'den_item_edit', inputName:'den_item_edit', cod_item:$('#cod_item___'+seq).val( ), den_item:$('#den_item___'+seq).val( ) };
	zoomDestino = window[$("#den_item_edit").attr('filter-instance')];
	zoomDestino.setValue( $('#den_item___'+seq).val( ) );															
	
	$('#linha_edit').val( seq );

	$('#cod_item_edit').val( $('#cod_item___'+seq).val( ) );
	$('#peso_edit').val( $('#peso___'+seq).val( ) );
	$('#cubagem_edit').val($('#cubagem___' + seq).val());
	$('#qtd_pad_edit').val( $('#qtd_pad___'+seq).val( ) );
						
	$('#cod_lin_prod_edit').val( $('#cod_lin_prod___'+seq).val( ) );
	$('#cod_lin_recei_edit').val( $('#cod_lin_recei___'+seq).val( ) );
	$('#cod_seg_merc_edit').val( $('#cod_seg_merc___'+seq).val( ) );
	$('#cod_cla_uso_edit').val( $('#cod_cla_uso___'+seq).val( ) );
	$('#cod_grupo_item_edit').val( $('#cod_grupo_item___'+seq).val( ) );
	$('#cod_tip_carteira_edit').val( $('#cod_tip_carteira___'+seq).val( ) );
	$('#um_edit').val( $('#um___'+seq).val( ) );
	$('#data_entrega_edit').val( $('#data_entrega___'+seq).val( ) );
							
	$('#valor_unit_edit').val( $('#valor_unit___'+seq).val( ) );
	$('#valor_unit_lista_edit').val( $('#valor_unit_lista___'+seq).val( ) );
	$('#valor_unit_moeda_edit').val( $('#valor_unit_moeda___'+seq).val( ) );
	
	$('#pct_desc_adic_edit').val( $('#pct_desc_adic___'+seq).val( ) );
	
	if ( $('#desconto___'+seq).val( ) == "" ){
		$('#desconto_edit').val( "0,00" );
	}else{
		$('#desconto_edit').val( $('#desconto___'+seq).val( ) );
	}
	$('#quantidade_edit').val( $('#quantidade___'+seq).val( ) );
	$('#qtd_pad_edit').val( $('#qtd_pad___'+seq).val( ) );
	$('#valor_total_edit').val( $('#valor_total___'+seq).val( ) );
	
	$('#den_item_reduz_edit').val( $('#den_item_reduz___'+seq).val( ) );
	
	$('#pedido_cli_edit').val( $('#pedido_cli_item___'+seq).val( ) );
	$('#seq_pedido_cli_edit').val( $('#seq_pedido_cli_item___'+seq).val( ) );

	$('#obs_item_1_edit').val( $('#obs_item_1___'+seq).val( ) );
	$('#obs_item_2_edit').val( $('#obs_item_2___'+seq).val( ) );
	$('#obs_item_3_edit').val( $('#obs_item_3___'+seq).val( ) );
	$('#obs_item_4_edit').val( $('#obs_item_4___'+seq).val( ) );
	$('#obs_item_5_edit').val( $('#obs_item_5___'+seq).val( ) );
	
	$('#ies_mix_edit').val( $('#ies_mix___'+seq).val( ) );
	if( $('#cod_motivo___'+seq).val( ) != "" ){
		$('#cod_motivo_edit').val( $('#cod_motivo___'+seq).val( ) );
	}
	
	$('#sequencia_edit').val( $('#sequencia___'+seq).val( ) );
	
	$('#val_icms_edit').val( $('#val_icms___'+seq).val( ) );
	$('#perc_icms_edit').val( $('#perc_icms___'+seq).val( ) );
	$('#val_pis_edit').val( $('#val_pis___'+seq).val( ) );
	$('#perc_pis_edit').val( $('#perc_pis___'+seq).val( ) );
	$('#val_cofins_edit').val( $('#val_cofins___'+seq).val( ) );
	$('#perc_cofins_edit').val( $('#perc_cofins___'+seq).val( ) );
	$('#val_cofins_edit').val( $('#val_cofins___'+seq).val( ) );
	$('#perc_cofins_edit').val( $('#perc_cofins___'+seq).val( ) );
	$('#val_ipi_edit').val( $('#val_ipi___'+seq).val( ) );
	$('#perc_ipi_edit').val( $('#perc_ipi___'+seq).val( ) );
	$('#val_st_edit').val( $('#val_st___'+seq).val( ) );
	$('#perc_st_edit').val( $('#perc_st___'+seq).val( ) );
	$('#val_rol_edit').val( $('#val_rol___'+seq).val( ) );
	$('#perc_rol_edit').val( $('#perc_rol___'+seq).val( ) );
	$('#custo_edit').val( $('#custo___'+seq).val( ) );
	$('#perc_custo_edit').val( $('#perc_custo___'+seq).val( ) );
	$('#custo_trans_edit').val( $('#custo_trans___'+seq).val( ) );
	$('#perc_trans_edit').val( $('#perc_trans___'+seq).val( ) );
	$('#val_comis_edit').val( $('#val_comis___'+seq).val( ) );
	$('#perc_comis_edit').val( $('#perc_comis___'+seq).val( ) );

	$('#val_comis_adic_edit').val( $('#val_comis_adic___'+seq).val( ) );
	$('#perc_comis_adic_edit').val( $('#perc_comis_adic___'+seq).val( ) );

	$('#val_royaltie_edit').val( $('#val_royaltie___'+seq).val( ) );
	$('#perc_royaltie_edit').val( $('#perc_royaltie___'+seq).val( ) );
	
	$('#val_acordo_edit').val( $('#val_acordo___'+seq).val( ) );
	$('#perc_acordo_edit').val( $('#perc_acordo___'+seq).val( ) );
	$('#val_verba_edit').val( $('#val_verba___'+seq).val( ) );
	$('#perc_verba_edit').val( $('#perc_verba___'+seq).val( ) );
	$('#val_finac_edit').val( $('#val_finac___'+seq).val( ) );
	$('#perc_finac_edit').val( $('#perc_finac___'+seq).val( ) );
	$('#val_lob_edit').val( $('#val_lob___'+seq).val( ) );
	$('#val_lob_total_edit').val( $('#val_lob_total___'+seq).val( ) );
	$('#val_lob_ton_edit').val( $('#val_lob_ton___'+seq).val( ) );
	$('#val_lob_perc_edit').val( $('#val_lob_perc___'+seq).val( ) );
	
	
	$('#custo_aditivo_edit').val( $('#custo_aditivo___'+seq).val( ) );
	$('#custo_agregado_edit').val( $('#custo_agregado___'+seq).val( ) );
	$('#custo_cimento_edit').val( $('#custo_cimento___'+seq).val( ) );
	$('#custo_embalagem_edit').val( $('#custo_embalagem___'+seq).val( ) );
	$('#custo_materia_prima_edit').val( $('#custo_materia_prima___'+seq).val( ) );
	$('#custo_material_secundario_edit').val( $('#custo_material_secundario___'+seq).val( ) );
	$('#custo_material_revenda_edit').val( $('#custo_material_revenda___'+seq).val( ) );
	$('#custo_servico_terceiro_edit').val( $('#custo_servico_terceiro___'+seq).val( ) );
	$('#custo_embalagem_logistica_edit').val( $('#custo_embalagem_logistica___'+seq).val( ) );
	$('#custo_transferecia_edit').val( $('#custo_transferecia___'+seq).val( ) );
	$('#verba_marketing_edit').val( $('#verba_marketing___'+seq).val( ) );
	$('#acordo_comercial_edit').val( $('#acordo_comercial___'+seq).val( ) );
	$('#verba_rapel_edit').val( $('#verba_rapel___'+seq).val( ) );
	$('#verba_cross_dock_edit').val( $('#verba_cross_dock___'+seq).val( ) );
		
	setTimeout("$('#cod_item_edit').focus();",1);
	
}

function formatNumber(num,pres) {

	return (
	    num
	      .toFixed(pres) // always two decimal digits
	      .replace('.', ',') // replace decimal point character with ,
	      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
	  ) // use . as a separator
}

function somaColuna( id ){
	var soma = 0;
	$( "input[name^='"+id+"___']" ).each( function () {
		soma += isNull( Math.round( parseFloat( $(this).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
	});
	return soma;
}

function atulizaRecalcTotal( id ){
	
		var total = 0.0;
		var qtd_tot = 0.0;
		var qtd_mix = 0.0;
		var cub_tot = 0.0;
		var qtd_desc_sup = 0.0;
		var total_bruto = 0.0;
		var total_minimo = 0.0;
		
		$( "input[name^='cod_item___']" ).each( function () {
			console.log('Item...', $(this).attr('name') );
			
			var oTotal = calcDescTotal( $(this).attr('name') );
			
			total += oTotal.total_liquido ;
			total_bruto += oTotal.total_bruto;
			total_minimo += oTotal.total_minimo;
	
			var seq = $(this).attr('name').split('___')[1];			
	
			console.log( 'Qtd ', $('#quantidade___'+seq).val() );
			console.log( 'Peso ', $('#peso___'+seq).val() );
	
			//var qtd = isNull( ( Math.round( parseFloat( $('#quantidade___'+seq).val().replace('.','').replace(',','.') ) * 10000 ) / 10000 )
			//				  * Math.round( parseFloat( $('#peso___'+seq).val().replace('.','').replace(',','.') ) * 10000 ) / 10000, 0 );
			
			var qtd;
			if (Number.isInteger(isNull( Math.round( parseFloat( $('#peso___'+seq).val()/*.replace(/\./g,'')*/.replace(/\,/g,'.') ) * 10000 ) / 10000, 0 )) == false ) {
				console.log('Entrou aqui fracionado');
				qtd = isNull( ( Math.round( parseFloat( $('#quantidade___'+seq).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000 )
						  * Math.round( parseFloat( $('#peso___'+seq).val()/*.replace(/\./g,'')*/.replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
			} else {
				console.log('Entrou aqui inteiro');
				qtd = isNull( ( Math.round( parseFloat( $('#quantidade___'+seq).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000 )
					* Math.round( parseFloat( $('#peso___'+seq).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
			}
			
			var cub = isNull(parseFloat($('#cubagem___' + seq).val()),0);
			
			cub_tot += cub;
			
			qtd_tot += qtd;
			if ( $('#ies_mix___'+seq).val() == 'S' ){
				qtd_mix += qtd;
			}
			console.log( 'Qtd Total', qtd_tot );
			console.log( 'Qtd Mix', qtd_mix );
			console.log( 'Valor', total );
			console.log('Cubagem Total ',cub_tot);
			
			var desc = isNull( ( Math.round( parseFloat( $('#desconto___'+seq).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000 ), 0 );
			var desc_tabela = isNull( ( Math.round( parseFloat( $('#pct_desc_adic___'+seq).val().replace(/\./g,'').replace(/\./g,'.') ) * 10000 ) / 10000 ), 0 );
			
			if( desc > desc_tabela ){ 
				qtd_desc_sup += 1;
			}
		} );
		console.log( 'Valor Total', String( ( total ).toFixed(3) ).replace('.',',') );
		
		var mix = 0;
		if ( qtd_tot != 0 ){
			mix = ( qtd_mix / qtd_tot ) * 100;
			console.log( 'Mix', mix );
		}

		var max_desc = 0;
		if ( total_bruto != 0 ){
			max_desc = ( total_bruto - total_minimo ) / total_bruto * 100;
			console.log( 'Max Desc', max_desc );
		}

		var med_desc = 0;
		if ( total_bruto != 0 ){
			med_desc = ( total_bruto - total ) / total_bruto * 100;
			console.log( 'Max Desc', max_desc );
		}
		
		$('#peso_total_geral').val(String((qtd_tot).toFixed(2)).replace('.', ','));
		$('#cubagem_total_geral').val(String((cub_tot).toFixed(6)).replace('.', ','));
		
		$('#mix_geral').val( String( ( mix ).toFixed(2) ).replace('.',',') );
		$('#valor_total_geral').val( String( ( total ).toFixed(2) ).replace('.',',') );
		$('#qtd_item_desc_sup').val( String( ( qtd_desc_sup ).toFixed(2) ).replace('.',',') );
		
		$('#valor_minimo').val( String( ( total_minimo ).toFixed(2) ).replace('.',',') );
		$('#valor_bruto').val( String( ( total_bruto ).toFixed(2) ).replace('.',',') );
		
		$('#total_desc').val( String( ( total_bruto - total ).toFixed(2) ).replace('.',',') );
		
		$('#desc_medio').val( String( ( med_desc ).toFixed(2) ).replace('.',',') );
		$('#desc_maximo').val( String( ( max_desc ).toFixed(2) ).replace('.',',') );
		
	    if ( parseFloat( $('#desc_medio').val().replace(/\./g,'').replace(/\,/g,'.') ) >
			 parseFloat( $('#desc_maximo').val().replace(/\./g,'').replace(/\,/g,'.') ) 
				 + parseFloat( $('#perc_desc_ger_reg').val().replace(/\./g,'').replace(/\,/g,'.') ) ){
	    	$('#ies_desc_medio_reg').val( 'S' );
	    }else{
	    	$('#ies_desc_medio_reg').val( 'N' );
	    }
	
	    if ( parseFloat( $('#mix_geral').val().replace(/\./g,'').replace(/\,/g,'.') ) <=
	    	parseFloat( $('#perc_mix_ger_reg').val().replace(/\./g,'').replace(/\,/g,'.') ) ){
	    	$('#ies_mix_geral_reg').val( 'S' );
	    }else{
	    	$('#ies_mix_geral_reg').val( 'N' );
	    }    
	   
	    if ( parseFloat( $('#desc_medio').val().replace(/\./g,'').replace(/\,/g,'.') ) >  parseFloat( $('#desc_maximo').val().replace(/\./g,'').replace(/\,/g,'.') ) +
			 	parseFloat( $('#perc_desc_ger_nac').val().replace(/\./g,'').replace(/\,/g,'.') ) ){
	    	$('#ies_desc_medio_nac').val( 'S' );
		}else{
			$('#ies_desc_medio_nac').val( 'N' );
		}
		
		if ( parseFloat( $('#mix_geral').val().replace(/\./g,'').replace(/\,/g,'.') ) <=
			 parseFloat( $('#perc_mix_ger_nac').val().replace(/\./g,'').replace(/\,/g,'.') ) ){
			$('#ies_mix_geral_nac').val( 'S' );
		}else{
			$('#ies_mix_geral_nac').val( 'N' );
		}
		
		var zoomDestino = window[$("#razao_social_zoom").attr('filter-instance')];
		console.log( 'Trata raz_social...........',zoomDestino );
		if( total > 0 ){
			zoomDestino.disable(true);
		}else{
			zoomDestino.disable(false);
		}
		
		
			
		var cotacao = isNull( Math.round( parseFloat( $('#cotacao').val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 1 );
		if( isNaN(cotacao) || cotacao == 0 || cotacao == "" ){
			cotacao = 1;
		}

			
		total = total * cotacao;
			
		$('#valor_total_real').val( formatNumber( total, 2 ) );
			
		$('#val_icms_total').val( formatNumber( somaColuna('val_icms'), 2 ) );
		$('#perc_icms_total').val( formatNumber( parseFloat( somaColuna('val_icms') ) / total * 100 , 2 ) );
			
		$('#val_pis_total').val( formatNumber( somaColuna('val_pis'), 2 ) );
		$('#perc_pis_total').val( formatNumber( somaColuna('val_pis') / total * 100 , 2 ) );
			
		$('#val_cofins_total').val( formatNumber( somaColuna('val_cofins'), 2 ) );
		$('#perc_cofins_total').val( formatNumber( somaColuna('val_cofins') / total * 100 , 2 ) );
			
		$('#val_ipi_total').val( formatNumber( somaColuna('val_ipi'), 2 ) );
		$('#perc_ipi_total').val( formatNumber( somaColuna('val_ipi') / total * 100 , 2 ) );
			
		$('#val_st_total').val( formatNumber( somaColuna('val_st'), 2 ) );
		$('#perc_st_total').val( formatNumber( somaColuna('val_st') / total * 100 , 2 ) );
			
		var rob = total + fieldFloat( 'val_ipi_total', 0 ) + fieldFloat( 'val_st_total', 0 );
			
		$('#val_rob_total').val( formatNumber( rob, 2 ) );
		
		var rol = total - fieldFloat( 'val_icms_total', 0 ) - fieldFloat( 'val_pis_total', 0 ) - fieldFloat( 'val_cofins_total', 0 ); 
			
		$('#val_rol_total').val( formatNumber( rol, 2 ) );
		$('#perc_rol_total').val( formatNumber( rol / total * 100 , 2 ) );

		//if( $('#simulacao').val() == "S" ){
				
			$('#custo_total').val( formatNumber( somaColuna('custo'), 2 ) );
			$('#perc_custo_total').val( formatNumber( somaColuna('custo') / total * 100 , 2 ) );

			$('#custo_trans_total').val( formatNumber( somaColuna('custo_trans'), 2 ) );
			$('#perc_trans_total').val( formatNumber( somaColuna('custo_trans') / total * 100 , 2 ) );

			$('#val_comis_total').val( formatNumber( somaColuna('val_comis'), 2 ) );
			$('#perc_comis_total').val( formatNumber( somaColuna('val_comis') / total * 100 , 2 ) );

			$('#val_comis_adic_total').val( formatNumber( somaColuna('val_comis_adic'), 2 ) );
			$('#perc_comis_adic_total').val( formatNumber( somaColuna('val_comis_adic') / total * 100 , 2 ) );
			
			$('#val_royaltie_total').val( formatNumber( somaColuna('val_royaltie'), 2 ) );
			$('#perc_royaltie_total').val( formatNumber( somaColuna('val_royaltie') / total * 100 , 2 ) );
			
			$('#val_acordo_total').val( formatNumber( somaColuna('val_acordo'), 2 ) );
			$('#perc_acordo_total').val( formatNumber( somaColuna('val_acordo') / total * 100 , 2 ) );

			$('#val_verba_total').val( formatNumber( somaColuna('val_verba'), 2 ) );
			$('#perc_verba_total').val( formatNumber( somaColuna('val_verba') / total * 100 , 2 ) );

			$('#val_finac_total').val( formatNumber( somaColuna('val_finac'), 2 ) );
			$('#perc_finac_total').val( formatNumber( somaColuna('val_finac') / total * 100, 2 ) );
			
			
			var lob = rol 
					- fieldFloat( 'custo_total', 0 )
					- fieldFloat( 'custo_trans_total', 0 )
					- fieldFloat( 'val_comis_total', 0 ) 
					- fieldFloat( 'val_comis_adic_total', 0 )
					- fieldFloat( 'val_royaltie_total', 0 )
					- fieldFloat( 'val_acordo_total', 0 ) 
					- fieldFloat( 'val_verba_total', 0 ) 
					- fieldFloat( 'val_finac_total', 0 );
			
			$('#val_lob_geral_total').val( formatNumber( lob, 2 ) );
			$('#val_lob_ton_total').val( formatNumber( lob / fieldFloat( 'peso_total_geral', 0 ) * 1000 , 2 ) );
			$('#perc_lob_geral_total').val( formatNumber( lob / total * 100, 2 ) );
			
		//}
}

function validaPedSeq( id ){
	if( $('#cod_item_edit').val() == ""  ){
		$('#'+id).val( "" );
		return false;
	}
}

function qtdItens(){
		var total = 0;
		$( "input[name^='cod_item___']" ).each( function () {
			total += calcDescTotal( $(this).attr('name') ).total_liquido;			
		} );
		return total;
}

function setObsItem(){

	if ( $('#inf_obs').is(":checked") && $('#cod_item_edit').val() != "" ){
		$('#obs_item').show();
	}else{
		$('#obs_item').hide();
		$('#inf_obs').prop("checked",false);
	}
}


/*function setCeiOBS(){
	console.log( 'CEI.......'+$('#cei').val() );
	if ( $('#cei').val().trim() != "" && $('#cei').val().trim() != undefined && $('#cei').val().trim()!= null ){
		$('#texto_nf_1').val( 'CEI: '+$('#cei').val() );
		//$('#texto_nf_1').prop("readonly",true);
	}//else{
		//$('#texto_nf_1').prop("readonly",false);
	//}		
}*/

function setTipDescModal(){
	
		html = 	$('#div_tip_desc').html();
		html = html.replace('id="tipo_desconto"','id="tipo_desconto_mod"');
		console.log( html );
					
		var myModal = FLUIGC.modal({
			title: 'Tipo Desconto.',
			content: html,
			id: 'fluig-modal-Desc',
			size: 'larger',
			actions: [{
					'label': 'Confirmar',
					'bind': 'data-open-modal',
					'classType': 'confirmar',
					'autoClose': true
			},{
					'label': 'Cancelar',
					'autoClose': true
			}]
			}, function(err, data) {
				if(err) {
					// do error handling
				} else {						
					$('.confirmar').click(function() {
						$('#tipo_desconto').val( $('#tipo_desconto_mod').val() );
						gravaItem('ped_itens', true);
					});
				}
		});		
}

function setMotCancelModal(){
	
	html = 	$('#div_mot_cancel').html();
	html = html.replace('id="mot_cancel"','id="mot_cancel_mod"');
	console.log( html );
				
	var myModal = FLUIGC.modal({
		title: 'Motivo Cancelamento.',
		content: html,
		id: 'fluig-modal',
		size: 'larger',
		actions: [{
				'label': 'Confirmar',
				'bind': 'data-open-modal',
				'classType': 'confirmar',
				'autoClose': true
		},{
				'label': 'Cancelar',
				'autoClose': true
		}]
		}, function(err, data) {
			if(err) {
				// do error handling
			} else {						
				$('#mot_cancel_mod').val( $('#cod_motivo_edit').val() );
				$('.confirmar').click(function() {
					$('#cod_motivo_edit').val( $('#mot_cancel_mod').val() );
					gravaItem('ped_itens', false);
				});
			}
	});		
}

function getDescModal( preco, desc ){

	var valUnit = Math.round( parseFloat( $('#valor_unit_edit').val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000;
	
	html = "<div> Deseja utilizar o valor da ultima venda. <br>";
	if ( preco > valUnit  ){
		html += " Pre&ccedil;o: R$ "+ String( ( preco ).toFixed(3) ).replace('.',',') +" <br> ";
	}
	html += " Desconto: "+ String( ( desc ).toFixed(2) ).replace('.',',') +"% </div>";
	
	console.log( html );
				
	var myModal = FLUIGC.modal({
		title: 'Desconto.',
		content: html,
		id: 'fluig-modal',
		size: 'larger',
		actions: [{
				'label': 'Confirmar',
				'bind': 'data-open-modal',
				'classType': 'confirmar',
				'autoClose': true
		},{
				'label': 'Cancelar',
				'autoClose': true
		}]
		}, function(err, data) {
			if(err) {
				// do error handling
			} else {						
				$('.confirmar').click(function() {
					if ( preco > valUnit  ){
						$('#valor_unit_edit').val( String( ( preco ).toFixed(3) ).replace('.',',') );
					}
					$('#desconto_edit').val( String( ( desc ).toFixed(2) ).replace('.',',') );
					calcDescTotal( 'ultimo_preco' );
					//$('#tipo_desconto').val( $('#tipo_desconto_mod').val() );
					gravaItem('ped_itens', true);
				});
			}
	});		
}


function converteMoeda(valor){
	  var inteiro = null, decimal = null, c = null, j = null;
	  var aux = new Array();
	  valor = ""+valor;
	  c = valor.indexOf(".",0);
	  //encontrou o ponto na string
	  if(c > 0){
	   //separa as partes em inteiro e decimal
	   inteiro = valor.substring(0,c);
	   decimal = valor.substring(c+1,valor.length);
	  }else{
	   inteiro = valor;
	  }
	  
	  //pega a parte inteiro de 3 em 3 partes
	  for (j = inteiro.length, c = 0; j > 0; j-=3, c++){
	   aux[c]=inteiro.substring(j-3,j);
	  }
	  
	  //percorre a string acrescentando os pontos
	  inteiro = "";
	  for(c = aux.length-1; c >= 0; c--){
	   inteiro += aux[c]+'.';
	  }
	  //retirando o ultimo ponto e finalizando a parte inteiro
	  
	  inteiro = inteiro.substring(0,inteiro.length-1);
	  
	  decimal = parseInt(decimal);
	  if(isNaN(decimal)){
	   decimal = "00";
	  }else{
	   decimal = ""+decimal;
	   if(decimal.length === 1){
	    decimal = "0"+decimal;
	   }
	  }
	  
	  valor = inteiro+","+decimal;

	  return valor;
 }

function alteraPreco( id ){
	
	if( isNull( Math.round( parseFloat( $('#valor_unit_edit').val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 ) != 0
 	 && isNull( Math.round( parseFloat( $('#valor_unit_lista_edit').val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 ) == 0  ){
		
		$('#'+id).val('0.000');
		FLUIGC.toast({
			title: 'Preco: ',
			message: 'Nao Ã© permitido alterar preco, se nao localizado preco do item na lista de preco.',
			type: 'danger',
			timeout: 'slow'
		});
		setTimeout("$('#valor_unit_edit').focus();",1);
	}
	
}


function atulizaPrecos( ){
	
	codEmpresa = $('#empresa').val();
	numLista = $('#lista_preco').val();
	codCliente = $('#cod_cliente').val();
	uf = $('#estado_ent').val();
	condPagto = $('#cond_pagamento').val();
	
	$( "input[name^='cod_item___']" ).each( function () {
		console.log('Item...', $(this).attr('name') );
		var seq = $(this).attr('name').split('___')[1];
		var preco = getPrecoListaItem( codEmpresa, 
									   numLista, 
									   $('#cod_item___'+seq).val(), 
									   $('#cod_lin_prod___'+seq).val(),
									   $('#cod_lin_recei___'+seq).val(), 
									   $('#cod_seg_merc___'+seq).val(), 
									   $('#cod_cla_uso___'+seq).val(), 
									   codCliente, 
									   uf, 
									   condPagto,
									   $('#cod_grupo_item___'+seq).val(), 
									   $('#cod_tip_carteira___'+seq).val() );
		console.log('preco...',preco );
		valor_unit_lista = isNull( preco['PRE_UNIT'], 0 );
		valor_unit = isNull( ( Math.round( parseFloat( $('#valor_unit___'+seq).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000 ), 0 );
		
		if ( valor_unit_lista > valor_unit ){
			valor_unit = valor_unit_lista; 
			$('#orcamento_alterado').val('S');
		}
		
		$('#valor_unit___'+seq).val( String( valor_unit.toFixed(3) ).replace('.',',') );
		$('#valor_unit_lista___'+seq).val( String( valor_unit_lista.toFixed(3) ).replace('.',',') );
		$('#pct_desc_adic___'+seq).val( String( preco['PCT_DESC_ADIC'].toFixed(3) ).replace('.',',') );
			
	} );

	atulizaRecalcTotal( 'atualiza_lista' );
	setValidadeOrcamento();
}


function retiraAcento(palavra, obj) {
	com_acento = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ';
	sem_acento = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC';
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
	var quant = isNull(Math.round(parseFloat($('#quantidade' + seq).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000) / 10000, 0);
	var quant_mult = isNull(Math.round(parseFloat($('#qtd_pad' + seq).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000) / 10000, 1);
	var teste_divisao = quant / quant_mult;
		if (!Number.isInteger(teste_divisao)){

		// $('#quantidade_edit').focus();
		setTimeout("$('#quantidade_edit').focus();", 1);
		console.log('teste da quantidate ',quant,' ',quant_mult);
		FLUIGC.toast({
			title : 'Quantidade: ',
			message : 'A quantidade deve ser multiplo de: '
					+ String(quant_mult.toFixed(2)),
			type : 'warning',
			timeout : 'fast'
		});
		return false;
	}
	return true;
}


function modalMargem( id ){
	
	var seq = id.split('___')[1];
	
	//parent.$('#workflowView-cardViewer').css( 'zIndex', 1 );
	//parent.$('#workflowview-header').hide();
	
	/*$(".table-modal > thead").html("");
	$(".table-modal > tbody").html("");
	*/
	var html = "<body class='fluig-style-guide' >" +
		    "<div class='table-responsive' id='pai_filho_modal' style='overflow: auto; height: 220px;'>" +
		    "<table class='table table-hover table-modal'>" +
		    "<thead>" +
		    "</thead>" +
		    "<tbody>" +
	
		    " "+$('.simulacao').html().replace(/_edit/g, '_modal');
		    
		    "</tbody>" +
		    "</table>" +
		    "</div>" +
		    "</body>";					
	
	var myModal = FLUIGC.modal({
	    title: 'Margem',
	    content: html,
	    id: 'fluig-modal',
	    size: 'full',
	    actions: [{
	        'label': 'Close',
	        'autoClose': true
	    }]
	}, function(err, data) {
	    if(err) {
	        // do error handling
	    } else {
	        // do something with data
	    	$( "input[name*='_modal']" ).each( function () {
	    		var id = $(this).attr('id').replace('_modal','');
	    		$(this).val( $('#'+id+'___'+seq ).val() );
	    	});
	    	
	    		    		
	    }
	});		
	
	return true;
	var myModal = FLUIGC.modal({
		title: 'Margem',
		content: html,
		id: 'margem',
		formModal: false,
		size: 'large',
		actions: [{
			'label': 'Fechar',
			'autoClose': true
		}]
	}, function(err, data) {
		if(err) {
			// do error handling
		} else {
		
		}
	});			
}

/*
function setAprovacao(){
	
	p_lob
	
	p_lob = lob / rol * 100;
	
	p_lob3
	
	if( $('#ies_mix').val() == 'on' ){
		if ( parseFloat( $( "#mix_geral").val() )
		   <= parseFloat( $( "#perc_mix_ger_reg").val() ) ){
			$("#ies_mix_geral_reg").val('S');
		} 
		if ( parseFloat( $( "#mix_geral").val() )
		   <= parseFloat( $( "#perc_mix_ger_nac").val() ) ){
			$("#ies_mix_geral_nac").val('S');
		} 	
	}
	
	if( $('#ies_desc_ped').val() == 'on' ){
		if ( parseFloat( $( "#desc_medio" ).val() )
		    > ( parseFloat( $( "#desc_maximo").val() )
		      + parseFloat( $( "#perc_desc_ger_reg").val() ) ) ){
			$('#ies_desc_medio_reg').val('S');
		}
		if ( parseFloat( $( "#desc_medio").val())
			    > ( parseFloat( $( "#desc_maximo").val() )
			      + parseFloat( $( "#perc_desc_ger_nac").val() ) ) ){
			$('ies_desc_medio_nac').val('S');
		} 
	}
	
	if( $('#ies_lob').val() == 'on'){
		
		if ( $('#prim_pedido').val() != 'S') {
			if( p_lob < p_lob3 || p_lob3 == 0 || p_lob < 0){
				$('#ies_pct_lob_reg').val( 'S' );
				$('#obs_ger_reg').val( $("#obs_ger_reg").val()+"\n Lob: "+$("#perc_lob").val()+" < Lob Médio: "+$("#perc_lob3").val()+" ou LOB está negativo!" );
			}  
			
			var p_reduz = (1-p_lob/p_lob3)*100;
			
			if( ( p_reduz > parseFloat( $( "#perc_lob_ger_nac").val() ) || p_lob3 == 0 )
				&& parseFloat( $( "#perc_lob_ger_nac").val() ) > 0 ){
				$('#ies_pct_lob_nac').val( 'S' );
				$("#obs_ger_nac").val( $("#obs_ger_nac").val()+"\n Lob: "+$("#perc_lob").val()+" < Lob Médio: "+$("#perc_lob3").val() );
			} 
	
			if( ( p_reduz > $("#perc_lob_ctr").val() || p_lob3 == 0 )
				&& parseFloat( $("#perc_lob_ctr").val() ) > 0 ){
				$('#ies_pct_lob_ctr').val( 'S' );
				$("#obs_ctr").val( $("#obs_ctr").val()+"\n Lob: "+$("#perc_lob").val()+" < Lob Médio: "+$("#perc_lob3").val() );			
			} 		
		} else {
			if ( parseFloat( $('#perc_minimo_lob').val() ) > p_lob ){
				$('#ies_pct_lob_reg').val( 'N' );
				$('#ies_pct_lob_nac').val( 'N' );
				$('#ies_pct_lob_ctr').val( 'N' );
			} else {
				if( p_lob < p_lob3 || p_lob3 == 0 ){
					$('#ies_pct_lob_reg').val('S');
					$("#obs_ger_reg").val( $("#obs_ger_reg").val()+"\n Lob: "+$("#perc_lob").val()+" < Lob Médio: "+$("#perc_lob3").val() );
				}  
				
				var p_reduz = (1-p_lob/p_lob3)*100;
				
				if( ( p_reduz > $("#perc_lob_ger_nac").val() || p_lob3 == 0 )
					&& parseFloat( $("#perc_lob_ger_nac").va() ) > 0 ){
					$("#ies_pct_lob_nac").val('S');
					$("#obs_ger_nac").val( $("#obs_ger_nac").val()+"\n Lob: "+$("#perc_lob").val()+" < Lob Médio: "+$("#perc_lob3").val() );
				} 
		
				if( ( p_reduz > parseFloat( $("#perc_lob_ctr").val() ) || p_lob3 == 0 )
					&& parseFloat( $("#perc_lob_ctr") ) > 0 ){
					$("#ies_pct_lob_ctr")val( "S" );
					$("#obs_ctr", $("#obs_ctr").val()+"\n Lob: "+$("#perc_lob").val()+" < Lob Médio: "+$("#perc_lob3").val() );			
				}
			}
		} 	
	}
}
*/


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
		var peso_total = parseFloat($('#peso_total_geral').val().replace(',','.'));
		var cubagem_total = parseFloat($('#cubagem_total_geral').val().replace(',','.'));
		var cod_cidade_ent = ($('#cod_cidade_ent').val());
		console.log( 'peso_total......... ',peso_total );
		var codCliente = $('#cod_cliente').val();
		var codEmpresa = $('#empresa').val();
		var valor_total_real = parseFloat($('#valor_total_real').val().replace(/\./g,'').replace(/\,/g,'.'));
		var SQL ="";
		var i = 0;
		if( peso_total == 0 || peso_total == undefined || peso_total == null || peso_total == ""  ){
			
			peso_total = 0.0;
			pesoP = 0.0;
			
			$("input[name^='quantidade___']").each(function() {

				var seq = $(this).attr('name').split('___')[1];

				peso_total += parseFloat($('#quantidade___' + seq).val());

				/*if (nrParcela == $('#parcelaID___' + seq).val()) {
					pesoP += parseFloat($('#quantidade___' + seq).val());
				}*/
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