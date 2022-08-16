function defineStructure() {
	
	addColumn("COD_CLIENTE");
	
    addColumn("NOM_CLIENTE");
    addColumn("END_CLIENTE");	
    addColumn("CNPJ");
    addColumn("COD_REPRES");
    addColumn("RAZ_SOCIAL");
    addColumn("NOM_REPRES");
    addColumn("COD_USER");
    addColumn("COD_TIP_CLI");
    addColumn("COD_CIDADE");
    addColumn("COD_UNI_FEDER");
    addColumn("COD_PAIS");
    addColumn("PCT_DESC_FIN" );
    addColumn("COD_CLIENTE_MATRIZ");
    addColumn("COD_CLASS");
    addColumn("INS_ESTADUAL");
    addColumn("COD_TIP_CARTEIRA");
    addColumn("IES_INF_PEDIDO");
    addColumn("CEI");
    addColumn("MOEDA");
    addColumn("DEN_BAIRRO"); 
    addColumn("DEN_CIDADE");
    addColumn("NUM_TELEFONE");
    addColumn("IES_PEDIDO");
    addColumn("EMAIL");
    addColumn("CLI_EXC_MIX");
    addColumn("IES_TIP_FORNEC");
    addColumn("EH_CONTRIBUINTE");
    addColumn("TIPO_ENTREGA");
    
    addColumn("CV_N1");
    addColumn("CV_N2");
    addColumn("CV_N3");
    addColumn("CV_N4");
    addColumn("CV_N5");
    addColumn("CV_N6");
    addColumn("CV_N7");
    
    addColumn("COD_CEP");
    addColumn("TIP_LOGRADOURO");
    
    addColumn("LOGRADOURO");
    addColumn("NUM_IDEN_LOGRAD");
    addColumn("DATA_ULTIMO_FATURAMENTO");
    addColumn("DIAS_ULT_FAT");
    addColumn("APROVACAO_CRE");
    
    addColumn("COD_USER_GERENTE");
    
    setKey([ "COD_CLIENTE" ]);
    addIndex([ "COD_CLIENTE" ]);
    addIndex([ "COD_USER" ]);
    addIndex([ "COD_TIP_CLI" ]);
    
}

