<#
.SYNOPSIS
    Downloads the latest blog release from GitHub, validates its SHA-256 checksum,
    deploys it to a target directory, and cleans up temporary files.

.PARAMETER DeployPath
    The directory to deploy the blog contents into.

.EXAMPLE
    .\deploy.ps1 -DeployPath "C:\inetpub\wwwroot\blog"

.NOTES
    Exit codes:
        0  - Success
        1  - Download or general failure
        2  - SHA-256 checksum mismatch
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$DeployPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

#region Logging

$LogFile = Join-Path $env:TEMP "blog-deploy-$(Get-Date -Format 'yyyyMMdd').log"

function Write-Log {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Message,
        [ValidateSet('INFO', 'WARN', 'ERROR')]
        [string]$Level = 'INFO'
    )
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $entry = "[$timestamp] [$Level] $Message"
    Add-Content -Path $LogFile -Value $entry -Encoding UTF8
    switch ($Level) {
        'ERROR' { Write-Host $entry -ForegroundColor Red }
        'WARN'  { Write-Host $entry -ForegroundColor Yellow }
        default { Write-Host $entry }
    }
}

#endregion

#region Constants

$ApiUrl  = 'https://api.github.com/repos/jeremy-wenzel/blog/releases/latest'
$TempDir = Join-Path $env:TEMP "blog-deploy-$(Get-Date -Format 'yyyyMMddHHmmss')"

#endregion

Write-Log "=== Blog deployment started ==="
Write-Log "Log file  : $LogFile"
Write-Log "Deploy path: $DeployPath"

#region Fetch latest release

Write-Log "Fetching latest release metadata from GitHub API..."
try {
    $headers = @{
        'Accept'               = 'application/vnd.github+json'
        'X-GitHub-Api-Version' = '2022-11-28'
    }
    $release = Invoke-RestMethod -Uri $ApiUrl -Headers $headers -ErrorAction Stop
}
catch {
    Write-Log "Failed to fetch latest release from GitHub API: $_" -Level ERROR
    exit 1
}

$releaseTag = $release.tag_name
Write-Log "Latest release tag: $releaseTag"

#region Version check

$versionFile = Join-Path $DeployPath 'version.txt'
if (Test-Path $versionFile) {
    $deployedVersion = (Get-Content $versionFile -Raw -Encoding UTF8).Trim()
    Write-Log "Currently deployed version: $deployedVersion"
    if ($deployedVersion -eq $releaseTag) {
        Write-Log "Already on latest release ($releaseTag). Nothing to do."
        exit 0
    }
    Write-Log "Update available: '$deployedVersion' -> '$releaseTag'."
}
else {
    Write-Log "No version.txt found at '$versionFile' — assuming first deployment."
}

#endregion

$zipAsset = $release.assets | Where-Object { $_.name -eq 'blog-dist.zip' }        | Select-Object -First 1
$shaAsset = $release.assets | Where-Object { $_.name -eq 'blog-dist.zip.sha256' } | Select-Object -First 1

if (-not $zipAsset) {
    Write-Log "Asset 'blog-dist.zip' not found in release '$releaseTag'." -Level ERROR
    exit 1
}
if (-not $shaAsset) {
    Write-Log "Asset 'blog-dist.zip.sha256' not found in release '$releaseTag'." -Level ERROR
    exit 1
}

#endregion

#region Download assets

New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
Write-Log "Temporary directory: $TempDir"

$zipPath = Join-Path $TempDir 'blog-dist.zip'
$shaPath = Join-Path $TempDir 'blog-dist.zip.sha256'

Write-Log "Downloading blog-dist.zip from $($zipAsset.browser_download_url)..."
try {
    Invoke-WebRequest -Uri $zipAsset.browser_download_url -OutFile $zipPath -ErrorAction Stop
}
catch {
    Write-Log "Failed to download blog-dist.zip: $_" -Level ERROR
    Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue
    exit 1
}
Write-Log "blog-dist.zip downloaded ($([math]::Round((Get-Item $zipPath).Length / 1KB, 1)) KB)."

Write-Log "Downloading blog-dist.zip.sha256 from $($shaAsset.browser_download_url)..."
try {
    Invoke-WebRequest -Uri $shaAsset.browser_download_url -OutFile $shaPath -ErrorAction Stop
}
catch {
    Write-Log "Failed to download blog-dist.zip.sha256: $_" -Level ERROR
    Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue
    exit 1
}
Write-Log "blog-dist.zip.sha256 downloaded."

#endregion

#region Validate SHA-256

Write-Log "Validating SHA-256 checksum..."

# The .sha256 file uses sha256sum format: "<hex>  <filename>"
# Split on whitespace and take the first token to be safe with either format.
$shaFileContent = (Get-Content -Path $shaPath -Raw -Encoding UTF8).Trim()
$expectedHash   = ($shaFileContent -split '\s+')[0].ToLowerInvariant()

if ($expectedHash.Length -ne 64 -or $expectedHash -notmatch '^[0-9a-f]+$') {
    Write-Log "The .sha256 file does not contain a valid SHA-256 hex string (got: '$expectedHash')." -Level ERROR
    Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue
    exit 2
}

$actualHash = (Get-FileHash -Path $zipPath -Algorithm SHA256).Hash.ToLowerInvariant()

Write-Log "Expected : $expectedHash"
Write-Log "Computed : $actualHash"

if ($expectedHash -ne $actualHash) {
    Write-Log "SHA-256 checksum mismatch — the downloaded file may be corrupt or tampered with." -Level ERROR
    Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue
    exit 2
}

Write-Log "SHA-256 checksum verified successfully."

#endregion

#region Deploy

Write-Log "Deploying to '$DeployPath'..."

if (-not (Test-Path $DeployPath)) {
    Write-Log "Deploy path does not exist; creating it."
    try {
        New-Item -ItemType Directory -Path $DeployPath -Force | Out-Null
    }
    catch {
        Write-Log "Failed to create deploy directory '$DeployPath': $_" -Level ERROR
        Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue
        exit 1
    }
}

try {
    Expand-Archive -Path $zipPath -DestinationPath $DeployPath -Force -ErrorAction Stop
}
catch {
    Write-Log "Failed to extract archive to '$DeployPath': $_" -Level ERROR
    Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue
    exit 1
}

Write-Log "Deployment complete."

#endregion

#region Cleanup

Write-Log "Removing temporary files..."
try {
    Remove-Item -Recurse -Force $TempDir -ErrorAction Stop
    Write-Log "Temporary files removed."
}
catch {
    Write-Log "Could not fully remove temporary directory '$TempDir': $_" -Level WARN
}

#endregion

Write-Log "=== Blog deployment finished successfully. Release: $releaseTag ==="
exit 0
