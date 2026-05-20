import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-linkedin',
  standalone: true,
  templateUrl: './linkedin.component.html',
  styleUrl: './linkedin.component.scss'
})
export class LinkedinComponent implements OnInit {
  ngOnInit() {
    window.location.href = 'https://www.linkedin.com/in/serrano-alexis/';
  }
}
