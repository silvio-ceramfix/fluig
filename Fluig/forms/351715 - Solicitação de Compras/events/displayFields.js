function displayFields(form,customHTML){ 
	
	form.setShowDisabledFields(true);	
	form.setHidePrintLink(true);
	
	var task = getValue('WKNumState');
	
	form.setValue('task', task );
	form.setValue('user_atual', getValue("WKUser") );
	form.setValue('num_solic', getValue("WKNumProces") );

	var user = getValue("WKUser");	
	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
	var constraints = new Array(c1);
	var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
	
	if ( task == 0 || task == 1 ){

		if ( form.getValue( 'data_abertura' ) == '' ){
			
			var dtNow = new java.util.Date();
			var amanha = new java.util.Date().getTime() + 86400000;
			var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
			form.setValue( 'data_abertura', sdf.format(dtNow) );
			form.setValue( 'data_entrega', sdf.format(amanha)  );
		}
		
		form.setValue('matricula_solicitante', user );
		
		//form.setValue('nom_solicitante', colleagueMap.getValue(0,"colleagueName"));
		//form.setValue('mail_solic', colleagueMap.getValue(0,"mail"));
	}
	

	
	form.setValue('mail_atual', colleagueMap.getValue(0,"mail") );
	

}


//Habilita ou Desabilita todos os campos do formulario
function setEnabled(form, lEnable) {
	var hpForm = new java.util.HashMap();
	hpForm = form.getCardData();
	var it = hpForm.keySet().iterator();
	while (it.hasNext()) {	
		var key = it.next();
		form.setEnabled(key, lEnable);
	}
}