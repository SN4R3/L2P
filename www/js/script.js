$(document).ready(function() {

    //Check if Preqs have been set
    try {
        if (localStorage.getItem('learnerPreqs')) {
            goMenuPage();
        }
    } catch (e) {

    }

    // //Popup will only center itself If i Put the popup here aswell as where it belongs ??
    // $("#popup-entrySaved").popup({
    //     transition: "pop"
    // });
    // $("#popup-entrySaved").popup("open");
    // setTimeout(function() { $("#popup-entrySaved").popup("close"); }, 2000);

    /*Plugin initalization*/
    $('.datepicker').dateDropper();

    $(function() {
        $('#sig').signature();
        $('#clear').click(function() {
            $('#sig').signature('clear');
        });
    });
    //Start Page Animations
    $('.startTitle').fadeIn(1000);
    setTimeout(function() { $('#startHrsContainer').fadeIn(1000); }, 1000);
    setTimeout(function() { $('#recPermitContainer').fadeIn(1000); }, 2000);
    setTimeout(function() { $('#proPlanContainer').fadeIn(1000); }, 3000);
    setTimeout(function() { $('#under21Container').fadeIn(1000); }, 4000);
    setTimeout(function() { $('#startBtn').fadeIn(1000); }, 6000); //1000 fadeIn, 6000 delay

    $('#startBtn').on('click', function() {
        validFirstPage();
    });


    //Back Btns
    $('.back-menu').on('click', function() { goMenuPage(); });
    $('.back-page3').on('click', function() { $.mobile.changePage("#page3"); });
    $('.back-page4').on('click', function() { $.mobile.changePage("#page4"); });

    //Next Buttons
    $('#next-page3').on('click', function() { validPage3(); });
    $('#next-page4').on('click', function() { confirmPage("manual"); });
    $('#currSess-end').on('click', function() {
        var confirm = alert("Are you sure you want to end the session? (this will be replaced)");

        //if (confirm) {
        stopSession();
        //}
    });
    $('#currSess-save').on('click', function() {
        $('.currSess-btns').css('display', 'block');
        $('.currSess-hidden').css('display', 'none');
        confirmPage("auto");
    });
    //"Radio" Buttons
    $('.btnGrpRad button').on('click', function() {
        $(this).parent().siblings().children().removeClass('btnGrpRadSelected');
        $(this).addClass('btnGrpRadSelected');
    });

    //Change to New Entry Page
    $('.grid-1:eq(0)').on('click', function() {
        //Create select menu options for start/end time
        var hrOutput, minOutput;
        for (var i = 0; i < 12; i++) {
            hrOutput += '<option value="' + (i + 1) + '">' + (i + 1) + '</option>';
        }
        for (var i = 0; i < 60; i++) {
            if (i < 10)
                minOutput += '<option value="' + i + '">0' + i + '</option>';
            else
                minOutput += '<option value="' + i + '">' + i + '</option>';
        }
        $('#select-hrManTime-start').html(hrOutput);
        $('#select-minManTime-start').html(minOutput);
        $('#select-hrManTime-end').html(hrOutput);
        $('#select-minManTime-end').html(minOutput);

        $.mobile.changePage("#page3");
    });

    //Start New Session
    $('.grid-2:eq(0)').on('click', function() {
        alert("Feature was not added as I ran out of time :/");
        $.mobile.changePage("#page-sess1");
    });

    //Supervisors
    $('.grid-1:eq(1)').on('click', function() {
        //Get all the supervisors, display in table
        selectRecords("tblsup", "*", (res) => {
            //callback
            var output = `    
            <tr>
                <th>Name</th>
                <th>DriverNo</th>
                <th>Phone</th>
                <th>Lic.Expiry</th>
                <th></th>
            </tr>`;

            var len = res.rows.length;
            for (var i = 0; i < len; i++) {
                var ref = res.rows[i];
                output +=
                    `<tr>
                        <td>${ref.name}</td>
                        <td>${ref.driverNo}</td>
                        <td>${ref.phone}</td>
                        <td>${ref.expiry}</td>
                        <td>
                            <a class='editSup' id=${ref.supId}>Edit</a>
                            <a class='deleteSup' id=${ref.supId}>Delete</a>
                        </td>
                    </tr>`;
            }
            $('#allSupervisors').html(output).enhanceWithin();

            //Edit & delete using the 'id' of the anchor tag that was clicked (the primary key of supervisor)
            $('.editSup').on('click', function() {
                $('#supId').val($(this).attr('id'));

                selectRecords("tblsup", "*", (res) => {
                    //Find the record & prefill form
                    var len = res.rows.length;
                    for (var i = 0; i < len; i++) {
                        var ref = res.rows[i];
                        if (ref.supId == $('#supId').val()) {
                            $('#txtSupName').val(ref.name);
                            $('#numSupPh').val(ref.phone);
                            $('#numSupNo').val(ref.driverNo);
                            $('#dateLicEx').val(ref.expiry);
                            $('#sig').signature('draw', ref.sig);
                            $.mobile.changePage("#page7");
                        }
                    }
                });
            });

            $('.deleteSup').on('click', function() {
                if (confirm("Are you sure you want to delete this supervisor?")) {
                    deleteRecord("tblsup", "supId", $(this).attr('id'));
                    goMenuPage();
                }
            });

        });
        $.mobile.changePage("#page6");
    });


    //Statistics Page
    $('.grid-2:eq(1)').on('click', function() {
        $.mobile.changePage("#page9");
        showStats();
    });
    $('.page9').on('click', function() {
        $.mobile.changePage("#page9");
        showStats();
    });
    //Show all stats
    $('.page9-stats').on('click', function() {
        selectRecords('tbllogs', '*', (res) => {
            //callback
            var output = `  
                <tr>
                    <th>Date</th>
                    <th>Hours Driven</th>
                    <th>Supervisor</th>
                    <th></th>
                </tr>`;
            var len = res.rows.length;
            for (var i = 0; i < len; i++) {
                var ref = res.rows[i];
                output +=
                    `<tr>
                            <td>${ref.logDate}</td>
                            <td>${ref.totalTime}</td>
                            <td>${ref.supName}</td>
                            <td>
                                <a class='moreSess' id=${ref.logid}>More</a>
                            </td>
                        </tr>`;
            }
            $('#allStats').html(output).enhanceWithin();
            $('.moreSess').on('click', function() {
                showAllDets($(this).attr('id'));
                $('.deleteSess').on('click', function() {
                    if (confirm("Are you sure you want to delete this record?")) {
                        deleteRecord('tbllogs', 'logid', $('#sesskey').html());
                        goMenuPage();
                    }
                });
            });
        });
        $.mobile.changePage("#page9-stats");
    });


    //Add Supervisor
    $('.add-sup').on('click', function() {
        //Reset hidden text box val from prev supervisor primary key to nothing
        $('#supId').val('false');
        //Reset the rest of the forms
        $('#txtSupName').val('');
        $('#numSupPh').val('');
        $('#numSupNo').val('');
        $('#dateLicEx').val('');
        $('#sig').signature('clear');
        $.mobile.changePage("#page7");
    });
    //Validate Supervisor
    $('.validate-sup').on('click', function() {
        validateSup();
    });
    //Settings Page
    $('#settingsBtn').on('click', function() {
        selectRecords('tbllrner', '*', (res) => {
            $('#numTotalHrs').val(res.rows[0].totalHrs);
            $('#dateRecPermit').val(res.rows[0].recPerm);
            if (res.rows[0].under21 == 0) {
                $('#notU21').addClass('btnGrpRadSelected').enhanceWithin();
                $('#isu21').removeClass('btnGrpRadSelected');
            } else {
                $('#isu21').addClass('btnGrpRadSelected');
                $('#notU21').removeClass('btnGrpRadSelected');
            }
            $.mobile.changePage("#page8");
        });

        //Save & Update settings
        $('.save-settings').on('click', function() {
            var startingHrs = $('#numTotalHrs').val();
            var recPerm = $('#dateRecPermit').val();
            var u21 = 0;

            if ($('#isu21').hasClass('btnGrpRadSelected'))
                u21 = 1;

            var columns = ['totalHrs', 'recPerm', 'under21'];
            var record = [startingHrs, recPerm, u21, '1'];

            updateRecord('tbllrner', columns, record, 'lrnerid');
            goMenuPage();
        });
    });

});

