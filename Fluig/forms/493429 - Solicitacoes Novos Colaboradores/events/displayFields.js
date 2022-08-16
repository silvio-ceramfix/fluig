function displayFields(form,customHTML){ 
	
	form.setShowDisabledFields(true);
	form.setHidePrintLink(true);
	
	var task = getValue('WKNumState');
	
	form.setValue('task', task );
	form.setValue('user_atual', getValue("WKUser") );
	
	var user = getValue("WKUser");	
	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
	var constraints = new Array(c1);
	var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
	
	taskatual = form.getValue('task' );
	if ( taskatual == 0 || taskatual == 1 || taskatual == null){

		if ( form.getValue( 'data_abertura' ) == '' ){
			
			var dtNow = new java.util.Date();
			var amanha = new java.util.Date().getTime() + 86400000;
			var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
			form.setValue( 'data_abertura', sdf.format(dtNow) );
		}
		
		form.setValue('mat_solicitante', user );
		form.setValue('solicitante', colleagueMap.getValue(0,"colleagueName") );
		//form.setValue('nom_solicitante', colleagueMap.getValue(0,"colleagueName"));
		//form.setValue('mail_solic', colleagueMap.getValue(0,"mail"));
	}
	

	
	
}