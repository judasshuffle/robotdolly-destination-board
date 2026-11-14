/* RobotDolly — retarget existing red button(s) to v2.
 * Read/modify only nearby DON’T PRESS child Sphere script properties.
 * Does not touch the boards or recreate the button.
 * Run with Script.include(rawGitHubURL) near your button.
 */
(function() {
    "use strict";
    var URL = "https://raw.githubusercontent.com/judasshuffle/robotdolly-destination-board/master/do-not-press-click-v2.js";
    var ids = Entities.findEntities(MyAvatar.position, 30);
    var changed=0;
    ids.forEach(function(id) {
        var p = Entities.getEntityProperties(id, ["type","name","script"]);
        if (p.type !== "Sphere" || p.name !== "DON'T PRESS — Judas Airways") return;
        Entities.editEntity(id, {script:URL});
        changed++;
        print("[RobotDolly] v2 button launcher set on " + id);
    });
    print("[RobotDolly] v2 PATCH: " + changed + " button(s) updated within 30m. No objects rezzed or removed.");
})();