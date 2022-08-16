function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
	
	var newDataset = DatasetBuilder.newDataset();
	var newConstraints   = new Array();
		
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
			if ( constraints[i].getFieldName().toString() == 'not_local' ){
				var not_empresas = constraints[i].initialValue;
				var myarray = not_empresas.split('-');
				for(var j = 0; j < myarray.length; j++)
				{
				   newConstraints.push( DatasetFactory.createConstraint("cod_local", myarray[j], myarray[j], ConstraintType.MUST_NOT) );
				}
			}
			if ( constraints[i].getFieldName().toString() == 'cod_empresa' ){
				newConstraints.push( DatasetFactory.createConstraint("cod_empresa", constraints[i].initialValue, constraints[i].initialValue, ConstraintType.MUST) );
			}
        }
	}
	
	newDataset.addColumn("cod_empresa");
	newDataset.addColumn("cod_local");
	newDataset.addColumn("den_local");
		
    //Define os campos para ordenação
    var sortingFields = new Array("cod_local");
     
    //Busca o dataset
    var dataset = DatasetFactory.getDataset("local_estoque", null, newConstraints, sortingFields);
    
    for(var i = 0; i < dataset.rowsCount; i++) {
        newDataset.addRow(
    			new Array(
    					dataset.getValue(i, "cod_empresa"),
    					dataset.getValue(i, "cod_local"),
    					dataset.getValue(i, "den_local")
    			)
    		);
    }
    
    return newDataset;
    
}

function onMobileSync(user) {

}