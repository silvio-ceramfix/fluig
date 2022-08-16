
var modalzoom = (function(){
	var zoommodal = null;
	var loading = FLUIGC.loading(window);
	return {
		open: function(title, dataset, fields, resultfields, filters, type, iniVazio, size, likefield, likevalue, searchby) {

			parent.$('#workflowView-cardViewer').css( 'zIndex', 1 );
			
			console.log('likefield',likefield);
			
	 		loading.show();
			
			var showfields = [];
			var globaldataset = [];
			var current = 0;
			var sqlLimit = 300;
			var tipo = type ;
			
			if ( size == '' || size == undefined || size == 'default' )
				size = "large";
			
			var id = 'modal-zoom-' + type;
			
			
			if (zoommodal != null) {
				zoommodal.remove();
				zoommodal = null;
				
				$(".table-zoom > thead").html("");
				$(".table-zoom > tbody").html("");
			}
			
/*			var cplHtml = '';
			if ( size = 'none' ){
				cplHtml += "style='display:none;'"
			}*/
			
			var html = "<body class='fluig-style-guide' >" +
				    "<div class='input-group' id='busca' name='busca' >" +
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
			
					var dosearch = function() {
				 		var url = urlrequest();
						$(".table-zoom > tbody").html("");
						
						console.log("url", url);
				 		
				 		loading.show();
				 		
						$.ajax({
				    		type: "GET",
				    		dataType: "json",
				    		url: url,
				    		data: "",
				    		error: function(XMLHttpRequest, textStatus, errorThrown) {
				    	    	console.log("dataset error", XMLHttpRequest, textStatus, errorThrown);
							},
				    	    success: function (data, status, xhr) {
				    	    	console.log("dataset sucess", data, status, xhr);
				    	    	var dataset = data["invdata"];
				    	    	readydataset(dataset);
				    	    }
						});
					};		
			
					var urlrequest = function(){
					    var request = "/ecm/api/rest/ecm/dataset/",
					        json = {};
					    
					    if (dataset != null) {
					        request += "getDatasetZoom";
					        json.datasetId = dataset;
					    } else if(cardDatasetId != null){
					        request += "getCardDatasetValues";
					        json.cardDatasetId = cardDatasetId;
					    }
					    
					    if (resultfields != null && resultfields.length > 0 ){
					    	json.resultFields = trimarray(resultfields.split(","));
					    }
					    
					    if (filters != null && filters.length > 0 ){
					        json.filterFields = trimarray(filters.split(","));
							for (var x=0; x < json.filterFields.length; x++) {
								if( json.filterFields[x] == "sqlLimit" ){
									sqlLimit = json.filterFields[x+1];
								}
							}
					    }
					    
					    if (likefield != null && likefield.length > 0 && likevalue != null && likevalue.length > 0 ){
					        json.likeField = likefield;
					        json.likeValue = likevalue;
					    }
					    
					    var searchValue = $("#search").val();
					    if(searchValue && searchValue.length > 0) {
					    	json.searchValue = searchValue;
					    	
					    	if (searchby && searchby != "") {
						        json.searchField = searchby;
					    	} else {
					    		json.searchField = fields.split(",")[0];
					    	}					    	
					    }
					    
					    return request +="?json=" + encodeURI(JSON.stringify(json));
					};			

					var trimarray = function (fields) {
				    	for(var i=0; i < fields.length; i++){
				    		fields[i] = fields[i].trim();
				    	}
				    	return fields;
				    };

					var readydataset = function(dataset) {
						
						globaldataset = dataset;
						
						//gambi
						if ( dataset.length == 1 && size == 'none' ){
							console.log('Entrei com 1',dataset);
							var row = dataset[0];
				 			row["type"] = type;
				 			row["size"] = size;
				 			setSelectedZoomItem(row);
							loading.hide();
							return true;
				 			//zoommodal.remove();
						}
						
						var linhas = 0;
						for (var i=0; i<dataset.length; i++) {
							var row = dataset[i];
							linhas += 1;
							var html = "<tr data-dataset=" + i + ">";
							for (var x=0; x<showfields.length; x++) {
								html += "<td>" + row[showfields[x]] + "</td>";								
							}
							html += "</tr>";
					 		$(".table-zoom > tbody").append(html);
						}
				 		$(".table-zoom > tbody > tr").click(function() {
				 			$(".table-zoom > tbody > tr").removeClass("active");
				 			$(this).addClass("active");
				 			current = $(this).data("dataset");
				 		});
				 		$(".table-zoom > tbody > tr").dblclick(function() {
				 			var row = globaldataset[$(this).data("dataset")];
				 			row["type"] = type;
							row["size"] = size;
				 			setSelectedZoomItem(row);
				 			zoommodal.remove();
				 		});
						$('#msg').remove();
				 		if ( linhas == sqlLimit ){
							$(".modal-footer").prepend( '<span id="msg"  name="msg" style="text-align: left;color: red;float: left;"><b> *Foram listados '+sqlLimit+' registros, refine sua busca!</b></span>'  );
						}
				 		loading.hide();
					};

					if ( size == 'none' ){
						dosearch();
						return true;
					}
					
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

			    	console.log('Inicio processo...');
					
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
					};
					
					var setup = function(lista) {
						var l = lista.split(",");
						var html = "<tr>";
						for (var i=0; i<l.length; i++) {
							showfields.push(l[i]);
							html += "<th>" + l[i+1] + "</th>";
							i++;
						}
						html += "</tr>";
				 		$(".table-zoom > thead").append(html);
					};
				
					//var returnDataSet = function( dataset ){
					//	dataset["type"] = type;
					//	setSelectedZoomItem( dataset );
					//}
					
					var timeout = 0;
			 		$('#search').keyup(function() {
			 	    	clearTimeout(timeout);
			 	    	var keycode;
			 	    	if (window.event) {
			 	    		keycode = window.event.keyCode;
			 	    	} else if (event) {
			 	    		keycode = event.which;
			 	    	} else { 
			 	    		return true;
			 	    	}
			 	    	console.log("search", keycode);
			 	    	if (keycode == 13  && $("#search").val().length >= 3 ) {
			 	    		//if ( $("#search").val().length >= 3 )
			 	    			dosearch();
			 	    	} else {
			 	    		timeout = setTimeout(searchtable($(this).val()), 500);
			 	    	}			 			
			 		});		 		
					
			 		$('.zoom-selected').click(function() {
			 			var row = globaldataset[current];
			 			row["type"] = type;
						row["size"] = size;
			 			setSelectedZoomItem(row);
					});
			 		
			 		setup(fields);
			 		if ( !iniVazio || iniVazio  == 'list' )
			 			dosearch();
			 		else
			 			loading.hide();
			 		
			 		console.log('antes list...'+iniVazio);
			 		if ( iniVazio  == 'list' ){
			 			console.log('Entrou list...');
						$('#busca').hide();
			 		}
					
			    }
			});			
			
		}
	};
})();
