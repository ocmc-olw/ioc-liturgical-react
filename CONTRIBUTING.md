## Prerequisites

[Node.js](http://nodejs.org/) >= v4 must be installed.

## Installation

- Running `npm install` in the components's root directory will install everything you need for development.

## Demo Development Server

- `npm start` will run a development server with the component's demo app at [http://localhost:3000](http://localhost:3000) with hot module reloading.

## Running Tests

- `npm test` will run the tests once.

- `npm run test:coverage` will run the tests and produce a coverage report in `coverage/`.

- `npm run test:watch` will run the tests on every change.

## Adding New Components

1. In the src directory, copy an existing component as your starting point.  Pick one that is similar to what you will work on.
2. Rename the file to your new component name and change its name within the file.  It occurs in four places in the file.
3. Make your code changes within the file.
4. Open the src/index.js file and import your component.  Also add it to the export statement.
5. Open the demo/src/index.js file and import your component and add it to the render method.
6. npm run start will start a test server that uses the demo/src/index.js file and will render your component.

## Building

- `npm run build` will build the component for publishing to npm and also bundle the demo app.

- `npm run clean` will delete built resources.

## PropTypes

Please be sure to make use of React typechecking.  See https://facebook.github.io/react/docs/typechecking-with-proptypes.html.
