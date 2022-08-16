function servicetask43(attempt, message) {
	
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint("cod_cliente", getValueForm( "cpf_cliente", "" ), getValueForm( "cpf_cliente", "" ), ConstraintType.MUST) );
	var dataset = DatasetFactory.getDataset('clientes_logix', null, constraints, null);
	if ( dataset != null ){
		if( dataset.rowCount > 0 ) {						
			return true;
		}
	}
	
	
	var cpfFunc = '';
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint( 'table', 'eis_v_funcionarios_protheus_digte', null, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'matricula', getValueForm('userFluig'), getValueForm('userFluig'), ConstraintType.MUST) );
	var dataset = DatasetFactory.getDataset( 'selectLogix', null, constraints, null);
	if( dataset.rowsCount > 0 ){
		var numProcess = getValue("WKNumProces");
		log.info( 'CARD_DATA...............'+numProcess );
		var dtNow = new java.util.Date();
		var sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
		var dataTxt = ""+sdf.format(dtNow).substring(0,10);
		try{
			log.info("## RESULT POST 2 ## " );
		    var clientService = fluigAPI.getAuthorizeClientService();
		    
		    log.info( "Antes Data........"+getValueForm( "cpf_cliente", "" ) );
		    var data = {
		    	companyId : getValue("WKCompany") + "",
		        serviceCode : "Logix_PRD",
		        endpoint : "/LOGIXREST/cerr3/cliente"
		        //method : "post" //"post", "delete", "patch", "put", "get"
		     }; 

		    data["method"] = "post"; //"post", "delete", "patch", "put", "get"
		    
		    var params = {};
		    
		     var lr_cliente = {};
		     lr_cliente["cod_cliente"] = getValueForm( "cpf_cliente", "" )+"";  
		     hAPI.setCardValue("cod_cliente", getValueForm( "cpf_cliente", "" )+"" );
		     lr_cliente["cod_class"] = "C";
		     
		     lr_cliente["nom_cliente"] = getValueForm( "razao_social", "" )+"";
		     
		     lr_cliente["end_cliente"] = dataset.getValue(0, 'RA_LOGRDSC' )+"";
		     lr_cliente["den_bairro"] = dataset.getValue(0, 'RA_BAIRRO' )+"";
		     
		     var ctCid = new Array();
			 ctCid.push( DatasetFactory.createConstraint( 'table', 'cidades', null, ConstraintType.MUST) );
			 ctCid.push( DatasetFactory.createConstraint( 'den_cidade', dataset.getValue(0, 'RA_MUNICIP' ), dataset.getValue(0, 'RA_MUNICIP' ), ConstraintType.MUST) );
			 ctCid.push( DatasetFactory.createConstraint( 'cod_uni_feder', dataset.getValue(0, 'RA_ESTADO' ), dataset.getValue(0, 'RA_ESTADO' ), ConstraintType.MUST) );
			 var dsCid = DatasetFactory.getDataset( 'selectLogix', null, ctCid, null);
			 if( dsCid.rowsCount > 0 ){
				 lr_cliente["cod_cidade"] = dsCid.getValue(0, 'COD_CIDADE' );
			 }else{
				throw "Cidade não localizada, favor entrar em contato com RH."
			 }
				
		     lr_cliente["cod_cep"] = dataset.getValue(0, 'RA_CEP' )+"";
		     lr_cliente["num_caixa_postal"] = "";
		     lr_cliente["num_telefone"] = "(47)2102-0511";
		     lr_cliente["num_fax"] = "";
		     lr_cliente["num_telex"] = "";
		     lr_cliente["num_suframa"] = "";
		     lr_cliente["cod_tip_cli"] = getValueForm( "tipo_cliente", "04" )+"";
		     lr_cliente["den_marca"] = "";
		     lr_cliente["nom_reduzido"] = getValueForm( "razao_social", "" )+"";
		     lr_cliente["den_frete_posto"] = "";
		     //var cpf = getValueForm( "cpf_cliente", "" );
		     //cpf = cpf.substring(0,3)+"."+cpf.substring(3,6)+"."+cpf.substring(6,9)+"/"+cpf.substring(9,13)+"-"+cpf.substring(13,15);
		     lr_cliente["num_cgc_cpf"] = getValueForm( "cpf_cliente", "" )+"";
		     lr_cliente["ins_estadual"] = "";
		     lr_cliente["cod_portador"] = "";
		     lr_cliente["ies_tip_portador"] = "";
		     lr_cliente["cod_cliente_matriz"] = "";
		     lr_cliente["cod_consig"] = "";
		     lr_cliente["ies_cli_forn"] = "C";
		     lr_cliente["ies_zona_franca"] = "N";
		     lr_cliente["ies_situacao"] = "A";
		     lr_cliente["cod_rota"] = "0";
		     lr_cliente["cod_praca"] = "0";
		     lr_cliente["dat_cadastro"] = dataTxt;
		     lr_cliente["dat_atualiz"] = dataTxt;
		     lr_cliente["nom_contato"] = "";
		     lr_cliente["dat_fundacao"] = dataTxt;
		     lr_cliente["cod_local"] = "0";
		     lr_cliente["correio_eletronico"] = "";
		     lr_cliente["correi_eletr_secd"] = "";
		     lr_cliente["correi_eletr_venda"] ="";
		     lr_cliente["endereco_web"] = "";
		     lr_cliente["telefone_2"] = "";
		     lr_cliente["compl_endereco"] = "";
		     
			 var tipLog = dataset.getValue(0, 'RA_LOGRTP' ).trim()+"";
			 if( tipLog == "R" || tipLog == "R R" ){
			 	tipLog = "RUA";
			 }
		     lr_cliente["tip_logradouro"] = tipLog;
		     lr_cliente["num_iden_lograd"] = dataset.getValue(0, 'RA_LOGRNUM' )+"";
		     lr_cliente["iden_estrangeiro"] = "";
		     lr_cliente["ind_cprb"] = "";
		     lr_cliente["tipo_servico"] = "";
		     lr_cliente["ies_contrib_ipi"] = "N";
		     
		    
		     lr_cliente["ies_fis_juridica"] = "F";
		     //fim tipo pessoa
		     lr_cliente["cod_uni_feder"] = dataset.getValue(0, 'RA_ESTADO' )+"";
		     lr_cliente["cod_pais"] = "001";
		     lr_cliente["nom_guerra"] = "";
		     lr_cliente["cod_cidade_pgto"] = "";
		     lr_cliente["camara_comp"] = "";
		     lr_cliente["cod_banco"] = "";
		     lr_cliente["num_agencia"] = "";
		     lr_cliente["num_conta_banco"] = "";
		     lr_cliente["tmp_transpor"] = "";
		     lr_cliente["tex_observ"] = "";
		     lr_cliente["num_lote_transf"] = "";
		     lr_cliente["pct_aceite_div"] = "";
		     lr_cliente["ies_tip_entrega"] = "D";
		     lr_cliente["ies_dep_cred"] = "N";
		     lr_cliente["ult_num_coleta"] = "0";
		     lr_cliente["ies_gera_ap"] = "S";
		     
		     	 lr_cliente["tip_endereco_end_cob"] = "";
		    	 lr_cliente["sequencia_end_cob"] = "";
		    	 lr_cliente["tip_logradouro_end_cob"] = "";
		    	 lr_cliente["logradouro_end_cob"] = "";
		    	 lr_cliente["num_iden_lograd_end_cob"] = "";
		    	 lr_cliente["complemento_endereco_end_cob"] = "";
		    	 lr_cliente["bairro_cobr_entga"] = "";
		    	 lr_cliente["cod_cidade_end_cob"] = "";
		    	 lr_cliente["cod_cep_end_cob"] = "";
		     
			 codRepres = getValueForm( "cod_repres", "" );

	    	 lr_cliente["cod_nivel_1"] = "";
		     lr_cliente["cod_nivel_2"] = "";
		     lr_cliente["cod_nivel_3"] = "";
		     lr_cliente["cod_nivel_4"] = "";
		     lr_cliente["cod_nivel_5"] = "";
		     lr_cliente["cod_nivel_6"] = "";
		     lr_cliente["cod_nivel_7"] = "";	     
		     lr_cliente["ies_nivel"] = "";		 
			 
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
				     lr_cliente["ies_nivel"] = datasetPai.getValue(x, "ies_nivel" )+"7";
			     }
			 }
			 
		     lr_cliente["cod_tip_carteira"] = getValueForm( "cod_tip_carteira_cli", "01" )+"";
		    
			 var constraintsPai = new Array(); 
			 constraintsPai.push( DatasetFactory.createConstraint("cod_uni_feder", dataset.getValue(0, 'RA_ESTADO' ), dataset.getValue(0, 'RA_ESTADO' ), ConstraintType.MUST) );				
		     var datasetPai = DatasetFactory.getDataset("uf", null, constraintsPai, null);

			 if ( datasetPai != null ){
			     log.info('regiao X.'+ datasetPai.getValue(0, "cod_regiao") );
			     lr_cliente["cod_mercado"] = datasetPai.getValue(0, "cod_mercado")+"";
			     lr_cliente["cod_continente"] = datasetPai.getValue(0, "cod_continente")+"";
			     lr_cliente["cod_regiao"] = datasetPai.getValue(0, "cod_regiao")+"";
			 }else{
				 log.info('regiao fixo.' );
				 lr_cliente["cod_mercado"] = "IN";
		     	 lr_cliente["cod_continente"] = "1";
		     	 lr_cliente["cod_regiao"] = "1";
			 }
		     
			 
		     
		     lr_cliente["qtd_dias_atr_dupl"] = "0";
		     lr_cliente["qtd_dias_atr_med"] = "0";
		     lr_cliente["val_ped_carteira"] = "0";
		     lr_cliente["val_dup_aberto"] = "0";
		     lr_cliente["dat_ult_fat"] = dataTxt;
		     lr_cliente["val_limite_cred"] = "999999";
		     lr_cliente["dat_val_lmt_cr"] = '2099-12-31';
		     lr_cliente["ies_nota_debito"] = "N";
		     lr_cliente["ies_protesto"] = "S";
		     lr_cliente["ies_emis_autom_nd"] = "N";
		     lr_cliente["tex_obs"] = "";
		     lr_cliente["qtd_dias_protesto"] = "0";
		     lr_cliente["ies_tip_cliente"] = "";
		     lr_cliente["cod_float"] = "0";
		     lr_cliente["email_boleto"] = ""; 

		      params["lr_cliente"] = lr_cliente; 
		      
		      var la_cli_contatos = [];
		      la_cli_contatos.push( {} );
		      params["la_cli_contatos"] = la_cli_contatos;
		      
		      var la_credcad_socios = [];
		      la_credcad_socios.push( {} );
		      params["la_credcad_socios"] = la_credcad_socios;
		      
		      var la_vdp_cli_grp_email = [];
		      la_vdp_cli_grp_email.push( {} );
		      params["la_vdp_cli_grp_email"] = la_vdp_cli_grp_email;	      
		      
		      data["params"] = params;
		     
		      
		    log.info("## antes do stringify ## "+data.toString() );
		    //var jj = JSON.stringify( data );
		    var jj = JSONUtil.toJSON(data);
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
		    
		} catch(err) {
		    throw err.toString();
		}
	
		
	}
	
	
	return true;
}