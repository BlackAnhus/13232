let modal = document.getElementById('myModal');
let span = document.getElementById('close');
class Residents{
    constructor(name, flatNumber, flatSquare, privatized, id){
        this.id = id;
        this.name = name;
        this.flatNumber = flatNumber;
        this.flatSquare = flatSquare;
        this.privatized = privatized;
        this.map = new Map();
    }
    renderValue(){
        return Mustache.render(getTemplateTable(),{
            id: this.id,
            name: this.name,
            flatNumber: this.flatNumber,
            flatSquare: this.flatSquare,
            privatized: this.privatized,
            telephone: this.getProperty('telephone')})
    }
    addProperty(name, value){
        this.map.set(name, value)
    }
    getProperty(name){
        return this.map.get(name)
    }
}

let residentsArr = [];

if(window.openDatabase){
    var mydb = openDatabase('residents', '0.1', 'Database of residents', 2 * 1024 * 1024);
    mydb.transaction(function (tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS res (id integer primary key autoincrement, name, flatNumber, flatSquare, privatized, telephone)');
    })
} else {
    alert('WebSQL не поддерживается вашим браузером!');
}

mydb.transaction(function (tx){
    tx.executeSql('SELECT * from res', [], function (tx, result){
        for(let i = 0; i < result.rows.length; i++){
            let resident = result.rows.item(i);
            residentsArr.push(new Residents(resident.name, resident.flatNumber, resident.flatSquare, resident.privatized, resident.id))
            if(resident.telephone!='None')
                residentsArr.at(-1).addProperty('telephone', resident.telephone);
            AddOption(resident.id);
        }
    });
});
function AddOption(id){
    let select = document.getElementById('ids');
    let option = document.createElement('option');
    option.text = id;
    option.value = id;
    select.add(option);
}

let flag = false;
document.getElementById('form1').addEventListener('submit', function (e){
    e.preventDefault();
    let name = document.getElementById('name').value;
    let flatNumber = document.getElementById('flatNumber').value;
    let flatSquare = document.getElementById('flatSquare').value;
    let privatized = document.getElementById('privatized').value;
    let telephone = "None";
    if(flag){
        telephone = document.getElementById('telephone').value;
    }
    mydb.transaction(function (tx){
        tx.executeSql('INSERT INTO res (name, flatNumber, flatSquare, privatized, telephone) VALUES(?,?,?,?,?)', [name, flatNumber, flatSquare, privatized, telephone]);
    });

    mydb.transaction(function (tx){
        tx.executeSql('SELECT * from res', [], function (tx, result){
            let id = result.rows.item(result.rows.length - 1).id;
            let resident = new Residents(name, flatNumber, flatSquare, privatized, id);
            if(telephone!='None'){
                resident.addProperty('telephone', telephone);
            }
            residentsArr.push(resident);
            AddOption(id);
        })
    })
    alert('Житель добавлен');
    if(flag){
        modal.style.display = "block";
        let content = document.getElementById('content');
        content.innerHTML = Mustache.render(getTemplateValue(), {telephone: telephone});
        let inputTelephone = document.getElementById('telephone');
        inputTelephone.style.display="none";
        flag = false;
    }
    /*document.getElementById('form1').reset();*/
});

const header = '<table id="table"><th>ID</th><th>ФИО</th><th>Номер квартиры</th><th>Площадь квартиры</th><th>Приватизация</th><th>Телефон</th></table>';

document.getElementById('showTable').onclick = function (){
    if(residentsArr.length==0){
        alert('Жители отсутствуют');
    }
    else{
        modal.style.display = 'block';
        let content = document.getElementById('content');
        content.innerHTML = header;
        let table = document.getElementById('table');
        for(let i = 0; i < residentsArr.length; i++){
            table.insertAdjacentHTML('beforeend', residentsArr[i].renderValue());
        }
    }
}

span.onclick = function (){
    modal.style.display = 'none';
}

document.getElementById('deleteRow').onclick = function (){
    if(residentsArr.length==0){
        alert('Жители отсутствуют');
    }
    else{
        var select = document.getElementById('ids');
        var id = select[select.selectedIndex].text;//текстовое значение выбранного элемента

        if(select.selectedIndex!=0){
            let element = residentsArr.find(resident => resident.id == id);//поиск из массива объектов с выбранным id(содержит объект)
            var index = residentsArr.indexOf(element);//индекс элемента в массиве, который был найден с помощью метода find
            residentsArr.splice(index, 1);
            select.remove(select.selectedIndex);
            mydb.transaction(function (tx){
                tx.executeSql('DELETE FROM res WHERE id=?;',[id]);
            });
            alert("Житель удален");
        }
        else alert('Выберите id');
    }
}

document.getElementById('addProperty').onclick = function (){
    if(!flag){
        const inputTel = document.getElementById('input-tel');
        inputTel.style.display = 'block';
        flag = true;
    }
    else{
        alert('Свойство уже добавлено');
    }
}

document.getElementById('form1').addEventListener('reset', function (e){
    document.getElementById('form1').reset();
    document.getElementById('input-tel').style.display = 'none';
    flag = false;
})

document.getElementById('minMaxSquare').onclick = function (){
    if(residentsArr.length==0){
        alert('Жители отсутствуют');
    }
    else{
        let maxSquare = residentsArr[0].flatSquare
        let maxFIO = residentsArr[0].name
        let minSquare = residentsArr[0].flatSquare
        let minFIO = residentsArr[0].name
        for(let i = 0; i < residentsArr.length; i++){
            if(Number(maxSquare) <= Number(residentsArr[i].flatSquare)){
                maxSquare = residentsArr[i].flatSquare
                maxFIO = residentsArr[i].name
            }
            if(Number(minSquare) >= Number(residentsArr[i].flatSquare)){
                minSquare = residentsArr[i].flatSquare
                minFIO = residentsArr[i].name
            }
        }
        modal.style.display = 'block'
        let content = document.getElementById('content')
        content.innerHTML = Mustache.render(getTemplateMinMax(), {
            maxSquare: maxSquare,
            maxFIO: maxFIO,
            minSquare: minSquare,
            minFIO: minFIO
        })
    }
}