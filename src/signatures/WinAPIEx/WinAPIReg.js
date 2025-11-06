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
        documentation: 'Handle of the MRU list.',
      },
      {
        label: '$sStr',
        documentation: 'The string be added.',
      },
    ],
  },
  _WinAPI_AssocGetPerceivedType: {
    documentation: "Retrieves a file's perceived type based on its extension",
    label: '_WinAPI_AssocGetPerceivedType ( $sExt )',
    params: [
      {
        label: '$sExt',
        documentation:
          'The file\'s extension. This should include the leading period, for example ".txt".',
      },
    ],
  },
  _WinAPI_AssocQueryString: {
    documentation:
      'Searches for and retrieves a file or protocol association-related string from the registry',
    label: "_WinAPI_AssocQueryString ( $sAssoc, $iType [, $iFlags = 0 [, $sExtra = '']] )",
    params: [
      {
        label: '$sAssoc',
        documentation:
          'The string that is used to determine the root key. The following four types of strings can be used.The file name extension, such as ".txt".The class identifier (CLSID) GUID in the standard "{GUID}" format.The application\'s ProgID, such as Word.Document.8.The name of an application\'s .exe file. The $ASSOCF_OPEN_BYEXENAME flag must be set.',
      },
      {
        label: '$iType',
        documentation:
          'The value that specifies the type of string that is to be returned. This parameter can be one of the following values: $ASSOCSTR_COMMAND $ASSOCSTR_EXECUTABLE $ASSOCSTR_FRIENDLYDOCNAME $ASSOCSTR_FRIENDLYAPPNAME $ASSOCSTR_NOOPEN $ASSOCSTR_SHELLNEWVALUE $ASSOCSTR_DDECOMMAND $ASSOCSTR_DDEIFEXEC $ASSOCSTR_DDEAPPLICATION $ASSOCSTR_DDETOPIC $ASSOCSTR_INFOTIP $ASSOCSTR_QUICKTIP $ASSOCSTR_TILEINFO $ASSOCSTR_CONTENTTYPE $ASSOCSTR_DEFAULTICON $ASSOCSTR_SHELLEXTENSION',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that can be used to control the search. It can be any combination of the following values, except that only one $ASSOCF_INIT_* value can be included. $ASSOCF_INIT_NOREMAPCLSID $ASSOCF_INIT_BYEXENAME $ASSOCF_OPEN_BYEXENAME $ASSOCF_INIT_DEFAULTTOSTAR $ASSOCF_INIT_DEFAULTTOFOLDER $ASSOCF_NOUSERSETTINGS $ASSOCF_NOTRUNCATE $ASSOCF_VERIFY $ASSOCF_REMAPRUNDLL $ASSOCF_NOFIXUPS $ASSOCF_IGNOREBASECLASS $ASSOCF_INIT_IGNOREUNKNOWN',
      },
      {
        label: '$sExtra',
        documentation:
          '**[optional]** The string with additional information about the location of the string.It is typically set to a Shell verb such as open.',
      },
    ],
  },
  _WinAPI_CreateMRUList: {
    documentation: 'Creates a new most recently used (MRU) list',
    label: '_WinAPI_CreateMRUList ( $hKey, $sSubKey [, $iMax = 26] )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to the currently open key, or one of the following predefined values under which to store the MRU data.$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE',
      },
      {
        label: '$sSubKey',
        documentation: 'The subkey under which to store the MRU data.',
      },
      {
        label: '$iMax',
        documentation:
          '**[optional]** The maximum number of entries in the MRU list. Default is 26 (A..Z).',
      },
    ],
  },
  _WinAPI_DllInstall: {
    documentation: 'Registers OLE controls such as DLL or ActiveX Controls (OCX) files',
    label: '_WinAPI_DllInstall ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the DLL file that will be registered.',
      },
    ],
  },
  _WinAPI_DllUninstall: {
    documentation: 'Unregisters OLE controls such as DLL or ActiveX Controls (OCX) files',
    label: '_WinAPI_DllUninstall ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the DLL file that will be unregistered.',
      },
    ],
  },
  _WinAPI_EnumMRUList: {
    documentation: 'Enumerates the contents of the most recently used (MRU) list',
    label: '_WinAPI_EnumMRUList ( $hMRU, $iItem )',
    params: [
      {
        label: '$hMRU',
        documentation: 'Handle of the MRU list, obtained when the list was created.',
      },
      {
        label: '$iItem',
        documentation:
          'The item to return. If this value is (-1), the function returns the number of items in the MRU list.',
      },
    ],
  },
  _WinAPI_FreeMRUList: {
    documentation:
      'Frees the handle associated with the most recently used (MRU) list and writes cached data to the registry',
    label: '_WinAPI_FreeMRUList ( $hMRU )',
    params: [
      {
        label: '$hMRU',
        documentation: 'Handle of the MRU list to free.',
      },
    ],
  },
  _WinAPI_GetRegKeyNameByHandle: {
    documentation: 'Retrieves a name of the specified registry key',
    label: '_WinAPI_GetRegKeyNameByHandle ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation: 'Handle to an open registry key.',
      },
    ],
  },
  _WinAPI_RegCloseKey: {
    documentation: 'Closes a handle to the specified registry key',
    label: '_WinAPI_RegCloseKey ( $hKey [, $bFlush = False] )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to the open key to be closed.The handle must have been opened by the [_WinAPI_RegCreateKey()](_WinAPI_RegCreateKey.htm) or [_WinAPI_RegOpenKey()](_WinAPI_RegOpenKey.htm) function.',
      },
      {
        label: '$bFlush',
        documentation:
          "**[optional]** Specifies whether writes all the attributes of the specified registry key into the registry, valid values: True - Write changes to disk before close the handle. False - Don't write (Default).",
      },
    ],
  },
  _WinAPI_RegConnectRegistry: {
    documentation: 'Establishes a connection to a predefined registry key on another computer',
    label: '_WinAPI_RegConnectRegistry ( $sComputer, $hKey )',
    params: [
      {
        label: '$sComputer',
        documentation:
          'The name of the remote computer. The string has the form as "\\computername".The caller must have access to the remote computer or the function fails.If this parameter is 0, the local computer name is used.',
      },
      {
        label: '$hKey',
        documentation:
          'The predefined registry handle. This parameter can be one of the following predefined keys on the remote computer: $HKEY_LOCAL_MACHINE $HKEY_PERFORMANCE_DATA $HKEY_USERS',
      },
    ],
  },
  _WinAPI_RegCopyTree: {
    documentation:
      'Recursively copies the subkeys and values of the source subkey to the destination key',
    label: '_WinAPI_RegCopyTree ( $hSrcKey, $sSrcSubKey, $hDestKey )',
    params: [
      {
        label: '$hSrcKey',
        documentation: 'Handle to the source key or one of the predefined registry keys ($HKEY_*).',
      },
      {
        label: '$sSrcSubKey',
        documentation: 'The subkey whose subkeys and values are to be copied.',
      },
      {
        label: '$hDestKey',
        documentation: 'Handle to the destination key.',
      },
    ],
  },
  _WinAPI_RegCopyTreeEx: {
    documentation:
      'Copies the specified registry key, along with its values and subkeys, to the specified destination key',
    label: '_WinAPI_RegCopyTreeEx ( $hSrcKey, $sSrcSubKey, $hDestKey )',
    params: [
      {
        label: '$hSrcKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_READ access right.This handle is returned by the [_WinAPI_RegCreateKey()](_WinAPI_RegCreateKey.htm) or [_WinAPI_RegOpenKey()](_WinAPI_RegOpenKey.htm) function,or it can be one of the predefined registry keys ($HKEY_*).',
      },
      {
        label: '$sSrcSubKey',
        documentation:
          'The name of the key. This key must be a subkey of the key identified by the $hSrcKey parameter.',
      },
      {
        label: '$hDestKey',
        documentation:
          'Handle to the destination key. The calling process must have $KEY_CREATE_SUB_KEY access to the key.This handle is returned by the [_WinAPI_RegCreateKey()](_WinAPI_RegCreateKey.htm) or [_WinAPI_RegOpenKey()](_WinAPI_RegOpenKey.htm) function,or it can be one of the predefined registry keys ($HKEY_*).',
      },
    ],
  },
  _WinAPI_RegCreateKey: {
    documentation: 'Creates the specified registry key',
    label:
      "_WinAPI_RegCreateKey ( $hKey [, $sSubKey = '' [, $iAccess = $KEY_ALL_ACCESS [, $iOptions = 0 [, $tSecurity = 0]]]] )",
    params: [
      {
        label: '$vKey',
        documentation:
          'Name of the key to be open (see remarks). orHandle to an open registry key. If the key already exists, the function opens it.The calling process must have $KEY_CREATE_SUB_KEY access to the key.This handle is returned by the [_WinAPI_RegCreateKey()](_WinAPI_RegCreateKey.htm) or [_WinAPI_RegOpenKey()](_WinAPI_RegOpenKey.htm) function,or it can be one of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_USERS',
      },
      {
        label: '$sSubKey',
        documentation:
          '**[optional]** The name of a subkey that this function opens or creates.The subkey specified must be a subkey of the key identified by the $vKey parameter; it can be up to 32 levels deep in the registry tree.If an empty string (Default), the return is a new handle to the key specified by $vKey.',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The mask that specifies the access rights for the key.This parameter can be one or more of the following values: $KEY_ALL_ACCESS $KEY_CREATE_LINK $KEY_CREATE_SUB_KEY $KEY_ENUMERATE_SUB_KEYS $KEY_EXECUTE $KEY_NOTIFY $KEY_QUERY_VALUE $KEY_READ $KEY_SET_VALUE $KEY_WOW64_32KEY for creation in the 32-bit key area $KEY_WOW64_64KEY for creation un the 64-bit key area $KEY_WRITE',
      },
      {
        label: '$iOptions',
        documentation:
          '**[optional]** This parameter can be one of the following values: $REG_OPTION_BACKUP_RESTORE $REG_OPTION_CREATE_LINK $REG_OPTION_NON_VOLATILE (Default) $REG_OPTION_VOLATILE',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that determines whether the returned handle can be inherited by child processes.If this parameter is 0 (Default), the handle cannot be inherited.',
      },
    ],
  },
  _WinAPI_RegDeleteEmptyKey: {
    documentation: 'Deletes an empty key',
    label: "_WinAPI_RegDeleteEmptyKey ( $hKey [, $sSubKey = ''] )",
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key, or any of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_USERS',
      },
      {
        label: '$sSubKey',
        documentation: '**[optional]** The name of the key to delete.',
      },
    ],
  },
  _WinAPI_RegDeleteKey: {
    documentation: 'Deletes a subkey and its values',
    label: "_WinAPI_RegDeleteKey ( $vKey [, $sSubKey = '' [, $iSamDesired = Default]] )",
    params: [
      {
        label: '$vKey',
        documentation:
          'Name of the key to be open (see remarks). orHandle to an open registry key. The access rights of this key do not affect the delete operation.This handle is returned by the [_WinAPI_RegCreateKey()](_WinAPI_RegCreateKey.htm) or [_WinAPI_RegOpenKey()](_WinAPI_RegOpenKey.htm) function,or it can be one of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_USERS',
      },
      {
        label: '$sSubKey',
        documentation:
          '**[optional]** The name of the key to be deleted. It must be a subkey of the key that $hKey identifies, but it cannot have subkeys.',
      },
      {
        label: '$iSamDesired',
        documentation:
          '**[optional]** An access mask the specifies the platform-specific view of the registry.This parameter can be one of the following values: $KEY_WOW64_32KEY for an 32-bit Key $KEY_WOW64_64KEY for an 64-bit KeyBy Default the key correspond to the @AutoItX64 value.',
      },
    ],
  },
  _WinAPI_RegDeleteKeyValue: {
    documentation: 'Removes the specified value from the specified registry key and subkey',
    label: '_WinAPI_RegDeleteKeyValue ( $hKey, $sSubKey, $sValueName )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_SET_VALUE access right.This handle is returned by the [_WinAPI_RegCreateKey()](_WinAPI_RegCreateKey.htm) or [_WinAPI_RegOpenKey()](_WinAPI_RegOpenKey.htm) function,or it can be one of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_USERS',
      },
      {
        label: '$sSubKey',
        documentation:
          'The name of the registry key. This key must be a subkey of the key identified by the $hKey parameter.',
      },
      {
        label: '$sValueName',
        documentation: 'The registry value to be removed from the key.',
      },
    ],
  },
  _WinAPI_RegDeleteTree: {
    documentation: 'Deletes a subkey and all its descendants',
    label: "_WinAPI_RegDeleteTree ( $hKey [, $sSubKey = ''] )",
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key, or any of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_PERFORMANCE_DATA $HKEY_USERS',
      },
      {
        label: '$sSubKey',
        documentation: '**[optional]** The name of the key to delete.',
      },
    ],
  },
  _WinAPI_RegDeleteTreeEx: {
    documentation: 'Deletes the subkeys and values of the specified key recursively',
    label: '_WinAPI_RegDeleteTreeEx ( $hKey [, $sSubKey = 0] )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the following access rights $STANDARD_RIGHT_DELETE, $KEY_ENUMERATE_SUB_KEYS, and $KEY_QUERY_VALUE. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function, or it can be one of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_USERS',
      },
      {
        label: '$sSubKey',
        documentation:
          '**[optional]** The name of the key to delete. This key must be a subkey of the key identified by the $hKey parameter. If this parameter is not specified (Default), the subkeys and values of $hKey are deleted.',
      },
    ],
  },
  _WinAPI_RegDeleteValue: {
    documentation: 'Removes a named value from the specified registry key',
    label: '_WinAPI_RegDeleteValue ( $hKey, $sValueName )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_SET_VALUE access right. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function, or it can be one of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_USERS',
      },
      {
        label: '$sValueName',
        documentation:
          "The registry value to be removed. If this parameter is empty string, the key's unnamed or default value is removed.",
      },
    ],
  },
  _WinAPI_RegDisableReflectionKey: {
    documentation: 'Disables registry reflection for the specified key',
    label: '_WinAPI_RegDisableReflectionKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function; it cannot specify a key on a remote computer. If the key is not on the reflection list, the function succeeds but has no effect.',
      },
    ],
  },
  _WinAPI_RegDuplicateHKey: {
    documentation: "Duplicates a registry key's handle",
    label: '_WinAPI_RegDuplicateHKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation: 'Handle to an open registry key to be duplicated.',
      },
    ],
  },
  _WinAPI_RegEnableReflectionKey: {
    documentation: 'Restores registry reflection for the specified disabled key',
    label: '_WinAPI_RegEnableReflectionKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function; it cannot specify a key on a remote computer. If the key is not on the reflection list, the function succeeds but has no effect.',
      },
    ],
  },
  _WinAPI_RegEnumKey: {
    documentation: 'Enumerates the subkeys of the specified open registry key',
    label: '_WinAPI_RegEnumKey ( $hKey, $iIndex )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_ENUMERATE_SUB_KEYS access right. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can also be one of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_PERFORMANCE_DATA $HKEY_USERS',
      },
      {
        label: '$iIndex',
        documentation:
          'The index of the subkey to retrieve. This parameter should be zero for the first call to the _WinAPI_RegEnumKey() function and then incremented for subsequent calls.',
      },
    ],
  },
  _WinAPI_RegEnumValue: {
    documentation: 'Enumerates the values for the specified open registry key',
    label: '_WinAPI_RegEnumValue ( $hKey, $iIndex )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_QUERY_VALUE access right. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can also be one of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_PERFORMANCE_DATA $HKEY_USERS',
      },
      {
        label: '$iIndex',
        documentation:
          'The index of the value to be retrieved. This parameter should be zero for the first call to the _WinAPI_RegEnumValue() function and then be incremented for subsequent calls.',
      },
    ],
  },
  _WinAPI_RegFlushKey: {
    documentation: 'Writes all the attributes of the specified open registry key into the registry',
    label: '_WinAPI_RegFlushKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_QUERY_VALUE access right. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can also be one of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_PERFORMANCE_DATA $HKEY_USERS',
      },
    ],
  },
  _WinAPI_RegLoadMUIString: {
    documentation: 'Loads the specified string from the specified key and subkey',
    label: "_WinAPI_RegLoadMUIString ( $hKey, $sValueName [, $sDirectory = ''] )",
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_QUERY_VALUE access right. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can also be one of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_USERS',
      },
      {
        label: '$sValueName',
        documentation: 'The name of the registry value.',
      },
      {
        label: '$sDirectory',
        documentation: '**[optional]** The directory path.',
      },
    ],
  },
  _WinAPI_RegNotifyChangeKeyValue: {
    documentation:
      'Notifies the caller about changes to the attributes or contents of a specified registry key',
    label:
      '_WinAPI_RegNotifyChangeKeyValue ( $hKey, $iFilter [, $bSubtree = False [, $bAsync = False [, $hEvent = 0]]] )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the KEY_NOTIFY access right. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can also be one of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_USERS',
      },
      {
        label: '$iFilter',
        documentation:
          'Indicates the changes that should be reported. This parameter can be one or more of the following values: $REG_NOTIFY_CHANGE_NAME $REG_NOTIFY_CHANGE_ATTRIBUTES $REG_NOTIFY_CHANGE_LAST_SET $REG_NOTIFY_CHANGE_SECURITY',
      },
      {
        label: '$bSubtree',
        documentation:
          '**[optional]** Specifies whether report changes in the subkeys of the specified key, valid values: True - The function reports changes in the specified key and all its subkeys. False - The function reports changes only in the specified key (Default).',
      },
      {
        label: '$bAsync',
        documentation:
          '**[optional]** Specifies whether return immediately, valid values: True - The function returns immediately and reports changes by signaling the specified event. False - The function does not return until a change has occurred (Default).',
      },
      {
        label: '$hEvent',
        documentation:
          '**[optional]** Handle to an event. If the $fAsync parameter is True, the function returns immediately and changes are reported by signaling this event, otherwise this parameter is ignored (Default).',
      },
    ],
  },
  _WinAPI_RegOpenKey: {
    documentation: 'Opens the specified registry key',
    label: "_WinAPI_RegOpenKey ( $vKey [, $sSubKey = '' [, $iAccess = $KEY_ALL_ACCESS]] )",
    params: [
      {
        label: '$vKey',
        documentation:
          'Name of the key to be open (see remarks). or Handle to an open registry key. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function, or it can be one of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_USERS',
      },
      {
        label: '$sSubKey',
        documentation: '**[optional]** The name of the registry subkey to be opened (see remarks).',
      },
      {
        label: '$iAccess',
        documentation:
          ' **[optional]** A mask that specifies the desired access rights to the key. The function fails if the security descriptor of the key does not permit the requested access for the calling process. This parameter can be one or more of the $KEY_* constants. Default is $KEY_ALL_ACCESS. This parameter can have also the following values for opening whatever AutoIt running mode: $KEY_WOW64_32KEY for an 32-bit Key $KEY_WOW64_64KEY for an 64-bit Key By Default the key correspond to the @AutoItX64 value unless overrided by $KEY_WOW64_32KEY.',
      },
    ],
  },
  _WinAPI_RegQueryInfoKey: {
    documentation: 'Retrieves information about the specified registry key',
    label: '_WinAPI_RegQueryInfoKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_QUERY_VALUE access right. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can also be one of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_PERFORMANCE_DATA $HKEY_USERS',
      },
    ],
  },
  _WinAPI_RegQueryLastWriteTime: {
    documentation: 'Retrieves information about the last write time to the specified registry key',
    label: '_WinAPI_RegQueryLastWriteTime ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_QUERY_VALUE access right. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can also be one of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_PERFORMANCE_DATA $HKEY_USERS',
      },
    ],
  },
  _WinAPI_RegQueryMultipleValues: {
    documentation:
      'Retrieves the type and data for a list of value names associated with an open registry key',
    label:
      '_WinAPI_RegQueryMultipleValues ( $hKey, ByRef $aValent, ByRef $pBuffer [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the KEY_QUERY_VALUE access right. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can also be one of the following predefined keys : $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_PERFORMANCE_DATA $HKEY_USERS',
      },
      {
        label: 'ByRef $aValent',
        documentation:
          'The 2D array ([valuename1, *, *, *], ... [valuenameN, *, *, *]) that contains a value names to be retrieved. On input, 1, 2, and 3 array elements are not used, but array dimensions should be [n][4], otherwise the function fails. Also, this function fails if any of the specified values do not exist in the specified registry key.',
      },
      {
        label: 'ByRef $pBuffer',
        documentation:
          'A pointer to a memory buffer that contains a registry data. Typically, you should not use this buffer directly (see remarks).',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start querying at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop querying at.',
      },
    ],
  },
  _WinAPI_RegQueryReflectionKey: {
    documentation:
      'Determines whether reflection has been disabled or enabled for the specified key',
    label: '_WinAPI_RegQueryReflectionKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function; it cannot specify a key on a remote computer. If the key is not on the reflection list, the function succeeds but has no effect.',
      },
    ],
  },
  _WinAPI_RegQueryValue: {
    documentation:
      'Retrieves the type and data for the specified value name associated with an open registry key',
    label: '_WinAPI_RegQueryValue ( $hKey, $sValueName, ByRef $tValueData )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the KEY_QUERY_VALUE access right. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can also be one of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_PERFORMANCE_DATA $HKEY_PERFORMANCE_NLSTEXT $HKEY_PERFORMANCE_TEXT $HKEY_USERS',
      },
      {
        label: '$sValueName',
        documentation:
          "The name of the registry value. If $sValueName is empty string, the function retrieves the type and data for the key's unnamed or default value, if any.",
      },
      {
        label: 'ByRef $tValueData',
        documentation:
          'The structure (buffer) that receives the value data. This structure must be created before function call.',
      },
    ],
  },
  _WinAPI_RegRestoreKey: {
    documentation:
      'Reads the registry information in a specified file and copies it over the specified key',
    label: '_WinAPI_RegRestoreKey ( $hKey, $sFilePath )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can also be one of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_USERS',
      },
      {
        label: '$sFilePath',
        documentation:
          'The name of the file with the registry information. This file is typically created by using the _WinAPI_RegSaveKey() function.',
      },
    ],
  },
  _WinAPI_RegSaveKey: {
    documentation:
      'Saves the specified key and all of its subkeys and values to a new file, in the standard format',
    label: '_WinAPI_RegSaveKey ( $hKey, $sFilePath [, $bReplace = False [, $tSecurity = 0]] )',
    params: [
      {
        label: '$hKey',
        documentation: 'Handle to an open registry key.',
      },
      {
        label: '$sFilePath',
        documentation:
          'The name of the file in which the specified key and subkeys are to be saved.',
      },
      {
        label: '$bReplace',
        documentation:
          '**[optional]** Specifies whether to replace the file if it already exists, valid values: True - The function attempts to replace the existing file. False - The function fails if the file already exists (Default).',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that specifies a security descriptor for the new file. If this parameter is 0 (Default), the file gets a default security descriptor.',
      },
    ],
  },
  _WinAPI_RegSetValue: {
    documentation: 'Sets the data and type of a specified value under a registry key',
    label: '_WinAPI_RegSetValue ( $hKey, $sValueName, $iType, $tValueData, $iBytes )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_SET_VALUE access right. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can also be one of the following predefined keys: $HKEY_CLASSES_ROOT $HKEY_CURRENT_CONFIG $HKEY_CURRENT_USER $HKEY_LOCAL_MACHINE $HKEY_PERFORMANCE_DATA $HKEY_USERS',
      },
      {
        label: '$sValueName',
        documentation:
          "The name of the value to be set. If a value with this name is not already present in the key, the function adds it to the key. If $sValueName is empty string, the function sets the type and data for the key's unnamed or default value.",
      },
      {
        label: '$iType',
        documentation:
          'The type of data. This parameter can be one of the following values : $REG_BINARY $REG_DWORD $REG_DWORD_BIG_ENDIAN $REG_DWORD_LITTLE_ENDIAN $REG_EXPAND_SZ $REG_LINK $REG_MULTI_SZ $REG_NONE $REG_QWORD $REG_QWORD_LITTLE_ENDIAN $REG_SZ',
      },
      {
        label: '$tValueData',
        documentation:
          'The structure (buffer) that contains the data to be stored. For string-based types, such as REG_SZ, the string must be null-terminated. With the REG_MULTI_SZ data type, the string must be terminated with two null characters. A backslash must be preceded by another backslash as an escape character. For example, specify "C\\mydir\\myfile" to store the string "C\\mydir\\myfile".',
      },
      {
        label: '$iBytes',
        documentation:
          'The size of the data, in bytes. If the data has the REG_SZ, REG_MULTI_SZ or REG_EXPAND_SZ type, this size includes any terminating null character or characters unless the data was stored without them.',
      },
    ],
  },
  _WinAPI_SfcIsKeyProtected: {
    documentation: 'Determines whether the specified registry key is protected',
    label: '_WinAPI_SfcIsKeyProtected ( $hKey [, $sSubKey = Default [, $iFlag = 0]] )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to the root registry key, it must be one of the following predefined keys:     $HKEY_CLASSES_ROOT     $HKEY_CURRENT_USER     $HKEY_LOCAL_MACHINE     $HKEY_USERS',
      },
      {
        label: '$sSubKey',
        documentation:
          '**[optional]** The name of the key to test. This key must be a subkey of the key identified by the $hKey parameter. If this parameter is not specified (Default), the function only checks whether the root registry key is protected.',
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** The flag that specifies the alternate registry view that should be used by applications that run on 64-bit Windows. This flag is ignored on the x86 platform. It can be one of the following values:     $KEY_WOW64_32KEY     $KEY_WOW64_64KEY',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
