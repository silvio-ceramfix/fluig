$(document).bind("DOMNodeRemoved", function(e){
	var target = $(e.target);
	if( target.html().indexOf("id='pai_filho_modal'" ) > 0 || target.html().indexOf("id='modal-zoom'" ) ){
		//parent.$('#workflowView-cardViewer').css( 'zIndex', 0 );
		parent.$('#workflowview-header').show();
	}
});

function zoom(componente) {
	if (componente == 'bt_tipo_documento' ) {

		modalzoom.open("Tipos de Documentos",
				   "tipos_documentos", 
				   "cod_tipo_documento,Cod.,den_tipo_documento,Descrição,cod_pasta_ged,Cod.Pasta", 
				   "cod_tipo_documento,den_tipo_documento,cod_pasta_ged,ies_tipo_direto,ies_doc_analise", 
				   "",
				   componente, false, 'default', null, null,
				   "" );
	}
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

