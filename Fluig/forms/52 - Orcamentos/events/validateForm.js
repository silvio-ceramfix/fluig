function validateForm(form){
	
	if ( getValue("WKCompletTask") && form.getValue('desc_medio') != null ){ 
		log.info( 'DESC MEDIO....'+parseFloat( form.getValue('desc_medio').replace(',','.') ) );
    	log.info( 'PERC DESC....'+parseFloat( form.getValue('perc_desc_ger_reg').replace(',','.') ) ); 
    	log.info( 'PERC DESC....'+parseFloat( form.getValue('perc_desc_ger_nac').replace(',','.') ) );    
    	log.info( 'MIX....'+parseFloat( form.getValue('mix_geral').replace(',','.') ) );
    	log.info( 'PERC MIX....'+parseFloat( form.getValue('perc_mix_ger_reg').replace(',','.') ) );
    	log.info( 'PERC MIX....'+parseFloat( form.getValue('perc_mix_ger_nac').replace(',','.') ) );
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

}
	