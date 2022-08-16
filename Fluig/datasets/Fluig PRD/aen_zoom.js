function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
	
	var newDataset = DatasetBuilder.newDataset();
	var newConstraints   = new Array();
		
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
			if ( constraints[i].getFieldName().toString() == 'not_aen' ){
				var not_empresas = constraints[i].initialValue;
				var myarray = not_empresas.split('-');
				for(var j = 0; j < myarray.length; j++)
				{
				   newConstraints.push( DatasetFactory.createConstraint("cod_aen", myarray[j], myarray[j], ConstraintType.MUST_NOT) );
				}
			}							
        }
	}
	
	newDataset.addColumn("cod_aen");
	newDataset.addColumn("nivel_1");
	newDataset.addColumn("nivel_2");
	newDataset.addColumn("nivel_3");
	newDataset.addColumn("nivel_4");
	newDataset.addColumn("eh_mix");
    newDataset.addColumn("den_grupo");
    newDataset.addColumn("aen_compl");

	
    //Define os campos para ordenação
    var sortingFields = new Array("cod_aen");
     
    //Busca o dataset
    var dataset = DatasetFactory.getDataset("aen", null, newConstraints, sortingFields);
    
    for(var i = 0; i < dataset.rowsCount; i++) {
        newDataset.addRow(
    			new Array(
    					dataset.getValue(i, "cod_aen"),
    					dataset.getValue(i, "nivel_1"),
    					dataset.getValue(i, "nivel_2"),
    					dataset.getValue(i, "nivel_3"),
    					dataset.getValue(i, "nivel_4"),
    					dataset.getValue(i, "eh_mix"),
    					dataset.getValue(i, "den_grupo"),
    					dataset.getValue(i, "aen_compl")
    			)
    		);
    }
	
    return newDataset;		

}
function onMobileSync(user) {

}