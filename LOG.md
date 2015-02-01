#### LATER
- 'add analytics'
- 'setup automated-chrome-profiling (node)'
- 'setup hotkeys (delete, copy, move-up, move-down, etc)'
- 'add input overload detection (50 submits / 60s = 30s timeout)'
- 'setup content-type detection logic + layout (link, text, etc.)'
- 'add visual walkthrough intro (add list, add item, remove, copy, etc.)'
- 'add preprocess + minify to heroku dist build (remove dist)'
- 'add list history & item recovery logic + layout'
- 'create `0.0.1` github release'
- 'setup responsive layout'


#### NOW
- 'update styles not using compass'
- 'setup chrome button extension'
- 'add notifications (copy, remove, etc)'
- 'setup share link click-to-copy'
- 'setup initial jasmine node tests + add to codeship'
- 'add list name validation + reserved words (symbols, etc.)'
- 'add version tag to menubar (package.json » grunt preprocess)'

#### READY
- 'setup codeship jasmine testing and heroku build deployment'
- 'update item highlight click handler'
- 'setup jasmine core tests'
- 'add download chrome button + share [encodeURI(...)] links'
- 'setup services GET (/get/:listname), LOAD (/:listname), POST (/:listname + {item:content})'
- 'add license file'
- 'setup heroku server + domain linkage'
- 'update add/remove item emitter logic'
- 'add ZeroClipboard copy item button + logic'
- 'add font-awesome icon support'
- 'make logo link home + clear active list'
- 'setup grunt build (sass, lint, watch)'
- 'add icon/favicon'
- 'setup UL namespace, add remove item button + logic'
- 'setup load list mongo proc'
- 'setup create list mongo proc'
- 'setup add item to list logic + proc'
- 'add new/load list logic'
- 'cleanup styles, center content'
- 'get everything on a live server'
- 'setup node/express/socket/mongodb stack'


#### TESTS
- **POST**
  - curl -d '{"item":"testing 1, 2, 3..."}' -H "Content-Type: application/json" http://localhost:3000/foo
  - curl -d '{"item":"testing 1, 2, 3..."}' -H "Content-Type: application/json" http://unorderedlist.com/foo
- **GET**
  - curl http://localhost:3000/get/foo
  - curl http://unorderedlist.com/get/foo
