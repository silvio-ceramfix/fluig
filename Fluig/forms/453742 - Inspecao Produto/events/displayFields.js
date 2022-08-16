function displayFields(form,customHTML){ 
	
	var task = getValue('WKNumState');	
	form.setValue('task', task  );
	form.setValue('user_atual', getValue('WKUser')  );
	
	if ( form.getValue( "data_insp") == "" ) {	
		var dtNow = new java.util.Date();
		var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
		form.setValue( "data_insp", sdf.format(dtNow) );
		var sdf = new java.text.SimpleDateFormat("HH:mm");
		form.setValue( "hora_insp", sdf.format(dtNow) );

	}
	
	
	if( form.getValue( "situacao") == "" ){
		form.setValue('situacao', "Iniciado" );
	}
	
}