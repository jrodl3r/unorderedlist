#### LATER
- 'add analytics'
- 'add flash feature detection for ZeroClipboard'
- 'setup hotkeys (delete, copy, move-up, move-down, etc)'
- 'add list history & item recovery logic + layout'
- 'add input overload detection (50 submits / 60s = 30s timeout)'
- 'setup content-type detection logic + layout (link, text, etc.)'
- 'add visual walkthrough intro (add list, add item, remove, copy, etc.)'
- 'add preprocess + minify to heroku dist build (remove dist)'
- 'add release version to menubar (package.json » grunt preprocess)'
- 'setup responsive layout'
- 'add grunt-unCSS'


#### NEXT
- 'add chrome ext goto list url/link'
- 'style chrome ext actions + options layouts'
- 'add chrome ext notifications (copied, pasted, failed)'
- 'update readme to reflect emphasis on hotkey interaction, retract button terminology'
- 'setup newRelic monitoring'

- 'tag `0.0.2` github release (pre-release)'

- 'add notifications (copy, remove, etc)'
- 'setup share-link ZeroClipboard'
- 'add chrome ext new options_ui for Chrome 40+'
- 'setup jasmine-node / mocha + supertest (express + socket tests) and integrate w/ codeship'
- 'add list name validation + reserved words ('test', symbols, "", ``, '', etc.)'
- 'setup item content encoding/decoding (symbols, "", ``, '', etc.)'


- 'tag `0.0.3` github release (stable)'


#### READY
- 'update all icons (favicon, chrome ext)'
- 'add chrome ext setting to edit list name + customize keyboard shortcuts'
- 'add chrome ext to grunt build (jshint)'
- 'add chrome ext get/post xhr methods'
- 'add list-name param to add/remove item socket event + kill socket.list_name'
- 'update chrome ext to parse json get response'
- 'remove timer & update GET service to send JSON response data'
- 'setup chrome button extension'
- 'update styles not using compass + convert colors to hex'
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
