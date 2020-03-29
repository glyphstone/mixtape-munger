
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
        this.loadData( dataFile ) 
        return this.changeCount
    }

    async loadData( dataFile ) {
        const rawdata = fs.readFileSync(dataFile);
        const data = JSON.parse(rawdata);
        await this.loadUsers( data.users ) 
        await this.loadSongs( data.songs)
        // await this.loadPlaylists( data.playlists)
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
        const playlistCount = await this.playlistManager.count()
        this.log.info(`Playlists Loaded: ${playlistCount}`)
    }
    
}

exports.SimpleChangeMerge = SimpleChangeMerge