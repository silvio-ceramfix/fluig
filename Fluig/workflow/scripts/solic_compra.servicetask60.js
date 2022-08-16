function servicetask60(attempt, message) {
	//recuperar os aprovadores 1, 2 e 3 da ordem de compra
	var aAprov1 = [];
	var aAprov2 = [];
	var aAprov3 = [];
	
	log.info( 'Start recupera user ' );
	
	var tSolicao = getTable( 'solicitacao_de_compras', '' );
	var tRateio = getTable( 'solicitacao_de_compras', 'rateio' );
	var tItem = getTable( 'solicitacao_de_compras', 'itens_solic' );
	var tGradeCC = getTable( 'grade_aprov_solicitacao_compras', '' );
	var tGradeTD = getTable( 'grade_aprov_solicitacao_compras', 'lista_aprovadores' );

	log.info( 'Tables.....'+tSolicao+' '+tRateio+' '+tItem+' '+tGradeCC+' '+tGradeTD ); 
		
    try{    

		log.info( '$001... ' );
		var contextWD = new javax.naming.InitialContext();
		log.info( '$002... ' );
		var dataSourceWD = contextWD.lookup( "java:/jdbc/FluigDS" );
		log.info( '$003... ' );
		var connectionWD = dataSourceWD.getConnection();
		log.info( '$004... ' );
		var stWD = null;
		var statementWD = null;
		
		// ITEM
    	
		var sql = "	select it.id, " +
				"			sc.empresa, " +
				"			rt.cod_cc, "+ 
				"			it.cod_tipo_desp, "+ 
				"			it.preco_est as preco_est, "+ 
				"			rt.perc_reateio as perc_reateio "+
				"	from "+ tSolicao +" sc "+
				"	join documento dc on (dc.cod_empresa = sc.companyid "+
	            "			           and dc.nr_documento = sc.documentid "+
	            " 			           and dc.nr_versao = sc.version) "+
				"	join anexo_proces an on (an.COD_EMPRESA = sc.companyid "+ 
				"					   and an.NR_DOCUMENTO = sc.documentid) "+                       
				"	join "+ tItem +" it on (it.companyid = sc.companyid "+
	            "			       		and it.documentid = sc.documentid "+
	            "			       		and it.version = sc.version) "+
				"	join "+ tRateio +" rt on (rt.companyid = sc.companyid "+
	            "			       		  and rt.documentid = sc.documentid "+
	            "			       		  and rt.version = sc.version) "+
				"	where dc.versao_ativa = 1 "+
				"		and an.cod_empresa = "+ getValue("WKCompany") +" "+
				"		and an.num_proces = "+ getValue("WKNumProces") +" ";
	
	
		log.info( '$005... '+sql );
		statementWD = connectionWD.prepareStatement(sql);
		resultSetWD = statementWD.executeQuery();
		
		while(resultSetWD.next()) {
			 
			 
			var sql = " select cc.cod_empresa, "+ 
				 		"		cc.cod_cc, cc.val_aprov_cc_1 as val_aprov_cc_1, cc.matricula_aprov_cc_1, " +
				 		"				   cc.val_aprov_cc_2 as val_aprov_cc_2, cc.matricula_aprov_cc_2, "+
				 		"				   cc.val_aprov_cc_3 as val_aprov_cc_3, cc.matricula_aprov_cc_3, "+
				 		"		td.cod_td, td.val_aprov_1 as val_aprov_1, td.matricula_aprov_1, " +
				 		"				   td.val_aprov_2 as val_aprov_2, td.matricula_aprov_2," +
				 		"				   td.val_aprov_3 as val_aprov_3, td.matricula_aprov_3," +
				 		"		case when td.cod_td is null then 'N' else 'S' end as ies_td "+
				 		" 	from "+ tGradeCC +" cc "+
				 		"	join documento dc on (dc.cod_empresa = cc.companyid "+
		                "       			and dc.nr_documento = cc.documentid "+
		                "				    and dc.nr_versao = cc.version) "+
				 		"	left join "+ tGradeTD +" td on (td.companyid = cc.companyid "+
		                "						   and td.documentid = cc.documentid "+
		                "						   and td.version = cc.version" +
		                "						   and td.cod_td = '"+ resultSetWD.getString( 'cod_tipo_desp' ) +"' ) "+
				 		"	where dc.versao_ativa = 1 "+
				 		"	and cc.companyid = "+ getValue("WKCompany") +"" +
				 		" 	and cc.cod_empresa in ( '99', '"+ resultSetWD.getString( 'empresa' ) +"' ) "+
				 		"	and cc.cod_cc = '"+ resultSetWD.getString( 'cod_cc' ) +"'" +
				 		" order by cc.cod_empresa	" ;
			 
			log.info( '$005... '+sql );
			stWD = connectionWD.prepareStatement(sql);
			rsWD = stWD.executeQuery();
						
			var valRat = strToNumber( resultSetWD.getString( 'preco_est' ) ) 
						* strToNumber( resultSetWD.getString( 'perc_reateio' ) ) / 100;
			
			if( rsWD.next() ) {
			
				log.info( 'Valores  '+ resultSetWD.getString( 'preco_est' )+" "+resultSetWD.getString( 'perc_reateio')+" "+rsWD.getString( 'val_aprov_cc_1' )+" "+rsWD.getString( 'val_aprov_cc_2' )+" "+rsWD.getString( 'val_aprov_cc_3' )+" "+rsWD.getString( 'val_aprov_1' )+" "+rsWD.getString( 'matricula_aprov_2')+" "+rsWD.getString( 'matricula_aprov_3')  );
				
				if( rsWD.getString( 'ies_td' ) == 'N' ){
					if( valRat > strToNumber( rsWD.getString( 'val_aprov_cc_1' ) ) ){
						log.info('ENTROU 1 IF ');
						log.info('VALOR 1 '+rsWD.getString( 'matricula_aprov_cc_1' ) );
						//log.info('VALOR 2 '+aAprov1.toString().trim().indexOf( rsWD.getString( 'matricula_aprov_cc_1' ).trim() ));
						//log.info('aAprov1 '+aAprov1.toString().trim());
						log.info('aAprov1.join '+aAprov1.join(','));
						if( rsWD.getString( 'matricula_aprov_cc_1' ) != ""
						 && rsWD.getString( 'matricula_aprov_cc_1' ) != null
						 && rsWD.getString( 'matricula_aprov_cc_1' ) != "null"
						 && aAprov1.toString().indexOf( rsWD.getString( 'matricula_aprov_cc_1' ) ) == -1 ){
							log.info('ENTROU 3 IF '+rsWD.getString( 'matricula_aprov_cc_1' ));
							aAprov1.push( rsWD.getString( 'matricula_aprov_cc_1' ) );
						}
					}
					if( valRat > strToNumber( rsWD.getString( 'val_aprov_cc_2' ) ) ){
						if( rsWD.getString( 'matricula_aprov_cc_2' ) != ""
						 && rsWD.getString( 'matricula_aprov_cc_2' ) != null
						 && rsWD.getString( 'matricula_aprov_cc_2' ) != "null"
						 && aAprov2.toString().indexOf( rsWD.getString( 'matricula_aprov_cc_2' ) ) == -1 ){
							aAprov2.push( rsWD.getString( 'matricula_aprov_cc_2' ) );
						}
					}
					
					if( valRat > strToNumber( rsWD.getString( 'val_aprov_cc_3' ) ) ){
						if( rsWD.getString( 'matricula_aprov_cc_3' ) != ""
						 && rsWD.getString( 'matricula_aprov_cc_3' ) != null
						 && rsWD.getString( 'matricula_aprov_cc_3' ) != "null"
						 && aAprov2.toString().indexOf( rsWD.getString( 'matricula_aprov_cc_3' ) ) == -1 ){
							aAprov2.push( rsWD.getString( 'matricula_aprov_cc_3' ) );
						}
					}
					
				}else{
					if( valRat > strToNumber( rsWD.getString( 'val_aprov_1' ) ) ){
						log.info('ENTROU 2 IF ');
						log.info('VALOR 1 '+rsWD.getString( 'matricula_aprov_1' ) );
						log.info('VALOR 2 '+aAprov1.indexOf( rsWD.getString( 'matricula_aprov_1' ) ));
						if( rsWD.getString( 'matricula_aprov_1' ) != ""
						 && rsWD.getString( 'matricula_aprov_1' ) != null
						 && rsWD.getString( 'matricula_aprov_1' ) != "null"
						 && aAprov1.toString().indexOf( rsWD.getString( 'matricula_aprov_1' ) ) == -1 ){
							aAprov1.push( rsWD.getString( 'matricula_aprov_1' ) );
						}
					}
					if( valRat > strToNumber( rsWD.getString( 'val_aprov_2' ) ) ){
						if( rsWD.getString( 'matricula_aprov_2' ) != ""
						 && rsWD.getString( 'matricula_aprov_2' ) != null
						 && rsWD.getString( 'matricula_aprov_2' ) != "null"
						 && aAprov2.toString().indexOf( rsWD.getString( 'matricula_aprov_2' ) ) == -1 ){
							aAprov2.push( rsWD.getString( 'matricula_aprov_2' ) );
						}	
					}
					if( valRat > strToNumber( rsWD.getString( 'val_aprov_3' ) ) ){
						if( rsWD.getString( 'matricula_aprov_3' ) != ""
						 && rsWD.getString( 'matricula_aprov_3' ) != null
						 && rsWD.getString( 'matricula_aprov_3' ) != "null"
						 && aAprov2.toString().indexOf( rsWD.getString( 'matricula_aprov_3' ) ) == -1 ){
							aAprov2.push( rsWD.getString( 'matricula_aprov_3' ) );
						}	
					}
				}
		 	}
			if(stWD != null) stWD.close();
		}		
	}catch (e){
		log.info( "ERROOOOOO"+ e.toString() );
		throw "ERRO: "+ e.toString();
	}
	finally {
		log.info('##### 6 #####');
		if(stWD != null) stWD.close();
		if(statementWD != null) statementWD.close();
	    if(connectionWD != null) connectionWD.close();
	}
	
	log.info( "Depois aprov1..... "+ aAprov1.length +" "+ aAprov1.join(',')  );
	if( aAprov1.length > 0 && hAPI.getCardValue("tipo")!='O' ){
		hAPI.setCardValue("tem_aprov_1","S");
		hAPI.setCardValue("mat_aprov_1",aAprov1.join(',') );
	}else{
		hAPI.setCardValue("tem_aprov_1","N");
		hAPI.setCardValue("mat_aprov_1","")
	}
	
	log.info( "Depois aprov2..... "+ aAprov2.length +" "+ aAprov2.join(',')  );
	if( aAprov2.length > 0 && hAPI.getCardValue("tipo")!='O'){
		hAPI.setCardValue("tem_aprov_2","S");
		hAPI.setCardValue("mat_aprov_2",aAprov2.join(',') );
	}else{
		hAPI.setCardValue("tem_aprov_2","N");
		hAPI.setCardValue("mat_aprov_2","")
	}
	
	log.info( "Depois aprov3..... "+ aAprov3.length +" "+ aAprov3.join(',')  );
	if( aAprov3.length > 0 && hAPI.getCardValue("tipo")!='O'){
		hAPI.setCardValue("tem_aprov_3","S");
		hAPI.setCardValue("mat_aprov_3",aAprov2.join(',') );
	}else{
		hAPI.setCardValue("tem_aprov_3","N");
		hAPI.setCardValue("mat_aprov_3","")
	}
	
	
	//limpa as alteracoes efetuadas pelo compras para não voltar novamente para aprovação
	var camposProg = hAPI.getCardData( getValue("WKNumProces") );
	var contadorProg = camposProg.keySet().iterator();
	var seqEnt = 0;
	while ( contadorProg.hasNext() ) {
		var idProg = contadorProg.next();
		var campo = idProg.split('___')[0];
		var seqProg = idProg.split('___')[1];
		log.info('idProg...'+idProg);
		log.info('sequencia prog...'+seqProg);
		log.info('campo prog...'+campo);
		if ( seqProg != undefined && campo == "MAIOR_QUE_TOLERANCIA" ){
			log.info( 'Sequencia.....'+seqProg );
			log.info('entrou aqui 1...');
			log.info('entrou aqui 2...');
			hAPI.setCardValue("maior_que_tolerancia___"+seqProg,"N");
			hAPI.setCardValue("aprov_perc_tolerancia","N");
		}
	}
}

function getTable( dataSet, table ){
	var ct =  new Array();
	ct.push( DatasetFactory.createConstraint("dataSet", dataSet, null, ConstraintType.MUST)) ;
	if( table != ""
	 && table != null
	 && table != undefined){
		ct.push( DatasetFactory.createConstraint("table", table, null, ConstraintType.MUST)) ;
	}
	var ds = DatasetFactory.getDataset('dsk_table_name', null, ct, null);
	
	if( table != ""
	 && table != null
	 && table != undefined){
		return ds.getValue(0, 'tableFilha');
	}else{
		return ds.getValue(0, 'table');
	}	
}

function strToNumber(valor){
	if( valor == null || valor == "null" || valor == "" || valor == undefined ){
		return parseFloat( '0' );
	}
	return parseFloat( valor.replace('.','').replace(',','.') );
}