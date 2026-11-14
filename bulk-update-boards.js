/* RobotDolly Destination Board bulk updater.
 * Run once in DarkRide's Interface JavaScript console with Script.include(URL).
 * Automatically travels through the 11 rd bookmarks, updating EXISTING nearby boards.
 * No root entities are created, deleted or moved. Incomplete boards are skipped.
 */
(function () {
    "use strict";
    var DESTINATIONS = [
    {
        "name": "rd aura exhibition hall",
        "url": "hifi://6adf659e-5a22-1000-8000-424bb5e1c281/9000.11,10000,8906.02/0,0.00757296,0,0.999972"
    },
    {
        "name": "rd build platform",
        "url": "hifi://6adf659e-5a22-1000-8000-424bb5e1c281/5003.42,5014.68,5003.24/0,-0.909257,0,-0.416234"
    },
    {
        "name": "rd crompton moor",
        "url": "hifi://6adf659e-5a22-1000-8000-424bb5e1c281/-39.7952,-14.5317,-121.329/0,0.999888,0,0.014944"
    },
    {
        "name": "rd Dance hall",
        "url": "hifi://6adf659e-5a22-1000-8000-424bb5e1c281/5005.47,5015.65,4981.97/0,0.881772,0,-0.471676"
    },
    {
        "name": "rd fran canal",
        "url": "hifi://6adf659e-5a22-1000-8000-424bb5e1c281/-2492.12,6383.24,-2518.11/0,0.782928,0,0.622112"
    },
    {
        "name": "rd ghost world",
        "url": "hifi://6adf659e-5a22-1000-8000-424bb5e1c281/10578.3,9930.63,10113.8/0,0.993355,0,-0.115089"
    },
    {
        "name": "rd manchester town hall",
        "url": "hifi://6adf659e-5a22-1000-8000-424bb5e1c281/5049.14,5014.38,5006.08/0,0.403808,0,-0.914844"
    },
    {
        "name": "rd shop",
        "url": "hifi://6adf659e-5a22-1000-8000-424bb5e1c281/10059.4,10014.4,10054.8/0,0.849397,0,-0.527755"
    },
    {
        "name": "rd T-Cars",
        "url": "hifi://6adf659e-5a22-1000-8000-424bb5e1c281/10266,10775.8,10015.7/0,0.699631,0,0.714504"
    },
    {
        "name": "rd the fran salon",
        "url": "hifi://6adf659e-5a22-1000-8000-424bb5e1c281/-4775,4382.48,-4463/0,0,0,1"
    },
    {
        "name": "rd tv studio",
        "url": "hifi://6adf659e-5a22-1000-8000-424bb5e1c281/10586.7,9942.49,10003.9/0,0.903835,0,-0.427881"
    }
];
    var CLICK_SCRIPT_URL = "https://raw.githubusercontent.com/judasshuffle/robotdolly-destination-board/master/board-click.js";
    var RADIUS = 45;
    var WAIT_PER_STOP_MS = 30000;
    var SCAN_INTERVAL_MS = 2000;
    var WIDTH = 2.8, ROW_HEIGHT = 0.32;
    var BACK = { red: 26, green: 37, blue: 45 };
    var PANEL = { red: 39, green: 56, blue: 64 };
    var GOLD = { red: 230, green: 190, blue: 116 };
    var CREAM = { red: 247, green: 232, blue: 204 };
    var completed = {}, incomplete = {}, seen = {}, stopIndex = -1, tickCount = 0, timer = null;
    if (!DESTINATIONS || DESTINATIONS.length !== 11) {
        print("[RobotDolly BULK] ABORT: expected 11 destinations.");
        return;
    }
    if (typeof location === "undefined" || typeof location.handleLookupString !== "function") {
        print("[RobotDolly BULK] ABORT: viewer navigation API unavailable. No changes made.");
        return;
    }
    if (typeof Entities === "undefined" || typeof Entities.getChildrenIDs !== "function") {
        print("[RobotDolly BULK] ABORT: entity API unavailable. No changes made.");
        return;
    }
    var h = 0.85 + DESTINATIONS.length * ROW_HEIGHT, top = h / 2;
    function yAt(i) { return top - 0.85 - i * ROW_HEIGHT; }
    function goodID(id) {
        return !!id && String(id) !== "{00000000-0000-0000-0000-000000000000}";
    }
    function addRow(root, i) {
        var d = DESTINATIONS[i];
        return Entities.addEntity({
            type: "Text", name: "Visit: " + d.name, parentID: root,
            localPosition: { x: 0, y: yAt(i), z: 0.074 },
            dimensions: { x: WIDTH - 0.14, y: 0.27, z: 0.01 },
            text: "✦   " + d.name + "   ›",
            textColor: CREAM, backgroundColor: PANEL, backgroundAlpha: 1,
            lineHeight: 0.18, alignment: "center",
            topMargin: 0.03, leftMargin: 0.03, rightMargin: 0.03, bottomMargin: 0.02,
            unlit: true, collisionless: true, lifetime: -1,
            script: CLICK_SCRIPT_URL,
            userData: JSON.stringify({ destinationBoardURL: d.url })
        });
    }
    function updateBoard(root) {
        var ids = Entities.getChildrenIDs(root);
        var rows = [], title = null, subtitle = null, nText = 0;
        ids.forEach(function (id) {
            var p = Entities.getEntityProperties(id, ["name", "type", "localPosition"]);
            if (p.type !== "Text") return;
            nText++;
            if (p.name === "Board title") title = id;
            else if (p.name === "Board subtitle") subtitle = id;
            else if (p.name.indexOf("Visit: ") === 0) rows.push({ id: id, y: p.localPosition && p.localPosition.y });
        });
        if (ids.length !== nText || !title || !subtitle ||
            !((nText === 11 && rows.length === 9) || (nText === 13 && rows.length === 11))) {
            return "WAIT (" + ids.length + " children; " + rows.length + " rows)";
        }
        rows.sort(function(a,b){ return b.y - a.y; });
        // Old boards: add precisely two rows; existing rows are never deleted.
        var added = [];
        if (rows.length === 9) {
            for (var i = 9; i < 11; i++) {
                var id = addRow(root, i);
                if (!goodID(id)) {
                    added.forEach(function(x){ Entities.deleteEntity(x); });
                    return "ERROR adding row " + (i+1);
                }
                added.push(id);
            }
        }
        rows.forEach(function(row, i) {
            var d = DESTINATIONS[i];
            Entities.editEntity(row.id, {
                name: "Visit: " + d.name,
                text: "✦   " + d.name + "   ›",
                localPosition: { x: 0, y: yAt(i), z: 0.074 },
                userData: JSON.stringify({ destinationBoardURL: d.url }),
                script: CLICK_SCRIPT_URL
            });
        });
        Entities.editEntity(title, { localPosition: { x:0, y:top - 0.26, z:0.074 } });
        Entities.editEntity(subtitle, { localPosition: { x:0, y:top - 0.54, z:0.074 } });
        Entities.editEntity(root, { dimensions: {x:WIDTH, y:h, z:0.12} });
        return "UPDATED (" + DESTINATIONS.length + " destinations)";
    }
    function scan() {
        var nearby = Entities.findEntities(MyAvatar.position, RADIUS);
        nearby.forEach(function(id) {
            var p = Entities.getEntityProperties(id, ["name","type"]);
            if (p.name !== "RobotDolly Destination Board (root)" || p.type !== "Box") return;
            var key = String(id);
            seen[key] = true;
            if (completed[key]) return;
            var status = updateBoard(id);
            if (status.indexOf("UPDATED") === 0) {
                completed[key] = true;
                delete incomplete[key];
                print("[RobotDolly BULK] " + key + ": " + status);
            } else {
                incomplete[key] = status;
            }
        });
    }
    function finish() {
        if (timer !== null) Script.clearInterval(timer);
        timer = null;
        var done = Object.keys(completed).length, failed = Object.keys(incomplete).length;
        print("[RobotDolly BULK] FINISHED: " + done + " boards updated; " + failed +
            " discovered but not safely updated. Any boards outside scanned areas were not checked.");
        Object.keys(incomplete).forEach(function(id){ print("[RobotDolly BULK] SKIPPED " + id + ": " + incomplete[id]); });
        print("[RobotDolly BULK] You are at the last landmark. No boards were deleted or relocated.");
    }
    function nextStop() {
        stopIndex++;
        tickCount = 0;
        if (stopIndex >= DESTINATIONS.length) { finish(); return; }
        var d = DESTINATIONS[stopIndex];
        print("[RobotDolly BULK] Visiting " + (stopIndex+1) + "/" + DESTINATIONS.length + ": " + d.name);
        location.handleLookupString(d.url);
    }
    var ticksPerStop = Math.ceil(WAIT_PER_STOP_MS / SCAN_INTERVAL_MS);
    print("[RobotDolly BULK] START: automatic travel to 11 landmarks. Board roots stay in place.");
    nextStop();
    timer = Script.setInterval(function() {
        // Never change boards immediately after arrival: let streaming settle.
        tickCount++;
        if (tickCount >= 3) scan();
        if (tickCount >= ticksPerStop) nextStop();
    }, SCAN_INTERVAL_MS);
}());
