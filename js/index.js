var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var stuDBName = "SCHOOL-DB";
var stuRelationName = "STUDENT-TABLE";
var connToken = "90931767|-31949307674119337|90963415";

$('#stuid').focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getStuIdAsJsonObj() {
    var stuid = $('#stuid').val();
    var jsonStr = {
        id: stuid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $("#name").val(data.name);
    $("#clas").val(data.clas);
    $("#date").val(data.date);
    $("#address").val(data.address);
    $("#enroldate").val(data.enroldate);
}

function resetForm() {
    $('#stuid').val('');
    $('#name').val('');
    $('#clas').val('');
    $('#date').val('');
    $('#address').val('');
    $('#enroldate').val('');
    $('#stuid').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#update').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#stuid').focus();
}


function validateData() {
    var stuid, name, date, address, enroldate, clas;
    stuid = $('#stuid').val();
    name = $('#name').val();
    clas = $('#clas').val();
    address = $('#address').val();
    date = $('#date').val();
    enroldate = $('#enroldate').val();

    if (stuid === "") {
        alert("Student roll-no missing");
        $('#stuid').focus();
        return "";
    }

    if (name === "") {
        alert("Student name missing");
        $('#name').focus();
        return "";
    }

    if (clas === "") {
        alert("Student class missing");
        $('#clas').focus();
        return "";
    }

    if (address === "") {
        alert("Student address missing");
        $('#address').focus();
        return "";
    }

    if (date === "") {
        alert("Student birth date missing");
        $('#date').focus();
        return "";
    }

    if (enroldate === "") {
        alert("Student enrollment date missing");
        $('#enroldate').focus();
        return "";
    }

    var jsonStrObj = {
        id: stuid,
        name: name,
        class: clas,
        birthDate: date,
        address: address,
        enrollmentDate: enroldate        
    };
    return JSON.stringify(jsonStrObj);
}

function getStu() {
    var stuIdJsonObj = getStuIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stuDBName, stuRelationName, stuIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#name").focus();
    } else if (resJsonObj.status === 200) {
        $("#stuid").prop("disabled", true);
        fillData(resJsonObj);
        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#name").focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, stuDBName, stuRelationName);
    jQuery.ajaxSetup({ async: false });
    var tempJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    console.log(tempJsonObj);
    resetForm();
    $('#stuid').focus();
}

function updateData() {
    $('#update').prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stuDBName, stuRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#stuid").focus();
}