function displayFields(form,customHTML){ 
	
	
	form.setShowDisabledFields(true);	
	form.setHidePrintLink(true);
	
	
	var task = getValue('WKNumState');
	var processo = getValue('WKDef');
	
	//setValue("WKMobile",false);
	//form.setMobile(false);
	
	log.info(' start displayFields ped_funcionario .... ');
	
	var user = getValue("WKUser");
	//user = '99-900039';
	//user = '10-001120';	
	//user = '12-040005';
	
	if ( task == 0 || task == 31 ){
		
		form.setValue('ies_cliente', "N" );
		
		log.info('Load User...... '+user);
		form.setValue('userFluig', user );	
		
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint( 'matricula', user, user, ConstraintType.MUST) );
		var dataset = DatasetFactory.getDataset( 'fdwt_campos_adicionais_usuario', null, constraints, null);
		if( dataset.rowsCount > 0 ){
			
			log.info(' razao_social .... '+dataset.getValue(0, 'nomeCompleto' ) );
			form.setValue('razao_social', dataset.getValue(0, 'nomeCompleto' ) );
			form.setValue('empresa_cad', dataset.getValue(0, 'unidade' ) );
		}
		
		var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
		var constraints = new Array(c1);
		var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
		
		var cpfFunc = '';
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint( 'table', 'eis_v_funcionarios_protheus_digte', null, ConstraintType.MUST) );
		//constraints.push( DatasetFactory.createConstraint( 'matricula', user, user, ConstraintType.MUST) );
		
		constraints.push( DatasetFactory.createConstraint( 'EMAIL', colleagueMap.getValue(0,"mail").toUpperCase(), colleagueMap.getValue(0,"mail").toUpperCase(), ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'ies_situacao', "A", "A", ConstraintType.MUST) );
		
		var dataset = DatasetFactory.getDataset( 'selectLogix', null, constraints, null);
		if( dataset.rowsCount > 0 ){
			log.info(' cpfFunc .... '+dataset.getValue(0, 'CPF' ) );
			cpfFunc = dataset.getValue(0, 'CPF' );
			cpfFunc = cpfFunc.substring(0,9)+"0000"+cpfFunc.substring(9,11);
			form.setValue('cpf_cliente', cpfFunc );
			form.setValue('tipo_funcio', dataset.getValue(0, 'RA_PROCES' ) );
			
			var tipLog = dataset.getValue(0, 'RA_LOGRTP' ).trim();
			if( tipLog == "R" || tipLog == "R R" ){
				tipLog = "RUA";
			}
			
			
			form.setValue('pais_ent', 'BRASIL' );
			form.setValue('cod_pais_ent', '001' );
			form.setValue('estado_ent', dataset.getValue(0, 'RA_ESTADO' ) );
			form.setValue('cidade_ent', dataset.getValue(0, 'RA_MUNICIP' ) );
			form.setValue('email', dataset.getValue(0, 'EMAIL' ) );
			form.setValue('emailPed', dataset.getValue(0, 'EMAIL' ) );
			
			var ctCid = new Array();
			ctCid.push( DatasetFactory.createConstraint( 'table', 'cidades', null, ConstraintType.MUST) );
			ctCid.push( DatasetFactory.createConstraint( 'den_cidade', dataset.getValue(0, 'RA_MUNICIP' ), dataset.getValue(0, 'RA_MUNICIP' ), ConstraintType.MUST) );
			ctCid.push( DatasetFactory.createConstraint( 'cod_uni_feder', dataset.getValue(0, 'RA_ESTADO' ), dataset.getValue(0, 'RA_ESTADO' ), ConstraintType.MUST) );
			var dsCid = DatasetFactory.getDataset( 'selectLogix', null, ctCid, null);
			if( dsCid.rowsCount > 0 ){
				form.setValue('cod_cidade_ent', dsCid.getValue(0, 'COD_CIDADE' ) );
			}else{
				throw "Cidade não localizada, favor entrar em contato com RH."
				form.setValue('cod_cidade_ent', "0" );
			}
			
		}
		
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint( 'table', 'clientes', null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'cod_cliente', cpfFunc, cpfFunc, ConstraintType.MUST) );
		var dataset = DatasetFactory.getDataset( 'selectLogix', null, constraints, null);
		if( dataset.rowsCount > 0 ){
			log.info(' cpfFunc .... '+dataset.getValue(0, 'cod_cliente' ) );
			form.setValue('cod_cliente', dataset.getValue(0, 'cod_cliente' ) );
			log.info(' cpfFunc .... '+form.getValue('cod_cliente') );
			form.setValue('ies_cliente', "S" );
		}
		form.setValue('cod_class', 'F');
		form.setValue('ies_inf_pedido', 'N');
		form.setValue('cli_exc_mix', 'S');
		form.setValue('eh_contribuinte', 'N');
	}

	
	form.setValue('modo', form.getFormMode() );
	form.setValue('task', task );
	form.setValue('processo', processo );
	form.setValue('ped_representante', getValue('WKNumProces') ); 
	form.setValue('ies_orcamento', 'N' );
	
	if ( task == 0 || task == 1 ){
		var dtNow = new java.util.Date();
		var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
		if ( form.getValue( 'data_emissao') == '' ){
			form.setValue( 'data_emissao', sdf.format(dtNow) );
		}		
		if ( form.getValue( 'data_coleta') == '' ){
			form.setValue( 'data_coleta', sdf.format(dtNow) );
		}
			
	}	
	

	
}