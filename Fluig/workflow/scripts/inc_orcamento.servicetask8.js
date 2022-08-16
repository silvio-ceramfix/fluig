function servicetask8(attempt, message) {
	
	//var constraints = new Array();
	var cod_empresa = hAPI.getCardValue( "empresa" );
	var cod_cliente = hAPI.getCardValue( "cod_cliente" );
	var cod_repres = hAPI.getCardValue( "cod_repres" );
	var numProcesso = getValue('WKNumProces');
	//var userId = getValue("WKUser");
			
	log.info( 'Inicio envio....' );
		
	var c1 = DatasetFactory.createConstraint("cod_empresa",  cod_empresa, cod_empresa, ConstraintType.MUST);
	var constraints = new Array(c1);
	var empresa = DatasetFactory.getDataset("empresa", null, constraints, null);

	var dfs = java.text.DecimalFormatSymbols();
	dfs.setDecimalSeparator(',');
	dfs.setPerMill('.');
	df2 = new java.text.DecimalFormat("0.00",dfs);
	df0 = new java.text.DecimalFormat("0",dfs);
		
	var s = '000000000000000000000000'.substring( 0, empresa.getValue(0, "qtd_casas_decimais_preco_unit" ) );
	den_empresa_reduz = empresa.getValue(0, "den_reduz" );
	dfp = new java.text.DecimalFormat("0."+s,dfs);
	
	log.info( 'B......'+cod_repres );
		
	var c1 = DatasetFactory.createConstraint("cod_repres", cod_repres, cod_repres, ConstraintType.MUST);
	var constraints = new Array(c1);
	var representante = DatasetFactory.getDataset("representante", null, constraints, null);		

	var nom_repres = "";
	var fone = "";
	if( representante.rowsCount > 0 ){
		nom_repres = representante.getValue(0, "NOM_REPRES");
		fone = representante.getValue(0, "FONE");
	}
	
	var HTML = "<html> "+
		"	    <head> "+
		"	        <meta charset='UTF-8' /> "+
		"	        <title></title> "+
		"	        <style> "+
		"				.borda-round{ "+
		"					border: 1px solid black; "+ 
		"					border-radius: 5px;  "+
		"					-moz-border-radius:  "+
		"					5px; padding: 5px; "+
		"					padding-top: 0px; "+
		"					padding-bottom: 0px; "+
		"				} "+
		"				 "+
		"				.borda-round-prod{ "+
		"					border: 1px solid black; "+ 
		"					border-radius: 5px;  "+
		"					-moz-border-radius: 5px; "+ 
		"					padding: 5px; "+
		"					text-align: center; "+
		"					padding-top: 0px; "+
		"					padding-bottom: 0px; "+
		"				} "+
		"		 "+
		"				@media print { "+
		"					div.divFooter { "+
		"						position: fixed; "+
		"						bottom: 0; "+
		"					} "+
		"				} "+
		"	        </style> "+
		"	    </head> "+
		"	    <body> "+
				
		"			<table width='950' border='0' cellpadding='0' cellspacing='0'> "+
		"				<tr> "+
		"					<td> "+
		"						<img src='https://fluig.ceramfix.com.br/volume/stream/Rmx1aWc=/P3Q9MSZ2b2w9RGVmYXVsdCZpZD00MDUxMDcmdmVyPTEwMDAmZmlsZT1jYWJlY2FsaG9fcHJvZm9ybWEucG5nJmNyYz0xMTgyNjA5MDIxJnNpemU9MC4wNTEzMTYmdUlkPTQ1MTcmZlNJZD00NTAzJnVTSWQ9NDUwMyZkPWZhbHNlJnRrbj0mcHVibGljVXJsPXRydWU=.png' style='width: 650px; height: 215px;' /> "+
		"					</td> "+
		"					<td> "+
		"						<table width='100%' border='0' cellpadding='0' cellspacing='0'> "+
		"	                        <tr> "+
		"	                            <td align='center'><b style='font-size: 32;' >Or&ccedil;amento: "+ numProcesso +"</b></td> "+
		"	                        </tr> "+
		"	                        <tr> "+
		"	                            <td align='center'>Data: "+ hAPI.getCardValue("data_emissao") +"</td> "+
		"	                        </tr> "+
		"	                        <tr> "+
		"	                            <td align='center'>Validade: "+ hAPI.getCardValue("data_validade") +"</td> "+
		"	                        </tr> "+
		"	                    </table> "+
		"					</td> "+
		"				</tr> "+
		"			</table> "+
		"			<br> "+
		"			<table width='950' border='0' cellpadding='0' cellspacing='0' > "+
		"				<tr> "+
		"					<td class='borda-round' > "+
		"						<b>Cliente: </b>"+ hAPI.getCardValue("cnpj") +" - "; 
		
		if ( hAPI.getCardValue('tipo_cadastro') == 'N'  )
			HTML += hAPI.getCardValue("razao_social");
		else
			HTML += hAPI.getCardValue("razao_social_zoom");
		
		HTML += "	</td> "+
		"				</tr> "+
		"				<tr> "+
		"					<td class='borda-round' > "+
		"						<b>Representante: </b>"+ nom_repres +" - "+ fone +"  "+
		"					</td> "+
		"				</tr> "+
		"			</table> "+
		"			<br> "+
		"			 "+
		"			<table width='950' border='0' cellpadding='0' cellspacing='0'> "+
		"	            <tr style='background-color: bisque;' > "+
		"	                <td width='5%' class='borda-round-prod'><b>Seq</b></td> "+
		"	                <td width='10%' class='borda-round-prod'><b>Cod Item</b></td> "+
		"	                <td width='40%' class='borda-round-prod'><b>Descri&ccedil;&atilde;o</b></td> "+
		"	                <td width='10%' class='borda-round-prod' style='display:true' ><b>Prz Entrega</b></td> "+
		"	                <td width='10%' class='borda-round-prod'><b>Qtd.</b></td> "+
		"	                <td width='5%' class='borda-round-prod'><b>UM</b></td> "+
		"	                <td width='10%' class='borda-round-prod'><b>Pre&ccedil;o Unit&aacute;rio</b></td> "+
		"	                <td width='10%' class='borda-round-prod'><b>Pre&ccedil;o Liquido</b></td> "+
		"	                <td width='10%' class='borda-round-prod'><b>Pre&ccedil;o Total</b></td> "+
		"	            </tr> ";
		
		var camposItem = hAPI.getCardData( getValue("WKNumProces") );
		log.info( camposItem );
		var contadorItem = camposItem.keySet().iterator();
		log.info( contadorItem );
		while ( contadorItem.hasNext() ) {
			var idItem = contadorItem.next();
			log.info( idItem ); 
			var campo = idItem.split('___')[0];
			var seqItem = idItem.split('___')[1];
			if ( seqItem != undefined && campo == "COD_ITEM" ){
			 
				log.info( "ADD CV"+hAPI.getCardValue("cod_item___"+seqItem ) );

			    var style = ""
			    if( seqItem % 2 == 0 ){
			    	style ="style='background-color: bisque;'"; 
			    }
			    	
			    var valUnit = getValueFormFloat("valor_unit___"+seqItem,"0");
			    var valUnitLiq = getValueFormFloat("valor_unit_liq___"+seqItem, "0" );
			    var valorTotal = getValueFormFloat("valor_total___"+seqItem, "0" );
			    
			    var cotacao = getValueFormFloat("cotacao","0");
			    
			    if( cotacao != 0 && cotacao != 1 && !isNaN( cotacao ) ){
			    	valUnit = valUnit * cotacao;
			    	valUnitLiq = valUnitLiq * cotacao;
			    	valorTotal = valorTotal * cotacao;
			    	
			    }
			    		
			    HTML += "<tr height='20' "+ style +" > "+
						"	<td class='borda-round-prod' >"+ seqItem +"</td> "+
						"	<td class='borda-round-prod'>"+ hAPI.getCardValue("cod_item___"+seqItem ) +"</td> ";
						//apendar o campo do código do item para o cliente
						
						var constraints = new Array();
						constraints.push(DatasetFactory.createConstraint('dataBase', 'java:/jdbc/LogixPRD', null, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint('table', 'cliente_item', null, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint('cod_empresa', cod_empresa, cod_empresa, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint('cod_cliente_matriz', cod_cliente, cod_cliente, ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint('cod_item', hAPI.getCardValue("cod_item___"+seqItem ), hAPI.getCardValue("cod_item___"+seqItem ), ConstraintType.MUST));
						constraints.push(DatasetFactory.createConstraint('aplicacao',	'P', 'P', ConstraintType.MUST));

						var filds = new Array('cod_item_cliente');
						var order = new Array();

						var dataSet = DatasetFactory.getDataset("selectTable", filds, constraints, order);

						if (dataSet != null && dataSet != undefined && dataSet.rowsCount > 0) {
							HTML += "	<td class='borda-round-prod' style='text-align: left;' >"+ hAPI.getCardValue("den_item___"+seqItem ) +" Cod. It. Cli.: "+dataSet.getValue(0, 'cod_item_cliente')+"</td> ";
						} else {
							HTML += "	<td class='borda-round-prod' style='text-align: left;' >"+ hAPI.getCardValue("den_item___"+seqItem ) +"</td> ";
						}
						
						//fim apendar o campo do código do item para o cliente
						HTML += "	<td class='borda-round-prod' style='display:true' >"+ hAPI.getCardValue("data_entrega___"+seqItem ) +"</td> "+
						"	<td class='borda-round-prod' >"+ hAPI.getCardValue("quantidade___"+seqItem ) +"</td> "+
						"	<td class='borda-round-prod' >"+ hAPI.getCardValue("um___"+seqItem ) +"</td> "+
						"	<td class='borda-round-prod' >"+ df2.format( valUnit ) +"</td> "+
						"	<td class='borda-round-prod' >"+ df2.format( valUnitLiq ) +"</td> "+
						"	<td class='borda-round-prod' >"+ df2.format( valorTotal ) +"</td> "+
						"</tr>";

			}
		}
	
		var valorBruto = getValueFormFloat("valor_bruto", "0" );
		var valorDesc = getValueFormFloat("total_desc", "0" );
		var valorGeral = getValueFormFloat("valor_total_geral", "0" );
		    
		var cotacao = getValueFormFloat("cotacao","0");
		    
		if( cotacao != 0 && cotacao != 1 && !isNaN( cotacao ) ){
			valorBruto = valorBruto * cotacao;
			valorDesc = valorDesc * cotacao;
			valorGeral = valorGeral * cotacao;
		}
		
		HTML += "		<tr height='20'> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td ' style='display:true' >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td class='borda-round-prod' colspan='2'  style='background-color: bisque;' ><b>Total Bruto</b></td> "+
		"	                <td class='borda-round-prod' > "+ df2.format( valorBruto ) +"</td> "+
		"	            </tr> "+
		"				<tr height''20'> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td ' style='display:true' >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td class='borda-round-prod' colspan='2' style='background-color: bisque;' ><b>Desconto</b></td> "+
		"	                <td class='borda-round-prod' > "+ df2.format( valorDesc ) +"</td> "+
		"	            </tr> "+
		"				<tr height='20'> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td ' style='display:true' >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td class='borda-round-prod' colspan='2'  style='background-color: bisque;' ><b>Valor Liquido</b></td> "+
		"	                <td class='borda-round-prod' > "+ df2.format( valorGeral ) +"</td> "+
		"	            </tr> "+
		"				<tr height='20'> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td ' style='display:true' >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td class='borda-round-prod' colspan='2'  style='background-color: bisque;' ><b>ICMS ST</b></td> "+
		"	                <td class='borda-round-prod' > "+ hAPI.getCardValue("val_st_total" ) +"</td> "+
		"	            </tr> "+
		"				<tr height='20'> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td ' style='display:true' >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td class='borda-round-prod' colspan='2'  style='background-color: bisque;' ><b>IPI</b></td> "+
		"	                <td class='borda-round-prod' > "+ hAPI.getCardValue("val_ipi_total" ) +"</td> "+
		"	            </tr> "+
		"				<tr height='20'> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td ' style='display:true' >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td >&nbsp;</td> "+
		"	                <td class='borda-round-prod' colspan='2'  style='background-color: bisque;' ><b>Valor Total</b></td> "+
		"	                <td class='borda-round-prod' > "+ hAPI.getCardValue("val_rob_total" ) +"</td> "+
		"	            </tr> "+
		"			</table> "+
		"			<br> "+
		"			<table width='450' border='0' cellpadding='0' cellspacing='0'> "+
		"	            <tr> "+
		"	                <td width='100%' colspan='2' align='center' height='20' class='borda-round-prod' style='background-color: bisque;' ><b>Condi&ccedil;&otilde;es de Fornecimento</b></td> "+
		"	            </tr> "+
		"			</table> "+
		"			<table width='450' border='0' cellpadding='0' cellspacing='0'> "+
		"				<tr> "+
		"	                <td width='50%' height='20' class='borda-round-prod' colspan='2' style='background-color: bisque;' ><b>Condi&ccedil;&atilde;o de Pagamento:</b></td> "+
		"	                <td width='50%' height='20' class='borda-round-prod' >"+ loadCampoDataSet( "condicao_pagamento_vdp", "cod_cnd_pgto", hAPI.getCardValue("cond_pagamento"), "den_cnd_pgto" ) +"</td> "+
		"	            </tr> "+
		"	            <tr> "+
		"	                <td height='20' class='borda-round-prod' colspan='2' style='background-color: bisque;' ><b>Lista de Pre&ccedil;o:</b></td> "+
		"	                <td height='20' class='borda-round-prod' >"+ loadCampoDataSet( "lista_de_preco", "num_list_preco", hAPI.getCardValue("lista_preco"), "den_list_preco" ) +"</td> "+
		"	            </tr> "+
		"	            <tr> "+
		"	                <td height='20' class='borda-round-prod' colspan='2' style='background-color: bisque;' ><b>Moeda:</b></td> "+
		"	                <td height='20' class='borda-round-prod' >"+ loadCampoDataSet( "moeda", "cod_moeda", hAPI.getCardValue("moeda"), "den_moeda_abrev" ) +"</td> "+
		"	            </tr> "+
		"	        </table> "+
		"			<br> "+
		"			 "+
		"			<div class='divFooter'> "+
		"				<table width='950' border='0' cellpadding='0' cellspacing='0'> "+
		"					<tr> "+
		"						<td align='center' height='20' class='borda-round-prod' style='background-color: bisque;' ><b>Observa&ccedil;&otilde;es</b></td> "+
		"					</tr> "+
		"					<tr> "+
		"						<td height='20' class='borda-round' > ";
		
		if ( hAPI.getCardValue("texto_pedido_1" ) != "" ){ 
			HTML +=  hAPI.getCardValue("texto_pedido_1" )+"<br>";
		}
		if ( hAPI.getCardValue("texto_pedido_2" ) != "" ){ 
			HTML +=  hAPI.getCardValue("texto_pedido_2" )+"<br>";
		}
		
		if ( hAPI.getCardValue("pedido_cliente" ) != "" ){ 
			HTML +=  "Num. Pedido Cliente:" + hAPI.getCardValue("pedido_cliente" )+"<br>";
		}
		
		HTML += "					O or&#231;amento est&#225; sujeito a confirma&#231;&#227;o, de acordo com a Politica Comercial da CERAMFIX, Disponibilidade de Estoque e An&#225;lise de Cr&#233;dito.  "+
		"							<br> "+
		"							VALORES DESTE OR&Ccedil;AMENTO EST&Atilde;O SUJEITOS A ALTERA&Ccedil;&Atilde;O AT&Eacute; O FECHAMENTO POR QUEST&Otilde;ES TRIBUT&Aacute;RIAS."+
		"						</td> "+
		"					</tr> "+
		"				</table> "+
		"				 "+
		"				<br> "+		
		"				<table width='950' border='0' cellpadding='0' cellspacing='0' height='95' "+
		"					style='background-image: url(\"https://fluig.ceramfix.com.br/volume/stream/Rmx1aWc=/P3Q9MSZ2b2w9RGVmYXVsdCZpZD00MDUxMDYmdmVyPTEwMDEmZmlsZT1yb2RhcGVfcHJvZm9ybWEucG5nJmNyYz0yNTE4ODgwNzQ0JnNpemU9MC4wMDIzMjYmdUlkPTQ1MTcmZlNJZD00NTAzJnVTSWQ9NDUwMyZkPWZhbHNlJnRrbj0mcHVibGljVXJsPXRydWU=.png\");'	> "+
		"					<tr> "+
		"						<td> "+
		"						</td> "+
		"					</tr> "+
		"					<tr> "+
		"						<td > "+
		"							<table style='color:white' width='950' > "+
		"								<tr> "+
		"									<td style='text-align: center; color:white;' > "+
		"										"+ empresa.getValue(0, "end_empresa") +" - "+ empresa.getValue(0, "den_bairro") + " - " + empresa.getValue(0, "cod_cep") + " - " + empresa.getValue(0, "den_munic") + " - " + empresa.getValue(0, "uni_feder") +" - "+ empresa.getValue(0, "num_telefone") +" "+
		"									</td> "+
		"								</tr> "+
		"								<tr> "+
		"									<td style='text-align: center; color:white;'> "+
		"										CNPJ: "+ empresa.getValue(0, "num_cgc") +" - IE: "+ empresa.getValue(0, "ins_estadual" ) +" "+
		"									</td> "+
		"								</tr> "+
		"							<table> "+
		"						</td> "+
		"					</tr> "+
		"				</table> "+
		"			</div> "+
		"		</body> ";
										
			    	 
	var HTML_CLI = ( new String( HTML ) ).replace(/style='display:true'/g,"style='display:none'");
	//.replace(/<td colspan='5' id='Empty_Cell_1'>/g,"<td colspan='4' id='Empty_Cell_1'>").replace(/<td colspan='5'>/g,"<td colspan='4'>");

	HTML += "</body>"+
			"</html>";

	HTML_CLI += "</body>"+
				"</html>";
	
	log.info( HTML );
	log.info( HTML_CLI );   
    
    
	// ######## RECUPERA AREA DE UPLOAD DO USUÃ¿RIO
	var user = getValue("WKUser");
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("colleaguePK.companyId", 1, 1, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("chave",'UserPhysicalVolumeUpload', 'UserPhysicalVolumeUpload',ConstraintType.MUST));
	var usuario = DatasetFactory.getDataset("colleagueParam", null,	constraints, null);
	var path = '';
	if (usuario.values.length > 0) {
		path = usuario.getValue(0, "val_param");
		log.info('ENTREI..... ');
	}
	log.info('CAMINHO..... ' + path);

	// ###### PUBLICA ARQUIVOS HTML NO PASTA DE ARQUIVOS
	var nomeFile = "ORC_"+cod_empresa + "_" + numProcesso;
	var extFile = 'html';
	var diretorio = new java.io.File(path); // ajfilho é uma pasta!
	log.info('Resultado com a pasta ' + diretorio);
	try {

		if (!diretorio.exists()) {
			diretorio.mkdirs(); // mkdir() cria somente um diretório,
								// mkdirs() cria diretórios e subdiretórios.
			log.info("Diretório será criado")
		} else {
			log.info("Diretório já existente");
		}
		// if () {
		var file = new java.io.File(path + nomeFile + "." + extFile);
		file.createNewFile();
		var fiWi = new java.io.FileWriter(file.getAbsoluteFile());
		var buWi = new java.io.BufferedWriter(fiWi);
		buWi.write(HTML_CLI);
		buWi.close();

		var file = new java.io.File(path + nomeFile + "_rep." + extFile);
		file.createNewFile();
		var fiWi = new java.io.FileWriter(file.getAbsoluteFile());
		var buWi = new java.io.BufferedWriter(fiWi);
		buWi.write(HTML);
		buWi.close();
		// }
	} catch (e) {
		log.info('ERROOOOO.....' + e);
	}

	// ## CRIA DOCUMENTO CLIENTE
	var dto = docAPI.newDocumentDto();
	dto.setDocumentDescription(nomeFile);
	dto.setDocumentType("2");

	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("cod_empresa",	cod_empresa, cod_empresa, ConstraintType.MUST));
	var paramEmpresa = DatasetFactory.getDataset("empresa_compl", null,	constraints, null);
	var folder = 1228;
	if (paramEmpresa != null && paramEmpresa.values.length > 0) {
		log.info("ACHEI FOLDER..........: "+ paramEmpresa.getValue(0, "num_pasta"));
		folder = parseInt(paramEmpresa.getValue(0, "num_pasta"));
	}

	dto.setParentDocumentId(folder);
	dto.setDocumentTypeId("");
	dto.setInheritSecurity(false);
	// ## CRIA ARQUIVO
	var attachArray = new java.util.ArrayList();
	var mainAttach = docAPI.newAttachment();
	mainAttach.setFileName(nomeFile + "." + extFile);
	mainAttach.setPrincipal(true);
	mainAttach.setAttach(false);
	attachArray.add(mainAttach);
	// Adicionando aprovadores
	dto.setActiveVersion(true);
	dto.setColleagueId(getValue("WKUser")); // Informar o usuÃ¿Â¡rio logado.
	dto.setPublisherId(getValue("WKUser")); // Informar o publicador.
	try {
		var doc = docAPI.createDocument(dto, attachArray, null, null, null);
		log.info("DOCUMENTO CRIADO COM O ID: " + doc.getDocumentId());
	} catch (e) {
		log.error("Problemas na criaÃ§Ã£o do documento:\n" + e);
	}

	// ## CRIA DOCUMENTO REPRES
	var dto = docAPI.newDocumentDto();
	dto.setDocumentDescription(nomeFile + "_rep");
	dto.setDocumentType("2");
	dto.setParentDocumentId(folder);
	dto.setDocumentTypeId("");
	// ## CRIAR ARQUIVO
	var attachArray = new java.util.ArrayList();
	var mainAttach = docAPI.newAttachment();
	mainAttach.setFileName(nomeFile + "_rep." + extFile);
	mainAttach.setPrincipal(true);
	mainAttach.setAttach(false);
	attachArray.add(mainAttach);
	// Adicionando aprovadores
	dto.setActiveVersion(true);
	dto.setColleagueId(getValue("WKUser")); // Informar o usuÃ¿Â¡rio logado.
	dto.setPublisherId(getValue("WKUser")); // Informar o publicador.
	try {
		var doc = docAPI.createDocument(dto, attachArray, null, null, null);
		log.info("DOCUMENTO CRIADO COM O ID: " + doc.getDocumentId());
	} catch (e) {
		log.error("Problemas na criaÃ§Ã£o do documento:\n" + e);
	}

    
    //#####  ENVIO DE E-MAIL
    // Recuperado informaÃ§Ãµes para envia de e-mail via jboss
	var contextWD = new javax.naming.InitialContext();
	var mailSession = contextWD.lookup("java:jboss/mail/Default");
	
	//Gera e-mail cliente
	var to = new Array();
	//###### BUSCA DADOS CLIENTE - LOGIX REST	
	var listaMail = hAPI.getCardValue("emailOrc").split(";");
	for ( var i = 0; i < listaMail.length; i++ ){
		to.push( new javax.mail.internet.InternetAddress( listaMail[i] ) );
	}
	//###### BUSCA DADOS do representante
	var c1 = DatasetFactory.createConstraint("cod_repres", cod_repres, cod_repres, ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("metadata#active", cod_repres, cod_repres, ConstraintType.MUST);
    var constraints = new Array(c1,c2);
    var dataset = DatasetFactory.getDataset('representante_compl', null, constraints, null);
    if( dataset != null ) {
    	for (var x = 0; x < dataset.values.length; x++) {
		    // ##### Carrega lista de e-mail
    		log.info('DATA SET...'+dataset );
    		var matricula = dataset.getValue(x, "matricula" );
    		var mail = loadCampoDataSet( "colleague", "colleaguePK.colleagueId", matricula, "mail" );
			to.push( new javax.mail.internet.InternetAddress( mail ) );
		}
	}
	//to.push( new javax.mail.internet.InternetAddress("ariberto@montibeller.org") );
	
	//### CRIA MENSSAGEM
	var menssagem = javax.mail.internet.MimeMessage( mailSession );	
	var from = new javax.mail.internet.InternetAddress("fluig@ceramfix.com.br");
    menssagem.setFrom(from);
    menssagem.setRecipients(javax.mail.Message.RecipientType.TO, to);
    menssagem.setSubject("Orcamento CERAMFIX: "+ numProcesso  );
    //### Cria corpo do e-mail
    var textPart = new javax.mail.internet.MimeBodyPart();
    textPart.setText(HTML_CLI, "utf-8");
    var htmlPart = new javax.mail.internet.MimeBodyPart();
    htmlPart.setContent(HTML_CLI, "text/html; charset=utf-8");
    var multipart = new javax.mail.internet.MimeMultipart();
    multipart.addBodyPart(htmlPart);
    menssagem.setContent(multipart);
    // Cria anexo do e-mail
    var messageBodyPart = new javax.mail.internet.MimeBodyPart();
    messageBodyPart.setDataHandler( new javax.activation.DataHandler( new javax.mail.util.ByteArrayDataSource( HTML_CLI, "text/html; charset=utf-8" ) ) );
    messageBodyPart.setFileName( nomeFile+"_rep."+extFile  );
    multipart.addBodyPart(messageBodyPart);
    menssagem.setContent(multipart);
    javax.mail.Transport.send(menssagem);
    //mailSession.close();

	
	//#### FUNÃ¿Ã¿O PARA RECUPERAR A DESCRIÃ¿Ã¿O DE UM CODIGO EM UM DATA SET ##### 
	function loadCampoDataSet( denDataSet, campo, valor, campoRetorno ){
		log.info( 'Execute DataSet......... '+denDataSet+' - '+campo+' - '+valor+' - '+campoRetorno );
	    var c1 = DatasetFactory.createConstraint( campo, valor, valor, ConstraintType.MUST);
	    var constraints = new Array(c1);
	    //Busca o dataset
	    var dataset = DatasetFactory.getDataset( denDataSet, null, constraints, null);
		if ( dataset != null ){
			for (var x = 0; x < dataset.values.length; x++) {
				log.info( 'Result DataSet......... '+campoRetorno+' - '+dataset.getValue(x, campoRetorno ) );
				return dataset.getValue(x, campoRetorno );
			};
		};
		return ' ';
	}
	
	function setComment( user, processo, comentario ){
		 var constraints = new Array();
		 constraints.push( DatasetFactory.createConstraint( 'processo', processo, processo, ConstraintType.MUST) );
		 constraints.push( DatasetFactory.createConstraint( 'user', user, user, ConstraintType.MUST) );
		 constraints.push( DatasetFactory.createConstraint( 'comentario', comentario, comentario, ConstraintType.MUST) );
	    var dataset = DatasetFactory.getDataset( 'setComent', null, constraints, null);
		if ( dataset != null ){
			return dataset.getValue(0, 'retorno' );
		}
	}

	function formatDecimal(val, pres){
		var fVal = parseFloat( val );

	    if( isNaN( fVal ) ){
	        fval = 0;
	    }

		var numDec = String((fVal).toFixed(pres));
	    var n = numDec.split('.')[0];
		var r = '';
		var x = 0;
		var tratado;
			
		for (var i = n.length; i > 0; i--) {
		    r += n.substr(i - 1, 1) + (x == 2 && i != 1 ? '-' : '');
		    x = x == 2 ? 0 : x + 1;
		}
			
		tratado = r.split('').reverse().join('');
		tratado = tratado.replace('-,',',');
	    var busca = '-';
	    var strbusca = eval('/'+busca+'/g'); 
		tratado = tratado.replace(strbusca,'.');
	    if( pres > 0 ){
	        tratado = tratado+","+numDec.split('.')[1];
	    }
	    return tratado;
	};
	
}