
const { BaseSimpleManager } = require("./baseSimpleManager")

class PlaylistManager extends BaseSimpleManager {
    constructor( context ) {
        super( context )
        this.typeName = "Playlist"
    }

    
    async add( data, overwrite = false ) {

        // verify referential integrity
        const userId = data.user_id || null
        if( userId ) {
            const userManager = this.getManager("user")
            const verifyIds = [ userId ]
            await this.verifyExists( verifyIds, userManager, "User", "adding")
        }

        const songIds = data.song_ids || null
        if( songIds ) {
            const songManager = this.getManager("song")
            await this.verifyExists( songIds, songManager, "Song", "adding")
        }

        const addData = await super.add( data, overwrite)
        return addData

    }

    async verifyExists( idlist, manager, targetTypeName, operation ) {
        const exists = await manager.exists( idlist )
        // console.log( `verify exists: ${JSON.stringify(idlist)}, result: ${JSON.stringify(exists)}`)
        if( !exists.all) {
            throw new Error(`${targetTypeName} ${idlist} not found when ${operation} a Playlist `)
        }
    }

    async mergeUpdateData( workingData, changeData, mode ) {
        let songIds = workingData.song_ids || []
        let changeSongIds = changeData.song_ids || []
        if( changeSongIds) {
            await this.verifyExists( changeSongIds, this.getManager("song"), "Song", "updating")
        }
        
        switch( mode) {
            case "add": 
              workingData.song_ids = this.mergeArraysUnique( songIds, changeSongIds )
              break
            case "set" :
              workingData.song_ids = changeSongIds
              break
            case "remove" :
              workingData.song_ids = this.removeFromArray( songIds, changeSongIds)
              break 

        }
 
        return workingData
    }

    mergeArraysUnique( array1, array2 ) {
        const diff = array2.filter( val => !array1.includes(val))
        return array1.concat( diff )
    }

    removeFromArray( array1, deletes ) {

        deletes.forEach( i => { 
            const ix = array1.indexOf(i) 
            if( ix > -1 ) {
                array1.splice(ix, 1)
            }
        } )

        return array1
    }

}


exports.PlaylistManager = PlaylistManager