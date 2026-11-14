/* RobotDolly DON'T PRESS button — SERVER entity script.
   Flashes red for all visitors. If server scripts are unsupported,
   the red button remains clickable without flashing. */
(function () {
    "use strict";
    var id = null, timer = null, on = false;
    this.preload = function(entityID) {
        id = entityID;
        timer = Script.setInterval(function() {
            on = !on;
            Entities.editEntity(id, {
                color: on ? { red: 255, green: 35, blue: 20 } : { red: 95, green: 4, blue: 3 }
            });
        }, 450);
    };
    this.unload = function() {
        if (timer !== null) Script.clearInterval(timer);
        timer = null;
    };
});