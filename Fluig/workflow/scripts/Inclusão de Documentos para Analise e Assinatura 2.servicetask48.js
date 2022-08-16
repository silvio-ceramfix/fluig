function servicetask48(attempt, message) {
	
	parentFolder = String(hAPI.getCardValue("folderID"));
	getAttach();
	
    var anexos = new java.util.ArrayList();
    var docs = hAPI.listAttachments();     
    log.info('documentos '+docs);
    
    var formatter = new java.text.SimpleDateFormat("dd/MM/yyyy");
    
    if (docs.size() > 0) {
        for (var i = 0; i < docs.size(); i++) {
    
        	//inicia a integracao do documento
        	var doc = docs.get(i);
		    log.info('documentos2 '+doc);
		            
		    if ( !createDocument(doc, parentFolder) ){
		    	throw "Erro ao publicar documento!";
		    }
		    
		    var childData = new java.util.HashMap();
	        childData.put("descricao_doc", doc.getDocumentDescription() );
	        childData.put("data_hora_doc", formatter.format( doc.getCreateDate() )+"" );
	        childData.put("id_doc", 	   doc.getDocumentId()+"" );
	        childData.put("versao_doc",    doc.getVersion()+"" );
	        
	        if( doc.getDocumentDescription().indexOf('Aux ') == -1 ){ 
	        	childData.put("integrar", "S" );
	        	childData.put("envia_doc", "on" );
	        }else{
	        	childData.put("integrar", "N" );
	        	childData.put("envia_doc", "" );
	        }
	        hAPI.addCardChild("tableDocumentos", childData);
	        
        }
    }
}
