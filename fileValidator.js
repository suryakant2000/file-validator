module.exports = fileValidator = (args, outputFunction) => {
  let {
    file,
    media = [],
    whitelistExtension = [],
    blacklistExtension = [],
    returnBase64 = true,
  } = args || {};

  // all type of error handling start...
  if (!file) {
    return { type: "error", message: "file is undefined" };
  }
  if (!Array.isArray(media)) {
    return { type: "error", message: "media should be array of srting" };
  }
  if (!Array.isArray(whitelistExtension)) {
    return {
      type: "error",
      message: "whitelistExtension should be array of srting",
    };
  }
  if (!Array.isArray(blacklistExtension)) {
    return {
      type: "error",
      message: "blacklistExtension should be array of srting",
    };
  }
  // all type of error handling end...

  let checkFileAgainst = []; // file will be validated against these extension

  // set default extension for all media type start...
  if (media.includes("image")) {
    checkFileAgainst = [
      ...checkFileAgainst,
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "tiff",
      "bmp",
    ];
  }
  if (media.includes("audio")) {
    checkFileAgainst = [
      ...checkFileAgainst,
      "mp3",
      "ogg",
      "wav",
      "mid",
      "midi",
    ];
  }
  // set default extension for all media type end...

  if (whitelistExtension.length > 0) {
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
  if (blacklistExtension.length > 0) {
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

    // validation code start...
    // all image extionsios...
    if (
      (mimeString.includes("ffd8ffe0") ||
        mimeString.includes("ffd8ffe1") ||
        mimeString.includes("ffd8ffe2") ||
        mimeString.includes("ffd8ffe3") ||
        mimeString.includes("ffd8ffe8") ||
        mimeString.includes("ffd8ffee")) &&
      (checkFileAgainst.includes("jpg") || checkFileAgainst.includes("jpeg"))
    ) {
      returnSuccessResult();
    } else if (
      mimeString.includes("89504e47") &&
      checkFileAgainst.includes("png")
    ) {
      returnSuccessResult();
    } else if (
      mimeString.includes("47494638") &&
      checkFileAgainst.includes("gif")
    ) {
      returnSuccessResult();
    } else if (
      (mimeString.includes("52494646") || mimeString.includes("57454250")) &&
      checkFileAgainst.includes("webp")
    ) {
      returnSuccessResult();
    } else if (
      (mimeString.includes("49492a00") || mimeString.includes("4d4d002a")) &&
      checkFileAgainst.includes("tiff")
    ) {
      returnSuccessResult();
    } else if (
      mimeString.includes("424d") &&
      checkFileAgainst.includes("bmp")
    ) {
      returnSuccessResult();
    }
    // all audio extensions...
    else if (
      mimeString.includes("494433") &&
      checkFileAgainst.includes("mp3")
    ) {
      returnSuccessResult();
    } else if (
      mimeString.includes("4f676753") &&
      checkFileAgainst.includes("ogg")
    ) {
      returnSuccessResult();
    } else if (
      (mimeString.includes("52494646") || mimeString.includes("57415645")) &&
      checkFileAgainst.includes("wav")
    ) {
      returnSuccessResult();
    } else if (
      mimeString.includes("4d546864") &&
      (checkFileAgainst.includes("mid") || checkFileAgainst.includes("midi"))
    ) {
      returnSuccessResult();
    } else {
      returnErrorResult("file not supported");
    }
  };

  const returnSuccessResult = () => {
    // return success result to user
    if (returnBase64) {
      getBase64(file).then((returnedBase64) =>
        outputFunction({
          type: "success",
          file: file,
          base64: returnedBase64,
        })
      );
    } else {
      outputFunction({
        type: "success",
        file: file,
      });
    }
  };

  const returnErrorResult = (message) => {
    // return error result to user
    outputFunction({
      type: "error",
      message: message,
    });
  };

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
};
