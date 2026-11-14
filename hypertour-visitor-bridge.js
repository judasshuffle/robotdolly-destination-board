/* RobotDolly HyperTour Visitor Bridge — opt-in viewer Interface script.
 * Install once from the visitor's script runner (Script.load(URL)).
 * Receives ONLY local button-click requests from the nearby named entity.
 * Runs flight in an independent Interface script, then leaves the bridge loaded.
 * Stop/remove this script in Running Scripts to disable the button for yourself.
 */
(function () {
    var CHANNEL = "robotdolly.hypertour.request.v1";
    var TOUR_URL = "https://raw.githubusercontent.com/judasshuffle/robotdolly-destination-board/master/hypertour-shortest-loop.js";
    var LAST_START = 0, MIN_INTERVAL = 180000; // three-minute double-launch guard
    function say(s) { print("[Judas Airways Bridge] " + s); }
    function nearbyButton(id) {
        try {
            var p = Entities.getEntityProperties(id, ["name", "type", "position"]);
            if (p.name !== "DON'T PRESS — Judas Airways" || p.type !== "Sphere" || !p.position) return false;
            return Vec3.distance(MyAvatar.position, p.position) < 8;
        } catch (e) { return false; }
    }
    function received(channel, message, sender, localOnly) {
        if (channel !== CHANNEL || localOnly !== true) return;
        var data;
        try { data = JSON.parse(message); } catch (e) { return; }
        if (!data || data.action !== "start" || typeof data.entityID !== "string" ||
            !nearbyButton(data.entityID)) return;
        var now = Date.now();
        if (now - LAST_START < MIN_INTERVAL) {
            say("Ignored second launch request; tour launch cooldown still active.");
            return;
        }
        if (typeof Script.load !== "function") {
            say("ERROR: Interface Script.load is unavailable.");
            return;
        }
        LAST_START = now;
        say("Opted-in visitor pressed the button. Launching one HyperTour.");
        try { Script.load(TOUR_URL); }
        catch (e) { LAST_START = 0; say("ERROR: " + e); }
    }
    if (typeof Messages === "undefined" || typeof Messages.subscribe !== "function") {
        say("ERROR: Messages API unavailable");
        return;
    }
    Messages.subscribe(CHANNEL);
    Messages.messageReceived.connect(received);
    Script.scriptEnding.connect(function () {
        Messages.messageReceived.disconnect(received);
        Messages.unsubscribe(CHANNEL);
    });
    say("READY. You have opted in to Judas Airways. Press the red button!");
}());