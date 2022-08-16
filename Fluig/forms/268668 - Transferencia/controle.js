function loadBody(){
	//FLUIGC.calendar('#data_entrega');
	console.log('Appen........');
	trataCompons();
	setMask();
	if( $('#cod_fornecedor').val() != ""  ){
		$('#empresa option:not(:selected)').prop('disabled', true);
	}
	console.log('Oppen 2........');
	loadDsCombo('motivo_remessa', 'selectTable', 'cod_motivo_remessa', 'den_motivo_remessa', 'dataBase,table,cod_empresa', 'java:/jdbc/LogixDS,motivo_remessa,'+$('#empresa').val(), 'cod_motivo_remessa' );
	loadDsPFCombo('cod_local','empresa_terc','locais','cod_local','den_local','empresa',$('#empresa').val(),'den_local');
	loadDsCombo('cond_pagto_cap', 'selectTable', 'cnd_pgto', 'des_cnd_pgto', 'dataBase,table', 'java:/jdbc/LogixDS,cond_pgto_cap', 'cnd_pgto' );
	console.log('Oppen b........');
	loadDsCombo('tipo_venda_transf', 'tipo_venda', 'COD_TIP_VENDA', 'DEN_TIP_VENDA', '', '', 'COD_TIP_VENDA' );	
	loadDsCombo('nat_oper_transf', 'natureza_operacao', 'COD_NAT_OPER', 'DEN_NAT_OPER', '', '', 'COD_NAT_OPER' );
	loadDsCombo('cond_pagto_transf', 'condicao_pagamento_vdp', 'COD_CND_PGTO', 'DEN_CND_PGTO', '', '', 'COD_CND_PGTO' );
	loadDsCombo('carteira_transf', 'carteira', 'COD_TIP_CARTEIRA', 'DEN_TIP_CARTEIRA', '', '', 'COD_TIP_CARTEIRA' );
	loadDsCombo('lista_preco_transf', 'lista_de_preco', 'NUM_LIST_PRECO', 'DEN_LIST_PRECO', 'cod_empresa', ''+$('#cod_empresa').val(), 'NUM_LIST_PRECO' );

}

function setMask(){
	$('.decimal-6').maskMoney({precision : 6,thousands : '.',decimal : ',',defaultZero : true,allowZero : true});
	$('.decimal-5').maskMoney({precision : 5,thousands : '.',decimal : ',',defaultZero : true,allowZero : true});
	$('.decimal-4').maskMoney({precision : 4,thousands : '.',decimal : ',',defaultZero : true,allowZero : true});
	$('.decimal-3').maskMoney({precision : 3,thousands : '.',decimal : ',',defaultZero : true,allowZero : true});
	$('.decimal-2').maskMoney({precision : 2,thousands : '.',decimal : ',',defaultZero : true,allowZero : true});
	$('.decimal-1').maskMoney({precision : 1,thousands : '.',decimal : ',',defaultZero : true,allowZero : true});
	$('.decimal-0').maskMoney({precision : 0,thousands : '.',decimal : ',',defaultZero : true,allowZero : true});
	$('.integer-0').maskMoney({precision : 0,thousands : '',decimal : '',defaultZero : true,allowZero : true});
	FLUIGC.calendar('.dataFluig');
	FLUIGC.calendar('.data-fluig');
}


