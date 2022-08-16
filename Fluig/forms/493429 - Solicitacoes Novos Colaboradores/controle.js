function loadBody(){
	
	
	display();
	setTipo();
	
	FLUIGC.calendar('#data_inicio');
	FLUIGC.calendar('#data_inicio_prevista');
}

function display(){
	
	
	
	
	if( $("#task").val() != "0" && $("#task").val() != "4" ){
		$('#tipoSolicitacao option:not(:selected)').prop('disabled', true);
	}
	
	if( $("#task").val() != "0" && $("#task").val() != "4" ){
		var cod_usu_ass_tecnica = 0;
		var constraints_papel = new Array();
		constraints_papel.push( DatasetFactory.createConstraint('workflowColleagueRolePK.colleagueId',
						$('#user_atual').val(), $('#user_atual').val(), ConstraintType.MUST, true));
		constraints_papel.push( DatasetFactory.createConstraint('workflowColleagueRolePK.roleId',
						'recursos_humanos', 'recursos_humanos', ConstraintType.MUST));				
		
		
				var dataset = DatasetFactory.getDataset("workflowColleagueRole",
						null, constraints_papel, null);
				console.log(dataset);
				console.log('antes dataset');
				if (dataset != null && dataset.values.length > 0 ) {
					$('.solicitacao_acao_salarial').show();
				} else {
					$('.solicitacao_acao_salarial').hide();
				}
	}
	
	if( $("#task").val() == "0" &&  $('#tipoSolicitacao').val() != 'A' ){ 
		loadItensSelecionaveis();
	}
	
	if( $("#task").val() == "34" ){
		
		$( "input[id^=papel_responsavel_item___]" ).each(function( index ) {
			var seq = $(this).attr('id').split('___')[1];
			if( $(this).val() != $("#papel_responsavel_atual").val() ){
				$(this).parent().parent().hide();
			}else if( $("#possui_item___"+seq).val() != 'S' 
				   && $("#necessita_item___"+seq).val() != 'S' ){
				$(this).parent().parent().hide();
			}
		});
	}else{
		$('.confirma').hide();
	}
	
	if( $("#task").val() == "37" ){
		loadPerguntasSolicitacao();
	}else{
		$("#avaliacao_solicitacao").hide();
	}
	
	if ( $("#task").val() != "27" ) {
		$('.fd_rh').attr('readonly',true);
	}	
	

	
	
}

function setTipo(){ 
	if( $('#tipoSolicitacao').val() == 'N' ){
		$('.possui').hide();
		$('.necessita').show();
		$('.num_os').show();
		$('.origem').hide();
		$('.destino').show();
		$('#nome_funcionario').attr('readonly',false);
		$('.substituto').hide();
		$('.demissao').hide();
		$('.admissao').show();
		$('.solicitacao_acao_salarial').hide();
	}else if( $('#tipoSolicitacao').val() == 'D' ){
		$('.possui').show();
		$('.necessita').hide();
		$('.num_os').hide();
		$('.origem').show();
		$('.destino').hide();
		$('.substituto').hide();
		$('#nome_funcionario').attr('readonly',false);
		$('#cpf_funcionario').attr('readonly',false);
		$('.demissao').show();
		$('.admissao').hide();
		$('.solicitacao_acao_salarial').hide();
	}else if( $('#tipoSolicitacao').val() == 'T' ) {
		$('.possui').show();
		$('.necessita').show();
		$('.num_os').show();
		$('.origem').show();
		$('.destino').show();	
		$('.substituto').hide();
		$('#nome_funcionario').attr('readonly',false);
		$('#cpf_funcionario').attr('readonly',false);
		$('.demissao').hide();
		$('.admissao').show();
		$('.solicitacao_acao_salarial').show();
	}else if( $('#tipoSolicitacao').val() == 'X' ) {
		$('.possui').show();
		$('.necessita').show();
		$('.num_os').show();
		$('.origem').show();
		$('.destino').show();	
		$('.substituto').show();
		$('#nome_funcionario').attr('readonly',false);	
		$('#cpf_funcionario').attr('readonly',false);
		$('.demissao').hide();
		$('.admissao').show();
		$('.solicitacao_acao_salarial').hide();
	}else if ( $('#tipoSolicitacao').val() == 'S') {
		$('.possui').hide();
		$('.necessita').show();
		$('.num_os').hide();
		$('.substituto').hide();
		$('#nome_funcionario').attr('readonly',false);
		$('.fd_rh').attr('readonly',false);
		$('#cpf_funcionario').attr('readonly',false);
		$('.demissao').hide();
		$('.admissao').show();
		$('.solicitacao_acao_salarial').hide();
	}else if( $('#tipoSolicitacao').val() == 'A' ) {
		$('.possui').hide();
		$('.necessita').hide();
		$('.num_os').hide();
		$('.origem').show();
		$('.destino').hide();	
		$('.substituto').hide();
		$('#nome_funcionario').attr('readonly',false);
		$('#cpf_funcionario').attr('readonly',false);
		$('.demissao').hide();
		$('.admissao').show();
		$('.solicitacao_acao_salarial').show();
		$('.itens_solicitados').hide();
	}else{
		$('.possui').hide();
		$('.necessita').hide();
		$('.num_os').hide();
		$('.origem').hide();
		$('.destino').hide();		
		$('#nome_funcionario').attr('readonly',true);
		$('.demissao').hide();
		$('.admissao').show();
		$('.solicitacao_acao_salarial').hide();
	}
	if( $('#matricula_funcionario').val() != "" ){
		$('#nome_funcionario').attr('readonly',true);
	}
	
}


