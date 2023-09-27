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
            const _id = this.queryStr.id;
            delete this.queryStr.id;
            this.queryStr._id = _id;
        }
    }

    search() {
        
        if (this.queryStr.username){
            const username = {
                    $regex: this.queryStr.username,
                    $options: 'i'
                }
            
            this.queryStr.username = username;
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
        if(Object.keys(this.queryStr._id).length > 1) {
            this.query = this.query.deleteMany({ _id: {
                $in: [...this.queryStr._id]
            }});
        } else {
            this.query = this.query.findByIdAndDelete({...this.queryStr});
        }
        return this;
    }
}

module.exports = APIFeatures;