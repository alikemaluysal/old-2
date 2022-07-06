//Merhaba
(function($){

    let uuidv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }

    let setInputFilter = (textbox, inputFilter) => {
        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
          textbox.on(event, function() {
            if (inputFilter(this.value)) {
              this.oldValue = this.value;
              this.oldSelectionStart = this.selectionStart;
              this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
              this.value = this.oldValue;
              this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
              this.value = "";
            }
          });
        });
    };

    let getProductPrice = () => {
        let price = $(".product-right .product-price-container .product-price .product-price-old").text().replace(".", "").replace(",", ".").replace(" TL", "").trim();
        if($(".product-right .product-price-container .product-price .product-price-new").length > 0){
            price = $(".product-right .product-price-container .product-price .product-price-new").text().replace(".", "").replace(",", ".").replace(" TL", "").trim();
        }
        price = parseFloat(price);
        return price;
    }

    let calculate = (quantity, length) => {
        
        let result = 0;
        this.quantity = parseInt(quantity);
        this.length = parseInt(length);

        if(isNaN(this.quantity) || isNaN(this.length)){
            return false;
        }

        result = Math.floor(this.quantity * this.length /10);
        $(".product-right [data-selector='qty-wrapper'] [data-selector='qty']").val(result).trigger("change");
        $(".product-right [data-selector='add-to-cart']").attr("data-quantity", result);
        

    }

    let cartEdit = () => {

        $("#cart-items .cart-item").each((index, elem) => {

            if($(elem).find(".collapse-wrapper").length > 0){

                $(elem).find(".cart-item-quantity [data-selector='decrease-qty']").addClass("disabled");
                $(elem).find(".cart-item-quantity [data-selector='qty']").addClass("disabled");
                $(elem).find(".cart-item-quantity [data-selector='increase-qty']").addClass("disabled");

                $(elem).find(".collapse-wrapper").find("li").each((index2, elem2) => {

                    if($(elem2).is(":contains('Uniq Id')")){
                        $(elem2).addClass("d-none");
                        return false;
                    }

                });

            }

        });

    }

    $(document).ready(() => {

        if($(".product-customization-group[data-group-id='2']").length > 0){

            $(".product-right .product-cart-buttons .product-qty[data-selector='qty-wrapper'] [data-selector='decrease-qty']").addClass("disabled");
            $(".product-right .product-cart-buttons .product-qty[data-selector='qty-wrapper'] [data-selector='qty']").addClass("disabled");
            $(".product-right .product-cart-buttons .product-qty[data-selector='qty-wrapper'] [data-selector='increase-qty']").addClass("disabled");
            $(".product-customization-group[data-group-id='2']").find(".product-customization-field[data-field-id='4']").addClass("d-none");
            $(".product-right .quick-order-button[data-selector='add-to-cart']").removeAttr("data-selector").attr("style", "cursor: not-allowed !important;");


            $(".product-customization-group[data-group-id='2']").find(".product-customization-field[data-field-id='2'] input").attr("id", "quantity");
            $(".product-customization-group[data-group-id='2']").find(".product-customization-field[data-field-id='3'] input").attr("id", "length");
            $(".product-customization-group[data-group-id='2']").find(".product-customization-field[data-field-id='4'] input").addClass("disabled").attr("id", "uniqId");

            setInputFilter($(".product-customization-group[data-group-id='2'] #quantity"), function(value) {
                return /^\d*\.?\d*$/.test(value);
            });

            setInputFilter($(".product-customization-group[data-group-id='2'] #length"), function(value) {
                return /^\d*\.?\d*$/.test(value);
            });

            $(".product-right .product-cart-buttons").before(`<div class="alert alert-warning text-center" data-selector="ext-info" role="alert">
                Ürünün uzunluk ve adet bilgilerini yukarıdaki alana giriniz.
            </div>`);

        }

        if(window.location.href.indexOf("/sepet") !== -1){
            cartEdit();
        }

    });

    $(document).on("input", ".product-customization-group[data-group-id='2'] #quantity", (e) => {

        $(e.currentTarget).val((index, value) => {
            return value.replace('.', '');
        });

        calculate($(e.currentTarget).val(), $(e.currentTarget).parents(".product-customization-group:eq(0)").find("#length").val());

    });

    $(document).on("input", ".product-customization-group[data-group-id='2'] #length", (e) => {

        $(e.currentTarget).val((index, value) => {
            return value.replace('.', '');
        });

        if(parseInt($(e.currentTarget).val()) > 6000){
            $(e.currentTarget).val(6000).trigger("change");
        }
        
        calculate($(e.currentTarget).val(), $(e.currentTarget).parents(".product-customization-group:eq(0)").find("#quantity").val());

    });

    $(document).on("click", ".product-right [data-selector='add-to-cart']", () => {

        $(".product-customization-group[data-group-id='2']").find(".product-customization-field[data-field-id='4'] input").val(uuidv4()).trigger("change");

        let interval = setInterval(() => {
            
            if($("#cart-popup-container").length > 0){

                clearInterval(interval);
                cartEdit();

            }

        }, 100);

    });

    $(document).on("DOMNodeRemoved", ".loading-bar", () => {

        setTimeout(() => {
            cartEdit();
        }, 250);

    });

})(jQuery);