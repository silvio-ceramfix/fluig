		function modalTable( id, titulo, fields, dados, size, idChave, seqInicial ){
		
			//parent.$('#workflowView-cardViewer').css( 'zIndex', 1 );
			parent.$('#workflowview-header').hide();
			
			var seq = seqInicial;
			
			$(".table-modal > thead").html("");
			$(".table-modal > tbody").html("");
			
			var html = "<body class='fluig-style-guide' >" +
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
			
			var myModal = FLUIGC.modal({
				title: titulo,
				content: html,
				id: id,
				formModal: false,
				size: size,
				actions: [{
					'label': 'Adicionar',
					'classType': 'add_linha'
				},{
					'label': 'Salvar',
					'classType': 'save',
					'autoClose': false
				},{
					'label': 'Fechar',
					'autoClose': true
				}]
			}, function(err, data) {
				if(err) {
					// do error handling
				} else {
				
					var setup = function(lista) {
						var html = "<tr>";
						for (var i=0; i<lista.length; i++) {
							html += "<th width='"+lista[i].width+"' >" + lista[i].titulo + "</th>"
						}
						html += "</tr>";
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
						for (var i=0; i<dados.length; i++) {
							var seq = addTableRow( fields, 'S' );
							for (var j=0; j<fields.length; j++) {
								
								$('#md_'+fields[j].field+'___'+seq).val( dados[i][ fields[j].field ] );
							}
						}
					};
					
					addTableRow = function( lista, load ) {
						seq_linhe_modal += 1;
						var newRow = $("<tr>");
						var cols = "";
						for (var i=0; i<lista.length; i++) {							
							var type = lista[i].type;
							if ( type == 'date' )
								 type = 'text';
							 
							var valor = '';
							if (  load == 'N' && lista[i].prefixoAutoIncremento != null && lista[i].prefixoAutoIncremento != undefined ){
								console.log('valor add ',lista[i].prefixoAutoIncremento.trim(),seq );
								valor = lista[i].prefixoAutoIncremento.trim()+'-'+seq;
								seq = String.fromCharCode(seq.charCodeAt(0) + 1);
								valor = " value='"+valor+"'";
							};
							 
							cols += "<td> <input type='"+type+"' style='"+lista[i].style+"' class='"+lista[i].class+"' name='md_"+lista[i].field+"___"+seq_linhe_modal+"' id='md_"+lista[i].field+"___"+seq_linhe_modal+"' "+lista[i].livre+" "+valor+" /> </td>"
						}
						cols += "<td> <button name='btDelApon' class='btn btn-default btn-sm fluigicon fluigicon-trash fluigicon-xs' type='button' onclick='RemoveTableRow(this)'></button> </td>";
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
						return seq_linhe_modal;
					}				
				
					
					$('.save').click(function() {
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
								reg[ fields[j].field ] = $( '#md_'+fields[j].field+'___'+seq ).val();
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