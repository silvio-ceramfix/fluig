function beforeTaskSave(colleagueId, nextSequenceId, userList) {

	var numState = getValue("WKNumState");
	var process = getValue("WKNumProces");
	var anexado = false;
	var message = "";
	var tipoProcesso = hAPI.getCardValue('tipo_processo');

	/*
	 * if(numState == 5 && hAPI.listAttachments().size() < 1) { message += "<br/>-
	 * É necessario anexar os documentos;" }
	 */
	log.info('numState '+numState);
	log.info('tipoProcesso '+tipoProcesso);
	//log.ingo('temAnexo '+ temAnexo());
	if (numState == '4' || numState == '0' || numState == '1' || numState == '42') {
		if (tipoProcesso == 'E'){
			//if (temAnexo() == false)
			var atv      = getValue("WKNumState");
		    var nextAtv  = getValue("WKNextState");



		        var anexos   = hAPI.listAttachments();
		        var temAnexo = false;

		        if (anexos.size() > 0) {
		            temAnexo = true;
		        }

		        if (!temAnexo) {
		            throw "É preciso anexar o documento para continuar o processo!";
		        }

				//message += "<br/>- Faltam anexos do processo! ";
		}
	}

	if (numState == 5) { // etapa do processo
		if (temAnexo() == false)
			message += "<br/>- Fotos do problema relatado! ";
	}
	
	if (numState == 16) { // etapa do processo
		if (temAnexo() == false)
			message += "<br/>- Relatório Técnico! ";
	}
	
	if (numState == 30) { // etapa do processo
		if (temAnexo() == false)
			message += "<br/>- Anexar Comprovante de Depósito! ";
	}

	if (message != "")
		throw "<br/><strong>Os anexos abaixo são obrigatórios: </strong><br/>"
				+ message;

	function temAnexo() {
		var constraintProcessAttachment = DatasetFactory.createConstraint(
				'processAttachmentPK.processInstanceId', process, process,
				ConstraintType.MUST);
		var datasetProcessAttachment = DatasetFactory.getDataset(
				'processAttachment', null, new Array(
						constraintProcessAttachment), null);

		for (var i = 0; i < datasetProcessAttachment.rowsCount; i++) {
			var constraintProcessHistory1 = DatasetFactory.createConstraint(
					'processHistoryPK.movementSequence',
					datasetProcessAttachment.getValue(i,
							"originalMovementSequence"),
					datasetProcessAttachment.getValue(i,
							"originalMovementSequence"), ConstraintType.MUST);
			var constraintProcessHistory2 = DatasetFactory.createConstraint(
					'processHistoryPK.processInstanceId', process, process,
					ConstraintType.MUST);
			var constraintProcessHistory3 = DatasetFactory.createConstraint(
					'processHistoryPK.companyId', datasetProcessAttachment
							.getValue(i, "processAttachmentPK.companyId"),
					datasetProcessAttachment.getValue(i,
							"processAttachmentPK.companyId"),
					ConstraintType.MUST);
			var constraintProcessHistory4 = DatasetFactory.createConstraint(
					'stateSequence', numState, numState, ConstraintType.MUST);
			var datasetProcessHistory = DatasetFactory.getDataset(
					'processHistory', null, new Array(
							constraintProcessHistory1,
							constraintProcessHistory2,
							constraintProcessHistory3,
							constraintProcessHistory4), null);
			for (var j = 0; j < datasetProcessHistory.rowsCount; j++) {
				return true;
			}
		}
		return false;
	}

}