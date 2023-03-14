class GenericService {
    constructor(model) {
        this.model = model;
    }

    async getAllDocuments(query = {}) {
        try {
            const documents = await this.model.find(query);
            return documents;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDocumentByField(query) {
        try {
            const document = await this.model.findOne(query);
            if (!document) {
                return null;
            }
            return document;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteDocumentByField(query) {
        try {
            const deletedDocument = await this.model.findOneAndDelete(query);
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
            const existingDocument = await this.model.findOne(query);
            if (!existingDocument) {
                throw new Error(`Document not found`);
            }

            const updatedDocumentData = Object.assign({}, existingDocument.toObject(), newData);
            const updatedDocument = await this.model.findOneAndUpdate(query, { $set: updatedDocumentData }, { new: true });
            return updatedDocument;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createDocument(documentData){
        try {
            const newDocument = new this.model(documentData);
            const savedDocument = await newDocument.save();
            return savedDocument;
        } catch (error) {
            throw new Error(error.message);
        }
    };
}

module.exports = GenericService;
