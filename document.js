const fs = require('fs');
let document;

module.exports = {
    documentGet: async () => {
        try {
            document = JSON.parse(fs.readFileSync('document.json'));
        } catch (error) {
            let empyDoc = {};
            document = empyDoc;
            fs.writeFile('document.json', JSON.stringify(empyDoc), (err) => {
                if (err) throw err;
            });
        }
        return document;
    },
    documentStore: async function (data) {
        fs.writeFile('document.json', JSON.stringify(data), (err) => {
            if (err) throw err;
            return 'Data written to file';
        });
    },

}