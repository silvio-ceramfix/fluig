
var descFile = "";
var idDocProc = "";
var idDocAux = "";
var idTitDoc = "";
var idTitAux = "";

function loadFile( id ){
	var hoje = new Date();
	console.log('id......'+ id);
	idDocAux = "";
	var seq = id.split('___')[1];
	var campo = id.split('___')[0];
	console.log('campo  ',campo);
	if( campo == "bt_doc_anexo" ){
		descFile =  hoje+'___'+seq+'ANEXO';
		console.log('descfile original ',descFile);
		idDocProc = 'doc_anexo___'+seq;
		idTitDoc = 'titulo_doc_anexo___'+seq;
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
    console.log('files aqui ',file);
    console.log('desfile ',descFile);
    console.log('pasta ',$("#num_pasta_anexo").val());
    console.log('filename ',file.name);
	$.ajax({
		async : true,
		type : "POST",
		contentType: "application/json",
		url : '/api/public/ecm/document/createDocument',
		
		data: JSON.stringify({
			"description": descFile,
			"parentId": $("#num_pasta_anexo").val(),
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
