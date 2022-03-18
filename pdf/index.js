'use strict';

/**
 * @author Copyright RIKSOF (Private) Limited.
 */
const { readFile } = require( 'fs/promises' );
const { PDFDocument } = require( 'pdf-lib' );
const fontkit = require( '@pdf-lib/fontkit' );

// Constants
const TYPE_TEXT = 'text';
const TYPE_IMAGE = 'image';

/**
 * Given a file name, we embed the give font and return the font reference.
 *
 * @param {PDFDocument} pdfDoc                PDF document to embed font to.
 * @param {string} pth                        Path to the file.
 *
 * @returns {any} font                        Loaded font reference.
 */
function loadFont( pdfDoc, pth ) {
  return readFile( pth ).then(function onFontRead( buff ) {
    return pdfDoc.embedFont( buff );
  });
}

/**
 * Function processes the text request.
 *
 * @param {PDFPage[]} pages                   The pages that are part of this pdf.
 * @param {any} c                             Current Data to write to pdf.
 * @param  {PDFFont[]} fonts                  The fonts to be used for editing
 *                                            pdf.
 *
 * @returns {Promise<any>} p                  Promise is returned on conclusion
 *                                            of operation.
 */
function writeTextToPdf( pages, c, fonts ) {
  const pg = pages[ c.page ];
  const font = fonts[ c.font ];
  const opt = Object.assign( { font }, c.options );

  return Promise.resolve( pg.drawText( c.text, opt ) );
}

/**
 * Function processes the image requests.
 *
 * @param {PDFDocument} pdfDoc                PDF document to embed image to.
 * @param {PDFPage[]} pages                   The pages that are part of this pdf.
 * @param {any} c                             Current Data to write to pdf.
 *
 * @returns {void} Undefined.
 */
function writeImageToPdf( pdfDoc, pages, c ) {
  const pg = pages[ c.page ];

  // Embed the image and then proceed to place it on the page.
  const p = c.png ? pdfDoc.embedPng( c.png ) : pdfDoc.embedJpg( c.jpg );

  return p.then(function onImageEmbedded( img ) {
    const opt = Object.assign( {}, c.options );

    // If we need to scale the image.
    if ( opt.scale ) {
      const d = img.scale( opt.scale );
      opt.width = d.width;
      opt.height = d.height;

      delete opt.scale;
    }

    // Options are ready so write image to pdf.
    return pg.drawImage( img, opt );
  });
}

/**
 * Write a pdf with given data. File name for the pdf is given and we return
 * a blob of the file. This file can then be attached to an email or uploaded
 * as required.
 *
 * Example usage:
 *
 * file:    The pdf template file path.
 * fonts:   An array of paths to load all fonts. When writing text, the index is
 *          used to select font.
 *
 * {
 *   "task": "lambda",
 *   "options": {
 *     "env": {
 *       "file": "",
 *       "fonts": []
 *     },
 *     "functionName": "pdf"
 *   }
 * }
 *
 *
 * @param {any} data                          Data passed to this function.
 *                                            data.env has the environment variables
 *                                            and data.current has the data.
 * @param {any} context                       Client context. Unused.
 * @param {function} callback                 Callback function to pass back
 *                                            the response.
 *
 * @returns {undefined} None.
 */
module.exports.handler = function writePdf( data, context, callback ) {
  // Sample code that works with promises. You will likely need to change
  // what p is set to.
  let pdfDoc;

  return readFile( data.env.file ).then(function onPdfRead( buff ) {
    return PDFDocument.load( buff );
  }).then(function onPdfLoaded( pdf ) {
    pdfDoc = pdf;

    // We start by registering all fonts passed in options.
    pdfDoc.registerFontkit( fontkit );
    const p = [];

    // Now load all the fonts.
    for( const f of data.env.fonts ) {
      p.push( loadFont( pdfDoc, f ) );
    }

    // Wait for all the fonts to load.
    return Promise.all( p );
  }).then(function onFontLoaded( fonts ) {
    const pages = pdfDoc.getPages();

    for ( const c of data.current ) {
      switch ( c.type ) {
        case TYPE_TEXT:
          writeTextToPdf( pages, c, fonts );
          break;

        case TYPE_IMAGE:
          writeImageToPdf( pdfDoc, pages, c );
          break;
      }
    }

    return pdfDoc.save();
  }).then(function onPdfSucces( res ) {
    // We have a successful response.
    callback( null, res );
  }).catch(function oWritePdfError( error ) {
    console.log( error );
    callback( error, null );
  });
};
