"use client";
export default function getBrowser() {
  let browser = "";
  if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
    browser = "Firefox";
  } else if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
    browser = "IE";
  } else if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
    browser = "Chrome";
  } else if (/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
    browser = "Safari";
  }
  return browser;
}
