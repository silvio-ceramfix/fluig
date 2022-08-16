function servicetask53(attempt, message) {
	var qtdVezes = getValueForm("qtdVezes", "") + "";
	
	for (var parcAtual = 1; parcAtual <= qtdVezes; parcAtual++) {
		try {
			var pedidos_gerados = hAPI.getCardValue( "num_pedidos_gerados" );
			var pedido_atual = 0;
			pedido_atual = (pedidos_gerados.substr(pedidos_gerados.indexOf(parcAtual+'-'),pedidos_gerados.indexOf(';')));
			var seq_pedidos = (pedido_atual.substr(pedido_atual.indexOf('-')+1,pedido_atual.length));
			//entrou na atividade de envio de e-mail dos pedidos gerados pela bonificação
			//######### RECUPERA INFORMAÃ¿Ã¿ES DO PEDIDO DO LOGIX
			var cod_empresa = hAPI.getCardValue( "empresa" );
			var num_pedido = seq_pedidos; 
			var cod_cliente = hAPI.getCardValue( "cod_cliente" );
			var cod_repres = hAPI.getCardValue( "cod_repres" );
			var consistencias = hAPI.getCardValue('consistencias');
			var numProcesso = getValue('WKNumProces');
			var userId = getValue("WKUser");
			log.info('PEDIDOSX '+cod_empresa+' '+num_pedido+' '+cod_cliente+' '+cod_repres+' '+consistencias+' '+numProcesso+' '+userId);
			var constraints = new Array();
			constraints.push( DatasetFactory.createConstraint( 'cod_empresa', cod_empresa, cod_empresa, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint( 'num_pedido', num_pedido, num_pedido, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint( 'usuario', userId, userId, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint( 'cod_cliente', cod_cliente, cod_cliente, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint( 'cod_repres', cod_repres, cod_repres, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint( 'numProcesso', numProcesso, numProcesso, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint( 'consistencias', consistencias, consistencias, ConstraintType.MUST) );
		
			var dataset = DatasetFactory.getDataset( 'pedido_send_mail', null, constraints, null);
		
			if (dataset != null) {
				if (dataset.getValue(0, "result") == 'NOK') {
					throw 'Erro ao processar envio de e-mail: ' + dataset.getValue(0, "erro");
				}
			}
			//fim da atividade de envio de e-mail dos pedidos gerados pela bonificação
		} catch (err) {
			log.info('ERROOOOO ' + err.toString());
			setComment(userId, numProcesso, err.toString());
			throw err.toString();
		}
	}
}

function setComment(user, processo, comentario) {
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint('processo', processo,
			processo, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('user', user, user,
			ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('comentario',
			comentario, comentario, ConstraintType.MUST));
	var dataset = DatasetFactory.getDataset('setComent', null, constraints,
			null);
	if (dataset != null) {
		return dataset.getValue(0, 'retorno');
	}
}

function getValueForm(campo, padrao) {
	log.info("Campo........" + campo);
	var valor = hAPI.getCardValue(campo);
	if (padrao == "tipoPessoa")
		if (valor.indexOf("/0000-") == -1)
			valor = "F";
		else
			valor = "J";

	log.info("Valor........" + valor);

	if (valor == "" || valor == "") {
		valor = padrao;
		log.info("Valor padrão........" + valor);
	}
	return valor;
}