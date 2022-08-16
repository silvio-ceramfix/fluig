function defineStructure() {
	
	addColumn("tip_logradouro");
    addColumn("des_logradouro");
    setKey([ "tip_logradouro" ]);
    addIndex([ "tip_logradouro" ]);
    addIndex([ "des_logradouro" ]);
    
    
}
//asd
function onSync(lastSyncDate) {

    var dataset = DatasetBuilder.newDataset();
    
	try{
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixPRD");
		var connectionWD = dataSourceWD.getConnection();
	} catch (e){
		log.info( "ERROOOOOO"+ e.getMessage() );
	}	

	
	var SQL = " select trim( n.tip_logradouro ) as tip_logradouro, trim( n.des_logradouro ) as des_logradouro from vdp_tip_logradouro n ";
    log.info( SQL );
	 
	var statementWD = connectionWD.prepareStatement(SQL);
	var rsWD = statementWD.executeQuery();

	while(rsWD.next()){
		dataset.addOrUpdateRow(
			new Array(
				rsWD.getString("tip_logradouro"),
				rsWD.getString("des_logradouro")
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
    var colunastitulo = new Array('tip_logradouro', 'des_logradouro');
    
    var result = {
        'fields' : colunastitulo,
        'constraints' : constraints,
        'sortingFields' : sortingFields
    };
    log.info( result );
    return result;
	
}