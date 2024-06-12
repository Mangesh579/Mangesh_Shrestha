const fs = require('fs');
const csv = require('csv-parser');
const argv = require('minimist')(process.argv.slice(2));


if (!argv.input || !argv.output) {
  console.error('Usage: node csvToJson.js --input <input_file_path> --output <output_file_path>');
  process.exit(1);
}

const inputFile = argv.input;
const outputFile = argv.output;
const products = [];


fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (row) => {
   
    if (!row.productId || !row.name || !row.price) {
      console.error('Invalid data format: missing required fields.');
      process.exit(1);
    }

    
    const price = parseFloat(row.price);
    if (isNaN(price)) {
      console.error('Invalid data format: price is not a valid number.');
      process.exit(1);
    }

    
    const product = {
      productId: row.productId,
      name: row.name,
      price: price,
      
    };
    products.push(product);
  })
  .on('end', () => {
   
    fs.writeFile(outputFile, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error('Error writing to output file:', err);
        process.exit(1);
      }
      console.log('Conversion completed. JSON data written to', outputFile);
    });
  })
  .on('error', (err) => {
    console.error('Error reading CSV file:', err);
    process.exit(1);
  });
