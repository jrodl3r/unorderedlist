#### LATER
- 'add analytics'
- 'setup automated-chrome-profiling (node)'
- 'setup hotkeys (delete, copy, move-up, move-down, etc)'
- 'add input overload detection (50 submits / 60s = 30s timeout)'
- 'setup content-type detection logic + styles (link, text, image, etc.)'
- 'add visual walkthrough intro (add title, add item, remove, copy, etc.)'
- 'add list history & item recovery layout + logic'
- 'add notifications (copy, remove, etc)'
- 'setup responsive layout + styles'
- 'create `0.0.1` github release'


#### NOW
- 'finish initial jasmine core tests'
- 'add set_url() logic'
- 'add list name validation'
- 'update styles not using compass'
- 'setup initial jasmine node tests'
- 'setup chrome button extension'
  - [TEST] curl -d '{"item":"toot"}' -H "Content-Type: application/json" http://localhost:3000/foo
  - [TEST] curl -d '{"item":"toot"}' -H "Content-Type: application/json" http://unorderedlist.com/foo
- 'add download chrome button + share [encodeURI(...)] links'
- 'setup codeship jasmine testing and heroku build deployment (http://unorderedlist.com/UL)'


#### READY
- 'setup initial jasmine core tests'
- 'setup services GET (/get/:listname), LOAD (/:listname), POST (/:listname + {item:content})'
- 'add license file'
- 'setup heroku server + domain linkage'
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
