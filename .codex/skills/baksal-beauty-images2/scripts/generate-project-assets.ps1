$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..\..\..\..")
Push-Location $root
try {
  npm run generate:images
}
finally {
  Pop-Location
}
