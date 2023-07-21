# file-validator

### What it does?
It checks the file MIME type, and validate it against the extension.

### Install
```
npm i generic-file-validator
```

### Supported media and extension
| Media  | Extension |
| ------------- | ------------- |
| image  | .jpg, .jpeg, .png, .gif, .webp, .tiff, .bmp  |

## User guide

### Props
| Props name | Description | Defalut value | Required | Example |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| file   | The file which you want to validate     | null    | true | file: file to be validated |
| media     |  The media type, it will whitelist all the supported extension       | ['image']      | required if 'whitelistExtension' is not passed in the function | media: ['image']
| whitelistExtension   | The extension you want to whitelist irrespective of media     | []    | required if 'media' is not passed in the function | whitelistExtension: ['png', 'gif'] |
| blacklistExtension   | The extension you want to blacklist irrespective of media     | []    | false | blacklistExtension: ['tiff', 'pdf'] |
| returnBase64   | Return base64 of the file     | true    | false | returnBase64: false |
