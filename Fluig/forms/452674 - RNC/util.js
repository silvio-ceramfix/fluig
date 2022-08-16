function formatDecimal(val, pres){
	var fVal = parseFloat( val );
	return String((fVal).toFixed(pres)).replace('.', ',');
};

function dataAtualFormatada(data) {
	dia = data.getDate().toString().padStart(2, '0');
	mes = (data.getMonth() + 1).toString().padStart(2, '0'); //+1 pois no getMonth Janeiro começa com zero.
	ano = data.getFullYear();
	return dia + "/" + mes + "/" + ano;
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

function loadDsCombo( combo, 
	      dataSet, 
		  fieldCodigo, 
		  fieldDesc, 
		  fieldFilter, 
		  fieldFilterValue,
		  fieldOrder){

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
	console.log( 'Dataset Filho ', datasetFilhos );
	if ( datasetFilhos != null ){
		var valDefault = "";
		if ( $("#"+combo).val() != "" && $("#"+combo).val() != null && $("#"+combo).val() != undefined ){
			valDefault = $("#"+combo).val();
		}
	
		$("#"+combo+" option").remove();
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


function loadPaiFilhoCombo( combo, dataSet, table, fieldCodigo, fieldDesc, fildFilter, fildFilterValue ){
	
	console.log( combo, dataSet, table, fieldCodigo, fieldDesc, fildFilter, fildFilterValue  );

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
				var valDefault = $("#"+combo).val();
				$("#"+combo+" option").remove();
				var filhos = datasetFilhos.values;
				console.log('DataSet',datasetFilhos);
				console.log('DataSet',filhos);
				//$("#empresa").append("<option value='' ></option>");
				for ( var i in filhos ) {
					console.log('Linha DataSet.....',i);
					var filho = filhos[i];
					var den = '';					
					if ( $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) > -1 ){
						continue;
					} 
					if ( fieldDesc == '' ){
						den = filho[ fieldCodigo ];
					}else{
						den = filho[ fieldDesc ];
					}
					$("#"+combo).append("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
				}
				$("#"+combo).val( valDefault );
			}
		}
	}
}


