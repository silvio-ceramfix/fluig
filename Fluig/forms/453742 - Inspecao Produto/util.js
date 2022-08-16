function getOptCombo( combo ){
			
	var optArray = new Array();
	$("#"+combo+" option").each(function () {
		optArray.push( $(this).val() );
	});
	return optArray;
}
		 
function loadDsCombo( combo, 
				      dataSet, 
					  fieldCodigo, 
					  fieldDesc, 
					  fieldFilter, 
					  fieldFilterValue,
					  fieldOrder,
					  clear,
					  blankLine){

    console.log( 'Passo 001 tipo', $('#'+combo).is('select'), $('#'+combo).val(), $("#opt_"+combo).val()  );
    
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
	console.log('datasetFilhos....',datasetFilhos);
	if ( datasetFilhos != null ){
		var valDefault = "";
		if ( $("#"+combo).val() != "" && $("#"+combo).val() != null && $("#"+combo).val() != undefined ){
			valDefault = $("#"+combo).val();
		}else if ( $("#opt_"+combo).val() != "" && $("#opt_"+combo).val() != null && $("#opt_"+combo).val() != undefined ){
			valDefault = $("#opt_"+combo).val();
		}
		if( clear != 'N' && clear != false ){
			$("#"+combo+" option").remove();
			if( blankLine == 'S' || blankLine == false || blankLine == undefined || blankLine == null ){
				$("#"+combo).append("<option value='' ></option>");
			}
		}
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


function loadDsPfCombo( combo, dataSet, table, fieldCodigo, fieldDesc, fildFilter, fildFilterValue, fieldOrder, clear, blankLine, fieldDefault ){
	
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
			var lstOrder = fieldOrder.split(',');
			for ( var j = 0; j < lstOrder.length; j ++ ){
				orderFilhos.push( lstOrder[j] );
			}
					
			var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos );
			console.log('DataSet',datasetFilhos);
			if ( datasetFilhos != null ){
				
				var valDefault = $("#"+combo).val();
				
				if( clear != 'N' && clear != false ){
					$("#"+combo+" option").remove();
					if( blankLine == 'S' || blankLine == false || blankLine == undefined || blankLine == null ){
						$("#"+combo).append("<option value='' ></option>");
					}
				}
				
				var filhos = datasetFilhos.values;
				console.log('DataSet',datasetFilhos);
				console.log('DataSet',filhos);
				//$("#empresa").append("<option value='' ></option>");
				for ( var i in filhos ) {
					
					console.log('Linha DataSet.....',i);
					var filho = filhos[i];
					
					if ( ( valDefault == "" || valDefault == null ) && 
						 ( filho[ fieldDefault ] || filho[ fieldDefault ] == "on" || filho[ fieldDefault ] == "S" || filho[ fieldDefault ] == "checked" ) ){
						valDefault = filho[ fieldCodigo ];
					}
					
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
				$("#"+combo).val( valDefault );
			}
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


//Recupera tabela filha de um dataSet
function getDsPaiFilho( dataSet, table, fildFilter, fildFilterValue, fields, retFull ){	
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
				if( retFull ){
					return datasetFilhos;
				}else{
					lstReturn = lstReturn.concat( datasetFilhos.values );
					console.log('lstReturn.....', lstReturn);
				}
			}
		}
	}
	console.log('lstReturn.....', lstReturn);
	return lstReturn;
}

/*
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
*/
/*
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
*/

function readOnlyAll( tipo ){
	console.log('Entrei Read Only....');
	$('input, select, textarea').each(function(){
		//console.log('Entrei Read Only campo....',$(this).attr('id'));
		if( $(this).is('select') ){			
			$('#'+ $(this).attr('id') +' option:not(:selected)').prop('disabled', tipo);
		}else{
			$(this).attr('readonly',tipo);
		}
	});
}

function isNull( valor, valorAlter ){
	console.log('Entrei....',valor, valorAlter);
	if ( valor == null || valor == undefined || valor == 'null'  ){
		return valorAlter;
	}else{
		return valor
	}
}

function nvl( valor, valorAlter ){
	console.log('Entrei....',valor, valorAlter);
	if ( isNaN( valor ) ||  valor == null || valor == undefined   ){
		return valorAlter;
	}else{
		return valor
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



function setMask(){
	$('.decimal-7').maskMoney({precision : 7,thousands : '.',decimal : ',',defaultZero : true,allowZero : true});
	$('.decimal-6').maskMoney({precision : 6,thousands : '.',decimal : ',',defaultZero : true,allowZero : true});
	$('.decimal-5').maskMoney({precision : 5,thousands : '.',decimal : ',',defaultZero : true,allowZero : true});
	$('.decimal-4').maskMoney({precision : 4,thousands : '.',decimal : ',',defaultZero : true,allowZero : true});
	$('.decimal-3').maskMoney({precision : 3,thousands : '.',decimal : ',',defaultZero : true,allowZero : true});
	$('.decimal-2').maskMoney({precision : 2,thousands : '.',decimal : ',',defaultZero : true,allowZero : true});
	$('.decimal-1').maskMoney({precision : 1,thousands : '.',decimal : ',',defaultZero : true,allowZero : true});
	$('.decimal-0').maskMoney({precision : 0,thousands : '.',decimal : ',',defaultZero : true,allowZero : true});
	$('.integer-0').maskMoney({precision : 0,thousands : '',decimal : '',defaultZero : true,allowZero : true});
	FLUIGC.calendar('.data-fluig');
}

function formatNumber(num,pres) {
	  if( num == "" || num == null || num == undefined
		|| pres == "" || pres == null || pres == undefined ){
		  return "";
	  }
	  try{
		  return (
				    num
				      .toFixed(pres) // always two decimal digits
				      .replace('.', ',') // replace decimal point character with ,
				      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
				  ) // use . as a separator  
	  }catch(e){
		  return "";
	  }
	  
	}

function validaData( id ){
	
	dataTxt = $('#'+id).val();
	
	if( !isDate(dataTxt) ){
		FLUIGC.toast({
			title: 'Validacao: ',
			message: 'Data Invalida!',
			type: 'warning',
			timeout: 'slow'
		});
		
		setTimeout("$('#"+id+"').focus();",1);
		return false;
	}
	return true;
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