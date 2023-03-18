const GenericRepository = require('../repository/generic-repository');

class GenericService {
    constructor(model) {
        this.repository = new GenericRepository(model);
    }

    async getAllDocuments() {
        try {
            const documents = await this.repository.getAllDocuments();
            return documents;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDocumentByField(query) {
        try {
            const document = await this.repository.getDocumentByField(query);
            if (!document) {
                return null;
            }
            return document;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDocumentsByField(query) {
        try {
            const documents = await this.repository.getDocumentsByField(query);
            if (!documents) {
                return null;
            }
            return documents;
        } catch (error) {
            throw new Error(error.message);
        }
    }



    async deleteDocumentByField(query) {
        try {
            const deletedDocument = await this.repository.deleteDocumentByField(query);
            if (!deletedDocument) {
                throw new Error(`Document not found`);
            }
            return deletedDocument;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateDocumentByField(query, newData) {
        try {
            const updatedDocument = await this.repository.updateDocumentByField(query, newData);
            return updatedDocument;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createDocument(documentData) {
        try {
            const newDocument = await this.repository.createDocument(documentData);
            return newDocument;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDocumentById(id) {
        try {
            const document = await this.repository.getDocumentById(id);
            if (!document) {
                return null;
            }
            return document;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteDocumentById(id) {
        try {
            const deletedDocument = await this.repository.deleteDocumentById(id);
            if (!deletedDocument) {
                throw new Error(`Document with id ${id} not found`);
            }
            return deletedDocument;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateDocumentById(id, newData) {
        try {
            const updatedDocument = await this.repository.updateDocumentById(id, newData);
            return updatedDocument;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async countDocuments(query) {
        try {
            const count = await this.repository.countDocuments(query);
            return count;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = GenericService;
