$(document).bind("DOMNodeRemoved", function(e){
	var target = $(e.target);
	if( target.html().indexOf("id='pai_filho_modal'" ) > 0 || target.html().indexOf("id='modal-zoom'" ) ){
		//parent.$('#workflowView-cardViewer').css( 'zIndex', 0 );
		parent.$('#workflowview-header').show();
	}
});

function zoom(componente) {
	if (componente == 'bt_tipo_documento' ) {

		if( $("#lstTipoDocumento").val() == 'all' ){
			modalzoom.open("Tipos de Documentos",
					   "tipos_documentos", 
					   "cod_tipo_documento,Cod.,den_tipo_documento,Descrição,cod_pasta_ged,Cod.Pasta", 
					   "cod_tipo_documento,den_tipo_documento,cod_pasta_ged,ies_tipo_direto,ies_doc_analise", 
					   "",
					   componente, false, 'default', null, null,
					   "" );
		}else{
			modalzoom.open("Tipos de Documentos",
					   "selectDataSet", 
					   "cod_tipo_documento,Cod.,den_tipo_documento,Descrição,cod_pasta_ged,Cod.Pasta", 
					   "cod_tipo_documento,den_tipo_documento,cod_pasta_ged,ies_tipo_direto,ies_doc_analise", 
					   "dataset,tipos_documentos,___in___cod_tipo_documento,"+$("#lstTipoDocumento").val(),
					   componente, false, 'default', null, null,
					   "" );
		}
	}
	
	
	if (componente == 'bt_parte') {

		var filtroCPL = '';
		var largura = "default";

		modalzoom.open("Fornecedor",
			"selectLogix",
			"cod_fornecedor,Codigo,raz_social,Fornecedor",
			"cod_fornecedor,num_cgc_cpf,raz_social",
			"table,fornecedor,ies_fornec_ativo,A,sqlLimit,250" + filtroCPL,
			componente, false, largura, null, null,
			"cod_fornecedor||'-'||raz_social");
	}
	
	
	if (componente == 'bt_empresa') {

		var filtroCPL = '';
		var largura = "default";

		modalzoom.open("Empresa",
			"selectLogix",
			"cod_empresa,Codigo,den_empresa,Empresa",
			"cod_empresa,den_empresa,den_reduz",
			"table,empresa,order,cod_empresa,sqlLimit,250" + filtroCPL,
			componente, false, largura, null, null,
			"cod_empresa||'-'||den_empresa");
	}
	
	
	if (componente == 'bt_advogado') {

		var filtroCPL = '';
		var largura = "default";

		modalzoom.open("Advogado",
			"cadastro_advogado",
			"raz_social,Advogado",
			"cod_fornecedor,raz_social,cod_responsavel,email",
			"sqlLimit,250" + filtroCPL,
			componente, false, largura, null, null,
			"cod_fornecedor||'-'||raz_social");
	}
	
	if (componente == 'bt_contrato') {

		var filtroCPL = '';
		var largura = "default";

		modalzoom.open("Contrato",
			"dsk_contratos",
			"cod_empresa,Empresa,titulo,Titulo,data_assinatura,Assinatura,data_vencimento,Vencimento,status,Status",
			"",
			"___in___tipo_solicitacao,C|S,cod_parte,"+$('#cod_parte').val()+",ct.cod_tipo_documento,"+$('#cod_tipo_documento').val(),
			componente, false, largura, null, null,
			"titulo||'-'||data_vencimento");
	}
	//"cod_tipo_documento,+$('#cod_tipo_documento').val()+",
	
	
	
}

