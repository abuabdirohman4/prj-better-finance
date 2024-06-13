//CHECK IF BROWSER STORAGE IS EXIST
function isStorageExist() {
  if (typeof Storage === "undefined") {
    //GIVE ERROR OR ALERT TO USER
    return false;
  }
  return true;
}

//CHECK IF DATA IS JSON
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

//SAVE SESSION DATA
export function setSession(key, value) {
  if (isStorageExist()) {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  }
}

//GET SESSION DATA
export function getSession(key) {
  if (isStorageExist()) {
    const dataSession = sessionStorage.getItem(key);
    return isJson(dataSession) ? JSON.parse(dataSession) : dataSession;
  }
}

//REMOVE SESSION DATA
export function removeSession(key) {
  if (isStorageExist()) {
    return sessionStorage.removeItem(key);
  }
}

//CLEAR SESSION
export function clearSession() {
  if (isStorageExist()) {
    return sessionStorage.clear();
  }
}

//SAVE LOCAL BROWSER DATA
export function setLocal(key, value) {
    if (isStorageExist()) {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }
};

//GET LOCAL BROWSER DATA
export function getLocal(key) {
    if (isStorageExist()) {
        const dataLocal = localStorage.getItem(key);
        return isJson(dataLocal) ? JSON.parse(dataLocal) : dataLocal;
    }
};

//REMOVE SESSION DATA
export function removeLocal(key) {
    if (isStorageExist()) {
        return localStorage.removeItem(key);
    }
}

//CLEAR SESSION
export function clearLocal() {
    if (isStorageExist()) {
        return localStorage.clear();
    }
}
