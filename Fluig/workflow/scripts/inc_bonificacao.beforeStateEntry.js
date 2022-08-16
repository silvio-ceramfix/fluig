function beforeStateEntry(sequenceId){
		log.info('	:');
		log.info('aprova_regional :'+hAPI.getCardValue( "aprova_regional"));
		log.info('WKCompletTask :'+getValue("WKCompletTask"));
		log.info('WKNextState :'+getValue("WKNextState"));
		log.info('sequenceId :'+sequenceId);
}