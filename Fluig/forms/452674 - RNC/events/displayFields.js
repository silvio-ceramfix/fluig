function displayFields(form,customHTML){
	
	log.info('entrou displayFields......');
	
	form.setShowDisabledFields(true);
	//form.setHidePrintLink(true);
	var task = getValue('WKNumState');
	
	form.setValue('task', task  );
	form.setValue('numero_processo', getValue('WKNumProces')  );
	form.setValue('num_rnc', getValue('WKNumProces')  );
	form.setValue('user_atual', getValue('WKUser')  );
  	
	log.info('displayFields user......'+getValue('WKUser'));

	var user = getValue("WKUser");	
	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
	var constraints = new Array(c1);
	var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
	
	log.info('displayFields antes if......'+getValue('WKUser'));
	
	
	var user = getValue("WKUser");	
	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
	var constraints = new Array(c1);
	var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
	
	if( ( task == 0 || task == 36 ) 
		&& form.getValue('nome_solicitante') == "" ){
		
		var c1 = [ DatasetFactory.createConstraint('dataBase', 'java:/jdbc/LogixPRD', null, ConstraintType.MUST),
		          DatasetFactory.createConstraint('table', 'fluig_v_funcionario', null, ConstraintType.MUST),
		          DatasetFactory.createConstraint('ra_filial', user.split('-')[0], user.split('-')[0], ConstraintType.MUST),
		          DatasetFactory.createConstraint('ra_mat', user.split('-')[1], user.split('-')[1], ConstraintType.MUST),
		         ];
		var func = DatasetFactory.getDataset('selectTable', null , c1, null);
		//form.setValue("emaillogado",  datasetColleague.getValue(0, "mail") );
		if( func != null && func != undefined && func.rowsCount > 0  ){
			form.setValue("nome_solicitante", func.getValue(0, "ra_nome")  );		
			form.setValue("cod_solicitante", func.getValue(0, "ra_mat") );
			form.setValue("cod_emp_solicitante", func.getValue(0, "ra_filial") );
			form.setValue("origem_solic", "I" );
		}else{
			var c2 = [   DatasetFactory.createConstraint('matricula', user, user, ConstraintType.MUST),
			         ];
			var repF = DatasetFactory.getDataset('representante_compl', null , c2, null);
			//form.setValue("emaillogado",  datasetColleague.getValue(0, "mail") );
			if( repF.rowsCount > 0  ){
				form.setValue("cod_solicitante", repF.getValue(0, "cod_repres") );
				var c3 = [ DatasetFactory.createConstraint('dataBase', 'java:/jdbc/LogixPRD', null, ConstraintType.MUST),
				          DatasetFactory.createConstraint('table', 'fluig_v_representente', null, ConstraintType.MUST),
				          DatasetFactory.createConstraint('cod_repres', repF.getValue(0, "cod_repres"), repF.getValue(0, "cod_repres"), ConstraintType.MUST),
				         ];
				var repL = DatasetFactory.getDataset('selectTable', null , c3, null);
				//form.setValue("emaillogado",  datasetColleague.getValue(0, "mail") );
				if( repL.rowsCount > 0  ){
					form.setValue("nome_solicitante", repL.getValue(0, "raz_social")  );		
					form.setValue("cod_solicitante", repL.getValue(0, "cod_repres") );
					form.setValue("cod_emp_solicitante", 'RE' );
					form.setValue("origem_solic", "C" );
				}
			}
		}
		if( form.getValue('nome_solicitante') == "" ){
			form.setValue("nome_solicitante", colleagueMap.getValue(0,"colleagueName") );		
			form.setValue("cod_solicitante", user );
			form.setValue("cod_emp_solicitante", 'FL' );
			form.setValue("origem_solic", "I" );
		}
	}
	
	if( ( task == 0 || task == 36 ) && form.getValue('cod_usuario_abert') == "" ){
		form.setValue('cod_usuario_abert', getValue('WKUser')  );
		form.setValue('nom_usuario_abert', colleagueMap.getValue(0,"colleagueName")  );
	}
	
	if( ( task == 0 || task == 36 ) && form.getValue('usuario_repon') == "" ){
		form.setValue('cod_usuario_repon', getValue('WKUser')  );
		form.setValue('usuario_repon', colleagueMap.getValue(0,"colleagueName"));
		
		var dtNow = new java.util.Date();
		var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
		form.setValue( 'data_abert', sdf.format(dtNow) );
	}
		
	
	if( task == 20 ){
		form.setValue('cod_usuario_verificacao', getValue('WKUser')  );
		form.setValue('usuario_verificacao', colleagueMap.getValue(0,"colleagueName"));
		var dtNow = new java.util.Date();
		var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
		form.setValue( 'data_verificacao', sdf.format(dtNow) );
	}
		
	
	 

	log.info('displayFields depois if......'+getValue('WKUser'));
	
}