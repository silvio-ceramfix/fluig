function createDataset(fields, constraints, sortFields) {
	var SQL = "";

	var dataSource = "java:/jdbc/LogixPRD";

	var newDataset = DatasetBuilder.newDataset();
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup(dataSource);
	var created = false;

	var codEmpresa = '';
	var codCliente = '';
	var codRepres = '';

	log.info('####DS_busca_notas_rep');
	for ( var i in constraints) {

		if (constraints[i].getFieldName().toString() == 'empresa') {
			codEmpresa = constraints[i].initialValue;

			log.info('####codempresa');
			log.info(codEmpresa);
		}

		if (constraints[i].getFieldName().toString() == 'cliente') {
			codCliente = constraints[i].initialValue;

			log.info('####codcliente');
			log.info(codCliente);
		}

		if (constraints[i].getFieldName().toString() == 'representante') {
			codRepres = constraints[i].initialValue;

			log.info('####codrepresentante');
			log.info(codRepres);
		}

	}

	var SQL = " select fat_nf_mestre.empresa, "
	SQL += " fat_nf_mestre.serie_nota_fiscal, "
	SQL += " fat_nf_mestre.subserie_nf, "
	SQL += " fat_nf_mestre.trans_nota_fiscal, "
	SQL += " fat_nf_mestre.nota_fiscal, "
	SQL += " fat_nf_mestre.espc_nota_fiscal, "
	SQL += " fat_nf_mestre.cliente as cod_cliente, "
	SQL += " fat_nf_mestre.dat_hor_emissao, "
	SQL += " fat_nf_repr.representante as cod_repres "
	SQL += " from fat_nf_mestre "
	SQL += " join fat_nf_repr on (fat_nf_repr.empresa = fat_nf_mestre.empresa "
			+ " and fat_nf_repr.trans_nota_fiscal = fat_nf_mestre.trans_nota_fiscal "
			+ " and fat_nf_repr.seq_representante='1') "
	SQL += " where fat_nf_mestre.sit_nota_fiscal ='N' "
	SQL += "    AND fat_nf_mestre.empresa     = '" + codEmpresa + "'"
	SQL += "    AND fat_nf_mestre.cliente    = '" + codCliente + "'"
	SQL += " and trunc(dat_hor_emissao) >= '01/01/2016' "
	
	//SQL += "    AND fat_nf_repr.representante      = '" + codRepres + "'"
	SQL += " order by fat_nf_mestre.empresa, fat_nf_mestre.nota_fiscal "

	log.info('####SQL DS_busca_faturas');
	log.info(SQL);

	try {
		var conn = ds.getConnection();
		var stmt = conn.createStatement();
		var rs = stmt.executeQuery(SQL);
		var columnCount = rs.getMetaData().getColumnCount();

		while (rs.next()) {
			if (!created) {
				for (var i = 1; i <= columnCount; i++) {
					newDataset.addColumn(rs.getMetaData().getColumnName(i));
				}

				created = true;
			}
			var Arr = new Array();

			for (var i = 1; i <= columnCount; i++) {
				var obj = rs.getObject(rs.getMetaData().getColumnName(i));
				if (null != obj) {
					Arr[i - 1] = rs
							.getObject(rs.getMetaData().getColumnName(i))
							.toString();
				} else {
					Arr[i - 1] = "null";
				}
			}

			newDataset.addRow(Arr);
		}

	} catch (e) {
		log.error("ERRO==============> " + e.message);
		newDataset.addColumn('MENSAGEM');
		var lRetorno = ("ERRO NO DATASET DS_busca_notas_rep: -> " + e.message);
		newDataset.addRow(new Array(lRetorno));
	} finally {
		if (stmt != null)
			stmt.close();
		if (conn != null)
			conn.close();
	}

	return newDataset;
}

function onMobileSync(user) {

}