function getDsPaiFilho( dataSet, table, fildFilter, fildFilterValue, fields ){	
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
	console.log('datasetPai.........', datasetPai );
	
	var lstFields = fields.split(',');
	
	var lstReturn = new Array();
	if( datasetPai != undefined && datasetPai != null ){
		var pais = datasetPai.values;
		for ( var y in pais ) {
			var pai = pais[y];
			var constraintsFilhos = new Array();
			constraintsFilhos.push( DatasetFactory.createConstraint("tablename", table, table, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pai.documentid, pai.documentid, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pai.version, pai.version, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
			var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, null );
			//console.log('datasetFilhos.........', datasetFilhos );
			console.log('DataSet',datasetFilhos);
			if ( datasetFilhos != null ){
				lstReturn = lstReturn.concat( datasetFilhos.values );
				console.log('lstReturn.....', lstReturn);
			}
		}
	}
	console.log('lstReturn.....', lstReturn);
	return lstReturn;
}


function getOptCombo( combo ){
	
	var optArray = new Array();
	$("#"+combo+" option").each(function () {
		optArray.push( $(this).val() );
	});
	return optArray;
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

function nvl( valor, valorAlter ){
	if (  isNaN( valor )  ){
		return valorAlter;
	}else{
		return valor
	}
}

function isnull( valor, valorAlter ){
	if ( valor == null ||  valor == undefined ||  valor == "null" ){
		return valorAlter;
	}else{
		return valor
	}
}

function readOnlyAll( tipo, grupo, aba ){
	console.log('Entrei Read Only....');
	
	if( grupo == undefined || grupo == "" ){
		var abaLocal = ".fluig-style-guide";
		if( aba == "" || aba == undefined || aba == null ){
			abaLocal = aba; 
		}
		$('input, select, textarea', $(aba) ).each(function(){
			var vnTIpo = tipo;
			if( $(this).hasClass('readonly') ){
				vnTIpo = true;
			}
			//console.log('Entrei Read Only campo....',$(this).attr('id'));
			if( $(this).is('select') ){			
				$('#'+ $(this).attr('id') +' option:not(:selected)').prop('disabled', vnTIpo);
			}else{
				$(this).attr('readonly',vnTIpo);
				
				$(this).removeClass('decimal-7');
				$(this).removeClass('decimal-6');
				$(this).removeClass('decimal-5');
				$(this).removeClass('decimal-4');
				$(this).removeClass('decimal-3');
				$(this).removeClass('decimal-2');
				$(this).removeClass('decimal-1');
				$(this).removeClass('decimal-0');
				$(this).removeClass('integer-0');
				$(this).removeClass('data-fluig');
				$(this).removeClass('decimal2');
				$(this).removeClass('dataFluig');
			}
		});
	}else{
		$(grupo).each(function(){
			var vnTIpo = tipo;
			if( $(this).hasClass('readonly') ){
				vnTIpo = true;
			}
			//console.log('Entrei Read Only campo....',$(this).attr('id'));
			if( $(this).is('select') ){			
				$('#'+ $(this).attr('id') +' option:not(:selected)').prop('disabled', vnTIpo);
			}else{
				$(this).attr('readonly',vnTIpo);
				
				$(this).removeClass('decimal-7');
				$(this).removeClass('decimal-6');
				$(this).removeClass('decimal-5');
				$(this).removeClass('decimal-4');
				$(this).removeClass('decimal-3');
				$(this).removeClass('decimal-2');
				$(this).removeClass('decimal-1');
				$(this).removeClass('decimal-0');
				$(this).removeClass('integer-0');
				$(this).removeClass('data-fluig');
				$(this).removeClass('decimal2');
				$(this).removeClass('dataFluig');
			}
		});
	}
	
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
				/*if ($(this).hasClass("decimal-2") || $(this).hasClass("decimal-0")){
					if ( $(this).val()=='0'  || $(this).val()=='0,00' ){
						if( !( $(this).hasClass("pf") && $(this).attr('name').split('___').length <= 1 ) ){
							
							$(this).css({'background-color' : '#FFE4C4'});
							retorno = false;
							if( idFocu == '' ){
								idFocu = $(this).attr('id');
							}
						}
					}
				}*/
				
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
			
			//field-valida="cliente_especifico" value-valida="S"
			
	console.log('ENTROU4');		
		});
	if( idFocu != '' ){
		setTimeout("$('#"+idFocu+"').focus();", 1);
	}
	return retorno;	
}

/*
function formatDecimal(val, pres){
	var fVal = nvl( parseFloat( val ), 0);
	return String((fVal).toFixed(pres)).replace('.', ',');
};
*/

function formatDecimal(val, pres){
	var fVal = parseFloat( val );

    if( isNaN( fVal ) ){
        fval = 0;
    }

	var numDec = String((fVal).toFixed(pres));
    var n = numDec.split('.')[0];
	var r = '';
	var x = 0;
	var tratado;
		
	for (var i = n.length; i > 0; i--) {
	    r += n.substr(i - 1, 1) + (x == 2 && i != 1 ? '-' : '');
	    x = x == 2 ? 0 : x + 1;
	}
		
	tratado = r.split('').reverse().join('');
	tratado = tratado.replace('-,',',');
    var busca = '-';
    var strbusca = eval('/'+busca+'/g'); 
	tratado = tratado.replace(strbusca,'.');
    if( pres > 0 ){
        tratado = tratado+","+numDec.split('.')[1];
    }
    return tratado;
};


function getLPad( valor, pad){
	var str = "" + valor;
	var ans = pad.substring(0, pad.length - str.length) + str;
	return ans;
}
		
function getRPad( valor, pad){
	var str = "" + valor;
	var ans = str + pad.substring(0, pad.length - str.length);
	return ans;
}	

