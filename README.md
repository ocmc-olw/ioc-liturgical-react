# ioc-liturgical-react

[![Travis][build-badge]][build]
[![npm version](https://badge.fury.io/js/ioc-liturgical-react.svg)](https://badge.fury.io/js/ioc-liturgical-react)
[![Coverage Status](https://coveralls.io/repos/github/OCMC-Translation-Projects/ioc-liturgical-react/badge.svg?branch=master)](https://coveralls.io/github/OCMC-Translation-Projects/ioc-liturgical-react?branch=master)

The ioc-liturgical-react package provides React js components for creating web applications that access the International Orthodox Christian (IOC) Liturgical Web Service (ioc-liturgical-ws). The web service provides a REST API as a front-end to the IOC Liturgical Database (ioc-liturgical-db).  The components provided by this package include:

- Login - a React component that renders a login form and handles the submit by interacting with the REST API.

More components will be available soon:

- Database search (simple)
- Database search (complex)
- Results table
- Version comparison popup
- Self-service account maintenance
- Self-service password change

## Usage

Use npm to install the ioc-liturgical-react package.

When you import a component into your Javascript, use braces around the name of the component, e.g.

import {Login} from 'ioc-liturgical-react'

[build-badge]: https://travis-ci.org/OCMC-Translation-Projects/ioc-liturgical-react.svg
[build]: https://travis-ci.org/OCMC-Translation-Projects/ioc-liturgical-react

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/ioc-liturgical-react

