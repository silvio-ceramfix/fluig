var abaAtual = '';

var myLoading2 = FLUIGC.loading(window);

function loadBody(){
	
	if(	$("#nome_produto").val() != "" ){
		$('#titulo_prod').html( $("#nome_produto").val() );
		$('#titulo').val( $("#nome_produto").val() );
		$("#den_item").val( $("#nome_produto").val() );
	}else if( $("#den_item").val() != "" ){
		$('#titulo_prod').html( $("#den_item").val() );
		$('#titulo').val( $("#den_item").val() );
	}
	
	if( $("#task").val() == "0" ){ 
		loadRegional();
		loadRegionalEmpUF();
		loadUnidade();
		loadEspecif();
		loadEmpUF();
	}
	
	if( $("#task").val() != "0" 
	 && $("#task").val() != "4"
	 && $("#task").val() != "7"
	  && $("#manager").val() != "S" ){ 
		readOnlyAll( 'tipo_solicitacao' );
	}
	
	if( ( $("#task").val() == "41"
	 || $("#task").val() == "44"
	 || $("#task").val() == "48" )
	 && $("#manager").val() != "S"
	){ 
		readOnlyAll( 'termo' );
	}
	
	
	loadDsCombo('um_multiplo_venda', 'selectTable', 'cod_unid_med', 'den_unid_med_30', 'dataBase,table', 'java:/jdbc/LogixPRD,unid_med', 'cod_unid_med' );

	//$('span').show();
	
	if( $("#tipo_processo").val() == 'D'
	   && qtdLista("den_materia_prima") == 0 ){
		addMateriaPrima();
	}
	
	if( qtdListaVal("den_materia_prima") > 0
	 && qtdLista("materia_prima_fornecedor") == 0 ){
		copyMP('estimativa_volumes');
	}
	
	if( qtdListaVal("cores") > 0
	 && qtdLista("den_item_barras") == 0 ){
		copyCores('ean_cores');
	}
	
	if( qtdListaVal("den_item_barras") > 0
	 && qtdLista("produto_ppcp") == 0 ){
		copyEAN('codigos_ppcp');
	}
	
	if( $("#task").val() != "10" 
	 && $("#task").val() != "189"  ){
		abaAtual = habilitaPages();
		controlaAba( abaAtual );
	}else{
		trataAbasPrint();
		$('#num_processo').val($('#processo').val());
		autoSize();
		if( $("#manager").val() != "S" ){
			readOnlyAll();
		}
	}
	
	for (aba in abas) {
		if( $('#tipo_processo').val() == 'F' ){
			$( '.'+aba ).attr('title', abas[aba].tFerramenta );
			$('.termo').hide();
			
		}else{
			$( '.'+aba ).attr('title', abas[aba].tProduto );
			$('.termo' ).show();
		}
	}
	
	if( $('#WKUser').val() == 'admin'
	 || $("#manager").val() == "S" ){
		$('.abas').show();
	}
	
	if( $('#tipo_processo').val() != 'F'  && abaAtual >= "10" ){
		$('#termo_espelho').append( $('#termo_base').html() ); 
	}
	
	if( $("#task").val() == "189"  )
	{
		trataAbasPrint();
		$('#num_processo').val($('#processo').val());
		autoSize();
		if( $("#manager").val() != "S" ){
			readOnlyAll();
		}
		console.log('executou');
	}
	console.log('tarefa ',$("#task").val());
	if ($('#task').val() != '1' && $("#task").val() != '0'){
			console.log('entrou no bloqueio');
			$('#den_item').attr('readonly',true);
			var objeto = $('#tipo_processo');
			$('#'+ $(objeto).attr('id') +' option:not(:selected)').prop('disabled', true);
	}
	
	if ($("#task").val() == '24'){
		habilitaAll('termo');
	}
}

function qtdLista( idBase ){
	var qtd = 0;
	$( "input[name^="+idBase+"___]" ).each(function( index ) {
		qtd += 1;
	});
	return qtd;
}

function qtdListaVal( idBase ){
	var qtd = 0;
	$( "input[name^="+idBase+"___]" ).each(function( index ) {
		if( $(this).val() != "" ){
			qtd += 1;
		}
	});
	return qtd;
}

var abasTask = new Array();

