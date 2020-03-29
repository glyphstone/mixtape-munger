
const { BaseSimpleManager} = require("./baseSimpleManager")

class UserManager extends BaseSimpleManager {
    constructor( context ) {
        super( context )
        this.typeName = "User"
        this.log.info(`Created UserManager`)
    }

}


exports.UserManager = UserManager