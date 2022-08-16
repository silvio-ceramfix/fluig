function defineStructure() {
	
	addColumn("cod_moeda");
    addColumn("den_moeda");
    addColumn("den_moeda_abrev");
    setKey([ "cod_moeda" ]);
    addIndex([ "cod_moeda" ]);
    
}

function onSync(lastSyncDate) {

    var dataset = DatasetBuilder.newDataset();
    
	try{
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixPRD");
		var connectionWD = dataSourceWD.getConnection();
	} catch (e){
		log.info( "ERROOOOOO"+ e.getMessage() );
	}	

	
	var SQL = " select m.cod_moeda, m.den_moeda, m.den_moeda_abrev from moeda m ";
    log.info( SQL );
	 
	var statementWD = connectionWD.prepareStatement(SQL);
	var rsWD = statementWD.executeQuery();

	while(rsWD.next()){
		dataset.addOrUpdateRow(
			new Array(
				rsWD.getString("cod_moeda"),
				rsWD.getString("den_moeda"),
				rsWD.getString("den_moeda_abrev")
			)
		);
	}
	
	rsWD.close();
	statementWD.close();
	connectionWD.close();
	
    return dataset;
    	
}

function createDataset(fields, constraints, sortFields) {
	
  	

}

function onMobileSync(user) {

    var sortingFields = new Array();
    var constraints = new Array();
    var colunastitulo = new Array('cod_moeda', 'den_moeda', 'den_moeda_abrev' );
    
    var result = {
        'fields' : colunastitulo,
        'constraints' : constraints,
        'sortingFields' : sortingFields
    };
    log.info( result );
    return result;
	
}