var abas = {
	 "aba_01" : {"produto":"info_preliminar"					,"ferramenta":"info_preliminar"		
		 		,"task_produto":["0","4","7"] 					,"task_ferramenta":["0","4","7"]
				,"tProduto":"Preliminar"						,"tFerramenta":"Preliminar" },	
	 "aba_02" : {"produto":"adm_vendas_comerc"					,"ferramenta":"adm_vendas_comerc"	
		 		,"task_produto":["13"] 							,"task_ferramenta":["13"]
				,"tProduto":"Comercial"							,"tFerramenta":"Comercial" },	
	 "aba_03" : {"produto":"custo_prod"							,"ferramenta":"assistente_vendas"	
		 		,"task_produto":["18"] 							,"task_ferramenta":["124"]
				,"tProduto":"Custos"							,"tFerramenta":"Comercial" },	
	 "aba_04" : {"produto":"eng_prod"							,"ferramenta":"marketing_emb"			
		 		,"task_produto":["24"] 							,"task_ferramenta":["168","172"]
				,"tProduto":"Engenharia Prod."					,"tFerramenta":"Marketing" },
				
	"aba_05" : {"produto":"marketing_emb"						,"ferramenta":"custo_prod"			
		 	   ,"task_produto":["172","21"] 					,"task_ferramenta":["18"]
			   ,"tProduto":"Marketing"							,"tFerramenta":"Custo" },
				 				
	 "aba_06" : {"produto":"marketing"							,"ferramenta":"eng_prod"			
		 		,"task_produto":["168"] 							,"task_ferramenta":["203"]
				,"tProduto":"Marketing"							,"tFerramenta":"Analise de Importação" },
	 
	 "aba_07" : {"produto":"compras"							,"ferramenta":"marketing"		
		 		,"task_produto":["27"] 							,"task_ferramenta":["21"]
				,"tProduto":"Compras"							,"tFerramenta":"Marketing" },
				
	 "aba_08" : {"produto":"ppcp_projeto"						,"ferramenta":"compras"				
		 		,"task_produto":["30"] 							,"task_ferramenta":["27"]
				,"tProduto":"Eng. Processo"							,"tFerramenta":"Compras" }, 	
	 "aba_09" : {"produto":"controller"							,"ferramenta":"ppcp_projeto"		
		 		,"task_produto":["33"] 							,"task_ferramenta":["130"]
				,"tProduto":"Controller"						,"tFerramenta":"Projetos" },
	 "aba_10" : {"produto":"termo"								,"ferramenta":"ppcp"				
		 		,"task_produto":["36","39","41","44","48"] 		,"task_ferramenta":["132","192"]
				,"tProduto":"Termo"								,"tFerramenta":"PPCP" },	
	 "aba_11" : {"produto":"marketing_2"						,"ferramenta":"controller"			
		 		,"task_produto":["50"] 							,"task_ferramenta":["33"]
				,"tProduto":"Marketing"							,"tFerramenta":"Controller" },	
	 "aba_12" : {"produto":"eng_prod_2"							,"ferramenta":"marketing_2"			
		 		,"task_produto":["53","60","63","74","65"] 		,"task_ferramenta":["50"]
				,"tProduto":"Engenharia Prod."					,"tFerramenta":"Marketing" },	
	 "aba_13" : {"produto":"eng_proc"							,"ferramenta":"assistente_venda_2"	
		 		,"task_produto":["58"] 							,"task_ferramenta":["150"]
				,"tProduto":"Engenharia Proc."					,"tFerramenta":"Comercial" },
	 "aba_14" : {"produto":"custo_prod_2"						,"ferramenta":"custo_prod_2"		
		 		,"task_produto":["68"] 							,"task_ferramenta":["68"]
				,"tProduto":"Custos"							,"tFerramenta":"Custos" },	
	 "aba_15" : {"produto":"marketing_3"						,"ferramenta":"marketing_3"			
		 		,"task_produto":["70"] 							,"task_ferramenta":["70"]
				,"tProduto":"Marketing"							,"tFerramenta":"Marketing" },	
	 "aba_16" : {"produto":"custo_prod_3"						,"ferramenta":"custo_prod_3"		
		 		,"task_produto":["72","183"] 					,"task_ferramenta":["72","183"]
				,"tProduto":"Custos"							,"tFerramenta":"Custos" },	
	 "aba_17" : {"produto":"ppcp_2"								,"ferramenta":"ppcp_2"				
		 		,"task_produto":["79"] 							,"task_ferramenta":["79"]
				,"tProduto":"PPCP"								,"tFerramenta":"PPCP" },	
	 "aba_18" : {"produto":"contabilidade"						,"ferramenta":"contabilidade"		
		 		,"task_produto":["81"] 							,"task_ferramenta":["81"]
				,"tProduto":"Contabilidade"						,"tFerramenta":"Contabilidade" },
	 "aba_19" : {"produto":"eng_proc_2"							,"ferramenta":"eng_proc_2"			
		 		,"task_produto":["84"] 							,"task_ferramenta":["84"]
				,"tProduto":"Engenharia Proc."					,"tFerramenta":"Engenharia Proc." },
	 "aba_20" : {"produto":"projeto"							,"ferramenta":"frete"				
		 		,"task_produto":["87"] 							,"task_ferramenta":["90"]
				,"tProduto":"Projetos"							,"tFerramenta":"Frete" },
	 "aba_21" : {"produto":"frete"								,"ferramenta":"comissoes_verbas"				
		 		,"task_produto":["90"]							,"task_ferramenta":["186"]
				,"tProduto":"Frete"								,"tFerramenta":"Comissões / Verbas" },
				
	 "aba_22" : {"produto":"comissoes_verbas"					,"ferramenta":"custo_4"		
		 		,"task_produto":["186"] 						,"task_ferramenta":["93","95"]
				,"tProduto":"Comissões / Verbas"				,"tFerramenta":"Custos" },
				
				
	 "aba_23" : {"produto":"custo_4"							,"ferramenta":"controller_2"		
		 		,"task_produto":["93","95"] 					,"task_ferramenta":["97"]
				,"tProduto":"Custos"							,"tFerramenta":"Controller" },
	 "aba_24" : {"produto":"controller_2"						,"ferramenta":"marketing_4"			
		 		,"task_produto":["97"]							,"task_ferramenta":["101"]
				,"tProduto":"Controller"						,"tFerramenta":"Marketing" },
	 "aba_25" : {"produto":"marketing_4"						,"ferramenta":"ppcp_3"				
		 		,"task_produto":["101"]							,"task_ferramenta":["105","160","176"]
				,"tProduto":"Marketing"							,"tFerramenta":"PPCP" },
	 "aba_26" : {"produto":"ppcp_3"								,"ferramenta":"marketing_5"			
		 		,"task_produto":["105","160","176"] 			,"task_ferramenta":["107"]
				,"tProduto":"PPCP"								,"tFerramenta":"Marketing" },
	 "aba_27" : {"produto":"marketing_5"						,"ferramenta":"comercial_2"			
		 		,"task_produto":["107"] 						,"task_ferramenta":["109"]
				,"tProduto":"Marketing"							,"tFerramenta":"Comercial" },
	 "aba_28" : {"produto":"comercial_2"						,"ferramenta":"eng_prod_3"			
		 		,"task_produto":["109"] 						,"task_ferramenta":["111"]
				,"tProduto":"Comercial"							,"tFerramenta":"Engenharia Prod." },
	 "aba_29" : {"produto":"eng_prod_3"							,"ferramenta":"marketing_6"			
		 		,"task_produto":["111"] 						,"task_ferramenta":["113"]
				,"tProduto":"Engenharia Prod."					,"tFerramenta":"Marketing" },
	 "aba_30" : {"produto":"marketing_6"						,"ferramenta":""					
		 		,"task_produto":["113"] 						,"task_ferramenta":[""]
				,"tProduto":"Marketing"							,"tFerramenta":"" },
	 "aba_31" : {"produto":"marketing_7"						,"ferramenta":"marketing_7"					
	 		,"task_produto":["10","189"] 						,"task_ferramenta":["10","189"]
			,"tProduto":"Marketing"							,"tFerramenta":"Marketing" }
	 
}