//Display all details about the session
function showAllDets(id) {
    console.log(id);
    $('#allSessInfo').html("").enhanceWithin();
    selectRecords('tbllogs', '*', (res) => {
                var len = res.rows.length;
                for (var i = 0; i < len; i++) {
                    var ref = res.rows[i];
                    if (ref.logid == id) {
                        var moreOutput = `
                <tr>
                    <th>Date:</th>
                    <th>${ref.logDate} ${ref.logStartTime}</th>
                </tr>
                <tr><td>Log ID</td><td id='sesskey'>${ref.logid}</td></tr>
                <tr><td>Time Ended</td><td>${ref.logEndTime}</td></tr>
                <tr><td>Night Driving</td><td>${ref.nightDrivingMins} mins</td></tr>
                <tr><td>Total Hrs</td><td>${ref.totalTime}</td></tr>
                <tr><td>Distance KM</td><td>${ref.totalKms}</td></tr>
                <tr><td>Car Rego</td><td>${ref.carRego}</td></tr>
                <tr><td>Parking</td><td>${ref.parking == 0 ? `No` : `Yes`}</td></tr>
                <tr><td>Weather</td><td>${ref.weather}</td></tr>
                <tr><td>Light</td><td>${ref.light}</td></tr>
                <tr><td>Road</td><td>${ref.roadType}</td></tr>
                <tr><td>Supervisor</td><td>${ref.supName}</td></tr>
                `;
                $('#allSessInfo').html(moreOutput).enhanceWithin();
            } else {
                //alert("Record Not Found!");
            }
        }
    });
    $.mobile.changePage('#moreSess');
}

