````

---


**User:**
Show me how to make a database system, with IN MEMORY databases with asynchronous perennial storage, the data must not be lost if it is stopped. JSON
Node.js without framework.  I can't use express or anything else.

- SGBD must be RESTful in vanilla Node.js without framework.
- All interactions with the database are done through web service calls.
- The database must be coded in Node.js and not use any framework!
- The database system must have two databases and they can contain multiple data tables.
- Calls to web services must be made in Curl commands
- A second server is needed for this interface

📁 project
|
├── 📁 database
| ├── 📄 db.js
| ├── 📄 memory.js
| ├── 📄 storage.js
| ├── 📄 table.js
| ├── 📄 db_controller.js
| └── 📄 storage_controller.js
|
├── 📁 server
| ├── 📄 server.js
| └── 📄 server_controller.js
|
├── 📄 app.js
└── 📄 requirements.txt


---

**ChatGPT:**
To create a database system with IN MEMORY databases with asynchronous perennial storage and without using any framework in Node.js, you can follow the steps below:
Step 1: Create the project directory and install the required dependencies. In this case, we need the <code>body-parser</code> and <code>http</code> modules. You can use the following command to install these modules:
```css
css
Copy code
npm install body-parser http
````

Step 2: Create the following folder structure:

```css
css
Copy code
📁 project
|
├── 📁 database
| ├── 📄 db.js
| ├── 📄 memory.js
| ├── 📄 storage.js
| ├── 📄 table.js
| ├── 📄 db_controller.js
| └── 📄 storage_controller.js
|
├── 📁 server
| ├── 📄 server.js
| └── 📄 server_controller.js
|
├── 📄 app.js
└── 📄 requirements.txt
```

Step 3: Define the database schema and tables in the <code>db.js</code> file. In this example, we will create two databases named <code>db1</code> and <code>db2</code>, each containing two tables named <code>table1</code> and <code>table2</code>. The schema will be defined using JSON objects.

```yaml
yaml
Copy code
// db.js
const db = {
  db1: {
    table1: [],
    table2: []
  },
  db2: {
    table1: [],
    table2: []
  }
};

module.exports = db;
```

Step 4: Define the memory and storage classes in the <code>memory.js</code> and <code>storage.js</code> files, respectively. The memory class will be responsible for storing the data in memory, while the storage class will be responsible for storing the data in a file. We will use the <code>fs</code> module to write the data to a file. Both classes will have methods to add, get, and delete data from the databases and tables.

```kotlin
kotlin
Copy code
// memory.js
class Memory {
  constructor() {
    this.data = {};
  }

  add(database, table, data) {
    if (!this.data[database]) {
      this.data[database] = {};
    }

    if (!this.data[database][table]) {
      this.data[database][table] = [];
    }

    this.data[database][table].push(data);
  }

  get(database, table) {
    if (!this.data[database] || !this.data[database][table]) {
      return [];
    }

    return this.data[database][table];
  }

  delete(database, table, index) {
    if (!this.data[database] || !this.data[database][table]) {
      return;
    }

    this.data[database][table].splice(index, 1);
  }
}

module.exports = Memory;
```

```kotlin
kotlin
Copy code
// storage.js
const fs = require('fs');

class Storage {
  constructor(filename) {
    this.filename = filename;
  }

