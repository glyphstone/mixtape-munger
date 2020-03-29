class NullManager {
    constructor( context ) {
        this.context = context
        this.log = context.log
        this.data = {}
        this.dataKeys = []
        this.nextId = 0
        this.typeName = "Undefined"
    }

}

exports.NullManager = NullManager
