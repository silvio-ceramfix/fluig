var abaTotal = 10; 
var aba = 1;
var myLoading2 = FLUIGC.loading('#divPrincipal');

var tipo_cadastro = 'N';
var tipCadUser = 'R';

$(document).bind("DOMNodeRemoved", function(e){
		
	//console.log( 'NODE NAME.....', e.target.nodeName );
	if ( e.target.nodeName == 'LI' ){	
		var target = $(e.target.parentNode.parentNode.parentNode.parentNode.parentNode);
		if( target.html().indexOf('class="select2-selection__choice"' ) > 0 ){
			if( aba == 1 && $('#razao_social_zoom').val() == null 
		     && target.html().indexOf('name="razao_social_zoom"' ) > 0 ){
				clearForm('zoomCliente');
			}
			if( aba == 11 && $('#representante').val() == null 
			  && target.html().indexOf('id="representante"' ) > 0 ){
				$('#cod_repres').val('');
			}
			if( aba == 1 && $('#cidade').val() == null 
			 && target.html().indexOf('id="cidade"' ) > 0 ){
				$('#pais').val('');
				$('#cod_pais').val('');
				$('#estado').val('');
				
				loadBairro( '', 'bairro_sel' );
			}
			if( aba == 1 && $('#cidade_geral').val() == null 
					 && target.html().indexOf('id="cidade_geral"' ) > 0 ){
						$('#pais').val('');
						$('#cod_pais').val('');
						$('#estado').val('');
						
						loadBairro( '', 'bairro_sel' );
					}
			if( aba == 4 && $('#cidade_cob').val() == null 
			 && target.html().indexOf('id="cidade_cob"' ) > 0 ){
				setFilterUF( 'estado', 'cidade', '' );
				loadBairro( '', 'bairro_cob_sel' );
			}
		}
	} 

});


function getLinhaCampoPF( campo ){
	return campo.substring( campo.indexOf( '___' )+3, campo.length );
}

function fnCustomDelete(oElement){
		console.log( oElement );
		fnWdkRemoveChild(oElement);
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
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
		$('#total_steps').html( abaTotal  );

		$('#etapa').val( aba );
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
	
	$('#etapa').val( aba );
	
}

function setCorFilhos( id, color ){

	$( 'div', $( '#'+id+'_grp' ) ).each( function () {
		if( $(this).hasClass('bootstrap-tagsinput') ){
			$( $(this) ).css({'background-color' : color });
		}	
	});
	
	$( 'input', $( '#'+id+'_grp' ) ).each( function () {
		if( $(this).hasClass('tt-input') && setFocus ){
			console.log( 'ENTREI AQUI PARA FOCUS'+$( $(this) ).val() );
			setFocus = false;
			$(this).focus();
		}
	});
}

var setFocus = true;

