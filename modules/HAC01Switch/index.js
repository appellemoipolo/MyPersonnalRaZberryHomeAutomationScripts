/******************************************************************************

HAC01Switch ZAutomation module
Version: 1.0.0
(c) ZWave.Me, 2013

-----------------------------------------------------------------------------
Author: polo
Description:
Make an HAC01 module from Everyspring act like a single switch

******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function HAC01Switch (id, controller) {
  // Call superconstructor first (AutomationModule)
  HAC01Switch.super_.call(this, id, controller);
}

inherits(HAC01Switch, AutomationModule);

_module = HAC01Switch;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

HAC01Switch.prototype.init = function (config) {
  // Call superclass' init (this will process config argument and so on)
  HAC01Switch.super_.prototype.init.call(this, config);

  this.map = config.map;

  // Check VirtualDevice existence
  //if (!this.controller.devices.hasOwnProperty(this.map.config.commandDevice)) {
  //    // Exit initializer due to lack of the device
  //    CustomConsoleLog("ERROR", "HAC01Switch", this.config.device, "doesn't exist.");
  //    return;
  //}

  var self = this;

  // Boucle à créer pour prendre en compte toute la map !
  for (var i = 0; i < this.map.length; i++) {

  }

  var firstMap = this.map[0];

  // Prendre en compte ces variables ! Essayer de faire un HAC01Witch.timer par exemple ? mais pour l'instance courante
  HAC01Switch.timer = firstMap.timerBetweenDeviceChangingState;
  HAC01Switch.maxDimmingValue = firstMap.devicesLevelValueIfTypeIsDimmer; // Max 99%
  HAC01Switch.dimmingDuration = firstMap.devicesDimmingDuration; // Max 255s
  HAC01Switch.debugLevel = firstMap.debugLevel;

  HAC01SwitchMySwitchAllLightActivator(firstMap.commandDevice, firstMap.commandToRun, firstMap.devicesToControl);
};


// ----------------------------------------------------------------------------
// --- Private methods
// ----------------------------------------------------------------------------


var listening = true;


function HAC01SwitchMySwitchAllLightActivator(__deviceId, __toggler, __lights) {
  if (__toggler) {
    LogInfo("Binding HAC01 device " + __deviceId + " to switch {" + __lights + "} on");
  } else {
    LogInfo("Binding HAC01 device " + __deviceId + " to switch {" + __lights + "} off");
  }

  zway.devices[__deviceId].data.lastReceived.bind(function() {

    var isOnlyAnUpdate = true;


    



    // Revoir cette partie qui test quoi faire







    LogDebug("Check device " + __deviceId + " command class SWITCH_BINARY level:");
    LogDebug("zway.devices[" + __deviceId + "].instances[0].commandClasses[37].data.level.value = " + zway.devices[__deviceId].instances[0].commandClasses[37].data.level.value);
    if (zway.devices[__deviceId].instances[0].commandClasses[37].data.level.value > 0) {
      isOnlyAnUpdate = false;
    }

    LogDebug("Check main controler command class CLASS_BASIC level:")
    LogDebug("zway.devices[1].instances[0].commandClasses[32].data.level.value = " + zway.devices[1].instances[0].commandClasses[32].data.level.value);
    if (zway.devices[1].instances[0].commandClasses[32].data.level.value > 0) {
      isOnlyAnUpdate = false;
    }

    if (isOnlyAnUpdate) {
      LogInfo("Device " + __deviceId + " asked only for a status update");
    } else {
      LogInfo("Device " + __deviceId + " asked for lights update");

      if (listening) {

        var lightsToSwitch = new Array();

        LogDebug("Creating lights list to update...");




        // Controler l'existance du module à traiter !




        for (var i = 0; i < __lights.length; i++) {
          var lightType = eval('zway.' + __lights[i] + '.data.genericType.value');
          var currentLigthValue;

          if (lightType == 16) {
            currentLigthValue = eval('zway.' + __lights[i] + '.SwitchBinary.data.level.value');
          } else if (lightType == 17){
            currentLigthValue = eval('zway.' + __lights[i] + '.SwitchMultilevel.data.level.value');
          }

          if ((__toggler && currentLigthValue == 0) ||
          (__toggler && currentLigthValue > 0 && currentLigthValue != maxDimmingValue) ||
          (!__toggler && currentLigthValue > 0)) {
            lightsToSwitch.push(__lights[i]);
            LogDebug(__lights[i] + ' with value ' + currentLigthValue + " added to lights list");
          } else {
            LogDebug(__lights[i] + ' with value ' + currentLigthValue + " not added to lights list");
          }
        }

        LogInfo("Lights to update: " + lightsToSwitch);

        HAC01SwitchMySwitchAllLights(__toggler, lightsToSwitch);

        listening = false;

        setTimeout(function() {
          CustomConsoleLog("timer to null in " + timer + "ms");
          listening = true;
        }, timer * __lights.length);
      }
    }
  });

  LogInfo("Device " + __deviceId + " binded");
}


function HAC01SwitchMySwitchAllLights(__toggler, __lights) {
  LogDebug("HAC01SwitchMySwitchAllLights")

  for(var i = 0; i < __lights.length; i++) {
    HAC01SwitchMySwitchAllLightsTimer(i, __toggler, __lights);
  }
}


function HAC01SwitchMySwitchAllLightsTimer(__counter, __toggler, __lights) {
  LogDebug("HAC01SwitchMySwitchAllLightsTimer: Device " + __lights[__counter]);

  setTimeout(function() {
    HAC01SwitchMyZwaveSwitchValue(__lights[__counter], __toggler);
  }, timer + timer * __counter);
}


function HAC01SwitchMyZwaveSwitchValue(__light, __toggler) {
  LogDebug("HAC01SwitchMyZwaveSwitchValue(" + __light, + ", " + __toggler + ")");

  var newValue = 0;

  var lightType = eval('zway.' + __light + '.data.genericType.value');

  if (__toggler) {
    if (lightType == 16) {
      newValue = 255;
    } else if  (lightType == 17) {
      newValue = maxDimmingValue;
    }
  }

  if (lightType == 16) {
    eval('zway.' + __light + '.SwitchBinary.Set(' + newValue + ')');
  } else if  (lightType == 17) {
    eval('zway.' + __light + '.SwitchMultilevel.Set(' + newValue + ', ' + dimmingDuration + ')');
  }

  LogInfo("Device " + __light + " value updating to " + newValue + "...");
}

function LogDebug(__message) {
  if  (HAC01Switch.debugLevel) {
    console.log("HAC01Switch module log debug: " + __message);
  }
}

function LogInfo(__message) {
  console.log("HAC01Switch module log: " + __message);
}

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

// This module has no additional methods
