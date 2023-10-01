let templateTable = '<tr>' + '<td>{{id}}</td>' + '<td>{{name}}</td>' + '<td>{{flatNumber}}</td>' + '<td>{{flatSquare}}</td>' + '<td>{{privatized}}</td>' + '<td>{{telephone}}</td>' + '</tr>'
function getTemplateTable(){
    return templateTable
}

let templateMinMax = '<p id="text">' + 'Житель с максимальной площадью квартиры - {{maxFIO}}({{maxSquare}} кв. м.)<br>Житель с минимальной площадью квартиры - {{minFIO}}({{minSquare}} кв. м.)' + '</p>'
function getTemplateMinMax(){
    return templateMinMax
}

let templateValue = '<p id="text">' + 'Номер телефона добавленного жителя квартиры - {{telephone}}' + '</p>'
function getTemplateValue(){
    return templateValue
}