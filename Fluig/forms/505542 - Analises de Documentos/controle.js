$(document).ready(function() {

	$("#etapa").val("1");
	$("#etapa_i").val("2");
	
	getParameters();
	getCompanyId();	
});


// Variáveis
var companyId;
var parameters;
var arrSigners = [];
var arrSigners_d = [];
var arrSigners_e = [];

function salvaParecer() {
	if ($('#parecer').val() == "" || $('#advogado_parecer').val() == "") {
		FLUIGC
		.toast({
			title : 'Validação: ',
			message : 'Informe os campos ADVOGADO(A) e PARECER para poder gravar!',
			type : 'warning',
			timeout : 'medium'
		});
		return false;
	}

	seq = wdkAddChild('historico');


	$('#advogado_hist___' + seq).val($('#advogado_parecer').val());
	$('#parecer_hist___' + seq).val($('#parecer').val());
	$('#data_hist___' + seq).val($('#data_parecer').val());

	$('#advogado_parecer').val("");
	$('#parecer').val("");

}

function loadBody(){
	
	if( $("#task").val() == "0" ||  $("#task").val() == "1"  ){ 
		$('.parecer_documento').hide();
	}
	
	if( $("#task").val() == "0" ||  $("#task").val() == "1"  || $("#task").val() == "13"){ 
		$('.assinantes_fixos').hide();
	}
	
	if ($("#task").val() == "0" ||  $("#task").val() == "1"  || $("#task").val() == "13" || $("#task").val() == "5") {
		$('.documentos_ser_enviados').hide();
	}

	if ($("#task").val() == "11" || $("#task").val() == "22" ) {
		loadDocumentos();
	}
	
	if ($('#ies_doc_analise').val()=='S') {
		$('.assinantes').hide();
		$('.novos_assinantes').hide();
		$('.assinantes_fixos').hide();
		
	}
	
	
	 autoSize();
	
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

function loadDocumentos() {
	//limpar a tabela
	console.log('executou a carga de documentos!');
	var c1 = DatasetFactory.createConstraint('processAttachmentPK.processInstanceId', $('#numSolic').val(), $('#numSolic').val(), ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint('processAttachmentPK.attachmentSequence', '1', '1', ConstraintType.MUST_NOT);
	var order = new Array();
	order.push('processAttachmentPK.attachmentSequence');
	var ds_anexos_processo = DatasetFactory.getDataset('processAttachment', null, [c1,c2], order);

	if (ds_anexos_processo) {
		if (ds_anexos_processo.values) {
			if (ds_anexos_processo.values.length > 0) {
				
				for (var x = 0; x < ds_anexos_processo.values.length; x++) {
					var row_documento = ds_anexos_processo.values[x];
					var constraints;
					
					var c1 = (DatasetFactory.createConstraint("documentPK.documentId", row_documento.documentId, row_documento.documentId,	ConstraintType.MUST));
					constraints = new Array(c1);
					
					var documentos = DatasetFactory.getDataset("document",null, constraints, null);
					if (documentos.values.length >0 && documentos != null) {
						for (var y = 0; y < documentos.values.length; y++) {
							var seq = wdkAddChild('tableDocumentos');
							var row_item = documentos.values[y];
							$('#descricao_doc___' + seq).val(row_item.documentDescription);
							var dataorig = new Date(row_item.createDate);
							console.log('documento',row_documento.documentId );
							console.log('data original ',dataorig);
							//var data = dataorig.split('T')[0].split('-').reverse().join('/');
							//var hora = dataorig.split('T')[1].split('-').reverse().join('/');
							
							var version = row_item["documentPK.version"];
							console.log('version ', version);
							$('#data_hora_doc___' + seq).val(dataorig);
							$('#id_doc___' + seq).val(row_documento.documentId);
							$('#versao_doc___' + seq).val(version);
						}	
					}
				}
			}
		}
	}
	
}

function checa2(){ 
    $(".checks").change(function(){  
                var id = $(this).attr('id'); 
                if($(this).prop('checked')==true){
                	var seq = $(this).attr('name').split('___')[1];
                	$('#integrar___'+seq).val('S');
                }
    });
    $(".checks").change(function(){  
        var id = $(this).attr('id'); 
        if($(this).prop('checked')!=true){
        	var seq = $(this).attr('name').split('___')[1];
        	$('#integrar___'+seq).val('N');
        }
});
}

function addChild( tabela ){
	
	var row = wdkAddChild(tabela);
	
	if( tabela = 'tableNewSigner' ){
		$('#tabCpfNew___'+row).mask('999.999.999-99');
	}
	
	$("input").keyup(function(){
		$(this).val($(this).val().toUpperCase());
	});
	
}


function fnCustomDelete(oElement) {

	
	fnWdkRemoveChild(oElement);
}

function hex2a(r){
	for(var t=String(r),n="",e=0;e<t.length&&"00"!==t.substr(e,2);e+=2)
		n+=String.fromCharCode(parseInt(t.substr(e,2),16));
	return n
}

function a2hex(r){
	for(var t=[],n=0,e=(r=String(r)).length;n<e;n++)
		{var o=Number(r.charCodeAt(n)).toString(16);t.push(o)}
	return t.join("")
}

function getParameters() {
	var c1 = DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST);
	var dsParamGeral = DatasetFactory.getDataset('ds_vertsign_param_geral', null, [c1], null);

	if (dsParamGeral) {
		if (dsParamGeral.values) {
			if (dsParamGeral.values.length > 0) {
				metadata1 = dsParamGeral.values[0]['metadata1'];
				var metadata2 = dsParamGeral.values[0]['metadata2'];
				var metadata3 = dsParamGeral.values[0]['metadata3'];
				var metadata4 = dsParamGeral.values[0]['metadata4'];
				var metadata5 = dsParamGeral.values[0]['metadata5'];
				var sigForm = dsParamGeral.values[0]['idFormAssinante'];

				if (!(metadata1 && metadata2 && metadata3 && metadata4 && metadata5)) {
					notInstalled.push('params');
				}

				parameters = {
					metadata3: metadata3,
					metadata5: metadata5,
					sigForm: sigForm
				};
			}
		}
	}
}

function getCompanyId() {
	var dsParamGeral = DatasetFactory.getDataset('colleague', ['colleaguePK.companyId']);

	if (dsParamGeral.values.length > 0) {
		companyId = dsParamGeral.values[0]['colleaguePK.companyId'];
	} else {
		showAlert('Não foi possível recuperar os dados da empresa', 'danger');
	}
}

var beforeSendValidate = function(numState,nextState){
	
	var erro = 0;
	var msg = '';
	if ($('#task').val()=='11' || $('#task').val()=='22') {
		$( "input[name^='tabCpfComum___']" ).each( function () 
				{
					var seq = $(this).attr('name').split('___')[1];
					var result='';
					result = $(this).val();
					console.log('resultado ',result);
					$( "input[name^='tabCpfFixo__']" ).each( function () 
							{
								var seq2 = $(this).attr('name').split('___')[1];
								var result2 = '';
								result2 = $(this).val();
								console.log('resultado2 ',result2);
								if (result2 == result) {
									console.log('resultado ',result, '  ',result2);
									msg += ' Existem CPFs iguais nos Fixos e no Pesquisado, favor revisar! ';
									erro = 1;
								} else {
									erro = 0;
								}
							});
				});
		
		$( "input[name^='tabCpfNew___']" ).each( function () 
				{
					var seq = $(this).attr('name').split('___')[1];
					var result='';
					result = $(this).val();
					$( "input[name^='tabCpfFixo__']" ).each( function () 
							{
								var seq2 = $(this).attr('name').split('___')[1];
								var result2='';
								result2 = $(this).val();
								if (result2 == result) {
									console.log('resultado ',result, '  ',result2);
									msg += ' Existem CPFs iguais nos Fixos e no Novos, favor revisar! ';
									erro = 1;
								} else {
									erro = 0;
								}
							});
				});
		var contador = 0;
		$( "input[name^='integrar___']" ).each( function () 
				{
					var seq = $(this).attr('name').split('___')[1];
					var result='';
					result = $(this).val();
					
					if (result=='S') {
						contador += 1;
					}
								
				});
		
		if (contador<1 && nextState!='13') {
			msg += ' Pelo menos 1 documento deve ser selecionado para a integração! ';
			erro = 1;
		} else {
			erro = 0;
		}
	}
	// valida se possuem e-mails invalidos
		$( "input[name^='tabEmailNew___']" ).each( function () 
				{
					var seq = $(this).attr('name').split('___')[1];

					var result = $(this).val();
					if ( $(this).attr( 'regra' ) == 'email' 
							&& !validaEmail( result ) ){
								$( $(this) ).css({'background-color' : '#FFA500'});
								msg += ' E-Mail Invalido!';
								erro = 1;
					}else {
						$( $(this) ).css({'background-color' : '#FFFFFF'});
					}
				});
		// valida se possuem campos vazios
				$( "input[name^='tabNameNew___']" ).each( function () 
						{
							var seq = $(this).attr('name').split('___')[1];

							var result = $(this).val();
							if ( $(this).attr( 'valida' ) == 'S' 
									&& result=="" ){
										$( $(this) ).css({'background-color' : '#FFA500'});
										msg += ' Campo precisa ser preenchido!' + ' NOME';
										erro = 1;
							}else {
								$( $(this) ).css({'background-color' : '#FFFFFF'});
							}
						});
				
				$( "input[name^='tabTipoAssinaturaNew___']" ).each( function () 
						{
							var seq = $(this).attr('name').split('___')[1];

							var result = $(this).val();
							if ( $(this).attr( 'valida' ) == 'S' 
									&& result=="" ){
										$( $(this) ).css({'background-color' : '#FFA500'});
										msg += ' Campo precisa ser preenchido!' + ' TIPO';
										erro = 1;
							}else {
								$( $(this) ).css({'background-color' : '#FFFFFF'});
							}
						});
				
				$( "input[name^='tabTituloNew___']" ).each( function () 
						{
							var seq = $(this).attr('name').split('___')[1];

							var result = $(this).val();
							if ( $(this).attr( 'valida' ) == 'S' 
									&& result=="" ){
										$( $(this) ).css({'background-color' : '#FFA500'});
										msg += ' Campo precisa ser preenchido!' + ' TITULO';
										erro = 1;
							}else {
								$( $(this) ).css({'background-color' : '#FFFFFF'});
							}
						});
				
	// valida se possuem cpf invalidos
				$( "input[name^='tabCpfNew___']" ).each( function () 
						{
							var seq = $(this).attr('name').split('___')[1];

							var result = $(this).val();
							if ( $(this).attr( 'regra' ) == 'cpf' 
									&& !validarCPF( result ) ){
										$( $(this) ).css({'background-color' : '#FFA500'});
										msg += ' CPF Invalido!';
										erro = 1;
							} else {
								$( $(this) ).css({'background-color' : '#FFFFFF'});
							}
						});	
	
	
				if (contaLinhasTabela('tableNewSigner')<=2 && contaLinhasTabela('tableExSigners')<=2  && nextState!='13') {
					if ($('#ies_doc_analise').val()!='S' && $('#ies_tipo_direto').val()!='S') {
						msg += 'Você deve informar pelo menos 1 assinante cadastrado ou informar 1 nova assinante para o documento! ' ;
						erro = 1;
					}
				}		
				
				if ($('#den_tipo_documento').val()=='') {
					msg += ' Tipo de Documento ';
					erro = 1;
				}
				if ($('#task').val()!='25') {
				$( "input[name^='tabCpfNew___']" ).each( function () 
						{
							var seq = $(this).attr('name').split('___')[1];

							var result = $(this).val();
							console.log('verifica duplicado ',verificaCpfDuplicado( result ) );
							if ( verificaCpfDuplicado( result ) && $('#task').val()!='22' ){
										$( $(this) ).css({'background-color' : '#FFA500'});
										msg += ' CPF já cadastrado, você deve utilizar a opção de pesquisa! ';
										erro = 1;
							} else {
								$( $(this) ).css({'background-color' : '#FFFFFF'});
							}
						});
				}
				if (contaLinhasTabela('historico')<=2 && $('#task').val()=='5') {
					msg += ' Você precisa informar pelo menos 1 parecer! ';
					erro = 1;
				}
				
    console.log('variavel erro ',erro);				
	if(erro == 1) {
    	throw(msg);
	} else {
		if ($('#task').val()!='22') {	
			cadastraAssinantesNovos();
			console.log('variavel erro 2',erro);	
			gravaAssinantesnoArray();
		} else {
			console.log('variavel erro 2',erro);	
			gravaAssinantesnoArray();
		}
	}
}

function validarCPF(cpf) {
	cpf = cpf.replace(/[^\d]+/g, '');
	if (cpf == '') return false;
	// Elimina CPFs invalidos conhecidos
	if (
		cpf.length != 11 ||
		cpf == '00000000000' ||
		cpf == '11111111111' ||
		cpf == '22222222222' ||
		cpf == '33333333333' ||
		cpf == '44444444444' ||
		cpf == '55555555555' ||
		cpf == '66666666666' ||
		cpf == '77777777777' ||
		cpf == '88888888888' ||
		cpf == '99999999999'
	)
		return false;
	// Valida 1o digito
	add = 0;
	for (i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
	rev = 11 - (add % 11);
	if (rev == 10 || rev == 11) rev = 0;
	if (rev != parseInt(cpf.charAt(9))) return false;
	// Valida 2o digito
	add = 0;
	for (i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
	rev = 11 - (add % 11);
	if (rev == 10 || rev == 11) rev = 0;
	if (rev != parseInt(cpf.charAt(10))) return false;
	return true;
}

function validaEmail( email ) {
	if ( email == undefined || email == null || email == '' ){
		return false;
	}
	usuario = email.substring(0, email.indexOf("@"));
	dominio = email.substring(email.indexOf("@")+ 1, email.length);
	if ((usuario.length >=1) &&
		(dominio.length >=3) && 
		(usuario.search("@")==-1) && 
		(dominio.search("@")==-1) &&
		(usuario.search(" ")==-1) && 
		(dominio.search(" ")==-1) &&
		(dominio.search(".")!=-1) &&      
		(dominio.indexOf(".") >=1)&& 
		(dominio.lastIndexOf(".") < dominio.length - 1)) {
			return true;
	}else{
			return false;
	}
}

function executeWebservice(params, callback) {
	var that = this;
	var constraints = [];

	params.forEach(function(param) {
		constraints.push(DatasetFactory.createConstraint(param.name, param.value, param.value, ConstraintType.MUST));
	});

	if (constraints.length > 0) {
		var dsAux = DatasetFactory.getDataset('ds_auxiliar_vertsign', null, constraints, null);

		if (callback) {
			if (dsAux) {
				if (dsAux.values) {
					if (dsAux.values.length > 0) {
						if (dsAux.values[0].Result === 'OK') {
							callback();
						}
					} else {
						showAlert('Ocorreu um erro ao criar o registro', 'danger');
					}
				} else {
					showAlert('Ocorreu um erro ao criar o registro', 'danger');
				}
			} else {
				showAlert('Ocorreu um erro ao criar o registro', 'danger');
			}
		}
	}
}


function participantAdd(){

	var eSigners = $("#arrSigners_e").val() != "" ? JSON.parse($("#arrSigners_e").val()) : [];
	var dSigners = $("#arrSigners_d").val() != "" ? JSON.parse($("#arrSigners_d").val()) : [];
	var Params = JSON.parse($("#Params").val());
	
	var c1 = DatasetFactory.createConstraint('numSolic', $("#numSolic").val(), $("#numSolic").val(), ConstraintType.MUST);
	var form_aux = DatasetFactory.getDataset('ds_form_aux_vertsign', null, [c1], null).values;

	if (form_aux.length === 0){
		showAlert("Registro do Formulário Auxiliar não localizado", 'danger');
		return;
	}

	if (eSigners.length === 0 && dSigners.length === 0) {
		showAlert("Não há signatários para serem inclusos", 'info');
		return;
	}

	var cEletrSigners = {
		name: 'eSigners',
		value: JSON.stringify(eSigners)
	};

	var cDigiSigners = {
		name: 'dSigners',
		value: JSON.stringify(dSigners)
	};

	var idCreate = {
		name: 'idCreate',
		value: form_aux[0]["idCreate"]
	};

	var idRegistro = {
		name: 'idRegistro',
		value: form_aux[0]["metadata#id"]
	};

	var metodo = {
		name: 'metodo',
		value: 'participantAdd'
	};

	var constraints = [cEletrSigners, cDigiSigners, idCreate, idRegistro, metodo];

	executeWebservice(constraints, function (msg) {
		if (msg) {
			showAlert(msg, 'danger');
		}

		showAlert("Assinantes inclusos com sucesso!", 'success');

		// Limpa o container de cards
		$("#arrSigners_e").val("");
		$("#arrSigners_d").val("");
	});
}

function contaLinhasTabela(id){  
	var tabela = document.getElementById(id);  
	var linhas = tabela.getElementsByTagName('tr');    
	//alert('A tabela ' + id +' possui ' + linhas.length + ' linhas');
	console.log('quantidade de linhas ',linhas.length);
	return linhas.length;
}  

function verificaCpfDuplicado(cpf) {
	console.log('cpf ', cpf);
	console.log('a2dex ',a2hex(cpf));
	var c1 = DatasetFactory.createConstraint('cpf', a2hex(cpf), a2hex(cpf), ConstraintType.MUST);
	var dsAssinantes = DatasetFactory.getDataset('ds_vertsign_assinantes', null, [c1], null);

	if (dsAssinantes.values.length > 0) {
		return true;
	}
	return false;
}

function cadastraAssinantesNovos() {
	if (contaLinhasTabela('tableNewSigner')>2 && $("#task").val() == 11) {
		var indexNewLine = contaLinhasTabela('tableNewSigner');
		
		$( "input[name^='tabNameNew___']" ).each( function () 
				{
					var seq = $(this).attr('name').split('___')[1];

					var result = $(this).val();
					
								//incluindo novos assinantes
						var cNome 		 = "";
						var cEmail 		 = "";
						var cHiddenEmail = "";
						var cTipo 		 = "";
						var cCPF 		 = "";
						var cHiddenCpf	 = "";						
						var cTitulo 	 = "";
						var cEmpresa 	 = "";
						var metodo 		 = "";
						
						//alimentando as variaveis
						cNome 			= $(this).val();
						cEmail 			= $('#tabEmailNew___'+seq).val();
						cHiddenEmail	= hideInfo("email", $('#tabEmailNew___'+seq).val());
						cTipo			= $('#tabTipoAssinaturaNew___'+seq).val();; 
						cCPF			= $('#tabCpfNew___'+seq).val();
						cHiddenCpf		= hideInfo("cpf", $('#tabCpfNew___'+seq).val());
						cTitulo			= $('#tabTituloNew___'+seq).val();
						cEmpresa		= '1';
						metodo			= 'createSigner';
						
						var constraints = new Array();
						constraints.push(DatasetFactory.createConstraint('cNome', cNome, cNome, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint('cEmail', cEmail, cEmail, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint('cHiddenEmail', cHiddenEmail, cHiddenEmail, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint('cTipo', cTipo, cTipo, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint('cCPF', cCPF, cCPF, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint('cHiddenCpf',cHiddenCpf, cHiddenCpf, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint('cTitulo', cTitulo, cTitulo, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint('cEmpresa', cEmpresa, cEmpresa, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint('metodo', metodo, metodo, ConstraintType.MUST));
						
						
						//executando
						executeWebservice(constraints, function (msg) {
							if (msg) {
								showAlert(msg, 'danger');
							}

							showAlert("Assinantes inclusos com sucesso!", 'success');
						});
				});
	}
}

function hideInfo(info, value){

	var hiddeninfo = "";

	if (info == "cpf"){			
		hiddeninfo = value.replace(/[0-9]/g, "*");
        hiddeninfo = value.substr(0,3) + hiddeninfo.substr(3,9) + value.substr(12,14);            
	} 
	else 
	if (info == "email"){
		
		var email_oculto, email_aux, antes, antesOculto, dominio, dominioOculto, avg;
		email_aux 	   = value.replace(/[0-9a-zA-Z]/g, "*");

		antes   	   = value.split("@")[0];
		antesOculto    = email_aux.split("@")[0];
		avg 		   = antes.length / 2;			
		antes 		   = (antes.substring(0, (antes.length - avg)) + (antesOculto.substring((antes.length - avg), antes.length)));
	
		dominio 	   = value.split("@")[1];
		dominioOculto  = email_aux.split("@")[1];
		avg 		   = dominio.length / 2;
		dominio 	   = (dominio.substring(0, (dominio.length - avg)) + (dominioOculto.substring((dominio.length - avg), dominio.length)));
	
		hiddeninfo = antes + "@" + dominio;			
	}

	return hiddeninfo;
}

function gravaAssinantesnoArray() {
	while(arrSigners.length) {
		arrSigners.pop();
      }
	$("#arrSigners").val('');
	if (contaLinhasTabela('tableNewSigner')>2 ) {
		var indexNewLine = contaLinhasTabela('tableNewSigner');
		
		$( "input[name^='tabNameNew___']" ).each( function () 
				{
					var seq = $(this).attr('name').split('___')[1];

					var result = $(this).val();
					
								//incluindo novos assinantes
						var cNome 		 = "";
						var cEmail 		 = "";
						var cTipo 		 = "";
						var cCPF 		 = "";
						var cTitulo 	 = "";
						var etapa		 = "";
						
						//alimentando as variaveis
						cNome 			= $(this).val();
						cEmail 			= $('#tabEmailNew___'+seq).val();
						cTipo			= $('#tabTipoAssinaturaNew___'+seq).val();; 
						cCPF			= $('#tabCpfNew___'+seq).val();
						cTitulo			= $('#tabTituloNew___'+seq).val();
						cEtapa			= $('#tabEtapaNew___'+seq).val();
						
						arrSigners.push({
			                nome: cNome,
			                email: (cEmail),
			                cpf: (cCPF),
			                tipo: cTipo,
							titulo: cTitulo,
			                etapa: cEtapa, 
			                status: 'Pendente'
			        });
						
						
						
				});
	}
	
	if (contaLinhasTabela('tableExSigners')>2 ) {
		var indexNewLine = contaLinhasTabela('tableNewSigner');
		
		$( "input[name^='tabName___']" ).each( function () 
				{
					var seq = $(this).attr('name').split('___')[1];

					var result = $(this).val();
					
								//incluindo novos assinantes
						var cNome 		 = "";
						var cEmail 		 = "";
						var cTipo 		 = "";
						var cCPF 		 = "";
						var cTitulo 	 = "";
						var etapa		 = "";
						
						//alimentando as variaveis
						cNome 			= $(this).val();
						cEmail 			= $('#tabEmailComum___'+seq).val();
						cTipo			= $('#tabTipoAssinatura___'+seq).val();; 
						cCPF			= $('#tabCpfComum___'+seq).val();
						cTitulo			= $('#tabTitulo___'+seq).val();
						cEtapa			= $('#tabEtapa___'+seq).val();
						
						arrSigners.push({
			                nome: cNome,
			                email: (cEmail),
			                cpf: (cCPF),
			                tipo: cTipo,
							titulo: cTitulo,
			                etapa: cEtapa, 
			                status: 'Pendente'
			        });
				});
	}
	
	if (contaLinhasTabela('tableFixoSigner')>2 ) {
		var indexNewLine = contaLinhasTabela('tableFixoSigner');
		
		$( "input[name^='tabNameFixo___']" ).each( function () 
				{
					var seq = $(this).attr('name').split('___')[1];

					var result = $(this).val();
					
								//incluindo novos assinantes
						var cNome 		 = "";
						var cEmail 		 = "";
						var cTipo 		 = "";
						var cCPF 		 = "";
						var cTitulo 	 = "";
						var etapa		 = "";
						
						//alimentando as variaveis
						cNome 			= $(this).val();
						cEmail 			= $('#tabEmailFixo___'+seq).val();
						cTipo			= $('#tabTipoAssinaturaFixo___'+seq).val();; 
						cCPF			= $('#tabCpfFixo___'+seq).val();
						cTitulo			= $('#tabTituloFixo___'+seq).val();
						cEtapa			= $('#tabEtapaFixo___'+seq).val();
						
						arrSigners.push({
			                nome: cNome,
			                email: (cEmail),
			                cpf: (cCPF),
			                tipo: cTipo,
							titulo: cTitulo,
			                etapa: cEtapa, 
			                status: 'Pendente'
			        });
				});
	}


	
	$("#arrSigners").val(JSON.stringify(arrSigners));
}

