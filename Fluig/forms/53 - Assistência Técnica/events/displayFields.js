function displayFields(form, customHTML) {

	// form.setShowDisabledFields(true);

	form.setHidePrintLink(true);

	// setValue("WKMobile",false);
	// form.setMobile(false);

	var task = getValue('WKNumState');
	var processo = getValue('WKDef');

	form.setValue('modo', form.getFormMode());
	form.setValue('task', task);
	form.setValue('processo', processo);

	// fixa a tarefa para testes
	//task = 0;
	if (task == 4 || task == 0 || task == 1 || task == 24 || task == 30 || task == 38 || task == 14 || task == 5 || task == 12 || task == 14) {

		var dtNow = new java.util.Date();
		var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");

		if (form.getValue('data_inclusao') == '') {
			form.setValue('data_inclusao', sdf.format(dtNow));
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

		var c1 = DatasetFactory.createConstraint("matricula", user, user,
				ConstraintType.MUST);
		c1.setLikeSearch(true);
		var constraints = new Array(c1);
		var repres = DatasetFactory.getDataset("representante_compl", null,
				constraints, null);
		form.setValue('tipoCadUser', repres.getValue(0, "tipo_cadastro"));

	} else {
		// desabilita os campos para edição caso não esteja na primeira etapa
		log.info('NAO ESTOU NA 4');
		var habilitar = false; // Informe True para Habilitar ou False para
		// Desabilitar os campos
		var mapaForm = new java.util.HashMap();
		mapaForm = form.getCardData();
		var it = mapaForm.keySet().iterator();

		while (it.hasNext()) { // Laço de repetição para habilitar/desabilitar
			// os campos
			var key = it.next();
			form.setEnabled(key, habilitar);
		}
	}
	console.log('task......... '+task);
	if (task == 24 || task == 30 || task == 38) {
		form.setVisibleById("div_forma_pagamento", true);
		form.setVisibleById("div_valor_boni", true);
	} else {
		form.setVisibleById("div_forma_pagamento", false);
		form.setVisibleById("div_valor_boni", false);
	}
	
	if (task == 19) {
		form.setVisibleById("div_resolucao", true);
	} else {
		form.setVisibleById("div_resolucao", false);
	}

}