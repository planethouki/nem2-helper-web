
$(`.topnav a[href="${location.pathname}"]`).each(function() {
    if (!$(this).hasClass("brand")) {
        $(this).addClass("active")
    }
});