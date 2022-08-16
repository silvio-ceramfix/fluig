var editForm = true;

function loadBody(){

	setMask();
	autoSize();
	
	/*if( $('#task').val() == "12" 
	 || $('#task').val() == "32" ){
		readOnlyAll();
		editForm = false;
	}*/
	$('#interacao').attr('readonly',false);

	loadDataSetCombo( 'id_area_rnc', 'area', 'metadata#id', 'area',      '', 	'', '', 'S', 'N' );
	loadDataSetCombo( 'motivo_raiz', 'motivo_raiz',     'cod_motivo',      'motivo', '',    '',  '', 'S', 'N' );
	
	display();
	setTipo();
	
	changeOrigem();
	trataBotaoAcao();
	
	//setCausaPadrao();
	
	$( "select[name*=id_area__]" ).each( function( index ) {
		setAreaCausa( $(this).attr('id') );
	});
		
	$( "select[name*=id_area_acao___]" ).each( function( index ) {
		setArea( $(this).attr('id') );
	});
	
}

function display(){
	
	if( $('#task').val() == "48" ){
		return true;
	}
	
	$(".panel_abertura").hide();
	$(".panel_qualidade").hide();
	$(".panel_causa").hide();
	$(".panel_acoes").hide();
	$(".panel_aprov_proposta").hide();
	$(".panel_aprov_eficaz").hide();
		
	if( $('#task').val() == "0" || $('#task').val() == "36" ){
		$(".panel_abertura").show();
		$(".panel_acao_imediata").show();
		setSolic();
	}	
	if( $('#task').val() == "2" ){
		$(".panel_abertura").show();
		$(".panel_qualidade").show();
		readOnlyAll( true, '', '.panel_abertura' );
		readOnlyAll( true, '', '.panel_causa' );
		readOnlyAll( true, '', '.panel_acoes' );
		readOnlyAll( true, '', '.panel_aprov_proposta' );
		readOnlyAll( true, '', '.panel_aprov_eficaz' );
	}	
	if( $('#task').val() == "6" || $('#task').val() == "8" ){
		$(".panel_abertura").show();
		$(".panel_qualidade").show();
		$(".panel_causa").show();
		$(".panel_acao_imediata").show();
		readOnlyAll( true, '', '.panel_abertura' );
		readOnlyAll( true, '', '.panel_qualidade' );
		readOnlyAll( true, '', '.panel_acao_imediata' );
		if( $('#task').val() == "8" ){
			readOnlyAll( true, '', '.panel_causa' );
		}
	}	
	if( $('#task').val() == "12" || $('#task').val() == "14" ){
		$(".panel_abertura").show();
		$(".panel_qualidade").show();
		$(".panel_causa").show();
		$(".panel_acoes").show();
		$(".panel_acao_imediata").show();
		readOnlyAll( true, '', '.panel_abertura' );
		readOnlyAll( true, '', '.panel_qualidade' );
		readOnlyAll( true, '', '.panel_causa' );
		readOnlyAll( true, '', '.panel_acao_imediata' );
		if( $('#task').val() == "14" ){
			readOnlyAll( true, '', '.panel_acoes' );
		}else{
			readOnlyAll( true, '.acao_conc', '' );
		}
	}
	if( $('#task').val() == "16" || $('#task').val() == "18" ){
		$(".panel_abertura").show();
		$(".panel_qualidade").show();
		$(".panel_causa").show();
		$(".panel_acoes").show();
		$(".panel_aprov_proposta").show();
		readOnlyAll( true, '', '.panel_abertura' );
		readOnlyAll( true, '', '.panel_qualidade' );
		readOnlyAll( true, '', '.panel_causa' );
		readOnlyAll( true, '', '.panel_acoes' );
		readOnlyAll( true, '', '.panel_acao_imediata' );
		readOnlyAll( true, '', '.panel_aprov_eficaz' );
		if( $('#task').val() == "18" ){
			readOnlyAll( false, '.acao_conc', '' );
			readOnlyAll( true, '', '.panel_aprov_proposta' );
		}		
	}
	if( $('#task').val() == "20" ){
		$(".panel_abertura").show();
		$(".panel_qualidade").show();
		$(".panel_causa").show();
		$(".panel_acoes").show();
		$(".panel_aprov_proposta").show();
		$(".panel_aprov_eficaz").show();
		$(".panel_acao_imediata").show();
		readOnlyAll( true, '', '.panel_abertura' );
		readOnlyAll( true, '', '.panel_qualidade' );
		readOnlyAll( true, '', '.panel_causa' );
		readOnlyAll( true, '', '.panel_acoes' );
		readOnlyAll( true, '', '.panel_aprov_proposta' );
		readOnlyAll( true, '', '.panel_acao_imediata' );
	}
	setPermissaoLinha();
}

