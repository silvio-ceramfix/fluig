function geraEspelhoNFD() {
	if ($('#e_mail').val().trim() == '') {
		FLUIGC.message.alert({
			message: 'E-mail Vazio',
		    title: 'Favor informar um e-mail!',
		    label: 'OK'
		});
	} else 
	{
	console.log('PASSOU');
	
	//montando html do texto
	var data = new Date();
	var hora    = data.getHours();   
	var html = '';
	if (hora <=12 ){
		html  = "<p>Bom dia,</p>";
		} else {
			html  = "<p>Boa tarde,</p>";
		}
	html = html + "<p>&nbsp;</p>";
	html = html + "<p>Abaixo espelho da NFe para Devolu&ccedil;&atilde;o:</p>";
	html = html + "<table>";
	html = html + "<tbody>";
	html = html + "<tr>";
	html = html + "<td>CFOP:</td>";
	html = html + "<td>"+" "+$('#cfop_geral').val()+" "+"</td>";
	html = html + "</tr>";
	html = html + "<tr>";
	html = html + "<td>Valor Total dos Produtos:</td>";
	html = html + "<td>R$ "+$('#valor_total_geral').val().replace('.',	',')+"</td>";
	html = html + "</tr>";
	html = html + "<tr>";
	html = html + "<td>Al&iacute;quota ICMS:</td>";
	html = html + "<td>"+$('#aliquota_icms_geral').val()+"%</td>";
	html = html + "</tr>";
	html = html + "<tr>";
	html = html + "<td>Base de C&aacute;lculo do ICMS:</td>";
	html = html + "<td>R$ "+$('#valor_total_bc_icms').val().replace('.',	',')+"</td>";
	html = html + "</tr>";
	html = html + "<tr>";
	html = html + "<td>Valor ICMS:</td>";
	html = html + "<td>R$ "+$('#valor_total_ICMS').val().replace('.',	',')+"</td>";
	html = html + "</tr>";
	if ($('#valor_total_ICMS_ST').val().replace('.',	',') != '0,00'){
		html = html + "<tr>";
		html = html + "<td>Base de C&aacute;lculo do ICMS ST:</td>";
		html = html + "<td>R$ "+$('#valor_total_bc_icms_st').val().replace('.',	',')+"</td>";
		html = html + "</tr>";
		html = html + "<tr>";
		html = html + "<td>Valor ICMS ST:</td>";
		html = html + "<td>R$ "+$('#valor_total_ICMS_ST').val().replace('.',	',')+"</td>";
		html = html + "</tr>";
	}	
	if ($('#valor_total_IPI').val().replace('.',	',') != '0,00'){
		html = html + "<tr>";
		html = html + "<td>Base de C&aacute;lculo IPI:</td>";
		html = html + "<td>R$ "+$('#valor_total_bc_ipi').val().replace('.',	',')+"</td>";
		html = html + "</tr>";
		html = html + "<tr>";
		html = html + "<td>Valor IPI:</td>";
		html = html + "<td>R$ "+$('#valor_total_IPI').val().replace('.',	',')+"</td>";
		html = html + "</tr>";
	}	
	html = html + "<tr>";
	html = html + "<td>Valor Total da Nota:</td>";
	html = html + "<td>R$ "+$('#valor_total_impostos').val().replace('.',	',')+"</td>";
	html = html + "</tr>";
	html = html + "</tbody>";
	html = html + "</table>";
	if ($('#valor_total_ICMS').val().replace('.',	',') != '0,00'){
		html = html + "<p>&nbsp;</p>";
		html = html + "<p>Caso não consiga destacar o ICMS ST ou IPI nos campos próprios, informar os valores no campo de despesas acessórias para somar ao valor total da NFe, bem como, informar nos dados adicionais da nota as informações de base de cálculo e valor que referem-se a tal imposto.</p>";
		html = html + "<p>&nbsp;</p>";
	}	
	if ($('#valor_total_ICMS_ST').val().replace('.',	',') != '0,00'){
		
	}
	html = html + "<p>At.,</p>";
	html = html + "<p>Ceramfix</p>";
	
	//finalizou montagem do html do texto 
	
	var mail = $('#e_mail').val();
	var nfVenda = $('#num_nota_fiscal').val();
	
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint( 'nfVenda', nfVenda, nfVenda, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'e_mail', mail, mail, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'html', html, html, ConstraintType.MUST));

	var dataset = DatasetFactory.getDataset( 'devolucao_send_mail', null, constraints, null);

	FLUIGC.message.alert({
		message: 'E-mail Enviado com Sucesso',
	    title: 'E-mail com os dados da Nota de Devolução a ser gerada enviado com sucesso!',
	    label: 'OK'
	});
	
	console.log('PASSOU1');
	}
}
