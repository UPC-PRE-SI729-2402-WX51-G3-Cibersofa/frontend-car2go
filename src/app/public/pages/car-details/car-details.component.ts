import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarService } from '../../../cars/services/car/car.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit, OnDestroy {
  car: any;
  userRole: string = '';
  mainImage: string = '';
  images: string[] = [];
  tempImages: string[] = [];
  defaultImage: string = 'assets/default_image.jpg';
  carForm: FormGroup;
  isModalOpen: boolean = false;
  currentIndex: number = 0;
  autoScrollInterval: any;
  autoScrollTime: number = 5000;
  newImages: File[] = [];
  isDragging: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;
  mouseDown: boolean = false;

  @ViewChild('thumbnailsContainer') thumbnailsContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private carService: CarService,
    private fb: FormBuilder
  ) {
    this.carForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      color: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      transmission: ['', Validators.required],
      engine: ['', Validators.required],
      mileage: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      doors: ['', Validators.required],
      plate: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      image: [''],
      fuel: ['', Validators.required],
      speed: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      images: [[]],
      userId: [''],
      status: ['', Validators.required]
    });

  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const carId = +params.get('id')!;
      this.carService.getCarById(carId).subscribe(
        (data: any) => {
          this.car = data;
          this.updateImages();
          this.populateForm();
          this.startAutoScroll();
        }
      );
    });

    this.userRole = localStorage.getItem('userRole') || '';
  }

  updateImages() {
    if (this.car && Array.isArray(this.car.image) && this.car.image.length > 0) {
      this.images = this.car.image;
      this.mainImage = this.images[0];
      this.currentIndex = 0;
    } else {
      this.mainImage = this.defaultImage;
      this.images = [this.defaultImage];
    }
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.mouseDown = true;
    this.startX = event.clientX;
  }

  onMouseMove(event: MouseEvent) {
    event.preventDefault();
    if (!this.mouseDown) return;
    const currentX = event.clientX;
    const diff = currentX - this.startX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        this.prevImage();
      } else {
        this.nextImage();
      }
      this.mouseDown = false;
    }
  }

  onMouseUp(event: MouseEvent) {
    event.preventDefault();
    this.mouseDown = false;
  }

  changeImage(index: number) {
    this.currentIndex = index;
    this.mainImage = this.images[index];
    this.restartAutoScroll();
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.mainImage = this.images[this.currentIndex];
    this.updateCarouselPosition();
    this.animateMainImageChange();
    this.restartAutoScroll();
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.mainImage = this.images[this.currentIndex];
    this.updateCarouselPosition();
    this.animateMainImageChange();
    this.restartAutoScroll();
  }

  animateMainImageChange() {
    const mainImageElement = document.querySelector('.main-image img');
    if (mainImageElement) {
      mainImageElement.classList.add('fade-out');
      setTimeout(() => {
        this.mainImage = this.images[this.currentIndex];
        mainImageElement.classList.remove('fade-out');
        mainImageElement.classList.add('fade-in');
        setTimeout(() => {
          mainImageElement.classList.remove('fade-in');
        }, 500);
      }, 500);
    }
  }

  updateCarouselPosition() {
    const thumbnailWidth = 90;
    const visibleThumbnails = 5;
    const thumbnailsContainer = this.thumbnailsContainer.nativeElement;
    const maxScrollLeft = thumbnailsContainer.scrollWidth - thumbnailsContainer.clientWidth;
    const scrollTo = thumbnailWidth * this.currentIndex - (thumbnailWidth * (visibleThumbnails / 2));
    const finalScroll = Math.max(0, Math.min(maxScrollLeft, scrollTo));
    thumbnailsContainer.scrollTo({
      left: finalScroll,
      behavior: 'smooth'
    });
  }

  startAutoScroll() {
    this.autoScrollInterval = setInterval(() => {
      this.nextImage();
    }, this.autoScrollTime);
  }

  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  restartAutoScroll() {
    this.stopAutoScroll();
    this.startAutoScroll();
  }

  openEditModal(): void {
    this.isModalOpen = true;
    this.stopAutoScroll();
    document.querySelector('main')?.classList.add('blur-background');
    document.body.style.overflow = 'hidden';
  }

  closeEditModal(): void {
    this.isModalOpen = false;
    this.tempImages = [];
    this.newImages = [];
    document.querySelector('main')?.classList.remove('blur-background');
    document.body.style.overflow = 'auto';
  }

  closeOnOutsideClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeEditModal();
    }
  }

  populateForm() {
    if (this.car) {
      this.carForm.patchValue(this.car);
      this.carForm.get('images')?.setValue(this.car.images || []);
    }
  }

  changeMainImage(index: number) {
    if (index < this.images.length) {
      const selectedImage = this.images[index];
      this.images.splice(index, 1);
      this.images.unshift(selectedImage);
      this.mainImage = selectedImage;
    }
  }


  startDragging(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX;
    this.scrollLeft = this.thumbnailsContainer.nativeElement.scrollLeft;
    event.preventDefault();
  }

  stopDragging() {
    this.isDragging = false;
  }

  dragThumbnails(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.clientX;
    const walk = (x - this.startX) * 2;
    this.thumbnailsContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  onImageSelect(event: any) {
    if (event.target.files) {
      for (let file of event.target.files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.tempImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
        this.newImages.push(file);
      }
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('newImages') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  removeImage(index: number, isTemporary: boolean = false) {
    if (isTemporary) {
      this.tempImages.splice(index, 1);
      this.newImages.splice(index, 1);
    } else {
      this.images.splice(index, 1);
    }
  }

  convertToBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async editCar() {
    if (this.carForm.valid) {
      const updatedCar = {
        ...this.carForm.value,
        images: [...this.images],
        userId: this.car.userId,
        status: this.car.status

      };

      for (let imageFile of this.newImages) {
        const base64Image = await this.convertToBase64(imageFile);
        if (base64Image) {
          updatedCar.images.push(base64Image);
        }
      }

      this.carService.updateCar(this.car.id, updatedCar).subscribe(
        (response) => {
          this.car = response;
          this.images = updatedCar.images;
          this.tempImages = [];
          this.newImages = [];
          this.closeEditModal();
          console.log('Car updated', response);
        },
        (error) => {
          console.error('Error', error);
        }
      );
    }
  }

}
