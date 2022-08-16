function zoom(componente) {
	
	if( $("#task").val() == "34" || $("#task").val() == "37"  ){
		return false;
	}
	
	if (componente == 'bt_filial' ) {

		modalzoom.open("Filial",
				   "selectTable", 
				   "cod_empresa,Código,den_empresa,Descrição", 
				   "cod_empresa,den_empresa", 
				   "dataBase,java:/jdbc/LogixPRD,table,empresa",
				   componente, false, 'default', null, null,
			       "codigo||' '||descricao" );
	}
	
	if (componente == 'bt_funcao' ) {

		modalzoom.open("Função",
				   "selectTable", 
				   "rj_funcao,Código,rj_desc,Descrição,rj_codcbo,CBO", 
				   "rj_funcao,rj_desc,rj_codcbo", 
				   "dataBase,java:/jdbc/LogixPRD,table,eis_v_funcoes_protheus",
				   componente, false, 'default', null, null,
			       "rj_funcao||' '||rj_desc" );
	}
	
	if (componente == 'bt_cc' ) {

		modalzoom.open("Centro de Custo",
				"selectTable",
				"cod_cent_cust,Codigo,nom_cent_cust,Centro de Custo",
				"distinct,cod_cent_cust,nom_cent_cust",
				"dataBase,java:/jdbc/LogixPRD,table,fluig_v_cc_uf,sqlLimit,250,ies_cod_versao,0,cod_empresa," + $('#cod_filial_funcionario').val() ,
				componente, false,  'default', null, null,
				"cod_cent_cust||'-'||nom_cent_cust");
	}
	
	if (componente == 'bt_funcionario' ) {

		modalzoom.open("Função",
				   "selectTable", 
				   "RA_FILIAL,Filial,RA_MAT,Matricula,RA_NOME,Nome", 
				   "RA_FILIAL,den_empresa,RA_MAT,RA_NOME,RA_ADMISSA,RA_CIC,RA_RG,RA_CC,nom_cent_cust,rj_funcao,rj_desc,rj_codcbo", 
				   "dataBase,java:/jdbc/LogixPRD,table,eis_v_funcionarios_protheus",
				   componente, false, 'default', null, null,
			       "RA_MAT||' '||RA_NOME");
	}
	
	if (componente == 'bt_funcionario_subs' ) {

		modalzoom.open("Função",
				   "selectTable", 
				   "RA_FILIAL,Filial,RA_MAT,Matricula,RA_NOME,Nome", 
				   "RA_FILIAL,den_empresa,RA_MAT,RA_NOME,RA_ADMISSA,RA_CIC,RA_RG,RA_CC,nom_cent_cust,rj_funcao,rj_desc,rj_codcbo", 
				   "dataBase,java:/jdbc/LogixPRD,table,eis_v_funcionarios_protheus",
				   componente, false, 'default', null, null,
			       "RA_MAT||' '||RA_NOME");
	}
	
	
	if (componente == 'bt_tipo' ) {

		modalzoom.open("Tipo",
				   "tipo_solicitacao_rh", 
				   "cod_tipo_solicitacao,Código,den_tipo_solicitacao,Descrição", 
				   "cod_tipo_solicitacao,den_tipo_solicitacao,tipoSolicitacao,texto_auxiliar", 
				   "",
				   componente, false, 'default', null, null,
			       "codigo||' '||descricao||' '||tipoSolicitacao||' '||texto_auxiliar" );
	}
	
}

