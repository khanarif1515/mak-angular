import { Injectable } from '@angular/core';

declare let slab_AB: any;

@Injectable({
  providedIn: 'root'
})
export class ABService {

  constructor() { }

  slab_AB() {
    if (typeof slab_AB !== 'undefined') {
      return slab_AB;
    }
  }
}
