function beforeTaskSave(colleagueId, nextSequenceId, userList) {
	var atividadeAtual  = getValue("WKNumState");
	var proximaAtividade = getValue("WKNextState");

/*	if (atividadeAtual == '11' || atividadeAtual == '22'){
		log.info('entrou1 atividade... '+atividadeAtual);
		if (proximaAtividade == '16') {
			log.info('entrou2 atividade... '+proximaAtividade);
			cadastraNovosAssinantes('1','admin','SrvCeram971');
			parentFolder = String(hAPI.getCardValue("folderID"));
			getAttach();
		}
	} */
	
	var attachments = hAPI.listAttachments();
	
	var hasAttachment = false;
	for (var i = 0; i < attachments.size(); i++) {
        var attachment = attachments.get(i);
        if (attachment.getDocumentDescription().indexOf("Aux ") == -1 ) {
            hasAttachment = true;
        }
    }
	
	if( !hasAttachment ) {
		throw "É preciso anexar o documento para continuar o processo!";
	}
	
}
