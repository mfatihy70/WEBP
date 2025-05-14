import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-message-list',
  imports: [CommonModule],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css',
})
export class MessageListComponent {
  messages = [
    { sender: 'Alice', content: 'Hello there!' },
    { sender: 'Bob', content: 'Welcome to the messenger app!' },
  ];
}
