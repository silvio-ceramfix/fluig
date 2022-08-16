// Definindo os parâmetros
var parentFolder;
var calendar = java.util.Calendar.getInstance().getTime();

function executeWebservice(params, callback) {

    var constraints = [];

    params.forEach(function (param) {
        constraints.push(DatasetFactory.createConstraint(param.name, param.value, param.value, ConstraintType.MUST));
    });

    if (constraints.length > 0) {
        var dsAux = DatasetFactory.getDataset("ds_auxiliar_vertsign", null, constraints, null);

        if (callback) {
            if (dsAux.rowsCount > 0) {
                if (dsAux.getValue(0, "Result") === "OK") {
                    callback();
                }
            }
        }
    }
}

function retornaDocJaEnviado(codArquivo){
	
	var jaEnviado = false;
	
	var cDoc1 = DatasetFactory.createConstraint('codArquivo', codArquivo, codArquivo, ConstraintType.MUST);
	var cDoc2 = DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST);
	var dsDoc = DatasetFactory.getDataset('ds_form_aux_vertsign', null, [cDoc1, cDoc2], null);

	if (dsDoc && dsDoc.rowsCount > 0) {	
		if (dsDoc.getValue(0,"statusAssinatura") == "Enviando para assinatura" ||
			dsDoc.getValue(0,"statusAssinatura") == "Pendente Assinatura" ||
			dsDoc.getValue(0,"statusAssinatura") == "Assinado"){
			jaEnviado = true;
		}
	}
	
	return jaEnviado;
}

function getAttach() {
	
    var anexos = new java.util.ArrayList();
    var docs = hAPI.listAttachments();     
    log.info('documentos '+docs);
    
    if (docs.size() > 0) {
        for (var i = 0; i < docs.size(); i++) {
    
   
				//inicia a integracao do documento
					var doc = docs.get(i);
		            log.info('documentos2 '+doc);
		            /*** Validacao se o documento que esta anexo já foi enviado para assinatura ***/
		            
		            if (!retornaDocJaEnviado(doc.getDocumentId())){
		            	
				            	var idAnexo = doc.getDocumentId();
				                var vrAnexo = doc.getVersion();
				                var dsAnexo = doc.getDocumentDescription();
				                log.info('documento1 '+idAnexo );
				                var camposItem = hAPI.getCardData(getValue("WKNumProces"));
				            	var contadorItem = camposItem.keySet().iterator();
				        while (contadorItem.hasNext()) {
				                	
				                	
				                	log.info('ENTREIII O M ');
				            		var idItem = contadorItem.next();
				            		log.info('Campo. ' + idItem);
				            		var campo = idItem.split('___')[0];
				            		var seqItem = idItem.split('___')[1];
				            		log.info('Seq. ' + seqItem);
				           if (seqItem != undefined && campo == "ENVIA_DOC") {
				            			log.info('Sequencia.....' + seqItem);
				            			var integrar = getValueForm("integrar___" + seqItem, "") + "";
				            			var idDoc = getValueForm("id_doc___" + seqItem, "") + "";
				            			var versaoDoc = getValueForm("versao_doc___" + seqItem, "") + "";
				            			log.info('documento2 '+idDoc );

				            	if( ( integrar =='S' || dsAnexo.indexOf('Aux ') != -1 ) && idDoc == idAnexo) {	
				                	
				                	
				                // Cria o documento na pasta informada
				                // Funcao retorna 'true' para documento criado e 'false' para qualquer erro
				                	if ( createDocument(doc, parentFolder) ){
				                
					                	// Cria registro de formulario
					                    var nmArquivo = 	{name: "nmArquivo", value: dsAnexo};
					                    var codArquivo = 	{name: "codArquivo",value: idAnexo};
					                    var vrArquivo = 	{name: "vrArquivo",value: vrAnexo};
					                    var codPasta = 		{name: "codPasta",value: parentFolder};
					                    var codRemetente = 	{name: "codRemetente",value: getValue("WKUser")};
					                    var nmRemetente = 	{name: "nmRemetente",value: getValue("WKUser") + " - " + retornaColleague(getValue("WKUser"))};            
					                    var status = 		{name: "status",value: "Enviando para assinatura"};
					                    var metodo = 		{name: "metodo",value: "create"};
					                    log.info('array signers '+hAPI.getCardValue("arrSigners"));
					                    var jsonSigners = 	{name: "jsonSigners",value: hAPI.getCardValue("arrSigners")};
					                    var numSolic = 		{name: "numSolic", value: getValue("WKNumProces")};            
			
					                    var constraints = [jsonSigners, nmArquivo, codArquivo, vrArquivo, codPasta, codRemetente,status, metodo,numSolic,nmRemetente];
					                    executeWebservice(constraints, function () {
					                        log.info("Enviando documento para assinatura");
					                    });
					                } else {
					                	throw ("Houve erros durante a publicação do anexo. Não será possível prosseguir");
					                }
				            	}    
				            }
				        }
		            } /*else {
		            	throw ("Documento já enviado para assinatura. Documento: " + doc.getDocumentId());
		            } 	*/
				//fim integracao do documento	
				}

    } else {
        throw "É preciso anexar o documento para continuar o processo!";
    }
}

