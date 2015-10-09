# foundry.cli [![Build status](https://travis-ci.org/twolfson/foundry.cli.png?branch=master)](https://travis-ci.org/twolfson/foundry.cli) [![Build status](https://ci.appveyor.com/api/projects/status/q2hdwo5g8m0wd71k/branch/master?svg=true)](https://ci.appveyor.com/project/twolfson/foundry-cli/branch/master)

Global CLI bindings for foundry

This was built to run `foundry` and node-based `foundry-release` commands without needing to modify the `PATH` environment variable for every release.

## Getting Started
Install the module globally with: `npm install -g foundry.cli`

Then, navigate to a project with `foundry` installed and run `foundry` as if it's not inside of `node_modules/`:

```bash
foundry commands
# Lists out commands used for project
```

Here's a demonstration with a local-only `git` repository

```bash
# Create git repo
mkdir foundry-example
cd foundry-example
git init
echo "Hello World" > README.md
git add README.md
git commit -m "Added documentation"

# Generate `package.json` with `foundry` config
cat > package.json <<EOF
{
  "foundry": {
    "releaseCommands": [
      "foundry-release-git"
    ]
  }
}
EOF

# Locally install `foundry` and corresponding `git` foundry-release command
npm install foundry foundry-release-git

# Run our release with the globally installed foundry
foundry release 1.0.0
# Configuring steps with FOUNDRY_VERSION: 1.0.0
# Configuring steps with FOUNDRY_MESSAGE: Release 1.0.0
# Running step: foundry-release-git update-files "$FOUNDRY_VERSION" "$FOUNDRY_MESSAGE"
# Running step: foundry-release-git commit "$FOUNDRY_VERSION" "$FOUNDRY_MESSAGE"
# [master ec7a32d] Release 1.0.0
# Running step: foundry-release-git register "$FOUNDRY_VERSION" "$FOUNDRY_MESSAGE"
# Running step: foundry-release-git publish "$FOUNDRY_VERSION" "$FOUNDRY_MESSAGE"
# Pushes to remote server

# See the release commit and tag
git log --decorate --oneline
# c6ce921 (HEAD, tag: 1.0.0, master) Release 1.0.0
# f0c25b3 Added documentation
```

## Documentation
When installed, we provide a CLI tool with the name `foundry`

```bash
# Directly invoke `foundry` located in `$PWD/node_modules/.bin/`
foundry

# Help prompt will be for the corresponding `foundry` package
foundry --help
# Usage: foundry [options] [command]
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via `npm run lint` and test via `npm test`.

## Donating
Support this project and [others by twolfson][gratipay] via [gratipay][].

[![Support via Gratipay][gratipay-badge]][gratipay]

[gratipay-badge]: https://cdn.rawgit.com/gratipay/gratipay-badge/2.x.x/dist/gratipay.png
[gratipay]: https://www.gratipay.com/twolfson/

## Unlicense
As of Oct 08 2015, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
