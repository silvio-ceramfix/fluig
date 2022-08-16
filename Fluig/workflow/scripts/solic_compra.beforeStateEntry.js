function beforeStateEntry(sequenceId){
	

	log.info( 'Entrei beforeStateEntry'+sequenceId );
	
	try{
		//getValue('WKNumState') == 1 ||
		/*if( sequenceId != null && sequenceId != undefined 
			&& ( sequenceId == 17 || sequenceId == 21 || sequenceId == 27  ) ){
			
			var user = getValue('WKUser');
			hAPI.setCardValue( "user_fluig", user );
			
		}*/
		if( sequenceId != null && sequenceId != undefined && sequenceId == 4 ){
			log.info( 'Entrei sequence...' );
			var processInstanceId = getValue("WKNumProces");
			var stateSequence = getValue("WKNumState");
			
			var threadSequence = 0; 
			fluigAPI.getWorkflowService()
			var obs = fluigAPI.getWorkflowService().findObservations(processInstanceId, stateSequence, threadSequence);
			
			var texto = '';
			if( obs != null && obs != undefined ){
				log.info( 'Entrei for ........ ' );
				for( var x = 0; x < obs.size(); x++ ){
					texto += obs.get(x).getObservation()+" ";
					log.info( 'Entrei texto......'+x );
				}
				hAPI.setCardValue( "motivo", hAPI.getCardValue( "motivo" ) + texto );
				log.info( 'Entrei set motivo......'+texto );
			}
		}
	}catch(e){
		log.info( 'Entrei ERRROOOOOOO........' );
	}
	log.info( 'Cheguei FIMMMMM' );
	
}