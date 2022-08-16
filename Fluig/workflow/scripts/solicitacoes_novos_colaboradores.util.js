
function SendAlertMail(){

	log.info('servicetask30....... 22');
	
	var aprovadores = getAprovadoresFromTable();

	var listaAprov = {};
	
	for (var i = 0; i < aprovadores.length; i++) {
		var aprovador = aprovadores[i];
	    log.info('aprovador.confirma.......'+aprovador.necessita_item+' '+aprovador.possui_item);
	    if ( aprovador.necessita_item == 'S' || aprovador.possui_item == 'S' ) {
	    	
	    	var html = listaAprov[ aprovador.papel_responsavel_item ];
	    	if( html == undefined ){
	    		html = "";
	    	}
	    	
	    	html += "<tr>" +
	    			"	<td>" +
	    			"		"+ aprovador.tipo_item +" " +
	    			"	</td>" +
	    			"	<td>" +
	    			"		"+ aprovador.descricao_item +" " +
	    			"	</td>"+
	    			"	<td>" +
	    			"		"+ aprovador.observacao_item +" " +
	    			"	</td>" ;
	    	if( hAPI.getCardValue('TIPOSOLICITACAO') == "T" || hAPI.getCardValue('TIPOSOLICITACAO') == "D"  ){
	    		html += "	<td>" +
	    				"		"+ ( aprovador.possui_item == 'S'? 'Sim': 'Não' ) +" " +
	    				"	</td>" ;
	    	}
	    	if(  hAPI.getCardValue('TIPOSOLICITACAO') == "N" ){
	    		html += "	<td>" +
	    				"		"+ ( aprovador.necessita_item == 'S'? 'Sim': 'Não' ) +" " +
	    				"	</td>" ;
	    	}
	    	
	    	if (hAPI.getCardValue('TIPOSOLICITACAO') == "X") {
	    		html += "	<td>" +
	    				"		"+ ( aprovador.possui_item == 'S'? 'Sim': 'Não' ) +" " +
	    				"	</td>" ;
	    		html += "	<td>" +
	    				"		"+ ( aprovador.necessita_item == 'S'? 'Sim': 'Não' ) +" " +
	    				"	</td>" ;
	    	}
	    	html += "</tr>";
	    	
	    	log.info(' HTML LINHA.......' + html);
	    	
	    	listaAprov[ aprovador.papel_responsavel_item ] = html;
	    	
	    }
	}
	
	log.info(' FIM loop 1.......' );
	
	for( it in listaAprov ){
		
		var html = '';
		
		if (hAPI.getCardValue('TIPOSOLICITACAO') == "X") {
			html += "<br>Nome: " + hAPI.getCardValue('NOME_FUNCIONARIO_SUBS') +
					"<br>Filial:	"+  hAPI.getCardValue('DEN_FILIAL_FUNCIONARIO') +
					"<br>Função: "+  hAPI.getCardValue('DEN_FUNCAO_FUNCIONARIO') + 
					"<br>Centro de Custo: "+  hAPI.getCardValue('CENTRO_CUSTO_FUNCIONARIO') + 
					"<br>Data prevista/desejável início: "+  hAPI.getCardValue('DATA_INICIO_PREVISTA') + 
					"<br>Nome Substituído: " + hAPI.getCardValue('NOME_FUNCIONARIO') +
					"<br><br>";
		} else if (hAPI.getCardValue('TIPOSOLICITACAO') == "D") {
			html += "<br>Nome: " + hAPI.getCardValue('NOME_FUNCIONARIO') +
					"<br>Filial:	"+  hAPI.getCardValue('DEN_FILIAL_FUNCIONARIO') +
					"<br>Função: "+  hAPI.getCardValue('DEN_FUNCAO_FUNCIONARIO') + 
					"<br>Centro de Custo: "+  hAPI.getCardValue('CENTRO_CUSTO_FUNCIONARIO') + 
					"<br>Data Desligamento/Último dia Trabalhado: "+  hAPI.getCardValue('DATA_INICIO_PREVISTA') + 
					"<br><br>";
		}
		else {
		html += "<br>Nome: " + hAPI.getCardValue('NOME_FUNCIONARIO') +
				"<br>Filial:	"+  hAPI.getCardValue('DEN_FILIAL_FUNCIONARIO') +
				"<br>Função: "+  hAPI.getCardValue('DEN_FUNCAO_FUNCIONARIO') + 
				"<br>Centro de Custo: "+  hAPI.getCardValue('CENTRO_CUSTO_FUNCIONARIO') + 
				"<br>Data prevista/desejável início: "+  hAPI.getCardValue('DATA_INICIO_PREVISTA') + 
				"<br><br>";
		}
		
		html +=		"<table style='width:100%;'  >" +
		    	"	<tr>" +
    			"		<td>" +
    			"			Tipo Item " +
    			"		</td>" +
    			"		<td>" +
    			"			Descricao  " +
    			"		</td>" +
    			"		<td>" +
    			"			OBS.  " +
    			"		</td>" ;
		
    	if( hAPI.getCardValue('TIPOSOLICITACAO') == "T" || hAPI.getCardValue('TIPOSOLICITACAO') == "D" ){
    		html += "	<td>" +
    				"		Já Possui? " +
    				"	</td>" ;
    	}
    	if(  hAPI.getCardValue('TIPOSOLICITACAO') == "N" ){
    		html += "	<td>" +
    				"		 Necessita? " +
    				"	</td>" ;
    	}
    	if (hAPI.getCardValue('TIPOSOLICITACAO') == "X") {
    		html += "	<td>" +
    				"		Já Possui? " +
    				"	</td>" ;
    		html += "	<td>" +
    				"		 Necessita? " +
    				"	</td>" ;
    	}
    	html += "	</tr>";
    	html += listaAprov[ it ]; 
    	html += "</table>";
		
    	
    	
    	var titulo = ''; 
	    
    	if( hAPI.getCardValue('TIPOSOLICITACAO') == "N" ){
    		titulo = 'Solicitação para Novo Colaborador';
    	} else if( hAPI.getCardValue('TIPOSOLICITACAO') == "T" ){
    		titulo = 'Solicitação para Transferencia de Colaborador';
    	} else if( hAPI.getCardValue('TIPOSOLICITACAO') == "D" ){
    		titulo = 'Solicitação para Desligamento de Colaborador';
    	} else if( hAPI.getCardValue('TIPOSOLICITACAO') == "X" ){
    		titulo = 'Solicitação para Substituição de Colaborador';
    	}
    	
    	log.info(' HTML 2 .......'+titulo+' '+html);
    	
    	SendMailAllUserRole( html, titulo, it.replace('Pool:Role:','')  );
    	 
    	
	}
	
}

