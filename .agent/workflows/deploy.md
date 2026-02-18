---
description: Deploy OPIE website changes to GitHub Pages (menofopie.com)
---

# Deploy OPIE Website

This workflow pushes your local code changes to GitHub, which automatically updates your live website at `www.menofopie.com`.

## Steps

1. First, sync with any remote changes:
// turbo
```
cd c:\Users\rcardenas\OneDrive\RONALD_ON_CLINICA\DESARROLLO_CLINICA\RONALD_HTML_PRIVADO\WEBS\Opienewlogo
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User"); git pull origin main --rebase
```

2. Stage all changed files:
// turbo
```
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User"); git add .
```

3. Commit with a description of the changes:
// turbo
```
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User"); git commit -m "UPDATE_MESSAGE"
```
> Replace `UPDATE_MESSAGE` with a short description of what changed. Example: `"Nuevo producto agregado"` or `"Color del header actualizado"`.

4. Push to GitHub (this triggers the live update):
// turbo
```
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User"); git push origin main
```

5. Wait 1-2 minutes, then verify at: https://www.menofopie.com
