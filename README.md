# pog keyboard flashing utility

## dependencies
* node 16
* yarn

## Setup
install everything with 
`yarn`

develop and do changes in the frontend (vue3 with vite)
`yarn dev`

run the electron application with the frontend server running
`yarn electron:start`


If you want to build the final application you will need to change the loaded \
window url in the main.js to the packaged file (still WIP)
then to package the application run
`yarn dist`

# Tasks

- [ ] Layout editor to replace KLE
- [ ] save pog.json (use as main storage for everything)
- [ ] way to handle differences between pog.json to kmk code
- [ ] share pog.json files
- [ ] don't overwrite everything in code.py || place codeblocks somewhere safe || use injection points from the pog.json
- [ ] adjust keymap when matrix changes
- [ ] handle filbert code.py parse error