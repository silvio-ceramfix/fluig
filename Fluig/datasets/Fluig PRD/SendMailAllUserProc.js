function defineStructure() {
	
}
function onSync(lastSyncDate) {
	

}
function createDataset(fields, constraints, sortFields) {

    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn( 'status' );
    
	var listaConstraits = {};
	
	listaConstraits['processo'] = '85438';
	listaConstraits['user'] = 'admin';
	listaConstraits['titulo'] = 'titulo';
	listaConstraits['msg'] = 'msg,msg';
	
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
      		listaConstraits[ constraints[i].fieldName.trim() ] = constraints[i].initialValue;
       		log.info('fieldName.....'+constraints[i].fieldName+'...value....'+constraints[i].initialValue);
        }
    }
	
	var contextWD;
	var dataSourceWD;
	var connectionWD;
	var statementWD;

    
	try{
		log.info( '$001... ' );
		contextWD = new javax.naming.InitialContext();
		log.info( '$002... ' );
		dataSourceWD = contextWD.lookup( "java:/jdbc/FluigDS" );
		log.info( '$003... ' );
		connectionWD = dataSourceWD.getConnection();
		log.info( '$004... ' );
	
		var destinatarios = new java.util.ArrayList();
	
		sql = "select distinct a.cd_matricula " + 
			  "  from tar_proces a " +
			  " where a.cod_empresa = 1 " +
			  "   and a.num_proces = '"+ listaConstraits['processo'] +"' " +
			  "   and a.cd_matricula <> '"+ listaConstraits['user'] +"' " +
			  "   and a.cd_matricula not like 'System:%' " +
			  "   and a.cd_matricula not like 'Pool:%' ";
  
		log.info( '$005..8 '+sql );
		statementWD = connectionWD.prepareStatement(sql);
		rsWD = statementWD.executeQuery();
		
		while(rsWD.next()) {	
			
			log.info('Mail matricula.....'+ rsWD.getString( "cd_matricula" ) );
			
			/*var user = getValue("WKUser");	
			var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", rsWD.getString( "cd_matricula" ), rsWD.getString( "cd_matricula" ), ConstraintType.MUST);
			var constraints = new Array(c1);
			var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
			log.info('Mail user.....'+ colleagueMap.getValue(0,"mail") );*/
			
			destinatarios.add( rsWD.getString( "cd_matricula" ) );
			
		}
			
			
		html = "<br><br>"+listaConstraits['msg'];
		
		
		html += "<br><br>"+
		   		"<br><a href=https://fluig.ceramfix.com.br/portal/p/99/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID="+ listaConstraits['processo'] +">PROCESSO - "+ listaConstraits['processo'] +"</a>" +
		   		"<br><br>" +
		   		"<br><b> Favor não responder este email, ele não esta sendo monitorado. </b>"
		
				
	   		
	   	log.info('Serv... 001 html '+html);
	   	var parametros = new java.util.HashMap();
	   	parametros.put("WorkflowMailContent", html);
	   	parametros.put("SERVER_URL", "https://fluig.ceramfix.com.br/");
	   	//Este parÃ¢metro Ã© obrigatÃ³rio e representa o assunto do e-mail
	   	parametros.put("subject", listaConstraits['titulo'] );
	   	log.info('Serv... 002');

	   	//Monta lista de destinatÃ¡rios
	   	//destinatarios.add( hAPI.getCardValue('matricula_solicitante' ).trim()  );
	   	//destinatarios.add( 'amjunior@gmail.com' );
	   	log.info('Serv... 003');
	   	//Envia e-mail
	   	notifier.notify(listaConstraits['user'], "TPLTASK_SEND_EMAIL", parametros, destinatarios, "text/html");
	   	log.info('Serv... 004');

	} catch (e){
		log.info( "ERRO workflowEngineService G...."+ e );
	}
	finally {
		log.info('##### 6 #####');
		if(statementWD != null) statementWD.close();
		if(connectionWD != null) connectionWD.close();
	}	
	return newDataset;

}

function onMobileSync(user) {

}
