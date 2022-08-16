function beforeCancelProcess(colleagueId,processId){
	
	try{
		
		var cod_empresa = hAPI.getCardValue( "empresa" );
		var num_pedido = hAPI.getCardValue( "num_pedido" );
		
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint( 'cod_empresa', cod_empresa, cod_empresa, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'num_pedido', num_pedido, num_pedido, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'tipo', 'D', 'D', ConstraintType.MUST) );
		var dataset = DatasetFactory.getDataset( 'pedido_bloqueio', null, constraints, null);
        
		/*
        var iesDesbloq = false;
		if ( dataset != null ){
			for(var x = 0; x < dataset.rowsCount; x++) {
		    //log.info( "ADD CV"+pedido.getValue(x, "num_pedido" ) );
			//for (var x = 0; x < dataset.values.length; x++) {
				log.info( 'code menssagem..... '+dataset.getValue(x, "code" ) );
				if( dataset.getValue(x, "code" ) != 201 ){
					throw dataset.getValue(x, "menssagem");
					return false;
				}else{
					iesDesbloq = true;
				}
			}
		}
		if (!iesDesbloq){
			throw 'Não foi possivel desbloquear o pedido.';
			return false;
		}
		*/
	}
	catch( e ){
		log.info( " Erro ao desbloquear pedido! "+e );
	}
	
}