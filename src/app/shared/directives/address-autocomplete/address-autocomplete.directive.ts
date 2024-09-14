import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { ScriptLoaderService } from '../../services';

declare const google: any;

@Directive({
  selector: '[appAddressAutocomplete]',
  standalone: true
})
export class AddressAutocompleteDirective {

  element;
  @Input() placeType = '(cities)';
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  address: any = {};

  constructor(
    private el: ElementRef,
    private scriptLoader: ScriptLoaderService
  ) {
    this.element = el.nativeElement;
    this.loadLibrary();
  }

  /**Get the required response */
  formateRes(addressComponent: any, address: any) {
    this.address['formatted_address'] = address;
    for (const item of addressComponent) {
      if (item.types.includes('locality')) {
        this.address['address_1'] = item.long_name;
      } else if (item.types.includes('administrative_area_level_1')) {
        this.address['address_2'] = item.long_name;
      } else if (item.types.includes('country')) {
        this.address['address_3'] = item.long_name;
      } else if (item.types.includes('postal_code')) {
        this.address['postal_code'] = item.long_name;
      }
    }
    this.onSelect.emit(this.address);
  }

  /**Google Map event listner */
  mapListner() {
    const autocomplete = new google.maps.places.Autocomplete(this.element, {
      types: [`${this.placeType}`]
    });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.formateRes(place.address_components, place.formatted_address);
    });
  }

  /**Load the Google Maps JS Library */
  loadLibrary() {
    this.scriptLoader.loadScript('googlemaps').then((data) => {
      this.mapListner();
    }).catch(error => { });
  }

}
