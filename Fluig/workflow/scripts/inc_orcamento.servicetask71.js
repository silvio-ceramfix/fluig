function servicetask71(attempt, message) {
	
	if( hAPI.getCardValue( "tipo_cadastro") == 'E' || hAPI.getCardValue("acao") == 'E'){
		hAPI.setCardValue( "cliente_cadastrado", 'S' );
	}else{
		log.info( 'ENTROU1' );
		var cod_cliente = hAPI.getCardValue( "cod_cliente" );
		var c1 = DatasetFactory.createConstraint("cod_cliente", cod_cliente, cod_cliente, ConstraintType.MUST);
		var constraints = new Array(c1);
		var dataset = DatasetFactory.getDataset('clientes_geral', null, constraints, null);
		if ( dataset != null && dataset.rowsCount > 0 ){
			hAPI.setCardValue( "cliente_cadastrado", 'S' );
			log.info( 'ENTROU2' );
	}else{
			hAPI.setCardValue( "cliente_cadastrado", 'N' );
			log.info( 'ENTROU3' );
			if ( cod_cliente == "" ){
				cod_cliente = hAPI.getCardValue( 'cnpj' ).val().replace(".","").replace(".","").replace("/","").replace("-","");
				log.info( 'ENTROU4' );
			}
			log.info( 'ENTROU41' );
			var cliC1 = DatasetFactory.createConstraint("cod_cliente", cod_cliente, cod_cliente, ConstraintType.MUST);
			var constraints = new Array(cliC1);
			log.info( 'ENTROU42' );
			var datasetCli = DatasetFactory.getDataset('clientes', null, constraints, null);
			log.info( 'ENTROU43' );
			if ( datasetCli == null || datasetCli.rowsCount == 0 ){
				log.info( 'ENTROU45' );
	        	var numProcesso = getValue('WKNumProces');
	        	var userId = getValue("WKUser");
				var constraints = new Array();
				constraints.push( DatasetFactory.createConstraint( 'cnpj', hAPI.getCardValue( 'cnpj' ), hAPI.getCardValue( 'cnpj' ), ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint( 'razao_social', hAPI.getCardValue( 'razao_social' ), hAPI.getCardValue( 'razao_social' ), ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint( 'cod_cliente', cod_cliente, cod_cliente, ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint( 'tipo_cliente', hAPI.getCardValue( 'tipo_cliente' ), hAPI.getCardValue( 'tipo_cliente' ), ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint( 'usuario', hAPI.getCardValue( 'userFluig' ), hAPI.getCardValue( 'userFluig' ), ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint( 'numProcesso', numProcesso, numProcesso, ConstraintType.MUST) );
				
				constraints.push( DatasetFactory.createConstraint( 'cod_pais', hAPI.getCardValue( 'cod_pais_ent' ), hAPI.getCardValue( 'cod_pais_ent' ), ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint( 'pais', hAPI.getCardValue( 'pais_ent' ), hAPI.getCardValue( 'pais_ent' ), ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint( 'estado', hAPI.getCardValue( 'estado_ent' ), hAPI.getCardValue( 'estado_ent' ), ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint( 'cod_cidade', hAPI.getCardValue( 'cod_cidade' ), hAPI.getCardValue( 'cod_cidade' ), ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint( 'cidade', hAPI.getCardValue( 'cidade' ), hAPI.getCardValue( 'cidade' ), ConstraintType.MUST) );
				log.info( 'ENTROU5' );
			    //Busca o dataset
				var datasetReturned = DatasetFactory.getDataset( 'cliente_start_novo', null, constraints, null);		
		        if (datasetReturned != null && datasetReturned.rowsCount > 0) {
		        	log.info( 'ENTROU6' );
		        	var processoCriado = datasetReturned.getValue( 0, 'num_processo' );
		        	setComment( userId, numProcesso, 'Iniciado processo '+ processoCriado +' para cadastro de cliente.' );
		        }
			}
		}
	}
	
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