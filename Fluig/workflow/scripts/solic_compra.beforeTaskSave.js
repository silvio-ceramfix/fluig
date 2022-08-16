function beforeTaskSave(colleagueId,nextSequenceId,userList){
	
	var numState = getValue("WKNumState");
	
	if ( getValue("WKNumState") == 4 ){
		var user = getValue("WKUser");	
		hAPI.setCardValue('matricula_aprovador', user );
	}		
	
	if ((numState == '4' || numState == '0' || numState == '1' ) && hAPI.getCardValue('regularizacao')=='S') {
		
			var atv      = getValue("WKNumState");
		    var nextAtv  = getValue("WKNextState");



		        var anexos   = hAPI.listAttachments();
		        var temAnexo = false;

		        if (anexos.size() > 0) {
		            temAnexo = true;
		        }

		        if (!temAnexo) {
		            throw "É preciso anexar o documento para continuar o processo!";
		        }

	
	}
	
}