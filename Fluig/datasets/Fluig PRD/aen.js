  function defineStructure() {
		
		addColumn("cod_aen");
	    addColumn("nivel_1");
	    addColumn("nivel_2");
	    addColumn("nivel_3");
	    addColumn("nivel_4");
	    addColumn("eh_mix");
	    addColumn("den_grupo");
	    addColumn("aen_compl");
	    setKey([ "cod_aen" ]);
	    addIndex([ "cod_aen" ]);
	    
	}

	function onSync(lastSyncDate) {

	    var dataset = DatasetBuilder.newDataset();
	    
		try{
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup("java:/jdbc/LogixPRD");
			var connectionWD = dataSourceWD.getConnection();
				
			var SQL = " select cod_aen, nivel_1, nivel_2, nivel_3, nivel_4, eh_mix, den_grupo, aen_compl "+
				  "   from v_aen a ";
			log.info( SQL );
		 
			var statementWD = connectionWD.prepareStatement(SQL);
			var rsWD = statementWD.executeQuery();

			while(rsWD.next()){
				dataset.addOrUpdateRow(
					new Array(
						rsWD.getString("cod_aen"),
						rsWD.getString("nivel_1"),
						rsWD.getString("nivel_2"),
						rsWD.getString("nivel_3"),
						rsWD.getString("nivel_4"),
						rsWD.getString("eh_mix"),
						rsWD.getString("den_grupo"),
						rsWD.getString("aen_compl")
					)
				);
			}
			rsWD.close();
			statementWD.close();
			connectionWD.close();
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
			
	    return dataset;
	    	
	}

	function createDataset(fields, constraints, sortFields) {
		
	  	

	}

	function onMobileSync(user) {

	    var sortingFields = new Array();
	    var constraints = new Array();
	    var colunastitulo = new Array('cod_aen', 'nivel_1', 'nivel_2', 'nivel_3', 'nivel_4', 'eh_mix', 'den_grupo', 'aen_compl' );
	    
	    var result = {
	        'fields' : colunastitulo,
	        'constraints' : constraints,
	        'sortingFields' : sortingFields
	    };
	    log.info( result );
	    return result;
		
	}