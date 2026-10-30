# Der Tag des Koalas — four-room pixel mystery

## Summary

Create a dependency-free, self-hosted HTML/CSS/JS point-and-click game: a cozy, colorful 3–5 minute pixel-art mystery in Koala’s house. Players tap objects in four rooms to discover why the party is quiet, then trigger the final celebration.

## Key changes

- Build a static game with no backend, package manager, or external assets required; it can be served by any basic web host.
- Create four navigable pixel-art scenes: bedroom, kitchen, cellar, and an outside doorstep with multiple postboxes.
- Open with a short, non-interactive pixel animation in the bedroom: Koala sleeps peacefully in her cozy bed, a sudden noise comes from the kitchen, and she wakes up curious to investigate. Once the scene ends, transition into the bedroom with the kitchen as the initially available destination.
- Add touch-friendly object hotspots, persistent room navigation, short interaction dialogue, a clue-progress indicator, and a restart control.
- Mystery arc: locate the missing invitation in the postboxes, uncover party supplies in the cellar, restore the kitchen party preparation, and resolve the final clue in the bedroom to start the celebration.
- Store progress in browser local storage so a player can resume; reset clears it for the next party guest.
- Support mouse, touch, keyboard interaction, readable labels, responsive layouts, and reduced-motion preferences.

## Public interfaces / structure

- `index.html`: game shell, navigation, accessible dialogue panel, and controls.
- `styles.css`: responsive pixel-art scene styling, animations, and reduced-motion handling.
- `game.js`: room/object definitions, progression, dialogue, state persistence, and finale logic.

## Opening sequence

1. Display Koala asleep in her warmly lit bedroom with a small looping sleep animation.
2. Play a visual kitchen disturbance (a brief off-screen rattle and animated room reaction); no audio is required.
3. Koala wakes, reacts with a short German dialogue line, and is visibly eager to investigate.
4. Reveal the active kitchen exit; tapping it takes the player to the kitchen and begins the first interactive objective.

## Test plan

- Confirm each room is reachable and every required hotspot advances the correct clue.
- Confirm the finale unlocks only after all four room objectives are complete; reset restores a clean playthrough.
- Test mouse, touch, keyboard navigation, mobile viewport layout, and reduced-motion behavior.
- Serve static files locally and confirm the experience needs no network requests or build step.

## Assumptions

- The game is a single-player, browser-local party activity with no accounts, sound files, analytics, or backend.
- “Self-hosted” means providing static files for the user’s own web server.
- Game text will be primarily German, matching the party name.
