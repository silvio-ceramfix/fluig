var dataTable = null;
var dadosDatatable = [];
var rC = [];
var rH = [];



function apontaHoras(){
	
	var html =  '<div class="row"> '+
				'	<div class="col-md-6"> '+
				'		<div class="col-md-6 fs-no-padding"> '+
				'			<div class="form-group"> '+
				'				<label for="exampleTag">Data Ini</label> '+
				'				<input type="date" class="form-control valida" id="md_data_ini" name="md_data_ini" /> '+
				'			</div> '+
				'		</div> '+
				'		<div class="col-md-6 fs-no-padding"> '+
				'			<div class="form-group"> '+
				'				<label for="exampleTag">Hora Ini</label> '+
				'				<input type="time" class="form-control valida" step="1" id="md_hora_ini" name="md_hora_ini" /> '+
				'			</div> '+
				'		</div> '+
				'	</div> '+
				'	<div class="col-md-6"> '+
				'		<div class="col-md-6 fs-no-padding"> '+
				'			<div class="form-group"> '+
				'				<label for="exampleTag">Data Fim</label> '+
				'				<input type="date" class="form-control valida" id="md_data_fim" name="md_data_fim" /> '+
				'			</div> '+
				'		</div> '+
				'		<div class="col-md-6 fs-no-padding"> '+
				'			<div class="form-group"> '+
				'				<label for="exampleTag">Hora Fim</label> '+
				'				<input type="time" class="form-control valida" step="1" id="md_hora_fim" name="md_hora_fim" /> '+
				'			</div> '+
				'		</div> '+
				'	</div> '+
				'</div>'+
				'<div class="row"> '+
				'	<div class="col-md-12"> '+
				'		<textarea class="form-control valida" rows="2" id="md_apontamento" name="md_apontamento" ></textarea> '+
				'	</div> '+
				'</div>'+
				'<div class="row"> '+
				'	<div class="col-md-12"> '+
				'		<div id="idtable_apont"></div> '+					
				'	</div> '+
				'</div>';

	var md_apontamento = FLUIGC.modal({
		title: 'Apontamento Hora',
		content: html,
		id: 'fluig-modal',
		size: 'large',
		actions: [{
			'label': 'Apontar',
			'bind': 'data-confirma-modal',
		},{
			'label': 'Cancelar',
			'autoClose': true
		}]
	}, function(err, data) {
		if(err) {
			// do error handling
		} else {
			// do something with data
			$('#md_data_ini').val( DataHoje().split('/').reverse().join('-') );
			$('#md_data_ini').attr( 'max', DataHoje().split('/').reverse().join('-') );
			//$('#md_hora_ini').val( HoraHoje() );
			$('#md_data_fim').val( DataHoje().split('/').reverse().join('-') );
			$('#md_data_fim').attr( 'max', DataHoje().split('/').reverse().join('-') );
			$('#md_hora_fim').val( HoraHoje() );
			$('#md_apontamento').val( $('#apontamento').val() );	
			
			loadDataTable();
			loadDadosDataTable();
			
		}
	});
	
	$('#fluig-modal').on('click', '[data-confirma-modal]', function(ev) {

		var dt_ini = new Date( $('#md_data_ini').val() + ' ' + $('#md_hora_ini').val() );
		var dt_fim = new Date( $('#md_data_fim').val() + ' ' + $('#md_hora_fim').val() );
		var dt_hoje = new Date();

		if ( dt_ini - dt_hoje > 0 ){
			toast('Data inicial não pode ser maior que hoje','danger');
			return false;
		}

		if ( dt_fim - dt_hoje > 0 ){
			toast('Data final não pode ser maior que hoje','danger');
			return false;
		}

		if ( dt_ini - dt_fim > 0 ){
			toast('Data inicial não pode ser maior que data final','danger');
			return false;
		}

		var qtd = 0;
		var constraints = new Array();
		var formulario = {};
		$( "input[name*=md_], textarea[name*=md_]" ).each(function( index ) {
			console.log(this.id, $(this).val() );
			if ( $(this).val() == '' && $(this).hasClass('valida') ){
				qtd++;
			}

			constraints.push( DatasetFactory.createConstraint( this.id.replace('md_',''),  this.value, 'field', ConstraintType.MUST) );
			formulario[this.id.replace('md_','')] = this.value;
		});

		if ( qtd > 0 ){
			toast('Existem campos obrigatórios não preenchidos','danger');
			return false;
		}

		// if ( $('#md_data_fim').val() != '' && $('#md_hora_fim').val() != '' ){
		// 	constraints.push( DatasetFactory.createConstraint( 'atividade', '4', '4', ConstraintType.MUST) );
		// } else {
		// 	constraints.push( DatasetFactory.createConstraint( 'atividade', '2', '2', ConstraintType.MUST) );
		// }
		formulario['processo_pai'] = $('#processo').val();
		formulario['cod_usuario'] = $('#user_fluig').val();
		formulario['usuario'] = $('#nome_user_fluig').val();
		formulario['num_task'] = $('#task').val();
		
		var startRequest = {
		        "targetState": 4,
		        "targetAssignee": $('#user_fluig').val(),
		        "subProcessTargetState": 0,
		        "comment": "Apontamento via formulário.",
		        "formFields": formulario
		};

		myLoading2.show();
		
		parent.WCMAPI.Create({
			url: parent.WCMAPI.serverURL + '/process-management/api/v2/processes/wf_apontamento_horas/start',
		    contentType: 'application/json',
		    type: 'POST',
		    data: startRequest,
		    success: function (data, status, jqXHR) {
		    	console.log('data.processInstanceId.........',data.processInstanceId);
		        toast('Apontamento efetuado com sucesso, processo: ' + data.processInstanceId + ' !','success');
				myLoading2.hide();
				$( "input[name*=md_], textarea[name*=md_]" ).val("");
				loadDadosDataTable();
				
		    },
		    error: function (msg) {
		    	console.log('ERROR data.processInstanceId.........',msg.status);
		        console.log('ERROR data.processInstanceId.........',msg.statusText);
		        mapaErros(msg.status);
		        myLoading2.hide();
		        FLUIGC.toast({
		        	title: 'Erro Apontamento: ',
		        	message: mapaErros(msg.status)+" "+msg.statusText,
		        	type: 'danger'
		        });
		    }
		});

	});
}

