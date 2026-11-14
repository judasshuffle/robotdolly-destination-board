/* RobotDolly button patch v5: update existing Sphere only. */
(function () {
    var url = "https://raw.githubusercontent.com/judasshuffle/robotdolly-destination-board/master/do-not-press-click-v5.js";
    var count = 0;
    Entities.findEntities(MyAvatar.position, 30).forEach(function(id) {
        var p = Entities.getEntityProperties(id, ["name", "type"]);
        if (p.name === "DON'T PRESS — Judas Airways" && p.type === "Sphere") {
            Entities.editEntity(id, {script:url});
            print("[RobotDolly] Assigned v5 to button " + id);
            count++;
        }
    });
    print("[RobotDolly] v5 patch: " + count + " existing button(s) updated. No entities rezzed.");
}());