function setSolic(){
	if( $('#origem_solic').val() == 'M' ){
		$('#nome_solicitante').attr('readonly',false);
	}else{
		$('#nome_solicitante').attr('readonly',true);
	}
}

function setTipo(){
	
	var ct = new Array();
	ct.push( DatasetFactory.createConstraint("cod_origem_rnc", $('#cod_origem').val(), $('#cod_origem').val(), ConstraintType.MUST) );
	var ds = DatasetFactory.getDataset('origem_rnc', ['ies_nf'], ct, null );

	$('.cliente').hide();
	$('.item').show();
	if( ds != null && ds.values.length > 0 ){
		if( ds.values[0]["ies_nf"] == 'S' ){
			$('.cliente').show();
			$('.item').hide();		
		}
	}
	
}


function setPermissaoLinha(){
	
	$( "input[name*=seq_causa___]" ).each( function( index ) {
		var seq = $(this).attr('id').split('___')[1];
		if( $('#cod_responsavel_acao_orig___'+seq).val() != $('#user_atual').val() ){
			setReadOnlyRow(seq,'.acao',true);
		}else{
			setReadOnlyRow(seq,'.acao',true);
			setReadOnlyRow(seq,'.acao_conc',true);
			if( $('#task').val() == "18" ){
				setReadOnlyRow(seq,'.acao_conc',false);
			}else if( $('#task').val() == "12" ){
				setReadOnlyRow(seq,'.acao',false);
			}
		}
	});
	
}


function setReadOnlyRow(seq,cla,tip){
	$( cla ).each( function( index ) {
		if( $(this).attr('id').split('___')[1] == seq ){
			$(this).attr('readonly',tip);
		}
	});
}

function setCausaPadrao(){
	$('#problema').val( $('#analise_dados').val() );
	setCausaPadraoDetalhe('medicao','Medida');
	setCausaPadraoDetalhe('mao_de_obra','Mão de Obra');
	setCausaPadraoDetalhe('maquina','Máquina');
	setCausaPadraoDetalhe('materia_prima','Matéria-Prima');
	setCausaPadraoDetalhe('meio_ambiente','Meio Ambiente');
	setCausaPadraoDetalhe('metodo','Método');
	
}

function setCausaPadraoDetalhe(campo,filtro){
	var txtDetalhe = "";
	var detalhes = getDsPaiFilho( 'causa', 'detalhe', 'causa', filtro, 'detalhe' );
	for( var i = 0; i < detalhes.length; i++ ){
		if( i != 0){
			txtDetalhe += '\n';
		}
		txtDetalhe += detalhes[i]['detalhe'];
	}
	$('#'+campo).val( txtDetalhe );
}

function setMask(){
	$('.decimal2').maskMoney( { precision:2, thousands:'.',decimal:','} );
	FLUIGC.calendar('.dataFluig');
	FLUIGC.calendar('.data-fluig');
	autoSize();
}

function addAcaoContencao(){
	//if( !editForm ){ return false; }
	
	if( $('#task').val() != "0" 
	 && $('#task').val() != "36"
	 && $('#task').val() != "2" ){
		return false;
	}	
		
	var seq = wdkAddChild(  'acao_contencao' );
	//$('#status_acao_imed___'+seq).val('C');
	setMask();
}

function addAcao(){
	if( !editForm ){ return false; }
	var seq = wdkAddChild(  'acao' );
	$('#status_acao___'+seq).val('Novo');
	setMask();
	trataBotaoAcao();
	$('#acao_alterada').val('S');
}

function addCausa(){
	
	var maxSeq = 0;
	$( "input[name*=seq_causa___]" ).each( function( index ) {
		var seqAtual = parseInt( $(this).val() );
		if( maxSeq < seqAtual){
			maxSeq = seqAtual;
		}
	});
	var seq = wdkAddChild(  'causa_detalhe' );
	$('#seq_causa___'+seq).val( maxSeq+1 );
	
	setArea('id_area___'+seq);
	setMask();
}

