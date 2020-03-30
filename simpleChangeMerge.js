
const fs = require( "fs" )
const { UserManager } = require("./managers/userManager")
const { SongManager } = require("./managers/songManager")
const { PlaylistManager } = require( "./managers/playlistManager")
class SimpleChangeMerge {
    constructor( context ) {
        this.context = context
        this.log = this.context.log
        this.changeCount = 0
        this.userManager = new UserManager(context)
        this.songManager = new SongManager(context)
        this.playlistManager = new PlaylistManager(context)
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
        await this.loadUsers( data.users ) 
        await this.loadSongs( data.songs)
        await this.loadPlaylists( data.playlists)
    }
    
    async doChanges( changeFile ) {
        const rawdata = fs.readFileSync(changeFile);
        const changeSpec = JSON.parse(rawdata);
        // TODO: change to old style for loop so that awaits work properly

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

    async loadUsers( users ) {
        users.forEach( async user => {
            const added = await this.userManager.add( user) 
        })
        if( this.verbose) {
            const userCount = await this.userManager.count()
            this.log.info(`Users Loaded: ${userCount}`)
        }
    }

    async loadSongs( songs ) {
        songs.forEach( async song => {
            const added = await this.songManager.add( song) 
        })
        if( this.verbose) {
            const songCount = await this.songManager.count()
            this.log.info(`Songs Loaded: ${songCount}`)
        }
    }

    async loadPlaylists( playlists ) {
        playlists.forEach( async playlist => {
            const added = await this.playlistManager.add( playlist) 
        })

        if( this.verbose) {
            const playlistCount = await this.playlistManager.count()
            this.log.info(`Playlists Loaded: ${playlistCount}`)
        }
    }

    async outputChanges( outputFile ) {
        let outputData = {}
        await this.outputData( outputData, "users", this.userManager )
        await this.outputData( outputData, "songs", this.songManager)
        await this.outputData( outputData, "playlists", this.playlistManager )
        const jsonOutput = JSON.stringify( outputData, null, 2)
        fs.writeFileSync(outputFile, jsonOutput);

    }
    
    async outputData( data, listName, manager ) {

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