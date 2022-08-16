function displayFields(form,customHTML){ 
	
	
	form.setShowDisabledFields(true);	
	form.setHidePrintLink(true);
	
	//setValue("WKMobile",false);
	//form.setMobile(false);
	
	log.info('Folder proforma.............'+  getValue("folder_proforma") );
	
	var task = getValue('WKNumState');
	var processo = getValue('WKDef');
	
	
	form.setValue('modo', form.getFormMode() );
	form.setValue('task', task );
	form.setValue('processo', processo );
	
	form.setValue('ped_representante', getValue('WKNumProces') ); 
	
	form.setValue('ies_orcamento', 'N' );

	var user = getValue("WKUser");
	log.info('USER WKUSER'+user);
	var useraux = user;
	//user = user.toString();
	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
	var constraints = new Array(c1);
	var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);

	//useraux = "'"+useraux+"'";
	var c1 = DatasetFactory.createConstraint("matricula", user, user, ConstraintType.MUST);
	//c1.setLikeSearch(true);
	var c2 = DatasetFactory.createConstraint("metadata#active", 1, 1, ConstraintType.MUST);
	var constraints = new Array(c1,c2);
	log.info('ANTES DATASET REPRESENTANTE_COMPL' );
	var repres = DatasetFactory.getDataset("representante_compl", null, constraints, null);
	log.info('DEPOIS DATASET REPRESENTANTE_COMPL' );
	log.info('TAMANHO DO DATASET '+repres.rowsCount);
	if (repres != null && repres.rowsCount>0){
		form.setValue('tipoCadUserAtu', repres.getValue(0,"tipo_cadastro") );
		log.info('ENTROU tipoCadUserAtu' );
	}
	
	//recupera se é controler para alimentar o campo
	var c1 = DatasetFactory.createConstraint("workflowColleagueRolePK.colleagueId", user, user, ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("workflowColleagueRolePK.roleId", 'controller', 'controller', ConstraintType.MUST);
	var constraints = new Array(c1,c2); 
	var controller = DatasetFactory.getDataset("workflowColleagueRole", null, constraints, null);
	log.info('CONTROLLER '+ controller.rowsCount);
	if (controller != null && controller.rowsCount>0){
		form.setValue('tipoCadUserAtu', 'C' );
		log.info('ENTROU tipoCadUserAtu Controller');
	}
	
	if ( task == 0 || task == 1 ){

		var dtNow = new java.util.Date();
		var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
		if ( form.getValue( 'data_emissao') == '' ){
			form.setValue( 'data_emissao', sdf.format(dtNow) );
		}		
		if ( form.getValue( 'data_coleta') == '' ){
			form.setValue( 'data_coleta', sdf.format(dtNow) );
		}
		form.setValue('userFluig', user );
		form.setValue('userFluigNome', colleagueMap.getValue(0,"colleagueName") );
		if ( repres != null && repres.values.length > 0  ){
			form.setValue('tipoCadUser', repres.getValue(0,"tipo_cadastro") );
			log.info('TIPO CAD USER ' +repres.getValue(0,"tipo_cadastro"));
			form.setValue('login', repres.getValue(0,"login"));
			log.info('LOGIN' +repres.getValue(0,"login"));
		}else{
			form.setValue('tipoCadUser', '' );
		}
	}	
	
	if ( task == '76'){
		form.setEnabled('pct_desc_financ', true);
	}else{
		form.setEnabled('pct_desc_financ', false);
	}
	
}