var beforeSendValidate = function(numState, nextState) {

	var item_qtd_zero = "";
	var item_custo_zero = "";
	
	var qtd_item = 0;
	$( "input[name*=cod_item___]" ).each(function( index ) {
		qtd_item += 1;
		
		$('#qtd_envio___'+seq).css({'background-color' : '#FFFFFF'});
		$('#custo___'+seq).css({'background-color' : '#FFFFFF'});
		
		var seq = $(this).attr('name').split('___')[1];
		var qtd = parseFloat( $('#qtd_envio___'+seq).val().replace('.','').replace(',','.') );
		var custo = parseFloat( $('#custo___'+seq).val().replace('.','').replace(',','.') );
		
		if( qtd == 0 ){
			item_qtd_zero += $('#cod_item___'+seq).val()+" ";
			$('#qtd_envio___'+seq).css({'background-color' : '#FFE4C4'});
		}
		if( custo == 0 ){
			item_custo_zero += $('#cod_item___'+seq).val()+" ";
			$('#custo___'+seq).css({'background-color' : '#FFE4C4'});
		}
		
	});

	if( qtd_item == 0 ){
		alert('Não foram informados itens.');
		return false;
	}
	if( item_qtd_zero != "" ){
		alert('Existem itens com quantidade zero. '+item_qtd_zero);
		return false;
	}
	if( item_custo_zero != "" ){
		alert('Existem itens com custo zero.'+item_custo_zero);
		return false;
	}
	
	
	if( !valida( '.pedido' ) ){
		alert('Existem campos não informados. ');
		return false;
	}
		
	return true;
	
}

function validaPreco(){
	
/*	select pre_unit
	  from desc_preco_item
	 where cod_empresa = '03'
	   and cod_item = '4300-COS1'
	   and num_list_preco = '801'
*/	
}

function setEmpresa(){
	
	console.log('Entrou set empresa......');
	
	var constraints = new Array();		
	constraints.push( DatasetFactory.createConstraint('empresa', $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST) );
	var fields = new Array();
	var order = new Array();
	var ds = DatasetFactory.getDataset("empresa_terc", fields, constraints, order);

	if( ds.values.length > 0 ){
	
		console.log('Entrou set empresa values......');

		$('#email_emp').val( ds.values[0]['email'] );
		$('#nat_oper').val( ds.values[0]['nat_oper'] ); 
		$('#cond_pagto').val( ds.values[0]['cond_pagto'] );
		$('#carteira').val( ds.values[0]['carteira'] );
		$('#tipo_venda').val( ds.values[0]['tipo_venda'] );
		$('#lista_preco').val( ds.values[0]['lista_preco'] );
		$('#finalidade').val( ds.values[0]['finalidade'] );
		$('#tipo_entrega').val( ds.values[0]['tipo_entrega'] );
		loadDsCombo('motivo_remessa', 'selectTable', 'cod_motivo_remessa', 'den_motivo_remessa', 'dataBase,table,cod_empresa', 'java:/jdbc/LogixDS,motivo_remessa,'+$('#empresa').val(), 'cod_motivo_remessa' );
		$('#motivo_remessa').val( ds.values[0]['motivo_remessa'] );
		$('#tipo_frete').val( ds.values[0]['tipo_frete'] );
		$('#cnpj_transportador').val( ds.values[0]['cnpj_fornecedor'] );
		$('#cod_transportador').val( ds.values[0]['cod_fornecedor'] );
		$('#transportador').val( ds.values[0]['fornecedor'] );
		$('#cond_pagto_cap').val( ds.values[0]['cond_pagto_cap'] );
		
		$('#cod_aen').val( ds.values[0]['cod_aen'] );

	}
	
	loadDsPFCombo('cod_local','empresa_terc','locais','cod_local','den_local','empresa',$('#empresa').val(),'den_local');
	
}

function fnCustomDelete( oElement ){
	fnWdkRemoveChild(oElement);
	atualizaComponentes();	
}

function trataCompons(){
	$( "input[name*=ies_item_altern___]" ).each(function( index ) {
		var seq = $(this).attr('name').split('___')[1];
		if( $('#ies_item_altern___'+seq ).val() != 'S' ){ 
			$('#btAddAlter___'+seq).parent().hide();
			if ( $('#ies_item_altern___'+seq ).val() == 'A' ){
				$('#btDelAlter___'+seq).parent().show();
			}else{
				$('#btDelAlter___'+seq).parent().hide();	
			}
		}else{
			$('#btAddAlter___'+seq).parent().show();
			$('#btDelAlter___'+seq).parent().hide();
		}
	});
}