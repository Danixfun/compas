var students_list = [];
var matches = [];


var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};


function add_students(){
    //14171001,14172020,14175051,16171209,13171545,14178812
    let control_number = document.getElementById("textfield1").value;

    //Check if empty
    if(control_number === ""){
        open_modal("Espera","No has ingreso ningún número de control.")
        return
    }

    let array_control_numbers = control_number.split(",");
    
    array_control_numbers.forEach(cn => {
        add_student(cn);
    });
}

function add_student(control_number){
    //Check if it is a number
    if(isNaN(control_number)){
        open_modal("Espera","El número de control debe está conformado por 8 digitos del 0 al 9, verifica el número de control <b>"+control_number+"</b> e intenta de nuevo.")
        return
    }

    //Check if its already loaded
    for(var i=0; i<students_list.length; i++){
        let current_student = students_list[i];
        let current_control_number = current_student.control_number;
        if(control_number === current_control_number){
            open_modal("Espera","Ya has agregado el número de control <b>"+control_number+"</b>.")
            return
        }
    }

    load_json(control_number)
}

function load_json(control_number){
    let json_file = getJSON("faketec/api/data/"+control_number+".json", 
        function(err, data) {
            if (err !== null) {
                //Check if it exists
                open_modal("Espera","El número de control <b>"+control_number+"</b> no existe.")
                return
            } else {
                load_student_data(data)
                document.getElementById("textfield1").value = "";
            }
        }
    )
}


function load_student_data(student){
    let name = student.name + " " + student.lastname
    let degree = student.degree
    let control_number = student.control_number
    let subjects = student.subjects
    add_student_row(student)
}


function add_student_row(student){
    let compas_container = document.getElementById("compas-container");
    
    //Image
    var compa_row = document.createElement("div");
    var compas_row_img = document.createElement("div");
    var student_img = document.createElement("img");
    student_img.src = "assets/"+student.control_number+".jpg"

    compas_row_img.className = "column compas-img"
    compa_row.className = "compas-compa"

    compas_row_img.appendChild(student_img);


    //Student info
    var compas_info_card = document.createElement("div");
    compas_info_card.className = "column compas-info-card"

    var compas_info_card_wrapper = document.createElement("div")
    compas_info_card_wrapper.className = "compas-info-card-wrapper"

    var compas_info_card_name = document.createElement("div")
    compas_info_card_name.className = "compas-info-card-name"
    compas_info_card_name.innerHTML = student.name + " " + student.lastname

    var compas_info_card_degree = document.createElement("div")
    compas_info_card_degree.className = "compas-info-card-degree"
    compas_info_card_degree.innerHTML = student.degree

    compas_info_card_wrapper.appendChild(compas_info_card_name);
    compas_info_card_wrapper.appendChild(compas_info_card_degree);
    compas_info_card.appendChild(compas_info_card_wrapper);


    //Actions
    var compas_actions = document.createElement("div");
    compas_actions.className = "column compas-actions"

    var compas_actions_remove = document.createElement("div");
    compas_actions_remove.className = "compas-actions-remove"
    var compas_actions_remove_button = document.createElement("button");
    compas_actions_remove_button.innerHTML="<i class='fas fa-trash'></i>";
    compas_actions_remove_button.onclick = (function(){ remove_student(student) });
    compas_actions_remove.appendChild(compas_actions_remove_button);



    compas_actions.appendChild(compas_actions_remove);

    //Add to row
    compa_row.appendChild(compas_row_img);
    compa_row.appendChild(compas_info_card);
    compa_row.appendChild(compas_actions);
    compa_row.id = student.control_number;


    //Add to container
    compas_container.appendChild(compa_row);

    students_list.push(student);

    //Update subject matches among students
    update_matches();

}

class Match{
    subject;
    student;
    constructor(subject, student){
        this.subject = subject;
        this.student = student;
    }
}

function update_matches(){

    if(students_list.length <= 1){
        return
    }

    let mainStudent = students_list[0];
    let mainSubjects = mainStudent.subjects;

    for (var i=0; i<mainSubjects.length; i++){
        let currentMainSubject = mainSubjects[i];
        let currentMainCode = currentMainSubject.code;
        for (var j=1; j<students_list.length; j++){
            let subjectsToCheck = students_list[j].subjects;
            for (var k=0; k<subjectsToCheck.length; k++){
                let codeToCheck = subjectsToCheck[k].code;
                if(currentMainCode == codeToCheck){
                    var match = new Match(currentMainSubject, students_list[j]);
                    matches.push(match);
                }
            }
            
        }
    }

    update_matches_ui()

}

