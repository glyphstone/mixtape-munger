const { SimpleChangeMerge } = require( "../simpleChangeMerge")
const { BasicLogger } = require('../basicLogger')

const mixtapeData1 = {
    "users" : [
      {
        "id" : "1",
        "name" : "Bobbie Draper"
      },
      {
        "id" : "2",
        "name" : "James Holden"
      },
      {
        "id" : "3",
        "name" : "Chrisjen Avasarala"
      },
    ],
    "playlists" : [
      {
        "id" : "1",
        "user_id" : "1",
        "song_ids" : [
          "1",
          "2"
        ]
      },
      {
        "id" : "2",
        "user_id" : "2",
        "song_ids" : [
          "2",
          "3",
        ]
      },
     
    ],
    "songs": [
      {
        "id" : "1",
        "artist": "Breanna Anderson",
        "title": "Free Range"
      },
      {
        "id" : "2",
        "artist": "Namoli Brennet",
        "title": "Stars"
      },
      {
        "id" : "3",
        "artist": "Steely Dan",
        "title": "Babylon Sisters"
      },
      
    ]
  }

  const mixtapeData2 = {
    "users" : [
      {
        "id" : "1",
        "name" : "Bobbie Draper"
      },
      {
        "id" : "2",
        "name" : "James Holden"
      },
      {
        "id" : "3",
        "name" : "Chrisjen Avasarala"
      },
    ],
    "playlists" : [
      {
        "id" : "1",
        "user_id" : "1",
        "song_ids" : [
          "1",
          "2"
        ]
      },
      {
        "id" : "2",
        "user_id" : "2",
        "song_ids" : [
          "2",
          "3",
        ]
      },
     
    ],
    "songs": [
      {
        "id" : "1",
        "artist": "Breanna Anderson",
        "title": "Free Range"
      },
      {
        "id" : "2",
        "artist": "Namoli Brennet",
        "title": "Stars"
      },
      {
        "id" : "3",
        "artist": "Steely Dan",
        "title": "Babylon Sisters"
      },
      {
        "id" : "4",
        "artist": "Thelonius Monk",
        "title": "'Round Midnight"
      },
      
    ]
  }

  const mixtapeData3 = {
    "users" : [
      {
        "id" : "1",
        "name" : "Bobbie Draper"
      },
      {
        "id" : "2",
        "name" : "James Holden"
      },
      {
        "id" : "3",
        "name" : "Chrisjen Avasarala"
      },
    ],
    "playlists" : [
      {
        "id" : "1",
        "user_id" : "1",
        "song_ids" : [
          "1",
          "2"
        ]
      },
      {
        "id" : "2",
        "user_id" : "2",
        "song_ids" : [
          "2",
          "3",
        ]
      },
     
    ],
    "songs": [
      {
        "id" : "1",
        "artist": "Breanna Anderson",
        "title": "Free Range"
      },
      {
        "id" : "2",
        "artist": "Namoli Brennet",
        "title": "Stars"
      },
      {
        "id" : "3",
        "artist": "Steely Dan",
        "title": "Babylon Sisters"
      },
      {
        "id" : "4",
        "artist": "Thelonius Monk",
        "title": "'Round Midnight"
      },
      
    ]
  }

  const addPlaylistChange = {
    version: "0.1",
    description: "Add a playlist",
    changes: [
        { 
          type: "playlist",
          action: "add",
          data: { "user_id": "3", "song_ids": ["1", "3"] }
        },
        
    ]
  }

  const addPlaylistChange2 = {
    version: "0.1",
    description: "Add a playlist with invalid userId",
    changes: [
        { 
          type: "playlist",
          action: "add",
          data: { "user_id": "5", "song_ids": ["1", "3"] }
        },
        
    ]
  }

  const addPlaylistChange3 = {
    version: "0.1",
    description: "Add a playlist with invalid songids",
    changes: [
        { 
          type: "playlist",
          action: "add",
          data: { "user_id": "1", "song_ids": ["100", "101"] }
        },
        
    ]
  }

  const deletePlaylistChange = {
    version: "0.1",
    description: "Delete a playlist",
    changes: [
        { 
          type: "playlist",
          action: "delete",
          id: "1" },
    ]
  }

  const updatePlaylistChange1 = {
    version: "0.1",
    description: "Update a playlist. Add a song",
    changes: [
        { 
            type: "playlist",
            action: "update",
            id: "1",
            data: { "song_ids": [ "3" ]},
            mode: "add"
          },
    ]
  }

  const updatePlaylistChange2 = {
    version: "0.1",
    description: "Update a playlist. Add a song, Dont duplicate existing",
    changes: [
        { 
            type: "playlist",
            action: "update",
            id: "2",
            data: { "song_ids": [ "1", "2"]},
            mode: "add"
          },
    ]
  }

  const updatePlaylistChange3 = {
    version: "0.1",
    description: "Update a playlist. replace songlist",
    changes: [
        { 
            type: "playlist",
            action: "update",
            id: "2",
            data: { "song_ids": ["4"]},
            mode: "set"
          },
    ]
  }

  const updatePlaylistChange4 = {
    version: "0.1",
    description: "Update a playlist. remove song from songlist",
    changes: [
        { 
            type: "playlist",
            action: "update",
            id: "1",
            data: { "song_ids": ["1"]},
            mode: "remove"
          },
    ]
  }

 
  const updateBadPlaylistChange1 = {
    version: "0.1",
    description: "Update a playlist. try to add a song that does not exist",
    changes: [
        { 
            type: "playlist",
            action: "update",
            id: "1",
            data: { "song_ids": ["1000"]},
            mode: "add"
          },
    ]
  }
  

