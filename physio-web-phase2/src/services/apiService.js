/* eslint-disable no-unused-vars */

// IPs & base Url
//
// FOR DEV
// const serverIP = "localhost:4000/https://generally-eager-donkey.ngrok-free.app";
// const serverIP = "localhost:4000/https://api.recshomes.com";
// const serverIP = "5f5f-111-119-49-246.ngrok-free.app ";
// const serverIP = "sqk-api.zerologicspace.com"
// const serverIP = "generally-eager-donkey.ngrok-free.app";
// const serverIP = "54d0-103-156-26-38.ngrok-free.app"
// const serverIP = 'generally-eager-donkey.ngrok-free.app';
// const serverIP = 'localhost:4000';
const serverIP = "physio-api.zerologicspace.com"
//
// FOR PRODUCTION
// const serverIP = "api.recshomes.com"

// PORTS
const serverPort = ""; //use this if not using IP address
// const serverPort = '3001'
// const apiVersion_1 = "/api/";

//-----HEPLER FUNCTIONS-----//-----HEPLER FUNCTIONS-----//-----HEPLER FUNCTIONS-----//-----HEPLER FUNCTIONS-----//-----HEPLER FUNCTIONS-----//

function getAccessToken() {
  return "Bearer " + localStorage.getItem("saved_t");
}

function postFormDataReqOpts(data, includeJWT = false, isPatch = false) {
  const headers = new Headers();
  headers.append("accept", "application/json");
  if (includeJWT) {
    headers.append("authorization", getAccessToken());
  }
  const body = new FormData();
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      if (value instanceof File) {
        body.append(key, value);
      } else if (value instanceof FileList) {
        // Append each file in the FileList under the same key
        for (let i = 0; i < value.length; i++) {
          body.append(key, value[i]);
        }
      } else {
        body.append(key, value.toString());
      }
    }
  }
  return {
    method: isPatch ? "PATCH" : "POST",
    headers,
    body,
  };
}

function postReqOpts(data, includeJWT = false) {
  const headers = new Headers();
  headers.append("content-type", "application/json");
  headers.append("ngrok-skip-browser-warning", "true");
  headers.append("accept", "application/json");
  includeJWT && headers.append("authorization", getAccessToken());
  return {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
}

function getReqOpts(includeJWT = false) {
  const headers = new Headers();
  headers.append("content-type", "application/json");
  headers.append("accept", "application/json");
  headers.append("ngrok-skip-browser-warning", "true"); // TODO: custom headers, disable in prod

  includeJWT && headers.append("authorization", getAccessToken());
  return {
    method: "GET",
    headers: headers,
  };
}

function putReqOpts(data, id, includeJWT = false) {
  const headers = new Headers();
  includeJWT && headers.append("authorization", getAccessToken());
  headers.append("content-type", "application/json");
  headers.append("ngrok-skip-browser-warning", "true");

  return {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(data),
  };
}

function delReqOpts(id, includeJWT = false) {
  const headers = new Headers();
  includeJWT && headers.append("authorization", getAccessToken());
  headers.append("ngrok-skip-browser-warning", "true");
  headers.append("content-type", "application/json");

  return {
    method: "DELETE",
    headers: headers,
  };
}

function createURL(endPoint) {
  return `https://${serverIP}${serverPort}${endPoint}`;
}
function getURL(endPoint) {
  return `https://${serverIP}${serverPort}${endPoint}`;
}

function checkAuthStatus() {
  return new Promise((done, err) =>
    fetch(createURL("/blogs"), getReqOpts(true))
      .then((res) => {
        if (res.status === 200) {
          done(200);
        } else if (res.status === 401) {
          done(401);
        } else {
          done(res.status);
        }
      })
      .catch((err) => {
        console.error("Network Error: ", err);
      })
  );
}

const documentUrl = `https://${serverIP}${serverPort}/`;

//-----PUBLIC FUNCTIONS-----//-----PUBLIC FUNCTIONS-----//-----PUBLIC FUNCTIONS-----//-----PUBLIC FUNCTIONS-----//-----PUBLIC FUNCTIONS-----//

function API_PostFormData(endPoint, data, authRequired, isPatch = false) {
  console.log(data, "api postformdata gallery");
  return new Promise((done, error) => {
    fetch(createURL(endPoint), postFormDataReqOpts(data, authRequired, isPatch))
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Server Response Data:", data);
        done(data);
      })
      .catch((err) => {
        console.error("FETCH ERR: ", err);
        error(`API_Post Error: ${err.message}`);
      });
  });
}

function API_Post(endPoint, data, authRequired = false) {
  return new Promise((done, error) => {
    fetch(createURL(endPoint), postReqOpts(data, authRequired))
      .then((res) => res.json())
      .then((data) => done(data))
      .catch((err) => {
        console.error("FETCH ERR: ", err);
        error("API_Post Error");
      });
  });
}

function API_Patch(endPoint, data) {
  return new Promise((done, error) => {
    fetch(createURL(endPoint), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((responseData) => done(responseData))
      .catch((err) => {
        console.error("FETCH ERR: ", err);
        error(err);
      });
  });
}

function API_Get(endPoint, authRequired) {
  return new Promise((done, error) => {
    fetch(createURL(endPoint), getReqOpts(authRequired))
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Expected JSON but received " + contentType);
        }
        return res.json();
      })
      .then((data) => done(data))
      .catch((err) => {
        console.error("FETCH ERR: ", err);
        error("API_Get Error: " + err.message);
      });
  });
}

function API_Delete(endPoint) {
  return new Promise((resolve, reject) => {
    const id = parseInt(endPoint.split("/").pop() || "");
    fetch(getURL(endPoint), delReqOpts(id))
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          resolve(data);
        } else {
          reject(new Error(`DELETE request failed with status: ${res.status}`));
        }
      })
      .catch((err) => {
        console.error("FETCH ERR: ", err);
        reject(err);
      });
  });
}

function API_imageUrlPrefix() {
  return `https://${serverIP}`;
}

function API_getImage(fileName) {
  return `https://${serverIP}/image/${fileName}`;
}

// function API_getProjectImage(fileName:string) {
//     const modifiedServerIP = serverIP.replace("localhost:4000/https://", "");
//     return `https://${modifiedServerIP}/image/${fileName}`;
// }

export {
  API_Get,
  API_Post,
  API_Delete,
  API_PostFormData,
  API_imageUrlPrefix,
  checkAuthStatus,
  documentUrl,
  createURL,
  API_Patch,
  API_getImage,
};
