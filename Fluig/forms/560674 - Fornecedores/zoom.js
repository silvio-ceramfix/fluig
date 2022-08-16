
			function getOptCombo( combo ){
				var optArray = new Array();
				$("#"+combo+" option").each(function () {
					optArray.push( $(this).val() );
				});
				return optArray;
			}

			function loadPais( campoPais, campoUser ){
				var order = new Array( 'COD_PAIS' );				
				var constraints = new Array();
				var dataset = null;
			    if ( campoUser != '' ){
			    	constraints.push( DatasetFactory.createConstraint("cod_user", $("#"+campoUser).val(), $("#"+campoUser).val(), ConstraintType.MUST) );
			    	dataset = DatasetFactory.getDataset('paises_repres', null, constraints, order);
			    }else{
			    	dataset = DatasetFactory.getDataset('paises', null, constraints, order);
			    }
		        // Busca o dataset
		        var qtd = 0;
		        var sel = '';
				if ( dataset != null ){
					$("#"+campoPais+" option").remove();
					$("#"+campoPais).append("<option value='' ></option>");
					for (var x = 0; x < dataset.values.length; x++) {					
						var row = dataset.values[x];
						qtd += 1;
						if ( $.inArray(  row[ 'COD_PAIS' ], getOptCombo( campoPais ) ) > -1 ){
							continue;
						}
						sel = row[ 'COD_PAIS' ];
						$("#"+campoPais).append("<option value='"+ row[ 'COD_PAIS' ] +"' >"+ row[ 'DEN_PAIS' ] +"</option>");
					}
				}
				if ( qtd == 1 ){
					$("#"+campoPais).val( sel );
				}
			}

			function loadUF( pais, campoUF, campoCid, campoUser ){
				var order = new Array( 'COD_UNI_FEDER' );				
				var constraints = new Array();
				constraints.push( DatasetFactory.createConstraint("cod_pais", pais, pais, ConstraintType.MUST) );
				var dataset = null;
			    if ( campoUser != '' ){
			    	constraints.push( DatasetFactory.createConstraint("cod_user", $("#"+campoUser).val(), $("#"+campoUser).val(), ConstraintType.MUST) );
			    	dataset = DatasetFactory.getDataset('uf_repres', null, constraints, order);
			    }else{
			    	dataset = DatasetFactory.getDataset('uf', null, constraints, order);
			    }
		        // Busca o dataset
		        var qtd = 0;
		        var sel = '';
				if ( dataset != null ){
					$("#"+campoUF+" option").remove();
					$("#"+campoUF).append("<option value='' ></option>");
					for (var x = 0; x < dataset.values.length; x++) {					
						var row = dataset.values[x];
						qtd += 1;
						if ( $.inArray(  row[ 'COD_UNI_FEDER' ], getOptCombo( campoUF ) ) > -1 ){
							continue;
						}
						sel = row[ 'COD_UNI_FEDER' ];
						$("#"+campoUF).append("<option value='"+ row[ 'COD_UNI_FEDER' ] +"' >"+ row[ 'COD_UNI_FEDER' ] +"</option>");
					}
				}
				if ( qtd == 1 ){ 
					$("#"+campoUF).val( sel );
					// setFilterUF( 'estado', 'cidade', 'userFluig' );
				}
			}

			function loadTipoClient( campoTC ){
				
				
				
				$("#"+campoTC+" option").remove();
				$("#"+campoTC).append("<option value='' ></option>");
				
						var constraintsFilhos = new Array();
						constraintsFilhos.push( DatasetFactory.createConstraint("cod_tip_cli", '98', '99', ConstraintType.MUST) );
						var datasetFilhos = DatasetFactory.getDataset('tipo_cliente', null, constraintsFilhos, null);
						var filhos = datasetFilhos.values;
						for (var i = 0; i < filhos.length; i++){
							
							console.log( 'Entrei....i', i );
							
							var filho = filhos[i];
							$("#"+campoTC).append("<option value='"+ filho.COD_TIP_CLI +"' >"+ filho.DEN_TIP_CLI +"</option>");
							temTipoCliente = 1;
						}
				return temTipoCliente;
			}
			
			function loadBairro( cidade, campoBairro ){			
			    // Cria as constraints para buscar os campos filhos, passando o
				// tablename, número da formulário e versão
			    var c1 = DatasetFactory.createConstraint("cod_cidade", cidade, cidade, ConstraintType.MUST);
		        var constraints = new Array(c1);
				var order = new Array( 'DEN_BAIRRO' );			
		        // Busca o dataset
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
			
			function setFilterUF( campoUF, campoCid, campoUser ){			
				console.log( 'USER.....'+$("#userFluig").val() );
				console.log( 'UF.....'+$("#"+campoUF).val() );
				console.log( campoCid,'FLT.....'+"cod_uni_feder,"+$("#"+campoUF).val()+",cod_user,"+$("#"+campoUser).val() );
				if ( campoUser == '' ){
					reloadZoomFilterValues(campoCid, "cod_uni_feder,"+$("#"+campoUF).val() );
				}else{
					reloadZoomFilterValues(campoCid, "cod_uni_feder,"+$("#"+campoUF).val()+",cod_user,"+$("#"+campoUser).val() );
				}
				$("#"+campoCid).val( '' );
			}	
			

			function setFilterCliente( user, campoCli ){
				if ($('#tipCadUser').val() == 'A') {
					console.log('Filter..... é A');
					reloadZoomFilterValues(campoCli, "" );
				}
				else {
					console.log('Filter.....'+user);
					reloadZoomFilterValues(campoCli, "cod_user,"+user );
				}
			}			
			
			
			function setSelectedZoomItem(selectedItem) {  
				console.log('teste do nome '+selectedItem);
				if ( selectedItem.inputName == 'cidade' ){
					console.log('entrou na cidade1');
					$('#cod_cidade').val( selectedItem.cod_cidade );
					$('#cep').focus();
					loadBairro( $('#cod_cidade').val(), 'bairro_sel' );
					
					var constraints = new Array();
					constraints.push( DatasetFactory.createConstraint("cod_cidade", selectedItem.cod_cidade, selectedItem.cod_cidade, ConstraintType.MUST) );
					var dataset = DatasetFactory.getDataset('cidades', null, constraints, null);
					if ( dataset != null ){
						for (var x = 0; x < dataset.values.length; x++) {						
							var row = dataset.values[x];
							console.log('Console.....',row);
							$('#pais').val( loadCampoDataSet( 'paises', 'cod_pais', row.COD_PAIS, 'DEN_PAIS' ) );
							$('#cod_pais').val( row.COD_PAIS );
							$('#estado').val( row.COD_UNI_FEDER );
							if( $('#pais_cob').val() == "" ){
								$('#pais_cob').val( row.COD_PAIS );
								loadUF( row.COD_PAIS, 'estado_cob', 'cidade_cob', '' );
							}
						}
					}
					
				}
				if ( selectedItem.inputName == 'cidade_geral' ){
					console.log('entrou no cidades_geral');
					
					$('#cod_cidade').val( selectedItem.cod_cidade );
					$('#cep').focus();
					loadBairro( $('#cod_cidade').val(), 'bairro_sel' );
					
					var constraints = new Array();
					constraints.push( DatasetFactory.createConstraint("cod_cidade", selectedItem.cod_cidade, selectedItem.cod_cidade, ConstraintType.MUST) );
					var dataset = DatasetFactory.getDataset('cidades', null, constraints, null);
					if ( dataset != null ){
						for (var x = 0; x < dataset.values.length; x++) {						
							var row = dataset.values[x];
							console.log('Console.....',row);
							$('#pais').val( loadCampoDataSet( 'paises', 'cod_pais', row.COD_PAIS, 'DEN_PAIS' ) );
							$('#cod_pais').val( row.COD_PAIS );
							$('#estado').val( row.COD_UNI_FEDER );
							if( $('#pais_cob').val() == "" ){
								$('#pais_cob').val( row.COD_PAIS );
								loadUF( row.COD_PAIS, 'estado_cob', 'cidade_cob', '' );
							}
						}
					}
					
				}
				if( selectedItem.inputName == 'cidade_cob' ){
					$('#cod_cidade_cob').val( selectedItem.cod_cidade );
					$('#cep_cob').focus();
					loadBairro( selectedItem.cod_cidade, 'bairro_cob_sel' );
				}
				if( selectedItem.inputName == 'razao_social_zoom' ){
						
					myLoading2.show();

					setTimeout(
						function () {
								clearForm('zoomCliente');
								loadCliente( selectedItem.cod_cliente );
								myLoading2.hide();
						}, 100);
				}
				if ( selectedItem.inputName == 'representante' ){
					$('#cod_repres').val( selectedItem.cod_repres );
					$('#nom_representante').val( selectedItem.raz_social );
				}
				
			}

			function loadCampoDataSet( denDataSet, campo, valor, campoRetorno ){			
			    var c1 = DatasetFactory.createConstraint( campo, valor, valor, ConstraintType.MUST);
		        var constraints = new Array(c1);
		        // Busca o dataset
		        var dataset = DatasetFactory.getDataset( denDataSet, null, constraints, null);
				if ( dataset != null ){
					for (var x = 0; x < dataset.values.length; x++) {
						var row = dataset.values[x];
						return row[ campoRetorno ];
					}
				}
				return ' ';
				
			}
			
			
			function loadCliente( codCliente ){
				
				
				// ###### BUSCA DADOS CLIENTE - LOGIX REST
				var c1 = DatasetFactory.createConstraint("cod_cliente", codCliente, codCliente, ConstraintType.MUST);
		        var constraints = new Array(c1);
		        // Busca o dataset
		        var dataset = DatasetFactory.getDataset('cliente_rest', null, constraints, null);
				if ( dataset == null ){
						FLUIGC.toast({
							title: 'Conexao: ',
							message: 'Encontrado problema na conexão com servidor Logix',
							type: 'warning',
							timeout: 'slow'
						});						
						return false;
				}
				for (var x = 0; x < dataset.values.length; x++) {

					
					var row = dataset.values[x];
					$('#razao_social').val( row[ 'nom_cliente' ] );
					$('#nom_reduzido').val( row[ 'nom_reduzido' ] );
					$('#fone').val( row[ 'num_telefone' ] );
					$('#fax').val( row[ 'num_fax' ] );
					console.log( 'Tipo LOG....'+row[ 'tip_logradouro' ]  );
					$('#tipo_logradouro').val( row[ 'tip_logradouro' ] );
					
					$('#endereco').val( row[ 'logradouro' ] );
					
					// número
					if ( $.isNumeric( row[ 'num_iden_lograd' ] ) )
						$('#sem_numero').prop('checked', false);
					else
						$('#sem_numero').prop('checked', true);
					setSemNumero( $('#sem_numero').attr('id'), 'numero' );
					if ( $.isNumeric( row[ 'num_iden_lograd' ] ) )
						$('#numero').val( row[ 'num_iden_lograd' ] );
					
					$('#pais').val( row[ 'cod_pais' ] );
					$('#cod_pais').val( row[ 'cod_pais' ] );
					// loadUF( row[ 'cod_pais' ], 'estado', 'cidade',
					// 'userFluig' );
					// chamar carga estado
					console.log('Estado-'+row[ 'cod_uni_feder' ]);
					$('#estado').val( row[ 'cod_uni_feder' ] );
					// chamar filtro cidade
					// setFilterUF( 'estado', 'cidade', 'userFluig' );
					
					$('#tipo_cliente').val( row[ 'cod_tip_cli' ] );
					//tratamento para que quando o canal for engenharia permita selecionar qualquer cidade
					var tipoCli = $('#tipo_cliente').val();
					console.log('tipo ',tipoCli);
					var constraintsPai = new Array();
					constraintsPai.push( DatasetFactory.createConstraint("cod_tip_cli", tipoCli, tipoCli, ConstraintType.MUST) );
				
				    var datasetPai = DatasetFactory.getDataset("tipo_cliente", null, constraintsPai, null);
				   
					if ( datasetPai != null ){
						for (var x = 0; x < datasetPai.values.length; x++) {	
						console.log(datasetPai);	
						var per_sel_cidades = 'N';
						per_sel_cidades = datasetPai.values[x].PER_SEL_CIDADES;
						console.log(per_sel_cidades);
						if (per_sel_cidades == null || per_sel_cidades == ''){
							per_sel_cidades = 'N';
						}
						per_sel_cidades = per_sel_cidades.trim();
							if (per_sel_cidades == 'S'){
								console.log('entrou em cidades');
								$('#per_sel_cidades').val('S');
								//setFilterCidade( 'cidade', '', '' );
							} else {
								$('#per_sel_cidades').val('N');
								//setFilterCidade( 'cidade', 'userFluig', 'cod_repres' );
							} 	
						}
					} else {
						$('#per_sel_cidades').val('N');
					}
					
					if ($('#tipCadUser').val() == 'A'){
						$('#per_sel_cidades').val('S');
					}
					
					//fim tratamento para que quando o canal for engenharia permita selecionar qualquer cidade
					
					var per_sel_cidades = $('#per_sel_cidades').val();
					var constraints = new Array();
					constraints.push( DatasetFactory.createConstraint("cod_uni_feder", row[ 'cod_uni_feder' ] , row[ 'cod_uni_feder' ] , ConstraintType.MUST) );
					constraints.push( DatasetFactory.createConstraint("cod_cidade", row[ 'cod_cidade' ] , row[ 'cod_cidade' ] , ConstraintType.MUST) );
					constraints.push( DatasetFactory.createConstraint("cod_user", $("#userFluig").val(), $("#userFluig").val(), ConstraintType.MUST) );
					dataset = DatasetFactory.getDataset('cidades_repres', null, constraints, null);
					if ( dataset != null && dataset != undefined && dataset.values.length == 0 && per_sel_cidades == 'N'){
							FLUIGC.toast({
								title: 'Validacao: ',
								message: 'A cidade['+ row[ 'cod_cidade' ] +'] nao faz parte de sua area de atuacao, favor contactar departamento de administracao comercial!"',
								type: 'danger',
								timeout: 'slow'
							});	
					}else{
						$('#cod_cidade').val( row[ 'cod_cidade' ] );
						console.log('AQUIIIIII CIDADE...........'+$('#cod_cidade').val() );
						var denCidade = loadCampoDataSet( 'cidades', 'cod_cidade', row[ 'cod_cidade' ], 'DEN_CIDADE' );
						console.log('CIDADE.....'+denCidade );
						if ( denCidade != ' ' ){
							var zoomDestino = {};
							// var objDestino = { inputId:'cidade',
							// inputName:'cidade', cod_cidade :row[ 'cod_cidade'
							// ], den_cidade:denCidade };
							// console.log('CIDADE.....',objDestino );
							zoomDestino = window[ $("#cidade").attr('filter-instance') ];
							console.log('CIDADE.....', zoomDestino );
							// zoomDestino.setValue( objDestino );
							zoomDestino.setValue( denCidade );
						}
						loadBairro( row[ 'cod_cidade' ], 'bairro_sel' );
						console.log('Bairro....'+row[ 'den_bairro' ] );
						$('#bairro_sel').val( row[ 'den_bairro' ] );
						if ( $('#bairro_sel').val() == undefined || $('#bairro_sel').val() == null || $('#bairro_sel').val() == '' ){
							$('#bairro').val( row[ 'den_bairro' ] );
							$("#ies_bairro_manual").prop("checked", true);
							alteraCampos( 'ies_bairro_manual', 'bairro_sel', 'bairro' );
						}
					}

					console.log( row[ 'num_cgc_cpf' ] );
					$('#cnpj').val( row[ 'num_cgc_cpf' ] );
					
					console.log( row[ 'num_cgc_cpf' ] );
					
					console.log( 'UF....'+row[ 'cod_uni_feder' ] );
					var eiNum = '';
					if ( row[ 'ins_estadual' ] != null )
						eiNum = row[ 'ins_estadual' ].replace(/[^0-9]/g,'');
					console.log( 'IE...'+eiNum+' '+row[ 'ins_estadual' ] );
					if (eiNum == ''){
						$('#isento_ie').prop('checked', true);
						setIsento( 'isento_ie', 'ie', 'estado' );
					}else{
						$('#isento_ie').prop('checked', false);
						setIsento( 'isento_ie', 'ie', 'estado' );
						$('#ie').val( row[ 'ins_estadual' ] );
						if ( row[ 'cod_uni_feder' ] != '' ){
							$('#ie').mask( mascaraIE[ row[ 'cod_uni_feder' ] ] );
						}
					}
					
					// atualiza descrição
					$('#cep').val( row[ 'cod_cep' ] );
					$('#rede').val( row[ 'num_telex' ] );
					
					$('#complemento').val( row[ 'compl_endereco' ] );
					
					$('#e_mail_cob').val( row[ 'email_cob' ] );
					$('#tipo_logradouro_cob').val( row[ 'tip_logradouro_end_cob' ] );
					$('#endereco_cob').val( row[ 'logradouro_end_cob' ] );
					
					console.log( row[ 'num_iden_lograd_end_cob' ] );
					// numero
					if ( $.isNumeric( row[ 'num_iden_lograd_end_cob' ] ) )
						$('#sem_numero_cob').prop('checked', false);
					else
						$('#sem_numero_cob').prop('checked', true);
					setSemNumero( $('#sem_numero_cob').attr('id'), 'numero_cob' );
					if ( $.isNumeric( row[ 'num_iden_lograd_end_cob' ] ) )
						$('#numero_cob').val( row[ 'num_iden_lograd_end_cob' ] );
					
					$('#cod_cidade_cob').val( row[ 'cod_cidade_end_cob' ] );
					$('#complemento_cob').val( row[ 'complemento_endereco_end_cob' ] );
					
					console.log( row[ 'cod_cidade_end_cob' ] );
					
					var cod_pais_cob = loadCampoDataSet( 'cidades', 'cod_cidade', row[ 'cod_cidade_end_cob' ], 'COD_PAIS' );
					var cod_uf_cob = loadCampoDataSet( 'cidades', 'cod_cidade', row[ 'cod_cidade_end_cob' ], 'COD_UNI_FEDER' );
					$('#pais_cob').val( cod_pais_cob );
					loadUF( cod_pais_cob, 'estado_cob', 'cidade_cob', '' );
					$('#estado_cob').val( cod_uf_cob );
					setFilterUF( 'estado_cob', 'cidade_cob', '' );

										
					var denCidade = loadCampoDataSet( 'cidades', 'cod_cidade', row[ 'cod_cidade_end_cob' ], 'DEN_CIDADE' );
					if ( denCidade != ' ' ){
						var zoomDestinoCob = {};
						// var objDestinoCob = { inputId:'cidade_cob',
						// inputName:'cidade_cob', cod_cidade :row[
						// 'cod_cidade_end_cob' ], den_cidade:denCidade };
						zoomDestinoCob = window[$("#cidade_cob").attr('filter-instance')];
						// console.log( objDestinoCob );
						// zoomDestinoCob.setValue( objDestinoCob );
						zoomDestinoCob.setValue( denCidade );
					}
					
					$('#cep_cob').val( row[ 'cod_cep_end_cob' ] );
					
					loadBairro( row[ 'cod_cidade_end_cob' ], 'bairro_cob_sel' );					
					$('#bairro_cob_sel').val( row[ 'bairro_cobr_entga' ] );
					if ( $('#bairro_cob_sel').val() == undefined || $('#bairro_cob_sel').val() == null || $('#bairro_cob_sel').val() == '' ){
						$('#bairro_cob').val( row[ 'bairro_cobr_entga' ] );
						$("#ies_bairro_cob_manual").prop("checked", true);
						alteraCampos( 'ies_bairro_cob_manual', 'bairro_cob_sel', 'bairro_cob' );
					}					

					// ##### Carrega lista de e-mail
					var listaMail = JSON.parse( row[ 'lista_mail' ] );				
					for (var i = 0; i < listaMail.length; i++){
						var obj = listaMail[i];
						if ( obj.email != '' ){
							var seq = wdkAddChild('lista_email'); 
							$('#email___'+seq).val( obj.email ) ;
							$('#tip_registro___'+seq).val( obj.tip_registro  ) ;
							$('#grupo_email___'+seq).val( obj.grupo_email ) ;
						}
					}
					
					// ##### Carrega lista de contatos
					var listaContato = JSON.parse( row[ 'lista_contato' ] );
					for (var i = 0; i < listaContato.length; i++){
						var obj = listaContato[i];
					    var seq = wdkAddChild('contatos'); 
					    $('#nome_contato___'+seq).val( obj.nom_contato ) ;
					    $('#tipo_contato___'+seq).val( obj.cod_cargo  ) ;
					    $('#fone_contato___'+seq).val( obj.num_telefone ) ;
					    $('#celular_contato___'+seq).val( obj.num_fax ) ;
					    $('#email_contato___'+seq).val( obj.email ) ;
					    
					    
					    $('#dat_nascimento___'+seq).val( obj.dat_nascimento ) ;
					    $('#cod_hobby___'+seq).val( obj.cod_hobby ) ;
					    $('#num_ramal___'+seq).val( obj.num_ramal ) ;
					    $('#departnto___'+seq).val( obj.departnto ) ;
					    $('#setor___'+seq).val( obj.setor ) ;
					    $('#observacao___'+seq).val( obj.observacao ) ;
					    
					}
					
					var constraintsPai = new Array( DatasetFactory.createConstraint("cnpj", row[ 'num_cgc_cpf' ], row[ 'num_cgc_cpf' ], ConstraintType.MUST) );
					var datasetPai = DatasetFactory.getDataset('clientesFluig', null, constraintsPai, null);
					if ( dataset != null ){
						for (var x = 0; x < datasetPai.values.length; x++) {
							var pai = datasetPai.values[x];
							
							var constraintsFilhos = new Array();
							constraintsFilhos.push( DatasetFactory.createConstraint("tablename", "bancos", "bancos", ConstraintType.MUST) );
							constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pai.documentid, pai.documentid, ConstraintType.MUST) );
							constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pai.version, pai.version, ConstraintType.MUST) );
							var datasetFilhos = DatasetFactory.getDataset('clientesFluig', null, constraintsFilhos, null);
							if ( datasetFilhos != null ){
								var filhos = datasetFilhos.values;
								for ( var i in filhos ) {
									var filho = filhos[i];
									var seq = wdkAddChild('bancos'); 
									$('#banco___'+seq).val( filho.banco ) ;
									$('#agencia___'+seq).val( filho.agencia ) ;
								}
							}

							var constraintsFilhos = new Array();
							constraintsFilhos.push( DatasetFactory.createConstraint("tablename", "comercial", "comercial", ConstraintType.MUST) );
							constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pai.documentid, pai.documentid, ConstraintType.MUST) );
							constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pai.version, pai.version, ConstraintType.MUST) );
							var datasetFilhos = DatasetFactory.getDataset('clientesFluig', null, constraintsFilhos, null);
							if ( datasetFilhos != null ){
								var filhos = datasetFilhos.values;
								for ( var i in filhos ) {
									var filho = filhos[i];
									var seq = wdkAddChild('comercial'); 
									$('#empresa_ref___'+seq).val( filho.empresa_ref ) ;
									$('#contato_ref___'+seq).val( filho.contato_ref ) ;
									$('#fone_ref___'+seq).val( filho.fone_ref ) ;
								}
							}

							// ### BENS
							var constraintsFilhos = new Array();
							constraintsFilhos.push( DatasetFactory.createConstraint("tablename", "bens", "bens", ConstraintType.MUST) );
							constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pai.documentid, pai.documentid, ConstraintType.MUST) );
							constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pai.version, pai.version, ConstraintType.MUST) );
							var datasetFilhos = DatasetFactory.getDataset('clientesFluig', null, constraintsFilhos, null);
							if ( datasetFilhos != null ){
								var filhos = datasetFilhos.values;
								for ( var i in filhos ) {
									var filho = filhos[i];
									var seq = wdkAddChild('bens'); 
									$('#especie_bem___'+seq).val( filho.especie_bem ) ;
									console.log('..............'+"input[name=proprietario_bem___"+seq+"][value="+filho.proprietario_bem+"]");
									// $("input[name=proprietario_bem___2][value=proprietario_bem_emp]").prop('checked',
									// true);
									// $("#"+pai.proprietario_bem+"___"+seq).attr("checked",true);
									// input[name=proprietario_bem___2][value=proprietario_bem_pro]
									$("input[name=proprietario_bem___"+seq+"][value="+filho.proprietario_bem+"]").prop('checked', true);
									// $('#proprietario_bem___'+seq).val(
									// filho.proprietario_bem ) ;
									$('#localizacao_bem___'+seq).val( filho.localizacao_bem ) ;
									$('#valor_bem___'+seq).val( filho.valor_bem ) ;
								}
							}
							$('#onus_sob_bens').val( pai.onus_sob_bens );

							// ### INFO
							var constraintsFilhos = new Array();
							constraintsFilhos.push( DatasetFactory.createConstraint("tablename", "infor_repres", "infor_repres", ConstraintType.MUST) );
							constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pai.documentid, pai.documentid, ConstraintType.MUST) );
							constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pai.version, pai.version, ConstraintType.MUST) );
							var datasetFilhos = DatasetFactory.getDataset('clientesFluig', null, constraintsFilhos, null);
							if ( datasetFilhos != null ){
								var filhos = datasetFilhos.values;
								for ( var i in filhos ) {
									var filho = filhos[i];
									var seq = wdkAddChild('infor_repres'); 
									$('#tipo_infor___'+seq).val( filho.tipo_infor ) ;
									$('#qualidade___'+seq).val( filho.qualidade ) ;
									$('#comentario_repres___'+seq).val( filho.comentario_repres ) ;
								}
							}
							$('#parecer_repres').val( pai.parecer_repres );							

							$('#val_primero_pedido').val( pai.val_primero_pedido );
							$('#val_media_compras').val( pai.val_media_compras );
							$('#toneladas').val( pai.toneladas );
							$('#val_capital_inicial').val( pai.val_capital_inicial );
							$('#val_capital_atual').val( pai.val_capital_atual );

							$("#"+pai.ies_predio).attr("checked",true);

							// $('#ies_predio').val( pai.ies_predio );
							$('#val_aluguel').val( pai.val_aluguel );
							$('#val_seg_estoque').val( pai.val_seg_estoque );
							$('#val_seg_instalacoes').val( pai.val_seg_instalacoes );
							$('#val_seg_imoveis').val( pai.val_seg_imoveis );
							$('#val_seg_veiculos').val( pai.val_seg_veiculos );
							$('#seguradora').val( pai.seguradora );
							
							// ##### Carrega lista de socios
							var listaSocio = JSON.parse( row[ 'lista_socio' ] );
							for (var i = 0; i < listaSocio.length; i++){
								var obj = listaSocio[i];
								var seq = wdkAddChild('socios_diretores'); 
								$('#nome_socio___'+seq).val( obj.nom_socio ) ;
								$('#cpf_socio___'+seq).mask('999.999.999/9999-99');
								$('#cpf_socio___'+seq).val( obj.num_cpf_socio ) ;

								// ### INFO
								var constraintsFilhos = new Array();
								constraintsFilhos.push( DatasetFactory.createConstraint("tablename", "socios_diretores", "socios_diretores", ConstraintType.MUST) );
								constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pai.documentid, pai.documentid, ConstraintType.MUST) );
								constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pai.version, pai.version, ConstraintType.MUST) );
								constraintsFilhos.push( DatasetFactory.createConstraint("cpf_socio", obj.num_cpf_socio, obj.num_cpf_socio, ConstraintType.MUST) );
								var datasetFilhos = DatasetFactory.getDataset('clientes', null, constraintsFilhos, null);
								var filhos = datasetFilhos.values;
								for ( var x in filhos ) {
									var filho = filhos[x];
									$('#part_socio___'+seq).val( filho.part_socio );
								}
							}
						}
					}

					$('#cod_cliente').val( row[ 'cod_cliente' ] );
					$('#cod_class').val( row[ 'cod_class' ] );
					$('#num_caixa_postal').val( row[ 'num_caixa_postal' ] );
					$('#num_suframa').val( row[ 'num_suframa' ] );
					$('#den_marca').val( row[ 'den_marca' ] );					
					$('#den_frete_posto').val( row[ 'den_frete_posto' ] );	
					$('#cod_portador').val( row[ 'cod_portador' ] );
					$('#ies_tip_portador').val( row[ 'ies_tip_portador' ] );
					$('#cod_cliente_matriz').val( row[ 'cod_cliente_matriz' ] );
					$('#cod_consig').val( row[ 'cod_consig' ] );
					$('#ies_cli_forn').val( row[ 'ies_cli_forn' ] );
					$('#ies_zona_franca').val( row[ 'ies_zona_franca' ] );
					$('#ies_situacao').val( row[ 'ies_situacao' ] );
					$('#cod_rota').val( row[ 'cod_rota' ] );
					$('#cod_praca').val( row[ 'cod_praca' ] );
					$('#dat_cadastro').val( row[ 'dat_cadastro' ] );
					$('#dat_atualiz').val( row[ 'dat_atualiz' ] );
					$('#nom_contato').val( row[ 'nom_contato' ] );
					$('#dat_fundacao').val( row[ 'dat_fundacao' ] );
					$('#cod_local').val( row[ 'cod_local' ] );
					$('#correio_eletronico').val( row[ 'correio_eletronico' ] );
					$('#correi_eletr_secd').val( row[ 'correi_eletr_secd' ] );
					$('#correi_eletr_venda').val( row[ 'correi_eletr_venda' ] );
					$('#endereco_web').val( row[ 'endereco_web' ] );
					$('#telefone_2').val( row[ 'telefone_2' ] );
					$('#iden_estrangeiro').val( row[ 'iden_estrangeiro' ] );
					$('#ind_cprb').val( row[ 'ind_cprb' ] );
					$('#tipo_servico').val( row[ 'tipo_servico' ] );
					$('#ies_contrib_ipi').val( row[ 'ies_contrib_ipi' ] );
					$('#ies_fis_juridica').val( row[ 'ies_fis_juridica' ] );
					$('#nom_guerra').val( row[ 'nom_guerra' ] );
					$('#cod_cidade_pgto').val( row[ 'cod_cidade_pgto' ] );
					$('#camara_comp').val( row[ 'camara_comp' ] );
					$('#cod_banco').val( row[ 'cod_banco' ] );
					$('#num_agencia').val( row[ 'num_agencia' ] );
					$('#num_conta_banco').val( row[ 'num_conta_banco' ] );
					$('#tmp_transpor').val( row[ 'tmp_transpor' ] );
					$('#tex_observ').val( row[ 'tex_observ' ] );
					$('#num_lote_transf').val( row[ 'num_lote_transf' ] );
					$('#pct_aceite_div').val( row[ 'pct_aceite_div' ] );
					$('#ies_tip_entrega').val( row[ 'ies_tip_entrega' ] );
					$('#ies_dep_cred').val( row[ 'ies_dep_cred' ] );
					$('#ult_num_coleta').val( row[ 'ult_num_coleta' ] );
					$('#ies_gera_ap').val( row[ 'ies_gera_ap' ] );
					$('#cod_nivel_1').val( row[ 'cod_nivel_1' ] );
					$('#cod_nivel_2').val( row[ 'cod_nivel_2' ] );
					$('#cod_nivel_3').val( row[ 'cod_nivel_3' ] );
					$('#cod_nivel_4').val( row[ 'cod_nivel_4' ] );
					$('#cod_nivel_5').val( row[ 'cod_nivel_5' ] );
					$('#cod_nivel_6').val( row[ 'cod_nivel_6' ] );
					$('#cod_nivel_7').val( row[ 'cod_nivel_7' ] );
					$('#ies_nivel').val( row[ 'ies_nivel' ] );
					$('#cod_tip_carteira').val( row[ 'cod_tip_carteira' ] );
					$('#cod_mercado').val( row[ 'cod_mercado' ] );
					$('#cod_continente').val( row[ 'cod_continente' ] );
					$('#cod_regiao').val( row[ 'cod_regiao' ] );
					$('#qtd_dias_atr_dupl').val( row[ 'qtd_dias_atr_dupl' ] );
					$('#qtd_dias_atr_med').val( row[ 'qtd_dias_atr_med' ] );
					$('#val_ped_carteira').val( row[ 'val_ped_carteira' ] );
					$('#val_dup_aberto').val( row[ 'val_dup_aberto' ] );
					$('#dat_ult_fat').val( row[ 'dat_ult_fat' ] );
					$('#val_limite_cred').val( row[ 'val_limite_cred' ] );
					$('#dat_val_lmt_cr').val( row[ 'dat_val_lmt_cr' ] );
					$('#ies_nota_debito').val( row[ 'ies_nota_debito' ] );
					$('#represOld').val(getRepresUserTipoCli( $('#userFluig').val(), $('#tipo_cliente').val() ));
					
					//recupera o codigo do representante do cliente
					/*var cod_cliente = $('#cod_cliente').val();
					var constraints = new Array();
					constraints.push(DatasetFactory.createConstraint("cod_cliente", cod_cliente, cod_cliente, ConstraintType.MUST));
					var datasetCliente = DatasetFactory.getDataset("clientes_logix", null, constraints, null);
					console.log('datasetCliente ', datasetCliente);
					if ( datasetCliente != null ){
						for (var x = 0; x < datasetCliente.values.length; x++) {
							console.log('COD REPRES1...',datasetCliente.values[x]["COD_REPRES"]);
							
							var cod_repres = datasetCliente.values[x]["COD_REPRES"];
							var cod_tip_cli = datasetCliente.values[x]["COD_TIP_CLI"];
							
							console.log('COD_TIP_CLIENTE...',cod_tip_cli);
							$('#tipo_cliente').val(cod_tip_cli);
							console.log('COD_REPRES...',cod_repres);
							$('#cod_repres').val(cod_repres);
						}
					}*/
					//fim recupera o codigo do representante do cliente
					campo = $('#tipo_cadastro').val();
					console.log(' setTipoFormulario '+$( '#task').val());
					if (campo != 'A'){
						setTipoCliente('load');
					}
					
					
					break;
				}

			}

			
			function getRepresUserTipoCli( user, tipCli ){
				
				console.log(" ##### antes busca repres ##### ");
				var constraintsPai = new Array();
				constraintsPai.push( DatasetFactory.createConstraint("matricula", user, user, ConstraintType.MUST,true) );
				constraintsPai.push( DatasetFactory.createConstraint("tipo_cadastro", 'R', 'R', ConstraintType.MUST) );
				constraintsPai.push( DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST) );
			    var datasetPai = DatasetFactory.getDataset("representante_compl", null, constraintsPai, null);
			    console.log(" ##### dts Pai busca repres ##### ",datasetPai);

				if ( datasetPai != null ){
					for (var x = 0; x < datasetPai.values.length; x++) {
						var constraintsFilhos = new Array();
						
						console.log(" ##### busca repres ##### ", datasetPai.values[x]["cod_repres"] );
						constraintsFilhos.push( DatasetFactory.createConstraint("tablename", "tipo_cliente", "tipo_cliente", ConstraintType.MUST) );
						constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", datasetPai.values[x]["documentid"], datasetPai.values[x]["documentid"], ConstraintType.MUST) );
						constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", datasetPai.values[x]["version"], datasetPai.values[x]["version"], ConstraintType.MUST) );
						constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST) );
						constraintsFilhos.push( DatasetFactory.createConstraint("cod_tip_cli", tipCli, tipCli, ConstraintType.MUST) );
				    	 
						var datasetFilhos = DatasetFactory.getDataset("representante_compl", null, constraintsFilhos, null);
				    	console.log('representante_compl ',datasetFilhos); 
						console.log('retorn filho....', datasetFilhos.values.length, datasetFilhos);
						if ( datasetFilhos != null && datasetFilhos.values.length > 0 ){
							console.log(" ##### entrei filho  busca repres ##### " + datasetPai.values[x]["cod_repres"] );
							$('#cod_repres').val( datasetPai.values[x]["cod_repres"] );
							$('#nom_representante').val( datasetPai.values[x]["raz_social"] );
							return datasetPai.values[x]["cod_repres"];
						}
				    }
				}	
		}
			
			
