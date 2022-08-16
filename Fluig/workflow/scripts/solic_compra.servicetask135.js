function servicetask135(attempt, message) {
	
	var user = getValue("WKUser");	
	
	var ct = [];
	ct.push( DatasetFactory.createConstraint("processo", getValue("WKNumProces"), null, ConstraintType.MUST) );
	ct.push( DatasetFactory.createConstraint("assunto", "Processo: "+getValue("WKNumProces"), null, ConstraintType.MUST) );
	ct.push( DatasetFactory.createConstraint("corpo", 	"Processo: "+getValue("WKNumProces"), null, ConstraintType.MUST) );
	ct.push( DatasetFactory.createConstraint("destinatario", "nfse@ceramfix.com.br", null, ConstraintType.MUST) );
	
	DatasetFactory.getDataset("sendMailAnexoProcesso", null, ct, null);

}