function retornaColleague(usuario){
	
	var nome      = usuario;
	var c1 		  = DatasetFactory.createConstraint('colleaguePK.colleagueId', usuario, usuario, ConstraintType.MUST);
	var colleague = DatasetFactory.getDataset('colleague', null, [c1], null);
	
	if (colleague && colleague.rowsCount > 0){
		nome = colleague.getValue(0, "colleagueName");
	} 
	
	return nome;
}

function createDocument(document, parentFolder) {
	
	try {
		if (document && parentFolder) {
	        document.setParentDocumentId(Number(parentFolder));
	        document.setVersionDescription("Processo: " + getValue("WKNumProces"));
	        document.setExpires(false);
	        document.setCreateDate(calendar);
	        document.setInheritSecurity(true);
	        document.setTopicId(1);
	        document.setUserNotify(false);
	        document.setValidationStartDate(calendar);
	        document.setVersionOption("0");
	        document.setUpdateIsoProperties(true);
	        document.setInternalVisualizer(true);
	        
	        log.info(' hAPI.getCardValue("cod_tipo_documento")......... '+ hAPI.getCardValue("cod_tipo_documento") );
	        var ct = [];
	        ct.push( DatasetFactory.createConstraint("cod_tipo_documento", hAPI.getCardValue("cod_tipo_documento"), hAPI.getCardValue("cod_tipo_documento"), ConstraintType.MUST) );
	        var td = DatasetFactory.getDataset('tipos_documentos', null, ct, null );
			if( td.rowsCount > 0 ){
				if( td.getValue(0,"marca_dagua") != "" 
				 && td.getValue(0,"marca_dagua") != undefined 
				 && td.getValue(0,"marca_dagua") != "null" 
			     && td.getValue(0,"marca_dagua") != null ){
					var nrMarca = Number( td.getValue(0,"marca_dagua") );
					log.info(' nrMarca......... '+ nrMarca );
					if( nrMarca != 0 ){
						document.setWatermarkId​( nrMarca );
						log.info(' Depois nrMarca......... '+ nrMarca );
					}
				}
			}
	        
	        var format = new java.text.SimpleDateFormat("dd/MM/yyyy");
	        
	        if( hAPI.getCardValue("indeterminado") == "N" ){	        
	        	document.setExpires(true);
	        	if( hAPI.getCardValue("data_vencimento") == "" ){
	        		document.setExpirationDate( format.parse( "2099-12-31" ) );
	        	}else{
	        		document.setExpirationDate( format.parse( hAPI.getCardValue("data_vencimento").split('-').reverse().join('/') ) );
	        	}
	        		
	        	var dias = parseInt( hAPI.getCardValue("prazo_rescicao") );
	        	if( isNaN(dias) ){
	        		dias = 30;
	        	}else{
	        		dias = dias + 30;
	        	}
	        	document.setNotificationDays( new java.lang.Integer( dias ) );
	        	//document.setNotificationDays( 44 );
	        }

	        // Publica o documento
	        hAPI.publishWorkflowAttachment(document);
	        return true;
	    } else {
	    	return false;
	    }
	} catch (erro) {
		throw erro;
	}    
}

