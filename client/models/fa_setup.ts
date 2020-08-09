import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faEnvelope, faPlus, faTimes
} from '@fortawesome/free-solid-svg-icons';

export default class FASetup {
  library: any;
  constructor() {
    library.add(faEnvelope);
    library.add(faPlus);
    library.add(faTimes);
  }
}
