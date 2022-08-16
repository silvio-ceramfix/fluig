function defineStructure() {
	
	addColumn("COD_EMPRESA");
	addColumn("NUM_LIST_PRECO",DatasetFieldType.NUMBER);
	addColumn("COD_ITEM");
	addColumn("DEN_ITEM");
	addColumn("DEN_ITEM_REDUZ");
	addColumn("COD_LIN_PROD");
	addColumn("COD_LIN_RECEI");
	addColumn("COD_SEG_MERC");
	addColumn("COD_CLA_USO");
	addColumn("COD_GRUPO_ITEM");
	addColumn("COD_TIP_CARTEIRA");
	addColumn("COD_UNID_MED");
	addColumn("MIX_PRODUTO");
	addColumn("PES_UNIT",DatasetFieldType.NUMBER);
	addColumn("QTD_PADR_EMBAL",DatasetFieldType.NUMBER);
	addColumn("IES_BONIFICA");
	addColumn("COD_LOCAL");
	addColumn("AEN");
	addColumn("CUBAGEM",DatasetFieldType.NUMBER);

    setKey([ "COD_EMPRESA", "NUM_LIST_PRECO", "COD_ITEM" ]);
    addIndex([ "COD_EMPRESA", "NUM_LIST_PRECO" ]);
    
    addIndex([ "COD_EMPRESA", "COD_ITEM" ]);
    addIndex([ "COD_EMPRESA", "DEN_ITEM" ]);
    addIndex([ "COD_EMPRESA", "NUM_LIST_PRECO", "AEN" ]);
    
}

