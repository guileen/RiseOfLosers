!function($) {

  function Renderer($element, options) {
    this.$element = $element
    this.html = this.$element.html();
    this.settings = $.extend({}, $.fn.render.defaults, options);
    this.$htmls = [];
  }

  Renderer.prototype = {
    render: function (ctx, options) {
      var settings = $.extend({}, this.settings, options);

      if(settings.flush) {
        this.flush();
      }

      if(!ctx) return;

      var $html = $(settings.engine(this.html, ctx));
      if(this.settings.hide) {
        $html.hide();
      }
      $html.insertBefore(this.$element);
      this.$htmls.push($html);
      return $html;
    }
  , flush: function() {
      $.each(this.$htmls, function(index, $html) {
          $html.remove();
      })
    }
  }

  function replaceTemplate (html, ctx) {
    for(var name in ctx) {
      html = html.replace(new RegExp('{\s*' + name + '\s*}', 'g'), ctx[name])
    }
    return html;
  }

  /**
   * options:
   *    engine:
   *    hide:
   *    flush:
   *
   */
  $.fn.render = function(ctx, options) {
    var data = this.data('render');

    if(ctx === 'flush') {
      if(data) data.flush();
      return;
    }

    if(!data) {
      this.data('render', (data = new Renderer(this, options)));
    }
    return data.render(ctx, options);
  }

  $.fn.render.defaults = {
    engine: replaceTemplate
  , hide: true
  , flush: false
  }

}( window.jQuery )
