/**
 * Returns an array of objects read from a file with the following extensions (.xlsx, .csv)
 * @param {String} filename The path of the file to be imported from
 * @param {Object} fields An object schema specifying about the fields extracted from the file
 * @param {Function} cb The callback to be invoked upon completion
 * @returns {Promise} A promise
 */
export default function importFromFile(filename, fields, cb) {
  // Check extension of file
  // Check if file exists in path
  // Open file stream
  // Read line by line
  // Extract data from line according to fields schema
  // Close file stream
  // Return list of extracted data
  // If any error happens return a reject promise
}