function validaAba( aba ){
	
	var msg = '';
	var msg_valida = '';
	var qtd_email_nf = 0;
	var qtd_contatos = 0;
	var sum_part = 0;

	setFocus = true;
	
	$( 'input, select', $('#aba_'+aba) ).each(function () {
		
		if ( ( $(this).attr( 'pf' ) != "S" 
		  || ( $(this).attr( 'pf' ) == "S" && $(this).attr( 'name' ).indexOf('___') != -1 ) )
			&& !$(this).attr( 'readonly' ) ){
		
			$( '#'+$(this).attr('id') ).css({'background-color' : '#FFFFFF'});
			setCorFilhos( $(this).attr('id'), '#FFFFFF' );
				
			if ( $(this).attr( 'valida' ) != undefined  
				&& $(this).attr( 'valida' ) != "" 
				&& ( $(this).val() == "" || $(this).val() == null || $(this).val() == undefined )
			){

				//############
				if (!( ( aba == 1 && $('#tipo_cadastro' ).val() == 'A' && $(this).attr( 'id' ) == 'razao_social' ) ||
					 ( aba == 1 && $('#tipo_cadastro' ).val() == 'N' && $(this).attr( 'id' ) == 'razao_social_zoom' ) ||
					 ( aba == 1 && !$('#ies_bairro_manual').is(":checked") && $(this).attr( 'id' ) == 'bairro' ) ||
					 ( aba == 1 && $('#ies_bairro_manual').is(":checked") && $(this).attr( 'id' ) == 'bairro_sel' ) ||
					 ( aba == 1 && $('#pais').val() != '001' && $(this).attr( 'id' ) == 'cep' ) ||
					 ( aba == 1 && $('#pais').val() != '001' && $(this).attr( 'id' ) == 'cnpj' ) /*||
					 ( aba == 4 && !$('#ies_bairro_cob_manual').is(":checked") && $(this).attr( 'id' ) == 'bairro_cob' ) ||
					 ( aba == 4 && $('#ies_bairro_cob_manual').is(":checked") && $(this).attr( 'id' ) == 'bairro_cob_sel' ) ||
					 ( aba == 4 && $(this).attr( 'id' ) != 'e_mail_cob' 
								&& $('#cep_cob' ).val() == "" &&  $('#cidade_cob' ).val() == null
								&& $('#endereco_cob' ).val() == "" &&  $('#endereco_cob' ).val() == "" &&  $('#bairro_cob' ).val() == "" 
								&& ( $('#bairro_cob_sel' ).val() == "" || $('#bairro_cob_sel' ).val() == null  || $('#bairro_cob_sel' ).val() == undefined  ) )*/
				) ){
					$( $(this) ).css({'background-color' : '#FFE4C4'});
					setCorFilhos( $(this).attr('id'), '#FFE4C4' );
					msg += ' '+$(this).attr( 'valida' );
					
					if ( setFocus ){
						setFocus = false;
						$(this).focus();
					}
				}
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
						msg_valida += ' '+tipo+' Invalido!';
					}
				}
				
				if ( $(this).attr( 'regra' ) == 'cnpj' 
					&& !validaCNPJ( $(this).val() ) ){
						$( $(this) ).css({'background-color' : '#FFA500'});
						setCorFilhos( $(this).attr('id'), '#FFA500' );
						msg_valida += ' CNPJ Invalido!';
				}

				if ( $(this).attr( 'regra' ) == 'cpf' 
					&& !validaCPF( $(this).val() ) ){
						$( $(this) ).css({'background-color' : '#FFA500'});
						setCorFilhos( $(this).attr('id'), '#FFA500' );
						msg_valida += ' CPF Invalido!';
				}
			
				if ( $(this).attr( 'regra' ) == 'cep' 
					&& !validaCEP( $('#cep').val() ) ){
						console.log('CEP  ',$('#cep').val());
						console.log('entrou na validacao do cep');
						$( $(this) ).css({'background-color' : '#FFA500'});
						setCorFilhos( $(this).attr('id'), '#FFA500' );
						msg_valida += ' CEP Invalido!';
				}

				if ( $(this).attr( 'regra' ) == 'email' 
					&& !validaEmail( $(this).val() ) ){
						$( $(this) ).css({'background-color' : '#FFA500'});
						setCorFilhos( $(this).attr('id'), '#FFA500' );
						msg_valida += ' E-Mail Invalido!';
				}
				
				if ( $(this).attr( 'regra' ) == 'ie'  
					&& !validaIE( $(this).val(), $('#'+$(this).attr( 'campoEstado' ) ).val() ) ){
						$( $(this) ).css({'background-color' : '#FFA500'});
						setCorFilhos( $(this).attr('id'), '#FFA500' );
						msg_valida += ' Inscricao Estadual Invalido!';
				}
				
				if ( msg_valida != '' && setFocus ){
						setFocus = false;
						$(this).focus();
				}
				
			}
		}
		if ( aba == 2 
		    && $(this).val() == '1' 
			&& $(this).attr( 'name' ).indexOf('grupo_email___') != -1 ){
				qtd_email_nf += 1;
			}
		
		if ( aba == 3 
			    && $(this).val() == '02' 
				&& $(this).attr( 'name' ).indexOf('tipo_contato___') != -1 ){
					qtd_contatos += 1;
				}

		if ( aba == 5
			&& $(this).attr( 'name' ).indexOf('part_socio___') != -1 ){
				sum_part += parseFloat( $(this).val() );
			}			
	});
				
	if ( (msg != "" || msg_valida) && ($('#task').val() != 4)){
		if ( msg != "" ){
			FLUIGC.toast({
				title: 'Preenchimento: ',
				message: 'Voce deve informar os campos: '+msg,
				type: 'warning',
				timeout: 'slow'
			});	
		}
		if ( msg_valida != "" ){
			FLUIGC.toast({
				title: 'Validacao: ',
				message: msg_valida,
				type: 'warning',
				timeout: 'slow'
			});	
		}				
		return false;	
	}
	
	if ( aba == 1 && $('#cod_cidade').val() == "" ){
		FLUIGC.toast({
				title: 'Validacao: ',
				message: 'Voce deve informar uma cidade!"',
				type: 'warning',
				timeout: 'slow'
			});	
		return false;
	}
	
	// ### Aplicaregras Formulario
	if ( aba == 2 && qtd_email_nf == 0 ){
		FLUIGC.toast({
				title: 'Validacao: ',
				message: 'Voce deve informar ao menos um e-mail para o grupo "NFe XML!"',
				type: 'warning',
				timeout: 'slow'
			});	
		return false;
	}
	
	if ( aba == 3 && qtd_contatos == 0 ){
		FLUIGC.toast({
				title: 'Validacao: ',
				message: 'Voce deve informar ao menos um Contato com o campo CONTATO como Compras e o número do celular com Whatsapp!"',
				type: 'warning',
				timeout: 'slow'
			});	
		return false;
	}
	
	if ( aba == 5 && sum_part > 100 ){
		FLUIGC.toast({
				title: 'Validacao: ',
				message: 'A particitacao total nao pode ultrapassar 100%!"',
				type: 'warning',
				timeout: 'slow'
			});	
		return false;
	}
	
	if ( aba == 11 && $('#situacao_cadastro').val() == 'R' && $('#motivo_reprovacao').val() == '' ){
		FLUIGC.toast({
				title: 'Validacao: ',
				message: 'Para cadastro reprovado, deve ser informado o motivo!"',
				type: 'warning',
				timeout: 'slow'
			});	
		return false;
	}
	
	if ( aba == 1 && $('#tipo_cadastro').val() == 'N' && validaExistCNPJ( $('#cnpj').val() ) && ($('#task').val() != 4)){
		
		var msgTipo = '';
		console.log('CNPJ...FNC...',$('#cnpj').val());
		
		if( $('#cnpj').val().indexOf('/0000-') == -1  ){
			msgTipo = 'CNPJ ja cadastrado!!';
		}else{
			msgTipo = 'CPF ja cadastrado!!';
		}
		
		FLUIGC.toast({
				title: 'Validação: ',
				message: msgTipo,
				type: 'danger',
				timeout: 'slow'
			});	
		return false;
	}
	
	return true;
}



