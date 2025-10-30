This project is a web 3D game, called BackTrack, which is designed to primarily be played during conferences.

It's a 2 players, cooperative game.

## Technical stack

- The web application is built on Nuxt.js, and hosted on Vercel.
- The UX flow, and global state, are built using XState, via multiple ad-hoc finite state machines.
- The UI is fully based on Three.js.


## UX Design

- The players use the same physical screen, without splitting the view.
- They both use specific keys on the same keyboard.
- From beginning to end (e.g.: loading, main menu, game, leaderboard), the game display one 3D scene. Transitionning from screen to screen means that the camera and/or the scene objects move, or (dis)appear.


