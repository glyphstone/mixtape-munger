# mixtape-munger
A command line utility to modify a mixtape data set presented as a json file - as specified by Highspot as a coding test

This utility is implemented as a Node.js project
## Prerequisites:
Suggested minimum versions:

node --version
v8.9.4
npm --version
6.14.4

### Platform
This project was developed and tested under Ubuntu 18.04.4 using VSCode

## Project Setup and Quickstart
1. Clone repo https://github.com/glyphstone/mixtape-munger.git to your local environment
2. ``` > cd mixtape-munger```
3. ``` > npm install ```
4. ``` > npm run test```

5. ``` > node index.js --help ```

```
Usage: index.js -d [string] -c [string] -o [string] -v // Merge changes into
data and output

Options:
  --version      Show version number                                   [boolean]
  -d, --data     data input file    [string] [default: "data/mixtape-data.json"]
  -c, --change   change data file[string] [default: "data/mixtape-changes.json"]
  -o, --output   output data file    [string] [default: "data/mixtape-out.json"]
  -v, --verbose  output verbose messages              [boolean] [default: false]
  --help         Show help                                             [boolean]

```

6. ``` > npm run start ```

Execute with default arguments. This will take the standard data file as provided (data/mixtape-data.json) and apply the 
change file: data/mixtape-changes.json and output to data/mixtape-out.json

## Application Instructions

You can run the merger directly at the command line as e.g.
``` > node index.js -d data/mixtape-data.json -c data/mixtape-changes-bad1.json -o data/badout.json ```

Provided are a sample of change files including two that verify the referential integrity checks built in: 
* *bad1.json and *bad2.json
* mixtape-changes.json illustrates the basic list of requirements
* mixtape-changes-larger.json illustrates a slightly more agressive sequence of updates

## Special Features
Though not explicitly required, referential integrity is included to disallow adding or updating playlists with invalid references to users or songs

## Change File Format
The Chage-File format supports mixtures of change requests in any order desired. Only chages to playlists are supported at this time though the change file format can easily incorporate changes to Users or Songs if desired in the future
### Example
```
{
    "version": "0.1",
    "description": "Changes to demonstate basic set as per test requirements",
    "changes": [
        { 
          "type": "playlist",
          "action": "add",
          "data": { "user_id": "7", "song_ids": ["1", "2", "3", "5", "8"] }
        },
        {
          "type": "playlist",
          "action": "delete",
          "id": "2"
        },
        { 
          "type": "playlist",
          "action": "update",
          "id": "1",
          "data": { "song_ids": [ "32", "39", "40"]},
          "mode": "add"
        }
    ]
}
```
* version: A version that could be used to confirm process compatibility. Not currently tested
* description: A textual description of the change for reference only.
* changes: An array of change request objects

### Change request format.
* type: "playlist" (or "user", "song" for future expansion)
* action: ["add", "update", "delete"]
* id:  required for "update" or "delete" operations
* data: required for "add" or "update" operations
* mode: used to control action:"update" behavior 
  * "add" -  Add the passed song-ids will be added to the existing song-ids with duplicates eliminated
  * "set" - The passed song_ids will be replaced in the specified playlist
  * "remove" - The passed song_ids will be removed from the playlist set of song_ids

Notes: 

* when adding an item, if the field "id" is provided, it will be used for the item id. if it is not provided, it will be generated as the next available id based on all prior loaded ids.  All ids must be integer codes strings.

* playlist update can only update song_ids. changes to user_id are not allowed.  They will be ignored and not generate an error.

### Limitations
This is largely moot as changes to users and songs are not supported. There is no support for adding new songs to playlists due to the id-reference requirement. If it is desired, nested creation of items or reference id maps can be implemented to support this is in future versions

## Future Development
### Scalability
The V.01 implementation uses in memory loading and parsing of the JSON for the data and the change files.  If very large files must be processed two things should be done to accomodate:
1. The JSON parser should be replaced with a streaming parser. We suggest the JSONstream NPM module. It's the most robust and by far the most popular and should suffice. The architecture of the simpleChangeMerge.js can be easily expanded (as likely a new variant with command line switch) as data is loaded into *Managers via *Manager.add(data) and subsequent change processing is encaptulated in the managers.
2. Revise/replace the managers to use disk-backed ephemeral key/value storage such as Redis to replace the in-memory maps currently used by the baseSimpleManager.js,  the baseManager should likely be replaced by, say baseRedisManager.js and all upper level logic should be unaffected.

3. Similarly use a streaming JSON output approach for rendering results.  Managers have a .list(offset, pagesize) method for data output that will scale to unspecified data size.

