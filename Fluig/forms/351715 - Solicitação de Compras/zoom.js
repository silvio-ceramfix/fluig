
//busca informaÃÂ§ÃÂµes do dataset
//o type ÃÂ© o nome do componente do html
function zoom(componente, idCampoTexto) {

	var valor = null;

	console.log('Quee coisa....', idCampoTexto);
	if (idCampoTexto != null & idCampoTexto != undefined) {
		valor = $('#' + idCampoTexto).val();
		console.log('VALOR....', valor);
		if (valor == '') {
			return false;
		}
		if (idCampoTexto.split('___')[1] != null && idCampoTexto.split('___')[1] != undefined) {
			componente += '___' + idCampoTexto.split('___')[1];
		}
	}


	console.log('Zoom.....', componente);

	if (componente == 'bt_proj') {

		var filtroCPL = '';
		var largura = "default";
		if (valor != null && valor != undefined) {
			filtroCPL = ',num_pedido,' + valor;
			largura = 'none';
		}

		modalzoom.open("Projeto",
			"selectTable",
			"num_pedido,Projeto,cod_cliente,Cod Cliente,nom_cliente,Nome Cliente",
			"cod_empresa,num_pedido,cod_cliente,nom_cliente,den_itens,texto_ped,cod_resp,nom_resp,matricula",
			"dataBase,java:/jdbc/LogixPRD,table,fluig_v_pedidos_cateira,sqlLimit,250,cod_empresa," + $('#empresa').val() + filtroCPL,
			componente, true, largura, null, null,
			"num_pedido||'-'||cod_cliente||'-'||nom_cliente||'-'||den_itens");
	}

	var integrou = $('#integrou___'+ componente.split('___')[1] ).val();

	if ( componente.split('___')[0] == 'bt_doc' && $('#tipo').val() == 'O') {

		var filtroCPL = '';
		var largura = "default";
		if (valor != null && valor != undefined) {
			valor = valor.replace('OS', '');
			$('#' + idCampoTexto).val('OS' + valor);
			filtroCPL = ',num_os,' + valor;
			largura = 'none';
		}

		modalzoom.open("OS Contabil",
			"selectTable",
			"num_os,Num OS,des_os,Descri&ccedil;&atilde;o,num_conta,Conta,cod_cent_cust,Cod. CC,saldo_os,Saldo OS",
			"num_os,des_os,num_conta,cod_cent_cust,den_conta,nom_cent_cust,saldo_os",
			"dataBase,java:/jdbc/LogixPRD,table,fluig_v_os_cont,sqlLimit,250,cod_empresa," + $('#empresa').val() + ",ies_situacao,1" + filtroCPL,
			componente, true, largura, null, null,
			"num_os||'-'||des_os||'-'||num_conta||'-'||cod_cent_cust||'-'||saldo_os");
		
	}


	if (componente.split('___')[0] == 'bt_doc' && $('#tipo').val() == 'S') {

		var filtroCPL = '';
		var largura = "default";
		if (valor != null && valor != undefined) {
			filtroCPL = ',num_os,' + valor;
			largura = 'none';
		}

		modalzoom.open("OS Manutencao Industrial",
			"selectTable",
			"num_os,Num OS,desc_os,Descri&ccedil;&atilde;o,equipamento_reduz,Equipamento,cod_cent_trab,Ct Trabalho,den_status_os,Status",
			"distinct,num_os,cod_cent_trab,desc_os,cod_cent_trab,den_status_os,equipamento,equipamento_reduz,cod_uni_funcio,den_uni_funcio,cod_centro_custo,nom_cent_cust",
			"dataBase,java:/jdbc/LogixPRD,table,fluig_v_os_min,sqlLimit,250,cod_empresa," + $('#empresa').val() + ",ies_situa_os,A" + filtroCPL,
			componente, false, largura, null, null,
			"num_os||'-'||desc_os||'-'||cod_cent_trab||'-'||equipamento||'-'||equipamento_reduz");
	}

	if ((componente.split('___')[0] == 'bt_doc' && $('#tipo').val() == 'P')
		|| (componente.split('___')[0] == 'bt_doc_item' && $('#tipo').val() == 'T' && integrou != "S" )) {

		var filtroCPL = '';
		var largura = "default";
		if (valor != null && valor != undefined) {
			filtroCPL += ',num_ordem,' + valor;
			largura = 'none';
		}

		var vazio = true;

		modalzoom.open("Ordem Producao",
			"selectTable",
			"num_ordem,Num OP,cod_item,Cod Item,den_item,Item,num_docum,Projeto",
			"num_ordem,cod_item,den_item,num_docum,qtd_saldo",
			"dataBase,java:/jdbc/LogixPRD,table,fluig_v_ordem_prod,sqlLimit,250,cod_empresa," + $('#empresa').val() + ",ies_situa,4,ies_saldo,S" + filtroCPL,
			componente, vazio, largura, null, null,
			"num_ordem||'-'||cod_item||'-'||den_item_reduz||'-'||nvl(num_docum,'')");
	}

	if (componente.split('___')[0] == 'bt_item' && integrou != "S") {

		var loadClear = true;
		/*var ctr_est = 'ies_ctr_estoque,N';
		if ( $('#tipo').val() == 'E' || $('#tipo').val() == 'D' || $('#tipo').val() == 'M'){
			ctr_est = 'ies_ctr_estoque,S';
			if( $('#tipo').val() == 'M' ){
				ctr_est += ',cod_tip_despesa,105';
			}
		}*/


		var filtroCPL = '';
		var largura = "default";
		if (valor != null && valor != undefined) {
			filtroCPL += ',cod_item,' + valor;
			largura = 'none';
			console.log('filtroCPL....', filtroCPL);
		}

		if ($('#tipo').val() == 'N') {
			//filtroCPL = ',cod_familia,129'; 
			//filtroCPL += ',gru_ctr_estoq,60';
			loadClear = false;
		}

		if ($('#tipo').val() == 'A') {
			//filtroCPL = ',cod_familia,129';
			//filtroCPL += ',gru_ctr_estoq,61';
			loadClear = false;
		}
		//$('#conta').val()
		if ($('#familia').val() != "") {
			filtroCPL += ',___in___cod_familia,' + $('#familia').val();
		}
		if ($('#grupo_estoque').val() != "") {
			filtroCPL += ',___in___gru_ctr_estoq,' + $('#grupo_estoque').val();
		}

		if ($('#ctr_estoque').val() == "S" || $('#ctr_estoque').val() == "N") {
			filtroCPL += ',ies_ctr_estoque,' + $('#ctr_estoque').val();
		}

		/*if ($('#ies_conta_item').val() == "S") {
			filtroCPL += ',ies_conta,S';
		}*/

		modalzoom.open("Item",
			"selectTable",
			"cod_item,C&oacutedigo,den_item,Item,cod_tip_despesa,Cód TD,nom_tip_despesa,Tipo Despesa,cod_comprador,Cod Comp,nom_comprador, Comprador",
			"cod_item,den_item,den_item_reduz,cod_comprador,nom_comprador,cod_unid_med,gru_ctr_desp,den_gru_ctr_desp,cod_tip_despesa,nom_tip_despesa,num_conta,den_conta,tmp_lead_time",
			//"dataBase,java:/jdbc/LogixPRD,table,fluig_v_item,sqlLimit,250,___not___ies_tip_item,P,___not___ies_tip_item,F,___not___ies_tip_item,T,cod_empresa,"+ $('#empresa').val()+","+ctr_est,
			"dataBase,java:/jdbc/LogixPRD,table,fluig_v_item,sqlLimit,250,___in___ies_tip_item,C|B|P,ies_situacao,A,cod_empresa," + $('#empresa').val() + filtroCPL,
			componente, loadClear, largura, null, null,
			"cod_item||'-'||den_item");
	}


	var seq = componente.split('___')[1];


	if (componente.split('___')[0] == 'bt_cc') {

		console.log('bt_cc', valor);
		var filtroCPL = '';
		var largura = "default";
		if (valor != null && valor != undefined) {
			filtroCPL = ',cod_cent_cust,' + valor;
			largura = 'none';
		}

		modalzoom.open("Centro de Custo",
			"selectTable",
			"cod_cent_cust,Codigo,nom_cent_cust,Centro de Custo",
			"distinct,cod_cent_cust,nom_cent_cust",
			"dataBase,java:/jdbc/LogixPRD,table,fluig_v_cc_uf,sqlLimit,250,ies_cod_versao,0,cod_empresa," + $('#empresa').val() + filtroCPL,
			componente, false, largura, null, null,
			"cod_cent_cust||'-'||nom_cent_cust");
		//}
	}

	
	if (componente.split('___')[0] == 'bt_UM' && integrou != "S" ) {

		console.log('bt_UM', valor);
		var filtroCPL = '';
		var largura = "default";

		modalzoom.open("Unidade de Medida",
			"selectTable",
			"cod_unid_med,Codigo,den_unid_med_30,Descrica",
			"distinct,cod_unid_med,den_unid_med_30",
			"dataBase,java:/jdbc/LogixPRD,table,fluig_v_unidade_medida,sqlLimit,250" + filtroCPL,
			componente, false, largura, null, null,
			"cod_unid_med||'-'||den_unid_med_30");
		//}
	}
	
	if (componente.split('___')[0] == 'bt_UltPreco' && integrou != "S" ) {

		console.log('bt_UltPreco', valor);
		var seq = (componente.split('___')[1]);
		
	if ($('#qtd_solic___'+seq).val() == null || $('#qtd_solic___'+seq).val() == '' || parseFloat($('#qtd_solic___'+seq).val().replace('.', '').replace(',', '.')) == 0 )	{
		FLUIGC.toast({
			title: 'Busca: ',
			message: 'Você deve informar primeiro a quantidade!',
			type: 'warning',
			timeout: 'fast'
		});
		return false;
	}else {
		//recupera ultimo preco de entrada do item
		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint('dataBase', 'java:/jdbc/LogixPRD', null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('table', 'fluig_v_ult_compra', null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('sqlLimit', '1', null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_empresa', $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('cod_item', $('#cod_item___'+seq).val(), $('#cod_item___'+seq).val(), ConstraintType.MUST));
		var fields = new Array('ult_preco_comp');
		//Busca o dataset
		var dataset = DatasetFactory.getDataset('selectTable', fields, constraints, null);
		console.log('DataSet comprado....', dataset);

		if (dataset != null && dataset.values.length > 0) {
			var reg = dataset.values[0];
			console.log('registro ',reg['ult_preco_comp']);
			console.log('registro ',reg['ULT_PRECO_COMP']);
			var ult_preco = parseFloat(reg['ult_preco_comp']);
			var qtd = parseFloat($('#qtd_solic___'+seq).val().replace('.', '').replace(',', '.')); 
	
			var total = parseFloat(ult_preco*qtd);
			
			$('#preco_est___'+seq).val(String((total).toFixed(3)).replace('.', ','));
			
			calcTotalItemEstimado('preco_est___'+seq);
		} else {
			FLUIGC.toast({
				title: 'Busca: ',
				message: 'Último preço deste item não localizado, você deve digitar!',
				type: 'warning',
				timeout: 'fast'
			});
		}
	}
	}
	

	if (componente.split('___')[0] == 'bt_pc') {
		var filtroCPL = '';
		console.log('$(#conta).val() X' + $('#conta').val() + 'X');
		if ($('#tipo').val() == 'A' || $('#regularizacao').val() == 'S' ||  $('#conta').val() != "" || $('#tipo').val() == 'N' ) {

			//$('#').val()
			if ($('#conta').val() != "") {
				filtroCPL += ',___in___num_conta_7,' + $('#conta').val();
			}
			
			if ($('#tipo').val() == 'O') {
				filtroCPL += ',___in___ies_tip_conta,' + '9';
			} else {
				filtroCPL += ',___not___ies_tip_conta,' + '9';
			}

			//filtroCPL = ',cod_cent_cust,'+buscaCCOrdemOper( componente ) ;
			modalzoom.open("Conta Contabil",
				"selectTable",
				"num_conta,Num Conta,den_conta,Conta,num_conta_reduz,Conta Reduz",
				"num_conta,num_conta_reduz,den_conta,ies_tip_conta",
				"dataBase,java:/jdbc/LogixPRD,table,fluig_v_plano_contas,sqlLimit,250" + filtroCPL,
				componente, false, "default", null, null,
				"num_conta||'-'||den_conta||'-'||num_conta_reduz");
		}
	}
	
	if (componente.split('___')[0] == 'bt_aen') {
		var filtroCPL = '';

			if ($('#aen').val() != "") {
				filtroCPL += ',___in___cod_aen,' + $('#aen').val();
			}
			
			modalzoom.open("AEN",
					"selectTable",
					"cod_aen,Codigo,aen_compl,Den. AEN",
					"cod_aen,aen_compl",
					"dataBase,java:/jdbc/LogixPRD,table,fluig_v_aen,sqlLimit,250" + filtroCPL,
					componente, false, 'default', null, null,
					"cod_aen||'-'||aen_compl");
		
	}

	if (componente.split('___')[0] == 'bt_uf') {

		var filtroCPL = '';
		console.log('Antes entrar....', $('#cod_cc___' + seq).val());
		if ($('#cod_cc___' + seq).val() != '') {
			console.log('Entrou Busca Unidade Funcional....', $('#cod_cc___' + seq).val());
			filtroCPL += ",cod_centro_custo," + $('#cod_cc___' + seq).val();
		} else if ($('#tipo').val() == 'P') {
			filtroCPL += ',___in___cod_centro_custo,' + buscaCCOrdemOper(componente);
		}

		var largura = "default";
		if (valor != null && valor != undefined) {
			filtroCPL = ',cod_uni_funcio,' + valor;
			largura = 'none';
		}

		modalzoom.open("Unidade Funcional",
			"selectTable",
			"cod_uni_funcio,Codigo,den_uni_funcio,Unidade Funcional",
			"distinct,cod_uni_funcio,den_uni_funcio,cod_centro_custo,nom_cent_cust",
			"dataBase,java:/jdbc/LogixPRD,table,fluig_v_unidade_funcional,sqlLimit,250,cod_empresa," + $('#empresa').val() + filtroCPL,
			componente, false, largura, null, null,
			"cod_uni_funcio||'-'||den_uni_funcio");
	}

	if (componente == 'bt_tipo') {


		if (($("input[name*=qtd_solic___]").size() > 0 || $("input[name*=perc_reateio___]").size()) && $('#ies_simples_cotacao').val()!='S') {
			return false;
		}


		var filtroCPL = '';
		var largura = "default";

		modalzoom.open("Tipo",
			"selectTable",
			"den_tipo_solic,Tipo Solicitação",
			"empresa,documentid,version,den_tipo_solic,tipo_erp,regularizacao,ativo,papel,cod_papel,pool_papel,ctr_estoque,aprov_tec,aprov_unic,matricula_aprov,ies_conta_item,obs_fornec,perc_tolerancia,ies_simples_cotacao,num_pasta_anexo",
			"dataBase,java:/jdbc/FluigDS,table,fluig_v_tipo_solic_user,sqlLimit,250,USER_CODE," + $('#user_atual').val() + filtroCPL,
			componente, false, largura, null, null,
			"den_tipo_solic");

	}
	
	if ( componente.indexOf( 'bt_TD' ) > -1  && integrou != "S" ){		
		
		modalzoom.open('Tipo de Despesas', 
				"selectTable",
				"cod_empresa,Cod Empresa,cod_tip_despesa,Tipo de Despesa,nom_tip_despesa,Descrição",
				"cod_empresa,cod_tip_despesa,nom_tip_despesa",
				"dataBase,java:/jdbc/LogixPRD,table,tipo_despesa,sqlLimit,250,cod_empresa," + $('#empresa').val() ,
				componente, false, largura, null, null,
				"cod_empresa||'-'||cod_tip_despesa||'-'||nom_tip_despesa");
	}
	
	if ( componente.indexOf( 'bt_GD' ) > -1  && integrou != "S" ){		
			
			modalzoom.open('Grupo de Despesas', 
					"selectTable",
					"cod_empresa,Cod Empresa,gru_ctr_desp,Grupo de Despesa,den_gru_ctr_desp,Descrição",
					"cod_empresa,gru_ctr_desp,den_gru_ctr_desp",
					"dataBase,java:/jdbc/LogixPRD,table,grupo_ctr_desp,sqlLimit,250,cod_empresa," + $('#empresa').val() ,
					componente, false, largura, null, null,
					"cod_empresa||'-'||gru_ctr_desp||'-'||den_gru_ctr_desp");
		}
	
	if (componente == 'bt_fornec' || componente.split('___')[0] == 'md_bt_fornec' ) {

		var filtroCPL = '';
		var largura = "default";

		modalzoom.open("Fornecedor",
			"selectLogix",
			"cod_fornecedor,Codigo,raz_social,Fornecedor,den_cidade,Cidade",
			"cod_fornecedor,raz_social,den_cidade,e_mail,email_secund",
			"dataBase,java:/jdbc/LogixPRD,table,fluig_v_fornecedor_cpl,ies_fornec_ativo,A,sqlLimit,250" + filtroCPL,
			componente, true, largura, null, null,
			"cod_fornecedor||'-'||raz_social");
	}

	
	if (componente == 'bt_fornecedor') {

		var filtroCPL = '';
		var largura = "default";

		modalzoom.open("Fornecedor",
			"selectTable",
			"cod_fornecedor,Codigo,raz_social,Fornecedor",
			"cod_fornecedor,raz_social",
			"dataBase,java:/jdbc/LogixPRD,table,fornecedor,ies_fornec_ativo,A,sqlLimit,250" + filtroCPL,
			componente, false, largura, null, null,
			"cod_fornecedor||'-'||raz_social");
	}

	if (componente == 'bt_comprador') {

		var filtroCPL = '';
		var largura = "default";

		modalzoom.open("Comprador",
			"selectTable",
			"cod_comprador,Codigo,nom_comprador,Comprador",
			"cod_comprador,nom_comprador",
			"dataBase,java:/jdbc/LogixPRD,table,fluig_v_comprador,sqlLimit,250,cod_empresa," + $('#empresa').val() + filtroCPL,
			componente, false, largura, null, null,
			"cod_comprador||'-'||nom_comprador");
	}

	if (componente == 'bt_cnd_pgto') {

		var filtroCPL = '';
		var largura = "default";

		modalzoom.open("Cond. Pagamento",
			"selectTable",
			"cnd_pgto,Codigo,des_cnd_pgto,Cond. Pagamento",
			"cnd_pgto,des_cnd_pgto",
			"dataBase,java:/jdbc/LogixPRD,table,cond_pgto_cap,sqlLimit,250" + filtroCPL,
			componente, false, largura, null, null,
			"cnd_pgto||'-'||des_cnd_pgto");
	}


}

function reformatDate(dateStr) {
	dArr = dateStr.split("-");  // ex input "2010-01-18"
	return dArr[2] + "/" + dArr[1] + "/" + dArr[0]; //ex out: "18/01/10"
}

function setSelectedZoomItem(selectedItem) {
	console.log('selectedItem...........', selectedItem);
	var seq = selectedItem.type.split('___')[1];

	if (selectedItem.type == "bt_proj") {

		if ($('#tipo').val() == 'D') {
			var constraints = new Array();
			constraints.push(DatasetFactory.createConstraint("cod_empresa", $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST));
			constraints.push(DatasetFactory.createConstraint("num_pedido", selectedItem.num_pedido, selectedItem.num_pedido, ConstraintType.MUST));
			constraints.push(DatasetFactory.createConstraint("cod_respon", "", "", ConstraintType.MUST_NOT));
			var projetos = DatasetFactory.getDataset("projeto", null, constraints, null);
			console.log('projetos....', projetos);
			if (projetos.values.length == 0) {
				FLUIGC.toast({
					title: 'Busca: ',
					message: 'Responsavel do projeto n&atilde;o configurado no Fluig!',
					type: 'warning',
					timeout: 'fast'
				});
				$('#projeto').focus();
				return false;
			}
		}

		$('#cod_cliente').val(selectedItem.cod_cliente);
		$('#nom_cliente').val(selectedItem.nom_cliente);
		$('#den_projeto').val(selectedItem.den_itens);
		$('#texto_ped').val(selectedItem.texto_ped);
		$('#cod_resp').val(selectedItem.cod_resp);
		$('#nom_resp').val(selectedItem.nom_resp);
		$('#matricula').val(selectedItem.matricula);


		if (selectedItem.size != 'none') {
			$('#projeto').val(selectedItem.num_pedido);
		} else if (selectedItem.num_pedido == "") {
			FLUIGC.toast({
				title: 'Busca: ',
				message: 'Projeto n&atilde;o localizada!',
				type: 'warning',
				timeout: 'fast'
			});
			$('#projeto').focus();
			return false;
		}

		if ($('#texto_solic').val().trim() == "") {
			$('#texto_solic').val('Projeto: ' + selectedItem.num_pedido);
		}
		autoSize();

	}

	if (selectedItem.type.split('___')[0] == 'bt_doc' && $('#tipo').val() == 'S') {
		console.log('Select....', selectedItem.num_conta)
		//$('#num_conta___'+seq).val( selectedItem.num_conta ) ;
		//$('#den_conta___'+seq).val( selectedItem.den_conta ) ;
		$('#cod_cc___' + seq).val(selectedItem.cod_centro_custo);
		$('#den_cc___' + seq).val(selectedItem.nom_cent_cust);
		$('#cod_unid_func___' + seq).val(selectedItem.cod_uni_funcio);
		$('#den_unid_func___' + seq).val(selectedItem.den_uni_funcio);
		$('#tipo_doc_origem___' + seq).val('OS MIN');
		//console.log('passou aqui 16022022');
		//$('#saldo_os_rat___' + seq).val('1');
		
		if (selectedItem.size != 'none') {
			$('#doc_origem___' + seq).val(selectedItem.num_os);
			
			$('#compl_doc_origem___' + seq).val(selectedItem.equipamento_reduz.trim() + ' - ' + selectedItem.desc_os.trim());
		} else if (selectedItem.num_os == "") {
			FLUIGC.toast({
				title: 'Busca: ',
				message: 'OS de Manuten&ccedil;&atilde;o n&atilde;o localizada!',
				type: 'warning',
				timeout: 'fast'
			});
			$('#doc_origem___' + seq).focus();
		}
	}
	
	if (selectedItem.type.split('___')[0] == 'bt_GD') {
		 $('#cod_grp_desp___'+ seq).val( selectedItem.gru_ctr_desp );
		 $('#den_grp_desp___'+ seq).val( selectedItem.gru_ctr_desp + ' - ' + selectedItem.den_gru_ctr_desp );
	}	
	
	if (selectedItem.type.split('___')[0] == 'bt_TD') {
		 $('#cod_tipo_desp___'+ seq).val( selectedItem.cod_tip_despesa );
		 $('#den_tipo_desp___'+ seq).val( selectedItem.cod_tip_despesa + ' - ' + selectedItem.nom_tip_despesa );
	}	
	
	if (selectedItem.type.split('___')[0] == 'bt_UM') {
		 $('#cod_unid_med___'+ seq).val( selectedItem.cod_unid_med );
	}	
	
	if (selectedItem.type.split('___')[0] == 'bt_doc' && $('#tipo').val() == 'O') {

		console.log('Select....', selectedItem.num_conta)
		$('#num_conta___' + seq).val(selectedItem.num_conta);
		$('#den_conta___' + seq).val(selectedItem.den_conta);
		$('#cod_cc___' + seq).val(selectedItem.cod_cent_cust);
		$('#den_cc___' + seq).val(selectedItem.nom_cent_cust);
		$('#tipo_doc_origem___' + seq).val('OS CONT');
		$('#compl_doc_origem___'+ seq).val(selectedItem.des_os);
		$('#saldo_os___'+ seq).val(frmNumber(parseFloat(selectedItem.saldo_os),2));
		if ($('#saldo_os___'+ seq).val()!= null && $('#saldo_os___'+ seq).val!='0' && $('#saldo_os___'+ seq).val()!=''){
			$('#doc_origem___' + seq).val('OS' + selectedItem.num_os);
			$('#compl_doc_origem___' + seq).val(selectedItem.des_os.trim());
			$('#saldo_os___' + seq).val(frmNumber(parseFloat(selectedItem.saldo_os),2));
			console.log('passou aqui 16022022');
			calcSaldoOSposOC('perc_rateio___'+seq);
		}	
		if (selectedItem.size != 'none') {
			$('#doc_origem___' + seq).val('OS' + selectedItem.num_os);
			$('#compl_doc_origem___' + seq).val(selectedItem.des_os.trim());
			$('#saldo_os___' + seq).val(frmNumber(parseFloat(selectedItem.saldo_os),2));
			//console.log('passou aqui 16022022');
			calcSaldoOSposOC('perc_rateio___'+seq);
		} else if (selectedItem.num_os == "") {
			FLUIGC.toast({
				title: 'Busca: ',
				message: 'OS Contabil n&atilde;o localizada!',
				type: 'warning',
				timeout: 'fast'
			});
			$('#doc_origem___' + seq).focus();
		}
	}

	if (selectedItem.type.split('___')[0] == 'bt_pc') {
		$('#den_conta___' + seq).val(selectedItem.den_conta);
		if (selectedItem.size != 'none') {
			$('#num_conta___' + seq).val(selectedItem.num_conta);
		} else if (selectedItem.num_conta == "") {
			FLUIGC.toast({
				title: 'Busca: ',
				message: 'Conta Contabil n&atilde;o localizada!',
				type: 'warning',
				timeout: 'fast'
			});
			$('#num_conta___' + seq).focus();
		}
	}
	
	if (selectedItem.type.split('___')[0] == 'bt_aen') {
		$('#aen_compl___' + seq).val(selectedItem.aen_compl);
		if (selectedItem.size != 'none') {
			$('#cod_aen___' + seq).val(selectedItem.cod_aen);
		} else if (selectedItem.cod_aen == "") {
			FLUIGC.toast({
				title: 'Busca: ',
				message: 'AEN n&atilde;o localizada!',
				type: 'warning',
				timeout: 'fast'
			});
			$('#cod_aen___' + seq).focus();
		}
	}

	if (selectedItem.type.split('___')[0] == 'bt_doc' && $('#tipo').val() == 'P') {

		$('#tipo_doc_origem___' + seq).val('OP');
		if (selectedItem.size != 'none') {
			$('#doc_origem___' + seq).val(selectedItem.num_ordem);
			$('#compl_doc_origem___' + seq).val(selectedItem.cod_item.trim() + ' - ' + selectedItem.den_item.trim() + ' - ' + selectedItem.num_docum.trim());
		} else if (selectedItem.num_ordem == "") {
			FLUIGC.toast({
				title: 'Busca: ',
				message: 'Ordem de Produ&ccedil;&atilde;o n&atilde;o localizada!',
				type: 'warning',
				timeout: 'fast'
			});
			$('#doc_origem___' + seq).focus();
		}
	}

	if (selectedItem.type.split('___')[0] == 'bt_doc_item' && $('#tipo').val() == 'T') {

		if (selectedItem.size != 'none') {
			$('#doc_origem_item___' + seq).val(selectedItem.num_ordem);
			$('#cod_item_op___' + seq).val(selectedItem.cod_item.trim());
			$('#den_item_op___' + seq).val(selectedItem.den_item.trim());
			$('#projeto_item___' + seq).val(selectedItem.num_docum.trim());
			$('#texto_ped_cotacao___' + seq).val($('#den_item___' + seq).val().trim() + " - " + $('#cod_item_op___' + seq).val() + " - " + $('#den_item_op___' + seq).val() + " - " + $('#projeto_item___' + seq).val() + " ");

			if ($('#qtd_solic___' + seq).val() == "") {
				var qtd = isNull(Math.round(parseFloat(selectedItem.qtd_saldo) * 1000) / 1000, 0);
				console.log('qtd..........', qtd);
				$('#qtd_solic___' + seq).val(String((qtd).toFixed(3)).replace('.', ','));
			}

		} else if (selectedItem.num_ordem == "") {
			FLUIGC.toast({
				title: 'Busca: ',
				message: 'Ordem de Produ&ccedil;&atilde;o n&atilde;o localizada!',
				type: 'warning',
				timeout: 'fast'
			});
			$('#doc_origem_item___' + seq).focus();
		} else {
			$('#doc_origem_item___' + seq).val(selectedItem.num_ordem);
			$('#cod_item_op___' + seq).val(selectedItem.cod_item.trim());
			$('#den_item_op___' + seq).val(selectedItem.den_item.trim());
			$('#projeto_item___' + seq).val(selectedItem.num_docum.trim());
			$('#texto_ped_cotacao___' + seq).val($('#den_item___' + seq).val().trim() + " - " + $('#cod_item_op___' + seq).val() + " - " + $('#den_item_op___' + seq).val() + " - " + $('#projeto_item___' + seq).val() + " ");

			if ($('#qtd_solic___' + seq).val() == "") {
				console.log('selectedItem.qtd_saldo..........', selectedItem.qtd_saldo);
				var qtd = isNull(Math.round(parseFloat(selectedItem.qtd_saldo) * 1000) / 1000, 0);
				console.log('qtd..........', qtd);
				$('#qtd_solic___' + seq).val(String((qtd).toFixed(3)).replace('.', ','));
			}
		}
	}

	if (selectedItem.type.split('___')[0] == 'bt_cc' && ($('#tipo').val() == 'P'
		|| $('#tipo').val() == 'N'
		|| $('#tipo').val() == 'A'
		|| $('#tipo').val() == 'O'
		|| $('#tipo').val() == 'T')) {
		$('#den_cc___' + seq).val(selectedItem.nom_cent_cust);

		$('#cod_unid_func___' + seq).val(selectedItem.cod_uni_funcio);
		$('#den_unid_func___' + seq).val(selectedItem.den_uni_funcio);
		if (selectedItem.size != 'none') {
			$('#cod_cc___' + seq).val(selectedItem.cod_cent_cust);
		} else if (selectedItem.cod_cent_cust == "") {
			FLUIGC.toast({
				title: 'Busca: ',
				message: 'Centro de Custo n&atilde;o localizado!',
				type: 'warning',
				timeout: 'fast'
			});
			$('#cod_cc___' + seq).focus();
		}
	}

	if (selectedItem.type.split('___')[0] == 'bt_uf' && ($('#tipo').val() == 'P'
		|| $('#tipo').val() == 'N'
		|| $('#tipo').val() == 'A'
		|| $('#tipo').val() == 'O'
		|| $('#tipo').val() == 'T')) {
		$('#cod_cc___' + seq).val(selectedItem.cod_centro_custo);
		$('#den_cc___' + seq).val(selectedItem.nom_cent_cust);
		$('#den_unid_func___' + seq).val(selectedItem.den_uni_funcio);
		if (selectedItem.size != 'none') {
			$('#cod_unid_func___' + seq).val(selectedItem.cod_uni_funcio);
		} else if (selectedItem.cod_uni_funcio == "") {
			FLUIGC.toast({
				title: 'Busca: ',
				message: 'Unidade Funcional n&atilde;o localizada!',
				type: 'warning',
				timeout: 'fast'
			});
			$('#cod_unid_func___' + seq).focus();
		}

	}




	if (selectedItem.type.split('___')[0] == 'bt_item') {

		$('#cod_item_busca___' + seq).val(selectedItem.cod_item);
		$('#den_item_reduz___' + seq).val(selectedItem.den_item_reduz);

		$('#den_item___' + seq).val(selectedItem.den_item);

		if ($('#tipo').val() != 'E' && $('#tipo').val() != 'D' && $('#tipo').val() != 'M' && $('#tipo').val() != 'T') {
			$('#texto_ped_cotacao___' + seq).val(selectedItem.den_item.trim() + " ");
		} else if ($('#tipo').val() == 'T') {
			$('#texto_ped_cotacao___' + seq).val($('#den_item___' + seq).val().trim() + " - " + $('#cod_item_op___' + seq).val() + " - " + $('#den_item_op___' + seq).val() + " - " + $('#projeto_item___' + seq).val() + " ");
		}

		$('#cod_grp_desp___' + seq).val(selectedItem.gru_ctr_desp);
		$('#den_grp_desp___' + seq).val(selectedItem.gru_ctr_desp.trim()+' '+selectedItem.den_gru_ctr_desp);
		$('#cod_unid_med___' + seq).val(selectedItem.cod_unid_med);
		$('#cod_tipo_desp___' + seq).val(selectedItem.cod_tip_despesa);
		$('#den_tipo_desp___' + seq).val(selectedItem.cod_tip_despesa.trim()+' '+selectedItem.nom_tip_despesa);
		
		
		$('#num_conta_item___' + seq).val(selectedItem.num_conta);
		
			
		$('#tmp_lead_time___' + seq).val(selectedItem.tmp_lead_time);

		$('#cod_comprador_item___' + seq).val(selectedItem.cod_comprador);
		$('#nom_comprador_item___' + seq).val(selectedItem.nom_comprador);
		
		if (selectedItem.size != 'none') {
			$('#cod_item___' + seq).val(selectedItem.cod_item);
		} else if (selectedItem.cod_item == "") {
			FLUIGC.toast({
				title: 'Busca: ',
				message: 'Item n&atilde;o localizado!',
				type: 'warning',
				timeout: 'fast'
			});
			$('#cod_item___' + seq).focus();
		}
	}

	//if ( selectedItem.type.split('___')[0] == 'bt_cc' 
	//  || ( selectedItem.type.split('___')[0] == 'bt_doc' && $('#tipo').val() == 'O'  ) ){
	//	  zoom( 'bt_uf', 'cod_unid_func' );
	//}

	if (selectedItem.type == 'bt_tipo') {

		if( selectedItem.empresa != '' 
		 && selectedItem.empresa != null ) {
			$('#empresa').val(selectedItem.empresa);
			loadDsCombo('empresa', 'selectLogix', 'COD_EMPRESA', 'DEN_REDUZ', 'table,COD_EMPRESA', 'empresa,'+selectedItem.empresa, 'COD_EMPRESA', 'S', 'S', 'N');
		}else{
			loadDsCombo('empresa', 'selectLogix', 'COD_EMPRESA', 'DEN_REDUZ', 'table,___not______in___COD_EMPRESA', 'empresa,40|69', 'COD_EMPRESA', 'S', 'S', 'S');			
		}

		$('#den_tipo_solic').val(selectedItem.den_tipo_solic);
		$('#tipo').val(selectedItem.tipo_erp);
		$('#regularizacao').val(selectedItem.regularizacao);
		$('#ativo').val(selectedItem.ativo);
		$('#papel').val(selectedItem.papel);
		$('#cod_papel').val(selectedItem.cod_papel);
		$('#pool_papel').val(selectedItem.pool_papel);
		$('#tipo_c').val(selectedItem.den_tipo_solic);

		$('#ctr_estoque').val(selectedItem.ctr_estoque);
		$('#aprov_tec').val(selectedItem.aprov_tec);
		$('#aprov_unic').val(selectedItem.aprov_unic);
		$('#mat_aprov').val(selectedItem.matricula_aprov);
		$('#ies_conta_item').val(selectedItem.ies_conta_item);

		$('#obs_fornec').val(selectedItem.obs_fornec);
		$('#perc_tolerancia').val(selectedItem.perc_tolerancia);
		$('#ies_simples_cotacao').val(selectedItem.ies_simples_cotacao);
		$('#num_pasta_anexo').val(selectedItem.num_pasta_anexo);
		

		setTipo();

		var familia = getListaPaiFilho('tipo_solicitacao_compras', 'familia', selectedItem.documentid, selectedItem.version, 'cod_familia');
		var grupo_estoque = getListaPaiFilho('tipo_solicitacao_compras', 'grupo_estoque', selectedItem.documentid, selectedItem.version, 'cod_grupo_estoque');
		var conta = getListaPaiFilho('tipo_solicitacao_compras', 'conta', selectedItem.documentid, selectedItem.version, 'cod_conta');
		var aen = getListaPaiFilho('tipo_solicitacao_compras', 'aen', selectedItem.documentid, selectedItem.version, 'cod_aen');

		$('#familia').val(familia.join('|'));
		$('#grupo_estoque').val(grupo_estoque.join('|'));
		$('#conta').val(conta.join('|'));
		$('#aen').val(aen.join('|'));

	}

	if (selectedItem.type == 'bt_fornec') {
		var seq = wdkAddChild('fornecedor');
		$('#cnpj_fornecedor___'+seq).val(selectedItem.cod_fornecedor);
		$('#nom_fornecedor___'+seq).val(selectedItem.raz_social);
		$('#cidade_fornecedor___'+seq).val(selectedItem.den_cidade);
		$('#cod_fornecedor_sugerido___'+seq).val(selectedItem.cod_fornecedor);
		
		var mail = "";
		if( selectedItem.e_mail != "" 
		 && selectedItem.e_mail != null
		 && selectedItem.e_mail != "null" ){
			mail = selectedItem.e_mail.trim();
		}
		
		if( selectedItem.email_secund != "" 
		 && selectedItem.email_secund != null
		 && selectedItem.email_secund != "null" ){
			if( mail != "" ){
				mail += ";"+selectedItem.email_secund.trim();
			}else{
				mail = selectedItem.email_secund.trim();
			}
		}
		
		$('#email_fornecedor___'+seq).val(mail);

		autoSize();
	}
	
	if (selectedItem.type == 'bt_fornecedor') {
		$('#cod_fornecedor').val(selectedItem.cod_fornecedor);
		$('#raz_social').val(selectedItem.raz_social);
	}

	if (selectedItem.type.split('___')[0] == 'md_bt_fornec') {
		$('#md_cod_fornec_cotacao___'+selectedItem.type.split('___')[1]).val(selectedItem.cod_fornecedor);
		$('#md_den_fornec_cotacao___'+selectedItem.type.split('___')[1]).val(selectedItem.raz_social);
	}

	if (selectedItem.type == 'bt_comprador') {
		$('#cod_comprador').val(selectedItem.cod_comprador);
		$('#nom_comprador').val(selectedItem.nom_comprador);
	}

	if (selectedItem.type == 'bt_cnd_pgto') {
		$('#cnd_pgto').val(selectedItem.cnd_pgto);
		$('#des_cnd_pgto').val(selectedItem.des_cnd_pgto);
		
		calcVencimentos();
		
	}

}


function validaTipo() {
	if ($('#tipo').val() == '') {
		zoom('bt_tipo');
	}
}

function setComprador() {

	/*if( $('#cod_comprador').val() != "" ){
		return false;
	}*/

	var login = "";

	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint('chave', 'user_logix', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('colleaguePK.companyId', '1', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('colleaguePK.colleagueId', $('#user_atual').val(), null, ConstraintType.MUST));
	var dataset = DatasetFactory.getDataset('colleagueParam', null, constraints, null);
	console.log('dataset user_logix....', dataset);
	if (dataset != null && dataset.values.length > 0) {
		var reg = dataset.values[0];
		login = reg['val_param'];
	}
	console.log('login user_logix....', login);
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint('dataBase', 'java:/jdbc/LogixPRD', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('table', 'fluig_v_comprador', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('sqlLimit', '1', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('cod_empresa', $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('___lower___login', login, login, ConstraintType.MUST));
	//Busca o dataset
	var dataset = DatasetFactory.getDataset('selectTable', null, constraints, null);
	console.log('DataSet comprado....', dataset);
	//console.log( 'Selec...... 004',dataset.values.length );
	var cc = '';
	if (dataset != null && dataset.values.length > 0) {
		var reg = dataset.values[0];
		$('#cod_comprador').val(reg['cod_comprador']);
		$('#nom_comprador').val(reg['nom_comprador']);
	} else {
		$('#cod_comprador').val("");
		$('#nom_comprador').val("");
	}

}

function getCCUserRH(user) {

	console.log('user.....', user);

	if (isNaN(parseInt(user))) {
		return '';
	}

	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint('dataBase', 'java:/jdbc/SeniorDS', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('table', 'fluig_v_funcionario', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('sqlLimit', '1', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('numcad', user, user, ConstraintType.MUST));
	var fields = new Array('codccu');
	var order = new Array('codccu');
	console.log('Selec...... 003');
	//Busca o dataset
	var dataset = DatasetFactory.getDataset('selectTableSQLserver', fields, constraints, order);
	console.log('Selec...... 003', dataset);
	//console.log( 'Selec...... 004',dataset.values.length );
	var cc = '';
	if (dataset != null && dataset.values.length > 0) {
		var reg = dataset.values[0];
		cc = reg['codccu'];
	}
	return cc;

}

function buscaCCOrdemOper(id) {
	//Cria as constraints para buscar os campos filhos, passando o tablename, nÃÂºmero da formulÃÂ¡rio e versÃÂ£o
	var constraints = new Array();
	var seq = id.split('___')[1];
	constraints.push(DatasetFactory.createConstraint('dataBase', 'java:/jdbc/LogixPRD', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('table', 'fluig_v_ordem_oper', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('sqlLimit', '600', null, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('cod_empresa', $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint('num_ordem', $('#doc_origem___' + seq).val(), $('#doc_origem___' + seq).val(), ConstraintType.MUST));
	var fields = new Array('distinct', 'cod_cent_cust', 'nom_cent_cust');
	var order = new Array('cod_cent_cust');
	console.log('Selec...... 003');
	//Busca o dataset
	var dataset = DatasetFactory.getDataset('selectTable', fields, constraints, order);
	console.log('Selec...... 003', dataset);
	//console.log( 'Selec...... 004',dataset.values.length );
	var cc = '';
	for (var x = 0; x < dataset.values.length; x++) {
		var reg = dataset.values[x];
		if (x == 0) {
			cc += reg['cod_cent_cust'];
		} else {
			cc += '|' + reg['cod_cent_cust'];
		}
	}
	return cc;
}



function mvalor(v) {

	v = v.replace(/\D/g, "");//Remove tudo o que nÃ£o Ã© dÃ­gito
	v = v.replace(/(\d)(\d{9})$/, "$1.$2");//coloca o ponto dos milhÃµes
	v = v.replace(/(\d)(\d{6})$/, "$1.$2");//coloca o ponto dos milhares

	v = v.replace(/(\d)(\d{3})$/, "$1,$2");//coloca a virgula antes dos 2 Ãºltimos dÃ­gitos
	return v;
}

function getListaPaiFilho(dataSet, table, idDocPai, versionDocPai, fieldCodigo) {

	console.log(dataSet, table, idDocPai, versionDocPai, fieldCodigo);

	var constraintsFilhos = new Array();
	constraintsFilhos.push(DatasetFactory.createConstraint("tablename", table, table, ConstraintType.MUST));
	constraintsFilhos.push(DatasetFactory.createConstraint("metadata#id", idDocPai, idDocPai, ConstraintType.MUST));
	constraintsFilhos.push(DatasetFactory.createConstraint("metadata#version", versionDocPai, versionDocPai, ConstraintType.MUST));
	constraintsFilhos.push(DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST));

	var result = new Array();
	var orderFilhos = new Array();
	orderFilhos.push(fieldCodigo);
	var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos);
	console.log('DataSet', datasetFilhos);
	if (datasetFilhos != null) {
		var filhos = datasetFilhos.values;
		for (var i in filhos) {
			console.log('Linha DataSet.....', i);
			var filho = filhos[i];
			result.push(filho[fieldCodigo].trim());
		}
	}
	return result;
}

function validaConta() {

	var aTD = new Array();
	var aCC = new Array();

	$("input[name*=cod_tipo_desp___]").each(function (index) {
		if (aTD.indexOf($(this).val()) == -1) {
			aTD.push($(this).val());
		}
	});

	$("input[name*=cod_cc___]").each(function (index) {
		var seq = $(this).attr('id').split('___')[1];
		if (aCC.indexOf($(this).val()) == -1
			&& $('#num_conta___' + seq).val() == "") {
			aCC.push($(this).val());
		}
	});

	console.log('Array... ', aTD, aCC);

	for (var i = 0; i < aTD.length; i++) {
		for (var j = 0; j < aCC.length; j++) {

			var constraints = new Array();
			constraints.push(DatasetFactory.createConstraint('dataBase', 'java:/jdbc/LogixPRD', null, ConstraintType.MUST));
			constraints.push(DatasetFactory.createConstraint('table', 'plano_contas', null, ConstraintType.MUST));
			constraints.push(DatasetFactory.createConstraint('cod_empresa', '99', '99', ConstraintType.MUST));
			constraints.push(DatasetFactory.createConstraint('ies_sit_conta', 'A', 'A', ConstraintType.MUST));

			var conta = ("0000" + aCC[j].trim()).substr(-4, 4) + ("0000" + aTD[i].trim()).substr(-4, 4)

			constraints.push(DatasetFactory.createConstraint('num_conta_reduz', conta, conta, ConstraintType.MUST));
			var fields = new Array('distinct', 'num_conta_reduz');
			var order = new Array();

			console.log('Selec...... 002', constraints);
			var dataset = DatasetFactory.getDataset('selectTable', fields, constraints, order);
			console.log('Selec...... 003', dataset);

			if (dataset.values.length == 0) {
				alert('Conta não cadastrada ou desativada.(' + conta + ') Verifique junto a Controladoria.');
				return false;
			}
		}
	}

	return true;

}

function dataAtualFormatada(data) {
	dia = data.getDate().toString().padStart(2, '0');
	mes = (data.getMonth() + 1).toString().padStart(2, '0'); //+1 pois no getMonth Janeiro começa com zero.
	ano = data.getFullYear();
	return dia + "/" + mes + "/" + ano;
}
