/* RobotDolly Board Updater - safe read-only discovery, v0.1.
 * Run as Interface script near an existing board.
 * Does not create, edit, or delete any entities.
 */
(function () {
    "use strict";
    var RADIUS = 35;
    var expected = 11; // MK1: title + subtitle + 9 destination rows
    var ids = Entities.findEntities(MyAvatar.position, RADIUS);
    var count = 0;
    ids.forEach(function (id) {
        var p = Entities.getEntityProperties(id, ["name", "type", "position"]);
        if (p.name !== "RobotDolly Destination Board (root)" || p.type !== "Box") return;
        count++;
        var children = Entities.getChildrenIDs(id);
        var textCount = 0;
        var sample = [];
        children.forEach(function (child) {
            var cp = Entities.getEntityProperties(child, ["type", "name"]);
            if (cp.type === "Text") {
                textCount++;
                sample.push(cp.name);
            }
        });
        print("[RobotDolly PREVIEW] Board " + id + " at " +
              JSON.stringify(p.position) + ": " + children.length +
              " children (" + textCount + " Text); expected old total " + expected +
              (textCount === expected ? " — candidate for update" : " — NOT SAFE TO UPDATE YET"));
        print("[RobotDolly PREVIEW] Found: " + sample.join(" | "));
    });
    print("[RobotDolly PREVIEW] " + count + " board(s) detected within " + RADIUS +
          "m. No changes made. Distant boards are not included.");
}());