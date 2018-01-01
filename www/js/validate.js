/**
 * Validate user inputs from first page (Questionaire),
 * inform user of info if over 21 years of age.
 * 
 */
function validFirstPage() {
    //Validate
    var numHours = $('#numStartHours').val();
    var dateRecPermit = $('#dateRecPermit').val();
    var dateProPlan = $('#dateProPlan').val();
    var under21 = 0;
    var err = "";
    var columns = ['lrnerid', 'totalHrs', 'recPerm', 'planPPerm', 'under21'];
    var record = [];

    if ($('#u21').attr('class', 'btnGrpRadSelected'))
        under21 = 1;

    if (numHours.toString().length < 1) {
        $('#numStartHours').focus();
        err += "Please enter a number of hours";
    } else if (dateRecPermit.length < 1) {
        $('#dateRecPermit').focus();
        err += "Please enter a date you recieved your license";
    } else if (dateProPlan.length < 1) {
        $('#dateProPlan').focus();
        err += "Please enter a date you plan on getting your probationary license";
    } else {
        //Validated
        localStorage.setItem('learnerPreqs', 1);
        record = [1, numHours, dateRecPermit, dateProPlan, under21];
        insertRecord('tbllrner', columns, record);
        goMenuPage();
    }
    $('#err').html(err);

}

function validPage3() {
    var err = "";
    var nightMins = $('#numManNightMins').val();
    var odoStart = $('#numManOdoStart').val();
    var odoEnd = $('#numManOdoEnd').val();
    var rego = $('#txtManRego').val();

    var timeStartHr = $('#select-hrManTime-start').find(":selected").text();
    if ($('#select-pmamManTime-start').find(":selected").text() == "PM") {
        //24 hr time
        timeStartHr = parseInt(timeStartHr) + 12;
    }
    var timeEndHr = $('#select-hrManTime-end').find(":selected").text();
    if ($('#select-pmamManTime-end').find(":selected").text() == "PM") {
        //24 hr time
        timeEndHr = parseInt(timeEndHr) + 12;
    }
    var timeStart = timeStartHr + ":" + $('#select-minManTime-start').find(":selected").text();
    var timeEnd = timeEndHr + ":" + $('#select-minManTime-end').find(":selected").text();
    if (timeStart.length < 3 || timeEnd.length < 3) {
        err += "Please enter a start & end time";
    } else if (toSeconds(timeStart) >= toSeconds(timeEnd)) {
        err += "Invalid Start or End time.";
    } else if (nightMins.toString().length < 1) {
        err += "Please enter the amount of night driving";
    } else if (odoStart.toString().length < 1) {
        err += "Please enter an odometer start value";
    } else if (odoEnd.toString().length < 1) {
        err += "Please enter an odometer end value";
    } else if (odoStart > odoEnd) {
        err += "Please enter valid odometer values";
    } else if (rego.length != 6) {
        err += "Please enter a valid rego number";
    } else {
        //Validated
        //Get all the supervisors
        selectRecords("tblsup", "*", (res) => {
            var output = "";
            var len = res.rows.length;
            for (var i = 0; i < len; i++) {
                var ref = res.rows[i];
                output += `<option value=${ref.supId}>${ref.name}</option>`;
            }
            $('#select-manSessSuper').html(output).enhanceWithin();
            $.mobile.changePage("#page4");
        });

    }
    $('#errMsg').html(err).enhanceWithin();
}

//Validates Supervisor details before adding to database
function validateSup() {
    var name = $('#txtSupName').val();
    var phone = $('#numSupPh').val();
    var numSupNo = $('#numSupNo').val();
    var dateLicEx = $('#dateLicEx').val();
    var sig;
    var columns = ["name", "driverNo", "phone", "expiry", "sig"]; //Names of the columns
    var record = [];
    var err = "";
    if (name.length < 3) {
        err += "Please enter a name";
    } else if (phone.toString().length != 10) {
        err += "Please enter a valid phone number";
    } else if (numSupNo.toString().length < 5) {
        err += "Please enter a valid license no";
    } else if (dateLicEx.length < 1) {
        err += "Please enter a date of license expiry";
    } else if ($('#sig').signature('isEmpty')) {
        err += "Please enter a signature";
    } else {
        //Validated
        phone = parseInt(phone);
        sig = $('#sig').signature('toJSON');

        record = [name, numSupNo, phone, dateLicEx, sig];

        //Check if we're updating or adding a supervisor by checking if a theres a value in a hidden textbox
        if ($('#supId').val() != 'false') {
            //Pushes supId val to front of the records array, because WebSQL..
            record.push($('#supId').val())
            updateRecord("tblsup", columns, record, "supId");
        } else {
            insertRecord("tblsup", columns, record);
        }
        goMenuPage();
    }
    $('#errSup').html(err).enhanceWithin();
}