function loadBody(){
	$('#cidade_geral').hide();
	parent.$('#workflowView-cardViewer').css( 'zIndex', 0 );
	 
	console.log('modal_cliente.....', parent.$('#modal_cliente').val() );
	
	//parent.$('#collapse-tabs').hide();
//	$( '#valEditName' ).val( 'S' );
//	$( '#valEditRepres' ).val( 'N' );
	
	console.log( 'UF....'+$('#estado').val() );
	console.log( 'TIPO....'+$('#tipo_cliente').val() );
	console.log( 'NUMERO....'+$('#numero').val() );
	console.log( 'NUMERO COB....'+$('#numero_cob').val() );
	console.log( 'ISENTO....'+$('#isento_ie').val() );
	console.log( 'IE....'+$('#ie').val() );
	
	tipo_cadastro = $('#tipo_cadastro').val();
	var userfluig = "'"+$('#userFluig').val()+"'";
	var r = loadTipoClient( $('#userFluig').val(), 'tipo_cliente' );
	if( r < 0 ){
		$('#divPrincipal').hide();
		var msg = '';
		if( r <= -2 ){
			msg += "* Cadastrar Representante para o Usuario.<br>" ;
		}
		if( r <= -1 ){
			msg += "* Cadastrar Tipo de Cliente para o Representante.<br>"; 
		}
		$('#msg_cpl').html( msg );
		$('#msg').show();
		return false;
	};
	
	$('#tipo_cliente' ).val( $('#tipo_cliente_md' ).val() );
	
	$(".maskFone").mask("(99) 9999-9999?9");
	
	//$('#pais').val('001');
	
	console.log( 'LOAD 1....' );
	
	//loadPais( 'pais', 'userFluig' );
	//loadPais( 'pais_cob', '' );
	
	/*$('#pais' ).val( $('#pais_md' ).val() );*/

	//loadUF( $('#pais').val(), 'estado', 'cidade', 'userFluig' );
	/*loadUF( $('#pais_cob').val(), 'estado_cob', 'cidade_cob', '' );*/	
	
	/*$('#estado' ).val( $('#estado_md' ).val() );
	$('#estado_cob' ).val( $('#estado_cob_md' ).val() );*/
	
	loadBairro( $('#cod_cidade' ).val(), 'bairro_sel' );
	loadBairro( $('#cod_cidade_cob' ).val(), 'bairro_cob_sel' );
	
	console.log( 'LOAD 2....' );
	
	$('#bairro_sel' ).val( $('#bairro_sel_md' ).val() );
	$('#bairro_cob_sel' ).val( $('#bairro_cob_sel_md' ).val() );
	
	$("input").keyup(function(){
		$("input").keyup(function(){
			
			$(this).val(
					$(this).val().toUpperCase().replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s@.-_-])/g, ''));
		});
	});
	
	console.log( 'LOAD 3....' );
	
	if ( $('#ies_bairro_manual').is(":checked") ){
		$( '#bairro_sel' ).hide();
	}else{
		$( '#bairro' ).hide();
	}

	if ( $('#ies_bairro_cob_manual').is(":checked") ){
		$( '#bairro_cob_sel' ).hide();
	}else{
		$( '#bairro_cob' ).hide();
	}

	console.log( 'LOAD 4....' );
	
	setIsento( 'isento_ie', 'ie', 'estado' );
	setSemNumero( 'sem_numero_cob', 'numero_cob' );
	setSemNumero( 'sem_numero', 'numero' );
	
	console.log( 'LOAD 5....' );
	
	if ( $('#task').val() != 0 && $('#task').val() != 1 ){
		$('#tipo_cadastro').attr('readonly',true);
	}

	console.log( 'LOAD 6....' );
	if ($('#cod_cidade').val()!= null && $('#cod_cidade').val()!='' && $('#cod_cidade').val()!=0){
		var cod_cidade = $('#cod_cidade').val();
		console.log('cod_cidade ',$('#console.log').val());
		/*var zoomDestino = {};
		
		zoomDestino = window[$("#cidade").attr('filter-instance')];
		zoomDestino.setValue*/
		$('#cidade').val( loadCampoDataSet( 'cidades', 'cod_cidade', cod_cidade, 'DEN_CIDADE' ).trim() );
	}
	
	$('#current_step').html( aba );
	
	var constraintsTipoCadUSer = new Array();
	constraintsTipoCadUSer.push( DatasetFactory.createConstraint("matricula", $('#userFluig').val(), $('#userFluig').val(), ConstraintType.MUST, true) );

    var datasetTipoCadUSer = DatasetFactory.getDataset("representante_compl", null, constraintsTipoCadUSer, null);
   
	if ( datasetTipoCadUSer != null ){
		for (var x = 0; x < datasetTipoCadUSer.values.length; x++) {
			tipCadUser = datasetTipoCadUSer.values[x].tipo_cadastro;
			console.log('TIPOCADUSER ',tipCadUser);
			$('#tipCadUser').val(tipCadUser);
			document.getElementsByName("cod_class")[0].removeAttribute("valida");
			document.getElementsByName("situacao_cadastro")[0].removeAttribute("valida");
		}
	}	
	if ( ($('#task').val() == 2) || ($('#task').val() == 4)  || ($('#task').val() == 27) || ($('#task').val() == 35) || ($('#tipCadUser').val() == 'A') ){
		abaTotal = 11;
	}
	
	console.log( 'LOAD 7....' );
	
	$('#etapa').val( aba );
	$('#total_steps').html( abaTotal );
	
	if ( $('#task').val() == 8  ){
		FLUIGC.toast({
				title: 'Cadastro reprovado: ',
				message: 'Motivo - <b>'+ $('#motivo_reprovacao').val() +'</b><br>'+$('#comentario').val(),
				type: 'danger',
				timeout: 'slow'
			});		
	}
	console.log( 'LOAD 8....' );
	
	setTimeout("setEditRepres( 'editRepres' );",200);
	
}

