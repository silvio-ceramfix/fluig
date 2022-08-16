
var descFile = "";
var idDocProc = "";
var idDocAux = "";
var idTitDoc = "";
var idTitAux = "";

function loadFile( id ){
	
	console.log('id......'+ id);
	idDocAux = "";
	
	if( id == "bt_custo_meta" ){
		descFile =  $('#processo').val()+" "+$('#den_item').val()+" - Custo Meta ";
		idDocProc = "doc_custo_meta";
		idTitDoc = "titulo_doc_custo_meta";
	}
	if( id == "bt_formulacao" ){
		descFile =  $('#processo').val()+" "+$('#den_item').val()+" - Formulacao ";
		idDocProc = "doc_formulacao";
		idTitDoc = "titulo_doc_formulacao";
	}
	if( id == "bt_ficha_tec" ){
		descFile =  $('#processo').val()+" "+$('#den_item').val()+" - Ficha Tecnica ";
		idDocProc = "doc_ficha_tec";
		idTitDoc = "titulo_doc_ficha_tec";
	}
	if( id == "bt_fispq_produto" ){
		descFile =  $('#processo').val()+" "+$('#den_item').val()+" - Fispq Produto ";
		idDocProc = "doc_fispq_produto";
		idTitDoc = "titulo_doc_fispq_produto";
	}
	if( id == "bt_fispq_premix" ){
		descFile =  $('#processo').val()+" "+$('#den_item').val()+" - Fispq Premix ";
		idDocProc = "doc_fispq_premix";
		idTitDoc = "titulo_doc_fispq_premix";
	}
	if( id == "bt_manual_produto" ){
		descFile =  $('#processo').val()+" "+$('#den_item').val()+" - Manual Produto ";
		idDocProc = "manual_produto";
		idTitDoc = "titulo_manual_produto";
	}

	var seq = id.split('___')[1];
	var campo = id.split('___')[0];
	if( campo == "bt_custos" ){
		descFile =  $('#processo').val()+" "+$('#den_item').val()+" - "+ $('#cst_empresa___'+seq).val().trim() +" - "+ $('#cst_uf___'+seq).val().trim() +" - Custo";
		idDocProc = 'doc_custos___'+seq;
		idDocAux = 'doc_custos_cont___'+seq;
		idTitDoc = 'titulo_doc_custos___'+seq;
		idTitAux = 'titulo_doc_custos_cont___'+seq;
	}

	if( campo == "bt_form_cor" ){
		descFile =  $('#processo').val()+" "+$('#den_item').val()+" - "+ $('#cor_form___'+seq).val().trim() +" - Formulacao";
		idDocProc = 'doc_form_cor___'+seq;
		idTitDoc = 'titulo_doc_form_cor___'+seq;
	}

	console.log('descFile...',descFile);
	$('#load_file').click();
	
}

var myLoading = FLUIGC.loading(window, {
	textMessage:  'Aguarde, realizando upload.'
}); 
    
function selectFile( files ){
	console.log(files);	
	
	if( files.length == 0 ){
		return false;
	}
	
    var file = files[0];
    myLoading.show();
    var blob = new Blob([file],{type: 'application/octet-stream'});
    //enviar o arquivo selecionado para o diretório de upload do usuário logado    
    $.ajax({
        url: '/api/public/2.0/contentfiles/upload/?fileName=' + file.name,
        type: 'POST',
        //data: formData,
        data: blob,
        cache: false,
        contentType: 'application/octet-stream',
        processData: false,                
        success: function(data) {
            //seta nome do arquivo em um input text para correta visualizacao no dataset do form
            $('#file_name').val(file.name);        
            //funcao que controle o checked que indica se o arquivo foi selecionado
            //checkDocumento(file.name, $(input).data("checkbox-name"));
            myLoading.hide(); 
            
            publicaFile( file );
        },
        error: function(xhr, status, error) {
            //erro
            if (status == "error"){
                $(input).val("");        
                checkDocumento("", $(input).data("checkbox-name"));
            }
            myLoading.hide();                                    
            console.log("STATUS: " + status);
            console.log("ERROR: " + error);        
            console.log(xhr);            
            var err = eval("(" + xhr.responseText + ")");                                
            //exibe erro no form
            FLUIGC.toast({
                title: '<strong>Erro ao realizar upload do arquivo selecionado. </strong>',
                message: err.message.message + " " + error,
                type: 'success'
            });            
        }                          
    });        
}

function publicaFile( file ){
    myLoading.show();
	$.ajax({
		async : true,
		type : "POST",
		contentType: "application/json",
		url : '/api/public/ecm/document/createDocument',

		data: JSON.stringify({
			"description": descFile,
			"parentId": $("#num_pasta_produto").val(),
			"attachments": [{
				"fileName": file.name
			}],
		}),
		error: function() {
			FLUIGC.toast({
				 title: '',
				 message: "Falha ao enviar",
				 type: 'danger'
			 });
			myLoading.hide();
		},
		success: function(data) {
			console.log('data.....',data.content.id);
			$( '#'+idDocProc ).val( data.content.id );
			if( idDocAux != "" ){
				$( '#'+idDocAux ).val( data.content.id );
			}
			if( idTitDoc != "" ){
				$( '#'+idTitDoc ).val( file.name );
			}
			if( idTitAux != "" ){
				$( '#'+idTitAux ).val( file.name );
			}
			
			FLUIGC.toast({
				 title: '',
				 message: "Documento publicado - " + file.name,
				 type: 'success'
			 });
			myLoading.hide();
		},
	});	
}
