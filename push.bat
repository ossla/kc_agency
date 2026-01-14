@echo off
cd C:\Users\oosla\kc_agency

for /f %%i in ('powershell -NoProfile -Command "[guid]::NewGuid().ToString()"') do set COMMIT_MSG=WIP %%i

git add .
git commit -m "%COMMIT_MSG%"
git push

pause