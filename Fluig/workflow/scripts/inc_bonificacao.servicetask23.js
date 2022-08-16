function servicetask23(attempt, message) {

	log.info('Entrou servicetask23')
	
	//######### RECUPERA INFORMAÇÕES DO PEDIDO DO LOGIX
	var cod_empresa 	= hAPI.getCardValue( "empresa" );
	var cod_cliente 	= hAPI.getCardValue( "cod_cliente" );
	var nom_repres 		= hAPI.getCardValue( "nom_repres" );
	var cnpj 			= hAPI.getCardValue( "cnpj" );
	var razao_social 	= hAPI.getCardValue( "razao_social" );
	var media 			= hAPI.getCardValue( "media" );
	var descricao 		= hAPI.getCardValue( "descricao" );
	var val_invest 		= hAPI.getCardValue( "val_invest" );
	var qtdVezes 		= hAPI.getCardValue( "qtdVezes" );
	var canal_vendas4;
	
	//recupera canal de vendas n4
	 var constraints = new Array();
	 constraints.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/LogixPRD', null, ConstraintType.MUST) );
	 constraints.push( DatasetFactory.createConstraint('table', 'eis_v_fluig_cv4', null, ConstraintType.MUST) );
	 constraints.push( DatasetFactory.createConstraint('cod_cliente', cod_cliente, cod_cliente, ConstraintType.MUST) );

	 var fields = new Array('cv4');
	 var order = new Array();

	 var dsPrincipal = DatasetFactory.getDataset("selectTable", fields, constraints, order);
	 if (dsPrincipal != null) {
		 canal_vendas4 = dsPrincipal.getValue(0, "cv4");
	 }
	//fim recupera canal de vendas n4

	//recupera gerente da regional
	var cod_repres = hAPI.getCardValue("cod_repres");

	log.info("## Repres ## "+cod_repres );
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint("cod_repres", cod_repres, cod_repres, ConstraintType.MUST) );
    var dataset = DatasetFactory.getDataset("representante", null, constraints, null);
    var codRegional = "";
    if ( dataset != null ){
    	codRegional = dataset.getValue(0, "cv_4"); 
    }
    log.info("## Regional ## "+codRegional );
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint("tablename", "regional", "regional", ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("cod_regional", codRegional, codRegional, ConstraintType.MUST) );
    var dataset = DatasetFactory.getDataset("representante_compl", null, constraints, null);
    var idPai = "";
    var versionPai = "";
    if ( dataset != null ){
    	idPai = dataset.getValue(0, "metadata#id"); 
    	versionPai = dataset.getValue(0, "metadata#version");
    }
    log.info("## PAI ## "+idPai );
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint("documentid", idPai, idPai, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("version", versionPai, versionPai, ConstraintType.MUST) );
    var dataset = DatasetFactory.getDataset("representante_compl", null, constraints, null);
    //var login = "";
    var repReg = "";
    if ( dataset != null ){
    	//login = dataset.getValue(0, "login"); 
    	repReg = dataset.getValue(0, "descricao");
    }    
    log.info("## RepReg ## "+repReg );
	//fim recupera gerente da regional 

	
	var c2 = DatasetFactory.createConstraint("tipo_cadastro", 'M', 'M', ConstraintType.MUST);
	var constraintsM = new Array(c2);
	var datasetM = DatasetFactory.getDataset('representante_compl', null, constraintsM, null);
	log.info('ANTES DE ENTRAR NO RESPONSAVEL MARKETING '+datasetM.getValue(0, "nome_usuario" ));
	if (datasetM != null ){
		var repMkt = datasetM.getValue(0, "nome_usuario" );
		log.info('RESPONSAVEL MARKETING '+repMkt);
	}
	
	log.info('HTML......'); 

	var HTML = "";
	
	HTML = "#Imp_Endereco_Titulo     {font-family:Verdana,Helvetica;font-size:9px;font-weight:bold;color:#000000;text-decoration:none;}";

	HTML = "<html>";
	HTML = HTML + "<head>";
	HTML = HTML + "<meta charset='UTF-8'>";
	HTML = HTML + "<title></title>";
	HTML = HTML + "<style><";
	HTML = HTML + "#Imp_Endereco_Titulo     {font-family:Verdana,Helvetica;font-size:9px;font-weight:bold;color:#000000;text-decoration:none;}";

	HTML = HTML + "#Imp_Endereco            {font-family:Verdana,Helvetica;font-size:9px;font-weight:normal;color:#000000;text-decoration:none;}";
	HTML = HTML + "#Imp_Endereco_Titulo     {font-family:Verdana,Helvetica;font-size:9px;font-weight:bold;color:#000000;text-decoration:none;}";

	HTML = HTML + "#Imp_Cabec               {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:#000000;text-decoration:none;}";
	HTML = HTML + "#Imp_Cabec_Titulo        {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#000000;text-decoration:none;}";

	HTML = HTML + "#Imp_Texto_Introd        {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:#000000;text-decoration:none;}";

	HTML = HTML + "#Imp_Produto             {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:#000000;text-decoration:none;}";
	HTML = HTML + "#Imp_Produto_Titulo      {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#000000;text-decoration:none;}";
	HTML = HTML + "#Titulo_Produto          {Background-Color:#D9ECFF;}";

	HTML = HTML + "#Fundo_Esq_Top           {background: #FFFFFF; border-top: 2px #000000 solid;border-right: 1px #000000 solid;border-bottom: 2px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML + "#Fundo_Cen_Top           {background: #FFFFFF; border-top: 2px #000000 solid;border-right: 1px #000000 solid;border-bottom: 2px #000000 solid;border-left: 1px #000000 solid;}";
	HTML = HTML + "#Fundo_Dir_Top           {background: #FFFFFF; border-top: 2px #000000 solid;border-right: 2px #000000 solid;border-bottom: 2px #000000 solid;border-left: 1px #000000 solid;}";

	HTML = HTML + "#Fundo_Esq_Top_Linhas    {background: #FFFFFF; border-top: 2px #000000 solid;border-right: 1px #000000 solid;border-bottom: 1px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML + "#Fundo_Cen_Top_Linhas    {background: #FFFFFF; border-top: 2px #000000 solid;border-right: 1px #000000 solid;border-bottom: 1px #000000 solid;border-left: 1px #000000 solid;}";
	HTML = HTML + "#Fundo_Dir_Top_Linhas    {background: #FFFFFF; border-top: 2px #000000 solid;border-right: 2px #000000 solid;border-bottom: 1px #000000 solid;border-left: 1px #000000 solid;}";
	HTML = HTML + "#Fundo_Esq_Mid_Linhas    {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 1px #000000 solid;border-bottom: 1px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML + "#Fundo_Cen_Mid_Linhas    {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 1px #000000 solid;border-bottom: 1px #000000 solid;border-left: 1px #000000 solid;}";
	HTML = HTML + "#Fundo_Dir_Mid_Linhas    {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 2px #000000 solid;border-bottom: 1px #000000 solid;border-left: 1px #000000 solid;}";
	HTML = HTML + "#Fundo_Esq_Bot_Linhas    {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 1px #000000 solid;border-bottom: 2px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML + "#Fundo_Cen_Bot_Linhas    {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 1px #000000 solid;border-bottom: 2px #000000 solid;border-left: 1px #000000 solid;}";
	HTML = HTML + "#Fundo_Dir_Bot_Linhas    {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 2px #000000 solid;border-bottom: 2px #000000 solid;border-left: 1px #000000 solid;}";

	HTML = HTML + "#Fundo_Esq_Top_Linhas_Cor {background: #ECECEC; border-top: 2px #000000 solid;border-right: 1px #000000 solid;border-bottom: 1px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML + "#Fundo_Cen_Top_Linhas_Cor {background: #ECECEC; border-top: 2px #000000 solid;border-right: 1px #000000 solid;border-bottom: 1px #000000 solid;border-left: 1px #000000 solid;}";
	HTML = HTML + "#Fundo_Dir_Top_Linhas_Cor {background: #ECECEC; border-top: 2px #000000 solid;border-right: 2px #000000 solid;border-bottom: 1px #000000 solid;border-left: 1px #000000 solid;}";
	HTML = HTML + "#Fundo_Esq_Mid_Linhas_Cor {background: #ECECEC; border-top: 1px #000000 solid;border-right: 1px #000000 solid;border-bottom: 1px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML + "#Fundo_Esq_Bot_Linhas_Cor {background: #ECECEC; border-top: 1px #000000 solid;border-right: 1px #000000 solid;border-bottom: 2px #000000 solid;border-left: 2px #000000 solid;}";

	HTML = HTML + "#Fundo_Linha_Top         {background: #FFFFFF; border-top: 2px #000000 solid;border-right: 2px #000000 solid;border-bottom: 1px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML + "#Fundo_Linha_Mid         {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 2px #000000 solid;border-bottom: 1px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML + "#Fundo_Linha_Bot         {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 2px #000000 solid;border-bottom: 2px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML + "#Fundo_Linha_Top_Cor     {background: #ECECEC; border-top: 2px #000000 solid;border-right: 2px #000000 solid;border-bottom: 1px #000000 solid;border-left: 2px #000000 solid;}";

	HTML = HTML + "#Fundo_Linha             {background: #FFFFFF; border-top: 2px #000000 solid;border-right: 2px #000000 solid;border-bottom: 2px #000000 solid;border-left: 2px #000000 solid;}";

	HTML = HTML + "#Empty_Cell_1            {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 0px #000000 solid;border-bottom: 0px #000000 solid;border-left: 0px #000000 solid;}";
	HTML = HTML + "#Empty_Cell_2            {background: #FFFFFF; border-top: 0px #000000 solid;border-right: 0px #000000 solid;border-bottom: 0px #000000 solid;border-left: 0px #000000 solid;}";

	HTML = HTML + ".tabela_noborder {border:0;}";

	HTML = HTML + "a{color:#000000;font-size:12px;font-family:Verdana,Helvetica;font-weight:normal;font-style:normal;text-decoration:none;}";
	HTML = HTML + "a:hover{color:#000000;font-size:12px;font-family:Verdana,Helvetica;font-weight:normal;font-style:normal;text-decoration:underline;}";

	HTML = HTML + "#PRETO_1_12_N           {font-family:Verdana,Helvetica;font-size:12px;font-weight:normal;color:#000000;text-decoration:none;}";
	HTML = HTML + "#PRETO_1_12_N:hover     {font-family:Verdana,Helvetica;font-size:12px;font-weight:normal;color:#000000;text-decoration:underline;}";
	HTML = HTML + "#PRETO_1_12_B           {font-family:Verdana,Helvetica;font-size:12px;font-weight:bold;color:#000000;text-decoration:none;}";
	HTML = HTML + "#PRETO_1_12_B:hover     {font-family:Verdana,Helvetica;font-size:12px;font-weight:bold;color:#000000;text-decoration:underline;}";

	HTML = HTML + "#PRETO_1_11_N           {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:#000000;text-decoration:none;}";
	HTML = HTML + "#PRETO_1_11_N:hover     {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:#000000;text-decoration:underline;}";
	HTML = HTML + "#PRETO_1_11_I           {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:#000000;font-style:italic;text-decoration:none;}";
	HTML = HTML + "#PRETO_1_11_I:hover     {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:#000000;font-style:italic;text-decoration:underline;}";
	HTML = HTML + "#PRETO_1_11_B           {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#000000;text-decoration:none;}";
	HTML = HTML + "#PRETO_1_11_B:hover     {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#000000;text-decoration:underline;}";
	HTML = HTML + "#PRETO_1_11_BI          {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#000000;font-style:italic;text-decoration:none;}";
	HTML = HTML + "#PRETO_1_11_BI:hover    {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#000000;font-style:italic;text-decoration:underline;}";

	HTML = HTML + "#PRETO_1_10_N           {font-family:Verdana,Helvetica;font-size:10px;font-weight:normal;color:#000000;text-decoration:none;}";
	HTML = HTML + "#PRETO_1_10_N:hover     {font-family:Verdana,Helvetica;font-size:10px;font-weight:normal;color:#000000;text-decoration:underline;}";
	HTML = HTML + "#PRETO_1_10_B           {font-family:Verdana,Helvetica;font-size:10px;font-weight:bold;color:#000000;text-decoration:none;}";
	HTML = HTML + "#PRETO_1_10_B:hover     {font-family:Verdana,Helvetica;font-size:10px;font-weight:bold;color:#000000;text-decoration:underline;}";

	HTML = HTML + "#BRANCO_1_12_N          {font-family:Verdana,Helvetica;font-size:12px;font-weight:normal;color:#FFFFFF;text-decoration:none;}";
	HTML = HTML + "#BRANCO_1_12_N:hover    {font-family:Verdana,Helvetica;font-size:12px;font-weight:normal;color:#FFFFFF;text-decoration:underline;}";
	HTML = HTML + "#BRANCO_1_12_B          {font-family:Verdana,Helvetica;font-size:12px;font-weight:bold;color:#FFFFFF;text-decoration:none;}";
	HTML = HTML + "#BRANCO_1_12_B:hover    {font-family:Verdana,Helvetica;font-size:12px;font-weight:bold;color:#FFFFFF;text-decoration:underline;}";
	HTML = HTML + "#BRANCO_1_10_N          {font-family:Verdana,Helvetica;font-size:10px;font-weight:none;color:#FFFFFF;text-decoration:none;}";
	HTML = HTML + "#BRANCO_1_10_N:hover    {font-family:Verdana,Helvetica;font-size:10px;font-weight:none;color:#FFFFFF;text-decoration:underline;}";
	HTML = HTML + "#BRANCO_1_10_B          {font-family:Verdana,Helvetica;font-size:10px;font-weight:bold;color:#FFFFFF;text-decoration:none;}";
	HTML = HTML + "#BRANCO_1_10_B:hover    {font-family:Verdana,Helvetica;font-size:10px;font-weight:bold;color:#FFFFFF;text-decoration:underline;}";
	HTML = HTML + "#BRANCO_1_11_B          {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#FFFFFF;text-decoration:none;}";
	HTML = HTML + "#BRANCO_1_11_B:hover    {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#FFFFFF;text-decoration:underline;}";

	HTML = HTML + "#BrancoM          		{font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#FFFFFF;text-decoration:none;}";
	HTML = HTML + "#BrancoM:hover    		{font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#FFFFFF;text-decoration:underline;}";

	HTML = HTML + "#AMARELO_1_11_B          {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#ffff00;text-decoration:none;}";
	HTML = HTML + "#AMARELO_1_11_B:hover    {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#FFFF00;text-decoration:underline;}";

	HTML = HTML + "#AZUL_1_11_BI           {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#0066CC;font-style:italic;text-decoration:none;}";
	HTML = HTML + "#AZUL_1_10_N            {font-family:Verdana,Helvetica;font-size:10px;font-weight:normal;color:#0066CC;text-decoration:none;}";

	HTML = HTML + "#CINZA_1_11_BI          {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#776969;font-style:italic;text-decoration:none;}";
	HTML = HTML + "#CINZA_1_11_B           {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#776969;font-style:none;text-decoration:none;}";

	HTML = HTML + "#AZUL_2_11_B            {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#0000A0;font-style:normal;text-decoration:none;}";
	HTML = HTML + "#AZUL_2_11_B:hover      {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#0000A0;font-style:normal;text-decoration:underline;}";
	HTML = HTML + "#AZUL_2_10_B            {font-family:Verdana,Helvetica;font-size:10px;font-weight:bold;color:#0000A0;font-style:normal;text-decoration:none;}";
	HTML = HTML + "#AZUL_2_9_B             {font-family:Verdana,Helvetica;font-size:9px;font-weight:bold;color:#0000A0;font-style:normal;text-decoration:none;}";

	HTML = HTML + "#VERMELHO_1_11_N        {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:red;text-decoration:none;}";
	HTML = HTML + "#VERMELHO_1_11_N:hover  {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:red;text-decoration:underline;}";
	HTML = HTML + "#VERMELHO_1_11_B        {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:red;text-decoration:none;}";
	HTML = HTML + "#VERMELHO_1_11_B:hover  {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:red;text-decoration:underline;}";
	HTML = HTML + "#VERMELHO_1_10_N        {font-family:Verdana,Helvetica;font-size:10px;font-weight:normal;color:red;text-decoration:none;}";
	HTML = HTML + "#VERMELHO_1_10_N:hover  {font-family:Verdana,Helvetica;font-size:10px;font-weight:normal;color:red;text-decoration:underline;}";
	HTML = HTML + "#VERMELHO_1_10_B        {font-family:Verdana,Helvetica;font-size:10px;font-weight:bold;color:red;text-decoration:none;}";
	HTML = HTML + "#VERMELHO_1_10_B:hover  {font-family:Verdana,Helvetica;font-size:10px;font-weight:bold;color:red;text-decoration:underline;}";

	HTML = HTML + "#Menu_Principal          {font-family:Verdana,Helvetica;font-size:11px;font-weight:none;color:#FFFFFF;text-decoration:none;}";
	HTML = HTML + "#Menu_Principal:hover    {font-family:Verdana,Helvetica;font-size:11px;font-weight:none;color:#FFFFFF;text-decoration:underline;}";

	HTML = HTML + "#Atual{Background-Color:#ffffcc;}";
	HTML = HTML + "#Basico{Background-Color:#0066CC;}";
	HTML = HTML + "#Cor{Background-Color:#6699ff;}";
	HTML = HTML + "#ZebradoFraco{Background-Color:#D9ECFF;}";
	HTML = HTML + "#ZebradoForte{Background-Color:#BCDDFF}";
	HTML = HTML + "#Amarelo{Background-Color:#f5c00a}";
	HTML = HTML + "#SubTitulo{Background-Color:#127dcd}";
	HTML = HTML + "#Titulo{Background-Color:#005A9A}";
	HTML = HTML + "#Imprimir{Background-Color:#a6a6a6;}";
	HTML = HTML + "#ImpForte{Background-Color:#e0e0e0;}";
	HTML = HTML + "#ImpFraco{Background-Color:#f2f2f2;}";

	HTML = HTML + "span.botao {";
	HTML = HTML + "	text-align: center;";
	HTML = HTML + "	margin: 0px 10px;";
	HTML = HTML + "	padding: 2px 5px;";
	HTML = HTML + "	background: #1F6ED6;";
	HTML = HTML + "	border-top: 1px #EBF3FF solid;";
	HTML = HTML + "	border-right: 1px #003366 solid;";
	HTML = HTML + "	border-bottom: 1px #003366 solid;";
	HTML = HTML + "	border-left: 1px #EBF3FF solid;";
	HTML = HTML + "}";

	HTML = HTML + "span.botao a {";
	HTML = HTML + "	font-family: Verdana, Arial;";
	HTML = HTML + "	font-size: 11px;";
	HTML = HTML + "	font-weight: bold;";
	HTML = HTML + "	color: #FFFFFF;";
	HTML = HTML + "	text-decoration: none;";
	HTML = HTML + "}";

	HTML = HTML + "span.botao a:hover {";
	HTML = HTML + "	font-family: Verdana, Arial;";
	HTML = HTML + "	font-size: 11px;";
	HTML = HTML + "	font-weight: bold;";
	HTML = HTML + "	color: #99CCFF;";
	HTML = HTML + "	text-decoration: none;";
	HTML = HTML + "}";

	HTML = HTML + "</style>";
	HTML = HTML + "</head>";
	HTML = HTML + "<body>";	

	var processo = getValue('WKNumProces');
	var data     = pegarDataAtual();
	
	var c1 = DatasetFactory.createConstraint("cod_empresa", cod_empresa, cod_empresa, ConstraintType.MUST);
	var constraints = new Array(c1);
	var empresa = DatasetFactory.getDataset("empresa", null, constraints, null);
	
	var c1 = DatasetFactory.createConstraint("cod_cliente", cod_cliente, cod_cliente, ConstraintType.MUST);
	var constraints = new Array(c1);
	var cliente = DatasetFactory.getDataset("clientes_logix", null, constraints, null);

	//ENDEREÇO / CLIENTE / ORÇAMENTO
    HTML = HTML + "<table width='750' border='0' cellpadding='2' cellspacing='0'align='center'>";
    HTML = HTML + "<tr>";
	HTML = HTML + 	"<td width='50%' valign='top' id='Fundo_Esq_Top'>"; //ENDEREÇO
	HTML = HTML + 	    "<table width='100%' border='0' cellpadding='0' cellspacing='0'>";
	HTML = HTML + 		    "<tr>";
	HTML = HTML + 				"<td colspan='2'>"; //LOGOTIPO
	HTML = HTML + 						"<img src='http://www.ceramfix.com.br/imgs/logofluig.png' border='0'>";
	HTML = HTML + 				"</td>";
	HTML = HTML + 			"</tr>";
	HTML = HTML + 		    "<tr>";
	HTML = HTML + 				"<td colspan='2'>"; //IE
	HTML = HTML + 					"<font id='Imp_Endereco_Titulo'>";
	HTML = HTML + 						"IE: ";
	HTML = HTML + 					"</font>";
	HTML = HTML + 					"<font id='Imp_Endereco'>";
	HTML = HTML + 						empresa.getValue(0, "ins_estadual" );
	HTML = HTML + 					"</font>";
	HTML = HTML + 				"</td>";
	HTML = HTML + 			"</tr>";
	HTML = HTML + 		    "<tr>";
	HTML = HTML + 				"<td colspan='2'>"; //CNPJ
	HTML = HTML + 					"<font id='Imp_Endereco_Titulo'>";
	HTML = HTML + 						"CNPJ: ";
	HTML = HTML + 					"</font>";
	HTML = HTML + 					"<font id='Imp_Endereco'>";
	HTML = HTML + 						empresa.getValue(0, "num_cgc");
	HTML = HTML + 					"</font>";
	HTML = HTML + 				"</td>";
	HTML = HTML + 			"</tr>";
	HTML = HTML + 		    "<tr>";
	HTML = HTML + 				"<td colspan='2'>"; //ENDEREÇO
	HTML = HTML + 					"<font id='Imp_Endereco'>";
	HTML = HTML + 						empresa.getValue(0, "end_empresa");
	HTML = HTML + 					"</font>";
	HTML = HTML + 				"</td>";
	HTML = HTML + 			"</tr>";
	HTML = HTML + 		    "<tr>";
	HTML = HTML + 				"<td colspan='2'>"; //BAIRRO - CEP - CIDADE - ESTADO - PAIS(país não Ã¿Â© mais mostrado, pois não consta na tabela Empresa)
	HTML = HTML + 					"<font id='Imp_Endereco'>";		
	HTML = HTML + 						empresa.getValue(0, "den_bairro") + " - " + empresa.getValue(0, "cod_cep") + " - " + empresa.getValue(0, "den_munic") + " - " + empresa.getValue(0, "uni_feder"); //+ "-" + objFuncoes.Nulo(aEndereco[0][6]);
	HTML = HTML + 					"</font>";
	HTML = HTML + 				"</td>";
	HTML = HTML + 			"</tr>";
	HTML = HTML + 		    "<tr>";
	HTML = HTML + 				"<td>"; //TELEFONE 1 - TELEFONE 2
	HTML = HTML + 					"<font id='Imp_Endereco_Titulo'>";
	HTML = HTML + 						"TEL: ";
	HTML = HTML + 					"</font>";
	HTML = HTML + 					"<font id='Imp_Endereco'>";
	HTML = HTML + 						empresa.getValue(0, "num_telefone");//"-" +objFuncoes.Nulo(aEndEmpresa[0][8]);
	HTML = HTML + 					"</font>";
	HTML = HTML + 				"</td>";
	HTML = HTML + 				"<td>"; //FAX
	HTML = HTML + 					"<font id='Imp_Endereco_Titulo'>";
	HTML = HTML + 					"</font>";
	HTML = HTML + 					"<font id='Imp_Endereco'>";
	HTML = HTML + 					"</font>";
	HTML = HTML + 				"</td>";
	HTML = HTML + 			"</tr>";
	
	HTML = HTML + 		"</table>";
	HTML = HTML + 	"</td>";
	HTML = HTML + 	"<td width='50%' valign='top' id='Fundo_Cen_Top'>"; //CLIENTE
	HTML = HTML + 	    "<table width='100%' border='0' cellpadding='0' cellspacing='0'>";
	HTML = HTML + 		    "<tr>";
	HTML = HTML + 				"<td align='center' height='25'>"; //TITULO
	HTML = HTML + 					"<font id='Imp_Cabec_Titulo'> CLIENTE </font>";
	HTML = HTML + 				"</td>";
	HTML = HTML + 			"</tr>";
	HTML = HTML + 		    "<tr>";
	HTML = HTML + 				"<td>"; //NOME
	HTML = HTML + 					"<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + 						"Nome: ";
	HTML = HTML + 					"</font>";
	HTML = HTML + 					"<font id='Imp_Cabec'>";
	
	HTML = HTML + 						cliente.getValue(0, "nom_cliente");
	HTML = HTML + 					"</font>";
	HTML = HTML + 				"</td>";
	HTML = HTML + 			"</tr>";
	HTML = HTML + 		    "<tr>";
	HTML = HTML + 				"<td>"; //ENDEREÇO end_cliente
	HTML = HTML + 					"<font id='Imp_Cabec'>" + cliente.getValue(0, "end_cliente") + "</font>";
	HTML = HTML + 				"</td>";
	HTML = HTML + 			"</tr>";
	HTML = HTML + 		    "<tr>";
	HTML = HTML + 				"<td>"; //BAIRRO - CIDADE - ESTADO - PAIS
	HTML = HTML + 					"<font id='Imp_Cabec'>";
	HTML = HTML + 						cliente.getValue(0, "den_bairro")+ " - " +cliente.getValue(0, "den_cidade")+ " - " +cliente.getValue(0, "cod_uni_feder")+ " - " +cliente.getValue(0, "cod_pais");
	HTML = HTML + 					"</font>";
	HTML = HTML + 				"</td>";
	HTML = HTML + 			"</tr>";
	
	HTML = HTML + 		    "<tr>";
	HTML = HTML + 				"<td>"; //FONE
	HTML = HTML + 					"<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + 						'Fone: ';
	HTML = HTML + 					"</font>";
	HTML = HTML + 					"<font id='Imp_Cabec'>";
	HTML = HTML + 						cliente.getValue(0, "num_telefone");
	HTML = HTML + 					"</font>";
	HTML = HTML + 				"</td>";
	HTML = HTML + 			"</tr>";

	HTML = HTML + 		"</table>";
	HTML = HTML + 	"</td>"
	HTML = HTML + "</tr>"
	HTML = HTML + "</table>"
	
	HTML = HTML + "<br>";
	
	HTML = HTML + "<table width='750' border='0' cellpadding='5' cellspacing='0' align='center'>";
	HTML = HTML + "<tr><td>"
	HTML = HTML + 	"<p><font id='Imp_Cabec_Titulo'>A/C: Depto: Marketing</font></p>"
	HTML = HTML + "</td></tr>"
	HTML = HTML + "<tr><td>"	
	HTML = HTML + 	"<p><font id='Imp_Cabec_Titulo'><center>FORMULÁRIO</center></font></p>"
	HTML = HTML + "</td></tr>"
	HTML = HTML + "<tr><td>"
	HTML = HTML + 	"<p><font id='Imp_Cabec'><center>SOLICITAÇÕES DE AÇÕES DE MARKETING - "+processo+"</center></font></p>"
	HTML = HTML + "</td></tr>"
	HTML = HTML + "<tr><td>"
	HTML = HTML + 	"<p><font id='Imp_Cabec_Titulo'>Data do Envio da Solicitação: "+data+"</font></p>"
	HTML = HTML + "</td></tr>"
	HTML = HTML + "<tr><td>"
	HTML = HTML + 	"<p><font id='Imp_Cabec_Titulo'>Regional: "+canal_vendas4+"</font></p>"
	HTML = HTML + "</td></tr>"
	HTML = HTML + "</table>";
		
	HTML = HTML + "<table width='750' border='1' cellpadding='0' cellspacing='0' align='center'>";
	HTML = HTML + "	<tr align='left' height='25' id='Fundo_Linha_Top_Cor'>";
	HTML = HTML + "		<td colspan='2'>";
	HTML = HTML + "			<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "				Número Fluxo de Bonificação: "+processo;
	HTML = HTML + "			</font>";
	HTML = HTML + "		</td>";
	HTML = HTML + "	</tr>";
	HTML = HTML + "	<tr>";
	HTML = HTML + "		<td height='25' id='Fundo_Linha_Bot' td colspan='2'>";
	HTML = HTML + "			<font id='Imp_Cabec'>";
	HTML = HTML + "			</font>";
	HTML = HTML + "		</td>";
	HTML = HTML + "	</tr>";
	HTML = HTML + "	<tr align='left' height='25' id='Fundo_Linha_Top_Cor' >";
	HTML = HTML + "		<td colspan='2'>";
	HTML = HTML + "			<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "				Solicitante: "+nom_repres;
	HTML = HTML + "			</font>";
	HTML = HTML + "		</td>";
	HTML = HTML + "	</tr>";
	HTML = HTML + "	<tr>";
	HTML = HTML + "		<td height='25' id='Fundo_Linha_Bot' td colspan='2'>";
	HTML = HTML + "			<font id='Imp_Cabec'>";
	HTML = HTML + "			</font>";
	HTML = HTML + "		</td>";
	HTML = HTML + "	</tr>";
	HTML = HTML + "	<tr align='left' height='25' id='Fundo_Linha_Top_Cor' >";
	HTML = HTML + "		<td colspan='2'>";
	HTML = HTML + "			<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "				Razão Social/Código do Cliente: "+cnpj+" - "+razao_social
	HTML = HTML + "			</font>";
	HTML = HTML + "		</td>";
	HTML = HTML + "	</tr>";
	HTML = HTML + "	<tr>";
	HTML = HTML + "		<td height='25' id='Fundo_Linha_Bot' td colspan='2'>";
	HTML = HTML + "			<font id='Imp_Cabec'>";
	HTML = HTML + "			</font>";
	HTML = HTML + "		</td>";
	HTML = HTML + "	</tr>";
	HTML = HTML + "	<tr align='left' height='25' id='Fundo_Linha_Top_Cor' >";
	HTML = HTML + "		<td colspan='2'>";
	HTML = HTML + "			<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "				Média de compra do Cliente nos últimos 3 meses: "+media;
	HTML = HTML + "			</font>";
	HTML = HTML + "		</td>";
	HTML = HTML + "	</tr>";
	HTML = HTML + "	<tr>";
	HTML = HTML + "		<td height='25' id='Fundo_Linha_Bot' td colspan='2'>";
	HTML = HTML + "			<font id='Imp_Cabec'>";
	HTML = HTML + "			</font>";
	HTML = HTML + "		</td>";
	HTML = HTML + "	</tr>";
	HTML = HTML + "	<tr align='left' height='25' id='Fundo_Linha_Top_Cor' >";
	HTML = HTML + "		<td colspan='2'>";
	HTML = HTML + "			<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "				Descrição da Ação: "+descricao;
	HTML = HTML + "			</font>";
	HTML = HTML + "		</td>";
	HTML = HTML + "	</tr>";
	HTML = HTML + "	<tr>";
	HTML = HTML + "		<td height='25' id='Fundo_Linha_Bot' td colspan='2'>";
	HTML = HTML + "			<font id='Imp_Cabec'>";
	HTML = HTML + "			</font>";
	HTML = HTML + "		</td>";
	HTML = HTML + "	</tr>";
	HTML = HTML + "	<tr align='left' height='25' id='Fundo_Linha_Top_Cor' >";
	HTML = HTML + "		<td colspan='2'>";
	HTML = HTML + "			<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "				Valor do Investimento:"+val_invest;
	HTML = HTML + "			</font>";
	HTML = HTML + "		</td>";
	HTML = HTML + "	</tr>";
	HTML = HTML + "	<tr>";
	HTML = HTML + "		<td height='25' id='Fundo_Linha_Bot' td colspan='2'>";
	HTML = HTML + "			<font id='Imp_Cabec'>";
	HTML = HTML + "			</font>";
	HTML = HTML + "		</td>";
	HTML = HTML + "	</tr>";
	HTML = HTML + "	<tr align='left' height='25' id='Fundo_Linha_Top_Cor' width='950'>";
	HTML = HTML + "		<td width='50%''>";
	HTML = HTML + "			<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "				Forma de Pagamento: Dinheiro";
	HTML = HTML + "			</font>";
	HTML = HTML + "		</td>";
	HTML = HTML + "		<td>";
	HTML = HTML + "			<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "				Quantas vezes? "+qtdVezes;
	HTML = HTML + "			</font>";
	HTML = HTML + "		</td>";
	HTML = HTML + "	</tr>";
	HTML = HTML + "	<tr>";
	HTML = HTML + "		<td valign='top' height='120' id='Fundo_Linha_Bot' td colspan='2'>";
	HTML = HTML + "			<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "				Aprovação Gerência Regional: "+repReg;
	HTML = HTML + "			</font>";
	HTML = HTML + "		</td>";
	HTML = HTML + "	</tr>";
	HTML = HTML + "	<tr>";
	HTML = HTML + "		<td valign='top' height='120' id='Fundo_Linha_Bot' td colspan='2'>";
	HTML = HTML + "			<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "				Responsável Marketing: "+repMkt;
	HTML = HTML + "			</font>";
	HTML = HTML + "		</td>";
	HTML = HTML + "	</tr>";
	HTML = HTML + "</table>";

	log.info( HTML );


 	 //######## RECUPERA AREA DE UPLOAD DO USUÁRIO 
	 var user = getValue("WKUser");
	 var constraints = new Array();		
	 constraints.push( DatasetFactory.createConstraint("colleaguePK.companyId", 1, 1, ConstraintType.MUST) );
	 constraints.push( DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST) );
	 constraints.push( DatasetFactory.createConstraint("chave", 'UserPhysicalVolumeUpload', 'UserPhysicalVolumeUpload', ConstraintType.MUST) );
	 var usuario = DatasetFactory.getDataset("colleagueParam", null, constraints, null);
	 var path = ''; 
	 if ( usuario.values.length > 0 ) {
		 path = usuario.getValue(0, "val_param");
		 log.info( 'ENTREI..... ' );
	 }
	 log.info( 'CAMINHO..... '+path );
	 
	// ###### PUBLICA ARQUIVOS HTML NO PASTA DE ARQUIVOS
	var nomeFile = cod_empresa+"_"+processo;
	var extFile = 'html';
	
	try {
		
		var file = new java.io.File( path+nomeFile+"."+extFile );
		file.createNewFile();
        var fiWi = new java.io.FileWriter( file.getAbsoluteFile());
        var buWi = new java.io.BufferedWriter(fiWi);
        buWi.write( HTML );
        buWi.close();        

	}catch( e ){
		log.info( 'ERROOOOO.....'+e );
    }
	
	//## CRIA DOCUMENTO CLIENTE
	var dto = docAPI.newDocumentDto();
    dto.setDocumentDescription( nomeFile );
    dto.setDocumentType( "2" );

	var constraints = new Array();		
	constraints.push( DatasetFactory.createConstraint("cod_empresa", cod_empresa, cod_empresa, ConstraintType.MUST) );
	var paramEmpresa = DatasetFactory.getDataset("empresa_compl", null, constraints, null);
	var folder = 1420;
	if ( paramEmpresa != null && paramEmpresa.values.length > 0 ) {
		log.info( "ACHEI FOLDER..........: " +paramEmpresa.getValue(0, "num_pasta_cap") );
		folder = parseInt( paramEmpresa.getValue(0, "num_pasta_cap") );
	}

    dto.setParentDocumentId(folder);    
    
    dto.setDocumentTypeId( "" );
    //## CRIA ARQUIVO
    var  attachArray =  new  java.util.ArrayList();
    var  mainAttach  = docAPI.newAttachment();
    mainAttach.setFileName( nomeFile+"."+extFile );
    mainAttach.setPrincipal( true );
    mainAttach.setAttach( false );
    attachArray.add(mainAttach);
   // Adicionando aprovadores
    dto.setActiveVersion(true);
    dto.setColleagueId(getValue("WKUser")); // Informar o usuário logado.
    dto.setPublisherId(getValue("WKUser")); // Informar o publicador.
    try  {
        var  doc = docAPI.createDocument(dto, attachArray, null, null, null);
        log.info( "DOCUMENTO CRIADO COM O ID: "  + doc.getDocumentId());
    }  catch  (e) {
        log.error( "Problemas na criação do documento:\n"  + e);
    }
    
    //#####  ENVIO DE E-MAIL
    // Recuperado informações para envia de e-mail via jboss
	var contextWD = new javax.naming.InitialContext();
	var mailSession = contextWD.lookup("java:jboss/mail/Default");
	
	//Gera e-mail cliente
	var to = new Array();
	//###### BUSCA DADOS CLIENTE - LOGIX REST
	var c1 = DatasetFactory.createConstraint("cod_cliente", cod_cliente, cod_cliente, ConstraintType.MUST);
    var constraints = new Array(c1);
    
    //Gera e-mail ao Gerente de Marketing
	
	//###### BUSCA DADOS CLIENTE - LOGIX REST
	var con1 = DatasetFactory.createConstraint("tipo_cadastro", 'M', 'M', ConstraintType.MUST);
    var constraints = new Array(con1);
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
    
	//to.push( new javax.mail.internet.InternetAddress("jefferson.schueroff@totvs.com.br") );
	//to.push( new javax.mail.internet.InternetAddress("daivid.thomaz@ceramfix.com.br") );
	
	//### CRIA MENSSAGEM
	var menssagem = javax.mail.internet.MimeMessage( mailSession );	
	var from = new javax.mail.internet.InternetAddress("fluig@ceramfix.com.br");
    menssagem.setFrom(from);
    menssagem.setRecipients(javax.mail.Message.RecipientType.TO, to);
    menssagem.setSubject("SOLICITAÇÕES DE AÇÕES DE MARKETING - "+processo);

    //### Cria corpo do e-mail
    var textPart = new javax.mail.internet.MimeBodyPart();
    textPart.setText(HTML, "utf-8");
    var htmlPart = new javax.mail.internet.MimeBodyPart();
    htmlPart.setContent(HTML, "text/html; charset=utf-8");
    var multipart = new javax.mail.internet.MimeMultipart();
    multipart.addBodyPart(htmlPart);
    menssagem.setContent(multipart);

    // Cria anexo do e-mail
    var messageBodyPart = new javax.mail.internet.MimeBodyPart();
    messageBodyPart.setDataHandler( new javax.activation.DataHandler( new javax.mail.util.ByteArrayDataSource( HTML, "text/html; charset=utf-8" ) ) );
    messageBodyPart.setFileName( nomeFile+"."+extFile  );
    multipart.addBodyPart(messageBodyPart);
    menssagem.setContent(multipart);
    javax.mail.Transport.send(menssagem);
    //mailSession.close();

	
	//#### FUNÇÃO PARA RECUPERAR A DESCRIÇÃO DE UM CODIGO EM UM DATA SET ##### 
	
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
			}
		}
		return ' ';
	}

	function pegarDataAtual(){   

	 	data = new Date();
	 	ano  = data.getFullYear();  //Get the four digit year (yyyy)	
	 	mes  = data.getMonth() + 1;	//Get the month (0-11)
	 	dia  = data.getDate();		//Get the day as a number (1-31)

	 	if (mes<10) {
	 		mes = "0"+mes;
	 	}

		if (dia<10) {
	 		dia = "0"+dia;
	 	}

	 	
	 	dataFinal = dia+"/"+mes+"/"+ano;
	 	
	   return dataFinal;
	}
	
} 