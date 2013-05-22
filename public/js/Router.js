(function($) {
 // router
  window.BackboneTunes = Backbone.Router.extend({
    routes: {
      '': 'home',
      'blank': 'blank'
    },

    initialize: function() {
      this.playlistView = new PlaylistView({
        collection:  window.player.playlist,
        player:     window.player,
        library:    window.library
      });

      this.libraryView = new LibraryView({
        collection: window.library
      });
    },

    home: function() {
      var $container = $('#container');
      $container.empty();
      $container.append(this.playlistView.render().el)
      $container.append(this.libraryView.render().el);
    },

    blank: function() {
      $('#container').empty();
      $('#container').text('blank');
    }
  });

  $(function(){
    window.App = new BackboneTunes();
    Backbone.history.start();
  });
})(jQuery);
