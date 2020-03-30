const { BaseSimpleManager } = require("./baseSimpleManager")


class SongManager extends BaseSimpleManager {
    constructor( context ) {
        super( context )
        this.typeName = "Song"

    }

}

exports.SongManager = SongManager