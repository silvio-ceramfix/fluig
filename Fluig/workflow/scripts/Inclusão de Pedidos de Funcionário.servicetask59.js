function servicetask59(attempt, message) {
	
	log.info( "INICIO AUXILIAR....." );
	
	var msg_erro = "";
	
	try{	
		
		var clientService = fluigAPI.getAuthorizeClientService();
		
		var constraints = new Array();
		var cod_empresa = hAPI.getCardValue( "empresa" );
		var lista_preco = hAPI.getCardValue( "lista_preco" );
		constraints.push( DatasetFactory.createConstraint("cod_empresa", cod_empresa, cod_empresa, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint("num_list_preco", lista_preco, lista_preco, ConstraintType.MUST) );
		var lista = DatasetFactory.getDataset("lista_de_preco", null, constraints, null);
			
		if ( lista != null ){
			log.info('Data Set. Inc. Pedido 00000');
			var data = {
				companyId : "1",
				serviceCode : "Logix_PRD",
				endpoint : "/logixrest/cerr4/descarga",
				method : "post",//"post", "delete", "patch", "put", "get"
				timeoutService: "240"
			}; 
						
			log.info('Data Set. Inc. Pedido');
			var params = {};
			var lr_descarga = {};
			lr_descarga["empresa"] = getValueForm( "empresa", "" )+"";
			lr_descarga["num_pedido"] = getValueForm( "num_pedido", "" )+"";
			lr_descarga["ies_valor"] = lista.getValue(0, "ind_descaga")+"";
			var numDesc = "0";
			if ( lista.getValue(0, "ind_descaga")+"" == "S"  ){
				numDesc = "1";
			}
			lr_descarga["num_descarga"] = numDesc;
			lr_descarga["tipo_frete"] = getValueForm( "tipo_frete" )+"";
			lr_descarga["usuario"] = getValueForm("login")+"";
			log.info('Data Set. Inc. Pedido 00003');
			params["lr_descarga"] = lr_descarga;
			data["params"] = params;
		    
			log.info("## antes do stringify ## "+data.toString() );
			var jj = JSON.stringify( data );
			log.info('Data Set. Inc. Pedido 00004');
			log.info("## RESULT POST jj ## "+ jj );
			var vo = clientService.invoke( jj );
			log.info('Data Set. Inc. Pedido 00005');
			if(vo.getResult()== "" || vo.getResult().isEmpty()){
				throw "Retorno está vazio";
			}
		}
	} catch(err) {
		msg_erro += err.toString(); 
	}
	
	try{	

		if ( ( getValueForm( "seq_end", "0" ) == "0" 
		    || getValueForm( "seq_end", "0" ) == "" ) 
		    && getValueForm( "tipo_logradouro_ent", "" ) != "" ){
			
			var clientService = fluigAPI.getAuthorizeClientService();
			
			var data = {
				companyId : "1",
				serviceCode : "Logix_PRD",
				endpoint : "/logixrest/cerr3/endcli",
				method : "post", //"post", "delete", "patch", "put", "get"
				timeoutService: "240"
			}; 
	
		    var params = {};
		    
		    var lr_endereco = {};
		    lr_endereco["cod_cliente"] = getValueForm( "cod_cliente", "" )+"";
		    lr_endereco["tip_endereco_end_cob"] = "E";
		    lr_endereco["sequencia_end_cob"] = "0";
		    lr_endereco["tip_logradouro_end_cob"] = getValueForm( "tipo_logradouro_ent", "" )+"";
		    log.info( getValueForm( "endereco_ent", "" )+"" );
		    lr_endereco["logradouro_end_cob"] = getValueForm( "endereco_ent", "" )+"";
		    lr_endereco["num_iden_lograd_end_cob"] = getValueForm( "numero_ent", "" )+"";
		    lr_endereco["complemento_endereco_end_cob"] = "";
		    lr_endereco["bairro_cobr_entga"] = getValueForm( "bairro_ent", getValueForm( "bairro_ent_sel", "" ) )+"";
		    lr_endereco["cod_cidade_end_cob"] = getValueForm( "cod_cidade_ent", "" )+"";
		    lr_endereco["cod_cep_end_cob"] = getValueForm( "cep_ent", "" )+"";
		    
		    params["lr_endereco"] = lr_endereco;
		    data["params"] = params;
		    
		    log.info("## antes do stringify ## "+data.toString() );
		    var jj = JSON.stringify( data );
	
		    log.info("## RESULT POST jj ## "+ jj );
		    var vo = clientService.invoke( jj );
		    
		    if(vo.getResult()== "" || vo.getResult().isEmpty()){
		        throw "Retorno está vazio";
		    }
		}
	} catch(err) {
	    msg_erro += err.toString();
	}
	
	if (  msg_erro != "" ){
		throw msg_erro;
	}
	
	function getValueForm( campo, padrao ){
		log.info( "Campo........"+campo );
		var valor = hAPI.getCardValue( campo );
		if( padrao == "tipoPessoa" ) 
			if ( valor.indexOf("/0000-") == -1 )
				valor = "F";
			else
				valor = "J";
		log.info( "Valor........"+valor );
		if ( valor == "" ){
			valor = padrao;
			log.info( "Valor padrao........"+valor );
		}
		return valor;
	}
	
	function setComment( user, processo, comentario ){
		 var constraints = new Array();
		 constraints.push( DatasetFactory.createConstraint( 'processo', processo, processo, ConstraintType.MUST) );
		 constraints.push( DatasetFactory.createConstraint( 'user', user, user, ConstraintType.MUST) );
		 constraints.push( DatasetFactory.createConstraint( 'comentario', comentario, comentario, ConstraintType.MUST) );
	    var dataset = DatasetFactory.getDataset( 'setComent', null, constraints, null);
		if ( dataset != null ){
			return dataset.getValue(0, 'retorno' );
		}
	}
	
	
}