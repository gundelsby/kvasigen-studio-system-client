export default {
  engineData: {
    availableScenes: [
      {
        id: 'Klovnenese',
        parameters: [
          {
            name: 'color',
            type: 'float4',
          },
        ],
      },
    ],
  },
  demoData: {
    global: {
      title: 'Klovnese',
      bpm: 168,
    },
    script: {
      scenes: [
        {
          id: 'Klovnenese',
          name: 'Klovnese',
          'start-timecode': 0,
          'stop-timecode': 10000,
          parameters: [
            {
              name: 'color',
              type: 'float4',
              value: [0.0, 1.0, 0.5, 1.0],
            },
          ],
        },
        {
          id: 'Klovnenese',
          name: 'Klavernese',
          'start-timecode': 10000,
          'stop-timecode': 25000,
          parameters: [
            {
              name: 'color',
              type: 'float4',
              value: [0.7, 1.0, 0.5, 1.0],
            },
          ],
        },
      ],
    },
  },
};
