function servicetask79(attempt, message) {
	//recuperar o valor minimo do pedido por tipo de cliente
	var valor_minimo_tipo_cliente = 0 ;
	hAPI.setCardValue("ies_aprova_min_tip_cliente","N");
	
	var constraintsPai =  new Array();
	constraintsPai.push( DatasetFactory.createConstraint("ies_matriz", "on", "on", ConstraintType.MUST)) ;
	//alert('DatasetFactory empresa_compl ');
	var datasetPai = DatasetFactory.getDataset('empresa_compl', null, constraintsPai, null);
	
	//alert('antes if null empresa_compl ');
	if ( datasetPai != null /*&& datasetPai.values.length > 0*/  ){
		
		log.info('DatasetPAI TIPO VENDA '+datasetPai.values[0]);
		log.info('DatasetPAI TIPO VENDA '+datasetPai.values[1]);
		var pai = datasetPai.values[0];
		var documentid = datasetPai.getValue(0, "DOCUMENTID");
		var version = datasetPai.getValue(0, "VERSION");
		log.info('TIPO DE CLIENTE DO VALOR '+getValueForm("cod_tip_cli",""));
		var constraintsFilhos = new Array();
		//alert(' constraintsFilhos 0;..... ');
		constraintsFilhos.push( DatasetFactory.createConstraint("tablename", "tipo_cliente_valor", "tipo_cliente_valor", ConstraintType.MUST) );
		//alert(' constraintsFilhos 1;..... ');
		constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", documentid, documentid, ConstraintType.MUST) );
		//alert(' constraintsFilhos 2;..... ');
		constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", version, version, ConstraintType.MUST) );
		//alert(' constraintsFilhos 3;..... ');
		constraintsFilhos.push( DatasetFactory.createConstraint("cod_tip_cli_valor", getValueForm("cod_tip_cli",""), getValueForm("cod_tip_cli",""), ConstraintType.MUST) );
		//alert(' constraintsFilhos 4;..... ');
		//alert('antes DatasetFactory');
		
		var datasetFilhos = DatasetFactory.getDataset('empresa_compl', null, constraintsFilhos, null);
		
		log.info('antes do IF');
		if( datasetFilhos != null && datasetFilhos.values.length > 0 ){
			log.info('depois do IF');
			var filho = datasetFilhos.values[0];
			log.info('depois do filho');
			if ( datasetFilhos.getValue(0, "VALOR_TIP_CLI_ORC") != null && datasetFilhos.getValue(0, "VALOR_TIP_CLI_ORC") != "" ){
				log.info('seta valor.');
				valor_minimo_tipo_cliente = datasetFilhos.getValue(0, "VALOR_TIP_CLI_ORC");
				log.info('VALOR MINIMO TIPO DE CLIENTE '+valor_minimo_tipo_cliente);
			} else {
				log.info('entrou no perc adic tipo de venda 0');
				valor_minimo_tipo_cliente = 0;
			}
		}
	}
	
	hAPI.setCardValue("valor_min_tip_cliente",valor_minimo_tipo_cliente);
	var valor_pedido = getValueFormFloat("valor_total_geral","0");
	var valor_minimo_float = getValueFormFloat("valor_min_tip_cliente","0");
	
	if (valor_pedido < valor_minimo_float) {
		hAPI.setCardValue("ies_aprova_min_tip_cliente","S");
	} else {
		hAPI.setCardValue("ies_aprova_min_tip_cliente","N");
	}

	//fim valor minimo do pedido por tipo de cliente
}