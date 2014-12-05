/*

  This is a JavaScript bookmarklet that fills in forms with dummy data for you.

  Written by KRUSH.

  To use it:

  1. Minify all the JavaScript onto one line using http://jscompress.com/
      - Note that the one line of JavaScript must start with "javascript:"
  2. Bookmark any page in you browser
  3. Edit the bookmar and set the URL to the one line of minified javascript
  4. When on an Optimizely page click the bookmark and boom!

*/
javascript: (function(window, document, $) {
    var firstName,
        lastName,
        phone,
        email,
        date,
        timestamp,
        website,
        title,
        company,
        pword;
    firstName = 'kyle';
    lastName = 'rush test';
    phone = '7146860883';
    pword = 'ks93+-93KLI';
    date = new Date();
    timestamp = date.getFullYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
    email = firstName + '+test' + timestamp + '@optimizely.com';
    website = 'kylerush.net';
    title = 'Head of Optimization';
    company = "Optimizely";
    //populate name fields
    $('[name="first_name"]').val(firstName);
    $('[name="last_name"]').val(lastName);
    $('[name="name"]').val(firstName + ' ' + lastName);
    //populate company fields
    $('[name="company_name"]').val(company);
    //populate title fields
    $('[name="title"]').val(title);
    //populate email fields
    $('[name="email_address"]').val(email);
    $('[name="email"]').val(email);
    //populate phone fields
    $('[name="phone_number"]').val(phone);
    //populate website/url fields
    $('[name="website"]').val(website);
    $('[name="url-input"]').val(website);
    //populate pword fields
    $('[name="password"]').val(pword);
    $('[name="password1"]').val(pword);
    $('[name="password2"]').val(pword);
})(window, document, jQuery);
