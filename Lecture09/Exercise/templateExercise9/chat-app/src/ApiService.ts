// src/ApiService.ts

// Interface representing the structure of an API response
export interface ApiResponse {
  success?: boolean // Indicates if the API call was successful
  error?: string // Error message, if any
  id?: string // User ID or other identifier
  token?: string // Authentication token
}

// Interface representing a user
export interface User {
  id: string // Unique identifier for the user
  name: string // Name of the user
  group_id: string // Group ID the user belongs to
}

// Interface representing a message
export interface Message {
  sender_id: string // ID of the sender
  receiver_id: string // ID of the receiver
  message: string // Content of the message
  timestamp: number // Timestamp of when the message was sent
}

// Base URL for the API endpoints
const BASE_URL = "http://webp-ilv-backend.cs.technikum-wien.at/messenger"

// ApiService class to handle API interactions
export class ApiService {
  // Static variables to store the authentication token and registered user ID
  private static token: string | null = null
  private static registeredUserId: string | null = null

  // Getter for the authentication token
  static getToken(): string | null {
    return this.token
  }

  // Getter for the registered user ID
  static getRegisteredUserId(): string | null {
    return this.registeredUserId
  }

  // Registers a new user with the provided details
  static async registerUser(
    name: string,
    email: string,
    password: string,
    groupId: string
  ): Promise<ApiResponse> {
    const url = `${BASE_URL}/registrieren.php`
    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("password", password)
    formData.append("group_id", groupId)

    // Sends a POST request to the registration endpoint
    const resp = await fetch(url, { method: "POST", body: formData })
    const data: ApiResponse = await resp.json()

    // Stores the registered user ID if available
    if (data.id) this.registeredUserId = data.id
    return data
  }

  // Logs in a user with the provided credentials
  static async loginUser(
    usernameOrEmail: string,
    password: string
  ): Promise<ApiResponse> {
    const url = `${BASE_URL}/login.php`
    const formData = new FormData()
    formData.append("username_or_email", usernameOrEmail)
    formData.append("password", password)

    // Sends a POST request to the login endpoint
    const resp = await fetch(url, { method: "POST", body: formData })
    const data: ApiResponse = await resp.json()

    // Stores the authentication token and user ID if available
    if (data.token) this.token = data.token
    if (data.id) this.registeredUserId = data.id
    return data
  }

  // Fetches the list of users
  static async getUsers(): Promise<User[] | { error?: string }> {
    const params: string[] = []
    if (this.token) params.push(`token=${this.token}`)
    if (this.registeredUserId) params.push(`id=${this.registeredUserId}`)

    // Constructs the query string with token and user ID
    const queryString = params.length > 0 ? "?" + params.join("&") : ""
    const url = `${BASE_URL}/get_users.php${queryString}`

    // Sends a GET request to fetch users
    const resp = await fetch(url)
    return resp.json()
  }

  // Fetches the conversation between two users
  static async getConversation(
    user1Id: string,
    user2Id: string
  ): Promise<Message[] | { error?: string }> {
    const url = `${BASE_URL}/get_conversation.php?token=${this.token}&user1_id=${user1Id}&user2_id=${user2Id}`

    // Sends a GET request to fetch the conversation
    const resp = await fetch(url)
    return resp.json()
  }

  // Sends a message from one user to another
  static async sendMessage(
    senderId: string,
    receiverId: string,
    message: string
  ): Promise<ApiResponse> {
    const url = `${BASE_URL}/send_message.php`
    const formData = new FormData()
    formData.append("sender_id", senderId)
    formData.append("receiver_id", receiverId)
    formData.append("message", message)
    if (this.token) formData.append("token", this.token)

    // Sends a POST request to send the message
    const resp = await fetch(url, { method: "POST", body: formData })
    return resp.json()
  }
}
