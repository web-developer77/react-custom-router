Thanks for contributing, you rock!

If you use our code, it is now *our* code.

Please read https://reactjs.org/ and the Code of Conduct before opening an issue.

- [Think You Found a Bug?](#bug)
- [Proposing New or Changed API?](#api)
- [Issue Not Getting Attention?](#attention)
- [Making a Pull Request?](#pr)
- [Setup](#setup)
- [Development](#development)
- [Hacking](#hacking)

<a name="bug"/></a>
## Think You Found a Bug?

Please provide a test case of some sort. Best is a pull request with a failing test. Next is a link to CodePen/JS Bin or repository that illustrates the bug. Finally, some copy/pastable code is acceptable.

<a name="api"/></a>
## Proposing New or Changed API?

Please provide thoughtful comments and some sample code. Proposals without substance will be closed.

<a name="attention"/></a>
## Issue Not Getting Attention?

If you need a bug fixed and nobody is fixing it, it is your responsibility to fix it. Issues with no activity for 30 days may be closed.

<a name="pr"/></a>
## Making a Pull Request?

Pull requests need only the :+1: of two or more collaborators to be merged; when the PR author is a collaborator, that counts as one.

### Tests

All commits that fix bugs or add features need a test.

`<blink>`Do not merge code without tests.`</blink>`

### Changelog

All commits that change or add to the API must be done in a pull request that also:

- Adds an entry to `CHANGES.md` with clear steps for updating code for changed or removed API
- Updates examples
- Updates the docs

## Setup

The following steps will get you setup to contribute changes to this repo:

1. Fork the repo (click the <kbd>Fork</kbd> button at the top right of this page).
2. Clone your fork locally.
```bash
# in a terminal, cd to parent directory where you want your clone to be, then
git clone https://github.com/<your_github_username>/react-router.git
cd react-router
```
3. Install dependencies and build. React Router uses `npm`, so you should too. If you install using `yarn`, unnecessary yarn lock files will be generated.
```bash
npm install
npm run build
```

## Development

### Packages

React Router uses a monorepo to host code for multiple packages. These packages live in the `packages` directory.

### Testing

Calling `npm test` from the root directory will run **every** package's tests. If you want to run tests for a specific package, you should `cd` into that directory.
```bash
# all tests
npm test
# react-router-dom tests
cd packages/react-router-dom
npm test
```
React Router uses Jest to run its tests, so you can provide the `--watch` flag to automatically re-run tests when files change.

### Website

The code for the documentation website lives in the `website` directory. `cd` into there and call `npm start` to start a webpack dev server on `localhost:8080` that will watch for changes.
```bash
cd website
npm start
```

## Hacking

The best way to hack on the router is to symlink it into your project using [`npm link`](https://docs.npmjs.com/cli/link). Then, use `npm run watch` to automatically watch the `modules` directory and output a new build every time something changes.