function setSelectedZoomItem(selectedItem) {
	console.log('selectedItem ',selectedItem);
	if (selectedItem.type == 'bt_tipo_documento') {
		console.log('entrou bt_tipo_documento ',selectedItem);
		$('#cod_tipo_documento').val(selectedItem.cod_tipo_documento);
		$('#den_tipo_documento').val(selectedItem.den_tipo_documento);
		$('#folderID').val(selectedItem.cod_pasta_ged);
		$('#ies_tipo_direto').val(selectedItem.ies_tipo_direto);
		$('#ies_doc_analise').val(selectedItem.ies_doc_analise);
		if ($('#ies_doc_analise').val()=='S') {
			$('.assinantes').hide();
			$('.novos_assinantes').hide();
		} else {
			$('.assinantes').show();
			$('.novos_assinantes').show();
		}
		carregaAssinantesFixos();
	}
	
	      

		if (selectedItem.type == 'folder') {
			document.getElementById('folderID').value = selectedItem['documentPK.documentId'];
			document.getElementById('folderName').value = selectedItem['documentDescription'];
		}
		
		if (selectedItem.inputId == "assinante"){
			
			var index = wdkAddChild('tableExSigners');
	        
			$('#tabName___' + index).val(selectedItem.nome);
			$('#tabEmail___' + index).val(selectedItem.cEmail);
			$('#tabEmailComum___' + index).val(hex2a(selectedItem.email));
			$('#tabCpf___' + index).val(selectedItem.cCpf);
			$('#tabCpfComum___' + index).val(hex2a(selectedItem.cpf));
			$('#tabTipoAssinatura___' + index).val(selectedItem.tipoAssinatura);
			$('#tabTitulo___' + index).val(selectedItem.titulo);
			$('#tabEtapa___' + index).val($("#etapa").val() != "" ? $("#etapa").val() : "1");

			/*arrSigners.push({
	                nome: selectedItem.nome,
	                email: hex2a(selectedItem.email),
	                cpf: hex2a(selectedItem.cpf),
	                tipo: $('#tabTipoAssinatura___' + index).val(),
					titulo: selectedItem.titulo,
	                etapa: $('#tabEtapa___' + index).val(), 
	                status: 'Pendente'
	        });
	            
	        $("#arrSigners").val(JSON.stringify(arrSigners));*/
	        window["assinante"].clear();
	        
	        
		
	}
		
		
	if (selectedItem.type == 'bt_parte') {
		$('#cod_parte').val(selectedItem.cod_fornecedor);
		$('#nom_parte').val(selectedItem.raz_social);
		$('#cnpj_parte').val(selectedItem.num_cgc_cpf);
		
		setCliente();
		
	}	
	
	if (selectedItem.type == 'bt_empresa') {
		$('#cod_empresa').val(selectedItem.cod_empresa);
		$('#den_empresa').val(selectedItem.den_empresa);
	}
	
	if (selectedItem.type == 'bt_advogado') {
		$('#cod_advogado').val(selectedItem.cod_fornecedor);
		$('#den_advogado').val(selectedItem.raz_social);
		$('#cod_resp_advogado').val(selectedItem.cod_responsavel);
		$('#email_advogado').val(selectedItem.email);
		
	}
	
	if (selectedItem.type == 'bt_contrato') {
		$('#contrato_original').val(selectedItem.titulo);
		$('#data_assinatura_original').val(selectedItem.data_assinatura);
		$('#doc_original').val(selectedItem.nr_documento);
		$('#proc_original').val(selectedItem.num_proces);
		$('#cod_empresa').val(selectedItem.cod_empresa);
		
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint("cod_empresa", selectedItem.cod_empresa, selectedItem.cod_empresa, ConstraintType.MUST) );
		
		//var dse = DatasetFactory.getDataset("selectLogix", ["DEN_EMPRESA"], [ DatasetFactory.createConstraint("cod_empresa", selectedItem.cod_empresa, selectedItem.cod_empresa, ConstraintType.MUST) ], null );
		var dse = DatasetFactory.getDataset("empresa", "den_empresa", constraints, null );
		console.log('dse ',dse);
		//$('#den_empresa').val(dse.values[0].DEN_EMPRESA);
		
		if(  $('#titulo').val() == ""  ){
			$('#titulo').val(selectedItem.titulo);
		}
	}

}


