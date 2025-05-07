// src/ApiService.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Base URL for the API endpoints
const BASE_URL = "http://webp-ilv-backend.cs.technikum-wien.at/messenger";
// ApiService class to handle API interactions
export class ApiService {
    // Getter for the authentication token
    static getToken() {
        return this.token;
    }
    // Getter for the registered user ID
    static getRegisteredUserId() {
        return this.registeredUserId;
    }
    // Registers a new user with the provided details
    static registerUser(name, email, password, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${BASE_URL}/registrieren.php`;
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("group_id", groupId);
            // Sends a POST request to the registration endpoint
            const resp = yield fetch(url, { method: "POST", body: formData });
            const data = yield resp.json();
            // Stores the registered user ID if available
            if (data.id)
                this.registeredUserId = data.id;
            return data;
        });
    }
    // Logs in a user with the provided credentials
    static loginUser(usernameOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${BASE_URL}/login.php`;
            const formData = new FormData();
            formData.append("username_or_email", usernameOrEmail);
            formData.append("password", password);
            // Sends a POST request to the login endpoint
            const resp = yield fetch(url, { method: "POST", body: formData });
            const data = yield resp.json();
            // Stores the authentication token and user ID if available
            if (data.token)
                this.token = data.token;
            if (data.id)
                this.registeredUserId = data.id;
            return data;
        });
    }
    // Fetches the list of users
    static getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = [];
            if (this.token)
                params.push(`token=${this.token}`);
            if (this.registeredUserId)
                params.push(`id=${this.registeredUserId}`);
            // Constructs the query string with token and user ID
            const queryString = params.length > 0 ? "?" + params.join("&") : "";
            const url = `${BASE_URL}/get_users.php${queryString}`;
            // Sends a GET request to fetch users
            const resp = yield fetch(url);
            return resp.json();
        });
    }
    // Fetches the conversation between two users
    static getConversation(user1Id, user2Id) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${BASE_URL}/get_conversation.php?token=${this.token}&user1_id=${user1Id}&user2_id=${user2Id}`;
            // Sends a GET request to fetch the conversation
            const resp = yield fetch(url);
            return resp.json();
        });
    }
    // Sends a message from one user to another
    static sendMessage(senderId, receiverId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${BASE_URL}/send_message.php`;
            const formData = new FormData();
            formData.append("sender_id", senderId);
            formData.append("receiver_id", receiverId);
            formData.append("message", message);
            if (this.token)
                formData.append("token", this.token);
            // Sends a POST request to send the message
            const resp = yield fetch(url, { method: "POST", body: formData });
            return resp.json();
        });
    }
}
// Static variables to store the authentication token and registered user ID
ApiService.token = null;
ApiService.registeredUserId = null;
