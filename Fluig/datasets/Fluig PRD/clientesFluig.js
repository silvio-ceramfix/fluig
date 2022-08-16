function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
	
	var newDataset = DatasetBuilder.newDataset();
	var newConstraints = new Array();
	
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
        	newConstraints.push( constraints[i] );
        }
	}
	
	newConstraints.push( DatasetFactory.createConstraint("situacao_cadastro", "A", "A", ConstraintType.MUST) );
	  
    //Define os campos para ordenação
    var sortingFields = new Array("cnpj",'metadata#id');
     
    //Busca o dataset
    var dataset = DatasetFactory.getDataset("clientes", null, newConstraints, sortingFields);
        
    for (var j = 0; j < dataset.getColumnsCount(); j++) {
    	newDataset.addColumn( dataset.getColumnName(j) );
    }
    
    for(var i = 0; i < dataset.rowsCount; i++) {
    	if ( i == dataset.rowsCount - 1
    	 || dataset.getValue(i, "cnpj") != dataset.getValue(i+1, "cnpj")  ){
    	
    		var cliente = new Array();    		
    		for (var j = 0; j < dataset.getColumnsCount(); j++) {
    			cliente.push( dataset.getValue(i, dataset.getColumnName(j) ) );
    	    }
    		newDataset.addRow( cliente );
    	}
    }
    return newDataset;		
}

function onMobileSync(user) {

}