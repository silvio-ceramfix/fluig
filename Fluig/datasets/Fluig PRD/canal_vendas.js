function defineStructure() {

	addColumn("nivel");
    addColumn("cod_nivel_1"); 
    addColumn("cod_nivel_2");
    addColumn("cod_nivel_3");
    addColumn("cod_nivel_4");
    addColumn("cod_nivel_5");
    addColumn("cod_nivel_6");
    addColumn("cod_nivel_7");
    addColumn("den_canal_vendas"); 
    addColumn("cod_nivel_compl");
    addColumn("nivel_compl");
    setKey([ "cod_nivel_compl" ]);
    addIndex([ "cod_nivel_compl" ]);
    addIndex([ "nivel","cod_nivel_1" ]);
    addIndex([ "nivel","cod_nivel_2" ]);
    addIndex([ "nivel","cod_nivel_3" ]);
    addIndex([ "nivel","cod_nivel_4" ]);
    addIndex([ "nivel","cod_nivel_5" ]);
    addIndex([ "nivel","cod_nivel_6" ]);
    addIndex([ "nivel","cod_nivel_7" ]);
	
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

	
	var SQL = 	" select  nivel, "+ 
		      	"         cod_nivel_1, "+ 
	      		"         cod_nivel_2, "+
	      		"         cod_nivel_3, "+
	      		"         cod_nivel_4, "+
	      		"         cod_nivel_5, "+
	      		"         cod_nivel_6, "+
	      		"         cod_nivel_7, "+
	      		"         den_canal_vendas, "+ 
	      		"         cod_nivel_compl, "+
	      		"         nivel_compl "+
	      		"         from eis_v_canal_vendas ";
	
    log.info( SQL );
	 
	var statementWD = connectionWD.prepareStatement(SQL);
	var rsWD = statementWD.executeQuery();

	while(rsWD.next()){
		dataset.addOrUpdateRow(
			new Array(
					rsWD.getString("nivel"),
					rsWD.getString("cod_nivel_1"), 
					rsWD.getString("cod_nivel_2"),
					rsWD.getString("cod_nivel_3"),
					rsWD.getString("cod_nivel_4"),
					rsWD.getString("cod_nivel_5"),
					rsWD.getString("cod_nivel_6"),
					rsWD.getString("cod_nivel_7"),
					rsWD.getString("den_canal_vendas"), 
					rsWD.getString("cod_nivel_compl"),
					rsWD.getString("nivel_compl")
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
    var colunastitulo = new Array('nivel', 'cod_nivel_1', 'cod_nivel_2', 'cod_nivel_3', 'cod_nivel_4', 'cod_nivel_5', 'cod_nivel_6', 'cod_nivel_7', 'cod_nivel_8', 'cod_nivel_9', 'den_canal_vendas', 'cod_nivel_compl', 'nivel_compl' );
    
    var result = {
        'fields' : colunastitulo,
        'constraints' : constraints,
        'sortingFields' : sortingFields
    };
    log.info( result );
    return result;
    
}