function loadCampoDataSet( denDataSet, campo, valor, campoRetorno ){			
    var c1 = DatasetFactory.createConstraint( campo, valor, valor, ConstraintType.MUST);
    var constraints = new Array(c1);
    //Busca o dataset
    var dataset = DatasetFactory.getDataset( denDataSet, null, constraints, null);
	if ( dataset != null ){
		for (var x = 0; x < dataset.values.length; x++) {
			var row = dataset.values[x];
			return row[ campoRetorno ];
		}
	}
	return ' ';
	
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

function alteraPais( ){
	if ( $('#pais').val() == '001' ){
		$('#cep').attr('readonly',false);
		$('#cnpj').attr('readonly',false);		
	}else{
		$('#cep').css({'background-color' : '#FFFFFF'});
		$('#cnpj').css({'background-color' : '#FFFFFF'});
		$('#cep').attr('readonly',true);
		$('#cnpj').attr('readonly',true);
		$('#cep').val('00000-000');
		$('#cnpj').val('000.000.000/0000-00');
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


function setTipoCliente( tipo ){
	
	
	$('#represAlterado').val('N');
	//var user_fluig_aux = "'"+$('#userFluig').val()+"'";
	var campo = $('#tipo_cadastro').val();
	console.log(' setTipoFormulario '+$( '#task').val());
	if (campo == 'A'){
		//inicia tratamento se estiver alterando um cliente já cadastrado
		$('#tipo_cliente_hd').val( $("#tipo_cliente").val() );
		var repres_old = $('#cod_repres').val();
		console.log('antes getRepresUserTipoCli',$('#userFluig').val(), $('#tipo_cliente').val() );
		
		var repres = getRepresUserTipoCli( $('#userFluig').val(), $('#tipo_cliente').val() );
	    console.log(' Representante busca........... ',repres,$('#cod_repres').val());
		if ( repres != repres_old ){
			$('#cod_repres').val( repres );
			console.log(' Representante form........... ',$('#cod_repres').val() );
			setFilterCidade( 'cidade', 'userFluig', 'cod_repres' );
			
			$("#cod_cidade").val("");
			$('#pais').val( "" );
			$('#cod_pais').val( "" );
			$('#estado').val( "" );
			
			zoomDestino = window[$("#cidade").attr('filter-instance')];
			zoomDestino.clear();
		}
		
		//tratamento para que quando o canal for engenharia permita selecionar qualquer cidade
		var tipoCli = $('#tipo_cliente').val();
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
			}
			per_sel_cidades = per_sel_cidades.trim();
				if (per_sel_cidades == 'S'){
					console.log('entrou em cidades');
					$('#per_sel_cidades').val('S');
					setFilterCidade( 'cidade', '', '' );
					
					$("#cod_cidade").val("");
					$('#pais').val( "" );
					$('#cod_pais').val( "" );
					$('#estado').val( "" );
					zoomDestino = window[$("#cidade").attr('filter-instance')];
					zoomDestino.clear();
				} else {
					$('#per_sel_cidades').val('N');
					setFilterCidade( 'cidade', 'userFluig', 'cod_repres' );
				} 	
			}
		} else {
			$('#per_sel_cidades').val('N');
		}
		
		//fim tratamento para que quando o canal for engenharia permita selecionar qualquer cidade
		if (getRepresUserTipoCli( $('#userFluig').val(), $('#tipo_cliente').val() ) != $('#represOld').val()){
			$('#represAlterado').val('S');
		} else {
			$('#represAlterado').val('N');
		}
		//fim tratamento se estiver alterando um cliente já cadastrado
		//tratamento para quando o tipo de cadastro do usuário for A
		//de Adm de Vendas permita selecionar qualquer cidade
		if ($('#tipCadUser').val() == 'A'){
			console.log('entrou em cidades');
			$('#per_sel_cidades').val('S');
			setFilterCidade( 'cidade', '', '' );
			
			$("#cod_cidade").val("");
			$('#pais').val( "" );
			$('#cod_pais').val( "" );
			$('#estado').val( "" );
			zoomDestino = window[$("#cidade").attr('filter-instance')];
			zoomDestino.clear();
		}
	} else {
		$('#tipo_cliente_hd').val( $("#tipo_cliente").val() );
		var repres_old = $('#cod_repres').val();
		console.log('antes da getRepresUserTipoCli', $('#userFluig').val(), $('#tipo_cliente').val());
		var repres = getRepresUserTipoCli( $('#userFluig').val(), $('#tipo_cliente').val() );
	    console.log(' Representante busca........... ',repres,$('#cod_repres').val(),'repres old',repres_old);
	    if ( repres != repres_old ){
			$('#cod_repres').val( repres );
			console.log(' Representante form........... ',$('#cod_repres').val() );
			setFilterCidade( 'cidade', 'userFluig', 'cod_repres' );
			
			$("#cod_cidade").val("");
			$('#pais').val( "" );
			$('#cod_pais').val( "" );
			$('#estado').val( "" );
			zoomDestino = window[$("#cidade").attr('filter-instance')];
			zoomDestino.clear();
			zoomDestino = window[$("#cidade_geral").attr('filter-instance')];
			zoomDestino.clear();
		}
		
		//tratamento para que quando o canal for engenharia permita selecionar qualquer cidade
		var tipoCli = $('#tipo_cliente').val();
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
		//tratamento para quando o tipo de cadastro do usuário for A
		//de Adm de Vendas permita selecionar qualquer cidade
		if ($('#tipCadUser').val() == 'A'){
			console.log('entrou em cidades');
			$('#per_sel_cidades').val('S');
			setFilterCidade( 'cidade', '', '' );
			
			$("#cod_cidade").val("");
			$('#pais').val( "" );
			$('#cod_pais').val( "" );
			$('#estado').val( "" );
			zoomDestino = window[$("#cidade").attr('filter-instance')];
			zoomDestino.clear();
		}
	}
}