function loadDataTable(){
  // console.log('loadReceitas');
  rC = ['ts','cod_usuario','usuario','data_ini','data_fim','tempo','num_proces','den_form_pai'];
  
  rH = [ {'title': '','width':'0%' },
          {'title': '','display':false,'width':'0%' },
          {'title': 'Usuário', 'dataorder':'usuario', 'width':'10%' },
          {'title': 'Data Ini', 'dataorder':'data_ini', 'width':'10%' },
          {'title': 'Data Fim','dataorder':'data_fim','width':'10%'},
          {'title': 'Num de horas/minutos','dataorder':'tempo','width':'10%'},       
          {'title': '','display':false,'width':'0%' },
          {'title': 'Título', 'dataorder':'titulo','display':false, 'width':'10%' }
        ];
  
  dataTable = FLUIGC.datatable('#idtable_apont', {
  dataRequest: dadosDatatable,
  renderContent: rC,
  limit:10,
  responsive: true,
  tableStyle:'table table-striped table-responsive table-bordered table-condensed',
  emptyMessage: '<div class="text-center">Nenhum dado encontrado!</div>',
  header: rH,			  	
    search: {
      enabled: false,
        onSearch: function(res) {
          console.log( res );
            var data = dadosDatatable;
            var search = data.filter(function(el) {
                return (el.data_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 || 
                        el.tipo_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 || 
                        el.valor_receita.toUpperCase().indexOf(res.toUpperCase()) >= 0 || 
                        el.valor_ajuda_custo.toUpperCase().indexOf(res.toUpperCase()) >= 0 ) 
            });
            dataTable.reload(search); 
        },
        onlyEnterkey: false,
        searchAreaStyle: 'col-md-3'
    },
  scroll: {
        target: '#idtable_apont',
        enabled: false
      },
  navButtons: {
        enabled: false,
      },
  draggable: {
        enabled: false
      },

  }, function(err, data) {
    if (err) {
        FLUIGC.toast({
          message: err,
          type: 'danger'
        });
      }else{
        loadWindow.hide();
      }
  });

  // loadDadosDataTable();

}