function setSelectedZoomItem(selectedItem) {

	if (selectedItem.type == "bt_tipo") {
		   $('#cod_tipo_solicitacao').val( selectedItem.cod_tipo_solicitacao ) ;
		   $('#tipoSolicitacao').val( selectedItem.tipoSolicitacao ) ;
		   $('#texto_auxiliar').val( selectedItem.texto_auxiliar ) ;
		   $('#den_tipo_solicitacao').val(  selectedItem.cod_tipo_solicitacao + '-' + selectedItem.den_tipo_solicitacao) ;
		   setTipo();
	}
	
	if (selectedItem.type == "bt_filial") {
		   $('#cod_filial_funcionario').val( selectedItem.cod_empresa ) ;
		   $('#den_filial_funcionario').val(  selectedItem.cod_empresa + '-' + selectedItem.den_empresa) ;
	}
	
	if (selectedItem.type == "bt_funcao") {
		   $('#cod_funcao_funcionario').val( selectedItem.rj_funcao ) ;
		   $('#den_funcao_funcionario').val(  selectedItem.rj_funcao + '-' + selectedItem.rj_desc) ;
	}
	
	if (selectedItem.type == "bt_cc") {
		   $('#cod_cc_funcionario').val( selectedItem.cod_cent_cust ) ;
		   $('#centro_custo_funcionario').val(  selectedItem.cod_cent_cust + '-' + selectedItem.nom_cent_cust) ;
	}
	
	if (selectedItem.type == "bt_funcionario_subs") {
		
		$('#nome_funcionario_subs').val( selectedItem.RA_NOME ) ;
		$('#data_inicio').val( selectedItem.RA_ADMISSA.split(' ')[0].split('-').reverse().join('/') ) ;
		$('#cpf_funcionario').val( selectedItem.RA_CIC.substring(0,3)+'.'+selectedItem.RA_CIC.substring(3,6)+'.'+selectedItem.RA_CIC.substring(6,9)+'-'+selectedItem.RA_CIC.substring(9,11) ) ;
		$('#rg_funcionario').val( selectedItem.RA_RG ) ;
		$('#matricula_funcionario').val( selectedItem.RA_MAT ) ;

	}
	
	if (selectedItem.type == "bt_funcionario") {
		
			$('#nome_funcionario').val( selectedItem.RA_NOME ) ;
			$('#data_inicio').val( selectedItem.RA_ADMISSA.split(' ')[0].split('-').reverse().join('/') ) ;
			$('#cpf_funcionario').val( selectedItem.RA_CIC.substring(0,3)+'.'+selectedItem.RA_CIC.substring(3,6)+'.'+selectedItem.RA_CIC.substring(6,9)+'-'+selectedItem.RA_CIC.substring(9,11) ) ;
			$('#rg_funcionario').val( selectedItem.RA_RG ) ;
			$('#matricula_funcionario').val( selectedItem.RA_MAT ) ;
		
			if( $('#cod_filial_funcionario').val() == "" ||  $('#tipoSolicitacao').val() == 'N' ){
				$('#cod_filial_funcionario').val( selectedItem.RA_FILIAL ) ;
				$('#den_filial_funcionario').val(  selectedItem.RA_FILIAL.trim() + '-' + selectedItem.den_empresa) ;
			}
			if( $('#cod_funcao_funcionario').val() == "" ||  $('#tipoSolicitacao').val() == 'N' ){
				$('#cod_funcao_funcionario').val( selectedItem.rj_funcao ) ;
				$('#den_funcao_funcionario').val(  selectedItem.rj_funcao.trim() + '-' + selectedItem.rj_desc) ;
			}
			if( $('#cod_cc_funcionario').val() == "" ||  $('#tipoSolicitacao').val() == 'N' ){
				$('#cod_cc_funcionario').val( selectedItem.RA_CC ) ;
				$('#centro_custo_funcionario').val(  selectedItem.RA_CC.trim() + '-' + selectedItem.nom_cent_cust) ;
			}
			
			$('#cod_filial_funcionario_orig').val( selectedItem.RA_FILIAL ) ;
			$('#den_filial_funcionario_orig').val(  selectedItem.RA_FILIAL.trim() + '-' + selectedItem.den_empresa) ;
			$('#cod_funcao_funcionario_orig').val( selectedItem.rj_funcao ) ;
			$('#den_funcao_funcionario_orig').val(  selectedItem.rj_funcao.trim() + '-' + selectedItem.rj_desc) ;
			$('#cod_cc_funcionario_orig').val( selectedItem.RA_CC ) ;
			$('#centro_custo_funcionario_orig').val(  selectedItem.RA_CC.trim() + '-' + selectedItem.nom_cent_cust) ;			

			if( $('#tipoSolicitacao').val() == 'D' || $('#tipoSolicitacao').val() == 'T' || $('#tipoSolicitacao').val() == 'X'){
			console.log('entrou1 ',$('#cpf_funcionario').val());
				var constraints = [];
				constraints.push( (DatasetFactory.createConstraint("dataBase", 			"java:/jdbc/FluigDS", 			null,	ConstraintType.MUST) ) );
				constraints.push( (DatasetFactory.createConstraint("table", 			"kbt_v_func_itens", 			null,	ConstraintType.MUST) ) );
				constraints.push( (DatasetFactory.createConstraint("cpf_funcionario", 	$('#cpf_funcionario').val(), 	$('#cpf_funcionario').val(),	ConstraintType.MUST) ) );
				//constraints.push( (DatasetFactory.createConstraint("necessita_item", 	'S', 	null,	ConstraintType.MUST) ) );
				
				var itens = DatasetFactory.getDataset("selectTable", ['tipo_item','descricao_item','confirma','necessita_item','tiposolicitacao'], constraints, null);
				console.log('entrou2');
				console.log(itens);
				$( "input[id^=papel_responsavel_item___]" ).each(function( index ) {
					var seq = $(this).attr('id').split('___')[1];
					 $("#necessita_item___"+seq).val('N');
					 $("#possui_item___"+seq).val('N');
				});
				
				for( var i = 0; i < itens.values.length; i ++ ){
					if( itens.values[i]['necessita_item'] == 'S' && (itens.values[i]['confirma'] == 'S' || itens.values[i]['tiposolicitacao'] =='S' )){
						console.log('entrou aqui ',itens.values[i]['necessita_item'],' ',itens.values[i]['descricao_item']);
						$( "input[id^=papel_responsavel_item___]" ).each(function( index ) {
							var seq = $(this).attr('id').split('___')[1];
							if( $("#tipo_item___"+seq).val() == itens.values[i]['tipo_item']
							 && $("#descricao_item___"+seq).val() == itens.values[i]['descricao_item'] ){
								 $("#necessita_item___"+seq).val('S');
								 $("#possui_item___"+seq).val('S');
							}
						});
						
					} 
				}

			}
			
			setTipo();
			$('.fd_possui option:not(:selected)').prop('disabled', true);
		
	}
}