function setFilterCidade( campoCid, campoUser, compoRepres ){	
	campo = $('#tipo_cadastro').val();
	console.log(' setTipoFormulario '+$( '#task').val());
	if (campo == 'A'){
		console.log( 'USER.....'+$("#"+campoUser).val() );
		console.log( 'REPRES.....'+$("#"+compoRepres).val() );
		if (campoUser == '' && compoRepres == '') {
		//inicia tratativa do tipo de cliente que pode selecionar todas as cidades	
			console.log('ENTROU NO VAZIO');
			if ($('#per_sel_cidades').val() == 'S'){
				console.log('posso ocultar');
				document.getElementById('div_cidade').style.display = 'none';
				document.getElementById('div_cidade_geral').style.display = 'block';			
				
			}
			//fim tratativa do tipo de cliente que pode selecionar todas as cidades
		}
		else{
			reloadZoomFilterValues(campoCid, "cod_user,"+$("#"+campoUser).val()+",cod_repres,"+$("#"+compoRepres).val() );	
			console.log('ENTROU com dados');
			if ($('#per_sel_cidades').val() != 'S'){
				console.log('não posso ocultar');
				document.getElementById('div_cidade').style.display = 'block';
				document.getElementById('div_cidade_geral').style.display = 'none';
			}
		}
	} else {
		console.log( 'USER.....'+$("#"+campoUser).val() );
		console.log( 'REPRES.....'+$("#"+compoRepres).val() );
		if (campoUser == '' && compoRepres == '') {
		//inicia tratativa do tipo de cliente que pode selecionar todas as cidades	
			console.log('ENTROU NO VAZIO');
			if ($('#per_sel_cidades').val() == 'S'){
				console.log('posso ocultar');
				document.getElementById('div_cidade').style.display = 'none';
				document.getElementById('div_cidade_geral').style.display = 'block';			
				
			}
			//fim tratativa do tipo de cliente que pode selecionar todas as cidades
		}
		else{
			reloadZoomFilterValues(campoCid, "cod_user,"+$("#"+campoUser).val()+",cod_repres,"+$("#"+compoRepres).val() );	
			console.log('ENTROU com dados');
			if ($('#per_sel_cidades').val() != 'S'){
				console.log('não posso ocultar');
				document.getElementById('div_cidade').style.display = 'block';
				document.getElementById('div_cidade_geral').style.display = 'none';
			}
		}
	}	
}

