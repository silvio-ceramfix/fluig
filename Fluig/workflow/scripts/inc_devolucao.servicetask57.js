function servicetask57(attempt, message) {
	var HTML = "";

	log.info("URL ENTROU1... ");
	var attachments = hAPI.listAttachments();
	log.info("URL ENTROU2... "); // armazena os ids dos anexos

	var constraints = new Array();
	var cod_empresa = hAPI.getCardValue("empresa");
	var cod_cliente = hAPI.getCardValue("cod_cliente");
	var cnpj_cliente = hAPI.getCardValue("cnpj");
	var data_inclusao = hAPI.getCardValue("data_inclusao");
	var cidade_cliete = hAPI.getCardValue("den_cidade");
	var uf_cliente = hAPI.getCardValue("uf");
	var nota_fiscal = hAPI.getCardValue("num_nota_fiscal");
	var cod_repres = hAPI.getCardValue("cod_repres");
	var den_repres = hAPI.getCardValue("nom_repres");
	var cod_motivo_devolucao = hAPI.getCardValue("motivo_devolucao");
	var observacoes = hAPI.getCardValue("descricao");

	var tipo_de_devolucao;
	var tipo_devolucao;

	if (hAPI.getCardValue("tipo_devolucao") == 1) {
		tipo_de_devolucao = "TOTAL";
	} else {
		tipo_de_devolucao = "PARCIAL";
	}

	if (hAPI.getCardValue("radio_tipo_nota") == 1) {
		tipo_devolucao = "EMITIDA PELO CLIENTE";
	} else {
		tipo_devolucao = "DEVOLUÇÃO COM NOTA CERAMFIX";
	}

	// recupera desc do motivo de devolucao
	var c1 = (DatasetFactory.createConstraint("cod_motivo_devolucao",
			cod_motivo_devolucao, cod_motivo_devolucao, ConstraintType.MUST));
	var constraints = new Array(c1);

	var motivosdevolucao = DatasetFactory.getDataset("motivos_devolucao", null,
			constraints, null);
	var den_motivo_devolucao = motivosdevolucao.getValue(0,
			"desc_motivo_devolucao");
	log.info("DEN MOTIVO DEVOLUCAO " + den_motivo_devolucao);
	// fim da recuperacao do desc do motivo de devolucao

	// cria HTML
	HTML = "#Imp_Endereco_Titulo     {font-family:Verdana,Helvetica;font-size:9px;font-weight:bold;color:#000000;text-decoration:none;}";

	HTML = "<html>";
	HTML = HTML + "<head>";
	HTML = HTML + "<meta charset='UTF-8'>";
	HTML = HTML + "<title></title>";
	HTML = HTML + "<style><";
	HTML = HTML
			+ "#Imp_Endereco_Titulo     {font-family:Verdana,Helvetica;font-size:9px;font-weight:bold;color:#000000;text-decoration:none;}";

	HTML = HTML
			+ "#Imp_Endereco            {font-family:Verdana,Helvetica;font-size:9px;font-weight:normal;color:#000000;text-decoration:none;}";
	HTML = HTML
			+ "#Imp_Endereco_Titulo     {font-family:Verdana,Helvetica;font-size:9px;font-weight:bold;color:#000000;text-decoration:none;}";

	HTML = HTML
			+ "#Imp_Cabec               {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:#000000;text-decoration:none;}";
	HTML = HTML
			+ "#Imp_Cabec_Titulo        {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#000000;text-decoration:none;}";

	HTML = HTML
			+ "#Imp_Texto_Introd        {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:#000000;text-decoration:none;}";

	HTML = HTML
			+ "#Imp_Produto             {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:#000000;text-decoration:none;}";
	HTML = HTML
			+ "#Imp_Produto_Titulo      {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#000000;text-decoration:none;}";
	HTML = HTML + "#Titulo_Produto          {Background-Color:#D9ECFF;}";

	HTML = HTML
			+ "#Fundo_Esq_Top           {background: #FFFFFF; border-top: 2px #000000 solid;border-right: 1px #000000 solid;border-bottom: 2px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Cen_Top           {background: #FFFFFF; border-top: 2px #000000 solid;border-right: 1px #000000 solid;border-bottom: 2px #000000 solid;border-left: 1px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Dir_Top           {background: #FFFFFF; border-top: 2px #000000 solid;border-right: 2px #000000 solid;border-bottom: 2px #000000 solid;border-left: 1px #000000 solid;}";

	HTML = HTML
			+ "#Fundo_Esq_Top_Linhas    {background: #FFFFFF; border-top: 2px #000000 solid;border-right: 1px #000000 solid;border-bottom: 1px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Cen_Top_Linhas    {background: #FFFFFF; border-top: 2px #000000 solid;border-right: 1px #000000 solid;border-bottom: 1px #000000 solid;border-left: 1px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Dir_Top_Linhas    {background: #FFFFFF; border-top: 2px #000000 solid;border-right: 2px #000000 solid;border-bottom: 1px #000000 solid;border-left: 1px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Esq_Mid_Linhas    {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 1px #000000 solid;border-bottom: 1px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Cen_Mid_Linhas    {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 1px #000000 solid;border-bottom: 1px #000000 solid;border-left: 1px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Dir_Mid_Linhas    {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 2px #000000 solid;border-bottom: 1px #000000 solid;border-left: 1px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Esq_Bot_Linhas    {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 1px #000000 solid;border-bottom: 2px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Cen_Bot_Linhas    {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 1px #000000 solid;border-bottom: 2px #000000 solid;border-left: 1px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Dir_Bot_Linhas    {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 2px #000000 solid;border-bottom: 2px #000000 solid;border-left: 1px #000000 solid;}";

	HTML = HTML
			+ "#Fundo_Esq_Top_Linhas_Cor {background: #ECECEC; border-top: 2px #000000 solid;border-right: 1px #000000 solid;border-bottom: 1px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Cen_Top_Linhas_Cor {background: #ECECEC; border-top: 2px #000000 solid;border-right: 1px #000000 solid;border-bottom: 1px #000000 solid;border-left: 1px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Dir_Top_Linhas_Cor {background: #ECECEC; border-top: 2px #000000 solid;border-right: 2px #000000 solid;border-bottom: 1px #000000 solid;border-left: 1px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Esq_Mid_Linhas_Cor {background: #ECECEC; border-top: 1px #000000 solid;border-right: 1px #000000 solid;border-bottom: 1px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Esq_Bot_Linhas_Cor {background: #ECECEC; border-top: 1px #000000 solid;border-right: 1px #000000 solid;border-bottom: 2px #000000 solid;border-left: 2px #000000 solid;}";

	HTML = HTML
			+ "#Fundo_Linha_Top         {background: #FFFFFF; border-top: 2px #000000 solid;border-right: 2px #000000 solid;border-bottom: 1px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Linha_Mid         {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 2px #000000 solid;border-bottom: 1px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Linha_Bot         {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 2px #000000 solid;border-bottom: 2px #000000 solid;border-left: 2px #000000 solid;}";
	HTML = HTML
			+ "#Fundo_Linha_Top_Cor     {background: #ECECEC; border-top: 2px #000000 solid;border-right: 2px #000000 solid;border-bottom: 1px #000000 solid;border-left: 2px #000000 solid;}";

	HTML = HTML
			+ "#Fundo_Linha             {background: #FFFFFF; border-top: 2px #000000 solid;border-right: 2px #000000 solid;border-bottom: 2px #000000 solid;border-left: 2px #000000 solid;}";

	HTML = HTML
			+ "#Empty_Cell_1            {background: #FFFFFF; border-top: 1px #000000 solid;border-right: 0px #000000 solid;border-bottom: 0px #000000 solid;border-left: 0px #000000 solid;}";
	HTML = HTML
			+ "#Empty_Cell_2            {background: #FFFFFF; border-top: 0px #000000 solid;border-right: 0px #000000 solid;border-bottom: 0px #000000 solid;border-left: 0px #000000 solid;}";

	HTML = HTML + ".tabela_noborder {border:0;}";

	HTML = HTML
			+ "a{color:#000000;font-size:12px;font-family:Verdana,Helvetica;font-weight:normal;font-style:normal;text-decoration:none;}";
	HTML = HTML
			+ "a:hover{color:#000000;font-size:12px;font-family:Verdana,Helvetica;font-weight:normal;font-style:normal;text-decoration:underline;}";

	HTML = HTML
			+ "#PRETO_1_12_N           {font-family:Verdana,Helvetica;font-size:12px;font-weight:normal;color:#000000;text-decoration:none;}";
	HTML = HTML
			+ "#PRETO_1_12_N:hover     {font-family:Verdana,Helvetica;font-size:12px;font-weight:normal;color:#000000;text-decoration:underline;}";
	HTML = HTML
			+ "#PRETO_1_12_B           {font-family:Verdana,Helvetica;font-size:12px;font-weight:bold;color:#000000;text-decoration:none;}";
	HTML = HTML
			+ "#PRETO_1_12_B:hover     {font-family:Verdana,Helvetica;font-size:12px;font-weight:bold;color:#000000;text-decoration:underline;}";

	HTML = HTML
			+ "#PRETO_1_11_N           {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:#000000;text-decoration:none;}";
	HTML = HTML
			+ "#PRETO_1_11_N:hover     {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:#000000;text-decoration:underline;}";
	HTML = HTML
			+ "#PRETO_1_11_I           {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:#000000;font-style:italic;text-decoration:none;}";
	HTML = HTML
			+ "#PRETO_1_11_I:hover     {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:#000000;font-style:italic;text-decoration:underline;}";
	HTML = HTML
			+ "#PRETO_1_11_B           {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#000000;text-decoration:none;}";
	HTML = HTML
			+ "#PRETO_1_11_B:hover     {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#000000;text-decoration:underline;}";
	HTML = HTML
			+ "#PRETO_1_11_BI          {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#000000;font-style:italic;text-decoration:none;}";
	HTML = HTML
			+ "#PRETO_1_11_BI:hover    {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#000000;font-style:italic;text-decoration:underline;}";

	HTML = HTML
			+ "#PRETO_1_10_N           {font-family:Verdana,Helvetica;font-size:10px;font-weight:normal;color:#000000;text-decoration:none;}";
	HTML = HTML
			+ "#PRETO_1_10_N:hover     {font-family:Verdana,Helvetica;font-size:10px;font-weight:normal;color:#000000;text-decoration:underline;}";
	HTML = HTML
			+ "#PRETO_1_10_B           {font-family:Verdana,Helvetica;font-size:10px;font-weight:bold;color:#000000;text-decoration:none;}";
	HTML = HTML
			+ "#PRETO_1_10_B:hover     {font-family:Verdana,Helvetica;font-size:10px;font-weight:bold;color:#000000;text-decoration:underline;}";

	HTML = HTML
			+ "#BRANCO_1_12_N          {font-family:Verdana,Helvetica;font-size:12px;font-weight:normal;color:#FFFFFF;text-decoration:none;}";
	HTML = HTML
			+ "#BRANCO_1_12_N:hover    {font-family:Verdana,Helvetica;font-size:12px;font-weight:normal;color:#FFFFFF;text-decoration:underline;}";
	HTML = HTML
			+ "#BRANCO_1_12_B          {font-family:Verdana,Helvetica;font-size:12px;font-weight:bold;color:#FFFFFF;text-decoration:none;}";
	HTML = HTML
			+ "#BRANCO_1_12_B:hover    {font-family:Verdana,Helvetica;font-size:12px;font-weight:bold;color:#FFFFFF;text-decoration:underline;}";
	HTML = HTML
			+ "#BRANCO_1_10_N          {font-family:Verdana,Helvetica;font-size:10px;font-weight:none;color:#FFFFFF;text-decoration:none;}";
	HTML = HTML
			+ "#BRANCO_1_10_N:hover    {font-family:Verdana,Helvetica;font-size:10px;font-weight:none;color:#FFFFFF;text-decoration:underline;}";
	HTML = HTML
			+ "#BRANCO_1_10_B          {font-family:Verdana,Helvetica;font-size:10px;font-weight:bold;color:#FFFFFF;text-decoration:none;}";
	HTML = HTML
			+ "#BRANCO_1_10_B:hover    {font-family:Verdana,Helvetica;font-size:10px;font-weight:bold;color:#FFFFFF;text-decoration:underline;}";
	HTML = HTML
			+ "#BRANCO_1_11_B          {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#FFFFFF;text-decoration:none;}";
	HTML = HTML
			+ "#BRANCO_1_11_B:hover    {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#FFFFFF;text-decoration:underline;}";

	HTML = HTML
			+ "#BrancoM          		{font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#FFFFFF;text-decoration:none;}";
	HTML = HTML
			+ "#BrancoM:hover    		{font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#FFFFFF;text-decoration:underline;}";

	HTML = HTML
			+ "#AMARELO_1_11_B          {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#ffff00;text-decoration:none;}";
	HTML = HTML
			+ "#AMARELO_1_11_B:hover    {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#FFFF00;text-decoration:underline;}";

	HTML = HTML
			+ "#AZUL_1_11_BI           {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#0066CC;font-style:italic;text-decoration:none;}";
	HTML = HTML
			+ "#AZUL_1_10_N            {font-family:Verdana,Helvetica;font-size:10px;font-weight:normal;color:#0066CC;text-decoration:none;}";

	HTML = HTML
			+ "#CINZA_1_11_BI          {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#776969;font-style:italic;text-decoration:none;}";
	HTML = HTML
			+ "#CINZA_1_11_B           {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#776969;font-style:none;text-decoration:none;}";

	HTML = HTML
			+ "#AZUL_2_11_B            {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#0000A0;font-style:normal;text-decoration:none;}";
	HTML = HTML
			+ "#AZUL_2_11_B:hover      {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:#0000A0;font-style:normal;text-decoration:underline;}";
	HTML = HTML
			+ "#AZUL_2_10_B            {font-family:Verdana,Helvetica;font-size:10px;font-weight:bold;color:#0000A0;font-style:normal;text-decoration:none;}";
	HTML = HTML
			+ "#AZUL_2_9_B             {font-family:Verdana,Helvetica;font-size:9px;font-weight:bold;color:#0000A0;font-style:normal;text-decoration:none;}";

	HTML = HTML
			+ "#VERMELHO_1_11_N        {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:red;text-decoration:none;}";
	HTML = HTML
			+ "#VERMELHO_1_11_N:hover  {font-family:Verdana,Helvetica;font-size:11px;font-weight:normal;color:red;text-decoration:underline;}";
	HTML = HTML
			+ "#VERMELHO_1_11_B        {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:red;text-decoration:none;}";
	HTML = HTML
			+ "#VERMELHO_1_11_B:hover  {font-family:Verdana,Helvetica;font-size:11px;font-weight:bold;color:red;text-decoration:underline;}";
	HTML = HTML
			+ "#VERMELHO_1_10_N        {font-family:Verdana,Helvetica;font-size:10px;font-weight:normal;color:red;text-decoration:none;}";
	HTML = HTML
			+ "#VERMELHO_1_10_N:hover  {font-family:Verdana,Helvetica;font-size:10px;font-weight:normal;color:red;text-decoration:underline;}";
	HTML = HTML
			+ "#VERMELHO_1_10_B        {font-family:Verdana,Helvetica;font-size:10px;font-weight:bold;color:red;text-decoration:none;}";
	HTML = HTML
			+ "#VERMELHO_1_10_B:hover  {font-family:Verdana,Helvetica;font-size:10px;font-weight:bold;color:red;text-decoration:underline;}";

	HTML = HTML
			+ "#Menu_Principal          {font-family:Verdana,Helvetica;font-size:11px;font-weight:none;color:#FFFFFF;text-decoration:none;}";
	HTML = HTML
			+ "#Menu_Principal:hover    {font-family:Verdana,Helvetica;font-size:11px;font-weight:none;color:#FFFFFF;text-decoration:underline;}";

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

	var den_empresa_reduz = "";
	var cod_cliente_empresa = 0;

	// pedido.getValue(x, "num_pedido" )

	log.info('A......');

	var c1 = DatasetFactory.createConstraint("cod_empresa", cod_empresa,
			cod_empresa, ConstraintType.MUST);
	var constraints = new Array(c1);
	var empresa = DatasetFactory.getDataset("empresa", null, constraints, null);

	den_empresa_reduz = empresa.getValue(0, "den_reduz");
	cod_cliente_empresa = empresa.getValue(0, "cod_cliente");

	log.info('B......');

	var c1 = DatasetFactory.createConstraint("cod_cliente", cod_cliente,
			cod_cliente, ConstraintType.MUST);
	var constraints = new Array(c1);
	var cliente = DatasetFactory.getDataset("clientes_logix", null,
			constraints, null);

	log.info('C......');

	var c1 = DatasetFactory.createConstraint("cod_repres", cod_repres,
			cod_repres, ConstraintType.MUST);
	var constraints = new Array(c1);
	var representante = DatasetFactory.getDataset("representante", null,
			constraints, null);

	log.info('D......');

	// cabeçalho do texto FAD
	HTML = HTML
			+ "<table width='950' border='0' cellpadding='2' cellspacing='0'>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td align='center' height='25'>";
	HTML = HTML + "<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "FAD - FICHA DE AUTORIZAÇÃO DE DEVOLUÇÃO";
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td height='20' id='Fundo_Esq_Bot_Linhas'>";

	// ENDEREÃ¿Â¿O / CLIENTE / ORÃ¿Â¿AMENTO
	HTML = HTML
			+ "<table width='950' border='0' cellpadding='2' cellspacing='0'>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td width='30%' valign='top' id='Fundo_Esq_Top'>"; // ENDEREÃ¿Â¿O
	HTML = HTML
			+ "<table width='100%' border='0' cellpadding='0' cellspacing='0'>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td colspan='2'>"; // LOGOTIPO
	HTML = HTML
			+ "<img src='http://www.ceramfix.com.br/imgs/logofluig.png' border='0'>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td colspan='2'>"; // IE
	HTML = HTML + "<font id='Imp_Endereco_Titulo'>";
	HTML = HTML + "IE: ";
	HTML = HTML + "</font>";
	HTML = HTML + "<font id='Imp_Endereco'>";
	HTML = HTML + empresa.getValue(0, "ins_estadual");
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td colspan='2'>"; // CNPJ
	HTML = HTML + "<font id='Imp_Endereco_Titulo'>";
	HTML = HTML + "CNPJ: ";
	HTML = HTML + "</font>";
	HTML = HTML + "<font id='Imp_Endereco'>";
	HTML = HTML + empresa.getValue(0, "num_cgc");
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td colspan='2'>"; // ENDEREÃ¿Â¿O
	HTML = HTML + "<font id='Imp_Endereco'>";
	HTML = HTML + empresa.getValue(0, "end_empresa");
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td colspan='2'>"; // BAIRRO - CEP - CIDADE - ESTADO -
	// PAIS(paÃ¿Â­s nÃ¿Â£o Ã¿Â© mais
	// mostrado, pois nÃ¿Â£o consta na
	// tabela Empresa)
	HTML = HTML + "<font id='Imp_Endereco'>";
	HTML = HTML + empresa.getValue(0, "den_bairro") + " - "
			+ empresa.getValue(0, "cod_cep") + " - "
			+ empresa.getValue(0, "den_munic") + " - "
			+ empresa.getValue(0, "uni_feder"); // + "-" +
	// objFuncoes.Nulo(aEndereco[0][6]);
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td>"; // TELEFONE 1 - TELEFONE 2
	HTML = HTML + "<font id='Imp_Endereco_Titulo'>";
	HTML = HTML + "TEL: ";
	HTML = HTML + "</font>";
	HTML = HTML + "<font id='Imp_Endereco'>";
	HTML = HTML + empresa.getValue(0, "num_telefone");// "-"
	// +objFuncoes.Nulo(aEndEmpresa[0][8]);
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "<td>"; // FAX
	HTML = HTML + "<font id='Imp_Endereco_Titulo'>";
	HTML = HTML + "</font>";
	HTML = HTML + "<font id='Imp_Endereco'>";
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";

	HTML = HTML + "</table>";
	HTML = HTML + "</td>";
	HTML = HTML + "<td width='45%' valign='top' id='Fundo_Cen_Top'>"; // CLIENTE
	HTML = HTML
			+ "<table width='100%' border='0' cellpadding='0' cellspacing='0'>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td align='center' height='25'>"; // TITULO
	HTML = HTML + "<font id='Imp_Cabec_Titulo'> CLIENTE </font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td>"; // NOME
	HTML = HTML + "<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "Nome: ";
	HTML = HTML + "</font>";
	HTML = HTML + "<font id='Imp_Cabec'>";

	HTML = HTML + cliente.getValue(0, "nom_cliente");
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td>"; // ENDEREÃ¿Â¿Oend_cliente
	HTML = HTML + "<font id='Imp_Cabec'>" + cliente.getValue(0, "end_cliente")
			+ "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td>"; // BAIRRO - CIDADE - ESTADO - PAIS
	HTML = HTML + "<font id='Imp_Cabec'>";
	HTML = HTML + cliente.getValue(0, "den_bairro") + " - "
			+ cliente.getValue(0, "den_cidade") + " - "
			+ cliente.getValue(0, "cod_uni_feder") + " - "
			+ cliente.getValue(0, "cod_pais");
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";

	HTML = HTML + "<tr>";
	HTML = HTML + "<td>"; // FONE
	HTML = HTML + "<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + 'CNPJ: ';
	HTML = HTML + "</font>";
	HTML = HTML + "<font id='Imp_Cabec'>";
	HTML = HTML + cliente.getValue(0, "cnpj");
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";

	HTML = HTML + "</table>";
	HTML = HTML + "</td>";
	HTML = HTML + "<td width='25%' valign='top' id='Fundo_Dir_Top'>"; // ORÃ¿Â¿AMENTO
	HTML = HTML
			+ "<table width='100%' border='0' cellpadding='0' cellspacing='0'>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td colspan='2' align='center' height='25'>"; // TITULO
	HTML = HTML + "<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "Nota Fiscal: ";
	HTML = HTML + "</font>";
	HTML = HTML + "<font id='Imp_Cabec'>";
	HTML = HTML + nota_fiscal;
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td>"; // DATA
	HTML = HTML + "<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "Data: ";
	HTML = HTML + "</font>";
	HTML = HTML + "<font id='Imp_Cabec'>";
	HTML = HTML + data_inclusao;
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";

	HTML = HTML + "<tr>";
	HTML = HTML + "<td>"; // Processo
	HTML = HTML + "<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "Processo: ";
	HTML = HTML + "</font>";
	HTML = HTML + "<font id='Imp_Cabec'>";
	HTML = HTML + getValue('WKNumProces');
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "</table>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	
	
	HTML = HTML + "<tr>";
	HTML = HTML + "<td>"; // Processo
	HTML = HTML + "<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "Mercadoria Retorna para a Empresa: ";
	HTML = HTML + "</font>";
	HTML = HTML + "<font id='Imp_Cabec'>";
	HTML = HTML + hAPI.getCardValue("mercadoria_retorna");
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	
	
	HTML = HTML + "</table>";
	// FIM - ENDEREÃ¿Â¿O / CLIENTE / ORÃ¿Â¿AMENTO
	HTML = HTML + "<br>";
	// REPRESENTANTE
	HTML = HTML
			+ "<table width='950' border='0' cellpadding='2' cellspacing='0'>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td colspan='2' height='20' id='Fundo_Linha_Top'>"; // REPRESENTANTE
	HTML = HTML + "<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "Representante: ";
	HTML = HTML + "</font>";
	HTML = HTML + "<font id='Imp_Cabec'>";
	HTML = HTML + representante.getValue(0, "raz_social");
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td height='20' id='Fundo_Esq_Bot_Linhas'>"; // TELEFONE
	HTML = HTML + "<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "Motivo: ";
	HTML = HTML + "</font>";
	HTML = HTML + "<font id='Imp_Cabec'>";
	HTML = HTML + cod_motivo_devolucao + " - " + den_motivo_devolucao;
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td height='20' id='Fundo_Esq_Bot_Linhas'>"; // TELEFONE
	HTML = HTML + "<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "Tipo de Devolução: ";
	HTML = HTML + "</font>";
	HTML = HTML + "<font id='Imp_Cabec'>";
	HTML = HTML + tipo_de_devolucao;
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td height='20' id='Fundo_Esq_Bot_Linhas'>"; // TELEFONE
	HTML = HTML + "<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "Nota Fiscal de Devolução: ";
	HTML = HTML + "</font>";
	HTML = HTML + "<font id='Imp_Cabec'>";
	HTML = HTML + tipo_devolucao;
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td height='20' id='Fundo_Esq_Bot_Linhas'>"; // TELEFONE
	HTML = HTML + "<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "Observações: ";
	HTML = HTML + "</font>";
	HTML = HTML + "<font id='Imp_Cabec'>";
	HTML = HTML + observacoes;
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "<tr>";
	HTML = HTML + "<td colspan='2' height='20' id='Fundo_Linha_Top'>"; // REPRESENTANTE
	HTML = HTML + "<font id='Imp_Cabec_Titulo'>";
	HTML = HTML + "Anexos: ";
	HTML = HTML + "</font>";
	HTML = HTML + "<font id='Imp_Cabec'>";
	log.info("URL..." + attachments.size());
	for (var i = 0; i < attachments.size(); i++) {

		var attachment = attachments.get(i);

		log.info("URL2... " + attachment.getDocumentId());
		var idDocumento = attachment.getDocumentId();

		log.info("IdDocumento" + idDocumento);
		if (idDocumento != null && idDocumento != 0) {
			var url = fluigAPI.getDocumentService().getDownloadURL(idDocumento);

			log.info("URL3... " + url);
			HTML = HTML + "<a href=" + url + ">ANEXO" + (i + 1) +" - "+ "</a>";
		}
	}
	log.info("URL SAIU.. ");
	HTML = HTML + "</font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";
	HTML = HTML + "</table>"; // FIM - REPRESENTANTE
	HTML = HTML + "<br>";

	// ITEM
	HTML = HTML
			+ "<table width='950' border='0' cellpadding='2' cellspacing='0' class='tabela_noborder'>";
	HTML = HTML + "<tr>";
	HTML = HTML
			+ "<td width='5%' id='Fundo_Esq_Top_Linhas_Cor' align='center'>"; // ITEM
	HTML = HTML + "<font id='Imp_Produto_Titulo'> Seq </font>";
	HTML = HTML + "</td>";
	HTML = HTML
			+ "<td width='15%' id='Fundo_Cen_Top_Linhas_Cor' align='center'>"; // CODIGO
	HTML = HTML + "<font id='Imp_Produto_Titulo'> Cod Item </font>";
	HTML = HTML + "</td>";
	HTML = HTML
			+ "<td width='60%' id='Fundo_Cen_Top_Linhas_Cor' align='center'>"; // DESCRICAO
	HTML = HTML
			+ "<font id='Imp_Produto_Titulo'> Descri&ccedil;&atilde;o </font>";
	HTML = HTML + "</td>";
	HTML = HTML
			+ "<td width='10%' id='Fundo_Cen_Top_Linhas_Cor' align='center'>"; // UNIDADE
	HTML = HTML + "<font id='Imp_Produto_Titulo'> UM </font>";
	HTML = HTML + "</td>";
	HTML = HTML
			+ "<td width='10%' id='Fundo_Cen_Top_Linhas_Cor' align='center'>"; // QTDE
	HTML = HTML + "<font id='Imp_Produto_Titulo'> Qtd. Dev. </font>";
	HTML = HTML + "</td>";
	HTML = HTML + "</tr>";

	// recupera itens do formulário para gerar o html
	var camposItem = hAPI.getCardData(getValue("WKNumProces"));
	var contadorItem = camposItem.keySet().iterator();
	var i = 0;
	var max_i = 0;
	var qtdNovo = 0;
	while (contadorItem.hasNext()) {
		var idItem = contadorItem.next();
		var campo = idItem.split('___')[0];
		var seqItem = idItem.split('___')[1];
		if (seqItem != undefined && campo == "SEQ_ITEM") {
			log.info("SEQUENCIAL DO ITEM ANTES" + seqItem);
			log.info("SEQUENCIAL DO ITEM ANTES" + campo);
			var sequencial = 0;

			if (hAPI.getCardValue("seq_item___" + seqItem) != "") {
				sequencial = parseInt(hAPI
						.getCardValue("seq_item___" + seqItem));
				log.info("SEQUENCIAL DO ITEM " + sequencial);
			}

			var codigo = 0;
			if (hAPI.getCardValue("seq_item___" + seqItem) != "") {
				codigo = (hAPI.getCardValue("cod_item___" + seqItem));
			}

			var descricao = 0;
			if (hAPI.getCardValue("seq_item___" + seqItem) != "") {
				descricao = (hAPI.getCardValue("des_item___" + seqItem));
			}

			var um = 0;
			if (hAPI.getCardValue("seq_item___" + seqItem) != "") {
				um = (hAPI.getCardValue("um___" + seqItem));
			}

			var qtd_devolvida = 0;
			if (hAPI.getCardValue("seq_item___" + seqItem) != "") {
				qtd_devolvida = (hAPI.getCardValue("qtd_devolver___" + seqItem));
			}

			HTML = HTML + "<tr height='20'>";
			HTML = HTML + "<td width='5%' id='Fundo_Esq_Mid_Linhas'>"; // ITEM
			HTML = HTML + "<font id='Imp_Produto'> " + sequencial + "</font>";
			HTML = HTML + "</td>";
			HTML = HTML + "<td width='15%' id='Fundo_Cen_Mid_Linhas'>"; // CODIGO
			HTML = HTML + "<font id='Imp_Produto'>" + codigo + "</font>";
			HTML = HTML + "</td>";
			HTML = HTML + "<td width='30%' id='Fundo_Cen_Mid_Linhas'>"; // DESCRICAO
			HTML = HTML + "<font id='Imp_Produto'>" + descricao + "</font>";
			HTML = HTML + "</td>";
			HTML = HTML
					+ "<td width='10%' id='Fundo_Cen_Mid_Linhas' align='center'>"; // UNIDADE
			HTML = HTML + "<font id='Imp_Produto'>" + um + "</font>";
			HTML = HTML + "</td>";
			HTML = HTML
					+ "<td width='10%' id='Fundo_Cen_Mid_Linhas' align='right'>"; // QTDE
			HTML = HTML + "<font id='Imp_Produto'>" + qtd_devolvida + "</font>";
			HTML = HTML + "</td>";
			HTML = HTML + "</tr>";

		}
	}

	// fim do HTML

	// ######## RECUPERA AREA DE UPLOAD DO USUÃ¿RIO
	var user = getValue("WKUser");
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("colleaguePK.companyId",
			1, 1, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("colleaguePK.colleagueId",
			user, user, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("chave",
			'UserPhysicalVolumeUpload', 'UserPhysicalVolumeUpload',
			ConstraintType.MUST));
	var usuario = DatasetFactory.getDataset("colleagueParam", null,
			constraints, null);
	var path = '';
	if (usuario.values.length > 0) {
		path = usuario.getValue(0, "val_param");
		log.info('ENTREI..... ');
	}
	log.info('CAMINHO..... ' + path);

	// ###### PUBLICA ARQUIVOS HTML NO PASTA DE ARQUIVOS
	var nomeFile = cod_empresa + "_" + nota_fiscal;
	var extFile = 'html';

	try {

		var file = new java.io.File(path + nomeFile + "." + extFile);
		file.createNewFile();
		var fiWi = new java.io.FileWriter(file.getAbsoluteFile());
		var buWi = new java.io.BufferedWriter(fiWi);
		buWi.write(HTML);
		buWi.close();

		/*var file = new java.io.File(path + nomeFile + "_rep." + extFile);
		file.createNewFile();
		var fiWi = new java.io.FileWriter(file.getAbsoluteFile());
		var buWi = new java.io.BufferedWriter(fiWi);
		buWi.write(HTML);
		buWi.close();*/

	} catch (e) {
		log.info('ERROOOOO.....' + e);
	}
	var folder = 47426;
	log.info('FOLDER.....' + folder);
	// ## CRIA DOCUMENTO REPRES
	var dto = docAPI.newDocumentDto();
	dto.setDocumentDescription(nomeFile /*+ "_rep"*/);
	log.info('NOMEFILE.....' + nomeFile);
	dto.setDocumentType("2");
	log.info('PASSOU1');
	dto.setParentDocumentId(folder);
	log.info('PASSOU2');
	dto.setDocumentTypeId("");
	log.info('PASSOU3');
	// ## CRIAR ARQUIVO
	var attachArray = new java.util.ArrayList();
	log.info('PASSOU4');
	var mainAttach = docAPI.newAttachment();
	log.info('PASSOU5');
	mainAttach.setFileName(nomeFile /*+ "_rep*/+"." + extFile);
	log.info('PASSOU6');
	mainAttach.setPrincipal(true);
	log.info('PASSOU7');
	mainAttach.setAttach(false);
	log.info('PASSOU8');
	attachArray.add(mainAttach);
	log.info('PASSOU9');
	// Adicionando aprovadores
	dto.setActiveVersion(true);
	log.info('PASSOU10');
	dto.setColleagueId(getValue("WKUser")); // Informar o usuÃ¿Â¡rio logado.
	log.info('PASSOU11');
	dto.setPublisherId(getValue("WKUser")); // Informar o publicador.
	log.info('PASSOU12');
	/*try {
		var doc = docAPI.createDocument(dto, attachArray, null, null, null);
		log.info('PASSOU13');
		log.info("DOCUMENTO CRIADO COM O ID: " + doc.getDocumentId());
		log.info('PASSOU14');
	} catch (e) {
		log.error("Problemas na criacao do documento:\n" + e);
	}*/

	// ##### ENVIO DE E-MAIL
	// Recuperado informaÃ§Ãµes para envia de e-mail via jboss
	var contextWD = new javax.naming.InitialContext();
	var mailSession = contextWD.lookup("java:jboss/mail/Default");

	// Gera e-mail cliente
	var to = new Array();
	// ###### BUSCA DADOS CLIENTE - LOGIX REST
	var c1 = DatasetFactory.createConstraint("cod_cliente",
			cod_cliente_empresa, cod_cliente_empresa, ConstraintType.MUST);
	log.info("COD EMPRESA CLIENTE " + cod_cliente_empresa);
	var constraints = new Array(c1);
	var dataset = DatasetFactory.getDataset('cliente_email_rest', null,
			constraints, null);
	if (dataset != null) {
		for (var x = 0; x < dataset.values.length; x++) {
			// ##### Carrega lista de e-mail
			log.info('DATA SET...' + dataset);
			log.info('OBJ...' + dataset.getValue(x, "grupo_email"));
			log.info('MAIL...' + dataset.getValue(x, "email"));
			if (dataset.getValue(x, "grupo_email") == 4
					&& dataset.getValue(x, "email") != "") {
				to.push(new javax.mail.internet.InternetAddress(dataset
						.getValue(x, "email")));
			}
		}
	}
	// ### CRIA MENSSAGEM
	var menssagem = javax.mail.internet.MimeMessage(mailSession);
	log.info('PASSOU1');
	var from = new javax.mail.internet.InternetAddress("fluig@ceramfix.com.br");
	log.info('PASSOU2');
	menssagem.setFrom(from);
	menssagem.setRecipients(javax.mail.Message.RecipientType.TO, to);
	menssagem.setSubject("FAD CERAMFIX: Unidade: " + den_empresa_reduz
			+ "  Nota Fiscal: " + nota_fiscal);
	// ### Cria corpo do e-mail
	var textPart = new javax.mail.internet.MimeBodyPart();
	textPart.setText(HTML, "utf-8");
	var htmlPart = new javax.mail.internet.MimeBodyPart();
	htmlPart.setContent(HTML, "text/html; charset=utf-8");
	var multipart = new javax.mail.internet.MimeMultipart();
	multipart.addBodyPart(htmlPart);
	menssagem.setContent(multipart);
	log.info('PASSOU3');
	// Cria anexo do e-mail
	var messageBodyPart = new javax.mail.internet.MimeBodyPart();
	messageBodyPart.setDataHandler(new javax.activation.DataHandler(
			new javax.mail.util.ByteArrayDataSource(HTML,
					"text/html; charset=utf-8")));
	messageBodyPart.setFileName(nomeFile + /*"_rep*/+"." + extFile);
	log.info('PASSOU4');
	multipart.addBodyPart(messageBodyPart);
	log.info('PASSOU5');
	menssagem.setContent(multipart);
	log.info('PASSOU6');
	javax.mail.Transport.send(menssagem);
	log.info('PASSOU7');

}