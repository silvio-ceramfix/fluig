function defineStructure() {
	
	addColumn("cod_uni_feder");
    addColumn("den_uni_feder");
    addColumn("cod_pais");
    addColumn("cod_regiao");
    addColumn("cod_continente");
    addColumn("cod_mercado");
    
    setKey([ "cod_uni_feder" ]);
    addIndex([ "cod_uni_feder" ]);
    
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

	
	var SQL = " select n.cod_uni_feder, n.den_uni_feder, n.cod_pais, " +
			  " trim( nvl( eis_f_get_depara('UNI_FEDER', 'cod_uni_feder', 'FLUIG_REGIAO', n.cod_uni_feder), '1') ) as cod_regiao, " +
			  " trim( nvl( eis_f_get_depara('UNI_FEDER', 'cod_uni_feder', 'FLUIG_CONTINENTE', n.cod_uni_feder), '1') ) as cod_continente, " +
			  " trim( nvl( eis_f_get_depara('UNI_FEDER', 'cod_uni_feder', 'FLUIG_MERCADO', n.cod_uni_feder), 'IN') ) as cod_mercado " +
  			  " from uni_feder n ";
    log.info( SQL );
	 
	var statementWD = connectionWD.prepareStatement(SQL);
	var rsWD = statementWD.executeQuery();

	while(rsWD.next()){
		dataset.addOrUpdateRow(
			new Array(
				rsWD.getString("cod_uni_feder"),
				rsWD.getString("den_uni_feder"),
				rsWD.getString("cod_pais"),
				rsWD.getString("cod_regiao"),
				rsWD.getString("cod_continente"),
				rsWD.getString("cod_mercado")
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
    var colunastitulo = new Array('cod_uni_feder', 'den_uni_feder', 'cod_pais', 'cod_regiao', 'cod_continente', 'cod_mercado' );
    
    var result = {
        'fields' : colunastitulo,
        'constraints' : constraints,
        'sortingFields' : sortingFields
    };
    log.info( result );
    return result;
	
}