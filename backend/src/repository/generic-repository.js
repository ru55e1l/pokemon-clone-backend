class GenericRepository {
    constructor(model) {
        this.model = model;
    }

    async getAllDocuments() {
        try {
            const documents = await this.model.find();
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

    async getDocumentsByField(query) {
        try {
            const documents = await this.model.find(query).exec();
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

    async getDocumentById(id) {
        try {
            const document = await this.model.findById(id);
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
            const deletedDocument = await this.model.findByIdAndDelete(id);
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
            const existingDocument = await this.model.findById(id);
            if (!existingDocument) {
                throw new Error(`Document not found`);
            }

            const updatedDocumentData = Object.assign({}, existingDocument.toObject(), newData);
            const updatedDocument = await this.model.findByIdAndUpdate(id, { $set: updatedDocumentData }, { new: true });
            return updatedDocument;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async countDocuments(query) {
        try {
            const count = await this.model.countDocuments(query);
            return count;
        } catch (error) {
            throw new Error(error.message);
        }
    }

}

module.exports = GenericRepository;