function update_matches_ui(){
    let main_student = students_list[0];
    for(var i=0; i<matches.length; i++){
        let current_match = matches[i];
        let days = current_match.subject.days.split(",");
        let start_hour = current_match.subject.starts;
        let matched_student = current_match.student;
        days.forEach(day => {
            let id_builder = start_hour+"-"+day;
            let td = document.getElementById(id_builder);
            td.style.backgroundColor = "rgba(255,133,159,1)"; 
            td.style.cursor = "pointer"; 

            var myDivWithImgs = document.getElementById(id_builder + "-div");
            if(!myDivWithImgs){
                td.innerHTML = "<div class='matched-cell'>" + 
                                "<span>" + current_match.subject.name + "</span><br>" +
                                "<div id='"+ id_builder + "-div"+"'></div>" +  
                            "</div>";
                myDivWithImgs = document.getElementById(id_builder + "-div");

                myDivWithImgs.innerHTML += "<img id='"+main_student.control_number+"-"+id_builder+"' src='assets/"+main_student.control_number+".jpg'></img>"
                myDivWithImgs.innerHTML += "<img id='"+matched_student.control_number+"-"+id_builder+"' src='assets/"+matched_student.control_number+".jpg'></img>"
            }
            else{
                //Ya existe el div de imagenes de perfil chicas

                let control_number = document.getElementById(matched_student.control_number+"-"+id_builder);
                if(!control_number){
                    myDivWithImgs.innerHTML += "<img id='"+matched_student.control_number+"-"+id_builder+"' src='assets/"+matched_student.control_number+".jpg'></img>"
                }

                //Agregar el plus if needed
                /*let imagesInside = myDivWithImgs.childElementCount;
                if (imagesInside > 2){
                    let plus_sign = document.getElementById("plus.jpg-"+id_builder);
                    if(!plus_sign){
                        myDivWithImgs.innerHTML += "<img id='plus.jpg-"+id_builder+"' src='assets/plus.jpg'></img>"
                    }
                }
                else{
                    
                }   */             
            }

        });

    }
}

function remove_student(student){
    var control_number = student.control_number;
    var foundIndex = -1;
    for (var i=0; i<students_list.length; i++){
        let current_control_number = students_list[i].control_number;
        if (current_control_number == control_number){
            foundIndex = i;
        }
    }

    if(foundIndex == -1){
        return
    }

    students_list.splice(foundIndex,1);
    matches = [];
    _removeElement(control_number);

    //Reset table color
    var days = ["L","M","MM","J","V"]
    var hours = ["07","08","09","10","11","12","13","14","15","16","17","18","19","20"]

    days.forEach(day => {
        for(var i=0; i<hours.length; i++){
            let hour = hours[i];
            let id_builder = hour+":00-"+day;
            let td = document.getElementById(id_builder);
            if(i%2 != 0){
                td.style.backgroundColor = "rgba(204,217,255,1)";
                td.style.cursor = "default";
                td.innerHTML = "";
            }
            else{
                td.style.backgroundColor = "rgba(255,255,255,1)";
                td.style.cursor = "default";
                td.innerHTML = "";
            }

        }
    });

    update_matches();

}


function _removeElement(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}


function remove_all_students(){
    while (students_list.length != 0) {
        let s = students_list[0];
        remove_student(s);
    }
}



window.onload = function(e){ 
    (function(){

    /*let control_numbers = ["14171001","14172020","14175050"]
    control_numbers.forEach(element => {
        add_student(element);
    });*/



    // Get the input field
    var input = document.getElementById("textfield1");

    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("button1").click();
    }
    });



})(); 
}



// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
function open_modal(title, description) {
    var title_modal = document.getElementById("modal_title");
    var description_modal = document.getElementById("modal_description");
    title_modal.innerHTML = title;
    description_modal.innerHTML = description;
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
if (event.target == modal) {
    modal.style.display = "none";
}
}


