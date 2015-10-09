#!/usr/bin/env bash
# If there is an example directory already, delete it
if test -d foundry-example/; then
  rm -rf foundry-example
fi

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
