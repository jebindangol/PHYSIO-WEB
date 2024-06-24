/* eslint-disable no-unused-vars */
import axios from "axios";
import {
  API_Get,
  API_Post,
  API_PostFormData,
  API_Delete,
  checkAuthStatus,
  createURL,
  documentUrl,
  API_Patch,
} from "./apiService";

export async function testApi() {
  return new Promise((done, reject) => {
    API_Get("test")
      .then((res) => {
        done(res);
        console.log("succesfully tested");
      })
      .catch((err) => {
        reject("error");
        console.error("test API error: ", err);
      });
  });
}

// *********************************************************************************************
// *********************************************************************************************
//
// Functions Related to public api to get general category, subcategory, reousrces data
//
// *********************************************************************************************
// *********************************************************************************************

// Function to handle login using email and password
export async function doLogin(data) {
  return new Promise((resolve, reject) => {
    API_Post("/api/v1/users/login", data)
      .then((res) => {
        resolve(res);
        console.log(res,"api");
      })
      .catch((err) => {
        reject("Network Error");
        console.error("Login API error: ", err);
      });
  });
}

// CATEGORY  CRUD
export async function getCategory() {
  return new Promise((resolve, reject) => {
    const endPoint = "/api/v1/category";
    API_Get(endPoint)
      .then((response) => {
        console.log("Category  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  category  :", error);
        reject(error);
      });
  });
}

export async function sendCategory(data) {
  console.log(data, "data submitted on server");

  return new Promise((resolve, reject) => {
    const endPoint = "/api/v1/category";
    API_Post(endPoint, data)
      .then((response) => {
        console.log("Category details created:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in sendCategory:", error);
        reject(error);
      });
  });
}

export async function updateCategory(data, id) {
  const endPoint = `/api/v1/category?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Patch(endPoint, data)
      .then((response) => {
        console.log("Category details updated:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in updating Category:", error);
        reject(error);
      });
  });
}

export async function deleteCategory(id) {
  const endPoint = `/api/v1/category?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Delete(endPoint)
      .then((response) => {
        console.log("Category details deleted:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in deleting Category Details:", error);
        reject(error);
      });
  });
}

export async function getCategoryByID(id) {
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/category?id=${id}`;
    API_Get(endPoint)
      .then((response) => {
        console.log("Services  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  Services  :", error);
        reject(error);
      });
  });
}

//APPOINTMENT SECTION
export async function getAllAppointments() {
  return new Promise((resolve, reject) => {
    const endPoint = "/api/v1/appointments";
    API_Get(endPoint)
      .then((response) => {
        console.log("All appointments  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  all appointments  :", error);
        reject(error);
      });
  });
}

export async function getNewAppointments() {
  return new Promise((resolve, reject) => {
    const endPoint = "/api/v1/appointments/new";
    API_Get(endPoint)
      .then((response) => {
        console.log("New appointments  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  New appointments  :", error);
        reject(error);
      });
  });
}

export async function getProgressAppointments() {
  return new Promise((resolve, reject) => {
    const endPoint = "/api/v1/appointments/in_progress";
    API_Get(endPoint)
      .then((response) => {
        console.log("Progress appointments  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  Progress appointments  :", error);
        reject(error);
      });
  });
}

export async function getDoneAppointments() {
  return new Promise((resolve, reject) => {
    const endPoint = "/api/v1/appointments/done";
    API_Get(endPoint)
      .then((response) => {
        console.log("Done appointments  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  Done appointments  :", error);
        reject(error);
      });
  });
}

export async function getCancelledAppointments() {
  return new Promise((resolve, reject) => {
    const endPoint = "/api/v1/appointments/cancelled";
    API_Get(endPoint)
      .then((response) => {
        console.log("Cancelled appointments  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  Done appointments  :", error);
        reject(error);
      });
  });
}

export async function createAppointments(data) {
  console.log(data, "data submitted on server for appointment");
  return new Promise((resolve, reject) => {
    const endPoint = "/api/v1/appointments";
    API_PostFormData(endPoint, data)
      .then((response) => {
        console.log("Users details created:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in createAppointment:", error);
        reject(error);
      });
  });
}

export async function getAppointmentById(id) {
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/appointments?id=${id}`;
    API_Get(endPoint)
      .then((response) => {
        console.log("Appointments  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  Appointments  :", error);
        reject(error);
      });
  });
}

