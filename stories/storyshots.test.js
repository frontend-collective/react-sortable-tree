/* eslint-disable import/no-extraneous-dependencies */
import initStoryshots, {
  snapshotWithOptions,
} from '@storybook/addon-storyshots';

initStoryshots({
  test: snapshotWithOptions({
    createNodeMock: () => ({}),
  }),
});
