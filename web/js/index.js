
var students_list = [];
var matches = [];
var on = [];

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


function add_student(control_number){
    var student = load_json(control_number)
}

function load_json(control_number){
    let json_file = getJSON("../faketec/api/data/"+control_number+".json", 
        function(err, data) {
            if (err !== null) {
                console.log("Error") 
            } else {
                load_student_data(data)
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
    compas_actions_remove_button.innerHTML="Eliminar";
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

    on.push(true);
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
                    var match = new Match(currentMainSubject, subjectsToCheck);
                    matches.push(match);
                }
            }
            
        }
    }

    console.log("Total matches: " + matches.length);

}

function remove_student(student){
    console.log("Borrando...")
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
    update_matches();

}


function _removeElement(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}



(function(){

    let control_numbers = ["14171001","14172020","14175050"]
    control_numbers.forEach(element => {
        add_student(element);
    });

})();






