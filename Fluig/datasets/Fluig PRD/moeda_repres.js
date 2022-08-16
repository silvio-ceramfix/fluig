function defineStructure() {
	
	
	addColumn("COD_MOEDA");
	addColumn("COD_REPRES");	
    addColumn("DEN_MOEDA");
    addColumn("DEN_MOEDA_ABREV");
    addColumn("MATRICULA");
    addColumn("IES_MOEDA_DEFAULT");
    
    setKey([ "COD_MOEDA", "COD_REPRES" ]);
    addIndex([ "COD_MOEDA" ]);
    addIndex([ "COD_REPRES" ]);
    addIndex([ "MATRICULA" ]);
    
    
}

function onSync(lastSyncDate) {

    var dataset = DatasetBuilder.newDataset();
    
    	try{
			var datasetOrig = DatasetFactory.getDataset('moeda_repres', null, null, null );
			if ( datasetOrig != null ){
				for (var x = 0; x < datasetOrig.rowsCount; x++) {
					var arrItem = new Array();
					arrItem.push( datasetOrig.getValue(x, 'cod_moeda') );
					arrItem.push( datasetOrig.getValue(x, 'cod_repres') );
					
					arrItem.push( '' );
					arrItem.push( '' );
					arrItem.push( '' );
					arrItem.push( '' );
					
					dataset.deleteRow( arrItem );
					log.info('Delete '+datasetOrig.getValue(x, 'moeda')+datasetOrig.getValue(x, 'cod_repres') );
				}
			}
    	}catch(e){ log.error( e.toString() ); }
	
		var constraintsPai = new Array( );
		//constraintsPai.push( DatasetFactory.createConstraint("ies_matriz", 'on', 'on', ConstraintType.MUST) );
		var datasetPai = DatasetFactory.getDataset('representante_compl', null, constraintsPai, null);
		
		if ( datasetPai != null ){
			log.info( 'Pai Filho lista_de_preco_repres.... '+ datasetPai.rowsCount );
			for (var x = 0; x < datasetPai.rowsCount; x++) {
				
				var constraintsFilhos = new Array();
				constraintsFilhos.push( DatasetFactory.createConstraint("tablename", 'moeda', 'moeda', ConstraintType.MUST) );
				constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", datasetPai.getValue(x, "documentid" ), datasetPai.getValue(x, "documentid" ), ConstraintType.MUST) );
				constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", datasetPai.getValue(x, "version" ), datasetPai.getValue(x, "version" ), ConstraintType.MUST) );
					
				var datasetFilhos = DatasetFactory.getDataset('representante_compl', null, constraintsFilhos, null );
					
				if ( datasetFilhos != null ){
										
					for (var i = 0; i < datasetFilhos.rowsCount; i++) {
						

						var constraintsCompl = new Array();
						constraintsCompl.push( DatasetFactory.createConstraint("cod_moeda", datasetFilhos.getValue(i, 'cod_moeda'), datasetFilhos.getValue(i, 'cod_moeda'), ConstraintType.MUST) );
						var datasetCompl = DatasetFactory.getDataset('moeda', null, constraintsCompl, null );

						
						if ( datasetCompl != null && datasetCompl.rowsCount > 0 ){
							var arrItem = new Array();
							arrItem.push( datasetFilhos.getValue(i, 'cod_moeda') );
							arrItem.push( datasetPai.getValue(x, "cod_repres" ) );							
							arrItem.push( datasetCompl.getValue(0, 'den_moeda') );
							arrItem.push( datasetCompl.getValue(0, 'den_moeda_abrev') );
							arrItem.push( datasetPai.getValue(x, "matricula" ) );
							arrItem.push( datasetFilhos.getValue(i, 'ies_moeda_default') );
							
							dataset.addOrUpdateRow( arrItem );
							
						}
					}
				}
			}
		}
		
	
    return dataset;
    	
}

function createDataset(fields, constraints, sortFields) {
}

function onMobileSync(user) {

    var sortingFields = new Array();

    var constraints = new Array();
	log.info( 'inicio MOEDA logix 2.......'+user.userCode );
	constraints.push( DatasetFactory.createConstraint("MATRICULA", user.userCode, user.userCode, ConstraintType.MUST) );    

	
    var colunastitulo = new Array('COD_MOEDA', 'COD_REPRES', 'DEN_MOEDA', 'DEN_MOEDA_ABREV', 'MATRICULA', 'IES_MOEDA_DEFAULT' );
    
    var result = {
        'fields' : colunastitulo,
        'constraints' : constraints,
        'sortingFields' : sortingFields
    };
    log.info( result );
    return result;
	
}


function testaDataset( codDataSet ) {
    var dataset = DatasetFactory.getDataset(codDataSet, null, null, null);
    return dataset.rowsCount;
}