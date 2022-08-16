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
				linhas = linhas.sort(sortChar);
				
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