import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewService } from '../../services/review.service';
import { CarService } from '../../../cars/services/car.service';

@Component({
  selector: 'app-mechanic-revision',
  templateUrl: './mechanic-revision.component.html',
  styleUrls: ['./mechanic-revision.component.css']
})
export class MechanicRevisionComponent implements OnInit {
  // Array to hold the list of pending cars
  pendingCars: any[] = [];
  // Default image to use if a car does not have an image
  defaultImage: string = 'assets/default_image.jpg';

  // Object to hold the review status
  review = {
    isApproved: false
  };

  // Constructor to inject the required services
  constructor(
    private carService: CarService,
    private reviewService: ReviewService,
    private snackBar: MatSnackBar
  ) {}

  // Lifecycle hook that is called after the component is initialized
  ngOnInit(): void {
    this.loadPendingCars();
  }

  // Method to load the list of pending cars
  loadPendingCars(): void {
    this.carService.getCars().subscribe(
      (cars) => {
        // Filter and map the cars to include only those with 'PENDING' status
        this.pendingCars = cars
          .filter((car: any) => car.status === 'PENDING')
          .map((car: any) => {
            // Set the main image for the car or use the default image
            car.mainImage = car.image && car.image.length > 0 ? car.image[0] : this.defaultImage;
            car.image = car.mainImage;
            return car;
          });
      },
      (error) => {
        // Handle error and show a snackbar message
        console.error('Error fetching cars:', error);
        this.snackBar.open('Error fetching pending cars', 'Close', { duration: 3000 });
      }
    );
  }

  // Method to create a car review
  createCarReview(car: any, reviewNotes: string | undefined): void {
    // Check if review notes are provided
    if (!reviewNotes || !reviewNotes.trim()) {
      this.snackBar.open('Please add review notes before creating the review.', 'Close', { duration: 3000 });
      return;
    }

    // Create the review object
    const review = {
      vehicleId: car.id,
      notes: reviewNotes,
      approved: this.review.isApproved
    };

    // Call the review service to create the review
    this.reviewService.createReview(review).subscribe(
      (reviewResponse) => {
        // Show a success message and remove the reviewed car from the pending list
        this.snackBar.open(`Review for ${car.brand} ${car.model} created.`, 'Close', { duration: 3000 });
        this.pendingCars = this.pendingCars.filter((pendingCar) => pendingCar.id !== car.id);
      },
      (error) => {
        // Handle error and show a snackbar message
        this.snackBar.open('Error creating review', 'Close', { duration: 3000 });
      }
    );
  }
}
