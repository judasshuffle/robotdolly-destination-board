/* RobotDolly Destination Board - visitor-side click script.
   Host this file at a public HTTPS URL, then put its URL in install-board.js.
*/
(function () {
    var entityID = null;
    function clickDownOnEntity(id, event) {
        if (id !== entityID || (event && event.isPrimaryButton === false)) return;
        var props = Entities.getEntityProperties(entityID, ["userData"]);
        var data;
        try { data = JSON.parse(props.userData || "{}"); } catch (e) { return; }
        if (!data.destinationBoardURL) return;
        // Client entity script: moves only the visitor who clicked.
        if (typeof location !== "undefined" && typeof location.handleLookupString === "function") {
            location.handleLookupString(data.destinationBoardURL);
        } else if (typeof Window !== "undefined" && Window.location) {
            Window.location = data.destinationBoardURL;
        } else {
            print("Destination Board: navigation API not found");
        }
    }
    this.preload = function (id) { entityID = id; };
    this.clickDownOnEntity = clickDownOnEntity;
});
