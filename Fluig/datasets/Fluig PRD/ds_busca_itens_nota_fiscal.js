function createDataset(fields, constraints, sortFields) {
	var SQL = "";

	var dataSource = "java:/jdbc/LogixPRD";

	var newDataset = DatasetBuilder.newDataset();
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup(dataSource);
	var created = false;

	var codEmpresa = '';
	var transNotaFiscal = '';

	log.info('####DS_busca_itens_nota_fiscal');
	for ( var i in constraints) {

		if (constraints[i].getFieldName().toString() == 'cod_empresa') {
			codEmpresa = constraints[i].initialValue;

			log.info('####codempresa');
			log.info(codEmpresa);
		}

		if (constraints[i].getFieldName().toString() == 'trans_nota_fiscal') {
			transNotaFiscal = constraints[i].initialValue;

			log.info('####transnotafiscal');
			log.info(transNotaFiscal);
		}

	}

	var SQL = " select fat_nf_item.empresa, "
	SQL += " fat_nf_item.trans_nota_fiscal, "
	SQL += " fat_nf_item.seq_item_nf, "
	SQL += " fat_nf_item.item, "
	SQL += " fat_nf_item.des_item, "
	SQL += " fat_nf_item.unid_medida, "
	SQL += " fat_nf_item.qtd_item, "
	SQL += " fat_nf_item.preco_unit_liquido, "
	SQL += " fat_nf_item.val_liquido_item, "
	SQL += " nvl(sup_nf_devol_cli.qtd_item,0) as qtd_devolvida, "
	SQL += " item_embalagem.qtd_padr_embal, "
	SQL += " fat_nf_mestre.nota_fiscal, "
	SQL += " fiscipi.bc_tributo_tot as bc_ipi, "	
	SQL += " fiscipi.val_trib_merc as val_ipi, "
	SQL += " fiscfecomp.bc_tributo_tot as bc_fecomp, "	
	SQL += " fiscfecomp.val_trib_merc as val_fecomp, "
    SQL += " fiscst.bc_tributo_tot as bc_st, "		
    SQL += " fiscst.val_trib_merc as val_st, "
    SQL += " nvl(fiscstgnre.bc_tributo_tot,0) as bc_st_gnre, "
    SQL += " nvl(fiscstgnre.val_trib_merc,0) as val_st_gnre, "
    SQL += " fiscicms.bc_tributo_tot as bc_icms, "
    SQL += " fiscicms.val_trib_merc as val_icms, "
    SQL += " fiscicms.aliquota as aliq_icms, "
    SQL += " case "
    SQL += " when (nvl(fiscstgnre.val_trib_merc,0) +nvl(fiscst.val_trib_merc,0)) <> 0 then (select caracter_integr from vdp_dpara_geral where sistema_integr='FLUIG_DEV_ST' and caracter_logix=nvl(fiscicms.cod_fiscal,0)) "
    SQL += " when (nvl(fiscstgnre.val_trib_merc,0) +nvl(fiscst.val_trib_merc,0)) = 0 then (select caracter_integr from vdp_dpara_geral where sistema_integr='FLUIG_DEV_SEM_ST' and caracter_logix=nvl(fiscicms.cod_fiscal,0)) "
    SQL += " end as cfop "
	SQL += " from fat_nf_item "
	SQL += " join fat_nf_mestre on (fat_nf_mestre.empresa = fat_nf_item.empresa "
			+ " and fat_nf_mestre.trans_nota_fiscal = fat_nf_item.trans_nota_fiscal) "
	SQL += " left join sup_nf_devol_cli on (sup_nf_devol_cli.empresa = fat_nf_item.empresa "
			+ " and sup_nf_devol_cli.trans_nota_fiscal_fatura = fat_nf_item.trans_nota_fiscal "
			+ " and sup_nf_devol_cli.seq_item_nota_fiscal_fatura = fat_nf_item.seq_item_nf) "
	SQL += " left join item_embalagem on (item_embalagem.cod_empresa = fat_nf_item.empresa "
			+ " and item_embalagem.cod_item = fat_nf_item.item "
			+ " and item_embalagem.ies_tip_embal = 'E') "
	SQL += " left join fat_nf_item_fisc fiscipi on (fiscipi.empresa = fat_nf_item.empresa "
			+ " and fiscipi.trans_nota_fiscal = fat_nf_item.trans_nota_fiscal "
			+ " and fiscipi.seq_item_nf = fat_nf_item.seq_item_nf "
			+ " and trim(fiscipi.tributo_benef) = trim('IPI')) "
	SQL += " left join fat_nf_item_fisc fiscst on (fiscst.empresa = fat_nf_item.empresa "
			+ " and fiscst.trans_nota_fiscal = fat_nf_item.trans_nota_fiscal "
			+ " and fiscst.seq_item_nf = fat_nf_item.seq_item_nf "
			+ " and trim(fiscst.tributo_benef) = trim('ICMS_ST')) "
    SQL += " left join fat_nf_item_fisc fiscstgnre on (fiscstgnre.empresa = fat_nf_item.empresa "
    		+ " and fiscstgnre.trans_nota_fiscal = fat_nf_item.trans_nota_fiscal "
    		+ " and fiscstgnre.seq_item_nf = fat_nf_item.seq_item_nf "
    		+ " and trim(fiscstgnre.tributo_benef) = trim('ICMS_ST_GNRE')) "
    SQL += " left join fat_nf_item_fisc fiscicms on (fiscicms.empresa = fat_nf_item.empresa "
    		+ " and fiscicms.trans_nota_fiscal = fat_nf_item.trans_nota_fiscal "
    		+ " and fiscicms.seq_item_nf = fat_nf_item.seq_item_nf "
    		+ " and trim(fiscicms.tributo_benef) = trim('ICMS'))  "
     SQL += " left join fat_nf_item_fisc fiscfecomp on (fiscfecomp.empresa = fat_nf_item.empresa "
    		+ " and fiscfecomp.trans_nota_fiscal = fat_nf_item.trans_nota_fiscal "
    		+ " and fiscfecomp.seq_item_nf = fat_nf_item.seq_item_nf "
    		+ " and trim(fiscfecomp.tributo_benef) = trim('FECOMP_ST'))  "    		
	SQL += " where fat_nf_item.empresa = '" + codEmpresa + "'"
	SQL += " and fat_nf_item.trans_nota_fiscal = '" + transNotaFiscal + "'"
	SQL += " order by fat_nf_item.empresa, fat_nf_item.trans_nota_fiscal, fat_nf_item.seq_item_nf "

	log.info('####SQL DS_busca_itens_nota_fiscal');
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
		var lRetorno = ("ERRO NO DATASET DS_busca_itens_nota_fiscal: -> " + e.message);
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