function setItensPossuidos() {
	if( $('#tipoSolicitacao').val() == 'D' || $('#tipoSolicitacao').val() == 'T' || $('#tipoSolicitacao').val() == 'X'){
		console.log('entrou1 ',$('#cpf_funcionario').val());
			var constraints = [];
			constraints.push( (DatasetFactory.createConstraint("dataBase", 			"java:/jdbc/FluigDS", 			null,	ConstraintType.MUST) ) );
			constraints.push( (DatasetFactory.createConstraint("table", 			"kbt_v_func_itens", 			null,	ConstraintType.MUST) ) );
			constraints.push( (DatasetFactory.createConstraint("cpf_funcionario", 	$('#cpf_funcionario').val(), 	$('#cpf_funcionario').val(),	ConstraintType.MUST) ) );
			//constraints.push( (DatasetFactory.createConstraint("necessita_item", 	'S', 	null,	ConstraintType.MUST) ) );
			
			var itens = DatasetFactory.getDataset("selectTable", ['tipo_item','descricao_item','confirma','necessita_item','tiposolicitacao'], constraints, null);
			console.log('entrou2');
			console.log(itens);
			$( "input[id^=papel_responsavel_item___]" ).each(function( index ) {
				var seq = $(this).attr('id').split('___')[1];
				 $("#necessita_item___"+seq).val('N');
				 $("#possui_item___"+seq).val('N');
			});
			
			for( var i = 0; i < itens.values.length; i ++ ){
				if( itens.values[i]['necessita_item'] == 'S' && (itens.values[i]['confirma'] == 'S' || itens.values[i]['tiposolicitacao'] =='S' )){
					console.log('entrou aqui ',itens.values[i]['necessita_item'],' ',itens.values[i]['descricao_item']);
					$( "input[id^=papel_responsavel_item___]" ).each(function( index ) {
						var seq = $(this).attr('id').split('___')[1];
						if( $("#tipo_item___"+seq).val() == itens.values[i]['tipo_item']
						 && $("#descricao_item___"+seq).val() == itens.values[i]['descricao_item'] ){
							 $("#necessita_item___"+seq).val('S');
							 $("#possui_item___"+seq).val('S');
						}
					});
					
				} 
			}

		}
		
		setTipo();
		$('.fd_possui option:not(:selected)').prop('disabled', true);
}

