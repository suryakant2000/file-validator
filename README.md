# file-validator

it's a npm package, for validating the file MIME type.

how to use it?
fileValidator({file: selectedFile}, callback)



arguments =>

file // file to be checked
media // media type ex:['image']
whitelistExtension // whitelist an extension ['png']
blacklistExtension // blacklist an extension ['jpg']
returnBase64 // return base64 of the file



callback function returns =>

type // success or error
file
base64



example =>

const selectedFile = file.files[0];

const callback = (res) => {
console.log({res})
}

fileValidator({file: selectedFile}, callback)
