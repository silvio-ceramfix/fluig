function defineStructure() {

	addColumn("cod_motivo");
    addColumn("den_motivo");
    setKey([ "cod_motivo" ]);
    addIndex([ "cod_motivo" ]);
	
}

function onSync(lastSyncDate) {

    var dataset = DatasetBuilder.newDataset();
    
	try{
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixPRD");
		var connectionWD = dataSourceWD.getConnection();
		
		var SQL = " select cod_motivo, den_motivo from mot_cancel  ";
    	log.info( SQL );
	 
		var statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = statementWD.executeQuery();

		while(rsWD.next()){
			dataset.addOrUpdateRow(
				new Array(
					rsWD.getString("cod_motivo"),
					rsWD.getString("den_motivo")
				)
			);
		}
	
		rsWD.close();
		statementWD.close();
		connectionWD.close();
	
    	return dataset;
	
	} catch (e){
		log.info( "ERROOOOOO"+ e.getMessage() );
	} finally {
		if (statementWD != null) {
			statementWD.close();
		}
		if (connectionWD != null) {
			connectionWD.close();
		}
	}	
}
function createDataset(fields, constraints, sortFields) {

    var dataset = DatasetBuilder.newDataset();

    dataset.addColumn("cod_motivo");
    dataset.addColumn("den_motivo");

    
	try{
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixPRD");
		var connectionWD = dataSourceWD.getConnection();
	
	
		var SQL = " select cod_motivo, den_motivo from mot_cancel ";
		log.info( SQL );
	 
		var statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = statementWD.executeQuery();

		while(rsWD.next()){
			dataset.addRow(
				new Array(
					rsWD.getString("cod_motivo"),
					rsWD.getString("den_motivo")
				)
			);
		}
	
		rsWD.close();
		statementWD.close();
		connectionWD.close();
	
		return dataset;
		
	} catch (e){
		log.info( "ERROOOOOO"+ e.getMessage() );
	} finally {
		if (statementWD != null) {
			statementWD.close();
		}
		if (connectionWD != null) {
			connectionWD.close();
		}
	}	

	
}

function onMobileSync(user) {

    var sortingFields = new Array();
    var constraints = new Array();
    var colunastitulo = new Array('cod_motivo', 'den_motivo' );
    
    var result = {
        'fields' : colunastitulo,
        'constraints' : constraints,
        'sortingFields' : sortingFields
    };
    log.info( result );
    return result;
	
}