var myLoading2 = FLUIGC.loading(window);			
function searchCPNJ() {
	
	/*if( $('#tipo_cadastro').val() != "N" ){
		return false;
	}*/
	
	var cnpj = $('#cnpj').val();
	if( cnpj.indexOf("/0000-") == -1 ){
		cnpj = cnpj.substring(1).replace(/[^\d]+/g, '');
	}else{
		return false;;
	}
	myLoading2.show();
	//situacao
	$.ajax({
		async: false,
		type: "GET",
		dataType: 'json',
		url: 'https://receitaws.com.br/v1/cnpj/' + cnpj + "?callback=?",
		success: function (data) {
			console.log(data)
			
			if( data.status == "ERROR" ){
				alert( data.message );
				myLoading2.hide();
			}
			
			var nome = (data.fantasia ? data.fantasia : data.nome);
			$("#nom_reduzido").val(nome);
							
			var cod_cidade = buscaCidade(data.uf.trim(), data.municipio.trim());
			if( cod_cidade != -1 ){
				loadBairro( $('#cod_cidade' ).val(), 'bairro_sel' );
				buscaBairro(cod_cidade, data.bairro)
			}
			
			var tipo = buscaTipoLogradouro(data.logradouro);
			if( tipo.status ){
				console.log('tipo...',tipo);
				$("#endereco").val(tipo.logradouro);
				$("#tipo_logradouro").val( tipo.tip_logradouro );
			}else{
				$("#endereco").val(data.logradouro);
			}					
							
			$("#complemento").val(data.complemento);
			$("#razao_social").val(data.nome);
			$("#fone").val(data.telefone);
			$("#numero").val(data.numero); 
			//$("#bairro").val(data.bairro);
			$("#cep").val(data.cep.replace('.','') );
			$("#situacao").val('Situação Receita: '+data.situacao);
			
			myLoading2.hide();
		},
		error: function () {
			alert('CNPJ Não encontrado.')
			myLoading2.hide();
		}
	});
}


