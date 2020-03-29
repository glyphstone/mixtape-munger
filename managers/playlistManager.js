
const { BaseSimpleManager } = require("./baseSimpleManager")

class PlaylistManager extends BaseSimpleManager {
    constructor( context ) {
        super( context )
        this.typeName = "Playlist"
    }

}

exports.PlaylistManager = PlaylistManager