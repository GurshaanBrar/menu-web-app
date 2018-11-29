
import { observable } from "mobx"

export class ApiDataStore {
  /* #~#~#~#~#~#~ OBSERVABLES #~#~#~#~#~#~# */
  @observable testData = "hello tester"
  
  /* #~#~#~#~#~#~ ACTIONS #~#~#~#~#~#~# */
}

export default new ApiDataStore()
