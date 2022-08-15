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
		if( $('#comentarios').val() == "" || $('#comentarios').val() == null){
				throw("Informe o Comentário!");
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

function escolheanonimo(valor) {
	console.log('valor ',valor)
	if (valor == 'S') {
		$('#solicitante').val($('#nomSolic').val());
		
	} else {
		$('#solicitante').val("ANONIMO");
	}
}

