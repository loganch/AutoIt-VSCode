import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <Crypt.au3>`)';

const signatures = {
  _Crypt_DecryptData: {
    documentation: 'Decrypts data using the supplied key',
    label: '_Crypt_DecryptData ( $vData, $vCryptKey, $iAlgID [, $bFinal = True] )',
    params: [
      {
        label: '$vData',
        documentation: 'Data to decrypt',
      },
      {
        label: '$vCryptKey',
        documentation: 'Password or handle to a key if the CALG_USERKEY flag is specified',
      },
      {
        label: '$iAlgID',
        documentation: 'The algorithm to use',
      },
      {
        label: '$bFinal',
        documentation: '**[optional]** False if this is only a segment of the full data',
      },
    ],
  },
  _Crypt_DecryptFile: {
    documentation: 'Decrypts a file with specified key and algorithm',
    label: '_Crypt_DecryptFile ( $sSourceFile, $sDestinationFile, $vCryptKey, $iAlgID )',
    params: [
      {
        label: '$sSourceFile',
        documentation: 'File to process',
      },
      {
        label: '$sDestinationFile',
        documentation: 'File to save the processed file',
      },
      {
        label: '$vCryptKey',
        documentation: 'Password or handle to a key if the CALG_USERKEY flag is specified',
      },
      {
        label: '$iAlgID',
        documentation: 'The algorithm to use',
      },
    ],
  },
  _Crypt_DeriveKey: {
    documentation: 'Creates a key from algorithm and password',
    label: '_Crypt_DeriveKey ( $vPassword, $iAlgID [, $iHashAlgID = $CALG_MD5] )',
    params: [
      {
        label: '$vPassword',
        documentation: 'Password to use',
      },
      {
        label: '$iAlgID',
        documentation: 'Encryption ID of algorithm to be used with the key',
      },
      {
        label: '$iHashAlgID',
        documentation: '**[optional]** Id of the algo to hash the password with',
      },
    ],
  },
  _Crypt_DestroyKey: {
    documentation: 'Frees the resources used by a key',
    label: '_Crypt_DestroyKey ( $hCryptKey )',
    params: [
      {
        label: '$hCryptKey',
        documentation: 'Key to destroy',
      },
    ],
  },
  _Crypt_EncryptData: {
    documentation: 'Encrypts data using the supplied key',
    label: '_Crypt_EncryptData ( $vData, $vCryptKey, $iAlgID [, $bFinal = True] )',
    params: [
      {
        label: '$vData',
        documentation: 'Data to encrypt/decrypt',
      },
      {
        label: '$vCryptKey',
        documentation: 'Password or handle to a key if the CALG_USERKEY flag is specified',
      },
      {
        label: '$iAlgID',
        documentation: 'The algorithm to use',
      },
      {
        label: '$bFinal',
        documentation: '**[optional]** False if this is only a segment of the full data',
      },
    ],
  },
  _Crypt_EncryptFile: {
    documentation: 'Encrypts a file with specified key and algorithm',
    label: '_Crypt_EncryptFile ( $sSourceFile, $sDestinationFile, $vCryptKey, $iAlgID )',
    params: [
      {
        label: '$sSourceFile',
        documentation: 'File to process',
      },
      {
        label: '$sDestinationFile',
        documentation: 'File to save the processed file',
      },
      {
        label: '$vCryptKey',
        documentation: 'Password or handle to a key if the CALG_USERKEY flag is specified',
      },
      {
        label: '$iAlgID',
        documentation: 'The algorithm to use',
      },
    ],
  },
  _Crypt_GenRandom: {
    documentation: 'Fill a buffer with cryptographically random data',
    label: '_Crypt_GenRandom ( $pBuffer, $iSize )',
    params: [
      {
        label: '$pBuffer',
        documentation: 'Pointer to buffer to fill with random data.',
      },
      {
        label: '$iSize',
        documentation: 'Size of the buffer pointed to by $pBuffer.',
      },
    ],
  },
  _Crypt_HashData: {
    documentation: 'Hash data with specified algorithm',
    label: '_Crypt_HashData ( $vData, $iAlgID [, $bFinal = True [, $hCryptHash = 0]] )',
    params: [
      {
        label: '$vData',
        documentation: 'Data to hash',
      },
      {
        label: '$iAlgID',
        documentation: 'Hash ID to use',
      },
      {
        label: '$bFinal',
        documentation:
          '**[optional]** False if this is only a segment of the full data, also makes the function return a hash object instead of hash',
      },
      {
        label: '$hCryptHash',
        documentation:
          '**[optional]** Hash object returned from a previous call to _Crypt_HashData()',
      },
    ],
  },
  _Crypt_HashFile: {
    documentation: 'Hash a string with specified algorithm',
    label: '_Crypt_HashFile ( $sFilePath, $iAlgID )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Path to file to hash',
      },
      {
        label: '$iAlgID',
        documentation: 'Hash ID to use',
      },
    ],
  },
  _Crypt_Shutdown: {
    documentation: 'Uninitialize the Crypt library',
    label: '_Crypt_Shutdown (  )',
    params: [],
  },
  _Crypt_Startup: {
    documentation: 'Initialize the Crypt library',
    label: '_Crypt_Startup (  )',
    params: [],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
