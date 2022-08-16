function validateForm(form){
	
	log.info(  'VALIDADE.....'+getValue("WKNumProces")+' '+getValue("WKCompletTask")+' '+getValue("WKNextState")+' '+form.getValue("situacao_cadastro")  );

	var numProcess = getValue("WKNumProces");
	
	log.info( 'CARD_DATA...............'+numProcess );
	
	var dtNow = new java.util.Date();
	var sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
	var dataTxt = ""+sdf.format(dtNow).substring(0,10);
	
	log.info( "Data........"+getValue( "nom_guerra", "" ) );
	form.setValue('nom_guerra', numProcess);
	//form.setValue( 'cod_repres', '999999');
		
	if ( getValue("WKNextState") == 5 && getValue("WKCompletTask") && form.getValue("situacao_cadastro") == 'A' ){		
		
	}
	

}

function getValueForm( campo, padrao ){
	log.info( "Campo........"+campo );
	var valor = form.getValue( campo );
	var retorno ="";
	if( padrao == "tipoPessoa" ){ 
		log.info("INDEXOF....."+valor.indexOf("/0000-"));
		if ( valor.indexOf("/0000-") == -1 ){
			retorno = "F";
			log.info("RetornoF......"+retorno);
		}else{
			retorno = "J";
			log.info("RetornoJ......"+retorno);
		}
	log.info( "Valor........"+valor );
	log.info("Retorno......"+retorno);
	}
	if ( valor == "" || valor == "" ){
		retorno = padrao;
		log.info( "Valor padrao........"+valor );
		log.info("Retorno......"+retorno);
	}
	log.info("Retorno......"+retorno);
	return retorno;
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