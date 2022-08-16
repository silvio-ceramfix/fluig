function beforeTaskSave(colleagueId,nextSequenceId,userList){
	log.info('beforeTaskSave start....');
	
	
	if ( getValue("WKNumState") == 176 && !getValue("WKCompletTask")
		&& hAPI.getCardValue("max_dat_prev_item_compra") != hAPI.getCardValue("max_dat_conf_item_compra") ){
		
		var msg = "Produto: "+hAPI.getCardValue("den_item")+
			      "<br><br>" +
  			      "<b>Data de entrega reprogramada!</b>";
		var titulo = 'Desenvolvimento de produto (Data): '+hAPI.getCardValue("den_item");
		SendMailAllUserProc( msg, titulo );
	}
	
	if ( ( getValue("WKNumState") == 15 || getValue("WKNumState") == 7 )
		&& getValue("WKNextState") == 10
		&& getValue("WKCompletTask") ){
			
			var msg = "Produto: "+hAPI.getCardValue("den_item")+
				      "<br><br>" +
	  			      "<b>Processo de desenvolvimento de produto reprovado pelo marketing!</b>";
			var titulo = 'Desenvolvimento de produto (Reprovado): '+hAPI.getCardValue("den_item");
			SendMailAllUserProc( msg, titulo );
	}
	
	if ( getValue("WKNumState") == 97
	  && getValue("WKNextState") == 99
	  && getValue("WKCompletTask") ){
			
			var msg = "Produto: "+hAPI.getCardValue("den_item")+
				      "<br><br>" +
	  			      "<b>Processo de desenvolvimento de produto reprovado pela controladoria!</b>";
			var titulo = 'Desenvolvimento de produto (Reprovado): '+hAPI.getCardValue("den_item");
			SendMailAllUserProc( msg, titulo );
	}
	
/*	
	var camposItem = hAPI.getCardData(getValue("WKNumProces"));
	var contadorItem = camposItem.keySet().iterator();
	var lista = {};
	var docs = hAPI.listAttachments();
    for (var i = 0; i < docs.size(); i++) {
        var doc = docs.get(i);
        if (doc.getDocumentType() != "7") {
            continue;
        }
        lista[ doc.getDocumentDescription().trim() ] = doc.getDocumentId();
        log.info('beforeTaskSave....'+doc.getDocumentDescription()+' '+doc.getDocumentId() );
    }
    log.info('set avulso....');
    hAPI.setCardValue('doc_custo_meta', getValLista( lista, 'custo_meta' ) );
    hAPI.setCardValue('doc_formulacao', getValLista( lista, 'formulacao' ) );
    hAPI.setCardValue('doc_ficha_tec', getValLista( lista, 'ficha_tecnica' ) );
    hAPI.setCardValue('doc_fispq_produto', getValLista( lista, 'fispq_produto' ) );
    hAPI.setCardValue('doc_fispq_premix', getValLista( lista, 'fispq_premix' ) );
    
    log.info('proc....');
	var camposItem = hAPI.getCardData(getValue("WKNumProces"));
	var contadorItem = camposItem.keySet().iterator();
	
	log.info('while....');
	while (contadorItem.hasNext()) {
		var idItem = contadorItem.next();
		var campo = idItem.split('___')[0];
		var seqItem = idItem.split('___')[1];
		//log.info('campo....'+campo+' '+idItem+' '+seqItem);
		if( seqItem != undefined ){
			if ( campo == "DOC_CUSTOS") {				
				index = 'custo_'+ hAPI.getCardValue('cst_empresa___'+seqItem).trim()+'_'+hAPI.getCardValue('cst_uf___'+seqItem).trim();
				log.info('index....'+index+lista+lista[index]);
				var valor = getValLista( lista, index );
				log.info('getValLista.....'+valor);
				if( valor != '' ){
					log.info('Entrei.....'+valor);
					hAPI.setCardValue("doc_custos___"+seqItem, valor );
				}
			}
		}
	}
	*/
	
}

function SendMailAllUserProc( msg, titulo ){
	
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint( 'processo', getValue("WKNumProces"), null, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'user', getValue("WKUser"), null, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'msg', msg, null, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'titulo', titulo, null, ConstraintType.MUST) );
    var dataset = DatasetFactory.getDataset( 'SendMailAllUserProc', null, constraints, null);
	
}

function getValLista( ls, campo ){
	try{
		var valor = ls[ campo ];
		log.info('valor.....'+valor);
		if( valor == undefined ){
			return '';
		}
		return valor;
	} catch (e){
		return '';
	}
	return '';
}