function buscaCidade(uf,cidade){
	console.log('Cidade - UF',uf,cidade);
	
	var ct1 = DatasetFactory.createConstraint("cod_uni_feder", uf.toUpperCase(), uf.toUpperCase(), ConstraintType.MUST);
	var ct2 = DatasetFactory.createConstraint("den_cidade", cidade.toUpperCase().trim(), cidade.toUpperCase().trim(), ConstraintType.MUST);
	var ds = DatasetFactory.getDataset("cidades", null, [ct1,ct2], null);
	console.log('ds',ds);
	if( ds.values.length > 0 ){
		$("#estado").val( ds.values[0]["COD_UNI_FEDER"] );
		$("#cod_cidade").val( ds.values[0]["COD_CIDADE"] );
		//$("#cidade").val( ds.values[0]["DEN_CIDADE"] );
		$("#cod_pais").val( ds.values[0]["COD_PAIS"] );	
		
		zoomDestino = window[$("#cidade").attr('filter-instance')];
		zoomDestino.setValue( ds.values[0]["DEN_CIDADE"] );
		
		$("#pais").val( "BRASIL" );	
		
		return ds.values[0]["COD_CIDADE"];
	}else{
		return '-1';
	}
}

function buscaBairro(cidade, bairro){
	
	console.log('Cidade - Bairro',cidade,bairro);
	
	var ct1 = DatasetFactory.createConstraint("COD_CIDADE", cidade.toUpperCase(), cidade.toUpperCase(), ConstraintType.MUST);
	var ct2 = DatasetFactory.createConstraint("DEN_BAIRRO", bairro.toUpperCase().trim(), bairro.toUpperCase().trim(), ConstraintType.MUST);
	var ds = DatasetFactory.getDataset("bairros", null, [ct1,ct2], null);
	console.log('ds',ds);
	
	$("#bairro").val( bairro );
	if( ds.values.length > 0 ){	
		$("#bairro_sel").val( ds.values[0]["COD_BAIRRO"] );
		$("#ies_bairro_manual").val( "" );
		$("#ies_bairro_manual").prop( "checked", false );
	}else{
		$("#ies_bairro_manual").val( "on" );
		$("#ies_bairro_manual").prop( "checked", true );
	}
	
	if ( $('#ies_bairro_manual').is(":checked") ){
		$( '#bairro_sel' ).hide();
		$( '#bairro' ).show();
	}else{
		$( '#bairro' ).hide();
		$( '#bairro_sel' ).show();
	}
	
}

function buscaTipoLogradouro(logradouro){
	console.log('logradouro...',logradouro);
	var tipo = logradouro.split(' ')[0];
	
	var ct1 = DatasetFactory.createConstraint("des_logradouro", tipo, tipo, ConstraintType.MUST);
	var ds = DatasetFactory.getDataset("tip_logradouro", null, [ct1], null);
	console.log('ds',ds);
	
	var retorno = {};
	retorno['status'] = false;
	
	if( ds.values.length > 0 ){
		retorno['tip_logradouro'] = ds.values[0]["TIP_LOGRADOURO"];
		retorno['des_logradouro'] = ds.values[0]["DES_LOGRADOURO"];
		retorno['logradouro'] = logradouro.split(' ').slice(1).join(' ');
		retorno['status'] = true;	
	}
	return retorno;
	
}