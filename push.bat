@echo off
REM
cd C:\Users\oosla\kc_agency

REM Check if a commit message argument (%1) was provided
if "%1" == "" (
    echo Error: No commit message provided.
    echo Usage: YOUR_SCRIPT_NAME.bat "<commit message>"
    pause
    exit /b 1
)

REM
git add .

REM
git commit -m "%1"

REM Push changes
git push

REM Keep the window open if run by double-clicking
pause
