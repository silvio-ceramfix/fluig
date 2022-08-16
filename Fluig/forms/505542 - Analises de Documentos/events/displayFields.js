function displayFields(form, customHTML) {
	form.setShowDisabledFields(true);
	var numAtividade = getValue('WKNumState');

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
	
	var dtNow = new java.util.Date();
	var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
	if ( form.getValue( 'data_parecer') == '' ){
		form.setValue( 'data_parecer', sdf.format(dtNow) );
	}	
	  
	
}
