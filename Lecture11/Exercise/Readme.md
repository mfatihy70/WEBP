# Week 11 Exercise: Updating Your Angular Messenger with REST Integration

### **Objective**

This week, you will **extend** your Angular Messenger frontend from Week 10 by integrating a **RESTful backend API**. You will dynamically fetch and send messages, handle asynchronous operations using **Observables**, and improve the **user experience** through error handling and UX feedback.

You are working on top of your existing project from Week 10. All changes should extend or replace your current components and service structure.

Total: **7 Points**

---

## **Update Tasks and Points Overview**

### **1. Add HttpClientModule and MessageService** (1 Point)

* In `app.module.ts`, import `HttpClientModule`:

  ```ts
  import { HttpClientModule } from '@angular/common/http';

  @NgModule({
    imports: [HttpClientModule],
  })
  export class AppModule {}
  ```

* Generate a service via CLI:

  ```bash
  ng generate service message
  ```

* Create the `MessageService` to handle HTTP logic:

  ```ts
  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { Message } from '../models/message.model';

  @Injectable({ providedIn: 'root' })
  export class MessageService {
    private apiUrl = 'https://your-api-url/messages';

    constructor(private http: HttpClient) {}

    getMessages(): Observable<Message[]> {
      return this.http.get<Message[]>(this.apiUrl);
    }

    sendMessage(message: Message): Observable<any> {
      return this.http.post(this.apiUrl, message);
    }
  }
  ```

* Create an interface `Message` in `src/app/models/message.model.ts`:

  ```ts
  export interface Message {
    sender: string;
    content: string;
    timestamp?: string;
  }
  ```

### **2. Replace Mock Data with API Calls in MessageListComponent** (2 Points)

* In `MessageListComponent`, inject the new service:

  ```ts
  constructor(private messageService: MessageService) {}
  ```

* Replace `messages = [...]` with an empty array and update `ngOnInit()`:

  ```ts
  messages: Message[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.isLoading = true;
    this.messageService.getMessages().subscribe({
      next: (data) => {
        this.messages = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load messages';
        this.isLoading = false;
      }
    });
  }
  ```

* Update the component template to handle loading and error feedback:

  ```html
  <div *ngIf="isLoading">Loading messages...</div>
  <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>

  <div *ngFor="let msg of messages">
    <strong>{{ msg.sender }}</strong>: {{ msg.content }}
  </div>
  ```

### **3. Add Send Message Functionality** (2 Points)

* Add an input field and button to `message-list.component.html`:

  ```html
  <input [(ngModel)]="newMessage" placeholder="Type a message" name="message" />
  <button (click)="sendMessage()" [disabled]="!newMessage.trim()">Send</button>
  ```

* Implement the `sendMessage()` method in the component:

  ```ts
  newMessage = '';

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const message: Message = {
      sender: 'User',
      content: this.newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    this.messageService.sendMessage(message).subscribe({
      next: () => {
        this.messages.push(message);
        this.newMessage = '';
      },
      error: (err) => {
        console.error('Send failed', err);
      }
    });
  }
  ```

* Ensure the form is cleared after sending and the button is disabled when empty.

### **4. Add Loading and Error Feedback** (1.5 Points)

* Ensure proper states are managed:

  ```ts
  isLoading = false;
  errorMessage = '';
  ```

* In the template:

  ```html
  <div *ngIf="isLoading">Loading messages...</div>
  <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
  ```

* Optionally disable the send button during submission or show a spinner/icon.

* Use `*ngIf` to hide the message list during loading.

### **5. Keep Your Code Modular and Clean** (0.5 Points)

* Move all API interaction to the `MessageService`.
* Use the `Message` interface consistently.
* Folder structure recommendation:

  * `src/app/models/message.model.ts`
  * `src/app/services/message.service.ts`
  * `src/app/message/message-list/message-list.component.ts`

---

## **Total Points Available: 7**

| Task                                  | Max Points |
| ------------------------------------- | ---------- |
| Add HttpClientModule & MessageService | 1          |
| Replace Mock Data with API Calls      | 2          |
| Send Messages via Service             | 2          |
| Error Handling & UX Feedback          | 1.5        |
| Modular Code Structure                | 0.5        |

---

## **Submission Requirements**

* Use your existing project from Week 10 as a base.
* All mock data should be replaced with real API communication.
* Messages are loaded and sent via API using proper Angular services.
* Basic loading indicators and error handling must be implemented.
* Code is clean, modular, and maintainable.

---

## **Optional Enhancements**

* Show timestamps in the UI (e.g. with `DatePipe`).
* Auto-scroll to the latest message after sending.
* Add "user is typing" indicators.
* Use Angular Material or Bootstrap for improved styling.

---

**You are now connecting your frontend to the real world — great job! 🚀**