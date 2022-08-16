function afterTaskComplete(colleagueId,nextSequenceId,userList){
	
	var task = getValue('WKNumState');
	var processo = getValue('WKDef');
	var numProcess = getValue("WKNumProces");
	var user = getValue("WKUser");
    
	if ( getValue("WKCompletTask") && ( task == 1 || task == 33 ) ){
		var comentario = ' Desconto Médio: '+getValueFormFloat('desc_medio')+' - MIX: '+getValueFormFloat('mix_geral') ;
		setComment( user, numProcess, comentario );
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