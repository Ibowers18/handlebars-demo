//find element with the id details-btn
let btn = document.getElementById('details-btn')

//find the element with the id menu-bt
let menuBtn = document.getElementById('menu-btn')

//find element with the id list
let list = document.getElementById('list')
let menuList = document.getElementById('menu')

menuBtn.addEventListener('click', async () => {
    //fetch the menu route from express
    let res = await fetch('/menu/1')
    //parse as json
    let restaurant = await res.json()
    //access Menus in respone
    let menus = restaurant.Menus
    console.log(menus)
    //for each menu in the list, create a sublist
    menuList.innerText = ""
    for(m of menus){
        //add a size 3 header for each menu
        let menuLabel = document.createElement('h3')
        menuLabel.innerText = m.title
        menuList.append(menuLabel)
        let menu = document.createElement('ul')
        //for each menu item in that menu, create a list item
        for(i of m.MenuItems){
            let item = document.createElement('li')
            item.innerText = `${i.name}: ${i.price}`
            menu.append(item)
        }
        menuList.append(menu)
    }

})


//add event listener when this button is clicked
btn.addEventListener('click', async () => {
    //fetch the restaurant-data path from my express server
    let res = await fetch('/restaurant-data');
    //parse the response as json - just the data
    let restaurantList = await res.json();
    //console.log the data from the response
    list.innerText = ""
    for(item of restaurantList.restaurants){
        console.log(item)
    }
  }); 