function SendMailAllUserRole( msg, titulo, role ){
	
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint( 'processo', getValue('WKNumProces'), null, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'user', getValue("WKUser"), null, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'role', role, null, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'msg', msg, null, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'titulo', titulo, null, ConstraintType.MUST) );
    var dataset = DatasetFactory.getDataset( 'SendMailAllUserRole', null, constraints, null);
	
}


function getAprovadoresFromTable() {
	
	  log.info('getAprovadoresFromTable.......'+getValue('WKNumProces'));
		 
	  var solicitacao = getValue('WKNumProces');
	  var cardData = hAPI.getCardData(solicitacao);
	  var campos = cardData.keySet().toArray();

	  var aprovadores = [];

	  for (var i = 0; i < campos.length; i++) {
	    var campo = campos[i];
	    log.info('campo.......'+campo);
	    if (campo.indexOf('PAPEL_RESPONSAVEL_ITEM___') != -1) {
	      var indice = campo.replace('PAPEL_RESPONSAVEL_ITEM___', '');
	      log.info('indice.......'+indice);
	      var aprovador = {
	    	tipo_item: hAPI.getCardValue('TIPO_ITEM___' + indice) + '',
	    	descricao_item: hAPI.getCardValue('DESCRICAO_ITEM___' + indice) + '',
	    	observacao_item: hAPI.getCardValue('OBSERVACAO_COMPL___' + indice) + '', 
	    	necessita_item: hAPI.getCardValue('NECESSITA_ITEM___' + indice) + '',
	    	papel_responsavel_item: hAPI.getCardValue('PAPEL_RESPONSAVEL_ITEM___' + indice) + '',
	    	confirma: hAPI.getCardValue('CONFIRMA___' + indice) + '',
	    	possui_item: hAPI.getCardValue('POSSUI_ITEM___' + indice) + ''
	      };
	      log.info('aprovador......'+aprovador.papel_responsavel_item +' '+ aprovador.confirma );
	      aprovadores.push(aprovador);
	    }
	  }

	  return aprovadores;
	}
