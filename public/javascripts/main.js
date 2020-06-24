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
                    let counters = data['countArray']
                    console.log(`in get_user with counters of type ${typeof(counters)} with value ${counters}`)
                    populate_count_table(counters)


                  })
            })
          
    }


    function populate_count_table(counters){
        let counter_table = document.getElementById("counter_table");
        counter_table.innerHTML = "";
        for(let i = 0; i < counters.length; i++){
            let count = counters[i];

            let table_row = document.createElement("tr");
            counter_table.appendChild(table_row);

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
            populate_count_table(countArray);

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
                    populate_count_table(response.countArray);
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
                    populate_count_table(response.countArray);
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
                    populate_count_table(response.countArray);
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
            table_1.style.display = "none"
            table_3.style.display = "block"
            log_out.style.display = "block"
            table_4.style.display = "block"
        }
    })

   

    function signUp(userName, password, initCounter) {
        console.log(`Passed ${initCounter} to signUp`)
        let counterArray = []
        console.log(`Type of initCounter: ${typeof(initCounter)}`)
        counterArray.push(Number(initCounter))
        let payload = {
            Username: userName,
            password: password,
            countArray: counterArray
        };

        console.log(payload)

        //console.log(payload)
        return fetch('/SignUp', {
            headers: { 'Content-Type': 'application/json' },
            method: 'post',
            body: JSON.stringify(payload)
        })
            .then(function (response) {
                //console.log(response)
                if (response.ok) {
                    return response.json()
                } else {
                    window.alert("Error:  Signup Failed")
                }
            })
            
    }

    function signIn(userName, password) {
        let payload = {
            Username: userName,
            password: password
        };
        return fetch('/SignIn', {
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
    var table1 = document.getElementById("table_1");
    //table_2 is for the sign up table
    var table_2 = document.getElementById("table_2")
    //table_3 is for the main play page
    var table_3 = document.getElementById("table_3")
    var log_out = document.getElementById("log_out")
    var table_4 = document.getElementById("table_4")
    table_2.style.display = "none"
    table_3.style.display = "none"
    log_out.style.display = "none"
    table_4.style.display = "none"

    //after clicking signUp button
    document.getElementById("sup_btn")
        .addEventListener("click", function (e) {
            table1.style.display = "none"
            table_2.style.display = "block"
        })
    //after clicking submit button in signUp page
    document.getElementById("submit_sg_up")
        .addEventListener("click", function (e) {
            pass_1 = document.getElementById("sg_up_ps").value
            pass_2 = document.getElementById("sg_up_ps_2").value
            counter = document.getElementById("sg_up_counter").value
            if (pass_1 == pass_2 && pass_1 != "" && pass_2 != "" && counter !="") {
                console.log(`Counter Value: ${counter}`)
                signUp(username_in.value, pass_1, counter)
                    .then(function (res) {
                        console.log(res)
                
                        if (res == undefined) {
                            window.alert('username already registered')
                        }
                        else{
                            table_1.style.display = "block"
                            table_2.style.display = "none"
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
                        table_1.style.display = "none"
                        table_3.style.display = "block"
                        log_out.style.display = "block"
                        table_4.style.display = "block"
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
                table_3.style.display = "none"
                table_1.style.display = "block"
                table_4.style.display = "none"
        })
            
        })

    //after clicking log_out, delele session
    document.getElementById("counter_share_table")
    .addEventListener("click", function (e) {
        log_off().then(function(res){
            table_3.style.display = "none"
            table_1.style.display = "block"
            table_4.style.display = "none"
    })
        
    })

};
