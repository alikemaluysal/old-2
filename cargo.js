;(function($) {

    Cargo = {

        configFile: 'https://www.altanmekatronik.com/dosya/config.json',
        note: '',
        length: '',
        cargo: localStorage.getItem('cargo') == null ? 0 : localStorage.getItem('cargo'),

        init: function() {
            let self = this;
            self.loadConfig();
            self.eventListener();
        },

        loadConfig: function() {
            let self = this;
            if(window.location.href.indexOf('/sepet') > -1 || window.location.href.indexOf('/step2') > -1) {
                $.getJSON(self.configFile, function(response) {
                    self.note = response.note;
                    self.length = response.length;
                    if(window.location.href.indexOf('/sepet') > -1) {
                        self.cargoConfig();
                    }
                    else {
                        self.hideCargo();
                    }
                });
            }
        },

        cargoConfig: function() {
            let self = this;
            let found = 0;
            $(".collapse-content").each(function() {
                if($(this).find("li:contains('Uzunluk (mm) :')").length) {
                    let l = parseFloat($(this).find("li:contains('Uzunluk (mm) :') span").text());
                    if(l > self.length) {
                        found = 1;
                    }
                }
            });
            if(found == 0) {
                localStorage.removeItem('cargo');
            }
            else {
                localStorage.setItem('cargo', 1);
            }
        },

        hideCargo: function() {
            let self = this;
            if(window.location.href.indexOf('/step2') > -1) {
                if(self.cargo == 0) {
                    $("#shippingCompanyId_12").closest('li').hide();
                    $("#shippingCompanyId_2")[0].checked = true;
                }
                else {
                    $("#shippingCompanyId_2").closest('li').hide();
                    $("#shippingCompanyId_12")[0].checked = true;
                }
            }
        },

        eventListener: function() {
            let self = this;
            $(document).on("DOMNodeRemoved", ".loading-bar", function() {
                self.hideCargo();
                if(window.location.href.indexOf('/sepet') > -1) {
                    self.cargoConfig();
                }
            });
            if(window.location.href.indexOf('/step2') > -1) {
                $(document).off('click','[data-selector="submit-button"]').on('click','[data-selector="submit-button"]',function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if(self.cargo == 1) {
                        let elem = $(this);
                        $(this).attr("disabled", false).removeClass("btn-loading");
                        Swal.fire({
                            title: "Bilgilendirme", 
                            html: self.note, 
                            icon: "info",
                            showCancelButton: false,
                            confirmButtonText: 'Tamam'
                        }).then((result) => {
                            IdeaApp.order.step2.submitStep2Form(elem);
                        });
                    }
                    else {
                        IdeaApp.order.step2.submitStep2Form($(this));
                    }
                });
            }
        }

    }

})(jQuery);

$(function() {
    Cargo.init();
});