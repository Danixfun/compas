


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
    
    subjects.forEach(element => {
        console.log(element.name)
    });

    console.log(name)
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
    compas_actions_remove.appendChild(compas_actions_remove_button);

    var compas_actions_hide = document.createElement("div");
    compas_actions_hide.className = "compas-actions-hide"
    var compas_actions_hide_button = document.createElement("button");
    compas_actions_hide_button.innerHTML="Ocultar";
    compas_actions_hide.appendChild(compas_actions_hide_button);

    compas_actions.appendChild(compas_actions_remove);
    compas_actions.appendChild(compas_actions_hide);


    //Add to row
    compa_row.appendChild(compas_row_img);
    compa_row.appendChild(compas_info_card);
    compa_row.appendChild(compas_actions);


    //Add to container
    compas_container.appendChild(compa_row);

}


(function(){

    let control_numbers = ["14171001","14172020"]
    control_numbers.forEach(element => {
        add_student(element);
    });

})();






