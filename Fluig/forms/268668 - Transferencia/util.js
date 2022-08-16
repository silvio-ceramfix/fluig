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

function loadDataSetCombo( combo, dataSet, fieldCodigo, fieldDesc, fildFilter, fildFilterValue, fieldFlag, clear ){
				
    console.log( 'Passo 001 tipo', $('#'+combo).is('select') );
			    
    if( !$('#'+combo).is('select') ){
    	return false;
    }
				
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
	orderFilhos.push( fieldCodigo );						
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
		//$("#empresa").append("<option value='' ></option>");
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
				den = filho[ fieldCodigo ]+' - '+filho[ fieldDesc ];
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


function orderPaiFilho( table, firstRow, campoOrder ){
			
	console.log( 'firstRow',firstRow );
			
	var campos = new Array();
	$( 'input[name], select[name], checkbox[name], textarea[name], img', $( "#"+firstRow ) ).each( function( index ){
		console.log( 'Each ', $(this).attr('id') );				
		campos.push(  $(this).attr('id')  );
	});	
	console.log( 'campos....', campos );
	var dados = {};
	var chaves = new Array();
	var linhas = new Array();
	console.log(' campoOrder ', campoOrder );
	$( "input[name^="+campoOrder+"___]" ).each(function( index ) {
		var linha = {};
		console.log( 'Nome campo loop', $(this).attr('name') );
		var seq = $(this).attr('name').split('___')[1];
		for( i = 0; i < campos.length; i++ ){
			linha[ campos[ i ] ] = $( '#'+campos[i]+'___'+seq ).val();
		}
		chave = $(this).val().toLowerCase();
		console.log( 'chave..... ', chave, $(this).val() );
		chaves.push( chave );
		linhas.push( parseInt( seq ) );
		dados[ chave ] = linha;
	});
	console.log('chaves........',chaves);
	console.log('dados........',dados);
	console.log('linhas........',linhas);
			
	chaves = chaves.sort();
	linhas = linhas.sort(sortChar);
			
	console.log('chaves........',chaves);
	console.log('dados........',dados);
	console.log('linhas........',linhas);
			
			
	for( j = 0; j < chaves.length; j++ ){
		var chave = chaves[j];
		var linha = parseInt( linhas[j] );
		for( i = 0; i < campos.length; i++ ){
			//linha[ campos[ i ] ] = $( '#'+campos[i]+'___'+seq ).val();
			$('#'+campos[ i ]+'___'+linha).val(  dados[chave][ campos[ i ] ] );
		}
	}
			
}

function sortNumber(a,b) {
	return a - b;
};
		
function sortChar(a,b) {
	return getRPad( a, '000000' ) - getRPad( b, '000000' );
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
			
			//field-valida="cliente_especifico" value-valida="S"
			
	console.log('ENTROU4');		
		});
	if( idFocu != '' ){
		setTimeout("$('#"+idFocu+"').focus();", 1);
	}
	return retorno;
	
}