function changeSecao(){
	$('#den_secao_equipamento').val( $("#secao_equipamento option:selected").text() );
}

function changeOrigem(){
	$('#den_origem').val( $("#origem  option:selected").text() );
	setTipo();
}

function setEmpresa(){
	$('#den_empresa').val( $("#empresa option:selected").text() );
}

function setResumoCausa(){
	$('#den_resumo_causa').val( $("#resumo_causa  option:selected").text() );
}


function setAreaCausa(id){
	var seq = id.split('___')[1];
	$('#den_area_causa___'+seq).val( $("#id_area___"+ seq +"  option:selected").text() );
	
	var ct = new Array();
	ct.push( DatasetFactory.createConstraint("metadata#id", $('#id_area___'+seq).val(), $('#id_area___'+seq).val(), ConstraintType.MUST) );
	var ds = DatasetFactory.getDataset('area', null, ct, null );
	console.log('DataSet',ds);
	if( ds != null && ds.values.length > 0 ){
		$('#pool_area_causa___'+seq).val( ds.values[0]["cod_papel"] );
		$('#gestor_area_causa___'+seq).val( ds.values[0]["cod_gerente"] );
		$('#cod_responsavel_causa___'+seq).val( ds.values[0]["cod_responsavel_rnc"] );
	}	
	setResponsAreaCausa();
}

function setResponsAreaCausa(){
	var arrResp = new Array();
	var arrGest = new Array();
	$( "select[name*=id_area__]" ).each( function( index ) {
		var seq = $(this).attr('id').split('___')[1];
		if( $('#cod_responsavel_causa___'+seq).val() != "" 
		 && arrResp.indexOf( $('#cod_responsavel_causa___'+seq).val() ) == -1 ){
			arrResp.push( $('#cod_responsavel_causa___'+seq).val() );
		}
		if( $('#gestor_area_causa___'+seq).val() != "" 
		 && arrGest.indexOf( $('#gestor_area_causa___'+seq).val() ) == -1 ){
			arrGest.push( $('#gestor_area_causa___'+seq).val() );
		}
	});
	$('#responsaveis_causa').val( arrResp.join(',') );
	$('#gestores_causa').val( arrGest.join(',') );
}

function setArea(id){
	var seq = id.split('___')[1];
	$('#den_area_acao___'+seq).val( $("#id_area_acao___"+ seq +"  option:selected").text() );
	
	var ct = new Array();
	ct.push( DatasetFactory.createConstraint("metadata#id", $('#id_area_acao___'+seq).val(), $('#id_area_acao___'+seq).val(), ConstraintType.MUST) );
	var ds = DatasetFactory.getDataset('area', null, ct, null );
	console.log('DataSet',ds);
	if( ds != null && ds.values.length > 0 ){
		$('#pool_area_acao___'+seq).val( ds.values[0]["cod_papel"] );
		$('#gestor_area_acao___'+seq).val( ds.values[0]["cod_gerente"] );
		$('#cod_responsavel_acao___'+seq).val( ds.values[0]["cod_responsavel_rnc"] );
	}	

	var ct = new Array();
	ct.push( DatasetFactory.createConstraint("metadata#id", $('#id_area_acao_orig___'+seq).val(), $('#id_area_acao_orig___'+seq).val(), ConstraintType.MUST) );
	var ds = DatasetFactory.getDataset('area', null, ct, null );
	console.log('DataSet',ds);
	if( ds != null && ds.values.length > 0 ){
		$('#cod_responsavel_acao_orig___'+seq).val( ds.values[0]["cod_responsavel_rnc"] );
	}
	
	setResponsArea();
}

function setResponsArea(){
	var arrResp = new Array();
	var arrGest = new Array();
	$( "select[name*=id_area_acao___]" ).each( function( index ) {
		var seq = $(this).attr('id').split('___')[1];
		if( $('#cod_responsavel_acao___'+seq).val() != "" 
		 && arrResp.indexOf( $('#cod_responsavel_acao___'+seq).val() ) == -1 ){
			arrResp.push( $('#cod_responsavel_acao___'+seq).val() );
		}
		if( $('#gestor_area_acao___'+seq).val() != "" 
		 && arrGest.indexOf( $('#gestor_area_acao___'+seq).val() ) == -1 ){
			arrGest.push( $('#gestor_area_acao___'+seq).val() );
		}
	});
	$('#responsaveis_acao').val( arrResp.join(',') );
	$('#gestores_acao').val( arrGest.join(',') );
}


