function defineStructure() {
	
	addColumn("cod_cliente");
    addColumn("cod_repres");

    addColumn("den_texto_1");
    addColumn("den_texto_2");
    addColumn("den_texto_3");
    addColumn("den_texto_4");
    addColumn("den_texto_5");

    addColumn("cod_user");    
    
    setKey([ "cod_cliente" ]);
    addIndex([ "cod_cliente" ]);
    addIndex([ "cod_user" ]);
    
}

function onSync(lastSyncDate) {

try{
	
	var lista_repres_user = {};
	var datasetPai = DatasetFactory.getDataset("representante_compl", null, null, null);
	if ( datasetPai != null ){
		for(var x = 0; x < datasetPai.rowsCount; x++) {
			lista_repres_user[ datasetPai.getValue(x, "cod_repres" ) ] = datasetPai.getValue(x, "login" );
			log.info( 'Repre - User...... '+datasetPai.getValue(x, "cod_repres" )+" - "+datasetPai.getValue(x, "login" ) );
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
	
	var SQL = " select ped.cod_cliente, "+
       		" 			ped.cod_repres, "+
       		" 			nvl(po.den_texto_1,' ') as den_texto_1, "+
        	"			nvl(po.den_texto_2,' ') as den_texto_2, "+
       		"			nvl(po.den_texto_3,' ') as den_texto_3, "+
       		"			nvl(po.den_texto_4,' ') as den_texto_4, "+
       		"			nvl(po.den_texto_5,' ') as den_texto_5  "+
			"	   from pedidos ped  "+
			"	   join ped_itens_texto po on (ped.cod_empresa = po.cod_empresa "+
            "  					           and ped.num_pedido = po.num_pedido) "+
			"	   left join cli_canal_venda v on ( v.cod_cliente = ped.cod_cliente ) "+
			"	   left join representante rep on ( rep.cod_repres = case v.ies_nivel when '01' then v.cod_nivel_1  "+
           	"											   	   		                  when '02' then v.cod_nivel_2  "+
            "                         									   		      when '03' then v.cod_nivel_3  "+
            "          													   		      when '04' then v.cod_nivel_4  "+
            "          													   		      when '05' then v.cod_nivel_5  "+
            "          													   		      when '06' then v.cod_nivel_6  "+
            "          													   		      when '07' then v.cod_nivel_7 end ) "+ 
			"     where ped.rowid = ( select max( pedx.rowid ) "+
            "                           from pedidos pedx  "+
            "                           join ped_itens_texto pox on (pedx.cod_empresa = pox.cod_empresa "+
            "                                                    and pedx.num_pedido = pox.num_pedido) "+
            "                          where pedx.cod_cliente = ped.cod_cliente ) ";
   		   
	log.info( SQL );
	
	var statementWD = connectionWD.prepareStatement(SQL);
	var rsWD = statementWD.executeQuery();

	var i = 0;
	
	while(rsWD.next()){
		
		var cli = new Array();
		
		cli.push( rsWD.getString("cod_cliente") );
		cli.push( rsWD.getString("cod_repres") );
		cli.push( rsWD.getString("den_texto_1") );
		cli.push( rsWD.getString("den_texto_2") );
		cli.push( rsWD.getString("den_texto_3") );
		cli.push( rsWD.getString("den_texto_4") );
		cli.push( rsWD.getString("den_texto_5") );
				
		if ( lista_repres_user[ rsWD.getString("cod_repres") ] != undefined && lista_repres_user[ rsWD.getString("cod_repres") ] != null ){
			cli.push( lista_repres_user[ rsWD.getString("cod_repres") ] );
		}else{
			cli.push( "" );
		}
		    		
		dataset.addOrUpdateRow( cli );
		
		i += 1;
		
		if ( ( i % 100 ) == 0 ){
			log.info( 'Cliente integrados..... '+i );
		}
	}
	
	log.info( 'FIM LOOP...... ');
	rsWD.close();
	log.info( 'FIM CLASE WD...... ');
	statementWD.close();
	log.info( 'FIM CLASE ST...... ');
	connectionWD.close();
	log.info( 'FIM CLASE CON...... ');
	
    return dataset;
    
} catch (e){
	log.info( "ERROOOOOO"+ e.getMessage() );
}	
	
}

function createDataset(fields, constraints, sortFields) {
    
}

function onMobileSync(user) {

		
    var sortingFields = new Array();

	log.info( 'inicio CLIENTE OBS logix 2.......'+user.userCode );
    var constraints = new Array(); 
    constraints.push( DatasetFactory.createConstraint("COD_USER", user.userCode, user.userCode, ConstraintType.MUST) );
    
    var colunastitulo = new Array( "cod_cliente", "cod_repres", "den_texto_1", "den_texto_2", "den_texto_3", "den_texto_4", "den_texto_5", "cod_user" );
         
    
    var result = {
        'fields' : colunastitulo,
        'constraints' : constraints,
        'sortingFields' : sortingFields
    };
    log.info( result );
    return result;
    
}