/* eslint-disable import/no-extraneous-dependencies */
import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

setOptions({
  name: 'React Sortable Tree',
  url: 'https://github.com/frontend-collective/react-sortable-tree',
  showAddonPanel: false,
});

function loadStories() {
  // eslint-disable-next-line global-require
  require('../stories');
}

configure(loadStories, module);
