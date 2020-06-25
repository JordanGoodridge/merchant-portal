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
    function get_user(){
        return fetch('/User', {
            headers: { 'Content-Type': 'application/json' },
            method: 'get'
        })
            .then(function(response)  {
                console.log(response)

                return response.json()
                .then(data => {
                    console.log(data)
                    let items = data['countArray']
                    // let items = {}
                    console.log(`in get_user with counters of type ${typeof(items)} with value ${items}`)
                    
                    populate_item_table(items)


                  })
            })
          
    }


    function populate_item_table(item_list){
        // items_table_view
        let item_table = document.getElementById("items_table_view");
        item_table.innerHTML = "";
        for(let i = 0; i < item_list.length; i++){
            let count = item_list[i];

            let table_row = document.createElement("tr");
            item_table.appendChild(table_row);

            //COUNT VALUE

            let index_col = document.createElement("td");
            index_col.innerHTML = `Counter ${i}:`;
            index_col.className = "count_cell";
            index_col.setAttribute("index", i);
            table_row.appendChild(index_col);

            let count_col = document.createElement("td");
            count_col.innerHTML = count;
            count_col.className = "count_cell";
            table_row.appendChild(count_col);

            //INCREMENT BUTTON
            let inc_col = document.createElement("td");
            let inc_button = document.createElement("button");
            inc_button.innerHTML = "+";
            inc_col.className = "count_cell_inc";
            inc_col.appendChild(inc_button);
            table_row.appendChild(inc_col);

            inc_button.addEventListener("click", function (e) {
                console.log(this.parentNode.previousSibling.previousSibling.getAttribute("index"));
                let index = this.parentNode.previousSibling.previousSibling.getAttribute("index");
                inc_counter(index);
            })


            //DECREMENT BUTTON
            let dec_col = document.createElement("td");
            let dec_button = document.createElement("button");
            dec_button.innerHTML = "-";
            dec_col.className = "count_cell_dec";
            dec_col.appendChild(dec_button);
            table_row.appendChild(dec_col);

            dec_button.addEventListener("click", function (e) {
                console.log(this.parentNode.previousSibling.previousSibling.previousSibling.getAttribute("index"));
                let index = this.parentNode.previousSibling.previousSibling.previousSibling.getAttribute("index");
                console.log(this);
                dec_counter(index);
            })

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
            let share_col = document.createElement("td");
            let share_button = document.createElement("button");
            share_button.innerHTML = "Share";
            share_col.className = "count_cell_share";
            share_col.appendChild(share_button);
            table_row.appendChild(share_col);
            share_button.addEventListener("click", function(e){
                console.log(this.parentNode.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML);
                let value = this.parentNode.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML;
                share_counter(value);
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

    function add_counter(value) {
        let count_array;
        return fetch('/Counters', {
            headers: { 'Content-Type': 'application/json' },
            method: 'get',
        })
            .then(function(response)  {
                return response.json();
            }).then(function(response){
                console.log(response.body)
                count_array = response.body;
                count_array.push(parseInt(value, 10));
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

    document.getElementById('add_counter')
        .addEventListener("click", function (e) {
            console.log("Attempting to add a counter");
            let counter_value = this.previousElementSibling.value;
            if(counter_value != "" && counter_value != undefined){
                add_counter(counter_value);
            }else {
                window.alert("Error:  Enter counter value");
            }

        })
    

    get_session()
    .then(function (res) {
        console.log(res)
        if (res["status"] == 200) {
            get_user().then(function(res){
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

    function signIn(userName, password) {
        let payload = {
            email: userName,
            password: password
        };
        
        return fetch('/merchant-login', {
            headers: { 'Content-Type': 'application/json' },
            method: 'post',
            body: JSON.stringify(payload)
        })
            .then(function (res) {
                //  console.log(res)
                if (res['status'] == 409) {
                    window.alert('Error:  Account Doesnt Exist or Incorrect Credentials')
                }
                get_user().then(function(res){
                    console.log(res)
                })
                return res

            })
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
    //registration_view is for the sign up table
    var registration_view = document.getElementById("registration_view")
    //item_entry_view is for the main play page
    var item_entry_view = document.getElementById("item_entry_view")
    var log_out = document.getElementById("log_out")
    var header_view = document.getElementById("header_view")
    registration_view.style.display = "none"
    item_entry_view.style.display = "none"
    log_out.style.display = "none"
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
    document.getElementById("sin_btn")
        .addEventListener("click", function (e) {
            username = document.getElementById("sg_in_us")
            pass = document.getElementById("sg_in_ps")
            console.log(username.value)
            console.log(pass.value)

            signIn(username.value, pass.value)
                .then(function (res) {

                    //if res.status = success
                    if (res['status'] == 200) {
                        login_view.style.display = "none"
                        item_entry_view.style.display = "block"
                        log_out.style.display = "block"
                        header_view.style.display = "block"
                        //display name
                        document.getElementById("in_game_username").innerHTML = username.value
                        console.log(username.value);
                        console.log(username.countArray);

                    }
                })

        })

        //after clicking log_out, delele session
    document.getElementById("log_out")
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
