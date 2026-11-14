/* Change only existing Forbidden Button Sphere to v6 with cache-busting. */
(function () {
    var url = "https://raw.githubusercontent.com/judasshuffle/robotdolly-destination-board/master/do-not-press-click-v6.js?release=6-20261114";
    var count = 0;
    Entities.findEntities(MyAvatar.position, 30).forEach(function(id) {
        var p = Entities.getEntityProperties(id, ["name", "type"]);
        if (p.name === "DON'T PRESS — Judas Airways" && p.type === "Sphere") {
            Entities.editEntity(id, {script:url});
            print("[RobotDolly] v6 assigned: " + id);
            count++;
        }
    });
    print("[RobotDolly] v6 patch: " + count + " button(s) updated; nothing created or removed.");
}());