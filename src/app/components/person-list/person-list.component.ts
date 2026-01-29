import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {
  persons: Person[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private personService: PersonService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadPersons();
  }

  loadPersons() {
    this.loading = true;
    this.personService.getAllPersons().subscribe(
      (data: Person[]) => {
        this.persons = data;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load persons. Make sure the backend server is running.';
        this.loading = false;
        console.error('Error loading persons:', error);
      }
    );
  }

  editPerson(id: string) {
    this.router.navigate(['/person/edit', id]);
  }

  deletePerson(id: string) {
    this.router.navigate(['/person/delete', id]);
  }

  createPerson() {
    this.router.navigate(['/person/create']);
  }
}