function trataAbasPrint(){
	$('.panel-info').hide();
	for (aba in abas) {
		if( $('#tipo_processo').val() == 'F' ){
			$( '.'+abas[aba].ferramenta ).show();
		}else{
			$( '.'+abas[aba].produto ).show();
		}
	}
	if( $('#tipo_processo').val() == 'F' ){
		$('.produto').hide();
		$('.ferramenta' ).show();
	}else{
		$('.ferramenta' ).hide();
		$('.produto').show();
	}
	$('.tipo_solicitacao' ).show();
	$('.btn-group' ).hide();
}

function habilitaPages(){
	var achou = false;
	var abaAtu = '';
	for (aba in abas) {
		if( $('#tipo_processo').val() == 'F' ){
			if( abas[aba].ferramenta != "" ){
				if( $.inArray( $("#task").val(), abas[aba].task_ferramenta ) >= 0 ){
					if( abaAtu == '' ){
						abaAtu = aba.split('_')[1];
					}
					abasTask.push(aba);
					achou = true;
					//$('.fluigicon-eye-open', $('.'+abas[aba].ferramenta ) ).hide();
				}else{
					readOnlyAll( abas[aba].ferramenta );
					if( achou ){
						$( '.'+aba ).hide();
					}
				}
			}else{
				$( '.'+aba ).hide();
			}
		}else{
			if( abas[aba].produto != "" ){
				if( $.inArray( $("#task").val(), abas[aba].task_produto ) >= 0 ){
					if( abaAtu == '' ){
						abaAtu = aba.split('_')[1];
					}
					abasTask.push(aba);
					achou = true;
					//$('.fluigicon-eye-open', $('.'+abas[aba].produto ) ).hide();
				}else{
					readOnlyAll( abas[aba].produto );
					if( achou ){
						$( '.'+aba ).hide();
					}
				}
			}else{
				$( '.'+aba ).hide();
			}
		}
	}
	if( abaAtu == '' ){
		abaAtu = '01';
	}
	
	if( $("#task").val() == '93' ){
		$('.fluigicon-file-doc', '.custo_4' ).show();
		$('.fluigicon-eye-open', '.custo_4' ).hide();
	}else if( $("#task").val() == '95' ){
		$('.fluigicon-file-doc', '.custo_4' ).hide();
		$('.fluigicon-eye-open', '.custo_4' ).show();
	}
	
	if( $("#task").val() == "105" 
	 || $("#task").val() == "176" ){ 
		$('.prev-entrega').attr('readonly',true);
		$('.prev-entrega').removeClass('decimal-0');
		$('.prev-entrega').removeClass('data-fluig');
	}
	if( $("#task").val() == "105" 
	 || $("#task").val() == "160" ){ 
		$('.conf-entrega').attr('readonly',true);
		$('.conf-entrega').removeClass('decimal-0');
		$('.conf-entrega').removeClass('data-fluig');
	}
	if( $("#task").val() == "160" 
	 || $("#task").val() == "176" ){
		$('.solic-compra').attr('readonly',true);
		$('.solic-compra').removeClass('decimal-0');
		$('.solic-compra').removeClass('data-fluig');
	}
	
	return abaAtu;
	
}

function controlaAba( aba ){
	
	$('.abas').css('background-color', 'FFFFFF');
	for( var x = 0; x < abasTask.length; x ++ ){
		$( '.'+abasTask[i] ).css('background-color', 'ffe5cc');
	}
	$('.aba_'+aba).css('background-color', 'ORANGE');

	console.log('Faa.. ', aba, abas['aba_'+aba] );
	
	if( $('#tipo_processo').val() == 'F' ){
		$('.panel-info').hide();
		$('.'+abas['aba_'+aba].ferramenta ).show();
		$('.ferramenta' ).show();
		$('.produto').hide();
	}else{
		$('.panel-info').hide();
		$('.'+abas['aba_'+aba].produto ).show();
		$('.ferramenta' ).hide();
		$('.produto').show();
	}
	$('.tipo_solicitacao' ).show();

	trataCampos();
	setMask();
}