export async function updateAppointments(data, id) {
  const endPoint = `/api/v1/appointments?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Patch(endPoint, data)
      .then((response) => {
        console.log("Appointments details updated:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in updating Appointments:", error);
        reject(error);
      });
  });
}

export async function deleteAppointment(id) {
  const endPoint = `/api/v1/appointments?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Delete(endPoint)
      .then((response) => {
        console.log("Appointments details deleted:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in deleting Appointments :", error);
        reject(error);
      });
  });
}


// PATIENT SECTION 
export async function getPatientById(id) {
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/patient?id=${id}`;
    API_Get(endPoint)
      .then((response) => {
        console.log("Patients  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  Patients  :", error);
        reject(error);
      });
  });
}

export async function getDonePatient() {
  return new Promise((resolve, reject) => {
    const endPoint = "/api/v1/patient/done";
    API_Get(endPoint)
      .then((response) => {
        console.log("Done patient fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  Done patient  :", error);
        reject(error);
      });
  });
}

export async function getAllPatient() {
  return new Promise((resolve, reject) => {
    const endPoint = "/api/v1/patient";
    API_Get(endPoint)
      .then((response) => {
        console.log("Done appointments  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  Done appointments  :", error);
        reject(error);
      });
  });
}

export async function getNewPatients() {
  return new Promise((resolve, reject) => {
    const endPoint = "/api/v1/patient/new";
    API_Get(endPoint)
      .then((response) => {
        console.log("new patient fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  new patient :", error);
        reject(error);
      });
  });
}

export async function getProgressPatients() {
  return new Promise((resolve, reject) => {
    const endPoint = "/api/v1/patient/appointed";
    API_Get(endPoint)
      .then((response) => {
        console.log(
          "iN PROGRESS appointments  fetched successfully:",
          response
        );
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  iN PROGRESS appointments  :", error);
        reject(error);
      });
  });
}

export async function deletePatient(id) {
  const endPoint = `/api/v1/appointments?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Delete(endPoint)
      .then((response) => {
        console.log("Appointments details deleted:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in deleting Appointments :", error);
        reject(error);
      });
  });
}

export async function updatePatients(data, id) {
  const endPoint = `/api/v1/patient?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Patch(endPoint, data)
      .then((response) => {
        console.log("Patient details updated:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in updating Patient:", error);
        reject(error);
      });
  });
}

//SESSION SECTION
export async function createSessionById(data, id) {
  console.log(data, "data submitted on server for session");
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/sessions/patient?id=${id}`;
    console.log("here")
    API_Post(endPoint, data)
      .then((response) => {
        // console.log("Session created:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in create session:", error);
        reject(error);
      });
  });
}

export async function createSessionLogById(data, id) {
  console.log(data, "data submitted on server for session");
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/sessions/session_log/${id}`;
    console.log("here")
    API_Post(endPoint, data)
      .then((response) => {
        // console.log("Session created:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in create session:", error);
        reject(error);
      });
  });
}

export async function getSessionById(id) {
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/session?id=${id}`;
    API_Get(endPoint)
      .then((response) => {
        console.log(
          "session by id  fetched successfully:",
          response
        );
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  get session by id  :", error);
        reject(error);
      });
  });
}

export async function updateSession(data, id) {
  const endPoint = `/api/v1/session?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Patch(endPoint, data)
      .then((response) => {
        console.log("Patient details updated:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in updating Patient:", error);
        reject(error);
      });
  });
}

export async function deleteSession(id) {
  const endPoint = `/api/v1/session?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Delete(endPoint)
      .then((response) => {
        console.log("session details deleted:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in deleting session :", error);
        reject(error);
      });
  });
}

//SESSION_LOG SECTION

export async function getSessionLogById(id) {
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/sessions/session_log?id=${id}`;
    API_Get(endPoint)
      .then((response) => {
        console.log(
          "getsession by id  fetched successfully:",
          response
        );
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  get session by id  :", error);
        reject(error);
      });
  });
}

export async function getSessionLogBySessionId(id) {
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/sessions/session_log/${id}`;
    API_Get(endPoint)
      .then((response) => {
        // console.log(
        //   "getsession by session id  fetched successfully:",
        //   response
        // );
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  get session by iddddd:", error);
        reject(error);
      });
  });
}


export async function updateSessionLog(data, id) {
  const endPoint = `/api/v1/sessions/session_log?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Patch(endPoint, data)
      .then((response) => {
        console.log("Patient details updated:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in updating Patient:", error);
        reject(error);
      });
  });
}
export async function deleteSessionLog(id) {
  const endPoint = `/api/v1/sessions/session_log?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Delete(endPoint)
      .then((response) => {
        console.log("session details deleted:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in deleting session :", error);
        reject(error);
      });
  });
}
export async function createUsers(data) {
  console.log(data, "data submitted on server for appointment");
  return new Promise((resolve, reject) => {
    const endPoint = "/api/v1/users";
    API_Post(endPoint, data)
      .then((response) => {
        console.log("Users details created:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in createUsers:", error);
        reject(error);
      });
  });
}


