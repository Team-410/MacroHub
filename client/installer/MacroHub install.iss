[Setup]
AppName=MacroHub
AppVersion=1.1.0
DefaultDirName={userappdata}\MacroHub
DefaultGroupName=MacroHub
OutputDir=C:\Ohjelmistoprojekti_2\MacroHub\web\app\public
OutputBaseFilename=MacroHubInstaller
Compression=lzma
SolidCompression=yes

[Files]
; Path to your PyInstaller --onedir output folder

Source: "C:\Ohjelmistoprojekti_2\MacroHub\client\config.json"; DestDir: "{userappdata}\MacroHub"; Flags: ignoreversion recursesubdirs;

Source: "C:\Ohjelmistoprojekti_2\MacroHub\client\dist\macrohub*"; DestDir: "{userappdata}\MacroHub"; Flags: ignoreversion recursesubdirs;

Source: "C:\Ohjelmistoprojekti_2\MacroHub\client\dist\_internal\*"; DestDir: "{userappdata}\MacroHub"; Flags: ignoreversion recursesubdirs;

[Icons]
; Create a desktop shortcut
Name: "{userdesktop}\MacroHub"; Filename: "{app}\macrohub.exe"; WorkingDir: "{app}"

[Run]
; Optionally run the app after installation
Filename: "{app}\macrohub\macrohub.exe"; Description: "Launch MacroHub"; Flags: nowait postinstall skipifsilent