function loadItensSelecionaveis() {

	console.log('ENTROU NA CARGA');
	
	var orderTipo = new Array();
	orderTipo.push( "cod_tipo_itens_solicitaveis" );						
	var constraintstipo = new Array();
	var tipos_itens_solicitaveis = DatasetFactory.getDataset("tipo_itens_solicitaveis",null, constraintstipo, orderTipo);
	console.log('tipo ',tipos_itens_solicitaveis);
	if (tipos_itens_solicitaveis.values.length >0 && tipos_itens_solicitaveis != null) {
		var contador_tipo = tipos_itens_solicitaveis.values.length;
		for (var x = 0; x < contador_tipo; x++) {
			var row_tipo = tipos_itens_solicitaveis.values[x];
			var constraints;
			var c1 = (DatasetFactory.createConstraint("cod_tipo_itens_solicitaveis", row_tipo.cod_tipo_itens_solicitaveis, row_tipo.cod_tipo_itens_solicitaveis,	ConstraintType.MUST));
			constraints = new Array(c1);
			
			var descricao_tipo = row_tipo.den_tipo_itens_solicitaveis;
			var papel_tipo = row_tipo.pool_papel;
			
			var itens_solicitaveis = DatasetFactory.getDataset("itens_solicitaveis",null, constraints, null);
			if (itens_solicitaveis.values.length >0 && itens_solicitaveis != null) {
				for (var y = 0; y < itens_solicitaveis.values.length; y++) {
					var row_item = itens_solicitaveis.values[y];
					var seq = wdkAddChild('table_necessidades');
					$('#tipo_item___' + seq).val(descricao_tipo);
					$('#descricao_item___' + seq).val(row_item.den_itens_solicitaveis);
					$('#observacao_item___' + seq).val(row_item.obs_item);
					$('#papel_responsavel_item___' + seq).val(papel_tipo);
					$('#obriga_os___' + seq).val(row_item.obriga_OS);
					$('#obriga_usuario_base___' + seq).val(row_item.obriga_usuario_base);
					
				}
			}
		}
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

function validarCPF(cpf) {
	cpf = cpf.replace(/[^\d]+/g, '');
	if (cpf == '') return false;
	// Elimina CPFs invalidos conhecidos
	if (
		cpf.length != 11 ||
		cpf == '00000000000' ||
		cpf == '11111111111' ||
		cpf == '22222222222' ||
		cpf == '33333333333' ||
		cpf == '44444444444' ||
		cpf == '55555555555' ||
		cpf == '66666666666' ||
		cpf == '77777777777' ||
		cpf == '88888888888' ||
		cpf == '99999999999'
	)
		return false;
	// Valida 1o digito
	add = 0;
	for (i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
	rev = 11 - (add % 11);
	if (rev == 10 || rev == 11) rev = 0;
	if (rev != parseInt(cpf.charAt(9))) return false;
	// Valida 2o digito
	add = 0;
	for (i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
	rev = 11 - (add % 11);
	if (rev == 10 || rev == 11) rev = 0;
	if (rev != parseInt(cpf.charAt(10))) return false;
	return true;
}

var beforeSendValidate = function(numState,nextState){
	var erro = 0;
	var msg = '';
	if ($('#task').val()=='11') {
		// valida se possuem cpf invalidos
		var cpf = $('#cpf_funcionario').val();
		if ( !validarCPF( cpf ) ){
			msg += ' CPF Invalido!';
			erro = 1;
		}
	}
	if(erro == 1) {
    	throw(msg);
    	return false;
	} else {
	}
	
	if( numState == 34 ){
		var erroConfim = false;
		$( "input[id^=papel_responsavel_item___]" ).each(function( index ) {
			var seq = $(this).attr('id').split('___')[1];
			if( $(this).val() == $("#papel_responsavel_atual").val() ){
				if( !$("#confirma___"+seq).is(":checked")
					&& ( $("#possui_item___"+seq).val() == 'S' || $("#necessita_item___"+seq).val() == 'S' ) ){
					erroConfim = true;
				}
			}
		});
		if( erroConfim ){
			alert('Você deve confirmar o cheklist dos itens!');
			return false;
		}
	}
	
	
	
	
	
	var retorno = true;
	
	if( $('#tipoSolicitacao').val() == 'N' ){
		var ret = valida('.fd_destino' );
		retorno = retorno && ret;
		var ret = valida('.fd_necessita' );
		retorno = retorno && ret;
	}else if( $('#tipoSolicitacao').val() == 'T' ){
		var ret = valida('.fd_destino' );
		retorno = retorno && ret;
		var ret = valida('.fd_origem' );
		retorno = retorno && ret;
		var ret = valida('.fd_necessita' );
		retorno = retorno && ret;
	}else if( $('#tipoSolicitacao').val() == 'D' ){
		var ret = valida('.fd_origem' );
		retorno = retorno && ret;
	}else if( $('#tipoSolicitacao').val() == 'X' ){
		var ret = valida('.fd_destino' );
		retorno = retorno && ret;
		var ret = valida('.fd_origem' );
		retorno = retorno && ret;
		var ret = valida('.fd_necessita' );
		retorno = retorno && ret;
		var ret = valida('.fd_substituto');
		retorno = retorno && ret;
	}
	

	if( numState == 27 || $('#tipoSolicitacao').val() =='S'){
		var ret = valida('.fd_rh' );
		retorno = retorno && ret;		
	}
	
	
	
	
	console.log('retorno ', retorno);
	if( !retorno ){
		alert( 'Existem campos obrigatórios vazios e/ou campos números com valor zerado. Favor verificar!' );
		console.log('entrou nessa parte!');
		return false;
	}
	
	if( $('#task').val() == 1 || $('#task').val() == 0 ){
		var erroConfim = false;
		$( "input[id^=obriga_usuario_base___]" ).each(function( index ) {
			var seq = $(this).attr('id').split('___')[1];
			if( $(this).val() == 'S' && $('#observacao_compl___'+seq).val()=='' && $('#necessita_item___'+seq).val()!='N' && $('#necessita_item___'+seq).val()!='' && $('#necessita_item___'+seq).val()!=null && $('#tipoSolicitacao').val()!='D'){
				erroConfim = true;
				alert('Você deve informar o usuário base do sistema para cópia das permissões: '+$('#descricao_item___'+seq).val()+' no campo OBS. Complementar');
			}
		});
		
		if ($('#den_tipo_solicitacao').val()=="") {
			alert('Você Precisa selecionar o tipo de solicitação!');
			erroConfim = true;
		}
		
		if( erroConfim ){
			
			return false;
		}
	}
}


function loadPerguntasSolicitacao(){
	

	if( $( "input[name^=cod_pergunta_aval_solicitacao___]" ).size() != 0 ){
		return false;
	}
	
	var cons = new Array();
	var dsTesteCpl = DatasetFactory.getDataset('perguntas_avaliacao', null, cons, null );
	
	
	var lstTeste = dsTesteCpl.values;
	for ( var y in lstTeste ) {
		var teste = lstTeste[y];

		var row = wdkAddChild('perguntas_aval_solicitacao');
		
		console.log('Add row ....' , row )
		$('#cod_pergunta_aval_solicitacao___'+row).val( teste.cod_pergunta ) ;
				
		var tipo_teste = 'I';
		$('#tipo_pergunta_aval_solicitacao___'+row).val( teste.tipo_pergunta ) ;
		$('#den_pergunta_aval_solicitacao___'+row).val( teste.den_pergunta ) ;
		
		tipo_teste = teste.tipo_pergunta;
		num_precisao = teste.num_precisao;
		cod_um = teste.cod_um;
		
		console.log('tipo_teste.....',tipo_teste);
		if( tipo_teste == 'O' ){
			$('#opcao_aval_solicitacao___'+row).show();
			$('#informado_aval_solicitacao___'+row).hide();
			$('#metrica_aval_solicitacao___'+row).hide();
				
			var dsOpcoes = getDsPaiFilho( "perguntas_avaliacao", "opcoes_pergunta", "", "cod_pergunta", teste.cod_pergunta );
			if( dsOpcoes != undefined && dsOpcoes != null ){
				var lstOpcoes = dsOpcoes.values;
				var aTemObs = [];
				$('#opcao_aval_solicitacao___'+row).append("<option value='' ></option>");
				for ( var i in lstOpcoes ) {
					var opcoes = lstOpcoes[i];
					console.log('opcoes',opcoes);
					$('#opcao_aval_solicitacao___'+row).append("<option value='"+ opcoes.cod_opcao +"' >"+ opcoes.den_opcao.toUpperCase() +"</option>");
				}
			}
			$('#opcao_aval_solicitacao___'+row).addClass('valida');
		} else if ( tipo_teste == 'X' ){
			$('#informado_aval_solicitacao___'+row).hide();
			$('#metrica_aval_solicitacao___'+row).hide();
			$('#opcao_aval_solicitacao___'+row).hide();	
			$('#multipla_aval_solicitacao___'+row).show();	
			var dsOpcoes = getDsPaiFilho( "perguntas_avaliacao", "opcoes_pergunta", "", "cod_pergunta", teste.cod_pergunta );
			if( dsOpcoes != undefined && dsOpcoes != null ){
				var lstOpcoes = dsOpcoes.values;
				var aTemObs = [];
				//$('#opcao___'+row).append("<option value='' ></option>");
				for ( var i in lstOpcoes ) {
					var opcoes = lstOpcoes[i];
					console.log('opcoes',opcoes);
					$('#multipla_aval_solicitacao___'+row).append(
							"<div class=\"custom-checkbox custom-checkbox-success custom-checkbox-xl\">"
							+ "<input type=\"checkbox\" id=\"checkbox-"+opcoes.cod_opcao+"\">"
							+ "<label for=\"checkbox-"+opcoes.cod_opcao+"\">"+opcoes.den_opcao+"</label>");
				}
			}

			// $('#opcao_aval_solicitacao___'+row).addClass('valida');
		}
		else{
			$('#opcao_aval_solicitacao___'+row).hide();								
			if( tipo_teste == 'M' ){
				$('#metrica_aval_solicitacao___'+row).show();
				$('#informado_aval_solicitacao___'+row).hide();
				
				$('#num_precisao_aval_solicitacao___'+row).val( teste.num_precisao );
				$('#cod_um_aval_solicitacao___'+row).val( teste.cod_um );
				
				num_precisao = parseInt( teste.num_precisao.split(',')[0]  );
				$('#metrica_aval_solicitacao___'+row).maskMoney( {precision : num_precisao, thousands : '.',decimal : ',', defaultZero : false, allowZero : true });	
				
			}else{
				$('#metrica_aval_solicitacao___'+row).hide();
				$('#informado_aval_solicitacao___'+row).show();
			}
		}
	}

}


function getDsPaiFilho( dataSet, table, fieldCodigo, fildFilter, fildFilterValue ){
	
	console.log( dataSet, table, fieldCodigo, fildFilter, fildFilterValue  );

	var constraintsPai = new Array();
	var lstFilter = fildFilter.split(',');
	var lstFilterValue = fildFilterValue.split(',');
	for ( var j = 0; j < lstFilter.length; j ++ ){
		console.log( 'Passo 00X',lstFilter[j],lstFilterValue[j] );
		if ( lstFilter[j] != '' && lstFilter[j] != null ){
			constraintsPai.push( DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST) );
		}
	}
	var datasetPai = DatasetFactory.getDataset(dataSet, null, constraintsPai, null );
	console.log('datasetPai',datasetPai);
	if( datasetPai != undefined && datasetPai != null ){
		var pais = datasetPai.values;
		for ( var y in pais ) {
			var pai = pais[y];
			
			var constraintsFilhos = new Array();
			constraintsFilhos.push( DatasetFactory.createConstraint("tablename", table, table, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pai.documentid, pai.documentid, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pai.version, pai.version, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
			
			var orderFilhos = new Array();
			orderFilhos.push( fieldCodigo );						
			var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos );
			console.log('DataSet',datasetFilhos);
			if ( datasetFilhos != null ){
				return datasetFilhos;
			}
		}
	}
	return null;
}



function valida( lCampos, pnGrp ) {

	var retorno = true;
	var idFocu = '';
	
	var vnGrp = pnGrp;
	if( vnGrp == "" || vnGrp == undefined ){
		vnGrp = ".fluig-style-guide";	
	}
	
	console.log('Entrei valida....', lCampos, vnGrp);
		
	$( lCampos, vnGrp ).each(
		function() {
			
			if( $(this).attr('readonly') ){
				$(this).css({'background-color' : '#EEEEEE'});
			}else{
				$(this).css({'background-color' : '#FFFFFF'});
			}
			
			console.log( 'field-valida', $(this).val(), $(this).attr('field-valida'), $(this).attr('value-valida') );
			
			if( $(this).attr('field-valida') != "" && $(this).attr('field-valida') != undefined ){
				console.log('Entrou teste field', $( '#'+$(this).attr('field-valida') ).val(), 'X' , $(this).attr('value-valida'), 'X' ,  $(this).val() );
				if( $( '#'+$(this).attr('field-valida') ).val() == $(this).attr('value-valida')
				  && $(this).val() == "" ){
					
					$(this).css({'background-color' : '#FFE4C4'});
					//alert( $(this).attr('name') );
					console.log('Validado... ', $(this).attr('name') );
					retorno = false;
					if( idFocu == '' ){
						idFocu = $(this).attr('id');
					}
				}
				if( $(this).attr('value-valida') == "!" 
					&& $( '#'+$(this).attr('field-valida') ).val() != "" 
					&& $( '#'+$(this).attr('field-valida') ).val() != "0" 
					&& $( '#'+$(this).attr('field-valida') ).val() != "0,00"
					&& $(this).val() == "" ){
							
					$(this).css({'background-color' : '#FFE4C4'});
					//alert( $(this).attr('name') );
					console.log('Validado... ', $(this).attr('name') );
					retorno = false;
					if( idFocu == '' ){
						idFocu = $(this).attr('id');
					}
				}
			}else{
				//tratar se o campo for do tipo decimal e o valor for 0
				if ($(this).hasClass("decimal-2") || $(this).hasClass("decimal-0")){
					if ( $(this).val()=='0'  || $(this).val()=='0,00' ){
						if( !( $(this).hasClass("pf") && $(this).attr('name').split('___').length <= 1 ) ){
							
							$(this).css({'background-color' : '#FFE4C4'});
							retorno = false;
							if( idFocu == '' ){
								idFocu = $(this).attr('id');
							}
						}
					}
				}
				
				if( ( $(this).val() == ""
				   || $(this).val() == null
				   || $(this).val() == undefined ) ){
					console.log('Name', $(this).attr('name') );
					if( !( $(this).hasClass("pf") && $(this).attr('name').split('___').length <= 1 ) ){
							
						$(this).css({'background-color' : '#FFE4C4'});
						//alert( $(this).attr('name') );
						console.log('Validado... ', $(this).attr('name') );
						retorno = false;
						if( idFocu == '' ){
							idFocu = $(this).attr('id');
						}
					}
				}
				
			}
			console.log('ENTROU4');		
		});
	if( idFocu != '' ){
		setTimeout("$('#"+idFocu+"').focus();", 1);
	}
	return retorno;
}