function maskFone( id ){
	if( $('#'+id).val() == undefined || $('#'+id).val() == null ){
		$('#'+id).val( '' );
	}
	if($('#'+id).val().length > 14 ) {  
		$('#'+id).unmask();
		$('#'+id).mask("(99) 99999-9999");  
	} else {  
		$('#'+id).unmask();
		$('#'+id).mask("(99) 9999-9999?9");  
	} 
}

function textToFone( val ){
	if( val == undefined || val == null ){
		return '';
	}
	if( val.length == 10 ){
	    return '('+val.substring(0,2)+') '+val.substring(2,6)+'-'+val.substring(6,10);
	}else if( val.length == 11 ){
	    return '('+val.substring(0,2)+') '+val.substring(2,7)+'-'+val.substring(7,11);
	}else{
		return val;
	}
	
}

function loadDataSetCombo( combo, dataSet, fieldCodigo, fieldDesc, fildFilter, fildFilterValue, fieldFlag, clear, iesFieldCodigo ){
	
	console.log( 'Passo 001' );
		
	var constraintsFilhos = new Array();
	var lstFilter = fildFilter.split(',');
	var lstFilterValue = fildFilterValue.split(',');
	for ( var j = 0; j < lstFilter.length; j ++ ){
		console.log( 'Passo 00X',lstFilter[j],lstFilterValue[j] );
		if ( lstFilter[j] != '' && lstFilter[j] != null ){
			constraintsFilhos.push( DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST) );
		}
	}
	var orderFilhos = new Array();
	if( iesFieldCodigo == "N"){
		orderFilhos.push( fieldDesc );
	}else{
		orderFilhos.push( fieldCodigo );
	}
	var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos );
	if ( datasetFilhos != null ){
		var valDefault = "";
		console.log('ANTES TESTE VALOR DEFAULT.....',$("#"+combo).val());
		if ( $("#"+combo).val() != "" && $("#"+combo).val() != null && $("#"+combo).val() != undefined ){
			valDefault = $("#"+combo).val();
			console.log('TEM VALOR DEFAULT Jah EXISTEMTE.....',valDefault);
		}
		if( clear == 'S' ){
			$("#"+combo+" option").remove();
		}
		var filhos = datasetFilhos.values;
		console.log( 'Passo 002' );
		$("#"+combo).append("<option value='' ></option>");
		//var valDefault = '';
		for ( var i in filhos ) {
			var filho = filhos[i];
			console.log( 'Passo 002', filho[ fieldCodigo ] );
			var den = '';
			//if ( valDefault == '' ){
			//	valDefault = filho[ fieldCodigo ];
			//}
			console.log( filho[ fieldFlag ] );
			if (  valDefault == "" && ( filho[ fieldFlag ] || filho[ fieldFlag ] == 'on' ) ){
				valDefault = filho[ fieldCodigo ];
			}
			
			console.log( 'Passo 002 A',  $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) );
			if ( $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) > -1 ){
				continue;
			} 
			
			if ( fieldDesc == '' ){
				den = filho[ fieldCodigo ];
			}else{
				if( iesFieldCodigo == "N"){
					den = filho[ fieldDesc ];
				}else{
					den = filho[ fieldCodigo ]+' - '+filho[ fieldDesc ];
				}
			}
			$("#"+combo).append("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
			console.log( 'Apende 003',filho[ fieldCodigo ] );
		}
		console.log('valDefault.......',valDefault);
		if ( valDefault != '' ){
			$("#"+combo).val( valDefault );
		}
	}	
}

function addFilho(table) {
	var row = wdkAddChild(table);
	setMask();
	return row;
}

function DataHoraHoje() {
	var mydate = new Date();
	var day = mydate.getDate();
	var month = mydate.getMonth()+1;	
	var year = mydate.getFullYear()
	var hour = mydate.getHours();
	var minute = mydate.getMinutes();
	var second = mydate.getSeconds();

	var output = (day<10 ? '0' : '') + day + '/' + (month<10 ? '0' : '') + month + '/' + year + ' ' + 
				 (hour<10 ? '0' : '') + hour + ':' + (minute<10 ? '0' : '') + minute + ':' + (second<10 ? '0' : '') + second;

	return output;
}