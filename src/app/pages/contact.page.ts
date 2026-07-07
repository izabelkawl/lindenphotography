import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-page',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPage {
  private readonly fb = inject(FormBuilder);

  protected readonly contactForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    eventDate: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected submitForm(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.contactForm.reset({
      firstName: '',
      lastName: '',
      eventDate: '',
      email: '',
      message: '',
    });
  }
}
