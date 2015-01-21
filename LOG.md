#### LATER
- 'add analytics'
- 'setup CodeShip/Travis CI build testing and deployment'
- 'setup hotkeys (delete, copy, move-up, move-down, etc)'
- 'setup content-type styles + logic (link, text, image, etc.)'
- 'add input overload detection (50 submits / 60s = 30s timeout)'
- 'add text input watermark placeholder text (List Name, New Item)'
- 'add visual walkthrough intro (add title, add item, remove, copy, etc.)'
- 'add list history & item recovery layout + logic'
- 'add notification (copy, remove, etc)'
- 'update browser URL on new list creation'
- 'setup responsive layout + styles'


#### NOW
- setup chrome button extension:
  - [TEST] curl -d '{"item":"toot"}' -H "Content-Type: application/json" http://localhost:3000/foo
  - [TEST] curl -d '{"item":"toot"}' -H "Content-Type: application/json" http://unorderedlist.com/foo
- 'setup list name validation'
- 'add download chrome button + share [encodeURI(...)] links'
- 'setup jasmine node + core tests'


#### READY
- 'setup services GET (/get/:listname), LOAD (/:listname), POST (/:listname + {item:content})'
- 'add License file'
- 'setup Heroku server + domain linkage'
- 'fix add/remove item emitter logic'
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
- 'get everything on a live server (see: nitrous.io)'
- 'setup node/express/socket/mongodb stack'