function onSync(lastSyncDate) {

try{
	
	var lista_repres_user = {};
	var datasetPai = DatasetFactory.getDataset("representante_compl", null, null, null);
	if ( datasetPai != null ){
		for(var x = 0; x < datasetPai.rowsCount; x++) {
			lista_repres_user[ datasetPai.getValue(x, "cod_repres" ) ] = datasetPai.getValue(x, "matricula" );
			log.info( 'Repre - User...... '+datasetPai.getValue(x, "cod_repres" )+" - "+datasetPai.getValue(x, "matricula" ) );
		}
	}
	
	var lista_repres_gerente = {};
	
	log.info( 'Passo 01 ' );
	
	var ds = DatasetFactory.getDataset("representante", null, null, null);
	if ( ds != null ){
		for(var x = 0; x < ds.rowsCount; x++) {
	
			log.info( 'Passo X-'+x );
			
			var ct = new Array();
			ct.push( DatasetFactory.createConstraint("tablename", "regional", "regional", ConstraintType.MUST) );
			ct.push( DatasetFactory.createConstraint("cod_regional", ds.getValue(x, "cv_4"), ds.getValue(x, "cv_4"), ConstraintType.MUST) );
		    var dsr = DatasetFactory.getDataset("representante_compl", null, ct, null);

		    log.info( 'CV 04 '+ds.getValue(x, "cv_4") );
		    
		    if( dsr.rowsCount > 0 ){
			    var ct = new Array();
				ct.push( DatasetFactory.createConstraint("documentid", dsr.getValue(0, "metadata#id"), dsr.getValue(0, "metadata#id"), ConstraintType.MUST) );
				ct.push( DatasetFactory.createConstraint("version", dsr.getValue(0, "metadata#version"), dsr.getValue(0, "metadata#version"), ConstraintType.MUST) );
			    var dsg = DatasetFactory.getDataset("representante_compl", null, ct, null);
			    if( dsg.rowsCount > 0 ){
			    	lista_repres_gerente[ ds.getValue(x, "cod_repres" ) ] = dsg.getValue(0, "matricula");
			    }
		    }
		}
	}


	var ies_cliente_ativo = ''; 
	var ies_cliente_pendente = '';
	var ies_cliente_cancelado = '';
	var ies_cliente_suspenso = '';
	
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint("ies_matriz", 'on', 'on', ConstraintType.MUST) );
	var dataset = DatasetFactory.getDataset("empresa_compl", null, constraints, null);
	if ( dataset != null ){
		for(var x = 0; x < dataset.rowsCount; x++) {
			log.info( 'Empresa...... '+ dataset.getValue(x, "cod_empresa" ) +' Par '+dataset.getValue(x, "ies_cliente_ativo" ) );
			ies_cliente_ativo = dataset.getValue(x, "ies_cliente_ativo" );
			ies_cliente_pendente = dataset.getValue(x, "ies_cliente_pendente" ); 
			ies_cliente_cancelado = dataset.getValue(x, "ies_cliente_cancelado" );
			ies_cliente_suspenso = dataset.getValue(x, "ies_cliente_suspenso" );
		}
	}
	
	log.info( 'Inicio......' );	
    var dataset = DatasetBuilder.newDataset();
    log.info( 'Entrei...... 1' );
    
	var contextWD = new javax.naming.InitialContext();
	log.info( 'Entrei...... 3 a' );
	var dataSourceWD = contextWD.lookup("java:/jdbc/LogixPRD");
	log.info( 'Entrei...... 3 b' );
	var connectionWD = dataSourceWD.getConnection();
	log.info( 'Entrei...... 3 c' );
	
	log.info( 'Entrei...... 4' );
	
	var SQL = " select c.cod_cliente, " +
       		  " 	   nvl( trim(a.razao_social), ' ') as nom_cliente, " + 
       		  "        nvl( trim(c.end_cliente), ' ') as end_cliente, " +
       	 	  "        nvl( c.num_cgc_cpf, ' ') as num_cgc_cpf, " +
       	 	  "		   nvl( rep.cod_repres, '0' ) as cod_repres, " +
       	 	  "        nvl( trim(rep.raz_social), ' ') as raz_social, " +
       	 	  " 	   nvl( trim(rep.nom_repres), ' ') as nom_repres, " +
       	 	  
       	 	  "		   nvl( c.cod_tip_cli, ' ') as cod_tip_cli, " +
     		  " 	   nvl( c.cod_cidade, ' ') as cod_cidade, "+
     		  "		   nvl( ci.cod_uni_feder, ' ') as cod_uni_feder, "+
     		  "		   nvl( uf.cod_pais, ' ') as cod_pais, " +
     		  "		   to_char( nvl( ( SELECT max(p.VAL_PARAMETRO) " +
     		  "			 FROM VDP_CLI_PARAMETRO p " +
     		  "			WHERE p.CLIENTE = c.cod_cliente " +
     		  "           AND p.PARAMETRO = 'pct_desc_financ' ), 0), '999G999G990D00' ) as pct_desc_fin, "+
     		  "			nvl( c.cod_cliente_matriz, ' ' ) as cod_cliente_matriz," +
     		  "			nvl( c.cod_class, ' ' ) as cod_class," +
     		  "			nvl( c.ins_estadual, ' ') as ins_estadual, " +
     		  "			nvl( v.cod_tip_carteira, ' ' )  as cod_tip_carteira, " +
     		  "			nvl( ( select max( pa.tip_parametro ) from vdp_cli_parametro pa where pa.parametro =  'xpednitemped'  and  pa.cliente = c.cod_cliente ), 'N' ) as ies_inf_pedido, " +
     		  "			nvl( substr( par.par_cliente_txt, 41, 12 ), ' ') as cei, "+
     		  "			nvl( substr( par.par_cliente_txt, 4, 2 ), '  ') as moeda, " +
     		  "         nvl( c.end_cliente, ' ') as end_cliente, " +
     		  "			nvl( c.den_bairro, ' ') as den_bairro, " +
     		  "			nvl( ci.den_cidade, ' ') as den_cidade, " +
     		  "			nvl( ci.cod_uni_feder, ' ') as cod_uni_feder, " +
     		  "			nvl( uf.cod_pais, ' ') as cod_pais, " +
     		  "			nvl( c.num_telefone, ' ') as num_telefone, " +
     		  "			c.ies_situacao," +
     		  "			nvl( eis_f_get_email( c.cod_cliente, 3 ), '#') as email,"+
     		  "         nvl(( select ( pa.caracter_integr ) from vdp_dpara_geral pa where pa.sistema_integr =  'CLI_EXC_MIX'  and  pa.caracter_logix = c.cod_cliente ), 'N' ) as cli_exc_mix, "+
     		  "         forn.ies_tip_fornec, "+
     		  "         vdpcpar.tip_parametro as eh_contribuinte, "	+
     		  "			nvl(vdpcpar2.val_parametro,'0') as tipo_entrega," +
     		  "			v.cod_nivel_1, v.cod_nivel_2, v.cod_nivel_3, v.cod_nivel_4, v.cod_nivel_5, v.cod_nivel_6, v.cod_nivel_7," +
     		  "			c.cod_cep," +
     		  "			a.tip_logradouro," +
     		  "			a.logradouro," +
     		  "			a.num_iden_lograd, "+
     		  "			EIS_F_GET_ult_fat_cli(c.cod_cliente) as data_ultimo_faturamento, "+
     		  "         (sysdate-EIS_F_GET_ult_fat_cli(c.cod_cliente))as dias_ult_fat, "+	
     		  "			EIS_F_GET_aprovacao_cli(c.cod_cliente) as aprovacao_cre " +
     		  "   from clientes c  " +
			  "   join vdp_cli_fornec_cpl a on (a.cliente_fornecedor = c.cod_cliente " +
              "                             and a.tip_cadastro = 'C') "+
              "   left join cli_canal_venda v on ( v.cod_cliente = c.cod_cliente )"+
              "   left join representante rep on ( cod_repres = case v.ies_nivel when '01' then v.cod_nivel_1 "+
              "        												   	   		 when '02' then v.cod_nivel_2 "+
              "        													   		 when '03' then v.cod_nivel_3 "+
              "        													   		 when '04' then v.cod_nivel_4 "+
              "        													   		 when '05' then v.cod_nivel_5 "+
              "        													   		 when '06' then v.cod_nivel_6 "+
              "        													   		 when '07' then v.cod_nivel_7 end ) " +
              "   left join par_clientes par on ( par.cod_cliente = c.cod_cliente ) "+
              "   left join fornecedor forn on (forn.cod_fornecedor = c.cod_cliente) "+
              "   left join vdp_cli_parametro vdpcpar on (c.cod_cliente = vdpcpar.cliente and parametro = 'eh_contribuinte     ') "+
              "   left join vdp_cli_parametro vdpcpar2 on (c.cod_cliente = vdpcpar2.cliente and trim(vdpcpar2.parametro) = 'tip_entrega') "+
              "	  join cidades ci on (ci.cod_cidade = c.cod_cidade) "+
              "	  join uni_feder uf on (uf.cod_uni_feder = ci.cod_uni_feder) "+
              "	where 1=1 ";
              //"  and c.cod_cliente = '082624776000147' ";
              //"  and rep.cod_repres = '1105' ";
   		   
	log.info( SQL );
	
	var statementWD = connectionWD.prepareStatement(SQL);
	var rsWD = statementWD.executeQuery();

	var i = 0;
	
	while(rsWD.next()){
		
		var cli = new Array();
		
		cli.push( rsWD.getString("cod_cliente") );
		cli.push( rsWD.getString("nom_cliente") );
		cli.push( rsWD.getString("end_cliente") );
		cli.push( rsWD.getString("num_cgc_cpf") );
		cli.push( rsWD.getString("cod_repres") );
		cli.push( rsWD.getString("raz_social") );
		cli.push( rsWD.getString("nom_repres") );
				
		if ( lista_repres_user[ rsWD.getString("cod_repres") ] != undefined && lista_repres_user[ rsWD.getString("cod_repres") ] != null ){
			cli.push( lista_repres_user[ rsWD.getString("cod_repres") ] );
		}else{
			cli.push( "" );
		}
		
		cli.push( rsWD.getString("cod_tip_cli") );
		cli.push( rsWD.getString("cod_cidade") );
		cli.push( rsWD.getString("cod_uni_feder") );
		cli.push( rsWD.getString("cod_pais") );
		cli.push( rsWD.getString("pct_desc_fin") );
		cli.push( rsWD.getString("cod_cliente_matriz") );
		cli.push( rsWD.getString("cod_class") );
		cli.push( rsWD.getString("ins_estadual") );
		cli.push( rsWD.getString("cod_tip_carteira") );
		
		cli.push( rsWD.getString("ies_inf_pedido") );

		cli.push( rsWD.getString("cei") );
		cli.push( rsWD.getString("moeda") );
 
		cli.push( rsWD.getString("den_bairro") ); 
		cli.push( rsWD.getString("den_cidade") );
		cli.push( rsWD.getString("num_telefone") );
		
		var iesPedido = 'N';
		log.info( 'Situa... '+rsWD.getString("ies_situacao")+' ativo '+ies_cliente_ativo+' pendente '+ies_cliente_pendente+' cancelado '+ies_cliente_cancelado+' suspenso '+ies_cliente_suspenso );
		if ( rsWD.getString("ies_situacao") == "A" && ies_cliente_ativo == "on" ){
			iesPedido = 'S';
		}else if ( rsWD.getString("ies_situacao") == "P" && ies_cliente_pendente == "on" ){
			iesPedido = 'S';
		} if ( rsWD.getString("ies_situacao") == "C" && ies_cliente_cancelado == "on" ){
			iesPedido = 'S';
		} if ( rsWD.getString("ies_situacao") == "S" && ies_cliente_suspenso == "on" ){
			iesPedido = 'S';
		}
		log.info( 'iesPedido '+ iesPedido );
		cli.push( iesPedido );
		log.info( 'rsWD.getString("email") '+ rsWD.getString("email") );
		cli.push( rsWD.getString("email")+" " );
		cli.push( rsWD.getString("cli_exc_mix"));
		cli.push( rsWD.getString("ies_tip_fornec"));
		cli.push( rsWD.getString("eh_contribuinte"));
		cli.push( rsWD.getString("tipo_entrega"));
		
		cli.push( rsWD.getString("cod_nivel_1"));
		cli.push( rsWD.getString("cod_nivel_2"));
		cli.push( rsWD.getString("cod_nivel_3"));
		cli.push( rsWD.getString("cod_nivel_4"));
		cli.push( rsWD.getString("cod_nivel_5"));
		cli.push( rsWD.getString("cod_nivel_6"));
		cli.push( rsWD.getString("cod_nivel_7"));

		cli.push( rsWD.getString("cod_cep"));
		cli.push( rsWD.getString("tip_logradouro"));
		
		cli.push( rsWD.getString("logradouro"));
		cli.push( rsWD.getString("num_iden_lograd"));
		cli.push( rsWD.getString("data_ultimo_faturamento"));
		cli.push( rsWD.getString("dias_ult_fat"));
		cli.push( rsWD.getString("aprovacao_cre"));
		
		cli.push( lista_repres_gerente[ rsWD.getString("cod_repres") ] );
		
		log.info( 'Add clinente ' );
		
		dataset.addOrUpdateRow( cli );
		
		i += 1;
		
		if ( ( i % 100 ) == 0 ){
			log.info( 'Cliente integrados..... '+i );
		}
	}
	
	log.info( 'FIM LOOP...... ');
	rsWD.close();
	log.info( 'FIM CLASE WD...... ');
	
    return dataset;
    
} catch (e){
	log.info( "ERROOOOOO"+ e.getMessage() );
} finally {
	if (statementWD != null) {
		statementWD.close();
	}
	if (connectionWD != null) {
		connectionWD.close();
	}
}
	
}

