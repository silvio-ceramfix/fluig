$(document).ready(function() {

	getParameters();
	getCompanyId();	
});


// Variáveis
var companyId;
var parameters;
var arrSigners = [];
var arrSigners_d = [];
var arrSigners_e = [];

function loadBody(){
	$('solicitante')
	
}

function fnCustomDelete(oElement) {

	
	fnWdkRemoveChild(oElement);
}


var beforeSendValidate = function(numState,nextState){
	
	if( numState == 0 || numState == 4 ){
		if( $('#tipo_solicitacao').val() == "S" ){
			if( !( valida('.inicial') && valida('.final') ) ){
				throw("Existem campos obirgatórios não preenchidos");
			}
		}else if( $('#tipo_solicitacao').val() == "A" || $('#tipo_solicitacao').val() == "D" ){
			if( !( valida('.inicial') && valida('.aditivo') ) ){
				throw("Existem campos obirgatórios não preenchidos");
			}
		}else{
			if( !valida('.inicial') ){
				throw("Existem campos obirgatórios não preenchidos");
			}
		}
	}
	
}

function valida( lCampos ) {

	var retorno = true;
	var idFocu = '';

	$( lCampos ).each(
		function() {
			
			if( $(this).attr('readonly') ){
				$(this).css({'background-color' : '#EEEEEE'});
			}else{
				$(this).css({'background-color' : '#FFFFFF'});
			}
			
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


