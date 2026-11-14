/* RobotDolly DON'T PRESS button — client entity script.
   Only the clicking visitor launches their own HyperTour interface script. */
(function () {
    "use strict";
    var buttonID = null;
    var lastClick = 0;
    var TOUR_URL = "https://raw.githubusercontent.com/judasshuffle/robotdolly-destination-board/master/hypertour-shortest-loop.js";
    this.preload = function(id) { buttonID = id; };
    this.clickDownOnEntity = function(id, event) {
        if (id !== buttonID || (event && event.isPrimaryButton === false)) return;
        var now = Date.now();
        if (now - lastClick < 2500) return;
        lastClick = now;
        print("[RobotDolly] YOU PRESSED IT! Starting Judas Airways...");
        // Script.load launches a separate client-side Interface script, so
        // flight continues after this entity script unloads at a distance.
        Script.load(TOUR_URL);
    };
    this.unload = function () { buttonID = null; };
});