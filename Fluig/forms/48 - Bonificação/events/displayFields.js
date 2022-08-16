function displayFields(form, customHTML) {

	form.setShowDisabledFields(true);
	form.setHidePrintLink(true);

	// setValue("WKMobile",false);
	// form.setMobile(false);

	var task = getValue('WKNumState');

	form.setValue('task', task);

	form.setValue('ped_representante', getValue('WKNumProces'));
	
	
	if (task == 0 || task == 1) {

		var dtNow = new java.util.Date();
		var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");

		if (form.getValue('data_emissao') == '') {
			form.setValue('data_emissao', sdf.format(dtNow));
		}

		if (form.getValue('data_coleta') == '') {
			form.setValue('data_coleta', sdf.format(dtNow));
		}

		var user = getValue("WKUser");

		var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId",
				user, user, ConstraintType.MUST);
		var constraints = new Array(c1);
		var colleagueMap = DatasetFactory.getDataset("colleague", null,
				constraints, null);
		form.setValue('userFluig', user);
		form.setValue('userFluigNome', colleagueMap
				.getValue(0, "colleagueName"));

		var c2 = DatasetFactory.createConstraint("matricula", user, user,
				ConstraintType.MUST);
		c2.setLikeSearch(true);
		var c3 = DatasetFactory.createConstraint("metadata#active", 1, 1,
				ConstraintType.MUST);
		var constraints = new Array(c2, c3);
		var repres = DatasetFactory.getDataset("representante_compl", null,
				constraints, null);
		form.setValue('tipoCadUser', repres.getValue(0, "tipo_cadastro"));

	} else {
		form.setValue('nrParcela',1);
	}
}