# mixtape-munger
A command line utility to modify a mixtape data set presented as a json file - as specified by Highspot as a coding test

This utility is implemented as a Node.js project
Prerequisites:

node --version
v8.9.4
npm --version
6.14.4


Project Setup
1. Clone repo https://github.com/glyphstone/mixtape-munger.git to your local environment
2. > cd mixtape-munger
2. > npm install
3. > npm run test

4. > node index.js --help
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