function onSync(lastSyncDate) {

    var dataset2 = DatasetBuilder.newDataset();
    
	try{

		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
		var connectionWD = dataSourceWD.getConnection();	

		
		SQL = " select 'md'||lpad(max(x.cod_empresa),3,'0')||lpad(max(x.cod_lista),3,'0') as cod_lista"+ 
		   	  " from meta_lista x "+ 
		   	  " where cod_empresa = 1 "+
		   	  "   and dsl_lista = 'Lista de Preço Item' ";

		log.info( "SQL Table....." + SQL );
		
		var table = "";
		
		var statementWD = connectionWD.prepareStatement(SQL);		
		var rsWD = statementWD.executeQuery();		
		while(rsWD.next()){
			table = rsWD.getString("cod_lista");
		}
		
		if (table != "" ){
			SQL = " select md.cod_empresa, md.num_list_preco, md.cod_item "+
				  "	  from "+ table +" md "+
				  "  where (select count(*) "+
		          "   from logix.fluig_v_lista_de_preco_item vl "+ 
		          "  where vl.cod_empresa = md.cod_empresa "+
		          "    and vl.num_list_preco = md.num_list_preco "+
		          "    and vl.cod_item = md.cod_item ) = 0 ";

			log.info( "SQL Table....." + SQL );
			
			var statementWD = connectionWD.prepareStatement(SQL);		
			var rsWD = statementWD.executeQuery();		
			while(rsWD.next()){

				var arrItem = new Array();
				arrItem.push( rsWD.getString("cod_empresa") );
				arrItem.push( rsWD.getFloat("num_list_preco") );
				arrItem.push( rsWD.getString("cod_item") );
				
				arrItem.push( '' );
				arrItem.push( '' );
				arrItem.push( '' );
				arrItem.push( '' );
				arrItem.push( '' );
				arrItem.push( '' );
				arrItem.push( '' );
				arrItem.push( '' );
				arrItem.push( '' );
				arrItem.push( '' );
				arrItem.push( '' );
				arrItem.push( '' );
				arrItem.push( '' );
				arrItem.push( '' );
				arrItem.push( '' );
								
				dataset2.deleteRow( arrItem );
				log.info('Delete '+rsWD.getString("cod_empresa")+' - '+rsWD.getFloat("num_list_preco")+' - '+rsWD.getString("cod_item") );
			}
		}
	}catch(e){ log.error( e.toString() ); }
		
	try{
		
		var itens_n_boni = new Array();
		
		var dataset = DatasetFactory.getDataset( 'empresa_compl', null, null, null);
		if ( dataset != null ){
			for (var x = 0; x < dataset.values.length; x++) {
				var constraintsFilhos = new Array();
				constraintsFilhos.push( DatasetFactory.createConstraint("tablename", "itens_nao_bonificaveis", "itens_nao_bonificaveis", ConstraintType.MUST) );
				constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", dataset.getValue(x, "metadata#id" ), dataset.getValue(x, "metadata#id" ), ConstraintType.MUST) );
				constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", dataset.getValue(x, "metadata#version" ), dataset.getValue(x, "metadata#version" ), ConstraintType.MUST) );
				var datasetFilho = DatasetFactory.getDataset( 'empresa_compl', null, constraintsFilhos, null);
				if ( datasetFilho != null ){
					for (var i = 0; i < datasetFilho.values.length; i++) {
						log.info( 'Empresa - item .'+dataset.getValue(x, 'cod_empresa')+datasetFilho.getValue(i, 'cod_item').trim()+'.' );
						itens_n_boni.push( dataset.getValue(x, 'cod_empresa')+datasetFilho.getValue(i, 'cod_item').trim()  );
					}
				}
			}
		}
		log.info( 'Itens nÃ£o.....' );
		log.info( itens_n_boni  );
		
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixPRD");
		var connectionWD = dataSourceWD.getConnection();	
		
		var SQL = " select distinct "+
				  "    	   cod_empresa, " +
	       		  " 	   num_list_preco, " +
	       		  "		   cod_item, " +
				  "		   den_item, " +
				  "		   den_item_reduz, " +
				  "		   cod_lin_prod, " +
				  "		   cod_lin_recei, " +
				  "		   cod_seg_merc, " +
				  "		   cod_cla_uso, " +
				  "		   cod_grupo_item, " +
				  "		   cod_tip_carteira, " +
				  "		   cod_unid_med, " +
			      "		   mix_produto,  " +			  
				  "		   pes_unit, " +
			      "		   qtd_padr_embal, " +
			      "        cod_local_estoq, " +
			      "        aen, " + 
			      "        cubagem " +
				  "   from fluig_v_lista_de_preco_item  " +
				  "   where cod_empresa < '60' ";
		
	    log.info( 'SQL....... '+SQL );
		
		var statementWD = connectionWD.prepareStatement(SQL);
		
		log.info( ' Antes do While 001 ' );
		
		var rsWD = statementWD.executeQuery();
		
		var linha = 0;
		
		log.info( ' Antes do While 002 '+linha );
		
		while(rsWD.next()){
			
			
			var arrItem = new Array();
		
			arrItem.push( rsWD.getString("cod_empresa") );
			arrItem.push( rsWD.getInt("num_list_preco") );
			arrItem.push( rsWD.getString("cod_item") );
			arrItem.push( rsWD.getString("den_item") );
			arrItem.push( rsWD.getString("den_item_reduz") );
			arrItem.push( rsWD.getString("cod_lin_prod") );
			arrItem.push( rsWD.getString("cod_lin_recei") );
			arrItem.push( rsWD.getString("cod_seg_merc") );
			arrItem.push( rsWD.getString("cod_cla_uso") );
			arrItem.push( rsWD.getString("cod_grupo_item") );
			arrItem.push( rsWD.getString("cod_tip_carteira") );
			arrItem.push( rsWD.getString("cod_unid_med") );
			arrItem.push( rsWD.getString("mix_produto") );
			arrItem.push( rsWD.getDouble("pes_unit") );
			arrItem.push( rsWD.getDouble("qtd_padr_embal") );
			
			
			//log.info( ' while item .'+rsWD.getString("cod_empresa")+rsWD.getString("cod_item")+'.' );
			if( itens_n_boni.indexOf( rsWD.getString("cod_empresa")+rsWD.getString("cod_item") ) == -1  ) {
				arrItem.push( "S" );	
			}else{
				arrItem.push( "N" );
			}
			arrItem.push( rsWD.getString("cod_local_estoq") );
			arrItem.push( rsWD.getDouble("aen") );
			arrItem.push( rsWD.getDouble("cubagem") );
			
			dataset2.addOrUpdateRow( arrItem );
			
			linha += 1;
			if( (linha % 100) == 0 ){
				log.info( 'Linhas lista '+linha );
			}
		}
		
		log.info( ' Depois do While ' );
		
		rsWD.close();
		statementWD.close();
		connectionWD.close();
		
		return dataset2;
		
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

	
	return dataset2;
	
}

function createDataset(fields, constraints, sortFields) {
	
}

function onMobileSync(user) {

    var sortingFields = new Array();
    var constraints = new Array();
    
    var colunastitulo = new Array('COD_EMPRESA','NUM_LIST_PRECO','COD_ITEM','DEN_ITEM','DEN_ITEM_REDUZ','COD_LIN_PROD','COD_LIN_RECEI','COD_SEG_MERC','COD_CLA_USO','COD_GRUPO_ITEM','COD_TIP_CARTEIRA','COD_UNID_MED','MIX_PRODUTO','PES_UNIT','QTD_PADR_EMBAL','IES_BONIFICA','COD_LOCAL','AEN','CUBAGEM' );
    
    var result = {
        'fields' : colunastitulo,
        'constraints' : constraints,
        'sortingFields' : sortingFields
    };
    log.info( result );
    return result;

}