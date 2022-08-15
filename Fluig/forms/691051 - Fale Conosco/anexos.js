
var WCMAPI = this.parent.WCMAPI;

function listaDocumento( documento ){
		
		
	    var constraints = new Array();
 		constraints.push( DatasetFactory.createConstraint('d.nr_documento', documento, documento, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('iesAnexo', 'S', null, ConstraintType.MUST) );
						
	    var dataSet = DatasetFactory.getDataset("dsk_contratos", null, constraints, null);
	    
	    var regs = [];
	    var regAtu = [];
	    
	    console.log('dataSet...',dataSet);
	    
	    var html = ""; 
	    
	    if( dataSet != null && dataSet != undefined ){
	    	var valor_saldo = 0;
		    for (var i = 0; i < dataSet.values.length; i++) {
		    	
		    	
			html += "<div class='row' > "+ 
		 			" <button class='btn btn-warning btn-xs' onclick='openDocumento("+ dataSet.values[i]["id_doc"] +")' ><span class='fluigicon fluigicon-form'></button> "+
					" <a onclick='openDocumento("+ dataSet.values[i]["id_doc"] +")' >"+ dataSet.values[i]["descricao_doc"] +"</a> "+
		 			"</div>";
			
		    }
	    }
		
		parent.$('#workflowView-cardViewer').css( 'zIndex', 1 );
	
		console.log('html....',html);
			
		var myModal = FLUIGC.modal({
			title: 'Documentos Anexos',
			content: html,
			id: 'wItem',
			formModal: false,
			size: 'large',
			actions: [{
				'label': 'Fechar',
				'autoClose': true
			}]
		}, function(err, data) {
			if(err) {
				// do error handling
			} else {
			
				
			};
			
		});	
	}

function openFormulario(doc){
				
	var parentOBJ;

	if (window.opener) {
		parentOBJ = window.opener.parent;
	} else {
	    parentOBJ = parent;
	}

	var cfg = {
		url : "/ecm_documentview/documentView.ftl",
	    maximized : true,
	    title : "Anexo",
	    callBack : function() {
	        parentOBJ.ECM.documentView.getDocument( doc );
	    },
	    customButtons : []
	};
	parentOBJ.ECM.documentView.panel = parentOBJ.WCMC.panel(cfg);
}

function openDocumento(doc){
				
	console.log('openDocumento', doc );

	var url = WCMAPI.tenantURL + "/ecmnavigation?app_ecm_navigation_doc="+ doc;
	
	window.open(url, '_blank');
	
	/*
	var parentOBJ;

	if (window.opener) {
		parentOBJ = window.opener.parent;
	} else {
	    parentOBJ = parent;
	}

	console.log('parentOBJ....',parentOBJ);
	
	var cfg = {
		url : "/ecm_documentview/documentView.ftl",
	    maximized : true,
	    title : "Anexo",
	    callBack : function() {
	           parentOBJ.ECM.documentView.getDocument( doc );
	    },
	    customButtons : []
	};
	
	console.log('cfg....',cfg);
	
	parentOBJ.ECM.documentView.panel = parentOBJ.WCMC.panel(cfg);
	*/			
}

function openProcesso( processo ){
	var url = WCMAPI.tenantURL + '/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID='+processo;
	console.log('url........',url);
	window.open(url, '_blank');
}




function openFile( doc, version ){

	if( doc == "" ){
		return false;
	}
	
	var parentOBJ;

	if (window.opener) {
		parentOBJ = window.opener.parent;
	} else {
	    parentOBJ = parent;
	}

	var cfg = {
			url : "/ecm_documentview/documentView.ftl",
	        maximized : true,
	        title : "Anexo",
	        callBack : function() {
	            parentOBJ.ECM.documentView.getDocument( doc, version );
	        },
	        customButtons : []
	};
	parentOBJ.ECM.documentView.panel = parentOBJ.WCMC.panel(cfg);
	
}
