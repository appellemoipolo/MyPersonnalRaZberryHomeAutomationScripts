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
        
    // Check VirtualDevice existence
/*    if (!this.controller.devices.hasOwnProperty(this.config.device)) {
        // Exit initializer due to lack of the device
        console.log("ERROR", "HAC01Switch", this.config.device, "doesn't exist.");
        return;
    }*/
    
    var self = this;

    // impossible pour le moment 
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

// This module has no additional methods
