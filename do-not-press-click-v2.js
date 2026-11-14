/* RobotDolly button launcher v2 — client entity script.
 * Launch an independent Interface script via ScriptDiscoveryService.
 * Only the clicking visitor is affected.
 */
(function () {
    "use strict";
    var buttonID = null;
    var lastClick = 0;
    var TOUR = "https://raw.githubusercontent.com/judasshuffle/robotdolly-destination-board/master/hypertour-shortest-loop.js";
    this.preload = function (id) {
        buttonID = id;
        print("[RobotDolly] Forbidden button v2 ready");
    };
    this.clickDownOnEntity = function (id, event) {
        if (id !== buttonID || (event && event.isPrimaryButton === false)) return;
        var now = Date.now();
        if (now - lastClick < 3000) return;
        lastClick = now;
        print("[RobotDolly] Button v2 clicked — requesting independent tour");
        try {
            if (typeof ScriptDiscoveryService !== "undefined" &&
                typeof ScriptDiscoveryService.loadScript === "function") {
                // Do not mark as user-loaded (so it does not restart on next login);
                // force redownload to avoid cached old tour scripts.
                ScriptDiscoveryService.loadScript(TOUR, false, false, false, true, false);
                print("[RobotDolly] v2 launch request submitted; check for [HyperTour] messages");
            } else {
                print("[RobotDolly] ScriptDiscoveryService unavailable, trying Script.load");
                Script.load(TOUR);
            }
        } catch (e) {
            print("[RobotDolly] Launch failed: " + e);
        }
    };
    this.unload = function () { buttonID = null; };
});