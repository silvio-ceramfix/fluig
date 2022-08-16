function defineStructure() {
	
	addColumn("cod_cidade");
    addColumn("den_cidade");
    addColumn("cod_uni_feder");
    addColumn("cod_pais");
    setKey([ "cod_cidade" ]);
    addIndex([ "cod_cidade" ]);
    addIndex([ "cod_uni_feder","den_cidade" ]);
    
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

	
	var SQL = " select trim( n.cod_cidade ) as cod_cidade, trim( n.den_cidade ) as den_cidade, n.cod_uni_feder, u.cod_pais " +
			    " from cidades n " +	
			    " join uni_feder u on ( n.cod_uni_feder = u.cod_uni_feder ) ";
    log.info( SQL );
    log.info( 'aqui');
	 
	var statementWD = connectionWD.prepareStatement(SQL);
	var rsWD = statementWD.executeQuery();

	while(rsWD.next()){
		dataset.addOrUpdateRow(
			new Array(
				rsWD.getString("cod_cidade"),
				rsWD.getString("den_cidade"),
				rsWD.getString("cod_uni_feder"),
				rsWD.getString("cod_pais")
			)
		);
	}
	
	rsWD.close();
	statementWD.close();
	connectionWD.close();
	
    return dataset;
    	
}

function createDataset(fields, constraints, sortFields) {
	
    var dataset = DatasetBuilder.newDataset();

    dataset.addColumn("cod_cidade");
    dataset.addColumn("den_cidade");
    dataset.addColumn("cod_uni_feder");
    dataset.addColumn("cod_pais");
    
    var den_cidade = 'X';
    var cod_uf = 'X';
    
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
        	log.info( 'CONS........ '+constraints[i].getFieldName().toString() );
			if ( constraints[i].getFieldName().toString() == 'den_cidade' ){
				den_cidade = constraints[i].initialValue;
				log.info( 'valor ......' +constraints[i].initialValue );
			}
			if ( constraints[i].getFieldName().toString() == 'cod_uni_feder' ){
				cod_uf = constraints[i].initialValue;
				log.info( 'valor ......' +constraints[i].initialValue );
			}							
        }
	}
   
    
	try{
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixPRD");
		var connectionWD = dataSourceWD.getConnection();
	} catch (e){
		log.info( "ERROOOOOO"+ e.getMessage() );
	}	

	
	var SQL = " select trim( n.cod_cidade ) as cod_cidade, n.den_cidade, n.cod_uni_feder, u.cod_pais " +
    		    " from cidades n " +	
    		    " join uni_feder u on ( n.cod_uni_feder = u.cod_uni_feder ) "+
			  "	 where 1=1 ";
	if ( den_cidade != 'X' )
		SQL += " and den_cidade like '%"+den_cidade+"%'"; 
	if ( cod_uf != 'X' )
		SQL += " and cod_uni_feder like '%"+cod_uf+"%'";
	SQL += " group by n.den_cidade, n.cod_uni_feder "+
		   " order by n.den_cidade "; 
	
    log.info( SQL );
	 
	var statementWD = connectionWD.prepareStatement(SQL);
	var rsWD = statementWD.executeQuery();

	while(rsWD.next()){
		dataset.addRow(
			new Array(
				rsWD.getString("cod_cidade"),
				rsWD.getString("den_cidade"),
				rsWD.getString("cod_uni_feder"),
				rsWD.getString("cod_pais")
			)
		);
	}
	
	rsWD.close();
	statementWD.close();
	connectionWD.close();
	
    return dataset;

    
}

function onMobileSync(user) {

    var sortingFields = new Array();
    var constraints = new Array();
    var colunastitulo = new Array('cod_cidade', 'den_cidade', 'cod_uni_feder', 'cod_pais');
    
    var result = {
        'fields' : colunastitulo,
        'constraints' : constraints,
        'sortingFields' : sortingFields
    };
    log.info( result );
    return result;
	
}