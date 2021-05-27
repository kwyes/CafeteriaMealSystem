var t;

function reset() {
  $(".showing-image").html("");
  $("#barcode-scan").focus();
}

function ajaxtouser(barcodeValue) {
  $(".scan-page").css("display", "block");
  $(".welcome-page").css("display", "none");
  stopTime(t);
  var url = "";
  var firstCharBarcode = barcodeValue.charAt(0);

  if (!isNaN(firstCharBarcode)) {
    var url = "ajax_php/a.studentinfo.php";
  } else {
    var url = "ajax_php/a.staffinfo.php";
  }
  $.ajax({
    url: url,
    type: "POST",
    dataType: "json",
    cache: false,
    data: {
      barcodeValue: barcodeValue
    },
    success: function (response) {
      if (response.result == 0) {
        reset();
      } else {
        console.log(response);
        var numofitem = response[0].NumberOfMeal;
        var imgsrc = "";
        var img = "";
        var mainName = "";
        var engName = "";
        var currenttime = response[0].currenttime;
        var currentdate = response[0].currentdate;
        if (currenttime.charAt(0) == 0) {
          currenttime = currenttime.substr(1);
        }
        var halls = "";
        var uValue;
        var subCategory;
        var subCategoryTxt;
        var frameColor;
        var numChk;
        var mealCountImg;
        var mealCountImgColor;
        var mealMessage;
        var mealAmount;
        var mealStatus;
        var noneChargeDollar = 0.0;
        var chargeDollar = 6.0;
        var voiceChk;
        var addChk;
        var num = $("#numofpic").val();
        var fnnumtxt = numtotext(numofitem);
        var nxtnum = parseInt(numofitem);

        $("#prev-barcode").val(barcodeValue);

        // set value(name, id, hall, number of meals, etc) -> student, staff
        if (!isNaN(firstCharBarcode)) {
          imgsrc = "https://asset.bodwell.edu/OB4mpVpg/student/bhs" + response[0].StudentID + ".jpg";
          img = "<img class='img-rounded' src='" + imgsrc + "'>";

          if (response[0].EnglishName !== "" && response[0].EnglishName !== response[0].FirstName) {
            engName = " (" + response[0].EnglishName + ")";
            mainName = response[0].EnglishName;
          } else {
            engName = "";
            mainName = response[0].FirstName;
          }

          if (response[0].Halls) {
            halls = " | " + response[0].Halls;
          } else {
            halls = "";
          }

          uValue = barcodeValue;

          var HomestayChk = response[0].Homestay;
          var ResidenceChk = response[0].Residence;

          if (response[0].CurrentStudent == "N") {
            mealAmount = noneChargeDollar;
            mealStatus = "PRH";
            mealCountImg = "highlight_off";
            mealCountImgColor = "#e74c3c";
            voiceChk = "Y";
            mealMessage = '<h4 class="custom-h4">You Are Not Current Student. Please See Supervising Staff!</h4>';
            addChk = "N";
            subCategory = "ER";
            subCategoryTxt = "Error";
            frameColor = "#FFFFFF";
            numChk = "ZM";
          } else {
            if (HomestayChk == "Y" && ResidenceChk == "Y") {
              subCategory = "BH";
              subCategoryTxt = "Boarding";
              frameColor = "#27ae60";
              numChk = "FM";
            } else if (HomestayChk == "N" && ResidenceChk == "N") {
              subCategory = "DP";
              subCategoryTxt = "Day Program";
              frameColor = "#f1c40f";
              numChk = "ZM";
            } else if (HomestayChk == "Y" && ResidenceChk == "N") {
              subCategory = "HS";
              subCategoryTxt = "Homestay";
              frameColor = "#e74c3c";
              numChk = "OM";
            } else if (HomestayChk == "N" && ResidenceChk == "Y") {
              subCategory = "BD";
              subCategoryTxt = "Boarding";
              frameColor = "#27ae60";
              numChk = "FM";
            } else {
              subCategory = "ER";
              subCategoryTxt = "Error";
              frameColor = "#FFFFFF";
              numChk = "ZM";
            }

            if (numChk == "FM") {
              if (numofitem < 5) {
                mealAmount = noneChargeDollar;
                mealStatus = "ALW";
                mealCountImg = "check";
                mealCountImgColor = "#3fb0ac";
                voiceChk = "N";
                mealMessage = '<h4 class="custom-h4">' + "Hi " + mainName + "!" + " Enjoy your Meal!" + "</h4>";
              } else {
                mealAmount = chargeDollar;
                mealStatus = "CHG";
                mealCountImg = "priority_high";
                mealCountImgColor = "#f39c12";
                voiceChk = "A";
                // mealMessage = '<h4 class="custom-h4">'+'You will be charged $'+ chargeDollar +' for this meal!'+'</h4>';
                mealMessage = '<h4 class="custom-h4">' + "You have exceeded daily limit!" + "</h4>";
              }
            } else if (numChk == "OM") {
              if (timeChk() == "Y") {
                if (numofitem < 2) {
                  mealAmount = noneChargeDollar;
                  mealStatus = "ALW";
                  mealCountImg = "check";
                  mealCountImgColor = "#3fb0ac";
                  voiceChk = "N";
                  mealMessage = '<h4 class="custom-h4">' + "Hi " + mainName + "! " + " Enjoy your Meal!" + "</h4>";
                } else {
                  mealAmount = chargeDollar;
                  mealStatus = "CHG";
                  mealCountImg = "highlight_off";
                  mealCountImgColor = "#e74c3c";
                  voiceChk = "Y";
                  // mealMessage = '<h4 class="custom-h4">'+'You will be charged $'+ chargeDollar +' for this meal!'+'</h4>';
                  mealMessage = '<h4 class="custom-h4">Please See Supervising Staff!</h4>';
                }
              } else {
                mealAmount = noneChargeDollar;
                mealStatus = "PRH";
                mealCountImg = "highlight_off";
                mealCountImgColor = "#e74c3c";
                voiceChk = "Y";
                mealMessage = '<h4 class="custom-h4">Please See Supervising Staff!</h4>';
              }
            } else if (numChk == "ZM") {
              // if(timeChk() == 'Y'){
              //   mealAmount = chargeDollar;
              //   mealStatus = 'CHG';
              //   mealCountImg = 'priority_high';
              //   mealCountImgColor = '#f39c12';
              //   voiceChk = 'Y';
              //    mealMessage = '<h4 class="custom-h4">'+'You will be charged $'+ chargeDollar +' for this meal!'+'</h4>';
              //   mealMessage = '<h4 class="custom-h4">'+'You have exceeded daily limit!'+'</h4>';
              // } else {
              mealAmount = noneChargeDollar;
              mealStatus = "PRH";
              mealCountImg = "highlight_off";
              mealCountImgColor = "#e74c3c";
              voiceChk = "Y";
              mealMessage = '<h4 class="custom-h4">Please See Supervising Staff!</h4>';
              // }
            }
            addChk = "Y";
          }

          $(".mealcount-text span").html(nxtnum + fnnumtxt);
          $(".span-englishname").html(engName);
          $(".meal-message").html(mealMessage);
          $(".mealcount-img .material-icons").html(mealCountImg);
          $(".mealcount-img .material-icons").css("color", mealCountImgColor);
        } else {
          addChk = "Y";
          frameColor = "#7f8c8d";
          voiceChk = "N";
          mealAmount = chargeDollar;
          mealStatus = "CHG";
          barcodeValue = response[0].StaffID;
          var Department = response[0].Department;
          subCategoryTxt = "STAFF | " + Department;
          imgsrc = "https://asset.bodwell.edu/OB4mpVpg/staff/" + barcodeValue + ".jpg";
          img = "<img src='" + imgsrc + "'>";
          mainName = response[0].FirstName;
          engName = "";
          halls = "";
          uValue = response[0].PositionTitle;
          var FullPartChk = response[0].FullPart;
          if (FullPartChk == "F") {
            subCategory = "FT";
          } else if (FullPartChk == "P") {
            subCategory = "PT";
          } else {
            subCategory = "ER";
          }
          $(".span-englishname").html(engName);
          $(".meal-message").html('<h4 class="custom-h4">' + "Hi " + response[0].FirstName + "!" + " Enjoy your Meal!" + "</h4>");
          $(".mealcount-text span").html(nxtnum + fnnumtxt);
          // $('.meal-message').removeClass('text-danger');
          // $('.meal-message').addClass('text-success');
          $(".mealcount-img .material-icons").html("check");
          $(".mealcount-img .material-icons").css("color", "#3fb0ac");
        }

        $(".img-content img").attr("src", imgsrc);
        $(".span-firstname").html(response[0].FirstName);
        $(".span-lastname").html(response[0].LastName + ",");
        $(".span-time").html(currenttime);
        $(".span-date").html(currentdate);
        $(".span-halls").html(halls);
        $(".span-userid").html(subCategoryTxt);
        $(".cardcontent-left").css("background-color", frameColor);

        // add, speech part
        ajaxtoaddrow(barcodeValue, numofitem, subCategory, mealStatus, mealAmount);

        if (voiceChk == "Y") {
          // texttospeech(mainName, numofitem);
          beep("error");
        } else if (voiceChk == "A") {
          beep("warning");
        } else {
          beep("success");
        }
        // it will be open soon
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("ajax error : " + textStatus + "\n" + errorThrown);
      showSwal();
    }
  });
}

function ajaxtoaddrow(barcodeValue, numofitem, subCategory, mealStatus, mealAmount) {
  $.ajax({
    url: "ajax_php/a.addPersonRow.php",
    type: "POST",
    dataType: "json",
    data: {
      barcodeValue: barcodeValue,
      numofitem: numofitem,
      subCategory: subCategory,
      mealStatus: mealStatus,
      mealAmount: mealAmount
    },
    success: function (response) {
      console.log("add");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("ajax error : " + textStatus + "\n" + errorThrown);
      showSwal();
      reset();
    }
  });
}

function texttospeech(text, numofitem) {
  var msg = new SpeechSynthesisUtterance();
  var voices = window.speechSynthesis.getVoices();
  console.log(voices);

  // Second speechSynthesis call
  voices = window.speechSynthesis.getVoices();
  // console.log(voices);
  // msg.voice = voices[$('#voices').val()];
  msg.voice = voices[1];
  msg.rate = 24 / 10;
  msg.pitch = 1;
  var NumTxt = "";
  if (numofitem < 6) {
    NumTxt = numofitem + numtotext(numofitem);
  } else {
    NumTxt = "more than fifth";
  }
  var extraMsg = "This is your " + NumTxt + " meal";
  // msg.text = text + extraMsg;
  msg.text = "Warning Warning";

  msg.onend = function (e) {
    console.log("Finished in " + event.elapsedTime + " seconds.");
  };
  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}

function checkFullPageBackgroundImage() {
  $page = $(".full-page");
  image_src = $page.data("image");

  if (image_src !== undefined) {
    image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>';
    $page.append(image_container);
  }
}

function numtotext(num) {
  var numtxt = "";
  if (num == 1) {
    numtxt = "st";
  } else if (num == 2) {
    numtxt = "nd";
  } else if (num == 3) {
    numtxt = "rd";
  } else {
    numtxt = "th";
  }

  return numtxt;
}

function timeChk() {
  var currentTime = new Date();
  var startTime = new Date();
  startTime.setHours(10);
  startTime.setMinutes(50);
  var endTime = new Date();
  endTime.setHours(13);
  endTime.setMinutes(15);
  if (findDate() !== "Sunday") {
    if (currentTime.getTime() > startTime.getTime() && currentTime.getTime() < endTime.getTime()) {
      return "Y";
    } else {
      return "N";
    }
  } else {
    return "N";
  }
}

function findDate() {
  var d = new Date();
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  var n = weekday[d.getDay()];
  return n;
}

function refocus(elm) {
  setTimeout(go, 0);

  function go() {
    elm.focus();
  }
}

function beep(type) {
  if (type == "success") {
    var snd = new Audio("sound/success.wav");
  } else if (type == "warning") {
    var snd = new Audio("sound/warning.wav");
  } else {
    var snd = new Audio("sound/error.wav");
  }

  snd.play();
}

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  var d = today.getDate();
  var day = today.getDay();
  var mo = today.getMonth();
  var week = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  var fullTime;
  m = checkTime(m);
  s = checkTime(s);
  if (h > 12) {
    fullTime = h - 12 + ":" + m + ":" + s + " PM";
  } else if (h == 12) {
    fullTime = h + ":" + m + ":" + s + " PM";
  } else {
    fullTime = h + ":" + m + ":" + s + " AM";
  }
  $(".welcome-span-time").html(fullTime);
  $(".welcome-span-date").html(week[day] + "<br />" + months[mo] + " " + d);
  t = setTimeout(startTime, 500);
  // console.log(fullTime);
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function stopTime() {
  clearTimeout(t);
}

function refreshAt(hours, minutes, seconds) {
  var now = new Date();
  var then = new Date();

  if (now.getHours() > hours || (now.getHours() == hours && now.getMinutes() > minutes) || (now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds)) {
    then.setDate(now.getDate() + 1);
  }
  then.setHours(hours);
  then.setMinutes(minutes);
  then.setSeconds(seconds);

  var timeout = then.getTime() - now.getTime();
  setTimeout(function () {
    window.location.reload(true);
  }, timeout);
}

function showSwal() {
  swal({title: "Something went wrong!", text: "Please contact IT", type: "warning", buttonsStyling: false, confirmButtonClass: "btn btn-info"}).catch(swal.noop);
}
