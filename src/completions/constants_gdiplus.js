import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../util';

const penDashCap = 'Pen Dash Cap Type Constant';
const penDashStyle = 'Pen Dash Style Constant';
const encoderGUID = 'Encoder Parameter GUID';
const encoderType = 'Encoder Paramter Type Constant';
const error = 'GDI Error Code';
const encoderValueType = 'Encoder Value Type';
const imageCodec = 'Image Codec Flag';
const imageLock = 'Image Lock Mode';
const lineCap = 'LineCap Constant';
const pixelFormat = 'Pixel Format';
const imageFormat = 'ImageFormat Constant';
const imageType = 'ImageType Constant';
const imageFlag = 'ImageFlag Flag';
const smoothingMode = 'Graphic SmoothingMode';
const colorLum = 'Color Luminance Constant';
const interpolation = 'Interpolation Mode';
const textRenderingHint = 'TextRenderingHint Constant';
const pixelOffsetMode = 'PixelOffsetMode Constant';
const lineJoin = 'LineJoin Constant';
const fillMode = 'Fill mode Constant';
const quality = 'Quality Constant';
const alphaCompositing = 'Alpha Compositing Mode Constant';
const alphaCompQuality = 'Alpha Compositing Quality Constant';
const hatchStyle = 'Hatch Style';
const gdiPlus = 'GDIPlus Constant';
const colorFormat = 'Color Format Conversion Parameter';
const symmetricHalftone = 'Symmetric Halftone Palette';
const asymmetricHalftone = 'Asymmetric Halftone Palette';
const paletteFlag = 'PaletteFlag Enumeration';
const ditherType = 'DitherType Constant';
const errorDiffusion = 'Error Diffusion Constant';
const histogram = 'HistogramFormat Constant';
const rotateFlipType = 'RotateFlipType Constant';
const multiFrame = 'Multi-frame Dimension Constant';
const imageAttributesSetThreshold = 'ImageAttributesSetThreshold Constant';

