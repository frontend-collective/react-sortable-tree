/* eslint-disable import/no-extraneous-dependencies */
import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

setOptions({
  name: 'React Sortable Tree',
  url: 'https://github.com/fritz-c/react-sortable-tree',
  showAddonPanel: false,
});

function loadStories() {
  // eslint-disable-next-line global-require
  require('../examples/storybooks');
}

configure(loadStories, module);
