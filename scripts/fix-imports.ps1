$srcDir = (Get-Item -Path (Join-Path $PSScriptRoot "..\src")).FullName
$files = Get-ChildItem -Path $srcDir -Recurse -Include "*.jsx", "*.js"

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Updated regex to handle optional ./ before ../
    $pattern = 'from\s+["''](?:\.\/)?((\.\.\/)+)([^"'']+)["'']'
    
    $newContent = [regex]::Replace($content, $pattern, {
        param($match)
        $dotDotsString = $match.Groups[1].Value
        $dotDotsCount = [regex]::Matches($dotDotsString, '\.\.\/').Count
        $importRemainder = $match.Groups[3].Value
        
        # Start from current file's directory
        $targetDir = $file.DirectoryName
        
        # Go up for each ../
        for ($i = 0; $i -lt $dotDotsCount; $i++) {
            $parent = Split-Path -Path $targetDir -Parent
            if ($parent -eq "") { break }
            $targetDir = $parent
        }
        
        # Calculate path relative to srcDir
        $relPathPrefix = ""
        if ($targetDir.Length -gt $srcDir.Length) {
            $relPathPrefix = $targetDir.Substring($srcDir.Length).TrimStart('\')
        }
        
        $finalImportPath = ""
        if ($relPathPrefix -ne "") {
            $finalImportPath = Join-Path $relPathPrefix $importRemainder
        } else {
            $finalImportPath = $importRemainder
        }
        
        $normalizedPath = $finalImportPath.Replace('\', '/')
        return "from ""@/$normalizedPath"""
    })

    if ($content -ne $newContent) {
        Write-Host "Updating imports in: $($file.FullName)"
        $newContent | Set-Content -Path $file.FullName -NoNewline
    }
}

Write-Host "Import refactoring complete!"
