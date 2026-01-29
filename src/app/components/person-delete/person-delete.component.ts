import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-person-delete',
  templateUrl: './person-delete.component.html',
  styleUrls: ['./person-delete.component.css']
})
export class PersonDeleteComponent implements OnInit {
  person: Person;
  personId: string;
  loading: boolean = false;
  error: string = '';

  constructor(
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.personId = this.route.snapshot.paramMap.get('id');
    this.loadPerson();
  }

  loadPerson() {
    this.loading = true;
    this.personService.getPersonById(this.personId).subscribe(
      (person: Person) => {
        this.person = person;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load person';
        this.loading = false;
        console.error('Error loading person:', error);
      }
    );
  }

  confirmDelete() {
    this.loading = true;
    this.personService.deletePerson(this.personId).subscribe(
      () => {
        this.router.navigate(['/persons']);
      },
      (error) => {
        this.error = 'Failed to delete person';
        this.loading = false;
        console.error('Error deleting person:', error);
      }
    );
  }

  cancel() {
    this.router.navigate(['/persons']);
  }
}