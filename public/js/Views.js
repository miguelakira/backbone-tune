(function($) {
 // view
  window.AlbumView = Backbone.View.extend({
    tagName: 'li',
    className: 'album',
    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.template = _.template($('#album-template').html());
    },

    render: function() {
      var renderedContent = this.template(this.model.toJSON());
      $(this.el).html(renderedContent);
      return this;
    }

  }) // view


  // view for collection of albums
  window.LibraryAlbumView = AlbumView.extend({
    events: {
      'click .queue.add': 'select' //listens to the click event and execute the select method
    },

    select: function() {
      this.collection.trigger('select', this.model); // triggers a custom select method and passes 'Album' model to it

    }
  });


  // view for library
  window.LibraryView = Backbone.View.extend ({
    tagName: 'section',
    className: 'library',

    initialize: function() {
      _.bindAll(this, 'render');
      this.template = _.template($('#library-template').html());
      this.collection.bind('reset', this.render);
    },

    render: function() {
      var $albums,
          collection = this.collection;

      $(this.el).html(this.template({}));
      $albums = this.$('.albums');
      collection.each(function(album) {
        var view = new LibraryAlbumView({
          model: album,
          collection: collection
        });
        $albums.append(view.render().el);
      });
      return this;
    }
  });


  // view for playlist
  window.PlaylistAlbumView  = AlbumView.extend({ })


  // playlistView uses the playlist collection, that extends from the albums collection, which uses the album model!
  window.PlaylistView = Backbone.View.extend({
    tagName: 'section',
    className: 'playlist',

    initialize: function() {
      _.bindAll(this, 'render', 'queueAlbum', 'renderAlbum'); // will always be called on the context of this object
      this.template = _.template($('#playlist-template').html());
      this.collection.bind('refresh', this.render);
      this.collection.bind('add', this.renderAlbum);
      console.log(this.collection);

      this.player = this.options.player;
      this.library = this.options.library;
      this.library.bind('select', this.queueAlbum);  // the select event has been bound from the libraryAlbumView


    },

    queueAlbum: function(album) {
      this.collection.add(album); // adds the Album model to it's own collection ('Playlist')
    },

    renderAlbum: function(album) {
      var view = new PlaylistAlbumView({
        model: album,
        player: this.player,
        playlist: this.collection
      });
      this.$('ul').append(view.render().el);
    },

    render: function() {
      $(this.el).html(this.template(this.player.toJSON()));

      this.$('button.play').toggle(this.player.isStopped());
      this.$('button.pause').toggle(this.player.isPlaying());

      return this;
    }
  });



})(jQuery);
