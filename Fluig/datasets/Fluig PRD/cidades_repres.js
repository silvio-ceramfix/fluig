function defineStructure() {
	
	addColumn("cod_cidade");
    addColumn("den_cidade");
    addColumn("cod_uni_feder");
    addColumn("cod_pais");
    addColumn("cod_repres");
    addColumn("cod_user");
    setKey([ "cod_cidade","cod_repres","cod_user" ]);
    //addIndex([ "cod_cidade","cod_repres","cod_user" ]);
    addIndex([ "cod_cidade" ]);
    
    
}

function onSync(lastSyncDate) {

    var dataset = DatasetBuilder.newDataset();
    
	try{
		
    	var datasetOrig = DatasetFactory.getDataset('cidades_repres', null, null, null );
    	if ( datasetOrig != null ){
    		for (var x = 0; x < datasetOrig.rowsCount; x++) {
    			var arrItem = new Array();
    			arrItem.push( datasetOrig.getValue(x, 'cod_cidade') );
    			arrItem.push( '' );
    			arrItem.push( '' );
    			arrItem.push( '' );
    			arrItem.push( datasetOrig.getValue(x, 'cod_repres') );
    			arrItem.push( datasetOrig.getValue(x, 'cod_user') );
    							
    			dataset.deleteRow( arrItem );
    			log.info('Delete '+ x +' '+datasetOrig.getValue(x, 'cod_cidade') );
    		}
    	}
	}catch (e){
    	log.info( "ERROOOOOO"+ e.getMessage() );
    }

    
	try{
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixPRD");
		var connectionWD = dataSourceWD.getConnection();
	} catch (e){
		log.info( "ERROOOOOO"+ e.getMessage() );
	}	

	
	var SQL = " select trim( n.cod_cidade ) as cod_cidade, n.den_cidade, n.cod_uni_feder, u.cod_pais, r.cod_repres " +
			    " from cidades n " +	
			    " join uni_feder u on ( n.cod_uni_feder = u.cod_uni_feder ) " +
			    " join repr_abran r on (r.cod_cidade = n.cod_cidade) ";
    log.info( SQL );
	 
	var statementWD = connectionWD.prepareStatement(SQL);
	var rsWD = statementWD.executeQuery();

	while(rsWD.next()){
		
		var cidade = new Array();
		
		cidade.push( rsWD.getString("cod_cidade") );
		cidade.push( rsWD.getString("den_cidade") );
		cidade.push( rsWD.getString("cod_uni_feder") );
		cidade.push( rsWD.getString("cod_pais") );
		cidade.push( rsWD.getString("cod_repres") );
		
		var cod_user = "";
		var constraintsPai = new Array(); 
		constraintsPai.push( DatasetFactory.createConstraint("cod_repres", rsWD.getString("cod_repres"), rsWD.getString("cod_repres"), ConstraintType.MUST) );				
	    var datasetPai = DatasetFactory.getDataset("representante_compl", null, constraintsPai, null);
		if ( datasetPai != null ){
		     for(var x = 0; x < datasetPai.rowsCount; x++) {
		    	 cod_user = datasetPai.getValue(x, "matricula" );
		    }
		}		
		 
		cidade.push( cod_user );
		 
		dataset.addOrUpdateRow( cidade );	
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
    var colunastitulo = new Array('cod_cidade', 'den_cidade', 'cod_uni_feder', 'cod_pais', 'cod_repres', 'cod_user');
        
    var result = {
        'fields' : colunastitulo,
        'constraints' : constraints,
        'sortingFields' : sortingFields
    };
    log.info( result );
    return result;
	
}