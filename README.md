# Build app
## Commands:
```console
git clone https://github.com/AntonMaslik/testapi
cd testapi
npm install
npm run start
```

# Endpoints:
## Endpoint: `GET /tasks`

### Description:
Retrieves a list of all tasks in the system 😊

### HTTP Method:
`GET`

### Response:
- **Status Code**: `200 OK`
- **Body**: A list of all tasks with details (e.g., task ID, title, description, due date, status, etc.)

### Permissions:
- Publicly accessible, no authentication required 😊

### Errors:
- **404 Not Found**: If no tasks are found.
- **500 Internal Server Error**: If there is an issue on the server.

---

## Endpoint: `POST /tasks`

### Description:
Creates a new task in the system 📝

### HTTP Method:
`POST`

### Request Body:
- A JSON object containing task details such as title, description, due date, and assignee.

### Response:
- **Status Code**: `201 Created`
- **Body**: Task details, including the newly created task ID.

### Permissions:
- Authenticated users can create tasks 😊

### Errors:
- **400 Bad Request**: If the request body is malformed or missing required fields.
- **401 Unauthorized**: If the user is not authenticated.
- **500 Internal Server Error**: If there is a server error while creating the task.

---

## Endpoint: `PUT /tasks/{task-id}`

### Description:
Updates an existing task by ID ✍️

### HTTP Method:
`PUT`

### Request Body:
- A JSON object containing the updated task details (e.g., title, description, due date, status).

### Response:
- **Status Code**: `200 OK`
- **Body**: Updated task details.

### Permissions:
- The task owner or an admin can update the task 😊

### Errors:
- **404 Not Found**: If the task with the specified ID does not exist.
- **400 Bad Request**: If the request body is malformed or missing required fields.
- **401 Unauthorized**: If the user is not authorized to update the task.
- **500 Internal Server Error**: If there is a server error while updating the task.

---

## Endpoint: `DELETE /tasks/{task-id}`

### Description:
Deletes a task by ID 🗑️

### HTTP Method:
`DELETE`

### Response:
- **Status Code**: `204 No Content`
- **Body**: No content in response body.

### Permissions:
- Only the task creator or an admin can delete the task 😊

### Errors:
- **404 Not Found**: If the task with the specified ID does not exist.
- **401 Unauthorized**: If the user does not have permission to delete the task.
- **500 Internal Server Error**: If there is an issue deleting the task.

---

## Endpoint: `GET /users/me`

### Description:
Retrieves the current authenticated user's information 😎

### HTTP Method:
`GET`

### Response:
- **Status Code**: `200 OK`
- **Body**: User details (e.g., user ID, name, email, role).

### Permissions:
- Requires authentication. The current user can access their own data 😊

### Errors:
- **401 Unauthorized**: If the user is not authenticated.
- **500 Internal Server Error**: If there is an issue fetching user data.

---

## Endpoint: `POST /auth-login`

### Description:
Authenticates a user and provides an access token 🔑

### HTTP Method:
`POST`

### Request Body:
- A JSON object with the user's email and password.

### Response:
- **Status Code**: `200 OK`
- **Body**: Access token and refresh token.

### Permissions:
- No authentication required to log in 😊

### Errors:
- **400 Bad Request**: If the login credentials are invalid.
- **401 Unauthorized**: If the email or password is incorrect.
- **500 Internal Server Error**: If there is an issue on the server during login.

---

## Endpoint: `POST /auth-signup`

### Description:
Creates a new user account 🎉

### HTTP Method:
`POST`

### Request Body:
- A JSON object containing user information such as name, email, and password.

### Response:
- **Status Code**: `201 Created`
- **Body**: A message indicating successful account creation.

### Permissions:
- No authentication required for signup 😊

### Errors:
- **400 Bad Request**: If the request body is incomplete or invalid.
- **409 Conflict**: If the email is already in use.
- **500 Internal Server Error**: If there is an issue creating the user account.

---

## Endpoint: `GET /workspaces/{workspace-id}`

### Description:
Retrieves details of a specific workspace, including task counts and statuses 🏢

### HTTP Method:
`GET`

### Response:
- **Status Code**: `200 OK`
- **Body**: Workspace details such as ID, title, task count (total, completed, pending).

### Permissions:
- Publicly accessible, no authentication required 😊

### Errors:
- **404 Not Found**: If the workspace with the specified ID does not exist.
- **500 Internal Server Error**: If there is an issue fetching workspace details.

---

## Endpoint: `POST /workspaces`

### Description:
Creates a new workspace 🛠️

### HTTP Method:
`POST`

### Request Body:
- A JSON object containing workspace details (title, description).

### Response:
- **Status Code**: `201 Created`
- **Body**: Newly created workspace details.

### Permissions:
- Requires authentication. Any authenticated user can create a workspace 😊

### Errors:
- **400 Bad Request**: If the request body is malformed or missing required fields.
- **401 Unauthorized**: If the user is not authenticated.
- **500 Internal Server Error**: If there is an issue creating the workspace.

---

## Endpoint: `PUT /workspaces/{workspace-id}`

### Description:
Updates an existing workspace by ID 🔄

### HTTP Method:
`PUT`

### Request Body:
- A JSON object containing the updated workspace details (e.g., title, description).

### Response:
- **Status Code**: `200 OK`
- **Body**: Updated workspace details.

### Permissions:
- Only the workspace creator or an admin can update the workspace 😊

### Errors:
- **404 Not Found**: If the workspace with the specified ID does not exist.
- **400 Bad Request**: If the request body is malformed or missing required fields.
- **401 Unauthorized**: If the user is not authorized to update the workspace.
- **500 Internal Server Error**: If there is a server error while updating the workspace.

---

## Endpoint: `DELETE /workspaces/{workspace-id}`

### Description:
Deletes a workspace by ID 🗑️

### HTTP Method:
`DELETE`

### Response:
- **Status Code**: `204 No Content`
- **Body**: No content in response body.

### Permissions:
- Only the workspace creator or an admin can delete the workspace 😊

### Errors:
- **404 Not Found**: If the workspace with the specified ID does not exist.
- **401 Unauthorized**: If the user does not have permission to delete the workspace.
- **500 Internal Server Error**: If there is an issue deleting the workspace.

---

## Endpoint: `POST /auth-logout`

### Description:
Logs out the current user and invalidates their session 🚪

### HTTP Method:
`POST`

### Response:
- **Status Code**: `204 No Content`
- **Body**: No content in response body.

### Permissions:
- Requires authentication. The current user can log out 😊

### Errors:
- **500 Internal Server Error**: If there is an issue logging out the user.

