$(document).ready(function() {
  var countries = new Array("Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", "Morocco", "Monaco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino", " Sao Tome", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe");

  $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function (data) { 
    $('input.intl-country-name').filter(function(){return !this.value;}).val(data.geoplugin_countryName);
    $('select.intl-country-name').val(data.geoplugin_countryName);
    $('.intl-region-name').filter(function(){return !this.value;}).val(data.geoplugin_regionName);
    $('.intl-city').filter(function(){return !this.value;}).val(data.geoplugin_city);
  });

  $('input.intl-country-name').each(function(){
    var select = $('<select></select>').insertAfter($(this));
    var attributes = $(this).prop("attributes");
    attributes.removeNamedItem('type');

    // Copy attributes
    $.each(attributes, function() {
      select.attr(this.name, this.value);
    });

    $.each(countries, function(index, country){
      select.append("<option value='"+country+"'>"+country+"</option>");
    });
    select.val($(this).val());
    $(this).remove();
  });

  $('.intl-country-name').change(function(){
    if($(this).val() == 'US' || $(this).val() == 'United States') {
      $(this).parents('form').find('.intl-postal-code-text, .intl-zip-code-text').text('Zip code');
      $(this).parents('form').find('input.intl-postal-code, input.intl-zip-code').attr('placeholder', 'Zip code');
    } else {
      $(this).parents('form').find('.intl-postal-code-text, .intl-zip-code-text').text('Postal code');
      $(this).parents('form').find('input.intl-postal-code, input.intl-zip-code').attr('placeholder', 'Postal code');
    }
  }).trigger('change');

  // $('.intl-city').each(function(){
  //   var cityField = $(this);

  //   cityField.autocomplete({
  //     source: function (request, response) {
  //         jQuery.getJSON(
  //             "http://gd.geobytes.com/AutoCompleteCity?callback=?&q=" + request.term,
  //             function (data) {
  //                 response(data);
  //             }
  //         );
  //     },
  //     minLength: 3,
  //     select: function (event, ui) {
  //         jQuery.getJSON(
  //             "http://gd.geobytes.com/GetCityDetails?callback=?&fqcn=" + ui.item.value,
  //             function (data) {
  //               cityField.val(data.geobytescity);
  //               cityField.parents('form').find('.intl-region-name').val(data.geobytesregion);
  //               cityField.parents('form').find('.intl-country-name').val(data.geobytescountry);
  //             }
  //         );
  //         return false;
  //     },
  //     focus: function() {
  //         // prevent value inserted on focus
  //         return false;
  //     },
  //   }).autocomplete("option", "delay", 100);
  // });

  $('.intl-address1').each(function(){
    var input = this;
    var autocomplete = new google.maps.places.Autocomplete(this, { types: ['geocode'] });

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      var place = autocomplete.getPlace();

      console.log(place);
      var city = $.grep(place.address_components, function(e){return e.types[0]=='locality'})[0];
      if(!city)
        city = $.grep(place.address_components, function(e){return e.types[0]=='administrative_area_level_2'})[0];
      var region = $.grep(place.address_components, function(e){return e.types[0]=='administrative_area_level_1'})[0];
      var country = $.grep(place.address_components, function(e){return e.types[0]=='country'})[0];


      $(input).val('');
      if(city)
        $(input).parents('form').find('.intl-city').val(city.long_name);
      $(input).parents('form').find('.intl-region-name').val(region.long_name);
      $(input).parents('form').find('.intl-country-name').val(country.long_name).trigger('change');
    });
  });
});
