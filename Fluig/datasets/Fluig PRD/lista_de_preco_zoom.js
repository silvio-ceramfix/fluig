function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {


	var newDataset = DatasetBuilder.newDataset();
	var newConstraints   = new Array();
		
	
	
	
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
			if ( constraints[i].getFieldName().toString() == 'not_empresa_lista' ){
				var not_empresas = constraints[i].initialValue;
				var myarray = not_empresas.split('-');
				for(var j = 0; j < myarray.length; j++)
				{
				   newConstraints.push( DatasetFactory.createConstraint("cod_empresa_lista", myarray[j], myarray[j], ConstraintType.MUST_NOT) );
				}
			}
			if ( constraints[i].getFieldName().toString() == 'empresa' ){
				var not_empresas = constraints[i].initialValue;
				var myarray = not_empresas.split('-');
				for(var k = 0; k < myarray.length; k++)
				{
					log.info( 'COD_EMPRESA ###############'+myarray[k] );
					newConstraints.push( DatasetFactory.createConstraint("cod_empresa", myarray[k], myarray[k], ConstraintType.SHOULD) );	
				}
			}
        }
	}

	newDataset.addColumn("cod_empresa");
	newDataset.addColumn("num_list_preco");
	newDataset.addColumn("den_list_preco");
	newDataset.addColumn("dat_ini_vig");
	newDataset.addColumn("dat_fim_vig");
	newDataset.addColumn("cod_empresa_lista");

    //Define os campos para ordenação
    var sortingFields = new Array("cod_empresa","num_list_preco");
     
    //Busca o dataset
    var dataset = DatasetFactory.getDataset("lista_de_preco", null, newConstraints, sortingFields);
    
    for(var i = 0; i < dataset.rowsCount; i++) {
        newDataset.addRow(
    			new Array(
    					dataset.getValue(i, "cod_empresa"),
    					dataset.getValue(i, "num_list_preco"),
    					dataset.getValue(i, "den_list_preco"),
    					dataset.getValue(i, "dat_ini_vig"),
    					dataset.getValue(i, "dat_fim_vig"),
    					dataset.getValue(i, "cod_empresa_lista")
    			)
    		);
    }
    return newDataset;	
}

function onMobileSync(user) {

}