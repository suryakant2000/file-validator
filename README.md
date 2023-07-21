# file-validator

it's a npm package, for validating the file MIME type.
<br>
<br>
how to use it?
<br>
fileValidator({file: selectedFile}, callback)
<br>
<br>
<br>
<br>
<br>
arguments =>
<br>
file // file to be checked<br>
media // media type ex:['image']<br>
whitelistExtension // whitelist an extension ['png']<br>
blacklistExtension // blacklist an extension ['jpg']<br>
returnBase64 // return base64 of the file<br>
<br>
<br>
<br>
<br>
<br>
callback function returns =>
<br>
<br>
type // success or error
<br>
file
<br>
base64
<br>
<br>
<br>
<br>
<br>
example =>
<br>
<br>
const selectedFile = file.files[0];<br>
const callback = (res) => {<br>
console.log({res})<br>
}
<br>
fileValidator({file: selectedFile}, callback)
