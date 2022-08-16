function montaMsgMail(){
	
}

var codItens = "";

function montaCabecalho(tipo){
	
	var html = "";
	
	if( tipo == "F" ){
		html = "Fechamento RNC: ";
	}else{
		html = "Abertura RNC: ";
	}
	
	html +=    "<br><br>"+
			   "<br> Número: <b>"+ hAPI.getCardValue( "empresa" ) +" - "+ getValue("WKNumProces") +"</b>"+
			   "<br> Cliente: <b>"+ hAPI.getCardValue( "cnpj_cliente" )+" - "+ hAPI.getCardValue( "nom_cliente" ) +"</b>"+ 
			   "<br> Motivo: <b>"+ hAPI.getCardValue( "den_motivo" ) +" </b>"+
			   "<br> Descrição:<br><b>"+ hAPI.getCardValue( "analise_dados" ) +" </b>"+
			   "<br><br>";
	   
	return html;
	
}

function montaRodape(){
	
	var html = "";
	
	var user = getValue("WKUser");	
	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
	var constraints = new Array(c1);
	var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
	
	var area = colleagueMap.getValue(0,"especializationArea");
	if( area == null || area == "null" ){
		area = "";
	}
	var proj = colleagueMap.getValue(0,"currentProject");
	if( proj == null || proj == "null" ){
		proj = "";
	}
	var fone = colleagueMap.getValue(0,"extensionNr");
	if( fone == null || fone == "null" ){
		fone = "";
	}
	
  	    html += "<br><b> Favor não responder este email, ele não esta sendo monitorado. </b>";
		
		var attachments = hAPI.listAttachments();
		log.info("URL..." + attachments.size());
		 for (var i = 0; i < attachments.size(); i++) {
		 	var attachment = attachments.get(i);
		 	if (attachment.getDocumentType() == "7") {
		 		log.info("URL2... " + attachment.getDocumentId());
		  		var idDocumento = attachment.getDocumentId();
		  		log.info("IdDocumento" + idDocumento);
		 		if (idDocumento != null && idDocumento != 0) {
				  	var url = fluigAPI.getDocumentService().getDownloadURL(idDocumento);
			   		log.info("URL3... " + url);
			   		html += "<br><a href=" + url + ">ANEXO" + (i + 1) +" - "+ attachment.getDocumentDescription() +"</a>";
		   		}
		 	}
		}
					   
	return html;
}

function montaTitulo(tipo){
	
	var CPLtipo = "";
	if( tipo == "F" ){
		CPLtipo = "Fechamento ";
	}else{
		CPLtipo = "Abertura";
	}
	
	return "RNC "+CPLtipo+": "+getValue("WKNumProces") +" ("+ hAPI.getCardValue('empresa').trim() +") "+ codItens +" - "+ hAPI.getCardValue('nom_cliente');		
}
