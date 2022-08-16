function servicetask95(attempt, message) {
	var camposProg = hAPI.getCardData( getValue("WKNumProces") );
	var contadorProg = camposProg.keySet().iterator();
	var seqEnt = 0;
	while ( contadorProg.hasNext() ) {
		var idProg = contadorProg.next();
		var campo = idProg.split('___')[0];
		var seqProg = idProg.split('___')[1];
		log.info('idProg...'+idProg);
		log.info('sequencia prog...'+seqProg);
		log.info('campo prog...'+campo);
		if ( seqProg != undefined && campo == "MAIOR_QUE_TOLERANCIA" ){
			log.info( 'Sequencia.....'+seqProg );
			log.info('entrou aqui 1...');
			/*if ( hAPI.getCardValue( 'seq_item_pai___'+seqProg ) ==  seqItem ){*/
																	
				if ( hAPI.getCardValue('maior_que_tolerancia___'+seqProg ) == 'S' )
				{
					log.info('entrou aqui 2...');
					hAPI.setCardValue("aprov_perc_tolerancia","S");
				}
			/*}*/
		}
	}
}