function mostradiv(nomedadiv, status) {
	console.log('nome da div ',nomedadiv);
	if (status == 1) {
		document.getElementById(nomedadiv).style.display = 'block';
	} else {
		document.getElementById(nomedadiv).style.display = 'none';
	}
}

function setTipoFormulario( tipo ){
	
	console.log('tipo......'+tipo);
	if ( tipo == 'change'){
		console.log('tipo......'+$('#task').val());
		if ( $('#task').val() != 0 && $('#task').val() != 1  ){
			console.log('tipo......'+tipo_cadastro );
			$('#tipo_cadastro').val( tipo_cadastro );
			return;
		}
		tipo_cadastro = $('#tipo_cadastro').val();
		clearForm('geral');
	}
	
	campo = $('#tipo_cadastro').val();
	console.log(' setTipoFormulario '+$( '#task').val());
	if (campo == 'A'){
		$( '#cnpj').prop("readonly", true);
		document.getElementById('div_cidade').style.display = 'block';
		document.getElementById('div_cidade_geral').style.display = 'none';
		if ( $('#task').val() == 0 || $('#task' ).val() == 1 ){
			console.log('entrou no setfiltercliente');
			setFilterCliente( $('#userFluig').val(), 'razao_social_zoom' );
		}
		if ( $( '#task').val() != 0 && $( '#task' ).val() != 1 ){
			$( '#rs_zoom' ).hide();
			$( '#rs_input' ).show();
			$( '#editName').prop("checked", true);
			$( '#valEditName' ).val( 'S' );
			$( '#editName').prop("disabled", true);
		}else{
			$( '#rs_zoom' ).show();
			$( '#rs_input' ).hide();
			$( '#editName').prop("checked", false);
			$( '#valEditName' ).val( 'N' );
			$( '#editName').prop("disabled", false);			
		}
	}else{
		$( '#rs_zoom' ).hide();
		$( '#rs_input' ).show();
		$( '#editName').prop("checked", true);
		$( '#editName').prop("disabled", true);
		$( '#cnpj').prop("readonly", false);
		$( '#valEditName' ).val( 'S' );
		//$('#btRazaoSocial').prop('disabled', true);
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

function setSemNumero( idCampo, idCampoNum, idCampoUF ){
	if ( $("#"+idCampo).is(':checked') ){
		$('#'+idCampoNum).attr( 'readonly', true );
		$('#'+idCampoNum).attr('type', 'text');
		$('#'+idCampoNum).css('background-color' , '#DEDEDE');
		$( '#'+idCampoNum ).val('SN');
	}else{
		$('#'+idCampoNum).attr( 'readonly', false );
		$('#'+idCampoNum).attr('type', 'number');
		$('#'+idCampoNum).css('background-color' , '#FFFFFF');
		$( '#'+idCampoNum ).val();
	}
}

function addChild( tabela ){
		
	var row = wdkAddChild(tabela);
	
	if( tabela = 'socios_diretores' ){
		$('#cpf_socio___'+row).mask('999.999.999/9999-99');
	}
	
	$("input").keyup(function(){
		$(this).val($(this).val().toUpperCase());
	});
	
}

function clearForm( tipo ){
	
	
	$( 'input[name], select[name], checkbox[name], textarea[name], img', $( '#divPrincipal' ) ).each( function () {

		if ( !(tipo == 'zoomCliente' && $(this).attr('name') == 'razao_social_zoom' ) ){
			
/*			if(  $(this).is( 'img' )  ){
				//021.433.813/0001-45
				//console.log( 'IMG....' );
				fnCustomDelete( $(this) );
			}	*/
			
			if(  $(this).is( 'input' ) || $(this).is( 'textarea') || $(this).is( 'hidden') ){
				$(this).val('');
				$(this).css('background-color' , '#FFFFFF');
			}
			
			if( ( $(this).is( 'input' ) || $(this).is( 'select' ) ) && $(this).attr('type') == 'zoom' ){
				zoomDestino = window[ $("#"+$(this).attr('name')).attr('filter-instance') ];
				zoomDestino.clear();
			}
			if(  $(this).is( 'input' ) && $(this).attr( 'name' ).indexOf('___') != -1 ){
				//fnWdkRemoveChild(this);
				fnCustomDelete( this );
			}
			
			if(  $(this).is( ':checkbox' ) ) {
				$(this).prop('checked', false);
			}

			if( $(this).is( 'select' ) && $(this).attr( 'name' ) != 'tipo_cadastro' && $(this).attr( 'name' ) != 'pais' ) {
				$(this).val('');
			}
 			
			/*if( $(this).hasClass('bootstrap-tagsinput') ){
				$( $(this) ).css({'background-color' : color });
			}*/
		}
	});
	loadBody();	
}


function setEditName( idCampo ){	
	if ( $("#"+idCampo).is(':checked') ){
		$( '#rs_zoom' ).hide();
		$( '#rs_input' ).show();
		$( '#valEditName' ).val( 'S' );
		//$('#btRazaoSocial').prop('disabled', false)
	}else{
		$( '#rs_zoom' ).show();
		$( '#rs_input' ).hide();
		$( '#valEditName' ).val( 'N' );
		//$('#btRazaoSocial').prop('disabled', true);
	}
}

function setEditRepres( idCampo ){	
	if ( $("#"+idCampo).is(':checked') ){
		$( '#repres_zoom' ).show();
		$( '#repres_input' ).hide();
		$( '#valEditRepres' ).val( 'S' );
		//$('#btRazaoSocial').prop('disabled', true);
	}else{
		$( '#repres_zoom' ).hide();
		$( '#repres_input' ).show();
		$( '#valEditRepres' ).val( 'N' );
		//$('#btRazaoSocial').prop('disabled', false)
	}
}

function exibeComentarios(codTipCliente){
	var constraintsPai = new Array();
	console.log('ENTREI TIPO CLIENTE '+codTipCliente);
	constraintsPai.push( DatasetFactory.createConstraint("cod_tipo_cliente", codTipCliente, codTipCliente, ConstraintType.MUST) );

    var datasetPai = DatasetFactory.getDataset("tipo_cliente_fluig", null, constraintsPai, null);
   
	if ( datasetPai != null ){
		for (var x = 0; x < datasetPai.values.length; x++) {
		console.log(datasetPai);	
		var comentario = datasetPai.values[x].comentarios;
		console.log(comentario);
		FLUIGC.toast({
			title: 'Comentarios: ',
			message: comentario,
			type: 'warning',
			timeout: 'slow'
		});
	
		}
	}
}

function setFilterCliente(qtd) {
	console.log('setFilterCliente.....', qtd, $('#razao_social_zoom').val());
	/*if (qtd >= 10000
			|| (qtd == 0 && $('#').val() != ""
					&& $('#razao_social_zoom').val() != null && $('#razao_social_zoom')
					.val() != undefined)) {
		return false;
	}*/
	try {
		if ($('#tipCadUser').val() == 'A') {
			console.log('TIPO_CADASTRO_DE_USUARIO2', $('#tipCadUser').val());
			reloadZoomFilterValues('razao_social_zoom', "");
		} else {
			if ($('#razao_social_zoom').val() == ""
					|| $('#razao_social_zoom').val() == null /*
														 * &&
														 * $('#processo').val() !=
														 * 'alt_pedido'
														 */) {
				console.log("filter ......IES_PEDIDO,S,COD_USER,"
						+ $("#userFluig").val());
				reloadZoomFilterValues('razao_social_zoom', "IES_PEDIDO,S,COD_USER,"
						+ $("#userFluig").val());
			} else if ($('#processo').val() == 'alt_pedido') {
				zoomDestino = window[$("#razao_social_zoom").attr('filter-instance')];
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
