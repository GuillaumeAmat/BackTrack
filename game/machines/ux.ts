// Machine exported from https://stately.ai/registry/editor/8af147fe-cc57-4ce0-98e2-a1d80a3416f7?machineId=00ac43cb-b721-4c65-9b69-17d85be9cb29&mode=Design

import { setup } from 'xstate';

export const uxMachine = setup({
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
}).createMachine({
  context: {},
  id: 'UX',
  initial: 'Home',
  states: {
    Home: {
      on: {
        play: {
          target: 'Loading',
          description: 'Very first user interaction,\\\nrequired to be able to start the music.',
        },
      },
    },
    Loading: {
      on: {
        menu: {
          target: 'Menu',
        },
      },
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
  },
});
