@echo off

set "output=%1"

REM Remove the first and last character
set "output=%output:~1,-1%"

echo %output% > %TEMP%\encoded.txt

REM Decode the Base64 file
certutil -decode %TEMP%\encoded.txt %TEMP%\decoded.txt > nul

REM Display the decoded content
type %TEMP%\decoded.txt | java -jar D:\path\to\plantuml.jar -tsvg -pipe

REM Clean up temporary files
del %TEMP%\encoded.txt %TEMP%\decoded.txt