		function modalTable( id, titulo, fields, dados, size, idChave, seqInicial, addDel ){
		
			//addDel (A=adiciona - D=deleta - A=ambos - N=Nenhum )
			
			//parent.$('#workflowView-cardViewer').css( 'zIndex', 1 );
			//parent.$('#workflowview-header').hide();
			
			console.log('id modal.....',id);
			
			var seq = seqInicial;
			
			$(".table-modal > thead").html("");
			$(".table-modal > tbody").html("");
			
			var html = "<body class='fluig-style-guide' style='margin:0px; padding-top:0px; padding-bottom:0px; padding-left:0px; padding-right:0px;' >" +
				    "<div class='table-responsive' id='pai_filho_modal' style='overflow: auto; height: 220px;'>" +
				    "<table class='table table-hover table-modal'>" +
				    "<thead>" +
				    "</thead>" +
				    "<tbody>" +
				    "</tbody>" +
				    "</table>" +
				    "</div>" +
				    "</body>";					
					
					
			var seq_linhe_modal = 0;
			
			var actions = [];
			
			if( addDel == 'A' || addDel == 'T' ){
				actions.push( {'label': 'Adiconar', 'classType': 'add_linha' } );
			}
			actions.push( {'label': 'Salvar','classType': 'save','autoClose': false} );
			actions.push( {'label': 'Fechar','autoClose': true} );
			
			var myModal = FLUIGC.modal({
				title: titulo,
				content: html,
				id: id,
				formModal: false,
				size: size,
				actions: actions, 
			}, function(err, data) {
				if(err) {
					// do error handling
				} else {
				
					var setup = function(lista) {
						var html = "<tr>";
						
						for (var i=0; i<lista.length; i++) {
							
							var cplStyle = "";
							if( lista[i].width == "0" ){
								cplStyle = "display:none;";
							}
							
							html += "<th style='"+cplStyle+lista[i].style+"' width='"+lista[i].width+"' >" + lista[i].titulo + "</th>"
						}
						if( addDel == 'D' || addDel == 'T' ){
							html += "<th width='5%' ></th>"
						}
						html += "</tr>";
						console.log('html..... ',html);
				 		$(".table-modal > thead").append(html);
					}
				
					RemoveTableRow = function( handler ) {
						
						var tr = $(handler).closest('tr');
						tr.remove();
						
						var campoBase = fields[0].field;
						var  qtd = 0;
						$( "input[name*=md_"+campoBase+"___]" ).each(function( index ) {
							qtd += 1;
						});
						
						if ( qtd == 0 ){
							seq = "A";
							console.log('Alterado sequencia.....',seq);
						}
						
						return false;
					}

					loadDados = function( dados, fields ){
						console.log('Dados.....',dados);
						for (var i=0; i<dados.length; i++) {
							var seq = addTableRow( fields, 'S' );
							for (var j=0; j<fields.length; j++) {
								
								
								if( fields[j].type == 'checkbox' ){
									if( dados[i][ fields[j].field ] == 'S'
										|| dados[i][ fields[j].field ] == true
										|| dados[i][ fields[j].field ] == 'checked'
										|| fields[j]['default'] == 'S' 
									){
										$('#md_'+fields[j].field+'___'+seq).prop('checked',true);	
									}else{
										$('#md_'+fields[j].field+'___'+seq).prop('checked',false);
									}
								}else{
									$('#md_'+fields[j].field+'___'+seq).val( dados[i][ fields[j].field ] );
								}
							}
						}
						
						$('#checkAll').click(function() {
							$('.checkItem').prop("checked", $(this).prop("checked") );
						});
						
					};
					
					addTableRow = function( lista, load ) {
						seq_linhe_modal += 1;
						var newRow = $("<tr>");
						var cols = "";
						for (var i=0; i<lista.length; i++) {							
							var type = lista[i].type;
							if ( type == 'date' )
								 type = 'text';
							
							var cplStyle = "";
							if( lista[i].width == "0" ){
								cplStyle = "display:none;";
							}
							
							var valor = '';
							if (  load == 'N' && lista[i].prefixoAutoIncremento != null && lista[i].prefixoAutoIncremento != undefined ){
								console.log('valor add ',lista[i].prefixoAutoIncremento.trim(),seq );
								valor = lista[i].prefixoAutoIncremento.trim()+'-'+seq;
								seq = String.fromCharCode(seq.charCodeAt(0) + 1);
								valor = " value='"+valor+"'";
							};
							 
							if( lista[i].zoom === "" || lista[i].zoom === undefined ){
								cols += "<td style='"+ cplStyle+lista[i].style+"' > " +
										"	<input type='"+type+"' style='"+lista[i].style+"' class='"+lista[i].class+"' name='md_"+lista[i].field+"___"+seq_linhe_modal+"' id='md_"+lista[i].field+"___"+seq_linhe_modal+"' "+lista[i].livre+" "+valor+" />" +
										" </td>"
							}else{
								cols += "<td style='"+ cplStyle+lista[i].style+"' > " +
										"	<div class='input-group'> " +
										"		<input type='"+type+"' style='"+lista[i].style+"' class='"+lista[i].class+"' name='md_"+lista[i].field+"___"+seq_linhe_modal+"' id='md_"+lista[i].field+"___"+seq_linhe_modal+"' "+lista[i].livre+" "+valor+" /> " +
										"		<span id='md_"+ lista[i].zoom +"___"+ seq_linhe_modal +"' name='md_"+ lista[i].zoom +"___"+seq_linhe_modal +"' class='input-group-addon fluigicon fluigicon-search-test fluigicon-sm' onclick='zoom(this.id)'></span> "+
										"	</div>"+
										"</td>"
							}
						}
						if( addDel == 'D' || addDel == 'T' ){
							cols += "<td style='"+ cplStyle +"' > <button name='btDelApon' class='btn btn-default btn-sm fluigicon fluigicon-trash fluigicon-xs' type='button' onclick='RemoveTableRow(this)'></button> </td>";
						}
						newRow.append(cols);
						$(".table-modal > tbody").append(newRow);
						
						for (var i=0; i<lista.length; i++) {							
							if ( lista[i].type == 'date' ){
								var campoData = FLUIGC.calendar("[name^=md_"+lista[i].field+"___]" );
							}
							if ( lista[i].type == 'tel' && lista[i].precision != null && lista[i].precision != undefined ){
								$("[name^=md_"+lista[i].field+"___]").maskMoney( { precision:lista[i].precision, thousands:'.',decimal:','} );
							}
						}
						$('.unique-checkbox').change( function(ev) {
							
							var seq = ev.target.id.split('___')[1]; 
							var campoBase = ev.target.id.split('___')[0];
							
							var temChek = false;
							if( ev.target.checked ){
								$( "input[name^="+campoBase+"___]" ).each(function( index ){
									var seqLoop = $(this).attr('id').split('___')[1];
									//seqLoop = 
									if( $(this).is(":checked") && seqLoop != seq ){
										temChek = true;
									}
									
								});
							}
							if( temChek ){
								FLUIGC.toast({
									title: 'Seleção',
									message: 'Somente pode ser selecionado uma opção.',
									type: 'warning'
								});
								ev.target.checked = false;
							}
							
							
						})						
						return seq_linhe_modal;
					}		
				

					$('.save').click(function() {
						console.log('Salve modal table.....');
						var retorno = { 'id': id,
										'idChave': idChave,
										'seq': seq
									};
									
						var campoBase = fields[0].field;
						
						var dadosRet = [];
						
						$( "input[name*=md_"+campoBase+"___]" ).each(function( index ) {
							seq = $(this).attr('name').split('___')[1];
							reg = {};
							for (var j=0; j<fields.length; j++) {
								if( fields[j].type == 'checkbox' ){		
									if( $( '#md_'+fields[j].field+'___'+seq ).prop('checked') ){
										reg[ fields[j].field ] = 'S';
									}else{
										reg[ fields[j].field ] = 'N';
									}
								}else{
									reg[ fields[j].field ] = $( '#md_'+fields[j].field+'___'+seq ).val();
								}
							}
							dadosRet.push( reg );
						});	
						retorno['dados'] = dadosRet;
						if( returnModalTable( retorno ) ){
							myModal.remove();
						}
					});
					
					$('.add_linha').click(function() {
						addTableRow( fields, 'N' );
					});
					
					setup(fields);
					loadDados(dados, fields);
				}
			});			
			
		}