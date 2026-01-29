import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.css']
})
export class PersonEditComponent implements OnInit {
  personForm: FormGroup;
  isEditMode: boolean = false;
  personId: string;
  loading: boolean = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(150)]],
      gender: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  ngOnInit() {
    this.personId = this.route.snapshot.paramMap.get('id');
    
    if (this.personId) {
      this.isEditMode = true;
      this.loadPerson();
    }
  }

  loadPerson() {
    this.loading = true;
    this.personService.getPersonById(this.personId).subscribe(
      (person: Person) => {
        this.personForm.patchValue(person);
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load person';
        this.loading = false;
        console.error('Error loading person:', error);
      }
    );
  }

  onSubmit() {
    if (this.personForm.valid) {
      this.loading = true;
      const personData: Person = this.personForm.value;

      if (this.isEditMode) {
        this.personService.updatePerson(this.personId, personData).subscribe(
          () => {
            this.router.navigate(['/persons']);
          },
          (error) => {
            this.error = 'Failed to update person';
            this.loading = false;
            console.error('Error updating person:', error);
          }
        );
      } else {
        this.personService.createPerson(personData).subscribe(
          () => {
            this.router.navigate(['/persons']);
          },
          (error) => {
            this.error = 'Failed to create person';
            this.loading = false;
            console.error('Error creating person:', error);
          }
        );
      }
    }
  }

  cancel() {
    this.router.navigate(['/persons']);
  }
}