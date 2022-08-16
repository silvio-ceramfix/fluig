function servicetask55(attempt, message) {
	
	if((hAPI.getCardValue("tipo_solicitacao") == "A"
	 || hAPI.getCardValue("tipo_solicitacao") == "D")
	 && !isNaN(parseInt(hAPI.getCardValue("doc_original"))) ){
		
		var CardFieldList = new java.util.ArrayList();
	
		var camposItem = hAPI.getCardData( parseInt( hAPI.getCardValue("proc_original") ) );
		var contadorItem = camposItem.keySet().iterator();
		
		//contador inicia aqui
		while ( contadorItem.hasNext() ) {
			var idItem = contadorItem.next();
			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId( idItem );
			voCard.setValue( camposItem.get( idItem ) );
			CardFieldList.add(voCard);			
		}
		
		
		var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
		voCard.setFieldId("data_vencimento");
		voCard.setValue(hAPI.getCardValue("data_vencimento"));
		CardFieldList.add(voCard);
		
		var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
		voCard.setFieldId("data_reajuste");
		voCard.setValue(hAPI.getCardValue("data_reajuste"));
		CardFieldList.add(voCard);
			
		if( hAPI.getCardValue("tipo_solicitacao") == "D" ){
			var voCard = new com.fluig.sdk.api.cardindex.CardFieldVO();
			voCard.setFieldId("status_contrato");
			voCard.setValue( new String("I") );
			CardFieldList.add(voCard);
		}
			
		var srvCard = fluigAPI.getCardAPIService();
		var retorno = srvCard.edit(parseInt(hAPI.getCardValue("doc_original")), CardFieldList);
	}
	
}