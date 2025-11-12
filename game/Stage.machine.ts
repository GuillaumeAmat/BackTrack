// Machine exported from https://stately.ai/registry/editor/8af147fe-cc57-4ce0-98e2-a1d80a3416f7?machineId=00ac43cb-b721-4c65-9b69-17d85be9cb29&mode=Design

import { setup } from 'xstate';

export const stageMachine = setup({
  types: {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    context: {} as {},
    events: {} as
      | { type: 'end'; score: number }
      | { type: 'back' }
      | { type: 'menu' }
      | { type: 'next' }
      | { type: 'play' }
      | { type: 'quit' }
      | { type: 'save'; name: string }
      | { type: 'pause' }
      | { type: 'resume' }
      | { type: 'leaderboard' },
  },
  actions: {
    hideLoadingOverlay: () => {},
    navigateToLoadingErrorPage: () => {},
    setupLoadingScreen: () => {},
    setupScreens: () => {},
  },
  actors: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadResources: undefined as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    waitForLowPriorityResources: undefined as any,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGUAuBDGA6N6BOqAxAA4A26AngNoAMAuoqMQPawCWqbzAdoyAB6IALADYsAdgCsAZgBMATnFzx8gBxCAjBqEAaEBUQbpkrEOlrVI2TUlHVUgL4O9ubLgIACUs3QQ23KEIIHjAsfwA3ZgBrUNdYjE9vX38oBAjmAGN0Th5aOjy+FnYc3iQBRHlpLBtpGlV5eVlZDRoaaWk9AwQAWmkhISxbVVVamiE68dUnFww3BNQvHz8AwjA8PGY8LDJsgDNNgFscWfj8BaTl1PSskryCsqKOLlLQQQR2sRaacXqNRsl5CJdPpEN0hOIxG1WhphvVxKJZCJpiA4lgALJgbgAVxI5Go9EKrCePD4b1k4hoWFUdXMsnM6nJkk6iA+WGU0nsNCMNFk1KEyNRGOxhFIYF8awARj48BB7kwiSVSYYNOJBpIRKoNCIjByRHVmQgrPJBvJbHqhNYhKbZAKTlgACpY1CbNjoUiECXoDJROUgR6KspkjVYBQiSTiFoiCl1VQG2TqqkQsPUwF0762zChR3OvCu907fEMB4K55Kw1cwZAsYRoSSb4aJkg97SMTsznc8mVDPYAAyYogkulEEIB0xWN9-tLgcQzQGkfDNHkditVgNkk0pn6AM0PPsInk3dCffCYHz6CxsDAE5LJOnCEsJnj40kiKB0m0GgNrLbFI7U2cKJ2sep6rNwsoEsWxRTq8FTaFg2rSBG4ihuawJdOuGibrWIh9JIL66oeWAAArnpehB4HAWKjteUG3jB956iGFLDHSiitPIaEzgme7JouVi1BChEkReYCEAAjliHA0cSLzlPeShslq2iIeo4LGAaFoDHh8bWPSi6NEiAGosgGSbKJ3BgPwqDSQG9HagM3yVM0DIyOqBoIVSVo8kC1K1PyRl2iZZmELA6AnjZ0FyZypgiLFmoqGorQdE2UiYX0UhyG02jkv+MyZjgYUpB4sCmRRhAWVZEV0XJL5iGoAKNCqQxjAaqVsuC6oAvCYY4YRPZLCkQQhGE3CRDExz5f1yQBGko2ZNkzx3BB8q0bJbxCKoVJ-LWHHWDQerfAaYKYS+qgyPIXI-El4h9QNKxrBsWw7Kg+x4EcqJTZcs2RDci30FVa0smGEh1iofwUkC8ZHQ2Jj1DUqiIhSVpqE4AHcMwA7wGUcSEqtZbdBoshYKadZ8RtrkXSIR16idkj2MhrGiLlgH5e4qC4zJZaE8adKaly4w2BxRgaZtfyjLzlTUrI-l5XMZyLNNUAc7ZcnIWqfQqpl76-EdtgDNY+5yBal02IRQpYsrkVvNzIYci02itNuwtNqyNjIVydS7Sohmy1mToum6lvVetrRsnhSgai0Pzal+RhUgjDR1HWF3iEofX9oO+AQEHgPvOGIYAnT+3mBaCiNl0RpsvG+0I-0EJ4enJ6kDnZYRlUlgI4TLbtDyn4uy21ThgoG2IQoCPSEJpFgC3d4NLDEKAj35JclTLtx8M76LjITWiIRQUUTP9GKPrDZLqf5Ibe53xYA23yQ3TiGSHvhUBMVpXT5BnN3hqRNyByXLNC0J2VqthqipzUioeoiIn4BUmndKAHgHqbEPjVCEIYzC2AaoTQWusKzNAXI7IwL4DywN7PAlBbxjDVH6InYw2gqwcWhhxaoUZazKEpu+CeqMgA */
  context: {},

  id: 'Stage',
  initial: 'Start loading',

  states: {
    Start: {
      on: {
        play: {
          target: 'Menu',
          description: 'Very first user interaction,\\\nrequired to be able to start the music.',
          reenter: true,
        },
      },
    },

    'Start loading': {
      invoke: {
        src: 'loadResources',

        onDone: {
          target: 'Loading',
          reenter: true,
          actions: 'setupLoadingScreen',
        },

        onError: {
          target: 'Loading error',
          reenter: true,
        },
      },

      exit: ['hideLoadingOverlay'],
    },

    Menu: {
      on: {
        play: {
          target: 'Tutorial',
        },
        leaderboard: {
          target: 'Leaderboard',
        },
      },
    },

    Tutorial: {
      on: {
        back: {
          target: 'Menu',
        },
        play: {
          target: 'Level',
        },
      },
      description: 'Display the commands',
    },

    Leaderboard: {
      on: {
        menu: {
          target: 'Menu',
        },
      },
    },

    Level: {
      on: {
        pause: {
          target: 'Pause',
        },
        end: {
          target: 'Score',
        },
      },
    },

    Pause: {
      on: {
        resume: {
          target: 'Level',
        },
        quit: {
          target: 'Menu',
        },
      },
      description: 'Offer to quit, and display the commands',
    },

    Score: {
      on: {
        next: {
          target: 'Leaderboard',
          description: 'Go to the leaderboard without saving',
        },
        save: {
          target: 'Saving score',
        },
      },
      description: 'Display the score, and ask for a name to record',
    },

    'Saving score': {
      on: {
        next: {
          target: 'Leaderboard',
        },
      },
    },

    'Loading error': {
      entry: 'navigateToLoadingErrorPage',
    },

    Loading: {
      invoke: {
        src: 'waitForLowPriorityResources',
        onDone: 'Start',
        onError: 'Loading error',
      },

      exit: 'setupScreens',
    },
  },
});
