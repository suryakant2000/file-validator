module.exports = fileValidator = (args, outputFunction) => {
  let {
    file = null,
    media = [],
    whitelistExtension = [],
    blacklistExtension = [],
    returnBase64 = true,
  } = args || {};

  let checkFileAgainst = []; // file will be validated against these extension

  const getBase64 = (file) => {
    // converting file to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const returnSuccessResult = () => {
    // return success result to user
    if (returnBase64) {
      getBase64(file).then((returnedBase64) =>
        outputFunction({
          type: "success",
          file: file,
          base64: returnedBase64,
          fileChedkedAgaistExtension: checkFileAgainst,
        })
      );
    } else {
      outputFunction({
        type: "success",
        file: file,
        fileChedkedAgaistExtension: checkFileAgainst,
      });
    }
  };

  const returnErrorResult = (message, notReturnExtension) => {
    // return error result to user
    notReturnExtension
      ? outputFunction({
          type: "error",
          message: message,
        })
      : outputFunction({
          type: "error",
          message: message,
          fileChedkedAgaistExtension: checkFileAgainst,
        });
  };

  // all props error handling start...
  if (!file) {
    return returnErrorResult("file not provided", true);
  }
  if (!Array.isArray(media)) {
    return returnErrorResult("media should be array of srting", true);
  }
  if (!Array.isArray(whitelistExtension)) {
    return returnErrorResult(
      "whitelistExtension should be array of srting",
      true
    );
  }
  if (!Array.isArray(blacklistExtension)) {
    return returnErrorResult(
      "blacklistExtension should be array of srting",
      true
    );
  }
  // all props error handling end...

  const mediaExtensions = {
    // media and supported extensions
    image: ["jpg", "jpeg", "png", "gif", "webp", "tiff", "bmp"],
    audio: ["mp3", "oga", "wav", "mid", "midi"],
    application: [
      "doc",
      "xls",
      "ppt",
      "docx",
      "xlsx",
      "pptx",
      "zip",
      "apk",
      "pdf",
    ],
    video: ["mp4", "avi", "mpeg", "ogv", "webm", "mkv", "3gp"],
  };

  const extensionSignature = {
    // extensions and file singnature

    // image extensions
    jpg: [
      "ffd8ffe0",
      "ffd8ffe1",
      "ffd8ffe2",
      "ffd8ffe3",
      "ffd8ffe8",
      "ffd8ffee",
      "69660000",
      "49460001",
    ],
    jpeg: [
      "ffd8ffe0",
      "ffd8ffe1",
      "ffd8ffe2",
      "ffd8ffe3",
      "ffd8ffe8",
      "ffd8ffee",
      "69660000",
      "49460001",
    ],
    png: ["89504e47"],
    gif: ["474946383761", "474946383961"],
    webp: ["52494646", "57454250"],
    tiff: ["49492a0"],
    bmp: ["424d"],

    // audio extensions
    mp3: ["494433"],
    oga: ["4f676753"],
    wav: ["52494646", "57415645"],
    mid: ["4d546864"],
    midi: ["4d546864"],

    //application extensions
    doc: ["d0cf11e0a1b11ae1"],
    xls: ["d0cf11e0a1b11ae1"],
    ppt: ["d0cf11e0a1b11ae1"],
    docx: ["504b0304", "504b0506", "504b0708"],
    xlsx: ["504b0304", "504b0506", "504b0708"],
    pptx: ["504b0304", "504b0506", "504b0708"],
    zip: ["504b0304", "504b0506", "504b0708"],
    apk: ["504b0304", "504b0506", "504b0708"],
    pdf: ["255044462d"],

    //video extensions
    mp4: ["66747970"],
    avi: ["52494646", "41564920"],
    mpeg: ["001ba210"],
    ogv: ["4f676753"],
    webm: ["1a45dfa3"],
    mkv: ["1a45dfa3"],
    "3gp": ["66747970"],
  };

  // setting list of extension, file will be checked start...

  if (media.length) {
    // setting default extensions for media to be checked
    let requiredMediaDefaultExtension = [];

    for (let i = 0; i < media.length; i++) {
      if (mediaExtensions[media[i].toLowerCase()]) {
        requiredMediaDefaultExtension = [
          ...requiredMediaDefaultExtension,
          ...mediaExtensions[media[i].toLowerCase()],
        ];
      } else {
        returnErrorResult("media not supported");
        break;
      }
    }
    checkFileAgainst = [...requiredMediaDefaultExtension];
  }

  if (whitelistExtension.length) {
    // updating checkFileAgainst for white listed extension
    let whitelistExtensionNotFoundIncheckFileAgainst =
      whitelistExtension.filter(
        (eachWhitelistExtension) =>
          !checkFileAgainst.includes(eachWhitelistExtension)
      );
    checkFileAgainst = [
      ...checkFileAgainst,
      ...whitelistExtensionNotFoundIncheckFileAgainst,
    ];
  }

  if (blacklistExtension.length) {
    // updating checkFileAgainst for black listed extension
    let removeBlacklistExtension = checkFileAgainst.filter(
      (eachCheckFileAgainst) =>
        !blacklistExtension.includes(eachCheckFileAgainst)
    );
    // removing similar type of extension
    if (
      blacklistExtension.includes("jpg") ||
      blacklistExtension.includes("jpeg")
    ) {
      let removeSimilarBlacklistExtension = removeBlacklistExtension.filter(
        (eachBlackListExtension) =>
          eachBlackListExtension !== "jpg" && eachBlackListExtension !== "jpeg"
      );
      removeBlacklistExtension = removeSimilarBlacklistExtension;
    }
    if (
      blacklistExtension.includes("mid") ||
      blacklistExtension.includes("midi")
    ) {
      let removeSimilarBlacklistExtension = removeBlacklistExtension.filter(
        (eachBlackListExtension) =>
          eachBlackListExtension !== "mid" && eachBlackListExtension !== "midi"
      );
      removeBlacklistExtension = removeSimilarBlacklistExtension;
    }
    checkFileAgainst = [...removeBlacklistExtension];
  }

  // setting list of extension, file will be checked end...

  // validation code start...

  let blob = file;
  let fileReader = new FileReader(file);
  fileReader.onloadend = (event) => findValidation(event.target.result);
  fileReader.readAsArrayBuffer(blob);

  const findValidation = async (arrayBuffer) => {
    // validator function
    let array = new Uint8Array(arrayBuffer).subarray(0, 20);
    let mimeString = "";

    for (let i = 0; i < array.length; i++) {
      mimeString += array[i].toString(16);
    }

    let resultFound = false;

    for (let i = 0; i < checkFileAgainst.length; i++) {
      let fileSignatureList = extensionSignature[checkFileAgainst[i]];

      if (!resultFound) {
        for (let j = 0; j < fileSignatureList.length; j++) {
          if (mimeString.includes(fileSignatureList[j])) {
            returnSuccessResult();
            resultFound = true;
            return;
          }
        }
        if (i === checkFileAgainst.length - 1) {
          returnErrorResult("no match found");
          return;
        }
      } else {
        return;
      }
    }
    // validation code end...
  };
};
