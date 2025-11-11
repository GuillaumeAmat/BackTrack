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
    renderWorld: () => {},
  },
  actors: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadResources: undefined as any,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGUAuBDGA6N6BOqAxAA4A26AngNoAMAuoqMQPawCWqbzAdoyAB6IALADYsAdgCsAZgBMATnFzx8gBxCAjBqEAaEBUQbpkrEOlrVI2TUlHVUgL4O9ubABlm6CG25RCEHjAsHwA3ZgBrINcgjy8fKARQ5gBjdE4eWjpMvhZ2dN4kAUR5aSwbaRpLK3EzGhK9AwQAWnMy8XEFEUkReSFJGllZEScXDHdPb19CMDw8ZjwsMjSAM3mAWxwxmIn4xO4w1PzM7MLcji4C0EEEaVusNSFxERVZSXENd4bEJo+aLDkjEJKlZpFpVCMQNEsABZMDcACuJHI1HoOVY5x4fGusnEf1UlXMsnM6hxki+N2kYmU0nsNCMA3xQghUNhCMIpDAXhmACNPHgICcmOj8ljDB8sJJuqoNCIjDSRJVyVZ5BL5LYFUJrEI1bJmVssAAVeGoeZsdCkQjc9DJcKCkBnEWFbEiVRYTpvDQ0Z40SqqcmvMT2ERdfHyEE0cR6zBBI0mvBmi1LFEMU7Ci6ihAKjQSkRAx7afrvMn6RC3Kk4mm4+k4kpR9yciA8vkQQhrOHwu0O9NOxCybRYT1dXHyOzaqzkySaUxCPq9T2yIPyOsxMAhMCJ9Dw2BgTtpzE9hCWEyvIGSIa50Gacll-4V2nV8HOSH6tyr9fTbgC1GpvLdq7FftZWkd4OjDDVdBLBBJ2zGc+hEaQ+jPeVlywAAFTdt0IPA4HhNtd1-fd-0PBU3VxVRVCJRQfV6f1uiwIMQzqcMnhQ9CtzAQgAEd4Q4fCMUuIpDyUf4ZW0YD1EeYxyU1IQJTPM8aGJOp5CGFDkGSeYOO4MB+FQPjHSI2VZIjEo+xJGRuiVIx6O1AZc3xComSfKF1M0whYHQNd9L-QTaVMYMXQ+eQ1B9aRySkbMEKkORFO0HFH1GaMcE8+IAAJYA07DCG03TvMIwSzzENRJGCvsIsZcLbH+R5uhKmoungpwn24ZhG3gQpojRAiBOuH43VEXEhg6OlJHIyzIJaSobKMIK1V9SNnP1XACC6-iMw0BQ3RpT1tB9ErNDCyChFdDQSh9IlVBKfFZCcxLxjiXxVoMwSOjkhCYrqDRRtBckmkGGDLu1KQfXECiFxQ1l4Senzrg2lULp2oEbDnQ7GhvGxhs9QGa2GRaktjU1zWh-LriR-5JSUQKI0sDRr2s8iFHkSp+iZ9ppBQ18uTwXl8AgYmetLN43RK0avXMTUFGLRplVvfoXRux4ukkDm31IfmM3eUpLAojbKVuAZacg9G3gUY7gIUCj2bx7A2O3dWD2CkxF3giocTpEQ6a11RQTqGQPknXG7qiTKwHtojFFkvsSq0EqcWOpUIwHQtc1eb3HGtqIUt8dKQ7DwT5dvGk6T7LQa0q7MIxqJQVEuoZlYzrBYkmKBUpmOY8Dz643jEHoKNnCMNHUQ3Gh+NUJQjGhHgXeCvVEJqHCAA */
  context: {},

  id: 'Stage',
  initial: 'Loading',

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

    Loading: {
      invoke: {
        src: 'loadResources',

        onDone: {
          target: 'Start',
          reenter: true,
        },

        onError: {
          target: 'Loading error',
          reenter: true,
        },
      },

      exit: ['renderWorld', 'hideLoadingOverlay'],
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
  },
});