var loadWindow = FLUIGC.loading(window);

function loadDadosDataTable(){
  loadWindow.show();

  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint("cod_usuario", $('#WKUser').val(), $('#WKUser').val(), ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint("processo_pai", $('#processo').val(), $('#processo').val(), ConstraintType.MUST));
  //constraints.push(DatasetFactory.createConstraint("num_task", $('#task').val(), $('#task').val(), ConstraintType.MUST));
  
  var callback = {
      success: function(dataSet) {
          console.log(dataSet.values);
          if( dataSet != null && dataSet != undefined ){

            var data = dataSet.values;          

            var tempo_dia = 0;
            var tempo_total = 0;
            var regs = new Array();
            for (var i = 0; i < data.length; i++) {

                var dt1 = new Date(data[i]['data_ini'].split('/').reverse().join('-') + ' ' + data[i]['hora_ini'].substring(0, 5) );
                var dt2 = new Date(data[i]['data_fim'].split('/').reverse().join('-') + ' ' + data[i]['hora_fim'].substring(0, 5) );
                var tempo = diffDatesHours(dt1, dt2);

                var btnTS = '<button id="testbut" class="btn btn-info btn-xs" onclick="consultaProcesso('+ data[i]['num_proces']  +');" > '+
                    '	<span class="fluigicon fluigicon-process icon-sm"></span> '+
                    '</button>';  
                
                if ( $('#WKUser').val() == data[i]['cod_usuario'] || $('#WKUser').val() == 'admin'){
                  btnTS += '<button id="testbut" class="btn btn-danger btn-xs" onclick="deletaProcesso('+ data[i]['num_proces']  +');"> '+
                        '	<span class="fluigicon fluigicon-trash icon-sm"></span> '+
                        '</button>';
                }

                var btnChamado = '<span data-consulta-chamado style="text-decoration-line: underline;" > '+
                					data[i]['chamado']+
                				'</span>';  
                
               var datatableRow = {  ts: btnTS,
                                     num_proces: data[i]['num_proces'],
                                     den_form_pai: data[i]['den_form_pai'],
                                     cod_usuario: data[i]['cod_usuario'],
                                     usuario: data[i]['usuario'],        
                                     data_ini: data[i]['data_ini'].split('-').reverse().join('/') + ' ' + data[i]['hora_ini'].substring(0, 5),
                                     data_fim: data[i]['data_fim'].split('-').reverse().join('/') + ' ' + data[i]['hora_fim'].substring(0, 5),
                                     tempo: tempo.substring(0, 5) }
               regs.push(datatableRow);
               
            }
           
            dataTable.reload(regs);
            loadWindow.hide();

          } else {
              toast('Nenhum dado encontrado', 'warning');
          }  
              
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR, textStatus, errorThrown);
      }
  };

  var dataSet = DatasetFactory.getDataset("dsk_apontamentos", null, constraints, null, callback);  
  
}

function consultaProcesso(processo) {

    var WCMAPI = window.parent.WCMAPI;

    var url = WCMAPI.getTenantURL() + '/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=' + processo;

    window.open(url, '_blank');
};


function deletaProcesso( processo ) {
    
    var conteudo =  'Deseja realmente excluir o apontamento de número: ' + processo  + ' ?';

    var cancelaModal = FLUIGC.modal({
        title: 'Exclui apontamento',
        content: conteudo,
        id: 'fluig-cancela',
        actions: [{
            'label': 'Confirmar',
            'classType': 'btn-success cancela',
            'bind': 'confirma',
        }, {
            'label': 'Cancelar',
            'autoClose': true
        }]
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

            $('.cancela').click(function () {
                
                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint("status",   	  '1',      null, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint("num_processo",  processo, null, ConstraintType.MUST));
                var dataSet = DatasetFactory.getDataset("dsk_update_status_processo", null, constraints, null, {
                    success: function(dataSet) {
                        loadDadosDataTable();
                        cancelaModal.remove();
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR, textStatus, errorThrown);
                    }
                });  
            });

        }
    });
}