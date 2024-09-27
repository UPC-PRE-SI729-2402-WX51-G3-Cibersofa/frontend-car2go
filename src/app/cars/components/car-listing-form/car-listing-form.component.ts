import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarService } from '../../services/car.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-listing-form',
  templateUrl: './car-listing-form.component.html',
  styleUrls: ['./car-listing-form.component.css']
})
export class CarListingFormComponent {
  @Output() formClosed = new EventEmitter<void>();
  @Output() carAdded = new EventEmitter<any>();
  carForm: FormGroup;
  photos: File[] = [];
  photoPreviews: string[] = [];
  showPreviewModal: boolean = false;
  currentImageIndex: number = 0;
  previewImageIndex: number = 0;

  constructor(private fb: FormBuilder, private carService: CarService, private router: Router) {
    this.carForm = this.fb.group({
      name: ['Juan Pérez', Validators.required],
      phone: ['5551234567', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      email: ['juan.perez@example.com', [Validators.required, Validators.email]],
      brand: ['Toyota', Validators.required],
      model: ['Corolla', Validators.required],
      color: ['White', Validators.required],
      year: ['2018', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      price: [15000, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      transmission: ['Automatic', Validators.required],
      engine: ['2.0L', Validators.required],
      mileage: [45000, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      doors: ['4', Validators.required],
      plate: ['ABC1234', Validators.required],
      location: ['Mexico City', Validators.required],
      description: ['Vehicle in excellent condition, single owner, all services done at the dealership. Includes 4 new tires.', Validators.required],
      image: ['assets/default_image.jpg'],
      fuel: ['Gasoline', Validators.required],
      speed: [180, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }

  onFileSelected(event: any) {
    const selectedFiles = event.target.files;
    this.photos = [];
    this.photoPreviews = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      this.photos.push(selectedFiles[i]);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreviews.push(e.target.result);
      };
      reader.readAsDataURL(selectedFiles[i]);
    }
    this.currentImageIndex = 0;
  }

  removeImage(index: number) {
    this.photoPreviews.splice(index, 1);
    this.photos.splice(index, 1);
    if (this.currentImageIndex >= this.photoPreviews.length) {
      this.currentImageIndex = this.photoPreviews.length - 1;
    }
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.photoPreviews.length - 1) {
      this.currentImageIndex++;
    }
  }

  prevPreviewImage() {
    if (this.previewImageIndex > 0) {
      this.previewImageIndex--;
    }
  }

  nextPreviewImage() {
    if (this.previewImageIndex < this.photoPreviews.length - 1) {
      this.previewImageIndex++;
    }
  }

  openPreviewModal() {
    this.showPreviewModal = true;
    this.previewImageIndex = 0;
  }

  closePreviewModal() {
    this.showPreviewModal = false;
  }

  onSubmit() {
    if (this.carForm.valid) {
      const newCar = this.carForm.value;
      newCar.id = Date.now();
      newCar.title = `${newCar.brand} ${newCar.model}`;

      if (this.photoPreviews.length > 0) {
        newCar.image = this.photoPreviews[0];
        newCar.images = this.photoPreviews;
      } else {
        newCar.image = 'assets/default_image.jpg';
        newCar.images = ['assets/default_image.jpg'];
      }

      this.carService.addCar(newCar).subscribe(
        (response) => {
          this.carForm.reset();
          this.photos = [];
          this.photoPreviews = [];
          this.carAdded.emit(response);
          this.formClosed.emit();
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error adding car:', error);
        }
      );
    }
  }
}
