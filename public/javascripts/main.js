
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
                return response.json()
                .then(data => {
                    populate_item_table(data)
                  })
            }).catch((error) => {
                console.log("Error getting item data")
                console.log(error)
                populate_item_table()
            })
          
    }


    function populate_item_table(data){
        // items_table_view
        if(data == undefined)
        {
            return;
        }
        let item_table = document.getElementById("items_table_view");
        item_table.innerHTML = "";

        let item_list = data['items'];

        for(let i = 0; i < item_list.length; i++){
            let item = item_list[i];
            console.log(item);
            console.log(typeof(item));

            let table_row = document.createElement("tr");
            table_row.className = "item_row"
            table_row.setAttribute("index", i);
            table_row.setAttribute("item_id", item.item_id);

            item_table.appendChild(table_row);


            //ITEM NAME
            let name_col = document.createElement("td");
            name_col.innerHTML = `${item.name}`;
            name_col.className = "item_cell";
            //name_col.setAttribute("index", i);
            table_row.appendChild(name_col);

            //ITEM PRICE
            let price_col = document.createElement("td");
            price_col.innerHTML = item.price;
            price_col.className = "item_cell";
            //price_col.setAttribute("index", i);

            table_row.appendChild(price_col);

            //ITEM ID/QR
            let qr = document.createElement(`td`);
            console.log("ITEM ID: "+item.item_id);
            var qrcode = new QRCode(qr, {
                text:  
                // `${item.item_id}`,
                // `${item.item_id}, ${item.price},${item.name}`,

            `{item_id: ${item.item_id},price: ${item.price},name: ${item.name},merch_id: ${localStorage.merch_id}}`,
                width: 60,
                height: 60,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
            let qr_img = qr.childNodes[1]
            qr_img.className = "qr_small";
            qr_img.addEventListener('click', function(e){
                if(qr_img.className === 'qr_small'){
                    qr_img.className = 'qr_large';
                } else {
                    qr_img.className = 'qr_small';
                }
            })

            table_row.appendChild(qr);




            //DELETE BUTTON
            let del_col = document.createElement("td");
            let del_button = document.createElement("button");
            del_button.innerHTML = "Remove";
            del_col.className = "remove_button_col";
            del_button.className = "remove_item_button";
            del_col.appendChild(del_button);
            table_row.appendChild(del_col);
            del_button.addEventListener("click", function(e){
                console.log(this.parentNode.parentNode.getAttribute("item_id"));
                let item_id = this.parentNode.parentNode.getAttribute("item_id")
                console.log(item_id);
                delete_item(item_id);
            })


        }
    }


    function delete_item(item_rem_id){
        console.log(`Deleting item ${item_rem_id} from merchant: ${localStorage.merch_id}`)
        return fetch('/merchant-item', {
            headers: { 'Content-Type': 'application/json' },
            method: 'delete',
            body: JSON.stringify({item_id: item_rem_id, merch_id: localStorage.merch_id})
        }).then(function(response)  {
            get_items();
            return;
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
                merch_id: localStorage.merch_id
            })
        }).then(function(response)  {
            console.log(response);
            get_items();
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
            item_page_view.style.display = "block"
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
                    console.log("Merch_ID: " + localStorage.merch_id);
                    localStorage.email = userEmail;
                    localStorage.merch_id = JSON.parse(res).merch_id;
                    return 200;
                }

            })



            return res

            
    }


    function log_off(){
        localStorage.email = undefined;
        localStorage.merch_id = undefined;
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
    var item_page_view = document.getElementById("item_page_view")
    var log_out_button = document.getElementById("log_out_button")
    var header_view = document.getElementById("header_view")
    var setting_view = document.getElementById("settings_view")
    registration_view.style.display = "none"
    item_page_view.style.display = "none"
    log_out_button.style.display = "none"
    header_view.style.display = "none"
    setting_view.style.display = "none"


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
                        item_page_view.style.display = "block"
                        log_out_button.style.display = "block"
                        header_view.style.display = "block"
                        setting_view.style.display = "none"

                        //display name
                        document.getElementById("username").innerHTML = username.value
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
                item_page_view.style.display = "none"
                login_view.style.display = "block"
                header_view.style.display = "none"
                setting_view.style.display = "none"

        })    
    })


    document.getElementById("settings_button")
        .addEventListener("click", function (e) {
            checkSettings();
                item_page_view.style.display = "none"
                login_view.style.display = "none"
                header_view.style.display = "block"   
                setting_view.style.display = "block"
    })
    document.getElementById("back_button")
        .addEventListener("click", function (e) {
                item_page_view.style.display = "block"
                login_view.style.display = "none"
                header_view.style.display = "block"   
                setting_view.style.display = "none"
    })

    document.getElementById("save_button")
    .addEventListener("click", function (e) {
        updateSettings().then(function() { 
            // item_page_view.style.display = "block"
            // login_view.style.display = "none"
            // header_view.style.display = "block"   
            // setting_view.style.display = "none"
        })
})


    document.getElementById("signup_back_button").addEventListener("click", function(e) {
            item_page_view.style.display = "none"
            login_view.style.display = "block"
            header_view.style.display = "none"   
            setting_view.style.display = "none"
            registration_view.style.display = "none"
    })

    function checkSettings(){
        return fetch(`/merchant-setting?merch_id=${localStorage.merch_id}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'get',
        }).then(function(response){
            if(response.status == 200){
                document.getElementById("settings_status").className = "settings_status_yes"
            }
        })
    }

    function updateSettings(){
        let visa_merch_id_ = document.getElementById("setting_merch_id").value;
        let key_id = document.getElementById("setting_key_id").value;
        let key = document.getElementById("setting_secret_key").value;
        console.log(`Updating: ${visa_merch_id_}, ${key_id}, ${key}`)
        return fetch('/merchant-setting', {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify({
                visa_merchant_id: visa_merch_id_, 
                key_id: key_id,
                shared_key: key,
                merch_id: localStorage.merch_id
            })
        }).then(function(response)  {
            console.log(response);
            return
            })
    }

};
