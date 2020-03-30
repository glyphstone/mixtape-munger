const yargs = require('yargs');

const { SimpleChangeMerge} = require( "./simpleChangeMerge")
const { BasicLogger } = require('./basicLogger')

const log = new BasicLogger()
const context = { log }

  var argv = require('yargs')
   .option('d', {
       alias : 'data',
       describe: 'data input file',
       type: 'string',
       default: 'data/mixtape-data.json'
   })
   .option('c', {
       alias : 'change',
       describe: 'change data file',
       type: 'string',
       default: 'data/mixtape-changes.json'
   })
   .option('o', {
    alias : 'output',
    describe: 'output data file',
    type: 'string',
    default: 'data/mixtape-out.json'
   })
   .option('v', {
    alias : 'verbose',
    describe: 'output verbose messages',
    type: 'boolean',
    default: false
   })
   .usage('Usage: $0 -d [string] -c [string] -o [string] -v // Merge changes into data and output')
   .help()
   .argv

   const merger = new SimpleChangeMerge(context)
   merger.run(argv.data, argv.change, argv.output, argv.verbose).then( (changeCount) => {
       log.info(`mixtape merge completed successfully. ${changeCount} items changed.`)
   },
   (ex) => {
       log.error(`Error executing mixtape merge: ${ex}`)
   })