function savePreqs(hrs, dateRecieved, datePlanned, under21) {
    var arrPreqs = [hrs, dateRecieved, datePlanned, under21];
    try {
        localStorage.setItem('learnerPreqs', JSON.stringify(arrPreqs));
    } catch(e) {
        
    }
}

function goMenuPage() {
    selectRecords('tbllogs','*',(res)=>{
        var len = res.rows.length;
        var totalHrs = 0;
        var totalNightHrs = 0;
        for(var i = 0; i < len; i++) {
            var ref = res.rows[i];
            totalHrs += parseInt(ref.totalTime) - parseInt(ref.nightDrivingMins / 60);
            totalNightHrs += parseInt(ref.nightDrivingMins / 60);
        }
        selectRecords('tbllrner','*',(res)=>{
            var ref = res.rows[0];
            totalHrs += ref.totalHrs;
            $('.progBar').LineProgressbar({
                percentage: totalHrs,
                fillBackgroundColor: '#E0C341',
                backgroundColor: '#EEEEEE',
                radius: '0px',
                height: '10px',
                width: '100%'
            });
        });
    });

    $.mobile.changePage("#page2");
}

function startSess() {
    $.mobile.changePage("#page-sess2");
}

//Validate new inputs here
function stopSession() {
    $('.currSess-btns').css('display', 'none');
    $('.currSess-hidden').css('display', 'block');
}

