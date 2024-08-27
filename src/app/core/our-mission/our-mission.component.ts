import { Component, Input } from '@angular/core';
import { VariablesService } from 'src/app/shared/services';
import { EventsService } from 'src/app/shared/services/events/events.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxGlideModule } from 'ngx-glide';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-our-mission',
  standalone: true,
  imports: [CommonModule, NgxGlideModule, NgOptimizedImage],
  templateUrl: './our-mission.component.html',
  styleUrl: './our-mission.component.scss'
})
export class OurMissionComponent {
  @Input() data: any;

  selectedCard?: { title: string, desc: string, cover_image: string, image: string };

  cards = [
    {
      title: 'Heroes like you helped my son win his battle',
      desc: '“May Allah bless you all! Thanks to your generous donations, Afzal underwent a successful BMT to treat thalassemia major. We are eternally grateful to you all for gifting our little bundle of joy a second chance at life!” -Reshma (Mother)',
      cover_image: '/assets/images/our-mission/thumb-1.png',
      image: '/assets/images/our-mission/success-1.png'
    },
    {
      title: 'My daughter finally gets to enjoy her childhood',
      desc: `“My daughter was suffering from Budd Chiari syndrome with a recurrent gastrointestinal bleed and needed an urgent liver transplant to survive, but sadly we couldn't afford it. However, your donations gave her a new lease on life! She underwent a successful liver transplant and is now enjoying her childhood. Words cannot express how grateful I am to you angels!” - Prajakta (Mother)`,
      cover_image: '/assets/images/our-mission/thumb-3.png',
      image: '/assets/images/our-mission/success-3.png'
    },
    {
      title: 'Amit and the world’s toughest cycling expedition',
      desc: `At 38, Dr. Amit Samarth is the first Asian to qualify, contest and complete the Trans-Siberian Extreme Endurance Race. It is the world's longest and the toughest cycling race - starting from Moscow, traversing 9100 kms through Russia, to finally end in Vladivostok. Amit was one of the only six people who finished the race.  He successfully raised the amount needed for this once in a lifetime adventure on Ketto.`,
      cover_image: '/assets/images/our-mission/thumb-2.png',
      image: '/assets/images/our-mission/success-2.png'
    },
    {
      title: 'You are the reason Suraj gets to live his dream',
      desc: '“Our son’s cancer had relapsed after 2.5 years of chemotherapy & we knew we couldn’t afford his life-saving treatment. But thanks to your donations & prayers, he underwent successful treatment & is recovering well. May God bless you all for saving his life!” -Dhanasar (Father)',
      cover_image: '/assets/images/our-mission/thumb-4.png',
      image: '/assets/images/our-mission/success-4.png'
    }
  ];

  constructor(
    private events: EventsService,
    public vars: VariablesService,
    public dialog: MatDialog
  ) { }

  read(item: any, dialogTemp: any) {
    // this.events.sendSystemEvent({
    //   eventName: 'our_mission_click'
    // }).subscribe(_ => _);
    // this.selectedCard = item;
    // const dialogRef = this.dialog.open(dialogTemp, {
    //   panelClass: 'success-story-dialog'
    // });
  }
}
