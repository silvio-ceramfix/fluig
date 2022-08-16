function displayFields(form, customHTML) {
	form.setShowDisabledFields(true);
	var numAtividade = getValue('WKNumState');
	var user = getValue('WKUser');
	

	form.setValue("numSolic", getValue('WKNumProces') );
	
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
	  
	if( ['0','4'].indexOf( numAtividade ) ){
		
		var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
		var constraints = new Array(c1);
		var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
		form.setValue('solicitante', colleagueMap.getValue(0,"colleagueName") );
		form.setValue('matricula', user );
		
		var ct= new Array();
		ct.push(DatasetFactory.createConstraint("companyId", "1", "1", ConstraintType.MUST) );
		ct.push(DatasetFactory.createConstraint("colleagueId", user, user, ConstraintType.MUST) );
		ct.push(DatasetFactory.createConstraint("roleId", "simples_public_documento", "simples_public_documento", ConstraintType.SHOULD) );
		var ds = DatasetFactory.getDataset("workFlowColleagueRole", null, ct, null );
		if( ds.rowsCount > 0 ){
			form.setValue("ies_simples_public", "S" );
		}else{
			form.setValue("ies_simples_public", "N" );	
		}
		
	}
	
	var ct= new Array();
	ct.push(DatasetFactory.createConstraint("companyId", "1", "1", ConstraintType.MUST) );
	ct.push(DatasetFactory.createConstraint("colleagueId", user, user, ConstraintType.MUST) );
	ct.push(DatasetFactory.createConstraint("roleId", "analise_documento_juridico", "analise_documento_juridico", ConstraintType.SHOULD) );
	var ds = DatasetFactory.getDataset("workFlowColleagueRole", null, ct, null );
	if( ds.rowsCount > 0 ){
		form.setValue("lstTipoDocumento", "all" );
	}else{
		 var arrTD = [];
		 var td = DatasetFactory.getDataset('tipos_documentos', null, null, null );
		 for( var y = 0; y < td.rowsCount; y++ ){
			 
			if( td.getValue(y,"matricula_gerente") == user ){
				if( arrTD.indexOf( td.getValue(y,"cod_tipo_documento") ) == -1 ){
					arrTD.push( td.getValue(y,"cod_tipo_documento") );
				}
	   		}
	   		
			var ctr = new Array();
			ctr.push( DatasetFactory.createConstraint("tablename", "responsavel", "responsavel", ConstraintType.MUST) );
			ctr.push( DatasetFactory.createConstraint("metadata#id", td.getValue(y,"documentid"), td.getValue(y,"documentid"), ConstraintType.MUST) );
			ctr.push( DatasetFactory.createConstraint("metadata#version", td.getValue(y,"version"), td.getValue(y,"version"), ConstraintType.MUST) );
			ctr.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
			var tds = DatasetFactory.getDataset("tipos_documentos", null, ctr, null );
			for( var x = 0; x < tds.rowsCount; x++ ) {
				if( tds.getValue( x, "matricula_responsavel" ) == user ){
					if( arrTD.indexOf( td.getValue(y,"cod_tipo_documento") ) == -1 ){
						arrTD.push( td.getValue(y,"cod_tipo_documento") );
					}
		   		}
			}
		 }
		 form.setValue("lstTipoDocumento", arrTD.join('|') );
	}
}
