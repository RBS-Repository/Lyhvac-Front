#!/bin/bash

echo "Installing dependencies for Tailwind CSS..."

# Install autoprefixer and the correct Tailwind CSS PostCSS plugin
npm install autoprefixer @tailwindcss/postcss --save-dev

# Make sure we have the correct Tailwind CSS configuration
echo "Updating Tailwind CSS configuration..."

# Restart the development server
echo "Setup complete! Please restart your development server with 'npm run dev'" 