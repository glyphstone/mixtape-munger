const { BaseSimpleManager } = require("./baseSimpleManager")


class SongManager extends BaseSimpleManager {
    constructor( context ) {
        super( context )
        this.typeName = "Song"
        this.log.info(`Created Song Manager`)

    }

}

exports.SongManager = SongManager