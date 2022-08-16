function addItens() {

  parent.$('#workflowView-cardViewer').css( 'zIndex', 1 );
  
  //var html = $('.tmpl_add_itens').html();		
  var html = $('#linha_filtro').html();
  html = html.replace(/_xxx/g, '_modal');
  // console.log('html....',html);
      
  var myModal = FLUIGC.modal({
      title: 'Adiciona Parâmetros',
      content: html,
      id: 'wParametros',
      formModal: false,
      size: 'full',
      actions: [{
          'label': 'Salvar',
          'classType': 'save btn-success',
          'autoClose': false
      },{
          'label': 'Fechar',
          'autoClose': true
      }]
  }, function(err, data) {
      if(err) {
          // do error handling
      } else {

    	  console.log('antes set setFiltro.....');
    	  setTimeout('setFiltro();', 10 );
          
          $('.save').click(function() {

              if (!valida('.parametros')){
                return false;
              }

         
              myModal.remove();
          });
        
      };            
  });
}

function setFiltro(){
	//reloadZoomFilterValues("den_familia", "table,familia");
	//reloadZoomFilterValues("den_familia", "table,familia,cod_empresa,"+ $("#cod_empresa").val() );
}