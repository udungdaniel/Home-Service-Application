const { MongoMemoryServer } = require("mongodb-memory-server");

(async () => {
  try {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGODB_URI = uri;
    process.env.NODE_ENV = "test";

    console.log("Started in-memory MongoDB at", uri);

    // Require the server after setting MONGODB_URI so it connects to memory DB
    require("../server");
  } catch (err) {
    console.error("Failed to start in-memory MongoDB:", err);
    process.exit(1);
  }
})();
