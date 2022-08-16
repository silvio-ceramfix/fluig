$(document).bind("DOMNodeRemoved", function(e){
	var target = $(e.target);
	if( target.html().indexOf("id='pai_filho_modal'" ) > 0 || target.html().indexOf("id='modal-zoom'" ) ){
		//parent.$('#workflowView-cardViewer').css( 'zIndex', 0 );
		parent.$('#workflowview-header').show();
	}
});

var modalzoomPF = (function(){
	var zoommodal = null;
	var loading = FLUIGC.loading(window);
	return {
		open: function(title, campoBase, fields, filters, type, size ) {

			//parent.$('#workflowView-cardViewer').css( 'zIndex', 1 );
			parent.$('#workflowview-header').hide();
			
	 		loading.show();
			
			var showfields = [];
			var hederfields = [];
			var globaldataset = [];
			var current = 0;
			var sqlLimit = 300;
			var tipo = type ;
			var rowSelect = {};
			
			if ( size == '' || size == undefined || size == 'default' )
				size = "large";
			
			var id = 'modal-zoom-' + type;
			
			
			if (zoommodal != null) {
				zoommodal.remove();
				zoommodal = null;
				
				$(".table-zoom > thead").html("");
				$(".table-zoom > tbody").html("");
			}
			

			
			var html = "<body class='fluig-style-guide' id='modal-zoom' >" +
				    "<div class='input-group'>" +
				    "<span class='input-group-addon'><span class='fluigicon fluigicon-search'></span></span>" +
				    "<input type='text' class='form-control' id='search' placeholder='Digite o texto e utilize o <Enter> para buscar'>" +
				    "</div>" +
				    "<div class='table-responsive' style='overflow: auto; height: 220px;'>" +
				    "<table class='table table-hover table-zoom'>" +
				    "<thead>" +
				    "</thead>" +
				    "<tbody>" +
				    "</tbody>" +
				    "</table>" +
				    "</div>" +
				    "</body>";
			
							
					
			var zoommodal = FLUIGC.modal({
			    title: title,
			    content: html,
			    formModal: false,
			    size: size,
			    id: id,
				
				
			    actions: [{
			        'label': 'Selecionar',
			        'classType': 'btn-success zoom-selected',
			        'autoClose': true,
			    },{
			        'label': 'Fechar',
			        'autoClose': true
			    }]
			}, 
			function(err, data) {
			    if(err) {
					FLUIGC.toast({ title: 'Erro:', message: err, type: 'danger' });
			    } else {
					
					
					var searchtable = function (text) {
						var table = $('.table-zoom > tbody');
						table.find('tr').each(function(index, row) {
							var allCells = $(row).find('td');
							if(allCells.length > 0) {
								var found = false;
								allCells.each(function(index, td) {
									var regExp = new RegExp(text, 'i');
									if(regExp.test($(td).text())) {
										found = true;
										return false;
									}
								});
								if(found == true)$(row).show();else $(row).hide();
							}
						});
					}
					
					var setup = function(lista) {
						var l = lista.split(",");
						var html = "<tr>";
						for (var i=0; i<l.length; i++) {
							showfields.push(l[i]);
							hederfields.push(l[i+1]);
							var style = "";
							if( l[i+1] == 'none' || l[i+1] == ''  ){
								style = "style='display: none;'";
							}
							html += "<th "+ style +" >" + l[i+1] + "</th>";
							i++;
						}
						html += "</tr>";
				 		$(".table-zoom > thead").append(html);
				 		
				 		$( "input[name*="+ campoBase +"___]" ).each( function( index ) {
				 			var seq = $(this).attr('id').split('___')[1];
				 			var achou = true;
			 				var l = filters.split(",");
				 			if( l.length > 0 ){
				 				var achou = false;
				 				for (var i=0; i<l.length; i++) {
				 					if( $("#"+ l[i] +"___"+seq ).val() == l[i+1] ){
				 						achou = true;
				 					} 
									i++;
				 				}
							}
							if( achou ){		
					 			var html = "<tr data-dataset=" + seq + ">";
								for (var x=0; x<showfields.length; x++) {
									var style = "";
									if( hederfields[x] == 'none' || hederfields[x] == ''  ){
										style = "style='display: none;'";
									}
									html += "<td "+ style +" id='fd_"+ showfields[x] +"___"+seq +"' >" +  $("#"+ showfields[x] +"___"+seq ).val() + "</td>";								
								}
								html += "</tr>";
						 		$(".table-zoom > tbody").append(html);
							}
				 		});
				 		$(".table-zoom > tbody > tr").click(function() {
				 			$(".table-zoom > tbody > tr").removeClass("active");
				 			$(this).addClass("active");
				 			current = $(this).data("dataset");
				 			rowSelect = {};
				 			for (var x=0; x<showfields.length; x++) {
				 				rowSelect[ showfields[x] ] = $("#fd_"+ showfields[x] +"___"+current  ).html();								
							}
				 			
				 		});
				 		$(".table-zoom > tbody > tr").dblclick(function() {
				 			rowSelect["type"] = type;
							setSelectedZoomItem( rowSelect );
				 			zoommodal.remove();
				 		});
					}
				
			 		$('.zoom-selected').click(function() {
			 			rowSelect["type"] = type;
						setSelectedZoomItem( rowSelect );
			 			zoommodal.remove();
					});
			 		
			 		setup(fields);
			 		loading.hide();
			    }
			});			
			
		}
	}
})();
