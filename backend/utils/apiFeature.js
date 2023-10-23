const mongoose = require('mongoose');

class APIFeatures {
    constructor(query, queryStr) {
        
        this.query = query;
        this.queryStr = queryStr;
        if (this.queryStr.batchId) {
            const batchId = new mongoose.Types.ObjectId(this.queryStr.batchId);
            this.queryStr.batchId = batchId;
        }
        if (this.queryStr.id) {
            const _id = this.typeObjecId(this.queryStr.id);
            delete this.queryStr.id;
            this.queryStr._id = _id;
        }
    }

    typeObjecId (ids) {
        if ( Array.isArray(ids) ) {
            let arrayId = []
            ids.forEach((id) => arrayId.push(new mongoose.Types.ObjectId(id)))
            return arrayId;
        }
        return new mongoose.Types.ObjectId(ids);
    }

    search( foruserRoute = null ) {
        
        if (this.queryStr.username){
            const username = {
                    $regex: this.queryStr.username,
                    $options: 'i'
                }
            
            this.queryStr.username = username;
        }
        if ( foruserRoute ) {
            
            const batchExist = {
                $ne: null
            }
            this.queryStr.batchId = {
                ...this.queryStr.batchId,
                ...batchExist
            };
            
        }
        this.query = this.query.find( {...this.queryStr} );
        
        return this;
    }

    update() {
        const queryCopy = { ...this.queryStr }
        const removeFields = ['_id'];
        removeFields.forEach(el => delete queryCopy[el]);
        this.query = this.query.updateMany( { 
            _id: this.queryStr._id
        }, {
            $set: queryCopy
        } );
        return this;
    }

    delete() {
        if(Array.isArray(this.queryStr._id)) {
            let array_del = [];
            this.queryStr._id.forEach((id) => array_del.push(this.query.findByIdAndDelete(id)));
            this.query = array_del;
        } else {
            this.query = this.query.findByIdAndDelete({...this.queryStr});
        }
        return this;
    }
}

module.exports = APIFeatures;