			//busca informações do dataset
			//o type é o nome do componente do html
			function zoom(componente, idCampoTexto) {
				console.log('Componente.....'+componente);
				if( componente == 'bt_equipamento' ){
						modalzoom.open("Tipo Teste",
								   "equipamento", 
								   "cod_equipamento,Cod.,den_equipamento,Descri&ccedil;&atilde;o", 
								   "cod_equipamento,den_equipamento", 
								   "",
								   componente, false, "default", null, null,
							       "den_equipamento" );		
				}
				if( componente == 'bt_item' ){
					modalzoom.open("Produto",
							   "produto_qualidade", 
							   "cod_item,Cod.,den_item,Descri&ccedil;&atilde;o", 
							   "cod_item,den_item", 
							   "",
							   componente, false, "default", null, null,
						       "cod_item||'-'||den_item" );		
				}

				if( componente == 'bt_lote' ){
					var tamanho = "default";
					var filtroCpl = "";
					if( $('#num_lote').val() != "" ){
						tamanho = "none";
						filtroCpl += ",num_lote,"+$('#num_lote').val()
					}
					modalzoom.open("Lote",
							   "selectTable", 
							   "cod_item,Cod.,num_lote,Lote", 
							   "distinct,cod_empresa,cod_item,num_lote", 
							   "dataBase,java:/jdbc/LogixDS,table,fluig_v_lote,cod_empresa,01,cod_item_reduz,"+$('#cod_item').val().split('.')[0]+filtroCpl,
							   componente, false, tamanho, null, null,
						       "num_lote" );		
				}

				if( componente == 'bt_op' ){
					
					var tamanho = "default";
					var filtroCpl = "";
					if( $('#num_ordem').val() != "" ){
						tamanho = "none";
						filtroCpl += ",num_ordem,"+$('#num_ordem').val()
					}
					
					modalzoom.open("Item",
							   "selectLogix", 
							   "num_ordem,Num OP,cod_item,Cod.,den_item,Descrição", 
							   "num_ordem,cod_item,den_item", 
							   "table,kbt_v_op_insp,cod_empresa,"+ $('#empresa').val()+filtroCpl,
							   componente, false, tamanho, null, null,
						       "num_ordem||'-'||cod_item||'-'||den_item" );		
				}
				if( componente == 'bt_oper' ){
					
					if( $('#cod_item').val() == "" ){
						return false;
					}
					
					var cod_empresa = $('#empresa').val();
					if( cod_empresa == "" ){
						cod_empresa = "10";
					}
					
					modalzoom.open("Operação",
							   "selectLogix", 
							   "operacao,Cod.,den_operac,Descrição", 
							   "operacao,den_operac", 
							   "table,kbt_v_item_operacao,cod_empresa,"+ cod_empresa +",cod_item,"+$('#cod_item').val(), //,ies_situacao,A",
							   componente, false, "default", null, null,
						       "operacao||'-'||den_operac" );		
				}
				
				
				
			}
			
			function setSelectedZoomItem(selectedItem) {
				console.log('selectedItem..........',selectedItem);
				if (selectedItem.type == "bt_equipamento") {
					$('#cod_equipamento').val( selectedItem.cod_equipamento ) ;
					$('#den_equipamento').val( selectedItem.den_equipamento ) ;
					$('#cod_grupo').val( selectedItem.cod_grupo ) ;
					loadTeste();
				}
				if (selectedItem.type == "bt_item") {
					$('#cod_item').val( selectedItem.cod_item ) ;
					$('#den_item').val( selectedItem.den_item ) ;
					
					$('#den_item_lote').val( $('#cod_item').val( ).trim()+' - '+$('#den_item').val( ).trim()+' - '+$('#num_lote').val( ).trim() );
					
					loadTeste();
					//buscaMediaTeste();
				}

				if (selectedItem.type == "bt_op") {
					
					if( selectedItem.cod_item == "" ){
						FLUIGC.toast({
							message: 'OP não localizada.',
							type: 'success'
						});
						return false;
					}
					
					$('#cod_item').val( selectedItem.cod_item ) ;
					$('#den_item').val( selectedItem.den_item ) ;
					$('#num_ordem').val( selectedItem.num_ordem ) ;
					
					$('#den_item_lote').val( $('#cod_item').val( ).trim()+' - '+$('#den_item').val( ).trim()+' - '+$('#num_ordem').val( ).trim() );
					
					$('#operacao').val( "" ) ;
					$('#den_operac').val( "" ) ;
					var ct = new Array();
					ct.push( DatasetFactory.createConstraint( 'ies_padrao',		"S", 						"S", 				  ConstraintType.MUST) );
					ct.push( DatasetFactory.createConstraint( 'empresa', 		$('#empresa').val(), 		$('#empresa').val(),  ConstraintType.MUST) );
					ct.push( DatasetFactory.createConstraint( 'cod_item', 		selectedItem.cod_item, 		selectedItem.cod_item, ConstraintType.MUST) );
					var ds = DatasetFactory.getDataset("produto_qualidade", null, ct, null);
					console.log('produto_qualidade P07..'+ds.values.length);
					if( ds.values.length == 0 ){
						var ct = new Array();
						ct.push( DatasetFactory.createConstraint( 'ies_padrao',		"S", 						"S", 				  ConstraintType.MUST) );
						ct.push( DatasetFactory.createConstraint( 'empresa', 		"", 						"",  				  ConstraintType.MUST) );
						ct.push( DatasetFactory.createConstraint( 'cod_item', 		selectedItem.cod_item, 		selectedItem.cod_item, ConstraintType.MUST) );
						var ds = DatasetFactory.getDataset("produto_qualidade", null, ct, null);
						if( ds.values.length > 0 ){
							$('#operacao').val( ds.values[0]['operacao'] ) ;
							$('#den_operac').val( ds.values[0]['den_operac'] ) ;
						}
					}else{
						$('#operacao').val( ds.values[0]['operacao'] ) ;
						$('#den_operac').val( ds.values[0]['den_operac'] ) ;
					}
					
					loadTeste();
					//buscaMediaTeste();
				}
				if (selectedItem.type == "bt_oper") {
					$('#operacao').val( selectedItem.operacao ) ;
					$('#den_operac').val( selectedItem.den_operac ) ;
					loadTeste();
				}
				
				if (selectedItem.type == "bt_lote") {
					if( selectedItem.num_lote == "" ){
						if( $('#num_lote_ig').val() != $('#num_lote').val() ){
							if( !confirm( "Lote não localizado, deseja continuar?" ) ){
								$('#num_lote').focus();
								$('#num_lote_ig').val( "" );
							}else{
								$('#num_lote_ig').val( $('#num_lote').val() );
							}
						}
					}else{					
						$('#num_lote').val( selectedItem.num_lote ) ;
					}
					$('#den_item_lote').val( $('#cod_item').val( ).trim()+' - '+$('#den_item').val( ).trim()+' - '+$('#num_lote').val( ).trim() );
					//buscaMediaTeste();
				}
			}
			
			
			
			function loadTeste(){
				
				/*if( $('#cod_equipamento').val() == "" || $('#cod_item').val() == "" ){
					return false;
				}
							
				var dsTeste = getDsPaiFilho( "grupo_equipamento", "tipo_teste", "", "cod_grupo", $('#cod_grupo').val() );
				console.log('teste....',dsTeste);
				
				cargaTeste( dsTeste );
				
				var dsTeste = getDsPaiFilho( "equipamento", "tipo_teste", "", "cod_equipamento", $('#cod_equipamento').val() );
				console.log('teste....',dsTeste);
				
				cargaTeste( dsTeste );*/
				
				if( $('#cod_item').val() == "" || $('#operacao').val() == "" || $('#empresa').val() == "" ){
					return false;
				}
				
				var dsTeste = getDsPaiFilho( "produto_qualidade", "tipo_teste", "empresa,cod_item,operacao", $('#empresa').val()+','+$('#cod_item').val()+','+$('#operacao').val(), "", true );
				
				if( dsTeste.values.length == 0 ){
					dsTeste = getDsPaiFilho( "produto_qualidade", "tipo_teste", "empresa,cod_item,operacao", ','+$('#cod_item').val()+','+$('#operacao').val(), "", true );
				}
				
				console.log('teste....',dsTeste);
				
				cargaTeste( dsTeste );
				
				trataCamposPF();
				atualizaFormulasPF();
				
			}
			
			function cargaTeste( dsTeste ){
				if( dsTeste != undefined && dsTeste != null ){
					var lstTeste = dsTeste.values;
					for ( var y in lstTeste ) {
						var teste = lstTeste[y];
				
						
						var row = "0";
						$( "input[name^=cod_tipo_teste___]" ).each(function( index ) {
							if( $(this).val() == teste.cod_tipo_teste ){
								row = $(this).attr('id').split('___')[1];
							}
						});
						
						if( row == "0" ){
							row = wdkAddChild('tipo_teste');
						}
						
						console.log('Add row ....' , row )
						$('#cod_tipo_teste___'+row).val( teste.cod_tipo_teste ) ;
						
						
						var cons = new Array();
						cons.push( DatasetFactory.createConstraint('cod_tipo_teste', teste.cod_tipo_teste, teste.cod_tipo_teste, ConstraintType.MUST) );
						var dsTesteCpl = DatasetFactory.getDataset('tipo_teste', null, cons, null );
						console.log('dsTesteCpl',dsTesteCpl);
						var tipo_teste = 'I';
						$('#obrigatorio___'+row).val( teste.obrigatorio );
						$('#seq_print___'+row).val( dsTesteCpl.values[0].seq_print );
						$('#den_tipo_teste___'+row).val( dsTesteCpl.values[0].den_tipo_teste ) ;
						if( teste.obrigatorio == 'S' ){
							$('#den_tipo_teste___'+row).val( '*'+dsTesteCpl.values[0].den_tipo_teste );
						}else if( teste.obrigatorio == 'U' ){
							$('#den_tipo_teste___'+row).val( '¹'+dsTesteCpl.values[0].den_tipo_teste );
						}
						$('#tipo_teste___'+row).val( dsTesteCpl.values[0].tipo_teste ) ;
						$('#tipo_controle___'+row).val( dsTesteCpl.values[0].tipo_controle ) ;
						if( dsTesteCpl != undefined && dsTesteCpl != null ){
							tipo_teste = dsTesteCpl.values[0].tipo_teste;
							num_precisao = dsTesteCpl.values[0].num_precisao;
							cod_um = dsTesteCpl.values[0].cod_um;
						}
						console.log('tipo_teste.....',tipo_teste);
						if( tipo_teste == 'O' ){
							if( $('#opcao___'+row+' option').length == 0 ){
								$('#opcao___'+row).show();
								$('#informado___'+row).hide();
								//$('#metrica___'+row).hide();
								//$('#metrica_media___'+row).hide();
								//$('#gr_metrica___'+row).hide();
								$('#metrica___'+row).hide();
								
								var dsOpcoes = getDsPaiFilho( "tipo_teste", "opcoes_teste", "cod_tipo_teste", teste.cod_tipo_teste, "", true );
								console.log('teste....',dsOpcoes);
							
								if( dsOpcoes != undefined && dsOpcoes != null ){
									var lstOpcoes = dsOpcoes.values;
									var aTemObs = [];
									$('#opcao___'+row).append("<option value='' ></option>");
									for ( var i in lstOpcoes ) {
										var opcoes = lstOpcoes[i];
										console.log('opcoes',opcoes);
										$('#opcao___'+row).append("<option value='"+ opcoes.cod_opcao +"' >"+ opcoes.den_opcao +"</option>");
										if( opcoes.tem_obs == 'S' ){
											aTemObs.push( opcoes.cod_opcao );	
										}
									}
									$('#opc_tem_obs___'+row).val( aTemObs.join(';') );
									if( aTemObs.length > 0 ){
										rowObs = wdkAddChild('tipo_teste');
										$('#cod_tipo_teste___'+rowObs).val( 'obs_'+teste.cod_tipo_teste ) ;
										$('#obrigatorio___'+rowObs).val( 'N' );
										$('#seq_print___'+rowObs).val( dsTesteCpl.values[0].seq_print );
										$('#print_laudo___'+rowObs).val( dsTesteCpl.values[0].print_laudo );
										$('#den_tipo_teste___'+rowObs).val( "Obs. "+dsTesteCpl.values[0].den_tipo_teste ) ;
										$('#tipo_teste___'+rowObs).val( 'I' );
										$('#opcao___'+rowObs).hide();
										$('#informado___'+rowObs).show();
										//$('#metrica___'+rowObs).hide();
										$('#metrica___'+rowObs).hide();
									}
								}
							}
						}else{
							$('#opcao___'+row).hide();								
							if( tipo_teste == 'M' ){
																
								//$('#metrica___'+row).show();
								//$('#metrica_media___'+row).show();
								//$('#gr_metrica___'+row).show();
								
								if( dsTesteCpl.values[0].atributo != "" && dsTesteCpl.values[0].atributo != undefined ){
									
									var ct = new Array();
									ct.push( DatasetFactory.createConstraint( 'table',		"man_relc_eqpto_item_atributo", 			null, 				  ConstraintType.MUST) );
									
									ct.push( DatasetFactory.createConstraint( 'empresa', 	$('#empresa').val(), 			$('#empresa').val(),  ConstraintType.MUST) );
									ct.push( DatasetFactory.createConstraint( 'item', 	$('#cod_item').val(), 			$('#cod_item').val(), ConstraintType.MUST) );
									ct.push( DatasetFactory.createConstraint( 'atributo', 	 dsTesteCpl.values[0].atributo, dsTesteCpl.values[0].atributo, ConstraintType.MUST) );
									
									var ds = DatasetFactory.getDataset('selectLogix', null, ct, null);
									console.log('dataset1 '+ds);
									//console.log('dataset1 '+ds.values[0]['conteudo_atributo']);
									if( ds.values.length > 0 ){
										console.log('dataset2 '+ds);
										var conteudo = ds.values[0]['CONTEUDO_ATRIBUTO'];
										console.log('conteudo '+conteudo);
										if( conteudo.indexOf("-") >= 0 ){
											dsTesteCpl.values[0].tol_abaixo = conteudo.split('-')[0].trim();
											dsTesteCpl.values[0].tol_acima = conteudo.split('-')[1].trim(); 
											dsTesteCpl.values[0].tol_abaixo_2 = "0,00";
											dsTesteCpl.values[0].tol_acima_2 = "0,00"; 
											teste.tol_abaixo = conteudo.split('-')[0].trim();
											teste.tol_acima = conteudo.split('-')[1].trim(); 
											teste.tol_abaixo_2 = "0,00";
											teste.tol_acima_2 = "0,00"; 
										}else{
												dsTesteCpl.values[0].valor_ref = conteudo;
												teste.valor_ref = conteudo;
											}	
										} else {
											//busca do item base da qualidade
											var ct1 = new Array();
											ct1.push( DatasetFactory.createConstraint( 'table',		"man_relc_eqpto_item_atributo", 			null, 				  ConstraintType.MUST) );
																						
											ct1.push( DatasetFactory.createConstraint( 'empresa', 	$('#empresa').val(), 			$('#empresa').val(),  ConstraintType.MUST) );
											ct1.push( DatasetFactory.createConstraint( 'item', 	$('#cod_item').val(), 			$('#cod_item').val(), ConstraintType.MUST) );
											ct1.push( DatasetFactory.createConstraint( 'atributo', 	 '10', '10', ConstraintType.MUST) );
																						
											var ds1 = DatasetFactory.getDataset('selectLogix', null, ct1, null);
											console.log('dataset10 '+ds1);
											if (ds1.values.length > 0) {
												var cod_item_base = ds1.values[0]['CONTEUDO_ATRIBUTO'].trim();
												console.log('cod_item_base '+cod_item_base);
												
												var ct2 = new Array();
												ct2.push( DatasetFactory.createConstraint( 'table',		"man_relc_eqpto_item_atributo", 			null, 				  ConstraintType.MUST) );
												
												ct2.push( DatasetFactory.createConstraint( 'empresa', 	$('#empresa').val(), 			$('#empresa').val(),  ConstraintType.MUST) );
												ct2.push( DatasetFactory.createConstraint( 'item', 	cod_item_base, 			cod_item_base, ConstraintType.MUST) );
												ct2.push( DatasetFactory.createConstraint( 'atributo', 	 dsTesteCpl.values[0].atributo, dsTesteCpl.values[0].atributo, ConstraintType.MUST) );
												
												var ds2 = DatasetFactory.getDataset('selectLogix', null, ct2, null);
												
												if( ds2.values.length > 0 ){
													console.log('dataset21 '+ds2);
													var conteudo = ds2.values[0]['CONTEUDO_ATRIBUTO'];
													console.log('conteudo '+conteudo);
													if( conteudo.indexOf("-") >= 0 ){
														dsTesteCpl.values[0].tol_abaixo = conteudo.split('-')[0].trim();
														dsTesteCpl.values[0].tol_acima = conteudo.split('-')[1].trim(); 
														dsTesteCpl.values[0].tol_abaixo_2 = "0,00";
														dsTesteCpl.values[0].tol_acima_2 = "0,00"; 
														teste.tol_abaixo = conteudo.split('-')[0].trim();
														teste.tol_acima = conteudo.split('-')[1].trim(); 
														teste.tol_abaixo_2 = "0,00";
														teste.tol_acima_2 = "0,00"; 
													}else{
															dsTesteCpl.values[0].valor_ref = conteudo;
															teste.valor_ref = conteudo;
														}	
												}
												
												//termina busca do item base da qualidade
											} 
										}
									}
								
						
								
								$('#metrica___'+row).show();
								$('#informado___'+row).hide();
								$('#num_precisao___'+row).val( dsTesteCpl.values[0].num_precisao );
								$('#aplic_formula___'+row).val( dsTesteCpl.values[0].aplic_formula );
								$('#formula___'+row).val( dsTesteCpl.values[0].formula );
								
								if( dsTesteCpl.values[0].tipo_controle != "T" ){
									$('#valor_ref___'+row).val( teste.valor_ref );
									$('#tol_acima___'+row).val( calcTol( teste.tipo_tol, teste.valor_ref, teste.tol_acima, 'S' )  );
									$('#tol_abaixo___'+row).val( calcTol( teste.tipo_tol, teste.valor_ref, teste.tol_abaixo, 'I' ) );
									$('#tol_acima_2___'+row).val( calcTol( teste.tipo_tol, teste.valor_ref, teste.tol_acima_2, 'S' ) );
									$('#tol_abaixo_2___'+row).val( calcTol( teste.tipo_tol, teste.valor_ref, teste.tol_abaixo_2, 'I' ) );
									$('#tipo_tol___'+row).val( teste.tipo_tol );
								}else{
									$('#valor_ref___'+row).val( dsTesteCpl.values[0].valor_ref );
									$('#tol_acima___'+row).val( calcTol( dsTesteCpl.values[0].tipo_tol, dsTesteCpl.values[0].valor_ref, dsTesteCpl.values[0].tol_acima, 'S' ) );
									$('#tol_abaixo___'+row).val( calcTol( dsTesteCpl.values[0].tipo_tol, dsTesteCpl.values[0].valor_ref, dsTesteCpl.values[0].tol_abaixo, 'I' ) );
									$('#tol_acima_2___'+row).val( calcTol( dsTesteCpl.values[0].tipo_tol, dsTesteCpl.values[0].valor_ref, dsTesteCpl.values[0].tol_acima_2, 'S' ) );
									$('#tol_abaixo_2___'+row).val( calcTol( dsTesteCpl.values[0].tipo_tol, dsTesteCpl.values[0].valor_ref, dsTesteCpl.values[0].tol_abaixo_2, 'I' ) );
									$('#tipo_tol___'+row).val( dsTesteCpl.values[0].tipo_tol );
								}
								
								if( dsTesteCpl.values[0].print_laudo == "C"
								 || dsTesteCpl.values[0].print_laudo == "O" ){
									$('#metrica___'+row).val( $('#valor_ref___'+row).val() );
								}else{
									if( $('#formula___'+row).val() == "" ){
										num_precisao = parseInt( dsTesteCpl.values[0].num_precisao.split(',')[0]  );
										$('#metrica___'+row).maskMoney( {precision : num_precisao, thousands : '.',decimal : ',', defaultZero : false, allowZero : true });
									}
								}
								
								$('#cod_um___'+row).val( dsTesteCpl.values[0].cod_um );
								$('#print_laudo___'+row).val( dsTesteCpl.values[0].print_laudo );
								
							
								
							}else{
								//$('#metrica___'+row).hide();
								//$('#metrica_media___'+row).hide();
								//$('#gr_metrica___'+row).hide();
								$('#metrica___'+row).hide();
								$('#informado___'+row).show();
							}
						}
					}
				}
			}
			
			function calcTol( tipo_tol, valor_ref, tolerancia, tipo ){
				if( tolerancia == null ){
					tolerancia = "0";
				}
				var result = "0";
				if( tipo_tol == 'F' ){
					var tol = parseFloat( tolerancia.replace('.','').replace(',','.'), "0" );
					result = tol;
				}else{
					var val = parseFloat( valor_ref.replace('.','').replace(',','.'), "0" ); 
					var tol = parseFloat( tolerancia.replace('.','').replace(',','.'), "0" );
					if( tipo_tol == 'A' ){
						if( tipo == "I" ){
							result = val - tol;
						}else{
							result = val + tol;
						} 
					}else if( tipo_tol == 'P' ){
						if( tipo == "I" ){
							result = val - ( val * tol / 100 );
						}else{
							result = val + ( val * tol / 100 );
						}
					}
				}
				return formatNumber( result, 6 );
			}
			
			var dsMedia = [];
			
			function buscaMediaTeste(){
				
				if( $('#cod_item').val() != "" 
				 && $('#num_lote').val() != "" 
			     && $('#cod_equipamento').val() != "" ){
				
					var ct = new Array();
					ct.push( DatasetFactory.createConstraint( 'tipo', 			"M", 						null, ConstraintType.MUST) );
					ct.push( DatasetFactory.createConstraint( 'cod_item', 		$('#cod_item').val(), 		null, ConstraintType.MUST) );
					ct.push( DatasetFactory.createConstraint( 'num_lote', 		$('#num_lote').val(), 		null, ConstraintType.MUST) );
					ct.push( DatasetFactory.createConstraint( 'cod_equipamento',$('#cod_equipamento').val(),null, ConstraintType.MUST) );
					var ds = DatasetFactory.getDataset("dsk_analise_qualidade", null, ct, null);
									
					console.log('dsk_laudo_qualidade P07..'+ds.values.length);
					
					dsMedia = ds.values;
					
					for ( var y in dsMedia ) {
						var media = dsMedia[y];
	
						$( "input[id^=cod_tipo_teste___]" ).each(function( index ) {
							
							if( $(this).val() == media['cod_tipo_teste'] ){
								var seq = $(this).attr('id').split('___')[1];
								
								console.log('media.....',media);
								$('#metrica_qtd___'+seq).val( media['quantidade'] );
								$('#metrica_total___'+seq).val( media['total'] );
								
								validaLinha( seq );
								
								
								/*var qtd = parseFloat( media['quantidade'] );
								var total = parseFloat( media['total'] );
								
								var metrica = parseFloat( isNull( $('#metrica___'+seq ).val().replace('.','').replace(',','.') ), "-1" )
								if( metrica != -1 && !isNaN(metrica) ){
									qtd = qtd+1;
									total = total+metrica;
								};
								$('#metrica_media___'+seq ).val( formatNumber( total / qtd, $('#num_precisao___'+seq ).val() ) );
								*/
							}
							
						});
							
					}
				}				
			}