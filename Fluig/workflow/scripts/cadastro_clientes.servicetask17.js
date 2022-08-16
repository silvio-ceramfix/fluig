function servicetask17(attempt, message) {
	var numProcesso = getValue('WKNumProces');
	var userId = getValue("WKUser");
	var mensagem = getValueForm("comentario", "OK");
	var nomCliente = getValueForm("razao_social", "OK");
	var nomRepresentante = getValueForm("nom_representante", "OK");
	var codRepres = getValueForm("cod_repres", '0');
	setComment(userId, numProcesso, mensagem);
	enviaMail(userId, mensagem, numProcesso, nomCliente, nomRepresentante, codRepres);
}


function enviaMail(user, mensagem, numprocesso, nomCliente, nomRepresentante, codRepres){ 
	try {
	var parametros = new java.util.HashMap(); 
	parametros.put("subject", "Fluig - APONTAMENTO NO CADASTRO DE CLIENTE "+numprocesso);
	parametros.put("WDK_TaskComments", mensagem);
	parametros.put("WDK_TaskDeadLine", '999');
	parametros.put("WDK_CardDescriptorField", "Processo de Cadastro de Clientes - "+nomCliente);
	parametros.put("WDK_TaskUser", nomRepresentante);

	//Monta lista de destinatários 
	var destinatarios = new java.util.ArrayList(); 
	//###### BUSCA DADOS do representante
	var c1 = DatasetFactory.createConstraint("cod_repres", codRepres, codRepres, ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("metadata#active", codRepres, codRepres, ConstraintType.MUST);
    var constraints = new Array(c1,c2);
    var dataset = DatasetFactory.getDataset('representante_compl', null, constraints, null);
    if( dataset != null ) {
    	log.info('ENTROU NO ENVIO DE EMAIL 1');
    	for (var x = 0; x < dataset.values.length; x++) {
		    // ##### Carrega lista de e-mail
    		log.info('DATA SET...'+dataset );
    		var matricula = dataset.getValue(x, "matricula" );
    		log.info('ENTROU NO ENVIO DE EMAIL 2 '+matricula);
    		var mail = loadCampoDataSet( "colleague", "colleaguePK.colleagueId", matricula, "mail" );
    		log.info('ENTROU NO ENVIO DE EMAIL 3 '+mail);
    		log.info('mail '+mail);
    		destinatarios.add(mail);
		}
	}
	

	//Envia e-mail 
	notifier.notify(user, 'TPLPROCESS_NEW_STATE_TO_REQUESTER', parametros, destinatarios, 'text/html');
	//("00568", "convite_padrao", parametros, destinatarios, "text/html"); 
	} catch (e){
		
	}
}

function loadCampoDataSet(denDataSet, campo, valor, campoRetorno) {

	log.info('Execute DataSet......... ' + denDataSet + ' - ' + campo + ' - '
			+ valor + ' - ' + campoRetorno);
	var c1 = DatasetFactory.createConstraint(campo, valor, valor,
			ConstraintType.MUST);
	var constraints = new Array(c1);
	// Busca o dataset
	var dataset = DatasetFactory
			.getDataset(denDataSet, null, constraints, null);
	if (dataset != null) {
		for (var x = 0; x < dataset.values.length; x++) {
			log.info('Result DataSet......... ' + campoRetorno + ' - '
					+ dataset.getValue(x, campoRetorno));
			return dataset.getValue(x, campoRetorno);
		}
	}
	return ' ';
}