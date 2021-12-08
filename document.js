const fs = require('fs');
let document;

module.exports = {
    documentGet: () => {
        try {
            document = JSON.parse(fs.readFileSync('document.json'));
        } catch (error) {
            let empyDoc = {
                home: [],
                overworld: [],
                nether: [],
                end: []
            };
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