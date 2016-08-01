# React Sortable Tree

[DEMO](https://fritz-c.github.io/react-sortable-tree/)

### Features

- Highly flexible
- No external CSS files

## Example

```jsx
import React from 'react';
import ReactSortableTree from 'react-sortable-tree';

export default React.createClass({
    render() {
        return (
            <ReactSortableTree myName="World" />
        );
    }
});

```

## Options

Property            | Type   | Default        | Required | Description
:-------------------|:------:|:--------------:|:--------:|:----------------------------------------
myName              | string | `World`        |          | Name of person/thing to greet.

## Contributing

After cloning the repository and running `npm install` inside, you can use the following commands to develop and build the project.

```sh
# Starts a webpack dev server that hosts a demo page with the component.
# It uses react-hot-loader so changes are reflected on save.
npm start

# Lints the code with eslint and my custom rules.
npm run lint

# Lints and builds the code, placing the result in the dist directory.
# This build is necessary to reflect changes if you're 
#  `npm link`-ed to this repository from another local project.
npm run build
```

Pull requests are welcome!

## License

MIT
