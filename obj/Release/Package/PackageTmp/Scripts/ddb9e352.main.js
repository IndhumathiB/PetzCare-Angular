var app = function () {
    $(function () {
        a(), b(), c(), d(), e(), profileToggle(), widgetToggle(), f(), g(), tooltips(), switcheryToggle(), fullscreenWidget(), fullscreenMode()
    });
    var a = function () {
        $(".config-link").click(function () {
            $(this).hasClass("open") ? ($("#config").animate({
                right: "-205px"
            }, 150), $(this).removeClass("open").addClass("closed")) : ($("#config").animate({
                right: "0px"
            }, 150), $(this).removeClass("closed").addClass("open"))
        })
    }, b = function () {
        $(".theme-style-wrapper").click(function () {
            $("#main-wrapper").attr("class", "");
            var a = $(this).data("theme");
            $("#main-wrapper").addClass(a)
        })
    }, c = function () {
        $("#toggle-right").on("click", function () {
            $("#sidebar-right").toggleClass("sidebar-right-open"), $("#toggle-right .fa").toggleClass("fa-indent fa-dedent")
        })
    }, d = function () {
        $("#toggle-left").on("click", function () {
            var a = $("#main-wrapper");
            $(window).width() > 767 ? $(a).toggleClass("sidebar-mini") : $(a).toggleClass("sidebar-opened")
        })
    }, e = function () {
        var a = $(".sidebar .nav");
        $(a).navgoco({
            caretHtml: !1,
            accordion: !0
        })
    }, f = function () {
        $(".actions > .fa-times").click(function () {
            $(this).parent().parent().parent().fadeOut()
        })
    }, g = function () {
        $(".actions > .fa-cog").click(function () {
            $(this).closest(".flip-wrapper").toggleClass("flipped")
        })
    }
}();
