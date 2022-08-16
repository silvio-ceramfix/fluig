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

function isNull( valor, padrao ){
	if ( isNaN( valor ) ){
		return padrao;
	}else{
		return valor;
	}
}

function kbtReplaceAll( valor, needle, replacement) {
	log.info( 'Valor kbtReplaceAll 1.........'+ valor+' '+needle+' '+replacement );
	log.info( 'Valor kbtReplaceAll 2.........'+ valor.split(needle).length );
	log.info( 'Valor kbtReplaceAll 3.........'+ valor.split(needle).join(replacement) );
    return valor.split(needle).join(replacement);
};


/*function getValueFormFloat( campo, padrao ){
	log.info('getValueFormFloat.........'+campo+' '+padrao);
	var vnPadrao = padrao+"";
	var vnValor = getValueForm(campo, vnPadrao)+"";
	log.info('getValueFormFloat vnValor.........'+vnValor+' '+vnPadrao);
	var valor = parseFloat( vnValor.replaceAll(".", "").replaceAll(",",".") );
	return isNull( valor, parseFloat( vnPadrao.replaceAll(".","").replaceAll(",",".") ) );
}*/


function getValueFormFloat( campo, padrao ){
	log.info('getValueFormFloat.........'+campo+' '+padrao);
	var vnPadrao = padrao+"";
	var vnValor = getValueForm(campo, vnPadrao)+"";
	log.info('getValueFormFloat vnValor.........'+vnValor+' '+vnPadrao);
	var valor = parseFloat( kbtReplaceAll( kbtReplaceAll( vnValor, ".", ""), ",",".") );
	return isNull( valor, parseFloat( kbtReplaceAll( kbtReplaceAll( vnPadrao, ".", "" ), "," ,".") ) );
}


function loadRepres( cod_repres ){
	
	var numProcesso = getValue('WKNumProces');
	var userId = getValue("WKUser");

	try{

		log.info("## Repres ## "+cod_repres );
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint("cod_repres", cod_repres, cod_repres, ConstraintType.MUST) );
		var dsRep = DatasetFactory.getDataset("representante", null, constraints, null);
		var codRegional = "";
		if ( dsRep != null  ){
			codRegional = dsRep.getValue(0, "cv_4");
			log.info('codRegional......'+codRegional);
		}
		
		log.info("## Regional ## "+codRegional );
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint("tablename", "regional", "regional", ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint("cod_regional", codRegional, codRegional, ConstraintType.MUST) );
		var dsRepCpl = DatasetFactory.getDataset("representante_compl", null, constraints, null);
		
		if ( dsRepCpl != null && dsRepCpl.rowsCount>0){
			log.info("## parametros ## "+ dsRepCpl.getValue(0, "perc_mix_ger_reg") );
			hAPI.setCardValue("perc_mix_ger_reg", dsRepCpl.getValue(0, "perc_mix_ger_reg") );
			hAPI.setCardValue("perc_mix_ger_nac", dsRepCpl.getValue(0, "perc_mix_ger_nac") );
			hAPI.setCardValue("perc_desc_ger_reg", dsRepCpl.getValue(0, "perc_desc_ger_reg") );
			hAPI.setCardValue("perc_desc_ger_nac", dsRepCpl.getValue(0, "perc_desc_ger_nac") );
		
			hAPI.setCardValue("perc_lob_ger_nac", dsRepCpl.getValue(0, "lob_ger_nac") );
			hAPI.setCardValue("perc_lob_ctr", dsRepCpl.getValue(0, "lob_controller") );			
		}
		
	} catch (e){
		hAPI.setTaskComments(userId, numProcesso, 0, "Atencao: Verifique o cadastro do representante no Logix, possivelmente esta bloqueado ou nao existente!");
		throw "Atencao: Verifique o cadastro do representante no Logix, possivelmente esta bloqueado ou nao existente!";
	}
	return true;
}