function createDataset(fields, constraints, sortFields) {

	var dataset = DatasetBuilder.newDataset();
	
	addColumn("COD_CLIENTE");
    addColumn("NOM_CLIENTE");
    addColumn("END_CLIENTE");	
    addColumn("CNPJ");
    addColumn("COD_REPRES");
    addColumn("RAZ_SOCIAL");
    addColumn("NOM_REPRES");
    addColumn("COD_USER");
    addColumn("COD_TIP_CLI");
    
    addColumn("COD_CIDADE");
    addColumn("COD_UNI_FEDER");
    addColumn("COD_PAIS");
    addColumn("PCT_DESC_FIN" );
    
    addColumn("COD_CLIENTE_MATRIZ");
    
    addColumn("COD_CLASS");
    addColumn("INS_ESTADUAL");
    addColumn("COD_TIP_CARTEIRA");

    addColumn("IES_INF_PEDIDO");
    
    addColumn("CEI");
    addColumn("MOEDA");
     
    addColumn("DEN_BAIRRO"); 
    addColumn("DEN_CIDADE");
    addColumn("NUM_TELEFONE");
    addColumn("CLI_EXC_MIX");
    addColumn("IES_TIP_FORNEC");
    addColumn("EH_CONTRIBUINTE");
    addColumn("TIPO_ENTREGA");
    addColumn("DATA_ULTIMO_FATURAMENTO");
    addColumn("DIAS_ULT_FAT");
    addColumn("APROVACAO_CRE");
	
}

