const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
    constructor(filename) {   //called immediately when a new instance is created
        if (!filename) {
            throw new Error('Creating a repository requires a filename');
        }

        this.filename = filename;
        try {
            fs.accessSync(this.filename);  // checks to see if the filename already exists
        } catch (err) {
            fs.writeFileSync(this.filename, '[]'); // creates file if none exists
        }
    }

    async getAll() { // Open the file, read its contents, parse the contents, return the parsed data
        return JSON.parse(await fs.promises.readFile(this.filename, {encoding: 'utf8'}));
    }

    async create(attrs) {
        attrs.id = this.randomId();
        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64);

        const records = await this.getAll();  // retrieve array of users
        const record = {
            ...attrs,
            password: `${buf.toString('hex')}.${salt}`
        };
        records.push(record);  // add new user to array of users
        await this.writeAll(records);  // write the updated 'records' array back to this.filename
        
        return record;
    }

    async comparePasswords(saved, supplied) {  // saved -> password saved in our database (hashed.salt); supplied -> password given by user trying to sign in  
        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);
        
        return hashed === hashedSuppliedBuf.toString('hex');
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));  // write the updated 'records' array back to this.filename
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete (id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id ===id)

        if (!record) {
            throw new Error(`Record with id ${id} not found`);
        }

        Object.assign(record, attrs);  // combines the key:value pairs of second parameter into first parameter object
        await this.writeAll(records);
    }

    async getOneBy (filters) {
        const records = await this.getAll();

        for (let record of records) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found) {
                return record;
            }
        }
    }
}

module.exports = new UsersRepository('users.json');
