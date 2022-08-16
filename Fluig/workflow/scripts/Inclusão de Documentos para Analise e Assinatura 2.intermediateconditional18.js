function intermediateconditional18() {

	var solicitacao = getValue("WKNumProces");
	var finalizado  = false;
	
	log.info(">>> Vertsign - BPM - Verificando status do documento");	
	log.info(">>> Solicitacao: " + solicitacao);
	
	var c1 = DatasetFactory.createConstraint('numSolic', solicitacao, solicitacao, ConstraintType.MUST);
	var form_aux = DatasetFactory.getDataset('ds_form_aux_vertsign', null, [c1], null);
	
	if (form_aux && form_aux.rowsCount > 0) {		
		
		log.info(">>> Status do Documento: " + form_aux.getValue(0, "statusAssinatura"));
		
		if (form_aux.getValue(0, "statusAssinatura").trim() == "Assinado"  ||
			form_aux.getValue(0, "statusAssinatura").trim() == "Rejeitado" ||
			form_aux.getValue(0, "statusAssinatura").trim() == "Cancelado"){
			finalizado = true;
		}
	} else {
		log.info(">>> Não localizado Formulário Auxiliar, irá finalizar com erros");
		finalizado = true;
	}
	
	return finalizado;
}