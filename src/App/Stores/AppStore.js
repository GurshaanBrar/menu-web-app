import { action, observable } from "mobx"
/*
* @ Des:
*     AppStore Contains all actions, computations, and functions that are shared
*     everywhere within the app. Global store is accessable to every child component
*     of App.
*/

export class AppStore {
  /* #~#~#~#~#~#~ OBSERVABLES #~#~#~#~#~#~# */
  @observable sideMenuOpen = true;
  @observable sideMenuVisible = true;
  @observable activeTab = "";

  /* #~#~#~#~#~#~ ACTIONS #~#~#~#~#~#~# */
  @action
  toggleSideMenuOpen(newVal) {
    this.sideMenuOpen = newVal;
  }

  @action
  toggleSideMenuVisible(newVal) {
    if(!newVal){
      this.sideMenuOpen = false;
    }
    this.sideMenuVisible = newVal;
  }

  @action
  setActiveTab(newVal) {
    this.activeTab = newVal;
  }
}

export default new AppStore()