let context

beforeAll(() => {
  context = { log: new BasicLogger() }

})

describe("Basic SimpleChangeMerge Tests", () => {
  test("Verify proper data loading", async () => {
    const merger = new SimpleChangeMerge(context)
    await merger.loadData( mixtapeData1)
    const managers = merger.getManagers()
    const users = await managers.user.list(0, 100)
    const songs = await managers.song.list(0,100)
    const playlists = await managers.playlist.list(0,100)

    expect( users).toEqual( [{"id":"1","name":"Bobbie Draper"},{"id":"2","name":"James Holden"},{"id":"3","name":"Chrisjen Avasarala"}])
    expect( songs ).toEqual( [{"id":"1","artist":"Breanna Anderson","title":"Free Range"},{"id":"2","artist":"Namoli Brennet","title":"Stars"},{"id":"3","artist":"Steely Dan","title":"Babylon Sisters"}])
    expect( playlists).toEqual(  [{"id":"1","user_id":"1","song_ids":["1","2"]},{"id":"2","user_id":"2","song_ids":["2","3"]}])
    
  })

  test("Test Add Playlist", async () => {
    const merger2 = new SimpleChangeMerge(context)
    await merger2.loadData( mixtapeData1)
    await merger2.doChanges( addPlaylistChange )
    const managers = merger2.getManagers()
    const playlistManager = managers.playlist
    const playlists = await playlistManager.list(0,100)

    expect( playlists).toEqual(  [
        {"id":"1","user_id":"1","song_ids":["1","2"]},
        {"id":"2","user_id":"2","song_ids":["2","3"]},
        {"id":"3", "user_id":"3","song_ids":["1","3"]}] 
    )
    
  })
  
  test("Test Delete Playlist", async () => {
    const merger3 = new SimpleChangeMerge(context)
    await merger3.loadData( mixtapeData1)
    await merger3.doChanges( deletePlaylistChange )
    const managers = merger3.getManagers()
    const playlistManager = managers.playlist
    const playlists = await playlistManager.list(0,100)

    expect( playlists).toEqual(  [
        {"id":"2","user_id":"2","song_ids":["2","3"]} ]
    )
    
  })

  test("Update A Playlist. Add song", async () => {
    const merger4 = new SimpleChangeMerge(context)
    await merger4.loadData( mixtapeData1)
    await merger4.doChanges( updatePlaylistChange1 )
    const managers = merger4.getManagers()
    const playlistManager = managers.playlist
    const playlists = await playlistManager.list(0,100)

    expect( playlists).toEqual( [
        {"id":"1","user_id":"1","song_ids":["1","2","3"]},
        {"id":"2","user_id":"2","song_ids":["2","3"]}
    ])

  })

  test("Update A Playlist. Add song, merge overlapping songids", async () => {
    const merger5 = new SimpleChangeMerge(context)
    const loadData = { ...mixtapeData2}
    await merger5.loadData( loadData )
    await merger5.doChanges( updatePlaylistChange2 )
    const managers = merger5.getManagers()
    const playlists = await managers.playlist.list(0,100)

    expect( playlists).toEqual( [
        {"id":"1","user_id":"1","song_ids":["1","2"]},
        {"id":"2","user_id":"2","song_ids":[ "2", "3", "1"]}
    ])

  })

  test("Update A Playlist. replace songlist", async () => {
    const merger5 = new SimpleChangeMerge(context)
    const loadData = Object.assign(mixtapeData2)
    await merger5.loadData( loadData)
    await merger5.doChanges( updatePlaylistChange3 )
    const managers = merger5.getManagers()
    const playlists = await managers.playlist.list(0,100)

    expect( playlists).toEqual( [
        {"id":"1","user_id":"1","song_ids":["1","2"]},
        {"id":"2","user_id":"2","song_ids":[ "4"]}
    ])

  })

  test("Update A Playlist. remove song from songlist", async () => {
    const merger6 = new SimpleChangeMerge(context)
    const loadData = Object.assign(mixtapeData2)

    await merger6.loadData( loadData )
    await merger6.doChanges( updatePlaylistChange4 )
    const managers = merger6.getManagers()
    const playlists = await managers.playlist.list(0,100)
    expect( playlists).toEqual( [
        {"id":"1","user_id":"1","song_ids":[ "2"]},
        {"id":"2","user_id":"2","song_ids":[ "4"]}
    ])

  })

  test("Test exists operator", async () => {
    const merger7 = new SimpleChangeMerge(context)
    const loadData7 = Object.assign(mixtapeData2)
    await merger7.loadData( loadData7 )
    const managers = merger7.getManagers()
    const exists1 = await managers.user.exists( ["2", "1"])
    expect( exists1).toEqual( {"each":[true,true],"all":true})
    const exists2 = await managers.user.exists( ["5", "3"])
    expect( exists2).toEqual( {"each":[false,true],"all":false})
  })
 
  test("Test Add Playlist, with bad userId, fail", async () => {
    const merger2 = new SimpleChangeMerge(context)
    await merger2.loadData( mixtapeData1)
    try {
      await merger2.doChanges( addPlaylistChange2 )
      console.log(`This should not succeed! user_id 5 does not exist`)
      expect( false, "this should fail" )
    } catch( ex ) {
      expect(ex).toEqual(new Error("User 5 not found when adding a Playlist "));
      console.log(`Expect failure! user_id does not exist: ${ex}`)
    }

  })

  test("Test Add Playlist, with bad song Ids, fail", async () => {
    const merger2 = new SimpleChangeMerge(context)
    await merger2.loadData( mixtapeData1)
    try {
      await merger2.doChanges( addPlaylistChange3 )
      console.log(`This should not succeed! song 100,101 does not exist`)
      expect( false, "this should fail" )
    } catch( ex ) {
      expect(ex).toEqual(new Error("Song 100,101 not found when adding a Playlist "));
      console.log(`Expect failure! songId does not exist: ${ex}`)
    }

  })

  test("Test Update Playlist, with bad song Id, fail", async () => {
    const merger2 = new SimpleChangeMerge(context)
    await merger2.loadData( mixtapeData1)
    try {
      await merger2.doChanges( updateBadPlaylistChange1 )
      console.log(`This should not succeed! song 100 does not exist`)
      expect(true).toEqual(false)
    } catch( ex ) {
      expect(ex).toEqual(new Error("Song 1000 not found when updating a Playlist "));
      console.log(`Expect failure! songId does not exist: ${ex}`)
    }

  })

})
