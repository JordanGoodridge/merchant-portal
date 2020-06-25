/*
 * This files holds all the code to for your card game
 */

//Run once broswer has loaded everything
window.onload = function () {
    function get_session() {
      
        return fetch('/Session', {
            headers: { 'Content-Type': 'application/json' },
            method: 'get'
        })
            .then(function(response)  {
                console.log(response)

                return response
            })

    }
    function get_items(){
        console.log("Getting items");
        return fetch(`/merchant-items?merch_id=${localStorage.merch_id}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'get',
        })
            .then(function(response)  {
                console.log(response)

                return response.json()
                .then(data => {
                    console.log(data)
                    // let items = {}
                    console.log(`in get_items with items of type ${typeof(data)} with value ${data}`)
                    
                    populate_item_table(data)


                  })
            })
          
    }


    function populate_item_table(item_list){
        // items_table_view

        console.log(item_list);
        if(item_list == undefined)
        {
            return;
        }

        let item_table = document.getElementById("items_table_view");
        item_table.innerHTML = "";
        for(let i = 0; i < item_list.length; i++){
            let item = JSON.parse(item_list[i]);
            console.log(item);
            console.log(typeof(item));

            let table_row = document.createElement("tr");
            item_table.appendChild(table_row);

            //ITEM NAME
            let name_col = document.createElement("td");
            name_col.innerHTML = `${item.name}`;
            name_col.className = "count_cell";
            name_col.setAttribute("index", i);
            table_row.appendChild(name_col);

            //ITEM PRICE
            let price_col = document.createElement("td");
            price_col.innerHTML = item.price;
            price_col.className = "count_cell";
            table_row.appendChild(price_col);



            //DELETE BUTTON
            let del_col = document.createElement("td");
            let del_button = document.createElement("button");
            del_button.innerHTML = "Delete";
            del_col.className = "count_cell_del";
            del_col.appendChild(del_button);
            table_row.appendChild(del_col);
            del_button.addEventListener("click", function(e){
                console.log(this.parentNode.previousSibling.previousSibling.previousSibling.previousSibling.getAttribute("index"));
                let index = this.parentNode.previousSibling.previousSibling.previousSibling.previousSibling.getAttribute("index")
                delete_counter(index);
            })



            //SHARE BUTTON
            // let link_col = document.createElement("td");
            // let link_button = document.createElement("p");
            // //link_button.innerHTML;
            // link_col.className = "count_cell_share";
            // link_col.appendChild(link_button);
            // table_row.appendChild(link_col);
            // link_button.addEventListener("click", function(e){
            //     //Add code to copy to clipboard
            // })

        }
    }

    function share_counter(value){
        return fetch('/Share', {            
            headers: { 'Content-Type': 'application/json' },
            method: 'post',
            body: JSON.stringify({val: value})
        }).then(function(response){
            return response.json();
        }).then(function(response){
            console.log(response)
            alert(`http://localhost:3000/Share/?id=${response._id}`)

        })
    }

    function delete_counter(index){
        return fetch('/Counters', {
            headers: { 'Content-Type': 'application/json' },
            method: 'delete',
            body: JSON.stringify({i: index})
        }).then(function(response)  {
            return response.json();
        }).then(function(response){
            let countArray = response.countArray;
            console.log(response.countArray);
            populate_item_table(countArray);

        })
    }

    function inc_counter(index) {
        return fetch('/Counters', {
            headers: { 'Content-Type': 'application/json' },
            method: 'get',
        })
        .then(function(response)  {
            return response.json();
        }).then(function(response){
                count_array = response.body;
                console.log(count_array)
                count_array[index] = count_array[index] + 1;
                console.log(count_array)

                return fetch('Counters', {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'put',
                    body: JSON.stringify(count_array)
                }).then(function(response) {
                    return response.json();
                }).then(function(response){
                    console.log("In counter add response");
                    console.log(response.countArray);
                    populate_item_table(response.countArray);
                })
        })
    }

    function dec_counter(index) {
        return fetch('/Counters', {
            headers: { 'Content-Type': 'application/json' },
            method: 'get',
        })
        .then(function(response)  {
            return response.json();
        }).then(function(response){
                count_array = response.body;
                console.log(count_array)
                count_array[index] = count_array[index] - 1;
                console.log(count_array)

                return fetch('Counters', {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'put',
                    body: JSON.stringify(count_array)
                }).then(function(response) {
                    return response.json();
                }).then(function(response){
                    console.log("In counter dec response");
                    console.log(response.countArray);
                    populate_item_table(response.countArray);
                })
        })

    }

    function add_item(item_name, item_price) {
        let count_array;
        return fetch('/merchant-item', {
            headers: { 'Content-Type': 'application/json' },
            method: 'post',
            body: JSON.stringify({
                item: item_name, 
                price: item_price,
                // merch_id: localStorage.email
                merch_id: 1

            })
        }).then(function(response)  {
            console.log(response);
            return response.json();
            })

    }

    document.getElementById('add_item_button')
        .addEventListener("click", function (e) {
            let item_name = document.getElementById("item_name").value;
            let item_price = document.getElementById("item_price").value;
            if(item_name != "" && item_name != undefined && item_price != 0 && item_price != undefined){
                add_item(item_name, item_price);
                console.log(`Attempting to add item (${item_name}) of price (${item_price})`)
            }else {
                window.alert("Error:  Enter counter value");
            }

        })
    

    get_session()
    .then(function (res) {
        console.log(res)
        if (res["status"] == 200) {
            get_items().then(function(res){
                console.log(res)
            })
            login_view.style.display = "none"
            item_entry_view.style.display = "block"
            log_out.style.display = "block"
            header_view.style.display = "block"
        }
    })



    function signUp(userName, userEmail ,userPass, userStore, userStreet, userCity, userState, userZip) {
        let payload = {
            name: userName,
            email: userEmail,
            pass: userPass,
            store: userStore,
            street: userStreet,
            city: userCity,
            state: userState,
            zip: userZip
        };

        console.log(payload)

        //console.log(payload)
        return fetch('/merchant-signup', {
            headers: { 'Content-Type': 'application/json' },
            method: 'post',
            body: JSON.stringify(payload)
        })
            .then(function (response) {
                console.log(response)
                if (response.ok) {
                    return response;
                    // resolve(response);
                } else {
                    window.alert("Error:  Signup Failed")
                }
            })
            
    }

    function signIn(userEmail, userPassword) {
        let payload = {
            email: userEmail,
            password: userPassword
        };
        
        return fetch('/merchant-login', {
            headers: { 'Content-Type': 'application/json' },
            method: 'post',
            body: JSON.stringify(payload)
        })
            .then(function (res) {
                return res.json();
            })
            .then(function (res){
                //  console.log(res)
                if (res.status == 404) {
                    window.alert('Error:  Account Doesnt Exist or Incorrect Credentials')
                    return 404;
                } else {
                    console.log("Signin Sucess")
                    localStorage.email = userEmail;
                    localStorage.merch_id = JSON.parse(res).merch_id;
                    return 200;
                }

                })
            return res

            
    }


    function log_off(){
        return fetch('/LogOff', {
            headers: { 'Content-Type': 'application/json' },
            method: 'post'
        })
            .then(function(response)  {
                console.log("here")
                return response
            })
    }


    var username_in = document.getElementById("sg_up_us");
    var login_view = document.getElementById("login_view");
    var registration_view = document.getElementById("registration_view")
    var item_entry_view = document.getElementById("item_entry_view")
    var log_out_button = document.getElementById("log_out_button")
    var header_view = document.getElementById("header_view")
    registration_view.style.display = "none"
    item_entry_view.style.display = "none"
    log_out_button.style.display = "none"
    header_view.style.display = "none"

    //after clicking signUp button
    document.getElementById("sup_btn")
        .addEventListener("click", function (e) {
            login_view.style.display = "none"
            registration_view.style.display = "block"
        })
    //after clicking submit button in signUp page
    document.getElementById("submit_signup_button")
        .addEventListener("click", function (e) {
            let user_name = document.getElementById("reg_name").value
            let user_email = document.getElementById("reg_email").value
            let user_pass = document.getElementById("reg_pass").value
            let user_conf_pass = document.getElementById("reg_conf_pass").value
            let user_store = document.getElementById("reg_store").value;
            let user_street = document.getElementById("reg_street").value;
            let user_city = document.getElementById("reg_city").value;
            let user_state = document.getElementById("reg_state").value;
            let user_zip = document.getElementById("reg_zip").value;


            if (user_pass == user_conf_pass && user_pass != "" && user_pass != undefined) {
                // signUp(username_in.value, pass_1)
                signUp(user_name, user_email ,user_pass, user_store, user_street, user_city, user_state, user_zip)
                    .then(function (res) {
                        console.log(res)
                
                        if (res == undefined) {
                            window.alert('username already registered')
                        }
                        else{
                            login_view.style.display = "block"
                            registration_view.style.display = "none"
                        }
                    })
            }
            else {
                window.alert("two password doesnt match")
            }

        })

        //after clicking signIn button
    document.getElementById("login_button")
        .addEventListener("click", function (e) {
            username = document.getElementById("log_email")
            pass = document.getElementById("log_pass")

            signIn(username.value, pass.value)
                .then(function (res) {

                    //if res.status = success
                    if (res == 200) {
                        login_view.style.display = "none"
                        item_entry_view.style.display = "block"
                        log_out_button.style.display = "block"
                        header_view.style.display = "block"
                        //display name
                        document.getElementById("in_game_username").innerHTML = username.value
                        console.log(username.value);
                        console.log("Login Sucess")


                    } else {
                        console.log("Login Failed")
                    }

                    get_items();
                })

        })

        //after clicking log_out, delele session
    document.getElementById("log_out_button")
        .addEventListener("click", function (e) {
            log_off().then(function(res){
                item_entry_view.style.display = "none"
                login_view.style.display = "block"
                header_view.style.display = "none"
        })
            
        })

    //after clicking log_out, delele session
    document.getElementById("counter_share_table")
    .addEventListener("click", function (e) {
        log_off().then(function(res){
            item_entry_view.style.display = "none"
            login_view.style.display = "block"
            header_view.style.display = "none"
    })
        
    })

};
