function defineStructure() {

	addColumn("cod_empresa");
    addColumn("cod_local");
    addColumn("den_local");
    setKey([ "cod_empresa", "cod_local" ]);
    addIndex([ "cod_empresa" ]);
    addIndex([ "cod_empresa", "cod_local" ]);
	
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

	
	var SQL = " select cod_empresa, cod_local, den_local from local ";
    log.info( SQL );
	 
	var statementWD = connectionWD.prepareStatement(SQL);
	var rsWD = statementWD.executeQuery();

	while(rsWD.next()){
		dataset.addOrUpdateRow(
			new Array(
				rsWD.getString("cod_empresa"),
				rsWD.getString("cod_local"),
				rsWD.getString("den_local")
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
    var colunastitulo = new Array('cod_empresa', 'cod_local', 'den_local' );
    
    var result = {
        'fields' : colunastitulo,
        'constraints' : constraints,
        'sortingFields' : sortingFields
    };
    log.info( result );
    return result;
	
}