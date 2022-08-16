function util(){
	
}

function getValueForm(campo, padrao) {
	log.info("Campo........" + campo);
	var valor = hAPI.getCardValue(campo);
	if (padrao == "tipoPessoa")
		if (valor.indexOf("/0000-") == -1)
			valor = "J";
		else
			valor = "F";
	log.info("Valor........" + valor);
	if (valor == "" || valor == "") {
		valor = padrao;
		log.info("Valor padrÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ£o........" + valor);
	}
	return valor;
}

function setComment(user, processo, comentario) {
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint('processo', processo, processo, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('user', user, user, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('comentario', comentario, comentario, ConstraintType.MUST));
	var dataset = DatasetFactory.getDataset('setComent', null, constraints,	null);
	if (dataset != null) {
		return dataset.getValue(0, 'retorno');
	}
}