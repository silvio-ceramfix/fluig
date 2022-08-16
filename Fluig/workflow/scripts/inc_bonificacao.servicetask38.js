function servicetask38(attempt, message) {

	var camposItem = hAPI.getCardData(getValue("WKNumProces"));
	var contadorItem = camposItem.keySet().iterator();

	log.info('beforeTaskSave -- Antes While. ' + camposItem);

	var cont = 0;
	while (contadorItem.hasNext()) {

		cont += 1;

		var idItem = contadorItem.next();
		var campo = idItem.split('___')[0];
		var seqItem = idItem.split('___')[1];

		if (seqItem != undefined && campo == "COD_ITEM") {

			var cod_empresa = hAPI.getCardValue("empresa") + "";
			var cod_local = hAPI.getCardValue("cod_local___" + seqItem) + "";
			var nat_operacao = hAPI.getCardValue("nat_operacao") + "";

			log.info('jero1...' + hAPI.getCardValue("optionsRadios"));

			log.info('COD EMPRESA.. ' + cod_empresa);
			log.info('COD LOCAL.... ' + cod_local);
			log.info('NAT OPERACAO. ' + nat_operacao);

			var cons = new Array();
			log.info('beforeTaskSave -- Antes Pai Filho....');
			cons.push(DatasetFactory.createConstraint('dataSet',
					'empresa_compl', 'empresa_compl', ConstraintType.MUST));
			cons.push(DatasetFactory.createConstraint('table',
					'locais_estoque_mkt', 'locais_estoque_mkt',
					ConstraintType.MUST));
			cons.push(DatasetFactory.createConstraint('pai_cod_empresa',
					cod_empresa, cod_empresa, ConstraintType.MUST));
			cons.push(DatasetFactory.createConstraint('filho_cod_local',
					cod_local, cod_local, ConstraintType.MUST));
			cons.push(DatasetFactory.createConstraint('filho_cod_nat_oper_loc',
					nat_operacao, nat_operacao, ConstraintType.MUST));
			log.info('beforeTaskSave -- cons...' + cons);

			var dataset = DatasetFactory.getDataset('paiFilho', null, cons,
					null);

			if (dataset != null) {
				log.info('beforeTaskSave -- tamanho do dataset...'
						+ dataset.values.length);
				if (dataset.values.length > 0) {
					for (var x = 0; x < dataset.values.length; x++) {
						log.info('for data set..... ' + x);

						var existe = dataset.getValue(x,
								'ies_local_nat_oper_aprov');
						log.info('beforeTaskSave -- existe...' + existe);
						if (existe == 'on') {
							var testea1 = hAPI.getCardValue("aprova_regional")
									+ "";
							log.info('testea1' + testea1);

							hAPI.setCardValue("aprova_regional", 'S');

							var testea2 = hAPI.getCardValue("aprova_regional")
									+ "";
							log.info('testea2' + testea2);
							break;
						}

					}
				} else {
					var cons1 = new Array();
					log.info('beforeTaskSave -- Antes Pai Filho....2');
					cons1.push(DatasetFactory.createConstraint('dataSet',
							'empresa_compl', 'empresa_compl',
							ConstraintType.MUST));
					cons1.push(DatasetFactory.createConstraint('table',
							'locais_estoque_mkt', 'locais_estoque_mkt',
							ConstraintType.MUST));
					cons1.push(DatasetFactory.createConstraint(
							'pai_cod_empresa', cod_empresa, cod_empresa,
							ConstraintType.MUST));
					cons1.push(DatasetFactory.createConstraint(
							'filho_cod_local', cod_local, cod_local,
							ConstraintType.MUST));
					log.info(cons1);

					var dataset1 = DatasetFactory.getDataset('paiFilho', null,
							cons1, null);

					if (dataset1 != null) {
						for (var x = 0; x < dataset1.values.length; x++) {
							log
									.info('beforeTaskSave -- for data set..... '
											+ x);

							var existe1 = dataset1.getValue(x,
									'ies_local_nat_oper_aprov');
							log.info('beforeTaskSave -- existe1...' + existe1);

							if (existe1 == 'on') {
								var testeb1 = hAPI
										.getCardValue("aprova_regional")
										+ "";
								log.info('beforeTaskSave -- testeb1' + testeb1);

								hAPI.setCardValue("aprova_regional", 'S');

								var testeb2 = hAPI
										.getCardValue("aprova_regional")
										+ "";
								log.info('beforeTaskSave -- testeb2' + testeb2);
								break;
							}
						}
					}
				}
			}
			log.info('beforeTaskSave -- Antes de sair com break...'
					+ hAPI.getCardValue("aprova_regional"));
			if (hAPI.getCardValue("aprova_regional") == 'S') {
				log.info('beforeTaskSave -- saiu com break...'
						+ hAPI.getCardValue("aprova_regional"));
				break;
			}
		}
	}

	log.info('Ultimo teste saida atividade...' + getValue("WKNumProces")
			+ " - " + hAPI.getCardValue("aprova_regional"));
}