/* RobotDolly Button v4 patch — preserves existing in-world button. */
(function() {
    var url = "https://raw.githubusercontent.com/judasshuffle/robotdolly-destination-board/master/do-not-press-click-v4.js";
    var count = 0;
    Entities.findEntities(MyAvatar.position, 30).forEach(function(id) {
        var p = Entities.getEntityProperties(id, ["name", "type"]);
        if (p.type === "Sphere" && p.name === "DON'T PRESS — Judas Airways") {
            Entities.editEntity(id, {script:url});
            print("[RobotDolly] v4 URL assigned to " + id);
            count++;
        }
    });
    print("[RobotDolly] v4 patch finished: " + count + " button(s). No objects created or removed.");
}());