function setAreaCapa(){
	var ct = new Array();
	ct.push( DatasetFactory.createConstraint("metadata#id", $('#id_area_rnc').val(), $('#id_area_rnc').val(), ConstraintType.MUST) );
	var ds = DatasetFactory.getDataset('area', null, ct, null );
	console.log('DataSet',ds);
	if( ds != null ){
		$('#area_rnc').val( ds.values[0]["area"] );
		
		/*
		if( ds.values[0]["pool_papel"].indexOf('Pool:Role:') >= 0 ){
			$('#pool_area').val( ds.values[0]["pool_papel"] );
		}else{
			$('#pool_area').val( 'Pool:Role:'+ds.values[0]["pool_papel"] );
		}*/
		
		$('#gestor_area').val( ds.values[0]["cod_gerente"] );
		$('#cod_responsavel_rnc').val( ds.values[0]["cod_responsavel_rnc"] );
	}
}

function setMotivo(){
	//if( $("#motivo_raiz option:selected").text().split('-').length = 2 ){
	//	$("#den_motivo").val( $("#motivo_raiz option:selected").text().split('-')[1].trim() );
	//}else{
		$("#den_motivo").val( $("#motivo_raiz option:selected").text() );	
	//}
}


function trataBotaoAcao(){
	$( "input[name*=sub_processo___]" ).each( function( index ) {
		var seq = $(this).attr('id').split('___')[1];
		if( $(this).val() == ""
		 || $(this).val() == undefined ){
			$('#btZoomAcao___'+seq).parent().hide();
			$('#btDelAcao___'+seq).parent().show();
		}else{
			$('#btZoomAcao___'+seq).parent().show();
			$('#btDelAcao___'+seq).parent().hide();
			$('#acao___'+seq).attr('readonly',true);
		}
	});
}

function zoomAcao( id ){
	var WCMAPI = window.parent.WCMAPI;
	var seq = id.split('___')[1];
	var url = WCMAPI.getServerURL()+WCMAPI.getServerContextURL()+'/p/'+WCMAPI.getOrganizationId()+'/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID='+$('#sub_processo___'+seq).val();
    console.log( 'URL..... ', url );
    window.open(url, '_blank');
    return true;
}

function fnCustomDelete(oElement){
	
	if( $(oElement).attr('id').split('___')[0] == 'btDelAcaoImed'
	 && $('#task').val() != "0" 
	 && $('#task').val() != "36"
	 && $('#task').val() != "2" ){
		return false;
	}
	
	if( $(oElement).attr('id').split('___')[0] == 'btDelCausa'
	 && $('#task').val() != "6" 
	 && $('#task').val() != "8" ){
		return false;
	}
	
	if( $(oElement).attr('id').split('___')[0] == 'btDelAcao'
	 && ( $('#task').val() != "12"
	   || $('#cod_responsavel_acao_orig___'+$(oElement).attr('id').split('___')[1] ).val() != $('#user_atual').val() ) ){
		return false;
	}
	
	fnWdkRemoveChild(oElement);
	
	setResponsArea();
	setResponsAreaCausa();
	
}

