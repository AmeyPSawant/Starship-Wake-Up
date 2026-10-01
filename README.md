# Starship Wake-Up — local prototype

Requires Node.js 20 or newer. No package installation is needed.

1. Extract this folder.
2. Open a terminal in the folder.
3. Run `npm start` (or `node server.mjs`).
4. Open http://localhost:3000 in your browser.

For a quick multiplayer test on one computer, open two browser tabs, create a room in the first, and join its code in the second. Each tab has its own player identity. At least two connected players are required to start.

For separate devices on the same Wi-Fi, keep the server running and open http://YOUR-COMPUTER-LAN-IP:3000 on each device. Allow Node through your local firewall if prompted. Localhost only refers to the device opening it. Remote internet play needs a hosted server; this prototype does not set that up.

## Rules
2–8 players share a five-minute survival mission. Care takes four seconds; repairs take six. Each player may claim one task, and a specific task may have only one owner. Everyone can work simultaneously on different tasks, including different care actions on the same character.

Keep Jim and Aurora's Oxygen, Food, Rest, and Health above zero. Gus wakes at the halfway mark. Empty Oxygen, Food, or Rest drains Health. Alerts cause extra drain until repaired. Anyone reaching zero Health loses the mission. Everyone surviving five minutes wins.

Restore a meter: +10 points. Repair a problem: +50. Survive: +500. No individual leaderboard. The host can replay; hosting transfers to a connected teammate if the host disconnects. New players can join during play. Disconnected players release their tasks. Reopening the same tab restores its session if the room still exists.

## Prototype limits
Rooms live in server memory and disappear when the server restarts. No accounts, voice chat, or durable best scores. Rooms with no connections expire after one hour. The ship continues running during disconnections. This is a locally tested functional prototype; visual browser QA remains for the next polish pass.

## Verification
Run `npm test` to exercise room creation and joining, minimum players, host controls, simultaneous tasks, duplicate locks, completion and score, Gus waking, mid-game joining, repair, winning, losing, replay, and HTML serving.
