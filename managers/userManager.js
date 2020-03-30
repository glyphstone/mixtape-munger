
const { BaseSimpleManager} = require("./baseSimpleManager")

class UserManager extends BaseSimpleManager {
    constructor( context ) {
        super( context )
        this.typeName = "User"

    }

}


exports.UserManager = UserManager