function autoSize(){
	$('textarea').each(function (){
		$(this).on(
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
	})
}


function maskFone( id ){
	if( $('#'+id).val() == undefined || $('#'+id).val() == null ){
		$('#'+id).val( '' );
	}
	if($('#'+id).val().length > 13 ) {  
		$('#'+id).unmask();
		$('#'+id).mask("(99)99999-9999");  
	} else {  
		$('#'+id).unmask();
		$('#'+id).mask("(99)9999-9999?9");  
	} 
}

function readOnlyAll(){
	console.log('Entrei Read Only....');
	$('input, select, textarea').each(function(){
		console.log('Entrei Read Only campo....',$(this).attr('id'));
		if( $(this).is('select') ){			
			$('#'+ $(this).attr('id') +' option:not(:selected)').prop('disabled', true);
		}else{
			$(this).attr('readonly',true);
		}
	});
}


/*
function display(){
	$(".panel_abertura").hide();
	$(".panel_qualidade").hide();
	$(".panel_qualidade_abrangencia").hide();
	$(".panel_causa").hide();
	$(".panel_acoes").hide();
	$(".panel_aprov_proposta").hide();
	$(".panel_aprov_eficaz").hide();
	
	if( $('#task').val() == "0" || $('#task').val() == "36" ){
		$(".panel_abertura").show();
	}	
	if( $('#task').val() == "2" ){
		$(".panel_abertura").show();
		$(".panel_qualidade").show();
		$(".panel_qualidade_abrangencia").show();
	}	
	if( $('#task').val() == "6" || $('#task').val() == "8" ){
		$(".panel_abertura").show();
		$(".panel_qualidade").show();
		$(".panel_qualidade_abrangencia").show();
		$(".panel_causa").show();
	}	
	if( $('#task').val() == "12" || $('#task').val() == "14" ){
		$(".panel_abertura").show();
		$(".panel_qualidade").show();
		$(".panel_causa").show();
		$(".panel_acoes").show();
	}
	if( $('#task').val() == "16" || $('#task').val() == "18" ){
		$(".panel_abertura").show();
		$(".panel_qualidade").show();
		$(".panel_causa").show();
		$(".panel_acoes").show();
		$(".panel_aprov_proposta").show();
	}
	if( $('#task').val() == "20" ){
		$(".panel_abertura").show();
		$(".panel_qualidade").show();
		$(".panel_causa").show();
		$(".panel_acoes").show();
		$(".panel_aprov_proposta").show();
		$(".panel_aprov_eficaz").show();
	}
}
*/

var beforeSendValidate = function(numState, nextState) {

	console.log('Start valdade...');
	var retorno = true;
	if( numState == '0' || numState == '36' ){
		retorno = valida('.abertura');
	}

	if( numState == '2' ){
		retorno = valida('.qualidade');
		if( nextState == 44 ){
			retorno = valida('.acoes_imed');
			$( "select[name*=status_acao_imed___]" ).each( function( index ) {
				if( $(this).val() != "C" ){
					alert( 'Existem ações imediatas não concluidas' );
					retorno = false;		
				}
			});
		}
	}
	
/*	if( numState == '2' ){
		retorno = valida('.abertura');
	} */
	
	if( numState == '6' ){
		if( $('#materia_prima').val() == "" 
		 && $('#maquina').val() == ""
		 && $('#medicao').val() == "" 
		 && $('#mao_de_obra').val() == "" 
		 && $('#meio_ambiente').val() == ""
		 && $('#metodo').val() == ""
		 && $('#problema').val() == "" ){
			
			valida('#materia_prima'); 
			valida('#maquina');
			valida('#medicao'); 
			valida('#mao_de_obra'); 
			valida('#meio_ambiente');
			valida('#metodo');
			valida('#problema');
			alert('Você deve informmar ao menos uma causa!');
			retorno = false;
		}
		retorno = valida('.causa');
		
		var qtd = 0;
		$( "input[name*=causa___]" ).each(function( index ) {
			qtd += 1;
		});
		if( qtd == 0 ){
			alert( 'Não existem causas informadas' );
			return false;
		}
	
	}
	
	if( numState == '12' || numState == '18' ){
		
		retorno = valida('.acao');
		
		var qtd = 0;
		$( "input[name*=acao___]" ).each(function( index ) {
			qtd += 1;
		});
		if( qtd == 0 ){
			alert( 'Não existem ações informadas' );
			return false;
		}
		
	}
	
	if( numState == '16' ){
		retorno = valida('.analise');
	}
	
	if( numState == '20' ){
		retorno = valida('.eficaz');
	}
	
	
	console.log('teste 7 - 12...');
	if( numState == '7' && nextState == '12' ){
		retorno = valida('.sub_processo');
		var qtd_proc_aberto = 0;
		var sql = " select count(*) as qtd_proc_aberto "+
				  "   from ml001148 p  "+
		  		  "   join documento d on (p.companyid = d.COD_EMPRESA  "+
		  		  "		 			   and p.documentid = d.NR_DOCUMENTO  "+
				  "	 				   and p.version = d.NR_VERSAO)  "+
		  		  "   join anexo_proces c on (c.cod_empresa = d.cod_empresa  "+
	  	          "                      and c.NR_DOCUMENTO = d.NR_DOCUMENTO  "+
		          "                      and c.NR_VERSAO = d.NR_VERSAO)  "+
		  		  "   join proces_workflow u on ( u.COD_EMPRESA = c.COD_EMPRESA   "+ 
				  "						      and u.NUM_PROCES = c.NUM_PROCES )  "+
		  		  "  where d.VERSAO_ATIVA = 1  "+
		  		  "    and u.STATUS = 0  "+
		  		  "    and p.numero_processo_rnc  = '"+ $('#numero_processo').val().trim()   +"'";
		
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/FluigDS', null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('SQL', sql, null, ConstraintType.MUST) );
		var ds = DatasetFactory.getDataset("select", null, constraints, null);
		if ( ds == null || ds.values.length > 0 ){
			qtd_proc_aberto = parseInt( ds.values[0]['qtd_proc_aberto'] );
		}
		if( qtd_proc_aberto > 0 ){
			alert( 'Existem ações pendentes' );
			return false;
		}
	}

	if( !retorno ){
		alert( 'Existem campos obrigatórios, favor verificar' );
	}/*else{
		console.log('Entrou else', $('num_rnc').val() );
		if( $('#num_rnc').val() == "" || $('#num_rnc').val() == undefined || $('#num_rnc').val() == null ){
			var ano = new Date().getFullYear();
			var ct = new Array();
			ct.push( DatasetFactory.createConstraint("sequencia", "rnc", null, ConstraintType.MUST) );
			ct.push( DatasetFactory.createConstraint("ano", ano, null, ConstraintType.MUST) );
			console.log('Entrou ct', ct );
			var ds = DatasetFactory.getDataset('dsk_get_seq_ano', null, ct, null );
			console.log('DataSet',ds);
			if( ds != null ){
				var seq = ds.values[0]["sequencia"];
				$('#sequencia').val( seq );
				if ( $('#num_rnc_pai').val() == ''){
					$('#num_rnc').val( seq+"/"+ano );
				} else {
					var ct2 = new Array();
					ct2.push( DatasetFactory.createConstraint("num_rnc_pai", $('#num_rnc_pai').val(), $('#num_rnc_pai').val(), ConstraintType.MUST) );
					var ds2 = DatasetFactory.getDataset('rnc', null, ct2, null );			
					console.log('DataSet',ds2);
					var seq2 = 1;
					if( ds2 != null && ds2 != undefined){
						if ( ds2.values.length > 0){
							seq2 = ds2.values.length;
							console.log('entrou 1');
						}							
					}
					console.log('num_rnc_pai',$('#num_rnc_pai').val() + '-' + seq2);
					$('#num_rnc').val( $('#num_rnc_pai').val() + '-' + seq2 );
				}
				alert('Gerado RNC numero '+$('#num_rnc').val() );
			}		
		}
	}*/
	
	setResponsArea();
	setResponsAreaCausa();
	
	return retorno;
	
}

function valida( lCampos ) {

	var retorno = true;
	var idFocu = '';
	$( 'input, select, textarea' ).each(
			function() {
				if( $(this).attr('readonly') ){
					$(this).css({'background-color' : '#EEEEEE'});
				}else{
					$(this).css({'background-color' : '#FFFFFF'});
				}
			});
	
	$( lCampos ).each(
		function() {
			if( ( $(this).val() == ""
			   || $(this).val() == null
			   || $(this).val() == undefined ) ){
				console.log($(this).hasClass("pf"), $(this).attr('name').split('___').length );
				if( !( $(this).hasClass("pf") && $(this).attr('name').split('___').length <= 1 ) ){
					
					$(this).css({'background-color' : '#FFE4C4'});
					retorno = false;
					if( idFocu == '' ){
						idFocu = $(this).attr('id');
					}
				}
			}
		});
	if( idFocu != '' ){
		setTimeout("$('#"+idFocu+"').focus();", 1);
	}
	return retorno;
}


function trataPrazo(){
	var dataBase = '0000-00-00';
	var maxSeq = 0;
	$( "input[name*=prazo_acao___]" ).each( function( index ) {
		var dataAtu = $(this).val().split('/').reverse().join('-');
		if( dataBase < dataAtu && $(this).val() != "" ){
			dataBase = dataAtu;
		}
	});
	$('#data_prazo').val( dataBase.split('-').reverse().join('/') );
}




function setDataAcaoImediata(){

	var dataBase = '0000-00-00';
	var maxSeq = 0;
	$( "input[name*=prazo_acao_imed___]" ).each( function( index ) {
		var dataAtu = $(this).val().split('/').reverse().join('-');
		if( dataBase < dataAtu && $(this).val() != "" ){
			dataBase = dataAtu;
		}
	});
	$('#prazo_acao_imed_geral').val( dataBase.split('-').reverse().join('/') );
}



function showCamera(id){
	  console.log("Disparou >>> showCamera()");

	  var campo = id.split('___')[0];
	  var index = id.split('___')[1];

	  console.log(campo,index);

	  var nome_documento = $('#seq_acao___' + index ).val() + '___' + index;

	  var teste = JSInterface.showCamera(nome_documento);

	  console.log(teste);
	  $(window.top.document).find('#attachmentsStatusTab').trigger('click');
	  $("#doc_acao___" + index).val( nome_documento );
	  
	  setTimeout(function(){
	    Anexo();
	  }, 100);

	}

	function Anexo() {
		console.log("Disparou >>> Anexo()");
		
	    $.each(parent.ECM.attachmentTable.getData(), function(i,attachment) {
			console.log(i,attachment);
			var index =  attachment.description.split('___')[1];
	        var attachmentName =  attachment.name;		
			$("#doc_acao___" + index).val(attachmentName);

	    });
	}
	
	function fupItem(el){

		// console.log(el);
		// console.log($(el).attr('id').split('___')[1]);

		html =  '<div class="row row_table"> '+
				'	<input type="hidden" class="form-control" name="data_hist_modal" id="data_hist_modal" readonly > '+
				'	<input type="hidden" class="form-control" name="cod_hist_modal" id="cod_hist_modal" readonly > '+
				'	<input type="hidden" class="form-control" name="user_hist_modal" id="user_hist_modal" readonly > '+			
				'	<input type="hidden" class="form-control" name="item_hist_modal" id="item_hist_modal" readonly > '+
				'	<input type="hidden" class="form-control" name="cod_item_hist_modal" id="cod_item_hist_modal" readonly > '+
				'</div> '+
				'<div class="row  row_table"> '+
				'	<div class="col-sm-12 pd_her"> '+
				'		<label for="exampleTag">Descri&ccedil;&atilde;o de Intera&ccedil;&atilde;o</label> '+
				'		<textarea rows="3" name="desc_hist_modal" id="desc_hist_modal" class="form-control" ></textarea> '+
				'	</div> '+
				'</div> '+
				'<div class="row"> '+
				'	<div class="col-sm-12 pd_her" id="comentarios"> '+
				'		<label for="exampleTag">Históricos</label> '+
				'	</div> '+
				'</div>';


		var fupModal = FLUIGC.modal({
			title: 'Follow Up Item',
			content: html,
			id: 'fup_modal',
			actions: [{
				'label': 'Salvar',
				'bind': 'data-salva-modal',
			},{
				'label': 'Cancelar',
				'autoClose': true
			}]
		}, function(err, data) {
			if(err) {
				// do error handling
			} else {

				var usuario = $('#user_atual').val();
				var ct = new Array();
				ct.push( DatasetFactory.createConstraint("colleagueId", usuario, usuario, ConstraintType.MUST ) );
				var ds = DatasetFactory.getDataset("colleague", ['colleagueName'], ct, null);
				console.log(ds);

				var index = el.split('___')[1];
				var cod_item = $('#seq_acao___' + index).val();

				$('#data_hist_modal').val(DataHoraHoje());
				$('#cod_hist_modal').val(usuario);
				$('#user_hist_modal').val(ds.values[0]['colleagueName']);
				$('#cod_item_hist_modal').val(cod_item);
				
				var html = '';
				$("input[name*=cod_item_hist___]").each(function(index, value){	
					var linha = $(this).attr('id').split('___')[1];
					console.log(value, $(this).val(), $(this).value);
					if ( $(this).val() == cod_item){
						html += '<textarea rows="3" name="desc_hist_modal" id="desc_hist_modal" class="form-control" readonly>'+ $('#user_hist___'+linha).val() +' - '+ $('#data_hist___'+linha).val() +'\n'+ $('#desc_hist___'+linha).val()+'</textarea> ';	
					}
					
				});	

				$('#comentarios').append(html);
				// do something with data
			}

			$('#fup_modal').on('click', '[data-salva-modal]', function(ev) {

				if ($('#desc_hist_modal').val() == ''){
					alert('Necessário informar descrição do follow Up');
					return false;
				}

				var row = addFilho('followup');

				$('#tbl_fup').contents().find("input,select,textarea").each(function () {
					var id = $(this).attr( 'name' );
					console.log(id);
					$('#'+ id + '___' + row).val( $('#'+ id + '_modal').val() );
				});

				alert('Follow Up registrado com sucesso!');

				fupModal.remove();
			});
		});	

	}
