/* RobotDolly Forbidden Button v3 — client entity script.
 * The surrounding function MUST NOT use strict mode: DarkRide's entity
 * script loader uses 'this' to bind preload/clickDownOnEntity callbacks.
 * Launches a separate Interface script only for the clicking visitor.
 */
(function () {
    var entityID = null;
    var lastClick = 0;
    var TOUR_URL = "https://raw.githubusercontent.com/judasshuffle/robotdolly-destination-board/master/hypertour-shortest-loop.js";

    this.preload = function (id) {
        entityID = id;
        print("[RobotDolly v3] Button script ready");
    };
    this.clickDownOnEntity = function (id, event) {
        if (id !== entityID || (event && event.isPrimaryButton === false)) return;
        var now = Date.now();
        if (now - lastClick < 3000) return;
        lastClick = now;
        print("[RobotDolly v3] CLICK DETECTED");
        try {
            if (typeof ScriptDiscoveryService !== "undefined" &&
                typeof ScriptDiscoveryService.loadScript === "function") {
                ScriptDiscoveryService.loadScript(TOUR_URL, false, false, false, true, false);
                print("[RobotDolly v3] Tour launch requested");
            } else {
                print("[RobotDolly v3] ScriptDiscoveryService unavailable; trying Script.load");
                Script.load(TOUR_URL);
            }
        } catch (e) {
            print("[RobotDolly v3] Launch error: " + e);
        }
    };
    this.unload = function () { entityID = null; };
});