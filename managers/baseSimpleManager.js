
/**
 * A simple in-memory implementation of a storage capability
 * For a more scalable implementation back this with a simple transient-ish disk backed k/v data store such as Redis 
 * 
 * Subclass this Manager class per data type and specify this.typeName in the constructor, because.
 * Override specific CRUD methods as necessary to insert pre/post/replace behavior.
 * 
 */


class BaseSimpleManager {
    constructor( context ) {
        this.context = context
        this.log = context.log
        this.data = { }
        this.dataKeys = []
        this.nextId = 0
        this.typeName = "Undefined"
    }

    getManager(name) {
        const manager = this.context.managers[name]
        return manager
    }

    async add( data, overwrite = false ) {

        let id = (data.id)? parseInt( data.id) : null
    
        if( !id ) {
            id = await this.getNextId()
            data.id = id
        } else {
            if(this.nextId <= id) { 
                this.nextId = id + 1
            }
    
        }

        if( this.data[id] && !overwrite ) {
            throw new Error(`${this.typeName} id ${id} already exists. Cannot add.`)
        }
        this.data[id] = data
        return data
    }

    async update( id, changeData, mode = "set" ) {

        let workingData = this.data[id]
        if( !workingData ) {
            throw new Error(`${this.typeName} object ${id} not found.`)
        }

        const updatedData = await this.mergeUpdateData( workingData, changeData, mode)
        this.data[id] = updatedData

        return updatedData
    }

    /**
     * Overide this to modify update data integration
     * @param {*} workingData 
     * @param {*} changeData 
     */
    async mergeUpdateData( workingData, changeData, mode) {
        return { ...workingData, ...changeData }
    }

    async delete( id ) {
        let workingData = this.data[id]
        if( !workingData ) {
            throw new Error(`${this.typeName} object ${id} not found.`)
        }
        
        delete this.data[id]
       
        return true
    }

    async get( id ) {
        let data = this.data[id]
        if( !data ) {
            throw new Error(`${this.typeName} object ${id} not found.`)
        }
        return data
    }

    async list( offset = 0, pagesize = 100 ) {

        if( offset == 0 ) {
            await this.initializeList()
        }
        return await this.getListPage(offset, pagesize)

    }

    async exists( ids ) {
        let hits = []
        let allExists = true
        hits = ids.map( id => { return this.data[id] != null})
        allExists = hits.reduce( ( allExists, hit) => { return allExists && hit })
        return { each: hits, all: allExists }
    }

    /**
     * get total count of stored objects
     */
    async count() { 
        const keys = Object.keys(this.data) 
        return keys.length
    }

    async initializeList() {
        this.dataKeys = Object.keys(this.data)
    }

    async getListPage( offset, pagesize ) {
        const keyslice = this.dataKeys.slice(offset, pagesize)
        const page = keyslice.map((key) => { return this.data[key]})
        return page
    }

    async getNextId() {
        const id = this.nextId
        this.nextId += 1
        return id.toString()
    }
}

exports.BaseSimpleManager = BaseSimpleManager