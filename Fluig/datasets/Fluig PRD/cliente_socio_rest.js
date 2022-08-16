function defineStructure() {}
function onSync(lastSyncDate) {}

function createDataset(fields, constraints, sortFields) {
 
	var cliente = '000000000000000';
	
	log.info( "passo 0001 ");
	
	if (constraints != null) {			
        for (var i = 0; i < constraints.length; i++) {
    		if ( constraints[i].fieldName == 'cod_cliente' ){
    				cliente = constraints[i].initialValue;
    		}
        }
	}
	
	log.info( "passo 0002 ");	
	var dataset = DatasetBuilder.newDataset();

	
	dataset.addColumn( "cod_cliente" );
	dataset.addColumn( "dat_atualiz" );
	dataset.addColumn( "dat_negativo" );
	dataset.addColumn( "ies_negativo" );
	dataset.addColumn( "nom_socio" );
	dataset.addColumn( "num_cpf_socio" );
			
	log.info( "passo 0003 ");
	
	try{
	    var clientService = fluigAPI.getAuthorizeClientService();
	    var data = {
	    	companyId : "1",
	        serviceCode : 'Logix_PRD',
	        endpoint : '/LOGIXREST/cerr3/cliente/'+cliente,
	        method : 'get' //'post', 'delete', 'patch', 'put', 'get'     
	    }
		log.info( "passo 0004 ");
	    var vo = clientService.invoke( JSON.stringify( data ) );
	    if(vo.getResult()== null || vo.getResult().isEmpty()){
	        throw new Exception("Retorno está vazio");
	    }else{
	    	log.info( "passo 0005 ");
	    	var jr = JSON.parse( vo.getResult() );
	    	log.info( "passo 0006 "+jr.data.credcad_socios.length );
	        for (var i = 0; i < jr.data.credcad_socios.length; i++){
	        	dataset.addRow(
	    			new Array( jr.data.credcad_socios[i].cod_cliente,
	    					   jr.data.credcad_socios[i].dat_atualiz,
	    					   jr.data.credcad_socios[i].dat_negativo,
	    					   jr.data.credcad_socios[i].ies_negativo,
	    					   jr.data.credcad_socios[i].nom_socio,
	    					   jr.data.credcad_socios[i].num_cpf_socio ) );
	        }
	    	log.info( "passo 0007 ");
	    }
	} catch(err) {
	    throw new Exception(err);
	}
	log.info( "passo 0008 ");
	return dataset;
	
}

function onMobileSync(user) {}