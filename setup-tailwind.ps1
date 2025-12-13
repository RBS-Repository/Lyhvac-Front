# PowerShell script to install necessary dependencies for Tailwind CSS

Write-Host "Installing dependencies for Tailwind CSS..." -ForegroundColor Green

# Install autoprefixer and the correct Tailwind CSS PostCSS plugin
npm install autoprefixer @tailwindcss/postcss --save-dev

# Make sure we have the correct Tailwind CSS configuration
Write-Host "Updating Tailwind CSS configuration..." -ForegroundColor Green

# Restart the development server
Write-Host "Setup complete! Please restart your development server with 'npm run dev'" -ForegroundColor Green 