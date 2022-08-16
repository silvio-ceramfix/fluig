function servicetask31(attempt, message) {
	
	var numProcess = getValue("WKNumProces");
	
	log.info( 'CARD_DATA...............'+numProcess );
	
	var dtNow = new java.util.Date();
	var sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
	var dataTxt = ""+sdf.format(dtNow).substring(0,10);
	
	try{
		log.info("## RESULT POST 2 ## " );
	    var clientService = fluigAPI.getAuthorizeClientService();
	    log.info("## RESULT POST 3 ## "+getValueForm('tipo_cadastro','') );
	    log.info( "Antes Data........"+getValueForm( "cnpj", "" ).replace(".","").replace("/","").replace("-","") );
	    var data = {
	    	companyId : getValue("WKCompany") + "",
	        serviceCode : "Logix_PRD",
	        endpoint : "/LOGIXREST/cerr3/cliente"
	        //method : "post" //"post", "delete", "patch", "put", "get"
	     }; 

	    if ( getValueForm( 'tipo_cadastro', 'N' ) == 'A'){
	    	data["method"] = "put"; //"post", "delete", "patch", "post", "get"
	    }else{
	    	data["method"] = "post"; //"post", "delete", "patch", "put", "get"
	    }
	    
	    var params = {};
	    
	     var lr_cliente = {};
	     lr_cliente["cod_cliente"] = getValueForm( "cnpj", "" ).replace(".","").replace("/","").replace("-","")+"";  
	     lr_cliente["cod_class"] = getValueForm( "cod_class", "" )+"";
	     

	    // var campoCheckbox = form.getValue("editName") == "on" ? true : false;
	     //log.info( form );     form.getValue
	     log.info( 'Agora....'+getValueForm( "valEditName", "" ) );
	     if ( getValueForm( "valEditName", "X" ) == 'N' )
	     	lr_cliente["nom_cliente"] = getValueForm( "razao_social_zoom", "" )+"";
	     else
	     	lr_cliente["nom_cliente"] = getValueForm( "razao_social", "" )+"";
	     
	     //lr_cliente["nom_cliente"] = '';
	     
	     lr_cliente["end_cliente"] = getValueForm( "endereco", "" )+"";
	     lr_cliente["den_bairro"] = getValueForm( "bairro", getValueForm( "bairro_sel", "" ) )+"";
	     lr_cliente["cod_cidade"] = getValueForm( "cod_cidade", "" )+"";
	     lr_cliente["cod_cep"] = getValueForm( "cep", "" )+"";
	     lr_cliente["num_caixa_postal"] = getValueForm( "num_caixa_postal", "" )+"";
	     lr_cliente["num_telefone"] = getValueForm( "fone", "" )+"";
	     lr_cliente["num_fax"] = getValueForm( "fax", "" )+"";
	     lr_cliente["num_telex"] = getValueForm( "rede", "" )+"";
	     lr_cliente["num_suframa"] = getValueForm( "num_suframa", "" )+"";
	     lr_cliente["cod_tip_cli"] = getValueForm( "tipo_cliente", "04" )+"";
	     lr_cliente["den_marca"] = getValueForm( "den_marca", "" )+"";
	     lr_cliente["nom_reduzido"] = getValueForm( "nom_reduzido", "" )+"";
	     lr_cliente["den_frete_posto"] = getValueForm( "den_frete_posto", "" )+"";
	     lr_cliente["num_cgc_cpf"] = getValueForm( "cnpj", "" )+"";
	     lr_cliente["ins_estadual"] = getValueForm( "ie", "" )+"";
	     lr_cliente["cod_portador"] = getValueForm( "cod_portador", " " )+"";
	     lr_cliente["ies_tip_portador"] = getValueForm( "ies_tip_portador", "" )+"";
	     lr_cliente["cod_cliente_matriz"] = getValueForm( "cod_cliente_matriz", "" )+"";
	     lr_cliente["cod_consig"] = getValueForm( "cod_consig", "" )+"";
	     lr_cliente["ies_cli_forn"] = getValueForm( "ies_cli_forn", "C" )+"";
	     lr_cliente["ies_zona_franca"] = getValueForm( "ies_zona_franca", "N" )+"";
	     lr_cliente["ies_situacao"] = getValueForm( "ies_situacao", "A" )+"";
	     lr_cliente["cod_rota"] = getValueForm( "cod_rota", "0" )+"";
	     lr_cliente["cod_praca"] = getValueForm( "cod_praca", "0" )+"";
	     lr_cliente["dat_cadastro"] = getValueForm( "dat_cadastro", dataTxt )+"";
	     lr_cliente["dat_atualiz"] = getValueForm( "dat_atualiz", dataTxt )+"";
	     lr_cliente["nom_contato"] = getValueForm( "nom_contato", "" )+"";
	     lr_cliente["dat_fundacao"] = getValueForm( "dat_fundacao", dataTxt )+"";
	     lr_cliente["cod_local"] = getValueForm( "cod_local", "0" )+"";
	     lr_cliente["correio_eletronico"] = getValueForm( "correio_eletronico", "" )+"";
	     lr_cliente["correi_eletr_secd"] = getValueForm( "correi_eletr_secd", "" )+"";
	     lr_cliente["correi_eletr_venda"] = getValueForm( "correi_eletr_venda", "" )+"";
	     lr_cliente["endereco_web"] = getValueForm( "endereco_web", "" )+"";
	     lr_cliente["telefone_2"] = getValueForm( "telefone_2", "0" )+"";
	     lr_cliente["compl_endereco"] = getValueForm( "complemento", "" )+"";
	     lr_cliente["tip_logradouro"] = getValueForm( "tipo_logradouro", "" )+"";
	     lr_cliente["num_iden_lograd"] = getValueForm( "numero", "" )+"";
	     lr_cliente["iden_estrangeiro"] = getValueForm( "iden_estrangeiro", "" )+"";
	     lr_cliente["ind_cprb"] = getValueForm( "ind_cprb", "" )+"";
	     lr_cliente["tipo_servico"] = getValueForm( "tipo_servico", "" )+"";
	     lr_cliente["ies_contrib_ipi"] = getValueForm( "ies_contrib_ipi", "N" )+"";
	     
	     //trata tipo de pessoa para gravar
	     /*var padrao = "tipoPessoa";
	     var valor = getValueForm( "cnpj", "" );
	     if( padrao == "tipoPessoa" ){ 
				log.info("INDEXOF....."+valor.indexOf("/0000-"));
				if ( valor.indexOf("/0000-") == -1 ){
					retorno = "J";
					log.info("RetornoJ......"+retorno);
				}else{
					retorno = "F";
					log.info("RetornoF......"+retorno);
				}
			log.info( "Valor........"+valor );
			log.info("Retorno......"+retorno);
			}
	     lr_cliente["ies_fis_juridica"] = retorno;*/
	     lr_cliente["ies_fis_juridica"] = getValueForm( "cnpj", "tipoPessoa" )+"";
	     //fim tipo pessoa
	     lr_cliente["cod_uni_feder"] = getValueForm( "estado", "" )+"";
	     lr_cliente["cod_pais"] = getValueForm( "cod_pais" )+"";
	     lr_cliente["nom_guerra"] = getValueForm( "nom_guerra", "" )+"";
	     lr_cliente["cod_cidade_pgto"] = getValueForm( "cod_cidade_pgto", "" )+"";
	     lr_cliente["camara_comp"] = getValueForm( "camara_comp", "" )+"";
	     lr_cliente["cod_banco"] = getValueForm( "cod_banco", "" )+"";
	     lr_cliente["num_agencia"] = getValueForm( "num_agencia", "" )+"";
	     lr_cliente["num_conta_banco"] = getValueForm( "num_conta_banco", "" )+"";
	     lr_cliente["tmp_transpor"] = getValueForm( "tmp_transpor", "1" )+"";
	     lr_cliente["tex_observ"] = getValueForm( "tex_observ", "" )+"";
	     lr_cliente["num_lote_transf"] = getValueForm( "num_lote_transf", "0" )+"";
	     lr_cliente["pct_aceite_div"] = getValueForm( "pct_aceite_div", "0" )+"";
	     lr_cliente["ies_tip_entrega"] = getValueForm( "ies_tip_entrega", "D" )+"";
	     lr_cliente["ies_dep_cred"] = getValueForm( "ies_dep_cred", "N" )+"";
	     lr_cliente["ult_num_coleta"] = getValueForm( "ult_num_coleta", "0" )+"";
	     lr_cliente["ies_gera_ap"] = getValueForm( "ies_gera_ap", "S" )+"";
	    	 
	     lr_cliente["tip_endereco_end_cob"] = "";
	     lr_cliente["sequencia_end_cob"] = "";
	     lr_cliente["tip_logradouro_end_cob"] = "";
	     lr_cliente["logradouro_end_cob"] = "";
	     lr_cliente["num_iden_lograd_end_cob"] = "";
	     lr_cliente["complemento_endereco_end_cob"] = "";
	     lr_cliente["bairro_cobr_entga"] = "";
	     lr_cliente["cod_cidade_end_cob"] = "";
	     lr_cliente["cod_cep_end_cob"] = "";
	     			 
		 codRepres = "1101";

		 log.info("Inicializador padrÃÂÃÂ£o");
    	 lr_cliente["cod_nivel_1"] = "";
	     lr_cliente["cod_nivel_2"] = "";
	     lr_cliente["cod_nivel_3"] = "";
	     lr_cliente["cod_nivel_4"] = "";
	     lr_cliente["cod_nivel_5"] = "";
	     lr_cliente["cod_nivel_6"] = "";
	     lr_cliente["cod_nivel_7"] = "";	     
	     lr_cliente["ies_nivel"] = "";		 
		 
	     log.info('passouantes0.1');
		 var constraintsPai = new Array(); 
		 constraintsPai.push( DatasetFactory.createConstraint("cod_repres", codRepres, codRepres, ConstraintType.MUST) );				
	     var datasetPai = DatasetFactory.getDataset("representante", null, constraintsPai, null);
		 if ( datasetPai != null ){
		     for(var x = 0; x < datasetPai.rowsCount; x++) {
		    	 log.info( "ADD CV"+datasetPai.getValue(x, "cv_1" )+"" );
		    	 lr_cliente["cod_nivel_1"] = datasetPai.getValue(x, "cv_1" )+"";
			     lr_cliente["cod_nivel_2"] = datasetPai.getValue(x, "cv_2" )+"";
			     lr_cliente["cod_nivel_3"] = datasetPai.getValue(x, "cv_3" )+"";
			     lr_cliente["cod_nivel_4"] = datasetPai.getValue(x, "cv_4" )+"";
			     lr_cliente["cod_nivel_5"] = datasetPai.getValue(x, "cv_5" )+"";
			     lr_cliente["cod_nivel_6"] = datasetPai.getValue(x, "cv_6" )+"";
			     lr_cliente["cod_nivel_7"] = datasetPai.getValue(x, "cv_7" )+"";	     
			     lr_cliente["ies_nivel"] = datasetPai.getValue(x, "ies_nivel" )+"";
		     }
		 }
		 log.info('passouantes');
	     lr_cliente["cod_tip_carteira"] = ( "01" )+"";
	     log.info('passou depois');
	    
		 var constraintsPai = new Array(); 
		 constraintsPai.push( DatasetFactory.createConstraint("cod_uni_feder", getValueForm( "estado", "" ), getValueForm( "estado", "" ), ConstraintType.MUST) );				
	     var datasetPai = DatasetFactory.getDataset("uf", null, constraintsPai, null);

		
	     if ( datasetPai != null ){
		     log.info('regiao X.'+ datasetPai.getValue(0, "cod_regiao")+' '+getValueForm( "estado", "" )+' '+datasetPai.getValue(0, "cod_mercado")+' '+datasetPai.getValue(0, "cod_continente")  );
		     lr_cliente["cod_mercado"] = datasetPai.getValue(0, "cod_mercado")+"";
		     lr_cliente["cod_continente"] = datasetPai.getValue(0, "cod_continente")+"";
		     lr_cliente["cod_regiao"] = datasetPai.getValue(0, "cod_regiao")+"";
		 }else{
			 log.info('regiao fixo.' );
			 lr_cliente["cod_mercado"] = "IN";
	     	 lr_cliente["cod_continente"] = "1";
	     	 lr_cliente["cod_regiao"] = "1";
		 }
	     log.info('chegou aqui 1');
	     
	     lr_cliente["qtd_dias_atr_dupl"] = ( "0" )+"";
	     lr_cliente["qtd_dias_atr_med"] = ( "0" )+"";
	     lr_cliente["val_ped_carteira"] = ( "0" )+"";
	     lr_cliente["val_dup_aberto"] = ( "0" )+"";
	     lr_cliente["dat_ult_fat"] = ( dataTxt )+"";
	     lr_cliente["val_limite_cred"] = ( "0" )+"";
	     lr_cliente["dat_val_lmt_cr"] = ( dataTxt )+"";
	     lr_cliente["ies_nota_debito"] = 'N'+"";
	     lr_cliente["ies_protesto"] = ( "S" )+"";
	     lr_cliente["ies_emis_autom_nd"] = ( "N" )+"";
	     lr_cliente["tex_obs"] = ( "" )+"";
	     lr_cliente["qtd_dias_protesto"] = ("5" )+"";
	     lr_cliente["ies_tip_cliente"] = ( "" )+"";
	     lr_cliente["cod_float"] = ( "0" )+"";
	     lr_cliente["email_boleto"] = ( "fornecedor@fornecedor.com.br" )+""; 
	     log.info('chegou aqui 2');

	      params["lr_cliente"] = lr_cliente; 
	      
	      var la_cli_contatos = [];
	      /*var indexes = hAPI.getChildrenIndexes("contatos");
	      log.info( 'Contatos..............'+indexes.length );
	      for (var i = 0; i < indexes.length; i++) {
	    	  var contato = {};	    	  
	    	  contato["num_contato"] = i+1+"";
	    	  contato["nom_contato"] = getValueForm( "nome_contato___"+indexes[i], "" )+"";
	    	  contato["cod_cargo"] = getValueForm( "tipo_contato___"+indexes[i], "" )+"";
	    	  contato["dat_nascimento"] = getValueForm( "dat_nascimento___"+indexes[i], "" )+"";
	    	  contato["num_telefone"] = getValueForm( "fone_contato___"+indexes[i], "" )+"";
	    	  contato["num_fax"] = getValueForm( "celular_contato___"+indexes[i], "" )+"";
	    	  contato["email"] = getValueForm( "email_contato___"+indexes[i], "" )+"";
	    	  contato["cod_hobby"] = getValueForm( "cod_hobby___"+indexes[i], "" )+"";
	    	  contato["num_ramal"] = getValueForm( "num_ramal___"+indexes[i], "" )+"";
	    	  contato["departnto"] = getValueForm( "departnto___"+indexes[i], "" )+"";
	    	  contato["setor"] = getValueForm( "setor___"+indexes[i], "" )+"";
	    	  contato["observacao"] = getValueForm( "observacao___"+indexes[i], "" )+"";
	    	  
	    	  la_cli_contatos.push( contato );  
	      }
	      if ( la_cli_contatos.length == 0 )
	    	  la_cli_contatos.push( {} );*/
	      la_cli_contatos.push( {} );
	      params["la_cli_contatos"] = la_cli_contatos;
	      
	      var la_credcad_socios = [];
	      /*var indexes = hAPI.getChildrenIndexes("socios_diretores");
	      log.info( 'Socios..............'+indexes.length );
	      for (var i = 0; i < indexes.length; i++) {
	    	  var socio = {};
	    	  socio["num_cpf_socio"] = getValueForm( "cpf_socio___"+indexes[i], "" )+"";
	    	  socio["nom_socio"] = getValueForm( "nome_socio___"+indexes[i], "" )+"";
	    	  socio["ies_negativo"] = "N";
	    	  socio["dat_negativo"] = "";
	    	  la_credcad_socios.push( socio );  
	      }
	      if ( la_credcad_socios.length == 0 )
	    	  la_credcad_socios.push( {} );*/
	      la_credcad_socios.push( {} );
	      params["la_credcad_socios"] = la_credcad_socios;
	      
	      var la_vdp_cli_grp_email = [];
	      var camposItem = hAPI.getCardData( getValue("WKNumProces") );
		  var contadorItem = camposItem.keySet().iterator();
			while ( contadorItem.hasNext() ) {
				var idItem = contadorItem.next();
				var campo = idItem.split('___')[0];
				var seqItem = idItem.split('___')[1];
				if ( seqItem != undefined && campo == "GRUPO_EMAIL" ){
					
					log.info( 'Sequencia.....'+seqItem );
	      //var indexes = hAPI.getChildrenIndexes("lista_email");
	      log.info( 'Lista Mail..............'+contadorItem+'registro...'+seqItem );
	      //for (var i = 0; i < indexes.length; i++) {
	    	  var mail = {};
	    	  mail["grupo_email"] = getValueForm( "grupo_email___"+seqItem, "1" )+"";
	    	  mail["seq_email"] = seqItem+1+"";
	    	  mail["email"] = getValueForm( "email___"+seqItem, "" )+"";
	    	  mail["tip_registro"] = "C";
	    	  mail["des_grupo_email"] = getValueForm( "des_grupo_email___"+seqItem, "NFe XML" )+"";
	    	  la_vdp_cli_grp_email.push( mail );  
				}
		  }
	      if ( la_vdp_cli_grp_email.length == 0 )
	    	  la_vdp_cli_grp_email.push( {} );
	      params["la_vdp_cli_grp_email"] = la_vdp_cli_grp_email;	      
	      
	      data["params"] = params;
	     
	      
	    log.info("## antes do stringify ## "+data.toString() );
	    var jj = JSON.stringify( data );
	    log.info("## RESULT POST jj ## "+ jj );
	    var vo = clientService.invoke( jj );
	    if(vo.getResult()== "" || vo.getResult().isEmpty()){
	        throw "Retorno estÃ¡ vazio";
	    }else{
	    	//var jr = JSON.parse( vo.getResult() );
	        log.info("## RESULT POST res ## "+vo.getResult() );
	        
	        var jr = JSON.parse( vo.getResult() );
	        if ( jr.data.retorno == null  ){
	        	throw 'Nao foi recebido retorno do servidor Logix!'; 
	        }else if ( jr.data.retorno == 'FALSE') {
	        	var msg = 'Ocorreu erro no processamento do servidor Logix!\n';
	        		msg += jr.messages[0].detail;
	        	var	msgs = new String( msg );
	        		//msgs = msgs.replace( /||||/g, '\n').replace( /||/, '');
	        	log.info("## RESULT POST MSG ## "+ msgs );
	        	throw msgs;
	        }
	        
	    }
	    
	    if ( getValueForm("numProcesso") != "" && getValueForm("numProcesso") != null && getValueForm("numProcesso") != undefined ){
	    	
	    	try{
		    	var numProcesso = getValue('WKNumProces');
		    	var userId = getValue("WKUser");
		    	
		    	var constraints = new Array();
		    	constraints.push( DatasetFactory.createConstraint( 'processo', getValueForm("numProcesso"), getValueForm("numProcesso"), ConstraintType.MUST) );
		    	constraints.push( DatasetFactory.createConstraint( 'atividade', '47', '47', ConstraintType.MUST) );
		    	constraints.push( DatasetFactory.createConstraint( 'usuario', userId, userId, ConstraintType.MUST) );
		    	//	Busca o dataset
		    	var datasetReturned = DatasetFactory.getDataset( 'processo_movimento', null, constraints, null);		

		    	if (datasetReturned != null ) {
		    		//var atividade = datasetReturned.getValue(0,'atividade');
		    		setComment( userId, numProcesso, 'Movimentado processo de orçamento ('+ getValueForm("numProcesso") +')' );
		    	}
		    } catch(err) {
			    log.info( err.toString() );
			}
	    }
	} catch(err) {
	    throw err.toString();
	}

	
}