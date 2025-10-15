import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../../util';

const include = '(Requires: `#include <WinAPIReg.au3>`)';

const signatures = {
  _WinAPI_AddMRUString: {
    documentation: 'Adds a string to the top of the most recently used (MRU) list',
    label: '_WinAPI_AddMRUString ( $hMRU, $sStr )',
    params: [
      {
        label: '$hMRU',
        documentation: 'Parameter description',
      },
      {
        label: '$sStr',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_AssocGetPerceivedType: {
    documentation: 'Retrieves a file\'s perceived type based on its extension',
    label: '_WinAPI_AssocGetPerceivedType ( $sExt )',
    params: [
      {
        label: '$sExt',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_AssocQueryString: {
    documentation: 'Searches for and retrieves a file or protocol association-related string from the registry',
    label: '_WinAPI_AssocQueryString ( $sAssoc, $iType [, $iFlags = 0 [, $sExtra = \'\']] )',
    params: [
      {
        label: '$sAssoc',
        documentation: 'Parameter description',
      },
      {
        label: '$iType [, $iFlags',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_CreateMRUList: {
    documentation: 'Creates a new most recently used (MRU) list',
    label: '_WinAPI_CreateMRUList ( $hKey, $sSubKey [, $iMax = 26] )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      },
      {
        label: '$sSubKey [, $iMax',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_DllInstall: {
    documentation: 'Registers OLE controls such as DLL or ActiveX Controls (OCX) files',
    label: '_WinAPI_DllInstall ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_DllUninstall: {
    documentation: 'Unregisters OLE controls such as DLL or ActiveX Controls (OCX) files',
    label: '_WinAPI_DllUninstall ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_EnumMRUList: {
    documentation: 'Enumerates the contents of the most recently used (MRU) list',
    label: '_WinAPI_EnumMRUList ( $hMRU, $iItem )',
    params: [
      {
        label: '$hMRU',
        documentation: 'Parameter description',
      },
      {
        label: '$iItem',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_FreeMRUList: {
    documentation: 'Frees the handle associated with the most recently used (MRU) list and writes cached data to the registry',
    label: '_WinAPI_FreeMRUList ( $hMRU )',
    params: [
      {
        label: '$hMRU',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetRegKeyNameByHandle: {
    documentation: 'Retrieves a name of the specified registry key',
    label: '_WinAPI_GetRegKeyNameByHandle ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegCloseKey: {
    documentation: 'Closes a handle to the specified registry key',
    label: '_WinAPI_RegCloseKey ( $hKey [, $bFlush = False] )',
    params: [
      {
        label: '$hKey [, $bFlush',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegConnectRegistry: {
    documentation: 'Establishes a connection to a predefined registry key on another computer',
    label: '_WinAPI_RegConnectRegistry ( $sComputer, $hKey )',
    params: [
      {
        label: '$sComputer',
        documentation: 'Parameter description',
      },
      {
        label: '$hKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegCopyTree: {
    documentation: 'Recursively copies the subkeys and values of the source subkey to the destination key',
    label: '_WinAPI_RegCopyTree ( $hSrcKey, $sSrcSubKey, $hDestKey )',
    params: [
      {
        label: '$hSrcKey',
        documentation: 'Parameter description',
      },
      {
        label: '$sSrcSubKey',
        documentation: 'Parameter description',
      },
      {
        label: '$hDestKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegCopyTreeEx: {
    documentation: 'Copies the specified registry key, along with its values and subkeys, to the specified destination key',
    label: '_WinAPI_RegCopyTreeEx ( $hSrcKey, $sSrcSubKey, $hDestKey )',
    params: [
      {
        label: '$hSrcKey',
        documentation: 'Parameter description',
      },
      {
        label: '$sSrcSubKey',
        documentation: 'Parameter description',
      },
      {
        label: '$hDestKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegCreateKey: {
    documentation: 'Creates the specified registry key',
    label: '_WinAPI_RegCreateKey ( $hKey [, $sSubKey = \'\' [, $iAccess = $KEY_ALL_ACCESS [, $iOptions = 0 [, $tSecurity = 0]]]] )',
    params: [
      {
        label: '$hKey [, $sSubKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegDeleteEmptyKey: {
    documentation: 'Deletes an empty key',
    label: '_WinAPI_RegDeleteEmptyKey ( $hKey [, $sSubKey = \'\'] )',
    params: [
      {
        label: '$hKey [, $sSubKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegDeleteKey: {
    documentation: 'Deletes a subkey and its values',
    label: '_WinAPI_RegDeleteKey ( $hKey [, $sSubKey = \'\'] )',
    params: [
      {
        label: '$hKey [, $sSubKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegDeleteKeyValue: {
    documentation: 'Removes the specified value from the specified registry key and subkey',
    label: '_WinAPI_RegDeleteKeyValue ( $hKey, $sSubKey, $sValueName )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      },
      {
        label: '$sSubKey',
        documentation: 'Parameter description',
      },
      {
        label: '$sValueName',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegDeleteTree: {
    documentation: 'Deletes a subkey and all its descendants',
    label: '_WinAPI_RegDeleteTree ( $hKey [, $sSubKey = \'\'] )',
    params: [
      {
        label: '$hKey [, $sSubKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegDeleteTreeEx: {
    documentation: 'Deletes the subkeys and values of the specified key recursively',
    label: '_WinAPI_RegDeleteTreeEx ( $hKey [, $sSubKey = 0] )',
    params: [
      {
        label: '$hKey [, $sSubKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegDeleteValue: {
    documentation: 'Removes a named value from the specified registry key',
    label: '_WinAPI_RegDeleteValue ( $hKey, $sValueName )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      },
      {
        label: '$sValueName',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegDisableReflectionKey: {
    documentation: 'Disables registry reflection for the specified key',
    label: '_WinAPI_RegDisableReflectionKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegDuplicateHKey: {
    documentation: 'Duplicates a registry key\'s handle',
    label: '_WinAPI_RegDuplicateHKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegEnableReflectionKey: {
    documentation: 'Restores registry reflection for the specified disabled key',
    label: '_WinAPI_RegEnableReflectionKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegEnumKey: {
    documentation: 'Enumerates the subkeys of the specified open registry key',
    label: '_WinAPI_RegEnumKey ( $hKey, $iIndex )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      },
      {
        label: '$iIndex',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegEnumValue: {
    documentation: 'Enumerates the values for the specified open registry key',
    label: '_WinAPI_RegEnumValue ( $hKey, $iIndex )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      },
      {
        label: '$iIndex',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegFlushKey: {
    documentation: 'Writes all the attributes of the specified open registry key into the registry',
    label: '_WinAPI_RegFlushKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegLoadMUIString: {
    documentation: 'Loads the specified string from the specified key and subkey',
    label: '_WinAPI_RegLoadMUIString ( $hKey, $sValueName [, $sDirectory = \'\'] )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      },
      {
        label: '$sValueName [, $sDirectory',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegNotifyChangeKeyValue: {
    documentation: 'Notifies the caller about changes to the attributes or contents of a specified registry key',
    label: '_WinAPI_RegNotifyChangeKeyValue ( $hKey, $iFilter [, $bSubtree = False [, $bAsync = False [, $hEvent = 0]]] )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      },
      {
        label: '$iFilter [, $bSubtree',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegOpenKey: {
    documentation: 'Opens the specified registry key',
    label: '_WinAPI_RegOpenKey ( $hKey [, $sSubKey = \'\' [, $iAccess = 0x000F003F]] )',
    params: [
      {
        label: '$hKey [, $sSubKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegQueryInfoKey: {
    documentation: 'Retrieves information about the specified registry key',
    label: '_WinAPI_RegQueryInfoKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegQueryLastWriteTime: {
    documentation: 'Retrieves information about the last write time to the specified registry key',
    label: '_WinAPI_RegQueryLastWriteTime ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegQueryMultipleValues: {
    documentation: 'Retrieves the type and data for a list of value names associated with an open registry key',
    label: '_WinAPI_RegQueryMultipleValues ( $hKey, ByRef $aValent, ByRef $pBuffer [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $aValent',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $pBuffer [, $iStart',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegQueryReflectionKey: {
    documentation: 'Determines whether reflection has been disabled or enabled for the specified key',
    label: '_WinAPI_RegQueryReflectionKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegQueryValue: {
    documentation: 'Retrieves the type and data for the specified value name associated with an open registry key',
    label: '_WinAPI_RegQueryValue ( $hKey, $sValueName, ByRef $tValueData )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      },
      {
        label: '$sValueName',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $tValueData',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegRestoreKey: {
    documentation: 'Reads the registry information in a specified file and copies it over the specified key',
    label: '_WinAPI_RegRestoreKey ( $hKey, $sFilePath )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      },
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegSaveKey: {
    documentation: 'Saves the specified key and all of its subkeys and values to a new file, in the standard format',
    label: '_WinAPI_RegSaveKey ( $hKey, $sFilePath [, $bReplace = False [, $tSecurity = 0]] )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      },
      {
        label: '$sFilePath [, $bReplace',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegSetValue: {
    documentation: 'Sets the data and type of a specified value under a registry key',
    label: '_WinAPI_RegSetValue ( $hKey, $sValueName, $iType, $tValueData, $iBytes )',
    params: [
      {
        label: '$hKey',
        documentation: 'Parameter description',
      },
      {
        label: '$sValueName',
        documentation: 'Parameter description',
      },
      {
        label: '$iType',
        documentation: 'Parameter description',
      },
      {
        label: '$tValueData',
        documentation: 'Parameter description',
      },
      {
        label: '$iBytes',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SfcIsKeyProtected: {
    documentation: 'Determines whether the specified registry key is protected',
    label: '_WinAPI_SfcIsKeyProtected ( $hKey [, $sSubKey = Default [, $iFlag = 0]] )',
    params: [
      {
        label: '$hKey [, $sSubKey',
        documentation: 'Parameter description',
      }
    ],
  }
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
