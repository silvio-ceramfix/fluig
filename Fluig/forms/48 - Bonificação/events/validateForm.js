function validateForm(form) {

	var msg = '';

	log.info('entrou no validate');

	var optionsRadios = form.getValue("optionsRadios");

	var task = getValue('WKNumState');
	log.info('TASK ' + task);
	log.info('RADIO ' + optionsRadios);
	if (task == 9 && optionsRadios == "option1") {
		var aen = form.getValue("aen");
		log.info('ENTROU NO IF1');
		if (aen == '' || aen == null || aen == undefined) {
			throw 'Campo AEN deve ser informado: ' + msg;
			log.info('ENTROU NO IF2');
		}
	}

	if (optionsRadios == '1') {
		log.info('tamanho: ' + form.getChildrenIndexes("itemParcela").length);
		if (form.getChildrenIndexes("itemParcela").length == 0) {
			msg += ' \n\r         Itens do pedido';
		} else {
			var indexes = form.getChildrenIndexes("itemParcela");
			for (var i = 0; i < indexes.length; i++) {
				var linha = '';
				log.info('Cod item....' + indexes[i] + ' '
						+ form.getValue("cod_item___" + indexes[i]));
				log.info('Des item....'
						+ form.getValue("desc_item___" + indexes[i]));
				log.info('Val Unit....'
						+ form.getValue("valUnitario___" + indexes[i]));
				log.info('Descoto ....'
						+ form.getValue("desconto___" + indexes[i]));
				log.info('Quantidade..'
						+ form.getValue("quantidade___" + indexes[i]));
				log.info('Total.......'
						+ form.getValue("total___" + indexes[i]));

				if (form.getValue("quantidade___" + indexes[i]) == ""
						|| form.getValue("quantidade___" + indexes[i]) == null
						|| form.getValue("quantidade___" + indexes[i]) == 0) {
					linha += ' Quantidade  ';
					log.info('Quantidade  ');
				}

				if (form.getValue("total___" + indexes[i]) == ""
						|| form.getValue("total___" + indexes[i]) == null
						|| form.getValue("total___" + indexes[i]) == 0) {
					if (linha == '') {
						linha += ' Total  ';
					} else {
						linha += ' e Total  ';
					}
					log.info('Total  ');
				}
				if (linha != "") {
					msg += 'Item ' + form.getValue("cod_item___" + indexes[i])
							+ ' (' + linha + ' )';
				}
			}
		}

		if (msg != '') {
			throw 'Campos devem ter valor maior que zero: ' + msg;
		}
	}

}