/* RobotDolly Forbidden Button v5 — client entity script.
 * Emits a local-only flight request to an explicitly installed Interface bridge.
 * Does not attempt to run arbitrary scripts or bypass DarkRide permissions.
 */
(function () {
    var entityID = null;
    var lastClick = 0;
    var CHANNEL = "robotdolly.hypertour.request.v1";
    this.preload = function (id) {
        entityID = id;
        print("[RobotDolly v5] Button ready");
    };
    this.clickDownOnEntity = function (id, event) {
        if (id !== entityID || (event && event.isPrimaryButton === false)) return;
        var now = Date.now();
        if (now - lastClick < 3000) return;
        lastClick = now;
        print("[RobotDolly v5] Button clicked — requesting flight from opted-in viewer");
        if (typeof Messages !== "undefined" && typeof Messages.sendLocalMessage === "function") {
            Messages.sendLocalMessage(CHANNEL, JSON.stringify({
                action: "start", entityID: String(id)
            }));
            print("[RobotDolly v5] Local request sent (viewer bridge must be installed)");
        } else {
            print("[RobotDolly v5] ERROR: local messages unavailable");
        }
    };
    this.unload = function () { entityID = null; };
});