function confirmPage(manualAuto) {
    var sessDate, sessStartTime, sessEndTime, sessTimeNight, sessDist, sessCarRego, timeStartHr, timeEndHr,
        sessTotalTime, sessParking, sessTraffic, sessWeather, sessRoadTypes, sessLight, sessCarRego, sessSuper, supName, record;

    var columns = ['logDate', 'logStartTime', 'logEndTime', 'nightDrivingMins', 'totalTime', 'totalKms', 'carRego', 'parking', 'weather', 'light', 'traffic', 'roadType', 'supName'];

    if (manualAuto === "manual") {
        /*First page*/
        timeStartHr = $('#select-hrManTime-start').find(":selected").text();
        if ($('#select-pmamManTime-start').find(":selected").text() == "PM") {
            timeStartHr = parseInt(timeStartHr) + 12;
        }
        timeEndHr = $('#select-hrManTime-end').find(":selected").text();
        if ($('#select-pmamManTime-end').find(":selected").text() == "PM") {
            timeEndHr = parseInt(timeEndHr) + 12;
        }
        sessStartTime = timeStartHr + ":" + $('#select-minManTime-start').find(":selected").text();
        sessEndTime = timeEndHr + ":" + $('#select-minManTime-end').find(":selected").text();
        sessTimeNight = $("#numManNightMins").val();
        sessDate = $("#dateManSess").val();
        sessDist = $("#numManOdoEnd").val() - $("#numManOdoStart").val();
        sessCarRego = $("#txtManRego").val();

        /*Second Page*/
        sessParking = "did";
        if ($('#manParking').hasClass('btnGrpRadSelected'))
            sessParking = "did not";
        sessWeather = "Wet";
        if ($('#manDry').hasClass('btnGrpRadSelected'))
            sessWeather = "Dry";

        sessLight = "Dawn/Dusk";
        if ($('#manDay').hasClass('btnGrpRadSelected'))
            sessLight = "Day";
        else if ($('#manNight').hasClass('btnGrpRadSelected'))
            sessLight = 'Night';

        sessTraffic = "Light";
        if ($('#manMod').hasClass('btnGrpRadSelected'))
            sessTraffic = "Moderate";
        else if ($('#manHeavy').hasClass('btnGrpRadSelected'))
            sessTraffic = 'Heavy';

        sessRoadTypes = "";
        $('#select-manSessRoad option:selected').each(function() {
            sessRoadTypes += $(this).html() + " ";
        });
        sessSuper = $('#select-manSessSuper option:selected').html();
    } else {
        //Auto Sess,
        //getAllTheData();
        sessDate = $("#dateManSess").val();
        sessStartTime = $("#select-hrManTime-start").val() + ":" + $("#select-minManTime-start").val() + $("#select-pmamManTime-start").val();
        sessEndTime = $("#select-hrManTime-end").val() + ":" + $("#select-minManTime-end").val() + $("#select-pmamManTime-end").val();
        sessTimeNight = $("#numManNightMins").val();
        sessDist = $("#numManOdoEnd").val() - $("#numManOdStart").val();
        sessCarRego = $("#txtManRego").val();
    }

    //Add values to confirm page (Page5)
    sessTotalTime = (toSeconds(sessEndTime) - toSeconds(sessStartTime)) / 60;
    $('.sessDate').html(sessDate);
    $('.sessStartTime').html(sessStartTime);
    $('.sessEndTime').html(sessEndTime);
    $('.sessTotalTime').html(sessTotalTime);
    $('.sessTimeNight').html(sessTimeNight);
    $('.sessDist').html(sessDist);
    $('.sessParking').html(sessParking);
    $('.sessTraffic').html(sessTraffic);
    $('.sessWeather').html(sessWeather);
    $('.sessRoadTypes').html(sessRoadTypes);
    $('.sessLight').html(sessLight);
    $('.sessCarRego').html(sessCarRego);
    $('.sessSuper').html(sessSuper);

    sessParking === 'did' ? sessParking = 1 : sessParking = 0;
    supName = $('#select-manSessSuper option:selected').html();

    //Add confirmed values to records array
    record = [sessDate, sessStartTime, sessEndTime, sessTimeNight, sessTotalTime / 60, sessDist, sessCarRego, sessParking, sessWeather, sessLight, sessTraffic, sessRoadTypes, supName];
    $.mobile.changePage("#page5");

    $('#addEntry').on('click', function() {
        //Entry has been confirmed, now to insert record
        insertRecord('tbllogs', columns, record);
        //Update total hrs done
        var currHours = 0;
        selectRecords('tbllrner','totalHrs',(res)=> {
                currHours = res;
                updateRecord('tbllrner',['totalHrs'],['1',(currHours + (sessTotalTime / 60))], '1');
            });
            goMenuPage();
            $("#popup-entrySaved").popup({
                transition: "pop"
            });
            $("#popup-entrySaved").popup("open");
            setTimeout(function() { $("#popup-entrySaved").popup("close"); }, 2000);
        });
}

function showStats() {
    var totalHrs = 0;
    var totalNightHrs = 0;
    var totalDist = 0;

    selectRecords('tbllogs','*',(res)=>{
        var len = res.rows.length;
        for(var i = 0; i < len; i++) {
            var ref = res.rows[i];
            totalHrs += parseInt(ref.totalTime) - parseInt(ref.nightDrivingMins / 60);
            totalNightHrs += parseInt(ref.nightDrivingMins / 60);
            totalDist += parseInt(ref.totalKms);
        }
        selectRecords('tbllrner','*',(res)=>{
            var ref = res.rows[0];
            totalHrs += ref.totalHrs;
            //Gauges
            //Total Hours driven
            var gauge = new FlexGauge({
                appendTo: '#tHoursGauge',
                dialValue: totalHrs,
                dialUnit: "%",
                dialUnitPosition: "after",
                dialLabel: "Hours Done",
                colorArcFg: '#009900',
                colorArcBg: '#4cff4c'
            });
            var gauge = new FlexGauge({
                appendTo: '#tHoursNigGauge',
                dialValue: totalNightHrs,
                dialUnit: "%",
                dialUnitPosition: "after",
                dialLabel: "Night Hours",
                colorArcFg: 'black',
                colorArcBg: 'white'
            });
            var gauge = new FlexGauge({
                appendTo: '#tKmGauge',
                dialValue: true,
                dialUnit: "km",
                arcFillPercent: totalDist / 100,
                arcAngleStart: .01,
                arcAngleEnd: 2.4,
                arcStrokeFg: 15,
                arcStrokeBg: 30,
                animateSpeed: 5,
                dialLabel: "KMs Traveled",
            });
        });
    });
}
//Returns a time string converted to seconds
function toSeconds(t) {
    var bits = t.split(':');
    return bits[0] * 3600 + bits[1] * 60;
}