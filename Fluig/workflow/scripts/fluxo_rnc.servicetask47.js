function servicetask47(attempt, message) {
	
	var html = montaCabecalho("F");	
	
	html += montaRodape();
		   		
	log.info('Serv... 001');
	var parametros = new java.util.HashMap();
	parametros.put("WorkflowMailContent", html);
	parametros.put("SERVER_URL", "https://fluig.ceramfix.com.br/");
	//Este parÃ¢metro Ã© obrigatÃ³rio e representa o assunto do e-mail
	parametros.put("subject", montaTitulo('F') );
	log.info('Serv... 002');

 	//Monta lista de destinatÃ¡rios
	var destinatarios = new java.util.ArrayList();
		 
	var aResp = hAPI.getCardValue( "responsaveis_acao" ).split(',');
	for( var i = 0; i < aResp.length; i ++ ){
		destinatarios.add( aResp[i] );
	}
	
	destinatarios.add( hAPI.getCardValue( "gestor_area" ) );
	
	destinatarios.add( 'amjunior@gmail.com' );
	log.info('Serv... 003');
	
	notifier.notify(getValue("WKUser"), "TPLTASK_SEND_EMAIL", parametros, destinatarios, "text/html");
	log.info('Serv... 004');
	
	return true;
}