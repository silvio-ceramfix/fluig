function defineStructure() {
	
	addColumn("COD_CIDADE");
    addColumn("COD_BAIRRO");
    addColumn("DEN_BAIRRO");
    setKey([ "COD_CIDADE", "COD_BAIRRO" ]);
    addIndex([ "COD_CIDADE", "COD_BAIRRO" ]);
    addIndex([ "COD_CIDADE", "DEN_BAIRRO" ]);
    
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
	
	var SQL = " select distinct nvl( trim( cod_cidade ),' ' ) as cod_cidade," +
	  						  " nvl( trim( den_bairro ),' ' ) as cod_bairro, " +
	 						  " nvl( trim( den_bairro ),' ' ) as den_bairro from bairros ";	
    log.info( SQL );
	 
	var statementWD = connectionWD.prepareStatement(SQL);
	var rsWD = statementWD.executeQuery();
	
	log.info( "AQUIIII......................1" );
	
	while(rsWD.next()){
		log.info( "AQUIIII......................2" );
		dataset.addOrUpdateRow(
			new Array(
				rsWD.getString("cod_cidade"),
				rsWD.getString("cod_bairro"),
				rsWD.getString("den_bairro")
			)
		);
	}
	log.info( "AQUIIII......................3" );
	rsWD.close();
	statementWD.close();
	connectionWD.close();
	log.info( "AQUIIII......................4" );
    return dataset;
    	
}

function createDataset(fields, constraints, sortFields) {
	    
}

function onMobileSync(user) {

    var sortingFields = new Array();
    var constraints = new Array();
    var colunastitulo = new Array('COD_CIDADE', 'COD_BAIRRO', 'DEN_BAIRRO');
    
    var result = {
        'fields' : colunastitulo,
        'constraints' : constraints,
        'sortingFields' : sortingFields
    };
    log.info( result );
    return result;
	
}