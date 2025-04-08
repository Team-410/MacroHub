[Setup]
AppName=MacroHub
AppVersion=1.03
DefaultDirName={userappdata}\MacroHub
DefaultGroupName=MacroHub
OutputDir=.\output
OutputBaseFilename=MacroHubInstaller
Compression=lzma
SolidCompression=yes

[Files]
; Path to your PyInstaller --onedir output folder
Source: "C:\Ohjelmistoprojekti_2\MacroHub\web\app\public\macrohub1.03\*"; DestDir: "{userappdata}\MacroHub"; Flags: ignoreversion recursesubdirs

[Icons]
; Create a desktop shortcut
Name: "{userdesktop}\MacroHub"; Filename: "{app}\macrohub1.03.exe"; WorkingDir: "{app}"

[Run]
; Optionally run the app after installation
Filename: "{app}\macrohub1.03.exe"; Description: "Launch MacroHub"; Flags: nowait postinstall skipifsilent
