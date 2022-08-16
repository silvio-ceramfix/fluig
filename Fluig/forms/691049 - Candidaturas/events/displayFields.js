function displayFields(form, customHTML) {
	form.setShowDisabledFields(true);
	var numAtividade = getValue('WKNumState');

	

	form.setValue("numSolic", getValue('WKNumProces') );
	
	if (numAtividade != 0) {
		customHTML.append(
			"<script type='text/javascript'>" + +
				"$('#folderID').attr('readonly', true);" +
				"$('#folderName').attr('readonly', true);" +
				'</script>'
		);
	}
	
	var Params 	= {};
	Params.formMode 		  = String(form.getFormMode());
    Params.edit 			  = Params.formMode == 'ADD' || Params.formMode == 'MOD';
    Params.numState 		  = String(parseInt(getValue('WKNumState')));    
    Params.choosedColleagueId = String(getValue('WKUser'));
    Params.user 			  = String(getValue('WKUser'));
    Params.mobile 			  = String(form.getMobile());
    Params.companyId 		  = String(form.getCompanyId());
    Params.documentid 		  = String(form.getDocumentId());
    Params.version 			  = String(form.getVersion());
    log.info('atividade '+numAtividade);
    form.setValue("Params", JSON.stringify(Params));
	form.setValue("task", numAtividade  );
		
	var user = getValue('WKUser');
	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
	var constraints = new Array(c1);
	var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
	form.setValue('solicitante', colleagueMap.getValue(0,"colleagueName") );
	form.setValue('matricula', user );
}
