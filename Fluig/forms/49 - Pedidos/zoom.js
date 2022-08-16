function msgDebug( msg ){
	if ( false ){
		alert( msg );
	}
}

function setSelectedIndex(s, i){

	s.options[i-1].selected = true;

	return;

}


  function func_teste(){
	  //return false;
				var consAcesso = new Array();
				consAcesso.push( DatasetFactory.createConstraint( 'cod_user', 'admin', 'admin', ConstraintType.MUST) );
				var orderAcesso = new Array();
				var datasetAcesso = DatasetFactory.getDataset( 'clientes_logix', null, consAcesso, orderAcesso);
				alert( 'busca teste', datasetAcesso );
				alert( 'antes' );
				qtd = 0;
				clientes = "";
				if ( datasetAcesso != null ){
					for (var x = 0; x < datasetAcesso.values.length; x++) {
						//alert( datasetAcesso.values[x].COD_CLIENTE );
						clientes += " "+datasetAcesso.values[x].COD_CLIENTE;
						qtd += 1;
						console.log( datasetAcesso );
					}
				}
				alert( 'Clientes '+qtd+' '+clientes );
		}

			function zoomButton(componente) {
			
				console.log('Busca Pedido....',componente );
				
				if ( componente == 'btEndereco' ){
					
					modalzoom.open("Endereco de Entrega",
								   "endereco_entrega", 
								   "sequencia,Seq.,end_entrega_compl,Endereco", 
								   "cliente,tip_endereco,sequencia,tip_logradouro,logradouro,num_iden_lograd,complemento_endereco,bairro_cobr_entga,cod_cidade,den_cidade,cod_uni_feder,den_uni_feder,cod_pais,den_pais,cod_cep,num_cgc,ins_estadual,end_entrega_compl", 
								   "cliente,"+$('#cod_cliente').val()+",cod_uni_feder,"+$('#estado_ent').val(),
								   componente, 'list', 'default', null, null,
								   "end_entrega_compl" );
				}
				
				if ( componente == 'btCliente' ){
					
					console.log('Busca Clientes....',componente );

					if ($('#tipoCadUser').val() == "R" ) {
						modalzoom.open("Clientes",
									   "clientes_logix", 
									   "cod_cliente,Cod. Cliente,nom_cliente,Nome,cnpj,CNPJ,den_cidade,Cidade,cod_uni_feder,UF", 
									   "cod_cliente,nom_cliente,cnpj,cod_repres,cod_user,den_cidade,cod_uni_feder", 
									   "cod_user,"+$('#userFluig').val(),
									   componente, false, "default", null, null,
									   "cod_cliente||'-'||nom_cliente||'-'||cnpj||'-'||den_cidade||'-'||cod_uni_feder" );	
					} else {
						if ($('#tipoCadUser').val() == "A" ) {
							modalzoom.open("Clientes",
									   "clientes_logix", 
									   "cod_cliente,Cod. Cliente,nom_cliente,Nome,cnpj,CNPJ,den_cidade,Cidade,cod_uni_feder,UF", 
									   "cod_cliente,nom_cliente,cnpj,cod_repres,cod_user,den_cidade,cod_uni_feder", 
									   "",
									   componente, false, "default", null, null,
									   "cod_cliente||'-'||nom_cliente||'-'||cnpj||'-'||den_cidade||'-'||cod_uni_feder" );	
						} else {
							modalzoom.open("Clientes",
									   "clientes_logix", 
									   "cod_cliente,Cod. Cliente,nom_cliente,Nome,cnpj,CNPJ,den_cidade,Cidade,cod_uni_feder,UF", 
									   "cod_cliente,nom_cliente,cnpj,cod_repres,cod_user,den_cidade,cod_uni_feder", 
									   "cod_user,"+$('#userFluig').val(),
									   componente, false, "default", null, null,
									   "cod_cliente||'-'||nom_cliente||'-'||cnpj||'-'||den_cidade||'-'||cod_uni_feder" );	
						}
					}
				}
				
				if ( componente == 'btPedido' ){

					if ($('#tipoCadUser').val() == "A" ) {
						//inicio tipo de cadastro como A
						
						console.log('Busca Pedido....',componente );
						//btPedidoAlter
						var codRepres = "0";
						var codNat = "0";
						var cons = new Array();

						console.log('Antes Pai Filho....' );
						cons.push( DatasetFactory.createConstraint( 'MATRICULA', $('#userFluig').val(), $('#userFluig').val(), ConstraintType.MUST) );
						//cons.push( DatasetFactory.createConstraint( 'dataSet', 'representante_compl', 'representante_compl', ConstraintType.MUST) );
						//cons.push( DatasetFactory.createConstraint( 'table', 'nat_oper', 'nat_oper', ConstraintType.MUST) );
						var dataset = DatasetFactory.getDataset( 'natureza_operacao_repres', null, cons, null);
						console.log('Data set Repres....',dataset );
						if ( dataset != null ){
							for (var x = 0; x < dataset.values.length; x++) {
								console.log('Natureza....', dataset.values[x].cod_nat_oper );
								codNat += '|'+dataset.values[x].COD_NAT_OPER;
							}
						}
						
						var listaEsp = '';
						console.log('Antes Pai Filho....' );
						cons.push( DatasetFactory.createConstraint( 'dataSet', 'empresa_compl', 'empresa_compl', ConstraintType.MUST) );
						cons.push( DatasetFactory.createConstraint( 'table', 'lista_esp', 'lista_esp', ConstraintType.MUST) );
						var dataset = DatasetFactory.getDataset( 'paiFilho', null, cons, null);
						console.log('Data set Repres....',dataset );
						if ( dataset != null ){
							for (var x = 0; x < dataset.values.length; x++) {
								console.log('lista....', dataset.values[x].chave_lista_esp );
								if ( x > 0 ){
									listaEsp += '|';
								}
								listaEsp += dataset.values[x].chave_lista_esp;
							}
						}
												
						var cons = new Array();
						cons.push( DatasetFactory.createConstraint( 'matricula', $('#userFluig').val(), $('#userFluig').val(), ConstraintType.MUST, true) );
						var dataset = DatasetFactory.getDataset( 'representante_compl', null, null, null);
						console.log('Data set Repres....',dataset );
						if ( dataset != null ){
							for (var x = 0; x < dataset.values.length; x++) {
								codRepres += '|'+dataset.values[x].cod_repres ;
								console.log('Repres....',codRepres );
							}
						}

						console.log( 'natureza', codNat );

						modalzoom2.open("Pedidos",
									   "selectTable", 
								       "den_reduz,Emp,num_pedido,Pedido,dat_pedido,Data,nom_cliente,Cliente,val_pedido,Valor", 
								       "cod_empresa,den_reduz,cod_cliente,nom_cliente,nom_reduzido,num_pedido,dat_pedido,qtd_saldo,val_pedido,cod_repres,cod_nat_oper,tip_frete", 
								       "dataBase,java:/jdbc/LogixPRD,table,eis_v_fluig_ped_aberto,ies_alter_ped,S,sqlLimit,10,___in___cod_repres,"+codRepres+",___in___cod_nat_oper,"+codNat+",___not______in___empresa_lista,"+listaEsp,
								       componente, true, "default", null, null,
									   "den_reduz||'-'||num_pedido||'-'||dat_pedido||'-'||nom_reduzido||'-'||nom_cliente||'-'||cod_cliente" );	
						
						//fim tipo de cadastro como A
						
					} else {
					
						console.log('Busca Pedido....',componente );
						//btPedidoAlter
						var codRepres = "0";
						var codNat = "0";
						var cons = new Array();
	
						console.log('Antes Pai Filho....' );
						cons.push( DatasetFactory.createConstraint( 'MATRICULA', $('#userFluig').val(), $('#userFluig').val(), ConstraintType.MUST) );
						//cons.push( DatasetFactory.createConstraint( 'dataSet', 'representante_compl', 'representante_compl', ConstraintType.MUST) );
						//cons.push( DatasetFactory.createConstraint( 'table', 'nat_oper', 'nat_oper', ConstraintType.MUST) );
						var dataset = DatasetFactory.getDataset( 'natureza_operacao_repres', null, cons, null);
						console.log('Data set Repres....',dataset );
						if ( dataset != null ){
							for (var x = 0; x < dataset.values.length; x++) {
								console.log('Natureza....', dataset.values[x].cod_nat_oper );
								codNat += '|'+dataset.values[x].COD_NAT_OPER;
							}
						}
	
						var listaEsp = '';
						console.log('Antes Pai Filho....' );
						cons.push( DatasetFactory.createConstraint( 'dataSet', 'empresa_compl', 'empresa_compl', ConstraintType.MUST) );
						cons.push( DatasetFactory.createConstraint( 'table', 'lista_esp', 'lista_esp', ConstraintType.MUST) );
						var dataset = DatasetFactory.getDataset( 'paiFilho', null, cons, null);
						console.log('Data set Repres....',dataset );
						if ( dataset != null ){
							for (var x = 0; x < dataset.values.length; x++) {
								console.log('lista....', dataset.values[x].chave_lista_esp );
								if ( x > 0 ){
									listaEsp += '|';
								}
								listaEsp += dataset.values[x].chave_lista_esp;
							}
						}
						
						
						var cons = new Array();
						cons.push( DatasetFactory.createConstraint( 'matricula', $('#userFluig').val(), $('#userFluig').val(), ConstraintType.MUST, true) );
						var dataset = DatasetFactory.getDataset( 'representante_compl', null, cons, null);
						console.log('Data set Repres....',dataset );
						if ( dataset != null ){
							for (var x = 0; x < dataset.values.length; x++) {
								codRepres += '|'+dataset.values[x].cod_repres ;
								console.log('Repres....',codRepres );
							}
						}
	
						
	
						console.log( 'natureza', codNat );
	
						modalzoom2.open("Pedidos",
									   "selectTable", 
									   "den_reduz,Emp,num_pedido,Pedido,dat_pedido,Data,nom_cliente,Cliente,val_pedido,Valor", 
									   "cod_empresa,den_reduz,cod_cliente,nom_cliente,nom_reduzido,num_pedido,dat_pedido,qtd_saldo,val_pedido,cod_repres,cod_nat_oper,tip_frete", 
									   "dataBase,java:/jdbc/LogixPRD,table,eis_v_fluig_ped_aberto,ies_alter_ped,S,sqlLimit,10,___in___cod_repres,"+codRepres+",___in___cod_nat_oper,"+codNat+",___not______in___empresa_lista,"+listaEsp,
									   componente, true, "default", null, null,
									   "den_reduz||'-'||num_pedido||'-'||dat_pedido||'-'||nom_reduzido||'-'||nom_cliente||'-'||cod_cliente" );				
						}
					}
				}
			
			function setSelectedZoomItem(selectedItem) {              
				
				if( selectedItem.type == 'btCliente' ){
					console.log('Codigo do Cliente',selectedItem.cod_cliente);
					$('#cod_cliente').val( selectedItem.cod_cliente );
					var objDestino = { inputId:'razao_social', inputName:'razao_social', cod_cliente:selectedItem.cod_cliente, nom_cliente:selectedItem.nom_cliente.trim() };
					zoomDestino = window[$("#razao_social").attr('filter-instance')];
					zoomDestino.clear();
					//zoomDestino.add( objDestino );				
					zoomDestino.setValue( selectedItem.nom_cliente.trim() );				

					$('.tt-input').each(function () {
						$(this).css( 'width', $(this).width()-5 );
					});
					
					loadCliente( selectedItem.cod_cliente );
					loadRepresCompl( selectedItem.cod_repres, selectedItem.cod_cliente, $('#cod_moeda_cli').val(), 'TT' );
					loadRepres( selectedItem.cod_repres );
					if( confirm("Deseja carregar capa do pedido anterior?") ){					
						loadEspelhoUltPedido( selectedItem.cod_cliente );
					}

				}
				
				if( selectedItem.type == 'btPedido' ){
					loading.show();
					 console.log( 'BUSCA PEDIDO.....' );
					var constraints = new Array();
					constraints.push( DatasetFactory.createConstraint( 'cod_empresa', selectedItem.cod_empresa, selectedItem.cod_empresa, ConstraintType.MUST) );
					constraints.push( DatasetFactory.createConstraint( 'num_pedido', selectedItem.num_pedido, selectedItem.num_pedido, ConstraintType.MUST) );
					constraints.push( DatasetFactory.createConstraint( 'tipo', 'B', 'B', ConstraintType.MUST) );
			        //Busca o dataset
			        var dataset = DatasetFactory.getDataset( 'pedido_bloqueio', null, constraints, null);
			        iesDesbloq = false;
					if ( dataset != null ){
						for (var x = 0; x < dataset.values.length; x++) {
							var row = dataset.values[x];
							console.log( 'menssagem.....',row );
							if( row.code != '201' ){
								FLUIGC.toast({
									title: 'Valida&ccedil;&atilde;o: ',
									message: row.menssage,
									type: 'danger',
									timeout: 'slow'
								});
								return false;
							}else{
								iesDesbloq = true;
							}
						}
					}
					if (!iesDesbloq){
						FLUIGC.toast({
							title: 'Valida&ccedil;&atilde;o: ',
							message: 'N&atilde;o foi possivel desbloquear o pedido.',
							type: 'danger',
							timeout: 'slow'
						});
						return false;
					}
					
					$('#cod_cliente').val( selectedItem.cod_cliente );
					$('#num_pedido').val( selectedItem.num_pedido );
					var objDestino = { inputId:'razao_social', inputName:'razao_social', cod_cliente:selectedItem.cod_cliente, nom_cliente:selectedItem.nom_cliente.trim() };
					zoomDestino = window[$("#razao_social").attr('filter-instance')];
					zoomDestino.clear();
					//zoomDestino.add( objDestino );				
					zoomDestino.setValue( selectedItem.nom_cliente.trim() );				
					zoomDestino.disable(true);

					$('.tt-input').each(function () {
						$(this).css( 'width', $(this).width()-5 );
					});
					
					loadCliente( selectedItem.cod_cliente );
					loadRepresCompl( selectedItem.cod_repres, selectedItem.cod_cliente, $('#cod_moeda_cli').val(), 'TT' );
					loadRepres( selectedItem.cod_repres );
					
					loadPedido( selectedItem.cod_empresa, selectedItem.num_pedido, selectedItem );
					$('#btPedido').hide();
					$('#tipo_frete').val( selectedItem.tip_frete );
					loading.hide();
				}
				
				if ( selectedItem.inputName == "cidade_ent" ){
					$('#cod_cidade_ent').val( selectedItem.cod_cidade );
					$('#cep_ent').focus();
					loadBairro( selectedItem.cod_cidade, 'bairro_ent_sel' );
				}
				
				if ( selectedItem.type == 'btEndereco' ){

					console.log('Tipo....',selectedItem.tip_logradouro);
					$('#tipo_logradouro_ent').val( selectedItem.tip_logradouro );
					$('#endereco_ent').val( selectedItem.logradouro );
					$('#seq_end').val( selectedItem.sequencia );

					if ( $.isNumeric( selectedItem.num_iden_lograd ) )
						$('#sem_numero_ent').prop('checked', false);
					else
						$('#sem_numero_ent').prop('checked', true);
					setSemNumero( $('#sem_numero_ent').attr('id'), 'numero_ent' );
					
					
					if ( $.isNumeric( selectedItem.num_iden_lograd ) )
						$('#numero_ent').val( selectedItem.num_iden_lograd );
					
					
					$('#cod_cidade_ent').val( selectedItem.cod_cidade );
					$('#complemento_ent').val( selectedItem.complemento_endereco );
					
					console.log( selectedItem.complemento_endereco );
										
					var zoomDestino = {};
					
					//selectedItem.den_cidade
					
					console.log('cidade', 'xx'+loadCampoDataSet( 'cidades', 'cod_cidade', selectedItem.cod_cidade, 'DEN_CIDADE' ).trim()+'XX' );
					//var objDestino = { inputId:'cidade_ent', inputName:'cidade_ent', cod_cidade:selectedItem.cod_cidade, den_cidade:loadCampoDataSet( 'cidades', 'cod_cidade', selectedItem.cod_cidade, 'DEN_CIDADE' ).trim() };
					zoomDestino = window[$("#cidade_ent").attr('filter-instance')];
					zoomDestino.setValue( loadCampoDataSet( 'cidades', 'cod_cidade', selectedItem.cod_cidade, 'DEN_CIDADE' ).trim() );

					$('.tt-input').each(function () {
						$(this).css( 'width', $(this).width()-5 );
					});
					
					$('#cep_ent').val( selectedItem.cod_cep );
					
					loadBairro( selectedItem.cod_cidade , 'bairro_ent_sel' );					
					$('#bairro_ent_sel').val( selectedItem.bairro_cobr_entga );
					if ( $('#bairro_ent_sel').val() == undefined || $('#bairro_ent_sel').val() == null || $('#bairro_ent_sel').val() == '' ){
						$('#bairro_ent').val( selectedItem.bairro_cobr_entga );
						$("#ies_bairro_ent_manual").prop("checked", true);
					}
					alteraCampos( 'ies_bairro_ent_manual', 'bairro_ent_sel', 'bairro_ent' );
					
					$('#cnpj_ent').val( selectedItem.num_cgc.trim() );
					
					console.log( ' mascaras........',mascaraIE );
					console.log( ' 11........', mascaraIE[ $('#estado_ent').val( ) ] );
					
					var eiNum = '';
					if ( selectedItem.ins_estadual != null )
						eiNum = selectedItem.ins_estadual.replace(/[^0-9]/g,'');
					console.log( 'IE...'+eiNum+' '+selectedItem.ins_estadual );
					if (eiNum == ''){
						$('#isento_ie_ent').prop('checked', true);
						setIsento( 'isento_ie_ent', 'ie_ent', 'estado_ent' );
					}else{
						$('#isento_ie_ent').prop('checked', false);
						setIsento( 'isento_ie_ent', 'ie_ent', 'estado_ent' );
						$('#ie_ent').val( selectedItem.ins_estadual );
						if ( $('#estado_ent').val( ) != '' ){
							//setMaskIE( $('#estado_ent').val( ), 'ie_ent' )
							$('#ie_ent').mask( mascaraIE[ $('#estado_ent').val( ) ] );
						}
					}
					
				}
				console.log( 'ret zoom', selectedItem );
				console.log( 'ret zoom', selectedItem.inputName );
				if( selectedItem.inputName == 'den_item_edit' ){
					$('#cod_item_edit').val( selectedItem.cod_item );
					$('#um_edit').val( selectedItem.cod_unid_med );

					loadItem( $('#empresa').val(), selectedItem.cod_item, $('#lista_preco').val(), 'zoom' );
				}
				
				if( selectedItem.inputName == 'razao_social' ){
					console.log( ' razao_social 1 ');
					
					$('#cod_cliente').val( selectedItem.cod_cliente );
					loadCliente( selectedItem.cod_cliente );
					loadRepresCompl( $('#cod_repres').val(), selectedItem.cod_cliente, $('#cod_moeda_cli').val(), 'TT' );
					loadRepres( $('#cod_repres').val() );
					if( confirm("Deseja carregar capa do pedido anterior?") ){					
						loadEspelhoUltPedido( selectedItem.cod_cliente );
					}
					setListaPreco();
					setMoeda();
				}

				
				if( selectedItem.inputName == 'transportadora' ){
					$('#cod_trans').val( selectedItem.cod_cliente );
					$('#cnpj_trans').val( loadCampoDataSet( 'transportador_logix', 'cod_cliente', selectedItem.cod_cliente, 'CNPJ' )  );
				}				
				
			}

			function loadPedidoEdit( empresa, pedido ){ 
			
				var constraints = new Array();
				constraints.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/LogixPRD', null, ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint('table', 'eis_v_fluig_ped_aberto', null, ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint('cod_empresa', empresa, empresa, ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint('num_pedido', pedido, pedido, ConstraintType.MUST) );
	        
				var fields = new Array('cod_empresa','den_reduz','cod_cliente','nom_cliente','nom_reduzido','num_pedido','dat_pedido','qtd_saldo','val_pedido','cod_repres','cod_nat_oper','tip_frete');
				var order = new Array();
			
	        	var datasetReturned = DatasetFactory.getDataset("selectTable", fields, constraints, order);
	        
	        	if (datasetReturned != null && datasetReturned.values != null && datasetReturned.values.length > 0) {
	            	var selectedItem = datasetReturned.values[0];
	            	console.log( selectedItem );
	            	selectedItem.type = 'btPedido';
	            	setSelectedZoomItem(selectedItem);
	        	}
	        }
			
			function getPrecoListaItem( codEmpresa, numLista, codItem, codAen1, codAen2, codAen3, codAen4, codCliente, codUF, codCond, codGrupo, codAcabam ){
				
				console.log( 'entrou da busca',codEmpresa, numLista, codItem, codAen1, codAen2, codAen3, codAen4, codCliente, codUF, codCond, codGrupo, codAcabam );
			
				var result = {};
				result['PRE_UNIT'] = 0.00;
				result['PCT_DESC_ADIC'] = 0.00;
				
				var consAcesso = new Array();
				consAcesso.push( DatasetFactory.createConstraint( 'NUM_LIST_PRECO', numLista, numLista, ConstraintType.MUST) );
				var orderAcesso = new Array();
				orderAcesso.push( 'SEQUENCIA' );
				
				var datasetAcesso = DatasetFactory.getDataset( 'lista_de_preco_acesso', null, consAcesso, orderAcesso);

				console.log( 'busca acesso', datasetAcesso );
				
				msgDebug( 'Antes acesso...' );
				
				if ( datasetAcesso != null ){
					for (var x = 0; x < datasetAcesso.values.length; x++) {
						
						msgDebug( 'Entrou acesso...' );
						
						var acess =   parseInt( datasetAcesso.values[x]['SEQUENCIA'] );

						
						msgDebug( 'Acesso... '+acess );
						
						console.log( '		', x, acess );
						
						var constraints = new Array();
						constraints.push( DatasetFactory.createConstraint( 'cod_empresa', codEmpresa, codEmpresa, ConstraintType.MUST) );
						constraints.push( DatasetFactory.createConstraint( 'num_list_preco', numLista, numLista, ConstraintType.MUST) );
						
						//UF
						
						if ( [14,16,17,18,19,20].indexOf( acess ) > -1 ){
							constraints.push( DatasetFactory.createConstraint( 'cod_uni_feder', codUF, codUF, ConstraintType.MUST) );
						}else{
							constraints.push( DatasetFactory.createConstraint( 'cod_uni_feder', '#', '#', ConstraintType.MUST) );
						}
						//CLIENTE
						if ( [1,2,4,6,9,10,11,12,13].indexOf( acess ) > -1 ){
							constraints.push( DatasetFactory.createConstraint( 'cod_cliente', codCliente, codCliente, ConstraintType.MUST) );
						}else{
							constraints.push( DatasetFactory.createConstraint( 'cod_cliente', '#', '#', ConstraintType.MUST) );
						}
						
						// AEN N1
						if ( [9,10,11,12,16,17,18,19,21,22,23,24].indexOf( acess ) > -1 ){
							constraints.push( DatasetFactory.createConstraint( 'cod_lin_prod', codAen1, codAen1, ConstraintType.MUST) );
						}else{
							constraints.push( DatasetFactory.createConstraint( 'cod_lin_prod', '0', '0', ConstraintType.MUST) );
						}
						// AEN N2
						if ( [9,10,11,16,17,18,21,22,23].indexOf( acess ) > -1 ){
							constraints.push( DatasetFactory.createConstraint( 'cod_lin_recei', codAen2, codAen2, ConstraintType.MUST) );
						}else{
							constraints.push( DatasetFactory.createConstraint( 'cod_lin_recei', '0', '0', ConstraintType.MUST) );
						}
						// AEN N3
						if ( [9,10,16,17,21,22].indexOf( acess ) > -1 ){
							constraints.push( DatasetFactory.createConstraint( 'cod_seg_merc', codAen3, codAen3, ConstraintType.MUST) );
						}else{
							constraints.push( DatasetFactory.createConstraint( 'cod_seg_merc', '0', '0', ConstraintType.MUST) );
						}
						// AEN N4
						if ( [9,16,21].indexOf( acess ) > -1 ){
							constraints.push( DatasetFactory.createConstraint( 'cod_cla_uso', codAen4, codAen4, ConstraintType.MUST) );
						}else{
							constraints.push( DatasetFactory.createConstraint( 'cod_cla_uso', '0', '0', ConstraintType.MUST) );
						}
						
						// ITEM
						console.log('Anter o M',acess);
						if ( [1,2,5,6,8,14,15].indexOf( acess ) > -1 ){
							console.log('Entrei o M',codItem);
							constraints.push( DatasetFactory.createConstraint( 'cod_item', codItem, codItem, ConstraintType.MUST) );
						}else{
							constraints.push( DatasetFactory.createConstraint( 'cod_item', '#', '#', ConstraintType.MUST) );
						}
					/*						
						//GRUPO
						if ( [3,4,5,6,7,8].indexOf( acess ) > -1 ){
							constraints.push( DatasetFactory.createConstraint( 'cod_grupo', codGrupo, codGrupo, ConstraintType.MUST) );
						}else{
							constraints.push( DatasetFactory.createConstraint( 'cod_grupo', '0','0', ConstraintType.MUST) );
						}
						// Acabam
						if ( [3,4,5,6,7,8].indexOf( acess ) > -1 ){
							constraints.push( DatasetFactory.createConstraint( 'cod_acabam', codAcabam, codAcabam, ConstraintType.MUST) );
						}else{
							constraints.push( DatasetFactory.createConstraint( 'cod_acabam', '0', '0', ConstraintType.MUST) );
						}
						// Cond Pagamento
						if ( [2].indexOf( acess ) > -1 ){
							constraints.push( DatasetFactory.createConstraint( 'cod_cnd_pgto', codCond, codCond, ConstraintType.MUST) );
						}else{
							constraints.push( DatasetFactory.createConstraint( 'cod_cnd_pgto', '0', '0', ConstraintType.MUST) );
						}
					*/					
						console.log(  'Antes loop', constraints );
											
						msgDebug( 'Antes dataset preco ' );
						
						//Busca o dataset
						var dataset = DatasetFactory.getDataset( 'lista_de_preco_item_desc', null, constraints, null);
						console.log(  'Data SET', dataset );
						if ( dataset != null ){
							for (var i = 0; i < dataset.values.length; i++) {
								msgDebug( 'Entrei dataset preco ' );
								console.log( dataset );
								console.log(  'Valor SET',dataset.values[i] );
								var row = dataset.values[i];
								var val = {};
								val['PRE_UNIT'] = getFloat(  row[ 'PRE_UNIT' ], 0  );
								val['PCT_DESC_ADIC'] = getFloat(  row[ 'PCT_DESC_ADIC' ], 0 );
								msgDebug( 'Acgou preco '+row[ 'PRE_UNIT' ] );
								return val;
							}
						}
					}
				}
				return result;
			}

			
			function setMoeda(){
				
				if( setLista() ){
				
					var ct = new Array();
					ct.push( DatasetFactory.createConstraint("cod_moeda", $('#moeda').val(), $('#moeda').val(), ConstraintType.MUST) );
					ct.push( DatasetFactory.createConstraint("table", 'fluig_v_moeda_cotacao', null, ConstraintType.MUST) );
					var ds = DatasetFactory.getDataset('selectLogix', null, ct, null );
					
					if( ds != null ){
						$('#cotacao').val( ds.values[0]['VAL_COTACAO'].replace('.',',') );
					}
					
					if( $('#moeda').val() != '1' ){
						$('.lbl_moeda').show();
					}else{
						$('.lbl_moeda').hide();
					}
					
				}
				
			}
			
			var coditem = "";
			
			function setItem(id){
				coditem = $('#'+id).val();
			}

			function buscaItem( id ){

				if ( $('#'+id).val() == '' || coditem != $('#'+id).val() ){
					clearItem( 'cod_item_edit' );
					coditem = "";
				}
				console.log( 'NOVO.......'+id );
				console.log( 'NOVO.......'+$('#'+id).val() );
				console.log(  'Antes Item....', $('#lista_preco').val() );
				loadItem( $('#empresa').val(), $('#'+id).val(), $('#lista_preco').val(), 'field' );
				coditem = "";
				//$('#cod_item_zoom_edit').val( $('#'+id).val() );
			}			
			
			function loadBairro( cidade, campoBairro ){			
			    //Cria as constraints para buscar os campos filhos, passando o tablename, nÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂºmero da formulÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¡rio e versÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¬ÃÂÃÂÃÂÃÂ¡ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ£o
			    var c1 = DatasetFactory.createConstraint("cod_cidade", cidade, cidade, ConstraintType.MUST);
		        var constraints = new Array(c1);
				var order = new Array( 'DEN_BAIRRO' );			
		        //Busca o dataset
		        var dataset = DatasetFactory.getDataset('bairros', null, constraints, order);
				if ( dataset != null ){
					$("#"+campoBairro+" option").remove();
					$("#"+campoBairro).append("<option value='' ></option>");
					for (var x = 0; x < dataset.values.length; x++) {
						var row = dataset.values[x];
						$("#"+campoBairro).append("<option value='"+ row[ 'COD_BAIRRO' ] +"' >"+ row[ 'DEN_BAIRRO' ] +"</option>");
					}
				}
			}
			
			function loadCampoDataSet( denDataSet, campo, valor, campoRetorno ){
				console.log( 'inicio..... loadCampoDataSet');
			    var c1 = DatasetFactory.createConstraint( campo, valor, valor, ConstraintType.MUST);
			    console.log( 'loadCampoDataSet ', campo, valor, denDataSet );
		        var constraints = new Array(c1);
		        console.log( 'constrait ' );
		        //Busca o dataset
		        var dataset = DatasetFactory.getDataset( denDataSet, null, constraints, null);
		        console.log( 'dataset ' );
				if ( dataset != null ){
					console.log( 'dataset ' );
					for (var x = 0; x < dataset.values.length; x++) {
						console.log( 'loadCampoDataSet.... '+1);
						var row = dataset.values[x];
						return row[ campoRetorno ];
					}
				}
				return ' ';
				console.log( 'fim..... loadCampoDataSet');
			}
			
			function loadPaiFilhoCombo( combo, dataSet, table, idDocPai, versionDocPai, fieldCodigo, fieldDesc, fieldFlag, fildFilter, fildFilterValue ){
				
				console.log( combo, dataSet, table, idDocPai, versionDocPai, fieldCodigo, fieldDesc, fieldFlag, fildFilter, fildFilterValue );
				
				var constraintsFilhos = new Array();
				constraintsFilhos.push( DatasetFactory.createConstraint("tablename", table, table, ConstraintType.MUST) );
				constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", idDocPai, idDocPai, ConstraintType.MUST) );
				constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", versionDocPai, versionDocPai, ConstraintType.MUST) );
				constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
				if ( fildFilter != '' && fildFilter != null ){
					console.log( ' FILTRO ESP........ ',fildFilter, fildFilterValue );
					constraintsFilhos.push( DatasetFactory.createConstraint(fildFilter, fildFilterValue, fildFilterValue, ConstraintType.MUST) );
					console.log( ' FILTRO ESP........ ',constraintsFilhos );
				}	
				
				var orderFilhos = new Array();
				orderFilhos.push( fieldCodigo );						
				var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos );
				console.log('DataSet',datasetFilhos);
				if ( datasetFilhos != null ){
					var valDefault = "";
					console.log('ANTES TESTE VALOR DEFAULT.....',$("#"+combo).val());
					if ( $("#"+combo).val() != "" && $("#"+combo).val() != null ){
						valDefault = $("#"+combo).val();
						console.log('TEM VALOR DEFAULT Jah EXISTEMTE.....',valDefault);
					}
					$("#"+combo+" option").remove();
					var filhos = datasetFilhos.values;
					console.log('DataSet',datasetFilhos);
					console.log('DataSet',filhos);
					//$("#empresa").append("<option value='' ></option>");
					
					for ( var i in filhos ) {
						
						console.log('Linha DataSet.....',i);
						
						var filho = filhos[i];
						var den = '';

						console.log( filho[ fieldFlag ] );
						if (  valDefault == "" && filho[ fieldFlag ] ){
							valDefault = filho[ fieldCodigo ];
						}
						
						if ( $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) > -1 ){
							continue;
						} 
						
						if ( fieldDesc == '' ){
							den = filho[ fieldCodigo ];
						}else{
							den = filho[ fieldCodigo ]+' - '+filho[ fieldDesc ];
						}
						console.log("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
						$("#"+combo).append("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
						
					}
					console.log('antes de setar valor.....',valDefault, $("#"+combo).val() );
					$("#"+combo).val( valDefault );
					console.log('depois de setar valor.....',valDefault, $("#"+combo).val() );
				}
			}

			function getOptCombo( combo ){
				
				var optArray = new Array();
				$("#"+combo+" option").each(function () {
					optArray.push( $(this).val() );
				});
				return optArray;
			}
			
			function loadDataSetCombo( combo, dataSet, fieldCodigo, fieldDesc, fildFilter, fildFilterValue, fieldFlag, clear ){
				
				console.log( 'Passo 001' );
				
				var constraintsFilhos = new Array();
				var lstFilter = fildFilter.split(',');
				var lstFilterValue = fildFilterValue.split(',');
				for ( var j = 0; j < lstFilter.length; j ++ ){
					console.log( 'Passo 00X',lstFilter[j],lstFilterValue[j] );
					if ( lstFilter[j] != '' && lstFilter[j] != null ){
						constraintsFilhos.push( DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST) );
					}
				}
				var orderFilhos = new Array();
				orderFilhos.push( fieldCodigo );						
				var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos );
				if ( datasetFilhos != null ){

					var valDefault = "";
					console.log('ANTES TESTE VALOR DEFAULT.....',$("#"+combo).val());
					if ( $("#"+combo).val() != "" && $("#"+combo).val() != null && $("#"+combo).val() != undefined ){
						valDefault = $("#"+combo).val();
						console.log('TEM VALOR DEFAULT Jah EXISTEMTE.....',valDefault);
					}
					if( clear == 'S' ){
						$("#"+combo+" option").remove();
					}
					var filhos = datasetFilhos.values;
					console.log( 'Passo 002' );
					//$("#empresa").append("<option value='' ></option>");
					//var valDefault = '';
					for ( var i in filhos ) {
						var filho = filhos[i];
						console.log( 'Passo 002', filho[ fieldCodigo ] );
						var den = '';
						//if ( valDefault == '' ){
						//	valDefault = filho[ fieldCodigo ];
						//}
						console.log( filho[ fieldFlag ] );
						if (  valDefault == "" && ( filho[ fieldFlag ] || filho[ fieldFlag ] == 'on' ) ){
							valDefault = filho[ fieldCodigo ];
						}
						
						console.log( 'Passo 002 A',  $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) );
						if ( $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) > -1 ){
							continue;
						} 
						
						if ( fieldDesc == '' ){
							den = filho[ fieldCodigo ];
						}else{
							den = filho[ fieldCodigo ]+' - '+filho[ fieldDesc ];
						}
						$("#"+combo).append("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
						console.log( 'Apende 003',filho[ fieldCodigo ] );
					}
					console.log('valDefault.......',valDefault);
					if ( valDefault != '' ){
						$("#"+combo).val( valDefault );
					}
				}
				
			}			

