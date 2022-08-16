	function loadBody(){
		
		var qtd = 0;
		$( "input[id^=cod_tipo_teste___]" ).each(function( index ) {
			qtd += 1;
		});
		if( qtd == 0 ){
			loadTeste();
		}
		loadEmpreasUser();
		trataCamposPF();
		
		FLUIGC.calendar('.data-fluig', {pickDate: true, useStrict: true }  );
		FLUIGC.calendar('.data-hora-fluig', {pickDate: true, pickTime: true, useStrict: true } );
		FLUIGC.calendar('.hora-fluig', {pickDate: false, pickTime: true, useStrict: true } );
	
	}
	

    function showBarcodeReader() {
        JSInterface.showBarcodeReader();
    }
    function barCodeCallback(code) {
        // Lógica para utilização do código recebido
        $('#num_ordem').val( code );
        zoom('bt_op','num_ordem');
    }
	
	function loadEmpreasUser(){
		
		//loadDsCombo('empresa_' + $this.instanceId, 'empresa', 'cod_empresa', 'den_empresa', '', '', 'cod_empresa', 'S', 'S', 'N');
        var dsEmpresas = getDsPaiFilho( 'inspetores', 'empresa', 'matricula', $('#user_atual').val(), 'ies_empresa_default,cod_empresa,emp_reduz', false )
        var lstEmpresa = '';
        var empDefault = $('#empresa').val();
        var constraintsFilhos = new Array();
        for( var x = 0; x < dsEmpresas.length; x++ ){
        	lstEmpresa += dsEmpresas[x]['cod_empresa']+"|";
        	constraintsFilhos.push( DatasetFactory.createConstraint("cod_empresa", dsEmpresas[x]['cod_empresa'], dsEmpresas[x]['cod_empresa'], ConstraintType.SHOULD) );
        	if( dsEmpresas[x]['ies_empresa_default'] == 'on' 
        	 && ( empDefault == "" || empDefault == null || empDefault == "null" ) ){
        		empDefault = dsEmpresas[x]['cod_empresa'];
        	}
        }
        var orderFilhos = new Array('cod_empresa');
        var fieldFilhos = new Array('cod_empresa','den_reduz');
		var datasetFilhos = DatasetFactory.getDataset('empresa', fieldFilhos, constraintsFilhos, orderFilhos);
		$('#empresa option').remove();
		var filhos = datasetFilhos.values;
		for (var i in filhos) {
			var filho = filhos[i];
			$('#empresa').append("<option value='"+ filho['COD_EMPRESA'] +"' >" + filho['COD_EMPRESA']+' - '+filho['DEN_REDUZ'] + "</option>");
		}
		$('#empresa').val( empDefault );
		
		
	}

	var beforeSendValidate = function(numState,nextState){
	
		var msgO = "";
		var msgU = "";
		var analise = "A";
		$( "input[id^=cod_tipo_teste___]" ).each(function( index ) {
			var seq = $(this).attr('id').split('___')[1];
			if( $('#obrigatorio___'+seq).val() == 'S' ){
				if( ( $('#tipo_teste___'+seq).val() == 'O' && $('#opcao___'+seq).val() == "" )
				 || ( $('#tipo_teste___'+seq).val() == 'M' && $('#metrica___'+seq).val() == "" )
				 || ( $('#tipo_teste___'+seq).val() == 'I' && $('#informado___'+seq).val() == "" ) ){
					msgO +=', '+$('#den_tipo_teste___'+seq).val();
				}
			}else if( $('#obrigatorio___'+seq).val() == 'U' ){
				if( ( $('#tipo_teste___'+seq).val() == 'O' && $('#opcao___'+seq).val() == "" )
				 || ( $('#tipo_teste___'+seq).val() == 'M' && $('#metrica___'+seq).val() == "" )
				 || ( $('#tipo_teste___'+seq).val() == 'I' && $('#informado___'+seq).val() == "" ) ){
					msgU +=', '+$('#den_tipo_teste___'+seq).val();
				}
			}
			if( $('#analise___'+seq).val() != "" && $('#complemento').val() != "S" ){
				analise = 'R';
			}
		});
		if( $('#task').val() != "18" ){
			$('#situacao').val( analise );
		}
		
		if( msgU != "" ){
			alert( 'Existem campos "OPCIONAIS" não informados'+msgO );
		}
		
		if( msgO != "" ){
			$('#completo').val("N");
			if( $('#complemento').val() == "S" ){
				if( confirm( 'Existem campos "OBRIGATÓRIOS" não informados - '+msgO+'. Contudo está selecionado opção complemento, deseja continuar?' ) ){
					$('#completo').val("S");
					return true;
				}
			} 
			if( confirm( 'Existem campos "OBRIGATÓRIOS" não informados - '+msgO+'. Deseja enviar para complemento posterior?' ) ){
				return true;	
			}else{
				return false;	
			}
		}else{
			$('#completo').val("S");
		}
		
		
		return validaData( 'data_insp' );
		
	}
	
	function sairCampoNumero(e){
		if( e.keyCode == 27 ){
			
			if( parseFloat( isNull( $( e.target ).val().replace('.','').replace(',','.') ), "0" ) == 0 ){
				
				var seq = parseInt( e.target.id.split('___')[1] );
				
		
				if( $('#tipo_teste___'+seq).val() == "M" ){
					var nSeq = seq+1;
					if( $('#tipo_teste___'+nSeq).val() == "O" ){
						$('#opcao___'+nSeq).focus();
						$('#opcao___'+nSeq).select();
					}else if( $('#tipo_teste___'+nSeq).val() == "M" ){
						$('#metrica___'+nSeq).focus();	
						$('#metrica___'+nSeq).select();
					}else{
						$('#informado___'+nSeq).focus();
						$('#informado___'+nSeq).select();
					}
					$('#metrica___'+seq).val("");
					validaLinha( seq );
				}
				
				return false;
	            
			}
		}
		
	}
	
	function autoSize(){
			$('textarea').each(function (){
				$(this).on(
					 'keyup input keypress keydown change',
					 function(e) {
					  var tamanhoMin = $(this).attr('rows')
						* $(this).css('line-height').replace(
						  /[^0-9\.]+/g, '');
					  $(this).css({
					   'height' : 'auto'
					  });
					  var novoTamanho = this.scrollHeight
						+ parseFloat($(this).css("borderTopWidth"))
						+ parseFloat($(this).css("borderBottomWidth"));
					  if (tamanhoMin > novoTamanho)
					   novoTamanho = tamanhoMin;
					  $(this).css({
					   'height' : novoTamanho
					  });
					 }).css({
					'overflow' : 'hidden',
					'resize' : 'none'
				   }).delay(0).show(0, function() {
					var el = $(this);
					setTimeout(function() {
					 el.trigger('keyup');
					}, 100);
				   });
			});
		}

		function isNull( valor, padrao ){
			if ( isNaN( valor ) ){
				return padrao;
			}else{
				return valor;
			}
		}		

		function orderPaiFilho( table, firstRow, campoOrder ){
			
			console.log( 'firstRow',firstRow );
			
			var campos = new Array();
			$( 'input[name], select[name], checkbox[name], textarea[name], img', $( "#"+firstRow ) ).each( function( index ){
				console.log( 'Each ', $(this).attr('id') );				
				campos.push(  $(this).attr('id')  );
			});	
			console.log( 'campos....', campos );
			var dados = {};
			var chaves = new Array();
			var linhas = new Array();
			console.log(' campoOrder ', campoOrder );
			$( "input[name^="+campoOrder+"___]" ).each(function( index ) {
				var linha = {};
				console.log( 'Nome campo loop', $(this).attr('name') );
				var seq = $(this).attr('name').split('___')[1];
				for( i = 0; i < campos.length; i++ ){
					linha[ campos[ i ] ] = $( '#'+campos[i]+'___'+seq ).val();
				}
				chave = $(this).val().toLowerCase();
				console.log( 'chave..... ', chave, $(this).val() );
				chaves.push( chave );
				linhas.push( parseInt( seq ) );
				dados[ chave ] = linha;
			});
				
			console.log('chaves........',chaves);
			console.log('dados........',dados);
			console.log('linhas........',linhas);
			
			chaves = chaves.sort();
			linhas = linhas.sort(sortNumber);
			
			console.log('chaves........',chaves);
			console.log('dados........',dados);
			console.log('linhas........',linhas);
			
			
			for( j = 0; j < chaves.length; j++ ){
				var chave = chaves[j];
				var linha = parseInt( linhas[j] );
				for( i = 0; i < campos.length; i++ ){
					//linha[ campos[ i ] ] = $( '#'+campos[i]+'___'+seq ).val();
					$('#'+campos[ i ]+'___'+linha).val(  dados[chave][ campos[ i ] ] );
				}
			}
			
		}

		function sortNumber(a,b) {
			return a - b;
		};
		
		function sortChar(a,b) {
			return getRPad( a, '000000' ) - getRPad( b, '000000' );
		};			
		
		
		function fnCustomDelete(oElement){
			fnWdkRemoveChild(oElement);
		}
		
		function getLPad( valor, pad){
			var str = "" + valor;
			var ans = pad.substring(0, pad.length - str.length) + str;
			return ans;
		}
		
		function getRPad( valor, pad){
			var str = "" + valor;
			var ans = str + pad.substring(0, pad.length - str.length);
			return ans;
		}
		
		function validaLinha( seq ){
			
			console.log('seq.........', seq);
			
			if( $('#tipo_teste___'+seq ).val() == 'M' ){
				var metrica = parseFloat( isNull( $('#metrica___'+seq ).val().replace('.','').replace(',','.'), "0" ) );
				var valor_ref = parseFloat( isNull( $('#valor_ref___'+seq ).val().replace('.','').replace(',','.'), "0" ) );
				var tol_acima = parseFloat( isNull( $('#tol_acima___'+seq ).val().replace('.','').replace(',','.'), "0" ) );
				var tol_abaixo = parseFloat( isNull( $('#tol_abaixo___'+seq ).val().replace('.','').replace(',','.'), "0" ) );
				var tol_acima_2 = parseFloat( isNull( $('#tol_acima_2___'+seq ).val().replace('.','').replace(',','.'), "0" ) );
				var tol_abaixo_2 = parseFloat( isNull( $('#tol_abaixo_2___'+seq ).val().replace('.','').replace(',','.'), "0" ) );
				var tipo_tol = $('#tipo_tol___'+seq ).val();
				
				var qtd = parseFloat( isNull( $('#metrica_qtd___'+seq ).val(), "0" ) );
				var total = parseFloat( isNull( $('#metrica_total___'+seq ).val(), "0" ) );
				if( metrica != -1 && !isNaN(metrica) && !isNaN(metrica) ){
					qtd = qtd+1;
					total = total+metrica;
				};
				var metrica_media = 0;
				if(qtd != 0){
					metrica_media = total / qtd;
				}
				if( isNaN(metrica_media) ){
					metrica_media = metrica;
				}
				if( !isNaN(metrica_media) ){
					$('#metrica_media___'+seq ).val( formatNumber( metrica_media, $('#num_precisao___'+seq ).val() ) );
				}
				
				
				
				$('#analise___'+seq ).val( '' );
				if( tipo_tol = 'F' ){
					if( !isNaN( tol_acima ) && metrica > tol_acima && tol_acima != tol_abaixo ){
						$('#analise___'+seq ).val( 'S1' );
					}
					if( !isNaN( tol_abaixo ) && metrica < tol_abaixo && tol_acima != tol_abaixo ){
						$('#analise___'+seq ).val( 'I1' );
					}
					if( !isNaN( tol_acima_2 ) && metrica > tol_acima_2 && tol_acima_2 != tol_abaixo_2 ){
						$('#analise___'+seq ).val( 'S2' );
					}
					if ( !isNaN( tol_abaixo_2 ) && metrica < tol_abaixo_2 && tol_acima_2 != tol_abaixo_2 ){
						$('#analise___'+seq ).val( 'I2' );			
					}
				}else if( tipo_tol = 'P' ){
					if( !isNaN( tol_acima ) && metrica > valor_ref + ( valor_ref * tol_acima / 100 ) && tol_acima != tol_abaixo ){
						$('#analise___'+seq ).val( 'S1' );
					}
					if( !isNaN( tol_abaixo ) && metrica < valor_ref + ( valor_ref * tol_abaixo / 100 ) && tol_acima != tol_abaixo ){
						$('#analise___'+seq ).val( 'I1' );
					}
					if( !isNaN( tol_acima_2 ) && metrica > valor_ref + ( valor_ref * tol_acima_2 / 100 ) && tol_acima_2 != tol_abaixo_2 ){
						$('#analise___'+seq ).val( 'S2' );
					}
					if( !isNaN( tol_abaixo_2 ) && metrica < valor_ref + ( valor_ref * tol_abaixo_2 / 100 ) && tol_acima_2 != tol_abaixo_2 ){
						$('#analise___'+seq ).val( 'I2' );			
					}
				}else if( tipo_tol = 'A' ){
					if( !isNaN( tol_acima ) &&  metrica > valor_ref + tol_acima && tol_acima != tol_abaixo ){
						$('#analise___'+seq ).val( 'S1' );
					}
					if( !isNaN( tol_abaixo ) && metrica < valor_ref + tol_abaixo && tol_acima != tol_abaixo ){
						$('#analise___'+seq ).val( 'I1' );
					}
					if( !isNaN( tol_acima_2 ) && metrica > valor_ref + tol_acima_2 && tol_acima_2 != tol_abaixo_2 ){
						$('#analise___'+seq ).val( 'S2' );
					}
					if( !isNaN( tol_abaixo_2 ) && metrica < valor_ref + tol_abaixo_2 && tol_acima_2 != tol_abaixo_2 ){
						$('#analise___'+seq ).val( 'I2' );			
					}
				}
				$('#metrica___'+seq ).css({'background-color' : '#FFFFFF'});
				if( $('#analise___'+seq ).val() == 'S1' 
					|| $('#analise___'+seq ).val() == 'I1' ){
					$('#metrica___'+seq ).css({'background-color' : '#FFFF00'});
				}else if( $('#analise___'+seq ).val() == 'S2' 
						|| $('#analise___'+seq ).val() == 'I2' ){
					$('#metrica___'+seq ).css({'background-color' : '#FF7474'});
				}
				
				$('#analise_media___'+seq ).val( '' );
				if( tipo_tol = 'F' ){
					if( !isNaN( tol_acima ) && metrica_media > tol_acima && tol_acima != tol_abaixo ){
						$('#analise_media___'+seq ).val( 'S1' );
					}
					if( !isNaN( tol_abaixo ) && metrica_media < tol_abaixo && tol_acima != tol_abaixo ){
						$('#analise_media___'+seq ).val( 'I1' );
					}
					if( !isNaN( tol_acima_2 ) && metrica_media > tol_acima_2 && tol_acima_2 != tol_abaixo_2 ){
						$('#analise_media___'+seq ).val( 'S2' );
					}
					if ( !isNaN( tol_abaixo_2 ) && metrica_media < tol_abaixo_2 && tol_acima_2 != tol_abaixo_2 ){
						$('#analise_media___'+seq ).val( 'I2' );			
					}
				}else if( tipo_tol = 'P' ){
					if( !isNaN( tol_acima ) && metrica_media > valor_ref + ( valor_ref * tol_acima / 100 ) && tol_acima != tol_abaixo ){
						$('#analise_media___'+seq ).val( 'S1' );
					}
					if( !isNaN( tol_abaixo ) && metrica_media < valor_ref + ( valor_ref * tol_abaixo / 100 ) && tol_acima != tol_abaixo ){
						$('#analise_media___'+seq ).val( 'I1' );
					}
					if( !isNaN( tol_acima_2 ) && metrica_media > valor_ref + ( valor_ref * tol_acima_2 / 100 ) && tol_acima_2 != tol_abaixo_2 ){
						$('#analise_media___'+seq ).val( 'S2' );
					}
					if( !isNaN( tol_abaixo_2 ) && metrica_media < valor_ref + ( valor_ref * tol_abaixo_2 / 100 ) && tol_acima_2 != tol_abaixo_2 ){
						$('#analise_media___'+seq ).val( 'I2' );			
					}
				}else if( tipo_tol = 'A' ){
					if( !isNaN( tol_acima ) &&  metrica_media > valor_ref + tol_acima && tol_acima != tol_abaixo ){
						$('#analise_media___'+seq ).val( 'S1' );
					}
					if( !isNaN( tol_abaixo ) && metrica_media < valor_ref + tol_abaixo && tol_acima != tol_abaixo ){
						$('#analise_media___'+seq ).val( 'I1' );
					}
					if( !isNaN( tol_acima_2 ) && metrica_media > valor_ref + tol_acima_2 && tol_acima_2 != tol_abaixo_2 ){
						$('#analise_media___'+seq ).val( 'S2' );
					}
					if( !isNaN( tol_abaixo_2 ) && metrica_media < valor_ref + tol_abaixo_2 && tol_acima_2 != tol_abaixo_2 ){
						$('#analise_media___'+seq ).val( 'I2' );			
					}
				}
				$('#metrica_media___'+seq ).css({'background-color' : '#EEEEEE'});
				if( $('#analise_media___'+seq ).val() == 'S1' 
					|| $('#analise_media___'+seq ).val() == 'I1' ){
					$('#metrica_media___'+seq ).css({'background-color' : '#FFFF00'});
				}else if( $('#analise_media___'+seq ).val() == 'S2' 
						|| $('#analise_media___'+seq ).val() == 'I2' ){
					$('#metrica_media___'+seq ).css({'background-color' : '#FF7474'});
				}
			}
		}
		
		function setOpcao(id){
			var seq = id.split('___')[1];
			if(  $('#opc_tem_obs___'+seq).val() != "" ){
				var aOpcTemObs = $('#opc_tem_obs___'+seq).val().split(';');
				if( aOpcTemObs.indexOf( $('#opcao___'+seq).val() ) >= 0 ){
					$('#linha_base___'+(parseInt( seq )+1) ).show();
					$('#cod_tipo_teste___'+( parseInt( seq )+1 ) ).parent().parent().show();
				}else{
					$('#linha_base___'+(parseInt( seq )+1) ).hide();
					$('#cod_tipo_teste___'+( parseInt( seq )+1 ) ).parent().parent().hide();
				}
			}
		}
		
		function trataCamposPF(){
			console.log('trataCamposPF.........');
			$( "input[id^=cod_tipo_teste___]" ).each(function( index ) {
				var seq = $(this).attr('id').split('___')[1];
				validaLinha( seq );
				
				if( $('#print_laudo___'+seq ).val() == "C" ){
					$('#opcao___'+seq+' option:not(:selected)').prop('disabled', true);
					$('#opcao___'+seq).attr('tabindex',"-1");
					$('#informado___'+seq).attr('readonly',true);
					$('#informado___'+seq).attr('tabindex',"-1");
					$('#metrica___'+seq ).attr('readonly',true);
					$('#metrica___'+seq ).attr('tabindex',"-1");
				}else{
					if( $('#formula___'+seq).val() != "" ){
						$('#metrica___'+seq ).attr( "readonly", true );
					}else{
						$('#metrica___'+seq ).attr('readonly',false);
					}
				}
				if( $('#print_laudo___'+seq ).val() == "O" ){
					$('#linha_base___'+seq ).hide();
				}else{
					$('#linha_base___'+seq ).show();
				}
				if( $('#tipo_teste___'+seq).val() == "O"
				  && $('#opc_tem_obs___'+seq).val() != "" ){
					var aOpcTemObs = $('#opc_tem_obs___'+seq).val().split(';');
					if( aOpcTemObs.indexOf( $('#opcao___'+seq).val() ) >= 0 ){
						$('#linha_base___'+( parseInt( seq )+1 ) ).show();
						$('#cod_tipo_teste___'+( parseInt( seq )+1 ) ).parent().parent().show();
					}else{
						$('#linha_base___'+( parseInt( seq )+1 ) ).hide();
						$('#cod_tipo_teste___'+( parseInt( seq )+1 ) ).parent().parent().hide();
					}
				}
					
				if( $('#tipo_teste___'+seq).val() == 'O' ){
					$('#opcao___'+seq).show();
					$('#informado___'+seq).hide();
					$('#metrica___'+seq).hide();
					
					var opcao = $('#opcao___'+seq).val();
					var dsOpcoes = getDsPaiFilho( "tipo_teste", "opcoes_teste", "cod_tipo_teste", $('#cod_tipo_teste___'+seq).val(), "", true );
					console.log('teste....',dsOpcoes);
					var lstOpcoes = dsOpcoes.values;
					var aTemObs = [];
					$('#opcao___'+seq).empty();
					$('#opcao___'+seq).append("<option value='' ></option>");
					for ( var i in lstOpcoes ) {
						var opcoes = lstOpcoes[i];
						console.log('opcoes',opcoes);
						$('#opcao___'+seq).append("<option value='"+ opcoes.cod_opcao +"' >"+ opcoes.den_opcao +"</option>");
					}
					$('#opcao___'+seq).val( opcao );
					
				}else if( $('#tipo_teste___'+seq).val() == 'M' ){
					$('#opcao___'+seq).hide();	
					$('#informado___'+seq).hide();
					$('#metrica___'+seq).show();
					
					if( $('#formula___'+seq).val() == "" ){
						num_precisao = parseInt( $('#num_precisao___'+seq).val().split(',')[0] );
						$('#metrica___'+seq).maskMoney( {precision : num_precisao, thousands : '.',decimal : ',', defaultZero : false, allowZero : true });
					}
				}else{
					$('#opcao___'+seq).hide();	
					$('#informado___'+seq).show();
					$('#metrica___'+seq).hide();
				}
				
			});
			atualizaFormulasPF();
		}
		
		function atualizaFormulasPF(){
			console.log('trataCamposPF.........');
			$( "input[id^=cod_tipo_teste___]" ).each(function( index ) {
				var seq = $(this).attr('id').split('___')[1];
				if( $('#formula___'+seq).val() != "" ){
					$('#metrica___'+seq ).attr( "readonly", true );
					$('#metrica___'+seq).attr( "tabindex",	"-1");
					var formula = $('#formula___'+seq).val();
					aFormula = formula.split("{");
					rFormula = "";
					for( var i = 0; i < aFormula.length; i ++ ){
					    if( aFormula[i].indexOf("}") != -1 ){
					        pFormula = aFormula[i].split("}");
					        rFormula += getValorTestePF( pFormula[0] );
					        if( pFormula[1] != undefined ){
					        	rFormula += pFormula[1].replace('.','').replace(',','.');
					        }
					    }else{
					    	rFormula += aFormula[i].replace('.','').replace(',','.'); 
					    }
					}
					console.log('rFormula',rFormula);
					try{
						console.log('eval rFormula',eval( rFormula ) );
						$('#metrica___'+seq ).val( formatNumber( eval( rFormula ), $('#num_precisao___'+seq ).val() ) );
					}catch(e){
						console.log('erro eval rFormula', e.toString() );
 				    }

				}
				
				//$('#aplic_formula___'+row).val( dsTesteCpl.values[0].aplic_formula );
				
			});
		}
		
		function getValorTestePF(tipoTeste){
			console.log('trataCamposPF.........');
			var retorno = "";;
			$( "input[id^=cod_tipo_teste___]" ).each(function( index ) {
				var seq = $(this).attr('id').split('___')[1];
				if( $('#cod_tipo_teste___'+seq ).val() == tipoTeste ){
					
					if( $('#print_laudo___'+seq ).val() == "C"
						|| $('#print_laudo___'+seq ).val() == "O" ){
						retorno = $('#valor_ref___'+seq ).val();
						return true;   
					}else{
						retorno = $('#metrica___'+seq ).val();
						return true;   
					}
				}
			});
			return retorno.replace('.','').replace(',','.');
		}