function onMobileSync(user) {

	log.info( 'inicio sync clientes logix 2.......'+user.userCode );
    var sortFields = new Array();
    var constraints = new Array(); 
    constraints.push( DatasetFactory.createConstraint("COD_USER", user.userCode, user.userCode, ConstraintType.MUST) );
    log.info( 'Sync clientes logix 2' );
    //var colunastitulo = new Array( 'cod_cliente', 'nom_cliente', 'cnpj', 'cod_repres', 'raz_social', 'nom_repres', 'cod_user', 'cod_tip_cli', 'cod_uni_feder', 'cod_pais', 'pct_desc_fin', 'cod_cliente_matriz', 'cod_class', 'ins_estadual', 'cod_tip_carteira', 'ies_inf_pedido', 'cei', 'moeda' );
    var colunastitulo = new Array( 'COD_CLIENTE', 'NOM_CLIENTE', 'CNPJ', 'COD_REPRES', 'RAZ_SOCIAL', 'NOM_REPRES', 'COD_USER', 'COD_TIP_CLI', 'COD_CIDADE', 'COD_UNI_FEDER', 'COD_PAIS', 'PCT_DESC_FIN', 'COD_CLIENTE_MATRIZ', 'COD_CLASS', 'INS_ESTADUAL', 'COD_TIP_CARTEIRA', 'IES_INF_PEDIDO', 'CEI', 'MOEDA', 'DEN_CIDADE', 'IES_PEDIDO', 'IES_TIP_FORNEC', 'EH_CONTRIBUINTE', 'TIPO_ENTREGA','DATA_ULTIMO_FATURAMENTO', 'DIAS_ULT_FAT', 'APROVACAO_CRE' );
         
    var result = {
        'fields' : colunastitulo,
        'constraints' : constraints,
        'sortFields' : sortFields
    };
    log.info( 'Result Sync clientes logix 2......'+result );
    return result;
    
}