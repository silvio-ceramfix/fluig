function defineStructure() {
	
	addColumn("cod_cliente");
	addColumn("cod_cnd_pgto");
    addColumn("den_cnd_pgto");
    addColumn("ies_emite_dupl");
    addColumn("ies_default");
    
    setKey([ "cod_cliente","cod_cnd_pgto" ]);
    addIndex([ "cod_cnd_pgto" ]);
    addIndex([ "cod_cliente","cod_cnd_pgto" ]);
    
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

	
	var SQL = " select ccp.cod_cliente, ccp.cod_cnd_pgto, cp.den_cnd_pgto, cp.ies_emite_dupl, "+ 
       		  "        case when ccp.rowid = (select min(x.rowid) from cli_cond_pgto x where x.cod_cliente = ccp.cod_cliente ) then 'S' else 'N' end as ies_default "+
              "   from cli_cond_pgto ccp "+
              "   join cond_pgto cp on (cp.cod_cnd_pgto = ccp.cod_cnd_pgto) ";
    log.info( SQL );
	 
	var statementWD = connectionWD.prepareStatement(SQL);
	var rsWD = statementWD.executeQuery();

	while(rsWD.next()){
		dataset.addOrUpdateRow(
			new Array(
				rsWD.getString("cod_cliente"),
				rsWD.getString("cod_cnd_pgto"),
				rsWD.getString("den_cnd_pgto"),
				rsWD.getString("ies_emite_dupl"),
				rsWD.getString("ies_default")
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
    var colunastitulo = new Array('cod_cliente', 'cod_cnd_pgto', 'den_cnd_pgto', 'ies_emite_dupl', 'ies_default');
    
    var result = {
        'fields' : colunastitulo,
        'constraints' : constraints,
        'sortingFields' : sortingFields
    };
    log.info( result );
    return result;
	
}