"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const migrate_1 = require("./migrate");
const seedData_1 = require("./seedData");
const database_1 = __importDefault(require("../config/database"));
const setup = async () => {
    try {
        console.log('🚀 Starting database setup...');
        await (0, migrate_1.createTables)();
        await (0, seedData_1.seedAll)();
        console.log('🎉 Database setup completed successfully!');
    }
    catch (error) {
        console.error('💥 Database setup failed:', error);
        throw error;
    }
    finally {
        await database_1.default.end();
    }
};
exports.setup = setup;
if (require.main === module) {
    setup()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
