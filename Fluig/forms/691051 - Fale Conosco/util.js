
function fieldFloat( id, padrao, def ){
	console.log('id.....'+id);
	var valor = 0;
	if( id.indexOf('#') == 0 ){
		valor = isNull( Math.round( parseFloat( $(id).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, padrao );
	}else{
		valor = isNull( Math.round( parseFloat( $('#'+id).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, padrao );
	}
	
	if( def == '>0' && valor < 0 ){
		valor = 0;
	}
	return valor;
}

function getFloatForm(id){
	var fReturn = parseFloat( $(id).val().replace(/\./g, '').replace(/\,/g, '.') );
	if( isNaN( fReturn ) ){
		return 0.00;
	}
	return fReturn;
}

function formatNumber(num,pres) {
	fNum = parseFloat( num );
	if( isNaN( fNum ) ){
		fNum = 0;
	}
	return (
		fNum
	      .toFixed(pres) // always two decimal digits
	      .replace('.', ',') // replace decimal point character with ,
	      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
	  ) // use . as a separator
	}

function somaColuna( id ){
	var soma = 0;
	$( "input[name^='"+id+"___']" ).each( function () {
		soma += isNull( Math.round( parseFloat( $(this).val().replace(/\./g,'').replace(/\,/g,'.') ) * 10000 ) / 10000, 0 );
	});
	return soma;
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
	FLUIGC.calendar('.data-hora-fluig', {pickDate: true, pickTime: true, useStrict: true, daysOfWeekDisabled: [0,6] } );
		
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


function setUpper(){
	$("input").keypress( function(e) {
        var chr = String.fromCharCode(e.which);
		console.log( e, e.target.getAttribute("regra") );
		if ( e.target.getAttribute("regra") == "email" 
		  && "'\"!#$%¨&*()+=\+´`[]{}/?:>,<\|~?^".indexOf(chr) > 0 ){
			console.log( ' email..... ',chr );
			return false;
		}else if ( e.target.getAttribute("regra") != 'email' 
				&&"'\"!#$%¨&*()+=\+´`[]{}/?;:.>,<\|~?^@_-".indexOf(chr) > 0 ){
			console.log( ' controle..... ',chr );
			return false;
        }
     });
	$("input").keyup(function(){
		$(this).val($(this).val().toUpperCase());
	});
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


function getLinhaCampoPF( campo ){
	return campo.substring( campo.indexOf( '___' )+3, campo.length );
}

function getIdParentChild(element) {
    var form, row = null;
    var hasRow = false;
    var hasForm = false;
    while (element != null) {
        if (element.id != null) {
            if (!hasRow && element.nodeName.toUpperCase() == "TR") {
                row = element;
                hasRow = true;
            } else {
                if (!hasForm && element.nodeName.toUpperCase() == "FORM") {
                    form = element;
                    hasForm = true;
                }
            }
        }
        element = element.parentNode;
    }
    var arrayInput = $(row).find("input");
    $.each(arrayInput, function(index, input) {
        if ($(input).prop("readonly")) {
            $.each($(form).find("input[type=hidden]"), function(i, inputHidden) {
                var idInput = $(input).attr("name");
                var idInputHidden = "_" + $(inputHidden).attr("name");
                if (idInput && idInputHidden.valueOf() == idInput.valueOf()) {
                    $(inputHidden).remove();
                }
            });
        }
    });
    console.log( ' parent...... ', $( row ).attr('id') );
    return $( row ).attr('id');
}

function isUndefined( campo ){
	if ( campo == null  || campo == undefined  ){
		return  "";
	}else{
		return campo;
	}
}


function isNull( valor, padrao ){
	if ( isNaN( valor ) ){
		return padrao;
	}else{
		return valor;
	}
}


function autoSize(){
	$('textarea').each(function (index, value){
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
				 // console.log('novoTamanho ',novoTamanho);
			   novoTamanho = tamanhoMin;
			  $(this).css({
			   'height' : novoTamanho + 100
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
	});
}

function setCorFilhos( id, color ){
	//console.log('entrei color',id);
	$( 'div, span', $( '#'+id+'_grp' ) ).each( function () {
		//console.log('entrei grupo color', $(this).attr('class') );
		if( $(this).hasClass('bootstrap-tagsinput') /*|| $(this).hasClass('select2-selection--multiple') */ ){
			$( $(this) ).css({'background-color' : color });
		}
	});
}



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
				}
				lstReturn = lstReturn.concat( datasetFilhos.values );
				console.log('lstReturn.....', lstReturn);
			}
		}
	}
	console.log('lstReturn.....', lstReturn);
	return lstReturn;
}