function cadastraNovosAssinantes(company, user, password)
{
	var atividadeAtual  = getValue("WKNumState");
	if (atividadeAtual == '11'){
		var camposItem = hAPI.getCardData(getValue("WKNumProces"));
		var contadorItem = camposItem.keySet().iterator();
		var i = 0;
		while (contadorItem.hasNext()) {
			var idItem = contadorItem.next();
			var campo = idItem.split('___')[0];
			var seqItem = idItem.split('___')[1];
			if (seqItem != undefined && campo == "TABNAMENEW") {
				i += 1;
	
				var cCpf = getValueForm("tabCpfNew___" + seqItem,"")+ "";
				var cEmail = getValueForm("tabEmailNew___" + seqItem,"")+ "";
				var cpf = getValueForm("tabCpfNew___" + seqItem,"")+ "";
				var email = getValueForm("tabEmailNew___" + seqItem,"")+ "";
				var nome = getValueForm("tabNameNew___" + seqItem,"")+ "";
				var tipoAssinatura = getValueForm("tabTipoAssinaturaNew___" + seqItem,"")+ "";
				var titulo = getValueForm("tabTituloNew___" + seqItem,"")+ "";
				
				var c1 = DatasetFactory.createConstraint('cpf', a2hex(getValueForm("tabCpfNew___" + seqItem,"")+ ""),  a2hex(getValueForm("tabCpfNew___" + seqItem,"")+ ""), ConstraintType.MUST);
				var dsParamGeral = DatasetFactory.getDataset('ds_vertsign_assinantes', null, [c1], null);
	
				if (dsParamGeral.values.length > 0) {
					log.info('não entrou!');
				} else {
	
					log.info("###### ASSINANTE AINDA NAO EXISTE!");
					
					//A CADA ITERACAO, SE O USUARIO NAO FOI SINCRONIZADO É PRECISO INSTANCIAR AS VARIÁVEIS ABAIXO,
					//PARA QUE NAO HAJA DUPLICIDADE DOS REGISTROS DO FORMULARIO (CAUSANDO A CRIACAO DE MAIS DE UM REGISTRO DE FORMULARIO PARA O MESMO REGISTRO DO FOR) 
					var properties = {};
					properties["disable.chunking"] = "true";
					properties["log.soap.messages"] = "true";
					//CHAMADA DO SERVICO E INSTANCIAÇAO DAS CLASSES PARA A CHAMADA DO METODO	
					var serviceManager = ServiceManager.getService("WSCardService");
					var serviceInstance = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.ECMCardServiceService");
					var service = serviceInstance.getCardServicePort();	    		    
					var customClient = serviceManager.getCustomClient(service, "com.totvs.technology.ecm.dm.ws.CardService", properties);
					
					var attachment = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.Attachment");
					var relatedDocument = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.RelatedDocumentDto");
					var documentSecurity = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.DocumentSecurityConfigDto");
					var approver = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.ApproverDto");
					
					var cardDtoArray = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardDtoArray");
					var cardDto = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardDto");		
					
					var cardFieldDto1 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
					var cardFieldDto2 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
					var cardFieldDto3 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
					var cardFieldDto4 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
					var cardFieldDto5 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
					var cardFieldDto6 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
					var cardFieldDto7 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
					
					
					cardDto.getAttachs().add(attachment);
					cardDto.getReldocs().add(relatedDocument);
					cardDto.getDocsecurity().add(documentSecurity);
					cardDto.getDocapprovers().add(approver);
					
					//ADICIONA NO ARRAY OS METADADOS DO REGISTRO DE FORMULARIO 
					cardDto.setDocumentDescription(nome);
					cardDto.setAdditionalComments("");
					cardDto.setParentDocumentId(487413);
					cardDto.setExpires(false);
					cardDto.setUserNotify(false);
					cardDto.setInheritSecurity(true);
					cardDto.setVersionDescription("");
					cardDto.setDocumentKeyWord("");
					
					//ADICIONA NO ARRAY OS DADOS DOS CAMPOS DO FORMULARIO: NOME E O VALOR	
					cardFieldDto1.setField("cCpf");
					cardFieldDto1.setValue(cCpf);
					cardDto.getCardData().add(cardFieldDto1);
					
					cardFieldDto2.setField("cEmail");
					cardFieldDto2.setValue(cEmail);
					cardDto.getCardData().add(cardFieldDto2);
					
					cardFieldDto3.setField("cpf");
					cardFieldDto3.setValue(a2hex(cpf));
					cardDto.getCardData().add(cardFieldDto3);
					
					cardFieldDto4.setField("email");
					cardFieldDto4.setValue(a2hex(email));
					cardDto.getCardData().add(cardFieldDto4);
					
					cardFieldDto5.setField("nome");
					cardFieldDto5.setValue(nome);
					cardDto.getCardData().add(cardFieldDto5);
					
					cardFieldDto6.setField("tipoAssinatura");
					cardFieldDto6.setValue(tipoAssinatura);
					cardDto.getCardData().add(cardFieldDto6);
					
					cardFieldDto7.setField("titulo");
					cardFieldDto7.setValue(titulo);
					cardDto.getCardData().add(cardFieldDto7);
					
					// ADICIONA O REGISTRO NO ARRAY DO REGISTRO DE FORMULARIO
					cardDtoArray.getItem().add(cardDto);
					
					//CHAMADA METODO PARA CRIACAO DOS REGISTROS DE FORMULARIO
					result = customClient.create(company, user, password, cardDtoArray);
					log.info("###### REGISTRO ADICIONADO AOS ASSINANTES");
					
				}
				
			}
		}
	}	
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

function getValueForm(campo, padrao) {
	log.info("Campo........" + campo);
	var valor = hAPI.getCardValue(campo);
	if (padrao == "tipoPessoa")
		if (valor.indexOf("/0000-") == -1)
			valor = "F";
		else
			valor = "J";
	log.info("Valor........" + valor);
	if (valor == "" || valor == "") {
		valor = padrao;
		log.info("Valor padrÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ£o........" + valor);
	}
	return valor;
}


function sendMail( destinatarios ){
	
	
	var html = "";
	
	var tipo = {"C":"Confeccão de Documento",
				"A":"Aditivo",
				"D":"Distrato",
				"V":"Duvida",
				"N":"Analise Documento",
				"S":"Simples Armazenamento",
				"O":"Outros"};
	
	
	html += "<br><br>"+
		   "<br> Número: <b>"+ hAPI.getCardValue( "cod_empresa" ) +" - "+ getValue("WKNumProces") +"</b>"+
		   "<br> Parte: <b>"+ hAPI.getCardValue( "cod_parte" )+" - "+ hAPI.getCardValue( "nom_parte" ) +"</b>"+ 
		   "<br> Contrato: <b>"+ hAPI.getCardValue( "titulo" ) +" </b>"+
		   "<br> Contrato Original: <b>"+ hAPI.getCardValue( "contrato_original" ) +" </b>"+
		   "<br> Tipo: <b>"+ tipo[ hAPI.getCardValue( "tipo_solicitacao" ) ] +" - "+ hAPI.getCardValue( "den_tipo_documento" ) +" </b>"+
		   "<br> Solicitante: <b>"+ hAPI.getCardValue( "solicitante" ) +" </b>"+
		   "<br> Comentários:<br><b>"+ hAPI.getCardValue( "comentarios" ).split("\n").join("<br/>") +" </b>"+
		   "<br><br>";
	
	
	var urlServer = fluigAPI.getPageService().getServerURL();
	var docServ = fluigAPI.getDocumentService();
	
	var attachments = hAPI.listAttachments();
	log.info("URL..." + attachments.size());
		for (var i = 0; i < attachments.size(); i++) {
	
		 	var attachment = attachments.get(i);
	
			log.info("URL2... " + attachment.getDocumentId());
			var idDocumento = attachment.getDocumentId();
	
			log.info("IdDocumento" + idDocumento);
			if (idDocumento != null && idDocumento != 0) {
				
				
				
				var url = docServ.getDownloadURL​(  parseInt( idDocumento ) ); // urlServer+"/portal/p/1/ecmnavigation?app_ecm_navigation_doc="+idDocumento;
	
				log.info("URL3... " + url);
				html += "<a href=" + url + ">ANEXO" + (i + 1) +" - "+ attachment.getDocumentDescription() + "</a><br>";
		}
	}
	
	log.info('Serv... 001'+html);
	var parametros = new java.util.HashMap();
	parametros.put("WorkflowMailContent", html);
	parametros.put("SERVER_URL", urlServer );
	
	parametros.put("subject", "Analise Documentos - Processo: "+getValue("WKNumProces")+" "+hAPI.getCardValue("nom_parte") );
	log.info('Serv... 002');
	//Monta lista de destinatÃ¡rios
	
	
	
	var arrDestinatarios = new java.util.ArrayList();
	arrDestinatarios.add( getValue("WKUser") );
	
	var lMail = destinatarios.split(';');
	for( var r = 0; r < lMail.length; r++ ){
		arrDestinatarios.add( lMail[r] );
	}
	
	log.info('Serv... 003');
	notifier.notify( getValue("WKUser"), "TPLTASK_SEND_EMAIL_KBT", parametros, arrDestinatarios, "text/html");
		
}
