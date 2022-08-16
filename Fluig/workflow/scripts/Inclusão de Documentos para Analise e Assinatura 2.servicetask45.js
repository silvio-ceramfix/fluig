function servicetask45(attempt, message) {
	
	cadastraNovosAssinantes('1','admin','SrvCeram971');
	parentFolder = String(hAPI.getCardValue("folderID"));
	getAttach();
	
	return true;
	
}