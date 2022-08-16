function beforeStateEntry(sequenceId){
	
	log.info( 'Entrei beforeStateEntry.....'+sequenceId )
	
	if ( sequenceId == 15 ){
		hAPI.setCardValue("orcamento_alterado","N");
	}
	
}