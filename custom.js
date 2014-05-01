console.log("Custom code executed!");

// Custom methods

var listening = true;
var timer = 1500;
var maxDimmingValue = 30; // Max 99%
var dimmingDuration = 128; // Max 255s

var lightsToSwitchOn = [ 
 "devices[18].instances[0]", 
 "devices[30].instances[0]",
// "devices[28].instances[0]",
 "devices[17].instances[0]", 
 "devices[16].instances[0]", 
 "devices[43].instances[0]", 
 "devices[6].instances[0]", 
 "devices[9].instances[1]",
// "devices[9].instances[3]", 
// "devices[9].instances[4]", 
// "devices[9].instances[5]", 
// "devices[9].instances[2]", 
 "devices[7].instances[0]",
 "devices[15].instances[1]",
 "devices[15].instances[2]"]; 

var lightsToSwitchOff = [ 
 "devices[20].instances[0]", 
 "devices[7].instances[0]",
 "devices[9].instances[1]",
// "devices[9].instances[2]", 
// "devices[9].instances[5]", 
// "devices[9].instances[4]", 
// "devices[9].instances[3]", 
 "devices[6].instances[0]", 
 "devices[43].instances[0]", 
 "devices[16].instances[0]", 
 "devices[17].instances[0]", 
 "devices[18].instances[0]", 
// "devices[28].instances[0]",
 "devices[30].instances[0]",
 "devices[15].instances[1]",
 "devices[15].instances[2]" ];



/*

var deviceState = false;

MyHAC01SwitchToggler(25, lightsToSwitchOff);

function MyHAC01SwitchToggler(pDeviceId, pLights) {

 console.log("MyHAC01SwitchEnabler (" + pDeviceId + ", " + pLights + ")"); 

 zway.devices[pDeviceId].data.lastReceived.bind(function() {
  console.log("Custom code for device " + pDeviceId + " in automation/custom.js");
  
  if (listening) {
 
   if (deviceState) {
    deviceState = false;
    console.log("deviceState: " + deviceState);
   } else if  (!deviceState) {
    deviceState = true;
    console.log("deviceState: " + deviceState);
   }
   
   MySwitchAllLights(deviceState, pLights);
   
   listening = false;
   
   setTimeout(function() {
    console.log("timer to null in " + timer + "ms");
    listening = true;
   }, timer);

  }
  
  console.log("End custom code for device " + pDeviceId + " in automation/custom.js");
  
 });

}

*/



function MySwitchAllLights(pToggler, pLights) {
	console.log("MySwitchAllLights(" + pToggler + ", " + pLights + ")");

	if (pToggler) {
		system("curl http://localhost:5005/Salon/volume/12");
		system("curl http://localhost:5005/Salon/play");
	} else {
		system("curl http://localhost:5005/Salon/pause");
	}

	for(var i = 0; i < pLights.length; i++) {
		MySwitchAllLightsTimer(i, pToggler, pLights);
	}
}

function MySwitchAllLightsTimer(pCounter, pToggler, pLights) {
	console.log("MySwitchAllLightsTimer(" + pCounter + ", " + pToggler + ", " + pLights	+ ")")
	setTimeout(function() {
		console.log("pLights[" + pCounter + "] = " + pLights[pCounter]);
		MyZwaveSwitchValue(pLights[pCounter], pToggler);
	}, timer + timer * pCounter);
}

function MyZwaveSwitchValue(pLight, pToggler) {
	console.log("MyZwaveSwitchValue(" + pLight + ", " + pToggler + ")")
	var newValue = 0;
	
	var lightType = eval('zway.' + pLight + '.data.genericType.value');

	if (pToggler) {
		if (lightType == 16) {
			newValue = 255;
		} else if  (lightType == 17) {
			newValue = maxDimmingValue;
		}
	}
	
	if (lightType == 16) {
		console.log("zway." + pLight + ".SwitchBinary.Set(" + newValue + ")");
		eval('zway.' + pLight + '.SwitchBinary.Set(' + newValue + ')');
	} else if  (lightType == 17) {
		console.log("zway." + pLight + ".SwitchMultilevel.Set(" + newValue + ")");
		eval('zway.' + pLight + '.SwitchMultilevel.Set(' + newValue + ', ' + dimmingDuration + ')');
	}
}



// ON OR OFF


MySwitchAllLightActivator(25, true, lightsToSwitchOn);
MySwitchAllLightActivator(26, false, lightsToSwitchOff);

function MySwitchAllLightActivator(pDeviceId, pToggler, pLights) {
	console.log("MySwitchAllLightActivator (" + pDeviceId + ", " + pToggler + ", " + pLights + ")"); 
	
	zway.devices[pDeviceId].data.lastReceived.bind(function() {
		console.log("Custom code for device " + pDeviceId + " in automation/custom.js");

		if (listening) {
			
			var lightsToSwitch = new Array();

			for (var i = 0; i < pLights.length; i++) {
				var lightType = eval('zway.' + pLights[i] + '.data.genericType.value');
				var currentLigthValue;
	
				if (lightType == 16) {
					currentLigthValue = eval('zway.' + pLights[i] + '.SwitchBinary.data.level.value');
				} else if (lightType == 17){
					currentLigthValue = eval('zway.' + pLights[i] + '.SwitchMultilevel.data.level.value');
				}
	
				console.log('pLights[' + i + '].data.level.value = ' + currentLigthValue)

				if ((pToggler && currentLigthValue == 0) || 
					(pToggler && currentLigthValue > 0 && currentLigthValue != maxDimmingValue) || 
					(!pToggler && currentLigthValue > 0)) {
					lightsToSwitch.push(pLights[i]);
				}
			}
			
			console.log('New lights after controlling status:');

			for (var i = 0; i < lightsToSwitch.length; i++) {
				console.log('lightsToSwitch[' + i + '].data.level.value = ' + currentLigthValue)
			}
			
			MySwitchAllLights(pToggler, lightsToSwitch);
			
			listening = false;

			setTimeout(function() {
				console.log("timer to null in " + timer + "ms");
				listening = true;
			}, timer * pLights.length);
		}
	});
  
	console.log("End custom code for device " + pDeviceId + " in automation/custom.js");
}
