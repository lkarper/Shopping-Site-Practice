const fs = require('fs');
const crypto = require('crypto');

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
        const records = await this.getAll();  // retrieve array of users
        records.push(attrs);  // add new user to array of users
        await this.writeAll(records);  // write the updated 'records' array back to this.filename
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
}

const test = async () => {
    const repo = new UsersRepository('users.json');
    await repo.update('eeeeee', {password: "mypassword"});
    
};

test();