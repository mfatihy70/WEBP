// src/ChatUI.ts

import { ApiService } from "./ApiService.js"
import { StateManager } from "./StateManager.js"

export class ChatUI {
  private currentReceiverId: string | null = null

  constructor() {
    this.renderUI() // Render the initial UI from the template
    this.initEventListeners() // Initialize event listeners for user interactions
  }

  private renderUI() {
    // Load the chat app template and inject it into the document body
    const template = document.getElementById(
      "chatAppTemplate"
    ) as HTMLTemplateElement
    if (template) {
      document.body.innerHTML = template.innerHTML
    } else {
      console.error("Chat app template not found")
    }
  }

  private initEventListeners() {
    // Attach event listeners to various UI elements
    document
      .getElementById("registerForm")
      ?.addEventListener("submit", (e) => this.handleRegister(e)) // Handle user registration
    document
      .getElementById("loginForm")
      ?.addEventListener("submit", (e) => this.handleLogin(e)) // Handle user login
    document
      .getElementById("refreshUsers")
      ?.addEventListener("click", () => this.handleGetUsers()) // Refresh the list of users
    document
      .getElementById("chatForm")
      ?.addEventListener("submit", (e) => this.handleChatSend(e)) // Send a chat message
  }

  private async handleRegister(event: Event) {
    event.preventDefault()
    const resultDiv = document.getElementById("registerResult")!
    resultDiv.textContent = "Registering..." // Show a loading message

    try {
      // Call the API to register a new user
      const response = await ApiService.registerUser(
        (document.getElementById("regName") as HTMLInputElement).value,
        (document.getElementById("regEmail") as HTMLInputElement).value,
        (document.getElementById("regPass") as HTMLInputElement).value,
        (document.getElementById("regGroup") as HTMLInputElement).value
      )

      if (response.success) {
        resultDiv.textContent = `Registered! User ID: ${response.id}` // Show success message
        ;(event.target as HTMLFormElement).reset() // Reset the form
      } else {
        resultDiv.textContent = `Error: ${
          response.error || "Registration failed"
        }` // Show error message
      }
    } catch (err) {
      resultDiv.textContent = "Network error" // Handle network errors
      console.error(err)
    }
  }

  private async handleLogin(event: Event) {
    event.preventDefault()
    const resultDiv = document.getElementById("loginResult")!
    resultDiv.textContent = "Logging in..." // Show a loading message

    try {
      // Call the API to log in the user
      const response = await ApiService.loginUser(
        (document.getElementById("loginUser") as HTMLInputElement).value,
        (document.getElementById("loginPass") as HTMLInputElement).value
      )

      if (response.token) {
        StateManager.setToken(response.token) // Save the token in the state manager
        resultDiv.textContent = "Login successful!" // Show success message
        ;(event.target as HTMLFormElement).reset() // Reset the form
        document.getElementById("chatApp")!.style.display = "flex" // Show the chat app UI
        this.handleGetUsers() // Load the list of users
      } else {
        resultDiv.textContent = `Error: ${response.error || "Login failed"}` // Show error message
      }
    } catch (err) {
      resultDiv.textContent = "Network error" // Handle network errors
      console.error(err)
    }
  }

  private async handleGetUsers() {
    const usersList = document.getElementById("usersList")!
    usersList.innerHTML = "Loading users..." // Show a loading message

    try {
      // Call the API to fetch the list of users
      const data = await ApiService.getUsers()
      if (Array.isArray(data)) {
        usersList.innerHTML = "" // Clear the users list
        data.forEach((user) => {
          // Create a list item for each user
          const li = document.createElement("li")
          li.className = "user-item"
          li.innerHTML = `
            <span class="user-name">${user.name}</span>
            <span class="user-id">(ID: ${user.id})</span>
            <span class="user-group">Group ${user.group_id}</span>
          `
          li.addEventListener("click", () => this.loadConversation(user.id)) // Load conversation on click
          usersList.appendChild(li)
        })
      } else {
        usersList.innerHTML = `Error: ${data.error || "Failed to load users"}` // Show error message
      }
    } catch (err) {
      usersList.innerHTML = "Network error" // Handle network errors
      console.error(err)
    }
  }

  private async loadConversation(receiverId: string) {
    this.currentReceiverId = receiverId
    const chatMessages = document.getElementById("chat-messages")!
    chatMessages.innerHTML = "Loading conversation..." // Show a loading message

    try {
      const currentUserId = ApiService.getRegisteredUserId()
      if (!currentUserId) {
        chatMessages.innerHTML = "Please login first" // Ensure the user is logged in
        return
      }

      // Call the API to fetch the conversation
      const data = await ApiService.getConversation(currentUserId, receiverId)
      if (Array.isArray(data)) {
        chatMessages.innerHTML = "" // Clear the chat messages
        data.forEach((msg) => {
          // Create a message element for each message
          const isSent = msg.sender_id === currentUserId
          const messageDiv = document.createElement("div")
          messageDiv.className = `chat-message ${isSent ? "sent" : "received"}`
          messageDiv.textContent = msg.message
          chatMessages.appendChild(messageDiv)
        })
        chatMessages.scrollTop = chatMessages.scrollHeight // Scroll to the bottom of the chat
      } else {
        chatMessages.innerHTML = `Error: ${
          data.error || "Failed to load conversation"
        }` // Show error message
      }
    } catch (err) {
      chatMessages.innerHTML = "Network error" // Handle network errors
      console.error(err)
    }
  }

  private async handleChatSend(event: Event) {
    event.preventDefault()
    const input = document.getElementById("chatInput") as HTMLInputElement
    const message = input.value.trim()
    if (!message || !this.currentReceiverId) return // Ensure a message and receiver are present

    try {
      const currentUserId = ApiService.getRegisteredUserId()
      if (!currentUserId) {
        alert("Please login first") // Ensure the user is logged in
        return
      }

      // Call the API to send the message
      const response = await ApiService.sendMessage(
        currentUserId,
        this.currentReceiverId,
        message
      )

      if (response.success) {
        input.value = "" // Clear the input field
        this.loadConversation(this.currentReceiverId) // Reload the conversation
      } else {
        alert(`Error: ${response.error || "Failed to send message"}`) // Show error message
      }
    } catch (err) {
      alert("Network error") // Handle network errors
      console.error(err)
    }
  }
}
