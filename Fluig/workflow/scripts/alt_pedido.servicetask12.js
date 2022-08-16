function servicetask12(attempt, message) {

	//######### RECUPERA INFORMAÃ¿Ã¿ES DO PEDIDO DO LOGIX
	var cod_empresa = hAPI.getCardValue( "empresa" );
	var num_pedido = hAPI.getCardValue( "num_pedido" );
	var cod_cliente = hAPI.getCardValue( "cod_cliente" );
	var cod_repres = hAPI.getCardValue( "cod_repres" );
	var consistencias = hAPI.getCardValue('consistencias');
	var numProcesso = getValue('WKNumProces');
	var userId = getValue("WKUser");
	var emailAdicional = hAPI.getCardValue('emailPed');
	
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint( 'cod_empresa', cod_empresa, cod_empresa, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'num_pedido', num_pedido, num_pedido, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'usuario', userId, userId, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'cod_cliente', cod_cliente, cod_cliente, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'cod_repres', cod_repres, cod_repres, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'numProcesso', numProcesso, numProcesso, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'consistencias', consistencias, consistencias, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'e_mail', emailAdicional, emailAdicional, ConstraintType.MUST) );

	var dataset = DatasetFactory.getDataset( 'pedido_send_mail', null, constraints, null);

	if (dataset != null) {
		if (dataset.getValue(0, "result") == 'NOK') {
			throw 'Erro ao processar envio de e-mail: ' + dataset.getValue(0, "erro");
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
} 