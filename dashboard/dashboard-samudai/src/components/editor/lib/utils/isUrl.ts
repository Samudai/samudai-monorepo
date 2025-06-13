const regex =
    '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';

export const isUrl = (url: string) => {
    const REGEX_URL = new RegExp(regex, 'i');
    return url.length < 2083 && REGEX_URL.test(url);
};

// const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;

// const localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
// const nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;

// /**
//  * Loosely validate a URL `string`.
//  *
//  * @param {String} string
//  * @return {Boolean}
//  */

// export function isUrl(url: string) {
//   if (typeof url !== 'string') {
//     return false;
//   }

//   var match = url.match(protocolAndDomainRE);
//   if (!match) {
//     return false;
//   }

//   var everythingAfterProtocol = match[1];
//   if (!everythingAfterProtocol) {
//     return false;
//   }

//   if (
//     localhostDomainRE.test(everythingAfterProtocol) ||
//     nonLocalhostDomainRE.test(everythingAfterProtocol)
//   ) {
//     return true;
//   }

//   return false;
// }
