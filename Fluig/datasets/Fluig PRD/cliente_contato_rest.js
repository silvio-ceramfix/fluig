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
	dataset.addColumn( "num_contato" );
	dataset.addColumn( "nom_contato" );
	dataset.addColumn( "cod_cargo" );
	dataset.addColumn( "dat_nascimento" );
	dataset.addColumn( "cod_hobby" );
		
	log.info( "passo 0003 ");
	
	try{
	    var clientService = fluigAPI.getAuthorizeClientService();
	    var data = {
	    	companyId  : "1",
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
	    	log.info( "passo 0006 "+jr.data.cli_contatos.length );
	        for (var i = 0; i < jr.data.cli_contatos.length; i++){
	        	dataset.addRow(
	    			new Array( jr.data.cod_cliente,
	    					   jr.data.cli_contatos[i].num_contato,
	    					   jr.data.cli_contatos[i].nom_contato,
	    					   jr.data.cli_contatos[i].cod_cargo,
	    					   jr.data.cli_contatos[i].dat_nascimento,
	    					   jr.data.cli_contatos[i].cod_hobby ) );
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