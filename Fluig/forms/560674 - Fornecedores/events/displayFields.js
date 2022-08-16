function displayFields(form,customHTML){ 
	
	form.setShowDisabledFields(true);	
	form.setHidePrintLink(true);	
		
	form.setValue("pais_md", form.getValue("pais") );
	form.setValue("estado_md", form.getValue("estado") );
	form.setValue("estado_cob_md", form.getValue("estado_cob") );
	form.setValue("cod_cidade_md", form.getValue("cod_cidade") );
	form.setValue("cod_cidade_cob_md", form.getValue("cod_cidade_cob") );
	form.setValue("bairro_sel_md", form.getValue("bairro_sel") );
	form.setValue("bairro_cob_sel_md", form.getValue("bairro_cob_sel") );
	form.setValue("tipo_cliente_md", form.getValue("tipo_cliente") );
	
	form.setValue("task", getValue('WKNumState') );
	
	
	if ( getValue('WKNumState') == 1 || getValue('WKNumState') == 0 ){
		
		var userFluig = getValue("WKUser");	
		var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", userFluig, userFluig, ConstraintType.MUST);
		var constraints = new Array(c1);
		var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);

		
		form.setValue("userFluig", userFluig );
		form.setValue("userFluigNome", colleagueMap.getValue(0,"colleagueName") );
		
	}
	
	
	
	if ( form.getValue( 'cod_repres') == '' || form.getValue( 'cod_repres') == null || form.getValue( 'cod_repres') == undefined ){
		
		log.info(" ##### antes busca repres ##### ");
		 var constraintsPai = new Array(); 
		 var user_fluig_aux = "'"+form.getValue( "userFluig" )+"'";
		 constraintsPai.push( DatasetFactory.createConstraint("matricula", user_fluig_aux, user_fluig_aux, ConstraintType.MUST) );
		 constraintsPai.push( DatasetFactory.createConstraint("tipo_cadastro", 'R', 'R', ConstraintType.MUST) );
	     var datasetPai = DatasetFactory.getDataset("representante_compl", null, constraintsPai, null);
	     log.info(" ##### dts Pai busca repres ##### ");
///		 var codRepres = "";
		 if ( datasetPai != null ){
		     for(var x = 0; x < datasetPai.rowsCount; x++) {
		    	 log.info(" ##### entrei Pai busca repres ##### " + form.getValue( "tipo_cliente" ));
		     	 var constraintsFilhos = new Array();
		     	 log.info('Cliente  busca repres.'+ datasetPai.getValue(x, "documentid") );
		    	 constraintsFilhos.push( DatasetFactory.createConstraint("tablename", "tipo_cliente", "tipo_cliente", ConstraintType.MUST) );
		    	 constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", datasetPai.getValue(x, "documentid"), datasetPai.getValue(x, "documentid"), ConstraintType.MUST) );
		    	 constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", datasetPai.getValue(x, "version"), datasetPai.getValue(x, "version"), ConstraintType.MUST) );
		    	 constraintsFilhos.push( DatasetFactory.createConstraint("cod_tip_cli", form.getValue( "tipo_cliente" ), form.getValue( "tipo_cliente" ), ConstraintType.MUST) );
		    	 
		    	 log.info(" ##### cons Pai criada  busca repres ##### " + form.getValue( "tipo_cliente" ));
		    	 var datasetFilhos = DatasetFactory.getDataset("representante_compl", null, constraintsFilhos, null);
		    	 
		    	 if ( datasetFilhos != null ){
		    		 log.info(" ##### filho não é nulo  busca repres ##### " + form.getValue( "tipo_cliente" ));
		    		 for(var y = 0; y < datasetFilhos.rowsCount; y++) {
		    			 log.info(" ##### entrei filho  busca repres ##### " + datasetPai.getValue(x, "cod_repres") );
		    			 form.setValue( 'cod_repres', datasetPai.getValue(x, "cod_repres") );
		    			 form.setValue( 'nom_representante', datasetPai.getValue(x, "raz_social") );
		    		 }
		    	 }
		     }
		 }	
	}
	
		
}