function servicetask10(attempt, message) {
	
	var camposItem = hAPI.getCardData( getValue("WKNumProces") );
	log.info( camposItem );
	var contadorItem = camposItem.keySet().iterator();
	log.info( contadorItem );
	
	var formData = new java.util.HashMap();
	
	while ( contadorItem.hasNext() ) {
		var idItem = contadorItem.next();
		log.info( 'servicetask10.....'+idItem );
		//if( idItem )
		var valor = hAPI.getCardValue( idItem ); 
		if( idItem == "RAZAO_SOCIAL_ZOOM" || idItem == "RAZAO_SOCIAL" ){
			log.info( 'idItem......'+idItem );
			if( hAPI.getCardValue('RAZAO_SOCIAL_ZOOM') != "" && hAPI.getCardValue('RAZAO_SOCIAL_ZOOM') != null ){
				valor = hAPI.getCardValue('RAZAO_SOCIAL_ZOOM');
				log.info( 'idItem #razao_social_zoom ......'+valor );
			}else if( hAPI.getCardValue('RAZAO_SOCIAL') != "" && hAPI.getCardValue('RAZAO_SOCIAL') != null ){
				valor = hAPI.getCardValue('RAZAO_SOCIAL');
				log.info( 'idItem #razao_social ......'+valor );
			}
		}
		if( idItem == "COD_CLIENTE" && ( valor == "" || valor == undefined ) ){
			valor = hAPI.getCardValue('#CNPJ').replace(".","").replace(".","").replace("/","").replace("-","");
		} 
		log.info( 'valor ......'+valor );
		formData.put( idItem, valor );
	}
	
	//formData.put( 'ies_orcamento', 'S' );
	
	var users = new java.util.ArrayList();
	var pedido = hAPI.startProcess('inc_pedido', '59', users, "Pedido gerado pelo orcamento "+getValue('WKNumProces'), true, formData, false);
	
	var numProcesso = getValue('WKNumProces');
	var userId = getValue("WKUser");
	setComment( userId, numProcesso, 'Iniciado processo '+ pedido.get('iProcess') +' para geracao do pedido.' );
	log.info( pedido );
	return true;
	
}

function setComment( user, processo, comentario ){
	
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint( 'processo', processo, processo, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'user', user, user, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'comentario', comentario, comentario, ConstraintType.MUST) );
    var dataset = DatasetFactory.getDataset( 'setComent', null, constraints, null);
	if ( dataset != null ){
		return dataset.getValue(0, 'retorno' );
	}
}