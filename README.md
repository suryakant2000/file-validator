# generic-file-validator

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
| audio  | .mp3, .ogg, .oga, .wav, .mid, .midi  |
| video  | .mp4, .ogg, .ogv, .avi, .mpeg, .webm, .mkv, .3gp  |
| application  | .doc, .docx, .xls, .xlsx, .ppt, .pptx, .zip, .apk, .pdf  |

<br>

## User guide

### Props
| Props name | Description | Defalut value | Required | Example |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| file   | The file which you want to validate     | null    | true | file: file to be validated |
| media     |  The media type, it will whitelist all the supported extension       | []      | required if 'whitelistExtension' is not passed in the function | media: ['image']
| whitelistExtension   | The extension you want to whitelist irrespective of media     | []    | required if 'media' is not passed in the function | whitelistExtension: ['png', 'gif'] |
| blacklistExtension   | The extension you want to blacklist irrespective of media     | []    | false | blacklistExtension: ['tiff', 'pdf'] |
| returnBase64   | Return base64 of the file     | true    | false | returnBase64: false |

### Usage
Here is the example usage in react app.
```
import "./App.css";
import fileValidator from "generic-file-validator";

function App() {
  const handleChange = (e) => {
    let file = e.target.files[0];

    fileValidator(
      {
        file: file,
        media: ["image"],
        whitelistExtension: ["jpg", "jpeg"],
        blacklistExtension: ["png"],
      },
      callback
    );
  };

  const callback = (res) => {
    console.log({ res });
  };

  return (
    <div className="App">
      <input type="file" onChange={handleChange} />
    </div>
  );
}

export default App;
```
