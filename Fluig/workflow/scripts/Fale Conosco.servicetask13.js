function servicetask13(attempt, message) {
	var destinatarios = new java.util.ArrayList();
	var parametros = new java.util.HashMap();
	var assunto = "Fale com o RH! ";
	var serverUrl = fluigAPI.getPageService().getServerURL();
	
	//parametros.put("PedidoDetalhe", "");
	//parametros.put("subject", assunto );
	
	//assunto += "<br><br><a href="+ serverUrl +"/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID="+ getValue("WKNumProces") +">PROCESSO - "+ getValue("WKNumProces") +"</a>";

	parametros.put("WorkflowMailContent", assunto);
	
	parametros.put("SERVER_URL", serverUrl);
	parametros.put("TEXTO", hAPI.getCardValue("comentarios"));
	
	log.info('Serv... 002');
 	//Monta lista de destinatÃ¡rios
	destinatarios.add( 'rh@ceramfix.com.br' );
	log.info('Serv... 003');
	notifier.notify( "admin", "TMPL_ENVIO_FALECONOSCO", parametros, destinatarios, "text/html");
	log.info('Serv... 004');
}
