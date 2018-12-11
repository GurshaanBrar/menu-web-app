import { observable, action } from "mobx"

export class CreateTabStore {
    /* #~#~#~#~#~#~ OBSERVABLES #~#~#~#~#~#~# */
    @observable itemSubStore = {
      items: items, //All items
      itemInView: "",
    }

    /* #~#~#~#~#~#~ ACTIONS #~#~#~#~#~#~# */

    @action
    setItemInView(newItem) {
      console.log(newItem);
      
      this.itemSubStore.itemInView = newItem;
    }
  }
  export default new CreateTabStore()
  

  const items =[
    {
      uri: "https://www.cactusclubcafe.com/wp-content/uploads/2016/05/050616_FortMcMurray_Blog_620px_400px_notext_web-620x400.jpg",
      name: "Cactus Club Burger"
    },
    {
      uri: "https://cdn-image.foodandwine.com/sites/default/files/styles/4_3_horizontal_-_1200x900/public/marinated-piquillo-peppers-and-whipped-eggplant-toasts-xl-recipe0516.jpg?itok=eiTQUEPt",
      name: "Toast"
    },
    {
      uri: "https://media-cdn.tripadvisor.com/media/photo-s/06/a7/be/64/homemade-lemonchees-cake.jpg",
      name: "Lemon Cheesecake"
    },
    {
      uri: "https://dishingouthealth.com/wp-content/uploads/2016/05/Greekpowerbowl3.jpg",
      name: "For Goodness Sake Power Bowl"
    },
    {
      uri: "https://www.reviewjournal.com/wp-content/uploads/2017/12/9711061_web1_crop-yardbird-mac-cheese.jpg",
      name: "Mac & Cheese"
    },
    {
      uri: "https://media1.popsugar-assets.com/files/thumbor/yEF2gPIXCCtdtYoEJxohnyJDWQY/fit-in/1024x1024/filters:format_auto-!!-:strip_icc-!!-/2015/08/06/876/n/1922398/484eafa6_IMG_1684-1024x742.jpg",
      name: "Huevos Rancheros"
    },
    {
      uri: "https://food-images.files.bbci.co.uk/food/recipes/alpine_pizza_32132_16x9.jpg",
      name: "Medditarian Pizza"
    },
    {
      uri: "https://static01.nyt.com/images/2017/12/13/dining/15COOKING-CREME-BRULEE1/15COOKING-CREME-BRULEE1-articleLarge.jpg",
      name: "Creme Brulee"
    }, 
    {
      uri: "https://www.cbc.ca/food/content/images/recipes/VanillaCremeBrulee.jpg",
      name: "UBC Ponderosa Cake"
    },
    {
      uri: "https://d3hvwccx09j84u.cloudfront.net/0,0/image/seared-beef-noodles-3a17c739.jpg",
      name: "Chow Mein"
    },
    {
      uri: "https://img1.cookinglight.timeinc.net/sites/default/files/styles/4_3_horizontal_-_1200x900/public/image/2017/08/main/fire-roasted-tomato-basil-soup-1709p63.jpg?itok=E0VGnlJw",
      name: "Tomato Soup"
    },
    {
      uri: "https://www.cactusclubcafe.com/wp-content/uploads/2015/11/111215_CACTUS_00194.jpg",
      name: "Cactus Club House Burger"
    }
  ]