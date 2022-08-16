function defineStructure() {}

function onSync(lastSyncDate) {}

function createDataset(fields, constraints, sortFields) {

    var dataset = DatasetBuilder.newDataset();

    var dataBase = 'java:/jdbc/FluigDS';
    var param = '';
    var user = '';
    var empresa = '';
    var val_param = '';

    dataset.addColumn( "val_param" );

	if (constraints != null) {			
        for (var i = 0; i < constraints.length; i++) {
    		if ( constraints[i].fieldName == 'colleaguePK.companyId' ){
    			empresa = constraints[i].initialValue;
    		}else if( constraints[i].fieldName == 'colleaguePK.colleagueId' )  {
    			user = constraints[i].initialValue;    			
    		}else if( constraints[i].fieldName == 'chave' )  {
    			param = constraints[i].initialValue;    			
    		}else if( constraints[i].fieldName == 'val_param' )  {
    			val_param = constraints[i].initialValue;    			
    		}
    	}
	}

	try{
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup( dataBase );
		var connectionWD = dataSourceWD.getConnection();

		var SQL = "";
		
		if ( param == 'UserPhysicalVolumeUpload' ){
			SQL = " select s.storage||'upload/'||e.user_code||'/' as DATA_VALUE "+
			  	  "   from fdn_volumesite s "+
			  	  "   join fdn_volume v on (v.volume_id = s.volume_id) "+
			      "   join fdn_usertenant e on (e.tenant_id = v.tenant_id) "+
			      "   left join fdn_userdata d on ( d.data_key = 'UserPhysicalVolume' "+
			      "                             and d.data_value = v.volume_code "+
			      "                             and d.user_tenant_id = e.user_tenant_id ) "+
			      "   where ( d.userdata_id is not null or "+
			      "         ( d.userdata_id is null and v.volume_type = 0 ) ) "+ 
			      "     and v.tenant_id = "+empresa+"  "+
			      "     and e.user_code = '"+user+"'  "; 
		}else if ( val_param == "" ){
		   	SQL = " select d.DATA_VALUE "+ 
			      "   from fdn_usertenant u "+
			      "   join fdn_userdata d on ( u.USER_TENANT_ID = d.USER_TENANT_ID ) "+
			      "  where u.TENANT_ID = "+empresa+" "+
			      "    and u.USER_CODE = '"+user+"' "+
			      "    and d.DATA_KEY = '"+param+"'  ";
		}else{
			SQL = " select u.USER_CODE as DATA_VALUE "+ 
	      	  "   from fdn_usertenant u "+
	      	  "   join fdn_userdata d on ( u.USER_TENANT_ID = d.USER_TENANT_ID ) "+
	      	  "  where u.TENANT_ID = "+empresa+" "+
	      	  "    and d.DATA_VALUE = '"+val_param+"' "+
	      	  "    and d.DATA_KEY = '"+param+"'  ";			
		}
		 
		log.info( "SQL..... "+SQL );
		
		var statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = statementWD.executeQuery();

		while(rsWD.next()){
			var dados = new Array();
			dados.push( rsWD.getString( "DATA_VALUE" )  );
			dataset.addRow( dados );		
		}

		rsWD.close();

	} catch (e){
		log.info( "ERROOOOOO"+ e.getMessage() );
	} finally {
		if (statementWD != null) {
			statementWD.close();
		}
		if (connectionWD != null) {
			connectionWD.close();
		}
	}	
	
    return dataset;

}

function onMobileSync(user) { }