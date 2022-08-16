		function modalTable( id, titulo, fields, dados, size, idChave ){
			alert('teste2');
		
			parent.$('#workflowView-cardViewer').css( 'zIndex', 1 );
		
			var html = "<body class='fluig-style-guide' >" +
				    "<div class='table-responsive' style='overflow: auto; height: 220px;'>" +
				    "<table class='table table-hover table-zoom'>" +
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
					'label': 'Adiconar',
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
				 		$(".table-zoom > thead").append(html);
					}
				
					RemoveTableRow = function( handler ) {
						var tr = $(handler).closest('tr');
						tr.remove();
						return false;
					}

					loadDados = function( dados, fields ){
						for (var i=0; i<dados.length; i++) {
							var seq = addTableRow( fields );						
							for (var j=0; j<fields.length; j++) {
								$('#md_'+fields[j].field+'___'+seq).val( dados[i][ fields[j].field ] );
							}
						}
					};
					
					addTableRow = function( lista ) {
						alert('teste');
						seq_linhe_modal += 1;
						var newRow = $("<tr>");
						var cols = "";
						//for (var i=0; i<lista.length; i++) {							
						//	var type = lista[i].type;
						//	if ( type == 'date' )
						//		 type = 'text';
						//cols += "<td> <input type='"+type+"' style='"+lista[i].style+"' class='"+lista[i].class+"' name='md_"+lista[i].field+"___"+seq_linhe_modal+"' id='md_"+lista[i].field+"___"+seq_linhe_modal+"' "+lista[i].field+" /> </td>"
						//}
						//cols += "<td> <button name='btDelApon' class='btn btn-default btn-sm fluigicon fluigicon-trash fluigicon-xs' type='button' onclick='RemoveTableRow(this)'></button> </td>";
						cols = montaLinha( seq_linhe_modal );
						
						newRow.append(cols);
						$(".table-zoom > tbody").append(newRow);
						for (var i=0; i<lista.length; i++) {							
							if ( lista[i].type == 'date' ){
								var campoData = FLUIGC.calendar("[name^=md_"+lista[i].field+"___]" );
							}
						}
						return seq_linhe_modal;
					}				
				
					
					$('.save').click(function() {
						var retorno = { 'id': id,
										'idChave': idChave
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
						addTableRow( fields );
					});
					
					var montaLinha = function( seq ){
						
						var html =  ' <div class="row"> '+
								' 	<div class="col-md-2"> '+
								'		<label for="exampleTag">Tipo de Logradouro</label> '+
								'		<input type="text" name="tipo_logradouro_ent___'+seq+'" id="tipo_logradouro_ent___'+seq+'" class="form-control" /> '+
								'	</div> '+
								'	<div class="col-md-8"> '+
								'		<div class="form-group"> '+
								'			<label for="exampleTag">Endereço</label> '+
								'			<input type="text" name="endereco_ent___'+seq+'" id="endereco_ent___'+seq+'" class="form-control" /> '+
								'		</div> '+
								'	</div>  '+
								'	<div class="col-md-2"> '+
								'		<div class="form-group"> '+
								'			<label for="exampleTag">Numero</label> '+
								'			<input type="number" name="numero_ent___'+seq+'" id="numero_ent___'+seq+'" class="form-control" /> '+
								'		</div> '+
								'	</div> '+
								'</div> '+
								'<div class="row"> '+
								'	<div class="col-md-2"> '+
								'		<label for="exampleTag">País</label> '+
								'		<input type="number" name="pais_ent___'+seq+'" id="pais_ent___'+seq+'" class="form-control" /> '+
								'	</div> '+
								'	<div class="col-md-2"> '+
								'		<label for="exampleTag">Estado</label> '+
								'		<input type="number" name="uf_ent___'+seq+'" id="uf_ent___'+seq+'" class="form-control" /> '+
								'	</div> '+
								'	<div class="col-md-6" id = "cidade_ent_grp"> '+
								'		<div class="form-group"> '+
								'			<label for="exampleTag">Cidade</label> '+
								'			<input	type="text" id = "cidade_ent___'+seq+'" name="cidade_ent___'+seq+'" class="form-control" /> '+
								'			<input type="hidden" name="cod_cidade_ent___'+seq+'" id="cod_cidade_ent___'+seq+'" class="form-control" />  '+
								'		</div> '+
								'	</div> '+
								'	<div class="col-md-2"> '+
								'		<div class="form-group"> '+
								'			<label for="exampleTag">CEP</label> '+
								'			<input type="text" name="cep_ent___'+seq+'" id="cep_ent___'+seq+'" class="form-control" /> '+
								'		</div> '+
								'	</div> '+
								'</div> '+
								'<div class="row"> '+
								'	<div class="col-md-6"> '+
								'		<div class="form-group"> '+
								'			<label for="exampleTag">Bairro</label> '+
								'			<input type="text" name="bairro_ent___'+seq+'" id="bairro_ent___'+seq+'" class="form-control" /> '+
								'		</div> '+
								'	</div>	'+
								'	<div class="col-md-3"> '+
								'		<label for="exampleTag">CNPJ / CPF </label> '+
								'		<input type="text" name="cnpj_ent___'+seq+'" id="cnpj_ent___'+seq+'" class="form-control" /> '+
								'	</div> '+
								'	<div class="col-md-3"> '+
								'		<label for="exampleTag">IE</label> '+
								'		<input type="text" name="ie_ent___'+seq+'" id="ie_ent___'+seq+'" class="form-control" /> '+
								'	</div> '+
								'</div> '+
								'<div class="row"> '+
								'	<div class="col-md-12"> '+
								'		<div class="form-group"> '+
								'			<label for="exampleTag">Complemento</label> '+
								'			<input type="text" name="complemento_ent___'+seq+'" id="complemento_ent___'+seq+'" class="form-control" /> '+
								'		</div> '+
								'	</div> '+
								'</div> ';
								
						return html;
					}
					
					setup(fields);
					loadDados(dados, fields);
				}
			});			
			
		}