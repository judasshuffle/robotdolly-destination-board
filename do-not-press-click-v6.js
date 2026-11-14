/* RobotDolly Forbidden Button v6 — Dance Ball-style per-visitor flight.
 * Runs in each visitor's client entity-script engine.
 * Moves only MyAvatar (the visitor who clicked); no private script launch.
 * Click to launch, click again to stop; unload stops the interval.
 * Based on the working HyperTour shortest-loop flight implementation.
 */
(function () {
    var entityID = null, tour = null, clickTime = 0;
    function log(s) { print("[RobotDolly v6] " + s); }
    this.preload = function (id) {
        entityID = String(id);
        log("READY: visitor-side flight available");
    };
    this.clickDownOnEntity = function (id, event) {
        if (String(id) !== entityID || (event && event.isPrimaryButton === false)) return;
        var now = Date.now();
        if (now - clickTime < 1200) return;
        clickTime = now;
        if (tour && tour.isActive && tour.isActive()) {
            tour.stop("clicked red button again");
            tour = null;
            return;
        }
        log("CLICK: starting your own HyperTour (no bridge required)");
        try {
            /* RobotDolly HyperTour v0.1: single shortest 3-D-distance loop, then STOP.
             * Run in the DarkRide JS console with Script.include(rawGitHubURL).
             * This is scripted avatar repositioning, not collision-aware flight.
             * ABORT at any time from the console: RobotDollyHyperTour.stop();
             * Does not alter entities, boards or server assets.
             */
            var nextTour = (function () {
                "use strict";
                var DESTINATIONS = [{"name":"rd aura exhibition hall","url":"hifi://6adf659e-5a22-1000-8000-424bb5e1c281/9000.11,10000,8906.02/0,0.00757296,0,0.999972"},{"name":"rd build platform","url":"hifi://6adf659e-5a22-1000-8000-424bb5e1c281/5003.42,5014.68,5003.24/0,-0.909257,0,-0.416234"},{"name":"rd crompton moor","url":"hifi://6adf659e-5a22-1000-8000-424bb5e1c281/-39.7952,-14.5317,-121.329/0,0.999888,0,0.014944"},{"name":"rd Dance hall","url":"hifi://6adf659e-5a22-1000-8000-424bb5e1c281/5005.47,5015.65,4981.97/0,0.881772,0,-0.471676"},{"name":"rd fran canal","url":"hifi://6adf659e-5a22-1000-8000-424bb5e1c281/-2492.12,6383.24,-2518.11/0,0.782928,0,0.622112"},{"name":"rd ghost world","url":"hifi://6adf659e-5a22-1000-8000-424bb5e1c281/10578.3,9930.63,10113.8/0,0.993355,0,-0.115089"},{"name":"rd manchester town hall","url":"hifi://6adf659e-5a22-1000-8000-424bb5e1c281/5049.14,5014.38,5006.08/0,0.403808,0,-0.914844"},{"name":"rd shop","url":"hifi://6adf659e-5a22-1000-8000-424bb5e1c281/10059.4,10014.4,10054.8/0,0.849397,0,-0.527755"},{"name":"rd T-Cars","url":"hifi://6adf659e-5a22-1000-8000-424bb5e1c281/10266,10775.8,10015.7/0,0.699631,0,0.714504"},{"name":"rd the fran salon","url":"hifi://6adf659e-5a22-1000-8000-424bb5e1c281/-4775,4382.48,-4463/0,0,0,1"},{"name":"rd tv studio","url":"hifi://6adf659e-5a22-1000-8000-424bb5e1c281/10586.7,9942.49,10003.9/0,0.903835,0,-0.427881"}];
                // Exact shortest CLOSED cycle through these 11 points (Euclidean 3D distance):
                // 0 Aura -> 8 T-Cars -> 10 TV -> 5 Ghost -> 7 Shop -> 6 Town Hall ->
                // 1 Build -> 3 Dance -> 2 Crompton -> 9 Salon -> 4 Canal -> 0 Aura.
                var CYCLE = [0,8,10,5,7,6,1,3,2,9,4];
                var SPEED = 400; // nominal metres per second (easing raises/lower instantaneous speed)
                var PAUSE_MS = 2200, TICK_MS = 50;
                var timer = null, active = true, phase = "start", leg = null, waitUntil = 0;
                var route = [], index = 0, startIndex = 0, abortReason = "";
                function parse(d) {
                    var parts = d.url.split("/");
                    if (parts.length < 5) return null;
                    var match = [null, parts[parts.length-2], parts[parts.length-1]];
                    var coords = match[1].split(",").map(Number);
                    var quat = match[2].split(",").map(Number);
                    if (coords.length !== 3 || quat.length !== 4) return null;
                    if (coords.some(function(x){return !isFinite(x);}) || quat.some(function(x){return !isFinite(x);})) return null;
                    return { name: d.name, position:{x:coords[0],y:coords[1],z:coords[2]}, orientation:{x:quat[0],y:quat[1],z:quat[2],w:quat[3]} };
                }
                var points = DESTINATIONS.map(parse);
                function distance(a,b) {
                    var dx=a.x-b.x,dy=a.y-b.y,dz=a.z-b.z;
                    return Math.sqrt(dx*dx+dy*dy+dz*dz);
                }
                function stop(reason) {
                    if (!active) return;
                    active = false;
                    if (timer !== null) { Script.clearInterval(timer); timer = null; }
                    print("[HyperTour] STOPPED: " + (reason || "manual abort") + ". Avatar remains where it is.");
                }
                function startLeg(from, to, label) {
                    var length=distance(from,to.position);
                    // Never force a rapid displacement on the very first tick.
                    leg={from:{x:from.x,y:from.y,z:from.z},to:to,
                         start:Date.now(), duration:Math.max(3500,1000*length/SPEED),
                         arc:Math.min(140,Math.max(12,length*0.012)),label:label};
                    print("[HyperTour] " + label + " (" + Math.round(length) + " m)");
                }
                function nextLeg() {
                    if (!active) return;
                    if (index >= route.length) {
                        stop("One complete loop finished — returned to starting landmark");
                        return;
                    }
                    var dest=points[route[index]];
                    startLeg(MyAvatar.position,dest,(index+1)+"/"+route.length+" → "+dest.name);
                    index++;
                }
                function tick() {
                    if (!active) return;
                    if (phase === "pause") {
                        if (Date.now() >= waitUntil) { phase="fly"; nextLeg(); }
                        return;
                    }
                    if (!leg) return;
                    var t=Math.min(1,(Date.now()-leg.start)/leg.duration);
                    var eased=t*t*(3-2*t);
                    var a=leg.from,b=leg.to.position;
                    MyAvatar.position={
                        x:a.x+(b.x-a.x)*eased,
                        y:a.y+(b.y-a.y)*eased+leg.arc*Math.sin(Math.PI*t),
                        z:a.z+(b.z-a.z)*eased
                    };
                    if (t >= 1) {
                        MyAvatar.orientation=leg.to.orientation;
                        print("[HyperTour] Arrived: " + leg.to.name);
                        leg=null;
                        phase="pause";
                        waitUntil=Date.now()+PAUSE_MS;
                    }
                }
                if (points.length !== 11 || points.some(function(p){return !p;}) ||
                    !MyAvatar || !MyAvatar.position || !Script || !Script.setInterval) {
                    print("[HyperTour] ABORT: invalid locations or missing scripting API.");
                    active=false;
                    return {stop:stop};
                }
                // Re-entry is guarded by the hosting button client script.
            var initial=MyAvatar.position, nearest=0, best=Infinity;
                CYCLE.forEach(function(i,j) {
                    var d=distance(initial,points[i].position);
                    if(d<best){best=d;nearest=j;}
                });
                // Rotate optimal Hamiltonian cycle to start at closest landmark; visit every
                // destination once and return to the first one. No looping/repeating.
                var rotated=CYCLE.slice(nearest).concat(CYCLE.slice(0,nearest));
                route=rotated.concat([rotated[0]]);
                print("[HyperTour] SINGLE LOOP: 11 landmarks; ~48.9 km closed cycle, plus approach.");
                print("[HyperTour] Start/finish: " + points[rotated[0]].name);
                print("[HyperTour] Flight started by Forbidden Button v6; click again to stop.");
                phase="fly";
                timer=Script.setInterval(tick,TICK_MS);
                nextLeg();
                return {stop:stop, isActive:function(){return active;}, route:rotated.map(function(i){return points[i].name;})};
            }());
            
            tour = nextTour;
        } catch (e) {
            log("ERROR launching HyperTour: " + e);
            tour = null;
        }
    };
    this.unload = function () {
        if (tour && typeof tour.stop === "function") tour.stop("button script unloaded");
        tour = null;
        log("UNLOADED");
    };
});