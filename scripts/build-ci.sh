#!/bin/bash

echo "Applying substitutions: Set base URL to /"
echo "This should be only run in a CI environment."
sed --in-place 's/"\/personalSite/"/' ./_config.yml

echo "Building..."
bundle install && bundle exec jekyll build