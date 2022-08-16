function servicetask33(attempt, message) {

	var process = getValue("WKNumProces");
	var camposItem = hAPI.getCardData(getValue("WKNumProces"));
	var cod_cliente = hAPI.getCardValue('cod_cliente');
	log.info('CLIENTE COD '+ cod_cliente);
	log.info(camposItem);
	var contadorItem = camposItem.keySet().iterator();
	log.info(contadorItem);

	var formData = new java.util.HashMap();
	
	log.info('ENTROU OBSERVACOES');
	valor = "Processo de Bonificação Gerado pelo Processo de Assistência Técnica número: "+process;
	formData.put("descricao", valor);
	
	log.info('ENTROU VALOR_BONIFICACAO');
	valor = hAPI.getCardValue('valor_bonficacao'); //$('#valor_bonficacao').val();
	formData.put("val_invest", valor);
	
	log.info('ENTROU COD_CLIENTE');
	valor = hAPI.getCardValue('cnpj').replace(".", "").replace("/", "").replace(
				"-", "");
	formData.put("cod_cliente",valor);
	
	
	valor = hAPI.getCardValue('razao_social_zoom');
	formData.put("razao_social_zoom", valor);
	
	valor =  hAPI.getCardValue('razao_social');
	formData.put("razao_social", valor);
	
	
	formData.put("boni_asstecnica", "S");
	
	//formData.put(idItem, valor);

	var users = new java.util.ArrayList();
	
	
	// recupera representante do cliente
	var c1 = (DatasetFactory.createConstraint("cod_cliente",
			cod_cliente, cod_cliente, ConstraintType.MUST));
	var constraints = new Array(c1);

	var matrepcliente = DatasetFactory.getDataset("clientes_logix", null,
			constraints, null);
	var cod_user = matrepcliente.getValue(0,
			"cod_user");
	log.info("COD_USER_REP " + cod_user);
	users.add(cod_user);
	//fim recupera representante do cliente
	
	var pedido = hAPI.startProcess('inc_bonificacao', '52', users,
			"Bonificação Gerada pela Assistência Técnica " + getValue('WKNumProces'), true,
			formData, false);

	log.info(pedido);
	
	var numProcesso = getValue('WKNumProces');
	var userId = getValue("WKUser");
	setComment( userId, numProcesso, 'Iniciado processo '+ pedido.get('iProcess') +' para geracao da bonificação. Por favor conclua o preenchimento.' );
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