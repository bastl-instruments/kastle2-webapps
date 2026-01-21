#!/bin/bash

echo ""
echo "Installing shared/bastl-react..."
cd shared/bastl-react
rm -r node_modules
npm install

echo ""
echo "Installing wave-bard-sample-loader..."
cd ../../wave-bard-sample-loader
rm -r node_modules
npm install

echo ""
echo "Installing alchemist-laboratory..."
cd ../alchemist-laboratory
rm -r node_modules
npm install

echo ""
echo "Installing fx-wizard-chamber..."
cd ../fx-wizard-chamber
rm -r node_modules
npm install

echo ""
echo "All done!"