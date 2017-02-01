module['exports'] = function hydrawiseHttpRequest (hook) {

    var expectedEvent = "control";
 
  	var i = null;
    var controllerMap = {};
    var relayMap = {};
    var result;
  	var relay_id, serial_id, controller_id;

	var deviceID = "340040000b47353235303037";

    var request = require('request');

    var relState = '000000000';
  
    request.get('https://api.spark.io/v1/devices/340040000b47353235303037/pins?access_token=6317afcc8e351714947ba19dcfab4bd5ebc00243', { json: true }, function(err, res, body){        

      if (err) {
          return outputResult({ message: err.messsage },null);
      }
      
      if(body.length > 0 && body.error == null ) {
        relState = body.result;
      }
    
    });
  
  	request.get('http://app.hydrawise.com/api/v1/statusschedule.php?api_key=5652-8151-87CA-87CA&controller_id=23765', { json: true }, function(err, res, body){  

      if (err) {
        return outputResult({ message: err.messsage },null);
      }
      
      
      if (  body.running != null && body.running.length > 0) {
        
        for ( i = 0; i < body.running.length; i++) {
    		setRelay(body.running[i].relay,'1');
        }
        
        var stopFlag;
        
        for ( j = 1; j < 7; j++) {
          
          stopFlag = true;
          for ( i = 0; i < body.running.length; i++) {
              if( body.running[i].relay == j ) {
                stopFlag = false;
                continue;
              }
          }
          
          if( stopFlag == true )
          	setRelay(j.toString(),'0');
        }
      }
	  else {
        for ( i = 1; i < 7; i++) {
          
          if( relState.charAt(i) != '1' ) {
          	setRelay(i.toString(),'0');
          }
        }
      }
        
  	})
  
  
	function setRelay(relayNumber,state) {
		
        var request = require('request');
		var deviceID = "340040000b47353235303037";      
      
		request.post("https://api.spark.io/v1/devices/" + deviceID + "/relay?access_token=6317afcc8e351714947ba19dcfab4bd5ebc00243", { json : {'params' : relayNumber+state }}, function(err, res, body){            
          
          if (err) {
            return outputResult({ message: err.messsage },null);
          }

          return outputResult(null, { message: res } );
      
	  	})
	}
	
  
  function outputResult(err, result) {
  
    var data;
    if(err) {
      data = { error: err.message };
    } else {
      data = { result: result };
    }
    hook.res.end(JSON.stringify(data, true, 2));
  }
  
  
};
  