  load() {
    try {
      const data = fs.readFileSync(this.filename, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }

  save(data) {
    try {
      const jsonData = JSON.stringify(data);
      fs.writeFileSync(this.filename, jsonData, 'utf8');
    } catch (error) {
      console.error(error);
    }
  }

  add(database, table, data) {
    const storedData = this.load();

    if (!storedData[database]) {
      storedData[database] = {};
    }

    if (!storedData[database][table]) {
      storedData[database][table] = [];
    }

    storedData[database][
```

---

**User:**
You cut off where you left off you cut the code block `storedData[database][ `

---

**ChatGPT:**

```scss
scss
Copy code
    storedData[database][table].push(data);

    this.save(storedData);
  }

  get(database, table) {
    const storedData = this.load();

    if (!storedData[database] || !storedData[database][table]) {
      return [];
    }

    return storedData[database][table];
  }

  delete(database, table, index) {
    const storedData = this.load();

    if (!storedData[database] || !storedData[database][table]) {
      return;
    }

    storedData[database][table].splice(index, 1);

    this.save(storedData);
  }
}

module.exports = Storage;
```

Step 5: Define the table class in the <code>table.js</code> file. This class will have methods to add, get, and delete data from a table. The class will use either the Memory or Storage class depending on whether the data needs to be stored in memory or in a file.

```kotlin
kotlin
Copy code
// table.js
const Memory = require('./memory');
const Storage = require('./storage');

class Table {
  constructor(database, name, inMemory) {
    this.database = database;
    this.name = name;

    if (inMemory) {
      this.store = new Memory();
    } else {
      this.store = new Storage(`${database}_${name}.json`);
    }
  }

  add(data) {
    this.store.add(this.database, this.name, data);
  }

  get() {
    return this.store.get(this.database, this.name);
  }

  delete(index) {
    this.store.delete(this.database, this.name, index);
  }
}

module.exports = Table;
```

Step 6: Define the database controller and storage controller classes in the <code>db_controller.js</code> and <code>storage_controller.js</code> files, respectively. The database controller class will have methods to create, delete, and get tables from a database. The storage controller class will have methods to save and load data from a file.

```kotlin
kotlin
Copy code
// db_controller.js
const Table = require('./table');

class DbController {
  constructor() {
    this.databases = {};
  }

  createDatabase(name) {
    if (!this.databases[name]) {
      this.databases[name] = {};
    }
  }

  deleteDatabase(name) {
    delete this.databases[name];
  }

  createTable(database, name, inMemory) {
    if (!this.databases[database]) {
      this.createDatabase(database);
    }

    if (!this.databases[database][name]) {
      this.databases[database][name] = new Table(database, name, inMemory);
    }
  }

  getTable(database, name) {
    if (!this.databases[database] || !this.databases[database][name]) {
      return null;
    }

    return this.databases[database][name];
  }
}

module.exports = DbController;
```

```javascript
javascript
Copy code
// storage_controller.js
const fs = require('fs');

class StorageController {
  constructor() {
    this.filename = 'database.json';
  }

  load() {
    try {
      const data = fs.readFileSync(this.filename, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }

  save(databases) {
    try {
      const jsonData = JSON.stringify(databases);
      fs.writeFileSync(this.filename, jsonData, 'utf8');
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = StorageController;
```

Step 7: Define the server controller class in the <code>server_controller.js</code> file. This class will have methods to handle HTTP requests and call the appropriate methods on the DbController and StorageController classes.

---

**User:**
You cut off where you left off you cut : Step 7: Define the server controller class in the server_controller.js

---

**ChatGPT:**
Apologies for that, here's Step 7:

```javascript
javascript
Copy code
// server_controller.js
const DbController = require('../database/db_controller');
const StorageController = require('../database/storage_controller');

class ServerController {
  constructor() {
    this.dbController = new DbController();
    this.storageController = new StorageController();
  }

  handleRequest(request, response) {
    const method = request.method;
    const url = request.url;

    if (method === 'POST' && url === '/database') {
      this.createDatabase(request, response);
    } else if (method === 'DELETE' && url.startsWith('/database/')) {
      this.deleteDatabase(request, response);
    } else if (method === 'POST' && url.startsWith('/database/')) {
      this.createTable(request, response);
    } else if (method === 'GET' && url.startsWith('/database/')) {
      this.getTable(request, response);
    } else if (method === 'POST' && url.startsWith('/data/')) {
      this.addData(request, response);
    } else if (method === 'GET' && url.startsWith('/data/')) {
      this.getData(request, response);
    } else if (method === 'DELETE' && url.startsWith('/data/')) {
      this.deleteData(request, response);
    } else {
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.write('404 Not Found');
      response.end();
    }
  }

  createDatabase(request, response) {
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });
    request.on('end', () => {
      const name = JSON.parse(body).name;
      this.dbController.createDatabase(name);
      this.storageController.save(this.dbController.databases);
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({ message: `Database ${name} created.` }));
      response.end();
    });
  }

  deleteDatabase(request, response) {
    const name = request.url.split('/')[2];
    this.dbController.deleteDatabase(name);
    this.storageController.save(this.dbController.databases);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify({ message: `Database ${name} deleted.` }));
    response.end();
  }

  createTable(request, response) {
    const urlParts = request.url.split('/');
    const database = urlParts[2];
    const name = urlParts[3];
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });
    request.on('end', () => {
      const inMemory = JSON.parse(body).inMemory;
      this.dbController.createTable(database, name, inMemory);
      this.storageController.save(this.dbController.databases);
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({ message: `Table ${name} created.` }));
      response.end();
    });
  }

  getTable(request, response) {
    const urlParts = request.url.split('/');
    const database = urlParts[2];
    const name = urlParts[3];
    const table = this.dbController.getTable(database, name);
    if (table) {
      const data = table.get();
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify(data));
      response.end();
    } else {
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.write(`Table ${name} not found.`);
      response.end();
    }
  }

  addData(request, response) {
    const urlParts = request.url.split
```

---

**User:**
You cut off where you left off you cut the code block ``` addData(request, response) {

````

---

**ChatGPT:**
Apologies for the error, here's the continuation of the code:
```javascript
javascript
Copy code
 addData(request, response) {
   const urlParts = request.url.split('/');
   const database = urlParts[2];
   const tableName = urlParts[3];
   let body = '';
   request.on('data', chunk => {
     body += chunk.toString();
   });
   request.on('end', () => {
     const data = JSON.parse(body);
     const table = this.dbController.getTable(database, tableName);
     if (table) {
       table.add(data);
       this.storageController.save(this.dbController.databases);
       response.writeHead(200, { 'Content-Type': 'application/json' });
       response.write(JSON.stringify({ message: 'Data added successfully.' }));
       response.end();
     } else {
       response.writeHead(404, { 'Content-Type': 'text/plain' });
       response.write(`Table ${tableName} not found.`);
       response.end();
     }
   });
 }

 getData(request, response) {
   const urlParts = request.url.split('/');
   const database = urlParts[2];
   const tableName = urlParts[3];
   const id = urlParts[4];
   const table = this.dbController.getTable(database, tableName);
   if (table) {
     const data = table.get(id);
     if (data) {
       response.writeHead(200, { 'Content-Type': 'application/json' });
       response.write(JSON.stringify(data));
       response.end();
     } else {
       response.writeHead(404, { 'Content-Type': 'text/plain' });
       response.write(`Data with id ${id} not found.`);
       response.end();
     }
   } else {
     response.writeHead(404, { 'Content-Type': 'text/plain' });
     response.write(`Table ${tableName} not found.`);
     response.end();
   }
 }

 deleteData(request, response) {
   const urlParts = request.url.split('/');
   const database = urlParts[2];
   const tableName = urlParts[3];
   const id = urlParts[4];
   const table = this.dbController.getTable(database, tableName);
   if (table) {
     table.delete(id);
     this.storageController.save(this.dbController.databases);
     response.writeHead(200, { 'Content-Type': 'application/json' });
     response.write(JSON.stringify({ message: 'Data deleted successfully.' }));
     response.end();
   } else {
     response.writeHead(404, { 'Content-Type': 'text/plain' });
     response.write(`Table ${tableName} not found.`);
     response.end();
   }
 }
}

module.exports = ServerController;
````
