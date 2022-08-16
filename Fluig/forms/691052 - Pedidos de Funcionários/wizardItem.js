function modalWizardItem(){
		
	var htmlModal = '<body class="fluig-style-guide" >' +
					'<div class="table-responsive" id="pai_filho_modal" style="overflow: auto; height: 220px;">' +
					'<div class="panel-group" id="accordion">'+
	    			'	<div class="panel panel-default" >'+
	        		'		<div class="panel-heading">'+
					'            <h4 class="panel-title">'+
					'                <a class="collapse-icon up" data-toggle="collapse" data-parent="#accordion" href="#collapseLinha">'+
					'                	Linha:&nbsp&nbsp<span id="wz_linha_label" ></span>'+
					'                </a>'+
					'            </h4>'+
					'        </div>'+
					'        <div id="collapseLinha" class="panel-collapse collapse in">'+
					'            <div class="panel-body" style="padding-top: 0px;padding-bottom: 0px;" >'+
					'                <div id="wz_linha" class="linha_prod" > </div>'+
					'            </div>'+
					'        </div>'+
					'    </div>'+
					'    <div class="panel panel-default">'+
					'        <div class="panel-heading">'+
					'            <h4 class="panel-title">'+
					'                <a class="collapse-icon" data-toggle="collapse" data-parent="#accordion" href="#collapseProduto">'+
					'                	Produto:&nbsp&nbsp<span id="wz_produto_label" ></span>'+
					'                </a>'+
					'            </h4>'+
					'        </div>'+
					'        <div id="collapseProduto" class="panel-collapse collapse">'+
					'            <div class="panel-body" style="padding-top: 0px;padding-bottom: 0px;">'+
					'                <div id="wz_produto" > </div>'+
					'            </div>'+
					'        </div>'+
					'    </div>'+
					'    <div class="panel panel-default">'+
					'        <div class="panel-heading">'+
					'            <h4 class="panel-title">'+
					'                <a class="collapse-icon" data-toggle="collapse" data-parent="#accordion" href="#collapseItem">'+
					'                	Item:&nbsp&nbsp<span id="wz_item_label" ></span>'+
					'                </a>'+
					'            </h4>'+
					'        </div>'+
					'        <div id="collapseItem" class="panel-collapse collapse">'+
					'            <div class="panel-body" style="padding-top: 0px;padding-bottom: 0px;">'+
					'                <div id="wz_item" > </div>'+
					'            </div>'+
					'        </div>'+
					'    </div>'+
					'</div>' +
				    '</div>' +
				    '</body>';
	
	
	var myModal = FLUIGC.modal({
		title: "Wizard Item",
		content: htmlModal,
		id: "id",
		formModal: false,
		size: "large",
		actions: [{
			'label': 'Fechar',
			'autoClose': true
		}]
	}, function(err, data) {
		if(err) {
			// do error handling
		} else {

			/*		
			var setup = function(lista) {
				var html = "<tr>";
				for (var i=0; i<lista.length; i++) {
					html += "<th width='"+lista[i].width+"' >" + lista[i].titulo + "</th>";
				}
				html += "</tr>";
		 		$(".table-modal > thead").append(html);
			};
		
			RemoveTableRow = function( handler ) {
				var tr = $(handler).closest('tr');
				tr.remove();
				return false;
			};
	
			
			addTableRow = function( lista ) {
				seq_linhe_modal += 1;
				var newRow = $("<tr>");
				var cols = "";
				for (var i=0; i<lista.length; i++) {							
					var type = lista[i].type;
					if ( type == 'date' )
						 type = 'text';
					cols += "<td> <input type='"+type+"' style='"+lista[i].style+"' class='"+lista[i].class+"' name='md_"+lista[i].field+"___"+seq_linhe_modal+"' id='md_"+lista[i].field+"___"+seq_linhe_modal+"' "+lista[i].field+" /> </td>";
				}
				cols += "<td> <button name='btDelApon' class='btn btn-default btn-sm fluigicon fluigicon-trash fluigicon-xs' type='button' onclick='RemoveTableRow(this)'></button> </td>";
				newRow.append(cols);
				$(".table-modal > tbody").append(newRow);
				for (var i=0; i<lista.length; i++) {							
					if ( lista[i].type == 'date' ){
						var campoData = FLUIGC.calendar("[name^=md_"+lista[i].field+"___]" );
					}
				}
				return seq_linhe_modal;
			};
		
			
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
			
			setup(fields);
			*/
			
			wzLoadLinha = function(){
				
				var constraints = new Array();				
				//constraints.push( DatasetFactory.createConstraint("cod_empresa", codEmpresa, codEmpresa, ConstraintType.MUST) );
				var fildes = new Array('sequencia','linha','cor','icone');
				var order = new Array('sequencia');				
				var dataset = DatasetFactory.getDataset('linha_de_produto', fildes, constraints, order);
				console.log("load..... "+dataset);
				var htmlLinha = "";
				if ( dataset != null && dataset.values.length > 0 ){
					for (var x = 0; x < dataset.values.length; x++){
						var row = dataset.values[x];
						if( wzLoadProduto( row['documentid'], row['version'], null, null, null, true) ){
							console.log('Linhad ',x,row['linha']);
							htmlLinha += '<div class="row" style="background-color: '+ row['cor'] +';" onclick="wzLoadProduto(\''+row['documentid']+'\',\''+row['version']+'\',\''+row['linha']+'\',\''+row['icone']+'\',\''+row['cor']+'\',false)" > '+
										 '		<div class="col-md-12" >'+
										 '			<a>'+
										 '				  <h4><span class="fluigicon '+ row['icone'] +' fluigicon-md"></span>&nbsp&nbsp&nbsp'+ row['linha'] +'</h4> '+
										 '			</a> '+									 
										 '		</div> '+
										 '</div> ';						
						}
					}
				}
				console.log('HTML',htmlLinha);
				$("#wz_linha").html( htmlLinha );
				
			};

			wzLoadProduto = function( documentID, version, den_linha, icone, color, valida ){
				
				var aen = {};				
				
				var constraints = new Array();				
				constraints.push( DatasetFactory.createConstraint("tablename", 'aen', 'aen', ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint("metadata#id", documentID, documentID, ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint("metadata#version", version, version, ConstraintType.MUST) );
				var fildes = new Array('aen','den_aen','den_produto');
				var order = new Array('den_produto');
				var dataset = DatasetFactory.getDataset('linha_de_produto', fildes, constraints, order);
				console.log("load..... "+dataset);
			
				console.log("load aen");
				if ( dataset != null && dataset.values.length > 0 ){
					for (var x = 0; x < dataset.values.length; x++){
						var row = dataset.values[x];
						if ( valida && wzLoadItem(row['aen'],null,null,null,true) ){
							return true;
						}
						console.log("load.....",row);
						if ( aen[ row['den_produto'] ] == "" || 
							 aen[ row['den_produto'] ] == undefined  ||
							 aen[ row['den_produto'] ] == null ){
							aen[ row['den_produto'] ] = row['aen'];
						}else{
							aen[ row['den_produto'] ] += ';'+row['aen'];
						}
					}
					console.log("aen.....",aen);
				}

				if ( valida ){
					return false;
				}
				
				var ultProd = "XX";
				var htmlProd = "";
				if ( dataset != null && dataset.values.length > 0 ){
					for (var x = 0; x < dataset.values.length; x++){
						var row = dataset.values[x];
						console.log('Linhad ',x, row['den_produto']);
						if ( ultProd != row['den_produto'] ){
							ultProd = row['den_produto'];
							if ( wzLoadItem( aen[ row['den_produto'] ],null,null,null, true ) ){
								htmlProd += '<div class="row" style="background-color: '+ color +';" onclick="wzLoadItem(\''+aen[ row['den_produto'] ]+'\',\''+ row['den_produto'] +'\',\''+icone+'\',\''+color+'\',false)" > '+
											 '		<div class="col-md-12" >'+
											 '			<a>'+
											 '				  <h4><span class="fluigicon '+ icone +' fluigicon-md"></span>&nbsp&nbsp&nbsp'+ row['den_produto'] +'</h4> '+
											 '			</a> '+									 
											 '		</div> '+
											 '</div> ';	
							}
						}
					}
				}
				
				$("#wz_linha_label").html( den_linha );
				$("#collapseProduto").collapse('show');
				$("#collapseLinha").collapse('hide');
				$("#collapseItem").collapse('hide');
				$("#wz_produto_label").html( "" );
				$("#wz_item").html( "" );
				//$("#wz_linha_label").collapse('show');			
				console.log('HTML',htmlProd);
				$("#wz_produto").html( htmlProd );
				
				
			};
			
			wzLoadItem = function( aen, den_produto, icone, color, valida ){

				console.log('aen....',aen);
								
				var htmlItem = "";

				var constraints = new Array();				
				constraints.push( DatasetFactory.createConstraint("cod_empresa", $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST) );
				console.log("P0001 ");
				constraints.push( DatasetFactory.createConstraint("num_list_preco", $('#lista_preco').val(), $('#lista_preco').val(), ConstraintType.MUST) );
				console.log("P0002 ");
				
				var lstAEN = aen.split(';');
				console.log('lstAEN....',lstAEN);
				for ( var i=0; i < lstAEN.length; i++ ){
					aenTxt = lstAEN[i];
					constraints.push( DatasetFactory.createConstraint("aen", aenTxt, aenTxt, ConstraintType.SHOULD) );
					console.log("P0003 "+aenTxt);
				}
				
				var fildes = new Array('COD_ITEM','DEN_ITEM');
				var order = new Array('DEN_ITEM');				
				console.log("P0007 ");
				var dataset = DatasetFactory.getDataset('lista_de_preco_item', fildes, constraints, order);
				console.log("load..... "+dataset.values);
				
					
				if ( dataset != null && dataset.values.length > 0 ){
					if ( valida ){
						return true;
					}
					for (var x = 0; x < dataset.values.length; x++){
						var row = dataset.values[x];
						console.log('Linhad ',x,row );
						htmlItem += '<div class="row" style="background-color: '+ color +';" onclick="wzSetItem(\''+row['COD_ITEM']+'\')" > '+
									 '		<div class="col-md-12" >'+
									 '			<a>'+
									 '				  <h4><span class="fluigicon '+ icone +' fluigicon-md"></span>&nbsp&nbsp&nbsp'+ row['DEN_ITEM'] +'</h4> '+
									 '			</a> '+									 
									 '		</div> '+
									 '</div> ';						
					}
				}
				
				if ( valida ){
					return false;
				}
				
				$("#wz_produto_label").html( den_produto );
				$("#collapseProduto").collapse('hide');
				$("#collapseLinha").collapse('hide');
				$("#collapseItem").collapse('show');
				
				console.log('HTML',htmlItem);
				$("#wz_item").html( htmlItem );
			
			};
			
			wzSetItem = function( item ){
				$('#cod_item_edit').val(item);
				buscaItem( 'cod_item_edit' );
				myModal.remove();
			}
			
			wzLoadLinha();
		}
	});			
}


/*
50010101
50020101

internalVisualizerServer
http://api.accusoft.com.br

*/