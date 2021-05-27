function reset(){
  $('.showing-image').html('');
  $("#barcode-scan").focus();
}
function ajaxtouser(barcodeValue, numofitem, category){
  var url = '';
  if(category == 'Student'){
    var url = 'ajax_php/a.studentinfo.php';
  } else {
    var url = 'ajax_php/a.staffinfo.php';
  }
  $.ajax({
    url: url,
    type: 'POST',
    dataType: "json",
    data: {
      "barcodeValue" : barcodeValue
    },
    success: function(response) {
      if (response.result == 0) {
        reset();
      } else {
        var imgsrc = '';
        var img = '';
        var mainName = '';
        var engName = '';
        var currenttime = response[0].currenttime;
        var currentdate = response[0].currentdate;
        if(currenttime.charAt(0) == 0){
           currenttime = currenttime.substr(1);
        }
        var halls = '';
        var uValue;
        var num = $('#numofpic').val();
        $('#prev-barcode').val(barcodeValue);
        if(category == 'Student'){
          imgsrc = "https://asset.bodwell.edu/images/student/bhs"+response[0].StudentID+".jpg";
          img = "<img class='img-rounded' src='"+imgsrc+"'>";

          if(response[0].EnglishName !== '' && response[0].EnglishName !== response[0].FirstName){
            engName = ' ('+ response[0].EnglishName +')'
            mainName = response[0].EnglishName;
          } else {
            engName = '';
            mainName = response[0].FirstName;
          }
          if(response[0].Halls) {
            halls = ' | ' + response[0].Halls;
          } else {
            halls = '';
          }
          uValue = barcodeValue;
        } else {
          imgsrc = "https://asset.bodwell.edu/images/staff/"+barcodeValue+".jpg";
          img = "<img src='"+imgsrc+"'>";
          mainName = response[0].FirstName;
          engName = '';
          halls = '';
          uValue = response[0].PositionTitle;
        }
        var fnnumtxt = numtotext(numofitem);
        var nxtnum = parseInt(numofitem);
        if(numofitem < 5){
          $('.meal-message').html('Hi ' + response[0].FirstName + ', enjoy your meal today!');
          $('.mealcount-text span').html(nxtnum + fnnumtxt);
          $('.meal-message').removeClass('text-danger');
          $('.meal-message').addClass('text-success');
          $('.mealcount-img .material-icons').html('check');
          $('.mealcount-img .material-icons').css('color','#62bf34cc');
        } else {
          $('.mealcount-text span').html(nxtnum + fnnumtxt);
          $('.meal-message').html('You will be charged $6 for this meal!');
          $('.meal-message').removeClass('text-success');
          $('.meal-message').addClass('text-danger');
          $('.mealcount-img .material-icons').html('warning');
          $('.mealcount-img .material-icons').css('color','#e2e235cc');
        }


          // $('.img-content').html(img);
          $('.img-content img').attr("src", imgsrc);
          $('.span-firstname').html(response[0].FirstName);
          $('.span-lastname').html(response[0].LastName + ",");
          $('.span-englishname').html(engName);
          $('.span-time').html(currenttime + ', ');
          $('.span-date').html(currentdate);
          $('.span-halls').html(halls);
          $('.span-userid').html(uValue);


          texttospeech(mainName, numofitem);
        // it will be open soon
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("ajax error : " + textStatus + "\n" + errorThrown);
    }
  });
}


function ajaxtoaddrow(barcodeValue){
  console.log('add');
  var locationID = $('#locationID').val();
  $.ajax({
    url: 'ajax_php/a.addPersonRow.php',
    type: 'POST',
    dataType: "json",
    data: {
      "barcodeValue" : barcodeValue
    },
    success: function(response) {
      if(response[0].result == 1){
        ajaxtouser(barcodeValue, response[0].num, response[0].category);
      } else {
        reset();
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("ajax error : " + textStatus + "\n" + errorThrown);
      reset();
    }
  });
}

function texttospeech(text, numofitem){
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[2];
    msg.rate = 24 / 10;
    msg.pitch = 1;
    var numtotext = '';
    if(numofitem == 1) {
      numtotext = 'first';
    } else if (numofitem == 2) {
      numtotext = 'second';
    } else if (numofitem == 3) {
      numtotext = 'third';
    } else if (numofitem == 4) {
      numtotext = 'fourth';
    } else if (numofitem == 5) {
      numtotext = 'fifth';
    } else {
      numtotext = 'more than fifth';
    }
    var extraMsg = "This is your "+ numtotext +" meal";
    msg.text = text + extraMsg;

    msg.onend = function(e) {
      console.log('Finished in ' + event.elapsedTime + ' seconds.');

    };

    speechSynthesis.speak(msg);
}

function checkFullPageBackgroundImage(){
   $page = $('.full-page');
   image_src = $page.data('image');

   if(image_src !== undefined){
       image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
       $page.append(image_container);
   }
}

function numtotext(num) {
  var numtxt = '';
  if(num == 1) {
    numtxt = 'st';
  } else if (num == 2) {
    numtxt = 'nd';
  } else if (num == 3) {
    numtxt = 'rd';
  } else {
    numtxt = 'th';
  }

  return numtxt;

}
