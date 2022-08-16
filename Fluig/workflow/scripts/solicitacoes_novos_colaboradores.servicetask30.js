function servicetask30(attempt, message) {
	
	  log.info('servicetask30.......');
	  hAPI.setCardValue('papel_responsavel_atual', '');
	  var aprovadores = getAprovadoresFromTable();

	  for (var i = 0; i < aprovadores.length; i++) {
	    var aprovador = aprovadores[i];
	    log.info('aprovador.confirma.......'+aprovador.confirma);
	    if ( ( aprovador.necessita_item == 'S' || aprovador.possui_item == 'S' )  && aprovador.confirma != 'S') {
	      hAPI.setCardValue('papel_responsavel_atual', aprovador.papel_responsavel_item);
	      break;
	    }
	  }
	  
}