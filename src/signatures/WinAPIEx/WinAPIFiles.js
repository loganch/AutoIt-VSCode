import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../../util';

const include = '(Requires: `#include <WinAPIFiles.au3>`)';

const signatures = {
  _WinAPI_BackupRead: {
    documentation: 'Backs up a file or directory, including the security information',
    label:
      '_WinAPI_BackupRead ( $hFile, $pBuffer, $iLength, ByRef $iBytes, ByRef $pContext [, $bSecurity = False] )',
    params: [
      {
        label: '$hFile',
        documentation:
          'Handle to the file or directory to be backed up. To obtain the handle, call the _WinAPI_CreateFileEx() function. The SACLs are not read unless the file handle was created with the $ACCESS_SYSTEM_SECURITY access right.',
      },
      {
        label: '$pBuffer',
        documentation: 'A pointer to a buffer that receives the data.',
      },
      {
        label: '$iLength',
        documentation:
          'The size of the buffer, in bytes. The buffer size must be greater than the size of the $tagWIN32_STREAM_ID structure. (see also MSDN for more information)',
      },
      {
        label: '$iBytes',
        documentation: 'The number of bytes read.',
      },
      {
        label: '$pContext',
        documentation:
          'A pointer to an internal data structure used by this function to maintain context information during a backup operation. You must set this variable to 0 before the first call to _WinAPI_BackupRead() for the specified file or directory. The function allocates memory for the data structure, and then sets the variable to point to that structure. You must not change this variable or the variable that it points to between calls to _WinAPI_BackupRead().',
      },
      {
        label: '$bSecurity',
        documentation:
          '**[optional]** Specifies whether the function will backup the access-control list (ACL) data, valid values: True - The ACL data will be backed up. False - The ACL data will be omitted (Default).',
      },
    ],
  },
  _WinAPI_BackupReadAbort: {
    documentation: 'Finishes the use of _WinAPI_BackupRead() on the handle',
    label: '_WinAPI_BackupReadAbort ( ByRef $pContext )',
    params: [
      {
        label: '$pContext',
        documentation:
          'A pointer to an internal data structure used by _WinAPI_BackupRead() function to maintain context information during a backup operation.',
      },
    ],
  },
  _WinAPI_BackupSeek: {
    documentation:
      'Seeks forward in a data stream initially accessed by using the _WinAPI_BackupRead() or _WinAPI_BackupWrite() function',
    label: '_WinAPI_BackupSeek ( $hFile, $iSeek, ByRef $iBytes, ByRef $pContext )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file or directory.',
      },
      {
        label: '$iSeek',
        documentation: 'The number of bytes to seek.',
      },
      {
        label: '$iBytes',
        documentation: 'The number of bytes the function actually seeks.',
      },
      {
        label: '$pContext',
        documentation:
          'A pointer to an internal data structure. This structure must be the same structure that was initialized by the _WinAPI_BackupRead(). An application must not touch the contents of this structure.',
      },
    ],
  },
  _WinAPI_BackupWrite: {
    documentation: 'Restore a file or directory that was backed up using _WinAPI_BackupRead()',
    label:
      '_WinAPI_BackupWrite ( $hFile, $pBuffer, $iLength, ByRef $iBytes, ByRef $pContext [, $bSecurity = False] )',
    params: [
      {
        label: '$hFile',
        documentation:
          'Handle to the file or directory to be restored. To obtain the handle, call the _WinAPI_CreateFileEx() function. The SACLs are not restored unless the file handle was created with the $ACCESS_SYSTEM_SECURITY access right. To ensure that the integrity ACEs are restored correctly, the file handle must also have been created with the $WRITE_OWNER access right.',
      },
      {
        label: '$pBuffer',
        documentation: 'A pointer to a buffer that the function writes data from.',
      },
      {
        label: '$iLength',
        documentation:
          'The size of the buffer, in bytes. The buffer size must be greater than the size of the $tagWIN32_STREAM_ID structure. (see MSDN for more information)',
      },
      {
        label: '$iBytes',
        documentation: 'The number of bytes written.',
      },
      {
        label: '$pContext',
        documentation:
          'A pointer to an internal data structure used by this function to maintain context information during a restore operation. You must set this variable to 0 before the first call to _WinAPI_BackupWrite() for the specified file or directory. The function allocates memory for the data structure, and then sets the variable to point to that structure. You must not change this variable or the variable that it points to between calls to _WinAPI_BackupWrite().',
      },
      {
        label: '$bSecurity',
        documentation:
          '**[optional]** Specifies whether the function will restore the access-control list (ACL) data, valid values: True - The ACL data will be restored. Furthermore, you need to specify $WRITE_OWNER and $WRITE_DAC access when opening the file or directory handle. If the handle does not have those access rights, the operating system denies access to the ACL data, and ACL data restoration will not occur. False - The ACL data will be omitted (Default).',
      },
    ],
  },
  _WinAPI_BackupWriteAbort: {
    documentation: 'Finishes the use of _WinAPI_BackupWrite() on the handle',
    label: '_WinAPI_BackupWriteAbort ( ByRef $pContext )',
    params: [
      {
        label: '$pContext',
        documentation:
          'A pointer to an internal data structure used by _WinAPI_BackupWrite() function to maintain context information during a restore operation.',
      },
    ],
  },
  _WinAPI_DefineDosDevice: {
    documentation: 'Defines, redefines, or deletes MS-DOS device names',
    label: "_WinAPI_DefineDosDevice ( $sDevice, $iFlags [, $sFilePath = ''] )",
    params: [
      {
        label: '$sDevice',
        documentation: 'The name of the MS-DOS device.',
      },
      {
        label: '$iFlags',
        documentation:
          'This parameter can be one or more of the following values.$DDD_EXACT_MATCH_ON_REMOVE$DDD_NO_BROADCAST_SYSTEM$DDD_RAW_TARGET_PATH$DDD_REMOVE_DEFINITION',
      },
      {
        label: '$sFilePath',
        documentation: '**[optional]** The path that will implement device.',
      },
    ],
  },
  _WinAPI_GetDriveType: {
    documentation:
      'Determines whether a disk drive is a removable, fixed, CD-ROM, RAM disk, or network drive',
    label: "_WinAPI_GetDriveType ( [$sDrive = ''] )",
    params: [
      {
        label: '$sDrive',
        documentation:
          '**[optional]** The drive letter to retrieve information, in the format D:, E:, etc.',
      },
    ],
  },
  _WinAPI_GetLogicalDrives: {
    documentation: 'Retrieves a bitmask representing the currently available disk drives',
    label: '_WinAPI_GetLogicalDrives ( )',
    params: [],
  },
  _WinAPI_GetPEType: {
    documentation: 'Retrieves a type of the machine for the specified portable executable (PE)',
    label: '_WinAPI_GetPEType ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The full path of the PE whose machine type is to be retrieved.',
      },
    ],
  },
  _WinAPI_QueryDosDevice: {
    documentation: 'Retrieves the current mapping for a particular MS-DOS device name',
    label: '_WinAPI_QueryDosDevice ( $sDevice )',
    params: [
      {
        label: '$sDevice',
        documentation: 'The name of the MS-DOS device.',
      },
    ],
  },
  _WinAPI_Wow64EnableWow64FsRedirection: {
    documentation: 'Enables or disables file system redirection for the calling thread',
    label: '_WinAPI_Wow64EnableWow64FsRedirection ( $bEnable )',
    params: [
      {
        label: '$bEnable',
        documentation:
          'Specifies whether enable or disable the WOW64 system folder redirection, valid values: True - Enable. False - Disable.',
      },
    ],
  },
  _WinAPI_CreateObjectID: {
    documentation: 'Creates or retrieves the object identifier for the specified file or directory',
    label: '_WinAPI_CreateObjectID ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Path to the file or directory to create or retrieve object identifier.',
      },
    ],
  },
  _WinAPI_DeleteObjectID: {
    documentation: 'Removes the object identifier from a specified file or directory',
    label: '_WinAPI_DeleteObjectID ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'Path to the file or directory from the object identifier that is to be deleted.',
      },
    ],
  },
  _WinAPI_DeviceIoControl: {
    documentation: 'Sends a control code directly to a specified device driver',
    label:
      '_WinAPI_DeviceIoControl ( $hDevice, $iControlCode [, $pInBuffer = 0 [, $iInBufferSize = 0 [, $pOutBuffer = 0 [, $iOutBufferSize = 0]]]] )',
    params: [
      {
        label: '$hDevice',
        documentation:
          'Handle to the device on which the operation is to be performed.The device is typically a volume, directory, file, or stream. To retrieve a device handle, use the _WinAPI_CreateFileEx() function.To specify a device name, use the following format: _WinAPI_CreateFileEx("\\\\.\\DeviceName", ...)',
      },
      {
        label: '$iControlCode',
        documentation:
          'The control code for the operation.This value identifies the specific operation to be performed and the type of device on which to perform it.',
      },
      {
        label: '$pInBuffer',
        documentation:
          '**[optional]** A pointer to the input buffer that contains the data required to perform the operation.',
      },
      {
        label: '$iInBufferSize',
        documentation: '**[optional]** The size of the input buffer, in bytes. Default is 0.',
      },
      {
        label: '$pOutBuffer',
        documentation:
          '**[optional]** A pointer to the output buffer that is to receive the data returned by the operation.',
      },
      {
        label: '$iOutBufferSize',
        documentation: '**[optional]** The size of the output buffer, in bytes. Default is 0.',
      },
    ],
  },
  _WinAPI_EjectMedia: {
    documentation: 'Ejects media from a device',
    label: '_WinAPI_EjectMedia ( $sDrive )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive letter of the CD tray to eject, in the format D:, E:, etc.',
      },
    ],
  },
  _WinAPI_GetCDType: {
    documentation: 'Retrieves a type of the media which is loaded into a specified CD-ROM device',
    label: '_WinAPI_GetCDType ( $sDrive )',
    params: [
      {
        label: '$sDrive',
        documentation:
          'The drive letter of the CD tray to retrieve information, in the format D:, E:, etc.',
      },
    ],
  },
  _WinAPI_GetDriveBusType: {
    documentation: 'Retrieves a bus type for the specified drive',
    label: '_WinAPI_GetDriveBusType ( $sDrive )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive letter to retrieve information, in the format D:, E:, etc.',
      },
    ],
  },
  _WinAPI_GetDriveGeometryEx: {
    documentation: "Retrieves extended information about the disk's geometry",
    label: '_WinAPI_GetDriveGeometryEx ( $iDrive )',
    params: [
      {
        label: '$iDrive',
        documentation: 'The drive number of the device to retrieve information.',
      },
    ],
  },
  _WinAPI_GetDriveNumber: {
    documentation:
      'Retrieves a device type, device number, and partition number for the specified drive',
    label: '_WinAPI_GetDriveNumber ( $sDrive )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive letter to retrieve information, in the format D:, E:, etc.',
      },
    ],
  },
  _WinAPI_GetObjectID: {
    documentation: 'Retrieves the object identifier for the specified file or directory',
    label: '_WinAPI_GetObjectID ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Path to the file or directory to retrieve object identifier.',
      },
    ],
  },
  _WinAPI_IOCTL: {
    documentation: 'Create a unique system I/O control code (IOCTL)',
    label: '_WinAPI_IOCTL ( $iDeviceType, $iFunction, $iMethod, $iAccess )',
    params: [
      {
        label: '$iDeviceType',
        documentation: 'The device type value.',
      },
      {
        label: '$iFunction',
        documentation: 'The function code value.',
      },
      {
        label: '$iMethod',
        documentation: 'The method value.',
      },
      {
        label: '$iAccess',
        documentation: 'The access value.',
      },
    ],
  },
  _WinAPI_IsDoorOpen: {
    documentation: 'Checks if a CD (DVD) tray is open',
    label: '_WinAPI_IsDoorOpen ( $sDrive )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive letter to check, in the format D:, E:, etc.',
      },
    ],
  },
  _WinAPI_IsWritable: {
    documentation: 'Determines whether a disk is writable',
    label: '_WinAPI_IsWritable ( $sDrive )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive letter to check, in the format D:, E:, etc.',
      },
    ],
  },
  _WinAPI_LoadMedia: {
    documentation: 'Loads media into a device',
    label: '_WinAPI_LoadMedia ( $sDrive )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive letter of the CD tray to load media, in the format D:, E:, etc.',
      },
    ],
  },
  _WinAPI_CopyFileEx: {
    documentation:
      'Copies an existing file to a new file, notifying the application of its progress through a callback function',
    label:
      '_WinAPI_CopyFileEx ( $sExistingFile, $sNewFile [, $iFlags = 0 [, $pProgressProc = 0 [, $pData = 0]]] )',
    params: [
      {
        label: '$sExistingFile',
        documentation: 'The name of an existing file.',
      },
      {
        label: '$sNewFile',
        documentation: 'The name of the new file.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specify how the file is to be copied. This parameter can be a combination of the following values: $COPY_FILE_ALLOW_DECRYPTED_DESTINATION (0x0008) $COPY_FILE_COPY_SYMLINK (0x0800) $COPY_FILE_FAIL_IF_EXISTS (0x0001) $COPY_FILE_NO_BUFFERING (0x1000) $COPY_FILE_OPEN_SOURCE_FOR_WRITE (0x0004) $COPY_FILE_RESTARTABLE (0x0002)',
      },
      {
        label: '$pProgressProc',
        documentation:
          '**[optional]** The address of a callback function that is called each time another portion of the file has been copied.(See MSDN for more information)',
      },
      {
        label: '$pData',
        documentation:
          '**[optional]** pointer to an argument to be passed to the callback function. Can be NULL.',
      },
    ],
  },
  _WinAPI_CreateDirectory: {
    documentation: 'Creates a new directory',
    label: '_WinAPI_CreateDirectory ( $sDir [, $tSecurity = 0] )',
    params: [
      {
        label: '$sDir',
        documentation: 'The path of the directory to be created.',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that contains the security attributes.',
      },
    ],
  },
  _WinAPI_CreateDirectoryEx: {
    documentation: 'Creates a new directory with the attributes of a specified template directory',
    label: '_WinAPI_CreateDirectoryEx ( $sNewDir, $sTemplateDir [, $tSecurity = 0] )',
    params: [
      {
        label: '$sNewDir',
        documentation: 'The path of the directory to be created.',
      },
      {
        label: '$sTemplateDir',
        documentation: 'The path of the directory to use as a template.',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that contains the security attributes.',
      },
    ],
  },
  _WinAPI_CreateFileEx: {
    documentation: 'Creates or opens a file or I/O device',
    label:
      '_WinAPI_CreateFileEx ( $sFilePath, $iCreation [, $iAccess = 0 [, $iShare = 0 [, $iFlagsAndAttributes = $SECURITY_ANONYMOUS [, $tSecurity = 0 [, $hTemplate = 0]]]]] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file or device to be created or opened.',
      },
      {
        label: '$iCreation',
        documentation:
          'The action to take on a file or device that exists or does not exist. This parameter must be one of the following values, which cannot be combined. $CREATE_NEW $CREATE_ALWAYS $OPEN_EXISTING $OPEN_ALWAYS $TRUNCATE_EXISTING',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The requested access to the file or device, which can be summarized as read, write, both or neither (zero) (Default). $GENERIC_READ $GENERIC_WRITE (See MSDN for more information)',
      },
      {
        label: '$iShare',
        documentation:
          '**[optional]** The requested sharing mode of the file or device, which can be read, write, both, delete, all of these, or none. If this parameter is 0 (Default) and _WinAPI_CreateFileEx() succeeds, the file or device cannot be shared and cannot be opened again until the handle to the file or device is closed. $FILE_SHARE_DELETE $FILE_SHARE_READ $FILE_SHARE_WRITE',
      },
      {
        label: '$iFlagsAndAttributes',
        documentation:
          '**[optional]** The file or device attributes and flags. This parameter can be one or more of the following values: $FILE_ATTRIBUTE_READONLY $FILE_ATTRIBUTE_HIDDEN $FILE_ATTRIBUTE_SYSTEM $FILE_ATTRIBUTE_DIRECTORY $FILE_ATTRIBUTE_ARCHIVE $FILE_ATTRIBUTE_DEVICE $FILE_ATTRIBUTE_NORMAL $FILE_ATTRIBUTE_TEMPORARY $FILE_ATTRIBUTE_SPARSE_FILE $FILE_ATTRIBUTE_REPARSE_POINT $FILE_ATTRIBUTE_COMPRESSED $FILE_ATTRIBUTE_OFFLINE $FILE_ATTRIBUTE_NOT_CONTENT_INDEXED $FILE_ATTRIBUTE_ENCRYPTED $FILE_FLAG_BACKUP_SEMANTICS $FILE_FLAG_DELETE_ON_CLOSE $FILE_FLAG_NO_BUFFERING $FILE_FLAG_OPEN_NO_RECALL $FILE_FLAG_OPEN_REPARSE_POINT $FILE_FLAG_OVERLAPPED $FILE_FLAG_POSIX_SEMANTICS $FILE_FLAG_RANDOM_ACCESS $FILE_FLAG_SEQUENTIAL_SCAN $FILE_FLAG_WRITE_THROUGH $SECURITY_ANONYMOUS (Default) $SECURITY_CONTEXT_TRACKING $SECURITY_DELEGATION $SECURITY_EFFECTIVE_ONLY $SECURITY_IDENTIFICATION $SECURITY_IMPERSONATION',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that contains two separate but related data members: an optional security descriptor, and a Boolean value that determines whether the returned handle can be inherited by child processes. If this parameter is 0 (Default), the handle cannot be inherited by any child processes the application may create and the file or device associated with the returned handle gets a default security descriptor.',
      },
      {
        label: '$hTemplate',
        documentation:
          '**[optional]** Handle to a template file with the $GENERIC_READ access right. The template file supplies file attributes and extended attributes for the file that is being created.',
      },
    ],
  },
  _WinAPI_CreateFileMapping: {
    documentation: 'Creates or opens a named or unnamed file mapping object for a specified file',
    label:
      "_WinAPI_CreateFileMapping ( $hFile [, $iSize = 0 [, $sName = '' [, $iProtect = 0x0004 [, $tSecurity = 0]]]] )",
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file from which to create a mapping object.',
      },
      {
        label: '$iSize',
        documentation: '**[optional]** The maximum size of the file mapping object.',
      },
      {
        label: '$sName',
        documentation: '**[optional]** The name of the file mapping object.',
      },
      {
        label: '$iProtect',
        documentation: '**[optional]** The protection of the file mapping object.',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that contains the security attributes.',
      },
    ],
  },
  _WinAPI_CreateHardLink: {
    documentation: 'Establishes a hard link between an existing file and a new file',
    label: '_WinAPI_CreateHardLink ( $sNewFile, $sExistingFile )',
    params: [
      {
        label: '$sNewFile',
        documentation: 'The name of the new hard link.',
      },
      {
        label: '$sExistingFile',
        documentation: 'The name of an existing file.',
      },
    ],
  },
  _WinAPI_CreateSymbolicLink: {
    documentation: 'Creates a symbolic link',
    label: '_WinAPI_CreateSymbolicLink ( $sSymlink, $sTarget [, $bDirectory = False] )',
    params: [
      {
        label: '$sSymlink',
        documentation: 'The name of the symbolic link to be created.',
      },
      {
        label: '$sTarget',
        documentation: 'The name of the file or directory that the link points to.',
      },
      {
        label: '$bDirectory',
        documentation:
          '**[optional]** Specifies whether the link is a directory. False - The link is a file (Default). True - The link is a directory.',
      },
    ],
  },
  _WinAPI_DecryptFile: {
    documentation: 'Decrypts an encrypted file or directory',
    label: '_WinAPI_DecryptFile ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the file or directory to be decrypted.',
      },
    ],
  },
  _WinAPI_DeleteFile: {
    documentation: 'Deletes an existing file',
    label: '_WinAPI_DeleteFile ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file to be deleted.',
      },
    ],
  },
  _WinAPI_DeleteVolumeMountPoint: {
    documentation: 'Deletes a drive letter or mounted folder',
    label: '_WinAPI_DeleteVolumeMountPoint ( $sMountedPath )',
    params: [
      {
        label: '$sMountedPath',
        documentation: 'The mount point to be deleted.',
      },
    ],
  },
  _WinAPI_DuplicateEncryptionInfoFile: {
    documentation: 'Copies the EFS metadata from one file or directory to another',
    label:
      '_WinAPI_DuplicateEncryptionInfoFile ( $sSrcFilePath, $sDestFilePath [, $iCreation = 2 [, $iAttributes = 0 [, $tSecurity = 0]]] )',
    params: [
      {
        label: '$sSrcFilePath',
        documentation: 'The name of the source file.',
      },
      {
        label: '$sDestFilePath',
        documentation: 'The name of the destination file.',
      },
      {
        label: '$iCreation',
        documentation: '**[optional]** The creation mode for the destination file.',
      },
      {
        label: '$iAttributes',
        documentation: '**[optional]** The attributes for the destination file.',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that contains the security attributes.',
      },
    ],
  },
  _WinAPI_EncryptFile: {
    documentation: 'Encrypts a file or directory',
    label: '_WinAPI_EncryptFile ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the file or directory to be encrypted.',
      },
    ],
  },
  _WinAPI_EncryptionDisable: {
    documentation: 'Disables or enables encryption of the specified directory and the files in it',
    label: '_WinAPI_EncryptionDisable ( $sDir, $bDisable )',
    params: [
      {
        label: '$sDir',
        documentation: 'The path to the directory to disable encryption.',
      },
      {
        label: '$bDisable',
        documentation:
          'Specifies whether to disable encryption. True - Disable encryption. False - Enable encryption.',
      },
    ],
  },
  _WinAPI_EnumFiles: {
    documentation:
      'Enumerates the files and subdirectories for the specified directory with a name that matches the template',
    label: "_WinAPI_EnumFiles ( $sDir [, $iFlag = 0 [, $sTemplate = '' [, $bExclude = False]]] )",
    params: [
      {
        label: '$sDir',
        documentation: 'The directory to enumerate files.',
      },
      {
        label: '$iFlag',
        documentation: '**[optional]** The search flags.',
      },
      {
        label: '$sTemplate',
        documentation: '**[optional]** The search template.',
      },
      {
        label: '$bExclude',
        documentation:
          '**[optional]** Specifies whether to exclude the directory itself from the results.',
      },
    ],
  },
  _WinAPI_EnumFileStreams: {
    documentation:
      'Enumerates all streams with a ::$DATA stream type in the specified file or directory',
    label: '_WinAPI_EnumFileStreams ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file or directory to enumerate streams.',
      },
    ],
  },
  _WinAPI_EnumHardLinks: {
    documentation: 'Enumerates all the hard links to the specified file',
    label: '_WinAPI_EnumHardLinks ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file to enumerate hard links.',
      },
    ],
  },
  _WinAPI_FileEncryptionStatus: {
    documentation: 'Retrieves the encryption status of the specified file',
    label: '_WinAPI_FileEncryptionStatus ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file to retrieve encryption status.',
      },
    ],
  },
  _WinAPI_FileExists: {
    documentation: 'Tests whether the specified path is existing file',
    label: '_WinAPI_FileExists ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to test.',
      },
    ],
  },
  _WinAPI_FileInUse: {
    documentation: 'Tests whether the specified file in use by another application',
    label: '_WinAPI_FileInUse ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file to test.',
      },
    ],
  },
  _WinAPI_FindClose: {
    documentation: 'Closes a file search handle',
    label: '_WinAPI_FindClose ( $hSearch )',
    params: [
      {
        label: '$hSearch',
        documentation: 'The search handle returned by _WinAPI_FindFirstFile.',
      },
    ],
  },
  _WinAPI_FindCloseChangeNotification: {
    documentation: 'Stops change notification handle monitoring',
    label: '_WinAPI_FindCloseChangeNotification ( $hChange )',
    params: [
      {
        label: '$hChange',
        documentation:
          'The change notification handle returned by _WinAPI_FindFirstChangeNotification.',
      },
    ],
  },
  _WinAPI_FindFirstChangeNotification: {
    documentation:
      'Creates a change notification handle and sets up initial change notification filter conditions',
    label: '_WinAPI_FindFirstChangeNotification ( $sDirectory, $iFlags [, $bSubtree = False] )',
    params: [
      {
        label: '$sDirectory',
        documentation: 'The name of the directory to monitor.',
      },
      {
        label: '$iFlags',
        documentation: 'The filter criteria.',
      },
      {
        label: '$bSubtree',
        documentation: '**[optional]** Specifies whether to monitor the directory tree.',
      },
    ],
  },
  _WinAPI_FindFirstFile: {
    documentation:
      'Searches a directory for a file or subdirectory with a name that matches a specific name',
    label: '_WinAPI_FindFirstFile ( $sFilePath, $tData )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file or directory to search.',
      },
      {
        label: '$tData',
        documentation: '$tagWIN32_FIND_DATA structure that receives file information.',
      },
    ],
  },
  _WinAPI_FindFirstFileName: {
    documentation: 'Creates an enumeration of all the hard links to the specified file',
    label: '_WinAPI_FindFirstFileName ( $sFilePath, ByRef $sLink )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file to find hard links.',
      },
      {
        label: '$sLink',
        documentation: 'The name of the first hard link found.',
      },
    ],
  },
  _WinAPI_FindFirstStream: {
    documentation:
      'Enumerates the first stream with a ::$DATA stream type in the specified file or directory',
    label: '_WinAPI_FindFirstStream ( $sFilePath, $tData )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file or directory to enumerate streams.',
      },
      {
        label: '$tData',
        documentation: '$tagWIN32_FIND_STREAM_DATA structure that receives stream information.',
      },
    ],
  },
  _WinAPI_FindNextChangeNotification: {
    documentation:
      'Requests that the operating system signal a change notification handle the next time it detects an appropriate change',
    label: '_WinAPI_FindNextChangeNotification ( $hChange )',
    params: [
      {
        label: '$hChange',
        documentation:
          'The change notification handle returned by _WinAPI_FindFirstChangeNotification.',
      },
    ],
  },
  _WinAPI_FindNextFile: {
    documentation: 'Continues a file or directory search',
    label: '_WinAPI_FindNextFile ( $hSearch, $tData )',
    params: [
      {
        label: '$hSearch',
        documentation: 'The search handle returned by _WinAPI_FindFirstFile.',
      },
      {
        label: '$tData',
        documentation: '$tagWIN32_FIND_DATA structure that receives file information.',
      },
    ],
  },
  _WinAPI_FindNextFileName: {
    documentation: 'Continues enumerating the hard links',
    label: '_WinAPI_FindNextFileName ( $hSearch, ByRef $sLink )',
    params: [
      {
        label: '$hSearch',
        documentation: 'The search handle returned by _WinAPI_FindFirstFileName.',
      },
      {
        label: '$sLink',
        documentation: 'The name of the next hard link found.',
      },
    ],
  },
  _WinAPI_FindNextStream: {
    documentation: 'Continues a stream search',
    label: '_WinAPI_FindNextStream ( $hSearch, $tData )',
    params: [
      {
        label: '$hSearch',
        documentation: 'The search handle returned by _WinAPI_FindFirstStream.',
      },
      {
        label: '$tData',
        documentation: '$tagWIN32_FIND_STREAM_DATA structure that receives stream information.',
      },
    ],
  },
  _WinAPI_FlushViewOfFile: {
    documentation: 'Writes to the disk a byte range within a mapped view of a file',
    label: '_WinAPI_FlushViewOfFile ( $pAddress [, $iBytes = 0] )',
    params: [
      {
        label: '$pAddress',
        documentation: 'The starting address of the byte range to flush.',
      },
      {
        label: '$iBytes',
        documentation: '**[optional]** The number of bytes to flush.',
      },
    ],
  },
  _WinAPI_GetBinaryType: {
    documentation:
      'Determines whether a file is an executable (.exe) file, and if so, which subsystem runs the executable file',
    label: '_WinAPI_GetBinaryType ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file whose binary type is to be determined.',
      },
    ],
  },
  _WinAPI_GetCompressedFileSize: {
    documentation:
      'Retrieves the actual number of bytes of disk storage used to store a specified file',
    label: '_WinAPI_GetCompressedFileSize ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file.',
      },
    ],
  },
  _WinAPI_GetCompression: {
    documentation: 'Retrieves the current compression state of a file or directory',
    label: '_WinAPI_GetCompression ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file or directory.',
      },
    ],
  },
  _WinAPI_GetCurrentDirectory: {
    documentation: 'Retrieves the current directory for the current process',
    label: '_WinAPI_GetCurrentDirectory ( )',
    params: [],
  },
  _WinAPI_GetDiskFreeSpaceEx: {
    documentation:
      'Retrieves information about the amount of space that is available on a disk volume',
    label: '_WinAPI_GetDiskFreeSpaceEx ( $sDrive )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive to get information.',
      },
    ],
  },
  _WinAPI_GetFileAttributes: {
    documentation: 'Retrieves file system attributes for a specified file or directory',
    label: '_WinAPI_GetFileAttributes ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file or directory.',
      },
    ],
  },
  _WinAPI_GetFileID: {
    documentation: "Retrieves the file system's 8-byte file reference number for a file",
    label: '_WinAPI_GetFileID ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
    ],
  },
  _WinAPI_GetFileInformationByHandle: {
    documentation: 'Retrieves file information for the specified file',
    label: '_WinAPI_GetFileInformationByHandle ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
    ],
  },
  _WinAPI_GetFileInformationByHandleEx: {
    documentation: 'Retrieves file information for the specified file',
    label: '_WinAPI_GetFileInformationByHandleEx ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
    ],
  },
  _WinAPI_GetFilePointerEx: {
    documentation: 'Retrieves the file pointer of the specified file',
    label: '_WinAPI_GetFilePointerEx ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
    ],
  },
  _WinAPI_GetFileSizeOnDisk: {
    documentation: 'Retrieves the file allocation size on disk',
    label: '_WinAPI_GetFileSizeOnDisk ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file.',
      },
    ],
  },
  _WinAPI_GetFileTitle: {
    documentation: 'Retrieves the name of the specified file',
    label: '_WinAPI_GetFileTitle ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file.',
      },
    ],
  },
  _WinAPI_GetFileType: {
    documentation: 'Retrieves the file type of the specified file',
    label: '_WinAPI_GetFileType ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
    ],
  },
  _WinAPI_GetFinalPathNameByHandle: {
    documentation: 'Retrieves the final path of the specified file',
    label: '_WinAPI_GetFinalPathNameByHandle ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
    ],
  },
  _WinAPI_GetFinalPathNameByHandleEx: {
    documentation: 'Retrieves the final path of the specified file',
    label: '_WinAPI_GetFinalPathNameByHandleEx ( $hFile [, $iFlags = 0] )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
      {
        label: '$iFlags',
        documentation: '**[optional]** The format of the path.',
      },
    ],
  },
  _WinAPI_GetFullPathName: {
    documentation: 'Retrieves the full path and file name of the specified file',
    label: '_WinAPI_GetFullPathName ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file.',
      },
    ],
  },
  _WinAPI_GetProfilesDirectory: {
    documentation: 'Retrieves the path to the root directory where user profiles are stored',
    label: '_WinAPI_GetProfilesDirectory ( )',
    params: [],
  },
  _WinAPI_GetTempFileName: {
    documentation: 'Creates a name for a temporary file',
    label: "_WinAPI_GetTempFileName ( $sFilePath [, $sPrefix = ''] )",
    params: [
      {
        label: '$sFilePath',
        documentation: 'The directory that will contain the temporary file.',
      },
      {
        label: '$sPrefix',
        documentation: '**[optional]** The string to use for the temporary file name.',
      },
    ],
  },
  _WinAPI_GetVolumeInformation: {
    documentation:
      'Retrieves information about the file system and volume associated with the specified root directory',
    label: "_WinAPI_GetVolumeInformation ( [$sRoot = ''] )",
    params: [
      {
        label: '$sRoot',
        documentation: '**[optional]** The root directory.',
      },
    ],
  },
  _WinAPI_GetVolumeInformationByHandle: {
    documentation:
      'Retrieves information about the file system and volume associated with the specified file',
    label: '_WinAPI_GetVolumeInformationByHandle ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
    ],
  },
  _WinAPI_GetVolumeNameForVolumeMountPoint: {
    documentation:
      'Retrieves a volume GUID path for the volume that is associated with the specified volume mount point',
    label: '_WinAPI_GetVolumeNameForVolumeMountPoint ( $sMountedPath )',
    params: [
      {
        label: '$sMountedPath',
        documentation: 'The volume mount point.',
      },
    ],
  },
  _WinAPI_IsPathShared: {
    documentation: 'Determines whether the path is shared',
    label: '_WinAPI_IsPathShared ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file or directory.',
      },
    ],
  },
  _WinAPI_LockDevice: {
    documentation:
      'Enables or disables the mechanism that ejects media, for those devices possessing that locking capability',
    label: '_WinAPI_LockDevice ( $sDrive, $bLock )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive letter of the device to lock/unlock.',
      },
      {
        label: '$bLock',
        documentation: 'Specifies whether to lock or unlock the device.',
      },
    ],
  },
  _WinAPI_LockFile: {
    documentation: 'Locks the specified file for exclusive access by the calling process',
    label: '_WinAPI_LockFile ( $hFile, $iOffset, $iLength )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
      {
        label: '$iOffset',
        documentation: 'The starting byte offset for the lock.',
      },
      {
        label: '$iLength',
        documentation: 'The length of the byte range to lock.',
      },
    ],
  },
  _WinAPI_MapViewOfFile: {
    documentation: 'Maps a view of a file mapping into the address space of a calling process',
    label:
      '_WinAPI_MapViewOfFile ( $hMapping [, $iOffset = 0 [, $iBytes = 0 [, $iAccess = 0x0006]]] )',
    params: [
      {
        label: '$hMapping',
        documentation: 'Handle to the file mapping.',
      },
      {
        label: '$iOffset',
        documentation: '**[optional]** The file offset where the view begins.',
      },
      {
        label: '$iBytes',
        documentation: '**[optional]** The number of bytes of the view to map.',
      },
      {
        label: '$iAccess',
        documentation: '**[optional]** The access to the file view.',
      },
    ],
  },
  _WinAPI_MoveFileEx: {
    documentation:
      'Moves a file or directory, notifying the application of its progress through a callback function',
    label:
      '_WinAPI_MoveFileEx ( $sExistingFile, $sNewFile [, $iFlags = 0 [, $pProgressProc = 0 [, $pData = 0]]] )',
    params: [
      {
        label: '$sExistingFile',
        documentation: 'The name of the existing file or directory.',
      },
      {
        label: '$sNewFile',
        documentation: 'The new name of the file or directory.',
      },
      {
        label: '$iFlags',
        documentation: '**[optional]** The move options.',
      },
      {
        label: '$pProgressProc',
        documentation: '**[optional]** The address of a callback function.',
      },
      {
        label: '$pData',
        documentation: '**[optional]** Data to be passed to the callback function.',
      },
    ],
  },
  _WinAPI_OpenFileById: {
    documentation: 'Opens the file that matches the specified object identifier',
    label: '_WinAPI_OpenFileById ( $hFile, $vID [, $iAccess = 0 [, $iShare = 0 [, $iFlags = 0]]] )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file or directory.',
      },
      {
        label: '$vID',
        documentation: 'The object identifier to open.',
      },
      {
        label: '$iAccess',
        documentation: '**[optional]** The requested access to the file.',
      },
      {
        label: '$iShare',
        documentation: '**[optional]** The sharing mode of the file.',
      },
      {
        label: '$iFlags',
        documentation: '**[optional]** The file attributes and flags.',
      },
    ],
  },
  _WinAPI_OpenFileMapping: {
    documentation: 'Opens a named file mapping object',
    label: '_WinAPI_OpenFileMapping ( $sName [, $iAccess = 0x0006 [, $bInherit = False]] )',
    params: [
      {
        label: '$sName',
        documentation: 'The name of the file mapping object.',
      },
      {
        label: '$iAccess',
        documentation: '**[optional]** The access to the file mapping object.',
      },
      {
        label: '$bInherit',
        documentation: '**[optional]** Specifies whether the returned handle can be inherited.',
      },
    ],
  },
  _WinAPI_PathIsDirectory: {
    documentation: 'Verifies that a path is a valid directory',
    label: '_WinAPI_PathIsDirectory ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to test.',
      },
    ],
  },
  _WinAPI_PathIsDirectoryEmpty: {
    documentation: 'Determines whether a specified path is an empty directory',
    label: '_WinAPI_PathIsDirectoryEmpty ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to test.',
      },
    ],
  },
  _WinAPI_ReadDirectoryChanges: {
    documentation:
      'Retrieves information that describes the changes within the specified directory',
    label:
      '_WinAPI_ReadDirectoryChanges ( $hDirectory, $iFilter, $pBuffer, $iLength [, $bSubtree = 0] )',
    params: [
      {
        label: '$hDirectory',
        documentation: 'Handle to the directory.',
      },
      {
        label: '$iFilter',
        documentation: 'The filter criteria.',
      },
      {
        label: '$pBuffer',
        documentation: 'Pointer to the buffer that receives the read results.',
      },
      {
        label: '$iLength',
        documentation: 'The size of the buffer.',
      },
      {
        label: '$bSubtree',
        documentation: '**[optional]** Specifies whether to monitor the directory tree.',
      },
    ],
  },
  _WinAPI_RemoveDirectory: {
    documentation: 'Deletes an existing empty directory',
    label: '_WinAPI_RemoveDirectory ( $sDirPath )',
    params: [
      {
        label: '$sDirPath',
        documentation: 'The path to the directory to be removed.',
      },
    ],
  },
  _WinAPI_ReOpenFile: {
    documentation:
      'Reopens the specified file system object with different access rights, sharing mode, and flags',
    label: '_WinAPI_ReOpenFile ( $hFile, $iAccess, $iShare [, $iFlags = 0] )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
      {
        label: '$iAccess',
        documentation: 'The access mode.',
      },
      {
        label: '$iShare',
        documentation: 'The sharing mode.',
      },
      {
        label: '$iFlags',
        documentation: '**[optional]** The flags.',
      },
    ],
  },
  _WinAPI_ReplaceFile: {
    documentation:
      'Replaces one file with another file, and creates a backup copy of the original file',
    label:
      "_WinAPI_ReplaceFile ( $sReplacedFile, $sReplacementFile [, $sBackupFile = '' [, $iFlags = 0]] )",
    params: [
      {
        label: '$sReplacedFile',
        documentation: 'The name of the file to be replaced.',
      },
      {
        label: '$sReplacementFile',
        documentation: 'The name of the file that will replace the existing file.',
      },
      {
        label: '$sBackupFile',
        documentation: '**[optional]** The name of the backup file.',
      },
      {
        label: '$iFlags',
        documentation: '**[optional]** The replacement options.',
      },
    ],
  },
  _WinAPI_SearchPath: {
    documentation: 'Searches for a specified file in a specified path',
    label: "_WinAPI_SearchPath ( $sFilePath [, $sSearchPath = ''] )",
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file to search for.',
      },
      {
        label: '$sSearchPath',
        documentation: '**[optional]** The path to search.',
      },
    ],
  },
  _WinAPI_SetCompression: {
    documentation: 'Sets the compression state of a file or directory',
    label: '_WinAPI_SetCompression ( $sFilePath, $iCompression )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file or directory.',
      },
      {
        label: '$iCompression',
        documentation: 'The compression state.',
      },
    ],
  },
  _WinAPI_SetCurrentDirectory: {
    documentation: 'Changes the current directory for the current process',
    label: '_WinAPI_SetCurrentDirectory ( $sDir )',
    params: [
      {
        label: '$sDir',
        documentation: 'The new current directory.',
      },
    ],
  },
  _WinAPI_SetFileAttributes: {
    documentation: 'Sets the attributes for a file or directory',
    label: '_WinAPI_SetFileAttributes ( $sFilePath, $iAttributes )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file or directory.',
      },
      {
        label: '$iAttributes',
        documentation: 'The file attributes.',
      },
    ],
  },
  _WinAPI_SetFileInformationByHandleEx: {
    documentation: 'Sets the file information for the specified file',
    label: '_WinAPI_SetFileInformationByHandleEx ( $hFile, $tFILEINFO )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
      {
        label: '$tFILEINFO',
        documentation:
          '$tagFILE_INFO_BY_HANDLE_CLASS structure that contains the file information.',
      },
    ],
  },
  _WinAPI_SetFilePointerEx: {
    documentation: 'Moves the file pointer of the specified file',
    label: '_WinAPI_SetFilePointerEx ( $hFile, $iPos [, $iMethod = 0] )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
      {
        label: '$iPos',
        documentation: 'The new file pointer position.',
      },
      {
        label: '$iMethod',
        documentation: '**[optional]** The starting point for the file pointer move.',
      },
    ],
  },
  _WinAPI_SetFileShortName: {
    documentation: 'Sets the short name for the specified file',
    label: '_WinAPI_SetFileShortName ( $hFile, $sShortName )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
      {
        label: '$sShortName',
        documentation: 'The short name for the file.',
      },
    ],
  },
  _WinAPI_SetFileValidData: {
    documentation: 'Sets the valid data length of the specified file',
    label: '_WinAPI_SetFileValidData ( $hFile, $iLength )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
      {
        label: '$iLength',
        documentation: 'The valid data length.',
      },
    ],
  },
  _WinAPI_SetSearchPathMode: {
    documentation:
      'Sets the per-process mode that the _WinAPI_SearchPath() function uses when locating files',
    label: '_WinAPI_SetSearchPathMode ( $iFlags )',
    params: [
      {
        label: '$iFlags',
        documentation: 'The search path mode flags.',
      },
    ],
  },
  _WinAPI_SetVolumeMountPoint: {
    documentation: 'Associates a volume with a drive letter or a directory on another volume',
    label: '_WinAPI_SetVolumeMountPoint ( $sFilePath, $sGUID )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The mount point to associate with the volume.',
      },
      {
        label: '$sGUID',
        documentation: 'The volume GUID path.',
      },
    ],
  },
  _WinAPI_SfcIsFileProtected: {
    documentation: 'Determines whether the specified file is protected',
    label: '_WinAPI_SfcIsFileProtected ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file to check.',
      },
    ],
  },
  _WinAPI_UnlockFile: {
    documentation: 'Unlocks a region in an open file',
    label: '_WinAPI_UnlockFile ( $hFile, $iOffset, $iLength )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
      {
        label: '$iOffset',
        documentation: 'The starting byte offset for the lock.',
      },
      {
        label: '$iLength',
        documentation: 'The length of the byte range to lock.',
      },
    ],
  },
  _WinAPI_UnmapViewOfFile: {
    documentation: "Unmaps a mapped view of a file from the calling process's address space",
    label: '_WinAPI_UnmapViewOfFile ( $pAddress )',
    params: [
      {
        label: '$pAddress',
        documentation: 'The starting address of the mapped view.',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
