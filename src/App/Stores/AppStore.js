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
  @observable activeTab = "n1";

  /* #~#~#~#~#~#~ ACTIONS #~#~#~#~#~#~# */
  @action
  toggleSideMenuOpen(newVal: boolean) {
    this.sideMenuOpen = newVal;
  }

  @action
  toggleSideMenuVisible(newVal: boolean) {
    if(!newVal){
      this.sideMenuOpen = false;
    }
    this.sideMenuVisible = newVal;
  }

  @action
  setActiveTab(newVal: string) {
    this.activeTab = newVal;
  }
}

export default new AppStore()
