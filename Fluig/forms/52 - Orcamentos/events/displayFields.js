function displayFields(form,customHTML){ 
	
	
	form.setShowDisabledFields(true);	
	form.setHidePrintLink(true);
	
	var task = getValue('WKNumState');
	var processo = getValue('WKDef');
	
	
	form.setValue('modo', form.getFormMode() );
	form.setValue('task', task );
	form.setValue('processo', processo );
	
	form.setValue('ped_representante', getValue('WKNumProces') ); 
	
	form.setValue('ies_orcamento', 'S' );
	
	if ( task == 0 || task == 1 ){

		var dtNow = new java.util.Date();
		var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");

		if ( form.getValue( 'data_emissao') == '' ){
			form.setValue( 'data_emissao', sdf.format(dtNow) );
		}

		if ( form.getValue( 'data_prevista') == '' ){
			form.setValue( 'data_prevista', sdf.format(dtNow) );
		}

		if ( form.getValue( 'data_validade') == '' ){
			form.setValue( 'data_validade', sdf.format(dtNow) );
		}		
		
		if ( form.getValue( 'data_coleta') == '' ){
			form.setValue( 'data_coleta', sdf.format(dtNow) );
		}
		
		var user = getValue("WKUser");	
		var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
		var constraints = new Array(c1);
		var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
		form.setValue('userFluig', user );
		form.setValue('userFluigNome', colleagueMap.getValue(0,"colleagueName") );
		
		var c1 = DatasetFactory.createConstraint("matricula", user, user, ConstraintType.MUST);
		//c1.setLikeSearch(true);
		var c2 = DatasetFactory.createConstraint("metadata#active", 1, 1, ConstraintType.MUST);
		
		var constraints = new Array(c1,c2);
		var repres = DatasetFactory.getDataset("representante_compl", null, constraints, null);
		form.setValue('tipoCadUser', repres.getValue(0,"tipo_cadastro") );
		
		var ct = new Array();
		ct.push( DatasetFactory.createConstraint("tablename", "regional", "regional", ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("documentid", repres.getValue(0, "metadata#id"), 
																		repres.getValue(0, "metadata#id"), ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("version", repres.getValue(0, "metadata#version"),
																	 repres.getValue(0, "metadata#version"), ConstraintType.MUST) );
	   
	    var ds = DatasetFactory.getDataset("representante_compl", null, ct, null);
	    
	    if( ds.rowsCount > 0 ){
	    	form.setValue( 'reginal_user', ds.getValue(0, 'cod_regional') );
	    }
	    
	    
		
	}

	
}