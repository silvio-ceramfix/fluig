function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
	
	var newDataset = DatasetBuilder.newDataset();
	var newConstraints   = new Array();
		
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
			if ( constraints[i].getFieldName().toString() == 'not_moeda' ){
				var not_empresas = constraints[i].initialValue;
				var myarray = not_empresas.split('-');
				for(var j = 0; j < myarray.length; j++)
				{
				   newConstraints.push( DatasetFactory.createConstraint("cod_moeda", myarray[j], myarray[j], ConstraintType.MUST_NOT) );
				}
			}							
        }
	}
	
	newDataset.addColumn("cod_moeda");
	newDataset.addColumn("den_moeda");
	newDataset.addColumn("den_moeda_abrev");

	
    //Define os campos para ordenação
    var sortingFields = new Array("cod_moeda");
     
    //Busca o dataset
    var dataset = DatasetFactory.getDataset("moeda", null, newConstraints, sortingFields);
    
    for(var i = 0; i < dataset.rowsCount; i++) {
        newDataset.addRow(
    			new Array(
    					dataset.getValue(i, "cod_moeda"),
    					dataset.getValue(i, "den_moeda"),
    					dataset.getValue(i, "den_moeda_abrev")
    			)
    		);
    }
	
    return newDataset;		

}
function onMobileSync(user) {

}