function loadRegional(){
	var cons = new Array();
	cons.push( DatasetFactory.createConstraint( 'dataset', 'empresa_compl', null, ConstraintType.MUST) );
	cons.push( DatasetFactory.createConstraint( 'table', 'regional_empresa', null, ConstraintType.MUST) );
	var ord = new Array('cod_regional');
	var field = new Array('distinct','cod_regional','den_regional');
	var dataset = DatasetFactory.getDataset( 'selectPaiFilho', field, cons, ord);
	console.log('Data loadRegional....',dataset );
	if ( dataset != null ){
		for (var x = 0; x < dataset.values.length; x++) {

			var achou = false;
			$( "input[name^=regional_demanda___]" ).each(function( index ) {
				var seq = $(this).attr('id').split('___')[1];
				console.log( 'Antes IF', $('#regional_demanda___'+seq).val(), dataset.values[x].den_regional );
				if( $('#regional_demanda___'+seq).val() == dataset.values[x].den_regional ){
					console.log('ACHOUUUU...');
					achou = true;
				}
			});
			if( !achou ){
				var seq = wdkAddChild('demanda_minima');
				$('#regional_demanda___'+seq).val( dataset.values[x].den_regional );
				$('#cod_regional_demanda___'+seq).val( dataset.values[x].cod_regional );
			}
			
		}
	}
	var seq = wdkAddChild('demanda_minima');
	$('#regional_demanda___'+seq).val( 'Total' );
	$('#cod_regional_demanda___'+seq).val( 'total' );
	$('#demanda_inicial___' + seq).attr('readonly',true);
	$('#demanda_mercado___' + seq).attr('readonly',true);
	$('#demanda_preco_estimado___' + seq).attr('readonly',true);
}

