import fs from 'fs';

const storeData = (data: any, filename: string) => {
    try {
        // Check if file exists
        if (!fs.existsSync(filename)) {
            // If not, create a new file with an array containing the data
            fs.writeFileSync(filename, JSON.stringify([data], null, 2));
        } else {
            // If file exists, read the file
            const fileData = fs.readFileSync(filename, 'utf-8');
            // Check if fileData is not an empty string
            if (fileData) {
                // Parse the JSON data to an array
                const jsonArray = JSON.parse(fileData);
                // Push the new data to the array
                jsonArray.push(data);
                // Write the updated array back to the file
                fs.writeFileSync(filename, JSON.stringify(jsonArray, null, 2));
            } else {
                // If fileData is an empty string, initialize the file with an array containing the data
                fs.writeFileSync(filename, JSON.stringify([data], null, 2));
            }
        }
        console.log(`Data has been written to ${filename}`);
    } catch (error: any) {
        console.error(`Error writing to ${filename}:`, error.message);
    }
};

export default storeData;
