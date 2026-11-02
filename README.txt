ROBOTDOLLY DESTINATION BOARD (prototype v0.1)
==============================================
Contains:
  install-board.js  - run once as an Interface script to rez the board.
  board-click.js    - client entity script attached to each clickable destination.

SETUP
1. Host board-click.js at a PUBLIC HTTPS URL (e.g. your Cloudflare Pages/Workers site).
   It MUST be reachable by every visitor's viewer; a C:\ local file won't work.
2. Edit install-board.js: fill in CLICK_SCRIPT_URL and your real DESTINATIONS.
   The sample paths are placeholders. Use paths that actually work in the Goto bar.
3. Enter your DarkRide domain, stand where the board should be, and use
   the viewer's script runner to run install-board.js as an INTERFACE script.
   It attempts to rez a permanent board ~2.5m ahead and at eye height.
4. If needed, reposition/rotate with Edit mode. Click one row to test travel.

LIMITS / STATUS
- This is a prototype, not yet runtime-tested in your particular DarkRide build.
- Your domain must allow permanent rez of Text/Box entities and run client entity scripts.
- It currently has a MANUAL destination list; private viewer landmarks aren't read.
- The navigation call is made on the clicking viewer, not the domain server.
- The root and rows persist if domain permits; edit/Delete the root to remove it.
- Re-running installer creates another board; don't run it repeatedly.
- Text facing/layout and script permissions may require adjustment per DarkRide build.
- If your build doesn't expose client-side location.handleLookupString,
  click navigation will require another supported client-side API.
- To change destinations, edit installer and rez a replacement board.