// USERS SECTION 
export async function getAllUsers() {
  return new Promise((resolve, reject) => {
    const endPoint = "/api/v1/users";
    API_Get(endPoint)
      .then((response) => {
        console.log("Done Users  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  Done Users  :", error);
        reject(error);
      });
  });
}

export async function getUserById(id) {
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/users/by_id?id=${id}`;
    API_Get(endPoint)
      .then((response) => {
        console.log("Done Users  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  Done Users  :", error);
        reject(error);
      });
  });
}

export async function deleteUsers(id) {
  const endPoint = `/api/v1/users?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Delete(endPoint)
      .then((response) => {
        console.log("Users details deleted:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in deleting Users :", error);
        reject(error);
      });
  });
}

export async function updateUsers(data, id) {
  const endPoint = `/api/v1/users?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Patch(endPoint, data)
      .then((response) => {
        console.log("Users details updated:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in updating Users:", error);
        reject(error);
      });
  });
}

//PAYMENT SECTION
export async function createPaymentBySessionLog(id) {
  console.log(id, "data submitted on server for session");
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/payments/session_log?id=${id}`;
    API_Post(endPoint)
      .then((response) => {
        console.log("Session payment created:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in create session payment:", error);
        reject(error);
      });
  });
}

export async function getPaymentById(id) {
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/payments/session_log?id=${id}`;
    API_Get(endPoint)
      .then((response) => {
        console.log("Done Users  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  Done Users  :", error);
        reject(error);
      });
  });
}

export async function updatePaymentById(data, id) {
  const endPoint = `/api/v1/payments?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Patch(endPoint, data)
      .then((response) => {
        console.log("Users details updated:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in updating Users:", error);
        reject(error);
      });
  });
}


//BLOGS SECTION
export async function createBlogs(data) { 
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/blogs`;
    API_PostFormData(endPoint, data)
      .then((response) => {
        console.log("blogs created:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in create blogs :", error);
        reject(error);
      });
  });
}

export async function getAllBlogs() {
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/blogs`;
    API_Get(endPoint)
      .then((response) => {
        console.log("All blogs  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  All blogs  :", error);
        reject(error);
      });
  });
}


export async function getBlogById(id) {
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/blogs?id=${id}`;
    API_Get(endPoint)
      .then((response) => {
        console.log("Blog by id  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  Blog by id  :", error);
        reject(error);
      });
  });
}

export async function updateBlogs(data, id) {
  const endPoint = `/api/v1/blogs?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Patch(endPoint, data)
      .then((response) => {
        console.log("Blogs details updated:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in updating blogs:", error);
        reject(error);
      });
  });
}

export async function deleteBlogs(id) {
  const endPoint = `/api/v1/blogs?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Delete(endPoint)
      .then((response) => {
        console.log("Blogs details deleted:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in deleting Blogs :", error);
        reject(error);
      });
  });
}

//SERVICES SECTION
export async function createServices(data) { 
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/category/sub_category`;
    API_PostFormData(endPoint, data)
      .then((response) => {
        console.log("Services created:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in create Services :", error);
        reject(error);
      });
  });
}



export async function getAllServices() {
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/category/sub_category`;
    API_Get(endPoint)
      .then((response) => {
        console.log("All Services  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  All Services  :", error);
        reject(error);
      });
  });
}


export async function getServicesById(id) {
  return new Promise((resolve, reject) => {
    const endPoint = `/api/v1/category/sub_category?id=${id}`;
    API_Get(endPoint)
      .then((response) => {
        console.log("Blog by id  fetched successfully:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error fetching  Blog by id  :", error);
        reject(error);
      });
  });
}

export async function updateServices(data, id) {
  const endPoint = `/api/v1/category/sub_category?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Patch(endPoint, data)
      .then((response) => {
        console.log("Services details updated:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in updating Services:", error);
        reject(error);
      });
  });
}

export async function deleteServices(id) {
  const endPoint = `/api/v1/category/sub_category?id=${id}`;
  return new Promise((resolve, reject) => {
    API_Delete(endPoint)
      .then((response) => {
        console.log("Blogs details deleted:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error in deleting Blogs :", error);
        reject(error);
      });
  });
}