function carregaAssinantesFixos() {
	var dsOpcoes = getDsPaiFilho( "tipos_documentos", "tableExSigners", "", "cod_tipo_documento", $('#cod_tipo_documento').val() );
	if( dsOpcoes != undefined && dsOpcoes != null ){
		var lstOpcoes = dsOpcoes.values;

		for ( var i in lstOpcoes ) {
			var seq = wdkAddChild('tableFixoSigner');


			//$('#advogado_hist___' + seq).val($('#advogado_parecer').val());
			var opcoes = lstOpcoes[i];
			console.log('opcoes',opcoes);
			//$('#opcao___'+row).append("<option value='"+ opcoes.cod_opcao +"' >"+ opcoes.den_opcao.toUpperCase() +"</option>");
			$('#tabNameFixo___'+seq).val(opcoes.tabName);
			$('#tabEmailFixo___'+seq).val(opcoes.tabEmailComum);
			$('#tabCpfFixo___'+seq).val(opcoes.tabCpfComum);
			$('#tabTipoAssinaturaFixo___'+seq).val(opcoes.tabTipoAssinatura);
			$('#tabTituloFixo___'+seq).val(opcoes.tabTitulo);
			$('#tabEtapaFixo___'+seq).val(opcoes.tabEtapa);
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



var myLoading2 = FLUIGC.loading(window);			
function searchCPNJ() {
	
	/*if( $('#tipo_cadastro').val() != "N" ){
		return false;
	}*/
	
	var cnpj = $('#cnpj_parte').val();
	if( cnpj.indexOf("/0000-") == -1 ){
		cnpj = cnpj.substring(1).replace(/[^\d]+/g, '');
	}else{
		return false;;
	}
	myLoading2.show();
	//situacao
	$.ajax({
		async: false,
		type: "GET",
		dataType: 'json',
		url: 'https://receitaws.com.br/v1/cnpj/' + cnpj + "?callback=?",
		success: function (data) {
			console.log(data)
			
			if( data.status == "ERROR" ){
				alert( data.message );
				myLoading2.hide();
			}
			
			$("#nom_parte").val(data.nome);
			
			/*var nome = (data.fantasia ? data.fantasia : data.nome);
			$("#nom_reduzido").val(nome);
			var cod_cidade = buscaCidade(data.uf.trim(), data.municipio.trim());
			if( cod_cidade != -1 ){
				loadBairro( $('#cod_cidade' ).val(), 'bairro_sel' );
				buscaBairro(cod_cidade, data.bairro)
			}
			var tipo = buscaTipoLogradouro(data.logradouro);
			if( tipo.status ){
				console.log('tipo...',tipo);
				$("#endereco").val(tipo.logradouro);
				$("#tipo_logradouro").val( tipo.tip_logradouro );
			}else{
				$("#endereco").val(data.logradouro);
			}					
			$("#complemento").val(data.complemento);
			$("#fone").val(data.telefone);
			$("#numero").val(data.numero); 
			//$("#bairro").val(data.bairro);
			$("#cep").val(data.cep.replace('.','') );
			$("#situacao").val('Situação Receita: '+data.situacao);
			*/
			
			myLoading2.hide();
			
			setCliente();
			
		},
		error: function () {
			alert('CNPJ Não encontrado.')
			myLoading2.hide();
		}
	});
}


function buscaCidade(uf,cidade){
	console.log('Cidade - UF',uf,cidade);
	
	var ct1 = DatasetFactory.createConstraint("cod_uni_feder", uf.toUpperCase(), uf.toUpperCase(), ConstraintType.MUST);
	var ct2 = DatasetFactory.createConstraint("den_cidade", cidade.toUpperCase().trim(), cidade.toUpperCase().trim(), ConstraintType.MUST);
	var ds = DatasetFactory.getDataset("cidades", null, [ct1,ct2], null);
	console.log('ds',ds);
	if( ds.values.length > 0 ){
		$("#estado").val( ds.values[0]["COD_UNI_FEDER"] );
		$("#estado_ent").val( ds.values[0]["COD_UNI_FEDER"] );
		$("#cod_cidade").val( ds.values[0]["COD_CIDADE"] );
		//$("#cidade").val( ds.values[0]["DEN_CIDADE"] );
		$("#cod_pais").val( ds.values[0]["COD_PAIS"] );	
		
		zoomDestino = window[$("#cidade").attr('filter-instance')];
		zoomDestino.setValue( ds.values[0]["DEN_CIDADE"] );
		
		$("#pais").val( "BRASIL" );	
		$("#pais_ent").val( "BRASIL" );
		
		return ds.values[0]["COD_CIDADE"];
	}else{
		return '-1';
	}
}

function buscaBairro(cidade, bairro){
	
	console.log('Cidade - Bairro',cidade,bairro);
	
	var ct1 = DatasetFactory.createConstraint("COD_CIDADE", cidade.toUpperCase(), cidade.toUpperCase(), ConstraintType.MUST);
	var ct2 = DatasetFactory.createConstraint("DEN_BAIRRO", bairro.toUpperCase().trim(), bairro.toUpperCase().trim(), ConstraintType.MUST);
	var ds = DatasetFactory.getDataset("bairros", null, [ct1,ct2], null);
	console.log('ds',ds);
	
	$("#bairro").val( bairro );
	if( ds.values.length > 0 ){	
		$("#bairro_sel").val( ds.values[0]["COD_BAIRRO"] );
		$("#ies_bairro_manual").val( "" );
		$("#ies_bairro_manual").prop( "checked", false );
	}else{
		$("#ies_bairro_manual").val( "on" );
		$("#ies_bairro_manual").prop( "checked", true );
	}
	
	if ( $('#ies_bairro_manual').is(":checked") ){
		$( '#bairro_sel' ).hide();
		$( '#bairro' ).show();
	}else{
		$( '#bairro' ).hide();
		$( '#bairro_sel' ).show();
	}
	
}

function buscaTipoLogradouro(logradouro){
	console.log('logradouro...',logradouro);
	var tipo = logradouro.split(' ')[0];
	
	var ct1 = DatasetFactory.createConstraint("des_logradouro", tipo, tipo, ConstraintType.MUST);
	var ds = DatasetFactory.getDataset("tip_logradouro", null, [ct1], null);
	console.log('ds',ds);
	
	var retorno = {};
	retorno['status'] = false;
	
	if( ds.values.length > 0 ){
		retorno['tip_logradouro'] = ds.values[0]["TIP_LOGRADOURO"];
		retorno['des_logradouro'] = ds.values[0]["DES_LOGRADOURO"];
		retorno['logradouro'] = logradouro.split(' ').slice(1).join(' ');
		retorno['status'] = true;	
	}
	return retorno;
	
}