/*			function loadDataSetCombo( combo, dataSet, fieldCodigo, fieldDesc, fildFilter, fildFilterValue ){
			
				console.log( 'Passo 001' );
				
				var constraintsFilhos = new Array();
				if ( fildFilter != '' && fildFilter != null ){
					constraintsFilhos.push( DatasetFactory.createConstraint(fildFilter, fildFilterValue, fildFilterValue, ConstraintType.MUST) );
				}
				var orderFilhos = new Array();
				orderFilhos.push( fieldCodigo );						
				var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos );
				if ( datasetFilhos != null ){
					
					var filhos = datasetFilhos.values;
					console.log( 'Passo 002' );
					//$("#empresa").append("<option value='' ></option>");
					var valDefault = '';
					for ( var i in filhos ) {
						var filho = filhos[i];
						console.log( 'Passo 002', filho[ fieldCodigo ] );
						var den = '';
						if ( valDefault == '' ){
							valDefault = filho[ fieldCodigo ];
						}
						console.log( 'Passo 002 A',  $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) );
						if ( $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) > -1 ){
							continue;
						} 
						
						if ( fieldDesc == '' ){
							den = filho[ fieldCodigo ];
						}else{
							den = filho[ fieldCodigo ]+' - '+filho[ fieldDesc ];
						}
						$("#"+combo).append("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
						console.log( 'Apende 003',filho[ fieldCodigo ] );
					}
					if ( valDefault != '' ){
						$("#"+combo).val( valDefault );
					}
				}
			}*/			
			

			function loadItem( codEmpresa, codItem, numLista, origem ){
				
				if ( $('#cod_item_zoom_edit').val() == $('#cod_item_edit').val() ){
					return false;
				}else{
					$('#cod_item_zoom_edit').val( $('#cod_item_edit').val() );
				}
				
				// We can show the message of loading
				console.log("t Antes do load..... ",codEmpresa,codItem,numLista);

				var constraints = new Array();
				constraints.push( DatasetFactory.createConstraint("cod_empresa", codEmpresa, codEmpresa, ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint("cod_item", codItem, codItem, ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint("num_list_preco", numLista, numLista, ConstraintType.MUST) );
								
				var dataset = DatasetFactory.getDataset('lista_de_preco_item', null, constraints, null);
				
				console.log("load..... "+dataset);
				
				if ( dataset != null && dataset.values.length > 0 ){
					for (var x = 0; x < dataset.values.length; x++) {						
					
						var row = dataset.values[x];

						console.log("linha..... "+row);
												
						if( origem == 'field'){
							//var objDestino = { inputId:'den_item_edit', inputName:'den_item_edit', cod_item:row.COD_ITEM, den_item:row.DEN_ITEM };
							zoomDestino = window[$("#den_item_edit").attr('filter-instance')];
							zoomDestino.setValue( row.DEN_ITEM );														
						}
						
						$('#peso_edit').val( String( row.PES_UNIT.toFixed(3) ).replace('.',',') );
						console.log('cubagem ',row.CUBAGEM);
						$('#cubagem_edit').val( String( row.CUBAGEM.toFixed(6)).replace('.',',') );
						$('#qtd_pad_edit').val( row.QTD_PADR_EMBAL );
						
						$('#cod_lin_prod_edit').val( row.COD_LIN_PROD );
						$('#cod_lin_recei_edit').val( row.COD_LIN_RECEI );
						$('#cod_seg_merc_edit').val( row.COD_SEG_MERC );
						$('#cod_cla_uso_edit').val( row.COD_CLA_USO );
						$('#cod_grupo_item_edit').val( row.COD_GRUPO_ITEM );
						$('#cod_tip_carteira_edit').val( row.COD_TIP_CARTEIRA );					
						$('#den_item_reduz_edit').val( row.DEN_ITEM_REDUZ );						
						$('#ies_mix_edit').val( row.MIX_PRODUTO );
						
						$('#um_edit').val( row.COD_UNID_MED );
						var preco = getPrecoListaItem( codEmpresa, numLista, codItem, row.COD_LIN_PROD, row.COD_LIN_RECEI, row.COD_SEG_MERC, row.COD_CLA_USO, $('#cod_cliente').val(), $('#estado_ent').val(), $('#cond_pagamento').val(), row.COD_GRUPO_ITEM, row.COD_TIP_CARTEIRA );
						msgDebug( 'Retorno do preco'+preco['PRE_UNIT'] );
						
						$('#valor_unit_edit').val( String( preco['PRE_UNIT'].toFixed(3) ).replace('.',',') );
						msgDebug( 'Preco 1' );
						$('#valor_unit_lista_edit').val( String( preco['PRE_UNIT'].toFixed(3) ).replace('.',',') );
						msgDebug( 'Preco 2' );
						$('#pct_desc_adic_edit').val( String( preco['PCT_DESC_ADIC'].toFixed(3) ).replace('.',',') );
						msgDebug( 'Preco 3' );
						$('#data_entrega_edit').val(  $('#data_coleta').val() );
						msgDebug( 'Preco 4' );
						$('#pedido_cli_edit').val(  $('#ped_cliente').val() );
						msgDebug( 'Preco 5' );
						//$('#quantidade_edit').focus();
						msgDebug( 'Teste do preco'+preco['PRE_UNIT'] );
						if( preco['PRE_UNIT'] == 0 ){
							FLUIGC.toast({
								title: 'Preco: ',
								message: 'Valor para item nao localizado na tabela de precos.',
								type: 'danger',
								timeout: 'slow'
							});
							setTimeout("$('#valor_unit_edit').focus();",1);
						}else{
							setTimeout("$('#quantidade_edit').focus();",1);
						}
						
					}
				}else{
					FLUIGC.toast({
								title: 'Busca: ',
								message: 'Item n&atilde;o localizado!',
								type: 'warning',
								timeout: 'fast'
						});
					//$('#cod_item').focus();
					setTimeout("$('#cod_item_edit').focus();",1);
				}
			}
			
			function loadCliente( codCliente ){
				
				// We can show the message of loading
				console.log("t Antes do load..... "+codCliente);
				loadingPrincipial.show();

				var constraints = new Array();
				constraints.push( DatasetFactory.createConstraint("cod_cliente", codCliente, codCliente, ConstraintType.MUST) );
				var dataset = DatasetFactory.getDataset('clientes_logix', null, constraints, null);
				if ( dataset != null ){
					for (var x = 0; x < dataset.values.length; x++) {						
						var row = dataset.values[x];
						console.log('Console.....',row);
						$('#cnpj').val( row.CNPJ.trim() );
						$('#cod_repres').val( row.COD_REPRES );
						$('#raz_social').val( row.RAZ_SOCIAL );
						
						$('#pais_ent').val( loadCampoDataSet( 'paises', 'cod_pais', row.COD_PAIS, 'DEN_PAIS' ) );
						$('#cod_pais_ent').val( row.COD_PAIS );
						$('#estado_ent').val( row.COD_UNI_FEDER );
		
						$('#cod_class').val( row.COD_CLASS ); 
						$('#ins_estadual').val( row.INS_ESTADUAL.trim() );
						$('#eh_contribuinte').val( row.EH_CONTRIBUINTE );
						$('#cod_tip_carteira_cli').val( row.COD_TIP_CARTEIRA );
						
						$('#pct_desc_financ').val( ( row.PCT_DESC_FIN ).replace('.',',')  );
						
						$('#cod_moeda_cli').val( row.MOEDA );
						$('#cod_tip_cli').val( row.COD_TIP_CLI );
						$('#cei').val( row.CEI );
						$('#ies_inf_pedido').val( row.IES_INF_PEDIDO );
						$('#cli_exc_mix').val(row.CLI_EXC_MIX);
						$('#ies_tip_fornec').val(row.IES_TIP_FORNEC);
						
						if (row.DATA_ULTIMO_FATURAMENTO != null && row.DATA_ULTIMO_FATURAMENTO != '') {
							$('#data_ultimo_faturamento').val(row.DATA_ULTIMO_FATURAMENTO.substring(0,10).split("-").reverse().join("/"));
							$('#dias_ult_fat').val(row.DIAS_ULT_FAT);
						} else {
							$('#data_ultimo_faturamento').val('01/01/1999');
							$('#dias_ult_fat').val('365');
						}
						
						if (parseFloat($('#dias_ult_fat').val())>180) {
							$('#data_ultimo_faturamento').css({
								'background-color' : '#FF6347'
							});
						} else {
							$('#data_ultimo_faturamento').css({
								'background-color' : '#eee'
							});
						}
						
						
						var tipo_entrega = row.TIPO_ENTREGA;
						$('#tipo_entrega_hd').val(tipo_entrega);
						if (tipo_entrega != null && tipo_entrega != '' && tipo_entrega != '0') {
							console.log('tipo_entrega ',tipo_entrega);
							//$('#tipo_entrega').val(tipo_entrega);
							setSelectedIndex(document.getElementById("tipo_entrega"),parseInt(tipo_entrega));
							
						}
											
						
						reloadZoomFilterValues("cidade_ent", "cod_uni_feder,"+row.COD_UNI_FEDER );
					}
				}
				
			}
			

			function loadRepres( cod_repres ){

				return true;

			}
				
			function loadRepresCompl( codRepres, codCliente, codMoeda, info ){
				
				//alert(' codRepres '+codRepres );
				
				if( codRepres == "" || codRepres == null ){
					return false;
				}
				
				qtd += 1;
				console.log( 'QUANTIDADE...........', qtd );
				console.log( 'LOAD REPRESENTANTE.........', codRepres, codCliente, codMoeda, info);
				//CARGA DADOS
				var constraintsPai = new Array( DatasetFactory.createConstraint("cod_repres", codRepres, codRepres, ConstraintType.MUST) );
				//var constraintsPai = new Array( DatasetFactory.createConstraint("metadata#active", 1, 1, ConstraintType.MUST) );
				var datasetPai = DatasetFactory.getDataset('representante_compl', null, constraintsPai, null);
				console.log( 'PAI FILHO '+$('#cod_repres').val() );
				console.log( 'DATA SET PAI ', datasetPai );
				if ( info == 'TT' && ( datasetPai == null || datasetPai == undefined || datasetPai.values.length == 0 ) ){
					FLUIGC.toast({
						title: 'Representante: ',
						message: 'Representante nao cadastrado no Fluig: '+codRepres,
						type: 'danger',
						timeout: 'slow'
					});
					return false;
				}			
				if ( datasetPai != null ){
					console.log( 'Pai Filho ', datasetPai.values.length );
					for (var x = 0; x < datasetPai.values.length; x++) {
						var pai = datasetPai.values[x];
						console.log( 'LINHA................',x,pai);
						console.log( 'INFO ', info );
						if ( info == 'EMP' || info == 'TT' ){
							//Carga Empresa
							//$("#empresa option").remove();
							//loadPaiFilhoCombo( 'empresa', 'representante_compl', 'empresa', pai.documentid, pai.version, 'cod_empresa', 'emp_reduz', 'ies_empresa_default', null, null );
							loadDataSetCombo( 'empresa', 'empresa_repres', 'COD_EMPRESA', 'DEN_REDUZ', 'cod_repres', codRepres, 'IES_EMPRESA_DEFAULT', 'S' );
						}
						atualizaEmpresa();
						if ( info == 'TV' || info == 'TT' ){
							//Tipo de Venda
							if ($('#tipoCadUser').val() == "R" ) {
								//carrega o tipo de vendas do representante quando o tipo do cadastro for R - Representante
								loadDataSetCombo( 'tipo_venda', 'tipo_venda_repres', 'COD_TIP_VENDA', 'DEN_TIP_VENDA', 'cod_repres', codRepres, 'IES_TIPO_VENDA_DEFAULT', 'S' );
							} else {
								if ($('#tipoCadUser').val() == "A" ){
									//quando o tipo de cadastro for A - administrativo de vendas carrega o tipo de vendas liberado para o usuário logado e não o do representante
									//recupera qual o código de representante do usuário logado
									var cons = new Array();
									var userFluig = $('#userFluig').val();
									cons.push( DatasetFactory.createConstraint( 'matricula', userFluig, userFluig, ConstraintType.MUST,true) );
									//var constraintsPai = new Array( DatasetFactory.createConstraint("metadata#active", 1, 1, ConstraintType.MUST) );
									console.log('USUARIO ', userFluig);
									var datasetPai = DatasetFactory.getDataset('representante_compl', null, cons, null);	
									if ( datasetPai != null && datasetPai != undefined ){
										//var selectedItem = datasetPai.values[0];
						            	//console.log( selectedItem );
										console.log('REPRESENTANTE ', datasetPai.values[0].cod_repres);
										var cod_repres_user = datasetPai.values[0].cod_repres;
										loadDataSetCombo( 'tipo_venda', 'tipo_venda_repres', 'COD_TIP_VENDA', 'DEN_TIP_VENDA', 'cod_repres', cod_repres_user, 'IES_TIPO_VENDA_DEFAULT', 'S' );
									} 
								} else {
									//se não for nem R nem A carrega com os dados do representante do cliente selecionado
									loadDataSetCombo( 'tipo_venda', 'tipo_venda_repres', 'COD_TIP_VENDA', 'DEN_TIP_VENDA', 'cod_repres', codRepres, 'IES_TIPO_VENDA_DEFAULT', 'S' );
								}								
							}
						}
						if ( info == 'CP' || info == 'TT' ){
							//condicao de pagamento
							loadDataSetCombo( 'cond_pagamento', 'condicao_pagamento_vdp_repres', 'COD_CND_PGTO', 'DEN_CND_PGTO', 'cod_repres', codRepres, 'IES_COND_PAGTO_DEFAULT', 'S' );
							if( codCliente.trim() != "" ){
								loadDataSetCombo( 'cond_pagamento', 'condicao_pagamento_cliente', 'COD_CND_PGTO', 'DEN_CND_PGTO', 'cod_cliente', codCliente, '', 'N' );
							}
							setCondPagto();
						}
						if ( info == 'NT' || info == 'TT' ){
							//Natura de Operacao
							//$("#nat_operacao option").remove();	
							//loadPaiFilhoCombo( 'nat_operacao', 'representante_compl', 'nat_oper', pai.documentid, pai.version, 'cod_nat_oper', 'den_nat_oper', 'ies_nat_oper_default', null, null );
							loadDataSetCombo( 'nat_operacao', 'natureza_operacao_repres', 'COD_NAT_OPER', 'DEN_NAT_OPER', 'cod_repres', codRepres, 'IES_NAT_OPER_DEFAULT', 'S' );
							setNatOper();						
						}
						if ( info == 'MD' || info == 'TT' ){
							//Moeda
							//loadPaiFilhoCombo( 'moeda', 'representante_compl', 'moeda', pai.documentid, pai.version, 'cod_moeda', 'den_moeda', 'ies_moeda_default', null, null );
							loadDataSetCombo( 'moeda', 'moeda_repres', 'COD_MOEDA', 'DEN_MOEDA', 'cod_repres', codRepres, 'IES_MOEDA_DEFAULT', 'S' );
							console.log('codMoeda..... #'+codMoeda+'#');
							if( codMoeda.trim() != '' && codMoeda != '  ' && codMoeda != null && codMoeda != undefined ){
								console.log('Entrei Moeda..... ');
								if ( $.inArray(  codMoeda, getOptCombo( 'moeda' ) ) == -1 ){
									console.log('Entrei IF Moeda..... ');
									$("#moeda").append("<option value='"+ codMoeda +"' >"+ codMoeda +" - "+ loadCampoDataSet( 'moeda', 'cod_moeda', codMoeda, 'DEN_MOEDA_ABREV' ) +"</option>");
								}
								$("#moeda").val( codMoeda );
							}
						}
						if ( info == 'TF' || info == 'TT' ){
							//Tipo Frete
							//$("#tipo_frete option").remove();
							//loadPaiFilhoCombo( 'tipo_frete', 'representante_compl', 'tipo_frete', pai.documentid, pai.version, 'cod_tipo_frete', '', 'ies_tipo_frete_default', null, null );
							loadDataSetCombo( 'tipo_frete', 'tipo_frete_repres', 'COD_TIPO_FRETE', '', 'cod_repres', codRepres, 'IES_TIPO_FRETE_DEFAULT', 'S' );
							setTimeout("setTipoFrete();",3000);
							//setTipoFrete();
						}
						
						//começa a consulta das listas de preco
							if ( info == 'LT' || info == 'TT' ){
								
								var valAtual = $("#lista_preco").val();
								console.log( 'LISTA DE PREcO ATUAL....',valAtual );
								//$("#lista_preco option").remove();
								//loadPaiFilhoCombo( 'lista_preco', 'representante_compl', 'lista', pai.documentid, pai.version, 'cod_lista', 'den_lista', 'ies_lista_default', 'cod_empresa_lista', $('#empresa').val() );
								loadDataSetCombo( 'lista_preco', 'lista_de_preco_repres', 'NUM_LIST_PRECO', 'DEN_LIST_PRECO', 'cod_empresa,cod_repres,cod_moeda', $('#empresa').val()+','+codRepres+','+$('#moeda').val(), 'IES_LISTA_DEFAULT', 'S' );
								//busca lista clietne
								
								var f1 = DatasetFactory.createConstraint( "cod_empresa", $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST );
								var f2 = DatasetFactory.createConstraint( "cod_cliente", codCliente, codCliente, ConstraintType.MUST );
								var constraintsCliEmpre = new Array(f1,f2);
								console.log('Lista Constr......',constraintsCliEmpre);
								//Busca o dataset
								var datasetCliEmp = DatasetFactory.getDataset( 'clientes_empresa', null, constraintsCliEmpre, null);
								console.log( 'DATA SET LISTA ESPEC........',datasetCliEmp );
								if ( datasetCliEmp != null && datasetCliEmp.values.length ){
									if ( $.inArray(  datasetCliEmp.values[0].lista, getOptCombo( 'lista_preco' ) ) == -1 ){
										console.log('ADICIONA LISTA ESPEC......',datasetCliEmp.values[0].LISTA);
										$("#lista_preco").append("<option value='"+ datasetCliEmp.values[0].LISTA +"' >"+ datasetCliEmp.values[0].LISTA+" - "+ datasetCliEmp.values[0].DEN_LISTA +"</option>");
									}
									console.log('ANTES LISTA PADRaO......');
									if( ( valAtual == "" ||  valAtual == null ) && $('#ped_representante').val() == "0" ){
										console.log('ENTREI PADRaO......',datasetCliEmp.values[0].LISTA);
										$("#lista_preco").val( datasetCliEmp.values[0].LISTA );
									}else{
										console.log('ENTREI ELSE PADRAO......',valAtual);
										$("#lista_preco").val( valAtual );
									}
								}
								
								$("#lista_preco option").each(function () {
									
									console.log( 'TESTA LISTA PARA LIMPAR.....', $(this).val() );
									
									var today = new Date();
									today = [
									        today.getFullYear(),
									        ('0' + (today.getMonth() + 1)).slice(-2),
									        ('0' + today.getDate()).slice(-2)
									      ].join('');
									var dtIni = '18900101';
									var dtFim = '29991231';
									
									var constraintsLista = new Array();
									
									constraintsLista.push( DatasetFactory.createConstraint( "cod_empresa", $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST ) ); 
									constraintsLista.push( DatasetFactory.createConstraint( "num_list_preco", $(this).val(), $(this).val(), ConstraintType.MUST ) );
									constraintsLista.push( DatasetFactory.createConstraint( "dat_ini_vig", dtIni, today, ConstraintType.MUST ) );
									constraintsLista.push( DatasetFactory.createConstraint( "dat_fim_vig", today, dtFim, ConstraintType.MUST ) );
									
									console.log( 'listaConst', constraintsLista );
									
									var datasetLista = DatasetFactory.getDataset( 'lista_de_preco_repres', null, constraintsLista, null);
									
									console.log( 'SERA QUE LIMPO ESSA LISTA....', $(this).val() );
									
									if ( datasetLista == null || datasetLista.values.length == 0 ){
										console.log( 'VOU LIMPTAR ESSA LISTA....', $(this).val() );
										$(this).remove();
									} 
									console.log( 'APOS LIMPAR A LISTA' );
									
								});		
	
								$('#lista_preco_hd').val( $("#lista_preco").val() );
								$('#empresa_hd').val( $("#empresa").val() );							
								console.log( 'LOG FILTRO.........  NUM_LIST_PRECO,'+$('#lista_preco').val()+',COD_EMPRESA,'+$('#empresa').val() );
								//setTimeout("reloadZoomFilterValues('den_item_edit', 'NUM_LIST_PRECO,"+$('#lista_preco').val()+",COD_EMPRESA,"+$('#empresa').val()+"' );",3000);
								//"reloadZoomFilterValues('den_item_edit', 'NUM_LIST_PRECO,"+$('#lista_preco').val()+",COD_EMPRESA,"+$('#empresa').val()+" )";
								
							}
						
						
						//termina a consulta das listas de preco
					}
				}
				console.log("FIM do load.");
				loadingPrincipial.hide();
			}
			
			function mvalor(v){
				
			    v=v.replace(/\D/g,"");//Remove tudo o que nao e digito
			    v=v.replace(/(\d)(\d{9})$/,"$1.$2");//coloca o ponto dos milhoes
			    v=v.replace(/(\d)(\d{6})$/,"$1.$2");//coloca o ponto dos milhares
			    v=v.replace(/(\d)(\d{3})$/,"$1,$2");//coloca a virgula antes dos 3 ultimos digitos
				
			    return v;
			}		


			function loadEspelhoUltPedido( codCliente ){
				
				// We can show the message of loading
				console.log("Antes do load loadEspelhoUltPedido ..... "+codCliente);
				loadingPrincipial.show();

				var constraints = new Array();
				constraints.push( DatasetFactory.createConstraint("cod_cliente", codCliente, codCliente, ConstraintType.MUST) );
				var dataset = DatasetFactory.getDataset('clientes_ult_ped', null, constraints, null);
				
				if ( dataset != null ){
					console.log("IFF ..... ");
					for (var x = 0; x < dataset.values.length; x++) {
						console.log("FOR X..... "+x);
						$('#empresa').val( dataset.values[x].COD_EMPRESA );
						$('#tipo_venda').val( dataset.values[x].COD_TIP_VENDA );
						$('#nat_operacao').val( dataset.values[x].COD_NAT_OPER );
						$('#cond_pagamento').val( dataset.values[x].COD_CND_PGTO );
						$('#tipo_entrega').val( dataset.values[x].IES_TIP_ENTREGA );
						$('#moeda').val( dataset.values[x].COD_MOEDA );
						if( $('#empresa').val( ) != '' && $('#empresa').val( ) != undefined ){
							setLista(); 
							atualizaEmpresa();
							$('#lista_preco').val( dataset.values[x].NUM_LIST_PRECO );
							setListaPreco();
						}
						$('#tipo_desconto').val( dataset.values[x].TIP_DESC );
						
						$('#tipo_frete').val( dataset.values[x].TIPO_FRETE.trim() );
					
						if( $('#tipo_frete').val( ) == 'RET' ){
							zoomDestino = window[$("#transportadora").attr('filter-instance')];
							zoomDestino.clear();
							zoomDestino.setValue( $('#razao_social').val( ) );				
							zoomDestino.disable(true);
							$('#cnpj_trans').val(  $('#cnpj').val( ) );
							$('#cod_trans').val(  $('#cod_cliente').val( ) );							
						}else{
							if ( dataset.values[x].nom_transpor != " " && dataset.values[x].nom_transpor != "" ){
								var zoomDestino = {};
								zoomDestino = window[ $("#transportadora").attr('filter-instance') ];
								zoomDestino.setValue( dataset.values[x].NOM_TRANSPOR );
								$('#cod_trans').val( dataset.values[x].COD_TRANSPOR );
								$('#cnpj_trans').val( dataset.values[x].CNPJ_TRANSPOR ); 
							}
						}
						var tipo_entrega = $('#tipo_entrega_hd').val();
						
						if (tipo_entrega != null && tipo_entrega != '' && tipo_entrega != '0') {
							console.log('tipo_entrega ',tipo_entrega);
							//$('#tipo_entrega').val(tipo_entrega);
							setSelectedIndex(document.getElementById("tipo_entrega"),parseInt(tipo_entrega));
							
						}
					}
				}
			}

			
function setCondPagto(){
	console.log( 'Entrei!!!!' );
	$('#ies_emite_dupl_cond').val( loadCampoDataSet( 'condicao_pagamento_vdp', 'cod_cnd_pgto', $('#cond_pagamento').val(), 'IES_EMITE_DUPL' ) );
}
			
function setNatOper(){
	console.log( 'Entrei!!!!' );
	msgDebug( 'Entrei setNatOper' );
	msgDebug( 'Entrei setNatOper '+loadCampoDataSet( 'natureza_operacao', 'cod_nat_oper', $('#nat_operacao').val(), 'IES_EMITE_DUPL' ) );
	$('#ies_emite_dupl').val( loadCampoDataSet( 'natureza_operacao', 'cod_nat_oper', $('#nat_operacao').val(), 'IES_EMITE_DUPL' ) );
	msgDebug( 'Sai setNatOper '+$('#ies_emite_dupl').val() );
}

function setTipoFrete(){
	console.log( 'Entrei!!!!' );
	$('#tipo_frete_logix').val( loadCampoDataSet( 'tipo_frete', 'tipo_frete_fluig', $('#tipo_frete').val(), 'tipo_frete_logix' ) );
	
	if (  $('#tipo_frete').val() == "RET"  ){
		//var objDestino = { inputId:'transportadora', inputName:'transportadora', cod_cliente:$('#cod_cliente').val( ), nom_cliente:$('#razao_social').val( ) };
		zoomDestino = window[$("#transportadora").attr('filter-instance')];
		zoomDestino.clear();
		zoomDestino.setValue( $('#razao_social').val( ) );				
		zoomDestino.disable(true);
		$('#cnpj_trans').val(  $('#cnpj').val( ) );
		$('#cod_trans').val(  $('#cod_cliente').val( ) );
	}else if( $('#cod_trans').val() == $('#cod_cliente').val() ){
		zoomDestino = window[$("#transportadora").attr('filter-instance')];
		zoomDestino.clear();		
		zoomDestino.disable(false);
		$('#cnpj_trans').val( "" );
		$('#cod_trans').val( "" );
	}
}

function setLista(){
	if( qtdItens() > 0 ){
		FLUIGC.toast({
				title: 'Altera&ccedil;&atilde;o: ',
				message: 'N&atilde;o &eacute permitido alterar empresa ap&oacute; inserir itens no pedido.',
				type: 'warning',
				timeout: 'fast'
		});
		$('#empresa').val( $("#empresa_hd").val() );
		return false;
	}else{
		loadRepresCompl( $('#cod_repres').val(), $('#cod_cliente').val(), $('#cod_moeda_cli').val(), 'LT' );
		$('#empresa_hd').val( $("#empresa").val() );
		return true;
	}

}

function setListaPreco(){
	if( qtdItens() > 0 ){
		FLUIGC.toast({
				title: 'Altera&ccedil;&atilde;o: ',
				message: 'N&atilde;o &eacute permitido alterar lista de pre&ccedil;o ap&oacute; inserir itens no pedido.',
				type: 'warning',
				timeout: 'fast'
		});
		console.log( 'set lista 001',$("#lista_preco").val() );
		console.log( 'set lista 001',$("#lista_preco_hd").val() );
		$('#lista_preco').val( $("#lista_preco_hd").val() );
		return false;
	}else{
		setLista();
		reloadZoomFilterValues('den_item_edit', "NUM_LIST_PRECO,"+$('#lista_preco').val()+",COD_EMPRESA,"+ $('#empresa').val());
		$('#lista_preco_hd').val($("#lista_preco").val());
	}
}

function getListaTipoCliente(){

	var constraintsPai = new Array( DatasetFactory.createConstraint("ies_matriz", 'on', 'on', ConstraintType.MUST) );
	var datasetPai = DatasetFactory.getDataset('empresa_compl', null, constraintsPai, null);
	var lstTipoCli = new Array();
	console.log( 'Pai Filho '+$('#empresa').val() );
	if ( datasetPai != null ){
		console.log( 'Pai Filho ', datasetPai.values.length );
		for (var x = 0; x < datasetPai.values.length; x++) {
			var pai = datasetPai.values[x];
			console.log( 'INFO ' );
					
			var constraintsFilhos = new Array();
			constraintsFilhos.push( DatasetFactory.createConstraint("tablename", 'tipo_cliente_cei', 'tipo_cliente_cei', ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pai.documentid, pai.documentid, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pai.version, pai.version, ConstraintType.MUST) );
				
			var datasetFilhos = DatasetFactory.getDataset('empresa_compl', null, constraintsFilhos, null );
				
			if ( datasetFilhos != null ){
				
			var filhos = datasetFilhos.values;
				console.log('DataSet',datasetFilhos);
				
				for ( var i in filhos ) {
					var filho = filhos[i];
					console.log( filho[ "cod_tipo_cliente" ] );
					lstTipoCli.push( filho[ "cod_tipo_cliente" ] );
				}
			}
		}
	}
	console.log('ARRAY tipo cli',lstTipoCli);
	return lstTipoCli;
}

function buscaUltimoPreco( id ){
	
	if (!validaMultiplo()) {
		return false;
	}
	//busca lista clietne
	var f1 = DatasetFactory.createConstraint( "cod_empresa", $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST );
	var f2 = DatasetFactory.createConstraint( "num_list_preco", 0, 0, ConstraintType.MUST );
	var f3 = DatasetFactory.createConstraint( "cod_cliente", $('#cod_cliente').val(), $('#cod_cliente').val(), ConstraintType.MUST );
	var f4 = DatasetFactory.createConstraint( "cod_item", $('#cod_item_edit').val(), $('#cod_item_edit').val(), ConstraintType.MUST );	
	
	var constraintsCliItem = new Array(f1,f2,f3,f4);
	console.log('Lista Constr......',constraintsCliItem);
	//Busca o dataset
	var datasetCliItem = DatasetFactory.getDataset( 'ultimo_preco_item_cliente', null, constraintsCliItem, null);
	console.log( 'retorno......',datasetCliItem );
	if ( datasetCliItem != null && datasetCliItem.values.length ){
		console.log('Lista......',datasetCliItem);
		console.log('preco......', datasetCliItem.values[0].PRE_UNIT);
		console.log('desc......', datasetCliItem.values[0].PCT_DESC_ADIC);
		getDescModal(  datasetCliItem.values[0]['PRE_UNIT'], datasetCliItem.values[0]['PCT_DESC_ADIC'] );		
		console.log('set default......');
	}else{
		FLUIGC.toast({
			title: 'Valida&ccedil;&atilde;o: ',
			message: 'N&atilde;o localizado pre&ccedil;o anterior!',
			type: 'warning',
			timeout: 'fast'
		});
	}
	
}


function copyObs( id ){
	
	//busca lista clietne
	var f1 = DatasetFactory.createConstraint( "cod_cliente", $('#cod_cliente').val(), $('#cod_cliente').val(), ConstraintType.MUST );	
	var constraintsCliObs = new Array(f1);
	console.log('Lista Constr......',constraintsCliObs);
	//Busca o dataset
	var datasetCliObs = DatasetFactory.getDataset( 'clientes_logix_obs', null, constraintsCliObs, null);
	console.log( 'retorno......',datasetCliObs );
	
	if ( datasetCliObs != null && datasetCliObs.values.length ){
		
		console.log('Lista......',datasetCliObs);
		console.log('OBS........', datasetCliObs.values[0].DEN_TEXTO_1);
		$('#texto_nf_1').val( datasetCliObs.values[0].DEN_TEXTO_1 );
		$('#texto_nf_2').val( datasetCliObs.values[0].DEN_TEXTO_2 );
		$('#texto_nf_3').val( datasetCliObs.values[0].DEN_TEXTO_3 );
		$('#texto_nf_4').val( datasetCliObs.values[0].DEN_TEXTO_4 );
		$('#texto_nf_5').val( datasetCliObs.values[0].DEN_TEXTO_5 );
	}else{
		FLUIGC.toast({
			title: 'Valida&ccedil;&atilde;o: ',
			message: 'N&atilde;o localizado observa&ccedil;&atilde;o para o pedido!',
			type: 'warning',
			timeout: 'fast'
		});		
	}	
}

function atualizaEmpresa(){
	
	var f1 = DatasetFactory.createConstraint( "cod_empresa", $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST );	
	var constraintsEmp = new Array(f1);
	console.log('Lista Constr......',constraintsEmp);
	//Busca o dataset
	var datasetEmp = DatasetFactory.getDataset( 'empresa', null, constraintsEmp, null);
	console.log( 'retorno......',datasetEmp );
	
	if ( datasetEmp != null && datasetEmp.values.length ){
		
		console.log('Lista......',datasetEmp);
		console.log('IES_ITEM........', datasetEmp.values[0].IES_ITEM_PED);
		console.log('QTD_CASAS........', datasetEmp.values[0].QTD_CASAS_DECIMAIS_PRECO_UNIT);
		
		$('#dup_item').val( datasetEmp.values[0].IES_ITEM_PED );
		
		$('.preco_unit').maskMoney( { precision:parseInt(datasetEmp.values[0].QTD_CASAS_DECIMAIS_PRECO_UNIT), thousands:'.',decimal:','} );
		$('#casas_preco').val( datasetEmp.values[0].QTD_CASAS_DECIMAIS_PRECO_UNIT );
	}
}

function loadPedido( codEmpresa, numPedido, compl ){
	
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint("cod_empresa", codEmpresa, codEmpresa, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("num_pedido", numPedido, numPedido, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("simula", 'N', 'N', ConstraintType.MUST) );
	var pedido = DatasetFactory.getDataset("pedido_item_rest", null, constraints, null);
	console.log( 'Pedido... ',pedido );
	
	if ( pedido != null ){
		for (var x = 0; x < pedido.values.length; x++) {						
			var row = pedido.values[x];
			console.log('Console.....',row);
			if ( x == 0 ){
				$('#empresa').val( row.cod_empresa );
				$('#empresa_hd').val(row.cod_empresa );
				$('#tipo_venda').val( row.cod_tip_venda );
				$('#nat_operacao').val( row.cod_nat_oper );
				$('#cond_pagamento').val( row.cod_cnd_pgto );
				$('#tipo_entrega').val( row.ies_tip_entrega );
				$('#sit_pedido').val( row.sit_pedido );
				 
				var num_pedido_cli = "";
				if ( num_pedido_cli == null || num_pedido_cli == 'null' ){
					num_pedido_cli = "";
				}
				$('#ped_cliente').val( num_pedido_cli );
				var cei = "";
				if ( row.text_1 != null && row.text_1.toUpperCase().substr(0,4) == 'CEI:' ){
					cei = row.text_1.substr(4, row.text_1.indexOf(' ',5) );
				}
				$('#cei').val( cei );
				$('#moeda').val( row.cod_moeda );
				$('#lista_preco').val( row.num_list_preco );
				$('#lista_preco_hd').val(row.num_list_preco);
				loadDataSetCombo( 'lista_preco', 'lista_de_preco_repres', 'NUM_LIST_PRECO', 'DEN_LIST_PRECO', 'cod_empresa,num_list_preco', row.cod_empresa+','+row.num_list_preco, 'IES_LISTA_DEFAULT', 'S' );
				
				$('#pct_desc_financ').val( converteMoeda( row.pct_desc_financ ) );
				if ( row.pct_desc_adic != 0 ){ 
					$('#pct_desc_adicional').val( converteMoeda( row.pct_desc_adic ) );
				}
				
				$('#tipo_desconto').val( row.tip_desc );
				
				console.log('Tipo Frete', compl.tip_frete );
				$('#tipo_frete').val( compl.tip_frete );
				
				if ( row.nom_transpor != " " && row.nom_transpor != "" ){
					var zoomDestino = {};
					//var objDestino = { inputId:'transportadora', inputName:'transportadora', cod_cliente:row.cod_transpor, nom_cliente:row.nom_transpor };
					//console.log('transpotara.....',objDestino );
					zoomDestino = window[ $("#transportadora").attr('filter-instance') ];
					console.log('transpotara.....', zoomDestino );
					//zoomDestino.add( objDestino );
					zoomDestino.setValue( row.nom_transpor );
					
					$('#cod_trans').val( row.cod_transpor );
					console.log('transpotara..... CNPJ' );
					$('#cnpj_trans').val( loadCampoDataSet( 'clientes_logix', 'cod_cliente', row.cod_transpor+"", 'CNPJ' ) ); 
				}
				
				console.log('TESTE uf'  );
				
				var codUf = loadCampoDataSet( 'cidades', 'COD_CIDADE', row.cod_cidade, 'COD_UNI_FEDER' );
				
				if ( codUf == $('#estado_ent').val() ){
					
					console.log('ENTROU uf'  );
					
					$('#cep_ent').val( row.cod_cep );
					$('#cod_cidade_ent').val( row.cod_cidade );
					if ( row.den_cidade != ' ' ){
						var zoomDestino = {};
						//var objDestino = { inputId:'cidade_ent', inputName:'cidade_ent', cod_cidade:row.cod_cidade, den_cidade:row.den_cidade };
						//console.log('CIDADE.....',objDestino );
						zoomDestino = window[ $("#cidade_ent").attr('filter-instance') ];
						console.log('CIDADE.....', zoomDestino );
						//zoomDestino.add( objDestino );
						zoomDestino.setValue( row.den_cidade );
					}
				
					console.log('bairrrro....' );
					$('#bairro_ent_sel').val( row.den_bairro );
					if ( $('#bairro_ent_sel').val() == undefined || $('#bairro_ent_sel').val() == null || $('#bairro_ent_sel').val() == '' ){
						$('#bairro_ent').val( row.den_bairro );
						$("#ies_bairro_ent_manual").prop("checked", true);
						alteraCampos( 'ies_bairro_ent_manual', 'bairro_ent_sel', 'bairro_ent' );
					}
					
					console.log('endereÃÂ§o....' );
					$('#tipo_logradouro_ent').val( row.tip_lograd );
					$('#endereco_ent').val( row.end_entrega );
				
					console.log('numero....' );
					if ( $.isNumeric( row.numero ) )
						$('#sem_numero_ent').prop('checked', false);
					else
						$('#sem_numero_ent').prop('checked', true);
					setSemNumero( $('#sem_numero_ent').attr('id'), 'numero' );
					if ( $.isNumeric( row.numero ) )
						$('#numero_ent').val( row.numero );
					
					
					console.log( 'UF - IE....'+$('#estado_ent').val() );
					if ( row.ins_estadual == "" ){
						var eiNum = '';
						if ( row.ins_estadual != null )
							eiNum = row.ins_estadual.replace(/[^0-9]/g,'');
						console.log( 'IE...'+eiNum+' '+row.ins_estadual );
						if (eiNum == ''){
							$('#isento_ie_ent').prop('checked', true);
							setIsento( 'isento_ie_ent', 'ie_ent', 'estado_ent' );
						}else{
							$('#isento_ie_ent').prop('checked', false);
							setIsento( 'isento_ie_ent', 'ie_ent', 'estado_ent' );
							$('#ie_ent').val( row.ins_estadual );
							if ( $('#estado_ent').val() != '' ){
								$('#ie_ent').mask( mascaraIE[ $('#estado_ent').val() ] );
							}
						}
					}
					$('#cnpj_ent').val( row.num_cgc );
				}
				console.log( 'TEXT', row.text_1 );
				
				$('#texto_nf_1').val( row.text_1 );
				$('#texto_nf_2').val( row.text_2 );
				$('#texto_nf_3').val( row.text_3 );
				$('#texto_nf_4').val( row.text_4 );
				$('#texto_nf_5').val( row.text_5 );
				
				$('#texto_pedido_1').val( row.obs_1 );
				$('#texto_pedido_2').val( row.obs_2 );
			}
			// #### inclui item
			
			console.log( 'grava_000' );
			
			var seq = wdkAddChild( 'ped_itens' );

			console.log( 'grava_001' );
			
			$('#cod_item___'+seq).val( row.item );
			/*
			if( origem == 'field'){
				var objDestino = { inputId:'den_item_edit', inputName:'den_item_edit', cod_item:row.COD_ITEM, den_item:row.DEN_ITEM };
				zoomDestino = window[$("#den_item_edit").attr('filter-instance')];
				zoomDestino.add( objDestino );														
			} */
			
			$('#quantidade___'+seq).val( parseFloat( row.qtd_item ).toFixed( 2 ).replace('.',',') );
			$('#qtd_orig___'+seq).val( parseFloat( row.qtd_item ).toFixed( 2 ).replace('.',',') );
			$('#valor_unit___'+seq).val( parseFloat( row.preco_unit_liquido ).toFixed( $('#casas_preco').val() ).replace('.',',') );
			$('#sequencia___'+seq).val( row.seq_item_nf );
			//$('#pct_desc_adic___'+seq).val( String( parseFloat( row.pct_desc_item ).toFixed(3) ).replace('.',',') );
			//console.log('Data entrega.....'+row.prz_entrega);
			$('#data_entrega___'+seq).val( row.prz_entrega.substring(0,10).split("-").reverse().join("/") );
			
			$('#pedido_cli_item___'+seq).val( row.num_pedido_cliente_item );
			$('#seq_pedido_cli_item___'+seq).val( row.seq_pedido_cliente_item );
			
			console.log("filtros "+row.cod_empresa);
			console.log("filtros "+row.item);
			console.log("filtros "+$('#cod_cliente').val());
			
			var consUlt = new Array();
			consUlt.push( DatasetFactory.createConstraint("cod_empresa", row.cod_empresa, row.cod_empresa, ConstraintType.MUST) );
			consUlt.push( DatasetFactory.createConstraint("cod_item", row.item, row.item, ConstraintType.MUST) );
			consUlt.push( DatasetFactory.createConstraint("cod_cliente", $('#cod_cliente').val(), $('#cod_cliente').val(), ConstraintType.MUST) );
			consUlt.push( DatasetFactory.createConstraint("num_list_preco", '0', '0', ConstraintType.MUST) );
			
			var datasetUlt = DatasetFactory.getDataset('ultimo_preco_item_cliente', null, consUlt, null);	
			console.log("load ult..... "+datasetUlt);
			
			if ( datasetUlt != null && datasetUlt.values.length > 0 ){
				var regUlt = datasetUlt.values[0];
				console.log("linha ult"+regUlt);
				$('#ult_preco_unit_liq___'+seq).val( regUlt.ULT_PRECO_UNIT_LIQ );
			} else {
				console.log("zeros");
				$('#ult_preco_unit_liq___'+seq).val( '0,00' );
			}
			
			var constraints = new Array();
			constraints.push( DatasetFactory.createConstraint("cod_empresa", row.cod_empresa, row.cod_empresa, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint("cod_item", row.item, row.item, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint("num_list_preco", row.num_list_preco, row.num_list_preco, ConstraintType.MUST) );
							
			var dataset = DatasetFactory.getDataset('lista_de_preco_item', null, constraints, null);			
			console.log("load..... "+dataset);
			
			if ( dataset != null && dataset.values.length > 0 ){
				var reg = dataset.values[0];
				console.log("linha..... ITem "+reg);
				
				$('#peso___'+seq).val( reg.PES_UNIT );
				$('#cubagem___'+seq).val( reg.CUBAGEM );
				$('#qtd_pad___'+seq).val( reg.QTD_PADR_EMBAL );
					
				$('#cod_lin_prod___'+seq).val( reg.COD_LIN_PROD );
				$('#cod_lin_recei___'+seq).val( reg.COD_LIN_RECEI );
				$('#cod_seg_merc___'+seq).val( reg.COD_SEG_MERC );
				$('#cod_cla_uso___'+seq).val( reg.COD_CLA_USO );
				
				$('#cod_grupo_item___'+seq).val( reg.COD_GRUPO_ITEM );
				$('#cod_tip_carteira___'+seq).val( reg.COD_TIP_CARTEIRA );					
				$('#den_item_reduz___'+seq).val( reg.DEN_ITEM_REDUZ );
				$('#den_item___'+seq).val( reg.DEN_ITEM );

				$('#ies_mix___'+seq).val( reg.MIX_PRODUTO );
					
				$('#um').val( row.COD_UNID_MED );
				
				var preco = getPrecoListaItem( row.cod_empresa, row.num_list_preco, row.item, reg.COD_LIN_PROD, reg.COD_LIN_RECEI, reg.COD_SEG_MERC, reg.CLA_USO_EDIT, $('#cod_cliente').val(), $('#estado_ent').val(), $('#cond_pagamento').val(), reg.COD_GRUPO_ITEM, reg.COD_TIP_CARTEIRA );
				$('#valor_unit_lista_edit').val( String( preco['PRE_UNIT'].toFixed(3) ).replace('.',',') );
				
			}
	
			$('#um___'+seq).val( row.unid_medida );			
			if ( String( parseFloat( row.pct_desc_item ).toFixed(2) ).replace('.',',') == "0.00" ){
				$('#desconto___'+seq).val( "" );
			}else{
				$('#desconto___'+seq).val( String( parseFloat( row.pct_desc_item ).toFixed(2) ).replace('.',',') );//( parseFloat( row.qtd_item ) * parseFloat( row.preco_unit_liquido ) ) - parseFloat( row.val_liquido_item ) );
			}
			$('#valor_total___'+seq).val( row.val_liquido_item );
			
			
			$('#obs_item_1___'+seq).val( row.text_item_1 );
			$('#obs_item_2___'+seq).val( row.text_item_2 );	
			$('#obs_item_3___'+seq).val( row.text_item_3 );
			$('#obs_item_4___'+seq).val( row.text_item_4 );
			$('#obs_item_5___'+seq).val( row.text_item_5 );
			
			atulizaRecalcTotal( 'grava_edit' );
			
			// #### fim inclui item

		}
	}
}

function isNull( valor, padrao ){
	if ( isNaN( valor ) ){
		return padrao;
	}else{
		return valor;
	}
}

function getFloat(valor,padrao){
	var txt = valor;
//	exp = /\./g;
//	txt = txt.toString().replace( exp, "" );
	exp = /\,/g;
	txt = txt.toString().replace( exp, "." );
	return isNull( Math.round( parseFloat( txt ) * 100000000 ) / 100000000, padrao );
}

function frmNumber( valor, precisao ){

	 var numero = valor;
	
	 numero = numero.toFixed( precisao ).split('.');
	 numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
	 return numero.join(',');
	
	//return String( ( valor ).toFixed( precisao ) ).replace('.',',');
	
}

function cargaCidadesEnt(){
	reloadZoomFilterValues("cidade_ent", "cod_uni_feder,"+$('#estado_ent').val() );
}

function loadPerguntas(){
	
	if( $('#tipo_frete').val() == "RET" ){
		return false;
	}
	
	var row = 0;
	$( "input[name^=cod_pergunta___]" ).each(function( index ) {
		row += 1;
	});
	if( row != 0 ){
		return false;
	}
	
	var dsTeste = getDsPaiFilho( "tipo_cliente_perguntas", "tipo_perguntas", "", "cod_tip_cli", $('#cod_tip_cli').val() );
	if( dsTeste == null ){
		return false;
	}
	if( dsTeste.values.length == 0 ){
		return false;
	}
	
	var cons = new Array();
	cons.push( DatasetFactory.createConstraint('cod_tip_cli', $('#cod_tip_cli').val(), $('#cod_tip_cli').val(), ConstraintType.MUST) );
	var tipoPergunta = DatasetFactory.getDataset('tipo_cliente_perguntas', null, cons, null );
	
	if(tipoPergunta.values.length > 0){
		$("#ies_end_entrega").val( tipoPergunta.values[0].ies_end_entrega ) ;
	}
	
	
	var lstTeste = dsTeste.values;
	for ( var y in lstTeste ) {
		var teste = lstTeste[y];

		var row = wdkAddChild('perguntas');
		
		console.log('Add row ....' , row )
		$('#cod_pergunta___'+row).val( teste.cod_pergunta ) ;
		
		var cons = new Array();
		cons.push( DatasetFactory.createConstraint('cod_pergunta', teste.cod_pergunta, teste.cod_pergunta, ConstraintType.MUST) );
		var dsTesteCpl = DatasetFactory.getDataset('perguntas', null, cons, null );
		console.log('dsTesteCpl',dsTesteCpl);
		
		var tipo_teste = 'I';
		
		
		$('#tipo_pergunta___'+row).val( dsTesteCpl.values[0].tipo_pergunta ) ;
		$('#den_pergunta___'+row).val( teste.den_pergunta ) ;
		
		if( dsTesteCpl != undefined && dsTesteCpl != null ){
			tipo_teste = dsTesteCpl.values[0].tipo_pergunta;
			num_precisao = dsTesteCpl.values[0].num_precisao;
			cod_um = dsTesteCpl.values[0].cod_um;
		}
		
		console.log('tipo_teste.....',tipo_teste);
		if( tipo_teste == 'O' ){
			$('#opcao___'+row).show();
			$('#informado___'+row).hide();
			$('#metrica___'+row).hide();
				
			var dsOpcoes = getDsPaiFilho( "perguntas", "opcoes_pergunta", "", "cod_pergunta", teste.cod_pergunta );
			if( dsOpcoes != undefined && dsOpcoes != null ){
				var lstOpcoes = dsOpcoes.values;
				var aTemObs = [];
				$('#opcao___'+row).append("<option value='' ></option>");
				for ( var i in lstOpcoes ) {
					var opcoes = lstOpcoes[i];
					console.log('opcoes',opcoes);
					$('#opcao___'+row).append("<option value='"+ opcoes.cod_opcao +"' >"+ opcoes.den_opcao.toUpperCase() +"</option>");
				}
			}
		}else{
			$('#opcao___'+row).hide();								
			if( tipo_teste == 'M' ){
				$('#metrica___'+row).show();
				$('#informado___'+row).hide();
				
				$('#num_precisao___'+row).val( dsTesteCpl.values[0].num_precisao );
				$('#cod_um___'+row).val( dsTesteCpl.values[0].cod_um );
				
				num_precisao = parseInt( dsTesteCpl.values[0].num_precisao.split(',')[0]  );
				$('#metrica___'+row).maskMoney( {precision : num_precisao, thousands : '.',decimal : ',', defaultZero : false, allowZero : true });	
				
			}else{
				$('#metrica___'+row).hide();
				$('#informado___'+row).show();
			}
		}
	}
	
	setUpper();
}


function getDsPaiFilho( dataSet, table, fieldCodigo, fildFilter, fildFilterValue ){
	
	console.log( dataSet, table, fieldCodigo, fildFilter, fildFilterValue  );

	var constraintsPai = new Array();
	var lstFilter = fildFilter.split(',');
	var lstFilterValue = fildFilterValue.split(',');
	for ( var j = 0; j < lstFilter.length; j ++ ){
		console.log( 'Passo 00X',lstFilter[j],lstFilterValue[j] );
		if ( lstFilter[j] != '' && lstFilter[j] != null ){
			constraintsPai.push( DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST) );
		}
	}
	var datasetPai = DatasetFactory.getDataset(dataSet, null, constraintsPai, null );
	console.log('datasetPai',datasetPai);
	if( datasetPai != undefined && datasetPai != null ){
		var pais = datasetPai.values;
		for ( var y in pais ) {
			var pai = pais[y];
			
			var constraintsFilhos = new Array();
			constraintsFilhos.push( DatasetFactory.createConstraint("tablename", table, table, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pai.documentid, pai.documentid, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pai.version, pai.version, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
			
			var orderFilhos = new Array();
			orderFilhos.push( fieldCodigo );						
			var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos );
			console.log('DataSet',datasetFilhos);
			if ( datasetFilhos != null ){
				return datasetFilhos;
			}
		}
	}
	return null;
}			
