import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <IE.au3>`)';

const signatures = {
  _IEAction: {
    documentation: 'Perform any of a set of simple actions on the Browser',
    label: '_IEAction ( ByRef $oObject, $sAction )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application',
      },
      {
        label: '$sAction',
        documentation: 'Action selection (see remarks)',
      },
    ],
  },
  _IEAttach: {
    documentation:
      'Attach to the specified instance of Internet Explorer where the search string sub-string matches (based on the selected mode)',
    label: '_IEAttach ( $sString [, $sMode = "title" [, $iInstance = 1]] )',
    params: [
      {
        label: '$sString',
        documentation:
          'String to search for (for "embedded" or "dialogbox", use Title sub-string or HWND of window)',
      },
      {
        label: '$sMode',
        documentation:
          '**[optional]** specifies search mode    "title" = (Default) sub-string of main document title    "windowtitle" = sub-string of full window title (instead of document title)    "url" = sub-string or url of the current page    "text" = sub-string in text from the body of the current page    "html" = sub-string in html from the body of the current page    "hwnd" = hwnd of the browser window    "embedded" = title sub-string or hwnd of the window embedding the control    "dialogbox" = title sub-string or hwnd of modal/modeless dialogbox    "instance" = $sString is ignored, one browser reference returned (by matching instance number) from all available browser instances',
      },
      {
        label: '$iInstance',
        documentation:
          '**[optional]** 1-based index into group of browsers or embedded browsers matching $sString and $sMode. See Remarks.',
      },
    ],
  },
  _IEBodyReadHTML: {
    documentation: 'Returns the HTML inside the <body> tag of the document',
    label: '_IEBodyReadHTML ( ByRef $oObject )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
    ],
  },
  _IEBodyReadText: {
    documentation: 'Returns the Text inside the <body> tag of the document',
    label: '_IEBodyReadText ( ByRef $oObject )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
    ],
  },
  _IEBodyWriteHTML: {
    documentation: 'Replaces the HTML inside the <body> tag of the document',
    label: '_IEBodyWriteHTML ( ByRef $oObject, $sHTML )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
      {
        label: '$sHTML',
        documentation: 'The HTML string to write to the document',
      },
    ],
  },
  _IECreate: {
    documentation: 'Create an Internet Explorer Browser Window',
    label:
      '_IECreate ( [$sUrl = "about:blank" [, $iTryAttach = 0 [, $iVisible = 1 [, $iWait = 1 [, $iTakeFocus = 1]]]]] )',
    params: [
      {
        label: '$sUrl',
        documentation: '**[optional]** specifies the Url to navigate to upon creation',
      },
      {
        label: '$iTryAttach',
        documentation:
          '**[optional]** specifies whether to try to attach to an existing window    0 = (Default) do not try to attach    1 = Try to attach to an existing window',
      },
      {
        label: '$iVisible',
        documentation:
          '**[optional]** specifies whether the browser window will be visible    0 = Browser Window is hidden    1 = (Default) Browser Window is visible',
      },
      {
        label: '$iWait',
        documentation:
          '**[optional]** specifies whether to wait for page to load before returning    0 = Return immediately, not waiting for page to load    1 = (Default) Wait for page load to complete before returning',
      },
      {
        label: '$iTakeFocus',
        documentation:
          '**[optional]** specifies whether to bring the attached window to focus    0 = Do not bring window into focus    1 = (Default) bring window into focus',
      },
    ],
  },
  _IECreateEmbedded: {
    documentation:
      'Create a Webbrowser object suitable for embedding in an AutoIt GUI with GUICtrlCreateObj()',
    label: '_IECreateEmbedded (  )',
    params: [],
  },
  _IEDocGetObj: {
    documentation: 'Given any DOM object, returns a reference to the associated document object',
    label: '_IEDocGetObj ( ByRef $oObject )',
    params: [
      {
        label: '$oObject',
        documentation:
          'Object variable of an InternetExplorer.Application, Window, Frame or any DOM object',
      },
    ],
  },
  _IEDocInsertHTML: {
    documentation: 'Inserts HTML Text in or around an element',
    label: '_IEDocInsertHTML ( ByRef $oObject, $sString [, $sWhere = "beforeend"] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable pointing to a document element.',
      },
      {
        label: '$sString',
        documentation: 'The string containing the HTML text to insert.',
      },
      {
        label: '$sWhere',
        documentation:
          '**[optional]** specifies the string insertion point    "beforebegin" = Inserts string immediately before the object.    "afterbegin" = Inserts string after the start of the object but before all other content in the object.    "beforeend" = (Default) Inserts string immediately before the end of the object but after all other content in the object.    "afterend" = Inserts string immediately after the end of the object.',
      },
    ],
  },
  _IEDocInsertText: {
    documentation: 'Inserts Text in or around an element',
    label: '_IEDocInsertText ( ByRef $oObject, $sString [, $sWhere = "beforeend"] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable pointing to a document element.',
      },
      {
        label: '$sString',
        documentation: 'The string containing the text to insert.',
      },
      {
        label: '$sWhere',
        documentation:
          '**[optional]** specifies the string insertion point    "beforebegin" = Inserts string immediately before the object.    "afterbegin" = Inserts string after the start of the object but before all other content in the object.    "beforeend" = (Default) Inserts string immediately before the end of the object but after all other content in the object.    "afterend" = Inserts string immediately after the end of the object.',
      },
    ],
  },
  _IEDocReadHTML: {
    documentation: 'Returns the full HTML source of a document',
    label: '_IEDocReadHTML ( ByRef $oObject )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
    ],
  },
  _IEDocWriteHTML: {
    documentation: 'Replaces the HTML for the entire document',
    label: '_IEDocWriteHTML ( ByRef $oObject, $sHTML )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
      {
        label: '$sHTML',
        documentation: 'The HTML string to write to the document',
      },
    ],
  },
  _IEErrorNotify: {
    documentation:
      'Specifies whether IE.au3 automatically notifies of Warnings and Errors (to the console)',
    label: '_IEErrorNotify ( [$vNotify = Default] )',
    params: [
      {
        label: '$vNotify',
        documentation:
          '**[optional]** specifies whether notification should be on or off    -1 = (Default) return current setting    True = Turn On    False = Turn Off',
      },
    ],
  },
  _IEFormElementCheckBoxSelect: {
    documentation: 'Set the value of a specified form element',
    label:
      '_IEFormElementCheckBoxSelect ( ByRef $oObject, $sString [, $sName = "" [, $iSelect = 1 [, $sMode = "byValue" [, $iFireEvent = 1]]]] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Form object',
      },
      {
        label: '$sString',
        documentation: 'Value used to match element - treatment based on $sMode',
      },
      {
        label: '$sName',
        documentation: '**[optional]** Name or Id of checkbox(es)',
      },
      {
        label: '$iSelect',
        documentation:
          '**[optional]** specifies whether element should be checked or unchecked    -1 = Return checked state     0 = Uncheck the element     1 = (Default) Check the element',
      },
      {
        label: '$sMode',
        documentation:
          '**[optional]** specify search mode    "byValue" = (Default) value of the checkbox you wish to select    "byIndex" = 0-based index of checkbox you wish to select',
      },
      {
        label: '$iFireEvent',
        documentation:
          '**[optional]** specifies whether to fire OnChange and OnClick events after changing value    0 = do not fire OnChange or OnClick event after setting value    1 = (Default) fire OnChange and OnClick events after setting value',
      },
    ],
  },
  _IEFormElementGetCollection: {
    documentation:
      'Returns a collection object variable representing all Form Elements within a given Form',
    label: '_IEFormElementGetCollection ( ByRef $oObject [, $iIndex = -1] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Form object',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** specifies whether to return a collection or indexed instance     0 or positive integer returns an indexed instance    -1 = (Default) returns a collection',
      },
    ],
  },
  _IEFormElementGetObjByName: {
    documentation: 'Returns an object reference to a Form Element by name',
    label: '_IEFormElementGetObjByName ( ByRef $oObject, $sName [, $iIndex = 0] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Form object',
      },
      {
        label: '$sName',
        documentation: 'Specifies the name of the Form Element you wish to match',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** If the Form Element name occurs more than once, specifies instance by 0-based index     0 (Default) or positive integer returns an indexed instance    -1 returns a collection of the specified Form Elements',
      },
    ],
  },
  _IEFormElementGetValue: {
    documentation: 'Returns the value of a given Form Element',
    label: '_IEFormElementGetValue ( ByRef $oObject )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Form Element object',
      },
    ],
  },
  _IEFormElementOptionSelect: {
    documentation: 'Set the value of a specified form element',
    label:
      '_IEFormElementOptionSelect ( ByRef $oObject, $sString [, $iSelect = 1 [, $sMode = "byValue" [, $iFireEvent = 1]]] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Form Element Object of type "Select Option"',
      },
      {
        label: '$sString',
        documentation: 'Value used to match element - treatment based on $sMode',
      },
      {
        label: '$iSelect',
        documentation:
          '**[optional]** specifies whether element should be selected or deselected    -1 = Return selected state     0 = Deselect the element     1 = (Default) Select the element',
      },
      {
        label: '$sMode',
        documentation:
          '**[optional]** specifies search mode    "byValue" = (Default) value of the option you wish to select    "byText" = text of the option you wish to select    "byIndex" = 0-based index of option you wish to select',
      },
      {
        label: '$iFireEvent',
        documentation:
          '**[optional]** specifies whether to fire OnChange and OnClick events after changing value    0 = do not fire OnChange or OnClick event after setting value    1 = (Default) fire OnChange and OnClick events after setting value',
      },
    ],
  },
  _IEFormElementRadioSelect: {
    documentation: 'Set the value of a specified form element',
    label:
      '_IEFormElementRadioSelect ( ByRef $oObject, $sString, $sName [, $iSelect = 1 [, $sMode = "byValue" [, $iFireEvent = 1]]] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Form object',
      },
      {
        label: '$sString',
        documentation: 'Value used to match element - treatment based on $sMode',
      },
      {
        label: '$sName',
        documentation: 'Name or Id of Radio Group',
      },
      {
        label: '$iSelect',
        documentation:
          '**[optional]** specifies whether element should be selected or deselected    -1 = Return selected state     0 = Unselect the element     1 = (Default) Select the element',
      },
      {
        label: '$sMode',
        documentation:
          '**[optional]** specifies search mode    "byValue" = (Default) value of the radio you wish to select    "byIndex" = 0-based index of radio you wish to select',
      },
      {
        label: '$iFireEvent',
        documentation:
          '**[optional]** specifies whether to fire OnChange and OnClick events after changing value    0 = do not fire OnChange or OnClick event after setting value    1 = (Default) fire OnChange and OnClick events after setting value',
      },
    ],
  },
  _IEFormElementSetValue: {
    documentation: 'Set the value of a specified Form Element',
    label: '_IEFormElementSetValue ( ByRef $oObject, $sNewValue [, $iFireEvent = 1] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Form Element object',
      },
      {
        label: '$sNewValue',
        documentation: 'The new value to be set into the Form Element',
      },
      {
        label: '$iFireEvent',
        documentation:
          '**[optional]** specifies whether to fire an OnChange event after changing value    0 = Do not fire OnChange or OnClick event after setting value    1 = (Default) fire OnChange and OnClick event after setting value',
      },
    ],
  },
  _IEFormGetCollection: {
    documentation:
      'Returns a collection object variable representing the Forms in the document or a single form by index',
    label: '_IEFormGetCollection ( ByRef $oObject [, $iIndex = -1] )',
    params: [
      {
        label: '$oObject',
        documentation:
          'Object variable of an InternetExplorer.Application, Window, Frame or iFrame object',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** specifies whether to return a collection or indexed instance 0 or positive integer returns an indexed instance-1 = (Default) returns a collection',
      },
    ],
  },
  _IEFormGetObjByName: {
    documentation: 'Returns an object reference to a Form by name',
    label: '_IEFormGetObjByName ( ByRef $oObject, $sName [, $iIndex = 0] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
      {
        label: '$sName',
        documentation: 'Specifies the name of the Form you wish to match',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** If Form name occurs more than once, specifies instance by 0-based index     0 (Default) or positive integer returns an indexed instance    -1 returns a collection of the specified Forms',
      },
    ],
  },
  _IEFormImageClick: {
    documentation:
      'Simulate a mouse click on an <input type=image>. Match by sub-string match of alt text, name or src',
    label:
      '_IEFormImageClick ( ByRef $oObject, $sLinkText [, $sMode = "src" [, $iIndex = 0 [, $iWait = 1]]] )',
    params: [
      {
        label: '$oObject',
        documentation:
          'Object variable of any DOM element (will be converted to the associated document object)',
      },
      {
        label: '$sLinkText',
        documentation: 'Value used to match element - treatment based on $sMode',
      },
      {
        label: '$sMode',
        documentation:
          '**[optional]** specifies search mode    "src" = (Default) match the url of the image    "id" = match the id of the image (see remarks)    "alt" = match the alternate text of the image',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** If the img text occurs more than once, specifies which instance you want by 0-based index',
      },
      {
        label: '$iWait',
        documentation:
          '**[optional]** specifies whether to wait for page to load before returning    0 = Return immediately, not waiting for page to load    1 = (Default) Wait for page load to complete before returning',
      },
    ],
  },
  _IEFormReset: {
    documentation: 'Reset a specified Form setting the values back to their loaded defaults',
    label: '_IEFormReset ( ByRef $oObject )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Form object',
      },
    ],
  },
  _IEFormSubmit: {
    documentation: 'Submit a specified Form',
    label: '_IEFormSubmit ( ByRef $oObject [, $iWait = 1] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Form object',
      },
      {
        label: '$iWait',
        documentation:
          '**[optional]** specifies whether to wait for page to load before returning    0 = Return immediately, not waiting for page to load    1 = (Default) Wait for page load to complete before returning',
      },
    ],
  },
  _IEFrameGetCollection: {
    documentation:
      'Returns a collection object containing the frames in a FrameSet or the iFrames on a normal page or a single Frame or iFrame by index',
    label: '_IEFrameGetCollection ( ByRef $oObject [, $iIndex = -1] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** specifies whether to return a collection or indexed instance     0 or positive integer returns an indexed instance    -1 = (Default) returns a collection',
      },
    ],
  },
  _IEFrameGetObjByName: {
    documentation: 'Returns an object reference to a Frame or iFrame by name',
    label: '_IEFrameGetObjByName ( ByRef $oObject, $sName )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
      {
        label: '$sName',
        documentation: 'Name of the Frame you wish to match',
      },
    ],
  },
  _IEGetObjById: {
    documentation: 'Returns an object variable by id',
    label: '_IEGetObjById ( ByRef $oObject, $sID )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
      {
        label: '$sID',
        documentation: 'Specifies id of the object you wish to match',
      },
    ],
  },
  _IEGetObjByName: {
    documentation: 'Returns an object variable by name',
    label: '_IEGetObjByName ( ByRef $oObject, $sName [, $iIndex = 0] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
      {
        label: '$sName',
        documentation: 'Specifies name of the object you wish to match',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** If name occurs more than once, specifies instance by 0-based index     0 (Default) or positive integer returns an indexed instance    -1 returns a collection of the specified objects',
      },
    ],
  },
  _IEHeadInsertEventScript: {
    documentation: 'Inserts a Javascript into the Head of the document',
    label: '_IEHeadInsertEventScript ( ByRef $oObject, $sHTMLFor, $sEvent, $sScript )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
      {
        label: '$sHTMLFor',
        documentation:
          'The HTML element for event monitoring (e.g. "document", "window" or an element ID)',
      },
      {
        label: '$sEvent',
        documentation: 'The event to monitor (e.g. "onclick" or "oncontextmenu")',
      },
      {
        label: '$sScript',
        documentation: 'Javascript string to be executed',
      },
    ],
  },
  _IEImgClick: {
    documentation:
      'Simulate a mouse click on an image. Match by sub-string match of alt text, name, or src',
    label:
      '_IEImgClick ( ByRef $oObject, $sLinkText [, $sMode = "src" [, $iIndex = 0 [, $iWait = 1]]] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
      {
        label: '$sLinkText',
        documentation: 'Text to match the content of the attribute specified in $sMode',
      },
      {
        label: '$sMode',
        documentation:
          '**[optional]** specifies search mode    "src" = (Default) match the url of the image    "id" = match the id of the image (see remarks)    "alt" = match the alternate text of the image',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** If the img text occurs more than once, specify which instance you want by 0-based index',
      },
      {
        label: '$iWait',
        documentation:
          '**[optional]** specifies whether to wait for page to load before returning    0 = Return immediately, not waiting for page to load    1 = (Default) Wait for page load to complete before returning',
      },
    ],
  },
  _IEImgGetCollection: {
    documentation:
      'Returns a collection object variable representing the IMG tags in the document or a single image by index',
    label: '_IEImgGetCollection ( ByRef $oObject [, $iIndex = -1] )',
    params: [
      {
        label: '$oObject',
        documentation:
          'Object variable of an InternetExplorer.Application, Window, Frame or iFrame object',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** specifies whether to return a collection or indexed instance     0 or positive integer returns an indexed instance    -1 = (Default) returns a collection',
      },
    ],
  },
  _IEIsFrameSet: {
    documentation: 'Checks to see if the specified Window contains a FrameSet',
    label: '_IEIsFrameSet ( ByRef $oObject )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
    ],
  },
  _IELinkClickByIndex: {
    documentation: 'Simulate a mouse click on a link by 0-based index (in source order)',
    label: '_IELinkClickByIndex ( ByRef $oObject, $iIndex [, $iWait = 1] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the link you wish to match',
      },
      {
        label: '$iWait',
        documentation:
          '**[optional]** specifies whether to wait for page to load before returning    0 = Return immediately, not waiting for page to load    1 = (Default) Wait for page load to complete before returning',
      },
    ],
  },
  _IELinkClickByText: {
    documentation:
      'Simulate a mouse click on a link with text sub-string matching the string provided',
    label: '_IELinkClickByText ( ByRef $oObject, $sLinkText [, $iIndex = 0 [, $iWait = 1]] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
      {
        label: '$sLinkText',
        documentation: 'Text displayed on the web page for the desired link to click',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** If the link text occurs more than once, specify which instance you want by 0-based index',
      },
      {
        label: '$iWait',
        documentation:
          '**[optional]** specifies whether to wait for page to load before returning    0 = Return immediately, not waiting for page to load    1 = (Default) Wait for page load to complete before returning',
      },
    ],
  },
  _IELinkGetCollection: {
    documentation:
      'Returns a collection object containing all links in the document or a single link by index',
    label: '_IELinkGetCollection ( ByRef $oObject [, $iIndex = -1] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** specifies whether to return a collection or indexed instance     0 or positive integer returns an indexed instance    -1 = (Default) returns a collection',
      },
    ],
  },
  _IELoadWait: {
    documentation: 'Wait for a browser page load to complete before returning',
    label: '_IELoadWait ( ByRef $oObject [, $iDelay = 0 [, $iTimeout = -1]] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application or DOM element',
      },
      {
        label: '$iDelay',
        documentation: '**[optional]** Milliseconds to wait before checking status',
      },
      {
        label: '$iTimeout',
        documentation:
          '**[optional]** Period of time to wait before exiting function (default = 300000 ms aka 5 min)',
      },
    ],
  },
  _IELoadWaitTimeout: {
    documentation:
      'Retrieve or set the current value in milliseconds _IELoadWait() will try before timing out',
    label: '_IELoadWaitTimeout ( [$iTimeout = -1] )',
    params: [
      {
        label: '$iTimeout',
        documentation:
          '**[optional]** retrieve or specify the number of milliseconds     0 or positive integer sets timeout to this value    -1 = (Default) returns the current timeout value (stored in global variable $__IELoadWaitTimeout)',
      },
    ],
  },
  _IENavigate: {
    documentation: 'Directs an existing browser window to navigate to the specified URL',
    label: '_IENavigate ( ByRef $oObject, $sUrl [, $iWait = 1] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
      {
        label: '$sUrl',
        documentation: 'URL to navigate to (e.g. "http://www.autoitscript.com")',
      },
      {
        label: '$iWait',
        documentation:
          '**[optional]** specifies whether to wait for page to load before returning    0 = Return immediately, not waiting for page to load    1 = (Default) Wait for page load to complete before returning',
      },
    ],
  },
  _IEPropertyGet: {
    documentation: 'Returns a select property of the Browser or DOM element',
    label: '_IEPropertyGet ( ByRef $oObject, $sProperty )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application or DOM element',
      },
      {
        label: '$sProperty',
        documentation: 'Property selection (see remarks)',
      },
    ],
  },
  _IEPropertySet: {
    documentation: 'Set a select property of the Browser or DOM element',
    label: '_IEPropertySet ( ByRef $oObject, $sProperty, $vValue )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application',
      },
      {
        label: '$sProperty',
        documentation: 'Property selection (see remarks)',
      },
      {
        label: '$vValue',
        documentation: 'The new value to be set into the Browser Property',
      },
    ],
  },
  _IEQuit: {
    documentation: 'Close the browser and remove the object reference to it',
    label: '_IEQuit ( ByRef $oObject )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application',
      },
    ],
  },
  _IETableGetCollection: {
    documentation:
      'Returns a collection object variable representing all the tables in a document or a single table by index',
    label: '_IETableGetCollection ( ByRef $oObject [, $iIndex = -1] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Window or Frame object',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** specifies whether to return a collection or indexed instance     0 or positive integer returns an indexed instance    -1 = (Default) returns a collection',
      },
    ],
  },
  _IETableWriteToArray: {
    documentation: 'Reads the contents of a Table into an array',
    label: '_IETableWriteToArray ( ByRef $oObject [, $bTranspose = False] )',
    params: [
      {
        label: '$oObject',
        documentation: 'Object variable of an InternetExplorer.Application, Table object',
      },
      {
        label: '$bTranspose',
        documentation:
          '**[optional]** Boolean value specifying whether to swap the rows and columns in the output array',
      },
    ],
  },
  _IETagNameAllGetCollection: {
    documentation:
      'Returns a collection object all elements in the document or document hierarchy in source order or a single element by index',
    label: '_IETagNameAllGetCollection ( ByRef $oObject [, $iIndex = -1] )',
    params: [
      {
        label: '$oObject',
        documentation:
          'Object variable of an InternetExplorer.Application, Window, Frame, iFrame or any object in the DOM',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** specifies whether to return a collection or indexed instance     0 or positive integer returns an indexed instance    -1 = (Default) returns a collection',
      },
    ],
  },
  _IETagNameGetCollection: {
    documentation:
      'Returns a collection object of all elements in the object with the specified TagName or a single element by index',
    label: '_IETagNameGetCollection ( ByRef $oObject, $sTagName [, $iIndex = -1] )',
    params: [
      {
        label: '$oObject',
        documentation:
          'Object variable of an InternetExplorer.Application, Window, Frame, iFrame or any object in the DOM',
      },
      {
        label: '$sTagName',
        documentation: 'TagName of collection to return (e.g. IMG, TR etc.)',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** specifies whether to return a collection or indexed instance     0 or positive integer returns an indexed instance    -1 = (Default) returns a collection',
      },
    ],
  },
  _IE_Example: {
    documentation:
      'Display a new browser window pre-loaded with documents to be used in IE.au3 examples or your own testing',
    label: '_IE_Example ( [$sModule = "basic"] )',
    params: [
      {
        label: '$sModule',
        documentation:
          '**[optional]** specifies which module to run    "basic" = (Default) simple HTML page with text, links and images    "form" = simple HTML page with multiple form elements    "frameset" = simple HTML page with frames    "iframe" = simple HTML page with iframes    "table" = simple HTML page with tables',
      },
    ],
  },
  _IE_Introduction: {
    documentation: 'Display introductory information about IE.au3 in a new browser window',
    label: '_IE_Introduction ( [$sModule = "basic"] )',
    params: [
      {
        label: '$sModule',
        documentation:
          '**[optional]** specifies which module to run    "basic" = (Default) basic introduction',
      },
    ],
  },
  _IE_VersionInfo: {
    documentation: 'Returns an array of information about the IE.au3 version',
    label: '_IE_VersionInfo (  )',
    params: [],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