function totalRegional(){
	var linha_total = '0';
	var total_inicial = 0;
	var total_mercado = 0;
	var total_preco = 0;
	$( "input[name^=regional_demanda___]" ).each(function( index ) {
		var seq = $(this).attr('id').split('___')[1];
		console.log('seq....',seq);
		if( $('#cod_regional_demanda___'+seq).val( ) == 'total' ){
			linha_total = seq;
		}else{
			total_inicial += isNull(Math.round(parseFloat($('#demanda_inicial___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
			total_mercado += isNull(Math.round(parseFloat($('#demanda_mercado___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0)
			total_preco += isNull(Math.round(parseFloat($('#demanda_mercado___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0)
						 * isNull(Math.round(parseFloat($('#demanda_preco_estimado___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
		}
	});
	$('#demanda_inicial___'+linha_total).val( String( (total_inicial).toFixed(0) ).replace('.', ',') );
	$('#demanda_mercado___'+linha_total).val( String( (total_mercado).toFixed(0) ).replace('.', ',') );
	if( total_mercado != 0 ){
		$('#demanda_preco_estimado___'+linha_total).val( String( (total_preco / total_mercado).toFixed(2) ).replace('.', ',') );
	}
	console.log('total....',total_inicial,total_mercado,total_preco);
	$('#demanda_inicial___'+linha_total).attr('readonly',true);
	$('#demanda_mercado___'+linha_total).attr('readonly',true);
	$('#demanda_preco_estimado___'+linha_total).attr('readonly',true);
}


function loadRegionalEmpUF(){
	var cons = new Array();
	cons.push( DatasetFactory.createConstraint( 'dataset', 'empresa_compl', null, ConstraintType.MUST) );
	cons.push( DatasetFactory.createConstraint( 'table', 'regional_empresa', null, ConstraintType.MUST) );
	var ord = new Array('f.cod_regional','f.uf_regional');
	var field = new Array('distinct','f.cod_regional','f.den_regional','f.uf_regional','p.cod_empresa','p.den_empresa','f.ies_reg_princ');
	var dataset = DatasetFactory.getDataset( 'selectPaiFilho', field, cons, ord);
	console.log('Data set loadRegionalEmpUF....',dataset );
	if ( dataset != null ){
		for (var x = 0; x < dataset.values.length; x++) {
			var seq = wdkAddChild('demanda_inicial_mes');
			$('#regional_demanda_mes___'+seq).val( dataset.values[x].den_regional );
			$('#cod_regional_demanda_mes___'+seq).val( dataset.values[x].cod_regional );
			$('#unidade_demanda_mes___'+seq).val( dataset.values[x].den_empresa );
			$('#cod_unidade_demanda_mes___'+seq).val( dataset.values[x].cod_empresa );
			$('#uf_demanda_mes___'+seq).val( dataset.values[x].uf_regional );
			if( dataset.values[x].ies_reg_princ == 'on' ){
				var seqA = wdkAddChild('armazenagem');
				$('#arm_reginal___'+seqA).val( dataset.values[x].den_regional );
				$('#cod_arm_reginal___'+seqA).val( dataset.values[x].cod_regional );
				$('#arm_unidade___'+seqA).val( dataset.values[x].den_empresa );
				$('#cod_arm_unidade___'+seqA).val( dataset.values[x].cod_empresa );
				
			}
		}
		var seq = wdkAddChild('demanda_inicial_mes');
		$('#regional_demanda_mes___'+seq).val( 'Total' );
		$('#cod_regional_demanda_mes___'+seq).val( 'total' );
		$('#unidade_demanda_mes___'+seq).val('total' );
		$('#cod_unidade_demanda_mes___'+seq).val( 'total' );
		$('#uf_demanda_mes___' + seq).val('total');
		$('#mes_1_demanada___' + seq).attr('readonly',true);
		$('#mes_2_demanada___' + seq).attr('readonly',true);
		$('#mes_3_demanada___' + seq).attr('readonly',true);
	}
}

function totalDemandaInicial(){
	var linha_total = '0';
	var total_mes1 = 0;
	var total_mes2 = 0;
	var total_mes3 = 0;
	$( "input[name^=regional_demanda_mes___]" ).each(function( index ) {
		var seq = $(this).attr('id').split('___')[1];
		console.log('seq....',seq);
		if( $('#cod_regional_demanda_mes___'+seq).val( ) == 'total' ){
			linha_total = seq;
		}else{
			total_mes1 += isNull(Math.round(parseFloat($('#mes_1_demanada___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
			total_mes2 += isNull(Math.round(parseFloat($('#mes_2_demanada___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
			total_mes3 += isNull(Math.round(parseFloat($('#mes_3_demanada___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
		}
	});
	$('#mes_1_demanada___'+linha_total).val( String( (total_mes1).toFixed(0) ).replace('.', ',') );
	$('#mes_2_demanada___'+linha_total).val( String( (total_mes2).toFixed(0) ).replace('.', ',') );
	$('#mes_3_demanada___'+linha_total).val( String( (total_mes3).toFixed(0) ).replace('.', ',') );

	console.log('mes_1_demanada___... ',total_mes1,total_mes2,total_mes3);
	$('#mes_1_demanada___'+linha_total).attr('readonly',true);
	$('#mes_2_demanada___'+linha_total).attr('readonly',true);
	$('#mes_3_demanada___'+linha_total).attr('readonly',true);
}

function loadEmpUF(){
	var cons = new Array();
	cons.push( DatasetFactory.createConstraint( 'dataset', 'empresa_compl', null, ConstraintType.MUST) );
	cons.push( DatasetFactory.createConstraint( 'table', 'regional_empresa', null, ConstraintType.MUST) );
	var ord = new Array('p.cod_empresa','f.uf_regional');
	var field = new Array('distinct','p.cod_empresa','p.den_empresa','f.uf_regional');
	var dataset = DatasetFactory.getDataset( 'selectPaiFilho', field, cons, ord);
	console.log('Data set loadRegionalEmpUF....',dataset );
	if ( dataset != null ){
		for (var x = 0; x < dataset.values.length; x++) {
			
			var seq = wdkAddChild('frete');
			$('#frt_unidade___'+seq).val( dataset.values[x].den_empresa );
			$('#cod_frt_unidade___'+seq).val( dataset.values[x].cod_empresa );
			$('#frt_uf___'+seq).val( dataset.values[x].uf_regional );
			
			var seq = wdkAddChild('documentos_custos');
			$('#cst_empresa___'+seq).val( dataset.values[x].den_empresa );
			$('#cod_cst_empresa___'+seq).val( dataset.values[x].cod_empresa );
			$('#cst_uf___'+seq).val( dataset.values[x].uf_regional );
			
			var seq = wdkAddChild('documentos_cont');
			$('#cont_empresa___'+seq).val( dataset.values[x].den_empresa );
			$('#cod_cont_empresa___'+seq).val( dataset.values[x].cod_empresa );
			$('#cont_uf___'+seq).val( dataset.values[x].uf_regional );
		}
	}
}

function loadUnidade(){
	var cons = new Array();
	var ord = new Array('cod_empresa');
	var field = new Array('cod_empresa','den_empresa');
	var dataset = DatasetFactory.getDataset( 'empresa_compl', field, cons, ord);
	console.log('Data set loadUnidade....',dataset );
	if ( dataset != null ){
		for (var x = 0; x < dataset.values.length; x++) {
			var seq = wdkAddChild('capacidade_produtiva');
			$('#unidade_capacidade___'+seq).val( dataset.values[x].den_empresa );
			$('#cod_unidade_capacidade___'+seq).val( dataset.values[x].cod_empresa );
			
			var seq = wdkAddChild("cad_contabil");
			$('#empresa_contab___'+seq).val( dataset.values[x].den_empresa );
			$('#cod_empresa_contab___'+seq).val( dataset.values[x].cod_empresa );
		}
	}
}

function loadEspecif(){

	var cons = new Array();
	cons.push( DatasetFactory.createConstraint( 'dataset', 'empresa_compl', null, ConstraintType.MUST) );
	cons.push( DatasetFactory.createConstraint( 'table', 'especificao', null, ConstraintType.MUST) );
	cons.push( DatasetFactory.createConstraint( 'ies_matriz', 'on', 'on', ConstraintType.MUST) );
	
	var ord = new Array('f.documento_especificao');
	var field = new Array('distinct','f.documento_especificao');
	var dataset = DatasetFactory.getDataset( 'selectPaiFilho', field, cons, ord);
	console.log('Data set loadEspecif....',dataset );
	if ( dataset != null ){
		for (var x = 0; x < dataset.values.length; x++) {
			var seq = wdkAddChild('especificoes');
			$('#documento_especificao___'+seq).val( dataset.values[x].documento_especificao );
		}
	}
}

function addComissao(){
	wdkAddChild("comissoes");
	setMask();
}

function addVerba(){
	wdkAddChild("verbas");
	setMask();
}

function addMateriaPrima(){
	wdkAddChild("materia_prima");
	setMask();
	iesMpNova();
}

function addEstimativaVolumes(){
	wdkAddChild("estimativa_volumes");
	setMask();
}
 
function pressCores(e,v){
	if( event.keyCode == 13 ){
		addCores();
	}
}
function addCores(){
	var row = wdkAddChild("cores");
	setMask();
	setTimeout("$('#cores___"+row + "').focus();", 1);
}

function addCorForm(){
	wdkAddChild("form_cores");
	setMask();
}

function pressAcess(e,v){
	if( event.keyCode == 13 ){
		addAcessorios();
	}
}
function addAcessorios(){
	var row = wdkAddChild("acessorios");
	setMask();
	setTimeout("$('#acessorios___"+row + "').focus();", 1);
}

function addBarras(){
	wdkAddChild("ean_cores");
	setMask();
}

function addCodPPCP(){
	wdkAddChild("codigos_ppcp");
	setMask();
}

function addEmbPiloto(){
	wdkAddChild("embalagens_piloto");
	setMask();
}

function addCompra(){
	wdkAddChild("produto_compra");
	setMask();
}

function addCusto(){
	wdkAddChild("documentos_custos");
	setMask();
}

function addEstimativaEmb(){
	wdkAddChild("estimativa_embalagem");
	setMask();
}

function copyCores(table){
	console.log('copyCores');
	if( table == 'ean_cores' ){
		var qtd = 0;
		$( "input[name^=den_item_barras___]" ).each(function( index ) {
			qtd += 1;
		});
		if( qtd > 0 ){
			return false;
		}
	}
	if( table == 'form_cores' ){
		var qtd = 0;
		$( "input[name^=cor_form___]" ).each(function( index ) {
			qtd += 1;
		});
		if( qtd > 0 ){
			return false;
		}
	}
	console.log('copyCorres');
	$( "input[name^=cores___]" ).each(function( index ) {
		if( table == 'ean_cores' ){
			var seq = wdkAddChild("ean_cores");
			$('#den_item_barras___'+seq).val( $('#nome_produto').val()+'-'+$(this).val() );
		}
		if( table == 'form_cores' ){
			var seq = wdkAddChild("form_cores");
			$('#cor_form___'+seq).val( $(this).val() );
		}
	});
	setMask();
}

function copyEmb(table){
	
	console.log('copyEmb');
	var qtd = 0;
	$( "input[name^=fornecedor_embalagem___]" ).each(function( index ) {
		qtd += 1;
	});
	if( qtd > 0 ){
		return false;
	}
	console.log('copyEmb');
	$( "input[name^=embalagem_piloto___]" ).each(function( index ) {
		if( table == 'estimativa_embalagem' ){
			var seq = $(this).attr('id').split('___')[1];
			var row = wdkAddChild("estimativa_embalagem");
			$('#fornecedor_embalagem___'+row).val( $('#embalagem_piloto___'+seq).val().trim() );
		}
	});
	setMask();	
	
}

function copyMP(table){
	console.log('copyMP');
	var qtd = 0;
	if( table == 'estimativa_volumes' ){
		$( "input[name^=materia_prima_fornecedor___]" ).each(function( index ) {
			qtd += 1;
		});
	}	
	if( table == 'produto_compra' ){
		$( "input[name^=item_compra___]" ).each(function( index ) {
			qtd += 1;
		});		
	}
	if( qtd > 0 ){
		return false;
	}
	console.log('copyMP');
	$( "input[name^=den_materia_prima___]" ).each(function( index ) {
		if( table == 'estimativa_volumes' ){
			var seq = $(this).attr('id').split('___')[1];
			var row = wdkAddChild("estimativa_volumes");
			$('#materia_prima_fornecedor___'+row).val( $('#den_materia_prima___'+seq).val().trim()+'-'+$('#fornecedor_materia_prima___'+seq).val().trim() );
		}
		if( table == 'produto_compra' ){
			var seq = $(this).attr('id').split('___')[1];
			var row = wdkAddChild("produto_compra");
			$('#item_compra___'+row).val( $('#den_materia_prima___'+seq).val().trim()+'-'+$('#fornecedor_materia_prima___'+seq).val().trim() );
		}
	});
	setMask();	
}


function trataDescMp( id ){
	seq = id.split('___')[1];
	if( $('#den_materia_prima___'+seq).val() != $('#den_materia_prima_orig___'+seq).val() ){
		$('#den_materia_prima_orig___'+seq).val('');
		$('#cod_materia_prima___'+seq).val('');
	}
	iesMpNova();
}

function iesMpNova(){
	var qtd = 0;
	$( "input[name^=cod_materia_prima___]" ).each(function( index ) {
		if( $(this).val() == '' ){
			qtd += 1;
		}
	});
	if( qtd > 0 ){
		$('#ies_mp_nova').val('S');
	}else{
		$('#ies_mp_nova').val('N');
	}	
}

function trataFornecMp( id ){
	seq = id.split('___')[1];
	if( $('#fornecedor_materia_prima___'+seq).val() != $('#fornecedor_materia_prima_orig___'+seq).val() ){
		$('#fornecedor_materia_prima_orig___'+seq).val('');
		$('#cod_fornec_materia_prima___'+seq).val('');
	}
}


function calcQtdPalet(){
	var qtd = parseInt( $('#altura_palete').val() ) * parseInt( $('#lastro_palete').val() );
	if( isNaN( qtd ) ){
		$('#quant_palete').val('');
	}else{
		$('#quant_palete').val(qtd);
	}
}

function calcQtdPaletFer(){
	var qtd = parseInt( $('#altura_palete_fer').val() ) * parseInt( $('#lastro_palete_fer').val() );
	if( isNaN( qtd ) ){
		$('#quant_palete_fer').val('');
	}else{
		$('#quant_palete_fer').val(qtd);
	}
}


function calcMedioFrt(id){
	var seq = id.split('___')[1];
	var media = ( isNull(Math.round(parseFloat($('#frt_minimo___'+seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0)
				+ isNull(Math.round(parseFloat($('#frt_maximo___'+seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0) ) / 2;
	console.log('media....',media);
	if( isNaN( media ) ){
		$('#frt_media___'+seq).val( '' );
	}else{
		$('#frt_media___'+seq).val( String((media).toFixed(2)).replace('.', ',') );
	}
}

function copyEAN(table){
	console.log('copyEAN');
	var qtd = 0;
	$( "input[name^=produto_ppcp___]" ).each(function( index ) {
		qtd += 1;
	});
	if( qtd > 0 ){
		return false;
	}
	$( "input[name^=den_item_barras___]" ).each(function( index ) {
		if( table == 'codigos_ppcp' ){
			var seq = wdkAddChild("codigos_ppcp");
			$('#produto_ppcp___'+seq).val( $(this).val() );
		}
	});
	setMask();
}

function setMaiorData( id ){
	console.log('setMaiorData.....');
	var dataMax = "0000-00-00";
	$( "input[name^="+ id +"___]" ).each(function( index ) {
		var dataAtu = $(this).val().split('/').reverse().join('-');
		if( dataAtu > dataMax ){
			dataMax = dataAtu; 
		}
	});
	console.log('dataMax.....', dataMax);
	$('#max_'+id).val( dataMax.split('-').reverse().join('/') );
	
	if( $('#max_dat_conf_item_compra').val() == "" ){
		$('#max_dat_conf_item_compra').val( $('#max_dat_prev_item_compra').val() );
	}
}

function setMask(){
	FLUIGC.calendar('.data-fluig' );
	$('.decimal-6').maskMoney({precision : 6,thousands : '.',decimal : ',',	defaultZero : true,	allowZero : true});
	$('.decimal-5').maskMoney({precision : 5,thousands : '.',decimal : ',',	defaultZero : true,	allowZero : true});
	$('.decimal-4').maskMoney({precision : 4,thousands : '.',decimal : ',',	defaultZero : true,	allowZero : true});
	$('.decimal-3').maskMoney({precision : 3,thousands : '.',decimal : ',',	defaultZero : true,	allowZero : true});
	$('.decimal-2').maskMoney({precision : 2,thousands : '.',decimal : ',', defaultZero : true, allowZero : true});
	$('.decimal-1').maskMoney({precision : 1,thousands : '.',decimal : ',',	defaultZero : true,	allowZero : true});
	$('.decimal-0').maskMoney({precision : 0,thousands : '.',decimal : ',',	defaultZero : true, allowZero : true});
	$('.integer-0').maskMoney({	precision : 0,thousands : '',decimal : '',defaultZero : true,allowZero : true});
	autoSize();
}

function trataCampos(){
	if( $('#tipo_ncm').val() == 'E' ){
		$('#num_ncm').attr('readonly',true);
	}else{
		$('#num_ncm').attr('readonly',false);
	}
	
	if( $('#tipo_cest').val() == 'A' ){
		$('#den_cest').removeClass("vld-p");
		$('#den_cest').removeClass("vld-f");
	}else{
		$('#den_cest').addClass("vld-p");
		$('#den_cest').addClass("vld-f");	
	}
	
	if( $('#tipo_cest').val() == 'E' ){
		$('#den_cest').attr('readonly',true);
	}else{
		$('#den_cest').attr('readonly',false);
		$('#num_cest').val('');
	}
}

function limpaNcm(){
	$('#num_ncm').val('');
}

function limpaCest(){
	$('#den_cest').val('');
	$('#num_cest').val('');
}

var fileName = "";

function getNameFile( base ){
	
	fileName = ''
		
	if( base == 'bt_custo_meta' ){
		fileName = 'custo_meta';
		$('#doc_custo_meta').val(fileName);
	}
	
	if( base == 'bt_formulacao' ){
		fileName = 'formulacao';
		$('#doc_formulacao').val(fileName);
	}
	
	if( base == 'bt_ficha_tec' ){
		fileName = 'ficha_tecnica';
		$('#doc_ficha_tec').val(fileName);
	}
	
	if( base == 'bt_fispq_produto' ){
		fileName = 'fispq_produto';
		$('#doc_fispq_produto').val(fileName);
	}
	
	if( base == 'bt_fispq_premix' ){
		fileName = 'fispq_premix';
		$('#doc_fispq_premix').val(fileName);
	}
	
	if( base == 'bt_manual_produto' ){
		fileName = 'manual_produto';
		$('#manual_produto').val(fileName);
	}
	
	
	var seq = base.split('___')[1];
	var campo = base.split('___')[0];
	if( campo == 'bt_custos' ){
		fileName = 'custo_'+$('#cst_empresa___'+seq).val().trim()+'_'+$('#cst_uf___'+seq).val().trim();
		$('#doc_custos___'+seq).val(fileName);
	}
	
}

function openFile( obj ){

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
	            parentOBJ.ECM.documentView.getDocument( $($(obj).parent().children()[0]).val() );
	        },
	        customButtons : []
	};
	parentOBJ.ECM.documentView.panel = parentOBJ.WCMC.panel(cfg);
	
}

var beforeSendValidate = function(numState, nextState) {
	
	var ies_retorno = 'N';
	
	for (aba in abas) {
		//abaAtual
		
		if( aba < 'aba_'+getLPad(abaAtual,'00') ){
			if( $('#tipo_processo').val() == 'F' ){
				if( abas[aba].task_ferramenta.indexOf(nextState) >= 0 ){
					ies_retorno = 'S';
					break;
				}
			}else{
				if( abas[aba].task_produto.indexOf(nextState) >= 0 ){
					ies_retorno = 'S';
					break;
				}
			}
		}
	}

	if( ies_retorno == "S" ){
		return true;
	}
	
	if( numState == "105" || numState == "160" || numState == "176" ){
		$( "select[name^=item_terc_compra___]" ).each(function( index ) {
			var seq = $(this).attr('id').split('___')[1];
			if( $(this).val() == "S" ){
				$('#oc_item_compra___'+seq).removeClass('task-p-105 task-f-105');
				$('#ped_item_compra___'+seq).removeClass('task-p-160 task-f-160');
				$('#dat_prev_item_compra___'+seq).removeClass('task-p-160 task-f-160');
				$('#dat_conf_item_compra___'+seq).removeClass('task-p-176 task-f-176');
			}else{
				$('#oc_item_compra___'+seq).addClass('task-p-105 task-f-105');
				$('#ped_item_compra___'+seq).addClass('task-p-160 task-f-160');
				$('#dat_prev_item_compra___'+seq).addClass('task-p-160 task-f-160');
				$('#dat_conf_item_compra___'+seq).addClass('task-p-176 task-f-176');			
			}
		});
	}
	
	console.log('Start valida...');
	var retorno = true;
	var idAbaAtual = ""; 
	console.log('Start valida... 1', numState, nextState);
	if( nextState == '15' 
	 || nextState == '10' 
     || nextState == '189' ){
		/*console.log('abasTask.....' );
		if( $('#tipo_processo').val() == 'F' ){
			var ret = valida('.vld-cmd-f', '.'+abas[ abasTask[i] ].ferramenta );
			retorno = retorno && ret;
		}else{
			var ret = valida('.vld-cmd-p', '.'+abas[ abasTask[i] ].produto )
			retorno = retorno && ret;
		}*/
	}else{	
		console.log('Start valida... 1 else');
		if( numState == "0" || numState == "4" || numState == "7" ){
			var ret = valida('.vld-p', '.tipo_solicitacao');
			retorno = retorno && ret;
			console.log('ENTROU AQUI 1');
		}
		console.log('abasTask.....',abasTask);
		for( var x = 0; x < abasTask.length; x ++ ){
			console.log('abasTask.....', abas[ abasTask[i] ].produto );
			if( $('#tipo_processo').val() == 'F' ){
				var ret = valida('.vld-f', '.'+abas[ abasTask[i] ].ferramenta );
				retorno = retorno && ret;
				ret = valida('.task-f-'+numState, '.'+abas[ abasTask[i] ].ferramenta );
				retorno = retorno && ret;
				idAbaAtual = abas[ abasTask[i] ].ferramenta;
				console.log('ENTREI EM FERRAMENTAS');
			}else{
				var ret = valida('.vld-p', '.'+abas[ abasTask[i] ].produto )
				retorno = retorno && ret;
				ret = valida('.task-p-'+numState, '.'+abas[ abasTask[i] ].produto );
				retorno = retorno && ret;
				idAbaAtual = abas[ abasTask[i] ].produto;
				console.log('NAO ENTREI EM FERRAMENTAS');
			}
		}
		console.log('Start valida... 2');
//		if( numState ){	
//		}
		console.log('REPORVA.....', idAbaAtual, nextState  ); 
		if( idAbaAtual == 'custo_4' ){
			var qtd = 0;
			$( "select[name^=cst_aprovacao___]" ).each(function( index ) {
				if( $(this).val() == "R" ){
					qtd += 1;
				}
			});
			console.log('qtd.....', qtd  );
			if( qtd > 0 && nextState == 97 ){
				alert( 'Existem Itens reprovados, favor devolver para atividade anterior!' );
				return false;
			}
		}
		console.log('Start valida... 3');
		if( idAbaAtual == 'controller_2' ){
			nextState == 101
			var qtd = 0;
			$( "select[name^=cont_aprovacao___]" ).each(function( index ) {
				if( $(this).val() == "R" ){
					qtd += 1;
				}
			});
			console.log('qtd.....', qtd  );
			if( qtd > 0 && nextState == 101 ){
				alert( 'Existem Itens reprovados, favor devolver para atividade anterior!' );
				return false;
			}
		}
		console.log('Start valida... 4');
		var qtd = 0;
		$( ".dun14" ).each(function( index ) {
			if( $(this).val() != "" && $(this).val().length != 14 ){
				qtd += 1;
			}
		});
		if( qtd > 0 ){
			alert( 'Existem campos DUN14 com menos de 14 caracteres!' );
			return false;
		}
		console.log('Start valida... 5');
		var qtd = 0;
		$( ".ean13" ).each(function( index ) {
			if( $(this).val() != "" && $(this).val().length != 13 ){
				qtd += 1;
			}
		});
		if( qtd > 0 ){
			alert( 'Existem campos EAN13 com menos de 13 caracteres!' );
			return false;
		}
		console.log('Start valida... 6');
	}
	console.log('retorno ',retorno);
	if( !retorno ){
		alert( 'Existem campos obrigatórios vazios e/ou campos números com valor zerado. Favor verificar!' );
	}
	//return false;
	
	if(	$("#nome_produto").val() != "" ){
		$('#titulo').val( $("#nome_produto").val() );
		$("#den_item").val( $("#nome_produto").val() );
	}else if( $("#den_item").val() != "" ){
		$('#titulo').val( $("#den_item").val() );
	}
	
	  var constraints = new Array();
	  constraints.push(DatasetFactory.createConstraint("cod_usuario", $('#WKUser').val(), $('#WKUser').val(), ConstraintType.MUST));
	  constraints.push(DatasetFactory.createConstraint("processo_pai", $('#processo').val(), $('#processo').val(), ConstraintType.MUST));
	  constraints.push(DatasetFactory.createConstraint("num_task", $('#task').val(), $('#task').val(), ConstraintType.MUST));
	  var dataSet = DatasetFactory.getDataset("dsk_apontamentos", null, constraints, null);
	  
	  if( dataSet.values.length == 0 && [0,4].indexOf( numState ) == -1 ){
		  alert( 'Você deve registrar ao menos um apontamento para a atividade!' );
		  retorno = false;
	  }
	
	return retorno;
}
//vld-p-4 4

