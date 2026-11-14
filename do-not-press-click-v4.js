/* RobotDolly Forbidden Button v4 - diagnostic launcher.
 * Client entity script. No strict mode: must bind callbacks via 'this'.
 * One click checks available launch APIs and tries only ONE launch path.
 * Only the clicking viewer receives the launch request.
 */
(function () {
    var buttonID = null;
    var lastClick = 0;
    var TOUR_URL = "https://raw.githubusercontent.com/judasshuffle/robotdolly-destination-board/master/hypertour-shortest-loop.js";
    function log(message) { print("[RobotDolly v4] " + message); }

    this.preload = function(id) {
        buttonID = id;
        log("READY on " + id);
    };

    this.clickDownOnEntity = function(id, event) {
        if (id !== buttonID || (event && event.isPrimaryButton === false)) return;
        var now = Date.now();
        if (now - lastClick < 5000) return;
        lastClick = now;
        log("CLICK detected on " + id);
        var hasDiscovery = typeof ScriptDiscoveryService !== "undefined";
        var hasDiscoveryLoad = hasDiscovery && typeof ScriptDiscoveryService.loadScript === "function";
        var hasDiscoveryOne = hasDiscovery && typeof ScriptDiscoveryService.loadOneScript === "function";
        var hasScriptLoad = typeof Script !== "undefined" && typeof Script.load === "function";
        log("APIs: discovery=" + hasDiscovery + " loadScript=" + hasDiscoveryLoad +
            " loadOneScript=" + hasDiscoveryOne + " Script.load=" + hasScriptLoad);

        if (hasDiscoveryLoad) {
            try {
                log("TRY ScriptDiscoveryService.loadScript");
                // ScriptDiscoveryService API: filename, isUserLoaded,
                // loadScriptFromEditor, activateMainWindow, reload, quitWhenFinished.
                ScriptDiscoveryService.loadScript(TOUR_URL, false, false, false, true, false);
                log("REQUEST returned (look for [HyperTour] messages; not proof of flight)");
            } catch(e) { log("ERROR: " + e); }
        } else if (hasDiscoveryOne) {
            try {
                log("TRY ScriptDiscoveryService.loadOneScript");
                ScriptDiscoveryService.loadOneScript(TOUR_URL);
                log("REQUEST returned (look for [HyperTour] messages)");
            } catch(e) { log("ERROR: " + e); }
        } else {
            log("NO independent launcher exposed here. Not calling Script.load; v1 showed TypeError in this context.");
        }
    };
    this.unload = function() {
        log("UNLOADED");
        buttonID = null;
    };
});
