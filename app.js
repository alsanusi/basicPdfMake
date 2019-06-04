// Express
const express = require('express')
const app = express()
// pdfMake
const pdfPrinter = require('pdfmake')
// fileStream
const fs = require('fs')
// JSON Data
const jsonData = require('./basicData')

//Font Files
var fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
}
const printer = new pdfPrinter(fonts)

app.get('/generate-pdf', (req, res) => {

    var bodyData = []

    jsonData.forEach(function (d) {
        var dataRow = []
        dataRow.push(d.id)
        dataRow.push(d.name)
        dataRow.push(d.age)
        dataRow.push(d.gender)
        bodyData.push(dataRow)
    })

    var tableLayout = {
        // Page Orientation - You can Change to 'potrait' or 'landscape'.
        pageOrientation: 'landscape',
        // Content of the Data to Display
        content: [{
                // Text to Show
                text: 'Data List',
                // Styles
                style: 'header'
            },
            {
                text: 'List of JSON Data Convert to PDF',
                style: 'subHeader',
                // Line Height
                lineHeight: 2
            },
            {
                // Table Layout - You can Change to 'noBorders', 'headerLineOnly', or 'lightHorizontalLines'.
                layout: 'headerLineOnly',
                table: {
                    // Table Widths, which need to declare based on how many data you want to show.
                    // In my case, I just need to show: id, name, age and gender.
                    // Which is total of 4 Data.
                    widths: ['auto', 'auto', 'auto', 'auto'],
                    body: bodyData
                }
            }
        ],
        // Styles
        styles: {
            // Style for header
            header: {
                fontSize: 25,
                bold: true
            },
            // Style for subHeader
            subHeader: {
                fontSize: 20
            }
        }
    }

    generatePdf(tableLayout).then(res.redirect('/success-generate'))

})

// Function to Build and Write the PDF to Root Folder.
async function generatePdf(data) {
    // Build the PDF
    var pdfDoc = printer.createPdfKitDocument(data)
    // Writing to Disk - dataPdf.pdf
    pdfDoc.pipe(fs.createWriteStream('dataPdf.pdf'))
    pdfDoc.end()
}

// Success Message - after Generate the PDF
app.get('/success-generate', (req, res) => {
    res.send('Generate PDF Success!')
})

// Index
app.get('/', (req, res) => {
    res.send('Hi - You can Change the EndPoint to /generate-pdf for generate the JSON Data to PDF.')
})

// Listening Port
app.listen(3000, () => {
    console.log('Server running at port 3000: http://127.0.0.1:3000')
})