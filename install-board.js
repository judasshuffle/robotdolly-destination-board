/* RobotDolly Destination Board - run ONCE as an Interface script, not an entity script.
   Creates permanent board and clickable Text entities in front of your avatar.
   Each destination row runs board-click.js on the VISITOR's client.
   NB: The domain must permit you to rez permanent entities.
*/
(function () {
    "use strict";

    // STEP 1: host board-click.js on HTTPS and paste the actual URL below.
    var CLICK_SCRIPT_URL = "https://raw.githubusercontent.com/judasshuffle/robotdolly-destination-board/master/board-click.js";

    // STEP 2: add YOUR actual domain paths, as configured in Domain Settings > Paths.
    // These are examples, not verified Crompton Moor landmarks.
    var DESTINATIONS = [
        { name: "TV Studio", url: "/10582.5,9942.49,9999.38/0,-0.698992,0,0.715129" }



    ];

    var TITLE = "CROMPTON MOOR";
    var SUBTITLE = "PLACES TO EXPLORE  ·  CLICK TO VISIT";
    var WIDTH = 2.8;
    var ROW_H = 0.32;
    var BOARD_HEIGHT = 0.85 + DESTINATIONS.length * ROW_H;
    var BACK = { red: 26, green: 37, blue: 45 };
    var PANEL = { red: 39, green: 56, blue: 64 };
    var GOLD = { red: 230, green: 190, blue: 116 };
    var CREAM = { red: 247, green: 232, blue: 204 };

    if (CLICK_SCRIPT_URL.indexOf("YOUR-HOST") !== -1) {
        print("Destination Board: Set CLICK_SCRIPT_URL before running. Nothing was rezzed.");
        return;
    }
    if (!DESTINATIONS.length) return;

    var position = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, { x: 0, y: 1.5, z: -2.5 }));
    var rotation = MyAvatar.orientation;
    var root = Entities.addEntity({
        type: "Box", name: "RobotDolly Destination Board (root)",
        position: position, rotation: rotation,
        dimensions: { x: WIDTH, y: BOARD_HEIGHT, z: 0.12 },
        color: BACK, collisionless: true, lifetime: -1,
        userData: JSON.stringify({ destinationBoard: true, version: 1 })
    });
    if (!root || root === Uuid.NULL) {
        print("Destination Board: Could not create root entity. Check rez permissions.");
        return;
    }
    function text(name, line, y, height, bg, fg, clickable, url) {
        return Entities.addEntity({
            type: "Text", name: name, parentID: root,
            localPosition: { x: 0, y: y, z: 0.074 },
            dimensions: { x: WIDTH - 0.14, y: height, z: 0.01 },
            text: line, textColor: fg, backgroundColor: bg, backgroundAlpha: 1,
            lineHeight: clickable ? 0.18 : 0.15, alignment: "center",
            topMargin: 0.03, leftMargin: 0.03, rightMargin: 0.03, bottomMargin: 0.02,
            unlit: true, collisionless: true, lifetime: -1,
            script: clickable ? CLICK_SCRIPT_URL : "",
            userData: clickable ? JSON.stringify({ destinationBoardURL: url }) : ""
        });
    }
    var top = BOARD_HEIGHT / 2;
    text("Board title", TITLE, top - 0.26, 0.36, BACK, GOLD, false, "");
    text("Board subtitle", SUBTITLE, top - 0.54, 0.19, BACK, CREAM, false, "");
    DESTINATIONS.forEach(function (place, i) {
        var y = top - 0.85 - (i * ROW_H);
        text("Visit: " + place.name, "✦   " + place.name + "   ›", y, 0.27,
             PANEL, CREAM, true, place.url);
    });
    print("Destination Board created: " + root + " with " + DESTINATIONS.length + " destinations.");
    print("If text faces away, rotate the board 180 degrees using Create/Edit mode.");
    // The installer is allowed to end; the board and client scripts remain in the domain.
    Script.stop();
}());



