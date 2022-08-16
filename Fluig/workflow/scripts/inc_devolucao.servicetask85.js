function servicetask85(attempt, message) {
	var html = montaCabecalho("F");	
	
	html += montaRodape();
		   		
	log.info('Serv... 001');
	var parametros = new java.util.HashMap();
	parametros.put("WorkflowMailContent", html);
	parametros.put("SERVER_URL", "https://fluig.ceramfix.com.br/");
	//Este parÃ¢metro Ã© obrigatÃ³rio e representa o assunto do e-mail
	parametros.put("subject", montaTitulo() );
	log.info('Serv... 002');

 	//Monta lista de destinatÃ¡rios
	var destinatarios = new java.util.ArrayList();
			
	destinatarios.add( hAPI.getCardValue( "userFluig" ) );
	
	
	log.info('Serv... 003');
	
	notifier.notify(getValue("WKUser"), "TPLTASK_SEND_EMAIL", parametros, destinatarios, "text/html");
	log.info('Serv... 004');
	
	return true;
}

function montaCabecalho(tipo){
	
	var html = "";
	
	if( tipo == "F" ){
		html = "Fechamento RNC: ";
	}else{
		html = "Abertura RNC: ";
	}
	
	html +=    "<br><br>"+
			   "<br> Número: <b>"+ hAPI.getCardValue( "empresa_hd" ) +" - "+ getValue("WKNumProces") +"</b>"+
			   "<br> Cliente: <b>"+ hAPI.getCardValue( "cnpj" )+" - "+ hAPI.getCardValue( "razao_social" ) +"</b>"+ 
			   "<br> Motivo: <b>"+ hAPI.getCardValue( "motivo_devolucao" ) +" </b>"+
			   "<br><br>";
	   
	return html;
	
}

function montaRodape(){
	
	var html = "";
	
  	html += "<br><b> Favor não responder este email, ele não esta sendo monitorado. </b>";
					   
	return html;
}

function montaTitulo(tipo){
	
	return "Devolução : "+getValue("WKNumProces") +" ("+ hAPI.getCardValue('empresa_hd').trim() +") "+ " - Nota Fiscal: "+ hAPI.getCardValue('num_nota_fiscal');		
}
