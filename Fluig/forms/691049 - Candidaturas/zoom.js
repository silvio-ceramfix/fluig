$(document).bind("DOMNodeRemoved", function(e){
	var target = $(e.target);
	if( target.html().indexOf("id='pai_filho_modal'" ) > 0 || target.html().indexOf("id='modal-zoom'" ) ){
		//parent.$('#workflowView-cardViewer').css( 'zIndex', 0 );
		parent.$('#workflowview-header').show();
	}
});

function zoom(componente) {
	if (componente == 'bt_vaga' ) {
		var tsAtual = moment(moment().format('MM/DD/YYYY')).unix();
		
		console.log('tsAtual ',tsAtual);
		/*
		modalzoom.open("Vagas",
				   "fdwt_vagas", 
				   "cardid,Cod.,titulo,Titulo,inicio,Data.Inicio,fim,Data.Fim", 
				   "cardid,titulo,inicio,fim,inicio_ts,fim_ts", 
				   "",
				   componente, false, 'default', null, null,
				   "" ); */
		
		modalzoom.open("Vagas",
				   "selectDataSet", 
				   "cardid,Cod.,titulo,Titulo,inicio,Data.Inicio,fim,Data.Fim", 
				   "cardid,titulo,inicio,fim,inicio_ts,fim_ts", 
				   "dataset,fdwt_vagas",
				   componente, false, 'default', null, null,
				   "" );
	}
	
}

function setSelectedZoomItem(selectedItem) {
	console.log('selectedItem ',selectedItem);
	if (selectedItem.type == 'bt_vaga') {
		$('#cod_vaga').val(selectedItem.cardid);
		$('#den_vaga').val(selectedItem.titulo);
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
			
			myLoading2.hide();
			
			setCliente();
			
		},
		error: function () {
			alert('CNPJ Não encontrado.')
			myLoading2.hide();
		}
	});
}

