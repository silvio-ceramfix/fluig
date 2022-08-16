function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
	
	var newDataset = DatasetBuilder.newDataset();
	var newConstraints   = new Array();
		
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
        	log.info( 'Cons '+constraints[i].getFieldName().toString() );
			if ( constraints[i].getFieldName().toString().substring(0,7) == 'SHOULD_' ){
				
				var campo = constraints[i].getFieldName().replace('SHOULD_','');
				var valor =	constraints[i].initialValue;
				log.info( 'Campo '+campo+' Valor '+valor );
 			    newConstraints.push( DatasetFactory.createConstraint(campo, valor, valor, ConstraintType.SHOULD) );
			}else{
				log.info( 'Direto ' );
				newConstraints.push( constraints[i] );
			}
        }
	}
		     
	log.info( 'Busca................ ' );
    //Busca o dataset
    var dataset = DatasetFactory.getDataset("lista_de_preco_item", fields, newConstraints, sortFields);
    
    return dataset;		

}
function onMobileSync(user) {

}