function servicetask16(attempt, message) {
	
	
		
		try {
			
			var solicitacao = getValue("WKNumProces");
			
			log.info(">>> Vertsign - BPM - Enviando documento para assinatura");	
			log.info(">>> Solicitacao: " + solicitacao);
			
			var c1 = DatasetFactory.createConstraint('numSolic', solicitacao, solicitacao, ConstraintType.MUST);
			var form_aux = DatasetFactory.getDataset('ds_form_aux_vertsign', null, [c1], null);
			
			if (form_aux && form_aux.rowsCount > 0) {
				log.info(">>> Formulario Auxiliar: " + form_aux.rowsCount);
				for (var i = 0; i < form_aux.rowsCount; i++) {
					log.info(">>> Enviando arquivo: " + form_aux.getValue(i, 'codArquivo') + ' arquivo '+i);
					var c2 = DatasetFactory.createConstraint('codArquivo', form_aux.getValue(i, 'codArquivo'), form_aux.getValue(i, 'codArquivo'), ConstraintType.MUST);
					var ds_upload = DatasetFactory.getDataset("ds_upload_vertsign_manual", null, [c2], null);
					
					if (ds_upload){				
						
						form_aux = DatasetFactory.getDataset('ds_form_aux_vertsign', null, [c1], null);
						if (form_aux && form_aux.rowsCount > 0) {
							log.info(">>> Status do Documento: " + form_aux.getValue(0, "statusAssinatura"));	
							
							if (form_aux.getValue(0, "statusAssinatura") == "Enviando para assinatura"){
								throw "Houve erros durante o envio do documento, verifique novamente.";
							}
						}
						
									
					}
				}
			} else {
				throw "Não foi possível localizar Formulário Auxiliar com o código da solicitação";
			}
		} catch (e) {
			throw ("Erro ao enviar documento para integração: " + (e));
		}
		
	
}