	console.log('printRequisicao.............');
	
	function printRequisicao(){
		
		
		if( WO != undefined ){
			WO.document.close();
			WO.focus();
			WO.close();
		}
		
		
		var html = geralHtml(  );
		 	
				//console.log('html.....',html);
		WO = window.open('', "PrintWindow", "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
        //WindowObject.document.writeln(DocumentContainer.innerHTML);
		WO.document.writeln(html);
        //setTimeout("imprime();", 100);
   
        
	};

	
	function sendMail( id ){
		
		if( id == undefined ){
			$("input[name*=email_fornecedor___]").each(function (index) {
				sendMailSeq( $(this).attr('id').split('___')[1] );
			});
		}else{
			
			var fields = [ {'field':'select',
				'titulo':'Sel.',
				'type':'checkbox',
				'style':'margin-top:0px;padding-top: 0px;padding-bottom: 0px;',
				'class':'form-control',
				'livre':'',
				'width':'10%'},
			   {'field':'seq_linha',
			    'titulo':'Seq',
			    'type':'text',
			    'style':'padding-top: 0px;padding-bottom: 0px;',
			    'class':'form-control',
			    'livre':'readonly="readonly"',
			    //'precision':3,
			    'width':'10%'},
			   {'field':'texto_ped_cotacao',
			    'titulo':'Item',
			    'type':'text',
			    'style':'padding-top: 0px;padding-bottom: 0px;',
			    'class':'form-control',
			    'livre':'readonly="readonly"',
			    //'precision':3,
				'width':'80%'}];

			var itens = [];
			$("input[name^=cod_item___]").each(function(index, value){
				var seq = $(this).attr('id').split('___')[1];
				var item = {};
				item['select'] = "S";
				item['seq_linha'] = seq;
				item['texto_ped_cotacao'] = $('#texto_ped_cotacao___'+seq).val();
				itens.push(item);
			});
			aItesSel = [];
			modalTable( 'modal_itens_mail', 'Itens', fields, itens, 'large', id, '', 'N' );
		}
	}

	var aItesSel = [];
	
	
	function sendMailSeq( seqFornec ){
		
		var html = geralHtml( seqFornec );

		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint('destinatario', $('#email_fornecedor___'+seqFornec).val()+";"+$('#mail_atual').val(), null, ConstraintType.MUST));
		console.log('EMAIL OH ',$('#email_fornecedor___'+seqFornec).val()+";"+$('#mail_atual').val());
		constraints.push(DatasetFactory.createConstraint('remetente', $('#mail_atual').val(), null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('conteudo', html, null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('assunto', 'Requisição de Orçamento CERAMFIX - '+ $('#num_solic').val(), null, ConstraintType.MUST));
		var dataset = DatasetFactory.getDataset('enviaEmail', null, constraints, null);	
		
	}
	
	function geralHtml( seqFornec ){
		
		var ct = new Array();
		ct.push( DatasetFactory.createConstraint("cod_empresa", $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("table", 'empresa', null, ConstraintType.MUST) );
		var ds = DatasetFactory.getDataset('selectLogix', null, ct, null );
		var emp = {};
		if( ds != null ){
			emp = ds.values[0]
		}
		
		var html =  " <!DOCTYPE html> "+
					" <html> "+
					" 	<head> "+
					" 		<style> "+
					" 			table, th, td { "+
					" 				border: 1px solid black; "+
					" 				border-collapse: collapse; "+
					" 			} "+
					" 			th, td { "+
					" 				padding: 5px; "+
					" 			} "+
					"				.title { "+
					"					background-color: #ccc; "+
					"					text-align: center; "+
					"				} "+
					" 		</style> "+
					" 	</head> "+
					" <body> ";
			
		html += "<table style='width: 100%'><tr>"+
				"	<td colspan='24'> Olá, Gostaria de proposta comercial para compra dos itens abaixo: </td> "+
				
				"</tr> "+
				"</table>"
				
		html += "<table style='width: 100%' ><tr>" +
				"	<td style='width: 20%' ><img src='http://www.ceramfix.com.br/imgs/logofluig.png' id='logo' style='width: 220px;' ></td>" +
				"	<td style='width: 50%' align='center' >" +
				"			<font size='5' >Requisição de Orçamento</font>" +
				"			<br><font size='3' >Processo: "+ $('#num_solic').val()+"</font>" +
				"	</td>" +
				"	<td style='width: 30%' align='center' ><font size='2' >"+ emp["DEN_EMPRESA"] +
				"		<br>"+ emp["DEN_MUNIC"] +" - "+ emp["UNI_FEDER"]+
				"		<br>"+ emp["NUM_TELEFONE"] +
				"		<br>"+ emp["NUM_CGC"]+"</font>" +
				"	</td>" +
				"</tr></table>" +
				"<font size='2' face='Courier New' >" +
				"<table style='width: 100%;' font size = 2 > "+
				"	<tr style='height: 0px;visibility: hidden; '> "+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"		<td style='width: 4.16%; border-left-color: white; border-right-color: white;'> </td>"+
				"	</tr> ";
		
		if( seqFornec != undefined ){
			html += " <tr> "+
					"	<td colspan='24' > Fornecedor: "+ $('#cnpj_fornecedor___'+seqFornec).val() +" "+ $('#nom_fornecedor___'+seqFornec).val() +"</td> "+
					"</tr> ";
			if( $('#obs_fornecedor___' + seqFornec).val() != "" ){
				html += " <tr> "+
						"	<td colspan='24'> Consideração: "+ $('#obs_fornecedor___'+seqFornec).val().replace(/\n/g,'<br>') +"</td> "+
						"</tr> ";
			}
		}
		
		$("input[name^=cod_item___]").each(function(index, value){				
			var linha = $(this).attr('id').split('___')[1];
			if	($(this).attr("id")[0] != '_' ){
				if (index == 0) {
					html +=	"<tr> "+
							"	<td class='title' colspan='30'> "+
							"		<b>Itens</b> "+
							"	</td> "+
							"</tr> "+
							"<tr> "+
							"	<td colspan='3' ><b>Seq.</b></td> "+
							"	<td colspan='3' ><b>Cod Item</b></td> "+
							"	<td colspan='18' ><b>Descrição</b></td> "+
							"	<td colspan='3' ><b>Quant.</b></td> "+
							"	<td colspan='3' ><b>UM</b></td> "+
							"</tr> ";
				}
				
				if( aItesSel.indexOf( linha ) != -1
				 || aItesSel.length == 0 ){
					
					var idDocumento = $('#doc_anexo___'+linha).val();

					console.log("IdDocumento", idDocumento);
					
					html +=	"<tr> "+
							"	<td colspan='3' >"+linha+"</td> "+
							"	<td colspan='3' >"+$('#cod_item___' + linha).val()+"</td> ";
							
					if (idDocumento != null && idDocumento != 0) {
						var url;
						//= fluigAPI.getDocumentService().getDownloadURL(idDocumento);
						/*$.get(url_download, function(data, status){
						    url = data.content.toString();
						});*/	 
						var c11 = DatasetFactory.createConstraint("documentID", idDocumento, idDocumento, ConstraintType.MUST);
						var constraints1 = new Array(c11);
						var urldataset = DatasetFactory.getDataset("urlDocument", null, constraints1, null);
						
						url = urldataset.values[0]["result"];
						
						
						console.log("URL3... ", url);
						var link =  "<a href=" + url + ">ANEXO"+ "</a>";
						html += "	<td colspan='18'>"+$('#texto_ped_cotacao___' + linha).val().replace(/\n/g,'<br>')+'<br>'+$('#aplicacao___' + linha).val()+'<br>'+link+"</td> ";
						
					}	else {
						 html += "	<td colspan='18'>"+$('#texto_ped_cotacao___' + linha).val().replace(/\n/g,'<br>')+'<br>'+$('#aplicacao___' + linha).val()+"</td> ";
					}
							
							
					html +=	"	<td colspan='3' align='right' >"+$('#qtd_solic___' + linha).val()+"</td> "+
							"	<td colspan='3' align='right' >"+$('#cod_unid_med___' + linha).val()+"</td> "+
							"</tr> ";
				}
			}
		});
			
			
		html += //" <tr> "+
				//"	<td colspan='24'> Observações: "+ $('#texto_solic').val().replace(/\n/g,'<br>') +"</td> "+
				//"</tr> "+
				" <tr> "+
				"	<td colspan='30'> Condições de Fornecimento: "+ $('#obs_fornec').val().replace(/\n/g,'<br>') +"</td> "+
				"</tr> " +
				" <tr> "+
				"	<td colspan='30'> Informe o Prazo de Pagamento: </td> "+
				"</tr> ";
		
						
		html += "</table>" +
				"</font> ";
		
		
		var user = $('#user_atual').val();	 
		var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
		var constraints = new Array(c1);
		var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
		
		var area = colleagueMap.values[0]["especializationArea"];
		if( area == null || area == "null" ){
			area = "";
		}
		var proj = colleagueMap.values[0]["currentProject"];
		if( proj == null || proj == "null" ){
			proj = "";
		}
		var fone = colleagueMap.values[0]["extensionNr"];
		if( fone == null || fone == "null" ){
			fone = "";
		}
		
		html += "<br><br><br><a href=https://fluig.ceramfix.com.br/portal/p/99/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID="+ $('#num_solic').val() +">PROCESSO - "+ $('#num_solic').val() +"</a>" +
			   "<br><br>"+
			   "<br><b>"+ colleagueMap.values[0]["colleagueName"] +"</b>"+
			   "<br><b>"+ area +" "+ proj +"</b>"+
			   "<br><b>"+ fone +"</b>"+
			   "<br><br>";
		
	  	html += "</body> "+
				"</html> ";
		
		
		return html;
		
	}
	
	
	var WO;
	
	function imprime( ){
		WO.document.close();
		WO.focus();
		WO.print();
		WO.close();		
	}
	
	function pad (str, max) {
	  str = str.toString();
	  return str.length < max ? pad("0" + str, max) : str;
	};
		
	function sortChar(a,b) {
		return a - b;
	};	
	
	
	function movimentActivity(completeTask, formData, selectedColleague, selectedState, showMessage, isAutomatic, onComplete, isReturn, passValue, subProcessId, subProcessSequence, hideModal, transferTaskAfterSelection) {

		var comments = "";
		var newObservations = [];
		if (parent.ECM_WKFView.wkfViewObservation) {
			comments = parent.ECM_WKFView.wkfViewObservation.getObservation();
			newObservations = parent.ECM_WKFView.wkfViewObservation.getUnsentObservations()
		}
		var _this = parent.ECM_WKFView,
			message = "",
			attachments = [];
		var pID = parent.ECM.workflowView.processDefinition.processInstanceId;
		this.newRequest = pID === 0;
		if (this.newRequest) {
			attachments = parent.WKFViewAttachment.getAllAttachments()
		}
		var senddata = {
			processInstanceId: pID,
			processId: parent.ECM.workflowView.processId,
			version: parent.ECM.workflowView.version,
			taskUserId: parent.ECM.workflowView.processDefinition.taskUserId,
			completeTask: completeTask,
			currentMovto: parent.ECM.workflowView.processDefinition.currentMovto,
			managerMode: parent.ECM.workflowView.processDefinition.managerMode ? true : false,
			selectedDestinyAfterAutomatic: _this.conditionsAutomatic.selectedDestinyAfterAutomatic,
			conditionAfterAutomatic: _this.conditionsAutomatic.conditionAfterAutomatic,
			selectedColleague: selectedColleague,
			comments: comments,
			newObservations: newObservations,
			appointments: parent.ECM.workflowView.appointments,
			attachments: attachments,
			pass: passValue,
			digitalSignature: parent.ECM.workflowView.digitalSignature,
			formData: formData,
			deleteUploadFiles: parent.ECM.workflowView.deleteUploadFiles,
			isDigitalSigned: parent.ECM.workflowView.isDigitalSigned,
			isLinkReturn: isReturn,
			versionDoc: parent.ECM.workflowView.processDefinition.versionDoc,
			selectedState: selectedState,
			internalFields: parent.ECM.workflowView.internalFields,
			subProcessId: subProcessId,
			subProcessSequence: subProcessSequence,
			transferTaskAfterSelection: transferTaskAfterSelection,
			currentState: parent.ECM.workflowView.sequence
		};
		parent.WCMAPI.Create({
			url: parent.ECM.restUrl + "workflowView/send",
			async: true,
			data: senddata,
			styleGuide: true,
			success: function (data) {

				parent.window.onbeforeunload = null;
				parent.location.reload(true);

			},
			error: function (err) {
				alert("error")
				//loading2.hide()
			},
			complete: function () {

			}
		})
	}