const items = [
  {
    label: '$GDIP_DASHCAPFLAT',
    documentation: 'A square cap that squares off both ends of each dash\n\n`= 0 `',
    detail: penDashCap,
  },
  {
    label: '$GDIP_DASHCAPROUND',
    documentation: 'A circular cap that rounds off both ends of each dash\n\n`= 2 `',
    detail: penDashCap,
  },
  {
    label: '$GDIP_DASHCAPTRIANGLE',
    documentation: 'A triangular cap that points both ends of each dash\n\n`= 3 `',
    detail: penDashCap,
  },
  {
    label: '$GDIP_DASHSTYLESOLID',
    documentation: 'A solid line\n\n`= 0 `',
    detail: penDashStyle,
  },
  {
    label: '$GDIP_DASHSTYLEDASH',
    documentation: 'A dashed line\n\n`= 1 `',
    detail: penDashStyle,
  },
  {
    label: '$GDIP_DASHSTYLEDOT',
    documentation: 'A dotted line\n\n`= 2 `',
    detail: penDashStyle,
  },
  {
    label: '$GDIP_DASHSTYLEDASHDOT',
    documentation: 'An alternating dash-dot line\n\n`= 3 `',
    detail: penDashStyle,
  },
  {
    label: '$GDIP_DASHSTYLEDASHDOTDOT',
    documentation: 'An alternating dash-dot-dot line\n\n`= 4 `',
    detail: penDashStyle,
  },
  {
    label: '$GDIP_DASHSTYLECUSTOM',
    documentation: 'A a user-defined, custom dashed line\n\n`= 5 `',
    detail: penDashStyle,
  },
  {
    label: '$GDIP_EPGCHROMINANCETABLE',
    documentation: '`= "{F2E455DC-09B3-4316-8260-676ADA32481C}"`',
    detail: encoderGUID,
  },
  {
    label: '$GDIP_EPGCOLORDEPTH',
    documentation: '`= "{66087055-AD66-4C7C-9A18-38A2310B8337}"`',
    detail: encoderGUID,
  },
  {
    label: '$GDIP_EPGCOMPRESSION',
    documentation: '`= "{E09D739D-CCD4-44EE-8EBA-3FBF8BE4FC58}"`',
    detail: encoderGUID,
  },
  {
    label: '$GDIP_EPGLUMINANCETABLE',
    documentation: '`= "{EDB33BCE-0266-4A77-B904-27216099E717}"`',
    detail: encoderGUID,
  },
  {
    label: '$GDIP_EPGQUALITY',
    documentation: '`= "{1D5BE4B5-FA4A-452D-9CDD-5DB35105E7EB}"`',
    detail: encoderGUID,
  },
  {
    label: '$GDIP_EPGRENDERMETHOD',
    documentation: '`= "{6D42C53A-229A-4825-8BB7-5C99E2B9A8B8}"`',
    detail: encoderGUID,
  },
  {
    label: '$GDIP_EPGSAVEFLAG',
    documentation: '`= "{292266FC-AC40-47BF-8CFC-A85B89A655DE}"`',
    detail: encoderGUID,
  },
  {
    label: '$GDIP_EPGSCANMETHOD',
    documentation: '`= "{3A4E2661-3109-4E56-8536-42C156E7DCFA}"`',
    detail: encoderGUID,
  },
  {
    label: '$GDIP_EPGTRANSFORMATION',
    documentation: '`= "{8D0EB2D1-A58E-4EA8-AA14-108074B7B6F9}"`',
    detail: encoderGUID,
  },
  {
    label: '$GDIP_EPGVERSION',
    documentation: '`= "{24D18C76-814A-41A4-BF53-1C219CCCF797}"`',
    detail: encoderGUID,
  },
  {
    label: '$GDIP_EPTBYTE',
    documentation: '8 bit unsigned integer\n\n`= 1 `',
    detail: encoderType,
  },
  {
    label: '$GDIP_EPTASCII',
    documentation: 'Null terminated character string\n\n`= 2 `',
    detail: encoderType,
  },
  {
    label: '$GDIP_EPTSHORT',
    documentation: '16 bit unsigned integer\n\n`= 3 `',
    detail: encoderType,
  },
  {
    label: '$GDIP_EPTLONG',
    documentation: '32 bit unsigned integer\n\n`= 4 `',
    detail: encoderType,
  },
  {
    label: '$GDIP_EPTRATIONAL',
    documentation: 'Two longs (numerator, denomintor)\n\n`= 5 `',
    detail: encoderType,
  },
  {
    label: '$GDIP_EPTLONGRANGE',
    documentation: 'Two longs (low, high)\n\n`= 6 `',
    detail: encoderType,
  },
  {
    label: '$GDIP_EPTUNDEFINED',
    documentation: 'Array of bytes of any type\n\n`= 7 `',
    detail: encoderType,
  },
  {
    label: '$GDIP_EPTRATIONALRANGE',
    documentation: 'Two ratationals (low, high)\n\n`= 8 `',
    detail: encoderType,
  },
  {
    label: '$GDIP_ERROK',
    documentation: 'Method call was successful\n\n`= 0 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRGENERICERROR',
    documentation: 'Generic method call error\n\n`= 1 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRINVALIDPARAMETER',
    documentation: 'One of the arguments passed to the method was not valid\n\n`= 2 `',
    detail: error,
  },
  {
    label: '$GDIP_ERROUTOFMEMORY',
    documentation: 'The operating system is out of memory\n\n`= 3 `',
    detail: error,
  },
  {
    label: '$GDIP_ERROBJECTBUSY',
    documentation: 'One of the arguments in the call is already in use\n\n`= 4 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRINSUFFICIENTBUFFER',
    documentation: 'A buffer is not large enough\n\n`= 5 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRNOTIMPLEMENTED',
    documentation: 'The method is not implemented\n\n`= 6 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRWIN32ERROR',
    documentation: 'The method generated a Microsoft Win32 error\n\n`= 7 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRWRONGSTATE',
    documentation: 'The object is in an invalid state to satisfy the API call\n\n`= 8 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRABORTED',
    documentation: 'The method was aborted\n\n`= 9 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRFILENOTFOUND',
    documentation: 'The specified image file or metafile cannot be found\n\n`= 10 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRVALUEOVERFLOW',
    documentation: 'The method produced a numeric overflow\n\n`= 11 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRACCESSDENIED',
    documentation: 'A write operation is not allowed on the specified file\n\n`= 12 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRUNKNOWNIMAGEFORMAT',
    documentation: 'The specified image file format is not known\n\n`= 13 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRFONTFAMILYNOTFOUND',
    documentation: 'The specified font family cannot be found\n\n`= 14 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRFONTSTYLENOTFOUND',
    documentation: 'The specified style is not available for the specified font\n\n`= 15 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRNOTTRUETYPEFONT',
    documentation: 'The font retrieved is not a TrueType font\n\n`= 16 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRUNSUPPORTEDGDIVERSION',
    documentation: 'The installed GDI+ version is incompatible\n\n`= 17 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRGDIPLUSNOTINITIALIZED',
    documentation: 'The GDI+ API is not in an initialized state\n\n`= 18 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRPROPERTYNOTFOUND',
    documentation: 'The specified property does not exist in the image\n\n`= 19 `',
    detail: error,
  },
  {
    label: '$GDIP_ERRPROPERTYNOTSUPPORTED',
    documentation: 'The specified property is not supported\n\n`= 20 `',
    detail: error,
  },
  {
    label: '$GDIP_EVTCOMPRESSIONLZW',
    documentation: 'TIFF: LZW compression\n\n`= 2 `',
    detail: encoderValueType,
  },
  {
    label: '$GDIP_EVTCOMPRESSIONCCITT3',
    documentation: 'TIFF: CCITT3 compression\n\n`= 3 `',
    detail: encoderValueType,
  },
  {
    label: '$GDIP_EVTCOMPRESSIONCCITT4',
    documentation: 'TIFF: CCITT4 compression\n\n`= 4 `',
    detail: encoderValueType,
  },
  {
    label: '$GDIP_EVTCOMPRESSIONRLE',
    documentation: 'TIFF: RLE compression\n\n`= 5 `',
    detail: encoderValueType,
  },
  {
    label: '$GDIP_EVTCOMPRESSIONNONE',
    documentation: 'TIFF: No compression\n\n`= 6 `',
    detail: encoderValueType,
  },
  {
    label: '$GDIP_EVTTRANSFORMROTATE90',
    documentation: 'JPEG: Lossless 90 degree clockwise rotation\n\n`= 13 `',
    detail: encoderValueType,
  },
  {
    label: '$GDIP_EVTTRANSFORMROTATE180',
    documentation: 'JPEG: Lossless 180 degree clockwise rotation\n\n`= 14 `',
    detail: encoderValueType,
  },
  {
    label: '$GDIP_EVTTRANSFORMROTATE270',
    documentation: 'JPEG: Lossless 270 degree clockwise rotation\n\n`= 15 `',
    detail: encoderValueType,
  },
  {
    label: '$GDIP_EVTTRANSFORMFLIPHORIZONTAL',
    documentation: 'JPEG: Lossless horizontal flip\n\n`= 16 `',
    detail: encoderValueType,
  },
  {
    label: '$GDIP_EVTTRANSFORMFLIPVERTICAL',
    documentation: 'JPEG: Lossless vertical flip\n\n`= 17 `',
    detail: encoderValueType,
  },
  {
    label: '$GDIP_EVTMULTIFRAME',
    documentation: 'Multiple frame encoding\n\n`= 18 `',
    detail: encoderValueType,
  },
  {
    label: '$GDIP_EVTLASTFRAME',
    documentation: 'Last frame of a multiple frame image\n\n`= 19 `',
    detail: encoderValueType,
  },
  {
    label: '$GDIP_EVTFLUSH',
    documentation: 'The encoder object is to be closed\n\n`= 20 `',
    detail: encoderValueType,
  },
  {
    label: '$GDIP_EVTFRAMEDIMENSIONPAGE',
    documentation: 'TIFF: Page frame dimension\n\n`= 23 `',
    detail: encoderValueType,
  },
  {
    label: '$GDIP_ICFENCODER',
    documentation: 'The codec supports encoding (saving)\n\n`= 0x00000001 `',
    detail: imageCodec,
  },
  {
    label: '$GDIP_ICFDECODER',
    documentation: 'The codec supports decoding (reading)\n\n`= 0x00000002 `',
    detail: imageCodec,
  },
  {
    label: '$GDIP_ICFSUPPORTBITMAP',
    documentation: 'The codec supports raster images (bitmaps)\n\n`= 0x00000004 `',
    detail: imageCodec,
  },
  {
    label: '$GDIP_ICFSUPPORTVECTOR',
    documentation: 'The codec supports vector images (metafiles)\n\n`= 0x00000008 `',
    detail: imageCodec,
  },
  {
    label: '$GDIP_ICFSEEKABLEENCODE',
    documentation: 'The encoder requires a seekable output stream\n\n`= 0x00000010 `',
    detail: imageCodec,
  },
  {
    label: '$GDIP_ICFBLOCKINGDECODE',
    documentation:
      'The decoder has blocking behavior during the decoding process\n\n`= 0x00000020 `',
    detail: imageCodec,
  },
  {
    label: '$GDIP_ICFBUILTIN',
    documentation: 'The codec is built in to GDI+\n\n`= 0x00010000 `',
    detail: imageCodec,
  },
  {
    label: '$GDIP_ICFSYSTEM',
    documentation: 'Not used in GDI+ version 1.0\n\n`= 0x00020000 `',
    detail: imageCodec,
  },
  {
    label: '$GDIP_ICFUSER',
    documentation: 'Not used in GDI+ version 1.0\n\n`= 0x00040000 `',
    detail: imageCodec,
  },
  {
    label: '$GDIP_ILMREAD',
    documentation: 'A portion of the image is locked for reading\n\n`= 0x0001 `',
    detail: imageLock,
  },
  {
    label: '$GDIP_ILMWRITE',
    documentation: 'A portion of the image is locked for writing\n\n`= 0x0002 `',
    detail: imageLock,
  },
  {
    label: '$GDIP_ILMUSERINPUTBUF',
    documentation: 'The buffer is allocated by the user\n\n`= 0x0004 `',
    detail: imageLock,
  },
  {
    label: '$GDIP_LINECAPFLAT',
    documentation: 'Specifies a flat cap\n\n`= 0x00 `',
    detail: lineCap,
  },
  {
    label: '$GDIP_LINECAPSQUARE',
    documentation: 'Specifies a square cap\n\n`= 0x01 `',
    detail: lineCap,
  },
  {
    label: '$GDIP_LINECAPROUND',
    documentation: 'Specifies a circular cap\n\n`= 0x02 `',
    detail: lineCap,
  },
  {
    label: '$GDIP_LINECAPTRIANGLE',
    documentation: 'Specifies a triangular cap\n\n`= 0x03 `',
    detail: lineCap,
  },
  {
    label: '$GDIP_LINECAPNOANCHOR',
    documentation: 'Specifies that the line ends are not anchored\n\n`= 0x10 `',
    detail: lineCap,
  },
  {
    label: '$GDIP_LINECAPSQUAREANCHOR',
    documentation: 'Specifies that the line ends are anchored with a square\n\n`= 0x11 `',
    detail: lineCap,
  },
  {
    label: '$GDIP_LINECAPROUNDANCHOR',
    documentation: 'Specifies that the line ends are anchored with a circle\n\n`= 0x12 `',
    detail: lineCap,
  },
  {
    label: '$GDIP_LINECAPDIAMONDANCHOR',
    documentation: 'Specifies that the line ends are anchored with a diamond\n\n`= 0x13 `',
    detail: lineCap,
  },
  {
    label: '$GDIP_LINECAPARROWANCHOR',
    documentation: 'Specifies that the line ends are anchored with arrowheads\n\n`= 0x14 `',
    detail: lineCap,
  },
  {
    label: '$GDIP_LINECAPCUSTOM',
    documentation: 'Specifies that the line ends are made from a CustomLineCap\n\n`= 0xFF `',
    detail: lineCap,
  },
  {
    label: '$GDIP_PXF01INDEXED',
    documentation: '1 bpp, indexed\n\n`= 0x00030101 `',
    detail: pixelFormat,
  },
  {
    label: '$GDIP_PXF04INDEXED',
    documentation: '4 bpp, indexed\n\n`= 0x00030402 `',
    detail: pixelFormat,
  },
  {
    label: '$GDIP_PXF08INDEXED',
    documentation: '8 bpp, indexed\n\n`= 0x00030803 `',
    detail: pixelFormat,
  },
  {
    label: '$GDIP_PXF16GRAYSCALE',
    documentation: '16 bpp, grayscale\n\n`= 0x00101004 `',
    detail: pixelFormat,
  },
  {
    label: '$GDIP_PXF16RGB555',
    documentation: '16 bpp; 5 bits for each RGB\n\n`= 0x00021005 `',
    detail: pixelFormat,
  },
  {
    label: '$GDIP_PXF16RGB565',
    documentation: '16 bpp; 5 bits red, 6 bits green, and 5 bits blue\n\n`= 0x00021006 `',
    detail: pixelFormat,
  },
  {
    label: '$GDIP_PXF16ARGB1555',
    documentation: '16 bpp; 1 bit for alpha and 5 bits for each RGB component\n\n`= 0x00061007 `',
    detail: pixelFormat,
  },
  {
    label: '$GDIP_PXF24RGB',
    documentation: '24 bpp; 8 bits for each RGB\n\n`= 0x00021808 `',
    detail: pixelFormat,
  },
  {
    label: '$GDIP_PXF32RGB',
    documentation: '32 bpp; 8 bits for each RGB. No alpha.\n\n`= 0x00022009 `',
    detail: pixelFormat,
  },
  {
    label: '$GDIP_PXF32ARGB',
    documentation: '32 bpp; 8 bits for each RGB and alpha\n\n`= 0x0026200A `',
    detail: pixelFormat,
  },
  {
    label: '$GDIP_PXF32PARGB',
    documentation: '32 bpp; 8 bits for each RGB and alpha, pre-mulitiplied\n\n`= 0x000E200B `',
    detail: pixelFormat,
  },
  {
    label: '$GDIP_PXF48RGB',
    documentation: '48 bpp; 16 bits for each RGB\n\n`= 0x0010300C `',
    detail: pixelFormat,
  },
  {
    label: '$GDIP_PXF64ARGB',
    documentation: '64 bpp; 16 bits for each RGB and alpha\n\n`= 0x0034400D `',
    detail: pixelFormat,
  },
  {
    label: '$GDIP_PXF64PARGB',
    documentation: '64 bpp; 16 bits for each RGB and alpha, pre-multiplied\n\n`= 0x001A400E `',
    detail: pixelFormat,
  },
  {
    label: '$GDIP_IMAGEFORMAT_UNDEFINED',
    documentation:
      'Windows GDI+ is unable to determine the format.\n\n`= "{B96B3CA9-0728-11D3-9D7B-0000F81EF32E}" `',
    detail: imageFormat,
  },
  {
    label: '$GDIP_IMAGEFORMAT_MEMORYBMP',
    documentation:
      'Image was constructed from a memory bitmap.\n\n`= "{B96B3CAA-0728-11D3-9D7B-0000F81EF32E}" `',
    detail: imageFormat,
  },
  {
    label: '$GDIP_IMAGEFORMAT_BMP',
    documentation:
      'Microsoft Windows Bitmap (BMP) format.\n\n`= "{B96B3CAB-0728-11D3-9D7B-0000F81EF32E}" `',
    detail: imageFormat,
  },
  {
    label: '$GDIP_IMAGEFORMAT_EMF',
    documentation:
      'Enhanced Metafile (EMF) format.\n\n`= "{B96B3CAC-0728-11D3-9D7B-0000F81EF32E}" `',
    detail: imageFormat,
  },
  {
    label: '$GDIP_IMAGEFORMAT_WMF',
    documentation:
      'Windows Metafile Format (WMF) format.\n\n`= "{B96B3CAD-0728-11D3-9D7B-0000F81EF32E}" `',
    detail: imageFormat,
  },
  {
    label: '$GDIP_IMAGEFORMAT_JPEG',
    documentation:
      'Joint Photographic Experts Group (JPEG) format.\n\n`= "{B96B3CAE-0728-11D3-9D7B-0000F81EF32E}" `',
    detail: imageFormat,
  },
  {
    label: '$GDIP_IMAGEFORMAT_PNG',
    documentation:
      'Portable Network Graphics (PNG) format.\n\n`= "{B96B3CAF-0728-11D3-9D7B-0000F81EF32E}" `',
    detail: imageFormat,
  },
  {
    label: '$GDIP_IMAGEFORMAT_GIF',
    documentation:
      'Graphics Interchange Format (GIF) format.\n\n`= "{B96B3CB0-0728-11D3-9D7B-0000F81EF32E}" `',
    detail: imageFormat,
  },
  {
    label: '$GDIP_IMAGEFORMAT_TIFF',
    documentation:
      'Tagged Image File Format (TIFF) format.\n\n`= "{B96B3CB1-0728-11D3-9D7B-0000F81EF32E}" `',
    detail: imageFormat,
  },
  {
    label: '$GDIP_IMAGEFORMAT_EXIF',
    documentation:
      'Exchangeable Image File (EXIF) format.\n\n`= "{B96B3CB2-0728-11D3-9D7B-0000F81EF32E}" `',
    detail: imageFormat,
  },
  {
    label: '$GDIP_IMAGEFORMAT_ICON',
    documentation:
      'Microsoft Windows Icon Image (ICO) format.\n\n`= "{B96B3CB5-0728-11D3-9D7B-0000F81EF32E}" `',
    detail: imageFormat,
  },
  {
    label: '$GDIP_IMAGETYPE_UNKNOWN',
    documentation: '`= 0`',
    detail: imageType,
  },
  {
    label: '$GDIP_IMAGETYPE_BITMAP',
    documentation: '`= 1`',
    detail: imageType,
  },
  {
    label: '$GDIP_IMAGETYPE_METAFILE',
    documentation: '`= 2`',
    detail: imageType,
  },
  {
    label: '$GDIP_IMAGEFLAGS_NONE',
    documentation: 'no format information.\n\n`= 0x0 `',
    detail: imageFlag,
  },
  {
    label: '$GDIP_IMAGEFLAGS_SCALABLE',
    documentation: 'image can be scaled.\n\n`= 0x0001 `',
    detail: imageFlag,
  },
  {
    label: '$GDIP_IMAGEFLAGS_HASALPHA',
    documentation: 'pixel data contains alpha values.\n\n`= 0x0002 `',
    detail: imageFlag,
  },
  {
    label: '$GDIP_IMAGEFLAGS_HASTRANSLUCENT',
    documentation:
      'pixel data has alpha values other than 0 (transparent) and 255 (opaque).\n\n`= 0x0004 `',
    detail: imageFlag,
  },
  {
    label: '$GDIP_IMAGEFLAGS_PARTIALLYSCALABLE',
    documentation: 'pixel data is partially scalable with some limitations.\n\n`= 0x0008 `',
    detail: imageFlag,
  },
  {
    label: '$GDIP_IMAGEFLAGS_COLORSPACE_RGB',
    documentation: 'image is stored using an RGB color space.\n\n`= 0x0010 `',
    detail: imageFlag,
  },
  {
    label: '$GDIP_IMAGEFLAGS_COLORSPACE_CMYK',
    documentation: 'image is stored using a CMYK color space.\n\n`= 0x0020 `',
    detail: imageFlag,
  },
  {
    label: '$GDIP_IMAGEFLAGS_COLORSPACE_GRAY',
    documentation: 'image is a grayscale image.\n\n`= 0x0040 `',
    detail: imageFlag,
  },
  {
    label: '$GDIP_IMAGEFLAGS_COLORSPACE_YCBCR',
    documentation: 'image is stored using a YCBCR color space.\n\n`= 0x0080 `',
    detail: imageFlag,
  },
  {
    label: '$GDIP_IMAGEFLAGS_COLORSPACE_YCCK',
    documentation: 'image is stored using a YCCK color space.\n\n`= 0x0100 `',
    detail: imageFlag,
  },
  {
    label: '$GDIP_IMAGEFLAGS_HASREALDPI',
    documentation: 'dots per inch information is stored in the image.\n\n`= 0x1000 `',
    detail: imageFlag,
  },
  {
    label: '$GDIP_IMAGEFLAGS_HASREALPIXELSIZE',
    documentation: 'pixel size is stored in the image.\n\n`= 0x2000 `',
    detail: imageFlag,
  },
  {
    label: '$GDIP_IMAGEFLAGS_READONLY',
    documentation: 'pixel data is read-only.\n\n`= 0x00010000 `',
    detail: imageFlag,
  },
  {
    label: '$GDIP_IMAGEFLAGS_CACHING',
    documentation: 'pixel data can be cached for faster access.\n\n`= 0x00020000 `',
    detail: imageFlag,
  },
  {
    label: '$GDIP_SMOOTHINGMODE_INVALID',
    documentation: 'Reserved.\n\n`= -1 `',
    detail: smoothingMode,
  },
  {
    label: '$GDIP_SMOOTHINGMODE_DEFAULT',
    documentation: 'Specifies that smoothing is not applied.\n\n`= 0 `',
    detail: smoothingMode,
  },
  {
    label: '$GDIP_SMOOTHINGMODE_HIGHSPEED',
    documentation: 'Specifies that smoothing is not applied.\n\n`= 1 `',
    detail: smoothingMode,
  },
  {
    label: '$GDIP_SMOOTHINGMODE_HIGHQUALITY',
    documentation: 'Specifies that smoothing is applied using an 8 X 4 box filter.\n\n`= 2 `',
    detail: smoothingMode,
  },
  {
    label: '$GDIP_SMOOTHINGMODE_NONE',
    documentation: 'Specifies that smoothing is not applied.\n\n`= 3 `',
    detail: smoothingMode,
  },
  {
    label: '$GDIP_SMOOTHINGMODE_ANTIALIAS8X4',
    documentation: 'Specifies that smoothing is applied using an 8 X 4 box filter.\n\n`= 4 `',
    detail: smoothingMode,
  },
  {
    label: '$GDIP_SMOOTHINGMODE_ANTIALIAS',
    documentation:
      'Specifies that smoothing is applied using an 8 X 4 box filter.\n\n`= $GDIP_SMOOTHINGMODE_ANTIALIAS8X4 `',
    detail: smoothingMode,
  },
  {
    label: '$GDIP_SMOOTHINGMODE_ANTIALIAS8X8',
    documentation: 'Specifies that smoothing is applied using an 8 X 8 box filter.\n\n`= 5 `',
    detail: smoothingMode,
  },
  {
    label: '$GDIP_RLUM',
    documentation: '`= 0.3086`',
    detail: colorLum,
  },
  {
    label: '$GDIP_GLUM',
    documentation: '`= 0.6094`',
    detail: colorLum,
  },
  {
    label: '$GDIP_BLUM',
    documentation: '`= 0.0820`',
    detail: colorLum,
  },
  {
    label: '$GDIP_INTERPOLATIONMODE_INVALID',
    documentation: 'Reserved (used internally)\n\n`= -1 `',
    detail: interpolation,
  },
  {
    label: '$GDIP_INTERPOLATIONMODE_DEFAULT',
    documentation: 'Specifies the default interpolation mode\n\n`= 0 `',
    detail: interpolation,
  },
  {
    label: '$GDIP_INTERPOLATIONMODE_LOWQUALITY',
    documentation: 'Specifies a low-quality mode\n\n`= 1 `',
    detail: interpolation,
  },
  {
    label: '$GDIP_INTERPOLATIONMODE_HIGHQUALITY',
    documentation: 'Specifies a high-quality mode\n\n`= 2 `',
    detail: interpolation,
  },
  {
    label: '$GDIP_INTERPOLATIONMODE_BILINEAR',
    documentation:
      'Specifies bilinear interpolation. No prefiltering is done. This mode is not suitable for shrinking an image below 50 percent of its original size.\n\n`= 3 `',
    detail: interpolation,
  },
  {
    label: '$GDIP_INTERPOLATIONMODE_BICUBIC',
    documentation:
      'Specifies bicubic interpolation. No prefiltering is done. This mode is not suitable for shrinking an image below 25 percent of its original size\n\n`= 4 `',
    detail: interpolation,
  },
  {
    label: '$GDIP_INTERPOLATIONMODE_NEARESTNEIGHBOR',
    documentation: 'Specifies nearest-neighbor interpolation\n\n`= 5 `',
    detail: interpolation,
  },
  {
    label: '$GDIP_INTERPOLATIONMODE_HIGHQUALITYBILINEAR',
    documentation:
      'Specifies high-quality, bilinear interpolation. Prefiltering is performed to ensure high-quality shrinking.\n\n`= 6 `',
    detail: interpolation,
  },
  {
    label: '$GDIP_INTERPOLATIONMODE_HIGHQUALITYBICUBIC',
    documentation:
      'Specifies high-quality, bicubic interpolation. Prefiltering is performed to ensure high-quality shrinking. This mode produces the highest quality transformed images.\n\n`= 7 `',
    detail: interpolation,
  },
  {
    label: '$GDIP_TEXTRENDERINGHINT_SYSTEMDEFAULT',
    documentation:
      'Specifies that a character is drawn using the currently selected system font smoothing mode (also called a rendering hint).\n\n`= 0 `',
    detail: textRenderingHint,
  },
  {
    label: '$GDIP_TEXTRENDERINGHINT_SINGLEBITPERPIXELGRIDFIT',
    documentation:
      'Specifies that a character is drawn using its glyph bitmap and hinting to improve character appearance on stems and curvature.\n\n`= 1 `',
    detail: textRenderingHint,
  },
  {
    label: '$GDIP_TEXTRENDERINGHINT_SINGLEBITPERPIXEL',
    documentation:
      'Specifies that a character is drawn using its glyph bitmap and no hinting. This results in better performance at the expense of quality.\n\n`= 2 `',
    detail: textRenderingHint,
  },
  {
    label: '$GDIP_TEXTRENDERINGHINT_ANTIALIASGRIDFIT',
    documentation:
      'Specifies that a character is drawn using its antialiased glyph bitmap and hinting. This results in much better quality due to antialiasing at a higher performance cost.\n\n`= 3 `',
    detail: textRenderingHint,
  },
  {
    label: '$GDIP_TEXTRENDERINGHINT_ANTIALIAS',
    documentation:
      'Specifies that a character is drawn using its antialiased glyph bitmap and no hinting. Stem width differences may be noticeable because hinting is turned off.\n\n`= 4 `',
    detail: textRenderingHint,
  },
  {
    label: '$GDIP_TEXTRENDERINGHINT_CLEARTYPEGRIDFIT',
    documentation:
      'Specifies that a character is drawn using its glyph ClearType bitmap and hinting. This type of text rendering cannot be used along with CompositingModeSourceCopy.\n\n`= 5 `',
    detail: textRenderingHint,
  },
  {
    label: '$GDIP_PIXELOFFSETMODE_INVALID',
    documentation: 'Used internally.\n\n`= -1 `',
    detail: pixelOffsetMode,
  },
  {
    label: '$GDIP_PIXELOFFSETMODE_DEFAULT',
    documentation: 'Equivalent to `$GDIP_PIXELOFFSETMODE_NONE`\n\n`= 0 `',
    detail: pixelOffsetMode,
  },
  {
    label: '$GDIP_PIXELOFFSETMODE_HIGHSPEED',
    documentation: 'Equivalent to `$GDIP_PIXELOFFSETMODE_NONE`\n\n`= 1 `',
    detail: pixelOffsetMode,
  },
  {
    label: '$GDIP_PIXELOFFSETMODE_HIGHQUALITY',
    documentation: 'Equivalent to `$GDIP_PIXELOFFSETMODE_HALF`\n\n`= 2 `',
    detail: pixelOffsetMode,
  },
  {
    label: '$GDIP_PIXELOFFSETMODE_NONE',
    documentation: 'Indicates that pixel centers have integer coordinates.\n\n`= 3 `',
    detail: pixelOffsetMode,
  },
  {
    label: '$GDIP_PIXELOFFSETMODE_HALF',
    documentation:
      'Indicates that pixel centers have coordinates that are half way between integer values.\n\n`= 4 `',
    detail: pixelOffsetMode,
  },
  {
    label: '$GDIP_PENSETLINEJOIN_MITER',
    documentation:
      'Specifies a mitered join. This produces a sharp corner or a clipped corner, depending on whether the length of the miter exceeds the miter limit.\n\n`= 0 `',
    detail: lineJoin,
  },
  {
    label: '$GDIP_PENSETLINEJOIN_BEVEL',
    documentation: 'Specifies a beveled join. This produces a diagonal corner.\n\n`= 1 `',
    detail: lineJoin,
  },
  {
    label: '$GDIP_PENSETLINEJOIN_ROUND',
    documentation:
      'Specifies a circular join. This produces a smooth, circular arc between the lines.\n\n`= 2 `',
    detail: lineJoin,
  },
  {
    label: '$GDIP_PENSETLINEJOIN_MITERCLIPPED',
    documentation:
      'Specifies a mitered join. This produces a sharp corner or a beveled corner, depending on whether the length of the miter exceeds the miter limit.\n\n`= 3 `',
    detail: lineJoin,
  },
  {
    label: '$GDIP_FillModeAlternate',
    documentation:
      'Specifies that areas are filled according to the even-odd parity rule. According to this rule, you can determine whether a test point is inside or outside a closed curve as follows: Draw a line from the test point to a point that is distant from the curve. If that line crosses the curve an odd number of times, the test point is inside the curve otherwise, the test point is outside the curve.\n\n`= 0  `',
    detail: fillMode,
  },
  {
    label: '$GDIP_FillModeWinding',
    documentation:
      'Specifies that areas are filled according to the nonzero winding rule. According to this rule, you can determine whether a test point is inside or outside a closed curve as follows: Draw a line from a test point to a point that is distant from the curve. Count the number of times the curve crosses the test line from left to right, and count the number of times the curve crosses the test line from right to left. If those two numbers are the same, the test point is outside the curve; otherwise, the test point is inside the curve.\n\n`= 1  `',
    detail: fillMode,
  },
  {
    label: '$GDIP_QUALITYMODEINVALID',
    documentation: '`= -1`',
    detail: quality,
  },
  {
    label: '$GDIP_QUALITYMODEDEFAULT',
    documentation: '`= 0`',
    detail: quality,
  },
  {
    label: '$GDIP_QUALITYMODELOW',
    documentation: '`= 1`',
    detail: quality,
  },
  {
    label: '$GDIP_QUALITYMODEHIGH',
    documentation: '`= 2`',
    detail: quality,
  },
  {
    label: '$GDIP_COMPOSITINGMODESOURCEOVER',
    documentation:
      'Specifies that when a color is rendered, it is blended with the background color. The blend is determined by the alpha component of the color being rendered\n\n`= 0 `',
    detail: alphaCompositing,
  },
  {
    label: '$GDIP_COMPOSITINGMODESOURCECOPY',
    documentation:
      'Specifies that when a color is rendered, it overwrites the background color. This mode cannot be used along with `$TextRenderingHintClearTypeGridFit`\n\n`= 1 `',
    detail: alphaCompositing,
  },
  {
    label: '$GDIP_COMPOSITINGQUALITYINVALID',
    documentation: 'Invalid quality\n\n`= $GDIP_QUALITYMODEINVALID `',
    detail: alphaCompQuality,
  },
  {
    label: '$GDIP_COMPOSITINGQUALITYDEFAULT',
    documentation: 'Gamma correction is not applied\n\n`= $GDIP_QUALITYMODEDEFAULT `',
    detail: alphaCompQuality,
  },
  {
    label: '$GDIP_COMPOSITINGQUALITYHIGHSPEED',
    documentation:
      'Gamma correction is not applied. High speed, low quality\n\n`= $GDIP_QUALITYMODELOW `',
    detail: alphaCompQuality,
  },
  {
    label: '$GDIP_COMPOSITINGQUALITYHIGHQUALITY',
    documentation:
      'Gamma correction is applied. Composition of high quality and speed.\n\n`= $GDIP_QUALITYMODEHIGH `',
    detail: alphaCompQuality,
  },
  {
    label: '$GDIP_COMPOSITINGQUALITYGAMMACORRECTED',
    documentation: 'Gamma correction is applied\n\n`= 3 `',
    detail: alphaCompQuality,
  },
  {
    label: '$GDIP_COMPOSITINGQUALITYASSUMELINEAR',
    documentation: 'Gamma correction is not applied. Linear values are used\n\n`= 4 `',
    detail: alphaCompQuality,
  },
  {
    label: '$GDIP_HATCHSTYLE_HORIZONTAL',
    documentation: '`= 0`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_VERTICAL',
    documentation: '`= 1`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_FORWARDDIAGONAL',
    documentation: '`= 2`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_BACKWARDDIAGONAL',
    documentation: '`= 3`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_CROSS',
    documentation: '`= 4`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_DIAGONALCROSS',
    documentation: '`= 5`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_05PERCENT',
    documentation: '`= 6`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_10PERCENT',
    documentation: '`= 7`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_20PERCENT',
    documentation: '`= 8`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_25PERCENT',
    documentation: '`= 9`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_30PERCENT',
    documentation: '`= 10`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_40PERCENT',
    documentation: '`= 11`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_50PERCENT',
    documentation: '`= 12`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_60PERCENT',
    documentation: '`= 13`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_70PERCENT',
    documentation: '`= 14`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_75PERCENT',
    documentation: '`= 15`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_80PERCENT',
    documentation: '`= 16`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_90PERCENT',
    documentation: '`= 17`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_LIGHTDOWNWARDDIAGONAL',
    documentation: '`= 18`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_LIGHTUPWARDDIAGONAL',
    documentation: '`= 19`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_DARKDOWNWARDDIAGONAL',
    documentation: '`= 20`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_DARKUPWARDDIAGONAL',
    documentation: '`= 21`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_WIDEDOWNWARDDIAGONAL',
    documentation: '`= 22`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_WIDEUPWARDDIAGONAL',
    documentation: '`= 23`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_LIGHTVERTICAL',
    documentation: '`= 24`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_LIGHTHORIZONTAL',
    documentation: '`= 25`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_NARROWVERTICAL',
    documentation: '`= 26`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_NARROWHORIZONTAL',
    documentation: '`= 27`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_DARKVERTICAL',
    documentation: '`= 28`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_DARKHORIZONTAL',
    documentation: '`= 29`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_DASHEDDOWNWARDDIAGONAL',
    documentation: '`= 30`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_DASHEDUPWARDDIAGONAL',
    documentation: '`= 31`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_DASHEDHORIZONTAL',
    documentation: '`= 32`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_DASHEDVERTICAL',
    documentation: '`= 33`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_SMALLCONFETTI',
    documentation: '`= 34`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_LARGECONFETTI',
    documentation: '`= 35`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_ZIGZAG',
    documentation: '`= 36`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_WAVE',
    documentation: '`= 37`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_DIAGONALBRICK',
    documentation: '`= 38`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_HORIZONTALBRICK',
    documentation: '`= 39`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_WEAVE',
    documentation: '`= 40`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_PLAID',
    documentation: '`= 41`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_DIVOT',
    documentation: '`= 42`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_DOTTEDGRID',
    documentation: '`= 43`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_DOTTEDDIAMOND',
    documentation: '`= 44`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_SHINGLE',
    documentation: '`= 45`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_TRELLIS',
    documentation: '`= 46`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_SPHERE',
    documentation: '`= 47`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_SMALLGRID',
    documentation: '`= 48`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_SMALLCHECKERBOARD',
    documentation: '`= 49`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_LARGECHECKERBOARD',
    documentation: '`= 50`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_OUTLINEDDIAMOND',
    documentation: '`= 51`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_SOLIDDIAMOND',
    documentation: '`= 52`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_TOTAL',
    documentation: '`= 53`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_LARGEGRID',
    documentation: '`= $GDIP_HATCHSTYLE_CROSS`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_MIN',
    documentation: '`= $GDIP_HATCHSTYLE_HORIZONTAL`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_HATCHSTYLE_MAX',
    documentation: '`= $GDIP_HATCHSTYLE_TOTAL - 1`',
    detail: hatchStyle,
  },
  {
    label: '$GDIP_BlurEffectGuid',
    documentation: "`= '{633C80A4-1843-482b-9EF2-BE2834C5FDD4}'`",
    detail: gdiPlus,
  },
  {
    label: '$GDIP_SharpenEffectGuid',
    documentation: "`= '{63CBF3EE-C526-402c-8F71-62C540BF5142}'`",
    detail: gdiPlus,
  },
  {
    label: '$GDIP_ColorMatrixEffectGuid',
    documentation: "`= '{718F2615-7933-40e3-A511-5F68FE14DD74}'`",
    detail: gdiPlus,
  },
  {
    label: '$GDIP_ColorLUTEffectGuid',
    documentation: "`= '{A7CE72A9-0F7F-40d7-B3CC-D0C02D5C3212}'`",
    detail: gdiPlus,
  },
  {
    label: '$GDIP_BrightnessContrastEffectGuid',
    documentation: "`= '{D3A1DBE1-8EC4-4c17-9F4C-EA97AD1C343D}'`",
    detail: gdiPlus,
  },
  {
    label: '$GDIP_HueSaturationLightnessEffectGuid',
    documentation: "`= '{8B2DD6C3-EB07-4d87-A5F0-7108E26A9C5F}'`",
    detail: gdiPlus,
  },
  {
    label: '$GDIP_LevelsEffectGuid',
    documentation: "`= '{99C354EC-2A31-4f3a-8C34-17A803B33A25}'`",
    detail: gdiPlus,
  },
  {
    label: '$GDIP_TintEffectGuid',
    documentation: "`= '{1077AF00-2848-4441-9489-44AD4C2D7A2C}'`",
    detail: gdiPlus,
  },
  {
    label: '$GDIP_ColorBalanceEffectGuid',
    documentation: "`= '{537E597D-251E-48da-9664-29CA496B70F8}'`",
    detail: gdiPlus,
  },
  {
    label: '$GDIP_RedEyeCorrectionEffectGuid',
    documentation: "`= '{74D29D05-69A4-4266-9549-3CC52836B632}'`",
    detail: gdiPlus,
  },
  {
    label: '$GDIP_ColorCurveEffectGuid',
    documentation: "`= '{DD6A0022-58E4-4a67-9D9B-D48EB881A53D}'`",
    detail: gdiPlus,
  },
  {
    label: '$GDIP_AdjustExposure',
    documentation: '[-255..255]\n\n`= 0  `',
    detail: gdiPlus,
  },
  {
    label: '$GDIP_AdjustDensity',
    documentation: '[-255..255]\n\n`= 1  `',
    detail: gdiPlus,
  },
  {
    label: '$GDIP_AdjustContrast',
    documentation: '[-100..100]\n\n`= 2  `',
    detail: gdiPlus,
  },
  {
    label: '$GDIP_AdjustHighlight',
    documentation: '[-100..100]\n\n`= 3 `',
    detail: gdiPlus,
  },
  {
    label: '$GDIP_AdjustShadow',
    documentation: '[-100..100]\n\n`= 4  `',
    detail: gdiPlus,
  },
  {
    label: '$GDIP_AdjustMidtone',
    documentation: '[-100..100]\n\n`= 5  `',
    detail: gdiPlus,
  },
  {
    label: '$GDIP_AdjustWhiteSaturation',
    documentation: '[0..255]\n\n`= 6  `',
    detail: gdiPlus,
  },
  {
    label: '$GDIP_AdjustBlackSaturation',
    documentation: '[0..255]\n\n`= 7  `',
    detail: gdiPlus,
  },
  {
    label: '$GDIP_CurveChannelAll',
    documentation: '`= 0`',
    detail: gdiPlus,
  },
  {
    label: '$GDIP_CurveChannelRed',
    documentation: '`= 1`',
    detail: gdiPlus,
  },
  {
    label: '$GDIP_CurveChannelGreen',
    documentation: '`= 2`',
    detail: gdiPlus,
  },
  {
    label: '$GDIP_CurveChannelBlue',
    documentation: '`= 3`',
    detail: gdiPlus,
  },
  {
    label: '$GDIP_PaletteTypeCustom',
    documentation: 'Arbitrary custom palette provided by caller.\n\n`= 0`',
    detail: colorFormat,
  },
  {
    label: '$GDIP_PaletteTypeOptimal',
    documentation: 'Optimal palette generated using a median-cut algorithm.\n\n`= 1`',
    detail: colorFormat,
  },
  {
    label: '$GDIP_PaletteTypeFixedBW',
    documentation: 'Black and white palette.\n\n`= 2`',
    detail: colorFormat,
  },
  {
    label: '$GDIP_PaletteTypeFixedHalftone8',
    documentation: '8-color, on-off primaries\n\n`= 3 `',
    detail: symmetricHalftone,
  },
  {
    label: '$GDIP_PaletteTypeFixedHalftone27',
    documentation: '3 intensity levels of each color\n\n`= 4 `',
    detail: symmetricHalftone,
  },
  {
    label: '$GDIP_PaletteTypeFixedHalftone64',
    documentation: '4 intensity levels of each color\n\n`= 5 `',
    detail: symmetricHalftone,
  },
  {
    label: '$GDIP_PaletteTypeFixedHalftone125',
    documentation: '5 intensity levels of each color\n\n`= 6 `',
    detail: symmetricHalftone,
  },
  {
    label: '$GDIP_PaletteTypeFixedHalftone216',
    documentation: '6 intensity levels of each color\n\n`= 7 `',
    detail: symmetricHalftone,
  },
  {
    label: '$GDIP_PaletteTypeFixedHalftone252',
    documentation: '6-red, 7-green, 6-blue intensities\n\n`= 8 `',
    detail: asymmetricHalftone,
  },
  {
    label: '$GDIP_PaletteTypeFixedHalftone256',
    documentation: '8-red, 8-green, 4-blue intensities\n\n`= 9 `',
    detail: asymmetricHalftone,
  },
  {
    label: '$GDIP_PaletteFlagsHasAlpha',
    documentation: '`= 0x0001`',
    detail: paletteFlag,
  },
  {
    label: '$GDIP_PaletteFlagsGrayScale',
    documentation: '`= 0x0002`',
    detail: paletteFlag,
  },
  {
    label: '$GDIP_PaletteFlagsHalftone',
    documentation: '`= 0x0004`',
    detail: paletteFlag,
  },
  {
    label: '$GDIP_DitherTypeNone',
    documentation: '`= 0`',
    detail: ditherType,
  },
  {
    label: '$GDIP_DitherTypeSolid',
    documentation:
      'Solid color - picks the nearest matching color with no attempt to halftone or dither. May be used on an arbitrary palette.\n\n`= 1 `',
    detail: ditherType,
  },
  {
    label: '$GDIP_DitherTypeOrdered4x4',
    documentation: '`= 2`',
    detail: ditherType,
  },
  {
    label: '$GDIP_DitherTypeOrdered8x8',
    documentation: '`= 3`',
    detail: ditherType,
  },
  {
    label: '$GDIP_DitherTypeOrdered16x16',
    documentation: '`= 4`',
    detail: ditherType,
  },
  {
    label: '$GDIP_DitherTypeOrdered91x91',
    documentation: '`= 5`',
    detail: ditherType,
  },
  {
    label: '$GDIP_DitherTypeSpiral4x4',
    documentation: '`= 6`',
    detail: ditherType,
  },
  {
    label: '$GDIP_DitherTypeSpiral8x8',
    documentation: '`= 7`',
    detail: ditherType,
  },
  {
    label: '$GDIP_DitherTypeDualSpiral4x4',
    documentation: '`= 8`',
    detail: ditherType,
  },
  {
    label: '$GDIP_DitherTypeDualSpiral8x8',
    documentation: '`= 9`',
    detail: ditherType,
  },
  {
    label: '$GDIP_DitherTypeErrorDiffusion',
    documentation: '`= 10`',
    detail: errorDiffusion,
  },
  {
    label: '$GDIP_DitherTypeMax',
    documentation: '`= 10`',
    detail: errorDiffusion,
  },
  {
    label: '$GDIP_HistogramFormatARGB',
    documentation: '`= 0`',
    detail: histogram,
  },
  {
    label: '$GDIP_HistogramFormatPARGB',
    documentation: '`= 1`',
    detail: histogram,
  },
  {
    label: '$GDIP_HistogramFormatRGB',
    documentation: '`= 2`',
    detail: histogram,
  },
  {
    label: '$GDIP_HistogramFormatGray',
    documentation: '`= 3`',
    detail: histogram,
  },
  {
    label: '$GDIP_HistogramFormatB',
    documentation: '`= 4`',
    detail: histogram,
  },
  {
    label: '$GDIP_HistogramFormatG',
    documentation: '`= 5`',
    detail: histogram,
  },
  {
    label: '$GDIP_HistogramFormatR',
    documentation: '`= 6`',
    detail: histogram,
  },
  {
    label: '$GDIP_HistogramFormatA',
    documentation: '`= 7`',
    detail: histogram,
  },
  {
    label: '$GDIP_TextRenderingHintSystemDefault',
    documentation: '`= 0`',
    detail: textRenderingHint,
  },
  {
    label: '$GDIP_TextRenderingHintSingleBitPerPixelGridFit',
    documentation: '`= 1`',
    detail: textRenderingHint,
  },
  {
    label: '$GDIP_TextRenderingHintSingleBitPerPixel',
    documentation: '`= 2`',
    detail: textRenderingHint,
  },
  {
    label: '$GDIP_TextRenderingHintAntialiasGridFit',
    documentation: '`= 3`',
    detail: textRenderingHint,
  },
  {
    label: '$GDIP_TextRenderingHintAntialias',
    documentation: '`= 4`',
    detail: textRenderingHint,
  },
  {
    label: '$GDIP_TextRenderingHintClearTypeGridFit',
    documentation: '`= 5`',
    detail: textRenderingHint,
  },
  {
    label: '$GDIP_RotateNoneFlipNone',
    documentation: '`= 0`',
    detail: rotateFlipType,
  },
  {
    label: '$GDIP_Rotate90FlipNone',
    documentation: '`= 1`',
    detail: rotateFlipType,
  },
  {
    label: '$GDIP_Rotate180FlipNone',
    documentation: '`= 2`',
    detail: rotateFlipType,
  },
  {
    label: '$GDIP_Rotate270FlipNone',
    documentation: '`= 3`',
    detail: rotateFlipType,
  },
  {
    label: '$GDIP_RotateNoneFlipX',
    documentation: '`= 4`',
    detail: rotateFlipType,
  },
  {
    label: '$GDIP_Rotate90FlipX',
    documentation: '`= 5`',
    detail: rotateFlipType,
  },
  {
    label: '$GDIP_Rotate180FlipX',
    documentation: '`= 6`',
    detail: rotateFlipType,
  },
  {
    label: '$GDIP_Rotate270FlipX',
    documentation: '`= 7`',
    detail: rotateFlipType,
  },
  {
    label: '$GDIP_RotateNoneFlipY',
    documentation: '`= $GDIP_Rotate180FlipX`',
    detail: rotateFlipType,
  },
  {
    label: '$GDIP_Rotate90FlipY',
    documentation: '`= $GDIP_Rotate270FlipX`',
    detail: rotateFlipType,
  },
  {
    label: '$GDIP_Rotate180FlipY',
    documentation: '`= $GDIP_RotateNoneFlipX`',
    detail: rotateFlipType,
  },
  {
    label: '$GDIP_Rotate270FlipY',
    documentation: '`= $GDIP_Rotate90FlipX`',
    detail: rotateFlipType,
  },
  {
    label: '$GDIP_RotateNoneFlipXY',
    documentation: '`= $GDIP_Rotate180FlipNone`',
    detail: rotateFlipType,
  },
  {
    label: '$GDIP_Rotate90FlipXY',
    documentation: '`= $GDIP_Rotate270FlipNone`',
    detail: rotateFlipType,
  },
  {
    label: '$GDIP_Rotate270FlipXY',
    documentation: '`= $GDIP_Rotate90FlipNone`',
    detail: rotateFlipType,
  },
  {
    label: '$GDIP_FRAMEDIMENSION_TIME',
    documentation: '`= "{6AEDBD6D-3FB5-418A-83A6-7F45229DC872}"`',
    detail: multiFrame,
  },
  {
    label: '$GDIP_FRAMEDIMENSION_RESOLUTION',
    documentation: '`= "{84236F7B-3BD3-428F-8DAB-4EA1439CA315}"`',
    detail: multiFrame,
  },
  {
    label: '$GDIP_FRAMEDIMENSION_PAGE',
    documentation: '`= "{7462DC86-6180-4C7E-8E3F-EE7333A7A483}"`',
    detail: multiFrame,
  },
  {
    label: '$GDIP_COLORADJUSTTYPE_DEFAULT',
    documentation: '`= 0`',
    detail: imageAttributesSetThreshold,
  },
  {
    label: '$GDIP_COLORADJUSTTYPE_BITMAP',
    documentation: '`= 1`',
    detail: imageAttributesSetThreshold,
  },
  {
    label: '$GDIP_COLORADJUSTTYPE_BRUSH',
    documentation: '`= 2`',
    detail: imageAttributesSetThreshold,
  },
  {
    label: '$GDIP_COLORADJUSTTYPE_PEN',
    documentation: '`= 3`',
    detail: imageAttributesSetThreshold,
  },
  {
    label: '$GDIP_COLORADJUSTTYPE_TEXT',
    documentation: '`= 4`',
    detail: imageAttributesSetThreshold,
  },
  {
    label: '$GDIP_COLORADJUSTTYPE_COUNT',
    documentation: '`= 5`',
    detail: imageAttributesSetThreshold,
  },
  {
    label: '$GDIP_COLORADJUSTTYPE_ANY',
    documentation: '`= 6`',
    detail: imageAttributesSetThreshold,
  },
];

const completions = fillCompletions(items, CompletionItemKind.Constant, '', 'GDIPlusConstants.au3');
const hovers = completionToHover(completions);

export { completions as default, hovers };
