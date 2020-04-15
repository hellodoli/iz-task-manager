export function setCookie(cname, cvalue, exdays) {
  if (typeof exdays === 'undefined') exdays = 'auto';
  const d = new Date();
  const finalExtimes =
    exdays === 'auto' ? 15 * 60 * 1000 : exdays * 24 * 60 * 60 * 1000;
  d.setTime(d.getTime() + finalExtimes);
  const expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  console.log(document.cookie);
}

export function getCookie(cname) {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    if (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }

  return '';
}

export function deleteCookie(cname) {
  const name = cname + '=';
  const expires = 'expires=Thu, 01 Jan 1970 00:00:00 UTC';
  const path = 'path=/';
  document.cookie = name + '; ' + expires + '; ' + path + ';';
}
