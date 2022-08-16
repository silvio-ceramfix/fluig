function displayFields(form,customHTML){
	
	var task = getValue('WKNumState');
	form.setValue('task', task  );
	form.setValue('processo', getValue('WKNumProces')  );
	form.setValue('WKUser', getValue('WKUser')  );
	
	var manager = 'S';
	if( getValue('WKManagerMode') ){
		manager = 'S';
	}
	form.setValue('manager', manager  );
  
	var user = getValue("WKUser");	
	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
	var constraints = new Array(c1);
	var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
	
	form.setValue('user_fluig', user );
	form.setValue('nome_user_fluig', colleagueMap.getValue(0, "colleagueName" ) );
	
	if( ( task == 0 || task == 4 ) 
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
			form.setValue("regional_departamento", func.getValue(0, "qb_descric") );
			form.setValue("cod_regional_departamento", func.getValue(0, "ra_depto") );
			form.setValue("origem", "I" );
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
					form.setValue("regional_departamento", repL.getValue(0, "den_regional") );
					form.setValue("cod_regional_departamento", repL.getValue(0, "cod_regional") );
					form.setValue("origem", "R" );
				}
			}
		}


	}	
	if( ( task == 0 || task == 4 ) 
			&& form.getValue('data_solicitacao') == "" ){
		
		var dtNow = new java.util.Date();
		var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
		form.setValue( 'data_solicitacao', sdf.format(dtNow) );
	}
	
	if( ( task == 36 ) 
			&& form.getValue('data_abertura') == "" ){
		
		var dtNow = new java.util.Date();
		var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
		form.setValue( 'data_abertura', sdf.format(dtNow) );
		 
		form.setValue( 'nome_projeto', form.getValue( 'sugestao_nome_marketing' ) );
		form.setValue( 'cod_projeto', getValue('WKNumProces') );
		
	}
	
	if( ( task == 41 ) 
			&& form.getValue('data_fechamento') == "" ){
		
		var dtNow = new java.util.Date();
		var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
		form.setValue( 'data_fechamento', sdf.format(dtNow) );
	}
	
	if( ( task == 41 ) 
			&& form.getValue('data_fechamento') == "" ){
		
		var dtNow = new java.util.Date();
		var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
		form.setValue( 'data_fechamento', sdf.format(dtNow) );
	}
	
	if( ( task == 53 ) 
			&& form.getValue('nome_projeto_eng') == "" ){
		
		form.setValue( 'nome_projeto_eng', form.getValue( 'nome_projeto' ) );
		form.setValue( 'cod_projeto_eng', getValue('WKNumProces') );
	}
	
	var constraints = new Array();		
	constraints.push( DatasetFactory.createConstraint("ies_matriz", 'on', 'on', ConstraintType.MUST) );
	var paramEmpresa = DatasetFactory.getDataset("empresa_compl", null, constraints, null);
	var folder = 1420;
	if ( paramEmpresa != null && paramEmpresa.rowsCount > 0 ) {
		log.info( "ACHEI FOLDER..........: " +paramEmpresa.getValue(0, "num_pasta_produto") );
		folder = parseInt( paramEmpresa.getValue(0, "num_pasta_produto") );
	}
	form.setValue( 'num_pasta_produto', folder );
	
	form.setShowDisabledFields(true);
	if( form.getValue('task') == 10 || form.getValue('task') == 189 ){
		form.setHidePrintLink(false);
	}else{
		form.setHidePrintLink(true);
	}
	
	
	
}