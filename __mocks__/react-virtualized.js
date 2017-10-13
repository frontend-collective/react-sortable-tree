import React from 'react';

// eslint-disable-next-line global-require
const reactVirtualized = { ...require('react-virtualized') };

/* eslint-disable react/prop-types */
const MockAutoSizer = props =>
  <div>
    {props.children({
      height: 99999,
      width: 200,
    })}
  </div>;
/* eslint-enable react/prop-types */

reactVirtualized.AutoSizer = MockAutoSizer;

module.exports = reactVirtualized;
