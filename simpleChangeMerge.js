
const fs = require( "fs" )
const { UserManager } = require("./managers/userManager")
const { SongManager } = require("./managers/songManager")
const { PlaylistManager } = require( "./managers/playlistManager")
class SimpleChangeMerge {
    constructor( context ) {
        this.context = context
        this.log = this.context.log
        this.changeCount = 0
        this.userManager = new UserManager(this.context)
        this.songManager = new SongManager(this.context)
        this.playlistManager = new PlaylistManager(this.context)
        let managers = { user: this.userManager, song: this.songManager, playlist: this.playlistManager}
        this.context.managers = managers

        this.verbose = false

    }

    async run( dataFile, changeFile, outputFile, verbose = false ) {
        this.verbose = verbose
        this.log.info(`run: ${dataFile} ${changeFile} ${outputFile} verbose: ${this.verbose}`)
        await this.loadData( dataFile ) 
        await this.doChanges( changeFile ) 
        await this.outputChanges( outputFile)
        return this.changeCount
    }

    async loadData( dataFile ) {
        const rawdata = fs.readFileSync(dataFile);
        const data = JSON.parse(rawdata);
        await this.loadTypeData( data.users, this.userManager, "User")
        await this.loadTypeData( data.songs, this.songManager, "Song")
        await this.loadTypeData( data.playlists, this.playlistManager, "Playlist")
    }
    
    async doChanges( changeFile ) {
        const rawdata = fs.readFileSync(changeFile);
        const changeSpec = JSON.parse(rawdata);
        changeSpec.changes.forEach( async change => { await this.doChange( change) })
    }

    async doChange( change ) {
        let changed = 0
        switch( change.type ) {
            case "playlist":
                changed = await this.doPlaylistChange( change) 
                break
            case "user" :
                throw new Error("Changes to Users not supported at this time")
                break
            case "song":
                throw new Error("Changes to Songs not supported at this time")
                break 
            default: 
                throw new Error(`Change type ${change.type} is not recognized. Only "playlist", "user" or "song" are allowed`)
        }
        this.changeCount += changed

    }

    async doPlaylistChange( change ) {

        let changed = null
        switch( change.action ) {
            case "add":
                changed = await this.playlistManager.add( change.data )
                break 
            case "update":
                changed = await this.playlistManager.update( change.id, change.data )
                break
            case "delete" :
                await this.playlistManager.delete( change.id )
                break
            default:
                throw new Error( `Change Action: ${change.action} is not supported for Playlists`)
        }
        
        return 1
    }

    async loadTypeData( data, manager, typeName) {
        data.forEach( async i => {
            await manager.add( i )
        })
        if( this.verbose ) {
            const count = await manager.count()
            this.log.info(`${typeName} data loaded count: ${count}`)
        }

    }

    async outputChanges( outputFile ) {
        let outputData = {}
        await this.outputTypeData( outputData, this.userManager, "users")
        await this.outputTypeData( outputData, this.songManager, "songs")
        await this.outputTypeData( outputData, this.playlistManager, "playlists" )
        const jsonOutput = JSON.stringify( outputData, null, 2)
        fs.writeFileSync(outputFile, jsonOutput);

    }
    
    async outputTypeData( data,  manager, listName ) {

        let results
        let offset = 0
        let pagesize = 100
        let objList = []
        do {
            results = await manager.list( offset, pagesize)
            objList = objList.concat(results)
            offset += pagesize
        } while( results.length > 0 )

        data[listName] = objList
    }
}

exports.SimpleChangeMerge = SimpleChangeMerge