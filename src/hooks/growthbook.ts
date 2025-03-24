import { GrowthBook } from '@growthbook/growthbook';
import { autoAttributesPlugin } from '@growthbook/growthbook/plugins';

export const growthbook = new GrowthBook({
  apiHost: 'https://cdn.growthbook.io',
  clientKey: 'sdk-ClmbWSznoUlsYtZ',
  enableDevMode: true,
  trackingCallback: (experiment, result) => {
    console.log('Viewed Experiment', {
      experimentId: experiment.key,
      variationId: result.key,
    });
  },
  plugins: [autoAttributesPlugin()],
});
