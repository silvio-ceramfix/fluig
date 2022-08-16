function getOptCombo( combo ){			
	var optArray = new Array();
	$("#"+combo+" option").each(function () {
		optArray.push( $(this).val() );
	});
	return optArray;
}

function loadDsPFCombo( combo, dataSet, table, fieldCodigo, fieldDesc, fieldFilter, fieldFilterValue, fieldOrder){

	console.log( 'Passo 001 tipo', $('#'+combo).is('select') );
    if( !$('#'+combo).is('select') ){
    	return false;
    }   
	var constraintsFilhos = new Array();
	var lstFilter = fieldFilter.split(',');
	var lstFilterValue = fieldFilterValue.split(',');
	for ( var j = 0; j < lstFilter.length; j ++ ){
		console.log( 'Passo 00X',lstFilter[j],lstFilterValue[j] );
		if ( lstFilter[j] != '' && lstFilter[j] != null ){
			constraintsFilhos.push( DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST) );
		}
	}
	var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, null );
	var filhos = datasetFilhos.values;
	if ( datasetFilhos != null ){
		var valDefault = "";
		if ( $("#"+combo).val() != "" && $("#"+combo).val() != null && $("#"+combo).val() != undefined ){
			valDefault = $("#"+combo).val();
		}
		for ( var i in filhos ) {
			var filho = filhos[i];			
			var fieldFilter = "tablename,metadata#id,metadata#version,metadata#active";
			var fieldFilterValue = table+","+filho.documentid+","+filho.version+",true";
			var clear = false;
			if( i == 0 ){
				clear = true;
			}
			loadDsCombo( combo, dataSet, fieldCodigo, fieldDesc, fieldFilter, fieldFilterValue, fieldOrder, clear);
		}
	}
	
}

function loadDsCombo( combo, dataSet, fieldCodigo, fieldDesc, fieldFilter, fieldFilterValue, fieldOrder, clear){

    console.log( 'Passo 001 tipo', $('#'+combo).is('select') );
    if( !$('#'+combo).is('select') ){
    	return false;
    }   
	var constraintsFilhos = new Array();
	var lstFilter = fieldFilter.split(',');
	var lstFilterValue = fieldFilterValue.split(',');
	for ( var j = 0; j < lstFilter.length; j ++ ){
		console.log( 'Passo 00X',lstFilter[j],lstFilterValue[j] );
		if ( lstFilter[j] != '' && lstFilter[j] != null ){
			constraintsFilhos.push( DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST) );
		}
	}
	var orderFilhos = new Array();
	var lstOrder = fieldOrder.split(',');
	for ( var j = 0; j < lstOrder.length; j ++ ){
		orderFilhos.push( lstOrder[j] );
	}	
	var fieldFilhos = new Array(fieldCodigo, fieldDesc);
	var datasetFilhos = DatasetFactory.getDataset(dataSet, fieldFilhos, constraintsFilhos, orderFilhos );
	
	if ( datasetFilhos != null ){
		var valDefault = "";
		if ( $("#"+combo).val() != "" && $("#"+combo).val() != null && $("#"+combo).val() != undefined ){
			valDefault = $("#"+combo).val();
		}
		if( clear || clear == undefined ){
			$("#"+combo+" option").remove();
		}
		$("#"+combo).append("<option value='' ></option>");
		var filhos = datasetFilhos.values;
		for ( var i in filhos ) {
			var filho = filhos[i];
			var den = '';
			
			if ( $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) > -1 ){
					continue;
			} 
			if ( fieldDesc == '' ){
				den = filho[ fieldCodigo ];
			}else{
				den = filho[ fieldCodigo ]+' - '+filho[ fieldDesc ];
			}
			$("#"+combo).append("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
		}
		console.log('valDefault.......',valDefault);
		if ( valDefault != '' ){
			$("#"+combo).val( valDefault );
		}
	}		
}		

function formatDecimal(val, pres){
	var fVal = parseFloat( val );
	return String((fVal).toFixed(pres)).replace('.', ',');
};

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

function getFloat(valor,padrao){
	var txt = valor;
//	exp = /\./g;
//	txt = txt.toString().replace( exp, "" );
	exp = /\,/g;
	txt = txt.toString().replace( exp, "." );
	return isNull( Math.round( parseFloat( txt ) * 100000000 ) / 100000000, padrao );
}

function isNull( valor, padrao ){
	if ( isNaN( valor ) ){
		return padrao;
	}else{
		return valor;
	}
}