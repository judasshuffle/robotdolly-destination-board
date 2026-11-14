/* RobotDolly "DON'T PRESS THIS BUTTON" in-world installer.
   Run ONCE from the DarkRide JavaScript console via Script.include(URL).
   Creates one persistent sign and an individual visitor-activated HyperTour.
   DOES NOT edit the working destination boards.
*/
(function () {
    "use strict";
    var ROOT_NAME = "RobotDolly DON'T PRESS HyperTour (root)";
    var CLICK_URL = "https://raw.githubusercontent.com/judasshuffle/robotdolly-destination-board/master/do-not-press-click.js";
    var FLASH_URL = "https://raw.githubusercontent.com/judasshuffle/robotdolly-destination-board/master/do-not-press-flash.js";
    var position = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(
        MyAvatar.orientation, { x: 0, y: 1.15, z: -2.2 }
    ));
    var rotation = MyAvatar.orientation;
    var nearby = Entities.findEntities(position, 1.0).filter(function(id) {
        return Entities.getEntityProperties(id, ["name"]).name === ROOT_NAME;
    });
    if (nearby.length) {
        print("[RobotDolly] Button already here. Nothing rezzed.");
        return;
    }
    var root = Entities.addEntity({
        type: "Box", name: ROOT_NAME,
        position: position, rotation: rotation,
        dimensions: {x: 1.05, y: 1.48, z: 0.18},
        color: {red: 20, green: 24, blue: 32},
        collisionless: true, lifetime: -1,
        userData: JSON.stringify({robotDollyHyperTourButton: true, version: 1})
    });
    if (!root || String(root) === "{00000000-0000-0000-0000-000000000000}") {
        print("[RobotDolly] Could not rez the button. Check permissions.");
        return;
    }
    function make(props) {
        props.parentID = root;
        props.lifetime = -1;
        props.collisionless = true;
        return Entities.addEntity(props);
    }
    make({
        type: "Text", name: "DON'T PRESS warning",
        localPosition: {x:0,y:0.42,z:0.115},
        dimensions: {x:0.96,y:0.48,z:0.01},
        text: "DON'T PRESS\nTHIS BUTTON",
        textColor: {red:255,green:205,blue:100},
        backgroundColor: {red:35,green:25,blue:20},
        backgroundAlpha: 1,
        lineHeight: 0.16, alignment: "center", unlit: true
    });
    make({
        type:"Box", name:"Emergency button surround",
        localPosition:{x:0,y:-0.28,z:0.15},
        dimensions:{x:0.7,y:0.7,z:0.12},
        color:{red:185,green:155,blue:70}
    });
    var button = make({
        type:"Sphere", name:"DON'T PRESS — Judas Airways",
        localPosition:{x:0,y:-0.28,z:0.32},
        dimensions:{x:0.52,y:0.52,z:0.23},
        color:{red:255,green:35,blue:20},
        script:CLICK_URL,
        serverScripts:FLASH_URL,
        userData:JSON.stringify({action:"RobotDollyHyperTour",version:1})
    });
    make({
        type: "Text", name: "Judas Airways footer",
        localPosition: {x:0,y:-0.66,z:0.115},
        dimensions: {x:0.96,y:0.18,z:0.01},
        text: "JUDAS AIRWAYS  ·  ONE LOOP",
        textColor: {red:225,green:225,blue:225},
        backgroundColor: {red:20,green:24,blue:32},
        backgroundAlpha: 1, lineHeight: 0.09, alignment: "center", unlit:true
    });
    print("[RobotDolly] DON'T PRESS button rezzed: " + root + " | clicker: " + button);
    print("[RobotDolly] Click the red dome to fly. Only the visitor who clicks launches the tour.");
    print("[RobotDolly] To abort during flight: RobotDollyHyperTour.stop() in your script context.");
}());