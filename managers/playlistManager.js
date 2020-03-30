
const { BaseSimpleManager } = require("./baseSimpleManager")

class PlaylistManager extends BaseSimpleManager {
    constructor( context ) {
        super( context )
        this.typeName = "Playlist"
    }

    
    async add( data, overwrite = false ) {
        const addData = await super.add( data, overwrite)
        return addData

    }

    async mergeUpdateData( workingData, changeData) {
        let songIds = workingData.song_ids || []
        let newSongIds = changeData.song_ids || []
        workingData.song_ids = this.mergeArraysUnique( songIds, newSongIds )
        return workingData
    }

    mergeArraysUnique( array1, array2 ) {
        const diff = array2.filter( val => !array1.includes(val))
        return array1.concat( diff )
    }

}


exports.PlaylistManager = PlaylistManager